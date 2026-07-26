---
title: "Test the Verb, Not the Progress"
subtitle: "A one-hour test that tells you whether the core of your game or app is any good, before you build anything on top of it."
slug: test-the-verb-not-the-progress
cover: verb-vs-progress-1200x630.png
tags: [gamedev, design, product, learning]
canonical: https://michaelnocito.github.io/guides/test-the-verb-not-the-progress/
---

# Test the Verb, Not the Progress

Here is a test that takes an hour and tells you something no normal playtest or demo can: whether the thing at the centre of your game or app is any good on its own.

You strip everything away except the single action people repeat a thousand times. One character, one enemy. One screen, one feature. No score, no levels, no onboarding, nothing to finish. Then you do only that, for an hour, and watch for the moment your hand relaxes.

**The one-sentence version: everything you build bundles a verb, the thing someone physically does a thousand times, with a progress structure, the levels and scores and bars and onboarding flows that pull them forward. Progress is close to failure-proof, so it always feels like something, which means it hides a weak verb instead of exposing it. To find out whether the verb is any good, remove the progress and do only the verb for an hour.**

![A side by side comparison. On the left, a normal playtest: the good feeling splits into a small verb portion and a large progress portion, verdict inconclusive. On the right, a verb test with no score or unlocks: the whole good feeling comes from the verb, verdict usable.](verb-vs-progress-1200x630.png)

## Why you need it: progress hides a bad verb

Look at what a progress structure actually is. A number that goes up. A bar that fills. A door that opens because you did the required amount of something. These feel good almost independently of what you did to earn them, which is exactly why we build them. They are reliable, and that reliability is the problem when you are trying to evaluate.

Test the normal way and progress quietly supplies most of the good feeling while the verb takes the credit. Everyone in the room agrees it felt good, and nobody can tell you how much was the action and how much was the bar. Then it ships, and the players who did not care about your bar leave in ninety seconds.

Remove the progress and there is nothing else to like. That is the whole trick. If an hour of the bare action is pleasant, the verb can carry a sixty hour game, or a product someone opens daily. If it is not, no amount of content or polish will rescue it, and you learned that at prototype cost instead of at launch.

## In a game: one character, one enemy

The test is a build you would never ship. One player character. One enemy. No score, no upgrades, no levels, no death. He attacks, you answer, he gets back up, repeat.

Compare what you learn.

**From a normal playtest:** solid, combat feels decent, the tally screen is satisfying, second area drags a bit. Every sentence there is contaminated. Did combat feel decent, or did clearing the area feel decent? Does the second area drag, or has the novelty of the verb worn off, which would be devastating to learn and is currently disguised as a level design note?

**From a verb test:** the dodge window is too tight. The telegraph is so long you commit early and get punished for reacting like a human. The counter is satisfying the first thirty times and mechanical by the hundredth.

Those are three things you can fix on Monday. When I built this for a brawler of my own it found two real problems in a week: a counter window that could not physically close in a one on one fight, and a telegraph running at nearly twice human reaction time. Both had been in the game for months, played hundreds of times, invisible the whole time because there was always a wave to clear.

The rule for adding the second enemy is worth stealing too. In Super Mario Bros. the Koopa Troopa was the only basic enemy for most of development, and playtesters found it too tricky to open with, so the Goomba was created last and placed first: an enemy invented purely to teach the stomp. The Koopa then asks a different question, because its shell says this one will not squash. **Each enemy asks a new question of the same verb.** More health and faster timings is a difficulty slider, not an enemy.

## In an app: the user is the player character

Same test, and the translation is almost one to one.

| In a game | In your app |
|---|---|
| The player character | The user |
| The verb | The one action a feature is made of |
| One enemy | One feature |
| Waves, levels, districts | The rest of the product |
| The boss | The flagship feature everything builds toward |
| Score, unlocks, the bar filling | Onboarding, the demo happy path, the checklist, the roadmap |

Your demo is a progress structure. It has a narrative, a happy path and an ending, and it will feel fine in front of a room of people even when the core interaction is poor. So build the app equivalent of one character and one enemy: **one screen, one feature, real data, no task to complete.** Then watch one person do that feature's single most repeated action forty times with nothing to finish. Not a scripted flow, no goal, just the action.

If it is only tolerable in service of completing a task, you have built a chore with good signposting, and every feature stacked on top inherits that. If someone does it forty times and keeps going, that feature can carry the product.

