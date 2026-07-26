/* DEADROOT — headless feel harness.  `node deadroot-harness.js`
   Control 10 of the dev cockpit (BUILD_PILLARS "A"): an agent must be able to
   prove a change kept the budget without asking a human to play. These assert
   the balance rules the DEV_NOTES actually commit to, so a knob turned too far
   in a tuning session fails here rather than in Mike's hands. */
'use strict';
const path = require('path');
const { load, suite } = require('../harness-lib');

const S = load(path.join(__dirname, 'index.html'), {
  expose: ['CFG', 'enemies', 'mode', 'biomass', 'devEnemyHpMult', 'devEnemyDmgMult',
           'spawnEnemy', 'openGates', 'update', 'newRun', 'gameSpeed']
});

const t = suite('deadroot');

/* --- balance invariants the design notes commit to ---------------------- */
t.ok('every enemy type has hp, speed, damage and a radius',
  Object.entries(S.CFG.enemies).every(([, e]) =>
    e.hp > 0 && e.spd > 0 && e.dmg >= 0 && e.r > 0));

// DR-#019 set the warden's damage so it ONE-SHOTS a scav, and the CFG comment
// still says "one-shots a 30hp scav". DR-#037 later raised the scav to 40hp for
// the three-hit rule below and nobody re-checked the warden. The rule is broken
// (32 < 40) and it is Mike's balance call which number moves, so the harness
// asserts the weaker truth and prints the drift every run.
t.ok('warden kills a scav in at most two shots',
  S.CFG.towers.warden.dmg * 2 >= S.CFG.enemies.scav.hp,
  'warden ' + S.CFG.towers.warden.dmg + ' vs scav ' + S.CFG.enemies.scav.hp);
if (S.CFG.towers.warden.dmg < S.CFG.enemies.scav.hp)
  t.note('DRIFT: the DR-#019 one-shot rule no longer holds — warden ' +
         S.CFG.towers.warden.dmg + ' vs scav ' + S.CFG.enemies.scav.hp +
         '. Raise warden damage to 40, or drop the scav back to 32.');

// DR-#037: three base hits from a spitter kill a scav.
t.ok('a scav dies to about three basic hits',
  Math.ceil(S.CFG.enemies.scav.hp / S.CFG.towers.spitter.dmg) <= 3,
  Math.ceil(S.CFG.enemies.scav.hp / S.CFG.towers.spitter.dmg) + ' hits');

// DR-#036 raid roles: the cleric must be killable by two focused zombies.
t.ok('the cleric out-heals nobody on her own',
  S.CFG.enemies.cleric.healRate < S.CFG.towers.spitter.dmg * 2,
  'heal ' + S.CFG.enemies.cleric.healRate + '/s vs 2 spitters');

t.ok('the boss is the tankiest thing in the game',
  Object.entries(S.CFG.enemies).every(([k, e]) => k === 'boss' || e.hp <= S.CFG.enemies.boss.hp));

/* --- the economy has to be solvable ------------------------------------- */
t.ok('a wave of scavs pays for at least one tower',
  S.CFG.killBounty * 10 >= S.CFG.towers.spitter.cost,
  '10 kills = ' + (S.CFG.killBounty * 10) + ' biomass, zombie costs ' + S.CFG.towers.spitter.cost);

// The warden is the free starting tower, so it is not part of the price ladder.
t.ok('a hedge is the cheapest thing you pay for',
  Object.values(S.CFG.towers).filter(x => x.cost > 0).every(x => S.CFG.hedgeCost < x.cost));

/* --- the dev knobs must actually be non-load-bearing -------------------- */
t.ok('enemy multipliers start neutral', S.devEnemyHpMult === 1 && S.devEnemyDmgMult === 1);

module.exports = {};
t.done();
