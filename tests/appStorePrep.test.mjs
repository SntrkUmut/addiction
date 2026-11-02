import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fontWeights } from '../src/theme/typography.ts';
import { sceneDay, sceneDusk, sceneNight } from '../src/theme/colors.ts';

test('night Scene fills below the gradient with the last sky stop; other variants stay unset', () => {
  const source = readFileSync(new URL('../src/ui/components.tsx', import.meta.url), 'utf8');
  assert.match(
    source,
    /backgroundColor: variant === 'night' \? colors\.sky\[2\] : undefined/,
  );
  assert.equal(sceneNight.sky[2], '#202B37');
  assert.equal(sceneDay.sky[2], '#F7E9E2');
  assert.equal(sceneDusk.sky[2], '#1B1F24');
});

test('root layout loads Nunito, hides splash on success, error, or timeout', () => {
  const layout = readFileSync(new URL('../src/app/_layout.tsx', import.meta.url), 'utf8');
  assert.match(layout, /SplashScreen\.preventAutoHideAsync\(\)/);
  assert.match(layout, /useFonts\(/);
  assert.match(layout, /FONT_LOAD_TIMEOUT_MS/);
  assert.match(layout, /fontsLoaded \|\| Boolean\(fontError\) \|\| timedOut/);
  assert.match(layout, /SplashScreen\.hideAsync\(\)/);

  const loaded = [...layout.matchAll(/Nunito_\w+/g)].map(match => match[0]);
  const unique = [...new Set(loaded)];
  assert.deepEqual(unique.sort(), Object.values(fontWeights).slice().sort());

  const appJson = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8'));
  const fontPlugin = appJson.expo.plugins.find(entry => Array.isArray(entry) && entry[0] === 'expo-font');
  assert.ok(fontPlugin);
  assert.equal(fontPlugin[1].fonts.length, 5);
});

test('Milestone respects the top safe area the way chapter celebration does', () => {
  const milestone = readFileSync(new URL('../src/screens/Milestone.tsx', import.meta.url), 'utf8');
  assert.match(milestone, /useSafeAreaInsets/);
  assert.match(milestone, /paddingTop: Math\.max\(insets\.top, 24\) \+ 12/);
  assert.match(milestone, /paddingBottom: Math\.max\(insets\.bottom, 24\)/);
});
