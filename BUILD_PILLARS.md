# BUILD PILLARS — how we make things

Three pillars. They apply to **every game and every app**, and they run in order.

GAME_BIBLE.md tells you what a build must *comply* with. This file tells you how the work
is *sequenced*. Compliance without these pillars produces something that passes review and
nobody plays.

They are lifted from how the Super Mario 64 team actually operated, and from what the
directors on that team went on to say publicly about their process. Each pillar below names
its source so we can go back and check it rather than trusting a paraphrase. Then it says
what the pillar means scaled down to **one person and a handful of AI agents**, which is a
very different shop from Nintendo EAD, and what failure it prevents.

---

## Pillar 1 — THE GARDEN
### Build ONE thing and play it until it's fun. Content comes last.

**Where it comes from.** Before Super Mario 64 had courses, it had a room. Miyamoto, in the
1996 roundtable interview printed in the Japanese strategy guide: *"There was a room made of
simple lego-like blocks, and Mario and Luigi could run around in there, climb slopes, jump
around, etc."* On sequencing, the same interview is blunt: *"We spent about half our time and
energy designing the basic system that we talked about. As for the courses and enemies, those
actually came at the very end."* And on knowing when you're there: *"We were trying to get the
controls right with an analogue 3D stick, and once that felt smooth, we knew we were halfway
there."*
Source: Super Mario 64 1996 developer roundtable, translated at
https://shmuplations.com/mario64/

Half the schedule on the verb. Courses and enemies at the very end. That is the whole pillar.

**Scaled to us.** We do not have half a schedule, we have chats. So the unit is a **feel-lab**:
a standalone single file, outside the real build, containing the core verb and exactly one
thing to use it against.

- **Games:** one enemy. Not a wave, not a level. One.
- **Apps:** one core feature, end to end, with real data. Not a shell with five stubs.

You play it, or use it, until it is genuinely engaging on its own. Nothing else gets built
until then. If the one enemy is boring, twelve of them are boring twelve times.

**What it looks like in practice.**
- The lab lives at `<project>/proto/<thing>-test.html` and is committed. It is not throwaway.
- It carries the **real numbers** from the shipped build, not approximations, so tuning in the
  lab transfers. Port the real draw code where you can.
- Every tunable that matters is bound to a key and shown on screen. The lab is for finding
  numbers, so make the numbers findable.
- **Nobody dies.** No fail state, no progression, no score meta. Failure just resets the rep.
  You are practising a feel, not playing a game yet.
- It ships with a headless harness (`proto/<thing>-harness.js`, `node` runnable) that drives
  the real update loop and asserts the feel budget in frames. An agent can then change a
  number and prove it still holds.
- **The lab is where uncomfortable findings surface.** The Jade Fist duel lab proved the
  dodge→counter loop did not close one-on-one, and that the telegraph was nearly twice as
  long as human choice-reaction time. Neither was visible inside the full game. Expect the
  lab to embarrass the build. That is what it is for.

**The app version of the feel-lab: a Chicken Hour.**

A game's progress systems are obvious, so they are easy to strip. An app's are disguised as
helpfulness, which makes them far more dangerous. Lesson numbering, a path position, a
completion screen and a clear "what's next" are all good design, and all four will make a
dull action feel fine for as long as you are moving toward the end of something. If the
action is only bearable because it gets someone closer to finishing, you have built a chore
with good signposting, and every feature stacked on top inherits that.

So the lab strips more than feels comfortable:

- **Strip:** lesson numbering, progress bar, XP, streaks, unit boundaries, the next-lesson
  button, any completion screen. The directive and the position on the path go too. Signposting
  is the thing under test, not the thing you keep.
- **Keep:** real question content, real data, real error messages, real correction text. The
  numbers rule from the feel-lab applies unchanged.
- **Run:** an endless stream of prompts with nothing at the end. Forty reps minimum, one
  sitting, on a phone and on a desktop.

