import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const siteDir = new URL('../site/', import.meta.url);
const repoRoot = dirname(fileURLToPath(siteDir));
const pages = ['index.html', 'privacy.html', 'support.html'];

function readSite(name) {
  return readFileSync(new URL(name, siteDir), 'utf8');
}

test('site/ ships the three static pages and a local stylesheet', () => {
  const names = new Set(readdirSync(siteDir));
  for (const page of pages) assert.equal(names.has(page), true);
  assert.equal(names.has('styles.css'), true);
});

test('privacy and support keep [ONAYLA] placeholders and omit unpublished contact details', () => {
  const privacy = readSite('privacy.html');
  const support = readSite('support.html');

  for (const html of [privacy, support]) {
    assert.match(html, /\[ONAYLA/);
    assert.equal(html.includes('umutsntrk.0@gmail.com'), false);
    assert.equal(html.includes('Umut için notlar'), false);
    assert.equal(html.includes('Notes for Umut'), false);
  }

  assert.match(privacy, /id="tr"/);
  assert.match(privacy, /id="en"/);
  assert.match(privacy, /\[ONAYLA: yayın tarihi\]/);
  assert.match(privacy, /Umut Şentürk/);
  assert.equal(privacy.includes("[ONAYLA: App Store'da görünen geliştirici adı]"), false);
  assert.match(privacy, /\[ONAYLA: iletişim e-postası\]/);
  assert.match(privacy, /13\+/);
  assert.match(privacy, /ages 13\+/);
  assert.match(support, /\[ONAYLA: iletişim e-postası\]/);
});

test('site pages are self-contained: no scripts, CDNs, analytics or remote fonts', () => {
  const css = readSite('styles.css');
  assert.match(css, /#C84F2E/);
  assert.match(css, /#F8F6F1/);
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /#14171B/);

  for (const page of pages) {
    const html = readSite(page);
    assert.equal(/<script/i.test(html), false);
    assert.equal(/https?:\/\//i.test(html), false);
    assert.equal(html.includes('googleapis'), false);
    assert.equal(html.includes('googletagmanager'), false);
    assert.equal(html.includes('google-analytics'), false);
    assert.match(html, /href="styles\.css"/);
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
