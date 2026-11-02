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

test('App loads the Nunito weights typography uses and hides splash on success or failure', () => {
  const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
  assert.match(app, /SplashScreen\.preventAutoHideAsync\(\)/);
  assert.match(app, /useFonts\(/);
  assert.match(app, /fontsLoaded \|\| fontError/);
  assert.match(app, /SplashScreen\.hideAsync\(\)/);
  assert.match(app, /if \(!fontsLoaded && !fontError\)/);

  const loaded = [...app.matchAll(/Nunito_\w+/g)].map(match => match[0]);
  const unique = [...new Set(loaded)];
  assert.deepEqual(unique.sort(), Object.values(fontWeights).slice().sort());
});

test('Milestone respects the top safe area the way chapter celebration does', () => {
  const milestone = readFileSync(new URL('../src/screens/Milestone.tsx', import.meta.url), 'utf8');
  assert.match(milestone, /useSafeAreaInsets/);
  assert.match(milestone, /paddingTop: Math\.max\(insets\.top, 24\) \+ 12/);
  assert.match(milestone, /paddingBottom: Math\.max\(insets\.bottom, 24\)/);
});