**The verdict is overrun, and nothing else.** You stop at forty and it is a chore. You look up
at sixty without being told to and that action can carry the product. Time-to-first-input,
verdict latency, reread rate, whether a miss is recoverable in one sentence, and rep 40 versus
rep 1 are worth recording, but they only ever explain the result. They cannot produce it.

Name the action in one sentence first. If it takes two, you have named a system, and the
usual mistake is naming the container: completing a lesson is progress, answering and finding
out is the verb.

**Failure it prevents.** Shipping a large amount of content built on a verb that was never
fun. This is the most expensive mistake available to us, because content is the part AI
agents generate fastest, so we can bury a bad core in polish at record speed.

**Gate to leave this pillar:** the person, not the agent, says the one thing is fun.

---

## Pillar 2 — ONE IDEA, MANY PROBLEMS
### If an idea solves only the problem in front of you, it is not the idea yet.

**Where it comes from.** Miyamoto's own definition of a good idea, which Iwata liked enough
to repeat publicly: *"A good idea is something that does not solve just one single problem,
but rather can solve multiple problems at once."* Originally from Iwata's 4Gamer interview
discussing Miyamoto's thinking.
Source: https://en.wikiquote.org/wiki/Shigeru_Miyamoto and Iwata's 4Gamer interview as
reported at https://nintendoeverything.com/iwata-talks-about-miyamoto-says-he-used-to-think-of-him-as-a-rival/

The canonical example is the jump: it crosses gaps, kills enemies, and breaks blocks. One
verb, three problems, no extra buttons.

**Scaled to us.** This is the **filter on everything an agent proposes**, and we need it more
than Nintendo did. An AI agent will happily produce a correct, well-tested, well-commented
feature for every single problem you name. Ten of those is not a game, it is a settings
screen. Left unfiltered, agent throughput turns directly into bloat.

So before building any addition, name the problems it solves. **One problem is a patch. Two or
more is an idea.** If it only solves one, either find the version that solves more, or fold the
problem into something that already exists.

**What it looks like in practice.**
- Adding a new input is the loudest possible admission that you failed this test. Existing
  inputs given new meaning in new contexts beat new buttons every time.
- When something is wrong, ask which *single* number or verb is wrong before you add
  machinery. Shortening the Jade Fist telegraph fixed the readability complaint *and* closed
  the 1v1 counter window that looked like a separate bug. One number, two problems. The
  version of that fix that added a second timer would have been the worse idea.
- Applies to apps identically: a feature that serves both the first-time visitor's
  orientation and the returning user's re-entry is an idea. One that serves only one of them
  is usually a patch, and usually the wrong one.

**Failure it prevents.** Feature sprawl, control-surface creep, and the specific modern
failure mode of a solo dev with agents: shipping fast in ten directions at once.

**Gate to leave this pillar:** you can state the two-plus problems the addition solves, out
loud, without straining.

---

## Pillar 3 — THE FOUR-STEP TEACH
### Once the verb is fun, teach it: introduce, develop, twist, conclude.

**Where it comes from.** Koichi Hayashida, director of Super Mario 3D Land, at GDC 2012
("Thinking In 3D: The Development of Super Mario 3D Land"), describing the structure he and
Miyamoto used, borrowed from **kishōtenketsu**, the four-part structure of classical Chinese
and Japanese poetry and manga. In his words to Gamasutra: *"First, you have to learn how to use
that gameplay mechanic, and then the stage will offer you a slightly more complicated scenario
in which to use it. And then the next step is something crazy happens that makes you think
about it in a way you weren't expecting. And then you get to demonstrate, finally, what sort
of mastery you've gained over it."*
Sources: https://www.gdcvault.com/play/1015833/Thinking-In-3D-The-Development and
https://www.gamedeveloper.com/design/the-structure-of-fun-learning-from-i-super-mario-3d-land-i-s-director

The four beats: **ki** introduce it safely · **shō** develop it, raise the demand ·
**ten** twist it, force a new angle on the same idea · **ketsu** conclude, let them prove mastery.

