const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageOrientation,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, LevelFormat,
  ExternalHyperlink, convertInchesToTwip
} = require('docx');
const fs = require('fs');

const SKY = '0369A1', ZINC = '3F3F46', MUTED = '71717A', AMBER = 'B45309';
const BODY = 22;              // half-points => 11pt
const SMALL = 19;

const P = (text, o = {}) => new Paragraph({
  spacing: { after: o.after === undefined ? 160 : o.after, line: 300 },
  alignment: o.align,
  indent: o.indent,
  border: o.border,
  children: [new TextRun({ text, size: o.size || BODY, bold: o.bold, italics: o.italics,
                           color: o.color, font: 'Calibri' })]
});

// paragraph built from runs: [{t, b, i, c}]
const PR = (runs, o = {}) => new Paragraph({
  spacing: { after: o.after === undefined ? 160 : o.after, line: 300 },
  alignment: o.align, indent: o.indent, border: o.border,
  children: runs.map(r => new TextRun({ text: r.t, bold: r.b, italics: r.i,
    color: r.c, size: r.size || o.size || BODY, font: 'Calibri' }))
});

const H = (text, level) => new Paragraph({
  heading: level,
  spacing: { before: 320, after: 160 },
  children: [new TextRun({ text, font: 'Calibri', color: level === HeadingLevel.HEADING_1 ? SKY : ZINC })]
});

const BULLET = (text, o = {}) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 100, line: 300 },
  children: [new TextRun({ text, size: BODY, font: 'Calibri', bold: o.bold })]
});

const NUM = (text) => new Paragraph({
  numbering: { reference: 'steps', level: 0 },
  spacing: { after: 100, line: 300 },
  children: [new TextRun({ text, size: BODY, font: 'Calibri' })]
});

const QUOTE = (text, attrib) => [
  new Paragraph({
    spacing: { before: 120, after: 60, line: 300 },
    indent: { left: convertInchesToTwip(0.35) },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: SKY, space: 12 } },
    children: [new TextRun({ text, italics: true, size: BODY, font: 'Calibri', color: ZINC })]
  }),
  new Paragraph({
    spacing: { after: 200 },
    indent: { left: convertInchesToTwip(0.35) },
    children: [new TextRun({ text: attrib, size: SMALL, font: 'Calibri', color: MUTED })]
  })
];

// ---- tables -------------------------------------------------------------
const TOTAL = 9360;   // 6.5in usable on Letter with 1in margins
function table(cols, header, rows) {
  const widths = cols.map(c => Math.round(TOTAL * c));
  const cell = (text, o = {}) => new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    children: text.split('').map(t => new Paragraph({
      spacing: { after: 0, line: 280 },
      children: [new TextRun({ text: t, bold: o.bold, size: SMALL, font: 'Calibri',
                               color: o.color })]
    }))
  });
  return new Table({
    columnWidths: widths,
    width: { size: TOTAL, type: WidthType.DXA },
    rows: [
      new TableRow({
        tableHeader: true,
        children: header.map((h, i) => cell(h, { w: widths[i], bold: true, fill: 'E7F1F8' }))
      }),
      ...rows.map((r, ri) => new TableRow({
        children: r.map((t, i) => cell(t, { w: widths[i], fill: ri % 2 ? 'F7F7F8' : undefined }))
      }))
    ]
  });
}

