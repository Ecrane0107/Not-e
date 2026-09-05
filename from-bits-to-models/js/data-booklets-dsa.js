Object.assign(BOOKLETS, {
  "complexity": {
      "title": "Big-O and complexity",
      "blurb": "Describing how runtime and memory grow as the input grows — the vocabulary that lets you compare two approaches before writing either one.",
      "chapters": [
        {
          "title": "What Big-O actually measures",
          "blocks": [
            {
              "t": "p",
              "x": "Big-O describes how the cost of an algorithm grows as its input grows, in the limit of large inputs, ignoring constant factors and lower-order terms. Saying an algorithm is O(n) does not mean it takes exactly n steps, or even that it is fast — it means that doubling the input roughly doubles the work, for inputs large enough that the trend dominates. O(n²) means doubling the input roughly quadruples the work. What Big-O throws away on purpose is precisely the information that changes with the machine, the language, and the implementation: constant multipliers and one-time overhead."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">cost versus input size n, same vertical scale</text>\n<line x1=\"60\" y1=\"250\" x2=\"620\" y2=\"250\" stroke=\"#2E3438\"/><line x1=\"60\" y1=\"30\" x2=\"60\" y2=\"256\" stroke=\"#2E3438\"/>\n<text x=\"30\" y=\"40\" font-size=\"11\" fill=\"#666D72\" text-anchor=\"end\">cost</text>\n<text x=\"600\" y=\"268\" font-size=\"11\" fill=\"#666D72\" text-anchor=\"end\">n</text>\n<polyline points=\"60,240 620,240\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.6\"/>\n<text x=\"560\" y=\"234\" font-size=\"11.5\" fill=\"#666D72\">O(1)</text>\n<polyline points=\"60,240 130,210 220,192 340,178 480,166 620,157\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.8\"/>\n<text x=\"560\" y=\"150\" font-size=\"11.5\" fill=\"#9AA1A6\">O(log n)</text>\n<polyline points=\"60,240 620,60\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"560\" y=\"54\" font-size=\"11.5\" fill=\"#EDEFF0\">O(n)</text>\n<polyline points=\"60,240 150,205 250,165 350,120 450,80 550,40 600,20\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\" stroke-dasharray=\"6 3\"/>\n<text x=\"420\" y=\"70\" font-size=\"11.5\" fill=\"#EDEFF0\">O(n log n)</text>\n<polyline points=\"60,240 200,200 320,140 420,70 480,35 520,15\" fill=\"none\" stroke=\"#C77\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"128\" font-size=\"11.5\" fill=\"#C77\">O(n²)</text>\n<polyline points=\"60,240 240,220 320,190 380,140 420,90 450,45 470,18\" fill=\"none\" stroke=\"#C77\" stroke-width=\"2\" stroke-dasharray=\"2 3\"/>\n<text x=\"240\" y=\"212\" font-size=\"11.5\" fill=\"#C77\">O(2ⁿ)</text>\n<text x=\"40\" y=\"278\" font-size=\"12.5\" fill=\"#9AA1A6\">The ordering never changes for large enough n — a curve that starts</text>\n<text x=\"40\" y=\"296\" font-size=\"12.5\" fill=\"#9AA1A6\">higher always ends up crossing below one that grows slower.</text>\n</svg>",
              "cap": "The standard complexity classes, drawn on the same axes. However close two curves start, their order for large n is fixed — a faster-growing curve always eventually overtakes a slower one, however small its head start looked."
            },
            {
              "t": "p",
              "x": "Formally, f(n) is O(g(n)) if there exist constants c and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀ — an upper bound on growth, up to a constant factor, beyond some point. Θ(g(n)) is the tighter claim that f grows at exactly the rate of g, both above and below; Ω(g(n)) is a lower bound. In casual use, and in this booklet, O is routinely used where Θ is meant, because most algorithms people discuss have matching upper and lower bounds anyway."
            },
            {
              "t": "list",
              "items": [
                "O(1) — constant: array indexing, a hash lookup in the typical case.",
                "O(log n) — logarithmic: binary search, balanced tree operations.",
                "O(n) — linear: scanning a list once.",
                "O(n log n) — linearithmic: comparison-based sorting at its best.",
                "O(n²) — quadratic: comparing every pair, naive nested loops.",
                "O(2ⁿ) — exponential: trying every subset.",
                "O(n!) — factorial: trying every permutation."
              ]
            }
          ]
        },
        {
          "title": "Reading code for complexity",
          "blocks": [
            {
              "t": "p",
              "x": "Most complexity in real code can be read off directly, following a small set of rules. Statements executed one after another add: a loop that is O(n) followed by another loop that is O(n) is still O(n), not O(2n), because Big-O discards constant factors — you take the larger of the two, or their sum, which is the same thing asymptotically. Nested loops multiply: a loop of n iterations containing a loop of m iterations is O(n·m), because the inner work happens in full for every outer iteration."
            },
            {
              "t": "code",
              "x": "for i in range(n):        # O(n)\n    do_o1_work()\n\nfor i in range(n):        # sequential: still O(n) overall\n    for j in range(n):    #   nested: O(n) x O(n) = O(n^2)\n        do_o1_work()"
            },
            {
              "t": "p",
              "x": "A loop whose bound shrinks or grows multiplicatively each iteration — halving a search space, or doubling a counter until it passes n — takes O(log n) iterations, because the number of times you can halve n before reaching 1 is log₂n. Recognising this pattern (binary search, and any \"repeatedly divide the problem in half\" loop) is the single most common source of unexpected logarithms in interview-style analysis."
            },
            {
              "t": "worked",
              "q": "What is the complexity of this: for i in range(n): for j in range(i): print(i, j)?",
              "steps": [
                "The outer loop runs n times, with i taking values 0 through n-1.",
                "For each i, the inner loop runs i times, not n times.",
                "Total inner iterations are 0 + 1 + 2 + ... + (n-1).",
                "That sum is n(n-1)/2, which is O(n²) — the constant factor of 1/2 is dropped."
              ],
              "answer": "O(n²). A triangular loop like this looks like it should be cheaper than a full nested loop, and it genuinely does half the work in absolute terms, but that constant factor disappears in Big-O — both are quadratic."
            }
          ]
        },
        {
          "title": "Best, worst, and average case",
          "blocks": [
            {
              "t": "p",
              "x": "The same algorithm can have different complexities depending on which input you feed it, and Big-O notation by itself does not say which case is meant — that has to be stated alongside it. Linear search is O(1) best case (the target is first), O(n) worst case (the target is last, or absent), and O(n) average case over a uniformly random position. Quicksort with a naive pivot choice is O(n log n) on average but O(n²) worst case, when the input happens to be already sorted (or adversarially chosen) and the pivot is always the smallest or largest remaining element."
            },
            {
              "t": "p",
              "x": "Worst-case analysis is quoted by default in most contexts because it is a guarantee — it bounds what can happen regardless of input, which matters for correctness-critical or latency-sensitive systems where an occasional slow input is unacceptable. Average-case analysis needs an assumed distribution over inputs, which is harder to justify and easier to get wrong; it matters more for systems where typical performance, not worst-case, drives the user experience."
            },
            {
              "t": "note",
              "x": "Randomised algorithms sidestep the difference between average and worst case for a fixed input by randomising the algorithm's own choices instead. Randomised quicksort, which picks a random pivot, has expected O(n log n) time on every input — there is no specific adversarial input that reliably triggers the bad case, because the bad case now depends on the algorithm's coin flips, not on the data."
            }
          ]
        },
        {
          "title": "Amortised analysis",
          "blocks": [
            {
              "t": "p",
              "x": "Amortised analysis bounds the average cost of an operation across any sequence of operations, without claiming that every individual operation is cheap — a genuinely different guarantee from average-case analysis, which averages over random inputs. The arrays booklet's dynamic array doubling is the standard example: most pushes are O(1), but occasionally one triggers an O(n) resize, and yet the amortised cost per push, across any sequence of n pushes, is still O(1)."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">cost of the k-th push into a doubling dynamic array</text>\n<line x1=\"60\" y1=\"190\" x2=\"620\" y2=\"190\" stroke=\"#2E3438\"/>\n<rect x=\"70\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"90\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"110\" y=\"174\" width=\"10\" height=\"16\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"130\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"150\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"170\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"190\" y=\"150\" width=\"10\" height=\"40\" fill=\"#EDEFF0\" opacity=\"0.55\"/>\n<rect x=\"210\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"230\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"250\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"270\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"290\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"310\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"330\" y=\"90\" width=\"10\" height=\"100\" fill=\"#EDEFF0\" opacity=\"0.75\"/>\n<rect x=\"350\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"370\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"390\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"410\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"430\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"450\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"470\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"490\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"510\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"530\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"550\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"570\" y=\"182\" width=\"10\" height=\"8\" fill=\"#EDEFF0\" opacity=\"0.3\"/>\n<rect x=\"590\" y=\"30\" width=\"10\" height=\"160\" fill=\"#EDEFF0\" opacity=\"0.9\"/>\n<text x=\"60\" y=\"208\" font-size=\"11.5\" fill=\"#9AA1A6\">most pushes: O(1), just write the new element</text>\n<text x=\"330\" y=\"70\" font-size=\"11\" fill=\"#EDEFF0\" text-anchor=\"middle\">resize: O(k) copy</text>\n<text x=\"40\" y=\"242\" font-size=\"12.5\" fill=\"#666D72\">Spikes get rarer as they get taller — each one costs exactly as much as</text>\n<text x=\"40\" y=\"260\" font-size=\"12.5\" fill=\"#666D72\">all the O(1) pushes since the last spike combined, keeping the average O(1).</text>\n</svg>",
              "cap": "Expensive resizes get rarer as they get bigger, precisely fast enough that each one costs no more than every cheap push since the last resize combined — that balance is what amortised O(1) means."
            },
            {
              "t": "p",
              "x": "The proof technique behind this, called the accounting method, charges each cheap operation a little extra — say, three units of \"credit\" per push — and lets that credit accumulate to pay for the expensive resize when it eventually happens. As long as the accumulated credit never runs out before the bill comes due, the amortised bound holds for every possible sequence, including one an adversary constructs specifically to trigger resizes as often as possible."
            },
            {
              "t": "note",
              "x": "Amortised bounds are about sequences of operations on one structure, not about any single call. If a system needs every individual push to be fast — a hard real-time deadline, say — an amortised O(1) guarantee is not sufficient, because that single expensive resize can still happen on any given call. Preallocating capacity up front is the usual fix when that matters."
            }
          ]
        },
        {
          "title": "Space complexity and trade-offs",
          "blocks": [
            {
              "t": "p",
              "x": "Space complexity measures memory the same way time complexity measures steps: as a function of input size, ignoring constants. It is usually split into the input itself, which you rarely count, and auxiliary space, the extra memory the algorithm uses beyond its input — a recursive call stack, a hash table built for lookups, a copy of the array being sorted."
            },
            {
              "t": "p",
              "x": "An algorithm is in-place if its auxiliary space is O(1): it rearranges the input using only a constant amount of extra memory, as insertion sort and heapsort do. Merge sort's usual implementation is not in-place — it needs O(n) auxiliary space for the merge step — which is the standard trade-off quoted against it: better worst-case time complexity, worse space complexity, than quicksort's typical in-place partitioning."
            },
            {
              "t": "list",
              "items": [
                "<strong>Time for space</strong>: memoisation and caching spend memory to avoid recomputation.",
                "<strong>Space for time</strong>: a hash table spends memory on top of the raw data to buy O(1) average lookup.",
                "<strong>Recursion's hidden cost</strong>: an elegant O(n) recursive algorithm often carries O(n) auxiliary stack space that an iterative rewrite would not."
              ]
            },
            {
              "t": "note",
              "x": "The recursion booklet's stack-depth discussion is exactly a space-complexity fact in disguise: naive recursive Fibonacci is not just O(2ⁿ) in time, it is also O(n) in auxiliary space for the deepest call stack — small next to its time cost here, but the same accounting applies to any recursive algorithm."
            }
          ]
        },
        {
          "title": "Recurrences and the master theorem",
          "blocks": [
            {
              "t": "p",
              "x": "A recursive algorithm's running time is naturally described by a recurrence: an equation for T(n) in terms of T of some smaller input. Merge sort splits into two halves and does O(n) work to merge them, giving T(n) = 2T(n/2) + O(n). Binary search splits into one half with O(1) work outside the recursive call, giving T(n) = T(n/2) + O(1)."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 710 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">T(n) = 2T(n/2) + O(n) — merge sort's recursion tree, level by level</text>\n<text x=\"40\" y=\"59\" font-size=\"11\" fill=\"#666D72\">level 0</text>\n<text x=\"40\" y=\"72\" font-size=\"10\" fill=\"#9AA1A6\">cost: n</text>\n<rect x=\"270\" y=\"42\" width=\"120\" height=\"26\" rx=\"4\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"330\" y=\"59\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">n</text>\n<line x1=\"330\" y1=\"68\" x2=\"200\" y2=\"98\" stroke=\"#2E3438\"/><line x1=\"330\" y1=\"68\" x2=\"460\" y2=\"98\" stroke=\"#2E3438\"/>\n<text x=\"40\" y=\"115\" font-size=\"11\" fill=\"#666D72\">level 1</text>\n<text x=\"40\" y=\"128\" font-size=\"10\" fill=\"#9AA1A6\">cost: 2×n/2 = n</text>\n<rect x=\"140\" y=\"98\" width=\"120\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"200\" y=\"115\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">n/2</text>\n<rect x=\"400\" y=\"98\" width=\"120\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"460\" y=\"115\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">n/2</text>\n<line x1=\"200\" y1=\"124\" x2=\"120\" y2=\"154\" stroke=\"#2E3438\"/><line x1=\"200\" y1=\"124\" x2=\"280\" y2=\"154\" stroke=\"#2E3438\"/>\n<line x1=\"460\" y1=\"124\" x2=\"380\" y2=\"154\" stroke=\"#2E3438\"/><line x1=\"460\" y1=\"124\" x2=\"540\" y2=\"154\" stroke=\"#2E3438\"/>\n<rect x=\"80\" y=\"154\" width=\"80\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"120\" y=\"170\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\" class=\"mono\">n/4</text>\n<rect x=\"240\" y=\"154\" width=\"80\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"280\" y=\"170\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\" class=\"mono\">n/4</text>\n<rect x=\"340\" y=\"154\" width=\"80\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"380\" y=\"170\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\" class=\"mono\">n/4</text>\n<rect x=\"500\" y=\"154\" width=\"80\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"540\" y=\"170\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\" class=\"mono\">n/4</text>\n<text x=\"40\" y=\"210\" font-size=\"13\" fill=\"#EDEFF0\">Every level costs O(n) regardless of how many nodes it has — level 2's four n/4 pieces sum to n too.</text>\n<text x=\"40\" y=\"232\" font-size=\"13\" fill=\"#9AA1A6\">There are log₂n levels before pieces reach size 1.</text>\n<text x=\"40\" y=\"256\" font-size=\"13.5\" fill=\"#EDEFF0\">O(n) per level x O(log n) levels = O(n log n) total.</text>\n</svg>",
              "cap": "Merge sort's recursion tree: every level does O(n) total work, however many pieces it is split into, and there are O(log n) levels before pieces shrink to size 1 — multiply the two to get O(n log n)."
            },
            {
              "t": "p",
              "x": "The master theorem gives a direct answer for recurrences of the form T(n) = a·T(n/b) + f(n) by comparing f(n) to n^(log_b a), the cost implied by the branching alone. If f(n) grows slower, the recursive calls dominate and T(n) = O(n^(log_b a)). If f(n) grows at the same rate, an extra log factor appears: T(n) = O(n^(log_b a) · log n) — this is merge sort's case, with a = 2, b = 2, f(n) = n, and log_b a = 1. If f(n) grows faster, the combining step dominates and T(n) = O(f(n))."
            },
            {
              "t": "worked",
              "q": "Apply the master theorem to T(n) = 4T(n/2) + O(n) — four subproblems of half the size, linear combining work. What is T(n)?",
              "steps": [
                "Here a = 4, b = 2, f(n) = n.",
                "Compute n^(log_b a) = n^(log_2 4) = n^2.",
                "Compare f(n) = n against n^2: f(n) grows strictly slower.",
                "When the recursive branching dominates the combining cost, T(n) = O(n^(log_b a))."
              ],
              "answer": "T(n) = O(n²). The four-way branching outweighs the linear combining step, so the recursion tree's bottom levels dominate the total — the same shape of argument as naive recursive Fibonacci's exponential blowup, just with a cleaner closed form here."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Reading complexity off code is a skill that only comes from doing it repeatedly — these mix code-reading with the underlying reasoning."
            }
          ],
          "exercises": [
            {
              "q": "def contains_dup(lst): return len(lst) != len(set(lst)). Building the set is O(n). What is the overall complexity, and why not O(n²)?",
              "kind": "mc",
              "options": [
                "O(n) — inserting n items into a hash set is O(n) on average",
                "O(n²) — every insertion checks all existing items",
                "O(n log n) — the set keeps items sorted",
                "O(1) — set operations are always constant time"
              ],
              "correct": 0,
              "steps": [
                "A hash set insertion is O(1) on average, not O(n), because it hashes directly to a bucket rather than scanning existing entries.",
                "Inserting n items at O(1) each totals O(n).",
                "This differs from a sorted structure or a list, where each insertion might cost more.",
                "So the whole function, dominated by building the set, is O(n)."
              ],
              "answer": "O(n). Each of the n insertions into a hash set costs O(1) on average, so building it is O(n) total — the confusion with O(n²) usually comes from assuming a list's O(n) linear-scan insertion instead of a hash set's O(1)."
            },
            {
              "q": "Binary search on a sorted array of size n takes how many comparisons in the worst case, expressed with logarithms?",
              "kind": "write",
              "accept": [
                "log2(n)",
                "log n",
                "logarithmic",
                "about log2 n"
              ],
              "hint": "in terms of log base 2 of n",
              "steps": [
                "Each comparison eliminates half of the remaining search space.",
                "Starting from n elements, after k comparisons at most n/2^k elements remain.",
                "The search ends once that quantity reaches 1, i.e. 2^k = n.",
                "Solving for k gives k = log2(n)."
              ],
              "answer": "About log2(n) comparisons — each comparison halves the remaining space, so the count needed to shrink n down to 1 is exactly the base-2 logarithm of n."
            },
            {
              "q": "An algorithm's average case is O(n log n) but its worst case is O(n²). A safety-critical system with a hard per-call time budget is choosing whether to use it. Which figure should it design around?",
              "kind": "mc",
              "options": [
                "The worst case, O(n²) — a guarantee must hold for every input, not just typical ones",
                "The average case, O(n log n) — worst case is rare in practice",
                "Neither — measure wall-clock time instead",
                "Whichever is smaller"
              ],
              "correct": 0,
              "steps": [
                "A hard time budget must be met on every call, not merely on most calls.",
                "Average-case analysis assumes a distribution of inputs and says nothing about a specific unlucky one.",
                "Worst-case analysis is a guarantee that holds regardless of which input actually arrives.",
                "A safety-critical system with a hard deadline needs the guarantee, not the typical figure."
              ],
              "answer": "The worst case. A hard per-call budget must hold on every input, including an adversarial or unlucky one, which is exactly what worst-case analysis — not average-case — guarantees."
            },
            {
              "q": "T(n) = T(n/2) + O(1), the recurrence for binary search. Using the master theorem's comparison, is this the branching-dominates, balanced, or combining-dominates case?",
              "kind": "mc",
              "options": [
                "Balanced — f(n) = O(1) grows at the same rate as n^(log_b a) = n^0 = 1",
                "Branching-dominates, giving O(n)",
                "Combining-dominates, giving O(1)",
                "The master theorem does not apply to this recurrence"
              ],
              "correct": 0,
              "steps": [
                "Here a = 1, b = 2, f(n) = O(1).",
                "n^(log_b a) = n^(log_2 1) = n^0 = 1.",
                "f(n) = O(1) grows at exactly the same rate as this baseline of 1.",
                "The balanced case applies, adding a log factor: T(n) = O(n^0 log n) = O(log n)."
              ],
              "answer": "The balanced case: f(n) and n^(log_b a) grow at the same rate, so a log factor is added to give T(n) = O(log n) — exactly binary search's known complexity, recovered directly from the recurrence."
            },
            {
              "q": "A function inserts each of n items into a Python list at index 0 (list.insert(0, x), which is O(n) per call). What is the total complexity, and how would using a deque instead change it?",
              "kind": "write",
              "accept": [
                "O(n^2), deque makes it O(n)",
                "quadratic, deque is linear",
                "n squared, o(n) with deque"
              ],
              "hint": "sum the cost of n insertions, each O(n)",
              "steps": [
                "Each insertion at the front of a list shifts every existing element, costing O(k) on the k-th insertion.",
                "Summing O(1) + O(2) + ... + O(n) across n insertions gives O(n²) total.",
                "A deque supports O(1) insertion at the front, since it does not need to shift a contiguous block.",
                "Using a deque instead reduces the total from O(n²) to O(n)."
              ],
              "answer": "O(n²) total with a list, because each of the n front-insertions costs O(n) itself. A deque supports O(1) insertion at the front, dropping the total to O(n) — this is exactly why the stackqueue and arrays booklets flag list-front-insertion as a classic performance trap."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Big-O",
          "An asymptotic upper bound on growth, ignoring constant factors."
        ],
        [
          "Big-Theta",
          "A tight asymptotic bound: growth matches both above and below."
        ],
        [
          "Big-Omega",
          "An asymptotic lower bound on growth."
        ],
        [
          "Asymptotic",
          "Describing behaviour in the limit of large input size, not at small n."
        ],
        [
          "Worst case",
          "The input that produces the largest possible cost for a given size."
        ],
        [
          "Average case",
          "Expected cost over an assumed distribution of inputs."
        ],
        [
          "Amortised analysis",
          "Bounding average cost per operation across any sequence, not any single call."
        ],
        [
          "In-place",
          "An algorithm using O(1) auxiliary space beyond its input."
        ],
        [
          "Auxiliary space",
          "Extra memory an algorithm uses beyond the input itself."
        ],
        [
          "Recurrence",
          "An equation defining a recursive algorithm's cost in terms of smaller inputs."
        ],
        [
          "Master theorem",
          "A direct formula for the complexity of recurrences of the form T(n) = aT(n/b) + f(n)."
        ],
        [
          "Randomised algorithm",
          "An algorithm whose own random choices, not the input, determine its bad cases."
        ],
        [
          "Accounting method",
          "Proving amortised bounds by charging cheap operations extra credit to pay for rare expensive ones."
        ]
      ]
    },
  "trees": {
      "title": "Trees",
      "blurb": "Hierarchies with exactly one path between any two nodes — the shape behind search, parsing, and every index a database keeps.",
      "chapters": [
        {
          "title": "What makes a tree a tree",
          "blocks": [
            {
              "t": "p",
              "x": "A tree is a hierarchy: one root, and every other node reached by exactly one path down from it. That single-path property is what distinguishes a tree from a general graph — there is no way to reach a node two different ways, which is precisely what makes trees easy to reason about recursively: each subtree is itself a smaller, self-contained tree."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"330\" cy=\"40\" r=\"20\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"330\" y=\"45\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">8</text>\n<text x=\"405\" y=\"45\" font-size=\"12\" fill=\"#9AA1A6\">root — depth 0</text>\n<line x1=\"330\" y1=\"60\" x2=\"210\" y2=\"100\" stroke=\"#2E3438\"/><line x1=\"330\" y1=\"60\" x2=\"450\" y2=\"100\" stroke=\"#2E3438\"/>\n<circle cx=\"210\" cy=\"118\" r=\"18\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"210\" y=\"123\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">3</text>\n<circle cx=\"450\" cy=\"118\" r=\"18\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"450\" y=\"123\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">10</text>\n<text x=\"500\" y=\"123\" font-size=\"12\" fill=\"#9AA1A6\">depth 1</text>\n<line x1=\"210\" y1=\"136\" x2=\"150\" y2=\"176\" stroke=\"#2E3438\"/><line x1=\"210\" y1=\"136\" x2=\"270\" y2=\"176\" stroke=\"#2E3438\"/>\n<circle cx=\"150\" cy=\"194\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"150\" y=\"199\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">1</text>\n<circle cx=\"270\" cy=\"194\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"270\" y=\"199\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">6</text>\n<line x1=\"450\" y1=\"136\" x2=\"510\" y2=\"176\" stroke=\"#2E3438\"/>\n<circle cx=\"510\" cy=\"194\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"510\" y=\"199\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">14</text>\n<text x=\"535\" y=\"199\" font-size=\"12\" fill=\"#666D72\">leaves — depth 2</text>\n<text x=\"40\" y=\"230\" font-size=\"12.5\" fill=\"#9AA1A6\">Exactly one path from root to any node. Height here is 2 — the longest root-to-leaf path.</text>\n</svg>",
              "cap": "The vocabulary: root at the top, leaves with no children at the bottom, depth counting edges down from the root, height the longest root-to-leaf path."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Root",
                  "The single node with no parent, at the top of the hierarchy."
                ],
                [
                  "Leaf",
                  "A node with no children."
                ],
                [
                  "Depth",
                  "The number of edges from the root down to a given node."
                ],
                [
                  "Height",
                  "The longest root-to-leaf path — the depth of the deepest leaf."
                ],
                [
                  "Subtree",
                  "Any node together with everything beneath it, itself a complete tree."
                ]
              ]
            },
            {
              "t": "note",
              "x": "A tree with n nodes has exactly n − 1 edges, always — one edge connects each non-root node to its parent, and there is nowhere else an edge could go without creating a second path to some node, which would make it a general graph instead. This is a useful sanity check when building or debugging tree-construction code: count the edges."
            }
          ]
        },
        {
          "title": "The binary search tree invariant",
          "blocks": [
            {
              "t": "p",
              "x": "A binary search tree adds one ordering rule on top of the general tree shape: for every node, everything in its left subtree is smaller, and everything in its right subtree is larger. That single invariant, held everywhere in the tree simultaneously, is what makes search, insertion and deletion all follow the same pattern — compare against the current node, and step into whichever side could possibly contain the answer."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"24\" font-size=\"12\" fill=\"#666D72\">searching for 6 — each comparison eliminates one whole subtree</text>\n<circle cx=\"330\" cy=\"44\" r=\"19\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/><text x=\"330\" y=\"49\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">8</text>\n<line x1=\"330\" y1=\"63\" x2=\"220\" y2=\"100\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><line x1=\"330\" y1=\"63\" x2=\"440\" y2=\"100\" stroke=\"#2E3438\" stroke-dasharray=\"3 3\"/>\n<circle cx=\"220\" cy=\"118\" r=\"17\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/><text x=\"220\" y=\"123\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">3</text>\n<circle cx=\"440\" cy=\"118\" r=\"17\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\" opacity=\"0.35\"/><text x=\"440\" y=\"123\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" opacity=\"0.5\">10</text>\n<text x=\"460\" y=\"123\" font-size=\"11.5\" fill=\"#666D72\">6 &lt; 8 — this side skipped</text>\n<line x1=\"220\" y1=\"135\" x2=\"150\" y2=\"170\" stroke=\"#2E3438\" stroke-dasharray=\"3 3\"/><line x1=\"220\" y1=\"135\" x2=\"290\" y2=\"170\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<circle cx=\"150\" cy=\"188\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\" opacity=\"0.35\"/><text x=\"150\" y=\"193\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" opacity=\"0.5\">1</text>\n<circle cx=\"290\" cy=\"188\" r=\"16\" fill=\"#FFFFFF\"/><text x=\"290\" y=\"193\" text-anchor=\"middle\" font-size=\"12\" fill=\"#08090A\">6</text>\n<text x=\"40\" y=\"220\" font-size=\"12.5\" fill=\"#9AA1A6\">Three comparisons for eight nodes — each step halves the remaining</text>\n<text x=\"40\" y=\"240\" font-size=\"12.5\" fill=\"#9AA1A6\">candidates, exactly like binary search on a sorted array.</text>\n</svg>",
              "cap": "Searching for 6: compare against the root, discard the entire subtree that cannot contain it, repeat. Each comparison eliminates roughly half of what remains, exactly like binary search over a sorted array."
            },
            {
              "t": "p",
              "x": "Insertion follows the same walk as a failed search: descend comparing left or right, and when you fall off the tree — reach a null child where the search would have continued — that is exactly where the new node belongs. Deletion is the one operation with a genuine wrinkle: removing a node with two children requires finding a replacement that preserves the ordering, conventionally its in-order successor (the smallest node in its right subtree), which is guaranteed to have at most one child itself and so can be spliced in without further complication."
            },
            {
              "t": "worked",
              "q": "Insert 6 into the BST rooted at 8, with left subtree {3, 1, 10... } — specifically 8 has left child 3 and right child 10; 3 has left child 1. Where does 6 land?",
              "steps": [
                "Start at the root, 8. Since 6 < 8, go left.",
                "At 3, since 6 > 3, go right.",
                "3 has no right child yet, so this is where the search falls off the tree.",
                "6 becomes the right child of 3."
              ],
              "answer": "6 becomes 3's right child. Insertion is just a search that keeps going until it finds the empty slot the value belongs in."
            }
          ]
        },
        {
          "title": "Traversals",
          "blocks": [
            {
              "t": "p",
              "x": "A traversal visits every node exactly once, and the order it does so in depends on when it visits the current node relative to its children. In-order visits left subtree, then the node, then right subtree; pre-order visits the node first, then both subtrees; post-order visits both subtrees before the node. Level-order visits nodes breadth-first, one depth at a time, using a queue rather than the recursion the other three naturally use."
            },
            {
              "t": "p",
              "x": "In-order traversal of a binary search tree is the one worth internalising immediately: it always emits every value in ascending sorted order, directly from the BST invariant — everything smaller is visited (recursively) before the node, and everything larger after. This is also the standard way to verify a BST is valid: run an in-order traversal and confirm the output is non-decreasing."
            },
            {
              "t": "code",
              "x": "def inorder(node, out):\n    if node is None:\n        return\n    inorder(node.left, out)\n    out.append(node.value)\n    inorder(node.right, out)\n\n# iterative version, using an explicit stack instead of the call stack\ndef inorder_iter(root):\n    stack, out, node = [], [], root\n    while stack or node:\n        while node:\n            stack.append(node); node = node.left\n        node = stack.pop()\n        out.append(node.value)\n        node = node.right\n    return out"
            },
            {
              "t": "note",
              "x": "The iterative version is exactly the recursion-to-iteration recipe from the recursion booklet: an explicit stack replaces the call stack, holding the ancestors still waiting to be visited. It matters in practice when tree depth could be large enough to risk a stack overflow from the recursive version — a genuine concern for a badly unbalanced tree, covered next."
            }
          ]
        },
        {
          "title": "Balance: why height matters",
          "blocks": [
            {
              "t": "p",
              "x": "Every BST operation costs O(height), because each step descends exactly one level. The complexity booklet's O(log n) claim for tree operations is quietly assuming the height stays around log₂(n) — and nothing about the basic insertion rule guarantees that on its own. Inserting values in already-sorted order builds a tree that is really a linked list wearing a tree's data structure, with height n instead of log n."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"24\" font-size=\"12\" fill=\"#666D72\">inserting 1,2,3,4,5 in order — no balancing</text>\n<circle cx=\"70\" cy=\"46\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"70\" y=\"51\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">1</text>\n<line x1=\"70\" y1=\"61\" x2=\"70\" y2=\"79\" stroke=\"#2E3438\"/>\n<circle cx=\"70\" cy=\"94\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"70\" y=\"99\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">2</text>\n<line x1=\"70\" y1=\"109\" x2=\"70\" y2=\"127\" stroke=\"#2E3438\"/>\n<circle cx=\"70\" cy=\"142\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"70\" y=\"147\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">3</text>\n<line x1=\"70\" y1=\"157\" x2=\"70\" y2=\"175\" stroke=\"#2E3438\"/>\n<circle cx=\"70\" cy=\"190\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"70\" y=\"195\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">4</text>\n<line x1=\"70\" y1=\"205\" x2=\"70\" y2=\"220\" stroke=\"#2E3438\"/>\n<circle cx=\"70\" cy=\"228\" r=\"10\" fill=\"#0E1113\" stroke=\"#2E3438\"/>\n<text x=\"120\" y=\"140\" font-size=\"13\" fill=\"#9AA1A6\">A straight chain — height 5 for 5 nodes.</text>\n<text x=\"120\" y=\"162\" font-size=\"13\" fill=\"#9AA1A6\">Lookup degrades to O(n), a linked list</text>\n<text x=\"120\" y=\"184\" font-size=\"13\" fill=\"#9AA1A6\">wearing a tree's clothing.</text>\n<text x=\"400\" y=\"24\" font-size=\"12\" fill=\"#666D72\">same keys, kept balanced</text>\n<circle cx=\"480\" cy=\"44\" r=\"17\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"480\" y=\"49\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">3</text>\n<line x1=\"480\" y1=\"61\" x2=\"440\" y2=\"94\" stroke=\"#2E3438\"/><line x1=\"480\" y1=\"61\" x2=\"530\" y2=\"94\" stroke=\"#2E3438\"/>\n<circle cx=\"440\" cy=\"110\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"440\" y=\"115\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">1</text>\n<circle cx=\"530\" cy=\"110\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"530\" y=\"115\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">4</text>\n<line x1=\"440\" y1=\"125\" x2=\"460\" y2=\"152\" stroke=\"#2E3438\"/>\n<circle cx=\"460\" cy=\"168\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"460\" y=\"172\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\">2</text>\n<line x1=\"530\" y1=\"125\" x2=\"550\" y2=\"152\" stroke=\"#2E3438\"/>\n<circle cx=\"550\" cy=\"168\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"550\" y=\"172\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\">5</text>\n<text x=\"400\" y=\"205\" font-size=\"12.5\" fill=\"#9AA1A6\">Height 3 for the same 5 nodes —</text>\n<text x=\"400\" y=\"225\" font-size=\"12.5\" fill=\"#9AA1A6\">O(log n) intact.</text>\n</svg>",
              "cap": "The same five keys, inserted in sorted order versus kept balanced. Height 5 versus height 3 — and the gap widens without bound as n grows, since a degenerate tree's height is O(n) while a balanced one's stays O(log n)."
            },
            {
              "t": "p",
              "x": "Self-balancing trees restore the O(log n) guarantee by restructuring after insertions and deletions that would otherwise skew the shape. AVL trees track a balance factor per node and perform rotations — local restructurings that preserve the BST ordering while changing which node is on top — whenever a subtree's height gets too far out of line with its sibling's. Red-black trees relax the balance condition slightly, allowing somewhat more imbalance in exchange for cheaper rebalancing, which is why most standard library ordered maps (Java's TreeMap, C++'s std::map) use a red-black tree rather than AVL."
            },
            {
              "t": "note",
              "x": "You will rarely implement rotations yourself outside a course, but the guarantee they buy is worth knowing precisely: a self-balancing tree keeps height at O(log n) regardless of insertion order, including the adversarial sorted-input case that breaks a naive BST. That is the entire reason production ordered data structures use one rather than a plain BST."
            }
          ]
        },
        {
          "title": "Beyond binary: tries and B-trees",
          "blocks": [
            {
              "t": "p",
              "x": "Not every tree is binary, and two non-binary shapes are worth knowing by name. A trie (from retrieval, though usually pronounced \"try\") is a tree built for strings, where each edge represents one character and each path from the root spells out a prefix. Words sharing a prefix share the path down to where they diverge, which is what makes autocomplete, spell-checkers and IP routing tables all reach for a trie: finding every word with a given prefix is just walking to that prefix's node and reading off everything beneath it."
            },
            {
              "t": "p",
              "x": "A B-tree generalises the BST idea to nodes with many children rather than two, and it exists for a hardware reason rather than an algorithmic one. Disk and SSD reads happen a whole page at a time — several kilobytes — so a binary tree node holding a single key wastes almost that entire page fetch on one comparison. A B-tree node fills the page with hundreds of keys, so each level of descent costs one page read but eliminates almost all the remaining candidates, not just half."
            },
            {
              "t": "worked",
              "q": "A database holds a million records in a B-tree with fanout 100 per node. Roughly how many disk page reads does a lookup need, versus a binary search tree?",
              "steps": [
                "A B-tree with fanout 100 needs log base 100 of one million levels.",
                "log_100(10^6) = 6 / 2 = 3 levels, so about 3 page reads.",
                "A binary search tree needs log2(10^6) ≈ 20 comparisons.",
                "If each comparison in a naive on-disk BST needs its own page read, that is roughly 20 page reads instead of 3."
              ],
              "answer": "About 3 page reads for the B-tree versus roughly 20 for a binary tree stored the same naive way — the B-tree's wide fanout trades comparison count for page-read count, which is the resource that actually matters on disk."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The balance and B-tree questions are where trees stop being an interview topic and start explaining why real systems are built the way they are."
            }
          ],
          "exercises": [
            {
              "q": "In-order traversal of a valid BST always produces what?",
              "kind": "mc",
              "options": [
                "Every value in ascending sorted order",
                "Values in the order they were inserted",
                "Values from largest to smallest",
                "An arbitrary order depending on the tree's shape"
              ],
              "correct": 0,
              "steps": [
                "In-order visits a node's entire left subtree, then the node, then its entire right subtree.",
                "The BST invariant guarantees everything in the left subtree is smaller and everything in the right is larger.",
                "So every smaller value is emitted before the node, and every larger one after, at every level of the recursion.",
                "That recursive guarantee holds throughout, producing a fully sorted sequence."
              ],
              "answer": "Ascending sorted order, always — regardless of insertion order or the tree's specific shape, as long as the BST invariant holds everywhere."
            },
            {
              "q": "Values 1 through 7 are inserted into a BST in that exact sorted order. What is the tree's height, and what does that make lookup cost?",
              "kind": "mc",
              "options": [
                "Height 6, O(n) lookup — a degenerate chain",
                "Height 3, O(log n) lookup — automatically balanced",
                "Height 7, but lookup is still O(log n)",
                "Height 1, since all values are known in advance"
              ],
              "correct": 0,
              "steps": [
                "Each new value is larger than everything already inserted, so it always becomes the rightmost node's right child.",
                "The tree grows as a single chain with no branching at all.",
                "A chain of 7 nodes has height 6.",
                "Lookup must walk the full chain in the worst case, which is O(n), not O(log n)."
              ],
              "answer": "Height 6, and O(n) lookup — sorted-order insertion into a plain BST produces exactly the degenerate case a self-balancing tree exists to prevent."
            },
            {
              "q": "Why do on-disk database indexes use B-trees with high fanout instead of binary search trees?",
              "kind": "write",
              "accept": [
                "fewer disk reads",
                "minimize page reads",
                "disk reads happen in pages",
                "reduce number of page fetches"
              ],
              "hint": "think about what a disk read actually costs",
              "steps": [
                "Disk and SSD access happens a whole page at a time, not one key at a time.",
                "A binary tree node holds one key, so each level of descent costs a full page read for one comparison.",
                "A B-tree node fills an entire page with many keys, so one page read eliminates most of the remaining candidates.",
                "The design target is minimizing page reads, which is the actual bottleneck — not minimizing comparisons, which are nearly free by comparison."
              ],
              "answer": "To minimize the number of disk page reads, since each read is expensive regardless of how many keys it lets you compare against at once — high fanout means far fewer levels, and therefore far fewer reads, to reach any record."
            },
            {
              "q": "A trie stores the words \"cat\", \"car\", and \"cart\". How many nodes represent the shared prefix \"ca\" — one shared path, or one per word?",
              "kind": "mc",
              "options": [
                "One shared path — all three words traverse the same c-a nodes before diverging",
                "Three separate paths, one per word",
                "Two paths — cat and car share, but cart does not",
                "It depends on insertion order"
              ],
              "correct": 0,
              "steps": [
                "A trie's edges are shared whenever multiple words agree on a prefix.",
                "\"cat\", \"car\" and \"cart\" all begin with the same two letters, c then a.",
                "All three words follow the identical c-node then a-node before their paths diverge at the third character.",
                "Only after \"ca\" do the paths split: t for cat, r for car and cart, with cart continuing one more step past car."
              ],
              "answer": "One shared path — the c and a nodes are used by all three words, which is exactly what makes prefix lookups in a trie efficient: shared work is stored once, not duplicated per word."
            },
            {
              "q": "Write the iterative (explicit-stack) version of pre-order traversal, and explain in one sentence why it needs to push right before left.",
              "kind": "write",
              "accept": [
                "stack is lifo, so left must come off first",
                "push right first so left pops first",
                "lifo order reverses the push order"
              ],
              "hint": "think about stack order — last in, first out",
              "steps": [
                "Pre-order must visit a node, then its left subtree, then its right subtree, in that order.",
                "A stack is last-in-first-out, so whatever is pushed last is popped and visited first.",
                "To visit left before right, right must be pushed onto the stack before left.",
                "Then left comes off the stack first, matching the required pre-order sequence."
              ],
              "answer": "Push the right child before the left child, because a stack is LIFO — pushing right first means left is popped and visited first, matching pre-order's required node-left-right sequence."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Root",
          "The single node with no parent, at the top of a tree."
        ],
        [
          "Leaf",
          "A node with no children."
        ],
        [
          "Depth",
          "The number of edges from the root down to a node."
        ],
        [
          "Height",
          "The longest root-to-leaf path in a tree."
        ],
        [
          "Subtree",
          "A node together with everything beneath it, itself a complete tree."
        ],
        [
          "Binary search tree",
          "A binary tree where every node's left subtree is smaller and right subtree is larger."
        ],
        [
          "In-order traversal",
          "Visit left subtree, then node, then right subtree — sorted order for a BST."
        ],
        [
          "Pre-order traversal",
          "Visit the node, then its left subtree, then its right subtree."
        ],
        [
          "Post-order traversal",
          "Visit both subtrees before the node."
        ],
        [
          "Level-order traversal",
          "Visit nodes breadth-first, one depth at a time, using a queue."
        ],
        [
          "Self-balancing tree",
          "A tree that restructures itself to keep height at O(log n) regardless of insertion order."
        ],
        [
          "Rotation",
          "A local restructuring that changes which node is on top while preserving BST order."
        ],
        [
          "AVL tree",
          "A self-balancing BST that tracks a balance factor and rotates to keep it bounded."
        ],
        [
          "Red-black tree",
          "A self-balancing BST with a looser balance condition, cheaper to maintain than AVL."
        ],
        [
          "Trie",
          "A tree for strings where each edge is a character and shared prefixes share a path."
        ],
        [
          "B-tree",
          "A wide, shallow search tree whose high fanout minimises disk page reads."
        ]
      ]
    },
  "linked": {
      "title": "Linked lists",
      "blurb": "Nodes chained by references instead of by position — cheap insertion anywhere, no random access, and a different relationship with the cache than an array.",
      "chapters": [
        {
          "title": "Nodes and the chain",
          "blocks": [
            {
              "t": "p",
              "x": "An array stores its elements in one contiguous block of memory and finds any of them by arithmetic on an index. A linked list gives up that contiguity entirely: each element lives in its own small allocation, called a node, and the only way to find the next one is to follow a pointer stored inside the current one. A node is nothing more than a value plus a reference to the next node — the pointers booklet's addresses are exactly what makes this work."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"26\" font-size=\"12\" fill=\"#666D72\">head</text>\n<path d=\"M20 34 L20 96 L54 96\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M48 90 L54 96 L48 102\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<g>\n<rect x=\"60\" y=\"70\" width=\"120\" height=\"52\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<line x1=\"120\" y1=\"70\" x2=\"120\" y2=\"122\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"90\" y=\"101\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">12</text>\n<text x=\"150\" y=\"101\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">next</text>\n</g>\n<path d=\"M180 96 L234 96\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M228 90 L234 96 L228 102\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<g>\n<rect x=\"240\" y=\"70\" width=\"120\" height=\"52\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<line x1=\"300\" y1=\"70\" x2=\"300\" y2=\"122\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"270\" y=\"101\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">7</text>\n<text x=\"330\" y=\"101\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">next</text>\n</g>\n<path d=\"M360 96 L414 96\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M408 90 L414 96 L408 102\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<g>\n<rect x=\"420\" y=\"70\" width=\"120\" height=\"52\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<line x1=\"480\" y1=\"70\" x2=\"480\" y2=\"122\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"450\" y=\"101\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">3</text>\n<text x=\"510\" y=\"101\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">next</text>\n</g>\n<path d=\"M540 96 L594 96\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M588 90 L594 96 L588 102\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<text x=\"600\" y=\"101\" font-size=\"12\" fill=\"#666D72\">null</text>\n<text x=\"20\" y=\"166\" font-size=\"12.5\" fill=\"#666D72\">Finding the value 3 means following three pointers from head.</text>\n<text x=\"20\" y=\"186\" font-size=\"12.5\" fill=\"#666D72\">There is no way to jump straight to it, unlike arr[2].</text>\n</svg>",
              "cap": "Each node owns its value and a pointer to the next node. The list itself is just a pointer to the first one."
            },
            {
              "t": "p",
              "x": "This buys something an array cannot offer: inserting or removing a node does not require moving anything else. Given a pointer to the node just before the insertion point, splicing a new node in is two pointer writes, regardless of how long the list is. The array booklet's cost table put insertion at position i at O(n) because everything after i has to shift; a linked list turns that same operation into O(1), at the cost of no longer being able to jump to position i directly."
            },
            {
              "t": "note",
              "x": "The list itself is usually represented as just a pointer called head, sometimes paired with a tail pointer for O(1) append. Some implementations add a sentinel (dummy) node before the real head so that inserting at the front never needs a special case — the same trick recursion's base cases use to avoid asking \"is this the first one?\" on every step."
            }
          ]
        },
        {
          "title": "Singly, doubly, and circular variants",
          "blocks": [
            {
              "t": "p",
              "x": "The chain above is a singly linked list: each node points only forward. A doubly linked list adds a second pointer, prev, so a node can also be reached from its successor. That makes backward traversal and O(1) removal of a known node possible without walking from the head to find what comes before it — at the cost of a second pointer per node and twice the bookkeeping on every insert and delete, since both neighbours' pointers must be kept consistent."
            },
            {
              "t": "list",
              "items": [
                "<strong>Singly linked</strong>: one pointer (next) per node. Smallest memory footprint, forward traversal only.",
                "<strong>Doubly linked</strong>: two pointers (prev, next) per node. Backward traversal and O(1) deletion of a known node.",
                "<strong>Circular</strong>: the last node points back to the first instead of to null. Useful for round-robin scheduling and buffers with no natural end."
              ]
            },
            {
              "t": "p",
              "x": "A circular list can be singly or doubly linked; the only change is that the last node's next (and, if doubly linked, the first node's prev) points at the other end instead of at null. That removes the special case of detecting \"the end\" and is exactly the shape behind a round-robin CPU scheduler cycling through processes, or a circular buffer that overwrites its oldest entry once full."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Sentinel node",
                  "A dummy node placed before the real head (and sometimes after the real tail) purely to remove edge cases from insert and delete code."
                ],
                [
                  "Tail pointer",
                  "A separate reference to the last node, kept so that append does not require traversing the whole list first."
                ]
              ]
            }
          ]
        },
        {
          "title": "Insertion and deletion",
          "blocks": [
            {
              "t": "p",
              "x": "Inserting a new node after a node you already hold a pointer to is always O(1): point the new node's next at what the current node pointed to, then point the current node at the new one. Order matters — if you overwrite the current node's next pointer first, you lose the rest of the list with nothing left referencing it. Deleting the node right after one you hold is the mirror image: skip it by pointing the current node's next at whatever the doomed node pointed to."
            },
            {
              "t": "worked",
              "q": "You hold a pointer to node A, and want to insert a new node X right after it. A currently points to node B. Write the two-step splice.",
              "steps": [
                "First: X.next = A.next — this makes X point at B before anything else changes, so B is never left unreferenced.",
                "Second: A.next = X — now A points at X, and X points at B. The chain is A → X → B.",
                "Reversing this order would set A.next = X first, which overwrites the only pointer to B and everything after it — permanently losing the rest of the list."
              ],
              "answer": "X.next = A.next, then A.next = X. The order of the two writes is the entire trick, and it is the single most common linked-list bug."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Before: A → B. Inserting X after A.</text>\n<rect x=\"30\" y=\"46\" width=\"90\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"75\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">A</text>\n<path d=\"M120 66 L166 66\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"3,3\"/>\n<path d=\"M160 60 L166 66 L160 72\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/>\n<rect x=\"172\" y=\"46\" width=\"90\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"217\" y=\"70\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">B</text>\n<text x=\"30\" y=\"128\" font-size=\"12.5\" fill=\"#666D72\">Step 1 — X.next = A.next: X now also points at B.</text>\n<rect x=\"30\" y=\"152\" width=\"90\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"75\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">A</text>\n<path d=\"M120 172 L166 172\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"3,3\"/>\n<path d=\"M160 166 L166 172 L160 178\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/>\n<rect x=\"172\" y=\"152\" width=\"90\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"217\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">B</text>\n<rect x=\"300\" y=\"152\" width=\"90\" height=\"40\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"345\" y=\"176\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">X</text>\n<path d=\"M300 192 C 260 230, 260 230, 222 196\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<path d=\"M230 200 L222 196 L227 188\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"430\" y=\"170\" font-size=\"12\" fill=\"#9AA1A6\">X.next = B</text>\n<text x=\"430\" y=\"208\" font-size=\"12\" fill=\"#666D72\">Step 2 — A.next = X (not shown):</text>\n<text x=\"430\" y=\"226\" font-size=\"12\" fill=\"#666D72\">chain becomes A → X → B.</text>\n</svg>",
              "cap": "Writing X.next = B before A.next = X means B is never left unreferenced, even for an instant — reversing the order would lose the rest of the list."
            },
            {
              "t": "p",
              "x": "The catch is that O(1) insertion and deletion only holds given a pointer to the right place already. Finding that place — the 'insert after the node holding value 7' case — still costs O(n) traversal from the head, because there is no way to jump to an arbitrary position the way arr[i] does. Linked lists win when you already have the position (the current node during a traversal, or a saved reference) and lose when you have to search for it."
            }
          ]
        },
        {
          "title": "The two-pointer technique",
          "blocks": [
            {
              "t": "p",
              "x": "A cluster of linked-list problems are solved elegantly by walking two pointers through the list at different speeds or offsets rather than one. The two most common shapes: a slow pointer advancing one node per step and a fast one advancing two, or two pointers started a fixed distance apart and advanced together."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"350\" cy=\"120\" r=\"85\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<circle cx=\"350\" cy=\"35\" r=\"7\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<circle cx=\"415\" cy=\"60\" r=\"7\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<circle cx=\"435\" cy=\"120\" r=\"7\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<circle cx=\"415\" cy=\"180\" r=\"7\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<circle cx=\"350\" cy=\"205\" r=\"7\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<circle cx=\"285\" cy=\"180\" r=\"7\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<circle cx=\"265\" cy=\"120\" r=\"7\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<circle cx=\"285\" cy=\"60\" r=\"7\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"265\" y=\"145\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">slow</text>\n<text x=\"435\" y=\"145\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">fast</text>\n<text x=\"20\" y=\"30\" font-size=\"12.5\" fill=\"#666D72\">A cycle exists once the list re-enters itself.</text>\n<text x=\"20\" y=\"50\" font-size=\"12.5\" fill=\"#666D72\">Slow moves 1 step, fast moves 2, every tick.</text>\n<text x=\"20\" y=\"190\" font-size=\"12.5\" fill=\"#666D72\">Inside a cycle the gap between them shrinks</text>\n<text x=\"20\" y=\"210\" font-size=\"12.5\" fill=\"#666D72\">by one node per tick, so they must eventually meet.</text>\n</svg>",
              "cap": "Floyd's tortoise and hare: a slow and a fast pointer must meet somewhere inside a cycle, because the gap between them closes by exactly one node each tick."
            },
            {
              "t": "p",
              "x": "Floyd's cycle detection uses exactly this: if the fast pointer ever reaches null, there is no cycle. If it instead catches up to the slow pointer, a cycle exists, and it was found in O(1) extra space — no need to store every visited node in a set, which would cost O(n) memory instead. The same slow/fast idea finds a list's middle node in one pass: when fast reaches the end, slow is halfway there."
            },
            {
              "t": "note",
              "x": "The two-pointer technique also appears constrained to a single direction: given a sorted array or a palindrome check, two pointers starting at opposite ends and moving toward each other can replace an O(n²) nested loop with a single O(n) pass. The linked-list and array versions are the same idea applied to different structures."
            }
          ]
        },
        {
          "title": "Cache behaviour: why traversal feels slower",
          "blocks": [
            {
              "t": "p",
              "x": "Both an array scan and a linked-list traversal are O(n) — the same asymptotic cost. In practice the array is dramatically faster, and the reason is entirely about hardware, not about the algorithm. The arrays booklet covers cache lines: when the CPU reads one array element, it pulls in a whole cache line of neighbouring bytes for free, so the next several elements are often already in cache by the time you ask for them."
            },
            {
              "t": "p",
              "x": "A linked list's nodes are typically scattered across the heap in whatever order the allocator happened to hand them out, with no guarantee that node 2 sits anywhere near node 1 in physical memory. Following next means chasing a pointer to a essentially random address, which very often misses cache and costs a full trip to main memory — tens to hundreds of times slower than an L1 cache hit. Ten million pointer-chases through a linked list can take noticeably longer in wall-clock time than ten million contiguous array reads, despite both being \"O(n).\""
            },
            {
              "t": "note",
              "x": "This is one of the clearest illustrations that big-O complexity describes growth rate, not wall-clock speed — the complexity booklet's central caveat. Some languages and libraries mitigate this with an \"unrolled\" linked list, where each node holds a small array of several elements instead of just one, trading a little of the O(1)-insertion advantage for noticeably better cache behaviour."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [],
          "exercises": [
            {
              "q": "Reverse a singly linked list in place. What is the minimum extra state you need while walking it?",
              "kind": "mc",
              "options": [
                "Three pointers: prev, current, and a saved next",
                "Just a counter of how many nodes remain",
                "A second full copy of the list",
                "Nothing extra — next pointers can be flipped without saving anything"
              ],
              "correct": 0,
              "steps": [
                "Before rewriting current.next you must save next = current.next, or the rest of the list becomes unreachable.",
                "Point current.next at prev.",
                "Advance prev = current and current = next, and repeat until current is null.",
                "prev ends up as the new head."
              ],
              "answer": "Three pointers (prev, current, next). O(n) time, O(1) extra space — the saved next pointer is what keeps the rest of the list from being lost the instant you rewrite current.next."
            },
            {
              "q": "A cycle in a linked list is detected with Floyd's algorithm using O(1) extra memory. What is the alternative approach, and what does it cost?",
              "steps": [
                "Walk the list once, adding every visited node's address to a set.",
                "Before visiting each node, check whether it is already in the set.",
                "If it is, a cycle exists; if the traversal reaches null first, it does not.",
                "The set holds up to n addresses in the worst case."
              ],
              "answer": "A visited-set approach detects cycles just as correctly but costs O(n) space, versus Floyd's O(1). Both are O(n) time."
            },
            {
              "q": "You hold a pointer to a node in the middle of a singly linked list, but not to the head or to the previous node. Can you delete this node in O(1)?",
              "kind": "mc",
              "options": [
                "Yes, by copying the next node's value into this node and then unlinking the next node",
                "No, deletion always needs the previous node's pointer",
                "Yes, but only if the list is circular",
                "Yes, by setting this node's value to null"
              ],
              "correct": 0,
              "steps": [
                "Normal deletion rewrites the previous node's next pointer, which requires walking from the head to find it — O(n).",
                "Instead, copy the following node's value into the current node, effectively making the current node 'become' its successor.",
                "Then unlink the actual next node, whose predecessor (the current node) you do hold.",
                "This fails only for the last node, which has no successor to absorb from."
              ],
              "answer": "Yes — by overwriting this node's value with the next node's value and then deleting the next node instead, which you can do in O(1) since you already hold a pointer to it."
            },
            {
              "q": "The technique of moving one pointer twice as fast as another through a list, to find its exact midpoint in a single pass, is called the ___ pointer technique.",
              "kind": "write",
              "accept": [
                "two",
                "two-pointer",
                "slow/fast",
                "fast/slow"
              ],
              "hint": "two words, sometimes hyphenated",
              "steps": [
                "A slow pointer advances one node per step; a fast pointer advances two.",
                "When the fast pointer reaches the end, the slow pointer has covered exactly half the distance.",
                "The same relative-speed idea also detects cycles."
              ],
              "answer": "The two-pointer technique (also called slow/fast pointers). One pass, O(1) extra space, no need to first count the list's length."
            },
            {
              "q": "Explain in one sentence why a linked-list traversal is typically slower in practice than an array scan of the same length, even though both are O(n).",
              "steps": [
                "Big-O counts the number of operations, not how expensive each operation is on real hardware.",
                "Array elements are contiguous, so reading one pulls neighbouring elements into cache for free.",
                "Linked-list nodes are scattered across the heap, so each next pointer is likely to miss cache.",
                "A cache miss costs tens to hundreds of times longer than a cache hit."
              ],
              "answer": "Because array elements sit contiguously in memory and benefit from cache-line prefetching, while linked-list nodes are scattered and each pointer hop is likely to miss cache — the same O(n) count of operations, but each operation is far more expensive on real hardware."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Node",
          "A single element of a linked list: a value plus one or more pointers to neighbouring nodes."
        ],
        [
          "Head",
          "A pointer to the first node in the list; the list itself is often represented as just this one reference."
        ],
        [
          "Tail pointer",
          "An optional separate reference to the last node, kept so append does not require a full traversal."
        ],
        [
          "Singly linked list",
          "Each node holds one pointer, to the next node. Forward traversal only."
        ],
        [
          "Doubly linked list",
          "Each node holds two pointers, prev and next. Supports backward traversal and O(1) deletion of a known node."
        ],
        [
          "Circular linked list",
          "The last node points back to the first instead of to null; removes the special case of detecting the end."
        ],
        [
          "Sentinel node",
          "A dummy node placed before the real head purely to remove edge cases from insert/delete code."
        ],
        [
          "Dangling pointer",
          "A pointer left referencing memory that has already been freed or reused; see the pointers booklet."
        ],
        [
          "Traversal",
          "Visiting every node in order by following next pointers from the head."
        ],
        [
          "Splice",
          "Inserting or removing a node by rewriting a small, constant number of neighbouring pointers."
        ],
        [
          "Two-pointer technique",
          "Walking two pointers through a structure at different speeds or offsets to solve a problem in one pass."
        ],
        [
          "Cycle detection",
          "Determining whether a list re-enters itself instead of terminating at null; commonly solved with Floyd's algorithm."
        ],
        [
          "Cache locality",
          "How likely nearby memory accesses are to already be loaded in a fast CPU cache; poor for scattered heap allocations."
        ],
        [
          "Amortised cost",
          "A cost measured as an average over a sequence of operations, rather than any single worst-case operation."
        ]
      ]
    },
  "stackqueue": {
      "title": "Stacks and queues",
      "blurb": "Two deliberately restricted ways of accessing a collection — last-in-first-out and first-in-first-out — that turn out to underlie traversal, scheduling, parsing and undo everywhere.",
      "chapters": [
        {
          "title": "LIFO and FIFO",
          "blocks": [
            {
              "t": "p",
              "x": "A stack and a queue both hold a sequence of elements, and both restrict you to adding and removing from the ends rather than anywhere in the middle — but they disagree about which end matters. A stack is last-in-first-out (LIFO): the most recently added element is the first one removed, like a physical stack of plates where you can only take from the top. A queue is first-in-first-out (FIFO): the oldest element still present is the first one removed, like a line of people waiting."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"13\" fill=\"#9AA1A6\">Stack (LIFO)</text>\n<rect x=\"40\" y=\"120\" width=\"140\" height=\"36\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"110\" y=\"143\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">first in</text>\n<rect x=\"40\" y=\"84\" width=\"140\" height=\"36\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"110\" y=\"107\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">middle</text>\n<rect x=\"40\" y=\"48\" width=\"140\" height=\"36\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"110\" y=\"71\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">top: last in</text>\n<text x=\"200\" y=\"63\" font-size=\"12\" fill=\"#666D72\">← push / pop here only</text>\n<text x=\"40\" y=\"190\" font-size=\"12.5\" fill=\"#666D72\">Pop removes \"last in\" first —</text>\n<text x=\"40\" y=\"208\" font-size=\"12.5\" fill=\"#666D72\">opposite of arrival order.</text>\n<line x1=\"400\" y1=\"0\" x2=\"400\" y2=\"230\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"440\" y=\"26\" font-size=\"13\" fill=\"#9AA1A6\">Queue (FIFO)</text>\n<rect x=\"440\" y=\"84\" width=\"70\" height=\"40\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"475\" y=\"109\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">front</text>\n<rect x=\"518\" y=\"84\" width=\"70\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"553\" y=\"109\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\" class=\"mono\">middle</text>\n<rect x=\"596\" y=\"84\" width=\"70\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"631\" y=\"109\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\" class=\"mono\">back</text>\n<text x=\"440\" y=\"66\" font-size=\"12\" fill=\"#666D72\">dequeue ←</text>\n<text x=\"596\" y=\"66\" font-size=\"12\" fill=\"#666D72\">→ enqueue</text>\n<text x=\"440\" y=\"190\" font-size=\"12.5\" fill=\"#666D72\">Dequeue removes \"front\" first —</text>\n<text x=\"440\" y=\"208\" font-size=\"12.5\" fill=\"#666D72\">same as arrival order.</text>\n</svg>",
              "cap": "A stack exposes only its most recently added end; a queue exposes its oldest end for removal and its newest for insertion."
            },
            {
              "t": "list",
              "items": [
                "<strong>Stack</strong>: push (add), pop (remove and return the top), peek (look at the top without removing it).",
                "<strong>Queue</strong>: enqueue (add at the back), dequeue (remove and return the front), peek (look at the front)."
              ]
            },
            {
              "t": "note",
              "x": "The call stack, covered in the functions booklet, is a literal stack: the most recently called function is the first to return. Undo history in an editor is a stack too — the most recent action is the first one undone. Task scheduling and breadth-first search, by contrast, want oldest-request-first fairness, which is exactly what a queue provides."
            }
          ]
        },
        {
          "title": "Implementing a stack",
          "blocks": [
            {
              "t": "p",
              "x": "A stack is straightforward to implement on top of either structure this map has already covered. Array-backed: keep a dynamic array and treat its end as the top; push is append (O(1) amortised, per the arrays booklet's doubling analysis) and pop is removing the last element (also O(1), no shifting required since it's the end, not the middle). Linked-list-backed: keep a pointer to the head and treat it as the top; push and pop both become O(1) insert/delete at the head, no traversal needed."
            },
            {
              "t": "p",
              "x": "Because a stack only ever touches one end, both backings give genuinely O(1) push and pop — unlike a queue, where the array backing needs a specific trick to avoid an O(n) operation, covered next. In practice, most language standard libraries back their stack type with a dynamic array by default, since it has better cache behaviour and lower per-element overhead than allocating a node for every push."
            }
          ]
        },
        {
          "title": "Implementing a queue",
          "blocks": [
            {
              "t": "p",
              "x": "A queue is where the two backings stop being equivalent. A linked list with both head and tail pointers gives O(1) enqueue (append at tail) and O(1) dequeue (remove from head) — no traversal either way. A plain array is worse: enqueue at the end is O(1) amortised, but dequeue from the front means removing arr[0] and shifting every remaining element left by one position, which is O(n)."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"26\" font-size=\"12.5\" fill=\"#666D72\">Circular buffer: front and back wrap around a fixed array instead of shifting.</text>\n<circle cx=\"350\" cy=\"120\" r=\"70\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<circle cx=\"350\" cy=\"50\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"350\" y=\"55\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">0</text>\n<circle cx=\"410\" cy=\"75\" r=\"16\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"410\" y=\"80\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\" class=\"mono\">1</text>\n<circle cx=\"410\" cy=\"165\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"410\" y=\"170\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">2</text>\n<circle cx=\"350\" cy=\"190\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"350\" y=\"195\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">3</text>\n<circle cx=\"290\" cy=\"165\" r=\"16\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"290\" y=\"170\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\" class=\"mono\">4</text>\n<circle cx=\"290\" cy=\"75\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"290\" y=\"80\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">5</text>\n<text x=\"430\" y=\"55\" font-size=\"11\" fill=\"#9AA1A6\">front</text>\n<text x=\"250\" y=\"150\" font-size=\"11\" fill=\"#9AA1A6\">back</text>\n<text x=\"30\" y=\"175\" font-size=\"12.5\" fill=\"#666D72\">Dequeue advances front</text>\n<text x=\"30\" y=\"192\" font-size=\"12.5\" fill=\"#666D72\">from 1 to 2, wrapping at 5 → 0.</text>\n</svg>",
              "cap": "A circular buffer keeps front and back as indices that wrap modulo the array's capacity, so dequeue never has to shift anything — it just advances the front index."
            },
            {
              "t": "p",
              "x": "The standard fix is a circular buffer: keep the array fixed-size, and track front and back as indices that wrap around using modular arithmetic (index = (index + 1) % capacity) instead of always starting from 0. Dequeue then just advances the front index — O(1), no shifting — and the freed slot is reused the next time the buffer wraps around. This is the same idea a doubly linked list with head/tail pointers achieves more directly, and is exactly how ring buffers used for streaming I/O work under the hood."
            }
          ]
        },
        {
          "title": "Building a queue from two stacks",
          "blocks": [
            {
              "t": "p",
              "x": "A classic exercise given only a stack primitive: implement a queue using two of them. Keep an \"in\" stack that receives every enqueue directly. To dequeue, first check an \"out\" stack — if it's empty, pop everything off \"in\" and push it onto \"out\", which reverses the order so the oldest element ends up on top of \"out\"; then pop from \"out\"."
            },
            {
              "t": "worked",
              "q": "Enqueue 1, 2, 3, then dequeue twice. Trace the two stacks.",
              "steps": [
                "Enqueue 1, 2, 3: all pushed onto \"in\", which now holds [1,2,3] with 3 on top.",
                "Dequeue: \"out\" is empty, so pop everything from \"in\" onto \"out\": \"out\" becomes [3,2,1] with 1 on top. Pop 1 from \"out\". Result: 1.",
                "Dequeue again: \"out\" is not empty ([3,2] remains, 2 on top). Pop 2 directly. Result: 2.",
                "No transfer was needed the second time — elements only move from \"in\" to \"out\" once each."
              ],
              "answer": "1, then 2 — correct FIFO order. Each element crosses from \"in\" to \"out\" at most once in its lifetime, which is exactly what makes the amortised cost work out."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 210\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">After enqueue 1, 2, 3 then one dequeue:</text>\n<text x=\"30\" y=\"50\" font-size=\"13\" fill=\"#9AA1A6\">in</text>\n<rect x=\"30\" y=\"64\" width=\"70\" height=\"110\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<text x=\"65\" y=\"165\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\" class=\"mono\">empty</text>\n<text x=\"200\" y=\"115\" font-size=\"12\" fill=\"#666D72\">transfer, reversing order →</text>\n<text x=\"440\" y=\"50\" font-size=\"13\" fill=\"#9AA1A6\">out</text>\n<rect x=\"440\" y=\"64\" width=\"90\" height=\"110\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<rect x=\"448\" y=\"120\" width=\"74\" height=\"36\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"485\" y=\"143\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">2</text>\n<rect x=\"448\" y=\"80\" width=\"74\" height=\"36\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"485\" y=\"103\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">3</text>\n<path d=\"M598 98 L536 98\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<path d=\"M542 93 L536 98 L542 103\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<text x=\"604\" y=\"102\" font-size=\"12\" fill=\"#666D72\">top: next out</text>\n<text x=\"560\" y=\"128\" font-size=\"12\" fill=\"#666D72\">(1 already popped</text>\n<text x=\"560\" y=\"146\" font-size=\"12\" fill=\"#666D72\">and returned)</text>\n</svg>",
              "cap": "One dequeue drained all of \"in\" into \"out\" (reversing 1,2,3 into 3,2,1 from the bottom), then popped 1 off the top of \"out\". The next two dequeues need no transfer at all."
            },
            {
              "t": "p",
              "x": "A single dequeue can cost O(n) in the worst case, when a full transfer is triggered. But because each element is moved from \"in\" to \"out\" at most once ever, the total work across any sequence of n enqueues and dequeues is O(n) — giving an amortised O(1) cost per operation, the same style of argument the arrays booklet used for dynamic-array doubling."
            }
          ]
        },
        {
          "title": "Deques and priority queues",
          "blocks": [
            {
              "t": "p",
              "x": "A deque (double-ended queue) generalises both: it supports O(1) push and pop at either end. It subsumes a stack (use only one end) and a queue (push one end, pop the other), and is the structure of choice whenever an algorithm needs to add or remove from both ends — the sliding-window-maximum family of problems is the classic example, maintaining a deque of candidate indices and dropping from either end as the window moves."
            },
            {
              "t": "p",
              "x": "A priority queue breaks the LIFO/FIFO pattern entirely: instead of ordering by arrival, it always hands back the element with the highest (or lowest) priority, whatever order things arrived in. It is not typically backed by a plain array or list at all — the heaps booklet covers the structure, a heap, that makes both inserting a new element and extracting the current minimum or maximum run in O(log n), which a sorted array or an unsorted list cannot both achieve at once."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [],
          "exercises": [
            {
              "q": "Check whether the brackets in \"([)]\" are balanced, using a stack.",
              "kind": "mc",
              "options": [
                "Unbalanced — popping on \")\" yields \"[\", which does not match",
                "Balanced — every bracket has a matching partner somewhere",
                "Unbalanced — there are more closers than openers",
                "Balanced — stacks ignore ordering, only counting matters"
              ],
              "correct": 0,
              "steps": [
                "Push each opener as seen: ( then [.",
                "On the first closer, ), pop the top of the stack, which is [.",
                "[ does not match ), so the pair is crossed and the string is invalid.",
                "Report failure immediately — no need to keep scanning."
              ],
              "answer": "Unbalanced. A stack works for this precisely because valid brackets must close in the reverse order they opened — exactly LIFO."
            },
            {
              "q": "Implementing a queue with two stacks, what is the amortised cost per operation across a long sequence of enqueues and dequeues?",
              "kind": "write",
              "accept": [
                "o(1)",
                "constant",
                "amortized o(1)",
                "amortised o(1)"
              ],
              "hint": "big-O, one term",
              "steps": [
                "A single dequeue can trigger transferring every element from the 'in' stack to the 'out' stack — O(n) in the worst case.",
                "But each element only ever makes that transfer once in its entire lifetime.",
                "Spread across n operations, the total transfer work is O(n).",
                "That is O(1) per operation on average, even though individual operations vary."
              ],
              "answer": "O(1) amortised, even though a single dequeue can occasionally cost O(n) when it triggers a full transfer."
            },
            {
              "q": "A breadth-first search normally uses a queue to track nodes to visit. What changes if you swap it for a stack instead?",
              "steps": [
                "A queue explores nodes in the order they were discovered — level by level, outward from the start.",
                "A stack instead hands back the most recently discovered node first.",
                "That drives the search deep along one branch before it ever backtracks to explore siblings.",
                "This is exactly the definition of depth-first search."
              ],
              "answer": "The traversal becomes depth-first search. The single data-structure swap — queue to stack — is the entire difference between BFS and DFS in most implementations."
            },
            {
              "q": "Design a stack that supports push, pop, and get-minimum, all in O(1). What extra state do you need?",
              "kind": "mc",
              "options": [
                "A second stack that tracks the minimum seen so far at each depth",
                "Nothing — scan the main stack for the minimum on demand",
                "A sorted copy of the stack maintained alongside it",
                "A hash map from value to its position"
              ],
              "correct": 0,
              "steps": [
                "Scanning the main stack for the minimum on every query costs O(n), not O(1).",
                "Instead, maintain a second stack in lockstep: whenever you push a value onto the main stack, also push the smaller of (that value, the current minimum) onto the min-stack.",
                "The top of the min-stack is always the minimum of everything currently on the main stack.",
                "Popping the main stack pops the min-stack too, so the invariant is preserved automatically."
              ],
              "answer": "A parallel min-stack, updated alongside every push and pop, gives get-minimum in O(1) — the same trick generalises to get-maximum or any other running aggregate."
            },
            {
              "q": "A deque-based algorithm maintains the maximum of every size-k window as an array is scanned once. Why remove elements from the back of the deque as new ones arrive, before adding the new element?",
              "steps": [
                "The deque stores indices, kept in order of decreasing value from front to back.",
                "Any element smaller than the new one, sitting behind it in the deque, can never be the maximum of any future window — the new element is both larger and more recent.",
                "So those smaller trailing elements are useless and are popped from the back before the new index is pushed.",
                "The front of the deque is also checked and popped once its index falls outside the current window."
              ],
              "answer": "Because any smaller element behind the new one in arrival order can never again be the window's maximum — the new, larger, more recent element dominates it permanently, so keeping it around wastes space and time."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Stack",
          "A LIFO collection: push adds, pop removes and returns the most recently added element."
        ],
        [
          "Queue",
          "A FIFO collection: enqueue adds at the back, dequeue removes and returns the oldest element."
        ],
        [
          "LIFO",
          "Last-in-first-out: the most recently added element is removed first."
        ],
        [
          "FIFO",
          "First-in-first-out: the oldest remaining element is removed first."
        ],
        [
          "Peek",
          "Looking at the top (stack) or front (queue) element without removing it."
        ],
        [
          "Circular buffer",
          "A fixed-size array with front/back indices that wrap using modular arithmetic, avoiding shifts on dequeue."
        ],
        [
          "Deque",
          "Double-ended queue: supports O(1) push and pop at both ends."
        ],
        [
          "Priority queue",
          "A collection that always returns the highest- or lowest-priority element regardless of arrival order, typically backed by a heap."
        ],
        [
          "Amortised cost",
          "The average cost per operation across a sequence, even when individual operations vary widely."
        ],
        [
          "Call stack",
          "The runtime's own LIFO structure tracking active function calls; see the functions booklet."
        ],
        [
          "Ring buffer",
          "Another name for a circular buffer, especially in streaming or I/O contexts."
        ],
        [
          "Sliding window",
          "A contiguous range over a sequence that moves one step at a time, often paired with a deque to track a running max or min."
        ]
      ]
    },
  "hash": {
      "title": "Hash tables",
      "blurb": "Turning an arbitrary key into an array index — which buys average O(1) lookup, insertion and deletion, at the cost of any notion of order.",
      "chapters": [
        {
          "title": "From key to index",
          "blocks": [
            {
              "t": "p",
              "x": "Arrays give O(1) access, but only by a numeric index you already know. A hash table gets the same O(1) access for arbitrary keys — strings, tuples, objects — by running the key through a hash function that produces a number, then using that number (modulo the table's capacity) as an array index. The array underneath is exactly the arrays booklet's structure; everything new here is the function that decides where a key lands."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 190\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"30\" y=\"70\" width=\"130\" height=\"44\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"95\" y=\"97\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">\"alice\"</text>\n<path d=\"M160 92 L230 92\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M224 86 L230 92 L224 98\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<rect x=\"236\" y=\"64\" width=\"140\" height=\"56\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"306\" y=\"88\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">hash function</text>\n<text x=\"306\" y=\"106\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">h(key)</text>\n<path d=\"M376 92 L446 92\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M440 86 L446 92 L440 98\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<text x=\"460\" y=\"88\" font-size=\"12\" fill=\"#9AA1A6\" class=\"mono\">2 578 341</text>\n<text x=\"460\" y=\"106\" font-size=\"11\" fill=\"#666D72\">mod capacity (16)</text>\n<path d=\"M460 118 L460 140 L560 140\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M554 134 L560 140 L554 146\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<rect x=\"566\" y=\"120\" width=\"90\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"611\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">index 5</text>\n<text x=\"30\" y=\"30\" font-size=\"12.5\" fill=\"#666D72\">Same key, same hash, always — that determinism is what makes lookup work at all.</text>\n</svg>",
              "cap": "A hash function maps a key to a number; taking that number modulo the table's capacity picks a slot. The same key always produces the same slot."
            },
            {
              "t": "p",
              "x": "A useful hash function has two properties: it must be deterministic (the same key always produces the same hash, every time, in every run) and it should distribute different keys roughly uniformly across the available slots, so that no small subset of slots ends up overloaded while others sit empty. Lookup, insertion and deletion all follow the same first step — hash the key, find its slot — and then differ only in what happens once you're there."
            }
          ]
        },
        {
          "title": "Collisions: chaining versus open addressing",
          "blocks": [
            {
              "t": "p",
              "x": "Two different keys can hash to the same slot — a collision — and with enough keys and a fixed number of slots, this is guaranteed eventually by the pigeonhole principle (the discrete math booklet's counting argument). Every hash table needs a strategy for what to do when it happens. The two dominant strategies are chaining and open addressing."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"26\" font-size=\"13\" fill=\"#9AA1A6\">Chaining: each slot holds a small list</text>\n<rect x=\"30\" y=\"50\" width=\"60\" height=\"36\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"60\" y=\"73\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">0</text>\n<rect x=\"30\" y=\"86\" width=\"60\" height=\"36\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"60\" y=\"109\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\" class=\"mono\">1</text>\n<rect x=\"30\" y=\"122\" width=\"60\" height=\"36\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"60\" y=\"145\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">2</text>\n<path d=\"M90 104 L130 104\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<rect x=\"136\" y=\"86\" width=\"64\" height=\"36\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"168\" y=\"109\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">\"bob\"</text>\n<path d=\"M200 104 L232 104\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<rect x=\"238\" y=\"86\" width=\"70\" height=\"36\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"273\" y=\"109\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">\"amy\"</text>\n<line x1=\"360\" y1=\"0\" x2=\"360\" y2=\"200\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"390\" y=\"26\" font-size=\"13\" fill=\"#9AA1A6\">Open addressing: probe for the next free slot</text>\n<rect x=\"390\" y=\"50\" width=\"60\" height=\"36\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"420\" y=\"73\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#EDEFF0\" class=\"mono\">bob</text>\n<rect x=\"390\" y=\"86\" width=\"60\" height=\"36\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"420\" y=\"109\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\" class=\"mono\">empty</text>\n<rect x=\"390\" y=\"122\" width=\"60\" height=\"36\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"420\" y=\"145\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#EDEFF0\" class=\"mono\">amy</text>\n<text x=\"460\" y=\"73\" font-size=\"11.5\" fill=\"#666D72\">amy hashed here first,</text>\n<text x=\"460\" y=\"91\" font-size=\"11.5\" fill=\"#666D72\">but it was already taken by bob,</text>\n<text x=\"460\" y=\"109\" font-size=\"11.5\" fill=\"#666D72\">so amy probed forward to slot 2.</text>\n</svg>",
              "cap": "Chaining keeps a small list per slot, growing it on collision. Open addressing keeps one item per slot and probes to a different slot when the first choice is taken."
            },
            {
              "t": "p",
              "x": "Chaining stores a small secondary structure (usually a linked list, sometimes a balanced tree once a chain grows long) at each slot, and a collision just means appending to that slot's list. Open addressing keeps exactly one entry per slot; on collision, it probes according to some fixed rule — try the next slot, or the one after that, or a slot chosen by a second hash function — until it finds one that's free. Chaining degrades more gracefully under heavy load; open addressing has better cache locality since everything lives in one contiguous array."
            }
          ]
        },
        {
          "title": "Load factor and resizing",
          "blocks": [
            {
              "t": "p",
              "x": "Load factor is the number of stored entries divided by the table's capacity. As load factor climbs, chains get longer (chaining) or probes get longer (open addressing), and average lookup cost drifts away from O(1) toward something worse. Every practical hash table resizes once load factor crosses a threshold — commonly around 0.7 to 0.75 — by allocating a larger backing array (often double the size, mirroring the arrays booklet's dynamic-array growth) and rehashing every existing key into it, since a key's slot depends on the capacity."
            },
            {
              "t": "worked",
              "q": "A hash table resizes at load factor 0.75, starting with capacity 16. After how many insertions does the first resize happen, and to what capacity?",
              "steps": [
                "Resize triggers once entries / capacity exceeds 0.75.",
                "0.75 × 16 = 12, so the threshold is crossed by the 13th entry.",
                "Capacity doubles, from 16 to 32.",
                "Every one of the 12 (now 13) existing keys must be rehashed, since index = hash(key) mod capacity changes when capacity changes."
              ],
              "answer": "The 13th insertion triggers a resize to capacity 32. That single insert briefly costs O(n) instead of O(1) — the same amortised-cost story as dynamic array growth, spread over many cheap inserts between resizes."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Average lookup cost as load factor rises toward 1.0 (chaining):</text>\n<line x1=\"60\" y1=\"160\" x2=\"640\" y2=\"160\" stroke=\"#2E3438\" stroke-width=\"1.2\"/>\n<line x1=\"60\" y1=\"50\" x2=\"60\" y2=\"160\" stroke=\"#2E3438\" stroke-width=\"1.2\"/>\n<path d=\"M60 156 C 250 154, 420 140, 560 70\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<line x1=\"430\" y1=\"50\" x2=\"430\" y2=\"160\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"3,3\"/>\n<text x=\"430\" y=\"178\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">0.75 — typical resize point</text>\n<text x=\"20\" y=\"55\" font-size=\"11\" fill=\"#666D72\">cost</text>\n<text x=\"600\" y=\"178\" font-size=\"11\" fill=\"#666D72\">load factor</text>\n</svg>",
              "cap": "Average lookup stays near O(1) at low load factor, then climbs as chains lengthen — resizing before the curve steepens is what keeps amortised cost constant."
            },
            {
              "t": "note",
              "x": "Because resizing is itself O(n), the same amortised analysis used for dynamic arrays applies directly: doubling on each resize means the total cost of all resizes across n insertions stays O(n), so the amortised cost per insertion remains O(1) even though any individual insertion can occasionally be expensive."
            }
          ]
        },
        {
          "title": "Hash function quality and adversarial inputs",
          "blocks": [
            {
              "t": "p",
              "x": "A poor hash function can wreck a hash table's performance even at low load factor. If many real keys happen to collide under a specific hash function — whether by bad luck or by design — the affected slot's chain grows long and lookups touching it degrade toward O(n), the same cost as a plain linked list scan. This is not merely theoretical: hash-flooding denial-of-service attacks deliberately submit keys chosen to all collide under a known, fixed hash function, driving a server's hash tables into their worst case."
            },
            {
              "t": "p",
              "x": "The standard defence is to randomise the hash function's seed at program startup, so an attacker cannot precompute colliding keys in advance without also knowing that run's specific seed. Most mainstream language runtimes have done this by default since the early 2010s, specifically in response to this class of attack becoming public and practical."
            }
          ]
        },
        {
          "title": "The hashing–equality contract",
          "blocks": [
            {
              "t": "p",
              "x": "Hash tables depend on an invariant that is easy to violate by accident: if two keys are considered equal, they must produce the same hash, and a key's hash must never change while it is stored in the table. The moment a stored key's hash changes, the entry is still sitting in its old slot, but a lookup will hash the (now different) key and search the wrong slot — the entry becomes permanently unfindable through normal lookup, even though it is still physically present in the table."
            },
            {
              "t": "p",
              "x": "This is exactly why many languages forbid using a mutable structure as a hash-table key: a Python list can be appended to after insertion, which would change what it hashes to, so Python simply makes lists unhashable and requires an immutable tuple instead. The rule is not arbitrary caution — it is enforcing the one invariant the whole structure depends on."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [],
          "exercises": [
            {
              "q": "A hash table resizes at load factor 0.75, starting with capacity 8. After how many insertions does the first resize occur?",
              "kind": "write",
              "accept": [
                "6",
                "the 6th",
                "6th"
              ],
              "hint": "a number",
              "steps": [
                "Threshold = 0.75 × 8 = 6.",
                "The table resizes once entries exceed this threshold.",
                "The 6th insertion itself is exactly at the threshold; the 7th insertion is what actually pushes it over in most implementations, but conventions vary — check that 0.75 × 8 = 6 is the number to reason from.",
                "Regardless of the exact off-by-one convention, the key skill is computing threshold = load factor × capacity."
              ],
              "answer": "6 entries is the threshold (0.75 × 8); the resize fires at or just after that point depending on the implementation's exact comparison (> versus ≥)."
            },
            {
              "q": "Every key you insert happens to hash to the same bucket. What does lookup cost become, and why?",
              "kind": "mc",
              "options": [
                "O(n) — the structure degrades to a single linked list",
                "Still O(1), because hashing the key is O(1)",
                "O(log n), same as a balanced tree",
                "O(1) amortised, same as normal"
              ],
              "correct": 0,
              "steps": [
                "Hashing the key to find its bucket is still O(1) — that part never changes.",
                "But every key lives in the same bucket's chain, which now holds all n entries.",
                "Finding a specific key means scanning that entire chain.",
                "A full scan of n entries is O(n), the same as an unsorted linked list."
              ],
              "answer": "O(n). Hashing is O(1) but the chain it points to holds every entry, so the search degrades to a linear scan — this is precisely what hash-flooding attacks engineer on purpose."
            },
            {
              "q": "Why does Python allow a tuple as a dictionary key but forbid a list?",
              "steps": [
                "A key's slot is chosen from its hash at insertion time.",
                "If the key could mutate afterward, its hash would change.",
                "The entry would then sit in a slot that no longer matches a fresh hash of the (now different) key, making it unfindable.",
                "Tuples are immutable and so their hash is fixed for their entire lifetime; lists are mutable, so Python makes them unhashable to prevent this outright."
              ],
              "answer": "Because a dictionary key's hash must never change while it's stored, and only an immutable object can guarantee that. A tuple can't be mutated after creation; a list can, so Python refuses to hash it at all."
            },
            {
              "q": "Why do hash-flooding denial-of-service attacks specifically target servers whose hash function has a fixed, unrandomised seed?",
              "steps": [
                "A fixed hash function always maps the same input keys to the same outputs, across every run of the program.",
                "An attacker can precompute, offline, a large batch of distinct keys that all hash to the same bucket under that specific function.",
                "Submitting all of them (as, say, form field names or URL parameters) forces one bucket's chain to grow to the full size of the attack payload.",
                "Every lookup that touches that bucket now costs O(n) instead of O(1), which can stall the server on a modest amount of attack traffic."
              ],
              "answer": "Because a fixed hash function is fully predictable in advance, letting an attacker precompute colliding keys offline. Randomising the seed at each program startup makes that precomputation useless, since the attacker cannot know which seed a given run is using."
            },
            {
              "q": "Between chaining and open addressing, which tends to have better cache locality, and why?",
              "kind": "mc",
              "options": [
                "Open addressing, since every entry lives directly in one contiguous array",
                "Chaining, since linked lists are always faster to scan",
                "They are identical in cache behaviour",
                "Open addressing, because it never needs to resize"
              ],
              "correct": 0,
              "steps": [
                "Chaining stores entries in separate small linked-list nodes scattered across the heap, one allocation per node.",
                "Open addressing stores every entry directly inside the single backing array, with no separate node allocations.",
                "Contiguous array storage benefits from cache-line prefetching, exactly as covered in the arrays and linked-list booklets.",
                "So a probe sequence within one cache-friendly array tends to outperform following pointers into scattered chain nodes, especially at low to moderate load factors."
              ],
              "answer": "Open addressing, because all entries live inside one contiguous array rather than in separately allocated chain nodes scattered across the heap — the same cache-locality argument the linked-list booklet makes against pointer-chasing."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Hash function",
          "A deterministic function mapping a key to a number, used to choose which slot it belongs in."
        ],
        [
          "Hash code",
          "The numeric output of a hash function for a given key."
        ],
        [
          "Bucket / slot",
          "One position in a hash table's backing array, addressed by hash(key) mod capacity."
        ],
        [
          "Collision",
          "Two distinct keys hashing to the same slot."
        ],
        [
          "Chaining",
          "Resolving collisions by keeping a small secondary structure (often a linked list) at each slot."
        ],
        [
          "Open addressing",
          "Resolving collisions by probing for a different free slot within the same backing array."
        ],
        [
          "Probing",
          "The rule an open-addressing table follows to pick the next slot to try after a collision."
        ],
        [
          "Load factor",
          "Entries divided by capacity; the main signal for when to resize."
        ],
        [
          "Rehashing",
          "Recomputing every stored key's slot after a resize, since it depends on capacity."
        ],
        [
          "Hash flooding",
          "A denial-of-service technique that submits keys engineered to all collide under a known hash function."
        ],
        [
          "Seed randomisation",
          "Varying a hash function's internal seed per run so its outputs can't be precomputed by an attacker."
        ],
        [
          "Amortised O(1)",
          "The average cost per operation across a sequence, even though an individual insert can trigger an O(n) resize."
        ]
      ]
    },
  "graphsds": {
      "title": "Graphs",
      "blurb": "Nodes and edges — the most general structure in this map. A tree is a graph with no cycles and exactly one path between any two nodes; drop those restrictions and you get everything from road networks to the dependency graph a build system walks.",
      "chapters": [
        {
          "title": "Vertices, edges, and the shapes a graph can take",
          "blocks": [
            {
              "t": "p",
              "x": "A graph is a set of vertices (nodes) and a set of edges connecting pairs of them. That's the whole definition — no hierarchy, no single root, no rule against a node connecting back to something above it. A tree, which you've already met, is just a graph that happens to be connected and acyclic; every tree is a graph, but most graphs are not trees."
            },
            {
              "t": "p",
              "x": "Two independent choices describe most of what you need to know about a graph before touching an algorithm. Directed vs. undirected: does an edge point one way (a follows-relationship on a social network) or both (a friendship, a road with two-way traffic)? Weighted vs. unweighted: does each edge carry a cost, like distance or latency, or are all edges equivalent? A road map is undirected and weighted; a dependency graph like “function A calls function B” is directed and usually unweighted."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"28\" font-size=\"13\" fill=\"#9AA1A6\">Undirected</text>\n<circle cx=\"90\" cy=\"80\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"90\" y=\"85\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">A</text>\n<circle cx=\"220\" cy=\"50\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"220\" y=\"55\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">B</text>\n<circle cx=\"220\" cy=\"150\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"220\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">C</text>\n<line x1=\"105\" y1=\"70\" x2=\"205\" y2=\"56\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<line x1=\"105\" y1=\"90\" x2=\"205\" y2=\"142\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<line x1=\"220\" y1=\"68\" x2=\"220\" y2=\"132\" stroke=\"#2E3438\" stroke-width=\"1.4\"/>\n<text x=\"40\" y=\"230\" font-size=\"12\" fill=\"#666D72\">Edges have no direction: A–B means B–A too.</text>\n<text x=\"420\" y=\"28\" font-size=\"13\" fill=\"#9AA1A6\">Directed and weighted</text>\n<circle cx=\"470\" cy=\"80\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"470\" y=\"85\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">A</text>\n<circle cx=\"600\" cy=\"50\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"600\" y=\"55\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">B</text>\n<circle cx=\"600\" cy=\"150\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"600\" y=\"155\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">C</text>\n<defs><marker id=\"gsArrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 z\" fill=\"#9AA1A6\"/></marker></defs>\n<line x1=\"486\" y1=\"71\" x2=\"582\" y2=\"55\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" marker-end=\"url(#gsArrow)\"/>\n<text x=\"505\" y=\"55\" font-size=\"11\" fill=\"#666D72\">4</text>\n<line x1=\"600\" y1=\"68\" x2=\"600\" y2=\"132\" stroke=\"#9AA1A6\" stroke-width=\"1.4\" marker-end=\"url(#gsArrow)\"/>\n<text x=\"608\" y=\"104\" font-size=\"11\" fill=\"#666D72\">2</text>\n<text x=\"420\" y=\"230\" font-size=\"12\" fill=\"#666D72\">A→B costs 4; there is no B→A edge at all.</text>\n</svg>",
              "cap": "Undirected edges go both ways for free; directed edges are one-way streets, and a weight turns “connected” into “connected at some cost.”"
            },
            {
              "t": "note",
              "x": "A self-loop (an edge from a node to itself) and multiple edges between the same pair of nodes are both allowed in a general graph, though most textbook algorithms assume neither. A graph with neither is called simple, and it's what nearly every algorithm in this booklet assumes unless stated otherwise."
            }
          ]
        },
        {
          "title": "Representing a graph in memory",
          "blocks": [
            {
              "t": "p",
              "x": "An adjacency list stores, for each vertex, the list of vertices it connects to — an array or hash table of arrays. It costs O(V + E) space, where V is the vertex count and E the edge count, and is the default choice for almost every real graph, because real graphs are sparse: a social network has millions of users but each one follows only a few hundred others, not millions."
            },
            {
              "t": "p",
              "x": "An adjacency matrix instead stores a V×V grid where cell (i, j) records whether an edge runs from i to j (and its weight, if any). Checking whether a specific edge exists is O(1) instead of having to scan a list, but the matrix costs O(V²) space regardless of how many edges actually exist — wasteful for a sparse graph, and simply impossible to hold in memory once V reaches the millions."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Same graph, two representations — A–B, A–C, B–C</text>\n<text x=\"60\" y=\"56\" font-size=\"13\" fill=\"#9AA1A6\">Adjacency list</text>\n<text x=\"60\" y=\"84\" font-size=\"12.5\" fill=\"#EDEFF0\" font-family=\"monospace\">A: [B, C]</text>\n<text x=\"60\" y=\"106\" font-size=\"12.5\" fill=\"#EDEFF0\" font-family=\"monospace\">B: [A, C]</text>\n<text x=\"60\" y=\"128\" font-size=\"12.5\" fill=\"#EDEFF0\" font-family=\"monospace\">C: [A, B]</text>\n<text x=\"60\" y=\"160\" font-size=\"11.5\" fill=\"#666D72\">Space: O(V+E) — 6 total entries for 3 edges.</text>\n<text x=\"420\" y=\"56\" font-size=\"13\" fill=\"#9AA1A6\">Adjacency matrix</text>\n<rect x=\"420\" y=\"70\" width=\"140\" height=\"90\" fill=\"none\" stroke=\"#2E3438\"/>\n<line x1=\"420\" y1=\"100\" x2=\"560\" y2=\"100\" stroke=\"#2E3438\"/><line x1=\"420\" y1=\"130\" x2=\"560\" y2=\"130\" stroke=\"#2E3438\"/>\n<line x1=\"466\" y1=\"70\" x2=\"466\" y2=\"160\" stroke=\"#2E3438\"/><line x1=\"512\" y1=\"70\" x2=\"512\" y2=\"160\" stroke=\"#2E3438\"/>\n<text x=\"443\" y=\"90\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">1</text><text x=\"489\" y=\"90\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">1</text><text x=\"535\" y=\"90\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">0</text>\n<text x=\"443\" y=\"120\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">1</text><text x=\"489\" y=\"120\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">0</text><text x=\"535\" y=\"120\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">1</text>\n<text x=\"443\" y=\"150\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">1</text><text x=\"489\" y=\"150\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">1</text><text x=\"535\" y=\"150\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#666D72\">0</text>\n<text x=\"420\" y=\"185\" font-size=\"11.5\" fill=\"#666D72\">Space: O(V²) — 9 cells stored either way.</text>\n</svg>",
              "cap": "The list only pays for edges that exist; the matrix pays V² up front no matter how sparse the graph actually is."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Adjacency list",
                  "Per-vertex list of neighbours; O(V+E) space, the default for sparse graphs."
                ],
                [
                  "Adjacency matrix",
                  "V×V grid of edge presence/weight; O(1) edge lookup, O(V²) space."
                ],
                [
                  "Sparse graph",
                  "A graph where E is much closer to V than to V²."
                ],
                [
                  "Dense graph",
                  "A graph where E approaches V², the maximum possible edge count."
                ]
              ]
            }
          ]
        },
        {
          "title": "Traversal: breadth-first and depth-first search",
          "blocks": [
            {
              "t": "p",
              "x": "Breadth-first search (BFS) explores a graph one distance-ring at a time: visit the start node, then everything one edge away, then everything two edges away, and so on. It's implemented with a queue — push the start node, then repeatedly pop a node, visit it, and push its unvisited neighbours. Because it expands ring by ring, BFS finds the shortest path (in number of edges) from the start to any other node in an unweighted graph, which no other simple traversal guarantees."
            },
            {
              "t": "p",
              "x": "Depth-first search (DFS) instead commits to one path as far as it can go before backtracking, implemented with a stack — either explicitly or via the call stack of a recursive function, exactly the mechanism you saw in the recursion booklet. DFS doesn't find shortest paths, but it's the natural tool for questions about structure: detecting cycles, finding connected components, and producing a topological order all fall out of a DFS with a little bookkeeping."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">BFS from A: rings expand by distance, visited in the order shown</text>\n<circle cx=\"90\" cy=\"120\" r=\"19\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"90\" y=\"125\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">A</text><text x=\"90\" y=\"155\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">1st</text>\n<line x1=\"108\" y1=\"110\" x2=\"268\" y2=\"70\" stroke=\"#2E3438\"/><line x1=\"108\" y1=\"130\" x2=\"268\" y2=\"170\" stroke=\"#2E3438\"/>\n<circle cx=\"285\" cy=\"60\" r=\"17\" fill=\"#0E1113\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><text x=\"285\" y=\"65\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">B</text><text x=\"285\" y=\"38\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">2nd</text>\n<circle cx=\"285\" cy=\"180\" r=\"17\" fill=\"#0E1113\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><text x=\"285\" y=\"185\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">C</text><text x=\"285\" y=\"210\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">3rd</text>\n<line x1=\"302\" y1=\"52\" x2=\"470\" y2=\"40\" stroke=\"#2E3438\"/><line x1=\"302\" y1=\"188\" x2=\"470\" y2=\"200\" stroke=\"#2E3438\"/>\n<circle cx=\"488\" cy=\"32\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"488\" y=\"37\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">D</text><text x=\"488\" y=\"12\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">4th</text>\n<circle cx=\"488\" cy=\"208\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"488\" y=\"213\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">E</text><text x=\"488\" y=\"232\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">5th</text>\n</svg>",
              "cap": "Every node at distance 1 (B, C) is fully visited before any node at distance 2 (D, E) — that ring-by-ring order is exactly why BFS finds shortest unweighted paths."
            },
            {
              "t": "worked",
              "q": "Both BFS and DFS visit every reachable node exactly once. What's the actual difference in what each one is good for?",
              "steps": [
                "BFS explores by distance from the source, level by level, using a queue.",
                "The queue's FIFO order guarantees the first time you reach any node is via a shortest path in edge count.",
                "DFS explores by committing to a path and backtracking, using a stack (explicit or the call stack).",
                "It gives no shortest-path guarantee, but its ‘go deep, then backtrack’ order naturally exposes structure — cycles, connected components, orderings — that BFS doesn't surface as directly."
              ],
              "answer": "BFS guarantees shortest paths in an unweighted graph because it expands by distance; DFS gives no such guarantee but is the natural fit for structural questions (cycles, components, topological order) because of how it backtracks."
            }
          ]
        },
        {
          "title": "Cycles, connectivity, and DAGs",
          "blocks": [
            {
              "t": "p",
              "x": "A cycle is a path that starts and ends at the same vertex without reusing an edge. In an undirected graph, a DFS finds a cycle the moment it reaches an already-visited vertex that isn't the immediate parent it just came from. In a directed graph the check is subtler: you need to track vertices currently on the recursion stack (“in progress”), because reaching a vertex that's already fully finished is fine — reaching one still in progress means you've looped back on yourself."
            },
            {
              "t": "p",
              "x": "A connected component is a maximal set of vertices where every pair has some path between them (ignoring direction, for a directed graph — that variant is called weakly connected). Running BFS or DFS from an unvisited node and marking everything it reaches finds one whole component in one pass; repeating from any remaining unvisited node finds the next, so counting components is just counting how many times you had to restart."
            },
            {
              "t": "p",
              "x": "A directed acyclic graph, or DAG, is a directed graph with no cycles — exactly the shape of a dependency graph, a build order, or a course prerequisite chart (including the one behind this very map). A DAG's defining algorithmic gift is topological order: an ordering of all vertices such that every edge points from earlier in the order to later. That's what lets “do the prerequisites before the thing that needs them” be answered mechanically instead of by hand."
            },
            {
              "t": "note",
              "x": "A tree, a DAG, and a general graph form a strict nesting: every tree is a DAG (connected, acyclic, and additionally has exactly one path between any two nodes), every DAG is a directed graph, but most DAGs are not trees — a DAG allows a node to have more than one parent, which is exactly what happens when two different prerequisites both unlock the same later topic."
            }
          ]
        },
        {
          "title": "Where graphs show up",
          "blocks": [
            {
              "t": "p",
              "x": "Almost anything that connects discrete things is a graph once you notice it: web pages and hyperlinks, cities and roads, people and friendships, functions and the calls between them, accounts and transactions. The reason graphs get their own booklet instead of being folded into trees is that so much of computing turns out to be a graph problem in disguise — routing is shortest path, scheduling is topological order plus resource constraints, and recommendation is often a walk over a graph of shared behaviour."
            },
            {
              "t": "p",
              "x": "This booklet has deliberately stayed at the level of what a graph is and how to represent and traverse one. The next step — shortest paths with weights (Dijkstra's algorithm), minimum spanning trees, and network flow — belongs to graph algorithms, which builds directly on the traversal and representation ideas here plus the priority-queue structure from the heaps booklet."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These focus on the representation trade-off and the BFS/DFS distinction, since almost every graph algorithm downstream is really “BFS or DFS, plus one extra piece of bookkeeping.”"
            }
          ],
          "exercises": [
            {
              "q": "A graph has 10,000 vertices and about 15,000 edges. Which representation should you default to, and why?",
              "kind": "mc",
              "options": [
                "Adjacency list — the graph is sparse (E close to V, far from V²)",
                "Adjacency matrix — it gives O(1) edge lookup",
                "Either is equally fine at this size",
                "Neither; this needs a database"
              ],
              "correct": 0,
              "steps": [
                "An adjacency matrix here would need 10,000² = 100,000,000 cells regardless of edge count.",
                "An adjacency list needs space proportional to V + E ≈ 25,000 entries.",
                "15,000 edges among 10,000 vertices is sparse — nowhere near the V² = 100,000,000 a dense graph would have.",
                "The 4,000x space difference makes the list the clear default for a sparse graph like this one."
              ],
              "answer": "Adjacency list — with E far smaller than V², the matrix would waste enormous space storing mostly-absent edges."
            },
            {
              "q": "You need the shortest path, in number of hops, from one user to another in a social network with no edge weights. Which traversal guarantees the answer?",
              "kind": "mc",
              "options": [
                "BFS",
                "DFS",
                "Either, since both visit every reachable node",
                "Neither — you need Dijkstra's algorithm"
              ],
              "correct": 0,
              "steps": [
                "BFS visits nodes in strict order of distance from the source, one ring at a time.",
                "The first time BFS reaches any node is therefore guaranteed to be via a shortest path in edge count.",
                "DFS reaches nodes in whatever order its chosen path happens to go, with no distance guarantee.",
                "Dijkstra's algorithm generalizes this idea to weighted graphs, but for unweighted shortest paths plain BFS already suffices."
              ],
              "answer": "BFS — its ring-by-ring expansion order is exactly what guarantees the first visit to any node is via a shortest unweighted path."
            },
            {
              "q": "Explain why detecting a cycle in a directed graph needs to distinguish ‘finished’ vertices from ‘in progress’ ones, rather than just tracking ‘visited.’",
              "kind": "write",
              "accept": [
                "revisiting a finished node isn't a cycle",
                "in-progress means still on the current path",
                "finished nodes can be reached again without a cycle",
                "need to know if it's on the current recursion stack"
              ],
              "hint": "think about what makes a back-edge different from any other repeated visit",
              "steps": [
                "If you only track ‘visited’, reaching any previously-visited node looks the same whether or not it's a cycle.",
                "But in a DAG, two different paths can legitimately lead to the same already-finished node — that's not a cycle, just a shared dependency.",
                "A cycle specifically means reaching a node that is still an ancestor of the current node — still open on the current DFS path, not yet finished.",
                "Tracking ‘in progress’ (on the current recursion stack) separately from ‘finished’ (fully explored and popped) is what lets the algorithm tell these two cases apart."
              ],
              "answer": "Because reaching an already-finished node is normal in a DAG (two paths sharing a dependency), while reaching a node still in progress — still an ancestor on the current path — is what actually defines a cycle; conflating the two would report false cycles on every shared dependency."
            },
            {
              "q": "A build system needs to run compilation steps so that every step happens after all the steps it depends on. What graph concept directly gives it that order?",
              "kind": "write",
              "accept": [
                "topological order",
                "topological sort",
                "topo sort"
              ],
              "hint": "it's specific to DAGs",
              "steps": [
                "The dependency relationships form a directed graph: an edge from step X to step Y means X must run before Y.",
                "For this to be satisfiable at all, the graph must have no cycles — a cycle would mean a step depends on itself, directly or indirectly.",
                "A cycle-free directed graph is a DAG, and every DAG has at least one topological order.",
                "A topological order arranges all vertices so every edge points from earlier to later in the sequence — exactly ‘run dependencies before dependents.’"
              ],
              "answer": "Topological order (topological sort) — it arranges a DAG's vertices so every dependency edge points from earlier to later, which is precisely ‘run this before that.’"
            },
            {
              "q": "Why is an adjacency matrix simply infeasible for a graph like the World Wide Web (billions of pages)?",
              "kind": "mc",
              "options": [
                "Its space cost is O(V²), which is astronomically larger than the number of actual links",
                "It can't represent directed edges",
                "It can't store weights",
                "DFS doesn't work on matrices"
              ],
              "correct": 0,
              "steps": [
                "An adjacency matrix always costs O(V²) space, regardless of how many edges actually exist.",
                "With billions of pages, V² is on the order of 10^18 or more cells.",
                "The actual number of hyperlinks, while large, is nowhere close to V² — the web is extremely sparse.",
                "No amount of hardware makes storing 10^18 cells practical, so an adjacency list (or a variant of it) is the only workable choice at this scale."
              ],
              "answer": "Because its cost is always O(V²) regardless of actual edge count, and at billions of vertices that's an astronomically larger number of cells than the (still large, but far smaller) actual number of links — an adjacency list scales with the real edge count instead."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Vertex (node)",
          "A single point in a graph."
        ],
        [
          "Edge",
          "A connection between two vertices, optionally directed and/or weighted."
        ],
        [
          "Directed graph",
          "A graph whose edges point one way."
        ],
        [
          "Undirected graph",
          "A graph whose edges connect both ways."
        ],
        [
          "Weighted graph",
          "A graph whose edges carry a cost or distance."
        ],
        [
          "Adjacency list",
          "Per-vertex list of neighbours; the default sparse-graph representation."
        ],
        [
          "Adjacency matrix",
          "V×V grid of edge presence; O(1) lookup, O(V²) space."
        ],
        [
          "Degree",
          "The number of edges touching a vertex."
        ],
        [
          "Path",
          "A sequence of edges connecting a sequence of distinct vertices."
        ],
        [
          "Cycle",
          "A path that returns to its own starting vertex."
        ],
        [
          "Connected component",
          "A maximal set of vertices all reachable from one another."
        ],
        [
          "DAG",
          "Directed acyclic graph — a directed graph with no cycles."
        ],
        [
          "Topological order",
          "An ordering of a DAG's vertices where every edge points forward."
        ],
        [
          "BFS",
          "Breadth-first search — explores by distance, using a queue; finds shortest unweighted paths."
        ],
        [
          "DFS",
          "Depth-first search — explores by committing to a path, using a stack; exposes structure."
        ]
      ]
    },
  "heaps": {
      "title": "Heaps",
      "blurb": "A tree that gives up full ordering for one narrower guarantee: the smallest (or largest) element is always sitting at the root, one step away — which turns out to be exactly the guarantee a priority queue needs.",
      "chapters": [
        {
          "title": "The heap property",
          "blocks": [
            {
              "t": "p",
              "x": "A binary search tree, from the trees booklet, keeps a strong invariant everywhere: left subtree smaller, right subtree larger. A heap keeps a much weaker one: in a min-heap, every parent is less than or equal to both of its children — nothing at all is said about whether a left child is smaller than a right child, or about the relative order of two nodes in different subtrees. That weaker invariant is deliberate: it's cheap to maintain, and it's exactly enough to guarantee one thing — the minimum element in the entire structure is always the root."
            },
            {
              "t": "p",
              "x": "A max-heap is the mirror image: every parent is greater than or equal to its children, and the root always holds the maximum. Which one you use depends entirely on whether you repeatedly need the smallest or the largest item next; the two are otherwise identical in every property covered here."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"22\" font-size=\"12.5\" fill=\"#666D72\">A valid min-heap — every parent ≤ its children, siblings unordered</text>\n<circle cx=\"330\" cy=\"46\" r=\"19\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/><text x=\"330\" y=\"51\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">2</text>\n<line x1=\"330\" y1=\"65\" x2=\"220\" y2=\"104\" stroke=\"#2E3438\"/><line x1=\"330\" y1=\"65\" x2=\"440\" y2=\"104\" stroke=\"#2E3438\"/>\n<circle cx=\"220\" cy=\"122\" r=\"17\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"220\" y=\"127\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">5</text>\n<circle cx=\"440\" cy=\"122\" r=\"17\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"440\" y=\"127\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">4</text>\n<line x1=\"220\" y1=\"140\" x2=\"160\" y2=\"178\" stroke=\"#2E3438\"/><line x1=\"220\" y1=\"140\" x2=\"280\" y2=\"178\" stroke=\"#2E3438\"/>\n<circle cx=\"160\" cy=\"196\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"160\" y=\"201\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">8</text>\n<circle cx=\"280\" cy=\"196\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"280\" y=\"201\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">9</text>\n<line x1=\"440\" y1=\"140\" x2=\"500\" y2=\"178\" stroke=\"#2E3438\"/>\n<circle cx=\"500\" cy=\"196\" r=\"15\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"500\" y=\"201\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">7</text>\n<text x=\"30\" y=\"232\" font-size=\"11.5\" fill=\"#666D72\">5 and 9 are both under 2, but 5 &lt; 9 is never checked or required.</text>\n</svg>",
              "cap": "The root (2) is guaranteed smallest, but 8 and 9 sit in different branches with no ordering between them at all — that's the whole trade for a cheaper invariant."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Heap property",
                  "Every parent compares a fixed way (≤ for min, ≥ for max) to both children."
                ],
                [
                  "Min-heap",
                  "A heap where the root is always the minimum element."
                ],
                [
                  "Max-heap",
                  "A heap where the root is always the maximum element."
                ]
              ]
            }
          ]
        },
        {
          "title": "A tree stored as an array",
          "blocks": [
            {
              "t": "p",
              "x": "A heap is always a complete binary tree — every level is fully filled except possibly the last, which fills left to right with no gaps. Completeness is what makes an array representation possible: instead of nodes and pointers, a heap stores its values densely in an array, and the tree structure is implied entirely by index arithmetic, at zero extra memory cost for links."
            },
            {
              "t": "p",
              "x": "For a node stored at index i (0-indexed), its children live at 2i + 1 and 2i + 2, and its parent lives at ⌊(i − 1) / 2⌋. Because there are no explicit pointers to follow, moving between a node and its parent or children is a single arithmetic operation rather than a memory dereference — one of the reasons heaps are fast in practice, on top of being asymptotically efficient."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 680 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"340\" cy=\"40\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"340\" y=\"45\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">2</text>\n<line x1=\"340\" y1=\"58\" x2=\"250\" y2=\"96\" stroke=\"#2E3438\"/><line x1=\"340\" y1=\"58\" x2=\"430\" y2=\"96\" stroke=\"#2E3438\"/>\n<circle cx=\"250\" cy=\"114\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"250\" y=\"119\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">5</text>\n<circle cx=\"430\" cy=\"114\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"430\" y=\"119\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">4</text>\n<line x1=\"250\" y1=\"130\" x2=\"200\" y2=\"166\" stroke=\"#2E3438\"/><line x1=\"250\" y1=\"130\" x2=\"300\" y2=\"166\" stroke=\"#2E3438\"/>\n<circle cx=\"200\" cy=\"182\" r=\"14\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"200\" y=\"187\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">8</text>\n<circle cx=\"300\" cy=\"182\" r=\"14\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"300\" y=\"187\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">9</text>\n<text x=\"30\" y=\"230\" font-size=\"12\" fill=\"#666D72\">array:</text>\n<g font-family=\"monospace\" font-size=\"12.5\">\n<rect x=\"90\" y=\"212\" width=\"36\" height=\"26\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"108\" y=\"230\" text-anchor=\"middle\" fill=\"#EDEFF0\">2</text>\n<rect x=\"126\" y=\"212\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"144\" y=\"230\" text-anchor=\"middle\" fill=\"#9AA1A6\">5</text>\n<rect x=\"162\" y=\"212\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"180\" y=\"230\" text-anchor=\"middle\" fill=\"#9AA1A6\">4</text>\n<rect x=\"198\" y=\"212\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"216\" y=\"230\" text-anchor=\"middle\" fill=\"#666D72\">8</text>\n<rect x=\"234\" y=\"212\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"252\" y=\"230\" text-anchor=\"middle\" fill=\"#666D72\">9</text>\n</g>\n<text x=\"390\" y=\"222\" font-size=\"11.5\" fill=\"#666D72\">index 1 (value 5): parent = ⌊(1−1)/2⌋ = 0</text>\n<text x=\"390\" y=\"242\" font-size=\"11.5\" fill=\"#666D72\">children of index 0: 2(0)+1=1, 2(0)+2=2</text>\n</svg>",
              "cap": "Five values, one array, and the whole tree shape is recovered purely from index arithmetic — no pointers stored anywhere."
            }
          ]
        },
        {
          "title": "Sift-up and sift-down",
          "blocks": [
            {
              "t": "p",
              "x": "Inserting into a heap appends the new value at the next open array slot — keeping the tree complete — and then sifts it up: compare it to its parent, and if it violates the heap property, swap them and repeat with the new parent, stopping as soon as the property holds or the root is reached. Because a complete binary tree with n nodes has height O(log n), sift-up does at most O(log n) swaps."
            },
            {
              "t": "p",
              "x": "Removing the minimum (or maximum) always removes the root, since that's the only place the guarantee applies. To fill the hole without breaking completeness, move the last element in the array into the root position, shrink the array, and sift it down: repeatedly swap it with whichever child is smaller (min-heap) than it, until it's smaller than both children or has none. This is also O(log n), for the same height reason."
            },
            {
              "t": "worked",
              "q": "A min-heap array is [2, 5, 4, 8, 9]. Insert 1. Trace the sift-up.",
              "steps": [
                "Append 1 at the next open slot: [2, 5, 4, 8, 9, 1] — index 5.",
                "Its parent is at ⌊(5−1)/2⌋ = 2, which holds value 4.",
                "1 < 4 violates the heap property, so swap: [2, 5, 1, 8, 9, 4] — 1 now at index 2.",
                "Its new parent is at ⌊(2−1)/2⌋ = 0, which holds value 2. 1 < 2 still violates, so swap: [1, 5, 2, 8, 9, 4].",
                "Index 0 is the root — sift-up stops. 1 is now correctly at the top."
              ],
              "answer": "[1, 5, 2, 8, 9, 4] — two swaps carried 1 up from a leaf position to the root, each comparison against its current parent."
            }
          ]
        },
        {
          "title": "Building a heap, and heapsort in one paragraph",
          "blocks": [
            {
              "t": "p",
              "x": "Building a heap from n arbitrary values by inserting them one at a time costs O(n log n) — n insertions, each O(log n). There's a faster way: place all n values into the array in any order, then sift down every non-leaf node starting from the last one and working back to the root. This heapify procedure costs only O(n) total, not O(n log n) — a classic case where the naive analysis (n nodes times O(log n) each) overcounts, because most nodes in a complete tree are near the bottom, where sift-down has almost no distance to travel."
            },
            {
              "t": "p",
              "x": "Heapsort uses exactly this: heapify the array in O(n), then repeatedly remove the root (swap it to the end, shrink the heap by one, sift down) n times, each removal costing O(log n). Total: O(n log n), matching merge sort's bound, and — unlike merge sort — done entirely in place with no extra array."
            }
          ]
        },
        {
          "title": "Priority queues and where heaps show up",
          "blocks": [
            {
              "t": "p",
              "x": "A priority queue is the abstract idea a heap almost always implements: a collection where you can insert an item with a priority and always extract the highest-priority (or lowest-cost) one next, both in O(log n). That single capability underlies Dijkstra's shortest-path algorithm (always expand the closest unvisited node next — see graph algorithms), operating-system task scheduling (always run the highest-priority ready process), and any streaming top-k problem (keep a heap of size k and evict the worst item whenever a better one arrives)."
            },
            {
              "t": "note",
              "x": "A heap is not a good structure for search — “is value 7 anywhere in this heap?” requires scanning, potentially the whole array, because the heap property says nothing about where a non-root value can be. If you need both fast insertion and fast arbitrary lookup, you generally want a hash table or balanced tree instead — a heap answers exactly one question fast (what's the current min/max) and no others."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The recurring theme here is that ‘complete’ is doing all the work — it's the one property that turns a tree into a dense array with free index arithmetic."
            }
          ],
          "exercises": [
            {
              "q": "A complete binary tree holding 1,000 elements has approximately what height?",
              "kind": "mc",
              "options": [
                "About log₂(1000) ≈ 10",
                "About 1000",
                "About 500",
                "Exactly 3"
              ],
              "correct": 0,
              "steps": [
                "A complete binary tree fills every level except possibly the last.",
                "Each level roughly doubles the number of nodes seen so far.",
                "The number of levels needed to reach n nodes is therefore about log₂(n).",
                "log₂(1000) ≈ 10, which is the tree's height — and the bound on sift-up/sift-down cost."
              ],
              "answer": "About 10 (log₂ 1000 ≈ 10) — which is exactly why heap operations cost O(log n)."
            },
            {
              "q": "Why does building a heap via n individual insertions cost more, asymptotically, than the dedicated heapify procedure?",
              "kind": "write",
              "accept": [
                "insertion is worst case at every level, heapify mostly touches shallow subtrees",
                "heapify accounts for most nodes being near the bottom",
                "insertion assumes log n work every time, heapify doesn't"
              ],
              "hint": "think about where most of the nodes in a complete tree actually are",
              "steps": [
                "Inserting one at a time, each insertion's sift-up can travel all the way from a leaf to the root — O(log n) each, n times, so O(n log n) total.",
                "Heapify instead sifts every node down, but starts from nodes near the bottom, which have almost no distance to travel.",
                "Most nodes in a complete tree are in the bottom levels, where a sift-down does very little work.",
                "Summing the actual work across all levels (not just bounding every node at O(log n)) gives a total of O(n), not O(n log n)."
              ],
              "answer": "Because heapify's sift-downs start from the bottom, where most nodes live and where there's almost nowhere to sift to, while repeated insertion's sift-ups can each travel the tree's full height — the same total node count, but a much tighter true cost when you account for where the nodes actually sit."
            },
            {
              "q": "You need to repeatedly report the current maximum of a growing, shrinking set of numbers, in O(log n) per operation. Which structure fits directly?",
              "kind": "mc",
              "options": [
                "A max-heap",
                "A min-heap",
                "A sorted array",
                "A hash table"
              ],
              "correct": 0,
              "steps": [
                "The requirement is fast insertion plus fast access to the current maximum, repeated as the set changes.",
                "A max-heap gives O(1) peek at the maximum (it's the root) and O(log n) insertion and removal.",
                "A sorted array gives O(1) peek at the max but O(n) insertion, since maintaining sorted order requires shifting elements.",
                "A min-heap would need to be inverted (or store negated values) to track a maximum instead of a minimum, which a max-heap already does directly."
              ],
              "answer": "A max-heap — O(1) access to the current maximum via the root, and O(log n) insertion and removal, matching the requirement exactly."
            },
            {
              "q": "Why can't you use a heap to efficiently answer ‘does the value 42 exist anywhere in this collection?’",
              "kind": "write",
              "accept": [
                "heap property only orders parent-child, not siblings or full tree",
                "42 could be anywhere, no way to narrow the search",
                "no ordering between subtrees to guide a search"
              ],
              "hint": "compare this to how a BST narrows a search",
              "steps": [
                "A BST's invariant orders every node relative to the whole tree, so a search can discard half the remaining tree at each step.",
                "A heap's invariant only orders a node relative to its own parent — nothing says whether 42 is more likely in the left or right subtree.",
                "So there is no way to rule out any branch without checking it.",
                "In the worst case, checking for an arbitrary value requires scanning every node, O(n), not O(log n)."
              ],
              "answer": "Because the heap property only constrains a parent against its own children, not against the whole tree, so there's no basis for ruling out any subtree — an arbitrary-value search has to scan everything, O(n)."
            },
            {
              "q": "Heapsort and merge sort are both O(n log n). Name one practical advantage heapsort has, and one merge sort has.",
              "kind": "write",
              "accept": [
                "heapsort in place, merge sort stable",
                "heapsort no extra memory, merge sort preserves order of equal elements"
              ],
              "hint": "one is about memory, one is about stability",
              "steps": [
                "Heapsort sorts within the original array, using no auxiliary array — O(1) extra space.",
                "Merge sort's merge step needs a second array to merge into, costing O(n) extra space.",
                "Merge sort, done carefully, is stable — equal elements keep their original relative order.",
                "Heapsort's swaps during sift-down can reorder equal elements relative to each other, so it is not stable."
              ],
              "answer": "Heapsort sorts in place with O(1) extra memory; merge sort is stable (preserves the relative order of equal elements), which heapsort does not guarantee."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Heap",
          "A complete binary tree obeying a parent-vs-children ordering invariant."
        ],
        [
          "Min-heap",
          "A heap whose root is always the minimum element."
        ],
        [
          "Max-heap",
          "A heap whose root is always the maximum element."
        ],
        [
          "Complete binary tree",
          "A tree where every level is full except possibly the last, which fills left to right."
        ],
        [
          "Sift-up (bubble-up)",
          "Moving a newly inserted value upward until the heap property holds."
        ],
        [
          "Sift-down (bubble-down)",
          "Moving a value downward, swapping with the smaller/larger child, until the heap property holds."
        ],
        [
          "Heapify",
          "Building a valid heap from an arbitrary array in O(n) total."
        ],
        [
          "Priority queue",
          "An abstract collection supporting fast insert and fast extract-min/max."
        ],
        [
          "Extract-min / extract-max",
          "Removing and returning the root of a min-/max-heap."
        ],
        [
          "Peek",
          "Reading the root value without removing it, in O(1)."
        ],
        [
          "Heapsort",
          "An in-place O(n log n) sort built from heapify plus repeated extraction."
        ],
        [
          "Binary heap",
          "A heap implemented as a binary tree, the most common heap variant."
        ]
      ]
    },
  "divide": {
      "title": "Divide and Conquer",
      "blurb": "Split a problem into smaller versions of itself, solve each piece independently, then combine the pieces — the recursive strategy behind the fastest general-purpose sorting algorithms and a template you'll recognize everywhere once you've seen it once.",
      "chapters": [
        {
          "title": "The three-part pattern",
          "blocks": [
            {
              "t": "p",
              "x": "Divide and conquer is a specific way of using recursion, from the recursion booklet, to solve a problem: divide the input into smaller pieces of the same kind of problem, conquer each piece by recursing on it (down to a base case small enough to solve directly), then combine the sub-results into a solution for the original input. All three steps matter — a strategy that divides but never combines, or combines without a genuine divide, isn't this pattern."
            },
            {
              "t": "p",
              "x": "The pattern earns its own name, separate from recursion in general, because the division is usually into roughly equal-sized, independent pieces — which is exactly what makes it parallelizable in principle, and exactly what makes its running time analyzable with a recurrence relation, the tool the next chapter introduces."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"22\" font-size=\"12.5\" fill=\"#666D72\">One problem, split in half at each level, until pieces are trivial</text>\n<rect x=\"290\" y=\"36\" width=\"120\" height=\"30\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"350\" y=\"56\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">n = 8</text>\n<line x1=\"320\" y1=\"66\" x2=\"200\" y2=\"104\" stroke=\"#2E3438\"/><line x1=\"380\" y1=\"66\" x2=\"500\" y2=\"104\" stroke=\"#2E3438\"/>\n<rect x=\"150\" y=\"104\" width=\"100\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"200\" y=\"122\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">n = 4</text>\n<rect x=\"450\" y=\"104\" width=\"100\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"500\" y=\"122\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">n = 4</text>\n<line x1=\"180\" y1=\"130\" x2=\"120\" y2=\"166\" stroke=\"#2E3438\"/><line x1=\"220\" y1=\"130\" x2=\"280\" y2=\"166\" stroke=\"#2E3438\"/>\n<line x1=\"480\" y1=\"130\" x2=\"420\" y2=\"166\" stroke=\"#2E3438\"/><line x1=\"520\" y1=\"130\" x2=\"580\" y2=\"166\" stroke=\"#2E3438\"/>\n<rect x=\"90\" y=\"166\" width=\"60\" height=\"22\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"120\" y=\"181\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">n=2</text>\n<rect x=\"250\" y=\"166\" width=\"60\" height=\"22\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"280\" y=\"181\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">n=2</text>\n<rect x=\"390\" y=\"166\" width=\"60\" height=\"22\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"420\" y=\"181\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">n=2</text>\n<rect x=\"550\" y=\"166\" width=\"60\" height=\"22\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"580\" y=\"181\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">n=2</text>\n<text x=\"30\" y=\"224\" font-size=\"12\" fill=\"#666D72\">Divide: split until n = 1 (base case). Conquer: solve trivially. Combine: merge results back up.</text>\n</svg>",
              "cap": "Each level halves the problem size; the tree has log₂ n levels, and the combine step happens once per node on the way back up."
            }
          ]
        },
        {
          "title": "Recurrences: analyzing the cost",
          "blocks": [
            {
              "t": "p",
              "x": "Because a divide-and-conquer algorithm calls itself on smaller inputs, its running time is naturally expressed as a recurrence relation: T(n), the time to solve a problem of size n, defined in terms of T applied to smaller sizes. The general shape is T(n) = a·T(n/b) + f(n) — a subproblems, each of size n/b, plus f(n) work to divide and combine at the current level."
            },
            {
              "t": "p",
              "x": "The Master theorem gives the closed-form answer for recurrences of this shape without having to re-derive it each time, by comparing f(n) against n^(log_b a): if f(n) grows slower, the recursive calls dominate and T(n) = Θ(n^(log_b a)); if f(n) grows faster, the combine step dominates and T(n) = Θ(f(n)); if they grow at matching rates, there's an extra logarithmic factor, T(n) = Θ(f(n)·log n). You don't need to memorize the three cases by name — what matters is the underlying question: is the work concentrated at the top of the recursion, the bottom, or spread evenly?"
            },
            {
              "t": "worked",
              "q": "Solve T(n) = 2T(n/2) + O(n) using a recursion tree instead of quoting the Master theorem.",
              "steps": [
                "At the top level, the combine work is O(n), and there are 2 subproblems of size n/2.",
                "At the next level, there are 2 subproblems, each contributing O(n/2) combine work — 2 × O(n/2) = O(n) total for that level.",
                "Every level, no matter how far down, contributes O(n) total work, because the per-node work shrinks exactly as fast as the number of nodes grows.",
                "There are log₂ n levels before reaching subproblems of size 1.",
                "Total work is O(n) per level times log₂ n levels: O(n log n)."
              ],
              "answer": "T(n) = O(n log n) — every level of the recursion does O(n) total work, and there are log₂ n levels, because each level's per-node work shrinks by exactly the factor its node count grows by."
            }
          ]
        },
        {
          "title": "Case study: merge sort",
          "blocks": [
            {
              "t": "p",
              "x": "Merge sort applies the pattern directly to sorting: divide the array in half, recursively sort each half, then combine by merging the two now-sorted halves into one sorted array. The merge step itself is the interesting part — given two sorted arrays, you can produce one sorted array in O(n) time by walking both with a pointer each, always taking the smaller of the two current elements, which never requires looking back."
            },
            {
              "t": "p",
              "x": "The recurrence is exactly T(n) = 2T(n/2) + O(n), the one just solved: O(n log n) overall, matching the best possible general-purpose comparison sort. Unlike quicksort (also divide-and-conquer, but which divides unevenly around a pivot and merges trivially by doing nothing), merge sort's O(n log n) is guaranteed in the worst case, not just on average — the cost of that guarantee is the O(n) auxiliary array the merge step needs, which quicksort avoids."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"22\" font-size=\"12.5\" fill=\"#666D72\">Merging two sorted halves — always take the smaller front element</text>\n<g font-family=\"monospace\" font-size=\"13\">\n<text x=\"40\" y=\"56\" fill=\"#9AA1A6\">left:  [2, 5, 8]</text>\n<text x=\"40\" y=\"80\" fill=\"#9AA1A6\">right: [3, 6, 9]</text>\n<text x=\"40\" y=\"120\" fill=\"#EDEFF0\">out:   [2, 3, 5, 6, 8, 9]</text>\n</g>\n<path d=\"M60 60 L60 116\" stroke=\"#2E3438\" stroke-dasharray=\"2 3\"/>\n<text x=\"330\" y=\"56\" font-size=\"12\" fill=\"#666D72\">step: compare 2 vs 3 → take 2</text>\n<text x=\"330\" y=\"78\" font-size=\"12\" fill=\"#666D72\">step: compare 5 vs 3 → take 3</text>\n<text x=\"330\" y=\"100\" font-size=\"12\" fill=\"#666D72\">step: compare 5 vs 6 → take 5, then 6, then 8, then 9</text>\n<text x=\"30\" y=\"160\" font-size=\"11.5\" fill=\"#666D72\">Each element is looked at once per merge level — O(n) work per merge, regardless of how many merges happen.</text>\n</svg>",
              "cap": "One pointer per half, always advancing the smaller side — the merge never needs to backtrack, which is what keeps it linear."
            }
          ]
        },
        {
          "title": "Case study: binary exponentiation",
          "blocks": [
            {
              "t": "p",
              "x": "Divide and conquer isn't only for sorting. Computing xⁿ naively takes n − 1 multiplications. Binary exponentiation instead uses the identity xⁿ = (x^(n/2))² when n is even, and xⁿ = x · x^(n−1) when n is odd — dividing the exponent in half at each step rather than counting down by one. Each step does O(1) extra work (one squaring, and occasionally one extra multiplication) and there are only O(log n) steps, since the exponent halves each time."
            },
            {
              "t": "p",
              "x": "This turns an O(n) computation into an O(log n) one with essentially no extra machinery — no arrays, no merge step, just a recursive halving. It's the same fundamental move as merge sort (halve the problem, combine cheaply), which is worth noticing: the pattern shows up whenever a problem has some operation that can be applied to a half-sized version and cheaply extended to the full-sized answer."
            },
            {
              "t": "note",
              "x": "Binary exponentiation is exactly how modular exponentiation is computed efficiently in cryptography (RSA and similar), where n can be a several-hundred-digit number — the difference between O(n) and O(log n) multiplications there is the difference between infeasible and instant."
            }
          ]
        },
        {
          "title": "When divide and conquer doesn't help",
          "blocks": [
            {
              "t": "p",
              "x": "The pattern assumes the subproblems it creates are independent — solving one doesn't help solve another. When subproblems instead overlap heavily (the same smaller subproblem gets solved repeatedly across different branches of the recursion), plain divide and conquer wastes enormous amounts of work recomputing identical answers, and dynamic programming, covered later, is the fix: solve each distinct subproblem once and reuse the answer everywhere it's needed."
            },
            {
              "t": "p",
              "x": "Naive recursive Fibonacci is the standard example: computing fib(n) by recursing on fib(n−1) and fib(n−2) looks like divide and conquer, but the two recursive calls aren't independent — they both eventually recompute fib(n−2), fib(n−3), and so on, an exponential amount of duplicated work for what has an O(n) solution once you stop recomputing. The giveaway that you have overlapping subproblems, not a good divide-and-conquer fit, is exactly this: the same smaller input recurring across multiple branches of the recursion tree."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These mix recurrence-solving with recognizing when the pattern applies at all — the second half of learning divide and conquer is knowing when not to reach for it."
            }
          ],
          "exercises": [
            {
              "q": "An algorithm splits a problem into 3 subproblems of size n/3 each, doing O(n) work to combine them. Which recurrence describes it?",
              "kind": "mc",
              "options": [
                "T(n) = 3T(n/3) + O(n)",
                "T(n) = T(n/3) + O(n)",
                "T(n) = 3T(n) + O(n/3)",
                "T(n) = 3T(n/3) + O(1)"
              ],
              "correct": 0,
              "steps": [
                "‘3 subproblems’ means a = 3 in the general T(n) = a·T(n/b) + f(n) shape.",
                "‘Each of size n/3’ means b = 3.",
                "‘O(n) work to combine’ means f(n) = O(n).",
                "Putting these together gives T(n) = 3T(n/3) + O(n) — the same recurrence merge sort has, incidentally, just derived from different divide/combine numbers."
              ],
              "answer": "T(n) = 3T(n/3) + O(n) — 3 subproblems (a=3) each a third of the size (b=3), plus O(n) combine work."
            },
            {
              "q": "Why does merge sort guarantee O(n log n) in the worst case, while quicksort's O(n log n) is only an average case?",
              "kind": "write",
              "accept": [
                "merge sort always splits evenly, quicksort's split depends on the pivot",
                "quicksort can pick a bad pivot and split unevenly",
                "merge sort's divide step doesn't depend on the data"
              ],
              "hint": "think about what determines how evenly each one splits its input",
              "steps": [
                "Merge sort's divide step always splits the array exactly in half, regardless of the data's values.",
                "Quicksort's divide step depends on where the chosen pivot lands relative to the rest of the data.",
                "If the pivot is consistently near one end (e.g. already-sorted input with a naive first-element pivot), quicksort's split becomes drastically uneven — one subproblem of size n−1, one of size 0.",
                "An always-even split guarantees the O(n log n) recurrence; a potentially-uneven split degrades in the worst case toward O(n²), which is what happens to quicksort on adversarial input."
              ],
              "answer": "Merge sort's divide step always splits the input exactly in half regardless of the data, guaranteeing the O(n log n) recurrence; quicksort's split depends on where the pivot lands, and a consistently bad pivot choice degrades it toward O(n²) in the worst case."
            },
            {
              "q": "Trace binary exponentiation to compute 3^6. How many multiplications/squarings does it use?",
              "kind": "write",
              "accept": [
                "4",
                "four"
              ],
              "hint": "6 is even, so start by relating 3^6 to (3^3)^2",
              "steps": [
                "3^6 = (3^3)^2, since 6 is even.",
                "3^3 = 3 · 3^2, since 3 is odd — need 3^2 first.",
                "3^2 = 3 · 3, one multiplication: 3^2 = 9.",
                "3^3 = 3 · 9 = 27, one more multiplication.",
                "3^6 = 27² = 729, one squaring — total: 3 multiplications/squarings to get the pieces, plus the final one, 4 total, versus 5 for the naive approach (barely fewer here since n is small, but the gap widens fast as n grows)."
              ],
              "answer": "729, using 4 multiplications/squarings — the saving becomes dramatic for large exponents, where naive computation is O(n) and this is O(log n)."
            },
            {
              "q": "Naive recursive Fibonacci looks like divide and conquer but performs badly. What specifically disqualifies it from being a good fit for the pattern?",
              "kind": "mc",
              "options": [
                "Its two recursive calls solve overlapping subproblems, not independent ones",
                "It doesn't have a base case",
                "It doesn't combine its subresults",
                "Fibonacci numbers can't be computed recursively at all"
              ],
              "correct": 0,
              "steps": [
                "Divide and conquer assumes each recursive call solves an independent piece of the problem.",
                "fib(n−1) and fib(n−2) both eventually call fib(n−2), fib(n−3), and further down, recomputing the same values repeatedly.",
                "This overlap means the same work is redone exponentially many times across the recursion tree.",
                "That overlap — not the base case or the combine step, both of which naive Fibonacci does have — is exactly what disqualifies it; the fix (dynamic programming) is to cache and reuse those repeated subproblem results."
              ],
              "answer": "Its recursive calls overlap — both branches eventually recompute the same smaller subproblems — which is the hallmark of a bad divide-and-conquer fit and exactly what dynamic programming exists to fix."
            },
            {
              "q": "Using the Master theorem's intuition (not the formula), explain in one or two sentences why T(n) = T(n/2) + O(1) (binary search's recurrence) resolves to O(log n).",
              "kind": "write",
              "accept": [
                "only one subproblem, constant work per level, log n levels",
                "one branch, o(1) work each level, halves until n=1"
              ],
              "hint": "how many levels are there, and how much work happens at each one",
              "steps": [
                "There is only one subproblem per call (a = 1), of half the size, with O(1) extra work to divide/combine.",
                "Each level of recursion does O(1) work, and there is exactly one branch to follow — no branching multiplies the node count.",
                "The input halves each level, so it takes log₂ n levels to shrink from n down to the base case.",
                "O(1) work per level times log₂ n levels is O(log n) total."
              ],
              "answer": "Because there's a single branch (not a fan-out of subproblems) doing O(1) work per level, and halving the input each time takes log₂ n levels to reach the base case — O(1) times log n levels is O(log n)."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Divide and conquer",
          "Split into smaller same-kind subproblems, solve each, combine the results."
        ],
        [
          "Recurrence relation",
          "An equation defining T(n) in terms of T at smaller inputs."
        ],
        [
          "Master theorem",
          "A closed-form solution for recurrences of the shape T(n)=aT(n/b)+f(n)."
        ],
        [
          "Recursion tree",
          "A diagram of a recurrence's calls, used to sum total work level by level."
        ],
        [
          "Merge sort",
          "A divide-and-conquer sort: split in half, sort each half, merge."
        ],
        [
          "Merge step",
          "Combining two sorted sequences into one sorted sequence in O(n)."
        ],
        [
          "Combine step",
          "The work done after subproblems return, to assemble the final answer."
        ],
        [
          "Binary exponentiation",
          "Computing xⁿ in O(log n) by halving the exponent each step."
        ],
        [
          "Overlapping subproblems",
          "When independent-looking recursive calls repeatedly solve the same smaller input."
        ],
        [
          "Base case",
          "The smallest input size solved directly, without further recursion."
        ],
        [
          "In-place algorithm",
          "One that uses O(1) extra memory beyond its input."
        ],
        [
          "Auxiliary array",
          "Extra memory used to hold intermediate results, as in merge sort's merge step."
        ]
      ]
    },
  "sorting": {
      "title": "Sorting",
      "blurb": "Putting data in order — the most-studied problem in computer science, and the standard arena for comparing algorithms honestly, using the recurrence tools from divide and conquer and the vocabulary from complexity.",
      "chapters": [
        {
          "title": "What \"good\" means for a sort",
          "blocks": [
            {
              "t": "p",
              "x": "Every sorting algorithm answers the same question — rearrange a sequence into order — but they're judged on more than just \"does it finish.\" Time complexity (from the complexity booklet) is the obvious axis, but three others matter just as much in practice: is it stable (do equal elements keep their original relative order), is it in-place (does it need only O(1) extra memory beyond the input), and is it comparison-based (does it only ever ask \"is a < b\", or does it exploit something about the keys themselves)?"
            },
            {
              "t": "p",
              "x": "Stability sounds minor until you sort by one key after already sorting by another — sorting a list of orders by date, having already sorted it by customer name, only produces \"orders grouped by customer, each customer's orders in date order\" if the sort is stable. An unstable sort scrambles the earlier ordering as a side effect."
            },
            {
              "t": "note",
              "x": "\"Fastest\" isn't a single number: an algorithm can be fastest in the worst case, fastest on average, or fastest on nearly-sorted input, and these are frequently different algorithms. The rest of this booklet is largely about which of those three questions each classic algorithm actually answers well."
            }
          ]
        },
        {
          "title": "Insertion sort: simple, adaptive, and O(n²)",
          "blocks": [
            {
              "t": "p",
              "x": "Insertion sort builds the sorted result one element at a time: it keeps a sorted prefix and, for each new element, shifts it leftward past everything bigger until it finds its place. Worst case is O(n²) — a reversed array shifts every new element all the way to the front — but it's adaptive: on data that's already nearly sorted, most elements need zero or one shift, and the running time drops toward O(n)."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Inserting 2 into the sorted prefix [3, 5, 7] by shifting bigger elements right</text>\n<g font-family=\"monospace\" font-size=\"13\">\n<text x=\"40\" y=\"66\" fill=\"#666D72\">before:</text>\n<rect x=\"120\" y=\"48\" width=\"44\" height=\"28\" fill=\"#0E1113\" stroke=\"#EDEFF0\"/><text x=\"142\" y=\"67\" text-anchor=\"middle\" fill=\"#EDEFF0\">3</text>\n<rect x=\"166\" y=\"48\" width=\"44\" height=\"28\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"188\" y=\"67\" text-anchor=\"middle\" fill=\"#9AA1A6\">5</text>\n<rect x=\"212\" y=\"48\" width=\"44\" height=\"28\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"234\" y=\"67\" text-anchor=\"middle\" fill=\"#9AA1A6\">7</text>\n<rect x=\"258\" y=\"48\" width=\"44\" height=\"28\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"280\" y=\"67\" text-anchor=\"middle\" fill=\"#EDEFF0\">2</text>\n<text x=\"312\" y=\"67\" font-size=\"11.5\" fill=\"#666D72\">← next to insert</text>\n</g>\n<line x1=\"30\" y1=\"96\" x2=\"670\" y2=\"96\" stroke=\"#23282B\"/>\n<g font-family=\"monospace\" font-size=\"13\">\n<text x=\"40\" y=\"134\" fill=\"#666D72\">step 1:</text>\n<text x=\"120\" y=\"134\" fill=\"#9AA1A6\">7 &gt; 2, shift 7 right → [3, 5, _, 7]</text>\n<text x=\"40\" y=\"162\" fill=\"#666D72\">step 2:</text>\n<text x=\"120\" y=\"162\" fill=\"#9AA1A6\">5 &gt; 2, shift 5 right → [3, _, 5, 7]</text>\n<text x=\"40\" y=\"190\" fill=\"#666D72\">step 3:</text>\n<text x=\"120\" y=\"190\" fill=\"#9AA1A6\">3 &gt; 2, shift 3 right → [_, 3, 5, 7]</text>\n<text x=\"40\" y=\"218\" fill=\"#666D72\">step 4:</text>\n<text x=\"120\" y=\"218\" fill=\"#EDEFF0\">nothing left to compare → place 2 → [2, 3, 5, 7]</text>\n</g>\n</svg>",
              "cap": "Each shift is one comparison plus one move; a nearly-sorted array triggers almost none of them, which is why insertion sort is adaptive."
            },
            {
              "t": "worked",
              "q": "Why is insertion sort's best case O(n) rather than O(n²)?",
              "steps": [
                "The best case is an already-sorted array.",
                "For each new element, the very first comparison against the end of the sorted prefix already shows it belongs where it is — no shifting needed.",
                "That's one comparison per element, n elements, O(n) total.",
                "The O(n²) worst case comes from reversed input, where every new element has to shift past every element already placed."
              ],
              "answer": "On already-sorted input, every element needs exactly one comparison and zero shifts, giving O(n) total — the O(n²) bound only bites when elements are badly out of place, as in reverse-sorted input."
            }
          ]
        },
        {
          "title": "Merge sort and quicksort, compared",
          "blocks": [
            {
              "t": "p",
              "x": "The divide-and-conquer booklet already derives merge sort's O(n log n) from its recurrence, T(n) = 2T(n/2) + O(n), and contrasts it with quicksort's data-dependent split. It's worth restating the trade-off directly, since it's the one you'll actually make in practice: merge sort guarantees O(n log n) but needs O(n) auxiliary memory for the merge step and isn't naturally in-place; quicksort is typically faster in practice (better cache behavior, no auxiliary array) and is in-place, but degrades to O(n²) on adversarial input, such as an already-sorted array paired with a naive first-element pivot."
            },
            {
              "t": "p",
              "x": "Real quicksort implementations defend against the worst case with randomized pivot selection or median-of-three pivoting, which makes an adversarial O(n²) input vanishingly unlikely rather than impossible. Neither merge sort nor standard quicksort is stable by default — quicksort's partitioning swaps elements past each other with no memory of original order, and merge sort's merge step needs a specific tie-breaking rule (\"take from the left half on ties\") to be made stable, which many implementations skip for speed."
            },
            {
              "t": "note",
              "x": "This is why most language standard libraries use neither in pure form: Python's Timsort and Java's dual-pivot quicksort (for primitives) or Timsort (for objects) are hybrids, often falling back to insertion sort on small subarrays where its low overhead beats the asymptotically-better options, and Timsort specifically exploits already-sorted \"runs\" in real-world data to beat O(n log n) on partially-ordered input."
            }
          ]
        },
        {
          "title": "The comparison lower bound",
          "blocks": [
            {
              "t": "p",
              "x": "No comparison-based sort — one that only ever asks \"is a < b\" — can guarantee better than O(n log n) worst-case time, no matter how cleverly it's written. The argument is about information, not implementation: there are n! possible orderings of n distinct elements, and a comparison sort must distinguish all of them. Each comparison has only two outcomes, so a sequence of comparisons is a binary decision tree with at least n! leaves, one per possible ordering it must be able to output."
            },
            {
              "t": "p",
              "x": "A binary tree with n! leaves needs depth at least log₂(n!), and Stirling's approximation gives log₂(n!) = Θ(n log n). Since the depth of the tree is exactly the worst-case number of comparisons on some input, no comparison sort can do better than Θ(n log n) comparisons in the worst case — merge sort and heapsort (from the heaps booklet) both hit this bound exactly, so in the comparison model, they're worst-case optimal."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Decision tree for sorting 3 elements: every comparison sort embeds one of these</text>\n<rect x=\"310\" y=\"38\" width=\"110\" height=\"26\" fill=\"#0E1113\" stroke=\"#EDEFF0\"/><text x=\"365\" y=\"56\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">a &lt; b ?</text>\n<line x1=\"340\" y1=\"64\" x2=\"210\" y2=\"104\" stroke=\"#2E3438\"/><line x1=\"390\" y1=\"64\" x2=\"520\" y2=\"104\" stroke=\"#2E3438\"/>\n<rect x=\"160\" y=\"104\" width=\"110\" height=\"24\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"215\" y=\"121\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">b &lt; c ?</text>\n<rect x=\"470\" y=\"104\" width=\"110\" height=\"24\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"525\" y=\"121\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">a &lt; c ?</text>\n<line x1=\"185\" y1=\"128\" x2=\"110\" y2=\"166\" stroke=\"#2E3438\"/><line x1=\"245\" y1=\"128\" x2=\"320\" y2=\"166\" stroke=\"#2E3438\"/>\n<line x1=\"495\" y1=\"128\" x2=\"420\" y2=\"166\" stroke=\"#2E3438\"/><line x1=\"555\" y1=\"128\" x2=\"630\" y2=\"166\" stroke=\"#2E3438\"/>\n<g font-family=\"monospace\" font-size=\"10.5\" fill=\"#666D72\">\n<text x=\"110\" y=\"182\" text-anchor=\"middle\">a&lt;b&lt;c</text>\n<text x=\"320\" y=\"182\" text-anchor=\"middle\">a&lt;c&lt;b</text>\n<text x=\"420\" y=\"182\" text-anchor=\"middle\">c&lt;a&lt;b</text>\n<text x=\"630\" y=\"182\" text-anchor=\"middle\">b&lt;a&lt;c</text>\n</g>\n<text x=\"30\" y=\"226\" font-size=\"11.5\" fill=\"#666D72\">3! = 6 possible orderings → tree needs ≥ 6 leaves → depth ≥ log₂(6) ≈ 2.58, so ≥ 3 comparisons in the worst case.</text>\n<text x=\"30\" y=\"248\" font-size=\"11.5\" fill=\"#666D72\">The same argument at size n gives depth ≥ log₂(n!) = Θ(n log n) — the bound every comparison sort is stuck with.</text>\n</svg>",
              "cap": "Two of the six leaves are left implicit in this sketch (the branches through the missing third comparison); the point is that a tree with 6 leaves needs at least 3 levels."
            }
          ]
        },
        {
          "title": "Beating O(n log n): counting and radix sort",
          "blocks": [
            {
              "t": "p",
              "x": "The Θ(n log n) lower bound only applies to comparison-based sorts. If you know more about the keys — say, they're integers in a bounded range — you can sort without ever comparing two elements to each other, and beat the bound. Counting sort works when keys are integers from 0 to k: count how many times each value occurs, then compute running totals to know exactly where each value's block starts in the output. It runs in O(n + k) time and is stable if implemented carefully (placing equal elements in original relative order during the final pass)."
            },
            {
              "t": "p",
              "x": "Radix sort extends this to keys with many digits (or bytes) by running a stable sort (usually counting sort) once per digit position, from least significant to most significant. Because each pass is stable, the ordering established by earlier, less-significant passes is preserved by later ones — sorting by the ones digit, then the tens digit, correctly produces overall sorted order as long as the tens-digit pass doesn't scramble ties in the ones digit, which stability guarantees. For d digits and n keys, this is O(d·(n + k))."
            },
            {
              "t": "note",
              "x": "The catch is exactly what you'd expect from bypassing an information-theoretic lower bound: these aren't general-purpose. Counting sort's O(n + k) is only good when k isn't much bigger than n — sorting a million distinct 64-bit integers by counting sort would need an array of 2⁶⁴ counters, which is the reason radix sort (bounded per-digit range, not per-value range) exists at all."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check both the mechanics (tracing an algorithm) and the judgment (choosing the right one for a situation) — sorting is a rare topic where both halves get tested equally in practice."
            }
          ],
          "exercises": [
            {
              "q": "You need to sort 500 million server log entries by timestamp, and memory is tight. Which property matters most in your choice of algorithm?",
              "kind": "mc",
              "options": [
                "In-place operation, to avoid an O(n) auxiliary array",
                "Stability, since timestamps are rarely unique",
                "Being comparison-based",
                "Adaptivity to nearly-sorted input"
              ],
              "correct": 0,
              "steps": [
                "\"Memory is tight\" at 500 million entries is the dominant constraint here.",
                "Merge sort needs O(n) auxiliary memory for merging, which at this scale could be prohibitive.",
                "An in-place algorithm (quicksort, heapsort) avoids that extra allocation entirely.",
                "Stability and adaptivity are real considerations but secondary to a hard memory constraint at this scale."
              ],
              "answer": "In-place operation — at 500 million entries, an O(n) auxiliary array (as merge sort needs) could itself be a memory problem, making an in-place option like quicksort or heapsort the practical choice."
            },
            {
              "q": "Explain, without naming a specific algorithm, why no comparison-based sort can guarantee fewer than roughly n log n comparisons in the worst case.",
              "kind": "write",
              "accept": [
                "n! orderings, binary tree needs log2(n!) depth",
                "information theoretic bound from n factorial orderings",
                "decision tree with n! leaves needs depth log n factorial"
              ],
              "hint": "think about how many possible outputs there are and how much one comparison can distinguish",
              "steps": [
                "There are n! distinct orderings of n elements, and the sort must be able to produce any of them depending on input.",
                "Each comparison yields one bit of information (which of two elements is smaller), so a sequence of comparisons is a binary decision tree.",
                "To distinguish n! possible outcomes, that tree needs at least n! leaves.",
                "A binary tree with n! leaves has depth at least log₂(n!), which is Θ(n log n) by Stirling's approximation — so Θ(n log n) comparisons are unavoidable in the worst case."
              ],
              "answer": "Because a comparison sort must be able to distinguish all n! possible orderings, and each comparison only yields one bit, the decision tree describing all its possible comparison sequences needs at least log₂(n!) = Θ(n log n) depth in the worst case — no cleverness in how comparisons are chosen escapes this."
            },
            {
              "q": "You're sorting 10,000 integers, each known to be between 0 and 99. Which approach is asymptotically best?",
              "kind": "mc",
              "options": [
                "Counting sort, O(n + k) with k = 100",
                "Merge sort, O(n log n)",
                "Quicksort, O(n log n) average",
                "Insertion sort, O(n)"
              ],
              "correct": 0,
              "steps": [
                "The key range (0 to 99) is small and known in advance — a strong signal to consider a non-comparison sort.",
                "Counting sort runs in O(n + k) where k is the range size; here k = 100 is tiny next to n = 10,000.",
                "O(n + k) ≈ O(n) in this regime, beating any O(n log n) comparison sort.",
                "Insertion sort's O(n) claim only holds on nearly-sorted input, which isn't given here, so it doesn't apply."
              ],
              "answer": "Counting sort — with a range of only 100 possible values against 10,000 elements, its O(n + k) cost is effectively linear, beating every comparison-based option's O(n log n)."
            },
            {
              "q": "Radix sort applies a stable sort once per digit, least-significant digit first. What breaks if the per-digit sort isn't stable?",
              "kind": "write",
              "accept": [
                "ties get scrambled and ordering from earlier passes is lost",
                "later passes destroy the order established by earlier passes",
                "equal digits in a later pass could reorder elements that earlier passes already placed correctly"
              ],
              "hint": "think about what an unstable pass does to elements that were already correctly ordered by an earlier, less significant digit",
              "steps": [
                "Radix sort relies on each pass preserving the relative order established by all previous (less significant) passes among elements that tie on the current digit.",
                "That preservation is exactly what stability guarantees: equal elements keep their relative order.",
                "If a pass isn't stable, two elements that tie on the current digit but were correctly ordered by an earlier digit can be swapped arbitrarily.",
                "That destroys the ordering the earlier passes had already established, and the final result is no longer correctly sorted."
              ],
              "answer": "Without stability, a later digit's pass can arbitrarily reorder elements that tie on that digit — including ones that earlier, less-significant passes had already placed in correct relative order — so the accumulated ordering from previous passes gets destroyed and the final result isn't sorted."
            },
            {
              "q": "Timsort (Python's and Java's default) falls back to insertion sort for small subarrays even though insertion sort is O(n²). Why doesn't this hurt performance?",
              "steps": [
                "Big-O hides constant factors, and insertion sort's per-element overhead is much lower than merge sort's or quicksort's.",
                "For small n, the n² term itself is small in absolute value, so a low-constant O(n²) algorithm can beat a high-constant O(n log n) one.",
                "Timsort uses insertion sort only below a size threshold (commonly around 32-64 elements), where this crossover reliably favors it.",
                "Above that threshold, the O(n log n) options win as expected, since n² eventually outgrows n log n regardless of constants."
              ],
              "answer": "Below a small size threshold, insertion sort's tiny constant-factor overhead beats merge sort's or quicksort's larger constants even though its asymptotic complexity is worse — the crossover point is exactly why hybrid sorts like Timsort switch strategies by size instead of using one algorithm throughout."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Stable sort",
          "One that preserves the original relative order of elements that compare equal."
        ],
        [
          "In-place sort",
          "One that uses O(1) extra memory beyond the input array."
        ],
        [
          "Comparison-based sort",
          "One that only ever learns information by comparing pairs of elements."
        ],
        [
          "Adaptive sort",
          "One whose running time improves on input that is already partially sorted."
        ],
        [
          "Insertion sort",
          "Builds a sorted prefix by shifting each new element left past bigger ones; O(n²) worst case, O(n) best case."
        ],
        [
          "Merge sort",
          "Divide-and-conquer sort with guaranteed O(n log n) but O(n) auxiliary memory."
        ],
        [
          "Quicksort",
          "Partition-based sort, typically fast and in-place, but O(n²) on adversarial pivots."
        ],
        [
          "Pivot",
          "The element quicksort partitions the rest of the array around."
        ],
        [
          "Randomized pivot selection",
          "Choosing quicksort's pivot at random to make worst-case input vanishingly unlikely."
        ],
        [
          "Comparison lower bound",
          "The Θ(n log n) worst-case floor that applies to any comparison-based sort."
        ],
        [
          "Decision tree (sorting)",
          "A binary tree of comparison outcomes used to prove the comparison lower bound."
        ],
        [
          "Counting sort",
          "Sorts small-range integer keys in O(n + k) without comparisons."
        ],
        [
          "Radix sort",
          "Sorts multi-digit keys via repeated stable per-digit counting sort, O(d·(n + k))."
        ],
        [
          "Timsort",
          "A hybrid merge/insertion sort used by Python and Java that exploits existing sorted runs."
        ]
      ]
    },
  "greedy": {
      "title": "Greedy Algorithms",
      "blurb": "Take the locally best option at every step and never reconsider — a strategy that is sometimes provably optimal, sometimes a good-enough heuristic, and sometimes flatly wrong, and telling those apart is the whole subject.",
      "chapters": [
        {
          "title": "The greedy choice property",
          "blocks": [
            {
              "t": "p",
              "x": "A greedy algorithm builds a solution step by step, at each step making whichever choice looks best right now, and never revisiting that choice later. This is a much weaker commitment than it sounds — <em>most</em> problems don't yield to it, because the locally best choice can foreclose a better global solution. Greedy is worth learning as a first strategy precisely because it's cheap to try and easy to disprove, and disproving it (finding a counterexample) is often the fastest route to realizing a problem needs dynamic programming instead."
            },
            {
              "t": "p",
              "x": "A problem is a candidate for a correct greedy solution when it has two properties together. The <strong>greedy choice property</strong>: a globally optimal solution can be reached by making a locally optimal (greedy) choice first, then solving the remaining subproblem — the first choice is never something you'd need to undo. And <strong>optimal substructure</strong> (the same property dynamic programming relies on): an optimal solution to the whole problem contains optimal solutions to its subproblems."
            },
            {
              "t": "note",
              "x": "Optimal substructure alone is not enough — dynamic programming problems have it too, and greedy still fails on most of them. The greedy choice property is the extra, much stronger claim: that you never have to compare more than one candidate first-choice, because the locally best one is provably always safe."
            }
          ]
        },
        {
          "title": "Proving greedy correct: the exchange argument",
          "blocks": [
            {
              "t": "p",
              "x": "Because 'the greedy choice looks reasonable' is not a proof, correct greedy algorithms are usually justified with an <strong>exchange argument</strong>: take any optimal solution that does not start with the greedy choice, and show that swapping in the greedy choice produces another solution that is at least as good. If that's always possible, then some optimal solution starts with the greedy choice, so choosing it first loses nothing."
            },
            {
              "t": "p",
              "x": "The structure repeats across every correct greedy proof: assume an optimal solution O disagrees with the greedy choice g at the first step. Construct O′ by modifying O to include g instead, while keeping the rest of O's structure feasible. Argue O′ is no worse than O. Conclude greedy's first choice can always be extended to an optimal solution, then repeat the whole argument on the remaining subproblem by induction."
            },
            {
              "t": "worked",
              "q": "Sketch the exchange argument for interval scheduling's greedy rule (always pick the interval with the earliest finish time among those still compatible).",
              "steps": [
                "Suppose an optimal schedule O picks some interval i as its first interval, but the greedy choice g has an earlier finish time than i.",
                "Since g finishes no later than i, replacing i with g in O cannot conflict with any interval O picked after i — anything compatible with i (which starts no earlier than i finishes) is also compatible with g (which finishes at or before i does).",
                "So O′ = O with i swapped for g is still a valid, non-conflicting schedule, and it has exactly as many intervals as O.",
                "O′ is optimal (same size as O) and agrees with greedy's first choice — so by induction, greedy's choice at every step can be extended to an optimal solution overall."
              ],
              "answer": "Swapping the earliest-finishing interval into any optimal solution's first slot never causes a conflict (since it frees up at least as much room as whatever it replaced) and never shrinks the solution — so an optimal solution starting with greedy's choice always exists, which is exactly what the exchange argument needs to show."
            }
          ]
        },
        {
          "title": "Case study: interval scheduling",
          "blocks": [
            {
              "t": "p",
              "x": "Given a set of intervals (each with a start and finish time), interval scheduling asks for the largest possible subset of non-overlapping intervals. The greedy rule — sort by finish time, and repeatedly take the next interval whose start is no earlier than the current selection's last finish time — is optimal, by the exchange argument in the previous chapter."
            },
            {
              "t": "p",
              "x": "The rule that fails, despite looking equally reasonable, is sorting by <em>duration</em> and greedily taking the shortest intervals first: a short interval in the middle of the timeline can block two longer intervals that together would have allowed more total selections. Finish time is the correct greedy key precisely because it directly measures 'how much room does this choice leave for everything after it', which is the quantity that actually matters."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"20\" font-size=\"12.5\" fill=\"#666D72\">Greedy by earliest finish time: pick A, then D (skip overlapping B, C)</text>\n<line x1=\"40\" y1=\"200\" x2=\"660\" y2=\"200\" stroke=\"#2E3438\"/>\n<rect x=\"60\" y=\"60\" width=\"140\" height=\"26\" rx=\"4\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"130\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">A (0–3)</text>\n<rect x=\"170\" y=\"96\" width=\"180\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\" stroke-dasharray=\"3 3\"/><text x=\"260\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">B (2–7, skipped)</text>\n<rect x=\"260\" y=\"132\" width=\"140\" height=\"26\" rx=\"4\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\" stroke-dasharray=\"3 3\"/><text x=\"330\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">C (5–9, skipped)</text>\n<rect x=\"350\" y=\"60\" width=\"140\" height=\"26\" rx=\"4\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"420\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">D (3–7)</text>\n<text x=\"30\" y=\"190\" font-size=\"11\" fill=\"#666D72\">0</text><text x=\"640\" y=\"190\" font-size=\"11\" fill=\"#666D72\">time →</text>\n</svg>",
              "cap": "A finishes earliest and is taken first; D is the earliest-finishing interval compatible with A. B and C both conflict with a selected interval, regardless of their own individual merits."
            }
          ]
        },
        {
          "title": "Case study: Huffman coding",
          "blocks": [
            {
              "t": "p",
              "x": "Huffman coding builds an optimal <strong>prefix code</strong> — a binary code where no codeword is a prefix of another, which is what lets a decoder read a compressed stream unambiguously without any separators — assigning shorter codewords to more frequent symbols. The greedy construction: repeatedly take the two least-frequent remaining nodes (starting from one leaf per symbol), merge them into a new internal node whose frequency is their sum, and repeat until one tree remains."
            },
            {
              "t": "p",
              "x": "The greedy choice here is always merging the two globally least-frequent nodes, and the exchange argument is that any optimal prefix-code tree can be rearranged so its two least-frequent symbols are siblings at the deepest level — swapping two symbols at the same depth never changes the encoded length, so you lose nothing by assuming the least-frequent pair is already paired up, which is exactly what the greedy step does first."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"20\" font-size=\"12.5\" fill=\"#666D72\">Building a Huffman tree: always merge the two lowest frequencies</text>\n<circle cx=\"350\" cy=\"50\" r=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"350\" y=\"55\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">10</text>\n<line x1=\"350\" y1=\"68\" x2=\"250\" y2=\"110\" stroke=\"#2E3438\"/><line x1=\"350\" y1=\"68\" x2=\"450\" y2=\"110\" stroke=\"#2E3438\"/>\n<circle cx=\"250\" cy=\"122\" r=\"16\" fill=\"#0E1113\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/><text x=\"250\" y=\"127\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">4</text>\n<circle cx=\"450\" cy=\"122\" r=\"18\" fill=\"#0E1113\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/><text x=\"450\" y=\"127\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">6 (D)</text>\n<line x1=\"250\" y1=\"138\" x2=\"210\" y2=\"178\" stroke=\"#2E3438\"/><line x1=\"250\" y1=\"138\" x2=\"290\" y2=\"178\" stroke=\"#2E3438\"/>\n<circle cx=\"210\" cy=\"190\" r=\"14\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.1\"/><text x=\"210\" y=\"194\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\">1 (A)</text>\n<circle cx=\"290\" cy=\"190\" r=\"14\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.1\"/><text x=\"290\" y=\"194\" text-anchor=\"middle\" font-size=\"10\" fill=\"#666D72\">3 (B)</text>\n<text x=\"30\" y=\"224\" font-size=\"11.5\" fill=\"#666D72\">A and B (freq 1, 3) merge first into a freq-4 node — the two rarest symbols end up deepest.</text>\n</svg>",
              "cap": "The rarest symbols merge first and end up deepest in the tree, giving them the longest codewords — exactly the trade compression wants."
            },
            {
              "t": "note",
              "x": "A min-heap (from the heaps booklet) is the standard implementation: repeatedly pop the two smallest, push their sum, until one node remains. This makes the construction O(n log n) for n symbols."
            }
          ]
        },
        {
          "title": "When greedy fails",
          "blocks": [
            {
              "t": "p",
              "x": "The 0/1 knapsack problem — given items with weights and values and a weight capacity, choose a subset maximizing total value without exceeding capacity — is the canonical counterexample. Greedy by value-per-weight ratio can fail: a capacity-10 knapsack with items (weight 6, value 30) and two items of (weight 5, value 24) each picks the first item by ratio (5.0 vs 4.8), filling the sack for value 30, when taking both weight-5 items instead gives value 48."
            },
            {
              "t": "p",
              "x": "The reason greedy fails here but succeeds on interval scheduling is that a greedy choice in knapsack can consume capacity that a later, better combination needed — the choice isn't safe to fix in place the way interval scheduling's is, because 'leaves the most room for later' isn't well-defined along a single numeric axis (weight) that trades against a second axis (value) independently per item. This is exactly the overlapping-subproblem structure that dynamic programming, not greedy, is built to handle: the optimal choice for the remaining capacity genuinely depends on which items were already taken, not just on how much capacity remains."
            },
            {
              "t": "note",
              "x": "The <em>fractional</em> knapsack variant — where you may take a fraction of an item — is solvable greedily (by value-per-weight ratio) precisely because fractional consumption removes the all-or-nothing interaction between capacity and value that breaks the 0/1 version."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These mix constructing greedy solutions with recognizing, from structure alone, when greedy is unsafe to use."
            }
          ],
          "exercises": [
            {
              "q": "What two properties together characterize a problem where a correct greedy algorithm is possible?",
              "kind": "mc",
              "options": [
                "The greedy choice property and optimal substructure",
                "Optimal substructure and overlapping subproblems",
                "The greedy choice property and NP-hardness",
                "A polynomial-time brute force and a min-heap"
              ],
              "correct": 0,
              "steps": [
                "Optimal substructure alone (optimal solutions built from optimal sub-solutions) is shared with dynamic programming problems and isn't sufficient by itself.",
                "The extra ingredient specific to greedy is the greedy choice property: the locally best first choice is provably always extendable to a global optimum.",
                "Overlapping subproblems is actually the DP signal, and the opposite of what makes greedy safe.",
                "So it's specifically the greedy choice property plus optimal substructure together."
              ],
              "answer": "The greedy choice property (the locally best first choice is always safe) together with optimal substructure (optimal solutions are built from optimal sub-solutions) — optimal substructure alone is shared with DP and isn't enough on its own."
            },
            {
              "q": "In interval scheduling, why does sorting by finish time work but sorting by shortest duration fail?",
              "kind": "write",
              "accept": [
                "finish time measures how much room is left for later choices, duration doesn't",
                "earliest finish time leaves the most room for future intervals",
                "duration ignores where the interval sits on the timeline"
              ],
              "hint": "think about which quantity actually predicts how much room is left for subsequent choices",
              "steps": [
                "The quantity that determines how many more intervals can still fit is how early the current selection frees up the timeline — that's exactly what finish time measures.",
                "Duration says nothing about position: a short interval can still sit in the middle of the timeline and block two much more useful longer intervals on either side.",
                "An interval with the earliest finish time, by definition, leaves at least as much room for everything after it as any other choice would.",
                "So finish time is the greedy key that actually corresponds to 'leaves maximum room for later', which is the property the exchange argument needs; duration doesn't correspond to anything the proof can use."
              ],
              "answer": "Finish time directly measures how much timeline room a choice leaves for later selections, which is exactly what the exchange argument needs; duration says nothing about position on the timeline, so a short interval can still block two better ones and the exchange argument has nothing to hang onto."
            },
            {
              "q": "In Huffman coding, why must the two least-frequent symbols always end up as siblings at the deepest level of an optimal tree?",
              "kind": "write",
              "accept": [
                "swapping two same-depth symbols doesn't change total encoded length, so wlog they can be placed as the deepest pair",
                "you can always exchange symbols at the same depth without changing cost",
                "an exchange argument shows no cost is lost by pairing the two rarest symbols first"
              ],
              "hint": "think about what happens to total encoded length if you swap two symbols sitting at the same depth",
              "steps": [
                "Total encoded length is sum over symbols of (frequency × depth in the tree).",
                "Swapping two symbols that sit at the same depth doesn't change this sum at all, since both terms' depths are unchanged.",
                "So starting from any optimal tree, you can always rearrange (without changing cost) so that the two globally rarest symbols occupy the deepest level.",
                "Since the deepest level pairs up siblings, this means the two rarest symbols can always be made siblings there at no cost — which is exactly the greedy step Huffman's construction performs first."
              ],
              "answer": "Because swapping two symbols that sit at the same tree depth never changes the total encoded length, any optimal tree can be rearranged, at no cost, so the two rarest symbols occupy the deepest level as siblings — which is exactly the pairing greedy performs first."
            },
            {
              "q": "Why does greedy-by-ratio fail on 0/1 knapsack but succeed on fractional knapsack?",
              "kind": "mc",
              "options": [
                "Fractional knapsack lets you take partial items, removing the all-or-nothing interaction between weight and value that breaks 0/1",
                "0/1 knapsack has more items on average",
                "Fractional knapsack is NP-hard while 0/1 is not",
                "Greedy actually fails on both; fractional knapsack requires dynamic programming too"
              ],
              "correct": 0,
              "steps": [
                "0/1 knapsack forces an all-or-nothing choice per item — taking the highest-ratio item can consume capacity that a different combination of items would have used more valuably.",
                "Fractional knapsack removes that all-or-nothing constraint: you can always top off remaining capacity with a partial unit of the current best-ratio item, so no capacity is ever 'wasted' relative to ratio.",
                "It's actually 0/1 knapsack that is NP-hard (in general, via reduction from subset-sum-like reasoning) — fractional knapsack is easy, which is the opposite of one of the options.",
                "So the deciding factor is specifically the fractional variant's ability to take partial items, which eliminates the interaction that defeats greedy in the 0/1 case."
              ],
              "answer": "Fractional knapsack allows taking partial items, which removes the all-or-nothing interaction between an item's weight and value that makes 0/1 knapsack's greedy choices unsafe — with fractions allowed, the highest-ratio item can always be topped off exactly to capacity."
            },
            {
              "q": "You need to prove a new greedy algorithm correct. What's the standard proof technique, and what does it actually establish?",
              "kind": "write",
              "accept": [
                "exchange argument; it shows an optimal solution can always be modified to include the greedy choice without getting worse",
                "exchange argument, showing the greedy choice is always safe to make first"
              ],
              "hint": "name the technique used for interval scheduling and Huffman coding above",
              "steps": [
                "The standard technique is the exchange argument.",
                "It starts from an arbitrary optimal solution that may disagree with the greedy choice.",
                "It shows that swapping in the greedy choice produces a solution that is still optimal (no worse).",
                "This establishes that the greedy choice can always be safely made first, without ever needing to reconsider it later, which is the exact property that makes greedy correct rather than just plausible."
              ],
              "answer": "The exchange argument: starting from an arbitrary optimal solution, show that swapping in the greedy choice keeps it at least as good — establishing that the greedy choice is always safely extendable to a global optimum, which is what makes greedy provably correct rather than just a plausible heuristic."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Greedy algorithm",
          "Builds a solution by repeatedly making the locally best choice, never revisited."
        ],
        [
          "Greedy choice property",
          "A locally optimal first choice can always be extended to a globally optimal solution."
        ],
        [
          "Optimal substructure",
          "An optimal solution is built from optimal solutions to its subproblems."
        ],
        [
          "Exchange argument",
          "A proof technique swapping the greedy choice into an arbitrary optimal solution without loss."
        ],
        [
          "Interval scheduling",
          "Choosing the maximum set of non-overlapping intervals."
        ],
        [
          "Prefix code",
          "A code where no codeword is a prefix of another, enabling unambiguous decoding."
        ],
        [
          "Huffman coding",
          "A greedy algorithm building an optimal prefix code from symbol frequencies."
        ],
        [
          "0/1 knapsack",
          "Choosing a subset of items under a weight limit to maximize value; each item taken whole or not at all."
        ],
        [
          "Fractional knapsack",
          "Knapsack where partial items may be taken; solvable greedily."
        ],
        [
          "Local optimum",
          "The best choice available at the current step, without regard to the future."
        ],
        [
          "Global optimum",
          "The best possible outcome overall, across the whole problem."
        ],
        [
          "Counterexample",
          "A specific input on which a proposed algorithm gives a wrong or suboptimal answer."
        ]
      ]
    },
  "graphalgo": {
      "title": "Graph Algorithms",
      "blurb": "Traversal from the graphs booklet answers whether you can get from one node to another. This booklet is about the questions that need more than that: the cheapest way there, the cheapest way to connect everything, and how to tell two things are already connected without walking the graph to check.",
      "chapters": [
        {
          "title": "From reachability to cost",
          "blocks": [
            {
              "t": "p",
              "x": "BFS and DFS, covered in the graphs booklet, answer reachability and shortest-hop-count questions on unweighted graphs: is there a path, and how many edges is the shortest one. The moment edges carry weights — distance, latency, price — hop count stops being what you care about, and a plain BFS queue stops being the right tool, because the cheapest path is not necessarily the one with the fewest edges."
            },
            {
              "t": "p",
              "x": "What changes is the order of expansion. BFS expands nodes in the order it discovers them, level by level, which is correct precisely because every edge costs the same — one hop. With weighted edges, the frontier has to be expanded in order of accumulated cost instead, always picking whichever discovered-but-not-yet-settled node is currently cheapest to reach. That reordering is exactly what a priority queue gives you, which is why every shortest-path algorithm in this booklet leans on the heaps booklet's structure."
            },
            {
              "t": "note",
              "x": "One assumption underlies almost everything below until the next chapter: edge weights are non-negative. A single negative edge can make a path that revisits nodes cheaper than any simple path, which breaks the “once settled, done” argument the next section relies on."
            }
          ]
        },
        {
          "title": "Dijkstra's algorithm",
          "blocks": [
            {
              "t": "p",
              "x": "Dijkstra's algorithm finds shortest paths from a single source to every other node. It keeps a tentative distance for every node (infinity until discovered, then updated downward as shorter paths are found — that update is called relaxation), and a priority queue of discovered-but-unsettled nodes keyed by tentative distance. Each step pops the cheapest unsettled node, marks it settled, and relaxes every edge leaving it: for each neighbour, if the distance through the just-settled node is shorter than what's currently recorded, update it and push the improved distance."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 700 320' xmlns='http://www.w3.org/2000/svg'>\n<text x='30' y='24' font-size='12.5' fill='#666D72'>Dijkstra from A: settle the closest unsettled node, relax its edges, repeat</text>\n<line x1='110' y1='170' x2='260' y2='90' stroke='#EDEFF0' stroke-width='1.6'/>\n<line x1='260' y1='90' x2='260' y2='250' stroke='#EDEFF0' stroke-width='1.6'/>\n<line x1='260' y1='250' x2='470' y2='90' stroke='#EDEFF0' stroke-width='1.6'/>\n<line x1='260' y1='250' x2='470' y2='250' stroke='#EDEFF0' stroke-width='1.6'/>\n<line x1='110' y1='170' x2='260' y2='250' stroke='#3A4145' stroke-width='1.4' stroke-dasharray='5 4'/>\n<line x1='260' y1='90' x2='470' y2='90' stroke='#3A4145' stroke-width='1.4' stroke-dasharray='5 4'/>\n<text x='168' y='118' font-size='11.5' fill='#9AA1A6'>1</text>\n<text x='240' y='170' font-size='11.5' fill='#9AA1A6'>1</text>\n<text x='355' y='158' font-size='11.5' fill='#9AA1A6'>5</text>\n<text x='355' y='266' font-size='11.5' fill='#9AA1A6'>2</text>\n<text x='168' y='224' font-size='11' fill='#666D72'>4</text>\n<text x='355' y='84' font-size='11' fill='#666D72'>8</text>\n<circle cx='110' cy='170' r='24' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/>\n<text x='110' y='166' text-anchor='middle' font-size='13' fill='#EDEFF0'>A</text>\n<text x='110' y='183' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>dist 0</text>\n<circle cx='260' cy='90' r='24' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/>\n<text x='260' y='86' text-anchor='middle' font-size='13' fill='#EDEFF0'>C</text>\n<text x='260' y='103' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>dist 1</text>\n<circle cx='260' cy='250' r='24' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/>\n<text x='260' y='246' text-anchor='middle' font-size='13' fill='#EDEFF0'>B</text>\n<text x='260' y='263' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>dist 2</text>\n<circle cx='470' cy='90' r='24' fill='#0E1113' stroke='#666D72' stroke-width='1.4'/>\n<text x='470' y='86' text-anchor='middle' font-size='13' fill='#9AA1A6'>D</text>\n<text x='470' y='103' text-anchor='middle' font-size='10.5' fill='#666D72'>dist 7</text>\n<circle cx='470' cy='250' r='24' fill='#0E1113' stroke='#666D72' stroke-width='1.4'/>\n<text x='470' y='246' text-anchor='middle' font-size='13' fill='#9AA1A6'>E</text>\n<text x='470' y='263' text-anchor='middle' font-size='10.5' fill='#666D72'>dist 4</text>\n<text x='30' y='300' font-size='12' fill='#666D72'>Solid edges: the shortest-path tree Dijkstra builds. Dashed edges (A–B, C–D): never the cheapest way in.</text>\n</svg>",
              "cap": "Popped in order A, C, B, E, D. Each pop is final: nothing left in the queue can offer a cheaper way to reach it."
            },
            {
              "t": "p",
              "x": "The correctness argument is short once you see it: when a node is popped, it has the smallest tentative distance of anything remaining in the queue. Because all edge weights are non-negative, no path through a node still in the queue could possibly be cheaper — extending any of those paths can only add more cost, never subtract. So the popped node's distance cannot be improved later, and it's safe to call it settled for good. This is the same shape of argument the greedy booklet calls an exchange argument: showing that the locally best choice can never be beaten by waiting."
            },
            {
              "t": "p",
              "x": "With a binary heap, Dijkstra runs in O((V + E) log V): each of the E edges can trigger one push, each push/pop on the heap costs O(log V). Two things worth knowing outside the happy path: the moment any edge weight is negative, the settled-is-final argument above simply stops holding, and Dijkstra can return wrong answers without any error or warning; and a naive re-run of Dijkstra from every node to get all-pairs shortest paths costs O(V·(V+E) log V), which is usually worse than a dedicated all-pairs algorithm on dense graphs."
            },
            {
              "t": "worked",
              "q": "In the figure above, walk the relaxation that produces E's final distance of 4.",
              "steps": [
                "A is popped first (distance 0), relaxing A–C (1) and A–B (4). Tentative: C=1, B=4.",
                "C is popped next (distance 1, the smallest remaining). Relaxing C–B: 1 + 1 = 2, which beats B's current 4, so B updates to 2.",
                "B is popped (distance 2, now the smallest remaining). Relaxing B–E: 2 + 2 = 4. E had no prior tentative distance, so it's set to 4.",
                "E is popped (distance 4); it has no outgoing edges to relax further in this graph.",
                "D is popped last, at distance 7, via B–D (2 + 5), since C–D (1 + 8 = 9) was worse."
              ],
              "answer": "E = 4, via A→C→B→E (1 + 1 + 2). B's distance was revised down from 4 to 2 before E was ever reached, which is why relaxation — not just recording the first path found — is the part that makes the algorithm correct."
            }
          ]
        },
        {
          "title": "When weights go negative: Bellman-Ford and A*",
          "blocks": [
            {
              "t": "p",
              "x": "Bellman-Ford drops the non-negative-weight assumption at the cost of speed. Instead of always expanding the cheapest frontier node, it simply relaxes every edge in the graph, V−1 times over. That number of rounds is enough because a shortest simple path visits at most V−1 edges, and each full round guarantees at least one more edge's worth of the true shortest path has propagated. Running time is O(V·E) — much worse than Dijkstra's O((V+E) log V), but correct in the presence of negative edges."
            },
            {
              "t": "p",
              "x": "Bellman-Ford also detects negative cycles for free: run one extra round of relaxation after the V−1 are done, and if any distance still improves, a negative cycle is reachable from the source. That detection matters because a negative cycle makes “shortest path” meaningless — you could loop the cycle forever, reducing the total cost without bound, so no finite shortest path exists at all."
            },
            {
              "t": "p",
              "x": "A* takes the opposite approach: instead of relaxing the non-negative-weight restriction, it uses extra knowledge to beat Dijkstra's speed on a single source-to-target query. It's still a priority-queue search, but the priority is f(n) = g(n) + h(n): the cost so far, g(n), plus a heuristic estimate h(n) of the remaining cost to the target. Set h to zero everywhere and A* is exactly Dijkstra; a good heuristic instead steers the search toward the target early, exploring far fewer nodes. The one requirement is that h never overestimate the true remaining cost (admissibility) — an overconfident heuristic can make A* skip over the actual shortest path. Straight-line distance is the standard admissible heuristic for road networks and grid games, since no real route is ever shorter than a straight line."
            }
          ]
        },
        {
          "title": "Minimum spanning trees",
          "blocks": [
            {
              "t": "p",
              "x": "A different problem, same weighted-graph setting: given a connected graph, find the cheapest set of edges that keeps every node connected. That set is always a tree — exactly V−1 edges, no cycles, since any cycle could drop its most expensive edge and still leave everything connected for less. This is the minimum spanning tree (MST), and unlike shortest paths, it optimizes total edge weight across the whole graph rather than distance from one source."
            },
            {
              "t": "p",
              "x": "Kruskal's algorithm builds an MST greedily by weight, globally: sort every edge by weight, then walk the sorted list adding each edge unless it would connect two nodes already connected by edges already chosen (which would create a cycle). Stop once V−1 edges have been added. The greedy choice is provably safe by the cut property: for any partition of the nodes into two groups, the cheapest edge crossing that partition belongs in some MST — the same exchange-argument style of proof the greedy booklet uses for interval scheduling, applied here to edge weight instead of finish time."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 700 340' xmlns='http://www.w3.org/2000/svg'>\n<text x='30' y='24' font-size='12.5' fill='#666D72'>Kruskal: sort edges by weight, add each one unless it closes a cycle</text>\n<line x1='350' y1='70' x2='540' y2='170' stroke='#EDEFF0' stroke-width='1.8'/>\n<line x1='540' y1='170' x2='450' y2='300' stroke='#EDEFF0' stroke-width='1.8'/>\n<line x1='450' y1='300' x2='250' y2='300' stroke='#EDEFF0' stroke-width='1.8'/>\n<line x1='250' y1='300' x2='160' y2='170' stroke='#EDEFF0' stroke-width='1.8'/>\n<line x1='160' y1='170' x2='350' y2='70' stroke='#3A4145' stroke-width='1.4' stroke-dasharray='5 4'/>\n<line x1='350' y1='70' x2='450' y2='300' stroke='#3A4145' stroke-width='1.4' stroke-dasharray='5 4'/>\n<line x1='540' y1='170' x2='160' y2='170' stroke='#3A4145' stroke-width='1.4' stroke-dasharray='5 4'/>\n<text x='430' y='112' font-size='11.5' fill='#9AA1A6'>2</text>\n<text x='510' y='240' font-size='11.5' fill='#9AA1A6'>3</text>\n<text x='345' y='320' font-size='11.5' fill='#9AA1A6'>1</text>\n<text x='190' y='240' font-size='11.5' fill='#9AA1A6'>5</text>\n<text x='240' y='112' font-size='11' fill='#666D72'>7</text>\n<text x='390' y='222' font-size='11' fill='#666D72'>4 — skipped, cycle</text>\n<text x='330' y='168' font-size='11' fill='#666D72'>6</text>\n<circle cx='350' cy='70' r='22' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/><text x='350' y='75' text-anchor='middle' font-size='13' fill='#EDEFF0'>P</text>\n<circle cx='540' cy='170' r='22' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/><text x='540' y='175' text-anchor='middle' font-size='13' fill='#EDEFF0'>Q</text>\n<circle cx='450' cy='300' r='22' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/><text x='450' y='305' text-anchor='middle' font-size='13' fill='#EDEFF0'>R</text>\n<circle cx='250' cy='300' r='22' fill='#20272B' stroke='#EDEFF0' stroke-width='1.6'/><text x='250' y='305' text-anchor='middle' font-size='13' fill='#EDEFF0'>S</text>\n<circle cx='160' cy='170' r='22' fill='#0E1113' stroke='#666D72' stroke-width='1.4'/><text x='160' y='175' text-anchor='middle' font-size='13' fill='#9AA1A6'>T</text>\n<text x='30' y='334' font-size='12' fill='#666D72'>Order taken: R–S(1), P–Q(2), Q–R(3), S–T(5) — 4 edges, tree complete. P–R(4) skipped: P and R already connected.</text>\n</svg>",
              "cap": "Edges taken in weight order 1, 2, 3, 5; the weight-4 edge is skipped because P and R are already connected through Q and S."
            },
            {
              "t": "p",
              "x": "Prim's algorithm reaches the same optimal total weight from a different angle: start from any single node, and repeatedly add the cheapest edge that connects the growing tree to a node not yet in it — structurally the same priority-queue-driven growth as Dijkstra, just keyed on raw edge weight instead of accumulated path distance. Kruskal tends to win on sparse graphs (its cost is dominated by sorting E edges); Prim tends to win on dense graphs, where a good priority-queue implementation keeps it close to O(E log V) without ever needing to sort every edge up front."
            }
          ]
        },
        {
          "title": "Union-find: near-constant connectivity queries",
          "blocks": [
            {
              "t": "p",
              "x": "Kruskal's cycle check — “are these two endpoints already connected?” — is exactly the question a disjoint-set (union-find) structure answers fast. It supports two operations: find(x), which returns a representative id for x's set, and union(x, y), which merges the sets containing x and y. Two edges belong to the same component exactly when find gives them the same representative, which is why Kruskal calls find twice per candidate edge instead of re-running a traversal to check connectivity."
            },
            {
              "t": "p",
              "x": "Implemented naively — each node points to a parent, union just re-points one root at the other — a long chain of unions can degrade find to O(n) per call, no better than the traversal it was meant to avoid. Two independent optimizations fix this. Union by rank (or by size) always attaches the smaller tree under the bigger one's root, keeping trees shallow. Path compression makes every node visited during a find point directly at the root afterward, flattening the structure as a side effect of just answering the query."
            },
            {
              "t": "p",
              "x": "Together, the two optimizations bring the amortized cost per operation down to O(α(n)), where α is the inverse Ackermann function — a function that grows so slowly it is under 5 for any n you could ever construct in practice. That is the near-constant-time bound Kruskal relies on: sorting the edges costs O(E log E), and the E union-find operations that follow add only a lower-order O(E α(V)) on top."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These mix tracing the algorithms by hand with recognizing which one a situation actually calls for — the two skills that matter more than memorizing pseudocode."
            }
          ],
          "exercises": [
            {
              "q": "A graph has all non-negative edge weights. Which statement about Dijkstra's algorithm is correct?",
              "kind": "mc",
              "options": [
                "It still works correctly if exactly one edge is negative, as long as there's no negative cycle",
                "Once a node is popped from the priority queue, its distance is final and can never be improved later",
                "Dijkstra visits every edge in the graph exactly once, regardless of the weights",
                "Dijkstra requires the graph to be acyclic (a DAG) to produce correct answers"
              ],
              "correct": 1,
              "steps": [
                "A single negative edge can break the settled-is-final argument even without forming a full negative cycle, so option A is false.",
                "Dijkstra works on graphs with cycles just fine — that's exactly what 'settled, never revisited' is for; DAG-only is a restriction Dijkstra doesn't have, so option D is false.",
                "Edges leaving unsettled nodes can be relaxed multiple times as better paths are found, so 'exactly once' (option C) is false in general.",
                "Option B is the actual correctness property: once popped, a node's tentative distance is provably final, because everything remaining in the queue is at least as far and non-negative weights mean no detour through them could ever help."
              ],
              "answer": "Once a node is popped from the priority queue, its distance is final — that invariant is the entire correctness argument for Dijkstra, and it depends completely on non-negative weights."
            },
            {
              "q": "Why does Bellman-Ford need exactly V−1 rounds of relaxing every edge, no more, to guarantee correct shortest distances?",
              "kind": "write",
              "accept": [
                "a shortest simple path has at most v-1 edges",
                "longest possible shortest path has v-1 edges so v-1 rounds propagate it fully"
              ],
              "hint": "think about the longest a shortest path could possibly be, in terms of edges",
              "steps": [
                "A simple path (no repeated nodes) through a graph with V nodes can use at most V−1 edges — it can't visit more nodes than the graph has.",
                "Any true shortest path is simple: a cycle in it could only be removed to make it shorter (or, with non-negative cycles, no shorter, but never worse), so an actual shortest path never needs more than V−1 edges.",
                "Each full round of relaxing every edge is guaranteed to correctly extend the known-shortest-path prefix by at least one more edge.",
                "So after V−1 rounds, every shortest path — even the longest possible one, at V−1 edges — has been fully propagated."
              ],
              "answer": "Because a shortest simple path can have at most V−1 edges (it can't revisit a node with non-negative-cycle graphs), and each relaxation round is enough to correctly extend the known prefix by one more edge — so V−1 rounds cover even the longest possible shortest path."
            },
            {
              "q": "An admissible A* heuristic must never do what?",
              "kind": "mc",
              "options": [
                "Return zero for the goal node",
                "Underestimate the true remaining cost to the goal",
                "Overestimate the true remaining cost to the goal",
                "Change value as the search progresses"
              ],
              "correct": 2,
              "steps": [
                "Admissibility is specifically a one-directional guarantee: the heuristic must never claim a node is farther from being cheap to reach than it actually is in the wrong direction — overestimating.",
                "Underestimating is allowed, and is in fact what makes A* different from plain Dijkstra: h=0 everywhere (which trivially never overestimates) reduces A* to Dijkstra exactly.",
                "Returning zero at the goal is required for f(n) at the goal to equal the true cost g(n), not forbidden.",
                "A heuristic is normally fixed per search, but the defining property tested here is the overestimate rule, not whether it could vary."
              ],
              "answer": "It must never overestimate the true remaining cost — an overconfident heuristic can make A* discard a node that was actually on the true shortest path."
            },
            {
              "q": "Kruskal's algorithm calls find(x) and find(y) for every candidate edge (x, y) before deciding whether to add it. What is that call checking?",
              "kind": "write",
              "accept": [
                "whether x and y are already in the same connected component",
                "whether adding the edge would create a cycle",
                "if they're already connected"
              ],
              "hint": "it's the cycle check, phrased as a connectivity question",
              "steps": [
                "An edge creates a cycle exactly when its two endpoints are already reachable from each other through edges already chosen.",
                "find(x) and find(y) return each node's current component representative.",
                "If find(x) equals find(y), x and y are already in the same component — adding this edge would close a cycle, so it's skipped.",
                "If they differ, the edge safely merges two previously separate components, and union(x, y) is called to record that merge."
              ],
              "answer": "Whether x and y are already in the same connected component — if they are, this edge would close a cycle and gets skipped; if not, it safely merges two components."
            },
            {
              "q": "A dense graph (E close to V²) needs repeated shortest-path queries between many pairs of nodes, all with non-negative weights. Rank Dijkstra-per-source, Bellman-Ford-per-source, and Prim's algorithm by how appropriate each is here, and say why Prim doesn't belong in the comparison at all.",
              "kind": "write",
              "accept": [
                "dijkstra best then bellman ford prim doesn't apply it solves a different problem",
                "dijkstra fastest bellman ford correct but slower prim solves mst not shortest path"
              ],
              "hint": "one of the three algorithms doesn't answer a shortest-path question at all",
              "steps": [
                "Dijkstra-per-source is the right tool here: non-negative weights are given, and Dijkstra is the fastest correct algorithm for that case, at O((V+E) log V) per source.",
                "Bellman-Ford-per-source would also give correct answers but at O(V·E) per source — strictly worse, since it exists to handle negative weights this graph doesn't have.",
                "Prim's algorithm doesn't belong in a shortest-path comparison at all: it solves a different problem, minimum spanning tree, which minimizes total edge weight to connect everything, not distance between specific pairs."
              ],
              "answer": "Dijkstra-per-source is the appropriate choice; Bellman-Ford-per-source would also be correct but strictly slower since its extra generality (negative weights) isn't needed here. Prim doesn't belong in the comparison because it solves minimum spanning tree, a different problem from shortest paths between pairs."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Relaxation",
          "Updating a node's tentative distance when a shorter path to it is found."
        ],
        [
          "Dijkstra's algorithm",
          "Single-source shortest paths on non-negative weights via a priority queue keyed by distance."
        ],
        [
          "Settled node",
          "A node whose shortest distance is proven final and won't be revisited."
        ],
        [
          "Bellman-Ford",
          "Shortest paths that tolerate negative edges by relaxing every edge V−1 times."
        ],
        [
          "Negative cycle",
          "A cycle whose total weight is negative, making shortest path undefined around it."
        ],
        [
          "A* search",
          "Priority-queue search using cost-so-far plus a heuristic estimate to the goal."
        ],
        [
          "Admissible heuristic",
          "One that never overestimates the true remaining cost to the goal."
        ],
        [
          "Minimum spanning tree",
          "The cheapest set of V−1 edges connecting every node with no cycles."
        ],
        [
          "Kruskal's algorithm",
          "Builds an MST by adding edges in weight order, skipping ones that close a cycle."
        ],
        [
          "Prim's algorithm",
          "Builds an MST by growing one tree, always adding the cheapest edge leaving it."
        ],
        [
          "Cut property",
          "For any partition of nodes, the cheapest crossing edge belongs in some MST."
        ],
        [
          "Union-find (disjoint-set)",
          "A structure supporting find(representative) and union(merge two sets)."
        ],
        [
          "Path compression",
          "Re-pointing visited nodes directly at the root during find, flattening the structure."
        ],
        [
          "Union by rank",
          "Always attaching the smaller tree's root under the bigger one's, keeping trees shallow."
        ],
        [
          "Amortized complexity",
          "Average cost per operation over a whole sequence, even if individual calls vary."
        ]
      ]
    },
  "searching": {
      "title": "Binary Search",
      "blurb": "Halving a sorted search space each step is the first genuinely logarithmic idea most people meet — and, because the boundary conditions are so easy to get subtly wrong, probably the algorithm most frequently implemented incorrectly on a first try.",
      "chapters": [
        {
          "title": "The invariant that makes it work",
          "blocks": [
            {
              "t": "p",
              "x": "Binary search maintains a range [lo, hi] that is guaranteed, as an invariant, to contain the answer if it exists at all. Each step looks at mid, the midpoint of the range, compares it against the target, and shrinks the range to whichever half could still contain the answer — throwing away the other half entirely, because sortedness guarantees it can't hold the target. That single fact — provably safe to discard half the remaining space every step — is the entire algorithm; everything else is bookkeeping."
            },
            {
              "t": "p",
              "x": "The loop keeps going while the range is non-empty (commonly written while lo <= hi), computing mid = lo + (hi − lo) / 2 each time rather than (lo + hi) / 2 — the second form can overflow lo + hi in languages with fixed-width integers when both are large, even though the two are mathematically identical. If a[mid] equals the target, the search is done. If a[mid] is too small, the target (if present) must be to the right, so lo becomes mid + 1. If a[mid] is too large, hi becomes mid − 1."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 700 300' xmlns='http://www.w3.org/2000/svg'>\n<text x='30' y='24' font-size='12.5' fill='#666D72'>Searching for 13 in a sorted 16-element array (indices 0–15)</text>\n<line x1='60' y1='80' x2='640' y2='80' stroke='#2E3438' stroke-width='2'/>\n<line x1='60' y1='80' x2='640' y2='80' stroke='#EDEFF0' stroke-width='4'/>\n<circle cx='350' cy='80' r='5' fill='#EDEFF0'/>\n<text x='350' y='64' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>mid=7</text>\n<text x='55' y='102' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>lo=0</text>\n<text x='645' y='102' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>hi=15</text>\n<text x='350' y='118' text-anchor='middle' font-size='11' fill='#666D72'>a[7] &lt; 13 — discard left half, lo→8</text>\n<line x1='60' y1='160' x2='640' y2='160' stroke='#2E3438' stroke-width='2'/>\n<line x1='350' y1='160' x2='640' y2='160' stroke='#EDEFF0' stroke-width='4'/>\n<circle cx='494' cy='160' r='5' fill='#EDEFF0'/>\n<text x='494' y='144' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>mid=11</text>\n<text x='352' y='182' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>lo=8</text>\n<text x='645' y='182' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>hi=15</text>\n<text x='494' y='198' text-anchor='middle' font-size='11' fill='#666D72'>a[11] &lt; 13 — discard left half, lo→12</text>\n<line x1='60' y1='240' x2='640' y2='240' stroke='#2E3438' stroke-width='2'/>\n<line x1='494' y1='240' x2='640' y2='240' stroke='#EDEFF0' stroke-width='4'/>\n<circle cx='566' cy='240' r='6' fill='#EDEFF0' stroke='#EDEFF0'/>\n<text x='566' y='224' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>mid=13</text>\n<text x='496' y='262' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>lo=12</text>\n<text x='645' y='262' text-anchor='middle' font-size='10.5' fill='#9AA1A6'>hi=15</text>\n<text x='566' y='278' text-anchor='middle' font-size='11' fill='#666D72'>a[13] = 13 — found, 3 comparisons for 16 elements</text>\n</svg>",
              "cap": "Each comparison halves the remaining range; 16 elements take at most 4 comparisons (⌈log₂16⌉), and this example finds its target in 3."
            },
            {
              "t": "note",
              "x": "The invariant only holds because the array is sorted. Binary search on unsorted data doesn't fail loudly — it silently returns wrong or missing results, because the “discard half” step is unsound the moment sortedness is violated."
            }
          ]
        },
        {
          "title": "Off-by-one errors, four ways to get them",
          "blocks": [
            {
              "t": "p",
              "x": "Binary search has a reputation for being easy to describe and hard to implement correctly, and the reputation is earned: a 1988 study found the majority of published binary search implementations, including ones in respected textbooks, had bugs at the boundaries. Four spots cause almost all of them."
            },
            {
              "t": "list",
              "items": [
                "<strong>Loop condition</strong>: <code>lo &lt;= hi</code> versus <code>lo &lt; hi</code> changes whether a single-element range is still searched or skipped.",
                "<strong>Update after a miss</strong>: forgetting the ±1 (writing <code>lo = mid</code> instead of <code>lo = mid + 1</code>) can leave the range unchanged and loop forever.",
                "<strong>Midpoint rounding</strong>: with integer division, <code>(lo+hi)/2</code> rounds down, which matters for which half a tie lands in when writing <code>lower_bound</code>/<code>upper_bound</code> variants.",
                "<strong>Half-open versus closed ranges</strong>: mixing a <code>[lo, hi)</code> convention with <code>[lo, hi]</code> logic borrowed from another implementation is the single most common source of copy-paste bugs."
              ]
            },
            {
              "t": "p",
              "x": "The most reliable fix is consistency of convention, not cleverness: pick either a closed range [lo, hi] or a half-open range [lo, hi) for a given implementation, and never mix the update rules from one convention into a loop written for the other."
            }
          ]
        },
        {
          "title": "lower_bound and upper_bound",
          "blocks": [
            {
              "t": "p",
              "x": "Plain binary search answers “is the target present.” A more generally useful pair of variants answers “where would it go”: lower_bound(x) returns the index of the first element that is not less than x (the leftmost valid insertion point that keeps the array sorted), and upper_bound(x) returns the index of the first element strictly greater than x (the rightmost valid insertion point). When x is present with duplicates, everything from lower_bound(x) up to but not including upper_bound(x) is exactly the run of elements equal to x — so upper_bound(x) − lower_bound(x) is the count of x in the array, computed in O(log n) without ever scanning that run."
            },
            {
              "t": "p",
              "x": "The implementation trick that makes both variants easy to get right: instead of a three-way comparison (less/equal/greater) with three branches, use a single boolean predicate — “is a[mid] < x” for lower_bound, “is a[mid] <= x” for upper_bound — and always move toward the boundary where the predicate flips from true to false. This collapses the four boundary bugs above into a single, mechanically checkable loop shape, and it's the same shape the next section generalizes further."
            }
          ]
        },
        {
          "title": "Binary search on the answer",
          "blocks": [
            {
              "t": "p",
              "x": "The predicate-boundary idea from lower_bound doesn't require an array at all — it generalizes to any monotonic predicate over a range of candidate answers: a function feasible(x) that is false for every x below some threshold and true for every x at or above it, with no exceptions in between. Binary search finds that threshold directly, without ever materializing the full list of candidates."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 700 260' xmlns='http://www.w3.org/2000/svg'>\n<text x='30' y='24' font-size='12.5' fill='#666D72'>Binary search on the answer: smallest integer x with x² ≥ 200</text>\n<line x1='60' y1='110' x2='650' y2='110' stroke='#666D72' stroke-width='3' stroke-dasharray='2 5'/>\n<line x1='60' y1='110' x2='419' y2='110' stroke='#3A4145' stroke-width='4'/>\n<line x1='419' y1='110' x2='650' y2='110' stroke='#EDEFF0' stroke-width='4'/>\n<line x1='419' y1='86' x2='419' y2='134' stroke='#EDEFF0' stroke-width='1.6'/>\n<text x='419' y='72' text-anchor='middle' font-size='12' fill='#EDEFF0'>x=15 — boundary</text>\n<text x='230' y='150' text-anchor='middle' font-size='12' fill='#9AA1A6'>false region: x² &lt; 200 (x ≤ 14)</text>\n<text x='540' y='150' text-anchor='middle' font-size='12' fill='#EDEFF0'>true region: x² ≥ 200 (x ≥ 15)</text>\n<circle cx='355' cy='190' r='5' fill='#666D72'/><text x='355' y='210' text-anchor='middle' font-size='11' fill='#666D72'>probe x=10, false</text>\n<circle cx='483' cy='190' r='5' fill='#EDEFF0'/><text x='483' y='210' text-anchor='middle' font-size='11' fill='#9AA1A6'>probe x=17, true</text>\n<circle cx='419' cy='230' r='6' fill='#EDEFF0'/><text x='419' y='250' text-anchor='middle' font-size='11.5' fill='#EDEFF0'>narrows to x=15, the smallest true</text>\n</svg>",
              "cap": "feasible(x) = “x² ≥ 200” is false up to x=14 and true from x=15 on, with no candidate in between where it flips back — exactly the monotonicity binary search needs."
            },
            {
              "t": "p",
              "x": "This pattern shows up constantly once you're looking for it: “what is the minimum number of days to ship all packages” (feasible(d) = can this capacity finish in d days — monotonic in capacity), “what is the smallest maximum value after splitting an array into k parts” (feasible(m) = can we split into ≤ k parts each summing to at most m). In every case, the win is the same: turning an optimization problem into repeated yes/no feasibility checks, each of which is often much easier to write than the optimization directly, then binary-searching the boundary between no and yes."
            },
            {
              "t": "worked",
              "q": "feasible(x) checks x³ ≥ 1000. Trace binary search over integers 0..20 for the smallest feasible x.",
              "steps": [
                "lo=0, hi=20, mid=10: 10³=1000 ≥ 1000, feasible → answer could be 10 or smaller, hi=10.",
                "lo=0, hi=10, mid=5: 5³=125 < 1000, not feasible → answer is above 5, lo=6.",
                "lo=6, hi=10, mid=8: 8³=512 < 1000, not feasible → lo=9.",
                "lo=9, hi=10, mid=9: 9³=729 < 1000, not feasible → lo=10.",
                "lo=10, hi=10: range has one element left, x=10, which is feasible (10³=1000) — that's the answer."
              ],
              "answer": "10 — the boundary is exact here since 10³ = 1000 precisely, and 9³ = 729 falls short."
            }
          ]
        },
        {
          "title": "Rotated arrays and other non-obvious spaces",
          "blocks": [
            {
              "t": "p",
              "x": "A sorted array that's been rotated (the tail moved to the front, as if cut and swapped: e.g. [4,5,6,7,0,1,2]) is no longer globally sorted, so a plain binary search comparison against the target doesn't directly tell you which half to keep. The fix keeps the same halving structure but adds one extra check per step: at least one of the two halves [lo, mid] or [mid, hi] is always properly sorted (a rotation can only break sortedness at one seam), so check which half is sorted first, then check whether the target falls inside that sorted half's range — if it does, recurse there; if not, the target must be in the other half."
            },
            {
              "t": "p",
              "x": "Binary search also extends to two dimensions when the structure is right: a matrix sorted along both rows and columns admits an O(m + n) staircase search (start at a corner and eliminate a full row or column each step) that's actually not binary search at all, but a matrix where every row is fully sorted and each row's first element exceeds the previous row's last — effectively one long sorted array reshaped — reduces cleanly to a single binary search over m·n virtual positions, converting a 2D index back to (row, col) with division and modulo."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These mix tracing the boundary logic by hand with recognizing when a problem is secretly a monotonic-predicate search in disguise."
            }
          ],
          "exercises": [
            {
              "q": "Why is mid = lo + (hi − lo) / 2 preferred over mid = (lo + hi) / 2, given that they compute the same value mathematically?",
              "kind": "mc",
              "options": [
                "The second form is slower because it does an extra subtraction",
                "The second form can overflow fixed-width integers when lo and hi are both large",
                "The first form works on floating-point arrays and the second doesn't",
                "There's no real difference; it's purely a matter of style"
              ],
              "correct": 1,
              "steps": [
                "Both forms are algebraically identical over the reals, so the difference isn't in what they compute — it's in fixed-width integer arithmetic.",
                "lo + hi can exceed the maximum representable integer even when both lo and hi individually fit comfortably, causing silent overflow.",
                "lo + (hi − lo) never adds two large same-sign values together — the subtraction keeps the intermediate small — so it avoids that overflow.",
                "The first form does one more subtraction than the second, which makes option A backwards, not a reason to prefer the second."
              ],
              "answer": "The second form can silently overflow when lo and hi are both large, even though the values individually fit in the integer type — the first form avoids ever summing two large numbers."
            },
            {
              "q": "An array has three copies of the value 7. What does upper_bound(7) − lower_bound(7) equal, and why?",
              "kind": "write",
              "accept": [
                "3",
                "three, the count of matching elements"
              ],
              "hint": "think about what range of indices the two bounds mark off",
              "steps": [
                "lower_bound(7) is the index of the first element not less than 7 — the leftmost 7.",
                "upper_bound(7) is the index of the first element strictly greater than 7 — one past the rightmost 7.",
                "The half-open range [lower_bound(7), upper_bound(7)) covers exactly the run of elements equal to 7.",
                "Its length, upper_bound(7) − lower_bound(7), is therefore the count of 7s: 3."
              ],
              "answer": "3 — the two bounds mark off exactly the half-open range containing every element equal to 7, so their difference is the count."
            },
            {
              "q": "To binary-search “on the answer,” what property must the predicate feasible(x) have across the candidate range?",
              "kind": "mc",
              "options": [
                "It must be true for exactly one value of x",
                "It must be computable in O(1) time",
                "It must be monotonic: false for a prefix of the range, then true for the rest, with no value where it flips back",
                "It must be the inverse of a sorting comparator"
              ],
              "correct": 2,
              "steps": [
                "Binary search on the answer doesn't require a unique feasible x — many values can be feasible, as in the x² ≥ 200 example, where every x ≥ 15 works.",
                "Fast evaluation of feasible(x) helps performance but isn't the structural requirement that makes binary search valid here.",
                "The one property that makes halving safe is monotonicity — once feasible(x) turns true, it must stay true for every larger x in the search range, with no later flip back to false.",
                "'Inverse of a sorting comparator' isn't a meaningful requirement for this technique."
              ],
              "answer": "Monotonicity: feasible(x) must be false for every x below some threshold and true for every x at or above it, with no exceptions — that's what makes discarding half the range safe."
            },
            {
              "q": "A sorted, rotated array is searched for a target. At the current step, the left half [lo, mid] turns out to be sorted, but the target is smaller than a[lo] and larger than a[mid]. Which half should the search continue in?",
              "kind": "write",
              "accept": [
                "the right half mid to hi",
                "right half, since it can't be in the sorted left half"
              ],
              "hint": "the target doesn't fall inside the sorted half's own value range",
              "steps": [
                "The left half is sorted, so its values run from a[lo] up to a[mid], in order.",
                "The target is smaller than a[lo], meaning it's below the entire range the sorted left half covers.",
                "A value below the sorted half's minimum cannot be inside that half.",
                "So the target, if it exists anywhere, must be in the other half — the search continues in [mid, hi]."
              ],
              "answer": "The right half, [mid, hi] — the target falls outside the sorted left half's own value range (below its minimum), so it cannot be there and must be sought in the other half instead."
            },
            {
              "q": "Binary search runs in O(log n). Explain in one or two sentences why a linked list, even though it can be sorted, doesn't support this — binary search on a sorted linked list is actually O(n).",
              "kind": "write",
              "accept": [
                "no random access, finding the midpoint requires walking from the head",
                "linked lists lack o(1) indexing so computing mid takes o(n) itself"
              ],
              "hint": "binary search needs to jump straight to an arbitrary index — can a linked list do that",
              "steps": [
                "Binary search's speed depends on computing a[mid] in O(1) — jumping directly to an arbitrary index.",
                "A linked list, from the linked lists booklet, has no random access: reaching the k-th node requires walking k pointers from the head, which is O(k).",
                "So even though the halving logic still applies conceptually, each step's 'jump to mid' costs O(n) on its own.",
                "The O(log n) step count times an O(n) cost per step makes the whole thing O(n log n) at best, and in practice implementations just walk the list once instead — no faster than linear search."
              ],
              "answer": "Because binary search needs O(1) random access to read a[mid] each step, and a linked list only supports O(k) access to its k-th node — the pointer-walk needed just to find the midpoint erases the whole advantage of halving."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Binary search",
          "Halving a sorted range each step by comparing against the midpoint."
        ],
        [
          "Loop invariant",
          "A condition (here, that the answer is within [lo, hi]) preserved by every iteration."
        ],
        [
          "lower_bound",
          "The index of the first element not less than a target value."
        ],
        [
          "upper_bound",
          "The index of the first element strictly greater than a target value."
        ],
        [
          "Half-open range",
          "A range including its start but excluding its end, written [lo, hi)."
        ],
        [
          "Monotonic predicate",
          "A true/false function that changes value at most once across a range."
        ],
        [
          "Binary search on the answer",
          "Binary-searching a feasibility threshold instead of an array index."
        ],
        [
          "Rotated sorted array",
          "A sorted array cut and swapped end-to-end, sorted with one seam."
        ],
        [
          "Integer overflow",
          "When an arithmetic result exceeds a fixed-width integer type's representable range."
        ],
        [
          "Random access",
          "Reading any index in O(1) time, independent of the structure's size."
        ],
        [
          "Staircase search",
          "Eliminating a full row or column at a time in a row-and-column sorted matrix."
        ],
        [
          "Off-by-one error",
          "A bug from a boundary index being one position higher or lower than intended."
        ]
      ]
    },
  "backtrack": {
      "title": "Backtracking",
      "blurb": "A systematic way to search a space of choices — build a partial solution one decision at a time, check it's still consistent, and the instant it isn't, undo the last decision and try the next option instead of ever finishing the doomed branch.",
      "chapters": [
        {
          "title": "Choose, explore, unchoose",
          "blocks": [
            {
              "t": "p",
              "x": "Backtracking is recursion, from the recursion booklet, applied to a specific shape of problem: build a solution incrementally, one choice at a time, and at each step try every option available, recursing into each before moving to the next. The three-part rhythm gives the technique its name: choose an option, explore what follows from it (recursively), then unchoose it — undo the choice — before trying the next option at that same level. Unchoosing is what lets the same partial solution be reused across siblings instead of copied."
            },
            {
              "t": "p",
              "x": "Concretely, generating every way to place non-attacking pieces, every valid arrangement of a puzzle, or every subset satisfying some constraint all follow the identical pattern: for each candidate next choice, make it, recurse to extend the partial solution, then remove it and try the next candidate. What distinguishes backtracking from plain brute-force enumeration of every possibility is the next chapter's addition: checking each partial choice's validity before recursing, rather than only checking a complete solution at the end."
            },
            {
              "t": "note",
              "x": "The recursion here is naturally depth-first: a full partial solution is built all the way down before any sibling option at a shallower level is tried. This is why backtracking search is usually drawn — and thought about — as walking a tree, exactly like the DFS traversal in the graphs booklet, with each node a partial solution and each edge a single choice."
            }
          ]
        },
        {
          "title": "Pruning: cutting branches before they're built",
          "blocks": [
            {
              "t": "p",
              "x": "Plain brute force generates every complete candidate and checks each one at the end. Backtracking's real advantage is checking constraints as early as possible — the moment a partial solution can be proven invalid, its entire remaining subtree is skipped, without ever generating any of the complete solutions that would have descended from it. This is called pruning, and it's the difference between backtracking finishing in practice and being just as slow as brute force in theory."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 700 380' xmlns='http://www.w3.org/2000/svg'>\n<text x='30' y='24' font-size='12.5' fill='#666D72'>Subset search over {4,3,2}, keeping the running sum ≤ 5</text>\n<text x='330' y='60' text-anchor='middle' font-size='12' fill='#9AA1A6'>sum=0</text>\n<line x1='330' y1='70' x2='170' y2='130' stroke='#2E3438'/>\n<line x1='330' y1='70' x2='500' y2='130' stroke='#2E3438'/>\n<rect x='130' y='130' width='80' height='30' rx='5' fill='#0E1113' stroke='#666D72' stroke-width='1.3'/>\n<text x='170' y='150' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>+4 → sum=4</text>\n<rect x='460' y='130' width='80' height='30' rx='5' fill='#0E1113' stroke='#666D72' stroke-width='1.3'/>\n<text x='500' y='150' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>skip 4 → sum=0</text>\n<line x1='170' y1='160' x2='90' y2='210' stroke='#2E3438'/>\n<line x1='170' y1='160' x2='250' y2='210' stroke='#2E3438'/>\n<line x1='500' y1='160' x2='420' y2='210' stroke='#2E3438'/>\n<line x1='500' y1='160' x2='580' y2='210' stroke='#2E3438'/>\n<rect x='40' y='210' width='100' height='34' rx='5' fill='#20272B' stroke='#EDEFF0' stroke-width='1.5' stroke-dasharray='4 4'/>\n<text x='90' y='226' text-anchor='middle' font-size='11' fill='#EDEFF0'>+3 → sum=7</text>\n<text x='90' y='240' text-anchor='middle' font-size='10.5' fill='#EDEFF0'>7 &gt; 5: prune ✕</text>\n<rect x='200' y='210' width='100' height='30' rx='5' fill='#0E1113' stroke='#666D72' stroke-width='1.3'/>\n<text x='250' y='230' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>skip 3 → sum=4</text>\n<rect x='370' y='210' width='100' height='30' rx='5' fill='#0E1113' stroke='#666D72' stroke-width='1.3'/>\n<text x='420' y='230' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>+3 → sum=3</text>\n<rect x='530' y='210' width='100' height='30' rx='5' fill='#0E1113' stroke='#666D72' stroke-width='1.3'/>\n<text x='580' y='230' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>skip 3 → sum=0</text>\n<line x1='250' y1='240' x2='250' y2='280' stroke='#2E3438' stroke-dasharray='3 4'/>\n<line x1='420' y1='240' x2='420' y2='280' stroke='#2E3438' stroke-dasharray='3 4'/>\n<line x1='580' y1='240' x2='580' y2='280' stroke='#2E3438' stroke-dasharray='3 4'/>\n<text x='250' y='300' text-anchor='middle' font-size='10.5' fill='#666D72'>decide 2: sums 6✕ / 4✓</text>\n<text x='420' y='300' text-anchor='middle' font-size='10.5' fill='#666D72'>decide 2: sums 5✓ / 3✓</text>\n<text x='580' y='300' text-anchor='middle' font-size='10.5' fill='#666D72'>decide 2: sums 2✓ / 0✓</text>\n<text x='30' y='340' font-size='12' fill='#666D72'>The dashed node is pruned the moment its sum exceeds the bound — its two children (include/exclude 2) are never built.</text>\n<text x='30' y='362' font-size='12' fill='#666D72'>Every other branch runs to completion, decision by decision, exactly like plain brute-force search.</text>\n</svg>",
              "cap": "Selecting a subset of {4,3,2} while keeping the running sum ≤ 5: the moment a partial sum exceeds the bound, the choice about the remaining element is never even considered."
            },
            {
              "t": "p",
              "x": "How much pruning actually saves depends entirely on how early invalid partial solutions can be detected, and how large a subtree gets cut off when they are. Pruning near the root of the search tree, where subtrees are largest, saves far more than pruning near the leaves — which is why a good backtracking solution puts the most restrictive checks first, ordering the choices so constraints get violated (and detected) as early in the search as possible, sometimes called constraint propagation."
            }
          ]
        },
        {
          "title": "Case study: N-Queens",
          "blocks": [
            {
              "t": "p",
              "x": "Place N queens on an N×N board so that no two attack each other — no shared row, column, or diagonal. Backtracking places one queen per row, choosing a column for each row in turn, and before recursing into the next row, checks the new queen against every queen already placed: same column, or |row difference| equal to |column difference| (a diagonal), and that branch is pruned immediately, without ever considering what the queens in later rows might have been."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 780 320' xmlns='http://www.w3.org/2000/svg'>\n<text x='30' y='24' font-size='12.5' fill='#666D72'>Placing row 1 after a queen sits at row 0, column 1 (4×4 board)</text>\n<rect x='60' y='50' width='220' height='220' fill='none' stroke='#2E3438' stroke-width='1.4'/>\n<line x1='115' y1='50' x2='115' y2='270' stroke='#2E3438'/><line x1='170' y1='50' x2='170' y2='270' stroke='#2E3438'/><line x1='225' y1='50' x2='225' y2='270' stroke='#2E3438'/>\n<line x1='60' y1='105' x2='280' y2='105' stroke='#2E3438'/><line x1='60' y1='160' x2='280' y2='160' stroke='#2E3438'/><line x1='60' y1='215' x2='280' y2='215' stroke='#2E3438'/>\n<circle cx='142' cy='77' r='14' fill='#EDEFF0'/><text x='142' y='82' text-anchor='middle' font-size='13' fill='#0E1113'>Q</text>\n<text x='142' y='42' text-anchor='middle' font-size='11' fill='#9AA1A6'>row 0, col 1</text>\n<line x1='60' y1='132' x2='280' y2='132' stroke='#20272B'/>\n<text x='87' y='150' text-anchor='middle' font-size='16' fill='#9AA1A6'>✕</text>\n<text x='87' y='168' text-anchor='middle' font-size='10' fill='#666D72'>diagonal</text>\n<text x='142' y='150' text-anchor='middle' font-size='16' fill='#9AA1A6'>✕</text>\n<text x='142' y='168' text-anchor='middle' font-size='10' fill='#666D72'>same col</text>\n<text x='197' y='150' text-anchor='middle' font-size='16' fill='#9AA1A6'>✕</text>\n<text x='197' y='168' text-anchor='middle' font-size='10' fill='#666D72'>diagonal</text>\n<text x='252' y='145' text-anchor='middle' font-size='18' fill='#EDEFF0'>✓</text>\n<text x='252' y='168' text-anchor='middle' font-size='10' fill='#9AA1A6'>row 1, col 3</text>\n<text x='320' y='84' font-size='12' fill='#666D72'>col 0 — diagonal (gaps 1 = 1): conflict.</text>\n<text x='320' y='108' font-size='12' fill='#666D72'>col 1 — same column as row 0: conflict.</text>\n<text x='320' y='132' font-size='12' fill='#666D72'>col 2 — diagonal (gaps 1 = 1): conflict.</text>\n<text x='320' y='156' font-size='12' fill='#666D72'>col 3 — gaps 1 ≠ 2, no conflict at all.</text>\n<text x='320' y='180' font-size='12' fill='#EDEFF0'>The only branch worth recursing into.</text>\n<text x='320' y='218' font-size='12' fill='#9AA1A6'>Checking each partial choice before recursing</text>\n<text x='320' y='238' font-size='12' fill='#9AA1A6'>is what makes this backtracking, not brute force:</text>\n<text x='320' y='258' font-size='12' fill='#9AA1A6'>three of the four branches are cut immediately.</text>\n</svg>",
              "cap": "With a queen fixed at row 0, column 1, three of the four candidate columns for row 1 conflict immediately; only one branch is worth recursing into."
            },
            {
              "t": "worked",
              "q": "For 4-Queens with a queen already placed at row 0, column 1, how many of the four column choices for row 1 survive the consistency check?",
              "steps": [
                "Column 0: row-gap |1−0|=1 equals column-gap |0−1|=1 → same diagonal, conflict.",
                "Column 1: same column as the row-0 queen → conflict.",
                "Column 2: row-gap 1 equals column-gap |2−1|=1 → same diagonal, conflict.",
                "Column 3: row-gap 1, column-gap |3−1|=2 — not equal, and not the same column → no conflict."
              ],
              "answer": "Only column 3 survives. Checking consistency before recursing means three of the four branches for row 1 are never explored at all, let alone to full depth — this is exactly the saving pruning provides, made concrete."
            }
          ]
        },
        {
          "title": "Case study: subsets, permutations, combinations",
          "blocks": [
            {
              "t": "p",
              "x": "Generating every subset of a set of n elements follows the choose/explore/unchoose pattern directly: at each element, in turn, choose to include it or exclude it, recurse, then undo the choice. That's a binary decision at each of n elements — 2ⁿ leaves, one per subset, matching the figure above but without a bound to prune against; enumerating all subsets is inherently exponential, and no pruning changes that if every subset is genuinely needed."
            },
            {
              "t": "p",
              "x": "Permutations use a different bookkeeping trick: at each position, try every element not yet used, mark it used, recurse to fill the remaining positions, then unmark it. The “not yet used” check is itself a form of pruning — it's what stops any element from appearing twice in one permutation, cutting off invalid branches immediately rather than generating a full ordering and checking it for duplicates afterward."
            },
            {
              "t": "p",
              "x": "Combinations (choosing k elements from n, order not mattering) add a third trick on top of the subset pattern: track a start index and only ever consider elements from there onward, which mechanically prevents generating both [1,2] and [2,1] as if they were different — order is fixed at generation time instead of filtered out afterward. Each of these three problems is the same recursive shape with a different rule for what counts as a valid or already-explored choice."
            }
          ]
        },
        {
          "title": "What pruning actually buys you",
          "blocks": [
            {
              "t": "p",
              "x": "Backtracking with pruning is still worst-case exponential for genuinely hard search problems — N-Queens, Sudoku, and subset-sum all have no known polynomial algorithm, and pruning doesn't change their asymptotic complexity class. What it changes is the constant, often dramatically: N-Queens without any pruning would generate N^N raw placements before checking any of them; with row-by-row column consistency checks, the effective branching factor collapses far below N at every level, which is why 8-Queens solves instantly despite 8^8 being over 16 million."
            },
            {
              "t": "p",
              "x": "The other lever, beyond checking constraints early, is the order choices are tried in. A common heuristic — most-constrained-variable first — picks whichever remaining decision has the fewest valid options left, rather than a fixed left-to-right order; failing fast on the most restricted choice tends to prune enormous subtrees sooner than restricted choices deeper in the tree would. This is the same instinct as putting the tightest filter first in any search: fail as early and as cheaply as possible."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check the choose/explore/unchoose mechanics directly, and whether pruning's actual savings — not just its vocabulary — has landed."
            }
          ],
          "exercises": [
            {
              "q": "What specifically distinguishes backtracking from generating every complete candidate and checking each one at the end (plain brute force)?",
              "kind": "mc",
              "options": [
                "Backtracking always finds the answer faster asymptotically, in the worst case",
                "Backtracking checks partial solutions for validity and prunes invalid branches before they're fully built",
                "Backtracking doesn't use recursion",
                "Backtracking only works on tree-shaped problems, unlike brute force"
              ],
              "correct": 1,
              "steps": [
                "Worst-case asymptotic complexity for hard search problems is unchanged by pruning — both remain exponential in the worst case, so option A is false.",
                "Backtracking is built on recursion, typically depth-first, so option C is backwards.",
                "Option D isn't a real distinction — brute force isn't restricted to non-tree problems either; both approaches search the same space.",
                "The actual distinction is early validity checking: backtracking checks a partial solution as it's built and abandons — prunes — a branch the instant it's provably invalid, rather than only checking complete candidates."
              ],
              "answer": "Backtracking checks partial solutions early and prunes invalid branches before ever completing them, while brute force generates every complete candidate first and checks validity only at the end."
            },
            {
              "q": "In the {4,3,2}, bound-5 subset figure, the branch that includes 4 then includes 3 (running sum 7) is pruned. How many leaf nodes — full decisions about every element — does that pruning save, compared to exploring it fully?",
              "kind": "write",
              "accept": [
                "2",
                "two"
              ],
              "hint": "how many elements are left undecided when that branch is cut",
              "steps": [
                "The pruned node has decided on 2 elements (include 4, include 3) with one element (the 2) still undecided.",
                "If exploration continued, that undecided element would branch into exactly 2 leaves: include 2, or exclude 2.",
                "Pruning at that node means neither of those 2 leaves is ever built or checked.",
                "So the saving is exactly 2 leaf nodes for this particular prune — small here, but the same mechanism cuts off exponentially larger subtrees the closer to the root it happens."
              ],
              "answer": "2 — the pruned node had one element (the 2) left to decide, which would have produced 2 leaves (include or exclude it), neither of which is ever built."
            },
            {
              "q": "Why does generating all subsets of an n-element set take Θ(2ⁿ) time no matter how well the backtracking is pruned?",
              "kind": "write",
              "accept": [
                "there are exactly 2^n subsets and each one must be produced, pruning can't reduce the output size",
                "the output itself has 2^n elements so it's a hard lower bound"
              ],
              "hint": "think about what pruning can and can't reduce",
              "steps": [
                "Pruning saves work by skipping branches that can be proven invalid before completion.",
                "When the task is to enumerate every subset, every one of the 2ⁿ subsets is a valid, wanted output — none of them are invalid branches to prune.",
                "With nothing invalid to detect and skip, there is no branch pruning could ever cut off.",
                "Since the algorithm must at minimum produce all 2ⁿ outputs, Θ(2ⁿ) is an unavoidable lower bound, regardless of implementation cleverness."
              ],
              "answer": "Because all 2ⁿ subsets are valid outputs that must all be produced — there's nothing invalid to prune, so the exponential output size is an unavoidable lower bound no matter how the search is implemented."
            },
            {
              "q": "The most-constrained-variable heuristic suggests deciding which remaining choice first?",
              "kind": "mc",
              "options": [
                "Whichever choice has the most valid options remaining",
                "Whichever choice has the fewest valid options remaining",
                "Choices in a fixed order, left to right, regardless of the branch",
                "Whichever choice was decided first in a previous, unrelated run"
              ],
              "correct": 1,
              "steps": [
                "The heuristic is about failing fast: a decision with very few valid options is more likely to hit a dead end soon, wherever that dead end is.",
                "Trying the most-restricted choice first means the search discovers a wasted branch — if there is one — as early as possible, before more decisions have been layered on top of it.",
                "Deciding the least-restricted choice first (option A) tends to build much deeper before discovering a conflict, wasting more work per failed branch.",
                "Fixed order (option C) ignores the whole point of the heuristic — that some decisions are more failure-prone than others and are worth confronting first."
              ],
              "answer": "Whichever choice has the fewest valid options remaining — deciding the most restricted variable first tends to expose dead ends earlier, before the search has invested more work building on top of them."
            },
            {
              "q": "Explain, in your own words, why unchoosing (undoing a decision before trying the next sibling option) is a necessary part of the pattern, not just tidy bookkeeping.",
              "kind": "write",
              "accept": [
                "without undoing the partial solution stays modified and later siblings would search the wrong state",
                "the same partial solution object is reused across branches so it must be restored before the next branch"
              ],
              "hint": "think about what state the next sibling branch would see if the choice were never undone",
              "steps": [
                "Backtracking typically mutates one shared partial-solution structure (a board, a running sum, a chosen-so-far list) rather than copying it for every branch, for efficiency.",
                "If a choice is made and never undone, the next sibling branch at that level begins its search from a state that still reflects the previous, now-abandoned choice.",
                "That leftover state would make the next branch's own validity checks wrong — checking against a phantom decision that isn't actually part of its own path from the root.",
                "Undoing the choice restores the shared structure to exactly the state it was in before this branch started, which is what makes reusing one structure across many branches correct rather than merely convenient."
              ],
              "answer": "Because the partial-solution structure is shared and mutated across branches rather than copied; without undoing a choice, the next sibling branch would search starting from a state still containing a decision that isn't actually part of its own path, making its checks wrong rather than just inefficient."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Backtracking",
          "Recursive search that undoes a choice and tries the next option when a branch dead-ends."
        ],
        [
          "Choose-explore-unchoose",
          "The three-step rhythm: make a choice, recurse, then undo it before the next option."
        ],
        [
          "Pruning",
          "Abandoning a partial solution's entire subtree once it's proven invalid."
        ],
        [
          "State-space tree",
          "The tree of all partial solutions reachable by the sequence of choices made so far."
        ],
        [
          "Constraint propagation",
          "Ordering or filtering choices so invalid branches are detected as early as possible."
        ],
        [
          "N-Queens",
          "The problem of placing N mutually non-attacking queens on an N×N board."
        ],
        [
          "Consistency check",
          "Verifying a partial solution doesn't already violate a constraint, before recursing further."
        ],
        [
          "Branching factor",
          "The number of choices available at each step of the search."
        ],
        [
          "Most-constrained-variable heuristic",
          "Deciding the choice with the fewest valid options first, to fail fast."
        ],
        [
          "Subset generation",
          "Enumerating every subset of a set via an include/exclude choice per element."
        ],
        [
          "Permutation generation",
          "Enumerating every ordering of a set via a used/unused choice per position."
        ],
        [
          "Combination generation",
          "Enumerating every k-element selection, order-independent, via a start-index bound."
        ]
      ]
    },
  "dp": {
    "title": "Dynamic Programming",
    "blurb": "Solving overlapping subproblems once and reusing the answers — the single idea that turns exponential recursion into polynomial time, and the technique most people find hardest to spot.",
    "chapters": [
      {
        "title": "Overlapping subproblems and optimal substructure",
        "blocks": [
          {
            "t": "p",
            "x": "Dynamic programming applies when a problem has two properties at once. First, optimal substructure: the optimal solution to the whole problem is built from optimal solutions to its subproblems — the same property that makes recursion (see recursion) work at all. Second, overlapping subproblems: naive recursion on the problem calls the same subproblem many times over, so a plain recursive solution does correct but wildly redundant work."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 700 400\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"350\" y1=\"60\" x2=\"200\" y2=\"130\" stroke=\"#2E3438\"/>\n<line x1=\"350\" y1=\"60\" x2=\"500\" y2=\"130\" stroke=\"#2E3438\"/>\n<line x1=\"200\" y1=\"130\" x2=\"120\" y2=\"205\" stroke=\"#2E3438\"/>\n<line x1=\"200\" y1=\"130\" x2=\"280\" y2=\"205\" stroke=\"#2E3438\"/>\n<line x1=\"500\" y1=\"130\" x2=\"420\" y2=\"205\" stroke=\"#2E3438\"/>\n<line x1=\"500\" y1=\"130\" x2=\"580\" y2=\"205\" stroke=\"#2E3438\"/>\n<line x1=\"120\" y1=\"205\" x2=\"70\" y2=\"278\" stroke=\"#2E3438\"/>\n<line x1=\"120\" y1=\"205\" x2=\"170\" y2=\"278\" stroke=\"#2E3438\"/>\n<circle cx=\"350\" cy=\"60\" r=\"22\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"350\" y=\"64\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">fib(4)</text>\n<circle cx=\"200\" cy=\"130\" r=\"22\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"200\" y=\"134\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">fib(3)</text>\n<circle cx=\"500\" cy=\"130\" r=\"24\" fill=\"#1A1E20\" stroke=\"#EDEFF0\" stroke-width=\"2.4\"/>\n<text x=\"500\" y=\"134\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">fib(2)</text>\n<circle cx=\"120\" cy=\"205\" r=\"24\" fill=\"#1A1E20\" stroke=\"#EDEFF0\" stroke-width=\"2.4\"/>\n<text x=\"120\" y=\"209\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">fib(2)</text>\n<circle cx=\"280\" cy=\"205\" r=\"20\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"280\" y=\"209\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">fib(1)</text>\n<circle cx=\"420\" cy=\"205\" r=\"20\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"420\" y=\"209\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">fib(1)</text>\n<circle cx=\"580\" cy=\"205\" r=\"20\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"580\" y=\"209\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">fib(0)</text>\n<circle cx=\"70\" cy=\"278\" r=\"20\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"70\" y=\"282\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">fib(1)</text>\n<circle cx=\"170\" cy=\"278\" r=\"20\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"170\" y=\"282\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">fib(0)</text>\n<text x=\"350\" y=\"335\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">Both circled fib(2) nodes recompute the identical subproblem</text>\n<text x=\"350\" y=\"355\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\">from scratch — memoization caches it after the first call.</text>\n</svg>",
            "cap": "The recursion tree for a naive fib(4). Even at this tiny depth, fib(2) is computed twice from two different branches, and fib(1) three times — the redundancy that grows exponentially with depth and that dynamic programming exists to eliminate."
          },
          {
            "t": "p",
            "x": "Naive recursive Fibonacci makes this concrete: fib(n) calls fib(n-1) and fib(n-2), each of which calls two more, and the total number of calls grows like the Fibonacci numbers themselves — exponential in n. Every one of those calls is recomputing an answer some earlier branch already worked out. Cache each subproblem's answer the first time it's computed, and every later call becomes a lookup: exponential time collapses to linear."
          },
          {
            "t": "p",
            "x": "Not every recursive problem qualifies. A divide-and-conquer algorithm like merge sort (see divide) also breaks a problem into subproblems, but the subproblems don't overlap — each half of the array is disjoint from the other — so there's nothing to cache and memoizing it buys nothing. The test before reaching for DP is specifically: do smaller instances of this recur more than once along different paths?"
          }
        ]
      },
      {
        "title": "Memoization: recursion with a cache",
        "blocks": [
          {
            "t": "p",
            "x": "The most direct way to add DP to a recursive solution is to change nothing about its structure and add a cache: before computing, check whether this subproblem's answer is already stored; after computing, store it before returning. This is called memoization, and it is top-down — it starts from the original problem and recurses toward the base cases, exactly like the naive version, except each distinct subproblem does its real work only once."
          },
          {
            "t": "code",
            "x": "def fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n    return memo[n]"
          },
          {
            "t": "p",
            "x": "Memoization's biggest practical advantage is that it changes almost nothing about how you think through the problem — you write the recursive solution the way it occurs to you, then bolt on a cache. Its cost is the recursion itself: each call still uses stack space, and for problems with deep recursion (a DP over a string of length 100,000, say) that stack usage can matter or even overflow, in exactly the way discussed in recursion."
          }
        ]
      },
      {
        "title": "Tabulation: building the table bottom-up",
        "blocks": [
          {
            "t": "p",
            "x": "The alternative is tabulation: instead of starting from the top and recursing down, start from the base cases and build a table up to the answer, in an explicit loop with no recursion at all. This requires figuring out an evaluation order in which every subproblem a cell depends on has already been filled in before that cell is computed — for Fibonacci, simply increasing i, since dp[i] only ever needs dp[i-1] and dp[i-2]."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 700 280\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"50\" y=\"28\" font-size=\"13\" fill=\"#EDEFF0\" font-family=\"monospace\">dp[i] = dp[i-1] + dp[i-2]</text>\n<path d=\"M261,130 Q323,62 385,130\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.3\" stroke-dasharray=\"4 3\"/>\n<text x=\"300\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i-2</text>\n<path d=\"M323,130 Q354,95 385,130\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.3\" stroke-dasharray=\"4 3\"/>\n<text x=\"372\" y=\"88\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i-1</text>\n<text x=\"75\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=0</text>\n<rect x=\"50\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"75\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">0</text>\n<text x=\"137\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=1</text>\n<rect x=\"112\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"137\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">1</text>\n<text x=\"199\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=2</text>\n<rect x=\"174\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"199\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">1</text>\n<text x=\"261\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=3</text>\n<rect x=\"236\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"261\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">2</text>\n<text x=\"323\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=4</text>\n<rect x=\"298\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"323\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">3</text>\n<text x=\"385\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">i=5</text>\n<rect x=\"360\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#1A1E20\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"385\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">5</text>\n<text x=\"447\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=6</text>\n<rect x=\"422\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"447\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">8</text>\n<text x=\"509\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=7</text>\n<rect x=\"484\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"509\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">13</text>\n<text x=\"571\" y=\"122\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">i=8</text>\n<rect x=\"546\" y=\"130\" width=\"50\" height=\"50\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"571\" y=\"160\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" font-family=\"monospace\">21</text>\n<text x=\"350\" y=\"215\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">Each cell depends only on a fixed window of earlier cells —</text>\n<text x=\"350\" y=\"233\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\">keep just that window in memory instead of the whole table.</text>\n</svg>",
            "cap": "Filling dp[0..8] left to right. Because dp[5] depends only on dp[3] and dp[4], nothing further back needs to stay in memory once those two are used — the basis for the space reduction in the next chapter."
          },
          {
            "t": "p",
            "x": "Tabulation trades the conceptual convenience of memoization for two practical wins: no recursion means no stack-depth risk, and having the whole table explicit makes it easy to see exactly what memory the algorithm is using and to reduce it. Most production DP code is tabulated for this reason, even though memoization is usually how people first discover the recurrence while working the problem out."
          },
          {
            "t": "note",
            "x": "The two are equivalent in what they compute — same subproblems, same answers — and differ only in direction and mechanism. A useful habit: work out the recurrence with memoization, since recursion mirrors how you naturally decompose the problem, then convert to tabulation once the recurrence is confirmed correct, once the shape is stable and you want the tighter, stack-free version."
          }
        ]
      },
      {
        "title": "Designing the state and the transition",
        "blocks": [
          {
            "t": "p",
            "x": "The genuinely hard part of dynamic programming is not memoizing or tabulating — it's figuring out what a state should represent and how one state's answer relates to another's, before writing any code at all. Skipping this step and trying to code-and-debug your way to a correct recurrence is the single most common reason DP problems feel impossible."
          },
          {
            "t": "list",
            "items": [
              "<strong>State it in words first.</strong> “dp[i] = the minimum coins needed to make amount i” or “dp[i][j] = the length of the longest common subsequence of the first i characters of A and the first j characters of B.” If you can't say this sentence, you don't have a state yet.",
              "<strong>Write the transition as a sentence, then as a formula.</strong> “To make amount i, try each coin c; using it costs 1 + dp[i-c].” Then dp[i] = min over coins c of 1 + dp[i-c].",
              "<strong>Nail the base cases</strong> — the values the recurrence can't derive from anything smaller, like dp[0] = 0.",
              "<strong>Confirm the evaluation order</strong> covers every dependency before it's needed — increasing i, increasing (i, j) lexicographically, or whatever the recurrence actually requires.",
              "<strong>Identify where the final answer lives</strong> in the table — not always the last cell; for some problems it's a maximum or minimum over a whole row or column."
            ]
          },
          {
            "t": "worked",
            "q": "You have coins of denominations 1, 3, 4. What is the minimum number of coins to make 6, and what does the DP table look like getting there?",
            "steps": [
              "State: dp[i] = minimum coins to make amount i. Base case dp[0] = 0.",
              "Transition: dp[i] = 1 + min(dp[i-1], dp[i-3], dp[i-4]) over whichever coins are ≤ i.",
              "dp[1]=1 (1), dp[2]=2 (1+1), dp[3]=1 (3), dp[4]=1 (4), dp[5]=2 (min(dp[4],dp[2],dp[1])+1 = min(1,2,1)+1 = 2, e.g. 1+4), dp[6]=2 (min(dp[5],dp[3],dp[2])+1 = min(2,1,2)+1 = 2, i.e. 3+3).",
              "So dp[6] = 2, achieved by 3 + 3 — notably not the greedy answer of 4+1+1 (3 coins), which is exactly the kind of case where greedy (see greedy) fails and DP is required."
            ],
            "answer": "2 coins (3 + 3). The greedy “take the largest coin that fits” strategy gives 3 coins here (4+1+1) and is wrong — this denomination set has no greedy-safe structure, which is precisely why the coin change problem is a DP staple rather than a greedy one."
          }
        ]
      },
      {
        "title": "Rolling arrays and space reduction",
        "blocks": [
          {
            "t": "p",
            "x": "Once the table is built, look at what each cell actually depends on. Fibonacci's dp[i] only ever needs dp[i-1] and dp[i-2] — nothing further back is ever touched again once i moves past it. That means the full array of n values is never necessary; two variables suffice, cutting space from O(n) to O(1)."
          },
          {
            "t": "p",
            "x": "The same idea generalizes to two-dimensional tables. Longest common subsequence and 0/1 knapsack both have recurrences where row i only depends on row i-1, never on anything further back — so instead of keeping an n×m table, keep two rows (or, with a careful iteration order, one row updated in place) and roll them forward as i increases. This is called a rolling array, and it's the standard way production DP code turns an O(nm) memory footprint into O(m)."
          },
          {
            "t": "note",
            "x": "Rolling arrays cost you the ability to reconstruct the actual sequence of choices that produced the optimal value, not just the value itself — the intermediate rows that would let you trace back a path are gone. If the problem needs the path (which coins, which characters aligned), either keep the full table or keep a separate, smaller table of just the choices made at each step."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "Work out the state and transition on paper before checking the steps — that's the actual skill being tested here."
          }
        ],
        "exercises": [
          {
            "q": "For the longest common subsequence (LCS) of two strings of length n and m, what is dp[i][j] in words, and what's the transition when the characters match versus when they don't?",
            "steps": [
              "dp[i][j] = the length of the LCS of the first i characters of A and the first j characters of B.",
              "If A[i-1] == B[j-1] (the current characters match), that character can extend any common subsequence of the two shorter prefixes: dp[i][j] = dp[i-1][j-1] + 1.",
              "If they don't match, the best LCS either drops the last character of A or the last character of B, so dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
              "Base cases: dp[0][j] = dp[i][0] = 0, since an empty prefix has no common subsequence with anything."
            ],
            "answer": "dp[i][j] = LCS length of the first i and j characters; dp[i-1][j-1]+1 on a match, max(dp[i-1][j], dp[i][j-1]) otherwise — the two-dimensional twin of the coin-change recurrence."
          },
          {
            "q": "Why does naive recursive Fibonacci run in exponential time despite computing a value that grows only linearly in n?",
            "steps": [
              "Runtime is determined by the number of calls made, not by the size of the final answer.",
              "T(n) = T(n-1) + T(n-2) + O(1), the same recurrence as the Fibonacci sequence itself, which grows as φ^n for the golden ratio φ ≈ 1.618.",
              "The overlap is severe: fib(n-2) is computed once as a direct child and again inside the fib(n-1) subtree, and this compounds at every level."
            ],
            "answer": "Because the number of calls, not the size of the output, sets the runtime, and the call tree's overlapping branches make that count grow exponentially — the textbook symptom of overlapping subproblems left unmemoized.",
            "kind": "mc",
            "options": [
              "Because the number of recursive calls grows exponentially due to overlapping subproblems, independent of how large the final value is",
              "Because addition is a slow operation",
              "Because the recursion depth itself is exponential in n",
              "Because Python function calls are inherently exponential"
            ],
            "correct": 0
          },
          {
            "q": "A DP table is being computed with the recurrence dp[i][j] = dp[i-1][j] + dp[i][j-1]. Which fill order is valid?",
            "steps": [
              "Every cell (i, j) depends on (i-1, j) and (i, j-1) — the cell directly above and the cell directly to its left.",
              "A valid order must guarantee both of those are already filled before (i, j) is computed.",
              "Filling row by row, and left to right within each row, guarantees the cell above (previous row, already done) and the cell to the left (earlier in the current row, already done) are both ready.",
              "Filling column by column top-to-bottom-then-next-column also works by the same logic reversed; filling by decreasing i or decreasing j does not, since it would need values not yet computed."
            ],
            "answer": "Row by row, left to right within each row (or the symmetric column-by-column order) — any order in which both dependencies are always already filled.",
            "kind": "mc",
            "options": [
              "Row by row, left to right within each row",
              "Row by row, right to left within each row",
              "In any order, since DP tables don't have dependencies",
              "Starting from the bottom-right corner and working backward"
            ],
            "correct": 0
          },
          {
            "kind": "write",
            "q": "Adding a cache to an otherwise-unchanged recursive solution, so each subproblem is computed once and reused, is called ___.",
            "accept": [
              "memoization",
              "memoisation"
            ],
            "hint": "top-down, one word",
            "steps": [
              "The recursive structure and call order stay exactly as written.",
              "Before doing real work, check whether this subproblem's answer is already cached.",
              "After computing an answer, store it before returning, so any later call for the same subproblem is a cache hit."
            ],
            "answer": "Memoization — the top-down way to add dynamic programming to an existing recursive solution."
          },
          {
            "kind": "write",
            "q": "Reducing a DP table's memory from O(n) rows to a small constant number of rows, because each row only depends on the row(s) immediately before it, is called a ___ array.",
            "accept": [
              "rolling"
            ],
            "hint": "one word, describes how the small window moves forward",
            "steps": [
              "Inspect what each cell in row i actually reads — typically only row i-1 or a small fixed window before it.",
              "Once row i is computed and used, any row further back than the window is never read again.",
              "Keep only the window and overwrite the oldest row as you advance, instead of retaining the full table."
            ],
            "answer": "A rolling array — the standard space optimization once the dependency window is confirmed to be small and fixed."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Overlapping subproblems",
        "When a recursive breakdown of a problem revisits the same smaller instance along more than one path."
      ],
      [
        "Optimal substructure",
        "When an optimal solution to a problem is built from optimal solutions to its subproblems."
      ],
      [
        "Memoization",
        "Caching a function's results by input, so a repeated call with the same input returns instantly instead of recomputing."
      ],
      [
        "Tabulation",
        "Building a DP table bottom-up in an explicit loop, from base cases to the final answer, with no recursion."
      ],
      [
        "State",
        "What a single cell of a DP table represents — the specific subproblem being solved, stated precisely in words."
      ],
      [
        "Transition (recurrence)",
        "The formula relating one state's answer to the answers of the states it depends on."
      ],
      [
        "Base case",
        "A state simple enough to answer directly, with no dependency on any other state."
      ],
      [
        "Top-down",
        "Starting from the original problem and recursing toward base cases — memoization's direction."
      ],
      [
        "Bottom-up",
        "Starting from base cases and building toward the original problem — tabulation's direction."
      ],
      [
        "Rolling array",
        "Keeping only the small window of previous rows or cells a DP transition actually depends on, instead of the full table."
      ],
      [
        "Subproblem graph",
        "The dependency structure among a problem's subproblems, which any valid fill order must respect."
      ],
      [
        "Exponential blowup",
        "The runtime explosion that results from leaving overlapping subproblems unmemoized."
      ],
      [
        "Knapsack problem",
        "The classic DP problem of choosing items with weights and values to maximize value under a weight limit."
      ],
      [
        "Longest common subsequence",
        "The longest sequence of characters appearing in the same relative order in two strings, not necessarily contiguous."
      ],
      [
        "Coin change",
        "The classic DP problem of making a target amount with the fewest coins from a given set of denominations."
      ]
    ]
  },
  "stringalgo": {
    "title": "String algorithms",
    "blurb": "Where the strings booklet's text-as-data and dynamic programming's overlapping subproblems meet: matching, aligning, and indexing sequences efficiently.",
    "chapters": [
      {
        "title": "Naive matching, and its worst case",
        "blocks": [
          {
            "t": "p",
            "x": "The obvious way to find a pattern of length m inside a text of length n is to try every starting position in the text and compare character by character, giving up on the first mismatch. This works, and for most everyday text it is fast enough — but its worst case is not O(n+m), it is O(nm), and that worst case is not exotic: it shows up whenever the text is highly repetitive."
          },
          {
            "t": "code",
            "x": "def naive_search(text, pattern):\n    n, m = len(text), len(pattern)\n    for i in range(n - m + 1):\n        j = 0\n        while j < m and text[i + j] == pattern[j]:\n            j += 1\n        if j == m:\n            return i          # match starts at i\n    return -1"
          },
          {
            "t": "worked",
            "q": "text = \"aaaaaaaaaa\" (ten a's), pattern = \"aaab\" (three a's then b). Roughly how many character comparisons does naive_search perform before reporting no match?",
            "steps": [
              "There are n - m + 1 = 10 - 4 + 1 = 7 starting positions to try.",
              "At each starting position, the pattern matches 'a','a','a' and only fails on the fourth character, since the text has no 'b' anywhere.",
              "So each of the 7 positions costs 4 comparisons before failing, not 1.",
              "That is 7 × 4 = 28 comparisons for text and pattern lengths of 10 and 4 — proportional to n·m, not n+m."
            ],
            "answer": "About 28 comparisons — every position gets pushed almost to the end of the pattern before failing, because the text is one long run of the pattern's own repeated prefix. Scale n and m up and this becomes genuinely slow, which is exactly the case KMP and Rabin-Karp are built to avoid."
          },
          {
            "t": "note",
            "x": "This adversarial case is not a contrived edge case in practice: DNA sequences, run-length-heavy log files, and repetitive binary formats all produce exactly this kind of near-miss-everywhere text, which is part of why production string search rarely uses the naive approach directly."
          }
        ]
      },
      {
        "title": "KMP: matching without rescanning the text",
        "blocks": [
          {
            "t": "p",
            "x": "The naive algorithm's waste comes from throwing away everything it learned on a mismatch and starting the next attempt from scratch. Knuth-Morris-Pratt (KMP) instead precomputes, for the pattern alone, how much of a partial match can be reused when a mismatch happens — so the text pointer never has to move backward, and the whole search runs in O(n + m)."
          },
          {
            "t": "p",
            "x": "That precomputed table is the prefix function (sometimes called the failure function): for each prefix of the pattern, the length of the longest proper prefix of that prefix which is also a suffix of it. It answers, purely from the pattern's own structure, \"if I mismatch here, how much of what I already matched can I keep?\""
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">pattern = a b a b a c a</text>\n<text x=\"40\" y=\"54\" font-size=\"11.5\" fill=\"#9AA1A6\">index</text>\n<text x=\"40\" y=\"146\" font-size=\"11.5\" fill=\"#9AA1A6\">π[i]</text>\n<g font-family=\"ui-monospace,SFMono-Regular,Menlo,monospace\">\n<rect x=\"110\" y=\"66\" width=\"64\" height=\"40\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"142\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">a</text><text x=\"142\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">0</text>\n<rect x=\"174\" y=\"66\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"206\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">b</text><text x=\"206\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">1</text>\n<rect x=\"238\" y=\"66\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"270\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">a</text><text x=\"270\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">2</text>\n<rect x=\"302\" y=\"66\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"334\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">b</text><text x=\"334\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">3</text>\n<rect x=\"366\" y=\"66\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"398\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">a</text><text x=\"398\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">4</text>\n<rect x=\"430\" y=\"66\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"462\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">c</text><text x=\"462\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">5</text>\n<rect x=\"494\" y=\"66\" width=\"64\" height=\"40\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"526\" y=\"91\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">a</text><text x=\"526\" y=\"58\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">6</text>\n<rect x=\"110\" y=\"120\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"142\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">0</text>\n<rect x=\"174\" y=\"120\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"206\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">0</text>\n<rect x=\"238\" y=\"120\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"270\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">1</text>\n<rect x=\"302\" y=\"120\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"334\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">2</text>\n<rect x=\"366\" y=\"120\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"398\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">3</text>\n<rect x=\"430\" y=\"120\" width=\"64\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"462\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">0</text>\n<rect x=\"494\" y=\"120\" width=\"64\" height=\"40\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"526\" y=\"145\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\">1</text>\n</g>\n<text x=\"40\" y=\"196\" font-size=\"12.5\" fill=\"#9AA1A6\">Highlighted: π[6] = 1, because the single-letter prefix \"a\" is the longest</text>\n<text x=\"40\" y=\"216\" font-size=\"12.5\" fill=\"#9AA1A6\">proper prefix of \"ababaca\" that is also a suffix of it.</text>\n<text x=\"40\" y=\"244\" font-size=\"12.5\" fill=\"#666D72\">On a mismatch after matching k characters, KMP resumes at π[k] instead of restarting at 0.</text>\n</svg>",
            "cap": "The prefix function for \"ababaca\": at each position, how much of the pattern's own prefix reappears as a suffix ending there. This table, built once from the pattern alone, is what lets KMP skip re-comparing characters it has already seen."
          }
        ]
      },
      {
        "title": "Rabin-Karp: matching by hashing",
        "blocks": [
          {
            "t": "p",
            "x": "Rabin-Karp takes a different route to the same O(n+m) average case: instead of being clever about the text pointer, it compares hashes. It computes a hash of the pattern once, then slides a window of length m across the text, comparing the window's hash against the pattern's hash — and only falling back to an actual character comparison when the hashes match."
          },
          {
            "t": "p",
            "x": "The trick that makes this fast is a rolling hash: moving the window one character to the right can update the hash in O(1), by subtracting the outgoing character's contribution and adding the incoming one, rather than rehashing the whole window from scratch. Without that property the algorithm would be no faster than the naive approach."
          },
          {
            "t": "note",
            "x": "A hash match is a candidate, not a certainty — two different substrings can hash to the same value, a collision, purely by chance or (worse) because an adversary chose the input to cause one. Rabin-Karp always verifies a hash match with a real character-by-character comparison before reporting it as a match; skipping that verification step trades a correct algorithm for a probabilistic one that can silently report false matches."
          }
        ]
      },
      {
        "title": "Edit distance and sequence alignment",
        "blocks": [
          {
            "t": "p",
            "x": "Exact matching answers \"does this pattern occur verbatim?\" — but spell checkers, DNA alignment, and diff tools all need a softer question: how different are two sequences, and what is the cheapest way to turn one into the other? The edit distance (Levenshtein distance) between two strings is the minimum number of single-character insertions, deletions, and substitutions needed to turn one into the other."
          },
          {
            "t": "p",
            "x": "This is dynamic programming applied to sequences, in exactly the shape the dynamic programming booklet describes: dp[i][j], the edit distance between the first i characters of X and the first j characters of Y, is built from smaller subproblems. If the current characters match, no edit is needed and dp[i][j] = dp[i-1][j-1]. If they don't, the cheapest of a substitution, insertion, or deletion is taken: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 620 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"26\" font-size=\"12\" fill=\"#666D72\">edit distance(\"cat\", \"cot\") — grid rows = \"cat\", columns = \"cot\"</text>\n<g font-family=\"ui-monospace,SFMono-Regular,Menlo,monospace\" font-size=\"14\">\n<text x=\"96\" y=\"56\" text-anchor=\"middle\" fill=\"#666D72\">∅</text>\n<text x=\"166\" y=\"56\" text-anchor=\"middle\" fill=\"#9AA1A6\">c</text>\n<text x=\"236\" y=\"56\" text-anchor=\"middle\" fill=\"#9AA1A6\">o</text>\n<text x=\"306\" y=\"56\" text-anchor=\"middle\" fill=\"#9AA1A6\">t</text>\n<text x=\"36\" y=\"96\" text-anchor=\"middle\" fill=\"#666D72\">∅</text>\n<text x=\"36\" y=\"136\" text-anchor=\"middle\" fill=\"#9AA1A6\">c</text>\n<text x=\"36\" y=\"176\" text-anchor=\"middle\" fill=\"#9AA1A6\">a</text>\n<text x=\"36\" y=\"216\" text-anchor=\"middle\" fill=\"#9AA1A6\">t</text>\n</g>\n<g font-family=\"ui-monospace,SFMono-Regular,Menlo,monospace\" font-size=\"15\" text-anchor=\"middle\">\n<rect x=\"66\" y=\"76\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"96\" y=\"101\" fill=\"#EDEFF0\">0</text>\n<rect x=\"136\" y=\"76\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"166\" y=\"101\" fill=\"#EDEFF0\">1</text>\n<rect x=\"206\" y=\"76\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"236\" y=\"101\" fill=\"#EDEFF0\">2</text>\n<rect x=\"276\" y=\"76\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"306\" y=\"101\" fill=\"#EDEFF0\">3</text>\n<rect x=\"66\" y=\"116\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"96\" y=\"141\" fill=\"#EDEFF0\">1</text>\n<rect x=\"136\" y=\"116\" width=\"60\" height=\"40\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"166\" y=\"141\" fill=\"#EDEFF0\">0</text>\n<rect x=\"206\" y=\"116\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"236\" y=\"141\" fill=\"#EDEFF0\">1</text>\n<rect x=\"276\" y=\"116\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"306\" y=\"141\" fill=\"#EDEFF0\">2</text>\n<rect x=\"66\" y=\"156\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"96\" y=\"181\" fill=\"#EDEFF0\">2</text>\n<rect x=\"136\" y=\"156\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"166\" y=\"181\" fill=\"#EDEFF0\">1</text>\n<rect x=\"206\" y=\"156\" width=\"60\" height=\"40\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"236\" y=\"181\" fill=\"#EDEFF0\">1</text>\n<rect x=\"276\" y=\"156\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"306\" y=\"181\" fill=\"#EDEFF0\">2</text>\n<rect x=\"66\" y=\"196\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"96\" y=\"221\" fill=\"#EDEFF0\">3</text>\n<rect x=\"136\" y=\"196\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"166\" y=\"221\" fill=\"#EDEFF0\">2</text>\n<rect x=\"206\" y=\"196\" width=\"60\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"236\" y=\"221\" fill=\"#EDEFF0\">2</text>\n<rect x=\"276\" y=\"196\" width=\"60\" height=\"40\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"306\" y=\"221\" fill=\"#EDEFF0\">1</text>\n</g>\n<text x=\"30\" y=\"260\" font-size=\"12.5\" fill=\"#9AA1A6\">Highlighted diagonal: c=c matches free, a→o costs one substitution, t=t matches free.</text>\n<text x=\"30\" y=\"282\" font-size=\"12.5\" fill=\"#666D72\">Bottom-right corner, dp[3][3] = 1, is the answer: one substitution turns \"cat\" into \"cot\".</text>\n</svg>",
            "cap": "The edit-distance table for \"cat\" and \"cot\", filled by the same subproblem-reuse idea as any other DP table. The bottom-right cell holds the answer; the highlighted diagonal traces the cheapest sequence of matches and one substitution that achieves it."
          },
          {
            "t": "worked",
            "q": "Compute the edit distance between \"flaw\" and \"lawn\" using the same recurrence.",
            "steps": [
              "Build a 5×5 table (row 0 and column 0 count up 0,1,2,3,4 for the empty-prefix base cases).",
              "Filling row by row with the match/substitute/insert/delete recurrence gives final row [4,3,2,1,2].",
              "The bottom-right cell, dp[4][4], holds the answer.",
              "One valid edit sequence: delete 'f' (flaw → law), substitute nothing needed for 'l','a','w' which already align, then insert 'n' at the end (law → lawn) — two edits total."
            ],
            "answer": "2. \"flaw\" and \"lawn\" share the substring \"law\" out of order at the front versus the back, and the cheapest path the DP table finds is one deletion plus one insertion, not a string of substitutions."
          }
        ]
      },
      {
        "title": "Suffix arrays and suffix trees",
        "blocks": [
          {
            "t": "p",
            "x": "KMP and Rabin-Karp both answer one query at a time: does this one pattern occur in this text? When the same text will be searched over and over with many different patterns — a genome, a codebase's search index — it pays to preprocess the text itself once, rather than the pattern."
          },
          {
            "t": "p",
            "x": "A suffix array is exactly that: every suffix of the text, sorted alphabetically, stored as a list of starting positions. Because every occurrence of a pattern is a prefix of some suffix, and the suffixes are sorted, all occurrences of a pattern sit in one contiguous block of the array — findable with binary search in O(m log n) after O(n log n) preprocessing. A suffix tree stores the same information as a trie of every suffix, trading a larger constant in memory for O(m) query time, independent of n."
          },
          {
            "t": "list",
            "items": [
              "<strong>One text, one pattern, asked once</strong>: KMP or Rabin-Karp — no preprocessing investment is justified.",
              "<strong>One text, many patterns over time</strong>: build a suffix array or suffix tree once, then query it repeatedly.",
              "<strong>Approximate matching, hashing at scale</strong>: Rabin-Karp's rolling hash generalises well to fingerprinting and plagiarism-style similarity checks."
            ]
          }
        ]
      },
      {
        "title": "Tokenising and normalising text",
        "blocks": [
          {
            "t": "p",
            "x": "Real text-processing pipelines rarely match algorithms against raw bytes. The strings booklet's distinction between bytes, code points, and what a person calls a character matters here directly: before any matching or alignment happens, text is usually normalised — a canonical Unicode form is chosen so that visually identical strings compare equal, case may be folded, and the text is split into tokens (words, subwords, or punctuation-aware units) rather than left as one long sequence of characters."
          },
          {
            "t": "note",
            "x": "Tokenisation choices are not cosmetic: a naive split on whitespace breaks on languages without spaces between words, mishandles contractions and hyphenation inconsistently, and is a completely different problem from the subword tokenisation used to feed text into the embeddings and attention layers further along this map — that tokenisation is learned from data, not hand-written as a rule."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "The prefix-function and edit-distance questions are the ones worth being able to redo from scratch — they are the two ideas everything else in this booklet builds on."
          }
        ],
        "exercises": [
          {
            "q": "text = \"aaaaaaaaaa\" (ten a's), pattern = \"aaab\". Roughly how many comparisons does naive matching perform before concluding there is no match, and why is that close to the worst case rather than typical?",
            "kind": "write",
            "accept": [
              "28",
              "about 28",
              "~28",
              "n times m",
              "proportional to n times m",
              "o(nm)"
            ],
            "hint": "count comparisons per position, times the number of positions",
            "steps": [
              "There are 10 - 4 + 1 = 7 starting positions.",
              "Every position matches three a's before failing on the fourth character, since the text has no 'b'.",
              "That's 7 × 4 = 28 comparisons.",
              "This is the adversarial case where naive matching's cost is genuinely proportional to n·m, not n+m."
            ],
            "answer": "About 28 — every one of the 7 positions gets pushed almost to the end of the 4-character pattern before failing, which is exactly the O(nm) worst case a repetitive text triggers."
          },
          {
            "q": "For the pattern \"ababaca\", the prefix function at the final index (6, the last 'a') is 1. What does that value mean operationally, if a mismatch occurs immediately after matching all 7 characters?",
            "kind": "mc",
            "options": [
              "KMP can resume comparing as if the first 1 character of the pattern were already matched, without moving the text pointer backward",
              "KMP must restart entirely from position 0 in the pattern and re-scan the text",
              "The pattern has no self-overlap and matching must always restart from scratch",
              "The value 1 means the pattern occurs exactly once in the text"
            ],
            "correct": 0,
            "steps": [
              "π[6] = 1 because the pattern's single-letter prefix \"a\" also appears as its final character.",
              "That overlap means after a full match (or a match up to this point), 1 character of pattern-progress is still valid on the next attempt.",
              "KMP resumes matching from pattern position 1, using the text position it already reached — the text pointer never moves backward.",
              "This is exactly what keeps KMP's total work linear: no character of the text is ever re-examined from an earlier position."
            ],
            "answer": "KMP resumes at pattern index 1 without rewinding the text pointer — that reuse of already-matched information is the entire mechanism that gets KMP to O(n+m)."
          },
          {
            "q": "Rabin-Karp reports a hash match between the pattern and a text window, but a direct character comparison afterward shows they are not actually equal. What is this called, and why does Rabin-Karp still perform the direct comparison rather than trusting the hash?",
            "kind": "mc",
            "options": [
              "A hash collision — two different substrings hashed to the same value, so the comparison step is required to keep the algorithm correct rather than merely probabilistic",
              "A rolling error — the hash function is broken and needs to be replaced",
              "A false negative — the algorithm missed a real match",
              "An overflow — the text was longer than the hash function supports"
            ],
            "correct": 0,
            "steps": [
              "A hash function maps a large space of possible substrings onto a much smaller space of hash values.",
              "By the pigeonhole principle, some distinct substrings must share a hash value — a collision.",
              "Trusting the hash alone would occasionally report a match that isn't real.",
              "Verifying with an actual character comparison after every hash match keeps the algorithm's output exact, at the cost of that one extra check."
            ],
            "answer": "A hash collision. Skipping the verification step would trade a correct algorithm for one that can silently report false matches, so Rabin-Karp always confirms a hash hit character by character."
          },
          {
            "q": "In the edit-distance recurrence, when X[i] and Y[j] are the same character, dp[i][j] is set equal to which specific neighboring cell in the table?",
            "kind": "write",
            "accept": [
              "dp[i-1][j-1]",
              "the diagonal",
              "diagonal neighbor",
              "diagonal cell",
              "top-left neighbor",
              "top left cell"
            ],
            "hint": "the one neighbor that represents both strings before either current character existed",
            "steps": [
              "A matching character requires no edit — it costs nothing extra to align them.",
              "The state before either current character was considered is dp[i-1][j-1], the diagonal neighbor.",
              "So dp[i][j] simply inherits that value unchanged.",
              "Only a mismatch forces the 1 + min(...) computation over the three neighbors."
            ],
            "answer": "dp[i-1][j-1] — the diagonal neighbor, since matching characters need no edit and the cost carries over unchanged from the subproblem before both characters existed."
          },
          {
            "q": "A search index needs to answer thousands of different substring queries per second against one large, mostly unchanging text (say, a codebase). What kind of structure is worth building once up front, rather than re-running KMP or Rabin-Karp for every new query?",
            "kind": "write",
            "accept": [
              "suffix array",
              "suffix tree",
              "a suffix array",
              "a suffix tree"
            ],
            "hint": "index the text itself, not the pattern",
            "steps": [
              "KMP and Rabin-Karp both preprocess the pattern, which only pays off once per pattern.",
              "With many different patterns against one stable text, it is the text that is worth preprocessing instead.",
              "A suffix array (or suffix tree) indexes every suffix of the text once.",
              "After that one-time cost, any pattern can be located with a binary search (or a tree walk) rather than a fresh linear scan."
            ],
            "answer": "A suffix array or suffix tree — preprocessing the text once amortises across every future query, which is the opposite trade-off from KMP and Rabin-Karp's per-pattern preprocessing."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Naive matching",
        "Trying every starting position in the text and comparing character by character."
      ],
      [
        "Prefix function (failure function)",
        "For each prefix of the pattern, the length of its longest proper prefix that is also its suffix."
      ],
      [
        "KMP algorithm",
        "Linear-time string matching that reuses the prefix function to avoid rescanning the text."
      ],
      [
        "Rolling hash",
        "A hash that can be updated in O(1) as a window slides, without rehashing from scratch."
      ],
      [
        "Rabin-Karp algorithm",
        "Matching by comparing rolling hashes, verifying candidate matches with a direct comparison."
      ],
      [
        "Hash collision",
        "Two different inputs producing the same hash value."
      ],
      [
        "Edit distance (Levenshtein distance)",
        "The minimum insertions, deletions, and substitutions needed to turn one string into another."
      ],
      [
        "Sequence alignment",
        "Finding the best correspondence between positions in two sequences, as edit distance does for strings."
      ],
      [
        "Substitution cost",
        "The cost charged for replacing one character with another in an edit-distance computation."
      ],
      [
        "Suffix array",
        "Every suffix of a text, sorted, stored as starting positions, for fast repeated substring queries."
      ],
      [
        "Suffix tree",
        "A trie of every suffix of a text, answering pattern queries in time independent of text length."
      ],
      [
        "Tokenisation",
        "Splitting text into words, subwords, or other units before further processing."
      ],
      [
        "Normalisation",
        "Converting text to a canonical form so equivalent strings compare equal."
      ],
      [
        "Case folding",
        "Normalising letter case before comparison, distinct from normalising Unicode form."
      ],
      [
        "Worst-case adversarial input",
        "An input specifically shaped to trigger an algorithm's slowest behaviour."
      ],
      [
        "Amortised preprocessing",
        "A one-time cost paid once and recovered across many subsequent queries."
      ]
    ]
  }
});
