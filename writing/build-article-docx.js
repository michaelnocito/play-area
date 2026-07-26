/* Article as a Word doc, formatted for Word's Read Aloud.
   Deliberately linear: real built-in headings so Read Aloud can navigate, no
   tables (Read Aloud stumbles through them cell by cell), citations moved to
   one block at the end instead of interrupting sentences, and numbers written
   as words where a screen reader would otherwise mangle them. */
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle,
  LevelFormat, AlignmentType, PageOrientation, convertInchesToTwip
} = require('docx');
const fs = require('fs');

const SKY = '0369A1', ZINC = '3F3F46', MUTED = '71717A';
const BODY = 24;      // 12pt, comfortable on a phone screen
const SMALL = 20;

const P = (text, o = {}) => new Paragraph({
  spacing: { after: o.after === undefined ? 180 : o.after, line: 312 },
  children: [new TextRun({ text, size: o.size || BODY, bold: o.bold,
    italics: o.italics, color: o.color, font: 'Calibri' })]
});
const PR = (runs, o = {}) => new Paragraph({
  spacing: { after: 180, line: 312 },
  children: runs.map(r => new TextRun({ text: r.t, bold: r.b, italics: r.i,
    color: r.c, size: r.size || o.size || BODY, font: 'Calibri' }))
});
const H1 = text => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 180 },
  children: [new TextRun({ text, font: 'Calibri', color: SKY })]
});
const QUOTE = (text, attrib) => [
  new Paragraph({
    spacing: { before: 140, after: 60, line: 312 },
    indent: { left: convertInchesToTwip(0.3) },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: SKY, space: 12 } },
    children: [new TextRun({ text, italics: true, size: BODY, font: 'Calibri', color: ZINC })]
  }),
  new Paragraph({
    spacing: { after: 220 }, indent: { left: convertInchesToTwip(0.3) },
    children: [new TextRun({ text: attrib, size: SMALL, font: 'Calibri', color: MUTED })]
  })
];
const NUM = text => new Paragraph({
  numbering: { reference: 'steps', level: 0 },
  spacing: { after: 120, line: 312 },
  children: [new TextRun({ text, size: BODY, font: 'Calibri' })]
});