**Scaled to us.** Pillar 1 gets us a verb worth learning. This is how the verb becomes content
without becoming a tutorial. Note the order: **you cannot do this before Pillar 1**, because
you cannot structure the teaching of something you have not yet made worth learning.

- **Games:** the first stage/district introduces one line safely, the second complicates it,
  the third twists it (the same read in a context that inverts it), the fourth asks for all of
  it at once. This replaces text tutorials entirely, which is also what CrazyGames demands
  ("teach in-game visually", GAME_BIBLE Part 1).
- **Apps:** the same four beats are the shape of a lesson, a guide, or an onboarding path.
  Show the thing working. Ask for it under slightly harder conditions. Break the assumption.
  Then hand over a task that needs the whole skill.

**What it looks like in practice.**
- Each new mechanic gets its own four beats. Do not introduce two in the same arc.
- The **twist is not a difficulty spike** and this is the step most often got wrong. It is the
  same mechanic seen from a new angle. Faster and more of it is `shō`, not `ten`.
- If you cannot think of a twist for a mechanic, that is real information: the mechanic may be
  too thin to carry a stage, which sends you back to Pillar 2.
- Write the four beats down *before* building any of them, so the arc is designed rather than
  discovered.

**Failure it prevents.** Content that is a flat difficulty ramp, and the tutorial-vs-content
split where the first ten minutes teach and the rest just repeat.

---

## Pillar 1, in detail: the two things people get wrong

### A. The dev cockpit — you cannot tune what you cannot see

A feel-lab without instrumentation is just a small game. The point of the lab is to turn
"this feels off" into a number, so **every lab and every game ships a dev cockpit**, wrapped in
`DEV:BEGIN` / `DEV:END` strip markers (GAME_BIBLE Part 5) so it never reaches players.

