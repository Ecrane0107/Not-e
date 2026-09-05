Object.assign(BOOKLETS, {
  "optimization": {
      "title": "Optimization",
      "blurb": "Finding the input that makes a function smallest, and knowing whether the answer you found is the real one.",
      "chapters": [
        {
          "title": "The shape of the problem",
          "blocks": [
            {
              "t": "p",
              "x": "An optimization problem has three parts: an objective function to minimise or maximise, a set of variables you are allowed to choose, and possibly constraints restricting which choices are legal. Almost everything downstream in this map is an instance of it. Training a model minimises a loss over the weights. Fitting a regression minimises squared error. Scheduling minimises cost subject to capacity."
            },
            {
              "t": "p",
              "x": "Maximising is minimising in disguise — maximise f by minimising −f — so the whole subject is written in terms of minimisation by convention."
            },
            {
              "t": "p",
              "x": "A point where the gradient is zero is called stationary, and it is a candidate for a minimum. It is only a candidate: the gradient also vanishes at maxima and at saddle points, where the surface curves up in one direction and down in another. Distinguishing them requires curvature, which is why the second derivative reappears here."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Objective",
                  "The function being minimised. In machine learning, the loss."
                ],
                [
                  "Feasible set",
                  "The choices the constraints permit."
                ],
                [
                  "Local minimum",
                  "Lower than everything nearby."
                ],
                [
                  "Global minimum",
                  "Lower than everything, full stop."
                ],
                [
                  "Stationary point",
                  "Where the gradient is zero — minimum, maximum or saddle."
                ]
              ]
            }
          ]
        },
        {
          "title": "Convexity, and why it is the dividing line",
          "blocks": [
            {
              "t": "p",
              "x": "A function is convex if the straight line between any two points on its graph lies on or above the graph. Equivalently, for a twice-differentiable function, its second derivative is non-negative everywhere. The bowl shape is the picture to hold."
            },
            {
              "t": "p",
              "x": "Convexity buys one enormous guarantee: every local minimum is a global minimum. So a descent method that stops moving has genuinely finished, and there is nothing better hiding elsewhere. You can walk downhill from any starting point and arrive at the same answer."
            },
            {
              "t": "p",
              "x": "Least squares, ridge regression, logistic regression, support vector machines and linear programming are all convex, which is why they were solved decades ago and why their solvers are reliable. Neural networks are not convex, not remotely — a network with millions of parameters has an astronomically complicated surface with countless local minima and vastly more saddle points."
            },
            {
              "t": "note",
              "x": "The reason deep learning works anyway is one of the field's genuine surprises. In very high dimensions, most stationary points turn out to be saddles rather than local minima, because being a local minimum requires curving upward in <em>every one</em> of a million directions at once. And empirically the local minima that do exist tend to have similar loss values, so which one you land in matters less than the theory would suggest."
            }
          ]
        },
        {
          "title": "Gradient descent and the learning rate",
          "blocks": [
            {
              "t": "p",
              "x": "The method is a single line, repeated: move against the gradient. w ← w − η∇f(w). The gradient supplies the direction of steepest increase, so its negative is the steepest way down, and η — the learning rate or step size — decides how far to go."
            },
            {
              "t": "p",
              "x": "The learning rate is the most consequential hyperparameter in machine learning, and its failure modes are worth recognising by sight rather than by guesswork."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<polyline points=\"30.0,56.0 31.7,61.9 33.3,67.7 35.0,73.4 36.7,79.0 38.3,84.4 40.0,89.8 41.7,94.9 43.3,100.0 45.0,104.9 46.7,109.8 48.3,114.4 50.0,119.0 51.7,123.4 53.3,127.8 55.0,131.9 56.7,136.0 58.3,139.9 60.0,143.8 61.7,147.4 63.3,151.0 65.0,154.4 66.7,157.8 68.3,160.9 70.0,164.0 71.7,166.9 73.3,169.8 75.0,172.4 76.7,175.0 78.3,177.4 80.0,179.8 81.7,181.9 83.3,184.0 85.0,185.9 86.7,187.8 88.3,189.4 90.0,191.0 91.7,192.4 93.3,193.8 95.0,194.9 96.7,196.0 98.3,196.9 100.0,197.8 101.7,198.4 103.3,199.0 105.0,199.4 106.7,199.8 108.3,199.9 110.0,200.0 111.7,199.9 113.3,199.8 115.0,199.4 116.7,199.0 118.3,198.4 120.0,197.8 121.7,196.9 123.3,196.0 125.0,194.9 126.7,193.8 128.3,192.4 130.0,191.0 131.7,189.4 133.3,187.8 135.0,185.9 136.7,184.0 138.3,181.9 140.0,179.8 141.7,177.4 143.3,175.0 145.0,172.4 146.7,169.8 148.3,166.9 150.0,164.0 151.7,160.9 153.3,157.8 155.0,154.4 156.7,151.0 158.3,147.4 160.0,143.8 161.7,139.9 163.3,136.0 165.0,131.9 166.7,127.8 168.3,123.4 170.0,119.0 171.7,114.4 173.3,109.7 175.0,104.9 176.7,100.0 178.3,94.9 180.0,89.8 181.7,84.4 183.3,79.0 185.0,73.4 186.7,67.8 188.3,61.9 190.0,56.0\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" opacity=\"0.75\"/><line x1=\"30\" y1=\"200\" x2=\"190\" y2=\"200\" stroke=\"#2E3438\"/><circle cx=\"182.0\" cy=\"83.4\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"1.0\"/><circle cx=\"173.4\" cy=\"109.7\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.88\"/><line x1=\"182.0\" y1=\"83.4\" x2=\"173.4\" y2=\"109.7\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"165.8\" cy=\"130.1\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.76\"/><line x1=\"173.4\" y1=\"109.7\" x2=\"165.8\" y2=\"130.1\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"159.1\" cy=\"145.8\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.64\"/><line x1=\"165.8\" y1=\"130.1\" x2=\"159.1\" y2=\"145.8\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"153.2\" cy=\"158.1\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.52\"/><line x1=\"159.1\" y1=\"145.8\" x2=\"153.2\" y2=\"158.1\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"148.0\" cy=\"167.5\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.4\"/><line x1=\"153.2\" y1=\"158.1\" x2=\"148.0\" y2=\"167.5\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"143.4\" cy=\"174.8\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.28\"/><line x1=\"148.0\" y1=\"167.5\" x2=\"143.4\" y2=\"174.8\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"139.4\" cy=\"180.5\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.16000000000000003\"/><line x1=\"143.4\" y1=\"174.8\" x2=\"139.4\" y2=\"180.5\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><text x=\"110\" y=\"228\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">η too small</text><text x=\"110\" y=\"246\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">creeps, wastes compute</text>\n<polyline points=\"250.0,56.0 251.7,61.9 253.3,67.7 255.0,73.4 256.7,79.0 258.3,84.4 260.0,89.8 261.7,94.9 263.3,100.0 265.0,104.9 266.7,109.8 268.3,114.4 270.0,119.0 271.7,123.4 273.3,127.8 275.0,131.9 276.7,136.0 278.3,139.9 280.0,143.8 281.7,147.4 283.3,151.0 285.0,154.4 286.7,157.8 288.3,160.9 290.0,164.0 291.7,166.9 293.3,169.8 295.0,172.4 296.7,175.0 298.3,177.4 300.0,179.8 301.7,181.9 303.3,184.0 305.0,185.9 306.7,187.8 308.3,189.4 310.0,191.0 311.7,192.4 313.3,193.8 315.0,194.9 316.7,196.0 318.3,196.9 320.0,197.8 321.7,198.4 323.3,199.0 325.0,199.4 326.7,199.8 328.3,199.9 330.0,200.0 331.7,199.9 333.3,199.8 335.0,199.4 336.7,199.0 338.3,198.4 340.0,197.8 341.7,196.9 343.3,196.0 345.0,194.9 346.7,193.8 348.3,192.4 350.0,191.0 351.7,189.4 353.3,187.8 355.0,185.9 356.7,184.0 358.3,181.9 360.0,179.8 361.7,177.4 363.3,175.0 365.0,172.4 366.7,169.8 368.3,166.9 370.0,164.0 371.7,160.9 373.3,157.8 375.0,154.4 376.7,151.0 378.3,147.4 380.0,143.8 381.7,139.9 383.3,136.0 385.0,131.9 386.7,127.8 388.3,123.4 390.0,119.0 391.7,114.4 393.3,109.7 395.0,104.9 396.7,100.0 398.3,94.9 400.0,89.8 401.7,84.4 403.3,79.0 405.0,73.4 406.7,67.8 408.3,61.9 410.0,56.0\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" opacity=\"0.75\"/><line x1=\"250\" y1=\"200\" x2=\"410\" y2=\"200\" stroke=\"#2E3438\"/><circle cx=\"402.0\" cy=\"83.4\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"1.0\"/><circle cx=\"351.6\" cy=\"189.5\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.88\"/><line x1=\"402.0\" y1=\"83.4\" x2=\"351.6\" y2=\"189.5\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"336.5\" cy=\"199.1\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.76\"/><line x1=\"351.6\" y1=\"189.5\" x2=\"336.5\" y2=\"199.1\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"331.9\" cy=\"199.9\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.64\"/><line x1=\"336.5\" y1=\"199.1\" x2=\"331.9\" y2=\"199.9\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"330.6\" cy=\"200.0\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.52\"/><line x1=\"331.9\" y1=\"199.9\" x2=\"330.6\" y2=\"200.0\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><text x=\"330\" y=\"228\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">η about right</text><text x=\"330\" y=\"246\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">converges quickly</text>\n<polyline points=\"470.0,56.0 471.7,61.9 473.3,67.7 475.0,73.4 476.7,79.0 478.3,84.4 480.0,89.8 481.7,94.9 483.3,100.0 485.0,104.9 486.7,109.8 488.3,114.4 490.0,119.0 491.7,123.4 493.3,127.8 495.0,131.9 496.7,136.0 498.3,139.9 500.0,143.8 501.7,147.4 503.3,151.0 505.0,154.4 506.7,157.8 508.3,160.9 510.0,164.0 511.7,166.9 513.3,169.8 515.0,172.4 516.7,175.0 518.3,177.4 520.0,179.8 521.7,181.9 523.3,184.0 525.0,185.9 526.7,187.8 528.3,189.4 530.0,191.0 531.7,192.4 533.3,193.8 535.0,194.9 536.7,196.0 538.3,196.9 540.0,197.8 541.7,198.4 543.3,199.0 545.0,199.4 546.7,199.8 548.3,199.9 550.0,200.0 551.7,199.9 553.3,199.8 555.0,199.4 556.7,199.0 558.3,198.4 560.0,197.8 561.7,196.9 563.3,196.0 565.0,194.9 566.7,193.8 568.3,192.4 570.0,191.0 571.7,189.4 573.3,187.8 575.0,185.9 576.7,184.0 578.3,181.9 580.0,179.8 581.7,177.4 583.3,175.0 585.0,172.4 586.7,169.8 588.3,166.9 590.0,164.0 591.7,160.9 593.3,157.8 595.0,154.4 596.7,151.0 598.3,147.4 600.0,143.8 601.7,139.9 603.3,136.0 605.0,131.9 606.7,127.8 608.3,123.4 610.0,119.0 611.7,114.4 613.3,109.7 615.0,104.9 616.7,100.0 618.3,94.9 620.0,89.8 621.7,84.4 623.3,79.0 625.0,73.4 626.7,67.8 628.3,61.9 630.0,56.0\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" opacity=\"0.75\"/><line x1=\"470\" y1=\"200\" x2=\"630\" y2=\"200\" stroke=\"#2E3438\"/><circle cx=\"582.0\" cy=\"177.0\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"1.0\"/><circle cx=\"514.8\" cy=\"172.1\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.88\"/><line x1=\"582.0\" y1=\"177.0\" x2=\"514.8\" y2=\"172.1\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"588.7\" cy=\"166.3\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.76\"/><line x1=\"514.8\" y1=\"172.1\" x2=\"588.7\" y2=\"166.3\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"507.4\" cy=\"159.2\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.64\"/><line x1=\"588.7\" y1=\"166.3\" x2=\"507.4\" y2=\"159.2\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><circle cx=\"596.9\" cy=\"150.6\" r=\"3.4\" fill=\"#EDEFF0\" opacity=\"0.52\"/><line x1=\"507.4\" y1=\"159.2\" x2=\"596.9\" y2=\"150.6\" stroke=\"#EDEFF0\" stroke-width=\"1.3\" opacity=\"0.55\" stroke-dasharray=\"3 2\"/><text x=\"550\" y=\"228\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">η too large</text><text x=\"550\" y=\"246\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">overshoots and diverges</text>\n</svg>",
              "cap": "The same problem at three learning rates. Too small wastes time; too large overshoots and can diverge outright. The usable window depends on the curvature of the surface."
            },
            {
              "t": "worked",
              "q": "For f(w) = w², at what learning rates does gradient descent converge?",
              "steps": [
                "f′(w) = 2w, so the update is w ← w − η(2w) = w(1 − 2η).",
                "Each step multiplies w by the factor (1 − 2η).",
                "The sequence shrinks to zero only if |1 − 2η| < 1.",
                "Solving gives 0 < η < 1, with η = 0.5 landing exactly on the minimum in one step."
              ],
              "answer": "Convergence for 0 < η < 1, divergence at η ≥ 1. The threshold is set by curvature — for f(w) = aw² it becomes η < 1/a, so a sharper bowl demands smaller steps."
            },
            {
              "t": "p",
              "x": "This is why learning rate schedules exist. A large rate early covers ground quickly; decaying it later allows fine positioning without oscillating around the minimum. Warmup — starting small and increasing — helps when early gradients are large and unrepresentative, which is common in transformer training."
            }
          ]
        },
        {
          "title": "Conditioning, momentum and adaptive methods",
          "blocks": [
            {
              "t": "p",
              "x": "Plain gradient descent struggles when the surface is much steeper in some directions than others — an ill-conditioned problem. The gradient then points mostly across the narrow valley rather than along it, so progress toward the minimum is slow while the iterates bounce from wall to wall."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"26\" font-size=\"12.5\" fill=\"#666D72\">features on different scales — narrow valley</text>\n<text x=\"370\" y=\"26\" font-size=\"12.5\" fill=\"#666D72\">after normalising — round bowl</text>\n<ellipse cx=\"150\" cy=\"148\" rx=\"46\" ry=\"11\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.84\"/><ellipse cx=\"150\" cy=\"148\" rx=\"92\" ry=\"22\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.6799999999999999\"/><ellipse cx=\"150\" cy=\"148\" rx=\"138\" ry=\"33\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.52\"/><ellipse cx=\"150\" cy=\"148\" rx=\"184\" ry=\"44\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.36\"/>\n<polyline points=\"70,60 160,132 96,140 158,144 120,146 152,147 140,148\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.7\"/>\n<circle cx=\"70\" cy=\"60\" r=\"3\" fill=\"#9AA1A6\"/><circle cx=\"150\" cy=\"148\" r=\"3.5\" fill=\"#FFF\"/>\n<ellipse cx=\"500\" cy=\"140\" rx=\"26\" ry=\"24\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.84\"/><ellipse cx=\"500\" cy=\"140\" rx=\"52\" ry=\"48\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.6799999999999999\"/><ellipse cx=\"500\" cy=\"140\" rx=\"78\" ry=\"72\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.52\"/><ellipse cx=\"500\" cy=\"140\" rx=\"104\" ry=\"96\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.36\"/>\n<polyline points=\"430,68 470,110 490,130 498,138 500,140\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.7\"/>\n<circle cx=\"430\" cy=\"68\" r=\"3\" fill=\"#9AA1A6\"/><circle cx=\"500\" cy=\"140\" r=\"3.5\" fill=\"#FFF\"/>\n<text x=\"30\" y=\"212\" font-size=\"12.5\" fill=\"#9AA1A6\">The gradient points across the valley, not along it, so the path oscillates.</text>\n<text x=\"370\" y=\"212\" font-size=\"12.5\" fill=\"#9AA1A6\">The gradient points at the minimum.</text>\n</svg>",
              "cap": "Ill-conditioning and its cure. Feature scales that differ by orders of magnitude produce the left picture; normalising inputs produces the right one, and that alone often fixes training more than any optimiser change."
            },
            {
              "t": "p",
              "x": "Three refinements address this, and they compose."
            },
            {
              "t": "list",
              "items": [
                "<strong>Momentum</strong> accumulates a running average of past gradients. Oscillating components cancel because they alternate sign, while the consistent downhill component reinforces. The physical analogy is a ball with inertia rolling down the valley rather than a point recalculating from scratch.",
                "<strong>Per-parameter adaptive rates</strong> — AdaGrad, RMSProp — divide each parameter's step by a running measure of its gradient magnitude, so rarely-updated parameters take larger steps and volatile ones take smaller ones.",
                "<strong>Adam</strong> combines both: momentum on the gradient and momentum on its squared magnitude, with a bias correction for the early steps. It is the default in most deep learning work because it is forgiving about the initial learning rate."
              ]
            },
            {
              "t": "note",
              "x": "Adam being forgiving is not the same as Adam being best. Well-tuned SGD with momentum still matches or beats Adam on some vision benchmarks and often generalises slightly better. The practical reading is that Adam gets you a working model faster, and tuning SGD may get you a marginally better one — which is why papers report both."
            }
          ]
        },
        {
          "title": "Constraints",
          "blocks": [
            {
              "t": "p",
              "x": "Many real problems restrict the feasible set: a portfolio's weights must sum to one, a schedule must respect capacity, a probability vector must be non-negative. The unconstrained minimum may be illegal, and the constrained one usually sits on the boundary."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<ellipse cx=\"180\" cy=\"150\" rx=\"30\" ry=\"30\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.83\"/><ellipse cx=\"180\" cy=\"150\" rx=\"60\" ry=\"60\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.6599999999999999\"/><ellipse cx=\"180\" cy=\"150\" rx=\"90\" ry=\"90\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.49\"/><ellipse cx=\"180\" cy=\"150\" rx=\"120\" ry=\"120\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.31999999999999995\"/>\n<line x1=\"60\" y1=\"212\" x2=\"320\" y2=\"42\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<circle cx=\"228\" cy=\"102\" r=\"5\" fill=\"#FFFFFF\"/>\n<text x=\"240\" y=\"94\" font-size=\"12\" fill=\"#EDEFF0\">optimum</text>\n<text x=\"286\" y=\"40\" font-size=\"12\" fill=\"#EDEFF0\">constraint</text>\n<text x=\"380\" y=\"80\" font-size=\"13.5\" fill=\"#9AA1A6\">Walking along the constraint line, the</text>\n<text x=\"380\" y=\"102\" font-size=\"13.5\" fill=\"#9AA1A6\">objective improves until the line just</text>\n<text x=\"380\" y=\"124\" font-size=\"13.5\" fill=\"#9AA1A6\">grazes a contour.</text>\n<text x=\"380\" y=\"160\" font-size=\"13.5\" fill=\"#9AA1A6\">At that tangent point the gradients of</text>\n<text x=\"380\" y=\"182\" font-size=\"13.5\" fill=\"#9AA1A6\">objective and constraint are parallel —</text>\n<text x=\"380\" y=\"204\" font-size=\"13.5\" fill=\"#9AA1A6\">which is all a Lagrange multiplier says.</text>\n</svg>",
              "cap": "A constrained optimum. Moving along the constraint improves the objective until the constraint just touches a contour, and at that tangency the two gradients are parallel."
            },
            {
              "t": "p",
              "x": "That tangency condition is what a Lagrange multiplier formalises. At the optimum, ∇f = λ∇g for the constraint g, meaning the objective's gradient has no component along the constraint left to exploit. The multiplier λ has a useful reading of its own: it is the rate at which the optimal value would improve if the constraint were relaxed slightly — the shadow price of the constraint."
            },
            {
              "t": "worked",
              "q": "Maximise xy subject to x + y = 10.",
              "steps": [
                "Substitute the constraint directly: y = 10 − x.",
                "The objective becomes g(x) = x(10 − x) = 10x − x².",
                "g′(x) = 10 − 2x, which is zero at x = 5.",
                "g″ = −2 < 0, confirming a maximum."
              ],
              "answer": "x = y = 5, giving 25. Substitution works when the constraint can be solved for a variable; Lagrange multipliers handle the cases where it cannot."
            },
            {
              "t": "p",
              "x": "Regularisation is a constraint in disguise, and it is worth seeing the equivalence. Adding λ‖w‖² to a loss is the unconstrained form of minimising the loss subject to ‖w‖² ≤ C. Every value of λ corresponds to some budget C, which is why turning λ up shrinks the weights: you are tightening the budget."
            }
          ]
        },
        {
          "title": "Beyond first order",
          "blocks": [
            {
              "t": "p",
              "x": "Gradient descent uses only slope. Newton's method also uses curvature, jumping directly to the minimum of the local quadratic approximation. It converges in dramatically fewer iterations — often a handful rather than thousands."
            },
            {
              "t": "p",
              "x": "It is nonetheless not used for large models, for a straightforward reason of size. The curvature information is the Hessian matrix, with one entry per pair of parameters. For a model with a billion parameters that is 10¹⁸ entries, which cannot be stored, let alone inverted. Quasi-Newton methods such as L-BFGS approximate it from recent gradients and are excellent for problems with thousands of parameters, but deep learning lives far past their range."
            },
            {
              "t": "p",
              "x": "So the field settled on first-order methods with cheap curvature-like corrections — which is exactly what Adam's per-parameter scaling is. It approximates the diagonal of the curvature, ignoring all the interactions, because the diagonal is the part you can afford."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The first three are computational; the last three ask you to diagnose a training run, which is the form this material usually takes in practice."
            }
          ],
          "exercises": [
            {
              "q": "Minimise f(w) = (w − 4)² from w = 0 with η = 0.2. Compute three steps.",
              "steps": [
                "f′(w) = 2(w − 4). At w = 0 this is −8.",
                "w ← 0 − 0.2(−8) = 1.6.",
                "At 1.6 the gradient is 2(1.6 − 4) = −4.8, so w ← 1.6 + 0.96 = 2.56.",
                "At 2.56 the gradient is −2.88, so w ← 2.56 + 0.576 = 3.136."
              ],
              "answer": "0 → 1.6 → 2.56 → 3.136, approaching 4. Each step covers 40% of the remaining distance, so it converges geometrically and never quite arrives."
            },
            {
              "q": "Is f(x, y) = x² + 3y² convex? What is its condition number, and what does that imply?",
              "steps": [
                "Second partials: ∂²f/∂x² = 2, ∂²f/∂y² = 6, and the cross terms are 0.",
                "Both are positive with no interaction, so the function is convex.",
                "The curvatures are 2 and 6, so the ratio is 3.",
                "The largest safe learning rate is set by the steepest direction, while progress in the shallow one is governed by the smallest."
              ],
              "answer": "Convex, condition number 3. Mild — but the same computation on real features scaled in metres and milligrams gives ratios in the thousands, and that is when descent starts zigzagging."
            },
            {
              "q": "Why does adding λ‖w‖² to a loss shrink the weights?",
              "steps": [
                "The gradient of the penalty with respect to w is 2λw.",
                "This term is added to the loss gradient at every step.",
                "It always points back toward the origin, in proportion to the current weight.",
                "So each update pulls the weight toward zero unless the data gradient opposes it."
              ],
              "answer": "Every step includes a pull toward the origin, and weights settle where the two forces balance. Equivalently, it is a budget constraint on ‖w‖² written in unconstrained form."
            },
            {
              "q": "Training loss oscillates wildly and sometimes becomes NaN. What is the first thing to change?",
              "steps": [
                "Oscillation that grows rather than settles is the signature of overshooting.",
                "The step is large enough that the update lands further from the minimum than it started.",
                "Successive overshoots compound until values overflow, producing inf and then NaN.",
                "Reduce the learning rate, typically by a factor of ten, and add gradient clipping."
              ],
              "answer": "Lower the learning rate. Exploding gradients from a deep network or an unnormalised input can produce the same picture, so clipping and input normalisation are the natural next checks."
            },
            {
              "q": "Training loss decreases steadily but extremely slowly, and the gradient is small everywhere. Two possible causes?",
              "steps": [
                "Small gradients with slow progress can mean the step size is simply too small.",
                "It can also mean the gradient has genuinely vanished through the network's depth.",
                "The first is fixed by raising the learning rate; the second is not, since there is little signal to scale up.",
                "Distinguish by inspecting gradient magnitudes per layer."
              ],
              "answer": "Learning rate too small, or vanishing gradients. If early layers have gradients orders of magnitude smaller than late ones, it is the second — and the fixes are architectural: ReLU, residual connections, normalisation layers."
            },
            {
              "q": "Two runs with identical settings but different random seeds reach different final losses. Is something broken?",
              "steps": [
                "The loss surface of a neural network is non-convex.",
                "Initialisation determines the starting point, and different starts descend into different basins.",
                "Shuffling order and any stochastic regularisation add further variation.",
                "Nothing about the procedure guarantees a unique answer."
              ],
              "answer": "No — this is expected for non-convex optimisation. It is also why single-run comparisons between models are weak evidence, and why results should be reported across several seeds."
            }
          ]
        }
      ]
    },
  "prob": {
      "title": "Probability",
      "blurb": "Reasoning about uncertainty: how evidence updates belief, and why averages behave better than the things they average.",
      "chapters": [
        {
          "title": "Why uncertainty needs its own mathematics",
          "blocks": [
            {
              "t": "p",
              "x": "Logic handles statements that are true or false. Most interesting statements are neither: this email is probably spam, this patient likely has the condition, this next token is plausibly \"the\". Probability is the mathematics of degrees of belief, and it is the foundation the entire machine learning half of this map is built on."
            },
            {
              "t": "p",
              "x": "The connection is direct. A classifier does not output a class; it outputs a probability distribution over classes. A language model does not output a word; it outputs a distribution over the vocabulary, and sampling from that distribution is what generation is. A loss function measures how badly a predicted distribution matches reality. Take probability out and there is no machine learning left."
            },
            {
              "t": "p",
              "x": "There are two schools of interpretation, and both are useful. The frequentist reading says a probability is a long-run frequency: a fair coin lands heads half the time over many flips. The Bayesian reading says it is a degree of belief that evidence can update: given what I have seen, this is how confident I am. The mathematics is identical either way; the difference is what you are willing to attach a probability to."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Experiment",
                  "A process with an uncertain outcome."
                ],
                [
                  "Sample space (Ω)",
                  "The set of all possible outcomes."
                ],
                [
                  "Event",
                  "A subset of the sample space — a collection of outcomes you care about."
                ],
                [
                  "Probability",
                  "A number from 0 to 1 assigned to an event, where the whole sample space gets 1."
                ]
              ]
            }
          ]
        },
        {
          "title": "Sample spaces and the axioms",
          "blocks": [
            {
              "t": "p",
              "x": "Everything rests on three rules, due to Kolmogorov. Probabilities are never negative. The probability of the entire sample space is 1. And for events that cannot happen together, the probability of either occurring is the sum of their probabilities. Every other result is derived from these."
            },
            {
              "t": "p",
              "x": "When outcomes are equally likely, probability reduces to counting, which is why the discrete mathematics booklet comes first. The probability of an event is the number of outcomes in it divided by the total number of outcomes — and getting that count right is usually the whole difficulty."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"70\" y=\"46\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"87\" y=\"64\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">2</text><rect x=\"108\" y=\"46\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"125\" y=\"64\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">3</text><rect x=\"146\" y=\"46\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"163\" y=\"64\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">4</text><rect x=\"184\" y=\"46\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"201\" y=\"64\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">5</text><rect x=\"222\" y=\"46\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"239\" y=\"64\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">6</text><rect x=\"260\" y=\"46\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"277\" y=\"64\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">7</text><rect x=\"70\" y=\"76\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"87\" y=\"94\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">3</text><rect x=\"108\" y=\"76\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"125\" y=\"94\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">4</text><rect x=\"146\" y=\"76\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"163\" y=\"94\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">5</text><rect x=\"184\" y=\"76\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"201\" y=\"94\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">6</text><rect x=\"222\" y=\"76\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"239\" y=\"94\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">7</text><rect x=\"260\" y=\"76\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"277\" y=\"94\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">8</text><rect x=\"70\" y=\"106\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"87\" y=\"124\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">4</text><rect x=\"108\" y=\"106\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"125\" y=\"124\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">5</text><rect x=\"146\" y=\"106\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"163\" y=\"124\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">6</text><rect x=\"184\" y=\"106\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"201\" y=\"124\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">7</text><rect x=\"222\" y=\"106\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"239\" y=\"124\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">8</text><rect x=\"260\" y=\"106\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"277\" y=\"124\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">9</text><rect x=\"70\" y=\"136\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"87\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">5</text><rect x=\"108\" y=\"136\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"125\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">6</text><rect x=\"146\" y=\"136\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"163\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">7</text><rect x=\"184\" y=\"136\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"201\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">8</text><rect x=\"222\" y=\"136\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"239\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">9</text><rect x=\"260\" y=\"136\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"277\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">10</text><rect x=\"70\" y=\"166\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"87\" y=\"184\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">6</text><rect x=\"108\" y=\"166\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"125\" y=\"184\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">7</text><rect x=\"146\" y=\"166\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"163\" y=\"184\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">8</text><rect x=\"184\" y=\"166\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"201\" y=\"184\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">9</text><rect x=\"222\" y=\"166\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"239\" y=\"184\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">10</text><rect x=\"260\" y=\"166\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"277\" y=\"184\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">11</text><rect x=\"70\" y=\"196\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"87\" y=\"214\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">7</text><rect x=\"108\" y=\"196\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"125\" y=\"214\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">8</text><rect x=\"146\" y=\"196\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"163\" y=\"214\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">9</text><rect x=\"184\" y=\"196\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"201\" y=\"214\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">10</text><rect x=\"222\" y=\"196\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"239\" y=\"214\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">11</text><rect x=\"260\" y=\"196\" width=\"34\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"277\" y=\"214\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\" class=\"mono\">12</text><text x=\"87\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">1</text><text x=\"60\" y=\"64\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">1</text><text x=\"125\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">2</text><text x=\"60\" y=\"94\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">2</text><text x=\"163\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">3</text><text x=\"60\" y=\"124\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">3</text><text x=\"201\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">4</text><text x=\"60\" y=\"154\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">4</text><text x=\"239\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">5</text><text x=\"60\" y=\"184\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">5</text><text x=\"277\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">6</text><text x=\"60\" y=\"214\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">6</text>\n<text x=\"340\" y=\"70\" font-size=\"13.5\" fill=\"#9AA1A6\">All 36 outcomes are equally likely. The</text>\n<text x=\"340\" y=\"92\" font-size=\"13.5\" fill=\"#9AA1A6\">probability of an event is simply how many</text>\n<text x=\"340\" y=\"114\" font-size=\"13.5\" fill=\"#9AA1A6\">cells it covers, out of 36.</text>\n<text x=\"340\" y=\"150\" font-size=\"13.5\" fill=\"#9AA1A6\">A sum of 7 covers the marked diagonal:</text>\n<text x=\"340\" y=\"172\" font-size=\"13.5\" fill=\"#9AA1A6\">6 cells, so 6/36 = 1/6.</text>\n<text x=\"340\" y=\"206\" font-size=\"13.5\" fill=\"#9AA1A6\">A sum of 2 covers one cell. Sums are not</text>\n<text x=\"340\" y=\"228\" font-size=\"13.5\" fill=\"#9AA1A6\">equally likely even though outcomes are.</text>\n</svg>",
              "cap": "The sample space for two dice. Outcomes are equally likely; sums are not, because different sums cover different numbers of cells."
            },
            {
              "t": "worked",
              "q": "Rolling two dice, find P(sum is 7) and P(sum is at least 10).",
              "steps": [
                "The sample space has 6 × 6 = 36 equally likely outcomes.",
                "Sum 7 occurs for (1,6), (2,5), (3,4), (4,3), (5,2), (6,1): six outcomes.",
                "Sum ≥ 10 means 10, 11 or 12: three ways, two ways and one way.",
                "That is 6/36 and 6/36."
              ],
              "answer": "Both are 1/6. Note the events cover the same number of cells by coincidence — a reminder to count rather than to guess from how the description sounds."
            },
            {
              "t": "p",
              "x": "Two rules save a lot of arithmetic. The complement rule says P(not A) = 1 − P(A), which is often far easier than counting A directly — computing \"at least one\" almost always means computing \"none\" and subtracting. The addition rule says P(A or B) = P(A) + P(B) − P(A and B), the inclusion-exclusion principle from the discrete booklet, subtracting the overlap that would otherwise be counted twice."
            },
            {
              "t": "worked",
              "q": "Rolling four dice, what is the probability of at least one six?",
              "steps": [
                "Counting the ways to get one, two, three or four sixes is laborious.",
                "Use the complement: the opposite of at least one six is no sixes at all.",
                "Each die avoids six with probability 5/6, and the dice are independent, so (5/6)⁴ ≈ 0.482.",
                "Subtract from 1."
              ],
              "answer": "About 0.518. The complement trick is the single most useful shortcut in elementary probability, and this specific problem is the one that founded the field."
            }
          ]
        },
        {
          "title": "Conditional probability and Bayes",
          "blocks": [
            {
              "t": "p",
              "x": "Most real questions are conditional. Not \"what is the chance of rain\" but \"what is the chance of rain given these clouds\". Conditioning means restricting attention to a smaller sample space — the one where the condition holds."
            },
            {
              "t": "p",
              "x": "P(A | B), read \"the probability of A given B\", is defined as P(A and B) / P(B). The denominator renormalises: within the world where B happened, what fraction also has A? This is why conditioning on an impossible event is undefined rather than zero."
            },
            {
              "t": "p",
              "x": "Rearranging gives the multiplication rule, P(A and B) = P(A | B)·P(B), and rearranging further gives Bayes' theorem, which is the most consequential formula in this booklet:"
            },
            {
              "t": "code",
              "x": "P(A | B)  =  P(B | A) · P(A) / P(B)"
            },
            {
              "t": "p",
              "x": "Bayes reverses the direction of a conditional. You usually know P(evidence | hypothesis) — how likely the symptom is if the disease is present, how likely this word is if the email is spam. What you want is P(hypothesis | evidence). Bayes converts one into the other, and the price is that you must supply P(hypothesis), the prior."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"60\" y=\"40\" width=\"240\" height=\"180\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\"/>\n<rect x=\"60\" y=\"40\" width=\"240\" height=\"1.8\" fill=\"#EDEFF0\"/>\n<rect x=\"60\" y=\"40\" width=\"2.4\" height=\"180\" fill=\"#EDEFF0\" opacity=\"0.9\"/>\n<rect x=\"60\" y=\"40\" width=\"240\" height=\"18\" fill=\"#EDEFF0\" opacity=\"0.22\"/>\n<rect x=\"60\" y=\"58\" width=\"240\" height=\"162\" fill=\"#EDEFF0\" opacity=\"0.05\"/>\n<rect x=\"60\" y=\"40\" width=\"237.6\" height=\"17.8\" fill=\"#EDEFF0\" opacity=\"0.42\"/>\n<rect x=\"60\" y=\"58\" width=\"2.4\" height=\"1.62\" fill=\"none\"/>\n<rect x=\"60\" y=\"58\" width=\"2.4\" height=\"162\" fill=\"#EDEFF0\" opacity=\"0.42\"/>\n<text x=\"310\" y=\"52\" font-size=\"12\" fill=\"#EDEFF0\">100 have it</text>\n<text x=\"310\" y=\"70\" font-size=\"11.5\" fill=\"#9AA1A6\">99 test positive</text>\n<text x=\"310\" y=\"150\" font-size=\"12\" fill=\"#EDEFF0\">9,900 do not</text>\n<text x=\"310\" y=\"168\" font-size=\"11.5\" fill=\"#9AA1A6\">99 test positive anyway (1%)</text>\n<text x=\"60\" y=\"30\" font-size=\"12\" fill=\"#666D72\">10,000 people</text>\n<text x=\"60\" y=\"244\" font-size=\"13\" fill=\"#9AA1A6\">198 positives in total, of which 99 are real — so a positive result means 50%.</text>\n</svg>",
              "cap": "The classic medical test, drawn as counts rather than percentages. Splitting a concrete population makes the answer visible without any algebra."
            },
            {
              "t": "worked",
              "q": "A disease affects 1% of people. A test is 99% accurate in both directions. You test positive. What is the probability you have the disease?",
              "steps": [
                "Take a population of 10,000. Then 100 have the disease and 9,900 do not.",
                "Of the 100, the test catches 99.",
                "Of the 9,900 healthy people, 1% test positive anyway: 99 false positives.",
                "Total positives: 99 + 99 = 198, of which 99 are genuine."
              ],
              "answer": "50%. The base rate dominates: because the healthy group is 99 times larger, its small error rate produces as many positives as the sick group's high accuracy does."
            },
            {
              "t": "note",
              "x": "This is base rate neglect, and it is not a curiosity. Most doctors asked this question answer around 95%. The lesson generalises to any rare-event detector — fraud, intrusion, rare disease screening. When the base rate is low, even an excellent classifier produces mostly false positives, which is exactly why precision and recall exist as separate metrics."
            }
          ]
        },
        {
          "title": "Random variables and distributions",
          "blocks": [
            {
              "t": "p",
              "x": "A random variable assigns a number to each outcome. Rolling two dice, the sum is a random variable; so is the maximum, or the number of sixes. The word is doubly misleading — it is neither random nor a variable, but a function from outcomes to numbers — but the name is fixed by tradition."
            },
            {
              "t": "p",
              "x": "A distribution describes how probability is spread across a random variable's values. Discrete variables take countable values and have a probability mass function giving P(X = x) directly. Continuous variables take any value in a range and have a probability density instead, where P(X = exactly x) is zero and only intervals carry probability. That is why continuous probabilities are integrals."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Bernoulli(p)",
                  "A single yes/no trial. One coin flip. The building block of binary classification."
                ],
                [
                  "Binomial(n, p)",
                  "The number of successes in n independent Bernoulli trials."
                ],
                [
                  "Poisson(λ)",
                  "Counts of rare events in a fixed interval — requests per second, defects per batch."
                ],
                [
                  "Uniform(a, b)",
                  "Every value in the range equally likely."
                ],
                [
                  "Normal(μ, σ²)",
                  "The bell curve. Appears whenever many small independent effects add up."
                ],
                [
                  "Categorical",
                  "A single draw from k options with given probabilities. Exactly what a softmax layer outputs."
                ]
              ]
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"264\" y=\"70.0\" width=\"132\" height=\"130.0\" fill=\"#EDEFF0\" opacity=\"0.2\"/><rect x=\"198\" y=\"70.0\" width=\"264\" height=\"130.0\" fill=\"#EDEFF0\" opacity=\"0.12\"/><rect x=\"132\" y=\"70.0\" width=\"396\" height=\"130.0\" fill=\"#EDEFF0\" opacity=\"0.07\"/>\n<line x1=\"100\" y1=\"200\" x2=\"560\" y2=\"200\" stroke=\"#2E3438\"/>\n<line x1=\"132\" y1=\"200\" x2=\"132\" y2=\"207\" stroke=\"#666D72\"/><text x=\"132\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ−3σ</text><line x1=\"198\" y1=\"200\" x2=\"198\" y2=\"207\" stroke=\"#666D72\"/><text x=\"198\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ−2σ</text><line x1=\"264\" y1=\"200\" x2=\"264\" y2=\"207\" stroke=\"#666D72\"/><text x=\"264\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ−1σ</text><line x1=\"330\" y1=\"200\" x2=\"330\" y2=\"207\" stroke=\"#666D72\"/><text x=\"330\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ</text><line x1=\"396\" y1=\"200\" x2=\"396\" y2=\"207\" stroke=\"#666D72\"/><text x=\"396\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ+1σ</text><line x1=\"462\" y1=\"200\" x2=\"462\" y2=\"207\" stroke=\"#666D72\"/><text x=\"462\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ+2σ</text><line x1=\"528\" y1=\"200\" x2=\"528\" y2=\"207\" stroke=\"#666D72\"/><text x=\"528\" y=\"224\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">μ+3σ</text>\n<polyline points=\"99.0,199.7 102.3,199.7 105.6,199.6 108.9,199.5 112.2,199.4 115.5,199.3 118.8,199.2 122.1,199.1 125.4,198.9 128.7,198.8 132.0,198.6 135.3,198.3 138.6,198.1 141.9,197.8 145.2,197.4 148.5,197.0 151.8,196.6 155.1,196.1 158.4,195.6 161.7,195.0 165.0,194.3 168.3,193.5 171.6,192.7 174.9,191.8 178.2,190.8 181.5,189.7 184.8,188.4 188.1,187.1 191.4,185.7 194.7,184.1 198.0,182.4 201.3,180.6 204.6,178.6 207.9,176.5 211.2,174.3 214.5,171.9 217.8,169.4 221.1,166.7 224.4,163.9 227.7,160.9 231.0,157.8 234.3,154.6 237.6,151.2 240.9,147.7 244.2,144.2 247.5,140.5 250.8,136.7 254.1,132.9 257.4,129.0 260.7,125.1 264.0,121.2 267.3,117.2 270.6,113.3 273.9,109.4 277.2,105.6 280.5,101.9 283.8,98.2 287.1,94.8 290.4,91.4 293.7,88.2 297.0,85.3 300.3,82.5 303.6,80.0 306.9,77.7 310.2,75.7 313.5,74.0 316.8,72.6 320.1,71.5 323.4,70.6 326.7,70.2 330.0,70.0 333.3,70.2 336.6,70.6 339.9,71.5 343.2,72.6 346.5,74.0 349.8,75.7 353.1,77.7 356.4,80.0 359.7,82.5 363.0,85.3 366.3,88.2 369.6,91.4 372.9,94.8 376.2,98.2 379.5,101.9 382.8,105.6 386.1,109.4 389.4,113.3 392.7,117.2 396.0,121.2 399.3,125.1 402.6,129.0 405.9,132.9 409.2,136.7 412.5,140.5 415.8,144.2 419.1,147.7 422.4,151.2 425.7,154.6 429.0,157.8 432.3,160.9 435.6,163.9 438.9,166.7 442.2,169.4 445.5,171.9 448.8,174.3 452.1,176.5 455.4,178.6 458.7,180.6 462.0,182.4 465.3,184.1 468.6,185.7 471.9,187.1 475.2,188.4 478.5,189.7 481.8,190.8 485.1,191.8 488.4,192.7 491.7,193.5 495.0,194.3 498.3,195.0 501.6,195.6 504.9,196.1 508.2,196.6 511.5,197.0 514.8,197.4 518.1,197.8 521.4,198.1 524.7,198.3 528.0,198.6 531.3,198.8 534.6,198.9 537.9,199.1 541.2,199.2 544.5,199.3 547.8,199.4 551.1,199.5 554.4,199.6 557.7,199.7 561.0,199.7\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"52\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\">68% within 1σ · 95% within 2σ · 99.7% within 3σ</text>\n</svg>",
              "cap": "The normal distribution, with the intervals worth memorising. Two standard deviations covering 95% is the origin of most confidence intervals you will meet."
            },
            {
              "t": "p",
              "x": "The normal distribution earns its dominance through the central limit theorem, covered at the end of this booklet. But be aware of its assumptions: it is symmetric and its tails are very thin, so extreme events are extraordinarily unlikely under it. Financial returns, city sizes and network traffic all have heavier tails than normal, and modelling them as normal is how you end up astonished by a once-in-ten-thousand-years event twice in a decade."
            }
          ]
        },
        {
          "title": "Expectation and variance",
          "blocks": [
            {
              "t": "p",
              "x": "Expectation is the long-run average value of a random variable: sum each value times its probability. It need not be a value the variable can actually take — the expected roll of a die is 3.5, which no die ever shows."
            },
            {
              "t": "worked",
              "q": "Compute the expected value of a single die, then of the sum of two.",
              "steps": [
                "Each face has probability 1/6, so E[X] = (1+2+3+4+5+6)/6.",
                "That is 21/6 = 3.5.",
                "Expectation is linear: E[X + Y] = E[X] + E[Y].",
                "So two dice give 3.5 + 3.5 = 7."
              ],
              "answer": "3.5 and 7. Linearity holds even when the variables are dependent, which makes it far more powerful than it first appears — you can compute an average without ever working out the joint distribution."
            },
            {
              "t": "p",
              "x": "Variance measures spread: the expected squared distance from the mean. Squaring keeps deviations from cancelling and punishes large ones disproportionately. Its square root, the standard deviation, is in the same units as the data and is the number to report."
            },
            {
              "t": "p",
              "x": "Two distributions can share a mean and behave completely differently. A wager returning exactly £5 and one returning £0 or £10 on a coin flip have the same expectation, and only one of them can bankrupt you. That gap is variance, and in machine learning it appears as the bias-variance trade-off: a model can be right on average and wildly unreliable on any particular input."
            },
            {
              "t": "note",
              "x": "Expectation is linear unconditionally; variance is not. Var(X + Y) = Var(X) + Var(Y) only when X and Y are independent. This is why averaging n independent measurements reduces variance by a factor of n, and standard error by √n — and why correlated errors do not average out, which is the whole reason ensemble methods work best on models that fail differently."
            }
          ]
        },
        {
          "title": "Independence, joints and the central limit theorem",
          "blocks": [
            {
              "t": "p",
              "x": "Two events are independent when knowing one tells you nothing about the other: P(A | B) = P(A), equivalently P(A and B) = P(A)·P(B). Independence is a strong assumption and it is usually assumed rather than verified, which is where a great many wrong answers originate."
            },
            {
              "t": "worked",
              "q": "Drawing one card, is \"is a king\" independent of \"is a heart\"?",
              "steps": [
                "P(king) = 4/52 = 1/13, and P(heart) = 13/52 = 1/4.",
                "Their product is 1/52.",
                "P(king and heart) = 1/52, since exactly one king of hearts exists.",
                "The product rule holds exactly."
              ],
              "answer": "Independent. Remove one non-heart king from the deck and it breaks — independence is a numerical coincidence of the distribution, not a fact about the concepts."
            },
            {
              "t": "p",
              "x": "A joint distribution gives probabilities over combinations of variables. Summing out one variable gives a marginal distribution over the rest, and fixing one gives a conditional. Nearly all of probabilistic modelling is moving between these three views: joint, marginal, conditional."
            },
            {
              "t": "h",
              "x": "The central limit theorem"
            },
            {
              "t": "p",
              "x": "Take independent samples from almost any distribution — skewed, discrete, oddly shaped, provided its variance is finite — and average them. As the sample size grows, the distribution of that average approaches a normal distribution, centred on the true mean, with standard deviation σ/√n."
            },
            {
              "t": "p",
              "x": "This is a remarkable result and it explains the normal distribution's ubiquity. Heights are the sum of many small genetic and environmental effects, so heights are approximately normal. Measurement error accumulates from many small independent errors, so it is approximately normal. The theorem is also the licence behind confidence intervals and A/B tests: it says a sample mean is normally distributed even when the underlying data is nothing of the sort."
            },
            {
              "t": "p",
              "x": "The √n is worth internalising. To halve your uncertainty you need four times the data; to reduce it tenfold, a hundred times. This diminishing return governs how much a bigger test, a bigger sample, or a bigger evaluation set is actually worth."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Work these on paper. Where a question involves a rare event, resist the intuitive answer and count a concrete population instead."
            }
          ],
          "exercises": [
            {
              "q": "Two dice are rolled. What is P(sum is even)?",
              "steps": [
                "A sum is even when both dice are even or both are odd.",
                "Both even: 3 × 3 = 9 outcomes. Both odd: 3 × 3 = 9 outcomes.",
                "Total favourable: 18 out of 36.",
                "Alternatively, note each die is equally likely to be odd or even and the parities are independent."
              ],
              "answer": "1/2. The second argument generalises to any number of dice, while counting does not."
            },
            {
              "q": "Flipping a fair coin 10 times, what is the probability of at least one head?",
              "steps": [
                "Counting all the ways to get one or more heads is laborious.",
                "Use the complement: no heads at all means ten tails.",
                "P(ten tails) = (1/2)¹⁰ = 1/1024.",
                "Subtract from 1."
              ],
              "answer": "1023/1024, about 0.999. The complement rule turns a ten-case problem into a one-case problem."
            },
            {
              "q": "1 in 1,000 transactions is fraudulent. A detector catches 99% of fraud and falsely flags 2% of legitimate transactions. A transaction is flagged. Is it fraud?",
              "steps": [
                "Take 100,000 transactions: 100 fraudulent, 99,900 legitimate.",
                "Of the 100 fraudulent, 99 are flagged.",
                "Of the 99,900 legitimate, 2% is 1,998 false flags.",
                "Total flags: 2,097, of which 99 are real fraud."
              ],
              "answer": "About 4.7%. Nineteen of every twenty flags are false, despite a detector that sounds excellent — which is why fraud teams tune for precision and why alert fatigue is a real operational problem."
            },
            {
              "q": "A bag holds 3 red and 2 blue balls. Two are drawn without replacement. What is P(both red)?",
              "steps": [
                "The first draw is red with probability 3/5.",
                "Given that, four balls remain and two are red.",
                "So the second is red with probability 2/4 = 1/2.",
                "Multiply the conditional probabilities: (3/5)(1/2)."
              ],
              "answer": "3/10. Note the draws are dependent — with replacement the answer would be (3/5)² = 9/25, and treating dependent draws as independent is a standard error."
            },
            {
              "q": "A game pays £10 with probability 0.1 and costs £1 to play. What is the expected profit per game, and what does that not tell you?",
              "steps": [
                "Expected winnings: 0.1 × £10 + 0.9 × £0 = £1.",
                "Subtract the £1 cost.",
                "Expected profit is £0 — the game is fair.",
                "But the outcome is either −£1 or +£9, never £0."
              ],
              "answer": "Expected profit £0, with high variance. Expectation describes the long run and says nothing about whether you can survive the short run, which is the entire subject of risk management."
            },
            {
              "q": "A test has mean 500 and standard deviation 100, normally distributed. Roughly what fraction score above 700?",
              "steps": [
                "700 is two standard deviations above the mean.",
                "About 95% of values fall within 2σ of the mean.",
                "The remaining 5% is split between both tails.",
                "The upper tail gets half."
              ],
              "answer": "About 2.5%. The symmetry of the normal distribution is what lets you halve the leftover tail without any further computation."
            },
            {
              "q": "You average 4 independent measurements each with standard deviation 10. What is the standard deviation of the average? How many measurements to reach 1?",
              "steps": [
                "For independent variables, the standard deviation of the mean is σ/√n.",
                "With n = 4: 10/√4 = 5.",
                "For σ/√n = 1 with σ = 10, we need √n = 10.",
                "So n = 100."
              ],
              "answer": "5, and 100 measurements. Halving uncertainty costs four times the data — the √n rule is why gains from more data slow down so sharply."
            }
          ]
        }
      ]
    },
  "calculus": {
      "title": "Calculus",
      "blurb": "Rates of change, and the chain rule that lets a model work out which way to move.",
      "chapters": [
        {
          "title": "What calculus is for here",
          "blocks": [
            {
              "t": "p",
              "x": "Calculus studies change. Given a quantity that varies, it answers two questions: how fast is it changing right now, and how much has accumulated so far. The first is differentiation, the second integration, and they turn out to be inverses of each other."
            },
            {
              "t": "p",
              "x": "For everything downstream of this node, the first question is the one that matters, and it matters for a single reason. Training a model means adjusting millions of numbers to make a loss smaller. To adjust a number sensibly you must know which direction reduces the loss and by how much, and that is a derivative. Backpropagation is not a new idea from machine learning; it is the chain rule, applied efficiently to a very large composed function."
            },
            {
              "t": "p",
              "x": "This booklet is aimed at understanding rather than at manual computation. You will not need to integrate by parts or memorise trigonometric identities. You will need to know exactly what a derivative is, be fluent with the chain rule, and be comfortable with gradients over many variables."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Derivative",
                  "The instantaneous rate of change of a function with respect to its input."
                ],
                [
                  "Partial derivative",
                  "The rate of change with respect to one input, holding the others fixed."
                ],
                [
                  "Gradient",
                  "The vector of all partial derivatives. It points in the direction of steepest increase."
                ],
                [
                  "Integral",
                  "Accumulated total — geometrically, area under a curve."
                ]
              ]
            }
          ]
        },
        {
          "title": "Limits, briefly",
          "blocks": [
            {
              "t": "p",
              "x": "Every definition in calculus rests on limits, so it is worth being clear what one is, without descending into the epsilon-delta formalism that dominates first courses."
            },
            {
              "t": "p",
              "x": "A limit asks: as the input approaches some value, what does the output approach? Crucially, this does not ask what happens <em>at</em> that value. The function need not even be defined there. Consider (x² − 1)/(x − 1). At x = 1 it is 0/0, which is meaningless. But factor the top as (x − 1)(x + 1) and cancel, and for every x other than 1 the function equals x + 1. So as x approaches 1, the output approaches 2, even though the function has a hole at exactly that point."
            },
            {
              "t": "p",
              "x": "That gap between \"approaches\" and \"equals\" is the whole reason limits exist. The derivative is defined as a ratio that becomes 0/0 at the point of interest, and the limit is what extracts a meaningful answer from it anyway."
            },
            {
              "t": "note",
              "x": "A function is continuous at a point when the limit equals the value there — no holes, no jumps. Differentiability is stronger: it also requires no sharp corners. The absolute value function is continuous at zero but has no derivative there, because the slope approaching from the left is −1 and from the right is +1. This matters in practice: ReLU has exactly this corner at zero, and frameworks simply pick a value by convention and carry on."
            }
          ]
        },
        {
          "title": "The derivative",
          "blocks": [
            {
              "t": "p",
              "x": "Take a function and two points on it. The line through those points is a secant, and its slope is rise over run — the average rate of change between them. Now slide the second point toward the first. The secants tilt toward a limiting position, and that limiting line is the tangent. Its slope is the derivative."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"52\" y1=\"228\" x2=\"370\" y2=\"228\" stroke=\"#2E3438\"/>\n<line x1=\"60\" y1=\"30\" x2=\"60\" y2=\"236\" stroke=\"#2E3438\"/>\n<polyline points=\"60.0,220.0 73.0,219.6 86.0,218.5 99.0,216.6 112.0,213.9 125.0,210.5 138.0,206.3 151.0,201.4 164.0,195.7 177.0,189.2 190.0,182.0 203.0,174.0 216.0,165.3 229.0,155.8 242.0,145.5 255.0,134.5 268.0,122.7 281.0,110.2 294.0,96.9 307.0,82.8 320.0,68.0 333.0,52.4 346.0,36.1\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.8\"/>\n<line x1=\"190\" y1=\"182\" x2=\"320.0\" y2=\"68.0\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" opacity=\"0.35\"/><circle cx=\"320.0\" cy=\"68.0\" r=\"3\" fill=\"#9AA1A6\" opacity=\"0.35\"/><line x1=\"190\" y1=\"182\" x2=\"268.0\" y2=\"122.7\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" opacity=\"0.5\"/><circle cx=\"268.0\" cy=\"122.7\" r=\"3\" fill=\"#9AA1A6\" opacity=\"0.5\"/><line x1=\"190\" y1=\"182\" x2=\"222.5\" y2=\"160.6\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" opacity=\"0.7\"/><circle cx=\"222.5\" cy=\"160.6\" r=\"3\" fill=\"#9AA1A6\" opacity=\"0.7\"/>\n<line x1=\"140\" y1=\"211.2\" x2=\"300\" y2=\"117.7\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<circle cx=\"190\" cy=\"182\" r=\"4.5\" fill=\"#FFFFFF\"/>\n<text x=\"178\" y=\"202\" font-size=\"12\" fill=\"#EDEFF0\">P</text>\n<text x=\"326\" y=\"66\" font-size=\"12\" fill=\"#9AA1A6\">Q</text>\n<text x=\"300\" y=\"112\" font-size=\"12\" fill=\"#EDEFF0\">tangent</text>\n<text x=\"400\" y=\"70\" font-size=\"13.5\" fill=\"#9AA1A6\">Each grey line is a secant through P and</text>\n<text x=\"400\" y=\"92\" font-size=\"13.5\" fill=\"#9AA1A6\">a nearby point Q. Its slope is the average</text>\n<text x=\"400\" y=\"114\" font-size=\"13.5\" fill=\"#9AA1A6\">rate of change between them.</text>\n<text x=\"400\" y=\"150\" font-size=\"13.5\" fill=\"#9AA1A6\">Slide Q toward P and the secants settle</text>\n<text x=\"400\" y=\"172\" font-size=\"13.5\" fill=\"#9AA1A6\">onto one line. Its slope is the derivative:</text>\n<text x=\"400\" y=\"194\" font-size=\"13.5\" fill=\"#9AA1A6\">the instantaneous rate at P.</text>\n</svg>",
              "cap": "The derivative as a limit of secant slopes. The average rate over an interval becomes the instantaneous rate at a point as the interval shrinks to nothing."
            },
            {
              "t": "p",
              "x": "Written out, the derivative of f at x is the limit as h approaches 0 of (f(x + h) − f(x))/h. The numerator is the rise, the denominator the run, and h shrinking to zero is what turns average into instantaneous. Both parts go to zero, which is why the limit is needed to make sense of the ratio."
            },
            {
              "t": "p",
              "x": "The interpretations are worth holding simultaneously. Geometrically, it is the slope of the tangent. Physically, if f is position then f′ is velocity. Practically, it answers: if I nudge the input by a tiny amount, how much does the output move, and in which direction? That last reading is the one that matters for training a model."
            },
            {
              "t": "terms",
              "items": [
                [
                  "f′(x)",
                  "Lagrange notation. Compact, and standard for single-variable work."
                ],
                [
                  "dy/dx",
                  "Leibniz notation. Verbose, but it makes the chain rule look like fractions cancelling, which is why it dominates in applied work."
                ],
                [
                  "∂f/∂x",
                  "Partial derivative — the ∂ signals that other variables exist and are being held fixed."
                ]
              ]
            }
          ]
        },
        {
          "title": "The rules you need",
          "blocks": [
            {
              "t": "p",
              "x": "A handful of rules cover almost everything you will meet. They are worth knowing well enough to apply without looking up, because reading a derivation is much harder when each step is opaque."
            },
            {
              "t": "list",
              "items": [
                "<strong>Constant</strong>: the derivative of a constant is 0. Nothing changes, so the rate of change is zero.",
                "<strong>Power</strong>: d/dx of xⁿ is n·xⁿ⁻¹. So x³ gives 3x², and x gives 1.",
                "<strong>Sum</strong>: the derivative of a sum is the sum of the derivatives. This is why a loss summed over a batch has a gradient that is the sum of per-example gradients.",
                "<strong>Product</strong>: (fg)′ = f′g + fg′. Not f′g′, which is the most common wrong guess.",
                "<strong>Quotient</strong>: (f/g)′ = (f′g − fg′)/g².",
                "<strong>Exponential</strong>: d/dx of eˣ is eˣ. It is its own derivative, which is why e turns up everywhere.",
                "<strong>Logarithm</strong>: d/dx of ln(x) is 1/x."
              ]
            },
            {
              "t": "worked",
              "q": "Differentiate f(x) = 3x⁴ − 5x² + 7.",
              "steps": [
                "The sum rule lets each term be handled separately.",
                "For 3x⁴, the power rule gives 3 · 4x³ = 12x³.",
                "For −5x², it gives −5 · 2x = −10x.",
                "The constant 7 differentiates to 0."
              ],
              "answer": "f′(x) = 12x³ − 10x. Notice the polynomial's degree dropped by one, which is always the case."
            },
            {
              "t": "note",
              "x": "The sum rule has a consequence worth naming. Because the derivative of a sum is the sum of derivatives, gradients over a mini-batch can be computed independently per example and added. That is why data parallelism works: split the batch across eight GPUs, compute eight gradients, add them. The mathematics permits it exactly."
            }
          ]
        },
        {
          "title": "The chain rule",
          "blocks": [
            {
              "t": "p",
              "x": "This is the rule that matters most, because a neural network is a function composed of functions composed of functions, and the chain rule is how you differentiate a composition."
            },
            {
              "t": "p",
              "x": "If y depends on u, and u depends on x, then dy/dx = (dy/du) · (du/dx). In words: the sensitivity of the output to the input is the product of the sensitivities along the way. Leibniz notation makes it look like the du terms cancel, which is a helpful mnemonic and not a proof."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"60\" y=\"50\" width=\"110\" height=\"54\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"115.0\" y=\"80\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">x</text><text x=\"115.0\" y=\"96\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">input</text>\n<rect x=\"250\" y=\"50\" width=\"150\" height=\"54\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"325.0\" y=\"80\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">u = g(x)</text><text x=\"325.0\" y=\"96\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">inner</text>\n<rect x=\"480\" y=\"50\" width=\"120\" height=\"54\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"540.0\" y=\"80\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">y = f(u)</text><text x=\"540.0\" y=\"96\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">outer</text>\n<line x1=\"170\" y1=\"77\" x2=\"242\" y2=\"77\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><path d=\"M234 71 L244 77 L234 83\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<line x1=\"400\" y1=\"77\" x2=\"472\" y2=\"77\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><path d=\"M464 71 L474 77 L464 83\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<line x1=\"242\" y1=\"140\" x2=\"172\" y2=\"140\" stroke=\"#9AA1A6\" stroke-width=\"1.6\" stroke-dasharray=\"5 3\"/><path d=\"M180 134 L170 140 L180 146\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.6\"/>\n<line x1=\"472\" y1=\"140\" x2=\"402\" y2=\"140\" stroke=\"#9AA1A6\" stroke-width=\"1.6\" stroke-dasharray=\"5 3\"/><path d=\"M410 134 L400 140 L410 146\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.6\"/>\n<text x=\"207\" y=\"132\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">du/dx</text>\n<text x=\"437\" y=\"132\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">dy/du</text>\n<text x=\"60\" y=\"182\" font-size=\"12\" fill=\"#666D72\">forward: values flow right. backward: sensitivities flow left, multiplying as they go.</text>\n<line x1=\"60\" y1=\"196\" x2=\"600\" y2=\"196\" stroke=\"#2E3438\"/>\n<text x=\"60\" y=\"228\" font-size=\"17\" fill=\"#EDEFF0\" class=\"mono\">dy/dx  =  dy/du  ×  du/dx</text>\n</svg>",
              "cap": "Values flow forward through the composition; sensitivities flow backward, multiplying at each stage. Backpropagation is exactly this picture, extended to millions of stages."
            },
            {
              "t": "p",
              "x": "An analogy makes the multiplication intuitive. Suppose a car travels twice as fast as a bicycle, and the bicycle travels three times as fast as a walker. Then the car is six times faster than the walker. Rates compose by multiplying, and the chain rule says the same about derivatives."
            },
            {
              "t": "worked",
              "q": "Differentiate y = (3x + 1)⁴.",
              "steps": [
                "Identify the composition: the outer function is u⁴, the inner is u = 3x + 1.",
                "Differentiate the outer with respect to u: 4u³.",
                "Differentiate the inner with respect to x: 3.",
                "Multiply, then substitute u back."
              ],
              "answer": "12(3x + 1)³. The common error is stopping at 4(3x+1)³ and forgetting the inner derivative — which in a network would mean silently scaling a gradient by the wrong factor."
            },
            {
              "t": "worked",
              "q": "A network computes z = w·x + b, then a = σ(z), then loss L = (a − y)². Find ∂L/∂w.",
              "steps": [
                "Three links: L depends on a, a on z, z on w. Multiply all three sensitivities.",
                "∂L/∂a = 2(a − y), from the power rule on the squared error.",
                "∂a/∂z = σ′(z), which for the logistic sigmoid is σ(z)(1 − σ(z)).",
                "∂z/∂w = x, since b and x are constants with respect to w."
              ],
              "answer": "∂L/∂w = 2(a − y) · σ(z)(1 − σ(z)) · x. This is one neuron's weight update, derived in full — and backpropagation is this same product extended layer by layer."
            },
            {
              "t": "note",
              "x": "The last worked example explains vanishing gradients in one line. The sigmoid's derivative peaks at 0.25, so each layer multiplies the gradient by at most a quarter. Through ten layers the gradient is scaled by at most 0.25¹⁰, roughly one in a million, and the early layers stop learning. ReLU's derivative is 1 for positive inputs, which is the entire reason it replaced the sigmoid in deep networks."
            }
          ]
        },
        {
          "title": "Partial derivatives and the gradient",
          "blocks": [
            {
              "t": "p",
              "x": "Real models have many inputs, not one. A loss function might depend on billions of weights, and the question becomes: how does the loss respond to each of them individually?"
            },
            {
              "t": "p",
              "x": "A partial derivative answers that. To compute ∂f/∂x, differentiate with respect to x while treating every other variable as a constant. Nothing else about the technique changes — it is ordinary differentiation with the other symbols frozen."
            },
            {
              "t": "worked",
              "q": "For f(x, y) = x²y + 3y, find both partial derivatives at (2, 3).",
              "steps": [
                "For ∂f/∂x, treat y as a constant. The term x²y differentiates to 2xy, and 3y has no x, so it gives 0.",
                "So ∂f/∂x = 2xy, which at (2,3) is 2·2·3 = 12.",
                "For ∂f/∂y, treat x as a constant. The term x²y differentiates to x², and 3y gives 3.",
                "So ∂f/∂y = x² + 3, which at (2,3) is 4 + 3 = 7."
              ],
              "answer": "∇f = (12, 7). Moving in x changes the output nearly twice as fast as moving in y, which is exactly the kind of imbalance that makes optimisation harder."
            },
            {
              "t": "p",
              "x": "Collecting all the partial derivatives into a vector gives the gradient, written ∇f. It has two properties that make it the engine of all training. It points in the direction of steepest increase of the function. And it is perpendicular to the contours — the level sets along which the function is constant."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<ellipse cx=\"185\" cy=\"140\" rx=\"30\" ry=\"18\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"1\"/><ellipse cx=\"185\" cy=\"140\" rx=\"60\" ry=\"36\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.7\"/><ellipse cx=\"185\" cy=\"140\" rx=\"90\" ry=\"54\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.45\"/><ellipse cx=\"185\" cy=\"140\" rx=\"120\" ry=\"72\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.1\" opacity=\"0.3\"/>\n<circle cx=\"185\" cy=\"140\" r=\"3.5\" fill=\"#EDEFF0\"/>\n<text x=\"192\" y=\"158\" font-size=\"11.5\" fill=\"#666D72\">minimum</text>\n<line x1=\"216\" y1=\"117\" x2=\"239\" y2=\"84\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<path d=\"M231 86 L241 81 L238 92\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2.2\"/>\n<circle cx=\"216\" cy=\"117\" r=\"3.5\" fill=\"#FFFFFF\"/>\n<text x=\"246\" y=\"78\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">∇f</text>\n<polyline points=\"110,64 152,104 170,126 180,135 185,140\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\" stroke-dasharray=\"4 3\" opacity=\"0.8\"/>\n<circle cx=\"110\" cy=\"64\" r=\"3\" fill=\"#9AA1A6\"/>\n<text x=\"76\" y=\"56\" font-size=\"11.5\" fill=\"#666D72\">start</text>\n<text x=\"330\" y=\"66\" font-size=\"13.5\" fill=\"#9AA1A6\">The rings are contours — sets of points</text>\n<text x=\"330\" y=\"88\" font-size=\"13.5\" fill=\"#9AA1A6\">with equal loss.</text>\n<text x=\"330\" y=\"122\" font-size=\"13.5\" fill=\"#9AA1A6\">The gradient at any point is perpendicular</text>\n<text x=\"330\" y=\"144\" font-size=\"13.5\" fill=\"#9AA1A6\">to its contour and points uphill, toward</text>\n<text x=\"330\" y=\"166\" font-size=\"13.5\" fill=\"#9AA1A6\">steeper loss.</text>\n<text x=\"330\" y=\"200\" font-size=\"13.5\" fill=\"#9AA1A6\">Training walks the dashed path: step</text>\n<text x=\"330\" y=\"222\" font-size=\"13.5\" fill=\"#9AA1A6\">against the gradient, recompute, repeat.</text>\n</svg>",
              "cap": "Contours of a loss surface, with the gradient at one point and a descent path. Gradient descent repeatedly steps against the gradient, which is the steepest way down."
            },
            {
              "t": "p",
              "x": "Gradient descent follows immediately. To reduce the loss, step in the direction opposite the gradient: w ← w − η∇L, where η is the learning rate controlling step size. The gradient supplies both direction and relative magnitude — steep directions get larger steps, flat ones smaller. Every optimiser you will meet is a refinement of this single line."
            },
            {
              "t": "note",
              "x": "Notice from the figure why elongated contours cause trouble. When one direction is far steeper than another, the gradient points mostly across the valley rather than along it, and descent zigzags. Momentum and Adam exist largely to damp that oscillation, and normalising inputs helps by making the contours rounder in the first place."
            }
          ]
        },
        {
          "title": "Curvature and approximation",
          "blocks": [
            {
              "t": "p",
              "x": "The second derivative is the derivative of the derivative: the rate at which the rate is changing. Geometrically it measures curvature, and its sign tells you which way the curve bends."
            },
            {
              "t": "list",
              "items": [
                "f″ > 0: the curve bends upward, like a bowl. A point where f′ = 0 here is a minimum.",
                "f″ < 0: it bends downward, like a dome. A point where f′ = 0 here is a maximum.",
                "f″ = 0: possibly an inflection point, where the bending changes direction."
              ]
            },
            {
              "t": "p",
              "x": "A function whose second derivative is non-negative everywhere is convex, and convexity is a strong guarantee: any local minimum is the global minimum, so a descent method that stops has genuinely finished. Linear and logistic regression have convex losses. Neural networks emphatically do not."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"26\" font-size=\"12.5\" fill=\"#666D72\">convex — one minimum, gradient descent finds it</text>\n<text x=\"390\" y=\"20\" font-size=\"12.5\" fill=\"#666D72\">non-convex — where it lands</text>\n<text x=\"390\" y=\"36\" font-size=\"12.5\" fill=\"#666D72\">depends on where it starts</text>\n<line x1=\"60\" y1=\"205\" x2=\"290\" y2=\"205\" stroke=\"#2E3438\"/>\n<polyline points=\"56.5,109.2 61.9,118.0 67.3,126.4 72.8,134.4 78.2,141.9 83.6,148.9 89.0,155.5 94.5,161.6 99.9,167.3 105.3,172.5 110.8,177.3 116.2,181.6 121.6,185.5 127.0,188.9 132.4,191.8 137.9,194.3 143.3,196.4 148.7,198.0 154.2,199.1 159.6,199.8 165.0,200.0 170.4,199.8 175.8,199.1 181.3,198.0 186.7,196.4 192.1,194.3 197.6,191.8 203.0,188.9 208.4,185.5 213.8,181.6 219.2,177.3 224.7,172.5 230.1,167.3 235.5,161.6 241.0,155.5 246.4,148.9 251.8,141.9 257.2,134.4 262.6,126.4 268.1,118.0 273.5,109.2\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.9\"/>\n<circle cx=\"165\" cy=\"200\" r=\"4\" fill=\"#FFFFFF\"/>\n<line x1=\"380\" y1=\"205\" x2=\"620\" y2=\"205\" stroke=\"#2E3438\"/>\n<polyline points=\"383.4,165.4 387.0,177.1 390.5,186.8 394.1,194.6 397.6,200.8 401.2,205.4 404.7,208.6 408.3,210.6 411.8,211.4 415.4,211.3 418.9,210.3 422.5,208.6 426.0,206.3 429.6,203.4 433.1,200.1 436.7,196.5 440.3,192.6 443.8,188.6 447.4,184.5 450.9,180.4 454.5,176.4 458.0,172.5 461.6,168.8 465.1,165.3 468.7,162.0 472.2,159.1 475.8,156.5 479.3,154.3 482.9,152.5 486.4,151.0 490.0,150.0 493.6,149.4 497.1,149.2 500.7,149.3 504.2,149.9 507.8,150.9 511.3,152.1 514.9,153.7 518.4,155.6 522.0,157.6 525.5,159.9 529.1,162.3 532.6,164.7 536.2,167.1 539.7,169.5 543.3,171.7 546.9,173.6 550.4,175.3 554.0,176.5 557.5,177.2 561.1,177.3 564.6,176.6 568.2,175.1 571.7,172.6 575.3,168.9 578.8,164.1 582.4,157.8 585.9,150.0 589.5,140.5 593.0,129.2 596.6,115.8\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.9\"/>\n<text x=\"60\" y=\"232\" font-size=\"12.5\" fill=\"#9AA1A6\">f''(x) ≥ 0 everywhere</text>\n<text x=\"390\" y=\"232\" font-size=\"12.5\" fill=\"#9AA1A6\">f'' changes sign; local minima trap the search</text>\n</svg>",
              "cap": "Convex against non-convex. On the left, every downhill path reaches the same point. On the right, the starting position decides which basin you end in — which is why initialisation and random seeds change results."
            },
            {
              "t": "p",
              "x": "In many variables, the second derivatives form a matrix called the Hessian, holding every ∂²f/∂xᵢ∂xⱼ. It describes curvature in every direction at once. Methods that use it converge in far fewer steps than gradient descent, but the Hessian for a model with a billion parameters would have a billion squared entries, which is why nobody forms it and why first-order methods dominate."
            },
            {
              "t": "h",
              "x": "Taylor approximation"
            },
            {
              "t": "p",
              "x": "Near a point, a smooth function is well approximated by f(x + h) ≈ f(x) + f′(x)h + ½f″(x)h². The first two terms are the tangent line; adding the third gives the best-fitting parabola. This is the justification for taking small steps in optimisation — the linear approximation is only trustworthy nearby, and a learning rate is, at bottom, a statement about how far you trust it."
            }
          ]
        },
        {
          "title": "Integration in one chapter",
          "blocks": [
            {
              "t": "p",
              "x": "The other half of calculus accumulates rather than differentiates. The integral of a function over an interval is the area under its curve, built up from infinitely many infinitesimally thin rectangles."
            },
            {
              "t": "p",
              "x": "The fundamental theorem of calculus connects the two halves: differentiation and integration are inverse operations. To find the area under f, find a function F whose derivative is f, and evaluate F at the endpoints. This is why a table of derivatives doubles as a table of integrals read backwards."
            },
            {
              "t": "p",
              "x": "For this map, integration matters mainly in probability. A continuous random variable has a probability density rather than a probability at each point, and the probability of landing in a range is the area under the density over that range. Total probability is 1 because the density integrates to 1 over everything. Expectation is an integral of value against density. When you meet those definitions in the probability booklet, they will be integrals wearing different clothing."
            },
            {
              "t": "note",
              "x": "You will rarely compute an integral by hand in machine learning work. Where they appear — the normalising constant of a distribution, an expectation over a posterior — they are usually intractable, and the practical response is to approximate by sampling. That is what Monte Carlo methods are: replacing an integral you cannot do with an average over samples you can draw."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Work them on paper. The chain rule items are the ones that pay off directly in the machine learning chapters later on."
            }
          ],
          "exercises": [
            {
              "q": "Differentiate f(x) = 5x³ − 2x² + 4x − 9.",
              "steps": [
                "Apply the sum rule, taking each term separately.",
                "5x³ gives 5·3x² = 15x².",
                "−2x² gives −2·2x = −4x, and 4x gives 4.",
                "The constant −9 gives 0."
              ],
              "answer": "15x² − 4x + 4. Every polynomial's derivative is a polynomial of degree one lower.",
              "kind": "mc",
              "options": [
                "15x² − 4x + 4",
                "15x² − 4x",
                "5x² − 2x + 4",
                "15x³ − 4x² + 4x"
              ],
              "correct": 0
            },
            {
              "q": "Differentiate y = (2x² + 1)⁵.",
              "steps": [
                "Outer function u⁵, inner function u = 2x² + 1.",
                "Outer derivative: 5u⁴.",
                "Inner derivative: 4x.",
                "Multiply and substitute."
              ],
              "answer": "20x(2x² + 1)⁴. Forgetting the inner 4x would leave the answer wrong by a factor that varies with x — which in training would corrupt the update direction, not just its size.",
              "kind": "mc",
              "options": [
                "20x(2x² + 1)⁴",
                "5(2x² + 1)⁴",
                "20x⁴(2x² + 1)",
                "4x(2x² + 1)⁴"
              ],
              "correct": 0
            },
            {
              "q": "For f(x, y) = 3x²y³, find both partial derivatives.",
              "steps": [
                "For ∂f/∂x, hold y fixed, so 3y³ is a constant multiplier on x².",
                "That gives 3y³ · 2x = 6xy³.",
                "For ∂f/∂y, hold x fixed, so 3x² multiplies y³.",
                "That gives 3x² · 3y² = 9x²y²."
              ],
              "answer": "∂f/∂x = 6xy³ and ∂f/∂y = 9x²y². The gradient is the pair, and it varies from point to point.",
              "kind": "mc",
              "options": [
                "6xy³ and 9x²y²",
                "6xy³ and 3x²y²",
                "3xy³ and 9x²y²",
                "6x²y³ and 9x²y³"
              ],
              "correct": 0
            },
            {
              "q": "The logistic sigmoid is σ(z) = 1/(1 + e⁻ᶻ). Show its derivative is σ(z)(1 − σ(z)), and find its maximum.",
              "steps": [
                "Write σ as (1 + e⁻ᶻ)⁻¹ and apply the chain rule: −1(1 + e⁻ᶻ)⁻² times the derivative of the inside.",
                "The inside differentiates to −e⁻ᶻ, so the two minus signs cancel: e⁻ᶻ/(1 + e⁻ᶻ)².",
                "Split the fraction as [1/(1 + e⁻ᶻ)] · [e⁻ᶻ/(1 + e⁻ᶻ)], and the second factor is 1 − σ(z).",
                "The product σ(1 − σ) is maximised when σ = 0.5, giving 0.25."
              ],
              "answer": "σ′ = σ(1 − σ), peaking at 0.25 when z = 0. That ceiling of 0.25 per layer is the arithmetic of the vanishing gradient problem.",
              "kind": "mc",
              "options": [
                "σ(1 − σ), peaking at 0.25",
                "σ(1 + σ), peaking at 0.5",
                "σ², peaking at 1",
                "1 − σ, peaking at 1"
              ],
              "correct": 0
            },
            {
              "q": "Minimising f(w) = (w − 3)² from w = 0 with learning rate 0.1, compute two gradient descent steps.",
              "steps": [
                "f′(w) = 2(w − 3). At w = 0 that is −6.",
                "Step: w ← 0 − 0.1(−6) = 0.6.",
                "At w = 0.6 the gradient is 2(0.6 − 3) = −4.8.",
                "Step: w ← 0.6 − 0.1(−4.8) = 1.08."
              ],
              "answer": "w goes 0 → 0.6 → 1.08, moving toward the minimum at 3. Steps shrink as the gradient does, which is why descent decelerates near a minimum rather than overshooting it.",
              "kind": "mc",
              "options": [
                "0.6 then 1.08",
                "0.6 then 1.2",
                "−0.6 then −1.08",
                "6 then 10.8"
              ],
              "correct": 0
            },
            {
              "q": "Is f(x) = x⁴ convex? Is f(x) = x³? Why does it matter?",
              "steps": [
                "Convexity requires f″(x) ≥ 0 for all x.",
                "For x⁴: f′ = 4x³ and f″ = 12x², which is non-negative everywhere.",
                "For x³: f′ = 3x² and f″ = 6x, which is negative for every x < 0.",
                "Convexity must hold everywhere, not merely somewhere."
              ],
              "answer": "x⁴ is convex, x³ is not. It matters because on a convex loss any minimum found is the global one, so training that converges is training that finished.",
              "kind": "mc",
              "options": [
                "x⁴ is convex, x³ is not",
                "Both are convex",
                "Neither is convex",
                "x³ is convex, x⁴ is not"
              ],
              "correct": 0
            },
            {
              "q": "A loss is L = (a − y)² with a = wx + b. Find ∂L/∂w and ∂L/∂b.",
              "steps": [
                "Two links for w: L depends on a, and a depends on w.",
                "∂L/∂a = 2(a − y), and ∂a/∂w = x, so ∂L/∂w = 2(a − y)x.",
                "For b, ∂a/∂b = 1.",
                "So ∂L/∂b = 2(a − y)."
              ],
              "answer": "∂L/∂w = 2(a − y)x and ∂L/∂b = 2(a − y). Note the weight gradient is scaled by the input: a feature that is always near zero produces near-zero updates, which is one concrete reason to normalise inputs.",
              "kind": "mc",
              "options": [
                "2(a − y)x and 2(a − y)",
                "2(a − y) and 2(a − y)x",
                "(a − y)x and (a − y)",
                "2(a − y)x and 2(a − y)b"
              ],
              "correct": 0
            },
            {
              "kind": "write",
              "q": "The vector of all partial derivatives, pointing in the direction of steepest increase, is the ___.",
              "accept": [
                "gradient"
              ],
              "hint": "one word",
              "steps": [
                "Each partial derivative measures sensitivity to one input.",
                "Collect them into a vector.",
                "It is perpendicular to the contours of the function."
              ],
              "answer": "The gradient. Descent steps against it, which is the steepest available way down."
            },
            {
              "kind": "write",
              "q": "The rule giving dy/dx = (dy/du)(du/dx) for composed functions is the ___ rule.",
              "accept": [
                "chain"
              ],
              "hint": "one word",
              "steps": [
                "A composition passes a value through one function then another.",
                "Sensitivities along the path multiply.",
                "Applied backwards through a network, this is backpropagation."
              ],
              "answer": "The chain rule. It is the single most important rule in this booklet for everything downstream."
            },
            {
              "kind": "write",
              "q": "A function whose second derivative is non-negative everywhere, so that any local minimum is global, is called ___.",
              "accept": [
                "convex"
              ],
              "hint": "one word",
              "steps": [
                "The straight line between any two points on the graph lies on or above it.",
                "The bowl shape is the picture.",
                "Least squares and logistic regression have this property; neural networks do not."
              ],
              "answer": "Convex. It is the guarantee that a descent method which stops has genuinely finished."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Chain rule",
          "dy/dx = (dy/du)(du/dx). Sensitivities multiply along a composition."
        ],
        [
          "Continuity",
          "No holes or jumps: the limit at a point equals the value there."
        ],
        [
          "Convex",
          "Curving upward everywhere, so every local minimum is the global minimum."
        ],
        [
          "Derivative",
          "The instantaneous rate of change of a function with respect to its input."
        ],
        [
          "Differentiable",
          "Having a derivative — continuous and with no sharp corner."
        ],
        [
          "dy/dx",
          "Leibniz notation. Verbose, but it makes the chain rule look like fractions cancelling, which is why it dominates in applied work."
        ],
        [
          "f′(x)",
          "Lagrange notation. Compact, and standard for single-variable work."
        ],
        [
          "Gradient",
          "The vector of all partial derivatives. It points in the direction of steepest increase."
        ],
        [
          "Hessian",
          "The matrix of all second partial derivatives, describing curvature in every direction."
        ],
        [
          "Integral",
          "Accumulated total — geometrically, area under a curve."
        ],
        [
          "Learning rate",
          "The step size in gradient descent; a statement about how far the local approximation is trusted."
        ],
        [
          "Limit",
          "What a function's output approaches as its input approaches a value, regardless of the value there."
        ],
        [
          "Partial derivative",
          "The rate of change with respect to one input, holding the others fixed."
        ],
        [
          "Saddle point",
          "A stationary point curving up in one direction and down in another — neither maximum nor minimum."
        ],
        [
          "Tangent line",
          "The line touching a curve at a point with the same slope; its slope is the derivative."
        ],
        [
          "Taylor approximation",
          "Approximating a function near a point by its tangent line plus a curvature term."
        ],
        [
          "Vanishing gradient",
          "Gradients shrinking toward zero through depth, since each layer multiplies by a factor below one."
        ],
        [
          "∂f/∂x",
          "Partial derivative — the ∂ signals that other variables exist and are being held fixed."
        ]
      ]
    },
  "linalg": {
      "title": "Linear algebra",
      "blurb": "Vectors, matrices and the transformations between them — the arithmetic every model in this map runs on.",
      "chapters": [
        {
          "title": "Why this subject runs machine learning",
          "blocks": [
            {
              "t": "p",
              "x": "Linear algebra has a reputation for being a subject of tedious hand computation, which is unfortunate, because the hand computation is the least interesting part and the part a computer does for you. What matters is the geometry: what a matrix <em>does</em>, why certain operations are possible and others are not, and what it means when a computation loses information."
            },
            {
              "t": "p",
              "x": "The reason it dominates machine learning is simple. A single data point with 784 features is a vector in 784-dimensional space. A batch of 32 of them is a 32×784 matrix. A neural network layer is a matrix multiplication followed by a nonlinearity, and training adjusts the numbers in those matrices. Strip away the terminology and a modern model is an enormous pile of matrix multiplications — which is precisely why GPUs, hardware built to multiply matrices, turned out to be the machine learning hardware."
            },
            {
              "t": "p",
              "x": "This booklet builds the geometric picture first and the mechanics second, because the mechanics without the picture is what makes the subject feel arbitrary."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Scalar",
                  "A single number."
                ],
                [
                  "Vector",
                  "An ordered list of numbers. Geometrically, an arrow from the origin, or equivalently a point in space."
                ],
                [
                  "Matrix",
                  "A rectangular grid of numbers. Best understood as a function that takes vectors to vectors."
                ],
                [
                  "Tensor",
                  "The generalisation to any number of dimensions. In machine learning frameworks the word is used loosely for any n-dimensional array."
                ]
              ]
            }
          ]
        },
        {
          "title": "Vectors",
          "blocks": [
            {
              "t": "p",
              "x": "A vector is an ordered list of numbers, and it admits two readings that you should be able to switch between at will. The list reading: (3, 1) is just two numbers. The geometric reading: (3, 1) is an arrow from the origin reaching three units right and one up. In machine learning a third reading joins them — a vector is one data point, with each component a feature."
            },
            {
              "t": "p",
              "x": "Two operations define vector space. Addition is componentwise, and geometrically means following one arrow then the other. Scalar multiplication scales every component, stretching the arrow without turning it — unless the scalar is negative, which reverses it."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"0\" y1=\"50\" x2=\"0\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"50\" x2=\"240\" y2=\"50\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"30\" y1=\"50\" x2=\"30\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"80\" x2=\"240\" y2=\"80\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"60\" y1=\"50\" x2=\"60\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"110\" x2=\"240\" y2=\"110\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"90\" y1=\"50\" x2=\"90\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"140\" x2=\"240\" y2=\"140\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"120\" y1=\"50\" x2=\"120\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"170\" x2=\"240\" y2=\"170\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"150\" y1=\"50\" x2=\"150\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"200\" x2=\"240\" y2=\"200\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"180\" y1=\"50\" x2=\"180\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"230\" x2=\"240\" y2=\"230\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"210\" y1=\"50\" x2=\"210\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"260\" x2=\"240\" y2=\"260\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"240\" y1=\"50\" x2=\"240\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"0\" y1=\"290\" x2=\"240\" y2=\"290\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/>\n<line x1=\"0\" y1=\"170\" x2=\"250\" y2=\"170\" stroke=\"#666D72\" stroke-width=\"1\"/>\n<line x1=\"120\" y1=\"40\" x2=\"120\" y2=\"250\" stroke=\"#666D72\" stroke-width=\"1\"/>\n<line x1=\"120\" y1=\"170\" x2=\"210\" y2=\"140\" stroke=\"#EDEFF0\" stroke-width=\"2\"/><path d=\"M210 140 L203.2 145.9 M210 140 L201.0 139.3\" stroke=\"#EDEFF0\" stroke-width=\"2\" fill=\"none\"/><text x=\"216\" y=\"144\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a</text>\n<line x1=\"120\" y1=\"170\" x2=\"150\" y2=\"80\" stroke=\"#EDEFF0\" stroke-width=\"2\"/><path d=\"M150 80 L150.7 89.0 M150 80 L144.1 86.8\" stroke=\"#EDEFF0\" stroke-width=\"2\" fill=\"none\"/><text x=\"156\" y=\"80\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">b</text>\n<line x1=\"210\" y1=\"140\" x2=\"240\" y2=\"50\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><path d=\"M240 50 L240.7 59.0 M240 50 L234.1 56.8\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" fill=\"none\"/>\n<line x1=\"150\" y1=\"80\" x2=\"240\" y2=\"50\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><path d=\"M240 50 L233.2 55.9 M240 50 L231.0 49.3\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" fill=\"none\"/>\n<line x1=\"120\" y1=\"170\" x2=\"240\" y2=\"50\" stroke=\"#FFFFFF\" stroke-width=\"2.4\"/><path d=\"M240 50 L236.6 58.3 M240 50 L231.7 53.4\" stroke=\"#FFFFFF\" stroke-width=\"2.4\" fill=\"none\"/><text x=\"248\" y=\"46\" font-size=\"13\" fill=\"#FFFFFF\" class=\"mono\">a + b</text>\n<text x=\"330\" y=\"70\" font-size=\"13.5\" fill=\"#9AA1A6\">a = (3, 1), b = (1, 3)</text>\n<text x=\"330\" y=\"96\" font-size=\"13.5\" fill=\"#9AA1A6\">a + b = (4, 4)</text>\n<text x=\"330\" y=\"132\" font-size=\"13\" fill=\"#666D72\">Addition is componentwise, and geometrically</text>\n<text x=\"330\" y=\"152\" font-size=\"13\" fill=\"#666D72\">it is walking one vector then the other. The</text>\n<text x=\"330\" y=\"172\" font-size=\"13\" fill=\"#666D72\">order does not matter, which is why the two</text>\n<text x=\"330\" y=\"192\" font-size=\"13\" fill=\"#666D72\">routes close into a parallelogram.</text>\n</svg>",
              "cap": "Vector addition. Both routes reach the same point, which is the geometric content of commutativity."
            },
            {
              "t": "h",
              "x": "The dot product"
            },
            {
              "t": "p",
              "x": "The dot product multiplies corresponding components and sums the results, turning two vectors into a single number. It is the most useful operation in the subject, because it measures alignment: a·b = |a||b|cos θ, where θ is the angle between the vectors."
            },
            {
              "t": "list",
              "items": [
                "Positive dot product: the vectors point broadly the same way.",
                "Zero: they are perpendicular, or orthogonal.",
                "Negative: they point broadly opposite ways."
              ]
            },
            {
              "t": "worked",
              "q": "Compute (3, 1)·(1, 3) and (2, 1)·(−1, 2), and interpret each.",
              "steps": [
                "First: 3(1) + 1(3) = 6. Positive, so the vectors are broadly aligned.",
                "Second: 2(−1) + 1(2) = −2 + 2 = 0.",
                "A zero dot product means the cosine of the angle is zero.",
                "So the vectors meet at exactly 90 degrees."
              ],
              "answer": "6 and 0. The second pair is orthogonal — a property you can now check with two multiplications and an addition, without computing any angles."
            },
            {
              "t": "p",
              "x": "This is the machinery behind cosine similarity, which is how a search engine decides two documents are about the same thing and how a vector database finds a relevant passage. Divide the dot product by both lengths and you have the cosine of the angle, a similarity score between −1 and 1 that ignores magnitude and attends only to direction."
            },
            {
              "t": "note",
              "x": "The reason magnitude is usually discarded is worth stating. A long document and a short one about the same topic have very different vector lengths but nearly the same direction. Cosine similarity says they match; raw dot product would favour the longer one merely for being longer."
            }
          ]
        },
        {
          "title": "Matrices as transformations",
          "blocks": [
            {
              "t": "p",
              "x": "Here is the single idea that makes the rest of the subject click. A matrix is not primarily a grid of numbers; it is a function that takes a vector and returns a vector. And its columns tell you exactly what it does: <strong>the columns of a matrix are where the basis vectors land</strong>."
            },
            {
              "t": "p",
              "x": "In two dimensions the basis vectors are î = (1, 0) and ĵ = (0, 1). Any vector (x, y) is x·î + y·ĵ. So if you know where î and ĵ go, you know where everything goes, because the transformation preserves that combination. The first column of the matrix is the destination of î, the second column is the destination of ĵ."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"24\" font-size=\"12\" fill=\"#666D72\">before</text>\n<text x=\"380\" y=\"24\" font-size=\"12\" fill=\"#666D72\">after applying [[2,1],[0,1]]</text>\n<line x1=\"56\" y1=\"66\" x2=\"56\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"66\" x2=\"224\" y2=\"66\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"84\" y1=\"66\" x2=\"84\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"94\" x2=\"224\" y2=\"94\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"112\" y1=\"66\" x2=\"112\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"122\" x2=\"224\" y2=\"122\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"140\" y1=\"66\" x2=\"140\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"150\" x2=\"224\" y2=\"150\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"168\" y1=\"66\" x2=\"168\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"178\" x2=\"224\" y2=\"178\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"196\" y1=\"66\" x2=\"196\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"206\" x2=\"224\" y2=\"206\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"224\" y1=\"66\" x2=\"224\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"56\" y1=\"234\" x2=\"224\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/>\n<line x1=\"56\" y1=\"150\" x2=\"224\" y2=\"150\" stroke=\"#666D72\"/>\n<line x1=\"140\" y1=\"66\" x2=\"140\" y2=\"234\" stroke=\"#666D72\"/>\n<line x1=\"140\" y1=\"150\" x2=\"168\" y2=\"150\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M168 150 L159.7 153.5 M168 150 L159.7 146.5\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/><text x=\"172\" y=\"166\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">î</text>\n<line x1=\"140\" y1=\"150\" x2=\"140\" y2=\"122\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M140 122 L143.5 130.3 M140 122 L136.5 130.3\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/><text x=\"124\" y=\"118\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">ĵ</text>\n<g opacity=\"0.5\"><line x1=\"376\" y1=\"66\" x2=\"376\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"66\" x2=\"544\" y2=\"66\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"404\" y1=\"66\" x2=\"404\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"94\" x2=\"544\" y2=\"94\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"432\" y1=\"66\" x2=\"432\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"122\" x2=\"544\" y2=\"122\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"460\" y1=\"66\" x2=\"460\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"150\" x2=\"544\" y2=\"150\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"488\" y1=\"66\" x2=\"488\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"178\" x2=\"544\" y2=\"178\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"516\" y1=\"66\" x2=\"516\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"206\" x2=\"544\" y2=\"206\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"544\" y1=\"66\" x2=\"544\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/><line x1=\"376\" y1=\"234\" x2=\"544\" y2=\"234\" stroke=\"#2E3438\" stroke-width=\"0.7\" opacity=\"1\"/></g>\n<line x1=\"376\" y1=\"150\" x2=\"600\" y2=\"150\" stroke=\"#666D72\"/>\n<line x1=\"460\" y1=\"66\" x2=\"460\" y2=\"234\" stroke=\"#666D72\"/>\n<line x1=\"460\" y1=\"150\" x2=\"516\" y2=\"150\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M516 150 L507.7 153.5 M516 150 L507.7 146.5\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/><text x=\"520\" y=\"168\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">î → (2,0)</text>\n<line x1=\"460\" y1=\"150\" x2=\"488\" y2=\"122\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M488 122 L484.6 130.3 M488 122 L479.7 125.4\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/><text x=\"494\" y=\"118\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">ĵ → (1,1)</text>\n<path d=\"M460 150 L516 150 L544 122 L488 122 Z\" fill=\"#EDEFF0\" opacity=\"0.13\"/>\n<path d=\"M140 150 L168 150 L168 122 L140 122 Z\" fill=\"#EDEFF0\" opacity=\"0.13\"/>\n<text x=\"60\" y=\"252\" font-size=\"13\" fill=\"#9AA1A6\">The columns of a matrix are the places the basis vectors land. Everything else follows.</text>\n</svg>",
              "cap": "The matrix [[2,1],[0,1]] sends î to (2,0) and ĵ to (1,1). The whole grid shears accordingly, and the shaded unit square becomes a parallelogram of the same area."
            },
            {
              "t": "worked",
              "q": "What do [[2,0],[0,1]], [[0,−1],[1,0]] and [[1,0],[0,1]] do?",
              "steps": [
                "First: î → (2,0), ĵ → (0,1). Horizontal stretch by 2, vertical unchanged.",
                "Second: î → (0,1), which is straight up; ĵ → (−1,0), which is straight left.",
                "Both rotated a quarter turn counterclockwise.",
                "Third: î → (1,0), ĵ → (0,1). Nothing moves."
              ],
              "answer": "A stretch, a 90° rotation, and the identity. Reading a matrix by its columns turns it from a grid of numbers into a picture of what it does."
            },
            {
              "t": "p",
              "x": "Applying a matrix to a vector is now interpretable rather than mechanical: scale the first column by x, scale the second by y, and add them. That is precisely the matrix-vector product, and writing it out gives the familiar row-times-column formula."
            }
          ]
        },
        {
          "title": "Matrix multiplication and shapes",
          "blocks": [
            {
              "t": "p",
              "x": "Multiplying two matrices means composing two transformations: AB is the transformation that applies B first, then A. The right-to-left order surprises people, and it comes from function notation — A(B(v)) applies B first."
            },
            {
              "t": "p",
              "x": "The mechanical rule follows from composition: the entry in row i, column j of the product is the dot product of A's row i with B's column j. Which immediately explains the shape rule that trips everyone up at first."
            },
            {
              "t": "p",
              "x": "An (m × n) matrix times an (n × p) matrix gives an (m × p) matrix. The inner dimensions must match, because you are dotting rows of length n against columns of length n, and they cancel. The outer dimensions survive."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 210\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"60\" y=\"50\" width=\"120\" height=\"60\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"120\" y=\"86\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">32 × 784</text>\n<text x=\"120\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">batch</text>\n<rect x=\"230\" y=\"50\" width=\"120\" height=\"60\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"290\" y=\"86\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">784 × 128</text>\n<text x=\"290\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">layer 1</text>\n<rect x=\"400\" y=\"50\" width=\"120\" height=\"60\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"460\" y=\"86\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">128 × 10</text>\n<text x=\"460\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">layer 2</text>\n<rect x=\"550\" y=\"50\" width=\"70\" height=\"60\" rx=\"7\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<text x=\"585\" y=\"86\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">32×10</text>\n<text x=\"205\" y=\"86\" text-anchor=\"middle\" font-size=\"17\" fill=\"#9AA1A6\">×</text>\n<text x=\"375\" y=\"86\" text-anchor=\"middle\" font-size=\"17\" fill=\"#9AA1A6\">×</text>\n<text x=\"535\" y=\"86\" text-anchor=\"middle\" font-size=\"17\" fill=\"#9AA1A6\">=</text>\n<path d=\"M156 118 C156 140 254 140 254 118\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<text x=\"205\" y=\"158\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">784 must match, and cancels</text>\n<path d=\"M326 118 C326 140 424 140 424 118\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<text x=\"375\" y=\"176\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">128 must match, and cancels</text>\n<text x=\"60\" y=\"200\" font-size=\"12.5\" fill=\"#666D72\">The outer dimensions survive; the inner ones must agree and disappear.</text>\n</svg>",
              "cap": "Shape bookkeeping through a two-layer network. Nearly every dimension error in machine learning code is a violation of the inner-match rule, and reading shapes this way finds it in seconds."
            },
            {
              "t": "p",
              "x": "Two properties are worth committing to memory. Matrix multiplication is associative — (AB)C equals A(BC) — which is why a chain of layers can be evaluated in any grouping. But it is <em>not</em> commutative: AB and BA are generally different, and may not even have compatible shapes. Geometrically that is obvious: rotating then stretching does not give the same result as stretching then rotating."
            },
            {
              "t": "note",
              "x": "In practice you will spend real time on shape errors. The habit that prevents them is annotating every tensor with its shape as you write the code, and reading a multiplication as \"(32×784)(784×128) → (32×128)\" rather than trusting that it will work out. The batch dimension rides along untouched; only the feature dimensions interact."
            }
          ]
        },
        {
          "title": "Span, independence and rank",
          "blocks": [
            {
              "t": "p",
              "x": "The span of a set of vectors is everything you can reach by scaling and adding them. Two vectors in the plane pointing in genuinely different directions span the whole plane: any point is some combination of them. But two vectors along the same line span only that line, no matter how many you add."
            },
            {
              "t": "p",
              "x": "That distinction is linear independence. A set is linearly dependent when one of its members can be written as a combination of the others — it contributes nothing new, and adds no dimension to the span."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 690 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"24\" font-size=\"12\" fill=\"#666D72\">independent — span the plane</text>\n<text x=\"380\" y=\"24\" font-size=\"12\" fill=\"#666D72\">dependent — span only a line</text>\n<line x1=\"60\" y1=\"140\" x2=\"250\" y2=\"140\" stroke=\"#2E3438\"/>\n<line x1=\"150\" y1=\"50\" x2=\"150\" y2=\"215\" stroke=\"#2E3438\"/>\n<rect x=\"60\" y=\"50\" width=\"190\" height=\"165\" fill=\"#EDEFF0\" opacity=\"0.07\"/>\n<line x1=\"150\" y1=\"140\" x2=\"210\" y2=\"110\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M210 110 L204.2 116.8 M210 110 L201.0 110.6\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/>\n<line x1=\"150\" y1=\"140\" x2=\"120\" y2=\"80\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M120 80 L126.8 85.8 M120 80 L120.6 89.0\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/>\n<line x1=\"380\" y1=\"140\" x2=\"600\" y2=\"140\" stroke=\"#2E3438\"/>\n<line x1=\"480\" y1=\"50\" x2=\"480\" y2=\"215\" stroke=\"#2E3438\"/>\n<line x1=\"390\" y1=\"185\" x2=\"590\" y2=\"85\" stroke=\"#EDEFF0\" stroke-width=\"7\" opacity=\"0.16\"/>\n<line x1=\"480\" y1=\"140\" x2=\"540\" y2=\"110\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/><path d=\"M540 110 L534.2 116.8 M540 110 L531.0 110.6\" stroke=\"#EDEFF0\" stroke-width=\"2.2\" fill=\"none\"/>\n<line x1=\"480\" y1=\"140\" x2=\"570\" y2=\"95\" stroke=\"#9AA1A6\" stroke-width=\"2.2\"/><path d=\"M570 95 L564.2 101.8 M570 95 L561.0 95.6\" stroke=\"#9AA1A6\" stroke-width=\"2.2\" fill=\"none\"/>\n<text x=\"60\" y=\"215\" font-size=\"12.5\" fill=\"#9AA1A6\">(2,1) and (−1,2)</text>\n<text x=\"380\" y=\"215\" font-size=\"12.5\" fill=\"#9AA1A6\">(2,1) and (3,1.5) — the second is 1.5× the first</text>\n</svg>",
              "cap": "Independent vectors open up a plane. Dependent ones collapse onto a line, and no combination of them ever leaves it."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Span",
                  "The set of all linear combinations of some vectors."
                ],
                [
                  "Linearly independent",
                  "No vector in the set is a combination of the others."
                ],
                [
                  "Basis",
                  "A linearly independent set that spans the whole space. Every vector then has exactly one representation in it."
                ],
                [
                  "Rank",
                  "The dimension of the span of a matrix's columns — how many genuinely independent directions survive the transformation."
                ],
                [
                  "Full rank",
                  "Rank equal to the smaller of the matrix's dimensions. A square full-rank matrix is invertible."
                ]
              ]
            },
            {
              "t": "p",
              "x": "Rank is where this becomes practical. A transformation that squashes a plane onto a line has rank 1, and it destroys information: many input vectors map to the same output, so it cannot be undone. That is precisely what makes a matrix non-invertible, and the determinant — which measures how the transformation scales area — is zero exactly when this collapse happens."
            },
            {
              "t": "worked",
              "q": "Find the rank of [[1,2],[2,4]] and say whether it is invertible.",
              "steps": [
                "Compare the rows: the second is exactly twice the first.",
                "So they are linearly dependent, and their span is a single line.",
                "The dimension of that span is 1, so the rank is 1.",
                "Determinant: 1(4) − 2(2) = 0, confirming the collapse."
              ],
              "answer": "Rank 1, determinant 0, not invertible. Every point in the plane maps onto one line, so the output cannot tell you which input produced it."
            },
            {
              "t": "p",
              "x": "Dimensionality reduction is this idea used deliberately. Real data usually occupies a lower-dimensional structure inside its nominal space — 784 pixel values, but handwritten digits do not fill 784 dimensions. Finding the few directions that carry most of the variation, and discarding the rest, is what PCA does."
            }
          ]
        },
        {
          "title": "Eigenvectors, eigenvalues and SVD",
          "blocks": [
            {
              "t": "p",
              "x": "Most vectors get knocked off their own line when a matrix is applied to them. A few do not — they come out pointing exactly the same way (or exactly reversed), merely scaled. Those are the eigenvectors, and the scale factor is the eigenvalue."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"130\" x2=\"300\" y2=\"130\" stroke=\"#2E3438\"/>\n<line x1=\"150\" y1=\"40\" x2=\"150\" y2=\"215\" stroke=\"#2E3438\"/>\n<line x1=\"150\" y1=\"130\" x2=\"210\" y2=\"70\" stroke=\"#9AA1A6\" stroke-width=\"1.6\"/><path d=\"M210 70 L206.6 78.3 M210 70 L201.7 73.4\" stroke=\"#9AA1A6\" stroke-width=\"1.6\" fill=\"none\"/>\n<line x1=\"150\" y1=\"130\" x2=\"255\" y2=\"25\" stroke=\"#EDEFF0\" stroke-width=\"2.4\"/><path d=\"M255 25 L251.6 33.3 M255 25 L246.7 28.4\" stroke=\"#EDEFF0\" stroke-width=\"2.4\" fill=\"none\"/>\n<text x=\"216\" y=\"62\" font-size=\"12\" fill=\"#9AA1A6\">v</text>\n<text x=\"262\" y=\"22\" font-size=\"12\" fill=\"#EDEFF0\">Av = 2v</text>\n<line x1=\"150\" y1=\"130\" x2=\"220\" y2=\"146\" stroke=\"#9AA1A6\" stroke-width=\"1.6\"/><path d=\"M220 146 L211.1 147.6 M220 146 L212.7 140.7\" stroke=\"#9AA1A6\" stroke-width=\"1.6\" fill=\"none\"/>\n<line x1=\"150\" y1=\"130\" x2=\"196\" y2=\"175\" stroke=\"#FFFFFF\" stroke-width=\"2.4\"/><path d=\"M196 175 L187.6 171.7 M196 175 L192.5 166.7\" stroke=\"#FFFFFF\" stroke-width=\"2.4\" fill=\"none\"/>\n<text x=\"226\" y=\"150\" font-size=\"12\" fill=\"#9AA1A6\">u</text>\n<text x=\"200\" y=\"196\" font-size=\"12\" fill=\"#EDEFF0\">Au</text>\n<text x=\"360\" y=\"62\" font-size=\"13.5\" fill=\"#9AA1A6\">v keeps its direction and only changes</text>\n<text x=\"360\" y=\"84\" font-size=\"13.5\" fill=\"#9AA1A6\">length: it is an eigenvector, with</text>\n<text x=\"360\" y=\"106\" font-size=\"13.5\" fill=\"#9AA1A6\">eigenvalue 2.</text>\n<text x=\"360\" y=\"146\" font-size=\"13.5\" fill=\"#9AA1A6\">u is rotated off its own line, so it is not</text>\n<text x=\"360\" y=\"168\" font-size=\"13.5\" fill=\"#9AA1A6\">an eigenvector of this transformation.</text>\n</svg>",
              "cap": "An eigenvector keeps its direction under the transformation; everything else rotates. Finding these special directions reveals the structure of the transformation."
            },
            {
              "t": "p",
              "x": "Formally, Av = λv: applying A to v does the same thing as multiplying v by the number λ. Eigenvectors matter because they expose what a transformation is really doing, stripped of the coordinate system you happened to write it in. A rotation has no real eigenvectors, because it turns everything. A pure scaling has every vector as an eigenvector."
            },
            {
              "t": "p",
              "x": "They also make repeated application tractable. Applying A a thousand times to an eigenvector is just multiplying by λ a thousand times — so the eigenvalue's magnitude determines whether repeated application explodes, decays, or holds steady. That is the mathematics behind PageRank's convergence, behind the stability of a dynamical system, and behind why gradients vanish or explode through a deep network."
            },
            {
              "t": "h",
              "x": "Singular value decomposition"
            },
            {
              "t": "p",
              "x": "SVD generalises this to any matrix, including non-square ones. It factors A into three pieces: a rotation, a scaling along perpendicular axes, and another rotation. Every linear transformation, however complicated it looks, is exactly that — rotate, stretch along axes, rotate again."
            },
            {
              "t": "p",
              "x": "The scale factors are the singular values, and they come out sorted. Keeping only the largest few and discarding the rest gives the best possible low-rank approximation of the matrix, which is a remarkably useful thing to be able to do. It is image compression, it is latent semantic analysis, it is the core of PCA, and it is the r in LoRA — a low-rank update to a large weight matrix, which works because the update genuinely lives in a low-dimensional subspace."
            },
            {
              "t": "note",
              "x": "You will rarely compute an eigenvector or an SVD by hand outside a course. What you need is the mental model: eigenvectors are the directions a transformation leaves alone, singular values measure how much each independent direction is stretched, and small singular values mark directions carrying little information — the ones safe to throw away."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Do these on paper. The last three matter more than the first three, because shape reasoning and rank reasoning are what you will actually use."
            }
          ],
          "exercises": [
            {
              "q": "Compute (1,2,3)·(4,5,6), and find a non-zero vector orthogonal to (3,4).",
              "steps": [
                "Dot product: 1(4) + 2(5) + 3(6) = 4 + 10 + 18 = 32.",
                "For orthogonality to (3,4) we need 3x + 4y = 0.",
                "Take x = 4, y = −3: 3(4) + 4(−3) = 12 − 12 = 0.",
                "Any scalar multiple of (4,−3) works too."
              ],
              "answer": "32, and (4,−3). In two dimensions, swapping the components and negating one always produces a perpendicular vector.",
              "kind": "mc",
              "options": [
                "32, and (4, −3)",
                "32, and (3, 4)",
                "10, and (4, −3)",
                "32, and (−4, 3) only"
              ],
              "correct": 0
            },
            {
              "q": "Describe what [[0,1],[1,0]] does, using the column rule.",
              "steps": [
                "The first column is (0,1), so î = (1,0) lands on (0,1).",
                "The second column is (1,0), so ĵ = (0,1) lands on (1,0).",
                "The two basis vectors have swapped places.",
                "A point (x,y) therefore maps to (y,x)."
              ],
              "answer": "It reflects across the diagonal line y = x. Applying it twice returns everything to where it started, so it is its own inverse.",
              "kind": "mc",
              "options": [
                "It reflects across the line y = x",
                "It rotates 90° clockwise",
                "It stretches x by a factor of 2",
                "It projects everything onto the x-axis"
              ],
              "correct": 0
            },
            {
              "q": "Can you multiply a (3×4) by a (3×4)? What about (3×4) by (4×2)?",
              "steps": [
                "The rule requires the first matrix's column count to equal the second's row count.",
                "(3×4)(3×4): inner dimensions are 4 and 3, which differ, so it is undefined.",
                "(3×4)(4×2): inner dimensions are both 4, so it is defined.",
                "The outer dimensions 3 and 2 survive."
              ],
              "answer": "The first is undefined; the second gives a (3×2). Transposing the first matrix to (4×3) would make the first product legal — which is why transposes appear constantly in backpropagation code.",
              "kind": "mc",
              "options": [
                "The first is undefined; the second gives (3×2)",
                "The first gives (3×4); the second (3×2)",
                "Both are undefined",
                "The first gives (3×4); the second is undefined"
              ],
              "correct": 0
            },
            {
              "q": "A batch of 64 images with 3×32×32 pixels is flattened and passed through layers of width 512 and 10. Give every shape.",
              "steps": [
                "Flattening 3×32×32 gives 3 × 1024 = 3072 features per image.",
                "The batch is therefore (64 × 3072).",
                "First weight matrix is (3072 × 512), so the product is (64 × 512).",
                "Second is (512 × 10), giving (64 × 10)."
              ],
              "answer": "(64×3072) → (64×512) → (64×10). The batch dimension never participates in the multiplication; it just carries through, which is what makes batching free.",
              "kind": "mc",
              "options": [
                "(64×3072) → (64×512) → (64×10)",
                "(3072×64) → (512×64) → (10×64)",
                "(64×1024) → (64×512) → (64×10)",
                "(64×3072) → (64×10)"
              ],
              "correct": 0
            },
            {
              "q": "What is the rank of [[1,0,2],[0,1,3],[1,1,5]]?",
              "steps": [
                "Check whether the rows are independent.",
                "Add row 1 and row 2: (1,0,2) + (0,1,3) = (1,1,5).",
                "That is exactly row 3, so row 3 contributes nothing new.",
                "Rows 1 and 2 are not multiples of each other, so they are independent."
              ],
              "answer": "Rank 2, not 3. The matrix is singular: it squashes three-dimensional space onto a plane, and no inverse can recover which point of the plane came from where.",
              "kind": "mc",
              "options": [
                "2",
                "3",
                "1",
                "0"
              ],
              "correct": 0
            },
            {
              "q": "A weight matrix is 4096×4096. A LoRA adapter uses rank 8. How many parameters does each hold?",
              "steps": [
                "The full matrix has 4096 × 4096 = 16,777,216 parameters.",
                "LoRA factors the update into two matrices: (4096×8) and (8×4096).",
                "That is 32,768 + 32,768 = 65,536 parameters.",
                "As a fraction: 65,536 / 16,777,216."
              ],
              "answer": "About 16.8 million versus 65,536 — roughly 0.4%. The bet is that the useful update lies in a low-rank subspace, which is a claim about rank, made practical.",
              "kind": "mc",
              "options": [
                "About 16.8 million against 65,536",
                "About 16.8 million against 8,192",
                "About 4.1 million against 65,536",
                "About 16.8 million against 1,048,576"
              ],
              "correct": 0
            },
            {
              "q": "Why does a matrix with determinant 0 have no inverse?",
              "steps": [
                "The determinant measures how the transformation scales area or volume.",
                "A determinant of 0 means area is scaled to nothing — the space is flattened onto a lower dimension.",
                "Many distinct input vectors then map to the same output.",
                "An inverse would need to recover a unique input from that output, which is impossible."
              ],
              "answer": "Information is destroyed, so the map is not reversible. This is the same argument as a non-injective function having no inverse, seen geometrically.",
              "kind": "mc",
              "options": [
                "It flattens space onto a lower dimension, so the input cannot be recovered",
                "It scales every vector to zero",
                "All of its entries must be zero",
                "Its eigenvalues are all equal to 1"
              ],
              "correct": 0
            },
            {
              "kind": "write",
              "q": "The number of independent directions surviving a transformation — the dimension of its column span — is its ___.",
              "accept": [
                "rank"
              ],
              "hint": "one word",
              "steps": [
                "Dependent columns add no new direction to the span.",
                "Count only the independent ones.",
                "A square matrix is invertible exactly when this equals its size."
              ],
              "answer": "The rank. Rank below full size means the transformation destroys information and cannot be undone."
            },
            {
              "kind": "write",
              "q": "A vector whose direction is unchanged by a transformation, being only scaled, is called an ___ of it.",
              "accept": [
                "eigenvector"
              ],
              "hint": "one word",
              "steps": [
                "Most vectors are knocked off their own line by a matrix.",
                "A few come out pointing the same way, merely longer or shorter.",
                "The scale factor is the eigenvalue."
              ],
              "answer": "An eigenvector. Repeated application just multiplies by the eigenvalue, which is why its magnitude governs whether a process explodes or decays."
            },
            {
              "kind": "write",
              "q": "The set of every vector reachable by scaling and adding a group of vectors is called their ___.",
              "accept": [
                "span"
              ],
              "hint": "one word",
              "steps": [
                "Two independent vectors in the plane reach every point of it.",
                "Two vectors on the same line reach only that line.",
                "The dimension of this set is the rank."
              ],
              "answer": "The span. Whether it fills the space is exactly the question of linear independence."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Basis",
          "A linearly independent set that spans the whole space. Every vector then has exactly one representation in it."
        ],
        [
          "Cosine similarity",
          "The dot product divided by both lengths — similarity by direction, ignoring magnitude."
        ],
        [
          "Determinant",
          "How much a transformation scales area or volume. Zero means it collapses a dimension."
        ],
        [
          "Dot product",
          "Multiply corresponding components and sum. Measures alignment: zero means perpendicular."
        ],
        [
          "Eigenvalue",
          "The factor by which a transformation scales its eigenvector."
        ],
        [
          "Full rank",
          "Rank equal to the smaller of the matrix's dimensions. A square full-rank matrix is invertible."
        ],
        [
          "Identity matrix",
          "The matrix that leaves every vector unchanged; ones on the diagonal."
        ],
        [
          "Linearly independent",
          "No vector in the set is a combination of the others."
        ],
        [
          "Low-rank approximation",
          "Keeping only the largest singular values — the best possible approximation at that rank."
        ],
        [
          "Matrix",
          "A rectangular grid of numbers. Best understood as a function that takes vectors to vectors."
        ],
        [
          "Orthogonal",
          "Perpendicular; a dot product of zero."
        ],
        [
          "Rank",
          "The dimension of the span of a matrix's columns — how many genuinely independent directions survive the transformation."
        ],
        [
          "Scalar",
          "A single number."
        ],
        [
          "Singular",
          "Having determinant zero, and therefore no inverse."
        ],
        [
          "Singular value",
          "One of the scale factors in an SVD. Small ones mark directions carrying little information."
        ],
        [
          "Span",
          "The set of all linear combinations of some vectors."
        ],
        [
          "SVD",
          "Factoring any matrix into rotation, scaling along axes, and rotation. The basis of PCA and LoRA."
        ],
        [
          "Tensor",
          "The generalisation to any number of dimensions. In machine learning frameworks the word is used loosely for any n-dimensional array."
        ],
        [
          "Transpose",
          "Flipping a matrix across its diagonal, turning rows into columns."
        ],
        [
          "Vector",
          "An ordered list of numbers. Geometrically, an arrow from the origin, or equivalently a point in space."
        ]
      ]
    },
  "discrete": {
      "title": "Discrete mathematics",
      "blurb": "Logic, sets, counting and proof — the language the rest of computer science is written in.",
      "chapters": [
        {
          "title": "What makes it discrete",
          "blocks": [
            {
              "t": "p",
              "x": "Mathematics splits roughly in two. Continuous mathematics studies things that flow — curves, rates of change, quantities that can take any value between two others. Discrete mathematics studies things that come in separable pieces: whole numbers, finite sets, graphs, logical statements that are true or false with nothing in between."
            },
            {
              "t": "p",
              "x": "Computing is discrete almost everywhere. A program has a finite number of states. A data structure holds a countable number of elements. A loop runs an integer number of times. A proposition about your code — this array is sorted, this pointer is null — is true or false. So the tools that work on separable pieces are the tools that apply, and calculus, which is superb at describing a falling object, has almost nothing to say about whether your algorithm terminates."
            },
            {
              "t": "p",
              "x": "This booklet covers four areas that recur constantly: logic, which lets you state precisely what a program guarantees; sets and relations, which are how data is modelled; proof, which is how you establish something holds for every input rather than the ones you tried; and counting, which is how you know an algorithm's cost before you run it."
            },
            {
              "t": "note",
              "x": "A word on proof. Programmers sometimes treat proof as an academic ritual, but it is the same activity as convincing yourself a loop is correct — done carefully enough to survive scrutiny. Every time you reason \"this index can never exceed the length, because it only increments when it is below it,\" you are doing induction informally. Learning the formal version makes the informal version reliable."
            }
          ]
        },
        {
          "title": "Propositional logic",
          "blocks": [
            {
              "t": "p",
              "x": "A proposition is a statement that is either true or false. \"The list is empty\" is a proposition. \"Sort the list\" is not, because it makes no claim. Propositional logic studies how propositions combine, and it has exactly five connectives worth knowing."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Negation (¬p)",
                  "Not p. True exactly when p is false."
                ],
                [
                  "Conjunction (p ∧ q)",
                  "p and q. True only when both are true."
                ],
                [
                  "Disjunction (p ∨ q)",
                  "p or q. True when at least one is true — this is inclusive or, unlike everyday English."
                ],
                [
                  "Implication (p → q)",
                  "If p then q. False only when p is true and q is false."
                ],
                [
                  "Biconditional (p ↔ q)",
                  "p if and only if q. True when both have the same truth value."
                ]
              ]
            },
            {
              "t": "p",
              "x": "Implication is the one that causes trouble, so it is worth dwelling on. Read p → q as a promise: if p happens, I guarantee q. The promise is broken only in one situation — p happened and q did not. If p never happened, the promise was never put to the test, so it counts as kept."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"90\" y=\"44\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">p</text>\n<text x=\"170\" y=\"44\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">q</text>\n<text x=\"251\" y=\"44\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">p → q</text>\n<line x1=\"60\" y1=\"54\" x2=\"290\" y2=\"54\" stroke=\"#2E3438\"/>\n<text x=\"90\" y=\"76\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">T</text><text x=\"170\" y=\"76\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">T</text><rect x=\"228\" y=\"59\" width=\"46\" height=\"26\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"251\" y=\"76\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">T</text><text x=\"90\" y=\"108\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">T</text><text x=\"170\" y=\"108\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">F</text><rect x=\"228\" y=\"91\" width=\"46\" height=\"26\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"251\" y=\"108\" text-anchor=\"middle\" font-size=\"14\" fill=\"#666D72\" class=\"mono\">F</text><text x=\"90\" y=\"140\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">F</text><text x=\"170\" y=\"140\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">T</text><rect x=\"228\" y=\"123\" width=\"46\" height=\"26\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"251\" y=\"140\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">T</text><text x=\"90\" y=\"172\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">F</text><text x=\"170\" y=\"172\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\" class=\"mono\">F</text><rect x=\"228\" y=\"155\" width=\"46\" height=\"26\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"251\" y=\"172\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">T</text>\n<text x=\"330\" y=\"76\" font-size=\"13.5\" fill=\"#9AA1A6\">Only one row makes the promise false:</text>\n<text x=\"330\" y=\"98\" font-size=\"13.5\" fill=\"#9AA1A6\">p held and q did not follow.</text>\n<text x=\"330\" y=\"132\" font-size=\"13.5\" fill=\"#9AA1A6\">When p is false the promise was never</text>\n<text x=\"330\" y=\"154\" font-size=\"13.5\" fill=\"#9AA1A6\">tested, so it counts as kept. This is</text>\n<text x=\"330\" y=\"176\" font-size=\"13.5\" fill=\"#9AA1A6\">vacuous truth, and it surprises everyone.</text>\n</svg>",
              "cap": "The truth table for implication. The two rows where p is false are vacuously true, which is why \"every element of the empty list is negative\" is a true statement."
            },
            {
              "t": "p",
              "x": "Vacuous truth is not a technicality. It is why a loop over an empty collection preserves any invariant you like, and why a universally quantified claim about an empty set always holds. Code that special-cases the empty collection is often code written by someone who did not trust this."
            },
            {
              "t": "h",
              "x": "Equivalences worth memorising"
            },
            {
              "t": "p",
              "x": "Two formulas are logically equivalent when they have identical truth tables. A handful of equivalences turn up so often in code that recognising them is a practical skill, not just an exam topic."
            },
            {
              "t": "list",
              "items": [
                "De Morgan: ¬(p ∧ q) is equivalent to ¬p ∨ ¬q, and ¬(p ∨ q) is equivalent to ¬p ∧ ¬q.",
                "Contrapositive: p → q is equivalent to ¬q → ¬p. This is the basis of an entire proof technique.",
                "Implication as disjunction: p → q is equivalent to ¬p ∨ q.",
                "The converse q → p is <em>not</em> equivalent to p → q. Confusing the two is the most common reasoning error there is."
              ]
            },
            {
              "t": "worked",
              "q": "Simplify the condition: !(user.isAdmin && user.isActive)",
              "steps": [
                "The negation applies to a conjunction, so De Morgan applies.",
                "¬(p ∧ q) becomes ¬p ∨ ¬q.",
                "So the condition is !user.isAdmin || !user.isActive.",
                "Read it aloud: the user is not an admin, or is not active."
              ],
              "answer": "!user.isAdmin || !user.isActive. Note the operator flips from && to ||; keeping && is the single most common De Morgan mistake, and it produces a condition that is almost never true."
            },
            {
              "t": "note",
              "x": "The contrapositive deserves emphasis because it is genuinely useful and genuinely counterintuitive. \"If it is raining then the ground is wet\" is equivalent to \"if the ground is not wet then it is not raining\". It is <em>not</em> equivalent to \"if the ground is wet then it is raining\" — that is the converse, and the ground could be wet from a sprinkler."
            }
          ]
        },
        {
          "title": "Predicates and quantifiers",
          "blocks": [
            {
              "t": "p",
              "x": "Propositional logic cannot express \"every element of this list is positive\", because that is not one statement but a family of them, one per element. Predicate logic adds variables and two quantifiers to handle exactly this."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Predicate",
                  "A statement with a free variable, like P(x): \"x is positive\". It has no truth value until x is supplied."
                ],
                [
                  "Universal (∀x P(x))",
                  "For all x, P(x) holds. False as soon as one counterexample exists."
                ],
                [
                  "Existential (∃x P(x))",
                  "There exists an x with P(x). True as soon as one witness exists."
                ],
                [
                  "Domain",
                  "The set x ranges over. A quantified statement is meaningless without it — ∀x (x > 0) is false over the integers and true over the positive integers."
                ]
              ]
            },
            {
              "t": "p",
              "x": "Negating a quantifier flips it and pushes the negation inward, which is the quantifier version of De Morgan. The negation of \"every element is positive\" is not \"every element is non-positive\" — it is \"some element is non-positive\". One counterexample is enough."
            },
            {
              "t": "code",
              "x": "¬∀x P(x)  ≡  ∃x ¬P(x)\n¬∃x P(x)  ≡  ∀x ¬P(x)"
            },
            {
              "t": "p",
              "x": "Quantifier order matters enormously, and swapping it changes the claim. ∀x ∃y (y > x) says every number has something bigger, which is true of the integers. ∃y ∀x (y > x) says one number is bigger than everything, which is false. The words are nearly identical; the meanings are not related."
            },
            {
              "t": "worked",
              "q": "Express \"the array has no duplicates\" formally, then negate it.",
              "steps": [
                "Let the domain be valid index pairs (i, j) into the array.",
                "The claim is: ∀i ∀j ((i ≠ j) → (a[i] ≠ a[j])).",
                "Negating flips both quantifiers to existential and negates the body.",
                "¬(p → q) is p ∧ ¬q, giving ∃i ∃j ((i ≠ j) ∧ (a[i] = a[j]))."
              ],
              "answer": "The negation is exactly what a duplicate-finding function returns: a pair of distinct indices holding equal values. Formalising a property tends to hand you the test for it."
            }
          ]
        },
        {
          "title": "Sets, relations and functions",
          "blocks": [
            {
              "t": "p",
              "x": "A set is an unordered collection of distinct elements. That definition carries two consequences that matter in code: {1, 2, 2, 3} equals {1, 2, 3}, because duplicates collapse, and {1, 2} equals {2, 1}, because order is not part of the identity. This is precisely why a hash set is the right structure for membership testing and the wrong one for anything positional."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Union (A ∪ B)",
                  "Everything in either set."
                ],
                [
                  "Intersection (A ∩ B)",
                  "Everything in both."
                ],
                [
                  "Difference (A \\ B)",
                  "In A but not in B. Not symmetric."
                ],
                [
                  "Subset (A ⊆ B)",
                  "Every element of A is in B. Note ∅ ⊆ A for every A, and A ⊆ A."
                ],
                [
                  "Cardinality (|A|)",
                  "The number of elements. Finite sets are the ones you can count; infinite ones come in different sizes, which is Cantor's territory."
                ],
                [
                  "Power set (2^A)",
                  "The set of all subsets of A. It has 2^|A| elements, which is where the notation comes from."
                ]
              ]
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs><clipPath id=\"ca\"><circle cx=\"150\" cy=\"110\" r=\"66\"/></clipPath></defs>\n<circle cx=\"150\" cy=\"110\" r=\"66\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/>\n<circle cx=\"220\" cy=\"110\" r=\"66\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/>\n<circle cx=\"220\" cy=\"110\" r=\"66\" fill=\"#EDEFF0\" opacity=\"0.16\" clip-path=\"url(#ca)\"/>\n<text x=\"110\" y=\"115\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\">A only</text>\n<text x=\"185\" y=\"115\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">A∩B</text>\n<text x=\"262\" y=\"115\" text-anchor=\"middle\" font-size=\"14\" fill=\"#9AA1A6\">B only</text>\n<text x=\"96\" y=\"40\" font-size=\"15\" fill=\"#EDEFF0\">A</text>\n<text x=\"272\" y=\"40\" font-size=\"15\" fill=\"#EDEFF0\">B</text>\n<text x=\"360\" y=\"70\" font-size=\"13.5\" fill=\"#9AA1A6\">|A ∪ B| = |A| + |B| − |A ∩ B|</text>\n<text x=\"360\" y=\"100\" font-size=\"13\" fill=\"#666D72\">Adding the two sizes counts the overlap</text>\n<text x=\"360\" y=\"120\" font-size=\"13\" fill=\"#666D72\">twice, so it must be subtracted once.</text>\n<text x=\"360\" y=\"154\" font-size=\"13\" fill=\"#666D72\">This is inclusion-exclusion, and it is the</text>\n<text x=\"360\" y=\"174\" font-size=\"13\" fill=\"#666D72\">first case of a pattern that continues for</text>\n<text x=\"360\" y=\"194\" font-size=\"13\" fill=\"#666D72\">three sets, four sets, and beyond.</text>\n</svg>",
              "cap": "Inclusion-exclusion. This is the counting rule behind deduplicating two overlapping result sets, and behind the union of two database queries."
            },
            {
              "t": "h",
              "x": "Relations"
            },
            {
              "t": "p",
              "x": "A relation on a set is any collection of ordered pairs from it — a way of saying which elements are connected to which. \"Is less than\" is a relation on the integers; \"follows\" is a relation on users; the edges of a graph are literally a relation on its nodes. Three properties classify most relations you meet."
            },
            {
              "t": "list",
              "items": [
                "<strong>Reflexive</strong>: every element relates to itself. \"Is equal to\" is; \"is less than\" is not.",
                "<strong>Symmetric</strong>: if a relates to b then b relates to a. \"Is a sibling of\" is; \"is a parent of\" is not.",
                "<strong>Transitive</strong>: if a relates to b and b to c, then a to c. \"Is less than\" is; \"is a friend of\" is not."
              ]
            },
            {
              "t": "p",
              "x": "A relation with all three properties is an equivalence relation, and it always carves the set into disjoint groups called equivalence classes. This is a deeper idea than it looks: every time you group records by a key, deduplicate by a fingerprint, or say two objects are \"the same for our purposes\", you have chosen an equivalence relation and partitioned by it."
            },
            {
              "t": "note",
              "x": "This is also why a broken equals() method corrupts a hash map. The contract requires equality to be reflexive, symmetric and transitive; violate transitivity and an object can be findable from one key and not another. The library is relying on a mathematical property your code promised to provide."
            },
            {
              "t": "h",
              "x": "Functions"
            },
            {
              "t": "p",
              "x": "A function assigns exactly one output to each input. \"Exactly one\" is the whole content of the definition, and it is why a function can be memoised: the same input must give the same output. Three properties classify functions, and they map directly onto data modelling."
            },
            {
              "t": "list",
              "items": [
                "<strong>Injective</strong> (one-to-one): distinct inputs give distinct outputs. A hash function is not injective, which is exactly why collisions exist.",
                "<strong>Surjective</strong> (onto): every possible output is actually produced.",
                "<strong>Bijective</strong>: both. A bijection has an inverse, which is why lossless encodings must be bijective and lossy ones are not."
              ]
            }
          ]
        },
        {
          "title": "Proof techniques",
          "blocks": [
            {
              "t": "p",
              "x": "A proof establishes that something holds for every case, including the ones you cannot test. Four techniques cover nearly everything you will need."
            },
            {
              "t": "h",
              "x": "Direct proof"
            },
            {
              "t": "p",
              "x": "Assume the hypothesis and derive the conclusion by valid steps. To prove that the sum of two even numbers is even: let a = 2m and b = 2n for integers m and n; then a + b = 2(m + n), which is two times an integer, and therefore even. Most proofs are this, done carefully."
            },
            {
              "t": "h",
              "x": "Contrapositive"
            },
            {
              "t": "p",
              "x": "To prove p → q, prove ¬q → ¬p instead. They are logically equivalent, and one direction is often far easier. To show that if n² is even then n is even, the direct route is awkward; the contrapositive — if n is odd then n² is odd — is immediate, since (2k+1)² = 4k² + 4k + 1, which is odd."
            },
            {
              "t": "h",
              "x": "Contradiction"
            },
            {
              "t": "p",
              "x": "Assume the statement is false and derive an impossibility. The classic is the irrationality of √2: assume √2 = a/b in lowest terms, square to get a² = 2b², conclude a is even, write a = 2c, substitute to get 2c² = b², conclude b is even too — contradicting \"lowest terms\". The assumption must have been false."
            },
            {
              "t": "h",
              "x": "Induction"
            },
            {
              "t": "p",
              "x": "Induction proves a statement for all natural numbers using two pieces: a base case showing it holds at the start, and an inductive step showing that if it holds at k, it holds at k+1. Together they cover every n, however large."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"70\" y=\"67\" width=\"14\" height=\"56\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(35 77 130)\"/><text x=\"77\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">1</text><rect x=\"122\" y=\"67\" width=\"14\" height=\"56\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(35 129 130)\"/><text x=\"129\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">2</text><rect x=\"174\" y=\"60\" width=\"14\" height=\"70\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(0 181 130)\"/><text x=\"181\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">3</text><rect x=\"226\" y=\"60\" width=\"14\" height=\"70\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(0 233 130)\"/><text x=\"233\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">4</text><rect x=\"278\" y=\"60\" width=\"14\" height=\"70\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(0 285 130)\"/><text x=\"285\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">5</text><rect x=\"330\" y=\"60\" width=\"14\" height=\"70\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(0 337 130)\"/><text x=\"337\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">6</text><rect x=\"382\" y=\"60\" width=\"14\" height=\"70\" rx=\"2\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" transform=\"rotate(0 389 130)\"/><text x=\"389\" y=\"152\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">7</text>\n<line x1=\"60\" y1=\"132\" x2=\"450\" y2=\"132\" stroke=\"#2E3438\"/>\n<path d=\"M46 96 L64 96\" stroke=\"#EDEFF0\" stroke-width=\"2\"/><path d=\"M58 90 L66 96 L58 102\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"30\" y=\"86\" font-size=\"12\" fill=\"#9AA1A6\">push</text>\n<text x=\"460\" y=\"70\" font-size=\"13\" fill=\"#9AA1A6\">Base case: push the</text>\n<text x=\"460\" y=\"87\" font-size=\"13\" fill=\"#9AA1A6\">first domino.</text>\n<text x=\"460\" y=\"111\" font-size=\"13\" fill=\"#9AA1A6\">Inductive step: each</text>\n<text x=\"460\" y=\"128\" font-size=\"13\" fill=\"#9AA1A6\">domino is close enough</text>\n<text x=\"460\" y=\"145\" font-size=\"13\" fill=\"#9AA1A6\">to topple the next.</text>\n<text x=\"460\" y=\"172\" font-size=\"12.5\" fill=\"#666D72\">Together they fell all</text>\n<text x=\"460\" y=\"189\" font-size=\"12.5\" fill=\"#666D72\">of them, however many</text>\n<text x=\"460\" y=\"206\" font-size=\"12.5\" fill=\"#666D72\">there are. Neither alone</text>\n<text x=\"460\" y=\"223\" font-size=\"12.5\" fill=\"#666D72\">suffices.</text>\n</svg>",
              "cap": "Induction as a chain of dominoes. Toppling the first one proves nothing about the rest; spacing them correctly proves nothing until one is pushed. Both parts are load-bearing."
            },
            {
              "t": "worked",
              "q": "Prove that 1 + 2 + … + n = n(n+1)/2 for all n ≥ 1.",
              "steps": [
                "Base case n = 1: the left side is 1, and the right side is 1(2)/2 = 1. They agree.",
                "Inductive hypothesis: assume 1 + … + k = k(k+1)/2 for some k ≥ 1.",
                "Inductive step: add (k+1) to both sides. The left becomes 1 + … + (k+1); the right becomes k(k+1)/2 + (k+1).",
                "Factor the right: (k+1)(k/2 + 1) = (k+1)(k+2)/2, which is the formula with k+1 in place of n."
              ],
              "answer": "The formula holds for all n ≥ 1. Notice the structure mirrors recursion exactly: a base case and a step that reduces to a smaller instance."
            },
            {
              "t": "note",
              "x": "Strong induction is a variant where the step may assume the statement for <em>all</em> values up to k, not just k itself. It is the right tool when a problem splits into two smaller pieces of unpredictable size — which is exactly the shape of divide-and-conquer, and why proving merge sort correct uses strong induction rather than ordinary induction."
            }
          ]
        },
        {
          "title": "Counting",
          "blocks": [
            {
              "t": "p",
              "x": "Counting sounds trivial until you try to count something with structure. The discipline gives a small number of rules that compose, and nearly every complexity argument in algorithms is an application of them."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Sum rule",
                  "If a choice is A ways or B ways, with no overlap, the total is A + B."
                ],
                [
                  "Product rule",
                  "If a task is a sequence of independent choices with A then B options, the total is A × B."
                ],
                [
                  "Permutation P(n,k)",
                  "Ordered arrangements of k items from n: n!/(n−k)!."
                ],
                [
                  "Combination C(n,k)",
                  "Unordered selections of k from n: n!/(k!(n−k)!). Also written \"n choose k\"."
                ],
                [
                  "Pigeonhole",
                  "Placing n items in m containers with n > m forces some container to hold at least two."
                ]
              ]
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"120\" cy=\"50\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"120\" y=\"55\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">·</text><line x1=\"120\" y1=\"67\" x2=\"60\" y2=\"93\" stroke=\"#2E3438\"/><circle cx=\"60\" cy=\"110\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"60\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">A</text><line x1=\"120\" y1=\"67\" x2=\"180\" y2=\"93\" stroke=\"#2E3438\"/><circle cx=\"180\" cy=\"110\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"180\" y=\"115\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">B</text><line x1=\"60\" y1=\"127\" x2=\"30\" y2=\"153\" stroke=\"#2E3438\"/><circle cx=\"30\" cy=\"170\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"30\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">AB</text><line x1=\"60\" y1=\"127\" x2=\"90\" y2=\"153\" stroke=\"#2E3438\"/><circle cx=\"90\" cy=\"170\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"90\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">AC</text><line x1=\"180\" y1=\"127\" x2=\"150\" y2=\"153\" stroke=\"#2E3438\"/><circle cx=\"150\" cy=\"170\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"150\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">BA</text><line x1=\"180\" y1=\"127\" x2=\"210\" y2=\"153\" stroke=\"#2E3438\"/><circle cx=\"210\" cy=\"170\" r=\"17\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"210\" y=\"175\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">BC</text>\n<text x=\"270\" y=\"56\" font-size=\"13.5\" fill=\"#9AA1A6\">3 ways to pick the first letter,</text>\n<text x=\"270\" y=\"78\" font-size=\"13.5\" fill=\"#9AA1A6\">2 ways left for the second: 3 × 2 = 6.</text>\n<text x=\"270\" y=\"112\" font-size=\"13.5\" fill=\"#9AA1A6\">That counts ordered pairs — permutations.</text>\n<text x=\"270\" y=\"146\" font-size=\"13.5\" fill=\"#9AA1A6\">If order does not matter, AB and BA are</text>\n<text x=\"270\" y=\"168\" font-size=\"13.5\" fill=\"#9AA1A6\">the same choice, so divide by 2! to get 3</text>\n<text x=\"270\" y=\"190\" font-size=\"13.5\" fill=\"#9AA1A6\">combinations. That division is all C(n,k) is.</text>\n</svg>",
              "cap": "Permutations count ordered outcomes; combinations divide out the orderings that count as the same. The k! in the denominator of C(n,k) is doing exactly that division."
            },
            {
              "t": "p",
              "x": "The distinction between permutations and combinations is the one that decides most counting problems. Ask: if I swap two of the chosen items, is that a different outcome? A podium of gold, silver and bronze says yes — permutation. A committee of three says no — combination."
            },
            {
              "t": "worked",
              "q": "How many subsets does a 5-element set have, and how many have exactly 2 elements?",
              "steps": [
                "For all subsets, decide independently for each element whether it is in or out.",
                "That is 2 choices made 5 times, so 2⁵ = 32 by the product rule.",
                "For exactly 2, order does not matter, so it is C(5,2).",
                "5!/(2!·3!) = 120/(2·6) = 10."
              ],
              "answer": "32 subsets total, 10 of size 2. The 2ⁿ growth is why brute-forcing over subsets becomes hopeless around n = 30, and why subset problems are the natural home of dynamic programming."
            },
            {
              "t": "p",
              "x": "The pigeonhole principle looks too obvious to be useful, and then it proves things nothing else can. Any hash function mapping a large input space into a fixed-size output must have collisions — there are more possible inputs than outputs, so two must share. No cleverness in the hash function can avoid it. The same argument shows no lossless compressor can shrink every input."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Work these before checking. The logic and counting items are mechanical; the last two ask you to apply the ideas to code, which is where they earn their place."
            }
          ],
          "exercises": [
            {
              "q": "Rewrite !(a || (b && !c)) with no negation outside a single variable.",
              "steps": [
                "Apply De Morgan to the outer negation: !a && !(b && !c).",
                "Apply De Morgan again inside: !(b && !c) becomes !b || !!c.",
                "Double negation cancels: !!c is c.",
                "Combine the pieces."
              ],
              "answer": "!a && (!b || c). Check one case: a false, b true, c true. Original: !(false || (true && false)) = !(false) = true. Rewritten: true && (false || true) = true.",
              "kind": "mc",
              "options": [
                "!a && (!b || c)",
                "!a && !b && c",
                "!a || (!b && c)",
                "a && (b || !c)"
              ],
              "correct": 0
            },
            {
              "q": "Is \"if n is divisible by 4 then n is even\" true? What about its converse?",
              "steps": [
                "Any n divisible by 4 is 4k = 2(2k), which is even, so the statement is true.",
                "The converse swaps hypothesis and conclusion: if n is even then n is divisible by 4.",
                "Test n = 6: it is even but not divisible by 4.",
                "One counterexample refutes a universal claim."
              ],
              "answer": "The statement is true, the converse is false. A true implication tells you nothing about its converse — only the contrapositive is guaranteed to come along.",
              "kind": "mc",
              "options": [
                "The statement is true; its converse is false",
                "Both are true",
                "The statement is false; its converse is true",
                "Both are false"
              ],
              "correct": 0
            },
            {
              "q": "Negate: \"every user has at least one active session.\"",
              "steps": [
                "Formally: ∀u ∃s (session s belongs to u and s is active).",
                "Negating flips ∀ to ∃ and pushes inward.",
                "The inner ∃ flips to ∀ with the body negated.",
                "∃u ∀s (s does not belong to u, or s is not active)."
              ],
              "answer": "\"Some user has no active session.\" Note the negation is an existential — to disprove the original you need exactly one such user, which is what a test case is.",
              "kind": "mc",
              "options": [
                "Some user has no active session",
                "Every user has no active session",
                "Some user has both an active and an inactive session",
                "No user has any session at all"
              ],
              "correct": 0
            },
            {
              "q": "Is \"has the same remainder mod 3\" an equivalence relation on the integers? What are its classes?",
              "steps": [
                "Reflexive: n has the same remainder as itself. Yes.",
                "Symmetric: if a matches b then b matches a. Yes.",
                "Transitive: if a matches b and b matches c then a matches c. Yes.",
                "All three hold, so it partitions the integers by remainder."
              ],
              "answer": "Yes, with three classes: remainder 0, 1 and 2. This is exactly what a hash function with three buckets does — the classes are the buckets.",
              "kind": "mc",
              "options": [
                "Yes, and it has three classes",
                "No, it fails transitivity",
                "Yes, and it has two classes",
                "No, it fails reflexivity"
              ],
              "correct": 0
            },
            {
              "q": "A password is 8 characters from a 62-character alphabet. How many are possible, and how does adding two characters compare with doubling the alphabet?",
              "steps": [
                "Each position is an independent choice, so it is 62⁸ by the product rule.",
                "62⁸ is about 2.18 × 10¹⁴.",
                "Two more characters gives 62¹⁰ ≈ 8.4 × 10¹⁷, a factor of 3,844.",
                "Doubling the alphabet gives 124⁸ = 2⁸ × 62⁸, a factor of 256."
              ],
              "answer": "Length beats alphabet size, because length is in the exponent and alphabet size is in the base. This is the whole argument for passphrases over short complex passwords.",
              "kind": "mc",
              "options": [
                "Two more characters, by roughly fifteen times",
                "Doubling the alphabet, by roughly fifteen times",
                "They give identical gains",
                "Doubling the alphabet, but only slightly"
              ],
              "correct": 0
            },
            {
              "q": "Prove by induction that a set with n elements has 2ⁿ subsets.",
              "steps": [
                "Base case n = 0: the empty set has exactly one subset, itself, and 2⁰ = 1.",
                "Assume a set with k elements has 2^k subsets.",
                "Add one new element x to get a set of size k+1. Every subset either contains x or does not.",
                "Those without x are exactly the 2^k old subsets; those with x are the old subsets each plus x, another 2^k. Total 2·2^k = 2^(k+1)."
              ],
              "answer": "The claim holds for all n ≥ 0. The step is the same case split a recursive subset generator makes: include the element, or do not.",
              "kind": "mc",
              "options": [
                "Split the subsets into those containing the new element and those not — each group has 2ᵏ",
                "Assume 2ᵏ subsets and multiply by k+1 for the new element",
                "Count the subsets of each size and add the results",
                "Verify it for n = 1, 2 and 3 and conclude it holds generally"
              ],
              "correct": 0
            },
            {
              "q": "You hash one million distinct keys into a table with 100,000 buckets. Argue that some bucket holds at least 10.",
              "steps": [
                "Suppose every bucket held at most 9 keys.",
                "Then the table could hold at most 100,000 × 9 = 900,000 keys.",
                "But there are 1,000,000 keys to place.",
                "The assumption is impossible."
              ],
              "answer": "Some bucket holds at least 10, by the pigeonhole principle. Note this holds for any hash function whatsoever — no design avoids it, which is why collision handling is mandatory rather than optional.",
              "kind": "mc",
              "options": [
                "Some bucket holds at least 10",
                "Every bucket holds exactly 10",
                "Some bucket holds at least 100",
                "Nothing follows without knowing the hash function"
              ],
              "correct": 0
            },
            {
              "q": "A loop sets i = 0 and increments while i < n. Prove the invariant 0 ≤ i ≤ n holds on every iteration.",
              "steps": [
                "Base case: before the first iteration i = 0, and n ≥ 0, so the invariant holds.",
                "Inductive step: assume 0 ≤ i ≤ n at the top of some iteration.",
                "The body runs only if i < n, so i ≤ n − 1 at that point, and i + 1 ≤ n.",
                "After incrementing, 0 ≤ i ≤ n still holds."
              ],
              "answer": "The invariant is preserved, so a[i] is never accessed out of bounds. This is induction over iterations, and it is what a formal verifier automates.",
              "kind": "mc",
              "options": [
                "It holds before the loop and every iteration preserves it",
                "It becomes true only once the loop has finished",
                "It holds only when n is positive",
                "It has to be checked at runtime with an assertion"
              ],
              "correct": 0
            },
            {
              "kind": "write",
              "q": "A statement that is true before a loop begins and is preserved by every iteration is called a loop ___.",
              "accept": [
                "invariant",
                "loop invariant"
              ],
              "hint": "one word",
              "steps": [
                "It plays the role of the inductive hypothesis, applied to iterations.",
                "Establish it before the loop, show each iteration preserves it.",
                "Combined with the exit condition it gives the postcondition."
              ],
              "answer": "An invariant. It proves correctness given termination; a separate decreasing quantity proves termination itself."
            },
            {
              "kind": "write",
              "q": "A relation that is reflexive, symmetric and transitive is called an ___ relation.",
              "accept": [
                "equivalence"
              ],
              "hint": "one word",
              "steps": [
                "Reflexive: everything relates to itself.",
                "Symmetric: the relation reads the same in both directions.",
                "Transitive: it chains."
              ],
              "answer": "An equivalence relation. It always partitions the set into disjoint classes, which is what grouping by a key does."
            },
            {
              "kind": "write",
              "q": "The principle that placing n items into fewer than n containers forces some container to hold at least two is the ___ principle.",
              "accept": [
                "pigeonhole"
              ],
              "hint": "one word",
              "steps": [
                "If every container held at most one, the total capacity would be the number of containers.",
                "With more items than that, the placement is impossible.",
                "So some container holds two or more."
              ],
              "answer": "The pigeonhole principle. It proves hash collisions are unavoidable regardless of how good the hash function is."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Biconditional (p ↔ q)",
          "p if and only if q. True when both have the same truth value."
        ],
        [
          "Bijection",
          "A function that is both injective and surjective, and therefore invertible."
        ],
        [
          "Cardinality (|A|)",
          "The number of elements. Finite sets are the ones you can count; infinite ones come in different sizes, which is Cantor's territory."
        ],
        [
          "Combination C(n,k)",
          "Unordered selections of k from n: n!/(k!(n−k)!). Also written \"n choose k\"."
        ],
        [
          "Conjunction (p ∧ q)",
          "p and q. True only when both are true."
        ],
        [
          "Contrapositive",
          "¬q → ¬p, which is logically equivalent to p → q — unlike the converse."
        ],
        [
          "Converse",
          "q → p. Not equivalent to p → q, and confusing the two is the classic reasoning error."
        ],
        [
          "De Morgan's laws",
          "¬(p ∧ q) ≡ ¬p ∨ ¬q, and ¬(p ∨ q) ≡ ¬p ∧ ¬q. The operator flips."
        ],
        [
          "Difference (A \\ B)",
          "In A but not in B. Not symmetric."
        ],
        [
          "Disjunction (p ∨ q)",
          "p or q. True when at least one is true — this is inclusive or, unlike everyday English."
        ],
        [
          "Domain",
          "The set x ranges over. A quantified statement is meaningless without it — ∀x (x > 0) is false over the integers and true over the positive integers."
        ],
        [
          "Equivalence class",
          "One group of the partition produced by an equivalence relation."
        ],
        [
          "Equivalence relation",
          "A reflexive, symmetric and transitive relation, which partitions a set into classes."
        ],
        [
          "Existential (∃x P(x))",
          "There exists an x with P(x). True as soon as one witness exists."
        ],
        [
          "Implication (p → q)",
          "If p then q. False only when p is true and q is false."
        ],
        [
          "Induction",
          "Proving a claim for all n via a base case plus a step from k to k+1."
        ],
        [
          "Intersection (A ∩ B)",
          "Everything in both."
        ],
        [
          "Invariant",
          "A statement preserved by every step of a process."
        ],
        [
          "Negation (¬p)",
          "Not p. True exactly when p is false."
        ],
        [
          "Permutation P(n,k)",
          "Ordered arrangements of k items from n: n!/(n−k)!."
        ],
        [
          "Pigeonhole",
          "Placing n items in m containers with n > m forces some container to hold at least two."
        ],
        [
          "Pigeonhole principle",
          "More items than containers forces some container to hold at least two."
        ],
        [
          "Power set (2^A)",
          "The set of all subsets of A. It has 2^|A| elements, which is where the notation comes from."
        ],
        [
          "Predicate",
          "A statement with a free variable, like P(x): \"x is positive\". It has no truth value until x is supplied."
        ],
        [
          "Product rule",
          "If a task is a sequence of independent choices with A then B options, the total is A × B."
        ],
        [
          "Proposition",
          "A statement that is either true or false."
        ],
        [
          "Strong induction",
          "Induction where the step may assume the claim for all values up to k, not only k."
        ],
        [
          "Subset (A ⊆ B)",
          "Every element of A is in B. Note ∅ ⊆ A for every A, and A ⊆ A."
        ],
        [
          "Sum rule",
          "If a choice is A ways or B ways, with no overlap, the total is A + B."
        ],
        [
          "Union (A ∪ B)",
          "Everything in either set."
        ],
        [
          "Universal (∀x P(x))",
          "For all x, P(x) holds. False as soon as one counterexample exists."
        ],
        [
          "Vacuous truth",
          "An implication counted true because its hypothesis is false, so the promise was never tested."
        ]
      ]
    },
  "stats": {
      "title": "Statistics",
      "blurb": "Drawing conclusions from a sample instead of the whole population, and being precise about exactly how much those conclusions can be trusted.",
      "chapters": [
        {
          "title": "Estimating from a sample",
          "blocks": [
            {
              "t": "p",
              "x": "Probability, covered in the prior booklet, starts from a known distribution and asks what data it's likely to produce. Statistics runs the inference the other direction: given data you actually observed, what can you say about the distribution or population it came from? An estimator is a rule — a formula — for turning a sample into a guess at some property of the whole population: the sample mean estimates the population mean, the sample proportion estimates the true proportion, and so on."
            },
            {
              "t": "p",
              "x": "The population is everything you'd ideally want to know about; the sample is the finite, observed subset you actually have. Every statistical claim is implicitly a claim about how well the sample stands in for the population it was drawn from — which depends heavily on how the sample was collected, not just how large it is. A huge but biased sample can be worse than a small, carefully random one, a theme this booklet returns to at the end."
            },
            {
              "t": "note",
              "x": "A point estimate is a single number (\"the mean is 4.2\"). It is almost always wrong in the sense of not exactly matching the true population value — which is precisely why statistics also cares about quantifying the uncertainty around that number, not just producing it."
            }
          ]
        },
        {
          "title": "Bias and variance of an estimator",
          "blocks": [
            {
              "t": "p",
              "x": "An estimator has two separate properties worth judging independently. Bias is whether the estimator's expected value, averaged over many hypothetical samples, equals the true population value — an unbiased estimator gets it right on average, even though any single sample's estimate will still be off. Variance is how much the estimate swings from sample to sample; a low-variance estimator gives similar answers regardless of which particular sample you happened to draw."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Dots: estimates from many different samples. Cross: true population value.</text>\n<line x1=\"30\" y1=\"120\" x2=\"330\" y2=\"120\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"140\" y=\"200\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\">Unbiased, low variance</text>\n<path d=\"M172 100 L184 112 M184 100 L172 112\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<circle cx=\"170\" cy=\"110\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"182\" cy=\"104\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"176\" cy=\"118\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"165\" cy=\"100\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"188\" cy=\"114\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<line x1=\"400\" y1=\"120\" x2=\"700\" y2=\"120\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"550\" y=\"200\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\">Biased, low variance</text>\n<path d=\"M552 100 L564 112 M564 100 L552 112\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<circle cx=\"600\" cy=\"80\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"606\" cy=\"88\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"596\" cy=\"70\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"610\" cy=\"78\" r=\"3.5\" fill=\"#9AA1A6\"/>\n<circle cx=\"602\" cy=\"92\" r=\"3.5\" fill=\"#9AA1A6\"/>\n</svg>",
              "cap": "The left estimator is unbiased and tight: its samples cluster right around the true value. The right one is consistently off-target (biased) despite also being tight — bias and variance are independent failure modes."
            },
            {
              "t": "worked",
              "q": "Why does the standard sample-variance formula divide by n − 1 instead of n?",
              "steps": [
                "Variance measures average squared distance from the mean.",
                "Using the sample's own mean (rather than the unknown true population mean) makes the data appear slightly less spread out than it really is, because the sample mean is, by construction, the point that minimises squared distance to that specific sample.",
                "Dividing by n systematically underestimates the true population variance as a result — it is a biased estimator.",
                "Dividing by n − 1 instead (Bessel's correction) exactly corrects this bias, making the estimator unbiased."
              ],
              "answer": "Dividing by n − 1 (Bessel's correction) removes a systematic downward bias that comes from using the sample's own mean as the reference point instead of the true, unknown population mean."
            }
          ]
        },
        {
          "title": "Confidence intervals and hypothesis testing",
          "blocks": [
            {
              "t": "p",
              "x": "A confidence interval reports a range instead of a single point estimate, along with a confidence level such as 95%. The precise (and frequently misstated) meaning: if you repeated the entire sampling and interval-construction procedure many times, about 95% of the resulting intervals would contain the true population value. It is a statement about the reliability of the procedure across repetitions — not a 95% probability that this specific, already-computed interval contains the truth, which is either true or false with no probability left once the data is in hand."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">20 intervals from 20 different samples, same true value each time:</text>\n<line x1=\"350\" y1=\"40\" x2=\"350\" y2=\"180\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n<text x=\"350\" y=\"196\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">true value</text>\n<g stroke=\"#9AA1A6\" stroke-width=\"2\">\n<line x1=\"300\" y1=\"50\" x2=\"380\" y2=\"50\"/><line x1=\"310\" y1=\"58\" x2=\"390\" y2=\"58\"/>\n<line x1=\"290\" y1=\"66\" x2=\"370\" y2=\"66\"/><line x1=\"320\" y1=\"74\" x2=\"400\" y2=\"74\"/>\n<line x1=\"305\" y1=\"82\" x2=\"385\" y2=\"82\"/><line x1=\"295\" y1=\"90\" x2=\"375\" y2=\"90\"/>\n<line x1=\"315\" y1=\"98\" x2=\"395\" y2=\"98\"/><line x1=\"300\" y1=\"106\" x2=\"380\" y2=\"106\"/>\n<line x1=\"310\" y1=\"114\" x2=\"390\" y2=\"114\"/><line x1=\"290\" y1=\"122\" x2=\"370\" y2=\"122\"/>\n<line x1=\"305\" y1=\"130\" x2=\"385\" y2=\"130\"/><line x1=\"320\" y1=\"138\" x2=\"400\" y2=\"138\"/>\n<line x1=\"295\" y1=\"146\" x2=\"375\" y2=\"146\"/><line x1=\"310\" y1=\"154\" x2=\"390\" y2=\"154\"/>\n</g>\n<line x1=\"175\" y1=\"162\" x2=\"255\" y2=\"162\" stroke=\"#666D72\" stroke-width=\"2\"/>\n<text x=\"215\" y=\"180\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">misses (~1 in 20 at 95%)</text>\n</svg>",
              "cap": "About 95% of intervals built this way cross the true value; a few, by chance, miss it entirely. The 95% describes the procedure across repetitions, not any single interval you've already computed."
            },
            {
              "t": "p",
              "x": "Hypothesis testing asks a narrower, sharper question: assuming some default \"null hypothesis\" is true (typically, that there is no effect), how surprising is the data you actually observed? The p-value is the probability of seeing data at least as extreme as what was observed, if the null hypothesis were true. A small p-value means the observed data would be unlikely under the null hypothesis, which is evidence against it — not, despite the common misreading, the probability that the null hypothesis itself is true or false."
            },
            {
              "t": "note",
              "x": "A wider confidence interval (higher confidence, smaller sample, or noisier data) trades precision for reliability; a narrower one trades the reverse. Increasing the sample size shrinks the interval's width for a fixed confidence level, which is the statistical version of the law of large numbers narrowing an estimate as more data arrives."
            }
          ]
        },
        {
          "title": "Maximum likelihood estimation",
          "blocks": [
            {
              "t": "p",
              "x": "Maximum likelihood estimation (MLE) is a general recipe for turning \"which parameter values best explain this data\" into an optimisation problem: choose the parameters that make the observed data as probable as possible under the assumed model. For a coin flipped n times landing heads k times, the maximum-likelihood estimate of the true heads-probability is exactly k/n — the intuitive answer, arrived at by a formal procedure that generalises to far less obvious cases."
            },
            {
              "t": "p",
              "x": "This is the direct bridge to the machine learning track: training a model by minimising a loss function is, for many common losses, exactly maximum likelihood estimation in disguise. Minimising mean squared error is MLE under an assumption of Gaussian-distributed noise; minimising cross-entropy loss (the information theory booklet's measure of surprise) is MLE under a categorical distribution assumption. The optimisation booklet's machinery for finding a minimum is what actually carries out the maximisation — maximising likelihood and minimising negative log-likelihood are the same problem."
            }
          ]
        },
        {
          "title": "Sampling bias, confounding, and Simpson's paradox",
          "blocks": [
            {
              "t": "p",
              "x": "No amount of statistical machinery rescues a badly collected sample. Sampling bias occurs when the process used to gather data systematically favours some outcomes over others — surveying only people who answer their phone during business hours, or measuring server latency only from requests that succeeded and completed. A confounding variable is a hidden third factor that influences both the thing you're measuring and the thing you think is causing it, creating an association that isn't really cause and effect."
            },
            {
              "t": "p",
              "x": "Simpson's paradox is the sharpest illustration of confounding: a trend that appears in several separate groups can reverse when those groups are combined into one, entirely because of how the group sizes differ. A treatment can have a higher success rate than a placebo in both the mild-case group and the severe-case group individually, yet have a lower overall success rate once both groups are pooled — if the treatment group happened to contain far more severe cases, which succeed less often regardless of treatment."
            },
            {
              "t": "note",
              "x": "The fix for Simpson's paradox is not a different statistical test — it's recognising the confounding variable (case severity, in the example) and either controlling for it directly or reporting results within each group rather than pooled. No formula substitutes for understanding how the data was actually generated."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [],
          "exercises": [
            {
              "q": "A study reports p = 0.03 for a treatment effect. What does this actually mean?",
              "kind": "mc",
              "options": [
                "If there were truly no effect, data this extreme would occur about 3% of the time by chance",
                "There is a 3% chance the treatment has no real effect",
                "The treatment improves outcomes by 3%",
                "There is a 97% chance the treatment works"
              ],
              "correct": 0,
              "steps": [
                "A p-value is computed by assuming the null hypothesis (no real effect) is true.",
                "It is the probability of observing data at least this extreme under that assumption.",
                "p = 0.03 means: if there truly were no effect, results this striking would show up about 3% of the time purely from sampling noise.",
                "It says nothing directly about the probability that the null hypothesis itself is true, and nothing about the effect's size."
              ],
              "answer": "It's the probability of seeing data this extreme (or more) if the null hypothesis were actually true — not the probability that the null hypothesis is true, and not a measure of how large or important the effect is."
            },
            {
              "q": "Why does the standard sample-variance formula use n − 1 in the denominator rather than n?",
              "kind": "write",
              "accept": [
                "bessel",
                "bessel's correction",
                "bessels correction"
              ],
              "hint": "named after a mathematician",
              "steps": [
                "Using the sample mean as the reference point (instead of the unknown true mean) makes the sample look slightly less spread out than the true population.",
                "That understatement is a systematic, predictable bias.",
                "Dividing by n − 1 instead of n exactly cancels this bias, on average, across repeated samples.",
                "This correction has a name."
              ],
              "answer": "Bessel's correction. Dividing by n − 1 makes the sample variance an unbiased estimator of the true population variance."
            },
            {
              "q": "A drug shows a higher success rate than placebo within both the mild-case group and the severe-case group, but a lower success rate than placebo when both groups are combined. What is the most likely explanation?",
              "steps": [
                "This pattern — an effect reversing when subgroups are pooled — is Simpson's paradox.",
                "It typically happens when the subgroup sizes differ sharply between the two arms of the study.",
                "If the drug group contains disproportionately more severe cases (which succeed less often regardless of treatment), pooling drags the drug's overall rate down even though it outperforms within each severity level.",
                "Case severity here is the confounding variable driving the reversal."
              ],
              "answer": "A confounding variable — most likely an imbalance in how many mild versus severe cases ended up in each group, which is exactly Simpson's paradox: a within-group trend reversing once the groups are pooled."
            },
            {
              "q": "Holding the confidence level fixed at 95%, what happens to a confidence interval's width as the sample size grows?",
              "kind": "mc",
              "options": [
                "It narrows — more data means less uncertainty about the estimate",
                "It widens — more data reveals more variability",
                "It stays the same — width depends only on confidence level",
                "It becomes exactly zero once n exceeds 1,000"
              ],
              "correct": 0,
              "steps": [
                "A confidence interval's width is driven by the estimated standard error of the statistic.",
                "Standard error shrinks as sample size grows, typically proportional to 1 over the square root of n.",
                "A smaller standard error, at the same confidence level, produces a narrower interval.",
                "This is the same law-of-large-numbers effect that makes larger samples more reliable in general."
              ],
              "answer": "It narrows. More data reduces the standard error of the estimate, and a fixed confidence level then corresponds to a tighter range — though the interval never shrinks to exactly zero width for any finite sample."
            },
            {
              "q": "A coin is flipped 20 times and lands heads 15 times. Using maximum likelihood estimation, what is the estimated probability of heads?",
              "steps": [
                "MLE for a coin's heads-probability, given k heads in n flips, is the value that makes the observed data most probable.",
                "For this model, that maximising value is exactly k/n.",
                "Here k = 15 and n = 20.",
                "15/20 simplifies to 0.75."
              ],
              "answer": "0.75. This matches intuition exactly, which is part of why MLE is a useful general framework — it recovers the obvious answer here and generalises to cases where the obvious answer isn't so obvious."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Population",
          "The entire group you'd ideally want to know about; usually too large or costly to observe fully."
        ],
        [
          "Sample",
          "The finite, observed subset of the population actually used to draw conclusions."
        ],
        [
          "Estimator",
          "A formula or rule that turns a sample into a guess at some property of the population."
        ],
        [
          "Point estimate",
          "A single-number estimate, such as a sample mean, with no attached measure of uncertainty."
        ],
        [
          "Bias (of an estimator)",
          "Whether the estimator's average value over many samples equals the true population value."
        ],
        [
          "Variance (of an estimator)",
          "How much an estimator's value swings from one sample to another."
        ],
        [
          "Bessel's correction",
          "Dividing by n − 1 instead of n when estimating variance, to remove a systematic downward bias."
        ],
        [
          "Confidence interval",
          "A range constructed so that, across repeated sampling, a stated percentage of such ranges contain the true value."
        ],
        [
          "Null hypothesis",
          "The default assumption (typically \"no effect\") that a hypothesis test evaluates evidence against."
        ],
        [
          "p-value",
          "The probability of observing data at least as extreme as what was seen, assuming the null hypothesis is true."
        ],
        [
          "Maximum likelihood estimation",
          "Choosing the parameter values that make the observed data as probable as possible under the assumed model."
        ],
        [
          "Sampling bias",
          "A systematic distortion introduced by how the sample was collected, not fixable by collecting more of the same kind of data."
        ],
        [
          "Confounding variable",
          "A hidden factor that influences both the presumed cause and the observed effect, creating a spurious association."
        ],
        [
          "Simpson's paradox",
          "A trend present in each of several subgroups that reverses once the subgroups are combined."
        ]
      ]
    },
  "infotheory": {
      "title": "Information theory",
      "blurb": "A precise way to measure surprise, using the probability distributions from the prob booklet — and, further down this map, the exact quantity most machine learning loss functions turn out to be minimizing in disguise.",
      "chapters": [
        {
          "title": "Self-information: measuring one surprising event",
          "blocks": [
            {
              "t": "p",
              "x": "An event that's certain to happen tells you nothing when it happens; an event with probability 1 in a million is genuinely informative when it occurs. Self-information formalizes this intuition: for an event with probability p, its self-information is −log₂(p) bits. A coin flip landing heads (p = 0.5) carries −log₂(0.5) = 1 bit. An event with p = 1 (certain) carries −log₂(1) = 0 bits — no surprise, no information."
            },
            {
              "t": "p",
              "x": "The log makes independent events additive: two independent coin flips, each carrying 1 bit, together carry −log₂(0.5 × 0.5) = −log₂(0.25) = 2 bits, exactly the sum of the two individual amounts. This additivity is precisely why bits — powers of two — are the natural unit: each independent yes/no answer, evenly split, adds exactly one bit of information, matching how binary digits (from the binary booklet) work."
            },
            {
              "t": "note",
              "x": "\"Bit\" here means the same thing as a binary digit conceptually, but it's worth keeping the two senses distinct: a stored bit (0 or 1) is a unit of storage; a bit of information is a unit of surprise. A stored bit that's always 0 carries zero bits of information, even though it still occupies one bit of storage."
            }
          ]
        },
        {
          "title": "Entropy: the expected surprise of a whole distribution",
          "blocks": [
            {
              "t": "p",
              "x": "Entropy asks a broader question than self-information: not \"how surprising was this one outcome\" but \"how surprising is this distribution, on average, before you know the outcome?\" Formally, entropy H(X) = −Σ p(x)·log₂ p(x), summed over all possible outcomes x — the probability-weighted average of each outcome's self-information."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Entropy of a biased coin, as a function of p(heads)</text>\n<line x1=\"70\" y1=\"210\" x2=\"640\" y2=\"210\" stroke=\"#23282B\"/>\n<line x1=\"70\" y1=\"40\" x2=\"70\" y2=\"210\" stroke=\"#23282B\"/>\n<text x=\"355\" y=\"232\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">p(heads) — 0 to 1</text>\n<text x=\"30\" y=\"44\" font-size=\"10.5\" fill=\"#666D72\">1 bit</text>\n<text x=\"30\" y=\"214\" font-size=\"10.5\" fill=\"#666D72\">0</text>\n<path d=\"M70 210 Q355 30 640 210\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.8\"/>\n<line x1=\"355\" y1=\"52\" x2=\"355\" y2=\"210\" stroke=\"#2E3438\" stroke-dasharray=\"3,3\"/>\n<circle cx=\"355\" cy=\"52\" r=\"3.5\" fill=\"#EDEFF0\"/>\n<text x=\"365\" y=\"56\" font-size=\"11\" fill=\"#EDEFF0\">p=0.5 → H=1 bit (max surprise)</text>\n<circle cx=\"70\" cy=\"210\" r=\"3.5\" fill=\"#666D72\"/><circle cx=\"640\" cy=\"210\" r=\"3.5\" fill=\"#666D72\"/>\n<text x=\"70\" y=\"228\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">p=0</text>\n<text x=\"640\" y=\"228\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">p=1</text>\n</svg>",
              "cap": "A fair coin (p = 0.5) is maximally unpredictable, so it has the highest entropy, 1 bit; a coin that always lands the same way (p = 0 or p = 1) has zero entropy — no uncertainty left to resolve."
            },
            {
              "t": "worked",
              "q": "A fair six-sided die has entropy log₂(6) ≈ 2.58 bits. Why is this higher than a fair coin's 1 bit, and does that match intuition?",
              "steps": [
                "Entropy for a uniform distribution over k equally-likely outcomes is exactly log₂(k) — each outcome is equally surprising, so the weighted average is just that one value.",
                "A coin has k = 2 outcomes: log₂(2) = 1 bit.",
                "A die has k = 6 outcomes: log₂(6) ≈ 2.58 bits.",
                "More equally-likely outcomes means more uncertainty to resolve before you know the result, so higher entropy — which matches the intuition that a die roll is 'more surprising' on average than a coin flip."
              ],
              "answer": "A uniform distribution's entropy is log₂(number of outcomes); a die has 6 outcomes to a coin's 2, so log₂(6) ≈ 2.58 exceeds log₂(2) = 1 — more equally-likely possibilities means more uncertainty to resolve, matching the intuition that guessing a die roll is harder than guessing a coin flip."
            }
          ]
        },
        {
          "title": "Cross-entropy and KL divergence",
          "blocks": [
            {
              "t": "p",
              "x": "Entropy measures a distribution against itself. Cross-entropy measures the cost of using the wrong distribution: if the true distribution is p but you encode or predict using distribution q instead, cross-entropy H(p, q) = −Σ p(x)·log₂ q(x) is the average number of bits that mismatch actually costs you. It's always at least as large as the true entropy H(p), with equality exactly when q = p — using the right distribution is always at least as efficient as using a wrong one."
            },
            {
              "t": "p",
              "x": "This is the direct link to machine learning: a classifier outputs a predicted probability distribution q over classes, and the true label is effectively a distribution p that puts all its probability on the one correct class. Cross-entropy loss is literally H(p, q) computed against that true label — minimizing it during training means pushing the model's predicted distribution q as close to the true one p as possible, which is exactly what the stats booklet's maximum likelihood estimation is doing for a categorical outcome."
            },
            {
              "t": "p",
              "x": "KL divergence, D_KL(p ‖ q) = H(p, q) − H(p), isolates the extra cost specifically attributable to using q instead of p, with the baseline entropy of p subtracted out. It's always ≥ 0 (Gibbs' inequality), zero only when p and q are identical, and — importantly — not symmetric: D_KL(p ‖ q) generally does not equal D_KL(q ‖ p), so it measures a directional mismatch, not a distance in the everyday sense."
            },
            {
              "t": "note",
              "x": "The asymmetry is a common trip-up: D_KL(p ‖ q) heavily penalizes q assigning near-zero probability to an outcome p considers likely (that mismatch costs a huge number of bits, since −log₂(near-zero) is huge), but is comparatively forgiving of q spreading probability over outcomes p considers unlikely. Which direction you compute matters, and different applications (e.g. certain variational inference setups) deliberately choose one direction over the other for this reason."
            }
          ]
        },
        {
          "title": "Mutual information",
          "blocks": [
            {
              "t": "p",
              "x": "Mutual information I(X; Y) measures how much knowing one random variable reduces uncertainty about another: I(X; Y) = H(X) − H(X | Y), the entropy of X minus the entropy of X once Y is known. If X and Y are independent, learning Y tells you nothing about X, and I(X; Y) = 0; if Y determines X exactly, I(X; Y) = H(X) — learning Y eliminates all uncertainty about X."
            },
            {
              "t": "p",
              "x": "It's symmetric (I(X; Y) = I(Y; X), unlike KL divergence) and shows up as a feature-selection tool in machine learning — ranking candidate input features by how much mutual information each carries about the target label is a quick, model-agnostic way to spot which features are likely to matter, before ever training a model."
            }
          ]
        },
        {
          "title": "Compression and coding",
          "blocks": [
            {
              "t": "p",
              "x": "Entropy isn't just an abstraction — it's a hard lower bound on lossless compression. Shannon's source coding theorem states that no lossless code can represent symbols drawn from a distribution using, on average, fewer bits per symbol than that distribution's entropy. A symbol that occurs with probability p can't be compressed, on average, below −log₂(p) bits without losing information."
            },
            {
              "t": "p",
              "x": "Huffman coding is a concrete, near-optimal way to approach this bound: it assigns shorter binary codes to more frequent symbols and longer codes to rarer ones, built by repeatedly merging the two least-frequent symbols (or partial codes) into a tree from the bottom up. This is why common letters like 'e' get short codes in a well-tuned text compressor and rare ones like 'q' get long codes — the same intuition as Morse code assigning a single dot to 'e' and a long sequence to 'q'."
            },
            {
              "t": "note",
              "x": "Huffman coding reaches the entropy bound exactly only when every symbol's probability happens to be a power of 1/2 (so −log₂(p) is a whole number of bits); otherwise it comes close but not exact, since it can't assign a fractional number of bits to a symbol. Arithmetic coding and range coding are more sophisticated schemes that get arbitrarily close to the entropy bound even without that restriction."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These lean on the prob booklet's distributions and preview the cross-entropy loss you'll meet again, by name, once training a classifier."
            }
          ],
          "exercises": [
            {
              "q": "Why is cross-entropy loss the natural choice for training a classifier, rather than, say, mean squared error on the predicted probabilities?",
              "kind": "mc",
              "options": [
                "Because minimizing it is equivalent to maximum likelihood estimation for the true class label",
                "Because it's always numerically smaller than mean squared error",
                "Because it doesn't require the model to output probabilities",
                "Because it's the only loss function that's differentiable"
              ],
              "correct": 0,
              "steps": [
                "Cross-entropy H(p, q), with p the true label's one-hot distribution, measures exactly the cost of using the model's predicted distribution q instead of the truth.",
                "Minimizing that cost is, as the stats booklet's MLE chapter establishes for categorical outcomes, equivalent to maximizing the likelihood of the true labels under the model.",
                "Mean squared error doesn't have this direct probabilistic interpretation for classification outputs and both penalizes and rewards probability mass differently, giving weaker gradients when the model is confidently wrong.",
                "The choice isn't about numeric size or differentiability (MSE is also differentiable) — it's about matching the loss to what you're actually trying to maximize."
              ],
              "answer": "Because minimizing cross-entropy loss on the true labels is mathematically equivalent to maximum likelihood estimation for a categorical distribution — it directly optimizes for the model assigning high probability to the correct class, which is exactly the objective, whereas mean squared error has no such direct probabilistic justification for classification."
            },
            {
              "q": "A weather model predicts a 1% chance of rain on a day it actually rains. Explain, using the shape of −log₂(q), why this specific kind of mistake is punished so heavily by cross-entropy.",
              "kind": "write",
              "accept": [
                "log of a near zero probability is very large, so confidently wrong predictions cost a huge number of bits",
                "-log2 blows up as q approaches 0"
              ],
              "hint": "look at what happens to -log2(q) as q gets close to 0",
              "steps": [
                "Cross-entropy on the actual outcome contributes −log₂(q), where q is the probability the model assigned to what actually happened.",
                "As q approaches 0, −log₂(q) grows without bound — it's not a gentle penalty, it diverges.",
                "A 1% prediction on the outcome that actually occurred means q = 0.01, giving −log₂(0.01) ≈ 6.6 bits of cost for that single example — much larger than a well-calibrated prediction would cost.",
                "This is a deliberate property, not a flaw: it means confidently wrong predictions are punished far more than honestly uncertain ones, which pushes training toward well-calibrated probabilities rather than overconfident guesses."
              ],
              "answer": "Because cross-entropy charges −log₂(q) for the outcome that actually happened, and that quantity blows up as q approaches 0 — a confident wrong prediction (q near 0 on the true outcome) costs vastly more than an honestly uncertain one, which is exactly the incentive structure that pushes a model toward well-calibrated probabilities instead of overconfidence."
            },
            {
              "q": "Two random variables X and Y are independent. What is I(X; Y), and why?",
              "steps": [
                "Mutual information is I(X; Y) = H(X) − H(X | Y): the entropy of X minus the entropy of X once Y is known.",
                "If X and Y are independent, knowing Y provides no information about X whatsoever.",
                "That means H(X | Y) = H(X) — conditioning on Y doesn't reduce X's uncertainty at all.",
                "So I(X; Y) = H(X) − H(X) = 0."
              ],
              "answer": "I(X; Y) = 0. Independence means learning Y tells you nothing about X, so conditioning on Y doesn't reduce X's entropy at all, and mutual information — which measures exactly that reduction — is zero."
            },
            {
              "q": "D_KL(p ‖ q) is not symmetric: D_KL(p ‖ q) ≠ D_KL(q ‖ p) in general. What does this mean practically about which distribution should be 'p' (the true/reference one) when you compute it?",
              "kind": "write",
              "accept": [
                "the choice of which is p and which is q matters and changes what the divergence penalizes",
                "direction matters, not interchangeable",
                "p should be the reference distribution you're measuring cost of approximating with q"
              ],
              "hint": "think about what each direction of the divergence penalizes most heavily",
              "steps": [
                "D_KL(p ‖ q) heavily penalizes q assigning low probability to outcomes p considers likely, since that costs a large −log₂(near-zero) term weighted by p's probability there.",
                "D_KL(q ‖ p) instead penalizes based on where q itself puts probability mass, weighted differently.",
                "Swapping which distribution is 'p' changes which mismatches get penalized most, so the two directions answer genuinely different questions.",
                "Practically, p should be the distribution you're treating as ground truth or reference (e.g. the true label distribution), and q the one being evaluated or fit against it — getting the direction backwards changes what the number actually measures."
              ],
              "answer": "The two directions penalize different kinds of mismatch, so which distribution plays 'p' isn't arbitrary — p should be the reference or ground-truth distribution (e.g. true labels), with q the one being fit or evaluated, since swapping them changes which errors the divergence weights most heavily."
            },
            {
              "q": "In Huffman coding, why do frequent symbols get short codes and rare symbols get long codes, rather than the reverse?",
              "steps": [
                "The goal of a lossless code is to minimize the average number of bits per symbol across the whole message.",
                "The average is a probability-weighted sum — a symbol's code length matters more, in that average, the more often the symbol occurs.",
                "Making frequent symbols short and rare symbols long minimizes that weighted average, since the large weight (frequency) is paired with the small term (short code).",
                "The reverse assignment would waste bits on the symbols that appear most often, inflating the average — exactly backwards from the entropy-minimizing goal."
              ],
              "answer": "Because average code length is a frequency-weighted sum, and that sum is minimized by pairing high frequency with short codes (and low frequency with long codes) — putting long codes on frequent symbols would inflate the average exactly where it's weighted most heavily."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Self-information",
          "The surprise of one event, −log₂(p) bits for an event of probability p."
        ],
        [
          "Entropy",
          "The probability-weighted average self-information of a whole distribution; expected surprise."
        ],
        [
          "Cross-entropy",
          "The average bit-cost of encoding outcomes from true distribution p using distribution q instead."
        ],
        [
          "KL divergence",
          "H(p, q) − H(p): the extra cost specifically attributable to using q instead of p."
        ],
        [
          "Gibbs' inequality",
          "The fact that KL divergence is always ≥ 0, with equality only when p = q."
        ],
        [
          "Mutual information",
          "How much knowing one variable reduces uncertainty about another; symmetric, unlike KL divergence."
        ],
        [
          "Source coding theorem",
          "Shannon's result that entropy is a hard lower bound on average lossless code length."
        ],
        [
          "Huffman coding",
          "A near-optimal prefix code assigning shorter codes to more frequent symbols."
        ],
        [
          "Arithmetic coding",
          "A compression scheme approaching the entropy bound more closely than Huffman coding."
        ],
        [
          "Cross-entropy loss",
          "A classifier's training loss; cross-entropy between predicted and true label distributions."
        ],
        [
          "Bit (information)",
          "A unit of surprise/information, distinct from a stored binary digit of the same name."
        ],
        [
          "Uniform distribution entropy",
          "log₂(k) for k equally-likely outcomes — the maximum possible entropy for k outcomes."
        ]
      ]
    }
});
