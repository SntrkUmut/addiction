import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const siteDir = new URL('../site/', import.meta.url);
const repoRoot = dirname(fileURLToPath(siteDir));
const pages = [
  'index.html',
  'privacy/index.html',
  'privacy/en/index.html',
  'support/index.html',
];

function readSite(name) {
  return readFileSync(new URL(name, siteDir), 'utf8');
}

test('site/ ships folder URLs and a local stylesheet', () => {
  const root = fileURLToPath(siteDir);
  assert.equal(existsSync(join(root, 'privacy.html')), false);
  assert.equal(existsSync(join(root, 'support.html')), false);
  for (const page of pages) assert.equal(existsSync(join(root, page)), true);
  assert.equal(new Set(readdirSync(siteDir)).has('styles.css'), true);
});

test('privacy and support keep [ONAYLA] placeholders and omit unpublished contact details', () => {
  const privacyTr = readSite('privacy/index.html');
  const privacyEn = readSite('privacy/en/index.html');
  const support = readSite('support/index.html');

  for (const html of [privacyTr, privacyEn, support]) {
    assert.match(html, /\[ONAYLA/);
    assert.equal(html.includes('umutsntrk.0@gmail.com'), false);
    assert.equal(html.includes('Umut için notlar'), false);
    assert.equal(html.includes('Notes for Umut'), false);
  }

  assert.match(privacyTr, /Umut Şentürk/);
  assert.match(privacyEn, /Umut Şentürk/);
  assert.match(privacyTr, /\[ONAYLA: yayın tarihi\]/);
  assert.match(privacyEn, /\[ONAYLA \/ CONFIRM: release date\]/);
  assert.match(privacyTr, /\[ONAYLA: iletişim e-postası\]/);
  assert.match(privacyEn, /\[ONAYLA \/ CONFIRM: contact email\]/);
  assert.match(privacyTr, /13\+/);
  assert.match(privacyEn, /ages 13\+/);
  assert.match(privacyTr, /Tüm verilerini uygulamada Ben → "Verilerimi sil" ile bu cihazdan kalıcı olarak silebilirsin\./);
  assert.match(privacyEn, /You can permanently delete all your data from this device in the app via Ben → "Verilerimi sil" \(Delete my data\)\./);
  assert.match(support, /\[ONAYLA: iletişim e-postası\]/);
});

test('site pages link to folder URLs and a local stylesheet', () => {
  const index = readSite('index.html');
  const privacyTr = readSite('privacy/index.html');
  const privacyEn = readSite('privacy/en/index.html');
  const support = readSite('support/index.html');

  assert.match(index, /href="privacy\/"/);
  assert.match(index, /href="privacy\/en\/"/);
  assert.match(index, /href="support\/"/);
  assert.match(privacyTr, /href="en\/"/);
  assert.match(privacyEn, /href="\.\.\/"/);
  assert.match(support, /href="\.\.\/privacy\/"/);
  assert.match(support, /href="\.\.\/privacy\/en\/"/);

  assert.match(index, /href="styles\.css"/);
  assert.match(privacyTr, /href="\.\.\/styles\.css"/);
  assert.match(privacyEn, /href="\.\.\/\.\.\/styles\.css"/);
  assert.match(support, /href="\.\.\/styles\.css"/);
});

test('site pages are self-contained: no scripts, CDNs, analytics or remote fonts', () => {
  const css = readSite('styles.css');
  assert.match(css, /#C84F2E/);
  assert.match(css, /#F8F6F1/);
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /#14171B/);
  assert.match(css, /--link:\s*#8E3623/);
  assert.match(css, /--link:\s*#E8A090/);

  for (const page of pages) {
    const html = readSite(page);
    assert.equal(/<script/i.test(html), false);
    assert.equal(/https?:\/\//i.test(html), false);
    assert.equal(html.includes('googleapis'), false);
    assert.equal(html.includes('googletagmanager'), false);
    assert.equal(html.includes('google-analytics'), false);
    assert.match(html, /href="(?:\.\.\/)*styles\.css"/);
  }
});

test('site copy has no yak-/yan- burn verbs', () => {
  const blob = pages.map(readSite).join('\n');
  const scan = spawnSync(
    'python3',
    ['-c', "import sys; sys.path.insert(0, 'src/content'); from editorial import burn_verbs; hits = burn_verbs(sys.stdin.read()); print('\\n'.join(f'{root}:{word}' for root, word in hits)); raise SystemExit(1 if hits else 0)"],
    { input: blob, encoding: 'utf-8', cwd: repoRoot },
  );
  assert.equal(scan.status, 0, scan.stdout + scan.stderr);
});

test('pages.yml is manual-only until the contact email is confirmed', () => {
  const workflow = readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /workflow_dispatch:/);
  assert.equal(/^\s*push:/m.test(workflow), false);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(workflow, /path: site/);
});