const RULE = new Paragraph({
  spacing: { before: 160, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D4D4D8', space: 1 } },
  children: [new TextRun({ text: '', size: 2 })]
});

// ==========================================================================
const doc = new Document({
  creator: 'Michael Nocito',
  title: 'Test the Verb, Not the Progress',
  description: 'A Miyamoto playtesting principle, the evidence behind it, and how it transfers.',
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] },
      { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] }
    ]
  },
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: BODY } },
      heading1: { run: { font: 'Calibri', size: 34, bold: true, color: SKY } },
      heading2: { run: { font: 'Calibri', size: 27, bold: true, color: ZINC } },
      heading3: { run: { font: 'Calibri', size: 23, bold: true, color: ZINC } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
      }
    },
    children: [
      // ---- title block ----
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: 'TEST THE VERB, NOT THE PROGRESS',
          bold: true, size: 40, color: SKY, font: 'Calibri' })]
      }),
      P('A playtesting principle from Shigeru Miyamoto, the evidence behind it, and where else it holds.',
        { size: 24, color: ZINC, after: 60 }),
      P('Research note prepared for Michael Nocito  ·  26 July 2026', { size: SMALL, color: MUTED }),
      RULE,

      // ---- the claim ----
      H('The principle in one sentence', HeadingLevel.HEADING_1),
      PR([
        { t: 'When Miyamoto tests a game, he does not play it. ', b: true },
        { t: 'He picks the single action the whole game is made of, does that action for an hour, and ignores everything the designers built to pull him forward. The reasoning is that progress is the one part of a game that always feels like something. Reaching the next area is satisfying whether or not the moment-to-moment action is any good, so progress hides a bad verb rather than exposing it. Remove it and only the action is left to be judged.' }
      ]),

      // ---- three moments ----
      H('Three moments, twenty-nine years apart', HeadingLevel.HEADING_1),

      H('1996 — the room before the game', HeadingLevel.HEADING_2),
      P('Before Super Mario 64 had a single course, it had a test room. In the 1996 developer roundtable printed in the Japanese strategy guide, Miyamoto describes it plainly.'),
      ...QUOTE('There was a room made of simple lego-like blocks, and Mario and Luigi could run around in there, climb slopes, jump around, etc.',
        'Shigeru Miyamoto, Super Mario 64 developer roundtable, 1996 (translated at shmuplations.com/mario64)'),
      P('The striking part is not the room. It is the budget he put behind it.'),
      ...QUOTE('We spent about half our time and energy designing the basic system that we talked about. As for the courses and enemies, those actually came at the very end.',
        'Shigeru Miyamoto, same interview'),
      P('Half the schedule on how it feels to move. The content, the thing customers thought they were buying, went last.'),

      H('2017 — an hour in the trees', HeadingLevel.HEADING_2),
      P('Twenty-one years later the Breath of the Wild team built a prototype to prove their open-world concept, and prepared it carefully for the two people who would decide its fate. Director Hidemaro Fujibayashi told Jason Schreier at Kotaku (6 March 2017) that they built a small starting field with a handful of trees and hid rupees around it, in the places they guessed Miyamoto and Eiji Aonuma would go.'),
      ...QUOTE('When we first presented this to Mr. Miyamoto, he spent about an hour just climbing trees.',
        'Hidemaro Fujibayashi, quoted by Jason Schreier, Kotaku, 6 March 2017'),
      P('Fujibayashi adds the detail that makes it a principle rather than an anecdote: Miyamoto stayed inside a 25 to 50 metre radius. The rupees were the progress structure. He ignored them and spent the hour on the verb.'),

      H('2025 — one spot, smashing and digging', HeadingLevel.HEADING_2),
      P('Donkey Kong Bananza shipped in July 2025. Its director, Kenta Motokura, told The Guardian what happened when Miyamoto checked the build.'),
      ...QUOTE('We had Miyamoto-san check the game occasionally, but instead of progressing through the game, he just stuck to one point, smashing and digging around a lot.',
        'Kenta Motokura, Donkey Kong Bananza director, interviewed by The Guardian, July 2025'),
      P('Motokura read it as a good sign, not an odd one: it proved there were things in the game players could be curious about without being led anywhere.'),
      P('The same behaviour in 1996, 2017 and 2025, across three different teams and three different consoles. That is a method, not a quirk.'),

      RULE,

      // ---- why ----
      H('Why it works: progress is an anaesthetic', HeadingLevel.HEADING_1),
      P('Every game ships two systems at once. There is the verb, the thing you physically do a thousand times an hour. And there is the progress structure: levels, unlocks, score, a bar filling, the next area. The two get tested together, which is the mistake, because they do not fail in the same way.'),
      P('Progress is close to failure-proof. A bar that fills is satisfying more or less regardless of what you did to fill it. So when you test a game normally, progress is quietly supplying the good feeling and the verb is getting credit for it. Everyone leaves the session agreeing it feels good, and nobody can tell you which half was doing the work.'),
      PR([
        { t: 'The trick in all three stories is subtraction. ', b: true },
        { t: 'Miyamoto is not being eccentric when he refuses the rupees. He is removing the variable that would confound the measurement. What is left in the trees is climbing, alone, with nothing else to like about it. If an hour of that is enjoyable, the verb carries the game. If it is not, no amount of world design will save it, and the team has learned that at prototype cost instead of at launch.' }
      ]),

      RULE,

      // ---- research trail ----
      H('The research trail', HeadingLevel.HEADING_1),
      P('This section exists because the conclusion above is only worth as much as the sources under it. Here is the actual path, including the turns that changed the answer.'),

      table([0.28, 0.40, 0.32],
        ['What I looked for', 'What came back', 'What it changed'],
        [
          ['The Mario 64 "garden" prototype',
           'The 1996 developer roundtable, translated. Miyamoto describes a lego-block test room and says half the time and energy went on the basic system, with courses and enemies at the very end.',
           'Upgraded the idea from "prototype first", which every studio claims, to a specific budget split. Half. That is the citable part.'],
          ['Whether the Breath of the Wild tree story was real or repeated hearsay',
           'It traces to Fujibayashi, quoted by Jason Schreier in Kotaku on 6 March 2017. The extra detail: the team had hidden rupees to guide exploration, and Miyamoto stayed within a 25 to 50 metre radius.',
           'This became the strongest of the three, because the rupees make it a controlled test. The reward structure was present and deliberately ignored.'],
          ['Whether the Bananza story was the same behaviour or a coincidence',
           'Director Kenta Motokura, in The Guardian, July 2025: Miyamoto stuck to one point smashing and digging instead of progressing.',
           'Three data points across 29 years turns an anecdote into a pattern. Also gave the counterpoint that the team read it as informative rather than unhelpful.'],
          ['Whether anything peer-reviewed supports practising a component instead of the whole task',
           'Wightman and Lintern (1985) reviewing part-task training, and the deliberate practice literature starting with Ericsson and colleagues (1993).',
           'Moved the piece from "a famous designer does this" to "the training-science literature has a name for it". See the next section, including where that literature has since been challenged.']
        ]),
      P('', { after: 240 }),

      H('What I discarded, and why', HeadingLevel.HEADING_2),
      BULLET('Quote-aggregator sites. Several of the Miyamoto lines circulating online appear only on quote farms with no interview attached. Anything that could not be traced to a named interviewer, publication and date was left out.'),
      BULLET('The "delayed game is eventually good" line. Widely attributed to Miyamoto, poorly sourced, and not needed here.'),
      BULLET('Secondary coverage of the Guardian and Kotaku pieces. Half a dozen outlets reported both stories. They agree, which is reassuring, but the citation is the original interview and the interviewer, not the sixth site to repeat it.'),
      BULLET('Wikipedia and content-farm summaries throughout, on principle.'),

      H('Tiers of evidence, stated honestly', HeadingLevel.HEADING_2),
      P('These are not all the same kind of claim, and it would be dishonest to present them as one wall of citations.'),
      table([0.30, 0.30, 0.40],
        ['Claim', 'Evidence tier', 'How much weight it can carry'],
        [
          ['Miyamoto tests this way',
           'Named practitioners, on the record, in three separate interviews',
           'Strong for what it is. It is testimony about what one exceptional designer does, not a controlled finding.'],
          ['Half the SM64 schedule went on the basic system',
           'First-party, from the person who ran it',
           'Strong, with the usual caveat that it is a memory recounted for a strategy guide.'],
          ['Practising a component beats practising the whole task',
           'Peer-reviewed, and contested in part',
           'Real, and qualified. Part-task training beat whole-task training in three of four studies in the 1985 review, and the deliberate practice literature has been through a hard replication since.'],
          ['Therefore you should build one enemy and play it for an hour',
           'Inference, mine',
           'Treat as a working method that has already paid, not as a proven law. It found two real bugs in Jade Fist in one week.']
        ]),
      P('', { after: 240 }),

      RULE,

      // ---- science ----
      H('What the training literature says', HeadingLevel.HEADING_1),
      P('Isolating a component and drilling it has a name outside games. It is part-task training, and it was studied seriously long before anyone was tuning a dodge window.'),
      P('Wightman and Lintern reviewed the field in 1985, defining part-task training as practice on some components of the whole task as a prelude to performing the whole task, and separating the ways you can cut it up: segmentation, fractionation and simplification. Across the four segmentation studies they examined, part-task training beat whole-task training in three, and all three used backward chaining.'),
      P('Wightman, D. C., and Lintern, G. (1985). Part-task training for tracking and manual control. Human Factors, 27(3), 267 to 283. DOI 10.1177/001872088502700304.', { size: SMALL, color: MUTED }),
      P('The broader claim, that expert performance is built from focused practice on specific sub-skills with immediate feedback rather than from time served, is the deliberate practice literature, beginning with Ericsson, Krampe and Tesch-Roemer in 1993.'),
      P('Ericsson, K. A., Krampe, R. T., and Tesch-Roemer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363 to 406. DOI omitted deliberately: it could not be verified from a source that was read directly, and a guessed DOI is worse than none.', { size: SMALL, color: MUTED }),
      PR([
        { t: 'The honest caveat. ', b: true },
        { t: 'That 1993 paper has been challenged. A 2019 re-examination in Royal Society Open Science found deliberate practice accounts for less of the variance in expert performance than originally claimed. This does not damage the point being made here. The claim in this document is narrow: isolating a component gives you cleaner feedback about that component. That survives the replication argument, which was about how much of expertise practice explains, not about whether focused practice gives clearer signal than unfocused practice.' }
      ]),
      P('Macnamara, B. N., and Maitra, M. (2019). The role of deliberate practice in expert performance: revisiting Ericsson, Krampe and Tesch-Roemer (1993). Royal Society Open Science, 6(8), 190327. DOI 10.1098/rsos.190327.', { size: SMALL, color: MUTED }),

      RULE,

      // ---- transfer ----
      H('Where else this holds', HeadingLevel.HEADING_1),
      P('The general form of the principle is this: whenever a thing you are evaluating is bundled with something that always feels like success, you are measuring the bundle. Find the equivalent of the rupees and take them away.'),

      H('Software and product work', HeadingLevel.HEADING_2),
      BULLET('A demo is a progress structure. It has a narrative, a happy path and a finish. It will feel fine even when the core interaction is bad. Watch one person do the single most repeated action in your product forty times instead, with no goal attached.'),
      BULLET('The equivalent of an hour in the trees is a session where the user is not trying to complete anything. If the main action is only tolerable in service of finishing a task, you have a chore with good signposting.'),
      BULLET('This is also the honest version of dogfooding. Using your own product to get work done is a progress test. Using the one screen you built forty times in a row is a verb test.'),

      H('Learning and craft', HeadingLevel.HEADING_2),
      BULLET('Finishing a course is progress. It feels like learning and is nearly failure-proof, which is exactly what makes it a poor measurement of whether you learned anything.'),
      BULLET('The verb test is to take one component, a single query pattern, a single scale, a single brush stroke, and do it for an hour with feedback and no completion to reach for. This is the part-task literature and the deliberate practice literature agreeing with each other.'),
      BULLET('If an hour of the component is unbearable, that is real information about the path, and it is better to have it in week one than in year two.'),

      H('Work and life', HeadingLevel.HEADING_2),
      BULLET('Job titles, promotions and salary bands are a progress structure laid over a set of daily verbs. A role can feel good on the ladder and be unpleasant on the hour. The verb test asks what the actual repeated actions are, and whether you would want to do those for an hour with nothing to reach.'),
      BULLET('The same reframe works on a hobby, a relationship or a house move. What is the thing you will do a thousand times, and is that thing good on its own.'),

      RULE,

      // ---- practice ----
      H('How to run a verb test', HeadingLevel.HEADING_1),
      NUM('Name the verb. One sentence, one action. If it takes two sentences you have named a system, not a verb, and you need to go narrower.'),
      NUM('Strip the progress. No score, no unlocks, no levels, no completion. In a game this means one enemy and no death. In a product it means one screen and no task.'),
      NUM('Keep the real numbers. A verb test on approximated values tunes something that is not your product.'),
      NUM('Instrument it. You are trying to convert a feeling into a number, so put every value you might change on a key, show it on screen, and give yourself a way to print the current settings when something finally feels right.'),
      NUM('Do it for an hour, and notice whether you want to stop.'),
      NUM('Decide, out loud, before adding anything else. The verb is fun, or it is not. If it is not, the fix is in the verb, and building around it will only make the problem more expensive.'),

      RULE,
      H('The one habit to keep', HeadingLevel.HEADING_1),
      PR([{ t: 'Before you judge whether something is good, remove the part of it that was always going to feel good. What is left is the thing you are actually shipping.', b: true, size: 24 }]),
      P('An hour in the trees, with the rupees left on the ground.', { color: MUTED, italics: true }),

      RULE,
      H('Sources', HeadingLevel.HEADING_1),
      P('Super Mario 64 developer roundtable, 1996, from the Japanese strategy guide. Translation: shmuplations.com/mario64', { size: SMALL }),
      P('Schreier, J. When Miyamoto First Played Zelda: Breath of the Wild, He Wouldn’t Stop Climbing Trees. Kotaku, 6 March 2017. Quoting director Hidemaro Fujibayashi.', { size: SMALL }),
      P('Motokura, K., interviewed by The Guardian, July 2025, on the development of Donkey Kong Bananza.', { size: SMALL }),
      P('Wightman, D. C., and Lintern, G. (1985). Part-task training for tracking and manual control. Human Factors, 27(3), 267 to 283. DOI 10.1177/001872088502700304', { size: SMALL }),
      P('Ericsson, K. A., Krampe, R. T., and Tesch-Roemer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363 to 406.', { size: SMALL }),
      P('Macnamara, B. N., and Maitra, M. (2019). Royal Society Open Science, 6(8), 190327. DOI 10.1098/rsos.190327', { size: SMALL })
    ]
  }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync('Test-the-Verb-Not-the-Progress.docx', b);
  console.log('written', b.length, 'bytes');
});
