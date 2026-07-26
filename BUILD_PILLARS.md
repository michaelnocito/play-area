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