This is also the honest version of dogfooding. Using your own app to get work done tests the progress. Using the one screen you built forty times in a row tests the verb.

Then ladder it exactly like the enemy roster. **One feature at a time, polished until it stands on its own, before the next one is built.** Start with the feature that asks the core question most purely, usually the simplest rather than the flashiest. Give every feature after it a different question to ask, because a second feature that is the first one with more options is a settings screen. Put two in front of a user together before adding a third, because features that are individually clear and confusing side by side is a real failure, and you want to know which addition caused it.

The flagship feature is the boss, and it should be built from questions the user already learned to answer.

## How to run one

1. **Name the verb in one sentence.** One action. If it takes two sentences you have named a system and you need to go narrower.
2. **Strip the progress.** No score, no unlocks, no levels, no completion. In a game that is one enemy and a reset. In an app it is one screen and no task.
3. **Keep the real numbers and the real data.** A test on approximations tunes something that is not your product.
4. **Instrument it.** You are turning a feeling into a number, so put every value you might change on a key, show it on screen, and give yourself a way to print the current settings the moment something feels right.
5. **Do it for an hour** and notice when your hand relaxes.
6. **Say the verdict out loud before you add anything else.** The verb is good, or it is not.

One warning. Doing this to a finished project is unpleasant, because you strip out systems you spent months on and there is a real chance the answer is "the core is thin". Do it before the next feature push rather than after, because the alternative is paying to build more of something that was not working.

## Where this comes from: an hour in the trees

In March 2017, Breath of the Wild director Hidemaro Fujibayashi told Jason Schreier at Kotaku how his team first pitched their open world internally. They built a prototype to prove you could do anything in it: a small starting field with a handful of trees, with rupees hidden in the exact spots they guessed their two most important playtesters would wander toward.

Then they handed the controller to Shigeru Miyamoto.

> "When we first presented this to Mr. Miyamoto, he spent about an hour just climbing trees."

Then comes the detail that turns a funny story into a method. Miyamoto stayed inside a radius of roughly 25 to 50 metres. The rupees were right there, carefully placed by people who wanted him to see the world. He ignored every one of them and spent the hour on the climb. He was not being eccentric. He was removing the confound.

He has always worked this way. Twenty-one years earlier, before Super Mario 64 had a single course, it had a test room made of lego-like blocks where Mario could run, climb slopes and jump, and Miyamoto says half the project's time and energy went into that basic system, with the courses and enemies arriving at the very end. In 2025, Donkey Kong Bananza's director said Miyamoto checked their build by ignoring the game entirely and staying in one spot, smashing and digging.

Three teams, three consoles, twenty-nine years, one behaviour.

## Why it works

Isolating a component and drilling it is not a Nintendo invention. It is called part-task training. Wightman and Lintern reviewed the field in 1985, defining it as practice on some components of the whole task as a prelude to performing the whole task, and across the four segmentation studies they examined the isolated version beat whole-task practice in three.

*Wightman, D. C., and Lintern, G. (1985). Part-task training for tracking and manual control. Human Factors, 27(3), 267 to 283. DOI 10.1177/001872088502700304*

When you remove everything except the component, the feedback you get is about the component. That is all Miyamoto is doing in the trees.

## Cheat sheet

| | Progress test (the default) | Verb test |
|---|---|---|
| **What you do** | Play or use it normally | One action, on repeat |
| **What is present** | Levels, score, onboarding, goals | Nothing but the action |
| **What it measures** | The bundle | The action alone |
| **Can it fail?** | Rarely, progress props it up | Yes, and quickly |
| **In a game** | A full run | One character, one enemy |
| **In an app** | The demo | One screen, one feature |
| **The tell** | "That felt good" | "I did not want to stop" |

## The one habit to keep

Before you judge whether something is good, remove the part of it that was always going to feel good. What is left is the thing you are actually shipping.

An hour in the trees, with the rupees left on the ground.

## A question for you

What is something you would defend as genuinely good where the verb, the repeated action itself, is honestly dull, and the structure around it is doing all the work? I can think of a couple and they make me less sure of my own argument, which is why I want to hear yours.

---

*Sources: the Breath of the Wild account is Hidemaro Fujibayashi speaking to Jason Schreier, Kotaku, 6 March 2017. Miyamoto's Super Mario 64 comments come from the 1996 developer roundtable printed in the Japanese strategy guide, translated at shmuplations.com/mario64. The Donkey Kong Bananza account is Kenta Motokura speaking to The Guardian, July 2025.*
