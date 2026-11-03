import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build, contactEndpoint } from '../tools/build.mjs';

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'qadam-build-'));
  const sourceDir = path.join(root, 'web');
  const outputDir = path.join(root, 'dist');
  await fs.mkdir(path.join(sourceDir, 'styles'), { recursive: true });
  await fs.mkdir(path.join(sourceDir, 'assets'), { recursive: true });
  await fs.mkdir(path.join(sourceDir, 'pages'), { recursive: true });
  await fs.writeFile(path.join(sourceDir, 'index.html'), '<link rel="stylesheet" href="styles/main.css"><script src="config.js"></script><script src="app.js"></script><img src="assets/case.webp" srcset="assets/case.webp 1x, assets/case-large.webp 2x"><a href="#kit">Kit</a><a href="https://example.com/">External</a>');
  await fs.writeFile(path.join(sourceDir, 'pages', 'detail.html'), '<img src="../assets/case.webp?size=small#view"><a href="../index.html">Home</a>');
  await fs.writeFile(path.join(sourceDir, 'styles', 'main.css'), '@import "theme.css"; .case { background: url(\'../assets/case.webp\'); } .external { background: url("https://example.com/image.webp"); }');
  await fs.writeFile(path.join(sourceDir, 'styles', 'theme.css'), ':root { color: #15161b; }');
  await fs.writeFile(path.join(sourceDir, 'app.js'), 'console.log("Qadam");');
  await fs.writeFile(path.join(sourceDir, 'config.js'), 'window.QADAM_CONFIG = { contactEndpoint: "" };');
  await fs.writeFile(path.join(sourceDir, 'assets', 'case.webp'), 'image-v1');
  await fs.writeFile(path.join(sourceDir, 'assets', 'case-large.webp'), 'large-image-v1');
  await fs.writeFile(path.join(sourceDir, 'README.md'), 'Developer-only documentation.');
  t.after(async () => {
    // mkdtemp returned this exact, task-owned absolute directory.
    assert.equal(path.dirname(root), os.tmpdir());
    assert.match(path.basename(root), /^qadam-build-/);
    await fs.rm(root, { recursive: true, force: true });
  });
  return { sourceDir, outputDir, env: {} };
}

test('production build rewrites nested assets, CSS imports and responsive images while preserving subpaths', async t => {
  const options = await fixture(t);
  const { manifest } = await build(options);
  const html = await fs.readFile(path.join(options.outputDir, 'index.html'), 'utf8');
  const nestedHtml = await fs.readFile(path.join(options.outputDir, 'pages', 'detail.html'), 'utf8');
  const css = await fs.readFile(path.join(options.outputDir, manifest['styles/main.css']), 'utf8');
  assert.match(manifest['app.js'], /^assets\/app\.[a-f0-9]{12}\.js$/);
  assert.ok(html.includes(`href="${manifest['styles/main.css']}"`));
  assert.ok(html.includes(`src="${manifest['assets/case.webp']}"`));
  assert.ok(html.includes(`srcset="${manifest['assets/case.webp']} 1x, ${manifest['assets/case-large.webp']} 2x"`));
  assert.ok(nestedHtml.includes(`../${manifest['assets/case.webp']}?size=small#view`));
  assert.ok(nestedHtml.includes('href="../index.html"'));
  assert.ok(css.includes(`../${path.posix.basename(manifest['assets/case.webp'])}`));
  assert.ok(css.includes(path.posix.basename(manifest['styles/theme.css'])));
  assert.ok(css.includes('https://example.com/image.webp'));
  assert.ok(html.includes('href="#kit"'));
  assert.ok(html.includes('href="https://example.com/"'));
  assert.equal(manifest['config.js'], 'config.js');
  await assert.rejects(fs.access(path.join(options.outputDir, 'README.md')));
  await fs.access(path.join(options.outputDir, '.nojekyll'));
  const source = await fs.readFile(path.join(options.sourceDir, 'index.html'), 'utf8');
  assert.ok(source.includes('src="app.js"'), 'source files remain untouched');
});

test('changing an image invalidates its filename and dependent CSS, but keeps unrelated assets cached', async t => {
  const options = await fixture(t);
  const first = await build(options);
  await fs.writeFile(path.join(options.sourceDir, 'assets', 'case.webp'), 'image-v2');
  const second = await build(options);
  assert.notEqual(first.manifest['assets/case.webp'], second.manifest['assets/case.webp']);
  assert.notEqual(first.manifest['styles/main.css'], second.manifest['styles/main.css']);
  assert.equal(first.manifest['app.js'], second.manifest['app.js']);
  assert.equal(first.manifest['styles/theme.css'], second.manifest['styles/theme.css']);
  await assert.rejects(fs.access(path.join(options.outputDir, first.manifest['assets/case.webp'])));
});

test('public configuration contains the contact endpoint only, never server credentials', async t => {
  const options = await fixture(t);
  options.env = { SUPABASE_URL: 'https://project.supabase.co/', SUPABASE_SERVICE_ROLE_KEY: 'must-not-be-published' };
  await build(options);
  const config = await fs.readFile(path.join(options.outputDir, 'config.js'), 'utf8');
  assert.ok(config.includes('https://project.supabase.co/functions/v1/contact'));
  assert.ok(!config.includes('must-not-be-published'));
  assert.equal(contactEndpoint({ CONTACT_ENDPOINT: 'https://contact.example.com/submit', SUPABASE_URL: 'https://ignored.supabase.co' }), 'https://contact.example.com/submit');
  assert.equal(contactEndpoint({}), '');
  assert.equal(contactEndpoint({ CONTACT_ENDPOINT: 'http://127.0.0.1:54321/functions/v1/contact' }), 'http://127.0.0.1:54321/functions/v1/contact');
});

test('build rejects unsafe configuration or output paths before replacing a previous build', async t => {
  const options = await fixture(t);
  await build(options);
  for (const endpoint of ['http://example.com/contact', 'https://user:password@example.com/contact', 'https://example.com/contact?key=secret', 'javascript:alert(1)']) {
    await assert.rejects(build({ ...options, env: { CONTACT_ENDPOINT: endpoint } }));
  }
  await fs.access(path.join(options.outputDir, 'index.html'));
  await assert.rejects(build({ ...options, outputDir: options.sourceDir }), /Build output/);
  await assert.rejects(build({ ...options, outputDir: path.dirname(options.sourceDir) }), /Build output/);
});

test('circular stylesheet imports fail clearly instead of producing incorrect hashed references', async t => {
  const options = await fixture(t);
  await fs.writeFile(path.join(options.sourceDir, 'styles', 'theme.css'), '@import "main.css";');
  await assert.rejects(build(options), /Circular asset reference/);
});