Miyamoto's own testing looks like this, incidentally: he spent an hour of a Breath of the Wild
playtest *just climbing trees*, and tested Donkey Kong Bananza by staying in one spot "smashing
and digging". The director tests the verb, not the progress. Your cockpit has to make that
possible ([GamesRadar](https://www.gamesradar.com/games/donkey-kong/nintendo-icon-shigeru-miyamoto-spent-his-time-testing-donkey-kong-bananza-smashing-and-digging-in-one-spot-which-tracks-following-his-hour-long-breath-of-the-wild-playtesting-stint-just-climbing-trees/)).

**The standard set. Every one of these earns its place from a pillar:**

| Control | Why (pillar) |
|---|---|
| **Every feel number bound to a key, and shown on screen** | Pillar 1. Numbers you can't see are numbers you can't report back. |
| **A one-key NUMBERS DUMP** that prints the current tuning as one pasteable line | Pillar 1. This is the handoff from Mike's hands to the next chat. Without it, tuning findings die in the session. |
| **Force-spawn any single enemy / trigger any single state** | Pillar 1. You cannot practise one thing if you have to play through content to reach it. |
| **Freeze + single-frame step** | Pillar 1. Feel lives at frame resolution; 3 frames is the difference between fair and unfair. |
| **ACTION SPEED — one continuous slider, 0.05x to 3x, plus `[` and `]`** | Pillar 1. Reads what the eye missed at speed, without changing the numbers. |
| **A reaction readout** — frames from telegraph start to your input, and whether it landed in the window | Pillar 1. Turns "too long / too fast" into evidence. This is the control that found the Jade Fist telegraph bug. |
| **No-fail toggle** | Pillar 1. The lab is reps, not runs. |
| **Instant reset to the rep** | Pillar 1. Time-to-retry is the real budget in a feel session. |
| **Hitbox / window / telegraph overlay** | Pillar 2. Shows whether a problem is one wrong number or a genuinely missing idea. |
| **A headless harness hook** (`node <thing>-harness.js`) | Ours, not Nintendo's. An agent must be able to prove a change kept the budget without asking a human to play. |

The cockpit is not a debug afterthought. It is the instrument panel that makes Pillar 1
possible, and it is built **with** the lab, not after it.

#### It is written once, not per project

Two files, kept in step with each other:

| File | For |
|---|---|
| `dev-cockpit.js` (play-area root) | every browser game and feel-lab |
| `harness-lib.js` (play-area root) | the headless half — DOM stubs, `<script src>` loading, the lexical-scope bridge, a pass/fail reporter |
| `scripts/dev_cockpit.gd` | the Godot twin, copied byte-identical into each Godot project |

A game declares only its own knobs. Everything else — the panel, freeze and frame-step,
slow-motion, the numbers dump, the reaction readout, the harness hook — comes from the
shared file. Wiring a new game is a `<script src>` tag and one `DevCockpit.mount({...})`
call inside `DEV:BEGIN` / `DEV:END` markers.

**Freeze, frame-step and slow-motion work by wrapping `requestAnimationFrame`.** Two things
follow from that. A loop must take its `dt` from the rAF timestamp rather than calling
`performance.now()` itself, or slow-motion will not reach it. And the wrapper carries a
re-entrancy guard, because the usual `function frame(t){ rAF(frame); ... }` shape
re-registers from inside its own callback — without the guard, 4x speed means 4ⁿ callbacks.

#### Driving a Godot game headless — the four things that cost a session to learn

The browser harnesses call the game's functions directly. A Godot harness can do better and
boot the real scene, but only if it knows these:

1. **`Input.parse_input_event()` does not propagate in headless mode**
   ([godotengine/godot#73557](https://github.com/godotengine/godot/issues/73557)). Anything
   read through `_input()` / `_unhandled_input()` cannot be driven that way.
2. **`Input.action_press()` works.** It writes the action state that `is_action_pressed`
   reads, which never goes through event propagation. So anything HELD is drivable.
3. **`is_action_just_pressed` does not.** It compares against an input frame counter that
   nothing advances when no real events arrive, so every TAP has to be called directly. Say
   which half a result came from — a harness that quietly reaches past the input layer is not
   simulating a player any more.
4. **`Engine.get_frames_drawn()` stays at 0** — nothing is drawn. Keep your own frame clock,
   and pass `--fixed-fps 60` for a deterministic delta.

Two more, learned the same afternoon: a paused tree pins `Engine.time_scale` at 0 and makes
every input a silent no-op, so put the game back in a playable state before measuring
anything about playing it — and if the project has a juice/hitstop autoload that writes
`Engine.time_scale` every frame, the cockpit's ACTION SPEED must go through it rather than
fight it, or the slider moves and the game does not.

Reference implementation: `matrix-construct/tools/ux_harness.gd`.

#### The numbers dump, and what it is for

`D` writes one pasteable line plus a `<game>-tuning.txt` file:

```
TUNING jade-fist-duel | windup=28 | arm=110 | gap=40 | perf=0.66
# reaction readout (frames from telegraph to input)
#   sweep: 24f LANDED
#   high: 31f missed
```

That file **is the handoff**. Paste it into the next chat and the session starts from the
numbers that felt right, rather than from a memory of them. Without it, a tuning session's
findings die with the tab.

### This applies to apps too, not only games

Every new app starts the same way: the cockpit is day-one work, not something added once
the thing is hard to tune. The controls translate straight across, because the underlying
question is identical — *can I exercise this one piece, repeatedly, without playing through
everything around it?*

| In a game | In an app |
|---|---|
| Force-spawn one enemy | Jump straight to one screen, one state, one record — no clicking through a flow to reach it |
| No-fail toggle | Bypass auth, quotas, rate limits, paywalls while testing |
| Freeze + frame-step | Pause an animation, a timer, a queue, a polling loop, and advance it one tick |
| Slow-motion | Slow transitions and network timing so what the eye missed becomes visible |
| Reaction readout | Real latency numbers — time to first paint, time to a response landing |
| Instant reset to the rep | Reset to a known seeded state in one keystroke, no re-seeding by hand |
| Hitbox / window overlay | Layout, focus-order and hit-target overlays |
| Every feel number on a slider | Every timing, threshold and limit the app's feel depends on |
| Numbers dump | The same pasteable line, same purpose: hand the tuning to the next session |
| Headless harness | The same rule — an agent proves a change without asking a human to click |

Same gate (`?dev=1`, auto-on for localhost), same `DEV:BEGIN` / `DEV:END` strip markers,
same rule that nothing inside is load-bearing.

### B. More than one enemy — the ladder, and how Nintendo actually did it

Mike's instinct was: nail the weakest enemy, then work up to the boss. That is close, and the
sources sharpen it in three ways.

**1. Start with the enemy that asks the core question most purely, which is not always the
weakest.** In Super Mario Bros. the only basic enemy for most of development was the Koopa
Troopa. Playtesters found it too tricky as a first encounter, so the **Goomba was created last
and placed first** — an enemy that dies to a single stomp, invented specifically to teach the
verb. ([Super Mario Wiki](https://www.mariowiki.com/Goomba))

The lesson is not "build weakest first". It is: **the teaching enemy is a deliberate design
object, and you may have to invent it after the fact.** If your weakest existing enemy still
asks a compound question, build a simpler one whose whole job is to teach the verb cleanly.
Jade Fist's lab foe is exactly this: strike-only, no feints, no guard.

**2. Every additional enemy must ask a DIFFERENT question, not the same one louder.** The
Goomba teaches the stomp; the Koopa's shell says *this one will not squash*, and stomping it
gives you a projectile instead. Different question, same verb. Punch-Out!! is the same idea at
scale: an opponent's appearance and behaviour are the cue to their fighting style, and every
tell is different, so no fight can be beaten on the last fight's knowledge alone.

This is Pillar 2 applied to enemies: **more HP and faster timings is a difficulty slider, not
a new enemy.** If you cannot state the new question in one sentence, you have a variant, and
variants belong in a wave table rather than in the roster.

**3. The boss is the exam, not a wall.** Under Pillar 3 the boss is `ketsu`: it asks every
question the district already taught, together. A boss that introduces a brand-new read at the
end of a district is a design failure dressed as difficulty.

**The ladder, then:**

```
1. ONE teaching enemy in the lab  ->  the verb is fun            [Mike gates]
2. Add the SECOND enemy to the SAME lab. Play both together
   before adding a third. Enemies that are individually clear
   and illegible in a pair is the failure mode this catches
   (Jade Fist's pincer problem lived here).
3. Repeat one at a time. New question per enemy, or it is a variant.
4. Boss last, and only from questions already taught.
```

Never add two enemies at once. The whole method is that when something feels wrong you know
exactly which addition caused it.

---

## How the three run together

```
PILLAR 1  one enemy / one feature, in a lab, until it is fun      <- the person gates this
PILLAR 2  filter every addition: two problems or it is a patch    <- runs forever, from here on
PILLAR 3  four beats per mechanic: introduce, develop, twist, end <- only after Pillar 1 passes
```

Pillar 1 is a phase with an exit. Pillar 2 never stops applying. Pillar 3 starts the moment
Pillar 1 passes and repeats for every mechanic added after.

**Where this sits.** GAME_BIBLE.md remains gospel for what a build must comply with, and for
games it is still read first. This file governs the order the work happens in, for games and
apps alike. When they appear to conflict, they do not: compliance is a floor, sequencing is
how you get something worth complying with.

---

## The honest caveats

Nintendo EAD had years, dozens of people, and the ability to throw work away. We have chats,
one person, and agents that produce work faster than one person can evaluate it. Two
adjustments follow from that, and they are ours, not Nintendo's:

1. **The bottleneck is evaluation, not production.** Pillar 1 exists partly because a feel-lab
   is the cheapest possible thing for a human to evaluate. Protect that: keep labs small
   enough to judge in one sitting.
2. **Agents must not self-certify feel.** A harness can prove a dodge is possible within a
   reaction budget. It cannot prove the dodge feels good. Every Pillar 1 exit and every
   `ten` twist needs a human to say yes. Agents produce, measure, and report. The person
   decides whether it is fun.
