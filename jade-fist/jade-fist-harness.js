/* JADE FIST (the game, not the lab) — headless feel harness.
   `node jade-fist-harness.js`.  The deep reaction-budget work lives in
   proto/duel-harness.js; this guards the numbers the shipped build commits to,
   and proves the dev cockpit stays non-load-bearing. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'index.html'), {
  expose: ['TUNE', 'devNoFail', 'hearts', 'REACH', 'HS_LIGHT', 'HS_MED', 'HS_HEAVY',
           'T_NORM', 'T_FAST', 'T_BRUTE', 'T_SPEAR', 'T_BOSS', 'enemies', 'difficulty']
});

const t = suite('jade fist');

/* --- GAME_BIBLE Part 5 rule 3: nothing in the DEV block is load-bearing --- */
t.ok('every tuning knob starts neutral',
  S.TUNE.spd === 1 && S.TUNE.wind === 1 && S.TUNE.hpD === 0 &&
  S.TUNE.heartsD === 0 && S.TUNE.diffD === 0);
t.ok('no-fail is off by default', S.devNoFail === false);

/* --- JF-#061, verbatim from Capcom's SF Seminar --- */
t.ok('hit-stop tiers are the Capcom 8/12/16',
  S.HS_LIGHT === 8 && S.HS_MED === 12 && S.HS_HEAVY === 16,
  S.HS_LIGHT + '/' + S.HS_MED + '/' + S.HS_HEAVY);

/* --- the cockpit itself --- */
const DEV = S.__sandbox.__DEV;
t.ok('dev cockpit mounted', !!DEV && DEV.knobs.length === 5);
if (DEV) {
  DEV.set('wind', 1.5);
  t.ok('the telegraph knob reaches the real TUNE object', S.TUNE.wind === 1.5);
  DEV.set('wind', 1);
  t.ok('the numbers dump is one pasteable line', /^TUNING jade-fist \|/.test(DEV.dump()));
}

t.done();
