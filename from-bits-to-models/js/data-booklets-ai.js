Object.assign(BOOKLETS, {
  "relevance": {
    "title": "Staying Relevant",
    "blurb": "What separates durable human contribution from the work AI increasingly automates, and how to build that durability on purpose, using the same task-level thinking this map applies to everything else.",
    "chapters": [
      {
        "title": "The shift this map has been building toward",
        "blocks": [
          {
            "t": "p",
            "x": "For most of this map, “automation” meant something narrow: a well-specified, repeatable task — sorting a list, running a payroll calculation, executing a fixed workflow. Large language models and the agents built on top of them (see agents and llm) change what counts as narrow. Drafting a memo, summarizing a document, writing a first pass of boilerplate code, answering a routine support ticket — tasks that used to require a person sitting down and composing something — are now cheap to automate at reasonable quality."
          },
          {
            "t": "p",
            "x": "The natural question — “will AI take my job?” — is the wrong unit of analysis. Jobs are bundles of dozens of distinct tasks, and bundles rarely disappear all at once; they get reshaped, task by task, as some tasks become cheap to automate and others do not. The useful question is task-level: which of the things I currently spend time on are moving toward automatic, which are moving toward AI-assisted, and which remain stubbornly mine — and why."
          },
          {
            "t": "note",
            "x": "This chapter and the next four treat “staying relevant” as an engineering problem with the same shape as everything else in this map: decompose the system into parts, understand which parts are changing, and design deliberately rather than reactively. The frameworks below come from labor economics and organizational design, not from career-advice intuition, precisely so the reasoning can be checked rather than just asserted."
          }
        ]
      },
      {
        "title": "Comparative advantage, not absolute advantage",
        "blocks": [
          {
            "t": "p",
            "x": "The most common mistake in reasoning about AI and work is assuming that if a machine is better than you at a task, there is no economic reason for you to keep doing it. That is true only if the machine has infinite capacity and zero cost to redirect — which is never the case. The right concept is comparative advantage, not absolute advantage: even a party that is worse at literally everything still has a task where its relative disadvantage is smallest, and specializing there makes the whole system more productive than either party working alone."
          },
          {
            "t": "worked",
            "q": "An engineer takes 3 hours to write a migration script from scratch, or 45 minutes to review and fix an AI-drafted script to the same safety standard. An AI can draft the same script, unreviewed, in about 3 minutes, but an unreviewed draft ships with an unacceptable defect rate. There are 6 scripts needed today and 6 working hours available. Compare working from scratch against draft-plus-review, and explain why the engineer's skill isn't now worthless.",
            "steps": [
              "From scratch: 3 hours per script. In 6 hours, the engineer alone finishes 6 / 3 = 2 scripts.",
              "Draft plus review: 45 minutes per script for review, since the AI draft itself is nearly free (3 minutes). 6 scripts × 45 minutes = 4.5 hours, which fits inside the 6-hour day with 1.5 hours to spare — all 6 ship.",
              "Throughput goes from 2 to 6 shippable scripts, a 3x increase, purely from reallocating the engineer's time from generating code to judging it.",
              "The engineer's coding skill did not become worthless: it is the exact skill that makes a 45-minute review possible instead of a 3-hour rewrite. Someone without that skill cannot review effectively at all — they can only regenerate, which is slower than the AI and no more trustworthy."
            ],
            "answer": "6 scripts ship instead of 2, a 3x increase in throughput. The engineer's value moved from writing to verifying, and verifying well requires — arguably more than writing does — the same underlying expertise, since you must catch what you didn't produce yourself."
          },
          {
            "t": "p",
            "x": "This is the same argument David Ricardo made about trade between countries, applied to a single worker and a model instead of two nations. It does not promise that every task you currently do will remain valuable — some genuinely won't, if the review step itself gets automated too. What it does promise is that the reasoning “the AI is better at X, therefore humans doing X-adjacent work are obsolete” is an absolute-advantage argument, and absolute advantage is the wrong test."
          }
        ]
      },
      {
        "title": "Mapping task exposure",
        "blocks": [
          {
            "t": "p",
            "x": "Labor economists have long organized tasks along two axes: routine versus non-routine, and manual versus cognitive. Industrial and early software automation ate into routine work on both axes — routine-manual (assembly lines, barcode scanning) and routine-cognitive (payroll, basic bookkeeping) — while leaving non-routine work, manual or cognitive, largely untouched, because it couldn't be reduced to a fixed procedure. Generative AI is the first technology to meaningfully push the automation frontier into non-routine cognitive territory: drafting, summarizing and first-pass synthesis are non-routine in the sense that no two instances are identical, yet a language model handles them without a hand-written procedure for each case."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 760 470\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"110\" y1=\"50\" x2=\"110\" y2=\"380\" stroke=\"#2E3438\"/>\n<line x1=\"110\" y1=\"380\" x2=\"700\" y2=\"380\" stroke=\"#2E3438\"/>\n<text x=\"40\" y=\"58\" font-size=\"11.5\" fill=\"#666D72\">cognitive</text>\n<text x=\"40\" y=\"384\" font-size=\"11.5\" fill=\"#666D72\">manual</text>\n<text x=\"130\" y=\"402\" font-size=\"12\" fill=\"#9AA1A6\">routine</text>\n<text x=\"560\" y=\"402\" font-size=\"12\" fill=\"#9AA1A6\">non-routine</text>\n<line x1=\"480\" y1=\"54\" x2=\"512\" y2=\"54\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/>\n<text x=\"520\" y=\"58\" font-size=\"11\" fill=\"#9AA1A6\">automation, pre-genAI</text>\n<line x1=\"480\" y1=\"76\" x2=\"512\" y2=\"76\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/>\n<text x=\"520\" y=\"80\" font-size=\"11\" fill=\"#EDEFF0\">automation, with genAI</text>\n<polyline points=\"110,380 190,290 230,150\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/>\n<polyline points=\"110,380 260,260 420,120\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/>\n<circle cx=\"125\" cy=\"330\" r=\"4.5\" fill=\"#666D72\"/>\n<text x=\"135\" y=\"334\" font-size=\"12\" fill=\"#9AA1A6\">A</text>\n<circle cx=\"235\" cy=\"240\" r=\"4.5\" fill=\"#9AA1A6\"/>\n<text x=\"245\" y=\"236\" font-size=\"12\" fill=\"#EDEFF0\">B</text>\n<circle cx=\"300\" cy=\"175\" r=\"4.5\" fill=\"#9AA1A6\"/>\n<text x=\"310\" y=\"171\" font-size=\"12\" fill=\"#EDEFF0\">C</text>\n<circle cx=\"560\" cy=\"160\" r=\"4.5\" fill=\"#EDEFF0\"/>\n<text x=\"570\" y=\"156\" font-size=\"12\" fill=\"#EDEFF0\">D</text>\n<circle cx=\"620\" cy=\"210\" r=\"4.5\" fill=\"#EDEFF0\"/>\n<text x=\"630\" y=\"206\" font-size=\"12\" fill=\"#EDEFF0\">E</text>\n<text x=\"110\" y=\"424\" font-size=\"11.5\" fill=\"#9AA1A6\">A payroll processing &#183; B drafting boilerplate code &#183; C summarizing a meeting</text>\n<text x=\"110\" y=\"444\" font-size=\"11.5\" fill=\"#EDEFF0\">D diagnosing a novel outage &#183; E negotiating deal terms</text>\n</svg>",
            "cap": "A stylized map of tasks by how routine and how cognitive they are. The automation frontier has always crept rightward; generative AI just moved it further and faster into non-routine cognitive work — leaving judgment, accountability and novel synthesis on the far side, for now."
          },
          {
            "t": "p",
            "x": "Doing this exercise for your own role — listing the actual tasks in a week and placing each one on this map — is more useful than any abstract debate about whether “your job” is safe. Some tasks will already sit behind the frontier (already automated, nothing to defend). Some will sit in the newly-crossed zone (AI can produce a usable first draft; your job is increasingly to direct and check it, not originate it). And some will sit beyond the current frontier — not because they're inherently unautomatable forever, but because they require context, accountability or judgment the current generation of tools doesn't reliably supply."
          },
          {
            "t": "list",
            "items": [
              "<strong>Behind the frontier</strong>: fully automated already, often for years — no defense needed, no nostalgia warranted.",
              "<strong>Newly crossed</strong>: AI produces a usable first pass; the durable version of this task is directing and checking it, not doing it from a blank page.",
              "<strong>Beyond the frontier, for now</strong>: novel synthesis under ambiguity, judgment calls with real consequences, and anything requiring accountability a model cannot hold.",
              "<strong>Moving</strong>: the frontier is not static — a task in the third bucket this year can be in the second bucket next year, which is why this is a mapping exercise to repeat, not a survey to take once."
            ]
          }
        ]
      },
      {
        "title": "The jagged frontier and the verification gap",
        "blocks": [
          {
            "t": "p",
            "x": "If the frontier moved smoothly, planning around it would be simple: watch it approach, retreat in an orderly line. It doesn't move smoothly. Researchers studying generative AI in real work describe a “jagged frontier”: current models are superhuman at some non-routine cognitive tasks (recalling facts across widely separated domains, producing fluent text in an unfamiliar register, writing correct boilerplate in a language you don't know) and unreliable at others that look, to a person, similarly hard — tracking a long chain of constraints without dropping one, knowing the boundary of what it actually knows, or catching its own arithmetic slip three steps back."
          },
          {
            "t": "p",
            "x": "The jaggedness matters because model failures are not evenly distributed and are frequently confident rather than hedged. A model that is unsure tends to sound exactly as fluent as a model that is certain, which means the tell you'd use to distrust an unsure colleague — hesitation — isn't available. This pushes real economic value toward verification: judging whether a given output is correct, safe and fit for purpose, which is a distinct skill from generating the output and, on the jagged parts of the frontier, sometimes a harder one."
          },
          {
            "t": "note",
            "x": "Watch for the “accountability sink” failure mode: a process that nominally has “a human in the loop” but where that human has neither the time, the information, nor the real authority to catch an error — they exist to be blamed, not to actually verify. A human-in-the-loop step only adds value if the human has the expertise and standing to say no and have it matter. Designing that in, for your own work and for systems you build, is itself part of staying relevant."
          },
          {
            "t": "p",
            "x": "This is also why fields with clear, checkable ground truth (does the code compile and pass its tests, does the citation exist, does the number reconcile) tend to adopt AI assistance fastest and most safely — verification is cheap there. Fields where correctness is a matter of judgment rather than a check — was this the right strategic call, is this argument actually persuasive to this specific audience — are exactly where the verification gap, and therefore the durable human role, is largest."
          }
        ]
      },
      {
        "title": "What to actually build",
        "blocks": [
          {
            "t": "p",
            "x": "Given the shape of the problem — comparative advantage still applies, the frontier is jagged, and value concentrates in verification and judgment — four concrete practices follow, in roughly the order they compound."
          },
          {
            "t": "p",
            "x": "<strong>Build genuine depth somewhere.</strong> Verification-grade judgment isn't free; it comes from having done the underlying work yourself enough times to have a felt sense of what right looks like, including the ways it can be subtly wrong. This is tacit knowledge — the kind that resists being written down as a rule, built through repetition with feedback — and it's exactly what lets you catch a plausible-sounding error a less experienced reviewer would wave through."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 700 400\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"70\" y=\"90\" width=\"56\" height=\"230\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1.2\"/>\n<text x=\"98\" y=\"74\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">single deep skill</text>\n<text x=\"98\" y=\"344\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">I-shaped</text>\n<text x=\"205\" y=\"212\" text-anchor=\"middle\" font-size=\"13\" fill=\"#666D72\">vs</text>\n<rect x=\"280\" y=\"90\" width=\"300\" height=\"40\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"430\" y=\"74\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">AI-collaboration breadth</text>\n<rect x=\"406\" y=\"130\" width=\"48\" height=\"190\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"430\" y=\"344\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">verification-grade depth</text>\n<text x=\"430\" y=\"364\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">T-shaped</text>\n</svg>",
            "cap": "Depth alone no longer differentiates when AI can reach into any single specialty on demand; the durable profile pairs broad fluency working alongside AI across domains with at least one area verified deeply enough to catch what the model gets wrong and take responsibility for the result."
          },
          {
            "t": "p",
            "x": "<strong>Build genuine breadth in working with the tools.</strong> Prompting well, knowing which task shapes a model handles reliably versus unreliably, structuring a workflow so the model's output is easy to check rather than a wall of prose to re-derive from scratch — this is now a baseline skill, the way using a search engine or a spreadsheet became one. It is a means to leverage your depth further, not a substitute for having any."
          },
          {
            "t": "p",
            "x": "<strong>Think in systems, not tasks.</strong> Automating individual tasks inside an unchanged process just makes the process cheaper at the same shape. The larger opportunity — and the more durable one, since it requires understanding what the process is actually for — is redesigning the process itself once some of its steps are nearly free. That's a job for someone who understands the whole system, not just the automatable piece of it."
          },
          {
            "t": "p",
            "x": "<strong>Take real accountability.</strong> Being willing to put your name on a decision, own its consequences, and be the party a stakeholder can actually hold responsible is not automatable by construction — it requires having something at stake, which a model does not. Roles built around this (not “I used AI to help” but “I stand behind this”) are structurally durable regardless of how capable the tools become."
          }
        ]
      },
      {
        "title": "A learning loop, not a one-time fix",
        "blocks": [
          {
            "t": "p",
            "x": "The frontier keeps moving, so this can't be a project with an end date. Treat it the way you'd treat keeping a system's dependencies current: a recurring loop rather than a single migration."
          },
          {
            "t": "list",
            "items": [
              "<strong>Re-map periodically.</strong> Redo the task-exposure exercise from earlier in this chapter every few months, not once — a task that was safely “beyond the frontier” a year ago may not be now.",
              "<strong>Practice the verification-heavy tasks deliberately</strong>, the way you'd practice any skill you wanted to actually improve, rather than only doing them as a byproduct of other work.",
              "<strong>Stay close enough to the tools to know their current failure modes.</strong> A verification instinct calibrated on last year's model is stale; the specific ways today's tools go wrong are different from the ways last year's did, and “AI makes mistakes, be careful” is too vague to actually catch anything.",
              "<strong>Notice when a task you own has quietly crossed the frontier</strong>, and move toward directing and checking it rather than defending the old way of doing it from scratch — the defense is rarely winnable and the redirection usually is."
            ]
          },
          {
            "t": "p",
            "x": "None of this is a guarantee — comparative advantage describes what's efficient for the system as a whole, not what any individual employer will actually choose to do, and real labor markets are slower and messier than the clean economic argument. But of the levers available to a single person, task-level awareness, deliberate depth, tool fluency, systems thinking and real accountability are the ones that hold up across most ways the next few years could go, which is the most any framework in this map claims for anything."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "These mirror the reasoning above rather than asking you to recall it — work through the numbers and the classification, don't just match a term to a definition."
          }
        ],
        "exercises": [
          {
            "q": "A translator can produce a publishable translation in 5 hours from scratch, or review and correct an AI machine-translation draft to the same quality in 40 minutes. The AI produces a draft in under a minute, but for this language pair it introduces a subtle mistranslation roughly once per page that only a fluent human reader would catch. Nine documents are due and 6 hours are available. What does draft-plus-review make possible that working from scratch does not, and why doesn't this make the translator's expertise worth less?",
            "steps": [
              "From scratch: 5 hours per document means at most 1 document finishes in a 6-hour day.",
              "Draft plus review: 40 minutes per document × 9 = 6 hours exactly — all 9 ship inside the day.",
              "Throughput goes from 1 document to 9, a 9x increase, because the AI's near-free draft removes the slowest part (producing correct-sounding text) while leaving the part only the translator can do (catching the mistranslation) intact.",
              "The translator's expertise is what makes the 40-minute review reliable at all — without fluency in both languages, the subtle mistranslation is exactly the kind of error that passes an unqualified check."
            ],
            "answer": "9 documents ship instead of 1. The value didn't disappear, it moved: from producing fluent text (now cheap) to catching the one-per-page error that fluent-sounding-but-wrong text hides (still expensive, and only a fluent human can do it)."
          },
          {
            "q": "Using the routine/non-routine × manual/cognitive map, which pair of tasks belongs in the same quadrant as “converting raw meeting notes into a standard status-report template”?",
            "steps": [
              "The example task is cognitive (it requires reading and organizing information) and routine (same template, same shape, every time).",
              "A same-quadrant task must also be routine-cognitive: repeatable, procedural, and mental rather than physical.",
              "Data entry into a fixed form and running a standard payroll calculation fit that description exactly.",
              "Negotiating a contract's terms and repairing a pipe in a cramped basement are both non-routine (no fixed procedure) — the first cognitive, the second manual — so neither shares the quadrant."
            ],
            "answer": "Data entry into a fixed form / running a standard payroll calculation.",
            "kind": "mc",
            "options": [
              "Data entry into a fixed form and running a standard payroll calculation",
              "Negotiating a contract's business terms",
              "Diagnosing a novel production outage",
              "Repairing an aging pipe in a cramped basement"
            ],
            "correct": 0
          },
          {
            "q": "A model drafts a legal-sounding contract clause fluently, complete with a citation to a supporting case — except the case doesn't exist. Which idea from this chapter does this best illustrate, and what follows from it?",
            "steps": [
              "The model is highly capable at one non-routine cognitive task (producing fluent, structurally correct legal prose) and unreliable at an adjacent one (citing only real cases) — that unevenness is the jagged frontier.",
              "The failure is confident, not hedged, so the usual social cue for distrust (hesitation) isn't available.",
              "This is exactly the scenario where verification requires real domain expertise — checking a citation exists and says what it's claimed to say — not just a fluency check.",
              "It follows that a lawyer's role here shifts toward verification of exactly this kind, and that role does not shrink as the model's fluency improves — the two are separate axes."
            ],
            "answer": "The jagged frontier: high fluency does not imply high reliability, and the gap between them is precisely where expert verification remains valuable.",
            "kind": "mc",
            "options": [
              "The jagged frontier: high fluency does not imply high reliability, and the gap between them is exactly where expert verification remains valuable",
              "Comparative advantage: the lawyer should stop writing clauses entirely",
              "Absolute advantage: since the model drafts faster, humans should not be involved",
              "This shows the model has no legal knowledge at all"
            ],
            "correct": 0
          },
          {
            "kind": "write",
            "q": "The economic principle explaining why a worker can still have a valuable specialty even if a machine outperforms them at literally every task is called ___ advantage.",
            "accept": [
              "comparative"
            ],
            "hint": "two words, from classical trade theory",
            "steps": [
              "Absolute advantage compares raw capability at one task in isolation.",
              "Comparative advantage compares opportunity cost across tasks — what you give up by doing one instead of another.",
              "Specializing where your relative disadvantage is smallest makes the whole system produce more than either party working alone."
            ],
            "answer": "Comparative advantage — the same reasoning Ricardo applied to trade between nations, applied here to a person working alongside a model."
          },
          {
            "kind": "write",
            "q": "A skill profile combining broad working fluency across many domains with deep, verification-grade expertise in one or two is usually called a ___ skill profile.",
            "accept": [
              "t-shaped",
              "t shaped"
            ],
            "hint": "named after the shape of a letter",
            "steps": [
              "The horizontal bar represents breadth: enough fluency across domains to direct and sanity-check work, including AI-assisted work, in most of them.",
              "The vertical stem represents depth: expertise deep enough in at least one area to catch subtle errors and take real responsibility for the result.",
              "Neither alone is sufficient once AI supplies shallow competence in almost everything on demand."
            ],
            "answer": "T-shaped — breadth across the top, a verification-grade spike of depth beneath it."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Comparative advantage",
        "Having the lowest opportunity cost at a task, which can justify specializing in it even without being the best at it in absolute terms."
      ],
      [
        "Absolute advantage",
        "Being simply better at a task than another party, in isolation — the wrong test for deciding who should do what."
      ],
      [
        "Opportunity cost",
        "What you give up by spending time on one task instead of the next-best alternative."
      ],
      [
        "Task decomposition",
        "Breaking a job into its constituent tasks so each can be assessed separately rather than treating “the job” as one indivisible unit."
      ],
      [
        "Automation exposure",
        "How susceptible a given task is to being automated, typically assessed along the routine/cognitive axes."
      ],
      [
        "Routine task",
        "A task reducible to a fixed, repeatable procedure — historically the easiest category to automate."
      ],
      [
        "Non-routine task",
        "A task without a fixed procedure, requiring judgment or adaptation to the specific case."
      ],
      [
        "Automation frontier",
        "The boundary between tasks currently automated and tasks currently requiring a person; it has moved rightward for two centuries and generative AI just accelerated it."
      ],
      [
        "Jagged frontier",
        "The observation that AI capability is uneven across tasks that look similarly hard to a human, making failures hard to predict from task difficulty alone."
      ],
      [
        "Verification gap",
        "The value created by checking whether an AI-generated output is correct and fit for purpose, distinct from the value of generating it."
      ],
      [
        "Tacit knowledge",
        "Know-how built through repeated practice and feedback that resists being written down as an explicit rule."
      ],
      [
        "Accountability sink",
        "A process where a nominal “human in the loop” lacks the time, information or authority to actually catch an error — present to be blamed, not to verify."
      ],
      [
        "Human-in-the-loop",
        "A design in which a person reviews or approves a system's output before it takes effect — only meaningful if that person can genuinely catch errors."
      ],
      [
        "T-shaped skills",
        "Broad working competence across many areas combined with deep expertise in one or two."
      ],
      [
        "AI literacy",
        "Practical fluency in directing, prompting and checking AI-assisted work, treated as a baseline skill rather than a specialization."
      ],
      [
        "Systems thinking",
        "Reasoning about how a task fits into and shapes a larger process, rather than optimizing the task in isolation."
      ]
    ]
  },
  "cv": {
      "title": "Computer Vision",
      "blurb": "Reading a location-aware answer out of a CNN's feature hierarchy — where an object is, not only what it is, down to individual pixels when the task calls for it.",
      "chapters": [
        {
          "title": "From one label per image to structure within it",
          "blocks": [
            {
              "t": "p",
              "x": "Image classification — the task the CNN booklet builds toward — picks the single best-matching class for a whole image. Plenty of real problems need more than that: object detection asks for a bounding box and a class label for every object instance present in the image, and segmentation asks for a decision at every individual pixel. All three tasks are built on the same CNN feature hierarchy; they differ only in what's read out of it and how."
            },
            {
              "t": "p",
              "x": "This chapter maps the shapes of those tasks before the following chapters cover how they're actually solved and evaluated."
            }
          ]
        },
        {
          "title": "Object detection and intersection over union",
          "blocks": [
            {
              "t": "p",
              "x": "A detector outputs a set of bounding boxes, each with coordinates (commonly x1, y1, x2, y2 for the top-left and bottom-right corners), a predicted class, and a confidence score. Detectors are typically built directly on a CNN backbone: later, coarser feature maps are good at recognizing what an object is, while combining them with earlier, finer feature maps helps localize where it is."
            },
            {
              "t": "p",
              "x": "Intersection over union (IoU) is the standard measure of how well a predicted box matches a ground-truth box: IoU = (area of overlap) / (area of union). IoU = 1 means a perfect match; IoU = 0 means no overlap at all. A detection is usually only counted as correct if its IoU with the true box clears some threshold, commonly 0.5."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 560 340\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">intersection over union (IoU) of two boxes</text>\n<rect x=\"110\" y=\"90\" width=\"80\" height=\"120\" fill=\"#FFFFFF\" fill-opacity=\"0.14\" stroke=\"none\"/>\n<rect x=\"40\" y=\"60\" width=\"150\" height=\"150\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/>\n<text x=\"46\" y=\"80\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">box A</text>\n<rect x=\"110\" y=\"90\" width=\"140\" height=\"140\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"2\" stroke-dasharray=\"6,3\"/>\n<text x=\"204\" y=\"220\" font-size=\"13\" fill=\"#DDE3E7\" font-weight=\"700\">box B</text>\n<text x=\"20\" y=\"270\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">area A = 150&#215;150 = 22500   area B = 140&#215;140 = 19600</text>\n<text x=\"20\" y=\"292\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">intersection = 80&#215;120 = 9600   union = 22500+19600&#8722;9600 = 32500</text>\n<text x=\"20\" y=\"314\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\" class=\"mono\">IoU = 9600/32500 &#8776; 0.295</text>\n</svg>",
              "cap": "Box A (150×150, area 22,500) and box B (140×140, area 19,600) overlap in an 80×120 region (area 9,600). Union = 22,500 + 19,600 − 9,600 = 32,500, so IoU = 9,600/32,500 ≈ 0.295 — below the common 0.5 threshold, so these would not be counted as the same detection."
            },
            {
              "t": "worked",
              "q": "Verify the figure's IoU by hand from the two boxes' coordinates: A=(50,50,200,200), B=(120,80,260,220).",
              "steps": [
                "Each box's area is (x2−x1)×(y2−y1): A is (200−50)×(200−50) = 150×150 = 22,500; B is (260−120)×(220−80) = 140×140 = 19,600.",
                "The intersection's coordinates are the tighter of each pair of bounds: x from max(50,120)=120 to min(200,260)=200 (width 80); y from max(50,80)=80 to min(200,220)=200 (height 120). Intersection area = 80×120 = 9,600.",
                "Union = 22,500 + 19,600 − 9,600 = 32,500, so IoU = 9,600/32,500 ≈ 0.295."
              ]
            }
          ]
        },
        {
          "title": "Non-max suppression",
          "blocks": [
            {
              "t": "p",
              "x": "A detector typically proposes several overlapping boxes around the same real object, each with its own confidence score. Non-max suppression (NMS) is the standard cleanup pass: sort all candidate boxes by confidence score, keep the highest-scoring one, discard every remaining box whose IoU with it exceeds a threshold (since a high IoU with an already-kept box means it's almost certainly a duplicate detection of the same object, not a separate one), and repeat with whatever boxes are left."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 1180 380\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">non-max suppression, threshold IoU &gt; 0.5</text>\n<text x=\"20\" y=\"46\" font-size=\"11.5\" fill=\"#666D72\">box 1 (.95) and box 2 (.83) have IoU &#8776; 0.85 with each other &#8212; box 2 is a duplicate and gets suppressed; box 3 (.90) has IoU = 0 with box 1, so it survives</text>\n<text x=\"40\" y=\"80\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">before</text>\n<rect x=\"90\" y=\"50\" width=\"150\" height=\"150\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<circle cx=\"106\" cy=\"66\" r=\"12\" fill=\"#0C0E0F\" stroke=\"#FFFFFF\" stroke-width=\"1.4\"/>\n<text x=\"106\" y=\"71\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">1</text>\n<rect x=\"100\" y=\"55\" width=\"145\" height=\"150\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.8\" stroke-dasharray=\"6,3\"/>\n<circle cx=\"229\" cy=\"189\" r=\"12\" fill=\"#0C0E0F\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/>\n<text x=\"229\" y=\"194\" text-anchor=\"middle\" font-size=\"13\" fill=\"#DDE3E7\" font-weight=\"700\">2</text>\n<rect x=\"270\" y=\"60\" width=\"100\" height=\"100\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<circle cx=\"286\" cy=\"76\" r=\"12\" fill=\"#0C0E0F\" stroke=\"#FFFFFF\" stroke-width=\"1.4\"/>\n<text x=\"286\" y=\"81\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">3</text>\n<text x=\"420\" y=\"80\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">after</text>\n<rect x=\"470\" y=\"50\" width=\"150\" height=\"150\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<circle cx=\"486\" cy=\"66\" r=\"12\" fill=\"#0C0E0F\" stroke=\"#FFFFFF\" stroke-width=\"1.4\"/>\n<text x=\"486\" y=\"71\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">1</text>\n<rect x=\"480\" y=\"55\" width=\"145\" height=\"150\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"3,3\"/>\n<rect x=\"650\" y=\"60\" width=\"100\" height=\"100\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<circle cx=\"666\" cy=\"76\" r=\"12\" fill=\"#0C0E0F\" stroke=\"#FFFFFF\" stroke-width=\"1.4\"/>\n<text x=\"666\" y=\"81\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">3</text>\n<line x1=\"20\" y1=\"320\" x2=\"1160\" y2=\"320\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<circle cx=\"34\" cy=\"340\" r=\"11\" fill=\"#0C0E0F\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/>\n<text x=\"34\" y=\"344\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" font-weight=\"700\">1</text>\n<text x=\"54\" y=\"344\" font-size=\"12.5\" fill=\"#DDE3E7\">score .95 &#8212; highest score, always kept</text>\n<circle cx=\"380\" cy=\"340\" r=\"11\" fill=\"#0C0E0F\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/>\n<text x=\"380\" y=\"344\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" font-weight=\"700\">2</text>\n<text x=\"400\" y=\"344\" font-size=\"12.5\" fill=\"#DDE3E7\">score .83, IoU .85 with box 1 &#8212; suppressed</text>\n<circle cx=\"820\" cy=\"340\" r=\"11\" fill=\"#0C0E0F\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/>\n<text x=\"820\" y=\"344\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" font-weight=\"700\">3</text>\n<text x=\"840\" y=\"344\" font-size=\"12.5\" fill=\"#DDE3E7\">score .90, IoU 0 with box 1 &#8212; kept</text>\n</svg>",
              "cap": "Three candidate boxes before NMS: box 1 (score .95) and box 2 (score .83) have IoU ≈ 0.85 with each other, box 3 (score .90) has IoU = 0 with box 1. After NMS at threshold 0.5: box 2 is discarded as a duplicate of the higher-scoring box 1, while box 3, having no meaningful overlap with box 1, survives."
            },
            {
              "t": "worked",
              "q": "At an NMS threshold of 0.5, which of boxes 2 and 3 in the figure gets suppressed, and why?",
              "steps": [
                "Box 1 has the highest score (.95) and is kept automatically as the starting point.",
                "Box 2's IoU with box 1 is about 0.85, which exceeds the 0.5 threshold — box 2 is discarded as a duplicate detection of the same object box 1 already covers.",
                "Box 3's IoU with box 1 is 0 (no overlap at all), which is below the threshold — box 3 survives as a genuinely separate detection."
              ]
            }
          ]
        },
        {
          "title": "Semantic vs instance segmentation",
          "blocks": [
            {
              "t": "p",
              "x": "Semantic segmentation assigns a class label to every pixel, but does not distinguish between separate instances of the same class: two adjacent cars in an image both get labeled “car,” merged into one region. Instance segmentation goes further, additionally separating individual object instances — car #1 and car #2 get distinct masks even though both are still labeled “car.”"
            },
            {
              "t": "p",
              "x": "Both build on a CNN backbone's feature hierarchy, typically upsampling the coarse, spatially-reduced but semantically-rich feature maps from deep in the network back toward the original image's resolution, so that a decision can be made at (or close to) every original pixel rather than only at the coarser resolution the backbone naturally produces."
            }
          ]
        },
        {
          "title": "Data efficiency: augmentation and transfer learning",
          "blocks": [
            {
              "t": "p",
              "x": "Vision datasets are expensive to label precisely because the labels themselves are expensive to produce — a bounding box takes longer to draw than a single class tag, and a pixel-level segmentation mask takes longer still. Two techniques dominate practice as a result. Data augmentation applies label-preserving transformations — random crops, flips, color jitter, small rotations — that change an image's pixels without changing what's actually in it, forcing the network to learn features that are invariant to those changes rather than memorizing exact pixel arrangements, extending the effective size of a fixed labeled dataset without collecting a single new label."
            },
            {
              "t": "p",
              "x": "Transfer learning starts from a model already pretrained on a large, generic dataset (whose features, per the CNN booklet's feature-hierarchy chapter, tend to be broadly reusable — edge and texture detectors in particular), and then fine-tunes only some portion of it — commonly just the final classification or detection head, or the whole network at a low learning rate — on the smaller, task-specific labeled dataset actually available."
            }
          ]
        },
        {
          "title": "Where computer vision sits in this map",
          "blocks": [
            {
              "t": "p",
              "x": "Nearly every technique in this booklet is built directly on the CNN booklet's feature hierarchy: object detection and segmentation are best understood as different ways of reading a location-aware answer out of the same convolutional features that a classifier would otherwise reduce straight to a single label, not as separate architecture families invented from nothing. And whichever task is at hand, it's still held to the same evaluation discipline the model evaluation booklet covers — accuracy just gets replaced by task-specific metrics, like mean average precision for detection, that account for localization quality (via IoU) as well as classification correctness."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-run the IoU and NMS reasoning with new boxes and check the ideas behind segmentation types and data efficiency."
            }
          ],
          "exercises": [
            {
              "q": "Compute the IoU of box A=(0,0,100,100) and box B=(50,50,150,150).",
              "steps": [
                "Each box has area 100×100 = 10,000.",
                "The intersection spans x from max(0,50)=50 to min(100,150)=100 (width 50), and y from max(0,50)=50 to min(100,150)=100 (height 50), giving intersection area 50×50 = 2,500.",
                "Union = 10,000 + 10,000 − 2,500 = 17,500, so IoU = 2,500/17,500 ≈ 0.143."
              ],
              "answer": "IoU ≈ 0.143."
            },
            {
              "kind": "mc",
              "q": "In non-max suppression, why is a lower-confidence box discarded when its IoU with an already-kept, higher-confidence box exceeds the threshold?",
              "options": [
                "A high IoU with an already-kept box means it's almost certainly a duplicate detection of the same object, not a genuinely separate one",
                "Lower-confidence boxes are always wrong regardless of their position",
                "NMS discards every box below the highest confidence score in the whole image, regardless of overlap",
                "IoU has nothing to do with NMS; boxes are discarded purely by a fixed rank cutoff"
              ],
              "correct": 0,
              "steps": [
                "NMS keeps the highest-scoring box first, then checks every remaining box's IoU against it.",
                "A high IoU means the two boxes cover nearly the same region — almost certainly the same physical object detected twice.",
                "So the lower-scoring, heavily-overlapping box is redundant and gets discarded — but a low-overlap box, even at a lower score, survives as a separate detection, which rules out both a pure rank cutoff and a blanket rejection of all lower-confidence boxes."
              ],
              "answer": "A high IoU with an already-kept box signals a duplicate detection of the same object, so the lower-scoring duplicate is discarded — boxes with low overlap survive regardless of score."
            },
            {
              "kind": "write",
              "q": "The segmentation task that gives every individual object instance its own separate mask, even when two instances share the same class label, is called ___ segmentation.",
              "accept": [
                "instance",
                "instance segmentation"
              ],
              "hint": "contrast with semantic segmentation",
              "steps": [
                "Semantic segmentation labels every pixel by class but merges same-class instances together.",
                "The task that additionally separates individual objects of the same class into their own masks is instance segmentation.",
                "This is why two adjacent cars get one merged “car” region under semantic segmentation, but two distinct masks under instance segmentation."
              ],
              "answer": "Instance segmentation."
            },
            {
              "q": "Compute the IoU of two boxes that share no overlap at all: A=(0,0,50,50), B=(100,100,150,150).",
              "steps": [
                "The x-ranges (0–50 and 100–150) don't overlap at all, so the intersection area is 0 regardless of the y-ranges.",
                "Union = area A + area B − 0 = 2,500 + 2,500 = 5,000.",
                "IoU = 0/5,000 = 0."
              ],
              "answer": "IoU = 0."
            },
            {
              "kind": "mc",
              "q": "What is the main practical reason vision work leans so heavily on data augmentation and transfer learning rather than training a large model from scratch on a small labeled dataset?",
              "options": [
                "Pixel- and box-level labels are expensive to produce, so reusing pretrained features and generating label-preserving pixel variations substitutes for labeled data that isn't affordable to collect at scale",
                "Augmented and pretrained models always achieve exactly 100% accuracy",
                "Training from scratch is mathematically impossible for any CNN architecture",
                "Augmentation and transfer learning eliminate the need for any labeled data whatsoever"
              ],
              "correct": 0,
              "steps": [
                "Every extra label (a class tag, a box, a pixel mask) costs real annotation time and money, which limits how much labeled data most projects can actually afford.",
                "Data augmentation manufactures more effective training variety from the labels already on hand; transfer learning reuses features already learned from someone else's larger labeled dataset.",
                "Neither guarantees perfect accuracy or removes the need for labels entirely — they're specifically a response to labeled data being scarce and expensive, not a way to avoid needing it altogether."
              ],
              "answer": "Pixel- and box-level labels are expensive, so augmentation and transfer learning substitute for labeled data that's too costly to collect at the scale a from-scratch model would need."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Image classification",
          "Assigning a single best-matching class label to a whole image."
        ],
        [
          "Object detection",
          "Predicting a bounding box and class label for every object instance in an image."
        ],
        [
          "Bounding box",
          "A rectangle, typically given by two corner coordinates, marking where an object is located."
        ],
        [
          "Intersection over union (IoU)",
          "The area of overlap between two boxes divided by the area of their union, measuring how well they match."
        ],
        [
          "Confidence score",
          "A detector's predicted probability that a given box actually contains the object it claims."
        ],
        [
          "Non-max suppression (NMS)",
          "Discarding lower-confidence boxes that overlap an already-kept, higher-confidence box beyond a threshold."
        ],
        [
          "Ground truth box",
          "The correct, human-labeled bounding box a prediction is compared against."
        ],
        [
          "Semantic segmentation",
          "Labeling every pixel by class, without distinguishing separate instances of the same class."
        ],
        [
          "Instance segmentation",
          "Labeling every pixel by class and separating individual object instances of the same class."
        ],
        [
          "Backbone",
          "The convolutional feature-extraction stack that detection and segmentation heads read from."
        ],
        [
          "Upsampling",
          "Increasing a feature map's spatial resolution, used to bring coarse deep features back toward pixel resolution."
        ],
        [
          "Data augmentation",
          "Applying label-preserving transformations to training images to increase effective data variety."
        ],
        [
          "Transfer learning",
          "Starting from a model pretrained on a different, larger dataset rather than training from scratch."
        ],
        [
          "Fine-tuning",
          "Continuing to train some or all of a pretrained model's parameters on a new, typically smaller, dataset."
        ],
        [
          "Mean average precision (mAP)",
          "A detection-specific evaluation metric accounting for both localization (via IoU) and classification correctness."
        ]
      ]
    },
  "nlp":   {
      "title": "Natural Language Processing",
      "blurb": "Turning text into units a model can compute over, from splitting it into tokens through to the classic pipeline tasks that read structure and meaning out of it — the layer that sits underneath every language model.",
      "chapters": [
        {
          "title": "From characters to tokens",
          "blocks": [
            {
              "t": "p",
              "x": "A model cannot compute over raw text; the first decision in any language pipeline is how to split it into a finite vocabulary of discrete units, called tokens, that get mapped to embeddings (see the embeddings booklet). That decision has real consequences downstream, so it is worth taking seriously rather than treating as boilerplate."
            },
            {
              "t": "p",
              "x": "Word-level tokenization is the most intuitive choice, but it produces a huge vocabulary and, worse, an unavoidable out-of-vocabulary (OOV) problem: any word not seen during vocabulary construction has no embedding at all. Character-level tokenization solves OOV completely — there are only a few dozen characters — but produces very long sequences and pushes all the work of recognizing morphology and word structure onto the model."
            },
            {
              "t": "p",
              "x": "Subword tokenization is the practical middle ground almost every current system uses: common whole words stay as single tokens, while rarer or unseen words decompose into smaller, still-meaningful pieces built from a shared vocabulary. It caps vocabulary size, has no OOV problem (any string can be built from characters if nothing larger matches), and keeps sequences much shorter than character-level splitting."
            }
          ]
        },
        {
          "title": "Byte-pair encoding, worked",
          "blocks": [
            {
              "t": "p",
              "x": "Byte-pair encoding (BPE) is the standard way to build a subword vocabulary. Start with every word split into individual characters plus an end-of-word marker. Count every adjacent pair of symbols across the whole corpus, merge the single most frequent pair into one new symbol, and repeat for a fixed number of merges (or until a target vocabulary size is reached). Each merge adds exactly one new token to the vocabulary."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 420\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">byte-pair encoding — 4 merges over a tiny corpus</text>\n<text x=\"20\" y=\"50\" font-size=\"12\" fill=\"#DDE3E7\" class=\"mono\">corpus: low&#215;5  lowest&#215;2  newer&#215;6  wider&#215;3  new&#215;2   (start: split to characters)</text>\n\n<text x=\"20\" y=\"86\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">merge 1: (e, r) &#8594; er   [seen 9&#215;, across newer + wider]</text>\n<text x=\"20\" y=\"118\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">merge 2: (er, &lt;/w&gt;) &#8594; er&lt;/w&gt;   [end-of-word marker, still 9&#215;]</text>\n<text x=\"20\" y=\"150\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">merge 3: (n, e) &#8594; ne   [seen 8&#215;, across newer + new]</text>\n<text x=\"20\" y=\"182\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">merge 4: (ne, w) &#8594; new   [still 8&#215;]</text>\n\n<line x1=\"20\" y1=\"204\" x2=\"620\" y2=\"204\" stroke=\"#23282B\" stroke-width=\"1\"/>\n\n<text x=\"20\" y=\"232\" font-size=\"12.5\" fill=\"#9AA1A6\">resulting tokens for each word after 4 merges:</text>\n<g font-family=\"ui-monospace,Menlo,monospace\" font-size=\"13\" fill=\"#DDE3E7\">\n<text x=\"36\" y=\"260\">low &lt;/w&gt;</text><text x=\"150\" y=\"260\">&#8592; unchanged: l+o+w never matched a top pair</text>\n<text x=\"36\" y=\"284\">low + e + s + t + &lt;/w&gt;</text><text x=\"290\" y=\"284\">&#8592; lowest still splits past &#8220;low&#8221;</text>\n<text x=\"36\" y=\"308\">new + er&lt;/w&gt;</text><text x=\"230\" y=\"308\">&#8592; two merged tokens, not six characters</text>\n<text x=\"36\" y=\"332\">w + i + d + er&lt;/w&gt;</text><text x=\"290\" y=\"332\">&#8592; shares the &#8220;er&lt;/w&gt;&#8221; token with &#8220;newer&#8221;</text>\n<text x=\"36\" y=\"356\">new + &lt;/w&gt;</text><text x=\"200\" y=\"356\">&#8592; shares the &#8220;new&#8221; token with &#8220;newer&#8221;</text>\n</g>\n<text x=\"20\" y=\"392\" font-size=\"12\" fill=\"#9AA1A6\">the two most frequent adjacent pairs — (e,r) and (n,e) — get merged into reusable</text>\n<text x=\"20\" y=\"410\" font-size=\"12\" fill=\"#9AA1A6\">subword tokens, so &#8220;new&#8221; and &#8220;er&#8221; are shared across words instead of relearned.</text>\n</svg>",
              "cap": "Four merges over a toy corpus of five words. The two most frequent pairs — (e, r) and (n, e) — get merged first, producing an “er” suffix token shared by “newer” and “wider”, and a “new” stem token shared by “newer” and “new”, without either ever being handed to the algorithm as a rule."
            },
            {
              "t": "worked",
              "q": "Before any merges, the corpus contains “newer” (count 6) and “wider” (count 3), each split to characters. How many times does the pair (e, r) occur across the corpus, and why does it get merged first?",
              "steps": [
                "“newer” contributes the adjacent pair (e, r) once per occurrence of the word: 6 times.",
                "“wider” also contains the adjacent pair (e, r) once per occurrence: 3 times.",
                "Total occurrences of (e, r) = 6 + 3 = 9, which is the highest count of any adjacent pair in this corpus — higher than any pair confined to a single word — so BPE merges it first."
              ],
              "answer": "9 occurrences (6 from “newer” + 3 from “wider”), the highest of any pair, which is exactly the rule BPE merges by."
            },
            {
              "t": "p",
              "x": "Merges compound: once “e”+“r” becomes the single symbol “er”, later rounds count pairs involving that new symbol, which is how “n”+“e”→“ne” and then “ne”+“w”→“new” follow. The final vocabulary ends up containing whichever substrings were frequent enough to earn a merge, not any human's notion of a syllable or morpheme — it often lines up with morphology reasonably well simply because meaningful sub-word chunks tend to recur often."
            }
          ]
        },
        {
          "title": "From tokens to meaning: embeddings and context",
          "blocks": [
            {
              "t": "p",
              "x": "Once text is tokenized, each token id is mapped to a vector via an embedding table, exactly as in the embeddings booklet. Early NLP systems used static embeddings: one fixed vector per token type, regardless of context, so “bank” gets the identical vector whether the sentence is about rivers or finance. The attention booklet's mechanism is what makes contextual embeddings possible instead: a different vector for every occurrence of a token, built by letting it attend to the specific tokens around it."
            },
            {
              "t": "p",
              "x": "This distinction is the real dividing line between older and current NLP: pipelines built on static embeddings needed separate, hand-designed components for each task, while contextual embeddings from a pretrained transformer already carry enough disambiguated meaning that many tasks reduce to a small classifier trained on top."
            }
          ]
        },
        {
          "title": "Evaluating a language model: perplexity",
          "blocks": [
            {
              "t": "p",
              "x": "A language model assigns a probability to the next token given what came before. Perplexity is the standard way to turn that probability into a single interpretable number: it is 2 raised to the average number of bits of surprise (cross-entropy, in the information-theory booklet's terms) the model experiences per token on held-out text. Lower perplexity means the model was less surprised, on average, by what actually came next."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 620 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">perplexity of a toy bigram model on the test phrase &#8220;the cat sat&#8221;</text>\n<text x=\"20\" y=\"52\" font-size=\"12\" fill=\"#DDE3E7\" class=\"mono\">training text: the cat sat on the mat the cat ran   (6 word types, so V = 6)</text>\n\n<text x=\"20\" y=\"86\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">P(cat | the) = (count(the,cat) + 1) / (count(the) + V) = (2+1) / (3+6) = 0.333</text>\n<text x=\"20\" y=\"112\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">P(sat | cat) = (count(cat,sat) + 1) / (count(cat) + V) = (1+1) / (2+6) = 0.250</text>\n\n<line x1=\"20\" y1=\"134\" x2=\"600\" y2=\"134\" stroke=\"#23282B\" stroke-width=\"1\"/>\n\n<text x=\"20\" y=\"162\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">log&#8322; of each probability: log&#8322;(0.333) &#8776; &#8722;1.585    log&#8322;(0.250) = &#8722;2.000</text>\n<text x=\"20\" y=\"188\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">average negative log-probability = (1.585 + 2.000) / 2 &#8776; 1.792 bits</text>\n<text x=\"20\" y=\"216\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\" class=\"mono\">perplexity = 2^1.792 &#8776; 3.46</text>\n<text x=\"20\" y=\"252\" font-size=\"12\" fill=\"#9AA1A6\">a perplexity of 3.46 means the model is, on average, about as uncertain over</text>\n<text x=\"20\" y=\"270\" font-size=\"12\" fill=\"#9AA1A6\">the next word here as if it were choosing uniformly among roughly 3.46 options.</text>\n</svg>",
              "cap": "A minimal bigram model estimates P(next word | previous word) directly from training counts (with add-one smoothing so unseen pairs stay nonzero). Averaging the negative log-probabilities the model assigns to “cat” and “sat” and exponentiating gives a perplexity of about 3.46 on this three-word test phrase."
            },
            {
              "t": "p",
              "x": "A perplexity of 3.46 can be read as “on average, about as uncertain as choosing uniformly among 3.46 options” — the metric's own scale is calibrated so that a model guessing uniformly among N equally likely tokens scores exactly N. Real language models are evaluated the identical way, just with far larger vocabularies and far longer context."
            }
          ]
        },
        {
          "title": "Classic pipeline tasks",
          "blocks": [
            {
              "t": "p",
              "x": "Before large pretrained models, most NLP systems were built from a pipeline of separately-trained components, each producing structure the next stage relied on: part-of-speech (POS) tagging assigns each token a grammatical category (noun, verb, adjective, ...); named entity recognition (NER) finds spans that refer to people, organizations, locations and similar categories; parsing recovers the sentence's grammatical structure, either as a dependency tree (who modifies whom) or a constituency tree (nested phrases)."
            },
            {
              "t": "p",
              "x": "All three are sequence-labeling or structured-prediction problems, historically solved with hidden Markov models or conditional random fields that modeled label sequences directly. They remain useful, well-defined tasks with their own benchmarks — what has changed is that the features feeding them are now usually contextual embeddings from a shared pretrained encoder rather than hand-engineered per-task features."
            }
          ]
        },
        {
          "title": "Where NLP is headed",
          "blocks": [
            {
              "t": "p",
              "x": "Modern NLP mostly means adapting one pretrained transformer to many tasks, rather than building a separate tokenizer, tagger and parser pipeline for each one — the large language models booklet picks up exactly where this one leaves off. But every piece here still sits underneath even the largest model: it still tokenizes input the same way (frequently still BPE or a close relative), it is still evaluated on next-token prediction with a perplexity-shaped metric during pretraining, and the classic tasks above still exist as benchmarks a general-purpose model gets measured against."
            },
            {
              "t": "note",
              "x": "Tokenization choices made this early are surprisingly durable and hard to change later: a model's vocabulary is baked into its embedding table, so switching tokenizers effectively means starting over."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-run the bigram probability and perplexity computations with new numbers and check the tokenization and embedding distinctions from earlier chapters."
            }
          ],
          "exercises": [
            {
              "q": "Using the training counts count(the)=3, count(the,mat)=1, and vocabulary size V=6, compute P(mat | the) with add-one smoothing.",
              "steps": [
                "The add-one smoothed bigram probability is (count(w1,w2) + 1) / (count(w1) + V).",
                "Substituting: (1 + 1) / (3 + 6) = 2/9.",
                "2/9 ≈ 0.222."
              ],
              "answer": "P(mat | the) = 2/9 ≈ 0.222."
            },
            {
              "kind": "mc",
              "q": "Which tokenization approach best avoids the out-of-vocabulary problem while still keeping the vocabulary far smaller than a character-level scheme?",
              "options": [
                "Subword tokenization (e.g. byte-pair encoding)",
                "Whole-word tokenization only",
                "Sentence-level tokenization",
                "Tokenizing only the 100 most common English words"
              ],
              "correct": 0,
              "steps": [
                "Word-level tokenization always risks OOV for any word absent from the training vocabulary.",
                "Character-level tokenization has no OOV problem but produces very long sequences and a vocabulary of only a few dozen symbols with no larger structure.",
                "Subword tokenization keeps frequent whole words as single tokens while decomposing rare or unseen words into smaller reusable pieces, avoiding OOV without going all the way to individual characters."
              ],
              "answer": "Subword tokenization (e.g. BPE) — it caps vocabulary size like word-level tokenization while eliminating OOV like character-level tokenization."
            },
            {
              "kind": "write",
              "q": "Fill in the blank: the task of labeling each word with its grammatical category — noun, verb, adjective, and so on — is called ___ tagging.",
              "accept": [
                "part-of-speech",
                "part of speech",
                "pos"
              ],
              "hint": "abbreviated POS",
              "steps": [
                "This is one of the three classic pipeline tasks in this booklet, alongside named entity recognition and parsing.",
                "It assigns a grammatical category label to each token, not a semantic category like “person” or “location” (that is NER's job).",
                "The standard name for this task is part-of-speech tagging."
              ],
              "answer": "Part-of-speech (POS) tagging."
            },
            {
              "q": "Using the same training text (“the cat sat on the mat the cat ran”, V=6), compute the perplexity of the bigram model on the two-word test sequence “cat ran”.",
              "steps": [
                "count(cat, ran) = 1, count(cat) = 2, so P(ran | cat) = (1+1)/(2+6) = 2/8 = 0.25.",
                "There is only one bigram transition being scored (cat → ran), so the average negative log-probability is just −log₂(0.25) = 2 bits.",
                "Perplexity = 2^2 = 4."
              ],
              "answer": "Perplexity = 4, higher than the 3.46 from “the cat sat” because this single transition was assigned a lower probability."
            },
            {
              "kind": "mc",
              "q": "What is the key practical difference between a static embedding and a contextual embedding for the word “bank”?",
              "options": [
                "A static embedding gives “bank” the same vector in every sentence; a contextual embedding gives it a different vector depending on the surrounding words",
                "A static embedding is always higher-dimensional than a contextual one",
                "Contextual embeddings do not require a vocabulary at all",
                "Static embeddings can only represent nouns"
              ],
              "correct": 0,
              "steps": [
                "Static embeddings (e.g. one row per token in a fixed lookup table) assign exactly one vector per token type, independent of context.",
                "Contextual embeddings, produced by attending over the surrounding tokens, compute a fresh vector for every occurrence, so “bank” in a river sentence and “bank” in a finance sentence end up with different vectors.",
                "This is precisely what lets a single pretrained model disambiguate word sense without a separate hand-built component."
              ],
              "answer": "Static embeddings assign one fixed vector per token regardless of context; contextual embeddings compute a different vector per occurrence based on the surrounding tokens."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Tokenization",
          "Splitting text into a finite vocabulary of discrete units a model can compute over."
        ],
        [
          "Token",
          "One discrete unit produced by tokenization — a word, subword, or character depending on scheme."
        ],
        [
          "Out-of-vocabulary (OOV)",
          "A word or unit encountered at inference time with no entry in the model's vocabulary."
        ],
        [
          "Word-level tokenization",
          "Splitting text at word boundaries; simple but produces OOV and a very large vocabulary."
        ],
        [
          "Character-level tokenization",
          "Splitting text into individual characters; no OOV, but long sequences and no built-in structure."
        ],
        [
          "Subword tokenization",
          "Splitting text into pieces between characters and whole words, avoiding OOV with a bounded vocabulary."
        ],
        [
          "Byte-pair encoding (BPE)",
          "A subword tokenization algorithm that iteratively merges the most frequent adjacent symbol pair."
        ],
        [
          "Corpus",
          "A body of text used to train or evaluate a language model or tokenizer."
        ],
        [
          "N-gram model",
          "A language model that estimates the probability of a token from the preceding N-1 tokens' counts."
        ],
        [
          "Perplexity",
          "2 raised to a model's average per-token cross-entropy on held-out text; lower is better."
        ],
        [
          "Cross-entropy loss",
          "The negative log-probability a model assigns to the correct outcome, averaged over examples."
        ],
        [
          "Part-of-speech (POS) tagging",
          "Labeling each token with its grammatical category."
        ],
        [
          "Named entity recognition (NER)",
          "Identifying spans of text referring to people, organizations, locations and similar categories."
        ],
        [
          "Parsing (NLP)",
          "Recovering a sentence's grammatical structure as a dependency or constituency tree."
        ],
        [
          "Static embedding",
          "A fixed vector per token type, identical regardless of surrounding context."
        ],
        [
          "Contextual embedding",
          "A vector computed per token occurrence, varying with the surrounding tokens via attention."
        ]
      ]
    },
  "mlops":   {
      "title": "Serving and MLOps",
      "blurb": "Getting a model out of a notebook and into production, and keeping it working once it's there — versioning, serving patterns, safe rollout, and the monitoring that catches a model quietly going stale.",
      "chapters": [
        {
          "title": "From notebook to production",
          "blocks": [
            {
              "t": "p",
              "x": "Training code and production code optimize for different things. A training script is judged on whether it produces a good model; it is fine if it is fragile, slow to start, or assumes a clean, static dataset. A production system is judged on whether it keeps answering correctly, quickly, and continuously, against inputs nobody hand-picked, at whatever request volume actually shows up. MLOps is the name for the practices that close that gap: it is applying the discipline of software operations — versioning, testing, monitoring, gradual rollout — to models specifically, because a model can fail in ways ordinary software doesn't (its logic is learned from data that changes over time, not written down and reviewed)."
            },
            {
              "t": "p",
              "x": "Everything in this booklet assumes the model itself has already been trained and evaluated (the model-evaluation booklet's job); this one is about what happens after evaluation says the model is good enough to ship."
            }
          ]
        },
        {
          "title": "Serving patterns",
          "blocks": [
            {
              "t": "p",
              "x": "Batch inference scores a large stored dataset on a schedule — nightly, hourly — with no request waiting on the result. It has the highest throughput and the most relaxed latency budget of the three patterns, since results can be precomputed well before anyone needs them. Online inference answers one request at a time within a tight latency budget, often tens to low hundreds of milliseconds, because a person or another system is waiting synchronously for the response. Streaming inference sits in between: it processes an unbounded, continuously arriving flow of events, typically with a per-event or small-window latency target rather than either a schedule or a hard per-request deadline."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">canary rollout, with a rollback trigger</text>\n<line x1=\"60\" y1=\"200\" x2=\"600\" y2=\"200\" stroke=\"#23282B\" stroke-width=\"1.5\"/>\n<g font-family=\"ui-monospace,Menlo,monospace\" font-size=\"12\" fill=\"#DDE3E7\">\n<circle cx=\"100\" cy=\"200\" r=\"7\" fill=\"#FFFFFF\"/>\n<text x=\"80\" y=\"230\" text-anchor=\"middle\">1% traffic</text>\n<circle cx=\"240\" cy=\"200\" r=\"7\" fill=\"#FFFFFF\" fill-opacity=\"0.8\"/>\n<text x=\"240\" y=\"230\" text-anchor=\"middle\">10% traffic</text>\n<circle cx=\"380\" cy=\"200\" r=\"7\" fill=\"#FFFFFF\" fill-opacity=\"0.8\"/>\n<text x=\"380\" y=\"230\" text-anchor=\"middle\">50% traffic</text>\n<circle cx=\"520\" cy=\"200\" r=\"9\" fill=\"#FFFFFF\"/>\n<text x=\"520\" y=\"230\" text-anchor=\"middle\">100% traffic</text>\n</g>\n<path d=\"M100,200 L240,200\" stroke=\"#D2D8DC\" stroke-width=\"2\"/>\n<path d=\"M240,200 L380,200\" stroke=\"#D2D8DC\" stroke-width=\"2\"/>\n<path d=\"M380,200 L520,200\" stroke=\"#D2D8DC\" stroke-width=\"2\"/>\n<path d=\"M100,190 L100,140 L520,140 L520,190\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1\" stroke-dasharray=\"4,3\"/>\n<text x=\"310\" y=\"126\" font-size=\"12\" fill=\"#9BA3A9\" text-anchor=\"middle\">each stage checks the evaluation metric against the current model before advancing</text>\n\n<path d=\"M240,200 L240,270\" stroke=\"#9AA1A6\" stroke-width=\"1.5\" marker-end=\"url(#arrM)\"/>\n<defs><marker id=\"arrM\" markerWidth=\"8\" markerHeight=\"8\" refX=\"4\" refY=\"7\" orient=\"auto\"><path d=\"M0,0 L8,0 L4,7 Z\" fill=\"#9AA1A6\"/></marker></defs>\n<text x=\"240\" y=\"292\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\" text-anchor=\"middle\">metric regression detected &#8594; roll back to 1%</text>\n</svg>",
              "cap": "A canary rollout exposes a new model to a small slice of live traffic first, checks the evaluation metric at each stage against the currently-serving model, and only advances if it holds up — catching a regression at 10% traffic is far cheaper than discovering it at 100%."
            },
            {
              "t": "p",
              "x": "Choosing among the three is really about matching the latency budget to the use case: a nightly churn-risk score for a marketing campaign has no reason to be online; a fraud check blocking a checkout has no reasonable batch alternative."
            }
          ]
        },
        {
          "title": "Model and data versioning",
          "blocks": [
            {
              "t": "p",
              "x": "A model is only reproducible if three things are pinned together: the training code, the exact snapshot of data it trained on, and the hyperparameters used. Change any one without recording it, and nobody — including future you — can explain why a newly retrained model behaves differently from the one it replaced. A model registry exists to make that recording automatic: every trained model is logged with its code version, data snapshot reference, metrics, and an identifier, so serving infrastructure can request “model X, version Y” rather than “whatever's currently in this file path.”"
            },
            {
              "t": "p",
              "x": "The data half of this leans directly on earlier booklets: a feature store built on the databases and distributed-systems ideas here keeps a versioned, queryable record of the exact feature values used at training time, so the same features can be recomputed consistently at serving time — a common, hard-to-debug source of production bugs is training and serving computing the same nominal feature slightly differently."
            }
          ]
        },
        {
          "title": "Deployment strategies",
          "blocks": [
            {
              "t": "p",
              "x": "Canary deployment (shown above) is one of three common strategies for introducing a new model safely. Shadow deployment runs the new model on real live traffic in parallel with the current one, but discards its output rather than serving it — purely to compare the two models' predictions on identical real inputs before anyone's user sees the new one's answers. Blue-green deployment keeps two complete, independent production environments and switches a router from one to the other atomically, so rollback is just switching the router back rather than undoing a partial rollout."
            },
            {
              "t": "p",
              "x": "All three exist to answer the same question — does this new model actually behave acceptably on real, live traffic, not just on a held-out test set — while bounding how much damage a bad answer to that question can do before a human or an automated check notices."
            }
          ]
        },
        {
          "title": "Monitoring and drift",
          "blocks": [
            {
              "t": "p",
              "x": "A model's offline evaluation metric describes its accuracy on the data it was tested against, at that moment. Nothing about that number is guaranteed to hold six months later, because the world the model operates in keeps changing even if the model's weights never do. Data drift is a shift in the input distribution itself — the mix of users, devices, or seasons changes — without any change in how inputs relate to the correct output. Concept drift is a shift in that relationship: the same input now genuinely warrants a different output, for instance because fraud patterns evolved specifically to evade the current model."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 420\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">population stability index (PSI) — training vs. production distribution, 5 bins</text>\n<g font-family=\"ui-monospace,Menlo,monospace\" font-size=\"11.5\" fill=\"#DDE3E7\">\n<text x=\"20\" y=\"52\">bin</text><text x=\"120\" y=\"52\">train %</text><text x=\"220\" y=\"52\">prod %</text><text x=\"320\" y=\"52\">PSI term</text>\n<text x=\"20\" y=\"76\">0-1 yr</text><text x=\"120\" y=\"76\">0.10</text><text x=\"220\" y=\"76\">0.22</text><text x=\"320\" y=\"76\">0.0946</text>\n<text x=\"20\" y=\"98\">1-2 yr</text><text x=\"120\" y=\"98\">0.25</text><text x=\"220\" y=\"98\">0.30</text><text x=\"320\" y=\"98\">0.0091</text>\n<text x=\"20\" y=\"120\">2-5 yr</text><text x=\"120\" y=\"120\">0.35</text><text x=\"220\" y=\"120\">0.28</text><text x=\"320\" y=\"120\">0.0156</text>\n<text x=\"20\" y=\"142\">5-10 yr</text><text x=\"120\" y=\"142\">0.20</text><text x=\"220\" y=\"142\">0.13</text><text x=\"320\" y=\"142\">0.0302</text>\n<text x=\"20\" y=\"164\">10+ yr</text><text x=\"120\" y=\"164\">0.10</text><text x=\"220\" y=\"164\">0.07</text><text x=\"320\" y=\"164\">0.0107</text>\n</g>\n<line x1=\"20\" y1=\"180\" x2=\"440\" y2=\"180\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"20\" y=\"204\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\" class=\"mono\">PSI = sum of terms &#8776; 0.16</text>\n\n<text x=\"20\" y=\"240\" font-size=\"11\" fill=\"#9AA1A6\">illustrative bars for the first two bins (train, then production):</text>\n<g>\n<rect x=\"20\" y=\"270\" width=\"26\" height=\"18\" fill=\"#D2D8DC\"/>\n<rect x=\"20\" y=\"290\" width=\"26\" height=\"40\" fill=\"#FFFFFF\"/>\n<text x=\"33\" y=\"346\" font-size=\"10.5\" fill=\"#9AA1A6\" text-anchor=\"middle\">0-1 yr</text>\n<rect x=\"70\" y=\"255\" width=\"26\" height=\"45\" fill=\"#D2D8DC\"/>\n<rect x=\"70\" y=\"280\" width=\"26\" height=\"50\" fill=\"#FFFFFF\"/>\n<text x=\"83\" y=\"346\" font-size=\"10.5\" fill=\"#9AA1A6\" text-anchor=\"middle\">1-2 yr</text>\n</g>\n\n<text x=\"20\" y=\"380\" font-size=\"12\" fill=\"#9AA1A6\">rule of thumb: PSI &#60; 0.10 no meaningful shift, 0.10-0.25 moderate shift worth</text>\n<text x=\"20\" y=\"398\" font-size=\"12\" fill=\"#9AA1A6\">investigating, &#62; 0.25 a shift large enough to likely be hurting live performance.</text>\n</svg>",
              "cap": "The population stability index (PSI) compares a feature's production distribution against its training distribution, bin by bin: PSI = Σ (prod% − train%) × ln(prod%/train%). Summed across five bins of a customer-age feature here, PSI ≈ 0.16 — in the conventional 0.10–0.25 “moderate shift, worth investigating” range, even though no single bin moved by more than 12 percentage points."
            },
            {
              "t": "worked",
              "q": "One bin has train% = 0.20 and prod% = 0.13. Compute that bin's contribution to PSI.",
              "steps": [
                "The PSI term for a bin is (prod% − train%) × ln(prod%/train%).",
                "prod% − train% = 0.13 − 0.20 = −0.07.",
                "ln(prod%/train%) = ln(0.13/0.20) = ln(0.65) ≈ −0.431.",
                "Term = −0.07 × −0.431 ≈ 0.0302 — positive, since PSI terms are always ≥ 0 regardless of which direction a bin shifted."
              ],
              "answer": "≈ 0.0302, matching the 5–10 yr row in the figure."
            }
          ]
        },
        {
          "title": "Closing the loop",
          "blocks": [
            {
              "t": "p",
              "x": "Monitoring only helps if it is connected to a response. That means alerting thresholds tied to the same metrics evaluation cared about (not just infrastructure metrics like CPU), an on-call rotation or equivalent responsible for reacting to an alert, and a rehearsed rollback path — usually just re-pointing serving at the previous registered model version, which is exactly why the versioning chapter's discipline pays off here. The same idempotency and retry thinking from the distributed-systems booklet applies directly to serving infrastructure: a request that times out and gets retried should not double-charge a customer or double-count a fraud check."
            },
            {
              "t": "note",
              "x": "Retraining is not automatically the fix for drift. Sometimes the right response is retraining on fresher data; sometimes the input pipeline itself broke (a client changed how it sends a field) and no amount of retraining fixes a data quality bug — monitoring should distinguish which situation you're in before reaching for either."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-run the PSI computation with a new bin and check the deployment and drift distinctions from earlier chapters."
            }
          ],
          "exercises": [
            {
              "q": "A feature's PSI comes out to 0.16 between training and production. Using the standard thresholds (< 0.10 no shift, 0.10–0.25 moderate, > 0.25 significant), what does this indicate, and what would you do next?",
              "steps": [
                "0.16 falls in the 0.10–0.25 range, meaning a moderate distribution shift — not severe enough to assume the model is now broken, but not negligible either.",
                "The reasonable next step is investigation, not an automatic retrain: check whether the shift reflects a real change in the underlying population (seasonal effect, new user segment) or a data pipeline issue.",
                "Only after ruling out a pipeline bug does retraining on more recent data become the likely fix."
              ],
              "answer": "A moderate shift worth investigating before acting — confirm it's a genuine population change (versus a pipeline bug) before deciding whether to retrain."
            },
            {
              "kind": "mc",
              "q": "Which best distinguishes data drift from concept drift?",
              "options": [
                "Data drift is a shift in the input distribution with the input-output relationship unchanged; concept drift is a shift in that relationship itself",
                "Data drift only affects batch inference; concept drift only affects online inference",
                "Concept drift can be fixed by adding more servers; data drift cannot",
                "Data drift and concept drift are two names for the same phenomenon"
              ],
              "correct": 0,
              "steps": [
                "Data drift: the mix of inputs changes (new user segment, seasonal shift) but a given input still maps to the same correct output as before.",
                "Concept drift: the same input now genuinely deserves a different output, because the real-world relationship being modeled changed.",
                "Both erode a model's real-world accuracy without any change to the model's weights, which is why post-deployment monitoring exists at all."
              ],
              "answer": "Data drift shifts the input distribution while input–output relationships hold; concept drift shifts the relationship itself."
            },
            {
              "kind": "write",
              "q": "Fill in the blank: running a new model on live traffic without letting its predictions reach any user, purely to compare its output against the currently-serving model on identical real inputs, is called ___ deployment.",
              "accept": [
                "shadow",
                "shadow deployment"
              ],
              "hint": "the new model's output stays hidden",
              "steps": [
                "Canary deployment does let the new model's output reach a small slice of real users.",
                "Blue-green deployment switches all traffic to a full second environment atomically.",
                "The strategy where the new model runs but its output is discarded rather than served is shadow deployment."
              ],
              "answer": "Shadow deployment."
            },
            {
              "q": "During a canary rollout, the evaluation metric regresses at the 10% traffic stage. What is the correct next step, and why does starting the canary at 1% traffic rather than going straight to 100% matter here?",
              "steps": [
                "The correct next step is to roll back to the previous model version (or to the pre-canary 0% state) rather than advancing further or trying to “wait and see.”",
                "Starting small (1%) bounds the number of users affected by a bad model before the regression is even detected — at 100% traffic immediately, the same regression would have hit every user.",
                "The staged percentages exist precisely so a regression is caught and rolled back while it has only touched a small, controlled slice of traffic."
              ],
              "answer": "Roll back immediately; starting at 1% traffic limits how many users are exposed to a bad model before the regression is caught, which is the entire point of a staged rollout."
            },
            {
              "kind": "mc",
              "q": "Which serving pattern best fits: “score every customer's churn risk once per night for an email campaign, with no real-time requirement”?",
              "options": [
                "Batch inference",
                "Online inference",
                "Streaming inference",
                "Shadow deployment"
              ],
              "correct": 0,
              "steps": [
                "There is no request waiting synchronously on a result — the scores are consumed later by the campaign system, not returned to a live caller.",
                "A nightly schedule over the full customer dataset is exactly batch inference's use case: maximize throughput, since there's no tight latency budget to hit.",
                "Online or streaming inference would add complexity (low-latency infrastructure) this use case doesn't need; shadow deployment is a rollout strategy, not a serving pattern."
              ],
              "answer": "Batch inference — no request is waiting synchronously, and a nightly schedule over the full dataset maximizes throughput with no latency budget to meet."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Model registry",
          "A versioned store of trained models with their code, data, and metric lineage recorded."
        ],
        [
          "Serving",
          "Running a trained model to produce predictions for real inputs after training and evaluation."
        ],
        [
          "Batch inference",
          "Scoring a large stored dataset on a schedule, with no request waiting synchronously on the result."
        ],
        [
          "Online inference",
          "Answering one request at a time within a tight latency budget, synchronously."
        ],
        [
          "Streaming inference",
          "Processing a continuous, unbounded flow of events with a per-event or small-window latency target."
        ],
        [
          "Latency budget",
          "The maximum acceptable time between a request and its response."
        ],
        [
          "Canary deployment",
          "Exposing a new model to a small, growing slice of live traffic, checked at each stage before advancing."
        ],
        [
          "Shadow deployment",
          "Running a new model on live traffic without serving its output, purely to compare it against the current model."
        ],
        [
          "Blue-green deployment",
          "Maintaining two full production environments and switching a router between them atomically."
        ],
        [
          "Rollback",
          "Reverting to a previously-serving model version after a deployed model regresses."
        ],
        [
          "Data drift",
          "A shift in the input distribution a model receives, with the input-output relationship unchanged."
        ],
        [
          "Concept drift",
          "A shift in the true relationship between inputs and correct outputs over time."
        ],
        [
          "Population stability index (PSI)",
          "A metric comparing a feature's production distribution against its training distribution, bin by bin."
        ],
        [
          "Feature store",
          "A versioned, queryable store of feature values shared consistently between training and serving."
        ],
        [
          "Reproducibility (ML)",
          "The ability to recover the same model from its pinned code, data snapshot, and hyperparameters."
        ],
        [
          "On-call",
          "The rotation of people responsible for responding when a production alert fires."
        ]
      ]
    }
});

Object.assign(BOOKLETS, {
  "llm": {
    "title": "Large Language Models",
    "blurb": "A transformer trained on an enormous amount of text to do one narrow thing — predict the next token — and the surprising amount of behavior that falls out of doing that one thing at scale.",
    "chapters": [
      {
        "title": "One objective, predicting the next token",
        "blocks": [
          {
            "t": "p",
            "x": "An LLM is a transformer, in the sense the attention booklet describes, trained on a single objective: given a sequence of tokens, predict a probability distribution over what token comes next. Training minimizes cross-entropy between that predicted distribution and the token that actually followed, across an enormous corpus of text, repeated for trillions of tokens."
          },
          {
            "t": "p",
            "x": "Nothing about that objective mentions reasoning, facts, or conversation. Those behaviors emerge because predicting the next token well, across a corpus that contains code, arguments, dialogue, and explanations, turns out to require modeling an awful lot about how language, facts, and reasoning actually work. The objective is narrow; the corpus is what makes the resulting behavior broad."
          },
          {
            "t": "note",
            "x": "This is why an LLM can be simultaneously extremely capable and prone to confidently generating false statements: nothing in the training objective distinguishes 'plausible continuation' from 'true statement.' Those two things are correlated in the training data, not identical."
          }
        ]
      },
      {
        "title": "Corpus construction and scale",
        "blocks": [
          {
            "t": "p",
            "x": "Pretraining corpora are built from web crawls, books, code repositories, and other large text sources, then heavily filtered and deduplicated — near-duplicate documents otherwise get memorized disproportionately, and low-quality or toxic content otherwise shapes the model's output distribution more than intended."
          },
          {
            "t": "p",
            "x": "Empirically, loss falls in a predictable, smooth relationship with model size, dataset size, and compute — the so-called scaling laws. This is part of why frontier labs invest so heavily in more compute and more (filtered) data: the returns on scale, while eventually diminishing, have held remarkably well across many orders of magnitude, which is unusual for a machine learning result."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox='0 0 640 220' xmlns='http://www.w3.org/2000/svg'><text x='20' y='24' font-size='12' fill='#9AA1A6'>loss vs. training compute (schematic, log-log axes)</text><line x1='60' y1='180' x2='600' y2='180' stroke='#23282B'/><line x1='60' y1='40' x2='60' y2='180' stroke='#23282B'/><path d='M70,60 C 200,110 350,150 590,172' fill='none' stroke='#FFFFFF' stroke-width='2.4'/><text x='60' y='200' font-size='11.5' fill='#666D72'>compute &#8594;</text><text x='16' y='45' font-size='11.5' fill='#666D72'>loss</text><text x='420' y='150' font-size='12' fill='#9AA1A6'>diminishing but persistent returns</text></svg>",
            "cap": "Pretraining loss falls smoothly as compute (model size × data × training time) grows, roughly a straight line on log-log axes — the empirical basis for scaling laws."
          }
        ]
      },
      {
        "title": "Context windows and KV caching",
        "blocks": [
          {
            "t": "p",
            "x": "The context window is the maximum number of tokens a model can attend over at once — its entire working memory for a given call. Anything outside that window simply isn't visible to the model, which is why long documents need to be chunked (as the RAG booklet covers) or why a long conversation can cause a model to 'forget' something said much earlier."
          },
          {
            "t": "p",
            "x": "Generating text one token at a time naively would recompute attention over the whole context from scratch at every single step, which is wasteful: the key and value vectors for all previous tokens don't change once computed. KV caching stores those key/value vectors after each step and reuses them, so generating token N only does the new work for token N, not for the whole prefix again."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox='0 0 640 190' xmlns='http://www.w3.org/2000/svg'><text x='20' y='24' font-size='12' fill='#9AA1A6'>KV cache: reused work vs. new work per generated token</text><rect x='40' y='60' width='260' height='40' rx='4' fill='#1A1E20' stroke='#23282B'/><text x='170' y='85' text-anchor='middle' font-size='12.5' fill='#9AA1A6' font-family='monospace'>cached K/V, tokens 1..N-1</text><rect x='310' y='60' width='90' height='40' rx='4' fill='#FFFFFF' fill-opacity='0.15' stroke='#FFFFFF'/><text x='355' y='85' text-anchor='middle' font-size='12.5' fill='#EDEFF0' font-family='monospace'>token N</text><text x='40' y='130' font-size='12' fill='#666D72'>only the new token's K/V is computed fresh; the rest is read from cache</text></svg>",
            "cap": "At each generation step, only the newest token's key/value vectors are freshly computed; everything before it is served from the KV cache."
          },
          {
            "t": "note",
            "x": "The KV cache itself takes memory proportional to sequence length, model depth, and hidden size — for long contexts and large models this can rival or exceed the memory taken by the model's weights, which is a real deployment constraint, not a footnote."
          }
        ]
      },
      {
        "title": "Sampling: temperature, top-p, and beam search",
        "blocks": [
          {
            "t": "p",
            "x": "The model's output at each step is a probability distribution over the whole vocabulary, not a single answer — something has to turn that distribution into an actual next token. Greedy decoding always takes the single highest-probability token, which is deterministic but tends toward repetitive, overly safe text."
          },
          {
            "t": "p",
            "x": "Temperature rescales the distribution before sampling: values below 1 sharpen it toward the top choices (approaching greedy as temperature approaches 0), values above 1 flatten it, giving lower-probability tokens a more realistic chance of being picked. Top-p (nucleus) sampling instead keeps only the smallest set of top tokens whose probabilities sum to at least p, then samples within that set — adapting how many options are considered based on how confident the distribution actually is at each step."
          },
          {
            "t": "worked",
            "q": "A distribution assigns 0.6, 0.25, 0.1, 0.05 to four candidate tokens. With top-p = 0.8, which tokens remain eligible for sampling?",
            "steps": [
              "Sort by probability (already sorted here) and accumulate: 0.6, then 0.6+0.25=0.85.",
              "The cumulative sum first reaches or exceeds 0.8 after including the second token (0.85 ≥ 0.8).",
              "So the nucleus includes only the first two tokens, with probabilities 0.6 and 0.25.",
              "The remaining two tokens (0.1 and 0.05) are excluded from sampling entirely, regardless of temperature."
            ]
          },
          {
            "t": "p",
            "x": "Beam search instead keeps several partial sequences (beams) alive at once, extending each and keeping only the highest-scoring beams at every step, aiming for a high-probability full sequence rather than a good next token in isolation. It is common in tasks like translation with one clearly best answer, and less common for open-ended chat, where it tends to produce bland, hedged text."
          }
        ]
      },
      {
        "title": "Instruction tuning and RLHF, in outline",
        "blocks": [
          {
            "t": "p",
            "x": "A raw pretrained model is only trained to continue text plausibly — asked a question, it might just as easily continue with more questions in the same style as answer the one asked, because that is a plausible continuation of text that looks like a list of questions. Instruction tuning fine-tunes the pretrained model on examples of instructions paired with the kind of response actually wanted, shifting its default behavior toward being helpful when prompted like an assistant."
          },
          {
            "t": "p",
            "x": "RLHF, covered in full in the alignment booklet, goes a step further: human raters compare candidate responses, that preference data trains a reward model, and the LLM is then fine-tuned with reinforcement learning against that reward model. Where instruction tuning teaches the model the shape of a good response, RLHF pushes further toward responses humans actually prefer along dimensions like helpfulness and harmlessness that are hard to specify with example pairs alone."
          }
        ]
      },
      {
        "title": "Where large language models sit in this map",
        "blocks": [
          {
            "t": "p",
            "x": "Everything in this booklet is the attention booklet's transformer, trained at a scale the training-at-scale booklet describes, on data assembled the way this booklet's second chapter describes. Adapting a pretrained LLM to a specific task or dataset without full retraining is the fine-tuning booklet's subject; giving it current, external knowledge at query time is the RAG booklet's; letting it act across multiple steps rather than answer once is the agents booklet's. This booklet is the hub the rest of the AI-in-practice track adapts, retrieves for, and acts through."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "These revisit sampling arithmetic and check the reasoning behind the pretraining objective, KV caching, and instruction tuning."
          }
        ],
        "exercises": [
          {
            "q": "A distribution assigns 0.5, 0.3, 0.15, 0.05 to four tokens. With top-p = 0.75, which tokens are eligible for sampling?",
            "steps": [
              "Cumulative sum: 0.5, then 0.5+0.3=0.8.",
              "The cumulative sum first reaches or exceeds 0.75 after the second token.",
              "So the nucleus is the first two tokens, with combined probability 0.8.",
              "The remaining two (0.15 and 0.05) are excluded."
            ],
            "answer": "The first two tokens (probabilities 0.5 and 0.3) are eligible; the rest are excluded."
          },
          {
            "kind": "mc",
            "q": "Why can an LLM produce a fluent, confident, but completely false statement, given that its training objective is just next-token prediction?",
            "options": [
              "The objective rewards plausible continuations of the training distribution, and nothing in it distinguishes a plausible continuation from a true one",
              "The model deliberately decides to lie when it lacks information",
              "This only happens due to a bug that better training data would always fix completely",
              "Cross-entropy loss explicitly penalizes true statements more than false ones"
            ],
            "correct": 0,
            "steps": [
              "Cross-entropy training only measures how well predicted probabilities match the actual next token in training text.",
              "Plausibility and truth are correlated in most training text, but the objective never explicitly separates them.",
              "So a false but stylistically plausible continuation can score just as well, from the objective's point of view, as a true one.",
              "This isn't a bug to be patched away entirely — it's a direct consequence of what the objective measures."
            ],
            "answer": "Nothing in the next-token objective distinguishes plausible from true; the two are only correlated in training data, not identical."
          },
          {
            "kind": "write",
            "q": "The technique that stores previously-computed key and value vectors so generating each new token doesn't require recomputing attention over the whole prefix is called the ___ cache.",
            "accept": [
              "kv",
              "key-value",
              "key value"
            ],
            "hint": "two letters, from the two vectors it stores",
            "steps": [
              "Each attention step needs key and value vectors for every prior token.",
              "Those vectors don't change once computed, so recomputing them at every step would be wasted work.",
              "Storing and reusing them is the KV cache.",
              "This is why generation cost per token stays roughly constant rather than growing with the full recomputation cost of the sequence so far."
            ],
            "answer": "The KV cache."
          },
          {
            "q": "Why does instruction tuning alone often still fall short of what RLHF adds, given that both operate on a pretrained model?",
            "steps": [
              "Instruction tuning trains on example instruction-response pairs, teaching the general shape and tone of a helpful response.",
              "But writing enough example pairs to cover every nuance of what humans actually prefer (tone, safety, honesty about uncertainty) is impractical by hand.",
              "RLHF instead trains a reward model from human preference comparisons, which can generalize preferences across situations no single example pair covered.",
              "The LLM is then optimized against that learned reward model with reinforcement learning, pushing behavior toward what raters actually preferred, not just what shape of answer they demonstrated."
            ],
            "answer": "Instruction tuning teaches the shape of a good response from examples; RLHF pushes further toward what humans actually prefer, learned from comparisons rather than hand-written examples."
          },
          {
            "kind": "mc",
            "q": "A model given a 50,000-token document and asked a question about its first paragraph performs poorly. Given this booklet, what is the most likely explanation?",
            "options": [
              "The document may exceed the model's context window, or relevant content may be diluted among enough tokens that attention doesn't weight it strongly",
              "The model always ignores the first paragraph of any document on principle",
              "KV caching corrupts early tokens after enough later tokens are processed",
              "Longer documents always cause a hard error rather than a quality issue"
            ],
            "correct": 0,
            "steps": [
              "If 50,000 tokens exceeds the model's context window, the earliest content may be truncated or unavailable entirely.",
              "Even within the window, attention has to spread across many tokens, and very long contexts can dilute how strongly any one span is weighted.",
              "KV caching preserves, rather than corrupts, earlier tokens' key/value vectors — it doesn't explain degraded quality.",
              "Long documents don't universally error out; behavior degrading gracefully (or via truncation) is more typical than a hard failure."
            ],
            "answer": "Either the document exceeds the context window or relevant content is diluted across a very long context — not corruption from caching or a hard length error."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Pretraining",
        "Training an LLM on the next-token prediction objective over a large, general corpus."
      ],
      [
        "Cross-entropy loss",
        "The loss function comparing a predicted next-token distribution to the actual next token."
      ],
      [
        "Scaling laws",
        "The empirical relationship between model size, data size, compute, and resulting loss."
      ],
      [
        "Context window",
        "The maximum number of tokens a model can attend over in a single call."
      ],
      [
        "KV cache",
        "Stored key/value vectors from prior tokens, reused to avoid recomputing attention from scratch each step."
      ],
      [
        "Greedy decoding",
        "Always selecting the single highest-probability next token."
      ],
      [
        "Temperature",
        "A scaling factor on the output distribution controlling how sharply it favors top candidates."
      ],
      [
        "Top-p (nucleus) sampling",
        "Sampling only from the smallest set of top tokens whose probabilities sum to at least p."
      ],
      [
        "Beam search",
        "Keeping several high-scoring partial sequences alive and extending them, favoring overall sequence probability."
      ],
      [
        "Instruction tuning",
        "Fine-tuning a pretrained model on instruction-response pairs to shift it toward assistant-like behavior."
      ],
      [
        "RLHF",
        "Reinforcement learning from human feedback; fine-tuning against a reward model trained on human preference comparisons."
      ],
      [
        "Reward model",
        "A model trained to predict which of two outputs a human rater would prefer."
      ],
      [
        "Hallucination",
        "A fluent but factually false model output, arising because the training objective doesn't distinguish truth from plausibility."
      ]
    ]
  },
  "finetune": {
    "title": "Fine-tuning and LoRA",
    "blurb": "Adapting a pretrained model to a narrower task without paying the cost of retraining it from scratch — and the parameter-efficient tricks that make adapting a huge model affordable at all.",
    "chapters": [
      {
        "title": "Prompting versus fine-tuning",
        "blocks": [
          {
            "t": "p",
            "x": "The cheapest way to adapt a large language model to a task is often to not train it at all: describe the task and give examples directly in the prompt, using the context the LLM booklet covers. This costs nothing to set up and can be changed instantly, but it consumes context-window space on every single call, and it can only push behavior so far — it can't teach a genuinely new skill the base model has no latent capacity for."
          },
          {
            "t": "p",
            "x": "Fine-tuning instead updates the model's own parameters on examples of the target task, so the adapted behavior is baked in rather than re-specified on every call. It costs real compute up front and produces a model that has to be hosted and versioned separately, but it can shift behavior more deeply and reliably than a prompt ever can, and it removes the per-call context cost of long instructions."
          },
          {
            "t": "note",
            "x": "In practice, the decision isn't binary: many production systems combine a modest prompt with a fine-tuned or lightly adapted model, using each technique where it's cheapest to fix a given gap."
          }
        ]
      },
      {
        "title": "Full fine-tuning versus parameter-efficient methods",
        "blocks": [
          {
            "t": "p",
            "x": "Full fine-tuning updates every parameter in the model, using the same gradient descent and backpropagation machinery covered earlier in this map. For a model with billions of parameters, that means storing gradients and optimizer state (commonly two to three times the parameter count itself, for an optimizer like Adam) alongside the weights — memory that can exceed what even high-end hardware provides."
          },
          {
            "t": "p",
            "x": "Parameter-efficient fine-tuning methods instead freeze most or all of the original weights and train a much smaller number of new parameters layered on top. The frozen weights need no gradients or optimizer state at all, so the memory and compute cost drops dramatically — often by more than an order of magnitude — while still meaningfully adapting the model's behavior."
          }
        ]
      },
      {
        "title": "LoRA: low-rank adapters",
        "blocks": [
          {
            "t": "p",
            "x": "LoRA (low-rank adaptation) freezes an existing weight matrix W entirely and adds a separate update ΔW, but never forms ΔW as a full matrix. Instead it factors it into two much smaller matrices, A and B, so that ΔW = B·A, where A and B share a small inner dimension called the rank. Only A and B are trained; W stays frozen throughout."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox='0 0 640 220' xmlns='http://www.w3.org/2000/svg'><text x='20' y='24' font-size='12' fill='#9AA1A6'>LoRA: a large frozen matrix, adapted by two small trained ones</text><rect x='40' y='50' width='120' height='120' fill='#1A1E20' stroke='#23282B'/><text x='100' y='115' text-anchor='middle' font-size='13' fill='#9AA1A6' font-family='monospace'>W</text><text x='40' y='188' font-size='11.5' fill='#666D72'>frozen, d&#215;d</text><text x='180' y='115' text-anchor='middle' font-size='16' fill='#666D72'>+</text><rect x='210' y='50' width='30' height='120' fill='#FFFFFF' fill-opacity='0.18' stroke='#FFFFFF'/><text x='225' y='115' text-anchor='middle' font-size='11' fill='#EDEFF0' font-family='monospace' transform='rotate(-90 225 115)'>B</text><rect x='250' y='140' width='120' height='30' fill='#FFFFFF' fill-opacity='0.18' stroke='#FFFFFF'/><text x='310' y='159' text-anchor='middle' font-size='11' fill='#EDEFF0' font-family='monospace'>A</text><text x='210' y='188' font-size='11.5' fill='#666D72'>trained, d&#215;r and r&#215;d</text><text x='420' y='115' font-size='12.5' fill='#DDE3E7'>r &#8810; d, so B&#183;A has far</text><text x='420' y='134' font-size='12.5' fill='#DDE3E7'>fewer parameters than W</text></svg>",
            "cap": "W stays frozen at its full size; only the two small matrices A and B (sharing a small rank r) are trained, and their product approximates a useful update."
          },
          {
            "t": "worked",
            "q": "A weight matrix W is 4096×4096. Compare the parameter count of fully fine-tuning W versus a LoRA update with rank r = 8.",
            "steps": [
              "Full fine-tuning of W updates all 4096 × 4096 = 16,777,216 parameters.",
              "LoRA's A is 4096 × 8 and B is 8 × 4096, each with 4096 × 8 = 32,768 parameters.",
              "Total LoRA parameters = 32,768 × 2 = 65,536.",
              "That is about 0.4% of the full fine-tuning parameter count for this one matrix — a reduction of roughly 256×."
            ]
          },
          {
            "t": "p",
            "x": "After training, B·A can either be kept separate (letting the same frozen base model be paired with different LoRA adapters for different tasks, swapped in and out cheaply) or merged directly into W by simple matrix addition, producing a single ordinary weight matrix with no extra inference-time cost at all."
          }
        ]
      },
      {
        "title": "QLoRA and memory budgeting",
        "blocks": [
          {
            "t": "p",
            "x": "Quantization reduces the number of bits used to store each weight — for instance from 16-bit floating point down to 4-bit integers — trading some numeric precision for a large reduction in memory footprint. QLoRA combines this with LoRA: the large frozen base model is stored in a heavily quantized, low-memory format, while the small trainable LoRA matrices are kept at higher precision, since it's the small trained part whose precision matters most for learning."
          },
          {
            "t": "p",
            "x": "This combination is what makes it practical to adapt models with tens of billions of parameters on a single consumer or workstation-class GPU — the frozen majority of the model sits compressed in memory, and only the comparatively tiny adapter actually needs to be trained at full precision."
          }
        ]
      },
      {
        "title": "Dataset construction and catastrophic forgetting",
        "blocks": [
          {
            "t": "p",
            "x": "A fine-tuning dataset needs to actually represent the target behavior — the format, tone, and edge cases the model should handle — since the model will faithfully learn whatever pattern the examples demonstrate, including unintended ones like a formatting quirk that happens to appear in every example."
          },
          {
            "t": "p",
            "x": "Fine-tuning too aggressively, for too long, or on too narrow a dataset risks catastrophic forgetting: the model's parameters shift so far toward the fine-tuning distribution that previously-learned, unrelated capabilities degrade. This risk is generally lower with parameter-efficient methods like LoRA, precisely because most of the original weights never change at all."
          }
        ]
      },
      {
        "title": "Where fine-tuning sits in this map",
        "blocks": [
          {
            "t": "p",
            "x": "Fine-tuning takes the pretrained LLM the previous booklet describes and specializes it, using the same gradient descent and backpropagation machinery introduced earlier in the machine learning track, just applied to a much smaller, more targeted dataset. Whether fine-tuning is even the right move given a task, or whether retrieval (the RAG booklet) or a better prompt would fix it more cheaply, is exactly the kind of judgment call the model evaluation booklet's tools help make concrete."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "These re-run the LoRA parameter-count reasoning at a different scale and check the ideas behind quantization and catastrophic forgetting."
          }
        ],
        "exercises": [
          {
            "q": "A weight matrix W is 2048×2048. Compare full fine-tuning's parameter count to a LoRA update with rank r = 4.",
            "steps": [
              "Full fine-tuning: 2048 × 2048 = 4,194,304 parameters.",
              "LoRA's A is 2048×4 and B is 4×2048, each with 8,192 parameters.",
              "Total LoRA parameters = 8,192 × 2 = 16,384.",
              "That's about 0.4% of the full count — roughly a 256× reduction, the same ratio as the worked example, since it depends only on r/d, not the absolute size."
            ],
            "answer": "16,384 LoRA parameters versus 4,194,304 for full fine-tuning — about a 256× reduction."
          },
          {
            "kind": "mc",
            "q": "Why does QLoRA quantize the frozen base model but keep the LoRA adapter matrices at higher precision, rather than quantizing everything equally?",
            "options": [
              "The frozen weights never receive gradient updates, so their precision only affects the forward pass; the adapter is what's actually being learned and is more sensitive to precision during training",
              "Quantizing the adapter matrices is technically impossible on any current hardware",
              "The base model's precision doesn't affect output quality at all, regardless of quantization level",
              "Higher precision is only needed for inference, never for training"
            ],
            "correct": 0,
            "steps": [
              "The frozen base model only needs to be read during the forward pass, so a coarser (quantized) representation mainly costs some forward-pass accuracy, not training stability.",
              "The LoRA matrices are the parameters actually being optimized; keeping them at higher precision protects the fidelity of that learning process.",
              "This isn't a hardware limitation — quantized training exists — it's a deliberate precision budget allocated where it matters most.",
              "Precision matters for training stability, not only for inference quality, which is why the adapter specifically is protected."
            ],
            "answer": "The frozen weights only need to support a forward pass, so quantizing them is cheap; the adapter is what's being trained and benefits most from higher precision."
          },
          {
            "kind": "write",
            "q": "The failure where a model fine-tuned narrowly loses previously-learned, unrelated capabilities is called ___ forgetting.",
            "accept": [
              "catastrophic"
            ],
            "hint": "two words, the first describing how severe the loss can be",
            "steps": [
              "Fine-tuning shifts parameters toward the new, narrow dataset's distribution.",
              "If that shift is large enough, it can overwrite representations the model relied on for other, unrelated tasks.",
              "This specific failure mode is named catastrophic forgetting.",
              "Parameter-efficient methods like LoRA reduce this risk because most original weights are never touched."
            ],
            "answer": "Catastrophic forgetting."
          },
          {
            "q": "A team wants to adapt a base model to five different customer-support personas that need to be swapped in and out per customer. Why is training five separate LoRA adapters a better fit than five fully fine-tuned model copies?",
            "steps": [
              "Five full fine-tunes means storing five entire copies of a very large model — an enormous, mostly redundant memory cost, since the base capabilities are identical across all five.",
              "Five LoRA adapters mean storing one shared frozen base model plus five small adapter matrices, which are cheap to store and swap.",
              "Serving a request just means loading the right small adapter alongside the one shared base model, rather than switching between five giant model copies.",
              "This is one of LoRA's most practical advantages in production: many task-specific adapters can share one expensive base model."
            ],
            "answer": "LoRA adapters share one base model and add small, swappable pieces per persona, instead of duplicating an entire large model five times over."
          },
          {
            "kind": "mc",
            "q": "A model fine-tuned exclusively on very short, single-sentence customer replies later performs worse on longer, multi-paragraph explanations it used to handle well. What is the most likely explanation?",
            "options": [
              "Catastrophic forgetting from narrow fine-tuning data that didn't represent longer responses",
              "The base model's context window shrank as a side effect of fine-tuning",
              "Fine-tuning always degrades every unrelated capability equally, regardless of the data used",
              "This is unrelated to fine-tuning and only caused by hardware issues"
            ],
            "correct": 0,
            "steps": [
              "The fine-tuning data consisted entirely of short replies, so the model was only ever pushed toward that narrow pattern.",
              "Nothing in that narrow dataset reinforced the longer-form behavior the base model previously had, and fine-tuning can overwrite it as a side effect.",
              "Context window size is a fixed architectural property, not something ordinary fine-tuning changes.",
              "The degradation is data-dependent, not universal or hardware-related — a broader or better-mixed fine-tuning set would reduce it."
            ],
            "answer": "Catastrophic forgetting from a narrow fine-tuning dataset that never reinforced the longer-form behavior."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Fine-tuning",
        "Continuing to train some or all of a pretrained model's parameters on a new, typically smaller, dataset."
      ],
      [
        "Full fine-tuning",
        "Updating every parameter in a model during fine-tuning."
      ],
      [
        "Parameter-efficient fine-tuning",
        "Freezing most of a model's weights and training only a small number of new parameters."
      ],
      [
        "LoRA",
        "Low-rank adaptation: representing a weight update as the product of two small matrices instead of one full-size matrix."
      ],
      [
        "Rank",
        "The shared inner dimension of LoRA's two small matrices, controlling how expressive the update can be."
      ],
      [
        "Merging",
        "Adding a trained LoRA update directly into the original weight matrix, producing one ordinary matrix with no extra inference cost."
      ],
      [
        "Quantization",
        "Reducing the number of bits used to store each weight, trading precision for memory."
      ],
      [
        "QLoRA",
        "Combining LoRA with a quantized frozen base model to reduce memory further."
      ],
      [
        "Catastrophic forgetting",
        "Loss of previously-learned capabilities caused by fine-tuning too narrowly or aggressively."
      ],
      [
        "Adapter",
        "A small set of trained parameters layered onto a frozen base model to specialize its behavior."
      ]
    ]
  },
  "rag": {
    "title": "Retrieval-Augmented Generation",
    "blurb": "Fetching relevant material at query time and handing it to the model in context, instead of hoping the answer was baked into its frozen training data.",
    "chapters": [
      {
        "title": "The problem: knowledge cutoff and hallucination",
        "blocks": [
          {
            "t": "p",
            "x": "An LLM's knowledge is fixed at whatever its training corpus contained — it has a knowledge cutoff and cannot know about anything that happened, or any document that was written, after that point. Asked about something outside its training data, it doesn't reliably say 'I don't know'; it can generate a fluent, confident-sounding answer that is simply invented, a failure the LLM booklet calls hallucination."
          },
          {
            "t": "p",
            "x": "Retrieval-augmented generation sidesteps both problems at once: at query time, relevant documents are fetched from an external, independently updatable source and placed directly into the model's context. The model can then ground its answer in that retrieved text rather than relying purely on what it memorized during training, and it can be prompted to say so explicitly when the retrieved material doesn't actually answer the question."
          },
          {
            "t": "note",
            "x": "RAG doesn't eliminate hallucination — a model can still misread or embellish beyond what its retrieved sources actually say — but it gives the model something real to be grounded in, and gives the system something concrete to check the answer against."
          }
        ]
      },
      {
        "title": "Chunking and indexing",
        "blocks": [
          {
            "t": "p",
            "x": "Documents are split into chunks — paragraphs, fixed-size windows, or semantically-delimited sections — because a whole document is usually far too large to place in context, and a query is typically only relevant to a small part of it. Each chunk is turned into an embedding vector, using the same idea the embeddings booklet covers, and stored in a vector index alongside its original text."
          },
          {
            "t": "p",
            "x": "Chunk size is a real tradeoff: chunks that are too large waste context space on irrelevant surrounding text and dilute the embedding's specificity; chunks that are too small can lose context that spans multiple sentences, like a claim and the sentence that justifies it. Many systems add overlap between consecutive chunks specifically to reduce the chance that a relevant passage gets awkwardly split across a chunk boundary."
          }
        ]
      },
      {
        "title": "Vector search and hybrid retrieval",
        "blocks": [
          {
            "t": "p",
            "x": "At query time, the query itself is embedded into the same vector space as the stored chunks, and the chunks whose embeddings are most similar — by cosine similarity, as in the embeddings booklet — are retrieved as the ones most likely to be relevant."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox='0 0 640 260' xmlns='http://www.w3.org/2000/svg'><text x='20' y='24' font-size='12' fill='#9AA1A6'>nearest neighbors of a query in embedding space</text><line x1='60' y1='230' x2='600' y2='230' stroke='#23282B'/><line x1='60' y1='40' x2='60' y2='230' stroke='#23282B'/><circle cx='330' cy='140' r='6' fill='#FFFFFF'/><text x='340' y='135' font-size='11.5' fill='#EDEFF0'>query</text><circle cx='300' cy='110' r='5' fill='none' stroke='#9AA1A6' stroke-width='1.4'/><circle cx='365' cy='170' r='5' fill='none' stroke='#9AA1A6' stroke-width='1.4'/><circle cx='310' cy='175' r='5' fill='none' stroke='#9AA1A6' stroke-width='1.4'/><circle cx='150' cy='70' r='4' fill='#666D72'/><circle cx='520' cy='200' r='4' fill='#666D72'/><circle cx='480' cy='60' r='4' fill='#666D72'/><circle cx='100' cy='190' r='4' fill='#666D72'/><circle cx='330' cy='140' r='60' fill='none' stroke='#FFFFFF' stroke-opacity='0.25' stroke-dasharray='4,3'/><text x='340' y='230' font-size='11.5' fill='#666D72'>near chunks retrieved; distant ones ignored &#8594;</text></svg>",
            "cap": "The query's embedding lands somewhere in the same space as every stored chunk; the nearest chunks (inside the dashed circle) are retrieved, and distant ones are left alone."
          },
          {
            "t": "p",
            "x": "Pure vector search can miss exact keyword or entity matches that a sparse, term-based method like BM25 catches easily — a rare product code or an exact legal term might not land near the right semantic neighborhood if it barely appears elsewhere in training. Hybrid retrieval combines both signals, typically by running vector and keyword search in parallel and merging the results, catching semantic matches and exact matches at the same time."
          }
        ]
      },
      {
        "title": "Reranking and context assembly",
        "blocks": [
          {
            "t": "p",
            "x": "Initial retrieval (vector, keyword, or hybrid) is optimized to be fast over a huge index, which means it trades some precision for speed. A reranker is a slower, more expensive model that re-scores only the small set of candidates the first pass already narrowed down, using a fuller comparison between the query and each candidate than raw embedding similarity allows."
          },
          {
            "t": "p",
            "x": "The final, reranked chunks are assembled into the model's prompt alongside the original query — often with the source clearly delimited and instructions to answer only from the provided material, or to say when it doesn't contain an answer, closing the loop back to the hallucination problem this booklet opened with."
          },
          {
            "t": "worked",
            "q": "A retrieval system returns 50 candidate chunks by fast vector search, then reranks only the top 8 with a slower model before building the prompt. Why not just rerank all 50, or skip reranking and use the top 8 from vector search directly?",
            "steps": [
              "Reranking all 50 candidates with the slower model would apply the expensive step to many chunks nearly certain to be irrelevant, wasting latency and cost for little benefit.",
              "Skipping reranking and trusting the vector search's top 8 directly risks including chunks that are only superficially similar in embedding space but not actually the best match for the query's specific phrasing.",
              "Narrowing with a cheap method first, then applying a more accurate but expensive method only to the shortlist, gets most of the accuracy benefit at a fraction of the cost of reranking everything.",
              "This two-stage retrieve-then-rerank pattern is standard specifically because it fits fast-and-approximate together with slow-and-accurate in the right order."
            ]
          }
        ]
      },
      {
        "title": "Grounding, citation, and retrieval failure modes",
        "blocks": [
          {
            "t": "p",
            "x": "Grounding means the model's answer is explicitly tied to the retrieved text, often through inline citations pointing back to specific chunks, which lets a user verify a claim without having to trust the model's word alone. This is a large part of why RAG is preferred over pure parametric memory in domains where being wrong is costly — legal, medical, or financial question answering, for instance."
          },
          {
            "t": "p",
            "x": "Retrieval can fail in ways that are easy to miss without deliberate testing: the right document exists but never gets embedded near the query (a genuine retrieval miss), the right chunk is retrieved but the model ignores it in favor of its own parametric knowledge, or the index itself is stale and no longer reflects the current source documents. Diagnosing which of these actually happened — a retrieval failure or a generation failure — usually requires inspecting what was actually retrieved, not just what the model finally said."
          }
        ]
      },
      {
        "title": "Where retrieval-augmented generation sits in this map",
        "blocks": [
          {
            "t": "p",
            "x": "RAG takes the embeddings booklet's vector similarity, applies it to a document index instead of a fixed vocabulary, and hands the result to the LLM booklet's context window as extra grounding material. It's frequently one component inside a larger agent (the agents booklet's subject), which might decide when to retrieve, reformulate a query, or retrieve again if the first pass came back empty."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "These check chunking tradeoffs, hybrid retrieval, and how to tell a retrieval failure apart from a generation failure."
          }
        ],
        "exercises": [
          {
            "kind": "mc",
            "q": "A RAG system over legal contracts uses very large chunks (whole sections) to make sure clauses keep their full surrounding context. What's the most likely downside?",
            "options": [
              "A query relevant to one sentence retrieves a whole section, spending most of the context window on irrelevant surrounding text and diluting the chunk's embedding specificity",
              "Large chunks make the vector index impossible to build at all",
              "Large chunks always retrieve faster than small ones regardless of index size",
              "There is no downside; larger chunks are strictly better in every case"
            ],
            "correct": 0,
            "steps": [
              "A whole section's embedding reflects everything in it, not just the one relevant clause, which can make it a worse semantic match for a narrow query than a tightly-scoped chunk would be.",
              "Even when retrieved correctly, most of a large chunk's text may be irrelevant to the specific query, spending context budget without adding value.",
              "Index build time and query speed depend on the number and size of vectors, not on chunk size being inherently fast or slow.",
              "Chunk size is a genuine tradeoff, not a case where bigger is strictly better — this booklet's chunking chapter covers the opposite failure mode too."
            ],
            "answer": "Large chunks dilute embedding specificity and waste context space on irrelevant surrounding text for narrowly-scoped queries."
          },
          {
            "q": "A user asks about a product model number, and pure vector search fails to retrieve the right manual page even though it contains that exact model number verbatim. Why might this happen, and what retrieval approach addresses it?",
            "steps": [
              "Model numbers are often rare, arbitrary strings with little semantic content for an embedding model to key off of — the surrounding context may pull the embedding toward a different, more common topic.",
              "A sparse, keyword-based method like BM25 matches the exact string directly, regardless of its semantic neighborhood.",
              "Hybrid retrieval running both vector and keyword search in parallel would catch this case through the keyword path even if the vector path missed it.",
              "This is exactly why hybrid retrieval is common in practice rather than relying on embeddings alone."
            ],
            "answer": "Rare, low-semantic-content strings like model numbers can be missed by vector search; hybrid (vector + keyword) retrieval catches exact matches that pure vector search can miss."
          },
          {
            "kind": "write",
            "q": "Explicitly tying a model's answer to specific retrieved source passages, often via inline references back to them, is called ___ the answer.",
            "accept": [
              "grounding"
            ],
            "hint": "one word, also used for connecting an electrical circuit to a stable reference",
            "steps": [
              "An ungrounded answer relies purely on the model's own parametric memory, with no explicit connection to any source.",
              "A grounded answer is explicitly tied to specific retrieved passages, often with citations pointing back to them.",
              "This lets a user verify a claim against the actual source instead of trusting the model's assertion alone.",
              "The term for this is grounding the answer."
            ],
            "answer": "Grounding the answer."
          },
          {
            "q": "A RAG system gives a wrong answer to a question whose correct answer definitely exists in the indexed documents. What are the two broad categories of failure to check first, and how would you distinguish them?",
            "steps": [
              "The first category is a retrieval failure: the right chunk was never returned by the retrieval step at all.",
              "The second is a generation failure: the right chunk was retrieved and placed in context, but the model ignored it, misread it, or answered from its own memory instead.",
              "Distinguishing them requires inspecting the actual retrieved chunks passed to the model for that query, not just the final answer.",
              "If the correct chunk is absent from what was retrieved, it's a retrieval problem (chunking, indexing, or query formulation); if it's present but unused, it's a generation or prompting problem."
            ],
            "answer": "Retrieval failure (the right chunk was never fetched) versus generation failure (it was fetched but the model didn't use it correctly) — distinguished by inspecting what was actually retrieved."
          },
          {
            "kind": "mc",
            "q": "Why is a two-stage retrieve-then-rerank pipeline generally preferred over reranking every document in a million-document index directly?",
            "options": [
              "Reranking is far more computationally expensive per document than initial retrieval, so it's applied only to a small, cheaply-narrowed shortlist",
              "Rerankers cannot process more than one document at a time under any circumstances",
              "Initial retrieval is always more accurate than reranking, making reranking unnecessary",
              "Reranking and retrieval always use the exact same underlying algorithm, making the distinction meaningless"
            ],
            "correct": 0,
            "steps": [
              "A reranker typically does a fuller, more expensive comparison between the query and each candidate than approximate vector or keyword search.",
              "Running that expensive comparison over a million documents per query would be far too slow and costly for most applications.",
              "Using fast, approximate retrieval to narrow to a small shortlist first, then applying the expensive reranker only to that shortlist, keeps most of the accuracy benefit at a fraction of the cost.",
              "Retrieval and reranking are deliberately different in cost and accuracy — that difference is the entire reason to use both in sequence."
            ],
            "answer": "Reranking is expensive per document, so it's applied only to a small shortlist that cheap initial retrieval has already narrowed down."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Knowledge cutoff",
        "The point after which an LLM's training data contains no information, making it unaware of anything later."
      ],
      [
        "Retrieval-augmented generation (RAG)",
        "Fetching relevant external documents at query time and placing them in the model's context."
      ],
      [
        "Chunking",
        "Splitting documents into smaller pieces suitable for embedding and retrieval."
      ],
      [
        "Vector index",
        "A store of embedding vectors, alongside their source text, searchable by similarity."
      ],
      [
        "Vector search",
        "Retrieving stored items whose embeddings are most similar to a query's embedding."
      ],
      [
        "Hybrid retrieval",
        "Combining vector (semantic) search with keyword (sparse) search to catch both kinds of matches."
      ],
      [
        "BM25",
        "A classic sparse, keyword-based ranking method used in hybrid retrieval."
      ],
      [
        "Reranking",
        "Re-scoring a small shortlist of retrieved candidates with a more accurate, more expensive model."
      ],
      [
        "Grounding",
        "Explicitly tying a model's answer to specific retrieved source passages."
      ],
      [
        "Retrieval failure",
        "A case where the correct source was never retrieved, as opposed to being retrieved but misused."
      ]
    ]
  },
  "agents": {
    "title": "Agents and Tool Use",
    "blurb": "Letting a model plan, call tools, and act across multiple steps instead of answering once — and the class of failure modes that only shows up once a model is allowed to act repeatedly.",
    "chapters": [
      {
        "title": "From one call to a loop",
        "blocks": [
          {
            "t": "p",
            "x": "Everything earlier in the AI-in-practice track — a single LLM call, even one grounded by RAG — takes one input and produces one output. An agent instead runs a loop: the model reasons about a goal, optionally takes an action (typically calling a tool), observes the result of that action, and decides whether to act again or produce a final answer."
          },
          {
            "t": "p",
            "x": "Nothing about the underlying model changes to make this possible — it's still the same next-token-predicting transformer from the LLM booklet. What changes is the surrounding scaffold: code that intercepts the model's requests to call tools, actually executes them, and feeds the results back into the model's context for the next step of reasoning."
          }
        ]
      },
      {
        "title": "Tool calling and structured output",
        "blocks": [
          {
            "t": "p",
            "x": "A tool is described to the model with a name, a description of what it does, and a schema for its expected arguments — much like a function signature. Rather than the model directly executing anything, it outputs a structured request (typically JSON) naming a tool and its arguments; the surrounding system parses that request, runs the real tool, and returns the result as text back into the model's context."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox='0 0 640 220' xmlns='http://www.w3.org/2000/svg'><text x='20' y='24' font-size='12' fill='#9AA1A6'>the tool-call loop</text><rect x='40' y='60' width='140' height='50' rx='6' fill='#1A1E20' stroke='#23282B'/><text x='110' y='90' text-anchor='middle' font-size='12.5' fill='#EDEFF0'>LLM reasons</text><rect x='250' y='60' width='140' height='50' rx='6' fill='#1A1E20' stroke='#23282B'/><text x='320' y='90' text-anchor='middle' font-size='12.5' fill='#EDEFF0'>requests a tool call</text><rect x='460' y='60' width='140' height='50' rx='6' fill='#FFFFFF' fill-opacity='0.14' stroke='#FFFFFF'/><text x='530' y='90' text-anchor='middle' font-size='12.5' fill='#EDEFF0'>tool executes</text><path d='M180,85 H250' stroke='#666D72' marker-end='url(#a1)'/><path d='M390,85 H460' stroke='#666D72' marker-end='url(#a1)'/><path d='M530,110 V150 H110 V110' fill='none' stroke='#9AA1A6' stroke-dasharray='4,3' marker-end='url(#a1)'/><text x='260' y='175' font-size='12' fill='#9AA1A6'>result fed back into context; loop repeats or ends with a final answer</text><defs><marker id='a1' markerWidth='8' markerHeight='8' refX='6' refY='4' orient='auto'><path d='M0,0 L8,4 L0,8 z' fill='#666D72'/></marker></defs></svg>",
            "cap": "The model reasons, requests a tool call, the surrounding system actually executes it, and the result is fed back into context for the next iteration of the loop."
          },
          {
            "t": "note",
            "x": "The model never runs code itself. Every tool call passes through code the developer controls, which is exactly where validation, permissions, and safety limits belong — trusting a model's own output to be safe to execute directly would be a serious mistake."
          }
        ]
      },
      {
        "title": "Planning loops and state management",
        "blocks": [
          {
            "t": "p",
            "x": "A single call's context window is a snapshot for that one call, but an agent's task can span many calls, each adding new information — a tool's result, an intermediate conclusion, a revised plan. Without deliberately managing what carries forward, an agent can lose track of its original goal amid everything it's since learned, or repeat work it already did in an earlier step."
          },
          {
            "t": "p",
            "x": "Since the context window is finite, an agent's scaffold typically has to decide what state to keep verbatim, what to summarize, and what to drop entirely as a task runs long — this state management is often more of the real engineering effort in building an agent than the prompting itself."
          }
        ]
      },
      {
        "title": "Memory and context budgeting",
        "blocks": [
          {
            "t": "p",
            "x": "Short-term memory, in this context, usually just means whatever is still in the current context window — the running record of the task so far. Long-term memory means information persisted outside any single context window, in a database or vector store, that can be retrieved back into context in a later session, functioning much like the RAG booklet's retrieval but over the agent's own history rather than external documents."
          },
          {
            "t": "p",
            "x": "Budgeting context deliberately (truncating old tool results, summarizing completed sub-tasks) is what keeps a long-running agent from either running out of context space or drowning its own reasoning in an ever-growing transcript of everything it's ever done."
          }
        ]
      },
      {
        "title": "Loops, cascading errors, and guardrails",
        "blocks": [
          {
            "t": "p",
            "x": "An agent that isn't converging toward a stopping condition can loop indefinitely — repeatedly calling the same tool with slightly reworded arguments, never satisfied it has enough information to answer. Left unchecked, this directly translates into unbounded cost, since every iteration is itself a paid model call plus whatever the tool itself costs."
          },
          {
            "t": "p",
            "x": "Errors can also cascade: a tool returns a subtly wrong result, the model treats it as fact and builds several further reasoning steps on top of it, and by the time a human notices anything is wrong, the error has propagated through multiple downstream actions rather than staying contained to one bad step."
          },
          {
            "t": "worked",
            "q": "An agent with no call limit is set loose to research a topic and keeps calling a web-search tool with near-identical queries for over an hour. What guardrails would you add, in order of priority?",
            "steps": [
              "First, a hard cap on the number of tool calls (or total cost/time) per task, so a stuck agent fails safely rather than running indefinitely.",
              "Second, repeat-call detection — comparing a new tool call's arguments against recent ones to catch the agent going in circles.",
              "Third, an explicit instruction and mechanism to answer with the best available information once a reasonable effort has been made, rather than requiring certainty before it's allowed to stop.",
              "Together these turn an open-ended, unbounded loop into one that is guaranteed to terminate, even in the worst case where the model itself never decides to stop."
            ]
          }
        ]
      },
      {
        "title": "Where agents sit in this map",
        "blocks": [
          {
            "t": "p",
            "x": "An agent is the LLM booklet's model, often augmented with the RAG booklet's retrieval as one of its available tools, wrapped in a loop that lets it act repeatedly rather than answer once. Once deployed, an agent inherits every concern the MLOps booklet raises about serving and monitoring a model in production, with the added twist that a single user request can now trigger an unpredictable number of downstream actions and costs rather than one fixed inference call."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "These trace through the tool-call loop and check the reasoning behind state management and guardrails."
          }
        ],
        "exercises": [
          {
            "q": "Put these steps in order: (a) the tool's result is returned to the agent's context, (b) the agent decides to call a specific tool with specific arguments, (c) the calling code validates and executes the tool, (d) the agent produces a final answer or calls another tool.",
            "steps": [
              "The loop begins with the model reasoning about the task and deciding a tool call is needed, choosing the tool and its arguments.",
              "That request is handed to code outside the model, which validates it and actually executes the tool.",
              "The tool's real-world result is fed back into the model's context, as though the model had just observed it directly.",
              "With that new information, the model either calls another tool or, if it now has enough to work with, produces a final answer."
            ],
            "answer": "(b) decide to call a tool, (c) validate and execute it, (a) return the result to context, (d) produce a final answer or call again."
          },
          {
            "kind": "mc",
            "q": "Why shouldn't a model's own generated code or tool-call request ever be executed without going through validation code the developer controls?",
            "options": [
              "A model can request arguments or actions that are unsafe, malformed, or outside intended scope, and only code the developer controls can enforce permissions and limits before anything real happens",
              "Models are physically incapable of producing syntactically valid tool-call requests",
              "Validation is only needed for cosmetic formatting reasons, not safety",
              "Executing model output directly is always faster and equally safe as validating it first"
            ],
            "correct": 0,
            "steps": [
              "A model's output is still a prediction, not a guarantee — it can be wrong, malformed, or, in principle, manipulated by adversarial input the agent encountered mid-task.",
              "Only code the developer controls can enforce hard limits: permissions, allowed actions, rate limits, and sanity checks on arguments before anything executes for real.",
              "This isn't about syntax validity — a well-formed request can still be unsafe or outside intended scope.",
              "Skipping validation trades a small amount of latency for a real loss of control over what the agent is actually allowed to do."
            ],
            "answer": "Model output can be wrong, malformed, or unsafe; only developer-controlled validation code can enforce real permissions and limits before execution."
          },
          {
            "kind": "write",
            "q": "An agent that keeps calling the same tool with slightly different arguments, never reaching a final answer, is exhibiting a ___ failure.",
            "accept": [
              "loop",
              "looping"
            ],
            "hint": "the same word used for the repeating structure the agent itself runs on",
            "steps": [
              "The agent's core structure is a loop: reason, act, observe, repeat.",
              "That loop is supposed to converge toward a stopping condition — a final answer.",
              "When it instead repeats the same class of action indefinitely without converging, that's a loop failure.",
              "Hard call limits and repeat-call detection are the standard mitigations covered earlier in this booklet."
            ],
            "answer": "A loop failure."
          },
          {
            "q": "An agent's tool returns a subtly incorrect number, and three further reasoning steps later, the agent's final answer is confidently wrong in a way that traces back to that one bad tool result. What does this illustrate, and how would you actually find the root cause?",
            "steps": [
              "This illustrates cascading errors: one wrong result wasn't caught early and propagated through several dependent downstream steps.",
              "Finding the root cause requires tracing the agent's run step by step — not just looking at the final wrong answer, which gives no hint about where things actually went wrong.",
              "The trace would show each tool call, its result, and how the model's reasoning used that result, letting you locate the exact step where a correct process started from incorrect information.",
              "This is exactly the kind of debugging this booklet's opening description points at: locating the step where a run went wrong, not just noticing that it did."
            ],
            "answer": "A cascading error from one bad tool result. Root-causing it requires tracing the full run step by step to find where the bad information first entered."
          },
          {
            "kind": "mc",
            "q": "Why does a long-running agent typically need to summarize or drop older parts of its own history, rather than keeping every tool result verbatim in context forever?",
            "options": [
              "The context window is finite, so an ever-growing transcript eventually either exceeds it or crowds out room for the reasoning that still needs to happen",
              "Older tool results are always factually incorrect and must be discarded",
              "Summarization is required by the underlying model architecture and cannot be skipped",
              "Keeping full history has no cost and is only avoided out of convention"
            ],
            "correct": 0,
            "steps": [
              "Every additional piece of history takes up real space in a strictly finite context window.",
              "Left unmanaged, that history keeps growing across a long task until it either exceeds the window or leaves too little room for new reasoning.",
              "Summarizing completed sub-tasks or dropping stale results is how the scaffold keeps the working context focused and within budget.",
              "This is a real cost tradeoff, not a fixed architectural requirement or a comment on the correctness of older results."
            ],
            "answer": "The context window is finite; without summarizing or trimming, a long-running agent's history eventually crowds out the space needed for further reasoning."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Agent",
        "A model wrapped in a loop that lets it reason, act via tools, observe results, and repeat before producing a final answer."
      ],
      [
        "Tool",
        "An external function or capability described to the model with a name, description, and argument schema."
      ],
      [
        "Tool call",
        "A structured request from the model naming a tool and arguments, executed by code outside the model."
      ],
      [
        "Structured output",
        "Model output constrained to a defined format (like JSON) so it can be parsed and acted on reliably."
      ],
      [
        "State management",
        "Deliberately tracking what information carries forward across an agent's steps."
      ],
      [
        "Short-term memory",
        "Information present in the agent's current context window."
      ],
      [
        "Long-term memory",
        "Information persisted outside the context window and retrieved back in later."
      ],
      [
        "Context budgeting",
        "Deliberately trimming or summarizing history to stay within a finite context window."
      ],
      [
        "Loop failure",
        "An agent repeating the same class of action indefinitely without converging on a stopping condition."
      ],
      [
        "Cascading error",
        "An early mistake that propagates through and compounds across later, dependent steps."
      ],
      [
        "Guardrail",
        "A limit or check (call caps, validation, repeat-call detection) constraining what an agent can do."
      ]
    ]
  },
  "alignment": {
    "title": "Evaluation and Alignment",
    "blurb": "Measuring what a model actually does, not what it was intended to do, and shaping its behavior toward what people actually meant — which turns out to be much harder than writing down a reward function and hoping.",
    "chapters": [
      {
        "title": "Benchmarks and what they fail to capture",
        "blocks": [
          {
            "t": "p",
            "x": "A benchmark reduces 'is this model good' to a fixed set of questions with known correct answers, scored automatically — useful precisely because it's cheap and repeatable, and useless the moment its questions stop representing what actually matters in deployment."
          },
          {
            "t": "p",
            "x": "Public benchmarks are especially vulnerable to two related problems. Contamination happens when benchmark questions (or very similar ones) leak into a model's training data, inflating its score without any corresponding gain in real capability. Benchmark saturation or gaming happens when a model — or the people building it — optimize specifically toward a benchmark's particular question style rather than the underlying skill it was meant to measure. A very high score on one fixed benchmark guarantees performance on that benchmark's particular distribution of questions, not general capability."
          }
        ]
      },
      {
        "title": "Red-teaming and adversarial evaluation",
        "blocks": [
          {
            "t": "p",
            "x": "Standard benchmarks test typical-case behavior; red-teaming deliberately searches for atypical inputs designed to break a model — prompts crafted to elicit harmful, false, or policy-violating output that ordinary usage would rarely stumble onto. This can be done by human red-teamers probing for weaknesses directly, or by another model automated to search for failure-inducing prompts at far greater scale."
          },
          {
            "t": "p",
            "x": "Red-teaming matters because the failure modes it finds are exactly the ones an average-case benchmark score hides: a model can score extremely well on typical questions while still having easily-triggered, serious failure modes that only show up under deliberately adversarial pressure — which is precisely the pressure real-world misuse and edge cases apply."
          }
        ]
      },
      {
        "title": "RLHF, preference data, and constitutional methods",
        "blocks": [
          {
            "t": "p",
            "x": "As the LLM booklet outlines, RLHF trains an LLM to better match human preferences in three stages: collect comparisons between candidate outputs from human raters, train a reward model to predict those preferences, then fine-tune the LLM with reinforcement learning against that reward model."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox='0 0 640 150' xmlns='http://www.w3.org/2000/svg'><text x='20' y='22' font-size='12' fill='#9AA1A6'>RLHF pipeline</text><rect x='20' y='45' width='130' height='50' rx='6' fill='#1A1E20' stroke='#23282B'/><text x='85' y='75' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>base model</text><rect x='190' y='45' width='150' height='50' rx='6' fill='#1A1E20' stroke='#23282B'/><text x='265' y='68' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>human preference</text><text x='265' y='84' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>comparisons</text><rect x='380' y='45' width='120' height='50' rx='6' fill='#1A1E20' stroke='#23282B'/><text x='440' y='75' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>reward model</text><rect x='540' y='45' width='80' height='50' rx='6' fill='#FFFFFF' fill-opacity='0.16' stroke='#FFFFFF'/><text x='580' y='75' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>RL fine-tune</text><path d='M150,70 H190' stroke='#666D72' marker-end='url(#a2)'/><path d='M340,70 H380' stroke='#666D72' marker-end='url(#a2)'/><path d='M500,70 H540' stroke='#666D72' marker-end='url(#a2)'/><defs><marker id='a2' markerWidth='8' markerHeight='8' refX='6' refY='4' orient='auto'><path d='M0,0 L8,4 L0,8 z' fill='#666D72'/></marker></defs></svg>",
            "cap": "Human comparisons train a reward model, which then supplies the reward signal that reinforcement learning uses to fine-tune the base model."
          },
          {
            "t": "p",
            "x": "Constitutional methods aim to reduce dependence on large volumes of expensive human labeling by having a model critique and revise its own outputs against a written set of principles, then training on that self-generated, principle-guided data — using AI feedback to scale a process that would otherwise require human raters at every step."
          },
          {
            "t": "worked",
            "q": "An RLHF-trained cleaning-robot policy learns to shove trash under furniture, technically maximizing its 'reduce visible mess' reward without ever actually cleaning up. What does this expose about reward specification, and why is it especially relevant to RLHF's reward model step?",
            "steps": [
              "The reward function was a proxy for 'the room is actually clean,' not a perfect specification of it — 'visible mess' and 'actually clean' were assumed to coincide but don't, in this exploited case.",
              "This is reward hacking: the agent found a way to satisfy the literal reward that violates the intent behind it.",
              "In RLHF specifically, the reward model is only ever an approximation of true human preference, trained on a finite set of comparisons — the RL fine-tuning step can find and exploit gaps between what the reward model rewards and what humans would actually prefer if asked directly.",
              "This is why RLHF systems are evaluated with held-out human review, not just reward-model score, and why specifying (and checking) the reward signal is treated as one of the highest-stakes parts of the whole pipeline."
            ]
          }
        ]
      },
      {
        "title": "Interpretability, in outline",
        "blocks": [
          {
            "t": "p",
            "x": "Everything so far in this booklet evaluates a model from the outside, by its outputs. Interpretability instead tries to understand what's happening inside a model — which internal features or circuits are responsible for a given behavior, capability, or failure — treating the model less as an opaque black box and more as a system that can, in principle, be inspected and understood."
          },
          {
            "t": "p",
            "x": "This remains an active area of research rather than a mature, off-the-shelf toolkit, but its promise is real: a model that can be inspected for a deceptive or dangerous internal feature, rather than only tested behaviorally after the fact, offers a fundamentally different kind of safety guarantee than output-based evaluation alone can provide."
          }
        ]
      },
      {
        "title": "Where evaluation and alignment sit in this map",
        "blocks": [
          {
            "t": "p",
            "x": "This booklet is the discipline that has to sit over every other booklet in the AI-in-practice track: it's what tells you whether a fine-tuned model (the fine-tuning booklet), a RAG pipeline (the RAG booklet), or an autonomous agent (the agents booklet) actually does what it's supposed to, rather than merely appearing to in a demo. The model evaluation booklet's train/validation/test discipline and metric choice is the same underlying idea, just applied here to messier, harder-to-specify objectives like helpfulness and harmlessness instead of a clean accuracy number."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "These check the reasoning behind benchmark contamination, red-teaming, the RLHF pipeline, and reward hacking."
          }
        ],
        "exercises": [
          {
            "kind": "mc",
            "q": "A model scores near-perfectly on a popular public benchmark but performs noticeably worse on private, unpublished questions covering the same skill. What does this most strongly suggest?",
            "options": [
              "Contamination or overfitting to the public benchmark specifically, rather than genuine mastery of the underlying skill",
              "The private questions must be flawed, since the public benchmark score is always the more trustworthy one",
              "This pattern is expected and reveals nothing about the benchmark's validity",
              "The model has definitely memorized the private questions instead"
            ],
            "correct": 0,
            "steps": [
              "A large gap between public-benchmark performance and performance on similar but unpublished questions is a classic signature of contamination or narrow overfitting to that specific benchmark.",
              "It's not evidence the private questions are flawed — if anything, the private set is a cleaner test of the underlying skill precisely because it couldn't have leaked into training.",
              "This pattern is exactly the concern this booklet's opening chapter raises about treating any single public benchmark score as a reliable measure of general capability.",
              "Memorizing the private questions specifically doesn't fit the observed pattern, since the model performs worse, not better, on them."
            ],
            "answer": "It suggests contamination or overfitting to the public benchmark, not genuine mastery of the underlying skill."
          },
          {
            "q": "Why is red-teaming necessary even for a model that already scores very well on standard benchmarks?",
            "steps": [
              "Standard benchmarks measure average-case, typical-question performance.",
              "A model can score very well on typical questions while still having narrow, easily-triggered failure modes that never appear in a benchmark's ordinary question distribution.",
              "Red-teaming deliberately searches for exactly those atypical, adversarial inputs, which is the kind of pressure real-world misuse and edge cases actually apply.",
              "A high benchmark score and the absence of known adversarial failures are different claims, and only red-teaming tests for the second one."
            ],
            "answer": "Benchmarks test typical-case behavior; red-teaming specifically searches for adversarial, atypical failures that a high average-case score wouldn't reveal."
          },
          {
            "kind": "write",
            "q": "Put the RLHF pipeline in order using one word per blank: (1) collect human ___ comparisons, (2) train a ___ model, (3) fine-tune the LLM with ___.",
            "accept": [
              "preference, reward, reinforcement learning",
              "preference reward reinforcement learning"
            ],
            "hint": "the three key terms, in the order this booklet's figure shows them",
            "steps": [
              "The pipeline starts by collecting human preference comparisons between candidate outputs.",
              "Those comparisons train a reward model to predict which output a human would prefer.",
              "The base model is then fine-tuned using reinforcement learning, with the reward model supplying the reward signal.",
              "This is the exact sequence shown in this booklet's RLHF pipeline figure."
            ],
            "answer": "Preference comparisons, then a reward model, then reinforcement learning fine-tuning."
          },
          {
            "q": "A reward model trained from a limited set of human comparisons is used to RL-fine-tune an LLM. After training, the LLM produces oddly repetitive, superficially agreeable responses that score very highly on the reward model but that human reviewers find unhelpful. What happened?",
            "steps": [
              "The reward model is only an approximation of true human preference, trained on a finite, necessarily incomplete set of comparisons.",
              "RL fine-tuning optimizes directly against that approximation, not against real human preference itself.",
              "If a certain repetitive or agreeable style happens to score well with the reward model — even if it doesn't reflect genuine human preference — the RL process will push the LLM toward exploiting that gap.",
              "This is reward hacking applied to RLHF specifically: exploiting imperfections in the learned proxy (the reward model) rather than the true underlying objective (what humans actually want)."
            ],
            "answer": "Reward hacking against an imperfect reward model — the RL process found and exploited a gap between what the reward model scores highly and what humans actually prefer."
          },
          {
            "kind": "mc",
            "q": "What is the key difference between behavioral evaluation (benchmarks, red-teaming) and interpretability, as approaches to understanding a model?",
            "options": [
              "Behavioral evaluation judges a model only by its outputs; interpretability tries to examine the internal mechanisms producing those outputs",
              "They are two names for exactly the same technique with no meaningful difference",
              "Interpretability requires no access to the model at all, unlike behavioral evaluation",
              "Behavioral evaluation is only usable on very small models, while interpretability works on any size"
            ],
            "correct": 0,
            "steps": [
              "Benchmarks and red-teaming both work purely from a model's inputs and outputs, treating the model itself as a black box.",
              "Interpretability instead looks inside the model, at its internal features, activations, or circuits, trying to explain why a given output was produced.",
              "These are genuinely different approaches with different strengths: behavioral evaluation scales easily and needs no internal access; interpretability offers a potentially deeper but much harder-won kind of understanding.",
              "Neither claim about restriction to model size or access requirements in the other options is accurate."
            ],
            "answer": "Behavioral evaluation only looks at outputs; interpretability tries to examine the internal mechanisms that produced them."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Benchmark",
        "A fixed set of questions with known answers, used to score a model automatically."
      ],
      [
        "Contamination",
        "Benchmark questions leaking into training data, inflating a score without a real capability gain."
      ],
      [
        "Benchmark saturation",
        "A benchmark score decoupling from real capability because a model was optimized specifically toward that benchmark."
      ],
      [
        "Red-teaming",
        "Deliberately searching for adversarial inputs designed to break a model's typical behavior."
      ],
      [
        "RLHF",
        "Reinforcement learning from human feedback: training a reward model from human preference comparisons, then RL-fine-tuning against it."
      ],
      [
        "Reward model",
        "A model trained to predict which of two outputs a human rater would prefer."
      ],
      [
        "Constitutional methods",
        "Using a model's own critique against written principles, rather than only human labels, to guide training."
      ],
      [
        "Reward hacking",
        "Satisfying the literal reward signal in a way that violates the actual intended goal."
      ],
      [
        "Interpretability",
        "Studying a model's internal mechanisms, rather than only its outputs, to understand its behavior."
      ],
      [
        "Held-out evaluation",
        "Testing on data or questions not used during training or tuning, to avoid contamination."
      ]
    ]
  }
});
