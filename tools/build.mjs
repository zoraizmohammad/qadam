import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stableFiles = new Set(['config.js', 'robots.txt', 'sitemap.xml', '.nojekyll']);
const externalUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

export function contactEndpoint(env = process.env) {
  const direct = (env.CONTACT_ENDPOINT || '').trim();
  const base = (env.SUPABASE_URL || '').trim();
  if (!direct && !base) return '';
  const url = new URL(direct || `${base.replace(/\/+$/, '')}/functions/v1/contact`);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password || url.hash || url.search) {
    throw new Error('The contact endpoint must be an HTTPS URL without credentials, a query, or a fragment (HTTP localhost is allowed for development).');
  }
  return url.href;
}

function digest(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function assetName(relative, content) {
  const parsed = path.posix.parse(relative.replace(/^assets\//, ''));
  return path.posix.join('assets', parsed.dir, `${parsed.name}.${digest(content)}${parsed.ext}`);
}

async function filesIn(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.') && entry.name !== '.nojekyll') continue;
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path.join(directory, entry.name), relative));
    else if (entry.isFile() && !/\.(?:md|map)$/i.test(entry.name)) files.push(relative);
  }
  return files;
}

async function replaceAsync(value, expression, replacer) {
  const matches = [...value.matchAll(expression)];
  const replacements = await Promise.all(matches.map(replacer));
  let index = 0;
  return value.replace(expression, () => replacements[index++]);
}

/** Build static files without a framework or a runtime dependency. */
export async function build({ sourceDir = path.join(projectDir, 'web'), outputDir = path.join(projectDir, 'dist'), env = process.env } = {}) {
  sourceDir = path.resolve(sourceDir);
  outputDir = path.resolve(outputDir);
  // Only replace a named dist folder next to its source. Never delete source or an arbitrary directory.
  if (path.basename(outputDir) !== 'dist' || path.dirname(outputDir) !== path.dirname(sourceDir) || outputDir === sourceDir) {
    throw new Error('Build output must be a dist directory beside the source directory.');
  }
  const outputState = await fs.lstat(outputDir).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (outputState?.isSymbolicLink()) throw new Error('Refusing to replace a symbolic-link output directory.');
  const endpoint = contactEndpoint(env);
  const inputFiles = await filesIn(sourceDir);
  if (!inputFiles.includes('index.html')) throw new Error('Source is missing index.html.');
  const inputSet = new Set(inputFiles);
  const outputs = new Map();
  const pending = new Map();
  const contents = new Map();

  async function reference(value, from, targetDirectory, trail) {
    if (!value || externalUrl.test(value)) return value;
    const match = value.match(/^([^?#]*)([?#].*)?$/);
    const relative = path.posix.normalize(value.startsWith('/') ? match[1].slice(1) : path.posix.join(path.posix.dirname(from), match[1]));
    if (relative === from || path.posix.extname(relative).toLowerCase() === '.html') return value;
    if (!inputSet.has(relative) && relative !== 'config.js') return value;
    const target = await compile(relative, trail);
    const rewritten = path.posix.relative(targetDirectory, target) || path.posix.basename(target);
    return rewritten + (match[2] || '');
  }

  async function cssReferences(value, from, targetDirectory, trail) {
    value = await replaceAsync(value, /url\(\s*(['"]?)([^'"\s)]+)\1\s*\)/gi, async match => {
      const updated = await reference(match[2], from, targetDirectory, trail);
      return `url(${match[1]}${updated}${match[1]})`;
    });
    return replaceAsync(value, /(@import\s+)(['"])([^'"]+)\2/gi, async match => `${match[1]}${match[2]}${await reference(match[3], from, targetDirectory, trail)}${match[2]}`);
  }

  async function compile(relative, trail = []) {
    if (trail.includes(relative)) throw new Error(`Circular asset reference: ${[...trail, relative].join(' -> ')}`);
    if (outputs.has(relative)) return outputs.get(relative);
    if (pending.has(relative)) return pending.get(relative);
    const job = (async () => {
      const nextTrail = [...trail, relative];
      let content;
      let output;
      if (relative === 'config.js') {
        content = `// Public configuration only. Never put a service-role key here.\nwindow.QADAM_CONFIG = ${JSON.stringify({ contactEndpoint: endpoint }).replaceAll('<', '\\u003c')};\n`;
        output = relative;
      } else {
        content = await fs.readFile(path.join(sourceDir, relative));
        const extension = path.posix.extname(relative).toLowerCase();
        if (extension === '.html') {
          output = relative;
          content = await replaceAsync(content.toString('utf8'), /\b(src|href|poster|content)=(['"])([^'"]+)\2/gi, async match => `${match[1]}=${match[2]}${await reference(match[3], relative, path.posix.dirname(output), nextTrail)}${match[2]}`);
          content = await replaceAsync(content, /\bsrcset=(['"])([^'"]+)\1/gi, async match => {
            if (/^data:/i.test(match[2])) return match[0];
            const candidates = await Promise.all(match[2].split(',').map(async candidate => {
              const [url, ...descriptor] = candidate.trim().split(/\s+/);
              return [await reference(url, relative, path.posix.dirname(output), nextTrail), ...descriptor].join(' ');
            }));
            return `srcset=${match[1]}${candidates.join(', ')}${match[1]}`;
          });
          content = await cssReferences(content, relative, path.posix.dirname(output), nextTrail);
        } else if (stableFiles.has(relative)) {
          output = relative;
        } else {
          if (extension === '.css') {
            const directory = path.posix.dirname(assetName(relative, ''));
            content = await cssReferences(content.toString('utf8'), relative, directory, nextTrail);
          }
          output = assetName(relative, content);
        }
      }
      if (contents.has(output)) throw new Error(`Asset output collision: ${output}`);
      contents.set(output, content);
      outputs.set(relative, output);
      return output;
    })();
    pending.set(relative, job);
    return job;
  }

  // Build the complete output in memory before replacing the previous build.
  for (const file of [...inputFiles, 'config.js']) await compile(file);
  const manifest = Object.fromEntries([...outputs].sort(([a], [b]) => a.localeCompare(b)));
  contents.set('asset-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  contents.set('.nojekyll', '');
  await fs.rm(outputDir, { recursive: true, force: true });
  for (const [file, content] of contents) {
    const destination = path.join(outputDir, file);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, content);
  }
  return { outputDir, manifest, files: contents.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = await build();
    console.log(`Built ${result.files} files in ${path.relative(process.cwd(), result.outputDir)}. Assets are fingerprinted for safe caching.`);
  } catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
  }
}