const doc = new Document({
  creator: 'Michael Nocito',
  title: 'Test the Verb, Not the Progress',
  description: 'Article, formatted for listening with Read Aloud.',
  numbering: { config: [{ reference: 'steps', levels: [{ level: 0,
    format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 520, hanging: 280 } } } }] }] },
  styles: { default: {
    document: { run: { font: 'Calibri', size: BODY } },
    heading1: { run: { font: 'Calibri', size: 30, bold: true, color: SKY } }
  } },
  sections: [{
    properties: { page: {
      size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
      margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    children: [
      new Paragraph({ spacing: { after: 80 }, children: [new TextRun({
        text: 'Test the Verb, Not the Progress', bold: true, size: 44, color: SKY, font: 'Calibri' })] }),
      P('Miyamoto spent an hour climbing trees instead of playing Zelda. He was running an experiment.',
        { size: 26, color: ZINC, after: 80 }),
      P('Michael Nocito  ·  26 July 2026  ·  about 13 minutes read aloud', { size: SMALL, color: MUTED }),

      P('Everyone in the room agreed the build felt good.'),
      P('They had played it the way a player would. They started at the beginning, cleared the first area, watched a bar fill, unlocked the next thing, and came away saying the sentence people always say: yeah, that felt good. Six weeks later the same build went out to real players, and the average session was ninety seconds.'),
      P('Nothing was wrong with the test. The problem is what was being measured. That session had two systems in it, they got graded together, and only one of them was capable of failing.'),
      PR([
        { t: 'The one sentence version. ', b: true },
        { t: 'Every experience bundles a verb, the thing you physically do a thousand times, with a progress structure, the levels and scores and bars that pull you forward. Progress is close to failure proof, so it always feels like something, which means it hides a weak verb instead of exposing it. To find out whether the verb is any good, remove the progress and do only the verb for an hour.' }
      ]),

      H1('The designer who does this on purpose'),
      P('In March twenty seventeen, Breath of the Wild director Hidemaro Fujibayashi told Jason Schreier at Kotaku how the team first pitched their open world internally. They built a prototype to prove the idea that you could do anything. They made a small starting field with a handful of trees, and they hid rupees around it, in the spots they guessed their two most important playtesters would wander toward.'),
      P('Then they handed the controller to Shigeru Miyamoto.'),
      ...QUOTE('When we first presented this to Mr. Miyamoto, he spent about an hour just climbing trees.',
               'Hidemaro Fujibayashi, Breath of the Wild director'),
      P('And then he adds the detail that turns this from a funny story into a method. Miyamoto stayed inside a radius of roughly twenty five to fifty metres. The rupees were right there. The rupees were the entire progress structure, carefully placed by people who wanted him to see the world. He ignored them, and spent an hour on the climb.'),
      P('He has done this his whole career.'),
      P('Twenty one years earlier, before Super Mario sixty four had a single course, it had a test room. In the developer roundtable printed in the nineteen ninety six Japanese strategy guide, Miyamoto describes it without ceremony. A room made of simple lego like blocks, where Mario and Luigi could run around, climb slopes, and jump. What is striking is not the room. It is the budget behind it.'),
      ...QUOTE('We spent about half our time and energy designing the basic system that we talked about. As for the courses and enemies, those actually came at the very end.',
               'Shigeru Miyamoto, Super Mario 64 developer roundtable, 1996'),
      P('Half the schedule on how it feels to move. The content, which is what customers thought they were buying, went last.'),
      P('And in July twenty twenty five, Donkey Kong Bananza director Kenta Motokura told The Guardian what happened when Miyamoto checked their build.'),
      ...QUOTE('We had Miyamoto-san check the game occasionally, but instead of progressing through the game, he just stuck to one point, smashing and digging around a lot.',
               'Kenta Motokura, Donkey Kong Bananza director'),
      P('Motokura read that as encouraging rather than strange. It proved there were things in the game worth being curious about, with nobody leading you anywhere.'),
      P('Three teams, three consoles, twenty nine years, one behaviour. That is a method, not a quirk.'),

      H1('Why progress is an anaesthetic'),
      P('Think about what a progress structure actually is. A number that goes up. A bar that fills. A door that opens because you did the required amount of something. These are satisfying almost independently of what you did to earn them, which is exactly why they get used. They are reliable.'),
      P('That reliability is the problem when you are trying to evaluate.'),
      P('When you test the normal way, progress is quietly supplying a large share of the good feeling, and the verb gets credit for all of it. Everyone leaves agreeing it felt good, and nobody in the room can tell you how much was the action and how much was the bar. You have run an experiment with an uncontrolled variable sitting in the middle of it.'),
      P('Miyamoto refusing the rupees is not eccentricity. It is removing the confound. What is left in the trees is climbing, by itself, with nothing else to enjoy. If an hour of that is genuinely pleasant, the verb can carry a sixty hour game. If it is not, no amount of world design will rescue it, and the team has learned that at prototype cost, rather than at launch.'),

      H1('Before and after, on the same build'),
      P('Here is the same afternoon spent two ways.'),
      PR([{ t: 'First, a normal playtest. ', b: true },
          { t: 'You load the current build. You fight through the first area, die once, come back, clear it, see the tally screen, buy an upgrade, start the second area. You stop after forty minutes because you have to. You report back: solid, combat feels decent, the tally screen is satisfying, second area drags a bit.' }]),
      P('That report contains almost nothing you can act on. Every sentence in it is contaminated. Did combat feel decent, or did clearing the area feel decent? Was the tally satisfying because of the tally, or because of the twelve minutes of effort it summarised? Does the second area drag, or has the novelty of the verb worn off, which would be a devastating thing to know, and is currently disguised as a level design note?'),
      PR([{ t: 'Now, a verb test. ', b: true },
          { t: 'You load a stripped build. One enemy. No score, no upgrades, no death. He attacks, you answer, he gets back up, repeat. You do that for an hour.' }]),
      P('Now every observation is clean. The dodge window is too tight. The telegraph is so long that you commit early and get punished for reacting like a human. The counter is satisfying the first thirty times, and mechanical by the hundredth. None of those could have surfaced in the first test, because there the tally screen kept handing you a reward every few minutes, and your brain filed it under, combat feels decent.'),
      P('When I built exactly this for a small brawler of my own, the isolated version found two real problems in a week. The counter window could not physically close in a one on one fight. And the attack telegraph ran at nearly twice human choice reaction time, which made me commit early and eat the hit. Both had been in the game for months, played hundreds of times, invisible the entire time, because there was always a wave to clear.'),

      H1('When not to do this'),
      P('The method has real limits, and it is worth naming them.'),
      P('Some experiences genuinely are the progress. A puzzle game where each level is a single insight has no repeated verb worth isolating. Strategy games are largely about the shape of a long decision chain. If the thousandth repetition is not the point of your thing, this test tells you less.'),
      P('An hour of anything is unpleasant without variation, and that is not always the verb’s fault. The honest version of the question is not, was this hour fun. It is, did I want to stop, and when. Watch for the moment your hand relaxes.'),
      P('It cannot tell you about pacing, structure or story, because you deliberately removed all three. It answers one question well. Use a different test for the others.'),
      P('And you can pass it and still make a bad product, because a fun verb attached to a bad progression is a very common and very fixable failure. A bad verb attached to good progression is neither.'),

      H1('Why this works, beyond one designer’s habit'),
      P('Isolating a component and drilling it has a name outside games, and it was studied long before anyone was tuning a dodge window.'),
      P('It is called part task training. Wightman and Lintern reviewed the field in nineteen eighty five, defining it as practice on some components of the whole task, as a prelude to performing the whole task. They separated the ways you can cut a task up: segmentation, fractionation, and simplification. Across the four segmentation studies they examined, part task training beat whole task training in three of them, and all three of those used backward chaining.'),
      P('The broader claim, that expertise comes from focused practice on specific sub skills with immediate feedback rather than from time served, is the deliberate practice literature, beginning with Ericsson, Krampe and Tesch Roemer in nineteen ninety three.'),
      P('That paper deserves its caveat. A twenty nineteen re examination found that deliberate practice explains less of the variance in expert performance than the original claimed. That challenge does not touch the argument here, because the claim in this article is narrower than the one being contested. I am not saying focused practice is sufficient for mastery. I am saying that isolating a component gives you cleaner feedback about that component. That is a measurement claim, and it survives.'),

      H1('Where else this holds'),
      P('The general form is this. Whenever the thing you are evaluating is bundled with something that always feels like success, you are measuring the bundle. Find the rupees, and take them away.'),
      PR([{ t: 'Software and product work. ', b: true },
          { t: 'A demo is a progress structure. It has a narrative, a happy path, and an ending, and it will feel fine even when the core interaction is poor. Watch one person perform the single most repeated action in your product forty times, with no goal attached. If that action is only tolerable in service of finishing a task, you have built a chore with good signposting. This is also the honest version of dogfooding. Using your own product to get work done tests the progress. Using the one screen you built forty times in a row tests the verb.' }]),
      PR([{ t: 'Learning a craft. ', b: true },
          { t: 'Finishing a course is progress. It feels like learning, and it is nearly failure proof, which is precisely what makes it a poor measure of whether you learned. The verb test is to take one component: a single query pattern, a single scale, a single brush stroke, and do it for an hour, with feedback, and nothing to complete. If an hour of the component is unbearable, that is genuine information about the path, and week one is a much better time to have it than year two.' }]),
      PR([{ t: 'Choosing work. ', b: true },
          { t: 'Titles, promotions and salary bands are a progress structure laid over a set of daily verbs. A role can look excellent on the ladder and be miserable by the hour, and the ladder will keep supplying the good feeling for years while the hours quietly do not. The verb test asks a plainer question. What are the actions I will repeat a thousand times in this job, and would I want to do those for an hour, with nothing to reach for?' }]),

      H1('How to run one'),
      NUM('Name the verb in one sentence. One action. If it takes two sentences, you have named a system, and you need to go narrower.'),
      NUM('Strip the progress. No score, no unlocks, no levels, no completion, no death. In a game, that means one opponent and a reset. In a product, it means one screen and no task.'),
      NUM('Keep the real numbers. A test on approximated values tunes something that is not your product. Port the actual constants across.'),
      NUM('Instrument it. You are converting a feeling into a number, so put every value you might change on a key, display it on screen, and give yourself a way to print the current settings the moment something feels right. Findings that live only in your head do not survive the session.'),
      NUM('Do it for an hour, and notice when your hand relaxes.'),
      NUM('Say the verdict out loud before you add anything. The verb is good, or it is not.'),
      P('A warning about retrofitting. Doing this to a finished project is genuinely unpleasant. You will strip out systems you spent months on, to isolate something you already shipped, and there is a real chance the answer comes back as, the core is thin, which is the most expensive sentence in development. Do it anyway. And do it before the next content push rather than after, because the honest version of the alternative is paying to build more of something that was not working.'),

      H1('The short version, side by side'),
      P('In a progress test, you play it normally. Levels, score, unlocks and goals are all present. It measures the bundle. It rarely fails, because progress props it up. It answers the question, does the shape of this work. And the tell is somebody saying, yeah, that felt good.'),
      P('In a verb test, you do one action on repeat. Nothing but the action is present. It measures the action alone. It fails quickly when it should. It answers the question, is this good on its own. And the tell is you saying, I did not want to stop.'),

      H1('The one habit to keep'),
      PR([{ t: 'Before you judge whether something is good, remove the part of it that was always going to feel good. What is left is the thing you are actually shipping.', b: true, size: 26 }]),
      P('An hour in the trees, with the rupees left on the ground.', { italics: true, color: MUTED }),

      H1('A question, in closing'),
      P('I am curious about the limits of this, rather than the agreements. What is something you would defend as genuinely good, where the verb, the repeated action itself, is honestly dull, and the structure around it is doing all the work? I can think of a couple, and they make me less sure of the whole argument, which is why I want to hear yours.'),

      H1('Sources'),
      P('Super Mario 64 developer roundtable, 1996, printed in the Japanese strategy guide. Translation at shmuplations.com/mario64', { size: SMALL }),
      P('Schreier, J. Kotaku, 6 March 2017, quoting Breath of the Wild director Hidemaro Fujibayashi.', { size: SMALL }),
      P('Motokura, K., Donkey Kong Bananza director, interviewed by The Guardian, July 2025.', { size: SMALL }),
      P('Wightman, D. C., and Lintern, G. (1985). Part-task training for tracking and manual control. Human Factors, 27(3), 267 to 283. DOI 10.1177/001872088502700304', { size: SMALL }),
      P('Ericsson, K. A., Krampe, R. T., and Tesch-Roemer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363 to 406.', { size: SMALL }),
      P('Macnamara, B. N., and Maitra, M. (2019). Royal Society Open Science, 6(8), 190327. DOI 10.1098/rsos.190327', { size: SMALL })
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync('Test-the-Verb-ARTICLE.docx', b);
  console.log('written', b.length, 'bytes');
});
