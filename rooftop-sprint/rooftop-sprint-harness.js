/* ROOFTOP SPRINT — headless feel harness.  `node rooftop-sprint-harness.js`
   The game lives inside an IIFE, so its locals are not reachable by name. The
   dev cockpit is the way in: __DEV exposes exactly the numbers that were judged
   worth tuning, which is the point of the cockpit in the first place. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'index.html'));
const DEV = S.__sandbox.__DEV;

const t = suite('rooftop sprint');

if (!t.ok('dev cockpit mounted', !!DEV)) t.done();

const g = DEV.get('gravity'), v = DEV.get('jump'), slide = DEV.get('slide');
const apex = (v * v) / (2 * g);          // peak height of a full leap, in px

t.note('gravity=' + g + '  jump=' + v + '  apex=' + apex.toFixed(1) + 'px  slide=' + slide + 'f');

/* The hanging hazard band is [roof+17, roof+46]: a slide fits under 17, and a
   full leap has to clear 46. Both rules are written into the comment at the
   LOWBAR constants, and both are silently broken by a bad gravity tweak. */
t.ok('a full leap clears the top of the hazard band (46px)', apex > 46,
  apex.toFixed(1) + 'px apex');
t.ok('a full leap is not so floaty it leaves the roof behind', apex < 120,
  apex.toFixed(1) + 'px apex');
t.ok('the slide lasts long enough to cross a hazard', slide >= 24, slide + ' frames');

/* GAME_BIBLE Part 5 rule 3 — the cockpit must not be load-bearing. */
t.ok('no-fail is off by default', !DEV.api.flags.noFail);
const before = DEV.get('gravity');
DEV.set('gravity', 0.5);
t.ok('a knob writes straight through to the real value', DEV.get('gravity') === 0.5);
DEV.set('gravity', before);
t.ok('the numbers dump is one pasteable line', /^TUNING rooftop-sprint \|/.test(DEV.dump()));

t.done();
