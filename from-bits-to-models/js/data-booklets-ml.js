Object.assign(BOOKLETS, {
  "graddesc": {
      "title": "Gradient Descent",
      "blurb": "Follow the slope of a loss function downhill, one small step at a time — a strikingly simple update rule that, in one variant or another, is the optimization loop underneath essentially all of modern machine learning.",
      "chapters": [
        {
          "title": "Following the slope: the update rule",
          "blocks": [
            {
              "t": "p",
              "x": "The optimization booklet establishes that minimizing a differentiable function means finding where its gradient is zero. Gradient descent turns that into an iterative procedure when solving directly is infeasible (as it always is for a model with millions of parameters): compute the gradient of a <strong>loss function</strong> at the current parameters, then take a small step in the direction opposite the gradient — because the gradient points in the direction of steepest increase, stepping opposite it points toward decrease."
            },
            {
              "t": "p",
              "x": "The update rule is θ ← θ − η·∇L(θ): subtract the gradient of the loss L with respect to parameters θ, scaled by a small positive number η, the <strong>learning rate</strong>. Repeat this update many times, and — under reasonable conditions on L and η — the parameters converge toward a point where the gradient is near zero, i.e. a minimum (or at least a place the loss stops improving in every direction the gradient can see, which is where saddle points and local minima both become concerns)."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"20\" font-size=\"12.5\" fill=\"#666D72\">Descending a 1D loss curve, one gradient step at a time</text>\n<path d=\"M60,60 Q250,190 350,190 Q450,190 640,50\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"2\"/>\n<circle cx=\"140\" cy=\"122\" r=\"5\" fill=\"#EDEFF0\"/><text x=\"148\" y=\"118\" font-size=\"10\" fill=\"#9AA1A6\">start</text>\n<circle cx=\"220\" cy=\"168\" r=\"5\" fill=\"#9AA1A6\"/>\n<circle cx=\"290\" cy=\"186\" r=\"5\" fill=\"#9AA1A6\"/>\n<circle cx=\"350\" cy=\"190\" r=\"6\" fill=\"#EDEFF0\"/><text x=\"358\" y=\"186\" font-size=\"10\" fill=\"#EDEFF0\">minimum</text>\n<line x1=\"140\" y1=\"122\" x2=\"220\" y2=\"168\" stroke=\"#666D72\" stroke-dasharray=\"2 3\"/><line x1=\"220\" y1=\"168\" x2=\"290\" y2=\"186\" stroke=\"#666D72\" stroke-dasharray=\"2 3\"/>\n<text x=\"30\" y=\"210\" font-size=\"12\" fill=\"#666D72\">Each step's size is proportional to the local slope — steps shrink automatically as the curve flattens near the minimum.</text>\n</svg>",
              "cap": "The gradient's magnitude naturally shrinks the closer parameters get to a minimum, since the curve flattens there — steps get smaller on their own even at a fixed learning rate."
            }
          ]
        },
        {
          "title": "Learning rate: too small, too large, just right",
          "blocks": [
            {
              "t": "p",
              "x": "The learning rate η is the single most consequential hyperparameter in this whole procedure. Too small, and convergence is correct but glacially slow — thousands of tiny steps to travel a distance a few larger steps could cover. Too large, and steps overshoot the minimum entirely; instead of settling in, the loss can oscillate back and forth across the valley, or diverge outright, with the loss increasing step after step rather than decreasing."
            },
            {
              "t": "p",
              "x": "There's no universal correct value — it depends on the curvature of the loss surface, which varies across a training run and across different parameters. In practice, a <strong>learning rate schedule</strong> (starting larger and shrinking it over training, e.g. by a fixed decay factor every N steps, or with a cosine schedule) is standard: large steps make fast early progress when far from any minimum, and small steps make fine adjustments once nearby."
            },
            {
              "t": "worked",
              "q": "A loss curve oscillates wildly between two values across successive gradient steps, without ever settling down or clearly diverging further. What's the most likely cause, and the standard first fix to try?",
              "steps": [
                "Wild oscillation between similar values, without progressive worsening, is the signature of a learning rate that's too large for the local curvature: each step overshoots past the minimum to roughly the opposite side of the valley.",
                "If the learning rate were far too large, you'd typically see the loss trend upward over time (divergence), not settle into a bounded oscillation — so this is 'too large' rather than 'catastrophically too large'.",
                "The standard first fix is simply reducing the learning rate, often by a factor of 2-10x, and re-running to see if the oscillation resolves into steady decrease.",
                "If reducing it fixes the oscillation but training becomes too slow, a learning rate schedule (start larger, decay over time) often recovers both fast early progress and stable late-stage convergence."
              ],
              "answer": "A learning rate too large for the local curvature — each step overshoots the minimum onto roughly the opposite side of the valley. The standard fix is to reduce the learning rate (or apply a decay schedule so it shrinks over training)."
            }
          ]
        },
        {
          "title": "Batch, stochastic, and mini-batch variants",
          "blocks": [
            {
              "t": "p",
              "x": "The gradient of a loss defined as an average over a training set is itself an average of per-example gradients. <strong>Batch gradient descent</strong> computes this exactly, using every training example before taking a single step — accurate, but expensive per step, and wasteful when many examples give very similar gradient information."
            },
            {
              "t": "p",
              "x": "<strong>Stochastic gradient descent (SGD)</strong> takes the opposite extreme: estimate the gradient from a single randomly chosen example, and step immediately. Each step is noisy — a single example's gradient is a poor estimate of the true average — but steps are far cheaper, and the noise itself sometimes helps escape shallow local minima or saddle points that a smoother, exact gradient would settle into."
            },
            {
              "t": "p",
              "x": "<strong>Mini-batch gradient descent</strong> is the practical middle ground nearly everyone actually uses: estimate the gradient from a small batch (commonly 32 to a few thousand examples), balancing the accuracy of a larger sample against the speed of frequent updates, and — importantly on modern hardware — batching lets the per-example computations run in parallel on a GPU (see the gpu booklet), which single-example SGD can't exploit nearly as well."
            },
            {
              "t": "list",
              "items": [
                "<strong>Batch GD</strong>: exact gradient, one step per full pass over the data — slow per step, low variance.",
                "<strong>SGD</strong>: one example per step — fast, high variance, cheap to compute.",
                "<strong>Mini-batch GD</strong>: a small batch per step — the practical default, tunable via batch size."
              ]
            }
          ]
        },
        {
          "title": "Momentum and adaptive methods",
          "blocks": [
            {
              "t": "p",
              "x": "Plain gradient descent treats every step independently, which is wasteful in a loss surface shaped like a narrow valley: it oscillates across the narrow direction while making frustratingly slow progress along the valley's long axis. <strong>Momentum</strong> fixes this by accumulating a running average of recent gradients (an exponentially weighted moving average) and stepping in that averaged direction instead of the raw current gradient — oscillations across the narrow axis cancel out in the average, while consistent movement along the valley's axis reinforces itself and speeds up, much like a ball rolling downhill picking up speed."
            },
            {
              "t": "p",
              "x": "<strong>RMSProp</strong> and <strong>Adam</strong> add a second idea on top: track a running average of the <em>squared</em> gradient for each parameter individually, and divide each parameter's step by (roughly) the square root of that average. This gives each parameter its own effective learning rate — parameters with consistently large gradients get their steps shrunk, parameters with small or infrequent gradients get theirs amplified — which matters enormously in models where different parameters see very different gradient magnitudes and frequencies. Adam combines this per-parameter scaling with momentum, and is the most commonly used optimizer for training neural networks in practice, covered further in the nn and backprop booklets."
            },
            {
              "t": "note",
              "x": "None of these change what a gradient descent step fundamentally is — a step opposite the (estimated) gradient. They change how the step's direction and size are computed from the raw gradient, trading a small amount of extra bookkeeping per parameter for often dramatically faster, more stable convergence."
            }
          ]
        },
        {
          "title": "Reading a loss curve",
          "blocks": [
            {
              "t": "p",
              "x": "A loss curve — loss value plotted against training step — is the single most informative diagnostic in an optimization run, and a few shapes are worth recognizing on sight. A smoothly decreasing curve that flattens is healthy convergence. A curve that decreases then suddenly spikes upward, possibly repeatedly, usually indicates a learning rate that's too large or an unstable batch (an outlier or a numerical issue like exploding gradients, covered in the backprop booklet). A curve that's flat from the start, or that plateaus early well above where similar problems normally settle, often means the learning rate is too small, initialization is poor, or the model has genuinely run out of capacity to fit further."
            },
            {
              "t": "p",
              "x": "A <strong>plateau</strong> partway through training — loss stalls for many steps, then resumes decreasing — is often just a flat or saddle-point-heavy region of the loss surface that the optimizer eventually escapes, especially with momentum helping push through; it isn't necessarily a bug. Distinguishing a genuine plateau from actual convergence or divergence usually means letting training run longer and watching what happens next, since all three can look identical for a short window."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These focus on diagnosing training behavior from a described symptom, which is the skill that matters day to day far more than deriving the update rule itself."
            }
          ],
          "exercises": [
            {
              "q": "Which direction does a single gradient descent step move the parameters, and why?",
              "kind": "mc",
              "options": [
                "Opposite the gradient, because the gradient points toward steepest increase",
                "Along the gradient, because the gradient points toward the minimum directly",
                "Perpendicular to the gradient, to explore the loss surface",
                "Toward the origin, regardless of the gradient's direction"
              ],
              "correct": 0,
              "steps": [
                "The gradient of a function at a point is, by definition, the direction of steepest increase of that function.",
                "To decrease the loss, you want to move in the opposite direction — steepest decrease.",
                "That's exactly what θ ← θ − η∇L(θ) does: it subtracts the gradient, i.e. steps opposite it.",
                "The gradient does not point 'at' the minimum in general — only opposite its own direction of steepest local increase, which is a purely local, not global, piece of information."
              ],
              "answer": "Opposite the gradient — the gradient points toward steepest increase of the loss at the current point, so subtracting it (stepping in the opposite direction) is the direction of steepest local decrease."
            },
            {
              "q": "Training loss decreases steadily for many steps, then spikes sharply upward for a few steps before resuming its decrease. What's the most likely explanation, and is this necessarily a bug?",
              "kind": "write",
              "accept": [
                "an outlier batch or momentary instability, often not a bug if it recovers",
                "a bad batch or numerical instability causing a temporary spike, usually fine if training recovers"
              ],
              "hint": "think about what a single unusual mini-batch, rather than a systemic learning-rate problem, could do to a loss curve",
              "steps": [
                "A brief spike followed by recovery is different from sustained divergence (which trends upward and stays there) or sustained oscillation (which repeats regularly).",
                "A single unusual mini-batch — an outlier example, or a batch that happens to produce a much larger-than-typical gradient — can push a step momentarily in a bad direction.",
                "If the learning rate and overall setup are otherwise sound, subsequent steps on more typical batches correct course and the loss resumes decreasing.",
                "So a brief, non-recurring spike that resolves on its own is usually not a bug requiring intervention; a spike that repeats, grows, or never recovers is a different and more serious signal (learning rate too high, or a genuine numerical instability)."
              ],
              "answer": "Most likely a single unusual or outlier mini-batch producing a temporarily large gradient — not necessarily a bug, since if the setup is otherwise sound, later steps on typical batches correct course. A spike that recurs, grows, or never recovers is the more serious signal, usually pointing to too-high a learning rate."
            },
            {
              "q": "Why does mini-batch gradient descent, rather than pure batch or pure stochastic gradient descent, dominate in practice on modern hardware?",
              "kind": "write",
              "accept": [
                "it balances gradient estimate accuracy against speed, and batches parallelize well on gpus",
                "middle ground between accuracy and speed, plus gpu parallelism benefits from batching"
              ],
              "hint": "think about both statistical accuracy of the gradient estimate and what runs efficiently on a GPU",
              "steps": [
                "Batch GD gives the most accurate gradient estimate but requires a full pass over the data per step, making each step very expensive.",
                "Pure SGD is cheap per step but its single-example gradient estimate is very noisy, requiring many more steps to converge reliably.",
                "Mini-batches give a much better gradient estimate than a single example while still being far cheaper than a full pass — a practical middle ground on the accuracy-versus-speed trade-off.",
                "Separately, computing a batch of examples' forward and backward passes in parallel is exactly what GPU hardware is built for, so mini-batches also get a large practical speed multiplier that single-example SGD can't exploit as well."
              ],
              "answer": "It's a practical middle ground: mini-batches give a much better gradient estimate than a single example while remaining far cheaper than a full-dataset pass, and — separately — batching lets the per-example computation run in parallel on a GPU, a speed advantage single-example SGD can't exploit nearly as well."
            },
            {
              "q": "How does momentum help gradient descent make faster progress through a narrow valley-shaped loss surface?",
              "kind": "mc",
              "options": [
                "It averages recent gradients, canceling oscillation across the valley while reinforcing consistent movement along it",
                "It increases the learning rate automatically whenever the loss decreases",
                "It replaces the gradient with a random direction to escape narrow valleys",
                "It only affects the very first few steps of training"
              ],
              "correct": 0,
              "steps": [
                "In a narrow valley, the raw gradient at each step points mostly across the narrow direction (steep) and only slightly along the valley's long axis (shallow).",
                "Averaging gradients over recent steps causes the components that alternate in sign step to step (the oscillating, across-valley part) to cancel out.",
                "Meanwhile, the component that's consistently in the same direction step after step (the along-valley part) reinforces itself in the average and grows.",
                "The net effect is a step that cancels wasted oscillation and speeds up along the direction that's actually making progress — not a change to the learning rate itself or a random perturbation."
              ],
              "answer": "Momentum averages recent gradients: the oscillating across-valley components alternate in sign and cancel out in the average, while the consistent along-valley component reinforces itself and grows — producing faster, more direct progress along the valley."
            },
            {
              "q": "A loss curve is completely flat from the very first training step onward. Name two plausible causes.",
              "kind": "write",
              "accept": [
                "learning rate too small; poor initialization",
                "learning rate way too small or bad initialization causing near-zero gradients"
              ],
              "hint": "think about what would make every single step's effective change in the parameters nearly zero",
              "steps": [
                "If the learning rate is far too small, each step's parameter change (η times the gradient) is negligible, so the loss barely moves even over many steps.",
                "Poor initialization can also cause this — for instance initializing all weights identically or in a way that produces near-zero gradients from the very first forward/backward pass (a concern covered further in the nn and backprop booklets), so there's almost nothing for gradient descent to act on.",
                "Both causes produce the same visible symptom: a loss curve that looks flat from step one, rather than decreasing-then-flattening (healthy convergence) or flat only after starting from a much higher value.",
                "Distinguishing between them usually means checking the actual gradient magnitudes directly, rather than relying on the loss curve's shape alone."
              ],
              "answer": "A learning rate set far too small (each step's change is negligible), or poor initialization producing near-zero gradients from the start — both produce the same visible symptom of a loss that looks flat from step one rather than decreasing and then flattening."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Loss function",
          "The function measuring how wrong the model's current predictions are, being minimized."
        ],
        [
          "Learning rate",
          "The scale factor (η) applied to the gradient in each update step."
        ],
        [
          "Gradient descent",
          "Iteratively stepping opposite the gradient of the loss to decrease it."
        ],
        [
          "Local minimum",
          "A point where loss is lower than all nearby points, but not necessarily globally lowest."
        ],
        [
          "Saddle point",
          "A point with zero gradient that is a minimum along some directions and a maximum along others."
        ],
        [
          "Batch gradient descent",
          "Computing the exact gradient using the entire training set per step."
        ],
        [
          "Stochastic gradient descent (SGD)",
          "Estimating the gradient from a single randomly chosen example per step."
        ],
        [
          "Mini-batch gradient descent",
          "Estimating the gradient from a small batch of examples per step."
        ],
        [
          "Momentum",
          "Accumulating a running average of gradients to smooth and accelerate updates."
        ],
        [
          "RMSProp",
          "An optimizer scaling each parameter's step by a running average of its squared gradient."
        ],
        [
          "Adam",
          "An optimizer combining momentum with per-parameter gradient-magnitude scaling."
        ],
        [
          "Learning rate schedule",
          "A plan for shrinking (or otherwise varying) the learning rate over training."
        ],
        [
          "Convergence",
          "The point at which further steps stop meaningfully decreasing the loss."
        ],
        [
          "Divergence",
          "Loss increasing over successive steps instead of decreasing."
        ],
        [
          "Plateau",
          "A stretch of training where loss temporarily stalls before resuming its decrease."
        ]
      ]
    },
  "datawrangle": {
    "title": "Working with data",
    "blurb": "Loading, cleaning, reshaping and splitting data before any model sees it — where most of a real project's time actually goes, and where most of its avoidable mistakes happen.",
    "chapters": [
      {
        "title": "Loading and looking",
        "blocks": [
          {
            "t": "p",
            "x": "Before any modelling decision, the first job is simply looking: what are the columns, what type is each one (a number, a category, free text, a timestamp), how many rows are there, and does any of it look wrong on sight. A surprising share of real data problems — a swapped column, a unit mismatch, a date stored as text — are visible the moment someone actually looks at the first twenty rows and a summary of each column, and invisible if a model is trained straight from a file path without that step."
          },
          {
            "t": "p",
            "x": "Tabular data arrives in many shapes — CSV, a database export, Parquet, JSON records — and the arrays booklet's contiguous, homogeneous layout is the implicit target: a rectangular table where each column has one consistent type is what every downstream tool assumes, even when the source data does not yet honour that."
          },
          {
            "t": "note",
            "x": "Schema drift — a column silently changing type or meaning between one data pull and the next, an upstream system renaming a field, a category that used to be spelled consistently starting to vary — is a leading cause of quietly broken pipelines. Checking that today's data matches the shape you expect, before processing it, catches this at the door instead of three steps downstream."
          }
        ]
      },
      {
        "title": "Cleaning: missing values, duplicates, outliers",
        "blocks": [
          {
            "t": "p",
            "x": "Missing values need a decision, not a default. Dropping every row with any missing field is simple but can silently discard a large, non-random slice of the data — if the values are missing because of what they would have been (a sensor that fails specifically under extreme readings), dropping them biases what remains. Imputing — filling with the column's mean, median, or most common category, or a value predicted from other columns — keeps the row but manufactures a value that was never observed, which needs to be done thoughtfully and consistently between training and later use."
          },
          {
            "t": "p",
            "x": "Duplicate rows inflate whatever they duplicate: a metric computed on the data, or a model's confidence in a pattern that is really just one event counted five times. Outliers need the same judgement calls as missing values — a value three standard deviations out, or outside 1.5× the interquartile range beyond the nearest quartile, might be a data-entry error worth removing, or might be the genuinely rare case the whole project cares about."
          },
          {
            "t": "worked",
            "q": "A column of household incomes has a maximum value 200× the median, with every other value clustered normally. Before deciding whether to remove that one row, what should you check first?",
            "steps": [
              "A statistical outlier test alone can't distinguish an error from a real extreme case — it only flags that the value is unusual.",
              "Check whether the value is even physically plausible for the field — a household income of $2 billion is almost certainly a data-entry or unit error (dollars entered as cents, say).",
              "Check whether similar extreme-but-plausible values exist elsewhere in comparable data, which would suggest it's real rather than an artefact.",
              "Only after ruling out an entry or unit error does removing (or capping) the value as a genuine outlier become the right call, rather than the first move."
            ],
            "answer": "Investigate whether the value is plausible before removing it — a single obviously-impossible value is very likely an error worth fixing or dropping, while a real extreme case is exactly the kind of row some analyses most need to keep."
          }
        ]
      },
      {
        "title": "Reshaping and joining",
        "blocks": [
          {
            "t": "p",
            "x": "Data rarely arrives in the shape a specific analysis needs. Wide format keeps one row per entity with a separate column per measurement (one row per customer, a column per month's spend); long format keeps one row per observation with columns naming what is being measured (customer, month, spend). Pivoting converts long to wide; melting converts wide to long — which direction is needed depends entirely on what comes next, since some operations (plotting a time series per group, certain joins) want long, and others (a correlation matrix across months) want wide."
          },
          {
            "t": "p",
            "x": "Joining two tables on a shared key is one of the most common operations and one of the easiest to get quietly wrong. An inner join keeps only rows whose key exists in both tables; a left join keeps every row of the left table, filling in nulls where the right table has no match; the cardinality of the relationship — one-to-one, one-to-many, many-to-many — decides whether the joined result has the same row count as the input or noticeably more."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">orders (3 rows) joined to order_items (one-to-many) on order_id</text>\n<rect x=\"40\" y=\"50\" width=\"150\" height=\"36\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"115\" y=\"73\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">order #101</text>\n<rect x=\"40\" y=\"96\" width=\"150\" height=\"36\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"115\" y=\"119\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">order #102</text>\n<rect x=\"40\" y=\"142\" width=\"150\" height=\"36\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"115\" y=\"165\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">order #103</text>\n<path d=\"M190 68 L280 42 M190 68 L280 72 M190 68 L280 102\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" fill=\"none\"/>\n<path d=\"M190 114 L280 132 M190 114 L280 162\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" fill=\"none\"/>\n<path d=\"M190 160 L280 192\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" fill=\"none\"/>\n<g fill=\"#0E1113\" stroke=\"#2E3438\">\n<rect x=\"280\" y=\"28\" width=\"110\" height=\"28\"/><rect x=\"280\" y=\"58\" width=\"110\" height=\"28\"/><rect x=\"280\" y=\"88\" width=\"110\" height=\"28\"/>\n<rect x=\"280\" y=\"118\" width=\"110\" height=\"28\"/><rect x=\"280\" y=\"148\" width=\"110\" height=\"28\"/><rect x=\"280\" y=\"178\" width=\"110\" height=\"28\"/>\n</g>\n<text x=\"335\" y=\"46\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">item</text><text x=\"335\" y=\"76\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">item</text><text x=\"335\" y=\"106\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">item</text>\n<text x=\"335\" y=\"136\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">item</text><text x=\"335\" y=\"166\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">item</text><text x=\"335\" y=\"196\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">item</text>\n<text x=\"430\" y=\"90\" font-size=\"13\" fill=\"#EDEFF0\">3 orders (3 + 2 + 1 items)</text>\n<text x=\"430\" y=\"112\" font-size=\"13\" fill=\"#EDEFF0\">→ 6 order-item rows. Code</text>\n<text x=\"430\" y=\"134\" font-size=\"13\" fill=\"#EDEFF0\">assuming \"one row per order</text>\n<text x=\"430\" y=\"156\" font-size=\"13\" fill=\"#EDEFF0\">after the join\" is wrong.</text>\n</svg>",
            "cap": "A one-to-many join fans each order out to one row per item it contains — three orders with 3, 2, and 1 items become six order-item rows. Summing a column after this join without first aggregating per order double- or triple-counts anything that was already at the order level, like a flat shipping fee."
          }
        ]
      },
      {
        "title": "Splitting data correctly",
        "blocks": [
          {
            "t": "p",
            "x": "A model needs to be evaluated on data it did not learn from, which is the entire reason for splitting into train, validation, and test sets — train to fit the model, validation to tune choices like which model or which settings, test held back untouched until the very end to report a number that means something. The evaluation booklet covers what happens after this split; this chapter is about not corrupting the split itself before that stage even begins."
          },
          {
            "t": "p",
            "x": "Stratified splitting preserves the proportion of each class (or bucket of a continuous target) across train, validation, and test, which matters most when classes are imbalanced — a plain random split of a dataset that is 2% fraud can easily leave the tiny test set with far too few positive examples to evaluate anything reliably."
          },
          {
            "t": "note",
            "x": "For data with a time dimension, the split itself needs to respect time, not just proportions — covered next, since it interacts directly with leakage rather than being a separate concern."
          }
        ]
      },
      {
        "title": "Leakage",
        "blocks": [
          {
            "t": "p",
            "x": "Leakage is information that would not be available at real prediction time sneaking into training anyway — through a feature, through the order operations happen in, or through the split itself — and it is the single most consequential mistake in this entire chapter, because a model trained with leakage looks like it works during development and then fails, sometimes catastrophically, the moment it meets genuinely new data."
          },
          {
            "t": "p",
            "x": "Target leakage is a feature that is a disguised proxy for the label, only available because of the very event being predicted — a 'was contacted by collections' field when predicting loan default, say, which is often only populated after a default has already begun. Pipeline leakage is subtler: computing a statistic (a mean, a scaler's parameters, an encoding) across the full dataset before splitting, so the test set's own values quietly influenced something the training process used."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 660 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"330\" y=\"24\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">fitting a scaler: wrong order vs. right order</text>\n<rect x=\"30\" y=\"46\" width=\"280\" height=\"200\" rx=\"6\" fill=\"none\" stroke=\"#2E3438\"/>\n<text x=\"45\" y=\"66\" font-size=\"12\" fill=\"#9AA1A6\">wrong: scale, then split</text>\n<rect x=\"50\" y=\"82\" width=\"240\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"170\" y=\"104\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">fit scaler on all 1000 rows</text>\n<line x1=\"170\" y1=\"116\" x2=\"170\" y2=\"134\" stroke=\"#9AA1A6\"/>\n<rect x=\"50\" y=\"134\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"105\" y=\"156\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">train (800)</text>\n<rect x=\"180\" y=\"134\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"235\" y=\"156\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">test (200)</text>\n<text x=\"50\" y=\"196\" font-size=\"12\" fill=\"#EDEFF0\">Test rows' own values shaped the</text>\n<text x=\"50\" y=\"216\" font-size=\"12\" fill=\"#EDEFF0\">mean/std used to scale everything —</text>\n<text x=\"50\" y=\"236\" font-size=\"12\" fill=\"#EDEFF0\">the split is no longer clean.</text>\n<rect x=\"350\" y=\"46\" width=\"280\" height=\"200\" rx=\"6\" fill=\"none\" stroke=\"#2E3438\"/>\n<text x=\"365\" y=\"66\" font-size=\"12\" fill=\"#9AA1A6\">right: split, then scale</text>\n<rect x=\"370\" y=\"82\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"425\" y=\"104\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">train (800)</text>\n<rect x=\"500\" y=\"82\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"555\" y=\"104\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">test (200)</text>\n<line x1=\"425\" y1=\"116\" x2=\"425\" y2=\"134\" stroke=\"#9AA1A6\"/>\n<rect x=\"370\" y=\"134\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"425\" y=\"156\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">fit scaler here</text>\n<path d=\"M480 151 C 520 151, 520 99, 500 99\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/><path d=\"M506 94 L500 99 L505 105\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<text x=\"370\" y=\"196\" font-size=\"12\" fill=\"#EDEFF0\">Test rows only ever get</text>\n<text x=\"370\" y=\"216\" font-size=\"12\" fill=\"#EDEFF0\">transformed — never seen by</text>\n<text x=\"370\" y=\"236\" font-size=\"12\" fill=\"#EDEFF0\">the fitting step itself.</text>\n</svg>",
            "cap": "The scaler's mean and standard deviation must come from the training rows only. Fitting it on the full dataset before splitting leaks the test set's own distribution into a step the model's evaluation is supposed to be blind to."
          },
          {
            "t": "p",
            "x": "Temporal leakage (look-ahead bias) is the time-series version of the same mistake: a random shuffle split can put a row from next month into training and a row from last month into test, letting the model implicitly learn from the future to predict the past. The fix is a split that respects time — train on everything before a cutoff, test on everything after it — so the evaluation actually measures what deploying the model would face: predicting forward, never backward."
          }
        ]
      },
      {
        "title": "Scaling and encoding",
        "blocks": [
          {
            "t": "p",
            "x": "Standardisation rescales a numeric feature to zero mean and unit variance, using the mean and standard deviation computed from the training set alone — the same fit-on-train, transform-everywhere discipline as the leakage chapter above, and for the same reason. Categorical features need their own translation into numbers: one-hot encoding creates a binary column per category, ordinal encoding assigns an integer when categories have a real order, and target encoding replaces a category with a statistic of the label within that category — which is powerful and also one of the easiest ways to reintroduce leakage if it is computed without care."
          },
          {
            "t": "p",
            "x": "An encoder fit only on the training set will, by construction, sometimes meet a category in test or in production that it never saw during fitting. The standard handling is an explicit 'unknown' bucket rather than an error: a fitted encoder should have a defined behaviour for an unseen category, decided in advance, rather than crashing the pipeline the first time real-world data does not match the training set exactly."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "The leakage questions are the ones with real consequences — a model that looks great in development because of leakage is often discovered only after it is already deployed and quietly failing."
          }
        ],
        "exercises": [
          {
            "q": "A dataset has 1,000 rows. The mean and standard deviation of a feature are computed across all 1,000 rows and used to standardise it, and only afterward is the data split into 800 train / 200 test. What exactly went wrong, and what should have happened instead?",
            "steps": [
              "The scaler's mean and std were computed using the 200 test rows in addition to the 800 train rows.",
              "That means the test set's own distribution influenced a transformation applied to the training data.",
              "The test set no longer purely measures how the model generalises to genuinely unseen data — it partially measures data it indirectly informed.",
              "The fix: split first into train and test, fit the scaler on the 800 train rows only, then apply that same fitted transform to the 200 test rows without refitting anything on them."
            ],
            "answer": "This is pipeline leakage — the test set's values leaked into a step (scaling) that the training process used, ahead of the split. Always split first, fit any statistic-derived transform on the training rows alone, and only ever transform (never refit) the test rows."
          },
          {
            "q": "Which of these is the clearest example of target leakage?",
            "kind": "mc",
            "options": [
              "A feature recording the date collections first contacted the customer, used to predict loan default, where that field is only ever populated after a default process has already begun",
              "A feature recording the customer's account age in months",
              "A feature recording the requested loan amount",
              "Standardising all numeric features before fitting a model"
            ],
            "correct": 0,
            "steps": [
              "Target leakage means a feature is only knowable because the outcome being predicted has already, in effect, happened.",
              "'Contacted by collections' is a direct downstream consequence of a default process starting — it doesn't predict default, it announces it.",
              "Account age and loan amount are both known at the time a real prediction would be made, before any outcome is known.",
              "Standardising features is a scaling choice, not a leakage issue by itself (though where it is fit can become one, per the leakage chapter)."
            ],
            "answer": "The collections-contact feature — it is only recorded because the very outcome being predicted has already started, making it a proxy for the label rather than a genuine predictor."
          },
          {
            "q": "For a time series forecasting problem, why is a random (shuffled) train/test split usually the wrong choice?",
            "kind": "mc",
            "options": [
              "It can place future rows in training and past rows in test, letting the model implicitly learn from information that would not exist yet at real prediction time",
              "Random splits always produce class imbalance",
              "Time series data technically cannot be split into train and test at all",
              "It makes training too slow"
            ],
            "correct": 0,
            "steps": [
              "A model deployed for forecasting only ever has access to the past when predicting the future.",
              "A random shuffle split ignores row order and can place a 'future' row in training.",
              "The model can then pick up on patterns that only exist because it indirectly saw what came after the point it's meant to predict.",
              "A split that keeps all of train strictly before all of test in time matches what deployment will actually look like."
            ],
            "answer": "A random split can leak future information into training, which a time-respecting split (train on the past, test on the future) avoids by construction."
          },
          {
            "q": "What is the general term for any situation where information that would not be available at real prediction time ends up influencing a trained model — whether through a feature, the modelling pipeline, or the split itself?",
            "kind": "write",
            "accept": [
              "leakage",
              "data leakage"
            ],
            "hint": "the theme of this whole chapter",
            "steps": [
              "Target leakage, pipeline leakage, and temporal leakage are all specific instances of one broader problem.",
              "In every case, information from outside what would genuinely be available at prediction time reaches the model.",
              "That broader problem has one name.",
              "It is the single most consequential mistake covered in this booklet, because it makes a model look good in development and fail in reality."
            ],
            "answer": "Leakage (data leakage) — the umbrella term for target leakage, pipeline leakage, and temporal leakage alike."
          },
          {
            "q": "A categorical encoder is fit only on the training set's values for a 'user_id'-like column. At prediction time in production, a request arrives with a user ID the encoder never saw during fitting. Name one problem this creates, and the standard way pipelines handle it.",
            "kind": "write",
            "accept": [
              "unseen category",
              "unknown category",
              "crashes on unseen value",
              "needs an unknown bucket",
              "fallback for unseen categories"
            ],
            "hint": "what happens when the encoder is asked about a value it has no mapping for",
            "steps": [
              "An encoder fit on training data only has mappings for the categories it observed there.",
              "A category appearing for the first time in production has no defined encoding.",
              "Without explicit handling, this either crashes the pipeline or silently produces an undefined value.",
              "The standard fix is a designated 'unknown' bucket (or a fallback value) decided in advance, so an unseen category degrades gracefully instead of breaking."
            ],
            "answer": "The encoder has no mapping for an unseen category, which can crash or silently corrupt the pipeline; the standard handling is a predefined 'unknown' bucket rather than assuming every future value was already seen in training."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Schema",
        "The expected columns, types, and structure of a dataset."
      ],
      [
        "Schema drift",
        "A dataset's actual structure changing from what a pipeline expects."
      ],
      [
        "Imputation",
        "Filling in a missing value with an estimate rather than dropping the row."
      ],
      [
        "Interquartile range (IQR)",
        "The span between a dataset's first and third quartiles, used to flag outliers."
      ],
      [
        "Wide format",
        "One row per entity, with a separate column per measurement."
      ],
      [
        "Long format",
        "One row per observation, with columns naming what is being measured."
      ],
      [
        "Pivot",
        "Reshaping data from long format to wide format."
      ],
      [
        "Melt",
        "Reshaping data from wide format to long format."
      ],
      [
        "Join cardinality",
        "Whether a join relationship is one-to-one, one-to-many, or many-to-many."
      ],
      [
        "Stratified split",
        "A split that preserves each class's proportion across train, validation, and test."
      ],
      [
        "Data leakage",
        "Information unavailable at real prediction time influencing a trained model."
      ],
      [
        "Target leakage",
        "A feature that is effectively a disguised proxy for the label itself."
      ],
      [
        "Temporal leakage (look-ahead bias)",
        "Future information reaching a model through an improperly time-respecting split."
      ],
      [
        "Standardisation",
        "Rescaling a numeric feature to zero mean and unit variance."
      ],
      [
        "One-hot encoding",
        "Representing a category as a binary column per possible value."
      ],
      [
        "Target encoding",
        "Replacing a category with a statistic of the label within that category."
      ],
      [
        "Unseen category",
        "A categorical value encountered at prediction time that was absent during fitting."
      ]
    ]
  },
  "supervised": {
      "title": "Supervised Learning",
      "blurb": "Learning a mapping from inputs to labels — the branch of machine learning where you already have the answers for some examples and want a function that generalizes to new ones.",
      "chapters": [
        {
          "title": "Regression and classification: two flavors of one problem",
          "blocks": [
            {
              "t": "p",
              "x": "Supervised learning starts from a dataset of (input, label) pairs and looks for a function that predicts the label from the input well enough to generalize to inputs it hasn't seen. The label's type splits the field into two families that reuse most of the same machinery. Regression predicts a continuous number — a house price, a temperature, tomorrow's demand. Classification predicts a category from a fixed set — spam or not spam, which of ten digits a handwritten image shows."
            },
            {
              "t": "p",
              "x": "“Supervised” names where the correction signal comes from: every training example already carries the answer, so the model can be told exactly how wrong its guess was and nudged toward the right one. This is what separates it from unsupervised learning (no labels at all — the model must find structure on its own) and from reinforcement learning (a delayed reward signal rather than a per-example correct answer)."
            },
            {
              "t": "note",
              "x": "This booklet assumes datawrangle's habits (splitting data before fitting anything, not letting test data leak into training) and linalg/prob's vocabulary (vectors, dot products, distributions). If a split or a distribution feels shaky, those are the right prerequisites to shore up first."
            }
          ]
        },
        {
          "title": "Linear and logistic regression",
          "blocks": [
            {
              "t": "p",
              "x": "Linear regression fits a straight line (or, with more than one input feature, a hyperplane) through the data by choosing the slope and intercept that minimize the total squared error between predictions and actual labels — the least-squares fit. It's the simplest supervised model, and often a genuinely useful baseline before reaching for anything more complex."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"260\" x2=\"620\" y2=\"260\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"60\" y1=\"260\" x2=\"60\" y2=\"40\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"340\" y=\"286\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">square footage (hundreds)</text>\n<text x=\"26\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\" transform=\"rotate(-90 26 150)\">price ($100k)</text>\n<line x1=\"108.6\" y1=\"236.1\" x2=\"571.4\" y2=\"63.9\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<circle cx=\"147.1\" cy=\"221.5\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"224.3\" cy=\"188.5\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"301.4\" cy=\"172.0\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"378.6\" cy=\"129.8\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"455.7\" cy=\"115.2\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"532.9\" cy=\"73.0\" r=\"5\" fill=\"#9BA3A9\"/>\n<text x=\"500\" y=\"95\" font-size=\"12\" fill=\"#EDEFF0\" font-family=\"monospace\">price ≈ 1.57·sqft + 0.5</text>\n</svg>",
              "cap": "Six (square footage, price) points and the least-squares line through them — the slope and intercept that minimize total squared vertical distance from every point to the line. No single point sits exactly on the line; the fit minimizes error in aggregate."
            },
            {
              "t": "p",
              "x": "Logistic regression adapts the same idea to classification: instead of predicting a number directly, it predicts the log-odds of belonging to a class as a linear function of the inputs, then squashes that through the sigmoid function into a probability between 0 and 1. Despite the name, it's a classification algorithm, not a regression one — the “regression” refers to the linear model fitted underneath the squashing function."
            }
          ]
        },
        {
          "title": "Trees, random forests, gradient boosting",
          "blocks": [
            {
              "t": "p",
              "x": "A decision tree predicts by asking a sequence of yes/no questions about the features — “is square footage over 1,500?” then “is it in this neighborhood?” — splitting the data at each question and predicting a fixed value once it reaches a leaf. Trees are easy to read and require no feature scaling, but a single deep tree tends to overfit badly, memorizing noise in the training data as if it were signal."
            },
            {
              "t": "p",
              "x": "Ensembles fix this by combining many trees instead of trusting one. Random forests build many trees independently, each on a random subset of the data and features, and average their predictions — the errors of individual trees tend to be uncorrelated, so averaging cancels much of that noise out while keeping the genuine signal. Gradient boosting builds trees sequentially instead: each new tree is trained specifically to correct the errors the ensemble so far is still making, which tends to reach higher accuracy than random forests at the cost of being more prone to overfitting if left unchecked and more sensitive to its hyperparameters."
            },
            {
              "t": "list",
              "items": [
                "<strong>Bagging</strong> (random forests): train many models independently in parallel on resampled data, then average — reduces variance.",
                "<strong>Boosting</strong> (gradient boosting): train models sequentially, each correcting the previous ensemble's mistakes — reduces bias, at some variance cost.",
                "<strong>Feature importance</strong>: both ensemble types can report which features drove the most reduction in error, a useful diagnostic linear models don't offer as directly."
              ]
            }
          ]
        },
        {
          "title": "Loss functions and regularization",
          "blocks": [
            {
              "t": "p",
              "x": "A loss function scores how wrong a prediction is, and training is the process of adjusting the model to make that score as small as possible on average across the training data. Mean squared error is the standard loss for regression, penalizing large errors disproportionately because the error is squared. Cross-entropy (see infotheory) is the standard loss for classification, penalizing a confident wrong prediction far more harshly than an unconfident one."
            },
            {
              "t": "p",
              "x": "Regularization adds a penalty for model complexity directly into the loss being minimized, trading a little training accuracy for a model that generalizes better. L2 regularization (ridge) penalizes the sum of squared coefficients, shrinking all of them toward zero smoothly. L1 regularization (lasso) penalizes the sum of absolute coefficients, which tends to push some coefficients to exactly zero — effectively selecting features by discarding the ones that don't earn their keep."
            }
          ]
        },
        {
          "title": "The bias-variance trade-off",
          "blocks": [
            {
              "t": "p",
              "x": "Bias is systematic error from a model too simple to capture the real pattern — a straight line trying to fit a genuinely curved relationship will be wrong in the same direction no matter how much data it sees. Variance is error from a model too sensitive to the particular training sample — a model with high variance would produce a noticeably different fit if trained on a different sample drawn from the same distribution, and that sensitivity shows up as overfitting: excellent training performance, worse performance on new data."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"270\" x2=\"610\" y2=\"270\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"60\" y1=\"270\" x2=\"60\" y2=\"40\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"330\" y=\"293\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">model complexity →</text>\n<text x=\"30\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\" transform=\"rotate(-90 30 155)\">error</text>\n<polyline points=\"90,225 170,195 250,170 330,148 410,132 490,120 570,110\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.6\"/>\n<text x=\"575\" y=\"105\" font-size=\"11.5\" fill=\"#9AA1A6\">training error</text>\n<polyline points=\"90,235 170,205 250,178 330,160 410,150 490,165 570,195\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.8\"/>\n<text x=\"575\" y=\"200\" text-anchor=\"end\" font-size=\"11.5\" fill=\"#EDEFF0\">validation error</text>\n<line x1=\"410\" y1=\"40\" x2=\"410\" y2=\"270\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/>\n<text x=\"420\" y=\"55\" font-size=\"11.5\" fill=\"#9AA1A6\">sweet spot</text>\n<text x=\"100\" y=\"55\" font-size=\"11\" fill=\"#666D72\">underfitting</text>\n<text x=\"500\" y=\"55\" font-size=\"11\" fill=\"#666D72\">overfitting</text>\n</svg>",
              "cap": "As model complexity grows, training error keeps falling — a complex enough model can memorize the training set outright. Validation error falls too, at first, then rises again once the model starts fitting noise specific to the training sample rather than the real pattern. The sweet spot is where validation error bottoms out, not where training error does."
            },
            {
              "t": "p",
              "x": "The trade-off is unavoidable in practice: reducing bias (a more flexible model, more features, deeper trees, fewer regularization) tends to increase variance, and vice versa. The right amount of complexity for a given problem is whatever minimizes error on data the model was not trained on — which is exactly why evaluation, covered next in this track, is not optional."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check whether you can read the bias-variance figure correctly and reason about which model family fits a given situation."
            }
          ],
          "exercises": [
            {
              "kind": "mc",
              "q": "In the bias-variance figure, at the dashed “sweet spot” line, which statement is true?",
              "options": [
                "Validation error is at its minimum, even though training error would keep falling further right",
                "Training error is at its minimum",
                "Both curves are at their minimum simultaneously",
                "Validation error is at its maximum"
              ],
              "correct": 0,
              "steps": [
                "The training curve declines everywhere shown and never turns upward — it keeps improving as complexity grows, which is exactly the overfitting risk.",
                "The validation curve declines, bottoms out at the sweet spot, then rises again — that bottom point is its minimum.",
                "The two curves don't share a minimum: training error's minimum (rightmost, most complex) is well past the validation minimum."
              ],
              "answer": "Validation error is at its minimum at the sweet spot; training error is still falling and would keep falling with more complexity, which is precisely why training error alone is a misleading guide to picking model complexity."
            },
            {
              "q": "A single unpruned decision tree gets 99% accuracy on its training data but only 68% on a held-out test set. A random forest of 200 trees on the same data gets 91% training accuracy and 85% test accuracy. Explain the difference using bias and variance.",
              "steps": [
                "The lone tree's huge train-test gap (99% vs 68%) is the signature of high variance: it has fit noise specific to the training sample rather than the general pattern.",
                "The forest's smaller gap (91% vs 85%) and higher test accuracy show variance reduction: averaging many independently-trained, decorrelated trees cancels out much of each individual tree's overfitting.",
                "The forest's slightly lower training accuracy is the cost of that averaging — it's a little less able to perfectly memorize the training set, but that's exactly the trade that improves generalization."
              ],
              "answer": "The single tree has high variance (severe overfitting, shown by its large train-test gap). Averaging many decorrelated trees in a random forest reduces variance at a small cost to training accuracy, producing much better generalization."
            },
            {
              "kind": "write",
              "q": "The regularization method that tends to push some coefficients to exactly zero, effectively performing feature selection, is L___ regularization.",
              "accept": [
                "1",
                "l1",
                "lasso"
              ],
              "hint": "one digit, or the model's common nickname",
              "steps": [
                "L2 (ridge) penalizes squared coefficients, which shrinks everything smoothly toward zero but rarely reaches exactly zero.",
                "L1 (lasso) penalizes absolute coefficients, whose geometry tends to zero out some coefficients entirely rather than just shrinking them.",
                "Zeroing a coefficient out entirely is equivalent to dropping that feature from the model, which is why L1/lasso is used for feature selection."
              ],
              "answer": "L1 (lasso) — its penalty geometry tends to zero out coefficients entirely rather than merely shrinking them."
            },
            {
              "kind": "mc",
              "q": "Which pair correctly matches ensemble strategy to what it primarily reduces?",
              "options": [
                "Bagging (random forests) reduces variance; boosting (gradient boosting) primarily reduces bias",
                "Bagging reduces bias; boosting reduces variance",
                "Both reduce only variance",
                "Both reduce only bias"
              ],
              "correct": 0,
              "steps": [
                "Bagging trains many trees independently on resampled data and averages them — averaging uncorrelated errors is specifically a variance-reduction move.",
                "Boosting trains trees sequentially, each one correcting the ensemble's remaining errors — directly attacking systematic error the ensemble is still making, which is a bias-reduction move.",
                "Boosting's sequential error-correction can increase variance if taken too far (too many rounds), which is why it needs careful tuning."
              ],
              "answer": "Bagging (random forests) primarily reduces variance by averaging independent, decorrelated trees; boosting (gradient boosting) primarily reduces bias by sequentially correcting the ensemble's remaining errors."
            },
            {
              "q": "A model gets 60% accuracy on both the training set and a held-out test set, on a problem where a reasonable model should do much better. Is this a bias problem or a variance problem, and what's a sensible next step?",
              "steps": [
                "A large train-test gap would signal variance (overfitting); here there is essentially no gap, which rules variance out as the dominant issue.",
                "Poor performance on the training data itself, with no gap to test performance, is the signature of high bias — the model is too simple to capture the real pattern, so it's failing on data it has already seen, not just new data.",
                "The fix for high bias is to increase model capacity: more features, a more flexible model family (trees or boosting instead of a plain linear model), or less regularization — the opposite of the fix for high variance."
              ],
              "answer": "This is a bias problem — near-identical (poor) performance on train and test means the model is too simple, not overfit. The fix is more capacity: richer features, a more flexible model, or less regularization."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Regression",
          "Predicting a continuous numeric label."
        ],
        [
          "Classification",
          "Predicting a label from a fixed set of categories."
        ],
        [
          "Least squares",
          "Fitting a line by minimizing the total squared error between predictions and actual labels."
        ],
        [
          "Logistic regression",
          "A classification model that fits a linear function of the inputs, then squashes it into a probability via the sigmoid function."
        ],
        [
          "Decision tree",
          "A model that predicts via a sequence of feature-threshold questions, ending in a leaf prediction."
        ],
        [
          "Random forest",
          "An ensemble of independently-trained trees on resampled data and features, combined by averaging — reduces variance."
        ],
        [
          "Gradient boosting",
          "An ensemble that trains trees sequentially, each correcting the ensemble's remaining errors — reduces bias."
        ],
        [
          "Bagging",
          "Training many models independently on resampled data and averaging their predictions."
        ],
        [
          "Loss function",
          "A function scoring how wrong a prediction is; training minimizes its average over the data."
        ],
        [
          "Mean squared error",
          "The standard regression loss: the average squared difference between predictions and labels."
        ],
        [
          "Cross-entropy",
          "The standard classification loss, penalizing confident wrong predictions more than unconfident ones."
        ],
        [
          "Regularization",
          "A penalty on model complexity added to the loss, trading training accuracy for generalization."
        ],
        [
          "L2 / ridge regularization",
          "A penalty on squared coefficients that shrinks all of them smoothly toward zero."
        ],
        [
          "L1 / lasso regularization",
          "A penalty on absolute coefficients that tends to push some of them to exactly zero."
        ],
        [
          "Bias",
          "Systematic error from a model too simple to capture the real pattern."
        ],
        [
          "Variance",
          "Error from a model too sensitive to the specific training sample, showing up as overfitting."
        ],
        [
          "Overfitting",
          "Fitting noise specific to the training sample in a way that hurts performance on new data."
        ]
      ]
    },
  "unsupervised": {
      "title": "Unsupervised Learning",
      "blurb": "Finding structure in data with no labels to guide you — and the harder discipline of judging whether the structure you found is real.",
      "chapters": [
        {
          "title": "Learning without an answer key",
          "blocks": [
            {
              "t": "p",
              "x": "Supervised learning has a teacher: every training example carries the correct answer, and the model is scored against it directly. Unsupervised learning has no such thing — only inputs, with the task of discovering whatever structure is actually there: groups of similar items, a lower-dimensional shape the data lives on, or regions where data is dense versus sparse. There's no ground truth to check predictions against, which makes both the methods and the evaluation of this chapter genuinely different from supervised's."
            },
            {
              "t": "p",
              "x": "This matters practically because unlabeled data is usually far more abundant than labeled data — nobody has to hand-annotate it — which is why unsupervised techniques often show up as a first pass over raw data: clustering customers before anyone decides what to call the segments, or reducing a dataset's dimensionality before a supervised model ever sees it."
            }
          ]
        },
        {
          "title": "k-means clustering",
          "blocks": [
            {
              "t": "p",
              "x": "k-means partitions data into k groups by alternating two steps until nothing changes: assign each point to whichever of k centroids is currently closest, then move each centroid to the mean position of the points just assigned to it. Both steps only ever decrease the total squared distance from points to their assigned centroid, so the procedure is guaranteed to converge — though not necessarily to the best possible partition, which is why it's typically run several times from different random starting centroids and the best result kept."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 520 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">k=2, converged</text>\n<circle cx=\"80\" cy=\"80\" r=\"6\" fill=\"#9BA3A9\"/>\n<circle cx=\"120\" cy=\"60\" r=\"6\" fill=\"#9BA3A9\"/>\n<circle cx=\"100\" cy=\"110\" r=\"6\" fill=\"#9BA3A9\"/>\n<circle cx=\"300\" cy=\"220\" r=\"6\" fill=\"#EDEFF0\"/>\n<circle cx=\"340\" cy=\"260\" r=\"6\" fill=\"#EDEFF0\"/>\n<circle cx=\"320\" cy=\"200\" r=\"6\" fill=\"#EDEFF0\"/>\n<path d=\"M100,83 l-8,-8 l16,0 z\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"2\"/>\n<circle cx=\"100\" cy=\"83\" r=\"9\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"2\"/>\n<line x1=\"88\" y1=\"83\" x2=\"112\" y2=\"83\" stroke=\"#9BA3A9\" stroke-width=\"2\"/>\n<line x1=\"100\" y1=\"71\" x2=\"100\" y2=\"95\" stroke=\"#9BA3A9\" stroke-width=\"2\"/>\n<text x=\"115\" y=\"40\" font-size=\"11\" fill=\"#9AA1A6\">centroid A (100, 83)</text>\n<circle cx=\"320\" cy=\"227\" r=\"9\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<line x1=\"308\" y1=\"227\" x2=\"332\" y2=\"227\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<line x1=\"320\" y1=\"215\" x2=\"320\" y2=\"239\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"335\" y=\"290\" font-size=\"11\" fill=\"#EDEFF0\">centroid B (320, 227)</text>\n<line x1=\"80\" y1=\"80\" x2=\"100\" y2=\"83\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"120\" y1=\"60\" x2=\"100\" y2=\"83\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"100\" y1=\"110\" x2=\"100\" y2=\"83\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"300\" y1=\"220\" x2=\"320\" y2=\"227\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"340\" y1=\"260\" x2=\"320\" y2=\"227\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"320\" y1=\"200\" x2=\"320\" y2=\"227\" stroke=\"#23282B\" stroke-width=\"1\"/>\n</svg>",
              "cap": "Six points settled into two clusters. Each centroid (the cross-marked circle) sits at the mean of its three assigned points — centroid A at (100, 83) is the average of (80,80), (120,60) and (100,110); centroid B at (320, 227) is the average of (300,220), (340,260) and (320,200). At convergence, every point is closer to its own centroid than to the other one."
            },
            {
              "t": "p",
              "x": "The algorithm needs k decided in advance, which is often the hardest part in practice — chosen by domain knowledge, or by the elbow and silhouette diagnostics covered later in this booklet. k-means also implicitly assumes clusters are roughly round and similar in size, since it only ever measures distance to a single center point; it struggles with clusters that are long, thin, or nested inside one another."
            },
            {
              "t": "p",
              "x": "Hierarchical clustering sidesteps choosing k up front. Agglomerative clustering (the common variant) starts with every point as its own cluster and repeatedly merges the two closest clusters until only one remains, recording the order and distance of every merge. Cutting that merge sequence at any height yields a clustering with however many groups that height implies — so you can defer the “how many clusters” decision until after seeing the whole merge structure, rather than committing to it beforehand."
            }
          ]
        },
        {
          "title": "PCA and dimensionality reduction",
          "blocks": [
            {
              "t": "p",
              "x": "Real data often has more features than genuinely independent information — many features move together, correlated with each other rather than each carrying separate signal. Principal component analysis finds the directions in feature space along which the data varies the most, and re-expresses the data in terms of those directions instead of the original features. The first principal component is the single direction capturing the most variance; the second is the direction capturing the most remaining variance while staying perpendicular to the first; and so on."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 540 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"260\" x2=\"500\" y2=\"260\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"60\" y1=\"260\" x2=\"60\" y2=\"30\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"280\" y=\"282\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">feature x1</text>\n<text x=\"28\" y=\"145\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\" transform=\"rotate(-90 28 145)\">feature x2</text>\n<circle cx=\"120\" cy=\"220\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"180\" cy=\"182\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"220\" cy=\"170\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"260\" cy=\"158\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"320\" cy=\"120\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"380\" cy=\"98\" r=\"5\" fill=\"#9BA3A9\"/>\n<circle cx=\"420\" cy=\"70\" r=\"5\" fill=\"#9BA3A9\"/>\n<line x1=\"90\" y1=\"236\" x2=\"450\" y2=\"56\" stroke=\"#EDEFF0\" stroke-width=\"1.8\"/>\n<text x=\"455\" y=\"50\" font-size=\"12\" fill=\"#EDEFF0\">PC1</text>\n<line x1=\"253.5\" y1=\"109.6\" x2=\"289.3\" y2=\"181.2\" stroke=\"#666D72\" stroke-width=\"1.6\"/>\n<text x=\"296\" y=\"185\" font-size=\"11.5\" fill=\"#9AA1A6\">PC2</text>\n</svg>",
              "cap": "Seven points that vary mostly along one diagonal direction. PC1 is the axis capturing the most variance — the direction the data is really spread along. PC2, perpendicular to PC1, captures what little variance is left. Projecting onto PC1 alone keeps most of the information in one number instead of two."
            },
            {
              "t": "p",
              "x": "Keeping only the first few principal components trades a small, controllable amount of lost variance for a much lower-dimensional dataset — useful for visualization (projecting to 2 or 3 dimensions to actually look at otherwise high-dimensional data), for speeding up downstream models, and for reducing noise, since later components with very little variance are often mostly noise rather than signal."
            }
          ]
        },
        {
          "title": "Density estimation",
          "blocks": [
            {
              "t": "p",
              "x": "Where clustering and PCA look for groups or directions, density estimation asks a more direct question: how likely is a given region of feature space to produce a data point? A histogram is the crudest form — bin the data and count — but is sensitive to bin width and placement. Kernel density estimation smooths this out by placing a small bump (a kernel, often Gaussian) at every data point and summing them, producing a continuous estimate of the underlying density rather than a blocky histogram."
            },
            {
              "t": "note",
              "x": "Density estimates are the basis of one common anomaly-detection approach: a point sitting in a very low-density region of the estimated distribution is, by that measure, unusual — worth flagging as a potential outlier, fraud case, or sensor fault, without needing any labeled examples of what “anomalous” looks like in advance."
            }
          ]
        },
        {
          "title": "Evaluating structure without ground truth",
          "blocks": [
            {
              "t": "p",
              "x": "With no labels to check against, evaluation has to fall back on internal measures of how good a clustering is by its own geometry, plus judgment about whether the result is useful. The elbow method plots total within-cluster distance against k and looks for the point where adding more clusters stops helping much — the “elbow” in that curve. The silhouette score measures, for each point, how much closer it is to its own cluster than to the next-nearest one, averaged across all points; values near 1 mean well-separated clusters, values near 0 mean clusters that barely differ from randomly splitting the data."
            },
            {
              "t": "p",
              "x": "Neither metric proves a clustering is meaningful — both can look fine on data with no real structure at all, since k-means will partition even pure noise into k groups if asked to. The final check is almost always domain judgment: do the discovered groups correspond to something a person familiar with the data recognizes as real and useful, or do they just carve up noise into equal-looking pieces?"
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check the mechanics of k-means and PCA directly, plus the judgment calls around evaluating structure with no labels to lean on."
            }
          ],
          "exercises": [
            {
              "q": "In the k-means figure, centroid A sits at (100, 83), the mean of (80,80), (120,60) and (100,110). Verify this by computing the mean by hand.",
              "steps": [
                "Mean x = (80 + 120 + 100) / 3 = 300 / 3 = 100.",
                "Mean y = (80 + 60 + 110) / 3 = 250 / 3 ≈ 83.3, which rounds to 83.",
                "Both match the figure's stated centroid, confirming the update step: move each centroid to the mean of its currently-assigned points."
              ],
              "answer": "Mean x = 100, mean y ≈ 83.3 — matching the figure. This is exactly k-means' update step: recompute each centroid as the mean of its assigned points."
            },
            {
              "kind": "mc",
              "q": "Why is k-means typically run multiple times from different random initial centroids, with the best result kept?",
              "options": [
                "Because k-means can converge to different local optima depending on where centroids start",
                "Because k-means never actually converges on a single run",
                "Because more runs always find a better value of k automatically",
                "Because a single run is too slow to complete on most datasets"
              ],
              "correct": 0,
              "steps": [
                "k-means alternates assignment and update steps that each only decrease total squared distance, guaranteeing convergence — but convergence to a local optimum, not necessarily the global best partition.",
                "Different random starting centroids can lead to different local optima, so running several times and keeping the best (lowest total distance) result reduces the chance of settling on a poor one.",
                "This has nothing to do with choosing k itself — that's a separate decision, addressed by the elbow method or silhouette score."
              ],
              "answer": "Different starting centroids can lead k-means to converge to different local optima, so multiple runs (keeping the best) reduce the chance of settling on a bad partition."
            },
            {
              "kind": "write",
              "q": "The clustering approach that starts with every point as its own cluster and repeatedly merges the two closest, avoiding the need to pick k in advance, is called ___ clustering.",
              "accept": [
                "hierarchical",
                "agglomerative",
                "agglomerative hierarchical"
              ],
              "hint": "records a full merge sequence you can cut at any height",
              "steps": [
                "k-means requires committing to a value of k before running.",
                "Hierarchical (agglomerative) clustering instead starts with every point separate and merges the closest pair repeatedly, recording the whole sequence.",
                "The number of clusters is then chosen after the fact, by cutting the merge sequence at whatever height gives the desired count."
              ],
              "answer": "Hierarchical (agglomerative) clustering — it defers the choice of cluster count until after seeing the full merge sequence."
            },
            {
              "q": "A silhouette score comes back near 0 for a k-means clustering with k=5 on a dataset. What does this suggest, and what should you check next?",
              "steps": [
                "A silhouette score near 0 means points are, on average, about as close to neighboring clusters as to their own — the clusters are barely distinguishable from an arbitrary split.",
                "This suggests either k is wrong for this data, or the data genuinely doesn't have well-separated cluster structure at all (it may be roughly uniform, or better described by a different shape than round, similarly-sized groups).",
                "Reasonable next steps: try the elbow method or a range of k values and compare silhouette scores across them, and consider whether k-means' spherical-cluster assumption even fits this data, or whether a different method (density-based, or checking for actual structure via PCA) is more appropriate."
              ],
              "answer": "A near-0 silhouette score means the clusters are poorly separated — barely better than an arbitrary split. Next steps are trying other values of k, and questioning whether k-means' round-cluster assumption fits this data at all."
            },
            {
              "kind": "mc",
              "q": "After PCA, keeping only the first principal component of the data shown in this booklet's PCA figure would preserve mostly what?",
              "options": [
                "Most of the real variation in the data, since it mostly varies along one diagonal direction",
                "None of the variation, since PCA discards all original information",
                "Only the noise, discarding the real signal",
                "Exactly half of the variation, by definition"
              ],
              "correct": 0,
              "steps": [
                "The figure's seven points lie close to a single diagonal line (PC1's direction), with only small deviations perpendicular to it (captured by PC2).",
                "Since PC1 is defined as the direction of maximum variance, and nearly all the spread in this data is along that diagonal, keeping PC1 alone retains almost all the real information.",
                "PC2 captures only the small leftover spread, most of which — for data structured like this — is closer to noise than signal."
              ],
              "answer": "Most of the real variation — PC1 is the direction of maximum variance, and this data varies almost entirely along that one diagonal direction, so a single component captures nearly all of it."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Unsupervised learning",
          "Learning structure from data with no labels or correct answers provided."
        ],
        [
          "k-means",
          "A clustering algorithm that alternates assigning points to the nearest of k centroids and moving each centroid to its assigned points' mean."
        ],
        [
          "Centroid",
          "The mean position of the points currently assigned to a cluster."
        ],
        [
          "Convergence",
          "The point at which further k-means iterations no longer change the assignment or centroids."
        ],
        [
          "Local optimum",
          "A result that can't be improved by k-means' own steps but isn't necessarily the best possible partition overall."
        ],
        [
          "Hierarchical (agglomerative) clustering",
          "Clustering by repeatedly merging the two closest clusters, starting from every point alone, recording the merge sequence."
        ],
        [
          "Dendrogram",
          "A tree diagram recording a hierarchical clustering's merge order and distances."
        ],
        [
          "Principal component analysis (PCA)",
          "Finding the directions of maximum variance in the data and re-expressing it in terms of those directions."
        ],
        [
          "Principal component",
          "One of the ranked, mutually perpendicular directions of maximum remaining variance found by PCA."
        ],
        [
          "Dimensionality reduction",
          "Representing data with fewer features while preserving as much real information as possible."
        ],
        [
          "Density estimation",
          "Estimating how likely a region of feature space is to produce a data point."
        ],
        [
          "Kernel density estimation",
          "Density estimation by summing a smooth kernel placed at every data point."
        ],
        [
          "Elbow method",
          "Choosing k by plotting within-cluster distance against k and looking for where the improvement flattens."
        ],
        [
          "Silhouette score",
          "A measure of how much closer each point is to its own cluster than to the next-nearest one."
        ],
        [
          "Anomaly detection",
          "Flagging points in very low-density regions of an estimated distribution as unusual."
        ]
      ]
    },
  "evaluation":   {
      "title": "Model Evaluation",
      "blurb": "Training a model is the easy part. Deciding whether it's actually good — and by which yardstick — is the harder, more consequential problem.",
      "chapters": [
        {
          "title": "A number is not the same as being good",
          "blocks": [
            {
              "t": "p",
              "x": "Every model produces some number when you score it — accuracy, loss, whatever the training loop logs. None of those numbers mean \"this model is good\" on their own. A model can hit 99% accuracy and still be useless, can have a low training loss and still fail badly on new data, and can look excellent on one metric while being unacceptable on another that actually matters for the decision at hand. Evaluation is the discipline of choosing what to measure, measuring it honestly on data the model hasn't seen, and being willing to hear that the answer is \"not good enough.\""
            },
            {
              "t": "p",
              "x": "This chapter and the ones after it build up the machinery: how to split data so a score means what it claims to mean, how to read that score when classes are imbalanced, how to tell overfitting from underfitting by watching training unfold, and how to pick a metric that actually reflects the goal rather than whatever is easiest to compute."
            }
          ]
        },
        {
          "title": "Cross-validation and holdout discipline",
          "blocks": [
            {
              "t": "p",
              "x": "The single rule underneath all of evaluation: never judge a model on the data it was trained on. A model can memorize its training set — fit its quirks and noise along with the real pattern — and score deceptively well there while generalizing badly. The fix is a holdout: split the data into a training set the model learns from and a test set it never sees until the final, one-time evaluation."
            },
            {
              "t": "p",
              "x": "A single train/test split wastes data and gives one noisy estimate — get unlucky with which examples land in the test set and the score can swing a lot for reasons that have nothing to do with the model. k-fold cross-validation fixes this by splitting the data into k roughly equal folds, training k times with a different fold held out as validation each time, and averaging the k scores. With k=5, each training run uses 80% of the data and validates on the remaining 20%, and every example gets used for validation exactly once across the five runs."
            },
            {
              "t": "note",
              "x": "A model is typically tuned (hyperparameters chosen, architecture picked) using cross-validation on a training/validation split, and only evaluated on a completely separate test set once, at the very end. Using the test set to make any decision along the way — even just \"let's try one more thing and check\" — quietly turns it into another validation set, and the final number stops being an honest estimate of real-world performance."
            }
          ]
        },
        {
          "title": "Precision, recall, and reading a confusion matrix",
          "blocks": [
            {
              "t": "p",
              "x": "Accuracy — the fraction of predictions that are correct — is the most intuitive metric and often the wrong one. If 99 out of 100 emails are legitimate and 1 is spam, a classifier that predicts \"not spam\" every single time scores 99% accuracy while catching zero spam. The problem is accuracy treats every example as equally informative, and rare-but-important cases get drowned out."
            },
            {
              "t": "p",
              "x": "A confusion matrix breaks predictions into four counts: true positives (TP, correctly flagged), false negatives (FN, missed), false positives (FP, false alarms), and true negatives (TN, correctly cleared). From these, precision = TP / (TP + FP) asks \"of everything I flagged, how much was actually positive?\" and recall = TP / (TP + FN) asks \"of everything actually positive, how much did I catch?\" The two trade off against each other — flag everything and recall hits 100% while precision collapses; flag almost nothing and precision looks great on the few flags you do make, while recall collapses instead."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 560 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">confusion matrix — 100 test examples, 10 actually positive</text>\n<line x1=\"200\" y1=\"55\" x2=\"200\" y2=\"270\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"380\" y1=\"55\" x2=\"380\" y2=\"270\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"90\" y1=\"110\" x2=\"490\" y2=\"110\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"90\" y1=\"190\" x2=\"490\" y2=\"190\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"290\" y=\"40\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">predicted</text>\n<text x=\"245\" y=\"75\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">positive</text>\n<text x=\"425\" y=\"75\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">negative</text>\n<text x=\"45\" y=\"150\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">positive</text>\n<text x=\"45\" y=\"230\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">negative</text>\n<text x=\"45\" y=\"110\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\" transform=\"rotate(-90 45 110)\">actual</text>\n<text x=\"290\" y=\"148\" text-anchor=\"middle\" font-size=\"22\" fill=\"#EDEFF0\" font-weight=\"700\">TP = 7</text>\n<text x=\"290\" y=\"228\" text-anchor=\"middle\" font-size=\"22\" fill=\"#9AA1A6\" font-weight=\"700\">FP = 8</text>\n<text x=\"435\" y=\"148\" text-anchor=\"middle\" font-size=\"22\" fill=\"#9AA1A6\" font-weight=\"700\">FN = 3</text>\n<text x=\"435\" y=\"228\" text-anchor=\"middle\" font-size=\"22\" fill=\"#666D72\" font-weight=\"700\">TN = 82</text>\n</svg>",
              "cap": "A confusion matrix for 100 examples where 10 are actually positive (rare-event style split, like fraud or disease screening). Precision = 7/(7+8) ≈ 0.47 — under half of the flagged cases are real. Recall = 7/(7+3) = 0.70 — 70% of real positives are caught. Overall accuracy is (7+82)/100 = 89%, which sounds fine but hides that fewer than half the alarms are genuine."
            },
            {
              "t": "p",
              "x": "The receiver operating characteristic (ROC) curve and the precision-recall (PR) curve summarize this tradeoff across every possible decision threshold at once, rather than at the single threshold a confusion matrix captures. The ROC curve plots true positive rate against false positive rate as the threshold sweeps from strict to lenient; the area under it (AUC) gives one number for \"how well does this model rank positives above negatives, regardless of threshold.\" When positives are rare, the PR curve is usually more informative than ROC, because ROC's false-positive-rate denominator includes the large negative class and can look deceptively good even when precision is poor."
            }
          ]
        },
        {
          "title": "Overfitting, underfitting, and learning curves",
          "blocks": [
            {
              "t": "p",
              "x": "Underfitting is a model too simple to capture the real pattern — both training and validation error stay high, because the model genuinely can't represent the relationship (a straight line fit to a clear curve, say). Overfitting is the opposite failure: the model is flexible enough to fit noise and idiosyncrasies specific to the training set, so training error keeps falling while validation error, measured on data it hasn't memorized, starts rising back up."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 560 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"270\" x2=\"520\" y2=\"270\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"60\" y1=\"270\" x2=\"60\" y2=\"30\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"290\" y=\"295\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">training epoch</text>\n<text x=\"26\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\" transform=\"rotate(-90 26 150)\">loss</text>\n<polyline points=\"80,240 130,190 180,150 230,120 280,100 330,85 380,72 430,62 480,55\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"485\" y=\"50\" font-size=\"11.5\" fill=\"#EDEFF0\">training loss</text>\n<polyline points=\"80,245 130,195 180,155 230,128 280,115 330,118 380,140 430,175 480,220\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"2\" stroke-dasharray=\"6,4\"/>\n<text x=\"485\" y=\"225\" font-size=\"11.5\" fill=\"#9BA3A9\">validation loss</text>\n<line x1=\"280\" y1=\"30\" x2=\"280\" y2=\"270\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n<text x=\"286\" y=\"44\" font-size=\"11\" fill=\"#666D72\">overfitting begins</text>\n</svg>",
              "cap": "Training loss (solid) keeps falling every epoch, but validation loss (dashed) only falls until roughly epoch 5, then rises — the model has started fitting patterns specific to the training set that don't generalize. This gap, not the training loss alone, is what a learning curve is for."
            },
            {
              "t": "p",
              "x": "The gap between the two curves is diagnostic. A small, stable gap with both curves flat and high means underfitting — the fix is a more expressive model, more features, or training longer. A widening gap where training loss keeps improving while validation loss worsens means overfitting — the fix is more data, regularization, simplifying the model, or early stopping at the point the curves diverge, which is exactly the epoch a validation set is watched for in practice."
            }
          ]
        },
        {
          "title": "Choosing a metric that matches the goal",
          "blocks": [
            {
              "t": "p",
              "x": "Every metric is a specific, narrow claim about what \"good\" means, and picking the wrong one optimizes for the wrong thing even if the model itself is fine. A spam filter that must never block a real email cares far more about precision than recall; a cancer-screening model that must never miss a real case cares far more about recall than precision, even at the cost of more false alarms that a follow-up test can rule out. F1 score (the harmonic mean of precision and recall) is a reasonable default when both matter roughly equally, but it is still a compromise, not a neutral choice — stating explicitly which error is more costly, and choosing a metric (or an operating threshold) that reflects that, is a judgment call the data can't make for you."
            },
            {
              "t": "note",
              "x": "Regression tasks face the same choice: mean squared error penalizes large errors heavily (squaring), which is right when big misses are disproportionately bad, while mean absolute error treats every unit of error the same, which is right when a consistent small bias matters more than one large outlier. Neither is objectively \"more correct\" — the choice encodes what kind of mistake the deployment can least afford."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These work the confusion-matrix numbers from this booklet's figure by hand, and check the judgment calls around metrics and overfitting."
            }
          ],
          "exercises": [
            {
              "q": "Using the confusion matrix figure (TP=7, FN=3, FP=8, TN=82, 100 examples total), compute precision, recall, and accuracy.",
              "steps": [
                "Precision = TP / (TP + FP) = 7 / (7 + 8) = 7/15 ≈ 0.467.",
                "Recall = TP / (TP + FN) = 7 / (7 + 3) = 7/10 = 0.700.",
                "Accuracy = (TP + TN) / total = (7 + 82) / 100 = 89/100 = 0.890."
              ],
              "answer": "Precision ≈ 0.47, recall = 0.70, accuracy = 0.89. Accuracy alone (89%) looks solid; precision (47%) reveals that more than half the flagged cases are false alarms."
            },
            {
              "kind": "mc",
              "q": "A dataset is 99% negative and 1% positive. A model that predicts \"negative\" for every single example is submitted for evaluation. What does this reveal about relying on accuracy alone?",
              "options": [
                "The model scores 99% accuracy despite catching zero positives, so accuracy alone can be worthless on imbalanced data",
                "The model will score poorly on accuracy because it never predicts the positive class",
                "Accuracy is undefined when a model always predicts the same class",
                "The model's recall will be 99%, matching its accuracy"
              ],
              "correct": 0,
              "steps": [
                "Predicting \"negative\" always is correct on every one of the 99 negative examples and wrong on all 1 positive example, out of 100.",
                "Accuracy = 99/100 = 99% — a very high-looking number.",
                "But recall on the positive class is 0/1 = 0% — the model never catches a single real positive, which accuracy alone completely hides."
              ],
              "answer": "The model hits 99% accuracy while catching zero positives (0% recall) — exactly the scenario where accuracy alone is a worthless signal and a metric like recall or precision is needed instead."
            },
            {
              "kind": "write",
              "q": "The curve that plots true positive rate against false positive rate across every decision threshold, with area-under-it summarizing ranking quality in one number, is the ___ curve.",
              "accept": [
                "roc",
                "receiver operating characteristic",
                "receiver operating characteristic (roc)"
              ],
              "hint": "its area under the curve is often abbreviated AUC",
              "steps": [
                "A confusion matrix captures performance at one fixed threshold.",
                "The ROC curve instead sweeps the threshold from strict to lenient, plotting how true-positive rate and false-positive rate trade off at every point.",
                "The area under this curve (AUC) gives a single threshold-independent score for how well the model ranks positives above negatives."
              ],
              "answer": "The ROC (receiver operating characteristic) curve — its area under the curve (AUC) is the usual single-number summary."
            },
            {
              "q": "In the learning-curve figure, training loss keeps falling every epoch while validation loss starts rising after epoch 5. What should you actually do with this information?",
              "steps": [
                "The diverging curves are the signature of overfitting: the model is increasingly fitting patterns specific to the training set that don't hold on unseen data.",
                "One direct fix is early stopping — stop training (or restore the checkpoint) at the epoch where validation loss was lowest, roughly epoch 5 here, rather than continuing to the final epoch.",
                "Other options that address the same underlying cause: add regularization, get more training data, or reduce the model's capacity — training longer or increasing capacity would make the gap worse, not better."
              ],
              "answer": "Stop training around the epoch where validation loss is lowest (here, about epoch 5) rather than continuing — or add regularization, more data, or reduced model capacity to close the gap."
            },
            {
              "kind": "mc",
              "q": "A model is being built to screen for a rare, serious disease, where missing a real case is far more costly than an extra follow-up test on a healthy patient. Which should the evaluation prioritize?",
              "options": [
                "High recall, even at the cost of lower precision",
                "High precision, even at the cost of lower recall",
                "Overall accuracy, since it balances both error types automatically",
                "Training loss, since it reflects the same thing as any test metric"
              ],
              "correct": 0,
              "steps": [
                "Missing a real case (a false negative) is the costly error here, and recall = TP/(TP+FN) is exactly the metric that penalizes false negatives.",
                "Prioritizing precision would minimize false alarms at the cost of missing more real cases — the wrong tradeoff for this situation.",
                "Accuracy doesn't distinguish which error type is happening and, as shown earlier in this booklet, can look fine while recall is terrible on a rare positive class."
              ],
              "answer": "High recall — since missing a real case (a false negative) is the costly mistake here, and recall is the metric that penalizes exactly that."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Holdout set",
          "Data withheld from training and used only to estimate how a model performs on unseen examples."
        ],
        [
          "k-fold cross-validation",
          "Splitting data into k folds, training k times with a different fold held out for validation, and averaging the scores."
        ],
        [
          "Confusion matrix",
          "A table of true positive, false positive, false negative, and true negative counts for a classifier's predictions."
        ],
        [
          "Precision",
          "Of everything predicted positive, the fraction that is actually positive: TP / (TP + FP)."
        ],
        [
          "Recall",
          "Of everything actually positive, the fraction the model caught: TP / (TP + FN)."
        ],
        [
          "F1 score",
          "The harmonic mean of precision and recall, used when both matter roughly equally."
        ],
        [
          "ROC curve",
          "A plot of true positive rate against false positive rate across every classification threshold."
        ],
        [
          "AUC",
          "Area under the ROC curve; a single threshold-independent measure of ranking quality."
        ],
        [
          "Precision-recall (PR) curve",
          "A plot of precision against recall across thresholds, often more informative than ROC when positives are rare."
        ],
        [
          "Overfitting",
          "Fitting patterns specific to the training data that fail to generalize, seen as validation error rising while training error keeps falling."
        ],
        [
          "Underfitting",
          "A model too simple to capture the real pattern, with both training and validation error remaining high."
        ],
        [
          "Learning curve",
          "A plot of training and validation error over training time, used to diagnose over/underfitting."
        ],
        [
          "Early stopping",
          "Halting training at the point validation performance stops improving, to avoid overfitting."
        ],
        [
          "Mean squared error",
          "A regression loss that squares each error, penalizing large errors disproportionately."
        ],
        [
          "Mean absolute error",
          "A regression loss that treats every unit of error the same regardless of size."
        ],
        [
          "Class imbalance",
          "A dataset where one class vastly outnumbers another, which can make accuracy misleading."
        ]
      ]
    },
  "nn":   {
      "title": "Neural Networks",
      "blurb": "Layers of weighted sums and nonlinearities, stacked into a function flexible enough to fit almost anything — and still, underneath, just matrix multiplication.",
      "chapters": [
        {
          "title": "Why one linear layer isn't enough",
          "blocks": [
            {
              "t": "p",
              "x": "Linear and logistic regression, from the supervised learning booklet, are each a single affine transformation of the input: multiply by a weight matrix, add a bias, optionally squash the result through a fixed function for classification. That's already a lot of useful modeling, but it has a hard ceiling — stacking two linear transformations back to back is still just one linear transformation, since a matrix times a matrix is another matrix. No amount of stacking plain affine layers adds any expressive power at all."
            },
            {
              "t": "p",
              "x": "A neural network breaks that ceiling by inserting a nonlinear function — an activation function — between layers. Now stacking layers actually does something: each layer can bend, fold, and recombine the space the previous layer produced, and composing enough of these bends lets the network approximate extremely complicated functions, including ones with no simple closed form. This is the entire idea; everything else in this booklet is detail on how that's built and trained in practice."
            }
          ]
        },
        {
          "title": "Neurons, layers, and the forward pass",
          "blocks": [
            {
              "t": "p",
              "x": "A single neuron computes a weighted sum of its inputs plus a bias, then applies an activation function: z = w·x + b, a = f(z). A layer is just many neurons computed in parallel from the same input, which is exactly what makes it a matrix operation — stack every neuron's weight vector as a row of a matrix W, and the whole layer's output is a = f(Wx + b), one matrix-vector product, one vector addition, one elementwise function, all at once. A network is a chain of these: the output of one layer becomes the input to the next."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 340\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">forward pass: x=[1, 2] &#8594; hidden (ReLU) &#8594; output</text>\n<circle cx=\"90\" cy=\"110\" r=\"22\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"90\" y=\"115\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text>\n<text x=\"90\" y=\"148\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">x1</text>\n<circle cx=\"90\" cy=\"230\" r=\"22\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"90\" y=\"235\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">2</text>\n<text x=\"90\" y=\"268\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">x2</text>\n<circle cx=\"330\" cy=\"90\" r=\"26\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/>\n<text x=\"330\" y=\"85\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">z=-0.5</text>\n<text x=\"330\" y=\"100\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">0</text>\n<text x=\"330\" y=\"128\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">h1 (ReLU)</text>\n<circle cx=\"330\" cy=\"250\" r=\"26\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/>\n<text x=\"330\" y=\"245\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">z=2</text>\n<text x=\"330\" y=\"260\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">2</text>\n<text x=\"330\" y=\"288\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">h2 (ReLU)</text>\n<circle cx=\"560\" cy=\"170\" r=\"28\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/>\n<text x=\"560\" y=\"165\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">1.3</text>\n<text x=\"560\" y=\"212\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">output y</text>\n<line x1=\"112\" y1=\"110\" x2=\"304\" y2=\"92\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"112\" y1=\"110\" x2=\"304\" y2=\"244\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"112\" y1=\"230\" x2=\"304\" y2=\"96\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"112\" y1=\"230\" x2=\"304\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"356\" y1=\"96\" x2=\"534\" y2=\"163\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"356\" y1=\"246\" x2=\"534\" y2=\"177\" stroke=\"#23282B\" stroke-width=\"1\"/>\n</svg>",
              "cap": "A tiny network computing one forward pass by hand. Weights W1=[[0.5,-0.5],[1,0]], bias b1=[0,1]: z1 = W1x+b1 = [0.5(1)-0.5(2)+0, 1(1)+0(2)+1] = [-0.5, 2]; ReLU gives [0, 2]. Output weights w2=[1,0.5], bias 0.3: y = 1(0) + 0.5(2) + 0.3 = 1.3."
            },
            {
              "t": "worked",
              "q": "Verify the output value 1.3 in the figure above by hand from the hidden activations [0, 2].",
              "steps": [
                "The output layer computes y = w2 · h + b2 where w2 = [1, 0.5], h = [0, 2], b2 = 0.3.",
                "y = (1)(0) + (0.5)(2) + 0.3 = 0 + 1.0 + 0.3 = 1.3.",
                "This matches the figure exactly — the whole forward pass, input to output, is two matrix-vector products and two elementwise activations."
              ]
            }
          ]
        },
        {
          "title": "Activation functions and why nonlinearity matters",
          "blocks": [
            {
              "t": "p",
              "x": "Sigmoid squashes any real number into (0, 1) and was the historical default, especially for output layers producing a probability, but it saturates — for large positive or negative inputs its slope goes nearly flat, which (as the backpropagation booklet covers) makes gradients vanish during training. ReLU (rectified linear unit), defined as max(0, x), fixes this for positive inputs: its gradient is exactly 1 wherever x > 0, so gradients pass through unshrunk, which is a large part of why deep networks became trainable at all. Its cost is that a neuron whose input is always negative gets a permanently zero gradient — \"dead\" and unable to update — which milder variants like Leaky ReLU address by allowing a small nonzero slope for negative inputs."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 600 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"260\" x2=\"520\" y2=\"260\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"60\" y1=\"260\" x2=\"60\" y2=\"40\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"56\" y=\"278\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">-4</text>\n<text x=\"280\" y=\"278\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">0</text>\n<text x=\"500\" y=\"278\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">4</text>\n<text x=\"290\" y=\"300\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">x</text>\n<polyline points=\"60,260 115,260 170,260 225,260 280,260 335,205 390,150 445,95 500,40\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2.2\"/>\n<polyline points=\"60,256 115,250 170,234 225,201 280,150 335,99 390,66 445,50 500,44\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.8\" stroke-dasharray=\"6,4\"/>\n<text x=\"85\" y=\"64\" font-size=\"12\" fill=\"#EDEFF0\">ReLU: max(0, x)</text>\n<text x=\"85\" y=\"84\" font-size=\"12\" fill=\"#9AA1A6\">sigmoid (scaled &#215;4 to compare shape)</text>\n</svg>",
              "cap": "ReLU (solid) is flat at 0 for negative inputs, then rises with constant slope 1. Sigmoid (dashed, scaled ×4 here purely to compare shape on one axis — its real output range is 0 to 1) saturates smoothly at both ends: nearly flat below -2 and above 2, which is exactly where its gradient shrinks toward zero."
            },
            {
              "t": "p",
              "x": "Tanh is sigmoid rescaled to output between -1 and 1, centered at zero, which trains somewhat better than sigmoid in practice but has the same saturation problem at its extremes. The choice of activation is not cosmetic — it directly determines how well gradients flow backward through a deep stack of layers, which is the subject of the backpropagation booklet."
            }
          ]
        },
        {
          "title": "Depth, width, and universal approximation",
          "blocks": [
            {
              "t": "p",
              "x": "The universal approximation theorem states, informally, that a network with even a single hidden layer of nonlinear neurons can approximate any continuous function on a bounded input region to arbitrary precision, given enough neurons in that layer. This is a real theorem, but it is also easy to over-read: it says a sufficiently wide shallow network can represent the function, not that gradient descent will find those weights, and not that the required width is remotely practical — for many functions worth learning, the needed width grows so large that a shallow network becomes useless in practice."
            },
            {
              "t": "p",
              "x": "Depth turns out to be a far more practical way to get expressiveness: each additional layer can reuse and recombine what earlier layers already computed, letting a deep, narrow network represent functions that a shallow, wide network could only match with an impractically large number of neurons. This is the empirical justification for \"deep\" learning specifically — depth, not just raw parameter count, is what makes modern networks efficient to train and effective in practice."
            }
          ]
        },
        {
          "title": "Initialization, dropout, and normalization",
          "blocks": [
            {
              "t": "p",
              "x": "Weights can't start at zero: if every weight in a layer is identical, every neuron in that layer computes the identical output and receives the identical gradient forever, so the layer never breaks that symmetry and effectively behaves like a single neuron no matter how many it actually has. In practice weights are initialized randomly, at a small scale chosen to keep the variance of activations roughly stable as they pass through layers — schemes named for their authors (Xavier/Glorot, He initialization) differ mainly in exactly how that scale is computed for a given activation function."
            },
            {
              "t": "p",
              "x": "Dropout randomly zeroes out a fraction of neurons' outputs during each training step, forcing the network to not rely too heavily on any single neuron or narrow co-adapted group of them — a form of regularization that tends to improve generalization at some cost to training speed. Batch normalization instead re-centers and rescales each layer's inputs using statistics computed over the current mini-batch, which stabilizes and typically speeds up training by keeping the distribution of values flowing through the network from drifting as weights update."
            },
            {
              "t": "note",
              "x": "Dropout and normalization layers behave differently at training time versus inference time — dropout is switched off entirely for inference (using the full network), and batch normalization switches from per-batch statistics to fixed running statistics collected during training. Forgetting to make this switch is a common, quiet source of a model that trains fine but performs oddly once deployed."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-derive the forward pass from this booklet's worked figure and check the reasoning behind activation choices and initialization."
            }
          ],
          "exercises": [
            {
              "q": "Redo the forward pass with a different input, x=[2, -1], using the same weights W1=[[0.5,-0.5],[1,0]], b1=[0,1], w2=[1,0.5], b2=0.3.",
              "steps": [
                "z1[0] = 0.5(2) + (-0.5)(-1) + 0 = 1.0 + 0.5 = 1.5, so h1 = ReLU(1.5) = 1.5.",
                "z1[1] = 1(2) + 0(-1) + 1 = 2 + 1 = 3, so h2 = ReLU(3) = 3.",
                "y = w2·h + b2 = 1(1.5) + 0.5(3) + 0.3 = 1.5 + 1.5 + 0.3 = 3.3."
              ],
              "answer": "y = 3.3. The mechanics are identical to the figure's example — only the input numbers changed."
            },
            {
              "kind": "mc",
              "q": "Why does stacking two plain linear layers, with no activation function between them, add no expressive power over a single linear layer?",
              "options": [
                "Because the composition of two linear transformations is itself just another linear transformation",
                "Because linear layers cannot be trained with gradient descent",
                "Because two linear layers always compute the exact same function as each other",
                "Because a linear layer's output must be an integer"
              ],
              "correct": 0,
              "steps": [
                "A linear layer computes Wx + b. Feeding that into a second linear layer gives W2(W1x + b1) + b2 = (W2W1)x + (W2b1 + b2).",
                "That's exactly the form of a single linear layer, with weight matrix W2W1 and bias W2b1+b2 — no new functions become representable.",
                "A nonlinear activation between the layers breaks this collapse, which is the entire reason networks include one."
              ],
              "answer": "Composing two linear transformations algebraically collapses into a single linear transformation, so no nonlinear activation between them means no added expressive power."
            },
            {
              "kind": "write",
              "q": "The activation function defined as max(0, x), whose constant gradient of 1 for positive inputs helped make deep networks practical to train, is called ___.",
              "accept": [
                "relu",
                "rectified linear unit",
                "rectified linear unit (relu)"
              ],
              "hint": "flat at zero for negative inputs, a straight line of slope 1 afterward",
              "steps": [
                "Sigmoid and tanh both saturate at their extremes, shrinking gradients toward zero there.",
                "ReLU stays flat (gradient 0) for negative inputs but has gradient exactly 1 for any positive input, so it doesn't shrink gradients on the positive side.",
                "This property, more than any other single change, is why deep networks became reliably trainable."
              ],
              "answer": "ReLU (rectified linear unit) — max(0, x), with constant gradient 1 for positive inputs."
            },
            {
              "q": "Why can't every weight in a layer be initialized to exactly the same value (say, all zeros)?",
              "steps": [
                "If every neuron in a layer starts with identical weights, every neuron computes the exact same weighted sum from the same input, and therefore the exact same output.",
                "During backpropagation, every one of those identical neurons then receives the exact same gradient, since their contribution to the loss is identical.",
                "So every update keeps them identical to each other forever — the layer never breaks this symmetry, and behaves like a single neuron no matter how many it nominally has."
              ],
              "answer": "Identical initial weights make every neuron in the layer compute (and keep updating) identically, so the layer can never differentiate into neurons that detect different things — it effectively collapses to one neuron regardless of its actual width."
            },
            {
              "kind": "mc",
              "q": "A network trains to a low loss but performs strangely once deployed. The team realizes dropout was left in its training configuration during inference. What's the fix?",
              "options": [
                "Disable dropout at inference time so the full network is used for every prediction",
                "Increase the dropout rate further at inference time",
                "Retrain the network with no dropout at all, from scratch",
                "Dropout has no effect on inference and cannot be the cause"
              ],
              "correct": 0,
              "steps": [
                "Dropout is a training-time regularization technique that randomly zeroes neuron outputs to prevent over-reliance on any one of them.",
                "At inference, the standard behavior is to disable dropout entirely and use the full, un-dropped network for predictions.",
                "Leaving dropout active at inference introduces unnecessary randomness and effectively evaluates a different, weaker network than the one that was trained."
              ],
              "answer": "Disable dropout at inference time — it's a training-only regularizer, and the full network should be used once training is done."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Neuron",
          "A unit computing a weighted sum of its inputs plus a bias, followed by an activation function."
        ],
        [
          "Weights and biases",
          "The learned parameters of a layer: a matrix multiplying the input, and a vector added to the result."
        ],
        [
          "Forward pass",
          "Computing a network's output by pushing an input through each layer in sequence."
        ],
        [
          "Activation function",
          "A nonlinear function applied after a layer's weighted sum, without which stacked layers stay linear."
        ],
        [
          "ReLU",
          "max(0, x); the most common activation, with gradient exactly 1 for positive inputs."
        ],
        [
          "Sigmoid",
          "An activation squashing any input into (0, 1), prone to saturation at its extremes."
        ],
        [
          "Tanh",
          "Sigmoid rescaled to output between -1 and 1, centered at zero."
        ],
        [
          "Saturation",
          "The region of an activation function where its slope is nearly flat, shrinking gradients toward zero."
        ],
        [
          "Universal approximation theorem",
          "A sufficiently wide single hidden layer can approximate any continuous function on a bounded region, in principle."
        ],
        [
          "Depth",
          "The number of layers a network is composed of, distinct from width (neurons per layer)."
        ],
        [
          "Dropout",
          "Randomly zeroing a fraction of neuron outputs during training to reduce over-reliance on any one of them."
        ],
        [
          "Batch normalization",
          "Re-centering and rescaling a layer's inputs using statistics from the current mini-batch, to stabilize training."
        ],
        [
          "Xavier/Glorot initialization",
          "A weight-initialization scheme scaling initial weights to keep activation variance stable across layers."
        ],
        [
          "He initialization",
          "A weight-initialization scheme tuned for ReLU-family activations."
        ],
        [
          "Symmetry breaking",
          "The reason weights are initialized randomly rather than identically — so neurons in a layer diverge from each other."
        ],
        [
          "Dead ReLU",
          "A neuron whose input is always negative, so its gradient is permanently zero and it stops updating."
        ]
      ]
    },
  "embeddings":   {
      "title": "Embeddings",
      "blurb": "Turning discrete things — words, users, products, categories — into vectors, chosen so that geometric distance in that vector space means something real.",
      "chapters": [
        {
          "title": "From discrete symbols to vectors",
          "blocks": [
            {
              "t": "p",
              "x": "A model built from matrix multiplication needs numbers to work with, but a huge amount of real data is fundamentally discrete and symbolic: words, user IDs, product SKUs, zip codes. The naive fix is one-hot encoding — a vector as long as the vocabulary, all zeros except a single 1 marking which item this is. It works, but it throws away any notion of similarity: under one-hot encoding, \"cat\" and \"dog\" are exactly as different from each other as \"cat\" and \"spreadsheet,\" because every pair of distinct one-hot vectors is equally far apart and has zero dot product with every other."
            },
            {
              "t": "p",
              "x": "An embedding replaces that one-hot vector with a short, dense vector of real numbers — typically tens to a few thousand dimensions, versus a vocabulary that might have hundreds of thousands of entries — learned so that items which behave similarly in context end up with similar vectors. \"Cat\" and \"dog\" end up nearby because they tend to appear in similar surrounding contexts and play similar roles, while \"cat\" and \"spreadsheet\" end up far apart. The vector itself has no inherent meaning per dimension; what matters is the relative geometry between vectors."
            }
          ]
        },
        {
          "title": "Embedding tables and how they are learned",
          "blocks": [
            {
              "t": "p",
              "x": "The simplest embedding is literally a lookup table: a matrix with one row per vocabulary item, where row i is that item's embedding vector. Looking up an embedding is just selecting a row by index — cheap, and the reason embeddings scale to huge vocabularies. The rows themselves start as random vectors and are learned exactly like any other weight matrix: as part of some training objective, gradients flow back to whichever rows were used in a given batch, nudging those specific vectors so the model's predictions improve."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 600 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">embedding table — one row per vocabulary word</text>\n<rect x=\"40\" y=\"40\" width=\"260\" height=\"220\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"55\" y=\"65\" font-size=\"12.5\" fill=\"#666D72\">0  the</text>\n<text x=\"55\" y=\"105\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"700\">1  cat</text>\n<text x=\"55\" y=\"145\" font-size=\"12.5\" fill=\"#666D72\">2  sat</text>\n<text x=\"55\" y=\"185\" font-size=\"12.5\" fill=\"#666D72\">3  dog</text>\n<text x=\"55\" y=\"225\" font-size=\"12.5\" fill=\"#666D72\">4  runs</text>\n<rect x=\"40\" y=\"84\" width=\"260\" height=\"36\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<text x=\"140\" y=\"105\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">[0.21, -0.87, 0.44]</text>\n<line x1=\"300\" y1=\"102\" x2=\"420\" y2=\"102\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<polygon points=\"420,102 410,97 410,107\" fill=\"#9BA3A9\"/>\n<rect x=\"430\" y=\"78\" width=\"140\" height=\"48\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\" rx=\"6\"/>\n<text x=\"500\" y=\"98\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">dense vector fed</text>\n<text x=\"500\" y=\"114\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">into the model</text>\n</svg>",
              "cap": "Looking up the word \"cat\" (vocabulary index 1) is just reading row 1 of the embedding table — a 3-dimensional vector in this toy example, typically far higher-dimensional in practice. That row is an ordinary trainable weight vector, updated by gradient descent whenever \"cat\" appears in a training batch."
            },
            {
              "t": "p",
              "x": "This training can be a dedicated objective built purely to produce good embeddings (as in word2vec, covered next), or embeddings can simply be one more parameter inside a larger model trained end-to-end for some other task (translation, classification, next-token prediction) — in that case the embeddings that emerge are shaped by whatever makes the larger model's actual objective succeed, with no separate embedding-specific training step at all."
            }
          ]
        },
        {
          "title": "Distance and similarity in embedding space",
          "blocks": [
            {
              "t": "p",
              "x": "Once items are vectors, \"how similar are these two things\" becomes a geometric question. Cosine similarity — the cosine of the angle between two vectors, computed as their dot product divided by the product of their magnitudes — is the standard choice, because it measures direction while ignoring magnitude, which matters since embedding vector length often reflects something incidental (like how frequent a word is) rather than meaning."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 560 360\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"50\" y=\"30\" width=\"440\" height=\"280\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<circle cx=\"375\" cy=\"92\" r=\"5\" fill=\"#EDEFF0\"/>\n<text x=\"375\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">cat</text>\n<circle cx=\"401\" cy=\"102\" r=\"5\" fill=\"#EDEFF0\"/>\n<text x=\"430\" y=\"118\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">dog</text>\n<circle cx=\"113\" cy=\"196\" r=\"5\" fill=\"#9BA3A9\"/>\n<text x=\"90\" y=\"216\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9BA3A9\">car</text>\n<circle cx=\"123\" cy=\"180\" r=\"5\" fill=\"#9BA3A9\"/>\n<text x=\"148\" y=\"152\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9BA3A9\">truck</text>\n<line x1=\"375\" y1=\"92\" x2=\"401\" y2=\"102\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"4,3\"/>\n<text x=\"415\" y=\"90\" font-size=\"11\" fill=\"#666D72\">cos &#8776; 0.99</text>\n<line x1=\"375\" y1=\"92\" x2=\"113\" y2=\"196\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"4,3\"/>\n<text x=\"200\" y=\"130\" font-size=\"11\" fill=\"#666D72\">cos &#8776; -0.26</text>\n<text x=\"270\" y=\"325\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">embedding dimension 1</text>\n</svg>",
              "cap": "Toy 2D word embeddings: cat=(2,3) and dog=(2.5,2.8) point in almost the same direction, giving cosine similarity ≈ 0.99. cat and car=(-3,1) point in very different directions, giving cosine similarity ≈ -0.26 — near-opposite, reflecting that the two words behave in unrelated contexts."
            },
            {
              "t": "worked",
              "q": "Compute the cosine similarity between cat=(2,3) and dog=(2.5,2.8) shown in the figure.",
              "steps": [
                "Dot product: (2)(2.5) + (3)(2.8) = 5.0 + 8.4 = 13.4.",
                "Magnitude of cat: √(2² + 3²) = √13 ≈ 3.606. Magnitude of dog: √(2.5² + 2.8²) = √14.09 ≈ 3.754.",
                "Cosine similarity = 13.4 / (3.606 × 3.754) ≈ 13.4 / 13.54 ≈ 0.990."
              ],
              "answer": "≈ 0.99 — the two vectors point in almost the same direction, meaning the model has placed \"cat\" and \"dog\" as highly similar."
            }
          ]
        },
        {
          "title": "word2vec to sentence embeddings",
          "blocks": [
            {
              "t": "p",
              "x": "word2vec, an early and influential approach, learns word embeddings from a simple self-supervised objective with no human-labeled data at all: given a word, predict the words that tend to appear near it in real text (skip-gram), or given surrounding words, predict the missing one in the middle (CBOW). Neither task is interesting on its own, but solving it well forces the embedding table to place words with similar contextual behavior near each other — which is exactly the property that made \"cat\" and \"dog\" end up close in the earlier figure."
            },
            {
              "t": "p",
              "x": "A limitation of word2vec-style embeddings is that each word gets exactly one fixed vector, regardless of context — \"bank\" gets the same embedding whether it means a riverbank or a financial institution. Contextual embeddings, produced by models built on the attention mechanism, instead compute a different vector for each word every time, depending on the specific sentence it appears in — solving the polysemy problem and forming the basis of how modern language models represent text internally. Sentence and document embeddings extend the same idea one level up: a single vector meant to summarize an entire passage, typically produced by pooling or specially training a model's per-token contextual vectors, and used heavily in the retrieval step of retrieval-augmented generation."
            }
          ]
        },
        {
          "title": "What proximity implies — and doesn't",
          "blocks": [
            {
              "t": "p",
              "x": "It's tempting to read an embedding space as if distance were literally meaning, but the honest claim is narrower: proximity reflects how similarly two items were used in whatever data and objective produced the embeddings, nothing more. Words can end up close because they're synonyms, but also because they're antonyms that appear in nearly identical contexts (\"hot\" and \"cold\" both modify temperature-related nouns the same way), or because they co-occur for reasons that have nothing to do with sense (a brand name and its most common misspelling)."
            },
            {
              "t": "note",
              "x": "The famous \"king - man + woman ≈ queen\" vector-arithmetic result is a genuinely striking demonstration that some relationships get encoded as consistent directions in embedding space, but it doesn't generalize to every analogy, and which analogies work well depends heavily on the training data and how carefully the example was chosen. Treat embedding geometry as a strong, learned statistical signal — worth building real systems on, and used for exactly that throughout the ai track — not as a guarantee of semantic truth."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These work the cosine-similarity numbers from this booklet's figure and check the reasoning behind embedding tables and contextual embeddings."
            }
          ],
          "exercises": [
            {
              "q": "Compute the cosine similarity between cat=(2,3) and car=(-3,1) from the figure, and compare it to cat/dog's ≈0.99.",
              "steps": [
                "Dot product: (2)(-3) + (3)(1) = -6 + 3 = -3.",
                "Magnitude of cat: √13 ≈ 3.606. Magnitude of car: √((-3)² + 1²) = √10 ≈ 3.162.",
                "Cosine similarity = -3 / (3.606 × 3.162) ≈ -3 / 11.40 ≈ -0.263."
              ],
              "answer": "≈ -0.26 — nearly opposite in direction, far less similar than cat/dog's ≈0.99, matching the figure's claim that \"cat\" and \"car\" behave very differently."
            },
            {
              "kind": "mc",
              "q": "Why does one-hot encoding fail to capture that \"cat\" and \"dog\" are more similar to each other than \"cat\" and \"spreadsheet\"?",
              "options": [
                "Every pair of distinct one-hot vectors is equally far apart, with zero dot product, regardless of the words they represent",
                "One-hot vectors are too high-dimensional to compute a dot product at all",
                "One-hot encoding only works for numeric data, not words",
                "One-hot vectors change dynamically based on context, unlike embeddings"
              ],
              "correct": 0,
              "steps": [
                "A one-hot vector has a single 1 at the position for that word and 0 everywhere else.",
                "Any two distinct one-hot vectors share no position with a 1 in common, so their dot product is always exactly 0, and their distance is always the same fixed value.",
                "That geometry has no way to represent \"more similar\" versus \"less similar\" — every pair of distinct words is equally unrelated under one-hot encoding."
              ],
              "answer": "Every pair of distinct one-hot vectors is equidistant with zero dot product, so there's no geometric room to represent one pair being more similar than another — that's exactly the gap dense embeddings fill."
            },
            {
              "kind": "write",
              "q": "An embedding that computes a different vector for the same word depending on its surrounding sentence — solving the problem of a word like \"bank\" having only one fixed meaning — is called a ___ embedding.",
              "accept": [
                "contextual",
                "contextual embedding",
                "context-dependent"
              ],
              "hint": "the opposite of word2vec's one-fixed-vector-per-word approach",
              "steps": [
                "word2vec-style embeddings assign exactly one vector per word, regardless of which sentence it appears in.",
                "Contextual embeddings, built on attention, instead compute the vector fresh for each occurrence, using the surrounding words.",
                "This lets \"bank\" get a different vector in \"river bank\" versus \"bank account,\" solving the polysemy problem."
              ],
              "answer": "Contextual embeddings — a fresh vector per occurrence, computed from the surrounding context, rather than one fixed vector per word."
            },
            {
              "q": "A retrieval system computes sentence embeddings for a user's query and for every document in a collection, then ranks documents by cosine similarity to the query. Why is cosine similarity preferred over comparing raw vector magnitude?",
              "steps": [
                "Cosine similarity depends only on the angle between two vectors, dividing out their magnitudes entirely.",
                "Embedding vector length often reflects something incidental to meaning — such as how long or how information-dense a passage is — rather than reflecting topical similarity.",
                "Comparing by direction (cosine) rather than raw distance or magnitude keeps the ranking focused on what the text is about, not how long or how densely-worded it happens to be."
              ],
              "answer": "Cosine similarity ignores vector magnitude and measures only direction, so incidental differences in vector length (often tied to passage length or word frequency, not meaning) don't distort the similarity ranking."
            },
            {
              "kind": "mc",
              "q": "Two words end up with very similar embeddings, but on inspection they turn out to be exact antonyms (\"hot\" and \"cold\") rather than synonyms. What does this best illustrate?",
              "options": [
                "Embedding proximity reflects similarity of usage/context, not necessarily sameness of meaning",
                "The embedding model must have a bug, since antonyms should always be far apart",
                "Cosine similarity is the wrong metric and Euclidean distance would have avoided this",
                "This can only happen with one-hot encodings, never with learned embeddings"
              ],
              "correct": 0,
              "steps": [
                "Embeddings are learned to place words with similar contextual behavior nearby — and \"hot\" and \"cold\" often appear in nearly identical grammatical contexts (both modifying temperature-related nouns the same way).",
                "That's a real, expected property of how these embeddings are trained, not a malfunction — proximity tracks distributional usage, not human semantic categories like synonym versus antonym.",
                "Switching distance metrics wouldn't change the underlying cause, since it's about what the training objective actually optimizes for, not how similarity is measured afterward."
              ],
              "answer": "It illustrates that embedding proximity reflects similarity of context/usage, not guaranteed semantic sameness — antonyms often share near-identical contexts and can end up close together as a result."
            }
          ]
        }
      ],
      "vocab": [
        [
          "One-hot encoding",
          "Representing a discrete item as an all-zero vector with a single 1 marking its identity."
        ],
        [
          "Embedding",
          "A short, dense, learned vector representation of a discrete item, chosen so similar items end up nearby."
        ],
        [
          "Embedding table",
          "A matrix with one row per vocabulary item, where lookup is simply selecting that item's row."
        ],
        [
          "Cosine similarity",
          "The cosine of the angle between two vectors: their dot product divided by the product of their magnitudes."
        ],
        [
          "Dot product",
          "The sum of elementwise products of two vectors; used to compute similarity and in every layer's forward pass."
        ],
        [
          "word2vec",
          "A self-supervised method learning word embeddings by predicting nearby words (skip-gram) or a missing word from context (CBOW)."
        ],
        [
          "Skip-gram",
          "A word2vec variant that predicts surrounding context words from a given word."
        ],
        [
          "CBOW",
          "Continuous bag of words; a word2vec variant that predicts a missing word from its surrounding context."
        ],
        [
          "Polysemy",
          "A single word having multiple distinct meanings, which fixed word2vec-style embeddings cannot distinguish."
        ],
        [
          "Contextual embedding",
          "An embedding computed fresh for each occurrence of a word, depending on its surrounding sentence."
        ],
        [
          "Sentence embedding",
          "A single vector summarizing an entire sentence or passage, often produced by pooling contextual embeddings."
        ],
        [
          "Vector arithmetic (analogy)",
          "Combining embedding vectors additively to explore learned relationships, as in king - man + woman ≈ queen."
        ],
        [
          "Vector search",
          "Finding the nearest embedding vectors to a query vector, typically by cosine similarity."
        ],
        [
          "Dense vector",
          "A vector where most or all entries are nonzero, as opposed to a sparse one-hot vector."
        ],
        [
          "Distributional similarity",
          "The idea that words used in similar contexts tend to have similar meanings, underlying how embeddings are learned."
        ]
      ]
    },
  "backprop":   {
      "title": "Backpropagation",
      "blurb": "The chain rule applied backwards over a computation graph, producing the gradient of the loss with respect to every parameter in a network in a single backward pass — the algorithm that makes training possible at any real scale.",
      "chapters": [
        {
          "title": "The problem: too many parameters to check by hand",
          "blocks": [
            {
              "t": "p",
              "x": "Training a network by gradient descent means repeatedly adjusting every weight and bias to reduce a loss function, and each adjustment needs the loss's gradient with respect to that specific parameter — how much a tiny nudge to it would change the loss. The neural networks booklet built a network with a handful of parameters; a real one has millions to billions. The question this booklet answers is how to get every one of those gradients without an amount of work that scales with how many parameters there are."
            },
            {
              "t": "p",
              "x": "The naive approach is numerical: nudge one parameter by a tiny amount, rerun the entire forward pass, see how the loss changed, then put that parameter back and repeat for the next one. This works, but it costs one full forward pass per parameter — for a network with a billion weights, a billion forward passes just to take a single gradient-descent step. Backpropagation computes the exact gradient with respect to every parameter in the network using one forward pass and one backward pass, total, regardless of how many parameters there are. That asymmetry — constant cost in the number of parameters — is the entire reason deep learning is computationally feasible at all."
            },
            {
              "t": "note",
              "x": "“Backpropagation” specifically names reverse-mode automatic differentiation applied to a neural network's loss. The general technique (covered in this booklet's last chapter) is broader than neural networks, but this is the setting where the name comes from and where it's used constantly."
            }
          ]
        },
        {
          "title": "The chain rule over a computation graph",
          "blocks": [
            {
              "t": "p",
              "x": "The calculus chain rule says that for a composed function f(g(x)), the derivative df/dx equals df/dg times dg/dx — the rate of change of the outer function with respect to the inner one, times the rate of change of the inner function with respect to x. Any calculation, however deeply nested, can be broken down into a computation graph: a directed acyclic graph of primitive operations (add, multiply, and so on), where each node's output feeds forward into the next. Backpropagation is exactly the chain rule, applied systematically along every path in that graph, walking from the final output back to every input."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 400\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">computation graph: f(x,y,z) = (x+y)&#183;z &#8212; bold = forward value, muted = gradient &#8706;f/&#8706;&#183;</text>\n<circle cx=\"90\" cy=\"90\" r=\"24\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"90\" y=\"95\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">3</text>\n<text x=\"90\" y=\"130\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">x</text>\n<text x=\"90\" y=\"147\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">&#8706;f/&#8706;x = 2</text>\n<circle cx=\"90\" cy=\"250\" r=\"24\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"90\" y=\"255\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">-4</text>\n<text x=\"90\" y=\"290\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">y</text>\n<text x=\"90\" y=\"307\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">&#8706;f/&#8706;y = 2</text>\n<circle cx=\"330\" cy=\"170\" r=\"27\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/>\n<text x=\"330\" y=\"175\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">-1</text>\n<text x=\"330\" y=\"213\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">q = x + y</text>\n<text x=\"330\" y=\"230\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">&#8706;f/&#8706;q = 2</text>\n<circle cx=\"330\" cy=\"330\" r=\"24\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"330\" y=\"335\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">2</text>\n<text x=\"330\" y=\"370\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">z</text>\n<text x=\"330\" y=\"387\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">&#8706;f/&#8706;z = -1</text>\n<circle cx=\"580\" cy=\"250\" r=\"30\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/>\n<text x=\"580\" y=\"245\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">-2</text>\n<text x=\"580\" y=\"260\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">f = q&#183;z</text>\n<text x=\"580\" y=\"298\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">seed: &#8706;f/&#8706;f = 1</text>\n<line x1=\"112\" y1=\"97\" x2=\"308\" y2=\"158\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"112\" y1=\"243\" x2=\"308\" y2=\"185\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"356\" y1=\"178\" x2=\"554\" y2=\"238\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"352\" y1=\"322\" x2=\"554\" y2=\"262\" stroke=\"#23282B\" stroke-width=\"1\"/>\n</svg>",
              "cap": "Reverse-mode chain rule on a two-operation graph. Forward: q = x + y = 3 + (-4) = -1, then f = q&#183;z = (-1)(2) = -2. Backward, starting from the seed gradient &#8706;f/&#8706;f = 1: &#8706;f/&#8706;q = z = 2 (local derivative of a product), &#8706;f/&#8706;z = q = -1. Since q = x + y has local derivative 1 with respect to each of x and y, the chain rule gives &#8706;f/&#8706;x = &#8706;f/&#8706;q &#183; &#8706;q/&#8706;x = 2 &#183; 1 = 2, and &#8706;f/&#8706;y = 2 &#183; 1 = 2 the same way. All four values verified against finite differences."
            },
            {
              "t": "worked",
              "q": "Confirm ∂f/∂x = 2 in the figure using only the local derivatives at each node, without recomputing f from scratch.",
              "steps": [
                "The path from x to f goes through q: x → q → f.",
                "q's local derivative with respect to x is ∂q/∂x = 1, since q = x + y.",
                "f's local derivative with respect to q is ∂f/∂q = z = 2, since f = q·z.",
                "By the chain rule, ∂f/∂x = ∂f/∂q · ∂q/∂x = 2 · 1 = 2 — matching the figure, and each factor only ever needed the operation it belongs to."
              ]
            },
            {
              "t": "p",
              "x": "Notice each node only ever needs to know the derivative of its own tiny operation with respect to its own inputs — its local gradient. The chain rule chains these local derivatives together along a path from output back to any given variable. When a variable feeds into more than one downstream path (which does not happen in this small example but happens constantly in real networks, where one weight can influence many later computations), its total gradient is the sum of the contributions along every path — the multivariate form of the chain rule. This generalizes cleanly to arbitrarily large, branching computation graphs without changing the core idea."
            }
          ]
        },
        {
          "title": "Two passes: forward and backward",
          "blocks": [
            {
              "t": "p",
              "x": "The algorithm has exactly two phases. The forward pass computes and caches every intermediate value in the graph, exactly as the neural networks booklet's worked forward-pass example did. The backward pass starts at the output with a seed gradient of 1 (the loss's gradient with respect to itself), then walks the graph in reverse topological order — the reverse of the order values were computed — and at each node multiplies the gradient arriving from downstream by that node's own local derivative, producing the gradient with respect to each of its inputs, summing where a node had multiple downstream consumers."
            },
            {
              "t": "p",
              "x": "To make this concrete, reuse the exact network from the neural networks booklet: input x = [1, 2], first-layer weights W1 = [[0.5, -0.5], [1, 0]] and bias b1 = [0, 1], giving z1 = [-0.5, 2] and, after ReLU, h = [0, 2]; output weights w2 = [1, 0.5] and bias b2 = 0.3, giving y = 1.3. Attach a squared-error loss against a target t = 2: L = 0.5(y - t)² = 0.5(1.3 - 2)² = 0.245. Every gradient the network needs for one training step — with respect to W1, b1, w2, and b2 — comes out of a single backward pass through this same graph."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 430\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">backward pass over the nn booklet's own 2-2-1 network, target t = 2</text>\n<circle cx=\"90\" cy=\"110\" r=\"22\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/>\n<text x=\"90\" y=\"115\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">1</text>\n<text x=\"90\" y=\"146\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">x1</text>\n<circle cx=\"90\" cy=\"260\" r=\"22\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/>\n<text x=\"90\" y=\"265\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">2</text>\n<text x=\"90\" y=\"296\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">x2</text>\n<circle cx=\"330\" cy=\"90\" r=\"26\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"330\" y=\"85\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">0</text>\n<text x=\"330\" y=\"130\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">h1 (ReLU gate closed)</text>\n<text x=\"330\" y=\"147\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">&#8706;L/&#8706;z1[0] = 0</text>\n<circle cx=\"330\" cy=\"270\" r=\"26\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/>\n<text x=\"330\" y=\"265\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">2</text>\n<text x=\"330\" y=\"310\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">h2 (ReLU gate open)</text>\n<text x=\"330\" y=\"327\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">&#8706;L/&#8706;z1[1] = -0.35</text>\n<circle cx=\"580\" cy=\"180\" r=\"30\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/>\n<text x=\"580\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">1.3</text>\n<text x=\"580\" y=\"190\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">y</text>\n<text x=\"580\" y=\"228\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">L = 0.5(y-t)&#178; = 0.245</text>\n<text x=\"580\" y=\"245\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">&#8706;L/&#8706;y = -0.7</text>\n<line x1=\"110\" y1=\"115\" x2=\"308\" y2=\"94\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"110\" y1=\"115\" x2=\"308\" y2=\"256\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"110\" y1=\"255\" x2=\"308\" y2=\"98\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"110\" y1=\"255\" x2=\"308\" y2=\"266\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"356\" y1=\"96\" x2=\"554\" y2=\"172\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"356\" y1=\"266\" x2=\"554\" y2=\"186\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"60\" y1=\"365\" x2=\"640\" y2=\"365\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"60\" y=\"390\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">&#8706;L/&#8706;W1 = [[0, 0], [-0.35, -0.7]]     &#8706;L/&#8706;b1 = [0, -0.35]</text>\n<text x=\"60\" y=\"412\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">&#8706;L/&#8706;w2 = [0, -1.4]     &#8706;L/&#8706;b2 = -0.7</text>\n</svg>",
              "cap": "Same network and input as the forward-pass figure in the neural networks booklet, now with a target t = 2 and squared-error loss. The gradient flows backward from &#8706;L/&#8706;y = y - t = -0.7, through each weight, and is gated to exactly 0 wherever a ReLU was inactive on the forward pass (h1 = 0 here) &#8212; no gradient reaches W1's first row through that unit at all, for this particular input."
            },
            {
              "t": "worked",
              "q": "Derive ∂L/∂w2 and ∂L/∂W1 by hand, starting from ∂L/∂y.",
              "steps": [
                "∂L/∂y = y - t = 1.3 - 2 = -0.7 (the derivative of 0.5(y-t)² with respect to y).",
                "y = w2·h + b2, so ∂y/∂w2 = h = [0, 2]. By the chain rule, ∂L/∂w2 = ∂L/∂y · h = -0.7 × [0, 2] = [0, -1.4].",
                "∂y/∂h = w2 = [1, 0.5], so ∂L/∂h = -0.7 × [1, 0.5] = [-0.7, -0.35].",
                "h = ReLU(z1), whose local derivative is 1 where z1 > 0 and 0 where z1 ≤ 0. Here z1 = [-0.5, 2], so the ReLU gradient mask is [0, 1] — the first unit's gate is closed.",
                "∂L/∂z1 = ∂L/∂h × [0, 1] = [-0.7 × 0, -0.35 × 1] = [0, -0.35].",
                "z1 = W1x + b1, so ∂z1/∂W1 is x broadcast across each row; ∂L/∂W1 is the outer product ∂L/∂z1 ⊗ x = [0, -0.35] ⊗ [1, 2] = [[0, 0], [-0.35, -0.7]], matching the figure exactly."
              ]
            },
            {
              "t": "note",
              "x": "Because h1 = 0, the gate on the first hidden unit was closed on this forward pass, so ∂L/∂z1[0] = 0 no matter how large the incoming gradient from downstream is — nothing at all propagates back through that unit to W1's first row, for this particular input. This is the mechanism behind the neural networks booklet's “dead ReLU” term, seen for a single example rather than permanently."
            }
          ]
        },
        {
          "title": "Vanishing and exploding gradients",
          "blocks": [
            {
              "t": "p",
              "x": "In a deep network, the gradient of the loss with respect to an early layer's weights is a product of many local derivatives — one factor per layer standing between that weight and the loss, chained together exactly as in the two-node example above, just with many more links. If those local derivatives are consistently smaller than 1 in magnitude, as happens in the saturated regions of sigmoid or tanh (covered in the neural networks booklet), the product shrinks geometrically with depth: vanishing gradients, where the earliest layers receive a gradient so close to zero that they effectively stop learning, however long training runs."
            },
            {
              "t": "p",
              "x": "If those local derivatives are consistently larger than 1, the product instead grows geometrically with depth: exploding gradients, where parameter updates become enormous and training diverges outright, often visible as the loss suddenly turning into NaN. This is exactly the mechanistic reason ReLU — whose gradient is exactly 1 on its active side rather than shrinking toward the extremes — helps deep networks train where saturating activations struggle. Practical mitigations include gradient clipping (capping the norm of the gradient vector before applying an update, which directly targets exploding gradients without touching vanishing ones), careful weight initialization to keep the average local derivative near 1 across layers, and, further down this map, residual connections and LSTM/GRU-style gating, which both give gradients a more direct, less-multiplied path back to early layers."
            }
          ]
        },
        {
          "title": "Automatic differentiation, as frameworks actually implement it",
          "blocks": [
            {
              "t": "p",
              "x": "Deep learning frameworks like PyTorch and TensorFlow do not do backpropagation by symbolic algebra, and they do not approximate gradients numerically the way the naive approach in this booklet's first chapter did. They implement reverse-mode automatic differentiation: during the forward pass, the framework records every operation performed — its inputs, its output, and the rule for that operation type's local derivative — building the computation graph as a byproduct of simply running the forward computation. Calling backward() then walks that recorded graph in reverse, applying the chain rule at each recorded operation exactly as this booklet's worked examples did by hand, but automatically and for every parameter at once."
            },
            {
              "t": "p",
              "x": "There is also a forward-mode variant of automatic differentiation, which propagates derivatives forward alongside the values themselves rather than backward afterward. Forward-mode is cheap when a computation has few inputs and many outputs; reverse-mode is cheap when it has many inputs and few outputs. Training a neural network is almost always the second shape — millions to billions of input parameters, and a single scalar loss as the output — which is precisely why reverse-mode automatic differentiation, under the name backpropagation, is the dominant mode used throughout deep learning."
            },
            {
              "t": "note",
              "x": "In most frameworks the recorded graph is built fresh on every forward pass and discarded once backward() has run over it, unless the code explicitly asks to retain it — one reason a second call to backward() on the same forward pass, without retaining the graph, raises an error rather than silently doing nothing."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-derive the two worked examples with different numbers, and check the reasoning behind vanishing gradients and autodiff's efficiency."
            }
          ],
          "exercises": [
            {
              "q": "For f(x, y, z) = (x + y)·z with x = 5, y = -2, z = 3, compute ∂f/∂x, ∂f/∂y, and ∂f/∂z using the same local-gradient method as the worked figure.",
              "steps": [
                "Forward: q = x + y = 5 + (-2) = 3, then f = q·z = 3 × 3 = 9.",
                "Local derivatives: ∂f/∂q = z = 3, ∂f/∂z = q = 3, and ∂q/∂x = ∂q/∂y = 1.",
                "Chain rule: ∂f/∂x = ∂f/∂q · ∂q/∂x = 3 × 1 = 3, and ∂f/∂y = 3 × 1 = 3 the same way."
              ],
              "answer": "∂f/∂x = 3, ∂f/∂y = 3, ∂f/∂z = 3 (the last one directly, since ∂f/∂z is q itself)."
            },
            {
              "kind": "mc",
              "q": "Why is reverse-mode automatic differentiation the mode deep learning frameworks use, rather than forward-mode?",
              "options": [
                "Because training has many inputs (parameters) and one scalar output (the loss), which is exactly the shape reverse-mode is cheap for",
                "Because reverse-mode is more numerically precise than forward-mode",
                "Because forward-mode cannot be implemented for functions containing a ReLU",
                "Because reverse-mode does not require caching any intermediate values from the forward pass"
              ],
              "correct": 0,
              "steps": [
                "Forward-mode autodiff is cheap when there are few inputs and many outputs; reverse-mode is cheap when there are many inputs and few outputs.",
                "A network's training loss is one scalar computed from potentially billions of parameters — many inputs, one output.",
                "That shape is exactly what makes reverse-mode (backpropagation) far cheaper than running forward-mode once per parameter."
              ],
              "answer": "Reverse-mode is efficient precisely because training has many parameters (inputs) feeding into a single scalar loss (output) — the opposite shape is where forward-mode would win instead."
            },
            {
              "kind": "write",
              "q": "When many local derivatives smaller than 1 are multiplied together across many layers, the resulting gradient at early layers shrinks toward zero — a phenomenon called the ___ gradient problem.",
              "accept": [
                "vanishing",
                "vanishing gradient",
                "vanishing gradients"
              ],
              "hint": "the opposite of exploding",
              "steps": [
                "The gradient reaching an early layer is a product of one local derivative per layer between it and the loss.",
                "If those factors are consistently below 1 in magnitude, as with saturated sigmoid or tanh regions, the product shrinks geometrically with depth.",
                "The early layers then receive a gradient too small to meaningfully update their weights, even though later layers may still be learning fine."
              ],
              "answer": "Vanishing gradients — the product of many sub-1 local derivatives shrinks geometrically with depth, starving early layers of a usable gradient."
            },
            {
              "q": "Redo the backward pass over the same network (x=[1,2], W1=[[0.5,-0.5],[1,0]], b1=[0,1], w2=[1,0.5], b2=0.3, so z1=[-0.5,2], h=[0,2], y=1.3) but with target t = 0 instead of t = 2. Find ∂L/∂y and ∂L/∂W1.",
              "steps": [
                "∂L/∂y = y - t = 1.3 - 0 = 1.3.",
                "∂L/∂h = ∂L/∂y × w2 = 1.3 × [1, 0.5] = [1.3, 0.65].",
                "The ReLU gradient mask is still [0, 1] (it only depends on z1, which hasn't changed), so ∂L/∂z1 = [1.3 × 0, 0.65 × 1] = [0, 0.65].",
                "∂L/∂W1 = ∂L/∂z1 ⊗ x = [0, 0.65] ⊗ [1, 2] = [[0, 0], [0.65, 1.3]]."
              ],
              "answer": "∂L/∂y = 1.3, and ∂L/∂W1 = [[0, 0], [0.65, 1.3]] — same sign pattern as before flipped, since the error flipped sign, but the same unit stays gated off."
            },
            {
              "kind": "mc",
              "q": "A training run's loss suddenly jumps to a huge number and then NaN a few steps later. This is the classic signature of which problem, and what is the standard first fix to try?",
              "options": [
                "Exploding gradients; clip the gradient norm before applying each update",
                "Vanishing gradients; switch to a deeper network",
                "Overfitting; add more training data",
                "A dead ReLU; switch every activation to sigmoid"
              ],
              "correct": 0,
              "steps": [
                "A sudden blow-up in the loss, especially reaching NaN, is the signature of exploding gradients — parameter updates so large they overshoot into an unstable region.",
                "Gradient clipping caps the norm of the gradient vector before it's applied, directly bounding how large any single update can be.",
                "This targets exploding gradients specifically; it does nothing for vanishing gradients, which show up as training stalling rather than blowing up."
              ],
              "answer": "Exploding gradients — the standard first fix is gradient clipping, capping the gradient's norm before the update is applied."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Computation graph",
          "A directed acyclic graph of primitive operations whose forward evaluation computes a function, and whose reverse traversal computes its gradients."
        ],
        [
          "Local gradient",
          "The derivative of a single node's own operation with respect to its own inputs, independent of anything elsewhere in the graph."
        ],
        [
          "Chain rule",
          "The rule that the derivative of a composed function is the product of the derivatives of its parts."
        ],
        [
          "Multivariate chain rule",
          "The generalization used when a variable feeds multiple downstream paths: its total gradient is the sum of the contributions along each path."
        ],
        [
          "Forward pass",
          "Computing and caching every intermediate value in a computation graph, from inputs to output."
        ],
        [
          "Backward pass",
          "Walking a computation graph in reverse topological order, multiplying each node's local gradient by the gradient arriving from downstream."
        ],
        [
          "Seed gradient",
          "The gradient of the loss with respect to itself, always 1, that starts the backward pass."
        ],
        [
          "Reverse topological order",
          "Processing graph nodes so that every node is handled only after all nodes that depend on it."
        ],
        [
          "Vanishing gradient",
          "The exponential shrinkage of a gradient across many layers when local derivatives are consistently below 1 in magnitude."
        ],
        [
          "Exploding gradient",
          "The exponential growth of a gradient across many layers when local derivatives are consistently above 1 in magnitude."
        ],
        [
          "Gradient clipping",
          "Capping the norm of a gradient vector before applying an update, to control exploding gradients."
        ],
        [
          "Automatic differentiation (autodiff)",
          "Exact, mechanical computation of derivatives by applying the chain rule over a recorded sequence of operations."
        ],
        [
          "Reverse-mode autodiff",
          "Autodiff that propagates a gradient backward from a single output; cheap when there are many inputs and few outputs."
        ],
        [
          "Forward-mode autodiff",
          "Autodiff that propagates derivatives forward alongside values; cheap when there are few inputs and many outputs."
        ],
        [
          "Backpropagation",
          "The specific name for reverse-mode automatic differentiation applied to a neural network's loss."
        ],
        [
          "Dead ReLU gate",
          "A ReLU unit whose pre-activation was negative on a given input, so its local gradient is exactly 0 and nothing propagates back through it for that input."
        ]
      ]
    },
  "rl":   {
      "title": "Reinforcement Learning",
      "blurb": "Learning a policy from a scalar reward signal instead of labeled examples — sequential decision-making under uncertainty, and the algorithms (Q-learning, policy gradients) that make it tractable.",
      "chapters": [
        {
          "title": "Learning from reward instead of labels",
          "blocks": [
            {
              "t": "p",
              "x": "Supervised learning, as the supervised learning booklet covers, trains on a fixed set of labeled examples: for a given input, there is a known correct output, and the model is scored against it directly. Reinforcement learning has no such labels. Instead, an agent interacts with an environment over a sequence of steps: at each step it observes a state, takes an action, and receives a scalar reward, with the goal of choosing actions that maximize its total reward over time — not the reward of the very next step alone, but the cumulative reward of the whole trajectory."
            },
            {
              "t": "p",
              "x": "Two things make this genuinely harder than supervised learning, not just differently framed. First, feedback can be delayed: an action taken now might only pay off (or turn out to have been a mistake) many steps later, so the agent has to work out which of its earlier choices deserve credit for a reward it just received — the credit assignment problem. Second, the data isn't an independent, identically distributed sample the way a supervised training set is: the agent's own current policy determines which states and actions it even experiences, so the data distribution shifts as the policy improves, and the agent has to balance trying what it already believes is good against trying new things to find out whether something is better."
            },
            {
              "t": "note",
              "x": "This framing covers a wide range of real settings with the same shape: a game-playing agent (reward = win or lose), a robot (reward = task completion, or a shaped signal along the way), or a recommendation system (reward = a user's engagement) all fit the same state/action/reward loop."
            }
          ]
        },
        {
          "title": "Markov decision processes",
          "blocks": [
            {
              "t": "p",
              "x": "The standard formalism is a Markov decision process (MDP), defined by a set of states S, a set of actions A, transition probabilities P(s′|s,a) — the probability of landing in state s′ given that action a was taken in state s — a reward function R(s,a,s′), and a discount factor γ. The Markov property is the assumption baked into P: the next state depends only on the current state and action, not on the full history of how the agent arrived there. A policy π(a|s) is the agent's (possibly randomized) rule for choosing an action given a state."
            },
            {
              "t": "p",
              "x": "The discount factor γ ∈ [0,1) does two jobs at once: it keeps an infinite-horizon sum of future rewards finite (a geometric series, since each future reward is weighted by a shrinking power of γ), and it encodes a preference for reward sooner rather than later, all else equal. A γ close to 0 makes the agent nearly myopic, caring almost entirely about immediate reward; a γ close to 1 makes it far-sighted, weighing distant future reward almost as heavily as immediate reward."
            }
          ]
        },
        {
          "title": "Value functions and the Bellman equation",
          "blocks": [
            {
              "t": "p",
              "x": "The state-value function V^π(s) is the expected discounted return (sum of future rewards, each discounted by γ raised to how many steps away it is) starting from state s and following policy π thereafter. The action-value function Q^π(s,a) is the same idea starting from state s, taking a specific action a first, and then following π. The optimal value function V*(s) = max_π V^π(s) is the best possible expected return achievable from s under any policy."
            },
            {
              "t": "p",
              "x": "These satisfy the Bellman equation, which expresses a state's value recursively in terms of its possible successor states' values: V*(s) = max_a Σ_s′ P(s′|s,a)[R(s,a,s′) + γV*(s′)]. This is the same self-referential structure the dynamic programming booklet uses for overlapping subproblems — the value of being in a state is defined in terms of the value of the states reachable from it, one step of discount away."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">a 3-state chain MDP, discount &#947; = 0.9, solved by the Bellman optimality equation</text>\n<circle cx=\"110\" cy=\"140\" r=\"36\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.8\"/>\n<text x=\"110\" y=\"136\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" font-weight=\"700\">S0</text>\n<text x=\"110\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">V* = 8</text>\n<circle cx=\"350\" cy=\"140\" r=\"36\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/>\n<text x=\"350\" y=\"136\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" font-weight=\"700\">S1</text>\n<text x=\"350\" y=\"154\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">V* = 10</text>\n<circle cx=\"590\" cy=\"140\" r=\"36\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/>\n<circle cx=\"590\" cy=\"140\" r=\"30\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.2\"/>\n<text x=\"590\" y=\"136\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" font-weight=\"700\">S2</text>\n<text x=\"590\" y=\"154\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">V* = 0</text>\n<line x1=\"146\" y1=\"140\" x2=\"314\" y2=\"140\" stroke=\"#23282B\" stroke-width=\"1.4\"/>\n<text x=\"228\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"#DDE3E7\">advance &#183; r = &#8722;1</text>\n<line x1=\"386\" y1=\"140\" x2=\"554\" y2=\"140\" stroke=\"#23282B\" stroke-width=\"1.4\"/>\n<text x=\"470\" y=\"120\" text-anchor=\"middle\" font-size=\"12\" fill=\"#DDE3E7\">advance &#183; r = +10</text>\n<text x=\"590\" y=\"200\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">terminal</text>\n<text x=\"350\" y=\"240\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">Bellman optimality: V*(s) = r + &#947;&#183;V*(s&#8242;)</text>\n<text x=\"60\" y=\"285\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">V*(S1) = 10 + 0.9(0) = 10</text>\n<text x=\"60\" y=\"308\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">V*(S0) = -1 + 0.9(10) = 8</text>\n</svg>",
              "cap": "A deterministic chain MDP with one action (\"advance\") per state. Because it's deterministic, the Bellman optimality equation's max and sum-over-successors both collapse to a single term, so value iteration is just working backward from the terminal state: V*(S2) = 0 by definition, then V*(S1) = 10 + 0.9 &#215; 0 = 10, then V*(S0) = -1 + 0.9 &#215; 10 = 8."
            },
            {
              "t": "worked",
              "q": "Verify V*(S0) = 8 in the figure by applying the Bellman optimality equation from S2 backward.",
              "steps": [
                "S2 is terminal, so by definition V*(S2) = 0 — there is no future reward left to collect once there.",
                "S1 has one action (advance) leading deterministically to S2 with reward +10, so the max and the sum over successors both collapse to one term: V*(S1) = 10 + γ·V*(S2) = 10 + 0.9(0) = 10.",
                "S0 has one action leading deterministically to S1 with reward -1: V*(S0) = -1 + γ·V*(S1) = -1 + 0.9(10) = -1 + 9 = 8, matching the figure."
              ]
            }
          ]
        },
        {
          "title": "Q-learning",
          "blocks": [
            {
              "t": "p",
              "x": "The Bellman equation above assumes the agent already knows P and R — the environment's dynamics. Q-learning instead learns Q(s,a) directly from experienced transitions, without ever building an explicit model of P or R: it's model-free. It's also off-policy: it learns an estimate of the optimal Q* regardless of which policy is actually being followed to generate the experience, which means an agent can learn optimal behavior while acting partly randomly in order to explore."
            },
            {
              "t": "p",
              "x": "The update rule, applied after each observed transition (s, a, r, s′), is a temporal-difference (TD) update: Q(s,a) ← Q(s,a) + α[r + γ·max_a′ Q(s′,a′) − Q(s,a)]. The bracketed term is the TD error — the difference between a new, partly-bootstrapped estimate of the value (the reward just received, plus the discounted value of the best action available next) and the current estimate. α is a learning rate controlling how much each new observation is trusted to move the estimate."
            },
            {
              "t": "worked",
              "q": "Starting from Q(s,a) = 0 everywhere, α = 0.5, γ = 0.9, apply the Q-learning update to the two transitions of one episode through the chain MDP above: S0 →(r=-1)→ S1, then S1 →(r=+10)→ S2.",
              "steps": [
                "First transition, (S0, advance, r=-1, S1): Q(S0,advance) ← 0 + 0.5[-1 + 0.9·max_a′Q(S1,a′) - 0] = 0.5[-1 + 0.9(0)] = 0.5(-1) = -0.5.",
                "Second transition, (S1, advance, r=+10, S2): Q(S1,advance) ← 0 + 0.5[10 + 0.9·0 - 0] = 0.5(10) = 5, since S2 is terminal and contributes no further value.",
                "After just this one episode: Q(S0,advance) = -0.5, Q(S1,advance) = 5. Repeating episodes like this drives both estimates toward the true optimal values computed with the Bellman equation, V*(S0)=8 and V*(S1)=10 — a direct simulation confirms convergence to exactly those numbers after enough episodes."
              ]
            },
            {
              "t": "note",
              "x": "Notice Q-learning bootstraps from its own current (still-wrong) estimate of Q(S1,advance) when updating Q(S0,advance) — the estimates only become accurate together, gradually, as experience accumulates, not one at a time in isolation."
            }
          ]
        },
        {
          "title": "Policy gradients",
          "blocks": [
            {
              "t": "p",
              "x": "Q-learning is value-based: it learns value estimates and acts greedily with respect to them. A policy-gradient method takes a different approach, directly parameterizing the policy itself, π(a|s;θ) — often as a neural network, using exactly the backpropagation machinery covered earlier in this map — and adjusting θ by gradient ascent on expected return, rather than learning value estimates as an intermediate step at all."
            },
            {
              "t": "p",
              "x": "The REINFORCE update is the simplest form: ∇_θJ(θ) = E[∇_θ log π(a|s;θ) · G_t], where G_t is the actual discounted return observed following that action. The intuition is direct: increase the probability of actions that led to a higher-than-expected return, and decrease the probability of actions that led to a lower-than-expected one. Because π is a differentiable function of θ, this gradient is computed with the same reverse-mode automatic differentiation as any other network — the only difference from a supervised loss is what's being multiplied by the log-probability."
            },
            {
              "t": "p",
              "x": "Raw returns make for a noisy training signal — unlike supervised learning, each sample is one particular trajectory through a stochastic environment, not an i.i.d. draw with a known correct answer. Subtracting a learned baseline, typically an estimate of the state value V(s), gives the advantage A_t = G_t − V(s): this doesn't change the expected gradient at all (a constant baseline has zero expected effect on the gradient direction) but substantially reduces its variance in practice. Actor-critic methods build on exactly this: an actor (the policy) is trained with a policy-gradient update, while a critic (a learned value function) supplies the baseline that keeps that update's variance manageable."
            }
          ]
        },
        {
          "title": "Exploration, exploitation, and reward hacking",
          "blocks": [
            {
              "t": "p",
              "x": "An agent that always acts greedily with respect to its current estimates can get stuck exploiting a mediocre option it happened to find early, since it never tries anything else to find out whether something better exists — the exploration-exploitation tradeoff. ε-greedy is the simplest fix: with probability 1−ε, take the currently best-known action (exploit); with probability ε, take a random action instead (explore). ε is a direct, tunable knob on how much exploration the agent does."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 380\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">&#949;-greedy action selection over 1,000 decisions, &#949; = 0.1</text>\n<text x=\"20\" y=\"46\" font-size=\"11.5\" fill=\"#666D72\">each step: exploit with probability 1&#8722;&#949;, or explore (act randomly) with probability &#949;</text>\n<line x1=\"90\" y1=\"320\" x2=\"580\" y2=\"320\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<rect x=\"160\" y=\"140\" width=\"160\" height=\"180\" fill=\"#0E1113\" stroke=\"#FFFFFF\" stroke-width=\"1.6\"/>\n<text x=\"240\" y=\"125\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">900 decisions</text>\n<text x=\"240\" y=\"345\" text-anchor=\"middle\" font-size=\"12\" fill=\"#DDE3E7\">exploit &#8212; prob 1&#8722;&#949; = 0.9</text>\n<text x=\"240\" y=\"362\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">choose argmax_a Q(s,a)</text>\n<rect x=\"440\" y=\"300\" width=\"160\" height=\"20\" fill=\"#0E1113\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/>\n<text x=\"520\" y=\"285\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">100 decisions</text>\n<text x=\"520\" y=\"345\" text-anchor=\"middle\" font-size=\"12\" fill=\"#DDE3E7\">explore &#8212; prob &#949; = 0.1</text>\n<text x=\"520\" y=\"362\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">choose a random action</text>\n</svg>",
              "cap": "Bar heights are proportional to count out of 1,000 decisions (200px = 1,000). At &#949; = 0.1, about 900 of every 1,000 action choices exploit the currently best-known action and about 100 explore randomly instead &#8212; the knob that trades known-good behavior for the chance of finding something better."
            },
            {
              "t": "worked",
              "q": "At ε = 0.1, out of 1,000 action choices, how many are expected to exploit and how many to explore?",
              "steps": [
                "Exploit probability is 1 − ε = 0.9, so expected exploit count is 1000 × 0.9 = 900.",
                "Explore probability is ε = 0.1, so expected explore count is 1000 × 0.1 = 100.",
                "These two counts sum to the full 1,000 decisions, as they must."
              ]
            },
            {
              "t": "p",
              "x": "The reward function is only ever a proxy for what its designer actually wants, and an RL agent optimizes exactly the proxy it was given — not the designer's underlying intent, which it has no access to. Reward hacking (also called specification gaming) is what happens when a sufficiently capable agent finds a way to score highly on the literal reward signal that doesn't reflect genuine task success: a boat-racing agent that loops through a scoring checkpoint indefinitely instead of finishing the race, or a cleaning robot rewarded for “no visible mess” that learns to hide the mess rather than remove it. This is not a hypothetical edge case; it recurs constantly whenever a reward function is even slightly misaligned with true intent, which is exactly why reward design is treated as a genuinely hard, first-class problem — and it's precisely the concern the evaluation and alignment booklet returns to at the scale of large language models."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-run the Bellman and ε-greedy calculations with different numbers and check the reasoning behind off-policy learning and reward hacking."
            }
          ],
          "exercises": [
            {
              "q": "Using the same chain MDP shape (S0 → S1 → S2, one action per state) but with reward +20 for S1→S2 and discount γ = 0.5, compute V*(S0).",
              "steps": [
                "V*(S2) = 0 by definition (terminal state).",
                "V*(S1) = 20 + γ·V*(S2) = 20 + 0.5(0) = 20.",
                "V*(S0) = -1 + γ·V*(S1) = -1 + 0.5(20) = -1 + 10 = 9."
              ],
              "answer": "V*(S0) = 9 — the smaller discount factor pulls the future +20 reward's contribution down more sharply than γ = 0.9 did."
            },
            {
              "kind": "mc",
              "q": "What specifically makes Q-learning an off-policy algorithm?",
              "options": [
                "It updates its estimate of the optimal Q* using max_a′Q(s′,a′), regardless of which action the current (possibly exploring) policy actually takes next",
                "It never uses a discount factor",
                "It only works when the environment is deterministic",
                "It requires a full model of the environment's transition probabilities before it can learn"
              ],
              "correct": 0,
              "steps": [
                "The Q-learning update bootstraps using max_a′Q(s′,a′) — the value of the best action available next — not the value of whatever action the agent's actual (behavior) policy happens to take.",
                "This means the target it's learning toward is always the optimal policy's value, even while the agent behaves differently (e.g. exploring randomly some of the time) to generate its experience.",
                "That's the definition of off-policy: learning about one policy (the optimal one) while following a different one (the behavior policy) to generate data."
              ],
              "answer": "It bootstraps its update from max_a′Q(s′,a′) — the optimal next action's value — rather than from whatever action its own behavior policy actually took, so it learns the optimal policy's values while following a different, exploring policy."
            },
            {
              "kind": "write",
              "q": "The function giving the expected discounted return of starting in state s, taking action a, and following policy π thereafter is called the ___ function.",
              "accept": [
                "action-value",
                "action value",
                "q-function",
                "q function",
                "action-value function",
                "q"
              ],
              "hint": "written Q(s,a)",
              "steps": [
                "V(s) is the value of a state alone, under a policy that chooses the action.",
                "Q(s,a) is the value of a state with a specific first action fixed, before the policy takes over for the rest.",
                "This distinction is exactly why Q-learning can act greedily by just taking max_a Q(s,a), without needing a separate model of transitions to figure out which action leads to the best next state."
              ],
              "answer": "The action-value function, Q(s,a) — the expected discounted return of taking action a in state s and following π afterward."
            },
            {
              "q": "At ε = 0.2, out of 500 action choices, how many are expected to exploit and how many to explore?",
              "steps": [
                "Exploit probability is 1 − ε = 0.8, so expected exploit count is 500 × 0.8 = 400.",
                "Explore probability is ε = 0.2, so expected explore count is 500 × 0.2 = 100."
              ],
              "answer": "400 expected to exploit, 100 expected to explore."
            },
            {
              "kind": "mc",
              "q": "A cleaning robot is rewarded whenever a camera reports no visible mess in a room. After training, it learns to shove mess under furniture rather than clean it up. What is this an example of?",
              "options": [
                "Reward hacking (specification gaming): the agent optimized the literal reward signal (no visible mess) rather than the designer's actual intent (a clean room)",
                "Vanishing gradients preventing the policy from learning correctly",
                "The exploration-exploitation tradeoff being set too high",
                "An off-policy learning error specific to Q-learning"
              ],
              "correct": 0,
              "steps": [
                "The reward function (\"no visible mess\") is a proxy for the actual goal (\"a clean room\"), and the two came apart in a way the designer didn't intend.",
                "The agent found a way to score highly on the literal proxy — hiding the mess — without achieving the underlying goal it was meant to stand in for.",
                "This is exactly what reward hacking / specification gaming names, and it happens with any RL algorithm, not something specific to Q-learning or exploration settings."
              ],
              "answer": "Reward hacking (specification gaming) — the agent optimized the literal reward signal rather than the designer's actual intent, because the two were never quite the same thing."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Agent",
          "The learner/decision-maker that chooses actions based on observed states in reinforcement learning."
        ],
        [
          "Environment",
          "Everything the agent interacts with, which responds to its actions with a new state and a reward."
        ],
        [
          "State",
          "A description of the situation the agent currently faces."
        ],
        [
          "Action",
          "A choice available to the agent in a given state."
        ],
        [
          "Reward",
          "A scalar feedback signal received after an action, which the agent aims to maximize the cumulative sum of."
        ],
        [
          "Policy",
          "A (possibly stochastic) rule π(a|s) mapping states to a choice of action."
        ],
        [
          "Markov property",
          "The assumption that the next state depends only on the current state and action, not on the full history."
        ],
        [
          "Discount factor (γ)",
          "A value in [0,1) that keeps infinite-horizon returns finite and weights future reward less than immediate reward."
        ],
        [
          "Value function (V)",
          "The expected discounted return of being in a state and following a given policy thereafter."
        ],
        [
          "Action-value function (Q)",
          "The expected discounted return of taking a specific action in a state, then following a policy thereafter."
        ],
        [
          "Bellman equation",
          "The recursive equation expressing a state's value in terms of the discounted values of its successor states."
        ],
        [
          "Model-free",
          "Learning directly from experienced transitions, without building an explicit model of the environment's dynamics."
        ],
        [
          "Off-policy",
          "Learning the value of one policy (often the optimal one) while following a different policy to generate experience."
        ],
        [
          "TD error",
          "The difference between a bootstrapped new estimate of a value and the current estimate, used to drive a temporal-difference update."
        ],
        [
          "Policy gradient",
          "A method that directly optimizes a parameterized policy's parameters via gradient ascent on expected return."
        ],
        [
          "Baseline / advantage",
          "A subtracted reference value (often V(s)) that reduces a policy gradient estimate's variance without changing its expected direction."
        ],
        [
          "Actor-critic",
          "A policy-gradient method pairing a learned policy (actor) with a learned value function (critic) that supplies its baseline."
        ],
        [
          "Epsilon-greedy",
          "Exploiting the best-known action with probability 1−ε and exploring a random action with probability ε."
        ],
        [
          "Reward hacking / specification gaming",
          "An agent scoring highly on a literal reward signal in a way that doesn't reflect the designer's actual intent."
        ]
      ]
    },
  "rnn":   {
        "title": "Sequence Models",
        "blurb": "Recurrent networks carry a hidden state forward through a sequence, one step at a time, so the same small set of weights can process inputs of any length — and run headlong into the vanishing-gradient problem that motivated everything attention does differently.",
        "chapters": [
            {
                "title": "Why a fixed-size network doesn't fit a sequence",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Everything in the neural networks and backpropagation booklets processed one fixed-size input at a time: a vector of a known length in, a vector out. Text, audio, sensor readings and time series don't come in a fixed length — a sentence might be 4 words or 40, an audio clip a second or an hour. A plain feedforward network would need a different set of weights for every possible input length, which is both impossible to train (most lengths are seen rarely, if ever) and wasteful (the network learns 'the pattern of two words after a comma' completely separately at every position it happens to occur)."
                    },
                    {
                        "t": "p",
                        "x": "A recurrent neural network (RNN) solves both problems with one idea: reuse the same small set of weights at every position in the sequence, and carry a hidden state — a running summary of everything seen so far — from one position to the next. Because the weights don't change with position, the network can be run over a sequence of any length, and a pattern learned at one position transfers automatically to every other position."
                    },
                    {
                        "t": "note",
                        "x": "This is weight sharing again, the same idea the convolutional networks booklet uses across a grid of pixels — except here the sharing is across time steps rather than spatial positions."
                    }
                ]
            },
            {
                "title": "The recurrent cell and unrolling in time",
                "blocks": [
                    {
                        "t": "p",
                        "x": "The core of a simple ('vanilla') RNN is one equation, applied at every time step t: h_t = tanh(w_xh&#183;x_t + w_hh&#183;h_{t-1} + b_h). The hidden state h_t depends on the current input x_t and on the previous hidden state h_{t-1}, run through the same weights w_xh, w_hh and bias b_h no matter what t is. h_0, the hidden state before anything has been seen, is conventionally initialized to zero. An output y_t — a prediction at that time step — is then typically produced from h_t by a further weight, y_t = w_hy&#183;h_t + b_y."
                    },
                    {
                        "t": "p",
                        "x": "Because the same equation is applied repeatedly, it helps to draw the computation 'unrolled': one copy of the cell per time step, with the hidden state flowing from each copy into the next. This is exactly the same underlying network at every step, just drawn out in time rather than compressed into a loop — and it's this unrolled picture that backpropagation is actually run over."
                    },
                    {
                        "t": "fig",
                        "svg": "<svg viewBox=\"0 0 840 470\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">unrolled over 3 timesteps &#8212; same weights (w_xh=0.5, w_hh=0.8, b_h=0.1, w_hy=1.2) reused every step</text><circle cx=\"40\" cy=\"250\" r=\"20\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"4,3\"/><text x=\"40\" y=\"255\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">0</text><text x=\"40\" y=\"288\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">h&#8320;</text><circle cx=\"180\" cy=\"400\" r=\"20\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/><text x=\"180\" y=\"405\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">1</text><text x=\"180\" y=\"438\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">x1</text><circle cx=\"180\" cy=\"250\" r=\"26\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/><text x=\"180\" y=\"255\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">0.537</text><text x=\"216\" y=\"246\" text-anchor=\"start\" font-size=\"11\" fill=\"#666D72\">h1</text><text x=\"216\" y=\"262\" text-anchor=\"start\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">z=0.600</text><circle cx=\"180\" cy=\"90\" r=\"22\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/><text x=\"180\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">0.644</text><text x=\"180\" y=\"58\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">y1</text><line x1=\"180\" y1=\"380\" x2=\"180\" y2=\"278\" stroke=\"#23282B\" stroke-width=\"1\"/><line x1=\"180\" y1=\"222\" x2=\"180\" y2=\"112\" stroke=\"#23282B\" stroke-width=\"1\"/><line x1=\"60\" y1=\"250\" x2=\"154\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\"/><circle cx=\"440\" cy=\"400\" r=\"20\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/><text x=\"440\" y=\"405\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">-1</text><text x=\"440\" y=\"438\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">x2</text><circle cx=\"440\" cy=\"250\" r=\"26\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/><text x=\"440\" y=\"255\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">0.030</text><text x=\"476\" y=\"246\" text-anchor=\"start\" font-size=\"11\" fill=\"#666D72\">h2</text><text x=\"476\" y=\"262\" text-anchor=\"start\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">z=0.030</text><circle cx=\"440\" cy=\"90\" r=\"22\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/><text x=\"440\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">0.036</text><text x=\"440\" y=\"58\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">y2</text><line x1=\"440\" y1=\"380\" x2=\"440\" y2=\"278\" stroke=\"#23282B\" stroke-width=\"1\"/><line x1=\"440\" y1=\"222\" x2=\"440\" y2=\"112\" stroke=\"#23282B\" stroke-width=\"1\"/><line x1=\"206\" y1=\"250\" x2=\"414\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\"/><circle cx=\"700\" cy=\"400\" r=\"20\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/><text x=\"700\" y=\"405\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">1</text><text x=\"700\" y=\"438\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">x3</text><circle cx=\"700\" cy=\"250\" r=\"26\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.8\"/><text x=\"700\" y=\"255\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-weight=\"700\">0.554</text><text x=\"736\" y=\"246\" text-anchor=\"start\" font-size=\"11\" fill=\"#666D72\">h3</text><text x=\"736\" y=\"262\" text-anchor=\"start\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">z=0.624</text><circle cx=\"700\" cy=\"90\" r=\"22\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"2\"/><text x=\"700\" y=\"95\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">0.664</text><text x=\"700\" y=\"58\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">y3</text><line x1=\"700\" y1=\"380\" x2=\"700\" y2=\"278\" stroke=\"#23282B\" stroke-width=\"1\"/><line x1=\"700\" y1=\"222\" x2=\"700\" y2=\"112\" stroke=\"#23282B\" stroke-width=\"1\"/><line x1=\"466\" y1=\"250\" x2=\"674\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\"/></svg>",
                        "cap": "Same scalar cell h_t = tanh(w_xh&#183;x_t + w_hh&#183;h_{t-1} + b_h) reused at every step, with h&#8320;=0. Step 1: z&#8321;=0.5(1)+0.8(0)+0.1=0.600, h&#8321;=tanh(0.600)=0.537, y&#8321;=1.2(0.537)=0.644. Step 2: z&#8322;=0.5(-1)+0.8(0.537)+0.1=0.030, h&#8322;=tanh(0.030)&#8776;0.030, y&#8322;=1.2(0.030)=0.036. Step 3: z&#8323;=0.5(1)+0.8(0.030)+0.1=0.624, h&#8323;=tanh(0.624)=0.554, y&#8323;=1.2(0.554)=0.664 &#8212; all four decimals hand-checked against a direct tanh evaluation."
                    },
                    {
                        "t": "worked",
                        "q": "Verify h_2 = 0.030 in the figure by hand, given h_1 = 0.537, x_2 = -1, w_xh=0.5, w_hh=0.8, b_h=0.1.",
                        "steps": [
                            "z_2 = w_xh&#183;x_2 + w_hh&#183;h_1 + b_h = 0.5(-1) + 0.8(0.537) + 0.1.",
                            "= -0.5 + 0.4296 + 0.1 = 0.0296.",
                            "h_2 = tanh(0.0296). For small z, tanh(z) &#8776; z, so h_2 &#8776; 0.0296, which rounds to 0.030 — matching the figure."
                        ],
                        "answer": "h_2 = tanh(0.0296) &#8776; 0.030, confirming the figure. Notice how close h_1 and h_2's contributions nearly cancel here (a large positive h_1 times 0.8, against a negative x_2) — small differences in early state can swing later state a great deal."
                    }
                ]
            },
            {
                "title": "Backpropagation through time",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Training an RNN means running backpropagation over the unrolled graph from the previous chapter, exactly as the backpropagation booklet describes for any computation graph — this specific application has its own name, backpropagation through time (BPTT), because the graph being walked backward happens to represent the same cell repeated across time steps rather than different layers stacked in depth."
                    },
                    {
                        "t": "p",
                        "x": "Because the same weights w_hh appear at every step, the gradient with respect to w_hh accumulates contributions from every time step at once — the total gradient is a sum over all the places that weight was used, exactly the multivariate chain rule the backpropagation booklet calls out for a variable that feeds multiple downstream paths. In practice this means one weight update per full sequence (or per truncated chunk of one, for very long sequences — truncated BPTT), not one per step."
                    },
                    {
                        "t": "note",
                        "x": "Truncated BPTT caps how far back gradients are actually propagated, splitting a long sequence into chunks and treating the hidden state carried into a chunk as a constant (not differentiated through) for that chunk's backward pass. It trades some accuracy in long-range credit assignment for the ability to train on sequences that would otherwise be too long to unroll in memory at all."
                    }
                ]
            },
            {
                "title": "Why long sequences are hard: vanishing gradients over time",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Walking the gradient backward through the unrolled graph, one step at a time, multiplies the running gradient by the local derivative at each step: roughly w_hh&#183;(1-h_t&#178;), since h_t = tanh(z_t) and tanh's derivative is 1-tanh(z_t)&#178;. Over many steps, that's a long product of factors — and exactly the same geometric shrinkage or growth the backpropagation booklet describes for deep feedforward networks, except here 'depth' means sequence length rather than layer count. A sequence of length 100 backpropagates through, in effect, a 100-layer network that happens to share its weights at every layer."
                    },
                    {
                        "t": "fig",
                        "svg": "<svg viewBox=\"0 0 760 400\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">gradient magnitude walking backward through the 6-step unroll (seed = 1.0 at the final step)</text><line x1=\"70\" y1=\"320\" x2=\"720\" y2=\"320\" stroke=\"#23282B\" stroke-width=\"1\"/><rect x=\"88.6\" y=\"60.0\" width=\"55.7\" height=\"260.0\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.6\"/><text x=\"116.4\" y=\"52.0\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">1.000</text><text x=\"116.4\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t</text><rect x=\"181.4\" y=\"112.5\" width=\"55.7\" height=\"207.5\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><text x=\"209.3\" y=\"104.5\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">0.798</text><text x=\"209.3\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t-1</text><rect x=\"274.3\" y=\"206.2\" width=\"55.7\" height=\"113.8\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><text x=\"302.1\" y=\"198.2\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">0.438</text><text x=\"302.1\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t-2</text><rect x=\"367.1\" y=\"229.2\" width=\"55.7\" height=\"90.8\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><text x=\"395.0\" y=\"221.2\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">0.349</text><text x=\"395.0\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t-3</text><rect x=\"460.0\" y=\"269.6\" width=\"55.7\" height=\"50.4\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><text x=\"487.9\" y=\"261.6\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">0.194</text><text x=\"487.9\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t-4</text><rect x=\"552.9\" y=\"279.7\" width=\"55.7\" height=\"40.3\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><text x=\"580.7\" y=\"271.7\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">0.155</text><text x=\"580.7\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t-5</text><rect x=\"645.7\" y=\"297.1\" width=\"55.7\" height=\"22.9\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><text x=\"673.6\" y=\"289.1\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#DDE3E7\" class=\"mono\">0.088</text><text x=\"673.6\" y=\"340\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">t-6</text><text x=\"70\" y=\"368\" font-size=\"12\" fill=\"#666D72\">steps back from where the loss was seeded</text></svg>",
                        "cap": "Each step back multiplies the running gradient by w_hh&#183;(1-h_t&#178;) &#8212; the recurrent weight times the local tanh derivative at that step's hidden state, using the same h_t sequence as the unroll above extended to 6 steps. With w_hh=0.8 and every (1-h_t&#178;) below 1, the product shrinks on almost every step: 1.0 &#8594; 0.798 &#8594; 0.4375 &#8594; 0.349 &#8594; 0.194 &#8594; 0.155 &#8594; 0.088, roughly an 11&#215; drop over 6 steps back &#8212; the same geometric shrinkage the backpropagation booklet describes for deep feedforward networks, except here depth means sequence length rather than layer count."
                    },
                    {
                        "t": "p",
                        "x": "This is the practical reason plain RNNs struggle to learn dependencies spanning more than a handful of steps: by the time a gradient has walked back far enough to reach an early input, it has often shrunk (or, less commonly with a well-tuned w_hh, exploded) past the point of being useful. A model that needs to connect a pronoun to a noun forty words earlier in a sentence is exactly the setting where this failure shows up."
                    }
                ]
            },
            {
                "title": "LSTM and GRU gating",
                "blocks": [
                    {
                        "t": "p",
                        "x": "The long short-term memory cell (LSTM) fixes the vanishing-gradient problem structurally rather than by tuning weights harder. Instead of overwriting the hidden state at every step, an LSTM maintains a separate cell state c_t that is updated additively, gated by three learned sigmoid gates: a forget gate (how much of the old cell state to keep), an input gate (how much of a new candidate value to add), and an output gate (how much of the cell state to expose as the hidden state). Because the cell state's update is c_t = forget_t &#8857; c_{t-1} + input_t &#8857; candidate_t — a sum, not a repeated multiplication by a single weight — a gradient can flow back along the cell-state path with far less shrinkage than in a plain RNN, as long as the forget gate stays open (near 1)."
                    },
                    {
                        "t": "p",
                        "x": "This additive path is the same fix in spirit as the residual connections the convolutional networks booklet uses to keep gradients flowing through very deep networks: give the gradient a route back that doesn't require multiplying through a squashing nonlinearity at every single step."
                    },
                    {
                        "t": "p",
                        "x": "The gated recurrent unit (GRU) is a simplified alternative with two gates instead of three (an update gate and a reset gate) and no separate cell state, usually performing comparably to an LSTM with fewer parameters. Both largely superseded plain RNNs for sequence tasks that need to remember things over more than a few steps, right up until attention offered a different way to reach back across a sequence entirely."
                    },
                    {
                        "t": "note",
                        "x": "'Gating' in this sense — a learned sigmoid output between 0 and 1, multiplied elementwise against a value to control how much of it passes through — is a recurring building block, not unique to LSTMs; it reappears throughout later architectures whenever a network needs to learn how much of a signal to let through."
                    }
                ]
            },
            {
                "title": "Sequence-to-sequence and the limits that motivate attention",
                "blocks": [
                    {
                        "t": "p",
                        "x": "A common pattern chains two RNNs: an encoder reads an entire input sequence (say, a sentence in one language) and compresses everything into a single final hidden state, and a decoder RNN then generates an output sequence (a translation) starting from that one vector. This works, but that single final hidden state is a hard bottleneck — the encoder has to squeeze an arbitrarily long input into one fixed-size vector, and the decoder can only ever consult that one summary, not go back and look at any particular earlier word directly."
                    },
                    {
                        "t": "p",
                        "x": "RNNs also process a sequence strictly one step at a time by construction — step t needs h_{t-1}, which needs h_{t-2}, and so on — which means the computation cannot be parallelized across the sequence dimension even with unlimited hardware. Both of these limits (the fixed-size bottleneck, and the inherently sequential computation) are exactly what the attention mechanism, covered next, was designed to remove: it lets a decoder look directly at every encoder position, weighted by relevance, and the weighted lookups over different positions can be computed in parallel rather than one at a time."
                    }
                ]
            },
            {
                "title": "Exercises",
                "blocks": [
                    {
                        "t": "p",
                        "x": "These re-run the unrolled cell with different numbers, and check the reasoning behind BPTT, vanishing gradients over time, and gating."
                    }
                ],
                "exercises": [
                    {
                        "q": "Using the same cell (w_xh=0.5, w_hh=0.8, b_h=0.1) with h_1 = 0.537 from the worked example, compute z_2 and h_2 if x_2 = 2 instead of -1.",
                        "steps": [
                            "z_2 = 0.5(2) + 0.8(0.537) + 0.1 = 1.0 + 0.4296 + 0.1 = 1.5296.",
                            "h_2 = tanh(1.5296). This is now large enough that the small-angle approximation no longer applies — tanh(1.53) &#8776; 0.910."
                        ],
                        "answer": "z_2 &#8776; 1.530, h_2 = tanh(1.530) &#8776; 0.910 — much closer to tanh's saturated ceiling of 1 than the original example's h_2 &#8776; 0.030."
                    },
                    {
                        "kind": "mc",
                        "q": "Backpropagation through time (BPTT) is described in this booklet as which of the following?",
                        "options": [
                            "Ordinary backpropagation applied to the unrolled computation graph, with gradients for the shared weights summed across every time step they were used",
                            "A completely different algorithm from backpropagation, designed specifically for graphs with cycles",
                            "A method that only computes the gradient for the very last time step and ignores earlier ones",
                            "A way to run the forward pass backward in time, from the last input to the first"
                        ],
                        "correct": 0,
                        "steps": [
                            "The unrolled RNN is just a computation graph, like any other in the backpropagation booklet, where the same weights happen to be reused at every time step.",
                            "Because a variable (the shared weight) feeds into the graph at multiple points, the multivariate chain rule says its total gradient is the sum of the contributions from every point it was used.",
                            "That's exactly BPTT: the same backward pass, applied to this particular graph, with the shared weight's gradients accumulated across all time steps."
                        ],
                        "answer": "BPTT is ordinary backpropagation run over the unrolled graph, with the shared weights' gradients summed across every step they appeared in."
                    },
                    {
                        "kind": "write",
                        "q": "An LSTM's cell state is updated by an addition rather than a repeated multiplication by a single weight, which gives the gradient a path back through time that shrinks much less than a plain RNN's. This gate, which controls how much of the old cell state survives into the next step, is called the ___ gate.",
                        "accept": [
                            "forget",
                            "forget gate"
                        ],
                        "hint": "it decides how much of the past to keep",
                        "steps": [
                            "An LSTM has three gates: forget, input, and output.",
                            "The forget gate multiplies the previous cell state elementwise by a value between 0 and 1, deciding how much of it to keep versus discard.",
                            "Because the cell-state update is additive (old state, scaled by the forget gate, plus a new candidate), a forget gate near 1 lets gradients flow back with little shrinkage."
                        ],
                        "answer": "The forget gate — it scales how much of the previous cell state survives, and the additive update it's part of is what avoids the plain RNN's repeated-multiplication shrinkage."
                    },
                    {
                        "q": "A plain RNN is trained on sequences of length 200 and struggles to learn a dependency between position 5 and position 195. Using the gradient-decay figure's numbers as a rough guide (w_hh=0.8, decaying by roughly 0.5-0.8&#215; per step), estimate whether a gradient from position 195 would still be meaningfully large by the time it reaches position 5.",
                        "steps": [
                            "The gradient shrinks by roughly the same multiplicative factor at every step back — even taking a generous per-step factor of 0.8 with no further shrinkage from the tanh term, 190 steps back multiplies the gradient by 0.8^190.",
                            "0.8^190 is an astronomically small number (well under 10^-18) — the gradient reaching position 5 would be indistinguishable from zero in floating point, regardless of the exact per-step factor.",
                            "This is the vanishing-gradient problem at the scale that actually matters in practice: even a per-step factor close to 1 compounds into nothing over a long enough sequence."
                        ],
                        "answer": "No — even an optimistic per-step decay factor compounds to an effectively-zero gradient over 190 steps, which is exactly why plain RNNs fail to learn long-range dependencies and why LSTMs, GRUs, or attention are used instead for long sequences."
                    },
                    {
                        "kind": "mc",
                        "q": "What specific limitation of RNN-based sequence-to-sequence models does attention (the next booklet) primarily address?",
                        "options": [
                            "The decoder can only consult a single fixed-size summary vector from the encoder, and the encoder-decoder computation is inherently sequential rather than parallelizable",
                            "RNNs cannot represent nonlinear functions",
                            "RNNs require labeled data while attention-based models do not",
                            "RNNs can only process fixed-length inputs, while attention-based models can process inputs of any length"
                        ],
                        "correct": 0,
                        "steps": [
                            "Plain sequence-to-sequence RNNs compress the entire input into one final hidden state, which the decoder must work from without being able to look back at specific earlier positions.",
                            "RNNs also process a sequence strictly one step at a time, since each step's hidden state depends on the previous one, which blocks parallelizing computation across the sequence.",
                            "Attention removes both limits: it lets the decoder look directly at every encoder position with a learned weighting, and those weighted lookups can be computed in parallel."
                        ],
                        "answer": "The single-vector bottleneck and the inherently sequential computation — both are structural limits of RNNs that attention was specifically designed around, not limits on what functions RNNs can represent or what data they need."
                    }
                ]
            }
        ],
        "vocab": [
            [
                "Recurrent neural network (RNN)",
                "A network that reuses the same weights at every position in a sequence, carrying a hidden state forward from one step to the next."
            ],
            [
                "Hidden state",
                "A vector that summarizes everything a recurrent network has seen in a sequence up to the current step."
            ],
            [
                "Unrolling",
                "Drawing (and effectively treating) a recurrent network's repeated application across time steps as one long computation graph."
            ],
            [
                "Backpropagation through time (BPTT)",
                "Ordinary backpropagation applied to an unrolled recurrent network's computation graph."
            ],
            [
                "Truncated BPTT",
                "Running BPTT only over a limited-length chunk of a long sequence, treating the hidden state entering the chunk as fixed."
            ],
            [
                "Vanishing gradient (over time)",
                "The geometric shrinkage of a gradient as it is backpropagated across many time steps, the recurrent analog of vanishing gradients across many layers."
            ],
            [
                "LSTM (long short-term memory)",
                "A recurrent cell with a separately maintained, additively-updated cell state and three learned gates, designed to preserve gradients over long sequences."
            ],
            [
                "Cell state",
                "An LSTM's internal memory, updated by addition rather than overwritten, which gives gradients a low-shrinkage path back through time."
            ],
            [
                "Forget gate",
                "An LSTM gate controlling how much of the previous cell state is kept versus discarded at the current step."
            ],
            [
                "Input gate",
                "An LSTM gate controlling how much of a new candidate value is added into the cell state at the current step."
            ],
            [
                "Output gate",
                "An LSTM gate controlling how much of the cell state is exposed as the hidden state at the current step."
            ],
            [
                "GRU (gated recurrent unit)",
                "A simplified recurrent cell with two gates and no separate cell state, often comparable to an LSTM with fewer parameters."
            ],
            [
                "Sequence-to-sequence (seq2seq)",
                "An encoder-decoder architecture that reads an entire input sequence into a summary and then generates an output sequence from it."
            ],
            [
                "Encoder / decoder",
                "The two halves of a seq2seq model: the encoder reads the input, the decoder generates the output."
            ],
            [
                "Context bottleneck",
                "The limitation that a seq2seq decoder can only consult a single fixed-size summary vector from the encoder, not any individual earlier position."
            ],
            [
                "Gating",
                "A learned sigmoid output between 0 and 1, multiplied elementwise against a value, that controls how much of that value passes through."
            ]
        ]
    },
  "cnn":   {
        "title": "Convolutional Networks",
        "blurb": "Sharing one small set of weights across every position in a grid, instead of learning a separate weight for every pixel, is what makes convolutional networks both far cheaper than fully-connected ones and naturally suited to images.",
        "chapters": [
            {
                "title": "Why fully-connected layers don't fit images",
                "blocks": [
                    {
                        "t": "p",
                        "x": "A neural network built entirely from the fully-connected layers in the neural networks booklet — every output unit connected to every input — technically works on an image if the image is flattened into one long vector first. It just doesn't work well. A modest 224&#215;224 color image has 224&#215;224&#215;3 = 150,528 input values; a first layer connecting all of them to just 1,000 hidden units already needs 150,528&#215;1,000 = 150,528,000 weights, before the network has done anything beyond its very first layer."
                    },
                    {
                        "t": "p",
                        "x": "Two things go wrong beyond the sheer parameter count. First, that many parameters relative to typical dataset sizes invites severe overfitting — the model has more than enough capacity to memorize training images outright. Second, and more fundamentally, a fully-connected layer treats every pixel position as unrelated to every other: it has to separately learn what an edge looks like in the top-left corner and, independently, what the same edge looks like one pixel to the right. Nothing in the architecture tells it that 'edge detector' is one reusable idea that should apply the same way everywhere in the image."
                    }
                ]
            },
            {
                "title": "Convolution, kernels, stride and padding",
                "blocks": [
                    {
                        "t": "p",
                        "x": "A convolutional layer replaces a giant fully-connected weight matrix with a small kernel (also called a filter) — commonly 3&#215;3 or 5&#215;5 — that slides across the input, one position at a time. At each position, the kernel's weights are multiplied elementwise against the patch of input beneath it and summed into a single output value; sliding the kernel over every valid position produces an entire output grid, called a feature map."
                    },
                    {
                        "t": "fig",
                        "svg": "<svg viewBox=\"0 0 820 460\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">5&#215;5 input, 3&#215;3 kernel, stride 1, no padding &#8212; highlighted patch is the top-left output position</text><rect x=\"40\" y=\"60\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"61.0\" y=\"86.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"82\" y=\"60\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"103.0\" y=\"86.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">2</text><rect x=\"124\" y=\"60\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"145.0\" y=\"86.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">3</text><rect x=\"166\" y=\"60\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"187.0\" y=\"86.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"208\" y=\"60\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"229.0\" y=\"86.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"40\" y=\"102\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"61.0\" y=\"128.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"82\" y=\"102\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"103.0\" y=\"128.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"124\" y=\"102\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"145.0\" y=\"128.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">2</text><rect x=\"166\" y=\"102\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"187.0\" y=\"128.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">3</text><rect x=\"208\" y=\"102\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"229.0\" y=\"128.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"40\" y=\"144\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"61.0\" y=\"170.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"82\" y=\"144\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"103.0\" y=\"170.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"124\" y=\"144\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"145.0\" y=\"170.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"166\" y=\"144\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"187.0\" y=\"170.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">2</text><rect x=\"208\" y=\"144\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"229.0\" y=\"170.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"40\" y=\"186\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"61.0\" y=\"212.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">2</text><rect x=\"82\" y=\"186\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"103.0\" y=\"212.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"124\" y=\"186\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"145.0\" y=\"212.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"166\" y=\"186\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"187.0\" y=\"212.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"208\" y=\"186\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"229.0\" y=\"212.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">3</text><rect x=\"40\" y=\"228\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"61.0\" y=\"254.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"82\" y=\"228\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"103.0\" y=\"254.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">2</text><rect x=\"124\" y=\"228\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"145.0\" y=\"254.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><rect x=\"166\" y=\"228\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"187.0\" y=\"254.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">0</text><rect x=\"208\" y=\"228\" width=\"42\" height=\"42\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"229.0\" y=\"254.0\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\">1</text><text x=\"40\" y=\"292\" font-size=\"11\" fill=\"#666D72\">input</text><rect x=\"330\" y=\"90\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"350.0\" y=\"115.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">1</text><rect x=\"370\" y=\"90\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"390.0\" y=\"115.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">0</text><rect x=\"410\" y=\"90\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"430.0\" y=\"115.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">-1</text><rect x=\"330\" y=\"130\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"350.0\" y=\"155.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">1</text><rect x=\"370\" y=\"130\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"390.0\" y=\"155.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">0</text><rect x=\"410\" y=\"130\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"430.0\" y=\"155.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">-1</text><rect x=\"330\" y=\"170\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"350.0\" y=\"195.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">1</text><rect x=\"370\" y=\"170\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"390.0\" y=\"195.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">0</text><rect x=\"410\" y=\"170\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"430.0\" y=\"195.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#D2D8DC\">-1</text><text x=\"330\" y=\"232\" font-size=\"11\" fill=\"#666D72\">kernel</text><text x=\"468\" y=\"155.0\" font-size=\"16\" fill=\"#666D72\">&#8594;</text><rect x=\"560\" y=\"90\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"580.0\" y=\"115.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">-4</text><rect x=\"600\" y=\"90\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"620.0\" y=\"115.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">-2</text><rect x=\"640\" y=\"90\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"660.0\" y=\"115.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">4</text><rect x=\"560\" y=\"130\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"580.0\" y=\"155.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">0</text><rect x=\"600\" y=\"130\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"620.0\" y=\"155.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">-4</text><rect x=\"640\" y=\"130\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"660.0\" y=\"155.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">-1</text><rect x=\"560\" y=\"170\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"580.0\" y=\"195.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">1</text><rect x=\"600\" y=\"170\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"620.0\" y=\"195.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">0</text><rect x=\"640\" y=\"170\" width=\"40\" height=\"40\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/><text x=\"660.0\" y=\"195.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">-2</text><text x=\"560\" y=\"232\" font-size=\"11\" fill=\"#666D72\">output (3&#215;3)</text><text x=\"40\" y=\"400\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">top-left output = 1&#215;1+2&#215;0+3&#215;(-1) + 0&#215;1+1&#215;0+2&#215;(-1) + 1&#215;1+0&#215;0+1&#215;(-1) = -4</text><text x=\"40\" y=\"424\" font-size=\"12\" fill=\"#666D72\">each output cell is one dot product between the kernel and the patch it currently sits over</text></svg>",
                        "cap": "The kernel slides across the input one position at a time; at each position its 9 weights are multiplied elementwise against the patch beneath it and summed to one output value. The highlighted top-left patch [[1,2,3],[0,1,2],[1,0,1]] against the kernel [[1,0,-1],[1,0,-1],[1,0,-1]] gives (1-3)+(0-2)+(1-1) = -4, matching the output grid's top-left cell; all nine output values were checked the same way."
                    },
                    {
                        "t": "worked",
                        "q": "Compute the output value at row 1, column 1 (the second row, second column, 0-indexed) of the 3&#215;3 output in the figure.",
                        "steps": [
                            "That output position covers input rows 1-3, columns 1-3. Reading those rows and columns from the input grid gives the patch [[1,2,3],[0,1,2],[1,0,1]].",
                            "Elementwise multiply by the kernel [[1,0,-1],[1,0,-1],[1,0,-1]] and sum: (1&#215;1+2&#215;0+3&#215;-1) + (0&#215;1+1&#215;0+2&#215;-1) + (1&#215;1+0&#215;0+1&#215;-1) = (1-3) + (0-2) + (1-1) = -2-2+0 = -4."
                        ],
                        "answer": "The output grid's [1,1] entry is -4, matching the figure's output grid — this kernel (positive left column, zero middle, negative right column) responds to a bright-to-dark transition running left to right, a simple vertical edge detector."
                    },
                    {
                        "t": "p",
                        "x": "Two more parameters shape the output: stride, how many positions the kernel moves each step (stride 2 skips every other position, roughly halving the output size), and padding, extra border added around the input (commonly zeros) so the kernel can be centered on edge pixels and the output doesn't shrink as fast, or at all, with 'same' padding."
                    }
                ]
            },
            {
                "title": "Weight sharing and translation invariance",
                "blocks": [
                    {
                        "t": "p",
                        "x": "The kernel's weights are the same at every position it slides to — this is weight sharing, the same principle recurrent networks use across time steps, applied here across space instead. It is the reason convolution is so much cheaper than a fully-connected layer doing a comparable job: instead of a separate weight per input-output pixel pair, there is one small kernel, reused everywhere."
                    },
                    {
                        "t": "fig",
                        "svg": "<svg viewBox=\"0 0 620 380\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">first-layer parameter count, log&#8321;&#8320; scale &#8212; 224&#215;224&#215;3 image, 1000 output units</text><line x1=\"60\" y1=\"300\" x2=\"560\" y2=\"300\" stroke=\"#23282B\" stroke-width=\"1\"/><rect x=\"160\" y=\"81.9\" width=\"90\" height=\"218.1\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"1.8\"/><text x=\"205\" y=\"71.9\" text-anchor=\"middle\" font-size=\"12\" fill=\"#DDE3E7\" class=\"mono\">150,528,000</text><text x=\"205\" y=\"322\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">fully-connected</text><rect x=\"400\" y=\"213.3\" width=\"90\" height=\"86.7\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.8\"/><text x=\"445\" y=\"203.3\" text-anchor=\"middle\" font-size=\"12\" fill=\"#DDE3E7\" class=\"mono\">1,792</text><text x=\"445\" y=\"322\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">conv, 64 filters 3&#215;3</text><text x=\"60\" y=\"44\" font-size=\"11\" fill=\"#666D72\">log&#8321;&#8320;(parameter count)</text></svg>",
                        "cap": "Same first-layer job, two architectures. A fully-connected layer from a flattened 224&#215;224&#215;3 image to 1000 units needs 224&#215;224&#215;3&#215;1000 = 150,528,000 weights. A convolutional layer with 64 filters of size 3&#215;3 over 3 input channels needs only 3&#215;3&#215;3&#215;64+64 = 1,792 weights &#8212; about 84,000&#215; fewer, because the same small kernel is reused at every spatial position instead of a separate weight for every pixel. Bars are drawn on a log&#8321;&#8320; scale (the raw counts differ by five orders of magnitude); exact counts are labelled above each bar."
                    },
                    {
                        "t": "p",
                        "x": "Weight sharing has a second consequence beyond the parameter savings: translation invariance (more precisely, equivariance). Because the exact same kernel is applied at every position, a feature the kernel has learned to detect — an edge, a corner, a patch of texture — is detected the same way no matter where in the image it appears. A network doesn't need separate training examples of a cat in the top-left versus the bottom-right of the frame to learn to recognize a cat in either position; the convolutional layers generalize across position automatically, by construction rather than by having seen every position during training."
                    }
                ]
            },
            {
                "title": "Pooling and the growing receptive field",
                "blocks": [
                    {
                        "t": "p",
                        "x": "A pooling layer downsamples a feature map, most commonly by max pooling: sliding a small window (say 2&#215;2) across the map and keeping only the largest value in each window, discarding the rest and halving both spatial dimensions with a stride-2, 2&#215;2 window. Pooling reduces the amount of computation and memory needed by later layers, and it adds a small amount of translation tolerance of its own — a feature shifted by one pixel still usually survives being the max in its window."
                    },
                    {
                        "t": "p",
                        "x": "A single unit's receptive field is the region of the original input that can influence its value. One 3&#215;3 convolution gives each output unit a 3&#215;3 receptive field; stacking a second 3&#215;3 convolution on top gives units in that second layer a 5&#215;5 receptive field in the original input (each of the first layer's outputs it depends on itself depended on a 3&#215;3 region, and those regions overlap and extend the reach). Pooling layers grow the receptive field even faster, since each pooled output depends on a whole window of the layer beneath it. This is why convolutional networks are conventionally described as building a feature hierarchy: early layers with small receptive fields detect simple local patterns like edges and color transitions, middle layers with larger receptive fields combine those into textures and parts, and late layers with receptive fields covering most or all of the image recognize whole objects."
                    }
                ]
            },
            {
                "title": "Output shape arithmetic",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Given an input of size n, a kernel of size k, stride s and padding p on each side, the output size along that dimension is floor((n + 2p - k) / s) + 1. This formula is applied independently to height and width (they're usually equal, but don't have to be), and chained through a whole stack of layers by feeding each layer's output size in as the next layer's input size."
                    },
                    {
                        "t": "worked",
                        "q": "Track the spatial size of a 32&#215;32 input through: conv (3&#215;3, stride 1, padding 1) &#8594; pool (2&#215;2, stride 2, padding 0) &#8594; conv (3&#215;3, stride 1, padding 1) &#8594; pool (2&#215;2, stride 2, padding 0).",
                        "steps": [
                            "After conv1: floor((32 + 2&#215;1 - 3)/1) + 1 = floor(31/1) + 1 = 31 + 1 = 32 — padding 1 with a 3&#215;3 kernel and stride 1 exactly preserves spatial size ('same' padding).",
                            "After pool1: floor((32 + 0 - 2)/2) + 1 = floor(30/2) + 1 = 15 + 1 = 16.",
                            "After conv2: same-padding 3&#215;3 again preserves size: stays 16.",
                            "After pool2: floor((16-2)/2) + 1 = 7 + 1 = 8."
                        ],
                        "answer": "The spatial size goes 32 &#8594; 32 (conv, unchanged by same-padding) &#8594; 16 (pool) &#8594; 16 (conv, unchanged) &#8594; 8 (pool) — each pooling layer halves it, each same-padded convolution leaves it alone, matching a common design pattern of convolutions for feature extraction and pooling for downsampling."
                    }
                ]
            },
            {
                "title": "Residual connections and depth",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Stacking more convolutional layers should, in principle, only ever help or be neutral — a deeper network could always learn to make its extra layers do nothing. In practice, very deep plain convolutional stacks train worse, not just more slowly, past a certain depth: this is exactly the vanishing-gradient degradation the backpropagation booklet describes, compounded across dozens of layers instead of dozens of time steps."
                    },
                    {
                        "t": "p",
                        "x": "A residual connection sidesteps this the same way an LSTM's additive cell-state update does: instead of a layer computing its output directly as y = F(x), it computes y = F(x) + x, adding the input back on unchanged. If a layer's ideal contribution is close to zero, F can simply learn to output near-zero and the identity mapping passes through cleanly — and because the shortcut path x is an addition rather than something the gradient has to be multiplied through, gradients can flow back through the shortcut with far less shrinkage, exactly as with an LSTM's forget-gated cell state. This is the core idea behind ResNet-style architectures, which made networks over 100 layers deep practical to train."
                    },
                    {
                        "t": "note",
                        "x": "The general pattern — give the gradient an additive shortcut path so it doesn't have to survive being multiplied through every intervening operation — now shows up three times in this map: LSTM cell states, residual connections here, and (further along) the residual connections inside every transformer block."
                    }
                ]
            },
            {
                "title": "Exercises",
                "blocks": [
                    {
                        "t": "p",
                        "x": "These re-run the convolution and shape arithmetic with different numbers, and check the reasoning behind weight sharing, pooling and residual connections."
                    }
                ],
                "exercises": [
                    {
                        "q": "Using the same 5&#215;5 input and kernel as the figure, compute the output value at row 2, column 2 (0-indexed, the center of the output grid).",
                        "steps": [
                            "That position covers input rows 2-4, columns 2-4: from rows [1,0,1,2,0], [2,1,0,1,3], [0,2,1,0,1], the patch is [[1,2,0],[0,1,3],[1,0,1]].",
                            "Multiply elementwise by [[1,0,-1],[1,0,-1],[1,0,-1]] and sum: (1&#215;1+2&#215;0+0&#215;-1) + (0&#215;1+1&#215;0+3&#215;-1) + (1&#215;1+0&#215;0+1&#215;-1) = (1+0+0) + (0+0-3) + (1+0-1) = 1 - 3 + 0 = -2."
                        ],
                        "answer": "-2, matching the figure's output grid center cell."
                    },
                    {
                        "kind": "mc",
                        "q": "A convolutional layer has far fewer parameters than a fully-connected layer covering the same input mainly because:",
                        "options": [
                            "The same small kernel's weights are reused at every spatial position, instead of a distinct weight for every input-output pixel pair",
                            "Convolutional layers use fewer output channels than fully-connected layers",
                            "Convolutional layers don't have biases",
                            "Convolutional layers only work on grayscale images, which have less data than color images"
                        ],
                        "correct": 0,
                        "steps": [
                            "A fully-connected layer needs one weight per (input pixel, output unit) pair, which grows with the image size times the number of outputs.",
                            "A convolutional layer's kernel has a fixed small size (e.g. 3&#215;3&#215;channels) regardless of the image's size, and that same kernel slides across every position.",
                            "Reusing the same weights everywhere, rather than learning a separate weight per position, is exactly what collapses 150 million parameters down to under 2,000 in the figure's comparison."
                        ],
                        "answer": "Weight sharing — the same kernel is reused at every position rather than a distinct weight learned for every pixel-to-output connection."
                    },
                    {
                        "kind": "write",
                        "q": "Sliding a small window across a feature map and keeping only the maximum value in each window, to shrink the spatial size and add a little translation tolerance, is called ___ pooling.",
                        "accept": [
                            "max",
                            "max pooling"
                        ],
                        "hint": "keeps only the largest value in each window",
                        "steps": [
                            "Pooling downsamples a feature map by summarizing each small window into one value.",
                            "The most common summary is the maximum value in the window, called max pooling.",
                            "It reduces computation for later layers and gives some tolerance to small shifts, since the max in a window often survives a one-pixel translation."
                        ],
                        "answer": "Max pooling — it keeps only the largest value in each window, discarding the rest."
                    },
                    {
                        "q": "Track a 64&#215;64 input through: conv (5&#215;5, stride 1, padding 2) &#8594; pool (2&#215;2, stride 2) &#8594; pool (2&#215;2, stride 2). What is the final spatial size?",
                        "steps": [
                            "conv: floor((64 + 2&#215;2 - 5)/1) + 1 = floor(63/1) + 1 = 64 — a 5&#215;5 kernel with padding 2 is also 'same' padding, so size is unchanged.",
                            "pool1: floor((64-2)/2) + 1 = 31 + 1 = 32.",
                            "pool2: floor((32-2)/2) + 1 = 15 + 1 = 16."
                        ],
                        "answer": "16&#215;16 — the same-padded convolution leaves the size at 64, and each 2&#215;2 stride-2 pool halves it, giving 64 &#8594; 32 &#8594; 16."
                    },
                    {
                        "kind": "mc",
                        "q": "Why do residual connections (y = F(x) + x) help train very deep convolutional networks, compared to a plain stack of layers?",
                        "options": [
                            "The addition gives gradients an unshrunk path back through the shortcut, and a layer can learn near-zero F(x) to approximate an identity mapping if that's what's needed",
                            "They reduce the total number of parameters in the network",
                            "They replace convolution with a cheaper operation",
                            "They remove the need for pooling layers entirely"
                        ],
                        "correct": 0,
                        "steps": [
                            "A plain deep stack forces the gradient to be multiplied through every layer's nonlinearity on its way back, which can shrink it toward zero over enough layers — the same degradation the backpropagation booklet describes.",
                            "y = F(x) + x adds an unmodified copy of the input to the layer's output; the '+x' term is an addition, not something the gradient must be multiplied through.",
                            "This gives the gradient a low-shrinkage path back through the shortcut, and if a layer's best contribution really is close to nothing, F can simply learn to output near zero rather than fighting to represent an identity mapping through its nonlinearities."
                        ],
                        "answer": "Residual connections add an unshrunk shortcut path for the gradient and let a layer easily approximate 'do nothing' when that's the right answer — both directly counter the vanishing-gradient degradation seen in very deep plain stacks."
                    }
                ]
            }
        ],
        "vocab": [
            [
                "Kernel / filter",
                "A small grid of learned weights that slides across an input, producing one output value per position by an elementwise multiply-and-sum."
            ],
            [
                "Feature map",
                "The output grid produced by sliding one kernel across an input."
            ],
            [
                "Stride",
                "How many positions a kernel moves between applications; larger strides produce smaller outputs."
            ],
            [
                "Padding",
                "Extra border added around an input (commonly zeros) so a kernel can be centered near the edges and the output size can be controlled."
            ],
            [
                "Weight sharing",
                "Reusing the same small set of weights at every position a kernel is applied, rather than learning a distinct weight per position."
            ],
            [
                "Translation equivariance",
                "The property that shifting the input shifts a convolutional layer's output correspondingly, since the same kernel is applied everywhere."
            ],
            [
                "Max pooling",
                "Downsampling a feature map by keeping only the maximum value in each small window."
            ],
            [
                "Receptive field",
                "The region of the original input that can influence a given unit's value, which grows with each additional convolutional or pooling layer."
            ],
            [
                "Feature hierarchy",
                "The pattern where early convolutional layers detect simple local patterns and later layers, with larger receptive fields, combine them into more complex, larger-scale features."
            ],
            [
                "Same padding",
                "Padding chosen so that a convolution's output has the same spatial size as its input."
            ],
            [
                "Valid padding",
                "No padding at all — the kernel only slides over positions fully inside the input, shrinking the output."
            ],
            [
                "Residual connection",
                "A shortcut that adds a layer's (or block's) input back to its output, y = F(x) + x, giving gradients a low-shrinkage path back through very deep networks."
            ],
            [
                "ResNet",
                "A convolutional architecture built from residual blocks, which made networks over 100 layers deep practical to train."
            ],
            [
                "Channel",
                "One of the separate grids stacked at a given layer (e.g. red, green, blue in the input, or one per learned kernel in later layers)."
            ],
            [
                "Convolutional layer",
                "A layer that produces its output by sliding one or more learned kernels across its input rather than fully connecting every input to every output."
            ]
        ]
    },
  "scaletrain":   {
        "title": "Training at Scale",
        "blurb": "Once a model's weights, gradients and optimizer state no longer fit on one GPU, training stops being a single-machine problem: the model and data have to be split across many devices, kept in sync, and made to survive hardware that will eventually fail mid-run.",
        "chapters": [
            {
                "title": "Why one GPU stops being enough",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Training needs more memory than the model's weights alone. During training a GPU has to hold, at minimum: the weights themselves, the gradient for every weight (the same size as the weights), and — for an adaptive optimizer like Adam — one or two additional buffers per weight tracking running statistics used to adapt the per-parameter step size. On top of all of that, the activations computed during the forward pass have to be kept around, because the backward pass needs them to compute gradients (exactly the cached intermediate values the backpropagation booklet's forward pass describes, just for a much bigger graph)."
                    },
                    {
                        "t": "fig",
                        "svg": "<svg viewBox=\"0 0 700 460\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">per-GPU memory for one 1-billion-parameter model, mixed precision + Adam</text><rect x=\"260\" y=\"357.5\" width=\"140\" height=\"42.5\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.6\"/><line x1=\"400\" y1=\"378.8\" x2=\"418\" y2=\"378.8\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"424\" y=\"382.8\" font-size=\"12.5\" fill=\"#DDE3E7\">fp16 weights &#8212; 2 GB</text><rect x=\"260\" y=\"315.0\" width=\"140\" height=\"42.5\" fill=\"none\" stroke=\"#838B91\" stroke-width=\"1.6\"/><line x1=\"400\" y1=\"336.2\" x2=\"418\" y2=\"336.2\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"424\" y=\"340.2\" font-size=\"12.5\" fill=\"#DDE3E7\">fp16 grads &#8212; 2 GB</text><rect x=\"260\" y=\"230.0\" width=\"140\" height=\"85.0\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\"/><line x1=\"400\" y1=\"272.5\" x2=\"418\" y2=\"272.5\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"424\" y=\"276.5\" font-size=\"12.5\" fill=\"#DDE3E7\">fp32 master weights &#8212; 4 GB</text><rect x=\"260\" y=\"145.0\" width=\"140\" height=\"85.0\" fill=\"none\" stroke=\"#B3BBC1\" stroke-width=\"1.6\"/><line x1=\"400\" y1=\"187.5\" x2=\"418\" y2=\"187.5\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"424\" y=\"191.5\" font-size=\"12.5\" fill=\"#DDE3E7\">Adam moment 1 (m) &#8212; 4 GB</text><rect x=\"260\" y=\"60.0\" width=\"140\" height=\"85.0\" fill=\"none\" stroke=\"#D2D8DC\" stroke-width=\"1.6\"/><line x1=\"400\" y1=\"102.5\" x2=\"418\" y2=\"102.5\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"424\" y=\"106.5\" font-size=\"12.5\" fill=\"#DDE3E7\">Adam moment 2 (v) &#8212; 4 GB</text><line x1=\"260\" y1=\"400\" x2=\"260\" y2=\"44\" stroke=\"#23282B\" stroke-width=\"1\"/><text x=\"246\" y=\"36\" text-anchor=\"start\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">total: 16 GB</text><text x=\"260\" y=\"422\" font-size=\"11\" fill=\"#666D72\">1B params &#215; 16 bytes/param</text></svg>",
                        "cap": "Five components stacked for a 1-billion-parameter model trained in mixed precision with Adam: fp16 weights and fp16 gradients used for the forward/backward math (2 bytes/param each = 2 GB each), plus an fp32 master copy of the weights that the optimizer actually updates (4 bytes/param = 4 GB), plus Adam's two running-average buffers, also kept in fp32 (4 GB each). That totals 16 bytes per parameter, or 16 GB for 1B params &#8212; before a single activation is stored. This is why a model can be far too large to train on a GPU it would easily fit for inference alone (which needs roughly the weights only, 2 GB in fp16)."
                    },
                    {
                        "t": "p",
                        "x": "That 16 bytes-per-parameter figure is before a single activation is stored, and activation memory itself scales with batch size and sequence length, not just parameter count — doubling the batch size roughly doubles activation memory while leaving the weight/gradient/optimizer memory unchanged. A model that comfortably fits on one GPU for inference (roughly just the weights) can easily be several times too large to train on that same GPU."
                    }
                ]
            },
            {
                "title": "Data parallelism",
                "blocks": [
                    {
                        "t": "p",
                        "x": "The simplest way to use multiple GPUs is data parallelism: put an identical full copy of the model on every GPU, split each training batch into shards (one shard per GPU), and have every GPU compute its own forward and backward pass independently on its shard. Each GPU ends up with a gradient computed from only its slice of the batch — those per-GPU gradients are then averaged across all GPUs (an operation usually called all-reduce) before any GPU applies an update, so every copy of the model stays identical after every step."
                    },
                    {
                        "t": "p",
                        "x": "Data parallelism is straightforward to reason about and scales well as long as the model itself fits on a single GPU — its main costs are the communication needed for the all-reduce (which grows with the number of GPUs and the model size) and the fact that it does nothing to help when the model itself, not just the data, is too large for one device."
                    }
                ]
            },
            {
                "title": "Tensor and pipeline parallelism",
                "blocks": [
                    {
                        "t": "p",
                        "x": "When the model itself doesn't fit on one GPU — as is routine for very large language models — the model has to be split, not just the data. Tensor parallelism splits individual large operations (a big matrix multiplication, say) across GPUs, so that no single GPU ever needs to hold the full weight matrix; each GPU computes its slice of the operation and the results are combined with additional communication. Pipeline parallelism instead splits the model by layers, assigning a contiguous block of layers to each GPU, so that data flows through GPU 1's layers, then GPU 2's, and so on like an assembly line."
                    },
                    {
                        "t": "p",
                        "x": "Naive pipeline parallelism has an obvious inefficiency: while GPU 1 is processing the first microbatch, GPUs 2 through P are idle waiting for it to finish, and a mirror-image idle period happens at the end while later stages finish up after earlier ones have nothing left to do. This is fixed by splitting each batch into many small microbatches and streaming them through the pipeline so that, once it's full, every stage is kept busy on some microbatch at all times — with idle time confined to a fill period at the start and a drain period at the end."
                    },
                    {
                        "t": "fig",
                        "svg": "<svg viewBox=\"0 0 864 420\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">pipeline parallelism, 4 stages &#215; 8 microbatches, simulated tick by tick &#8212; outline = forward, filled = backward, gap = idle bubble</text><text x=\"116\" y=\"95.0\" text-anchor=\"end\" font-size=\"12\" fill=\"#666D72\">stage 0</text><text x=\"116\" y=\"155.0\" text-anchor=\"end\" font-size=\"12\" fill=\"#666D72\">stage 1</text><text x=\"116\" y=\"215.0\" text-anchor=\"end\" font-size=\"12\" fill=\"#666D72\">stage 2</text><text x=\"116\" y=\"275.0\" text-anchor=\"end\" font-size=\"12\" fill=\"#666D72\">stage 3</text><rect x=\"130\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"162\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"162\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"194\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"194\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"194\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"226\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"226\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"226\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"226\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"258\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"258\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"258\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"258\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"290\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"290\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"290\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"290\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"322\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"322\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"322\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"322\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"354\" y=\"60\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"354\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"354\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"354\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"386\" y=\"120\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"386\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"386\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"418\" y=\"180\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"418\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"450\" y=\"240\" width=\"28\" height=\"42\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.3\"/><rect x=\"482\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"514\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"514\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"546\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"546\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"546\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"578\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"578\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"578\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"578\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"610\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"610\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"610\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"610\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"642\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"642\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"642\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"642\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"674\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"674\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"674\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"674\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"706\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"706\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"706\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"706\" y=\"240\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"738\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"738\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"738\" y=\"180\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"770\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"770\" y=\"120\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><rect x=\"802\" y=\"60\" width=\"28\" height=\"42\" fill=\"#DDE3E7\" stroke=\"#FFFFFF\" stroke-width=\"1.3\"/><text x=\"130\" y=\"318\" font-size=\"11\" fill=\"#666D72\">time &#8594; (22 ticks total; each column is one stage doing one microbatch's forward or backward)</text></svg>",
                        "cap": "Simulated tick by tick (not just sketched): each device runs all M=8 forward passes for its stage before starting any backward pass, backward propagating stage by stage in reverse once the stage after it has finished that microbatch. The whole schedule takes 2(M+P-1) = 22 ticks; every stage does 2M=16 ticks of real work (8 forward + 8 backward) and sits idle for the remaining 6 ticks &#8212; an idle-to-busy ratio of (P-1)/M = 3/8 = 0.375, the standard pipeline bubble-fraction formula, confirmed here by direct simulation rather than assumed."
                    },
                    {
                        "t": "worked",
                        "q": "With P=4 pipeline stages, how many microbatches M are needed to bring the idle ('bubble') fraction (P-1)/M under 10%?",
                        "steps": [
                            "Idle fraction = (P-1)/M = 3/M. Setting 3/M < 0.10 gives M > 30.",
                            "So M = 31 microbatches (or more) brings the bubble fraction under 10%, versus the 37.5% bubble fraction at M=8 used in the figure."
                        ],
                        "answer": "M &#8805; 31 — far more microbatches than the figure's 8, illustrating why real pipeline-parallel training runs use many more microbatches per batch than a diagram can show without becoming unreadable."
                    },
                    {
                        "t": "note",
                        "x": "Large training runs routinely combine all three forms of parallelism at once — data, tensor and pipeline — splitting different dimensions of the problem across different groups of GPUs simultaneously, sometimes called 3D parallelism."
                    }
                ]
            },
            {
                "title": "Mixed precision and gradient accumulation",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Mixed-precision training runs the forward and backward pass in a lower-precision format (fp16 or bf16, 2 bytes per number) instead of the traditional 4-byte fp32, which roughly halves activation memory and speeds up the matrix multiplications that dominate training time on GPU tensor cores built for exactly this format. Because fp16 in particular has a narrow representable range, a master copy of the weights is kept in fp32 and updated by the optimizer, with the fp16 copy used only for the forward/backward math and refreshed from the master copy after each update — this is exactly where the fp32 master weights component in this chapter's memory figure comes from."
                    },
                    {
                        "t": "p",
                        "x": "Gradient accumulation addresses a different constraint: sometimes the largest batch size that fits in memory is smaller than the batch size a training recipe actually calls for. Instead of updating the weights after every small batch, gradients are computed and summed across several small batches ('accumulation steps') without applying an update, and only after enough have accumulated is a single update applied — simulating a larger batch size using the memory footprint of a small one, at the cost of proportionally more forward/backward passes per update."
                    }
                ]
            },
            {
                "title": "Checkpointing and fault tolerance",
                "blocks": [
                    {
                        "t": "p",
                        "x": "'Checkpointing' means two different things in this setting, both trading one resource for another. Activation checkpointing (also called gradient checkpointing) trades compute for memory during training itself: instead of caching every layer's activations for the backward pass, only a subset are kept, and the rest are recomputed on the fly during the backward pass when needed — cutting activation memory substantially at the cost of a second forward pass through the discarded portions."
                    },
                    {
                        "t": "p",
                        "x": "Training checkpointing means periodically saving the full training state — model weights, optimizer state, and how far through the data the run has gotten — to durable storage, so that if hardware fails partway through a long run (a routine occurrence at the multi-week, thousands-of-GPU scale some models are trained at, and one instance of the partial-failure-as-normal-case reality the distributed systems booklet describes), training can resume from the last checkpoint instead of restarting from scratch."
                    }
                ]
            },
            {
                "title": "Scaling laws and compute budgeting",
                "blocks": [
                    {
                        "t": "p",
                        "x": "Empirically, a model's pretraining loss follows a fairly predictable power-law relationship with the compute spent training it, the number of parameters, and the amount of training data — these are called scaling laws. One influential finding (from the 'Chinchilla' scaling-law study) is that for a fixed compute budget, there is a compute-optimal balance between model size and the number of training tokens, and that many earlier large models had been trained with too many parameters relative to too little data for the compute they used — the same final loss could often have been reached more cheaply with a smaller model trained on more tokens."
                    },
                    {
                        "t": "p",
                        "x": "Scaling laws are what let teams budget a training run before starting it: given a target loss (or a fixed compute budget), an approximate compute-optimal parameter count and token count can be estimated in advance, which in turn determines roughly how much GPU memory (via this chapter's memory-budget breakdown) and how many GPU-hours (via throughput estimates) the run will need — turning 'how big a model can we afford to train' from a question answered by trial and error into one answered, at least approximately, by arithmetic."
                    }
                ]
            },
            {
                "title": "Exercises",
                "blocks": [
                    {
                        "t": "p",
                        "x": "These re-run the memory and pipeline-bubble arithmetic with different numbers, and check the reasoning behind data/tensor/pipeline parallelism, mixed precision and checkpointing."
                    }
                ],
                "exercises": [
                    {
                        "q": "Using the same 16-bytes-per-parameter mixed-precision-plus-Adam budget, estimate the per-GPU memory needed for a 7-billion-parameter model's weights, gradients and optimizer state alone (ignoring activations).",
                        "steps": [
                            "16 bytes/param &#215; 7,000,000,000 params = 112,000,000,000 bytes.",
                            "112,000,000,000 / 1e9 = 112 GB."
                        ],
                        "answer": "112 GB — already beyond a single high-end GPU's memory (commonly 40-80 GB), before any activations are counted, which is exactly why a 7B-parameter model routinely needs to be split across multiple GPUs (or trained with memory-saving techniques like activation checkpointing) rather than trained on one."
                    },
                    {
                        "kind": "mc",
                        "q": "In data parallelism, why does every GPU need to average its locally-computed gradient with every other GPU's, rather than just applying its own local gradient directly?",
                        "options": [
                            "So that every GPU's copy of the model receives the same update and stays identical after every step, since each GPU only saw a different shard of the batch",
                            "Because a single GPU's gradient is always wrong and needs correction",
                            "To reduce the total amount of GPU memory used",
                            "Because otherwise the forward pass would fail"
                        ],
                        "correct": 0,
                        "steps": [
                            "Each GPU in data parallelism computes a gradient from only its own shard of the batch, which is a noisier, partial estimate of the full-batch gradient.",
                            "If each GPU applied only its own local gradient, the model copies on different GPUs would drift apart after the very first update, since they saw different data.",
                            "Averaging (all-reducing) the gradients before any update is applied ensures every GPU applies the exact same combined gradient, keeping every copy of the model identical."
                        ],
                        "answer": "Averaging keeps every GPU's model copy identical after each update — without it, the copies would immediately diverge since each GPU only ever sees a different shard of the data."
                    },
                    {
                        "kind": "write",
                        "q": "Trading extra forward-pass compute for reduced activation memory, by recomputing some activations during the backward pass instead of caching all of them, is called activation ___.",
                        "accept": [
                            "checkpointing",
                            "activation checkpointing",
                            "gradient checkpointing"
                        ],
                        "hint": "same word as saving training progress, but for activations",
                        "steps": [
                            "Normally every layer's activations are cached during the forward pass so the backward pass can use them.",
                            "Activation checkpointing keeps only a subset and recomputes the rest on demand during backward, trading a second partial forward pass for lower peak memory.",
                            "This is a different use of the word 'checkpointing' than saving training state to disk for fault tolerance, though both trade one resource for another."
                        ],
                        "answer": "Activation (or gradient) checkpointing — it recomputes discarded activations during the backward pass rather than keeping all of them cached, trading compute for memory."
                    },
                    {
                        "q": "With P=8 pipeline stages, what is the idle bubble fraction (P-1)/M at M=8 microbatches, and at M=32?",
                        "steps": [
                            "At M=8: (8-1)/8 = 7/8 = 0.875 — 87.5% idle, extremely wasteful.",
                            "At M=32: (8-1)/32 = 7/32 &#8776; 0.219 — about 22% idle, much better but still substantial."
                        ],
                        "answer": "87.5% at M=8, dropping to about 21.9% at M=32 — more pipeline stages need proportionally more microbatches to keep the bubble fraction reasonable, since the fixed fill/drain cost scales with P-1."
                    },
                    {
                        "kind": "mc",
                        "q": "A team has a fixed compute budget and, per Chinchilla-style scaling laws, discovers their planned model is far larger than compute-optimal for that budget. What does this imply?",
                        "options": [
                            "The same compute budget would likely reach a lower loss with a smaller model trained on more tokens, rather than a larger model trained on fewer",
                            "The model should be made even larger to use the compute budget more fully",
                            "Scaling laws only apply to computer vision models, not this case",
                            "The compute budget should be reduced, since a smaller model needs less compute"
                        ],
                        "correct": 0,
                        "steps": [
                            "Chinchilla-style scaling laws describe a compute-optimal balance between model size and training tokens for a fixed compute budget.",
                            "Being far from that balance in the direction of 'too many parameters' means the same compute was spent on a model too large relative to how much data it was trained on.",
                            "The scaling-law finding is that the same compute budget, redirected toward a smaller model trained on more tokens, would likely reach a lower loss."
                        ],
                        "answer": "It implies the compute would have been better spent on a smaller model trained on more tokens — that redirection, not making the model even larger, is what compute-optimal scaling recommends."
                    }
                ]
            }
        ],
        "vocab": [
            [
                "Mixed precision",
                "Running forward/backward computation in a lower-precision format (fp16 or bf16) to save memory and speed up matrix multiplications, while keeping an fp32 master copy of the weights for updates."
            ],
            [
                "fp32 master weights",
                "A full-precision copy of the weights kept for the optimizer to update, refreshed into the lower-precision copy used for forward/backward math after each step."
            ],
            [
                "Optimizer state",
                "Extra per-parameter buffers (such as Adam's two running-average moments) an adaptive optimizer maintains alongside the weights and gradients."
            ],
            [
                "Data parallelism",
                "Splitting a batch across GPUs that each hold a full copy of the model, then averaging their gradients before each update."
            ],
            [
                "All-reduce",
                "A communication operation that combines (e.g. averages) values computed independently on many devices and distributes the combined result back to all of them."
            ],
            [
                "Tensor parallelism",
                "Splitting an individual large operation, such as a matrix multiplication, across GPUs so no single device holds the full weight matrix."
            ],
            [
                "Pipeline parallelism",
                "Splitting a model's layers across GPUs arranged in sequence, streaming microbatches through them like an assembly line."
            ],
            [
                "Microbatch",
                "A small slice of a training batch, used in pipeline parallelism to keep every pipeline stage busy rather than waiting for one large batch to fully pass through."
            ],
            [
                "Pipeline bubble",
                "The idle device-time at the start and end of a pipeline-parallel schedule, while the pipeline is filling up or draining."
            ],
            [
                "Gradient accumulation",
                "Summing gradients across several small batches before applying a single update, simulating a larger batch size within a smaller memory footprint."
            ],
            [
                "Activation checkpointing",
                "Recomputing some activations during the backward pass instead of caching all of them from the forward pass, trading compute for memory."
            ],
            [
                "Training checkpoint",
                "A saved snapshot of model weights, optimizer state and training progress, used to resume a run after a failure instead of restarting."
            ],
            [
                "Scaling laws",
                "Empirical power-law relationships between a model's pretraining loss and the compute, parameter count and data used to train it."
            ],
            [
                "Compute-optimal",
                "The balance of model size and training data that reaches the lowest loss for a given fixed compute budget, per a scaling law."
            ],
            [
                "3D parallelism",
                "Combining data, tensor and pipeline parallelism simultaneously across different groupings of GPUs in one training run."
            ],
            [
                "Throughput",
                "The rate at which a training setup processes data (e.g. tokens or samples per second), used together with scaling laws to estimate how long a run will take."
            ]
        ]
    },
  "attention":   {
      "title": "Attention and Transformers",
      "blurb": "Letting every position in a sequence consult every other position directly, in one parallel step, instead of routing information through a chain of hidden states — the architectural idea behind every current large language model.",
      "chapters": [
        {
          "title": "Why recurrence runs out of road",
          "blocks": [
            {
              "t": "p",
              "x": "The sequence-models booklet builds recurrent networks that carry a running summary, the hidden state, forward one time step at a time. That design has two costs that become serious once sequences and models get large. First, it is inherently sequential: step t cannot be computed until step t-1 finishes, so training cannot parallelize across the time dimension no matter how much hardware is available. Second, even with LSTM or GRU gating, information from far back in a long sequence has to survive being repeatedly compressed into one fixed-size vector, and in practice it degrades."
            },
            {
              "t": "p",
              "x": "Attention responds to both problems with a single change in design: instead of forcing information to flow through a chain of states, let every position look directly at every other position it needs, weighted by how relevant that position is right now. Distance in the sequence stops being a cost, and the lookups for every position can be computed at the same time."
            },
            {
              "t": "note",
              "x": "This chapter is about the training-time picture. Generating text one token at a time is still sequential at inference — attention removes the sequential bottleneck from training, and from processing a full context at once, not from autoregressive generation itself."
            }
          ]
        },
        {
          "title": "Queries, keys and values",
          "blocks": [
            {
              "t": "p",
              "x": "Attention is built from three vectors derived from every token's embedding: a query (what this position is looking for), a key (what this position advertises about itself), and a value (the actual content this position offers if chosen). All three are produced by three separate learned linear projections of the same embedding — there is no separate lookup table involved, just three matrices, W_Q, W_K and W_V, applied to the same input."
            },
            {
              "t": "p",
              "x": "The similarity between one position's query and every position's key sets how much weight that position's value contributes to the output. The natural measure of similarity for two vectors here is the dot product: it is large when the vectors point in a similar direction and near zero when they are close to orthogonal."
            },
            {
              "t": "worked",
              "q": "Two key vectors are k1 = (1, 0) and k2 = (0, 1). A query q = (1, 0) is compared against both. Which key does q resemble more, and how do you know from the dot product alone?",
              "steps": [
                "q·k1 = 1×1 + 0×0 = 1.",
                "q·k2 = 1×0 + 0×1 = 0.",
                "A larger dot product means the vectors point in a more similar direction, so q resembles k1 far more than k2."
              ],
              "answer": "q matches k1 (dot product 1) far more than k2 (dot product 0), because q and k1 point in exactly the same direction while q and k2 are orthogonal."
            }
          ]
        },
        {
          "title": "Scaled dot-product attention, worked",
          "blocks": [
            {
              "t": "p",
              "x": "The full mechanism is one formula: Attention(Q, K, V) = softmax(QKᵀ / √d_k) V. Read left to right: take every query's dot product with every key (QKᵀ), divide by √d_k to control the scale, turn each row into a probability distribution with softmax, then use those probabilities to take a weighted average of the value vectors."
            },
            {
              "t": "p",
              "x": "The √d_k scaling matters more than it looks. Dot products grow with the dimensionality d_k of the vectors involved — summing more terms tends to produce larger magnitudes purely from dimension count, not from any real difference in similarity. Without correcting for that, scores in a high-dimensional model would land far out in the tails of the softmax, where the gradient is nearly flat, and the whole layer would learn slowly. Dividing by √d_k keeps the scores in a range where softmax still has a meaningful gradient."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 620 400\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"26\" font-size=\"12.5\" fill=\"#9AA1A6\">scaled dot-product attention — query = &#8220;cat&#8221;, d_k = 2</text>\n<text x=\"20\" y=\"56\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">1. dot products, scaled by &#8730;d_k = &#8730;2 &#8776; 1.414</text>\n<text x=\"36\" y=\"80\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">q&#183;k(the) = 1  &#8594;  score = 1 / 1.414 &#8776; 0.71</text>\n<text x=\"36\" y=\"100\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">q&#183;k(cat) = 0  &#8594;  score = 0 / 1.414 = 0.00</text>\n<text x=\"36\" y=\"120\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">q&#183;k(sat) = 1  &#8594;  score = 1 / 1.414 &#8776; 0.71</text>\n<text x=\"20\" y=\"152\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">2. softmax over the three scores</text>\n<g>\n<rect x=\"36\" y=\"170\" width=\"150\" height=\"28\" fill=\"none\" stroke=\"#23282B\"/>\n<rect x=\"36\" y=\"170\" width=\"103.5\" height=\"28\" fill=\"#FFFFFF\" fill-opacity=\"0.16\"/>\n<text x=\"42\" y=\"189\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">the: 0.40</text>\n<rect x=\"196\" y=\"170\" width=\"150\" height=\"28\" fill=\"none\" stroke=\"#23282B\"/>\n<rect x=\"196\" y=\"170\" width=\"51\" height=\"28\" fill=\"#FFFFFF\" fill-opacity=\"0.16\"/>\n<text x=\"202\" y=\"189\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">cat: 0.20</text>\n<rect x=\"356\" y=\"170\" width=\"150\" height=\"28\" fill=\"none\" stroke=\"#23282B\"/>\n<rect x=\"356\" y=\"170\" width=\"103.5\" height=\"28\" fill=\"#FFFFFF\" fill-opacity=\"0.16\"/>\n<text x=\"362\" y=\"189\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">sat: 0.40</text>\n</g>\n<text x=\"20\" y=\"228\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">3. weighted sum of the value vectors</text>\n<text x=\"36\" y=\"252\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">v(the)=(1,0)  v(cat)=(0,2)  v(sat)=(2,2)</text>\n<text x=\"36\" y=\"274\" font-size=\"12.5\" fill=\"#DDE3E7\" class=\"mono\">0.40&#183;(1,0) + 0.20&#183;(0,2) + 0.40&#183;(2,2)</text>\n<text x=\"36\" y=\"298\" font-size=\"13.5\" fill=\"#EDEFF0\" font-weight=\"700\" class=\"mono\">output &#8776; (1.20, 1.20)</text>\n<text x=\"20\" y=\"336\" font-size=\"12\" fill=\"#9AA1A6\">&#8220;cat&#8221; and &#8220;sat&#8221; share the query's highest similarity and each get weight 0.40;</text>\n<text x=\"20\" y=\"354\" font-size=\"12\" fill=\"#9AA1A6\">&#8220;the&#8221; is orthogonal to the query and gets the leftover weight 0.20. Every</text>\n<text x=\"20\" y=\"372\" font-size=\"12\" fill=\"#9AA1A6\">weight comes from one shared softmax, so the three always sum to 1.00.</text>\n</svg>",
              "cap": "Three tokens — “the”, “cat”, “sat” — each contribute a 2-dimensional key and value; the query shown is “cat”'s. Scaled dot products of 0.71 / 0.00 / 0.71 become softmax weights of 0.40 / 0.20 / 0.40, and the output is that weighted sum of the three value vectors: approximately (1.20, 1.20)."
            },
            {
              "t": "p",
              "x": "Notice what happened to the query token itself: “cat”'s query was no more similar to “cat”'s own key than to an unrelated token's key in this toy example — attention has no built-in preference for a token to attend to itself, that behavior (or its absence) is entirely learned from data."
            }
          ]
        },
        {
          "title": "Multi-head attention",
          "blocks": [
            {
              "t": "p",
              "x": "A single attention computation gives one weighting scheme per query — one notion of “relevant.” Real language needs several at once: one position might need to track subject–verb agreement, another the referent of a pronoun, another the boundary of a phrase. Multi-head attention runs several independent attention computations in parallel, each with its own learned W_Q, W_K, W_V, and lets each head specialize in whatever kind of relationship helps reduce the loss."
            },
            {
              "t": "p",
              "x": "Concretely, the model dimension d_model is split across h heads, each operating on a smaller dimension d_model/h, so the total compute cost stays comparable to one full-width attention computation. The h heads' outputs are concatenated back to width d_model and passed through one more learned linear projection before leaving the layer."
            },
            {
              "t": "list",
              "items": [
                "Each head has independent Q/K/V projection matrices, learned end to end — nobody assigns a head to “syntax” or “coreference” by hand.",
                "Splitting into h narrower heads costs roughly the same total compute as one wide head, since each head's projections are smaller.",
                "The concatenation-then-project step lets the model recombine what different heads found before the result moves on."
              ]
            }
          ]
        },
        {
          "title": "Order, self-attention and cross-attention",
          "blocks": [
            {
              "t": "p",
              "x": "Attention has a property recurrence never had to worry about: it is permutation-invariant. Shuffle the input tokens and, absent any other signal, the set of outputs shuffles identically — nothing about the mechanism itself encodes which position came first. Since word order carries meaning, a positional encoding vector (sinusoidal functions of position in the original transformer, or a learned vector per position in many later models) is added to each token's embedding before attention runs, so position becomes part of what queries and keys can compare on."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 620 380\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">self-attention vs. cross-attention</text>\n\n<rect x=\"30\" y=\"50\" width=\"250\" height=\"130\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1.5\" rx=\"8\"/>\n<text x=\"46\" y=\"76\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">encoder self-attention</text>\n<text x=\"46\" y=\"98\" font-size=\"12\" fill=\"#9BA3A9\" class=\"mono\">Q, K, V all from the</text>\n<text x=\"46\" y=\"114\" font-size=\"12\" fill=\"#9BA3A9\" class=\"mono\">same input sequence</text>\n<circle cx=\"70\" cy=\"150\" r=\"9\" fill=\"#FFFFFF\" fill-opacity=\"0.7\"/>\n<circle cx=\"120\" cy=\"150\" r=\"9\" fill=\"#FFFFFF\" fill-opacity=\"0.7\"/>\n<circle cx=\"170\" cy=\"150\" r=\"9\" fill=\"#FFFFFF\" fill-opacity=\"0.7\"/>\n<circle cx=\"220\" cy=\"150\" r=\"9\" fill=\"#FFFFFF\" fill-opacity=\"0.7\"/>\n<path d=\"M70,150 Q145,120 220,150\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.2\" stroke-dasharray=\"3,3\"/>\n<path d=\"M120,150 Q145,132 170,150\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.2\" stroke-dasharray=\"3,3\"/>\n\n<rect x=\"340\" y=\"50\" width=\"250\" height=\"130\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1.5\" rx=\"8\"/>\n<text x=\"356\" y=\"76\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">decoder cross-attention</text>\n<text x=\"356\" y=\"98\" font-size=\"12\" fill=\"#9BA3A9\" class=\"mono\">Q from the decoder;</text>\n<text x=\"356\" y=\"114\" font-size=\"12\" fill=\"#9BA3A9\" class=\"mono\">K, V from the encoder</text>\n<circle cx=\"380\" cy=\"150\" r=\"9\" fill=\"#D2D8DC\"/>\n<circle cx=\"420\" cy=\"150\" r=\"9\" fill=\"#D2D8DC\"/>\n<circle cx=\"460\" cy=\"150\" r=\"9\" fill=\"#FFFFFF\"/>\n<path d=\"M460,150 L380,150\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.2\" stroke-dasharray=\"3,3\"/>\n<path d=\"M460,150 L420,150\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.2\" stroke-dasharray=\"3,3\"/>\n\n<text x=\"30\" y=\"212\" font-size=\"12\" fill=\"#9AA1A6\">4 tokens shown per box; dashed lines mark two of each token's attention</text>\n<text x=\"30\" y=\"230\" font-size=\"12\" fill=\"#9AA1A6\">links, not all of them, to keep the diagram readable.</text>\n\n<rect x=\"30\" y=\"256\" width=\"560\" height=\"100\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1.5\" rx=\"8\"/>\n<text x=\"46\" y=\"280\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"700\">positional encoding</text>\n<text x=\"46\" y=\"300\" font-size=\"12\" fill=\"#9BA3A9\">attention alone is permutation-invariant — reordering the input tokens reorders</text>\n<text x=\"46\" y=\"318\" font-size=\"12\" fill=\"#9BA3A9\">the output identically, with no sense of position. a positional vector (sinusoidal</text>\n<text x=\"46\" y=\"336\" font-size=\"12\" fill=\"#9BA3A9\">or learned) is added to each token embedding before attention to restore order.</text>\n</svg>",
              "cap": "Self-attention (left) draws its queries, keys and values from one sequence — every encoder position can consult every other encoder position. Cross-attention (right) draws queries from one sequence (the decoder, generating output) and keys/values from another (the encoder's finished representation of the input) — this is how a translation model's output attends back to the source sentence."
            },
            {
              "t": "p",
              "x": "Self-attention versus cross-attention is a statement about where Q, K and V come from, not a different formula — the scaled dot-product computation from the previous chapter is identical either way."
            }
          ]
        },
        {
          "title": "The transformer block",
          "blocks": [
            {
              "t": "p",
              "x": "A transformer stacks identical blocks, each combining multi-head attention with a small position-wise feedforward network (two linear layers with a nonlinearity between them, applied independently to every position). Both sub-layers are wrapped the same way: the sub-layer's output is added back to its own input (a residual connection) and the result is normalized (layer normalization), which keeps gradients well-behaved through very deep stacks — the same residual idea the convolutional-networks booklet uses for the same reason."
            },
            {
              "t": "p",
              "x": "A decoder that must generate one token at a time needs one more constraint: causal masking. Before the softmax, every score that would let a position attend to a position after it in the sequence is set to negative infinity, so it receives zero weight — the model can only condition on tokens it has actually already produced, both during training (via a mask, computed in parallel) and during generation (where later positions simply don't exist yet)."
            },
            {
              "t": "note",
              "x": "This block — attention, add & norm, feedforward, add & norm, repeated N times — is the entire architecture behind the large language models booklet. Everything past this point is a story about scale, pretraining objective, and what you do with the resulting model, not a new mechanism."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These re-run the scaled dot-product computation with new numbers and check the distinctions between self-attention, cross-attention, and positional encoding."
            }
          ],
          "exercises": [
            {
              "q": "Explain in your own words why attention scores are divided by √d_k before the softmax, rather than left as raw dot products.",
              "steps": [
                "Dot products between vectors tend to grow larger simply as dimensionality d_k increases, even with no real change in how similar the vectors are.",
                "Softmax saturates for very large inputs — the largest score dominates almost completely and the gradient with respect to the others goes nearly to zero.",
                "Dividing by √d_k keeps the scores in a range where softmax still produces a workable, learnable gradient regardless of the model's width."
              ],
              "answer": "Because unscaled dot products grow with dimensionality and would push softmax into a saturated, low-gradient regime; dividing by √d_k keeps the scale roughly constant as d_k changes."
            },
            {
              "kind": "mc",
              "q": "What is the key difference between self-attention and cross-attention?",
              "options": [
                "Cross-attention takes its queries from one sequence and its keys/values from a different sequence, while self-attention takes all three from the same sequence",
                "Self-attention uses a different mathematical formula than cross-attention",
                "Cross-attention cannot be scaled by √d_k",
                "Self-attention only works on sequences shorter than 10 tokens"
              ],
              "correct": 0,
              "steps": [
                "Both mechanisms compute softmax(QKᵀ/√d_k)V — the formula does not change.",
                "What changes is only where Q, K and V come from: one shared sequence (self-attention) or two different sequences (cross-attention, e.g. a decoder attending to an encoder's output)."
              ],
              "answer": "Cross-attention draws Q from one sequence and K/V from another; self-attention draws all three from the same sequence. The underlying computation is identical either way."
            },
            {
              "kind": "write",
              "q": "Fill in the blank: since attention itself has no built-in notion of token order, a ___ vector is added to each token's embedding to give the model access to position.",
              "accept": [
                "positional encoding",
                "positional encodings",
                "position encoding",
                "positional embedding"
              ],
              "hint": "sinusoidal in the original transformer paper",
              "steps": [
                "Attention is permutation-invariant on its own: shuffling the input tokens shuffles the output identically.",
                "To recover order, a vector encoding each position (built from sine/cosine functions of different frequencies, or learned directly) is added to the token embedding before the first attention layer.",
                "This makes position part of what queries and keys can match on, without changing the attention formula itself."
              ],
              "answer": "Positional encoding."
            },
            {
              "kind": "mc",
              "q": "In the worked scaled dot-product example (query = “cat”, keys/values for “the”, “cat”, “sat”), which token received the least attention weight, and why?",
              "options": [
                "“the”, because its key was orthogonal to the query, giving it the lowest scaled dot-product score",
                "“sat”, because it appears last in the sequence",
                "“cat”, because a token can never attend to itself",
                "All three tokens received exactly equal weight"
              ],
              "correct": 0,
              "steps": [
                "The scaled scores were: the ≈ 0.71, cat = 0.00, sat ≈ 0.71.",
                "The lowest score, 0.00, belongs to “cat”'s own key — not “the”'s.",
                "Softmax turns the lowest score into the lowest weight: 0.20 for “cat”, versus 0.40 each for “the” and “sat”."
              ],
              "answer": "“cat” received the least weight (0.20) because its own key had the lowest scaled dot product (0.00) with the query in this example — not “the”, which tied with “sat” for the highest weight."
            },
            {
              "q": "Two tokens receive scaled attention scores of 2.0 and 1.0. Compute their softmax weights, and by roughly what factor is the first token weighted more heavily than the second?",
              "steps": [
                "softmax weight for score s is e^s divided by the sum of e^s over all scores here: e^2.0 ≈ 7.389, e^1.0 ≈ 2.718, sum ≈ 10.107.",
                "Weight 1 = 7.389/10.107 ≈ 0.731. Weight 2 = 2.718/10.107 ≈ 0.269.",
                "Ratio of the weights = e^(2.0−1.0) = e^1 ≈ 2.72 — for two scores that differ by exactly 1, softmax always weights the larger one about e times more, regardless of the scores' absolute size."
              ],
              "answer": "Weights ≈ 0.731 and 0.269; the first token is weighted about 2.72× (≈ e) more heavily than the second."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Query",
          "A vector a position emits to represent what kind of information it is looking for."
        ],
        [
          "Key",
          "A vector a position emits to advertise what information it offers, compared against queries."
        ],
        [
          "Value",
          "The vector actually mixed into the output when its position's key matches a query."
        ],
        [
          "Scaled dot-product attention",
          "softmax(QKᵀ/√d_k)V — the core computation of transformer attention."
        ],
        [
          "Softmax",
          "A function turning a vector of scores into a probability distribution that sums to 1."
        ],
        [
          "Multi-head attention",
          "Running several independent attention computations in parallel, each with its own learned projections."
        ],
        [
          "Self-attention",
          "Attention where queries, keys and values all come from the same sequence."
        ],
        [
          "Cross-attention",
          "Attention where queries come from one sequence and keys/values from a different sequence."
        ],
        [
          "Positional encoding",
          "A vector added to each token embedding to restore the order information attention discards on its own."
        ],
        [
          "Causal mask",
          "Setting attention scores for future positions to negative infinity so a decoder cannot see ahead."
        ],
        [
          "Transformer block",
          "One layer of multi-head attention plus a feedforward network, each wrapped in a residual connection and normalization."
        ],
        [
          "Residual connection",
          "Adding a sub-layer's input back to its output, easing gradient flow through deep stacks."
        ],
        [
          "Layer normalization",
          "Normalizing activations across features at each position, used to stabilize deep transformer training."
        ],
        [
          "Feedforward network (position-wise)",
          "A small two-layer network applied independently and identically to every position in a transformer block."
        ],
        [
          "Encoder-decoder architecture",
          "A transformer variant with an encoder that reads the input and a decoder that generates output via cross-attention to it."
        ],
        [
          "Attention weight",
          "The softmax-normalized score determining how much one position's value contributes to another position's output."
        ]
      ]
    }
});
