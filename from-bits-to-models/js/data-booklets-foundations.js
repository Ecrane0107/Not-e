Object.assign(BOOKLETS, {
  "arrays": {
      "title": "Arrays",
      "blurb": "Contiguous memory with constant-time indexing — the structure almost everything else is built on, and the one the hardware likes best.",
      "chapters": [
        {
          "title": "Contiguity and the indexing formula",
          "blocks": [
            {
              "t": "p",
              "x": "An array is a block of memory holding elements of identical size, laid end to end with no gaps. That single property — contiguity — is what gives arrays their defining feature, and everything else follows from it."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"70\" y=\"36\" font-size=\"12\" fill=\"#666D72\">address</text>\n<rect x=\"70\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"98\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[0]</text><text x=\"98\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1000</text><rect x=\"132\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"160\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[1]</text><text x=\"160\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1004</text><rect x=\"194\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"222\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[2]</text><text x=\"222\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1008</text><rect x=\"256\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"284\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[3]</text><text x=\"284\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1012</text><rect x=\"318\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"346\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[4]</text><text x=\"346\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1016</text><rect x=\"380\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"408\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[5]</text><text x=\"408\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1020</text><rect x=\"442\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"470\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[6]</text><text x=\"470\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1024</text><rect x=\"504\" y=\"70\" width=\"56\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"532\" y=\"96\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a[7]</text><text x=\"532\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\" class=\"mono\">1028</text>\n<line x1=\"70\" y1=\"128\" x2=\"566\" y2=\"128\" stroke=\"#2E3438\"/>\n<text x=\"70\" y=\"156\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">address(a[i]) = base + i × element_size</text>\n<text x=\"70\" y=\"180\" font-size=\"13\" fill=\"#9AA1A6\">One multiply and one add, regardless of i — the whole meaning of O(1) random access.</text>\n</svg>",
              "cap": "Because elements are the same size and adjacent, the address of any element is computable arithmetic rather than a search."
            },
            {
              "t": "p",
              "x": "Getting a[i] requires no traversal: multiply i by the element size, add the base address, read. That is two arithmetic operations regardless of whether i is 0 or 999,999, which is what constant-time random access means. A linked list cannot do this, because its nodes are scattered and only reachable by following references from the head."
            },
            {
              "t": "p",
              "x": "The same formula explains why arrays are homogeneous and fixed-width. If elements could differ in size, the position of element i would depend on the sizes of all preceding elements, and the arithmetic would collapse into a walk. Languages with heterogeneous lists, like Python, resolve this by storing pointers of uniform size in the array and putting the actual objects elsewhere — which preserves O(1) indexing at the cost of an extra dereference and much worse locality."
            },
            {
              "t": "note",
              "x": "Zero-based indexing looks arbitrary until you see the formula. With zero-based indices the offset is exactly i × size; with one-based it is (i − 1) × size, an extra subtraction on every access. Dijkstra's argument for it was about half-open ranges being cleaner, but the machine-level reason is that the index <em>is</em> the offset."
            }
          ]
        },
        {
          "title": "Static arrays and dynamic arrays",
          "blocks": [
            {
              "t": "p",
              "x": "A static array has its size fixed at creation. That is often unacceptable, so most languages provide a dynamic array — Python's list, Java's ArrayList, C++'s vector, Go's slice — which grows as needed."
            },
            {
              "t": "p",
              "x": "The growth strategy is the interesting part. When the backing store fills, the implementation allocates a larger one, copies everything across, and frees the old. If it grew by a constant amount each time, n appends would cost O(n²) in copies. Instead it grows by a constant <em>factor</em>, typically doubling."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"70\" y=\"34\" font-size=\"12\" fill=\"#666D72\">elements copied at each resize</text>\n<rect x=\"70\" y=\"146.6\" width=\"58\" height=\"3.4\" rx=\"3\" fill=\"#EDEFF0\" opacity=\"0.28\"/><rect x=\"70\" y=\"146.6\" width=\"58\" height=\"3.4\" rx=\"3\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"99\" y=\"168\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">1</text><rect x=\"154\" y=\"143.2\" width=\"58\" height=\"6.8\" rx=\"3\" fill=\"#EDEFF0\" opacity=\"0.28\"/><rect x=\"154\" y=\"143.2\" width=\"58\" height=\"6.8\" rx=\"3\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"183\" y=\"168\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">2</text><rect x=\"238\" y=\"136.4\" width=\"58\" height=\"13.6\" rx=\"3\" fill=\"#EDEFF0\" opacity=\"0.28\"/><rect x=\"238\" y=\"136.4\" width=\"58\" height=\"13.6\" rx=\"3\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"267\" y=\"168\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">4</text><rect x=\"322\" y=\"122.8\" width=\"58\" height=\"27.2\" rx=\"3\" fill=\"#EDEFF0\" opacity=\"0.28\"/><rect x=\"322\" y=\"122.8\" width=\"58\" height=\"27.2\" rx=\"3\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"351\" y=\"168\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">8</text><rect x=\"406\" y=\"95.6\" width=\"58\" height=\"54.4\" rx=\"3\" fill=\"#EDEFF0\" opacity=\"0.28\"/><rect x=\"406\" y=\"95.6\" width=\"58\" height=\"54.4\" rx=\"3\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"435\" y=\"168\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">16</text><rect x=\"490\" y=\"41.2\" width=\"58\" height=\"108.8\" rx=\"3\" fill=\"#EDEFF0\" opacity=\"0.28\"/><rect x=\"490\" y=\"41.2\" width=\"58\" height=\"108.8\" rx=\"3\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/><text x=\"519\" y=\"168\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\" class=\"mono\">32</text>\n<line x1=\"70\" y1=\"150\" x2=\"580\" y2=\"150\" stroke=\"#2E3438\"/>\n<text x=\"70\" y=\"196\" font-size=\"13.5\" fill=\"#9AA1A6\">1 + 2 + 4 + 8 + 16 + 32 = 63, just under 2 × 32.</text>\n<text x=\"70\" y=\"216\" font-size=\"13\" fill=\"#666D72\">The last resize costs more than every earlier one combined, and the total stays below 2n.</text>\n</svg>",
              "cap": "The cost of every resize while growing to 32. Because each resize doubles, the sum of all copying stays below 2n."
            },
            {
              "t": "worked",
              "q": "Show that n appends to a doubling array cost O(n) in total.",
              "steps": [
                "Resizes occur at capacities 1, 2, 4, 8, … up to roughly n.",
                "Each resize copies its current contents, so the copies total 1 + 2 + 4 + … + n.",
                "A geometric series with ratio 2 sums to less than twice its largest term, so under 2n.",
                "Spread across n appends, that is fewer than 2 copies per append."
              ],
              "answer": "O(n) total, so O(1) amortised per append. Note that an individual append can still cost O(n) — which matters for latency, and is why real-time systems preallocate rather than rely on amortisation."
            },
            {
              "t": "p",
              "x": "Amortised analysis is the right tool here and it is worth naming precisely: it bounds the average cost across a sequence of operations, without claiming any individual one is cheap. That is a genuinely different guarantee from average-case analysis, which averages over inputs. Amortised bounds hold for every sequence, including adversarial ones."
            }
          ]
        },
        {
          "title": "Locality, and why it beats complexity",
          "blocks": [
            {
              "t": "p",
              "x": "The gap between processor and memory speed is enormous — hundreds of cycles for a main memory access against a few for arithmetic. Caches hide this by keeping recently used data close, and they fetch in blocks called cache lines, typically 64 bytes, on the assumption that data near what you just used will be used next."
            },
            {
              "t": "p",
              "x": "Arrays reward that assumption perfectly. Walking one sequentially means each cache line fetch serves the next several elements, and the hardware prefetcher, spotting the stride, fetches ahead. Linked lists defeat it: each node may be anywhere, so each step is a potential cache miss with nothing else in the line worth having."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"70\" y=\"36\" font-size=\"12\" fill=\"#666D72\">reading a row — contiguous</text>\n<rect x=\"70\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"114\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"158\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"202\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"246\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"290\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"70\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"114\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"158\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"202\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"246\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"290\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"70\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"114\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"158\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"202\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"246\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"290\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"70\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"114\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"158\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"202\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"246\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><rect x=\"290\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"380\" y=\"36\" font-size=\"12\" fill=\"#666D72\">reading a column — strided</text>\n<rect x=\"380\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"424\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"512\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"556\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"600\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"380\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"424\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"512\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"556\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"600\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"380\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"424\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"512\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"556\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"600\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"380\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"424\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"512\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"556\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"600\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\"/><rect x=\"468\" y=\"52\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"468\" y=\"86\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"468\" y=\"120\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><rect x=\"468\" y=\"154\" width=\"40\" height=\"30\" rx=\"4\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"70\" y=\"212\" font-size=\"12.5\" fill=\"#9AA1A6\">One cache line fetch serves the whole row.</text>\n<text x=\"380\" y=\"212\" font-size=\"12.5\" fill=\"#9AA1A6\">Each element needs its own fetch, and the rest</text>\n<text x=\"380\" y=\"230\" font-size=\"12.5\" fill=\"#9AA1A6\">of every line is discarded unused.</text>\n</svg>",
              "cap": "Row-major storage. Traversing along a row uses every value in each fetched line; traversing down a column uses one value per line and discards the rest."
            },
            {
              "t": "p",
              "x": "This is why an array often outperforms a linked list even on operations the complexity table says the list wins. Inserting into the middle of an array is O(n) copying against the list's O(1) relink — but the array's copy is a fast contiguous move the hardware is optimised for, while reaching the list's insertion point requires a cache-missing walk. For small and medium sizes the array frequently wins outright."
            },
            {
              "t": "note",
              "x": "The lesson is not that complexity analysis is wrong; it is that it counts operations while ignoring their wildly different costs. Big-O tells you how something scales. Constant factors, driven mostly by memory behaviour, tell you what happens at the sizes you actually have — and can span two orders of magnitude."
            }
          ]
        },
        {
          "title": "Multiple dimensions",
          "blocks": [
            {
              "t": "p",
              "x": "Memory is one-dimensional, so a 2D array must be flattened. Row-major order, used by C, Python and most languages, stores each row completely before the next; column-major, used by Fortran, MATLAB and R, does the opposite. The index formula for row-major is base + (row × columns + column) × size."
            },
            {
              "t": "worked",
              "q": "Why is summing a large matrix row by row faster than column by column?",
              "steps": [
                "Row-major puts a row's elements adjacent in memory.",
                "A 64-byte cache line holds 8 doubles, so one fetch serves 8 consecutive row elements.",
                "Traversing a column jumps a full row width each step, landing in a different line every time.",
                "Each fetched line contributes one useful value before being evicted."
              ],
              "answer": "Up to 8× fewer memory fetches for identical arithmetic. On large matrices the measured gap is often more than 8×, because strided access also defeats the prefetcher."
            },
            {
              "t": "p",
              "x": "Two flattening choices exist in practice and they are not equivalent. A true 2D array is one contiguous block with the formula above. An array of pointers to rows — the jagged form C gives you with int** — allows ragged row lengths but scatters the rows in memory, costing an extra dereference per access and much of the locality benefit. NumPy, image buffers and matrix libraries all use the contiguous form, which is why their operations vectorise."
            },
            {
              "t": "note",
              "x": "This is also where NumPy's <code>strides</code> come from. A transpose does not move any data; it changes the stride description so that walking what you call a row walks what memory calls a column. The operation is free, and the cost reappears later as poor locality — which is why an explicit <code>.copy()</code> after a transpose sometimes makes downstream code dramatically faster."
            }
          ]
        },
        {
          "title": "Views, copies and the operations table",
          "blocks": [
            {
              "t": "p",
              "x": "A slice may produce a copy or a view onto the original memory, and the two behave very differently under mutation. Python lists copy; NumPy slices are views; Go slices share a backing array; Java's subList is a view. Getting this wrong produces action at a distance, where writing through one name changes data another name is reading."
            },
            {
              "t": "p",
              "x": "The Go case has an extra trap worth knowing. Appending to a slice writes into the shared backing array if capacity allows, so two slices of one array can silently overwrite each other's elements — until an append exceeds capacity, at which point a reallocation makes them independent. The behaviour therefore changes depending on how full the array happened to be, which is a difficult class of bug."
            },
            {
              "t": "list",
              "items": [
                "<strong>Index</strong>: O(1). The reason to reach for an array at all.",
                "<strong>Append at end</strong>: O(1) amortised for a dynamic array.",
                "<strong>Insert or delete at position i</strong>: O(n), because everything after i shifts.",
                "<strong>Search unsorted</strong>: O(n). Sorted, O(log n) by binary search.",
                "<strong>Slice</strong>: O(k) for a copy, O(1) for a view."
              ]
            },
            {
              "t": "p",
              "x": "The cost of insertion and deletion in the middle is what motivates the rest of the data structures track. A hash table gives O(1) lookup by key at the cost of ordering; a balanced tree gives O(log n) insertion while keeping order; a linked list gives O(1) insertion given a position. Each trades away one of the array's properties to buy another."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The last two are about memory behaviour, which is where arrays differ most from what the complexity table suggests."
            }
          ],
          "exercises": [
            {
              "q": "An array of 4-byte integers starts at address 2000. What is the address of a[7]?",
              "steps": [
                "The formula is base + index × element size.",
                "Base is 2000, index is 7, element size is 4.",
                "7 × 4 = 28.",
                "2000 + 28 = 2028."
              ],
              "answer": "2028. Note a[0] is at the base itself, which is exactly what makes zero-based indexing the natural choice."
            },
            {
              "q": "A dynamic array grows by a fixed 10 elements instead of doubling. What are n appends now?",
              "steps": [
                "Resizes happen every 10 appends, at sizes 10, 20, 30, and so on.",
                "Each copies its current contents, so the copies total 10 + 20 + … + n.",
                "That is an arithmetic series summing to about n²/20.",
                "Quadratic in n."
              ],
              "answer": "O(n²), against O(n) for doubling. Growing by a constant amount destroys the amortised guarantee — the growth factor must be multiplicative for the geometric series argument to apply."
            },
            {
              "q": "Deleting the first element of a 1,000,000-element array. Cost, and what structure to use instead?",
              "steps": [
                "Removing index 0 leaves a gap that must be closed to preserve contiguity.",
                "Every subsequent element shifts down one position.",
                "That is 999,999 moves.",
                "A deque or circular buffer keeps indices at both ends and avoids the shift."
              ],
              "answer": "O(n) — roughly a million moves. A deque gives O(1) at both ends, which is why queue implementations never use a plain array with removal from the front."
            },
            {
              "q": "A 1000×1000 double matrix. How much memory, and how many cache lines does one row occupy?",
              "steps": [
                "A double is 8 bytes, and there are 10⁶ elements.",
                "That is 8 MB total.",
                "One row is 1000 × 8 = 8000 bytes.",
                "At 64 bytes per cache line, 8000 / 64 = 125."
              ],
              "answer": "8 MB, and 125 cache lines per row. Since the matrix far exceeds typical L2 cache, traversal order determines whether you get 125 fetches per row or 1000."
            },
            {
              "q": "Two loops sum the same matrix, one row-major and one column-major. Same complexity — why does one take several times longer?",
              "steps": [
                "Both perform exactly 10⁶ additions, so the operation count is identical.",
                "Row order reads consecutive addresses, using all 8 doubles per fetched line.",
                "Column order jumps 8000 bytes per step, using 1 double per line.",
                "The line is evicted long before the traversal returns to it."
              ],
              "answer": "Roughly 8× more memory traffic, worsened by defeating the prefetcher. Big-O counts operations; it does not count what each operation costs to feed."
            },
            {
              "q": "In Go: a := make([]int, 0, 10); b := append(a, 1); c := append(a, 2). What is b[0]?",
              "steps": [
                "a has length 0 and capacity 10, so there is room in the backing array.",
                "append(a, 1) writes 1 at index 0 and returns a slice of length 1 over the same array.",
                "append(a, 2) also sees length 0 with spare capacity, so it writes 2 at index 0 too.",
                "The second write overwrites the first."
              ],
              "answer": "2, not 1. Both slices share one backing array. Had capacity been exhausted, the second append would have reallocated and the answer would be 1 — behaviour that depends on capacity is exactly why this is a notorious trap."
            }
          ]
        }
      ]
    },
  "strings": {
      "title": "Strings",
      "blurb": "Text as data: why it is harder than it looks, what operations cost, and where the classic bugs live.",
      "chapters": [
        {
          "title": "What a string actually is",
          "blocks": [
            {
              "t": "p",
              "x": "A string is a sequence of characters — which sounds simple and hides three distinct notions that only coincide for English text. There are bytes, the units of storage. There are code points, the numbers Unicode assigns to characters. And there are grapheme clusters, the things a reader would point at and call a character."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 720 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"28\" font-size=\"12\" fill=\"#666D72\">what the reader sees — 1 grapheme cluster</text>\n<rect x=\"60\" y=\"40\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"120.0\" y=\"60\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">é</text><text x=\"120.0\" y=\"76\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">1 character</text>\n<text x=\"60\" y=\"112\" font-size=\"12\" fill=\"#666D72\">code points — 2</text>\n<rect x=\"60\" y=\"124\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"120.0\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">U+0065</text><text x=\"120.0\" y=\"160\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">e</text>\n<rect x=\"190\" y=\"124\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"250.0\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">U+0301</text><text x=\"250.0\" y=\"160\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">combining acute</text>\n<text x=\"340\" y=\"112\" font-size=\"12\" fill=\"#666D72\">UTF-8 bytes — 3</text>\n<rect x=\"340\" y=\"124\" width=\"80\" height=\"44\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"380.0\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">0x65</text><text x=\"380.0\" y=\"160\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\"></text>\n<rect x=\"428\" y=\"124\" width=\"80\" height=\"44\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"468.0\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">0xCC</text><text x=\"468.0\" y=\"160\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\"></text>\n<rect x=\"516\" y=\"124\" width=\"80\" height=\"44\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"556.0\" y=\"144\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">0x81</text><text x=\"556.0\" y=\"160\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\"></text>\n<line x1=\"120\" y1=\"88\" x2=\"120\" y2=\"118\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<line x1=\"120\" y1=\"88\" x2=\"250\" y2=\"88\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<line x1=\"250\" y1=\"88\" x2=\"250\" y2=\"118\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<text x=\"60\" y=\"206\" font-size=\"13\" fill=\"#9AA1A6\">One visible character, two code points, three bytes. Three different answers to \"how long is this?\",</text>\n<text x=\"60\" y=\"226\" font-size=\"13\" fill=\"#9AA1A6\">and every one of them is correct for some purpose.</text>\n</svg>",
              "cap": "The same é at three levels. Composed differently it is one code point and two bytes; decomposed as here it is two code points and three bytes. Both display identically."
            },
            {
              "t": "p",
              "x": "For pure ASCII all three agree, which is why the assumption that a string is an array of characters survived so long. The moment a name has an accent, a price has a currency symbol, or a user types an emoji, they diverge, and code written on the old assumption starts truncating, mis-counting and corrupting."
            },
            {
              "t": "p",
              "x": "Languages sit at different levels, and knowing which one yours uses prevents a whole category of surprise. Python 3 strings are sequences of code points. JavaScript and Java expose UTF-16 code units, which is why an emoji has length 2. Go strings are byte slices that iterate by code point. Rust strings are guaranteed-valid UTF-8 that refuses to index by integer at all — a deliberate design choice that forces the question upfront."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Byte",
                  "A unit of storage. What ends up in a file or on a socket."
                ],
                [
                  "Code point",
                  "A Unicode number identifying a character, like U+0041."
                ],
                [
                  "Code unit",
                  "The fixed-size piece an encoding works in: 8 bits for UTF-8, 16 for UTF-16."
                ],
                [
                  "Grapheme cluster",
                  "What a human calls one character. May be several code points."
                ],
                [
                  "Normalisation",
                  "Rewriting text into a canonical form so that equivalent sequences compare equal."
                ]
              ]
            }
          ]
        },
        {
          "title": "Immutability and the cost of building",
          "blocks": [
            {
              "t": "p",
              "x": "In most modern languages strings are immutable: operations that appear to modify one actually construct a new one. This buys real advantages — a string can be shared freely without defensive copying, used safely as a dictionary key, and cached — at the cost of making naive construction quadratic."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"70\" y1=\"190\" x2=\"540\" y2=\"190\" stroke=\"#2E3438\"/>\n<line x1=\"70\" y1=\"40\" x2=\"70\" y2=\"196\" stroke=\"#2E3438\"/>\n<polyline points=\"70.0,190.0 74.6,188.7 79.2,184.8 83.8,178.3 88.4,169.2 93.0,157.5 97.6,143.2 102.2,126.3 106.8,106.8 111.4,84.7 116.0,60.0 120.6,32.7 125.2,2.8 129.8,-29.7 134.4,-64.8 139.0,-102.5 143.6,-142.8 148.2,-185.7 152.8,-231.2 157.4,-279.3 162.0,-330.0 166.6,-383.3 171.2,-439.2 175.8,-497.7 180.4,-558.8 185.0,-622.5 189.6,-688.8 194.2,-757.7 198.8,-829.2 203.4,-903.3 208.0,-980.0 212.6,-1059.3 217.2,-1141.2 221.8,-1225.7 226.4,-1312.8 231.0,-1402.5 235.6,-1494.8 240.2,-1589.7 244.8,-1687.2 249.4,-1787.3 254.0,-1890.0 258.6,-1995.3 263.2,-2103.2 267.8,-2213.7 272.4,-2326.8 277.0,-2442.5 281.6,-2560.8 286.2,-2681.7 290.8,-2805.2 295.4,-2931.3 300.0,-3060.0 304.6,-3191.3 309.2,-3325.2 313.8,-3461.7 318.4,-3600.8 323.0,-3742.5 327.6,-3886.8 332.2,-4033.7 336.8,-4183.2 341.4,-4335.3 346.0,-4490.0 350.6,-4647.3 355.2,-4807.2 359.8,-4969.7 364.4,-5134.8 369.0,-5302.5 373.6,-5472.8 378.2,-5645.7 382.8,-5821.2 387.4,-5999.3 392.0,-6180.0 396.6,-6363.3 401.2,-6549.2 405.8,-6737.7 410.4,-6928.8 415.0,-7122.5 419.6,-7318.8 424.2,-7517.7 428.8,-7719.2 433.4,-7923.3 438.0,-8130.0 442.6,-8339.3 447.2,-8551.2 451.8,-8765.7 456.4,-8982.8 461.0,-9202.5 465.6,-9424.8 470.2,-9649.7 474.8,-9877.2 479.4,-10107.3 484.0,-10340.0 488.6,-10575.3 493.2,-10813.2 497.8,-11053.7 502.4,-11296.8 507.0,-11542.5 511.6,-11790.8 516.2,-12041.7 520.8,-12295.2 525.4,-12551.3 530.0,-12810.0\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<polyline points=\"70.0,190.0 74.6,188.7 79.2,187.4 83.8,186.1 88.4,184.8 93.0,183.5 97.6,182.2 102.2,180.9 106.8,179.6 111.4,178.3 116.0,177.0 120.6,175.7 125.2,174.4 129.8,173.1 134.4,171.8 139.0,170.5 143.6,169.2 148.2,167.9 152.8,166.6 157.4,165.3 162.0,164.0 166.6,162.7 171.2,161.4 175.8,160.1 180.4,158.8 185.0,157.5 189.6,156.2 194.2,154.9 198.8,153.6 203.4,152.3 208.0,151.0 212.6,149.7 217.2,148.4 221.8,147.1 226.4,145.8 231.0,144.5 235.6,143.2 240.2,141.9 244.8,140.6 249.4,139.3 254.0,138.0 258.6,136.7 263.2,135.4 267.8,134.1 272.4,132.8 277.0,131.5 281.6,130.2 286.2,128.9 290.8,127.6 295.4,126.3 300.0,125.0 304.6,123.7 309.2,122.4 313.8,121.1 318.4,119.8 323.0,118.5 327.6,117.2 332.2,115.9 336.8,114.6 341.4,113.3 346.0,112.0 350.6,110.7 355.2,109.4 359.8,108.1 364.4,106.8 369.0,105.5 373.6,104.2 378.2,102.9 382.8,101.6 387.4,100.3 392.0,99.0 396.6,97.7 401.2,96.4 405.8,95.1 410.4,93.8 415.0,92.5 419.6,91.2 424.2,89.9 428.8,88.6 433.4,87.3 438.0,86.0 442.6,84.7 447.2,83.4 451.8,82.1 456.4,80.8 461.0,79.5 465.6,78.2 470.2,76.9 474.8,75.6 479.4,74.3 484.0,73.0 488.6,71.7 493.2,70.4 497.8,69.1 502.4,67.8 507.0,66.5 511.6,65.2 516.2,63.9 520.8,62.6 525.4,61.3 530.0,60.0\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"2\" stroke-dasharray=\"5 3\"/>\n<text x=\"470\" y=\"76\" font-size=\"12.5\" fill=\"#EDEFF0\">s += c in a loop</text>\n<text x=\"470\" y=\"94\" font-size=\"11.5\" fill=\"#666D72\">O(n²) characters copied</text>\n<text x=\"440\" y=\"176\" font-size=\"12.5\" fill=\"#9AA1A6\">join at the end</text>\n<text x=\"440\" y=\"194\" font-size=\"11.5\" fill=\"#666D72\">O(n)</text>\n<text x=\"300\" y=\"220\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">number of characters appended →</text>\n<text x=\"56\" y=\"52\" text-anchor=\"end\" font-size=\"12\" fill=\"#666D72\">work</text>\n</svg>",
              "cap": "Appending in a loop against joining once. The quadratic curve is the single most common accidental performance bug in scripting languages."
            },
            {
              "t": "worked",
              "q": "Why is building a string with s += c in a loop O(n²), and what is the fix?",
              "steps": [
                "Each += allocates a new string and copies everything accumulated so far.",
                "At iteration i the copy costs i characters.",
                "The total is 1 + 2 + … + n, which is n(n+1)/2.",
                "Collecting the pieces in a list and joining once copies each character a constant number of times."
              ],
              "answer": "O(n²) as written, O(n) with join. For 100,000 characters that is roughly five billion copies against one hundred thousand — the difference between minutes and milliseconds."
            },
            {
              "t": "p",
              "x": "The idiomatic fix differs by language but the shape is identical: accumulate the pieces in a mutable container, then materialise once. Python uses \"\".join(parts), Java has StringBuilder, C# has the same, Go has strings.Builder. Some runtimes optimise the simple case in a loop, but relying on that is relying on an optimisation you cannot see and did not ask for."
            }
          ]
        },
        {
          "title": "Operations and what they cost",
          "blocks": [
            {
              "t": "p",
              "x": "Knowing the complexity of the common operations prevents most string performance problems before they happen."
            },
            {
              "t": "list",
              "items": [
                "<strong>Length</strong>: O(1) if stored, O(n) if it must be scanned. In C, strlen walks to the null terminator every single call, which is why strlen inside a loop condition is a classic quadratic bug.",
                "<strong>Index or slice</strong>: O(1) for fixed-width encodings, O(n) for variable-width ones where the nth character requires decoding the preceding n−1.",
                "<strong>Concatenate</strong>: O(n + m), because both operands are copied into the new string.",
                "<strong>Substring search</strong>: O(nm) naive, O(n + m) with KMP or Boyer-Moore. Standard libraries generally use something better than naive.",
                "<strong>Split and join</strong>: O(n) each, with allocation proportional to the number of pieces.",
                "<strong>Compare</strong>: O(n) worst case, but O(1) in practice when lengths differ or the first characters do."
              ]
            },
            {
              "t": "note",
              "x": "Interning is worth knowing about. Many runtimes keep a pool of unique string constants so that identical literals share one object, making equality checks a pointer comparison. This is why <code>a == b</code> can be true for two literals in Python but false for two identical strings built at runtime — and why comparing strings with <code>is</code> or <code>==</code> in a reference sense is a bug that passes its first test."
            }
          ]
        },
        {
          "title": "Comparison, normalisation and case",
          "blocks": [
            {
              "t": "p",
              "x": "Comparing strings for equality seems like it should be the easy part. It is not, because Unicode allows the same visible text to be encoded in more than one way, and because case and ordering are language-dependent."
            },
            {
              "t": "p",
              "x": "The é in the opening figure can be a single precomposed code point U+00E9, or an e followed by a combining acute accent U+0301. They render identically and a byte comparison says they differ. Normalisation resolves this by converting to a canonical form — NFC composes where possible, NFD decomposes — and any system comparing user-supplied text should normalise first. Usernames and file paths are the usual places this bites."
            },
            {
              "t": "p",
              "x": "Case conversion is not universal either. Turkish has a dotless ı whose uppercase is I and a dotted i whose uppercase is İ, so a lowercase-then-compare in a Turkish locale gives different answers than in an English one. This produced real security bugs where an identifier check passed in one locale and failed in another. The defence is to case-fold with an explicitly invariant locale for anything that is an identifier rather than human-facing text."
            },
            {
              "t": "p",
              "x": "Sorting is likewise cultural. Byte order puts all uppercase before all lowercase and scatters accented characters after z, which is wrong for every human language. Correct sorting needs a collation algorithm and a locale, which is what libraries like ICU provide."
            },
            {
              "t": "note",
              "x": "The practical rule for anything security-adjacent: normalise, then case-fold with an invariant locale, then compare. Doing it in a different order — or skipping normalisation — is how homoglyph and lookalike-identifier attacks get through."
            }
          ]
        },
        {
          "title": "Parsing, formatting and injection",
          "blocks": [
            {
              "t": "p",
              "x": "Strings are the boundary format of computing: files, network protocols, logs and user input all arrive as text and must be parsed into structure. Two failure modes recur often enough to be worth naming."
            },
            {
              "t": "p",
              "x": "The first is parsing with the wrong tool. Regular expressions match regular languages, and HTML, JSON and most programming languages are not regular — they nest arbitrarily deep, which a regex cannot count. A regex that appears to parse nested structure works on your examples and fails on real input. Use a parser for structured formats."
            },
            {
              "t": "p",
              "x": "The second is building structured text by concatenation. This is the mechanism behind SQL injection, cross-site scripting and command injection, and they are all the same bug: data was pasted into a program's syntax, and the parser downstream could not tell which parts were data and which were code."
            },
            {
              "t": "code",
              "x": "query = \"SELECT * FROM users WHERE name = '\" + name + \"'\"\n// name = \"'; DROP TABLE users; --\"  ends the string and starts a statement\n\nquery = \"SELECT * FROM users WHERE name = ?\"   // parameterised: data stays data"
            },
            {
              "t": "p",
              "x": "The fix is never escaping by hand. Use parameterised queries for SQL, a templating engine that escapes by default for HTML, and argument arrays rather than shell strings for subprocesses. Each keeps the data on a separate channel from the syntax, so no input can cross over."
            },
            {
              "t": "note",
              "x": "Regular expressions have a second trap worth knowing: catastrophic backtracking. Patterns with nested quantifiers like <code>(a+)+b</code> can take exponential time on a non-matching input, which turns a validation regex into a denial-of-service vector. If a regex runs on user input, it should be tested against adversarial input, not just realistic input."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The last two matter most — they are the ones that show up in production rather than in an interview."
            }
          ],
          "exercises": [
            {
              "q": "In JavaScript, why is \"👍\".length equal to 2?",
              "steps": [
                "JavaScript strings are sequences of UTF-16 code units.",
                "Code points above U+FFFF do not fit in a single 16-bit unit.",
                "They are encoded as a surrogate pair — two code units.",
                "length reports code units, not characters."
              ],
              "answer": "It counts code units. [...str].length gives 1 by iterating code points, and Intl.Segmenter gives 1 for grapheme clusters — three functions, three defensible answers."
            },
            {
              "q": "What is the total work in: s = \"\"; for c in text: s += c, for text of length 100,000?",
              "steps": [
                "Each += copies the accumulated string, then appends one character.",
                "Iteration i copies i characters.",
                "The total is 1 + 2 + … + 100,000 = n(n+1)/2.",
                "That is about 5 × 10⁹ character copies."
              ],
              "answer": "Roughly five billion copies, versus 100,000 with join. The array-and-join version is not a micro-optimisation; it is a change of complexity class."
            },
            {
              "q": "Two strings display as \"café\" but compare unequal. What is happening and how do you fix it?",
              "steps": [
                "One is likely precomposed: c, a, f, é as U+00E9 — four code points.",
                "The other is decomposed: c, a, f, e, U+0301 — five code points.",
                "They render identically because the combining accent attaches to the e.",
                "Byte or code-point comparison sees different sequences."
              ],
              "answer": "Normalise both to the same form — NFC is the usual choice — before comparing. Text arriving from macOS is commonly decomposed while text from elsewhere is composed, so this shows up in file-sync and upload code."
            },
            {
              "q": "Why does reversing a string by reversing its bytes fail for non-ASCII text?",
              "steps": [
                "A multi-byte UTF-8 character has a lead byte followed by continuation bytes.",
                "Reversing the byte order puts the continuations before their lead byte.",
                "That sequence violates UTF-8's structure and decodes to replacement characters.",
                "Even reversing whole code points breaks combining marks, which must follow their base."
              ],
              "answer": "You must reverse grapheme clusters, not bytes and not code points. This is why 'reverse a string' is a poor interview question — the correct answer depends on which of the three you meant."
            },
            {
              "q": "A search feature builds SQL by concatenating a user's query. Show the attack and the fix.",
              "steps": [
                "The input is pasted directly into the statement's syntax.",
                "Input like <code>' OR '1'='1</code> closes the literal and adds an always-true condition.",
                "The parser cannot distinguish the injected fragment from the developer's own syntax.",
                "Parameterised queries send the statement and the values over separate channels."
              ],
              "answer": "Use placeholders and bound parameters. Escaping by hand fails because escaping rules vary by database, encoding and context — the fix is to stop mixing the channels at all."
            },
            {
              "q": "A validation regex works in testing but hangs the server on some inputs. What is the likely cause?",
              "steps": [
                "A pattern with nested quantifiers can match a prefix in exponentially many ways.",
                "On an input that ultimately fails, the engine tries every one of those ways before giving up.",
                "Matching inputs return quickly, so testing with valid data reveals nothing.",
                "A long non-matching input then consumes the CPU indefinitely."
              ],
              "answer": "Catastrophic backtracking, from a pattern like (a+)+b. Rewrite to avoid nested quantifiers, set a match timeout, or use a linear-time engine such as RE2."
            }
          ]
        }
      ]
    },
  "control": {
      "title": "Control flow",
      "blurb": "How a program decides what to do next — and how to keep those decisions readable and provably correct.",
      "chapters": [
        {
          "title": "Three shapes, and nothing else",
          "blocks": [
            {
              "t": "p",
              "x": "A program is a sequence of instructions, but a program that only ever runs top to bottom cannot do much. Control flow is the machinery for deciding what runs, in what order, and how many times."
            },
            {
              "t": "p",
              "x": "The structured programming theorem, proved by Böhm and Jacopini in 1966, says something stronger than it first sounds: any computable function can be expressed with just three constructs — sequence, selection and iteration. You never need goto. This result is why modern languages look the way they do, and why Dijkstra's 1968 letter arguing against goto won the argument."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"24\" font-size=\"12\" fill=\"#666D72\">selection</text>\n<path d=\"M145.0 40 L200 57.0 L145.0 74 L90 57.0 Z\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"145.0\" y=\"62.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">condition</text>\n<rect x=\"40\" y=\"120\" width=\"90\" height=\"32\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"85.0\" y=\"141.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">then</text>\n<rect x=\"160\" y=\"120\" width=\"90\" height=\"32\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"205.0\" y=\"141.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">else</text>\n<rect x=\"90\" y=\"190\" width=\"110\" height=\"32\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"145.0\" y=\"211.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">join</text>\n<line x1=\"120\" y1=\"74\" x2=\"90\" y2=\"116\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M92.0 107.2 L90 116 L97.7 111.3\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><text x=\"81.0\" y=\"99.0\" font-size=\"11.5\" fill=\"#666D72\">true</text>\n<line x1=\"170\" y1=\"74\" x2=\"200\" y2=\"116\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M192.3 111.3 L200 116 L198.0 107.2\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><text x=\"193.0\" y=\"99.0\" font-size=\"11.5\" fill=\"#666D72\">false</text>\n<line x1=\"85\" y1=\"152\" x2=\"130\" y2=\"186\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M121.3 183.8 L130 186 L125.5 178.2\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/>\n<line x1=\"205\" y1=\"152\" x2=\"160\" y2=\"186\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M164.5 178.2 L160 186 L168.7 183.8\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/>\n<text x=\"380\" y=\"24\" font-size=\"12\" fill=\"#666D72\">iteration</text>\n<rect x=\"430\" y=\"40\" width=\"110\" height=\"32\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"485.0\" y=\"61.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">init</text>\n<path d=\"M485.0 100 L555 117.0 L485.0 134 L415 117.0 Z\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"485.0\" y=\"122.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">condition</text>\n<rect x=\"430\" y=\"168\" width=\"110\" height=\"32\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"485.0\" y=\"189.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">body</text>\n<rect x=\"590\" y=\"100\" width=\"60\" height=\"32\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"620.0\" y=\"121.0\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">exit</text>\n<line x1=\"485\" y1=\"72\" x2=\"485\" y2=\"96\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M481.5 87.7 L485 96 L488.5 87.7\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/>\n<line x1=\"485\" y1=\"134\" x2=\"485\" y2=\"164\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M481.5 155.7 L485 164 L488.5 155.7\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><text x=\"495.0\" y=\"147.0\" font-size=\"11.5\" fill=\"#666D72\">true</text>\n<line x1=\"555\" y1=\"117\" x2=\"586\" y2=\"117\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M577.7 120.5 L586 117 L577.7 113.5\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><text x=\"556.5\" y=\"109.0\" font-size=\"11.5\" fill=\"#666D72\">false</text>\n<path d=\"M430 184 C380 184 380 117 411 117\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\" stroke-dasharray=\"4 3\"/>\n<path d=\"M403 111 L413 117 L403 123\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/>\n<text x=\"60\" y=\"242\" font-size=\"12.5\" fill=\"#9AA1A6\">Every structured program is these two shapes plus sequence, nested inside each other.</text>\n</svg>",
              "cap": "Selection and iteration as control flow graphs. The dashed back edge is what makes a loop a loop, and it is also what makes reasoning about loops harder than reasoning about straight-line code."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Sequence",
                  "One statement after another."
                ],
                [
                  "Selection",
                  "A choice between paths: if, else, switch, pattern match."
                ],
                [
                  "Iteration",
                  "Repetition: for, while, do-while, and recursion as its functional equivalent."
                ],
                [
                  "Control flow graph",
                  "Nodes for blocks of code, edges for possible transfers. What a compiler builds to reason about your program."
                ],
                [
                  "Cyclomatic complexity",
                  "The number of independent paths through a function. Roughly one plus the number of branches; a useful proxy for how many tests it needs."
                ]
              ]
            }
          ]
        },
        {
          "title": "Conditions",
          "blocks": [
            {
              "t": "p",
              "x": "A conditional evaluates a boolean expression and picks a branch. The subtlety is not in the branching but in how the expression itself evaluates, and there are two behaviours worth knowing exactly."
            },
            {
              "t": "p",
              "x": "The first is short-circuit evaluation. In a && b, if a is false the result is already determined and b is never evaluated. In a || b, if a is true, likewise. This makes && and || order-sensitive in a way that arithmetic operators are not — and it is what allows a null check to protect a dereference in the same expression."
            },
            {
              "t": "code",
              "x": "if (user != null && user.name == \"x\")   // safe\nif (user.name == \"x\" && user != null)   // crashes on null"
            },
            {
              "t": "p",
              "x": "The second is truthiness. Many dynamic languages accept non-boolean values in a condition and coerce them, which is convenient until a value like 0 or the empty string is legitimate data. A count of zero and a missing count are different things, and a truthiness check cannot tell them apart — which is why explicit comparisons are safer in code that handles real data."
            },
            {
              "t": "worked",
              "q": "Simplify: !(a && b) || !(c || d)",
              "steps": [
                "Apply De Morgan to the first term: !(a && b) becomes !a || !b.",
                "Apply it to the second: !(c || d) becomes !c && !d.",
                "Combine: (!a || !b) || (!c && !d).",
                "The outer || is associative, so the first parentheses can be dropped."
              ],
              "answer": "!a || !b || (!c && !d). Note that the negation flips && to || and back — keeping the operator unchanged is the standard mistake, and it produces a condition with entirely different behaviour."
            }
          ]
        },
        {
          "title": "Loops and invariants",
          "blocks": [
            {
              "t": "p",
              "x": "Choosing a loop form is mostly a matter of what you know in advance. Use a for loop when the number of iterations is known or you are walking a collection; a while loop when you are waiting on a condition; a do-while when the body must run at least once. Most languages now offer a for-each that removes index arithmetic entirely, and it should be the default — an index you never write is an index you cannot get wrong."
            },
            {
              "t": "p",
              "x": "The idea that makes loops trustworthy is the invariant: a statement that is true before the loop starts and remains true after every iteration. Establishing one turns an argument about an unknown number of iterations into two small checks."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 710 200\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"60\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"79\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">1</text><rect x=\"102\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"121\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">3</text><rect x=\"144\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"163\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">5</text><rect x=\"186\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"205\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">8</text><rect x=\"228\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"247\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\" class=\"mono\">2</text><rect x=\"270\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"289\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\" class=\"mono\">9</text><rect x=\"312\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"331\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\" class=\"mono\">4</text><rect x=\"354\" y=\"60\" width=\"38\" height=\"38\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"373\" y=\"85\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\" class=\"mono\">7</text>\n<path d=\"M60 112 L212 112\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<text x=\"136\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">sorted so far</text>\n<path d=\"M228 112 L396 112\" stroke=\"#666D72\" stroke-width=\"1.2\" stroke-dasharray=\"4 3\"/>\n<text x=\"312\" y=\"132\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">not yet examined</text>\n<line x1=\"219\" y1=\"46\" x2=\"219\" y2=\"120\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" stroke-dasharray=\"3 3\"/>\n<text x=\"219\" y=\"40\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">i</text>\n<text x=\"430\" y=\"76\" font-size=\"13\" fill=\"#9AA1A6\">The invariant is a claim that is true</text>\n<text x=\"430\" y=\"96\" font-size=\"13\" fill=\"#9AA1A6\">before the loop, preserved by every</text>\n<text x=\"430\" y=\"116\" font-size=\"13\" fill=\"#9AA1A6\">iteration, and therefore true at the end.</text>\n<text x=\"430\" y=\"146\" font-size=\"13\" fill=\"#9AA1A6\">Combined with the exit condition, it</text>\n<text x=\"430\" y=\"166\" font-size=\"13\" fill=\"#9AA1A6\">gives you the postcondition for free.</text>\n</svg>",
              "cap": "An insertion sort invariant partway through. Everything left of i is sorted; everything right is untouched. When i reaches the end, the exit condition plus the invariant give you a sorted array."
            },
            {
              "t": "worked",
              "q": "For a loop summing an array, state an invariant and use it to prove correctness.",
              "steps": [
                "Invariant: at the top of each iteration, total holds the sum of the elements already visited.",
                "Before the loop, no elements have been visited and total is 0, so it holds.",
                "If it holds at the top of an iteration, the body adds the current element and advances the index, so it holds again.",
                "The loop exits when every element has been visited."
              ],
              "answer": "The invariant plus the exit condition gives exactly \"total is the sum of all elements\". This is induction over iterations, and it is the same argument shape as the induction proofs in the discrete mathematics booklet."
            },
            {
              "t": "p",
              "x": "Termination is a separate obligation and it is easy to forget. An invariant proves the loop is correct <em>if</em> it finishes. To prove it finishes you need a quantity that strictly decreases and cannot go below a bound — a variant. Most infinite loops are a variant that fails to decrease on some path."
            }
          ]
        },
        {
          "title": "Keeping the shape flat",
          "blocks": [
            {
              "t": "p",
              "x": "Nesting is where control flow becomes unreadable. Each level of indentation is a condition the reader must hold in mind, and by the fourth the main path is buried."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">nested — the real work is four levels deep</text>\n<rect x=\"40\" y=\"40\" width=\"200\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.16\"/><text x=\"50\" y=\"55\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">if user:</text><rect x=\"58\" y=\"66\" width=\"182\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.28\"/><text x=\"68\" y=\"81\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">if user.active:</text><rect x=\"76\" y=\"92\" width=\"164\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.4\"/><text x=\"86\" y=\"107\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">if user.credit:</text><rect x=\"94\" y=\"118\" width=\"146\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.52\"/><text x=\"104\" y=\"133\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">charge()</text>\n<text x=\"370\" y=\"26\" font-size=\"12\" fill=\"#666D72\">guarded — each rejection stated once, flat</text>\n<rect x=\"370\" y=\"40\" width=\"230\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.16\"/><text x=\"380\" y=\"55\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">if not user: return</text><rect x=\"370\" y=\"66\" width=\"230\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.16\"/><text x=\"380\" y=\"81\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">if not user.active: return</text><rect x=\"370\" y=\"92\" width=\"230\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.16\"/><text x=\"380\" y=\"107\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">if not user.credit: return</text><rect x=\"370\" y=\"118\" width=\"230\" height=\"20\" rx=\"4\" fill=\"#EDEFF0\" opacity=\"0.16\"/><text x=\"380\" y=\"133\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">charge()</text>\n<text x=\"40\" y=\"196\" font-size=\"12.5\" fill=\"#9AA1A6\">Nesting depth grows with each condition, and the</text>\n<text x=\"40\" y=\"216\" font-size=\"12.5\" fill=\"#9AA1A6\">happy path is hardest to find.</text>\n<text x=\"370\" y=\"196\" font-size=\"12.5\" fill=\"#9AA1A6\">Depth stays flat, and the happy path is the</text>\n<text x=\"370\" y=\"216\" font-size=\"12.5\" fill=\"#9AA1A6\">last line, unindented.</text>\n</svg>",
              "cap": "The same logic nested and guarded. Guard clauses handle each rejection at the top and leave the main path unindented at the bottom."
            },
            {
              "t": "p",
              "x": "The technique is to invert each condition and return early. This has a second benefit beyond indentation: each rejection reason appears once, on its own line, adjacent to what it rejects. Debugging becomes a matter of finding which guard fired rather than tracing which branch was skipped."
            },
            {
              "t": "p",
              "x": "Exceptions are control flow too, and they are non-local: a throw transfers control to a handler that may be many frames up. That is their value — errors travel to whoever can handle them without every intermediate function forwarding them — and also their cost, since a reader cannot see where control goes from the throw site. The pragmatic rule is to use exceptions for genuinely exceptional conditions and return values for expected outcomes. A missing key in a cache is expected; a corrupt database file is not."
            },
            {
              "t": "note",
              "x": "The <code>finally</code> block, and language equivalents like Python's <code>with</code> and Go's <code>defer</code>, exist because cleanup must happen on every exit path — normal return, early return, and thrown exception alike. Closing a file in the happy path only is a bug that will not show up until something else fails first, which is the worst time to discover it."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The first three are mechanical. The last three ask you to reason about correctness, which is what this material is for."
            }
          ],
          "exercises": [
            {
              "q": "Trace: total = 0; for i in 1..6: if i % 3 == 0: continue; total += i. What is total?",
              "steps": [
                "continue skips the rest of the body for that iteration.",
                "i = 3 and i = 6 are divisible by 3, so they are skipped.",
                "The remaining values are 1, 2, 4 and 5.",
                "1 + 2 + 4 + 5 = 12."
              ],
              "answer": "12. The sum 1..6 is 21, minus the skipped 3 and 6, which is a useful check on the trace."
            },
            {
              "q": "Rewrite with guard clauses: if (order != null) { if (order.isPaid()) { if (!order.isShipped()) { ship(order); } } }",
              "steps": [
                "Invert the first condition: if (order == null) return.",
                "Invert the second: if (!order.isPaid()) return.",
                "The third is already negative, so invert it: if (order.isShipped()) return.",
                "Then ship(order) at the top level."
              ],
              "answer": "Three guards then one call. Each early return also names a distinct reason for not shipping, which is exactly what you want to log or test."
            },
            {
              "q": "Why does this loop never terminate? i = 0; while (i != 10) { i += 3; }",
              "steps": [
                "The values taken are 0, 3, 6, 9, 12, 15, and so on.",
                "The condition tests inequality with exactly 10.",
                "The sequence steps over 10 without ever equalling it.",
                "Nothing afterwards can bring it back."
              ],
              "answer": "The step size does not divide the gap, so equality is never reached. Using i < 10 makes the loop robust to any step, which is why < is preferred over != in numeric loop conditions."
            },
            {
              "q": "State an invariant for binary search and explain what it guarantees at exit.",
              "steps": [
                "Invariant: if the target is present, its index lies within [lo, hi].",
                "Before the loop, lo and hi span the whole array, so it holds trivially.",
                "Each iteration discards a half that cannot contain the target, so it still holds.",
                "The loop exits when lo exceeds hi, meaning the range is empty."
              ],
              "answer": "An empty range plus the invariant proves the target is absent. Without the invariant, the exit condition alone tells you nothing — which is why boundary bugs in binary search are so hard to spot by inspection."
            },
            {
              "q": "A function has 4 independent boolean conditions with no nesting. How many paths, and what does that say about testing?",
              "steps": [
                "Each condition independently takes two outcomes.",
                "By the product rule that is 2⁴ combinations.",
                "So there are 16 distinct paths through the function.",
                "Full path coverage requires 16 test cases."
              ],
              "answer": "16 paths. Each added condition doubles the count, which is the argument for splitting large conditional functions — and the reason cyclomatic complexity is watched in code review."
            },
            {
              "q": "Why is this dangerous? try { f = open(path); process(f); } catch (e) { log(e); }",
              "steps": [
                "If process throws, control jumps straight to the catch block.",
                "The close call, wherever it was going to be, is skipped.",
                "The file handle leaks, and under repeated failures the process exhausts its descriptors.",
                "The bug only appears when something else has already gone wrong."
              ],
              "answer": "Cleanup is not on every exit path. Use finally, or a with / using / defer construct that ties the cleanup to the scope rather than to the happy path."
            }
          ]
        }
      ]
    },
  "variables": {
      "title": "Variables and types",
      "blurb": "What a name actually refers to, why two names can share one object, and what a type system buys you.",
      "chapters": [
        {
          "title": "A name is not a box",
          "blocks": [
            {
              "t": "p",
              "x": "The first mental model most people acquire is that a variable is a box holding a value, and that assignment puts a value into the box. This model is fine for numbers and quietly wrong for everything else, and almost every confusing bug in this area comes from still believing it."
            },
            {
              "t": "p",
              "x": "The accurate model is that a name is a label attached to an object. Assignment attaches the label; it does not copy anything. When you write b = a, you have not made a second box with the same contents — you have attached a second label to the object a already refers to."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"28\" font-size=\"12\" fill=\"#666D72\">names</text>\n<text x=\"300\" y=\"28\" font-size=\"12\" fill=\"#666D72\">objects in memory</text>\n<rect x=\"60\" y=\"52\" width=\"86\" height=\"38\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"103\" y=\"76\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">a</text>\n<rect x=\"60\" y=\"122\" width=\"86\" height=\"38\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"103\" y=\"146\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">b</text>\n<rect x=\"300\" y=\"48\" width=\"150\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/><text x=\"375.0\" y=\"70\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">[1, 2, 3]</text><text x=\"375.0\" y=\"86\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">one list, shared</text>\n<line x1=\"146\" y1=\"71\" x2=\"296\" y2=\"71\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/><circle cx=\"146\" cy=\"71\" r=\"3\" fill=\"#9AA1A6\"/><path d=\"M287 66 L296 71 L287 76\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/>\n<line x1=\"146\" y1=\"141\" x2=\"296\" y2=\"86\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/><circle cx=\"146\" cy=\"141\" r=\"3\" fill=\"#9AA1A6\"/><path d=\"M287 81 L296 86 L287 91\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/>\n<text x=\"60\" y=\"196\" font-size=\"13\" fill=\"#9AA1A6\">a = [1, 2]; b = a; b.append(3)</text>\n<text x=\"60\" y=\"218\" font-size=\"13\" fill=\"#666D72\">Assignment binds a name to an object. It never copies the object.</text>\n</svg>",
              "cap": "Two names, one object. Mutating through either name is visible through both, because there is only one thing to mutate."
            },
            {
              "t": "worked",
              "q": "In Python: a = [1, 2]; b = a; b.append(3). What does a print as?",
              "steps": [
                "The list object is created once when the literal is evaluated.",
                "b = a binds a second name to that same object.",
                "append mutates the object in place — it does not create a new list.",
                "Both names still refer to it."
              ],
              "answer": "[1, 2, 3]. If you wanted independence you had to ask for it: b = a.copy() or b = list(a)."
            },
            {
              "t": "p",
              "x": "Languages differ in how visible this is. Python, JavaScript, Java and Ruby all bind names to objects for anything that is not a primitive. C makes the distinction explicit through pointers. C++ gives you the choice per variable, which is the source of both its power and its reputation. But the underlying machine behaviour is the same everywhere: something in the variable's slot names a location, and copying the slot copies the name, not the location's contents."
            },
            {
              "t": "note",
              "x": "This is why the question \"is this language pass by value or pass by reference?\" so often produces an argument. Python passes references <em>by value</em>: the function receives its own copy of the reference, so rebinding the parameter inside the function does not affect the caller — but mutating the object it points to does. Once you think in names and objects, the apparent contradiction dissolves."
            }
          ]
        },
        {
          "title": "Types, and what they are for",
          "blocks": [
            {
              "t": "p",
              "x": "A type is a set of possible values together with the operations that make sense on them. Integers support addition and comparison; strings support concatenation and slicing; a Customer supports whatever methods you defined. The type is not primarily about storage, it is about which operations are meaningful."
            },
            {
              "t": "p",
              "x": "That framing explains what types are actually for. They are a lightweight proof that you are not doing something meaningless — subtracting a date from a name, calling a method on something that has none. A type system checks a class of errors before the code runs, and the value of that grows with the size of the codebase and the number of people editing it."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Primitive",
                  "A value the machine handles directly: integer, float, boolean, character. Typically stored inline."
                ],
                [
                  "Composite",
                  "A type built from others: arrays, structs, objects, tuples."
                ],
                [
                  "Static typing",
                  "Types are checked before the program runs. Errors are caught at compile time."
                ],
                [
                  "Dynamic typing",
                  "Types are checked as the program runs. Errors surface when the line executes, if it executes."
                ],
                [
                  "Strong / weak typing",
                  "How willing the language is to convert between types implicitly. Orthogonal to static versus dynamic, though the terms are often confused."
                ]
              ]
            },
            {
              "t": "p",
              "x": "Static and dynamic is a genuine trade rather than a matter of one being correct. Static typing catches errors early, documents intent in the signature, and lets tools rename and navigate reliably; it costs ceremony and sometimes fights you when the shape of the data is genuinely fluid. Dynamic typing is faster to write and more flexible; it moves errors to runtime, which means to production if your tests miss the path. The industry's revealed preference is visible in TypeScript and Python's type hints — start dynamic, add types where the code has stabilised."
            },
            {
              "t": "worked",
              "q": "In JavaScript, \"5\" + 3 gives \"53\" but \"5\" - 3 gives 2. What is going on?",
              "steps": [
                "The + operator is overloaded: numeric addition and string concatenation share it.",
                "When either operand is a string, + resolves to concatenation and coerces the other side to a string.",
                "The - operator has only a numeric meaning.",
                "So it coerces the string to a number instead."
              ],
              "answer": "The operator decides the coercion direction. A statically typed language rejects both expressions at compile time, which is precisely the class of error static typing exists to catch."
            }
          ]
        },
        {
          "title": "Mutability and aliasing",
          "blocks": [
            {
              "t": "p",
              "x": "A mutable object can be changed after creation; an immutable one cannot. Modifying an immutable value always produces a new object, leaving the original untouched. In Python, lists and dictionaries are mutable while strings and tuples are not; in JavaScript, objects and arrays are mutable while strings and numbers are not."
            },
            {
              "t": "p",
              "x": "Mutability only becomes dangerous in combination with aliasing — two or more names referring to the same object. Either alone is manageable. Together, a change made through one name appears through the other, possibly in a distant part of the program that had no idea it was sharing."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 250\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"26\" font-size=\"12\" fill=\"#666D72\">shallow copy</text>\n<rect x=\"60\" y=\"52\" width=\"86\" height=\"38\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"103\" y=\"76\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">x</text>\n<rect x=\"60\" y=\"132\" width=\"86\" height=\"38\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"103\" y=\"156\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">y</text>\n<rect x=\"180\" y=\"46\" width=\"96\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"228\" y=\"76\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">outer</text>\n<rect x=\"180\" y=\"126\" width=\"96\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"228\" y=\"156\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">outer copy</text>\n<rect x=\"310\" y=\"86\" width=\"120\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.5\"/><text x=\"370.0\" y=\"108\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">[0, 0]</text><text x=\"370.0\" y=\"124\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">inner, shared</text>\n<line x1=\"146\" y1=\"71\" x2=\"176\" y2=\"71\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/><circle cx=\"146\" cy=\"71\" r=\"3\" fill=\"#9AA1A6\"/><path d=\"M167 66 L176 71 L167 76\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/>\n<line x1=\"146\" y1=\"151\" x2=\"176\" y2=\"151\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/><circle cx=\"146\" cy=\"151\" r=\"3\" fill=\"#9AA1A6\"/><path d=\"M167 146 L176 151 L167 156\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/>\n<line x1=\"276\" y1=\"71\" x2=\"306\" y2=\"102\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/><circle cx=\"276\" cy=\"71\" r=\"3\" fill=\"#9AA1A6\"/><path d=\"M297 97 L306 102 L297 107\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/>\n<line x1=\"276\" y1=\"151\" x2=\"306\" y2=\"116\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/><circle cx=\"276\" cy=\"151\" r=\"3\" fill=\"#9AA1A6\"/><path d=\"M297 111 L306 116 L297 121\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.5\"/>\n<text x=\"450\" y=\"102\" font-size=\"13\" fill=\"#9AA1A6\">The outer list was</text>\n<text x=\"450\" y=\"122\" font-size=\"13\" fill=\"#9AA1A6\">duplicated; the inner</text>\n<text x=\"450\" y=\"142\" font-size=\"13\" fill=\"#9AA1A6\">one was not.</text>\n<text x=\"60\" y=\"222\" font-size=\"13\" fill=\"#9AA1A6\">y = x.copy(); y[0][0] = 9  →  x[0][0] is also 9</text>\n<text x=\"60\" y=\"242\" font-size=\"12.5\" fill=\"#666D72\">Only deepcopy follows the references all the way down.</text>\n</svg>",
              "cap": "A shallow copy duplicates the outer container and shares everything inside it. The copy is independent at exactly one level, and no deeper."
            },
            {
              "t": "worked",
              "q": "x = [[0, 0], [0, 0]]; y = x.copy(); y[0][0] = 9. What is x[0][0]?",
              "steps": [
                "copy() creates a new outer list.",
                "But it fills that list with the same inner list references.",
                "So x[0] and y[0] are the same object.",
                "Mutating through either is visible through both."
              ],
              "answer": "9. Use copy.deepcopy to duplicate all the way down — at the cost of walking the entire structure, which is why it is not the default."
            },
            {
              "t": "p",
              "x": "Two habits keep this manageable. Prefer immutable values where you can: an object nobody can change is an object nobody can change behind your back, which is why functional programming makes so much of it, and why frozen dataclasses and readonly fields exist. And when you must share mutable state, make the sharing explicit and narrow rather than incidental."
            },
            {
              "t": "note",
              "x": "The most common practical instance of this bug is a mutable default argument. In Python, <code>def f(items=[])</code> evaluates that list once when the function is defined, not on each call — so every call that omits the argument shares one list, and it accumulates across calls. The fix is <code>def f(items=None)</code> with the list created inside. This trips up experienced people, because it looks like it should be per-call."
            }
          ]
        },
        {
          "title": "Scope and lifetime",
          "blocks": [
            {
              "t": "p",
              "x": "Scope is the region of code where a name is visible. Lifetime is how long the object it refers to exists. The two are related but not the same, and keeping them distinct clears up a lot."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"60\" y=\"40\" width=\"330\" height=\"170\" rx=\"8\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"74\" y=\"60\" font-size=\"12\" fill=\"#666D72\">global</text>\n<text x=\"74\" y=\"84\" font-size=\"13.5\" fill=\"#9AA1A6\" class=\"mono\">x = 1</text>\n<rect x=\"90\" y=\"98\" width=\"280\" height=\"98\" rx=\"8\" fill=\"#EDEFF0\" opacity=\"0.04\"/>\n<rect x=\"90\" y=\"98\" width=\"280\" height=\"98\" rx=\"8\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.2\"/>\n<text x=\"104\" y=\"118\" font-size=\"12\" fill=\"#666D72\">function</text>\n<text x=\"104\" y=\"142\" font-size=\"13.5\" fill=\"#EDEFF0\" class=\"mono\">x = 2</text>\n<rect x=\"120\" y=\"152\" width=\"230\" height=\"34\" rx=\"7\" fill=\"#EDEFF0\" opacity=\"0.06\"/>\n<rect x=\"120\" y=\"152\" width=\"230\" height=\"34\" rx=\"7\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"134\" y=\"174\" font-size=\"13.5\" fill=\"#EDEFF0\" class=\"mono\">print(x)  →  2</text>\n<text x=\"420\" y=\"86\" font-size=\"13.5\" fill=\"#9AA1A6\">A name is resolved by searching</text>\n<text x=\"420\" y=\"108\" font-size=\"13.5\" fill=\"#9AA1A6\">outward from the innermost scope</text>\n<text x=\"420\" y=\"130\" font-size=\"13.5\" fill=\"#9AA1A6\">until it is found.</text>\n<text x=\"420\" y=\"166\" font-size=\"13.5\" fill=\"#9AA1A6\">The inner x shadows the outer one</text>\n<text x=\"420\" y=\"188\" font-size=\"13.5\" fill=\"#9AA1A6\">and disappears when the block ends.</text>\n</svg>",
              "cap": "Name resolution searches outward from the innermost enclosing scope. An inner binding shadows an outer one for the duration of its block."
            },
            {
              "t": "p",
              "x": "Most languages scope names lexically: which name a piece of code refers to is determined by where it is written, not by who called it. This is what allows you to read a function and know what its names mean without tracing the call stack. Dynamic scoping, where a name resolves according to the runtime call chain, has been tried and largely abandoned for exactly the reason you would expect."
            },
            {
              "t": "p",
              "x": "JavaScript's history is a useful illustration. var is function-scoped and hoisted, so a variable declared inside a loop is visible after it and shared across iterations. let and const are block-scoped, creating a fresh binding per iteration. This is the whole explanation for the classic closure-in-a-loop bug: with var, all the closures capture one binding whose final value is the loop's end value; with let, each captures its own."
            },
            {
              "t": "code",
              "x": "for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));\n// 3, 3, 3   — one shared binding\n\nfor (let i = 0; i < 3; i++) setTimeout(() => console.log(i));\n// 0, 1, 2   — a fresh binding each iteration"
            },
            {
              "t": "p",
              "x": "Lifetime is governed separately. A local variable's slot lives in the stack frame and disappears when the function returns — but the object it referred to may outlive it if something else still refers to it. That is exactly how closures work: the inner function keeps the captured object alive after the enclosing call has finished. In a garbage-collected language, an object lives as long as it is reachable; in C, you decide, and getting it wrong gives you a dangling pointer or a leak."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Predict each answer before checking. If your prediction relies on the box model, that is exactly the case worth studying."
            }
          ],
          "exercises": [
            {
              "q": "a = [1, 2]; b = a; b = [3, 4]. What is a?",
              "steps": [
                "b = a binds b to the same list as a.",
                "b = [3, 4] creates a new list and rebinds b to it.",
                "Rebinding a name changes what that name refers to, and nothing else.",
                "a's binding was never touched."
              ],
              "answer": "[1, 2]. Compare with b.append(3), which mutates the shared object and does change a. Rebinding and mutating are different actions with different consequences.",
              "kind": "mc",
              "options": [
                "[1, 2]",
                "[3, 4]",
                "[1, 2, 3, 4]",
                "It raises an error"
              ],
              "correct": 0
            },
            {
              "q": "def f(lst): lst.append(1). Then x = []; f(x). What is x? What if f did lst = [1] instead?",
              "steps": [
                "The parameter receives a copy of the reference, pointing at the same list.",
                "append mutates that shared list, so the caller sees [1].",
                "lst = [1] rebinds the local parameter name to a new list.",
                "The caller's binding is unaffected by that rebinding."
              ],
              "answer": "[1] in the first case, [] in the second. This single pair of cases is the clearest statement of what \"references passed by value\" means.",
              "kind": "mc",
              "options": [
                "[1] in the first case, [] in the second",
                "[] then [1]",
                "[1] in both cases",
                "[] in both cases"
              ],
              "correct": 0
            },
            {
              "q": "In Python, why does def f(items=[]) accumulate across calls?",
              "steps": [
                "Default arguments are evaluated once, when the def statement executes.",
                "That single list object is stored on the function and reused for every call that omits the argument.",
                "Appending mutates it, and the mutation persists to the next call.",
                "Each call is not getting a fresh empty list, as the syntax suggests."
              ],
              "answer": "The default is one shared object, created at definition time. Write items=None and create the list inside the body.",
              "kind": "mc",
              "options": [
                "The default list is created once when the function is defined and reused by every call",
                "Python caches the return value of the function",
                "The list is implicitly global",
                "Each call copies the previous call's list"
              ],
              "correct": 0
            },
            {
              "q": "What does this log? let x = 'outer'; function f() { console.log(x); let x = 'inner'; } f()",
              "steps": [
                "let bindings are block-scoped and hoisted to the top of their block, but not initialised.",
                "Between the top of the block and the declaration, x exists but cannot be read — the temporal dead zone.",
                "The console.log refers to the inner x, not the outer one, because lexical scope is decided by position.",
                "Reading it before initialisation throws."
              ],
              "answer": "A ReferenceError, not 'outer'. Shadowing takes effect for the whole block, so the outer x is unreachable there — with var this would instead log undefined.",
              "kind": "mc",
              "options": [
                "A ReferenceError",
                "'outer'",
                "undefined",
                "'inner'"
              ],
              "correct": 0
            },
            {
              "q": "Tuples are immutable in Python, so why can t = ([1], [2]); t[0].append(3) succeed?",
              "steps": [
                "Immutability of the tuple means its bindings cannot be changed.",
                "You cannot reassign t[0] to a different object.",
                "But t[0] refers to a list, and that list is mutable.",
                "Appending changes the list, not which object the tuple refers to."
              ],
              "answer": "The tuple is unchanged — it still refers to the same two lists. Immutability is shallow by default, which is also why a tuple containing a list is unhashable and cannot be a dictionary key.",
              "kind": "mc",
              "options": [
                "The tuple's bindings cannot change, but the objects they refer to can",
                "Tuples are secretly mutable",
                "The append silently does nothing",
                "It raises a TypeError"
              ],
              "correct": 0
            },
            {
              "q": "Which of these are meaningfully different: static vs dynamic typing, strong vs weak typing?",
              "steps": [
                "Static versus dynamic is about <em>when</em> types are checked: before running, or during.",
                "Strong versus weak is about <em>how much</em> implicit conversion the language performs.",
                "Python is dynamic but strong: it will not add a string to a number, but only finds out at runtime.",
                "C is static but comparatively weak: it checks at compile time, then permits casts that reinterpret bytes."
              ],
              "answer": "They are independent axes. All four combinations exist, and conflating them is why 'strongly typed' is used to mean four different things in practice.",
              "kind": "mc",
              "options": [
                "They are independent axes, and all four combinations exist",
                "Strong typing implies static typing",
                "Dynamic typing implies weak typing",
                "They are two names for the same distinction"
              ],
              "correct": 0
            },
            {
              "kind": "write",
              "q": "Two or more names referring to the same underlying object is called ___.",
              "accept": [
                "aliasing",
                "alias"
              ],
              "hint": "one word",
              "steps": [
                "Assignment binds a name; it does not copy the object.",
                "Both names then reach the same thing.",
                "Combined with mutability, a change through one is visible through the other."
              ],
              "answer": "Aliasing. It is harmless with immutable values and the source of most action-at-a-distance bugs with mutable ones."
            },
            {
              "kind": "write",
              "q": "A copy that duplicates the outer container but shares the objects inside it is called a ___ copy.",
              "accept": [
                "shallow"
              ],
              "hint": "one word",
              "steps": [
                "The new container is genuinely separate.",
                "Its slots hold the same references as the original's.",
                "Mutating a nested object is visible through both."
              ],
              "answer": "A shallow copy. Only a deep copy follows the references all the way down, at the cost of walking the whole structure."
            },
            {
              "kind": "write",
              "q": "The region of code in which a name is visible is called its ___.",
              "accept": [
                "scope"
              ],
              "hint": "one word",
              "steps": [
                "Names are resolved by searching outward from the innermost enclosing block.",
                "An inner binding of the same name hides the outer one.",
                "This is determined by where code is written, not by who called it."
              ],
              "answer": "Scope. Lifetime is the separate question of how long the object survives, which closures can extend past the enclosing call."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Aliasing",
          "Two or more names referring to one object."
        ],
        [
          "Binding",
          "The association between a name and an object. Assignment creates or changes it."
        ],
        [
          "Closure",
          "A function that captures and keeps alive variables from its enclosing scope."
        ],
        [
          "Coercion",
          "Implicit conversion between types, as when + turns a number into a string."
        ],
        [
          "Composite",
          "A type built from others: arrays, structs, objects, tuples."
        ],
        [
          "Deep copy",
          "Duplicates the whole structure, following references all the way down."
        ],
        [
          "Dynamic typing",
          "Types are checked as the program runs. Errors surface when the line executes, if it executes."
        ],
        [
          "Immutable",
          "Unchangeable after creation; operations produce new objects instead."
        ],
        [
          "Lexical scoping",
          "Resolving names by where code is written, rather than by the runtime call chain."
        ],
        [
          "Lifetime",
          "How long an object exists — governed by reachability, not by scope."
        ],
        [
          "Mutable",
          "Able to be changed in place after creation."
        ],
        [
          "Primitive",
          "A value the machine handles directly: integer, float, boolean, character. Typically stored inline."
        ],
        [
          "Scope",
          "The region of code where a name is visible."
        ],
        [
          "Shadowing",
          "An inner binding hiding an outer one of the same name."
        ],
        [
          "Shallow copy",
          "Duplicates the outer container, shares everything inside."
        ],
        [
          "Static typing",
          "Types are checked before the program runs. Errors are caught at compile time."
        ],
        [
          "Strong / weak typing",
          "How willing the language is to convert between types implicitly. Orthogonal to static versus dynamic, though the terms are often confused."
        ],
        [
          "Temporal dead zone",
          "The region between the top of a block and a let declaration, where the name exists but cannot be read."
        ]
      ]
    },
  "binary": {
      "title": "Bits and binary",
      "blurb": "How a machine represents numbers, text and everything else using nothing but two states — and where that representation leaks.",
      "chapters": [
        {
          "title": "Why two states",
          "blocks": [
            {
              "t": "p",
              "x": "A computer is a very large collection of switches. Each switch is either carrying enough voltage to count as on, or it is not. That is the whole physical foundation, and every other idea in computing is built on top of it."
            },
            {
              "t": "p",
              "x": "The natural question is why two. We count in ten, and a machine that stored digits 0 through 9 directly would need no conversion at all. The answer is noise. A wire's voltage is never exact — it sags under load, picks up interference from neighbouring wires, and drifts with temperature. If ten voltage levels had to be told apart between 0 and 5 volts, each level would get half a volt of room, and a little interference would turn a 6 into a 7. With two levels, anything below about 0.8 volts is 0 and anything above about 2 volts is 1, and the wide empty gap between them means a signal has to be badly corrupted before it is misread."
            },
            {
              "t": "p",
              "x": "This is the trade the whole field is built on: give up density of representation, buy enormous reliability. A single wire carries less information, so you use more wires. Sixty-four of them side by side is a perfectly ordinary thing for a processor to have."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<line x1=\"60\" y1=\"102\" x2=\"640\" y2=\"102\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/>\n<line x1=\"60\" y1=\"131\" x2=\"640\" y2=\"131\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/>\n<rect x=\"60\" y=\"102\" width=\"580\" height=\"29\" fill=\"#EDEFF0\" opacity=\"0.05\"/>\n<text x=\"52\" y=\"106\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">2.0 V</text>\n<text x=\"52\" y=\"135\" text-anchor=\"end\" font-size=\"11\" fill=\"#9AA1A6\">0.8 V</text>\n<text x=\"636\" y=\"120\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">noise margin</text>\n<polyline points=\"60,48 95,42 130,52 165,45 200,50 205,140 240,145 275,138 310,147 340,142 345,46 380,50 415,44 450,52 480,47 515,45 550,51 585,44 620,48\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/>\n<line x1=\"60\" y1=\"165\" x2=\"640\" y2=\"165\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"130\" y=\"188\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">1</text>\n<text x=\"272\" y=\"188\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">0</text>\n<text x=\"412\" y=\"188\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">1</text>\n<text x=\"555\" y=\"188\" text-anchor=\"middle\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">1</text>\n<text x=\"60\" y=\"215\" font-size=\"12\" fill=\"#666D72\">The signal wanders, but never far enough to cross into the other band.</text>\n</svg>",
              "cap": "A real signal is never clean. Because only two bands count, the jitter is discarded on every read and the pattern comes back exactly as sent. Copy an analogue signal a hundred times and it degrades; copy this and it does not."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Bit",
                  "One binary digit, holding 0 or 1. The word is a contraction of binary digit, coined by John Tukey."
                ],
                [
                  "Noise margin",
                  "The voltage gap between what counts as 0 and what counts as 1. Wide margins are why digital signals survive being copied while analogue ones degrade."
                ],
                [
                  "Byte",
                  "Eight bits treated as a unit. Eight is a historical convention, not a law, but it is now universal."
                ],
                [
                  "Word",
                  "The number of bits a processor handles as one natural chunk — 64 on most machines you will use."
                ]
              ]
            },
            {
              "t": "note",
              "x": "Everything in the rest of this booklet — integers, negative numbers, decimals, text, images — is a convention about what a group of bits <em>means</em>. The bits themselves carry no type. A byte holding 01000001 is the number 65, the letter A, or a dark grey pixel, depending entirely on what the reading code decides to do with it. This is worth internalising early: interpretation is imposed from outside, never stored alongside."
            }
          ]
        },
        {
          "title": "Positional notation and base conversion",
          "blocks": [
            {
              "t": "p",
              "x": "You already know how positional notation works; you just apply it so automatically in base ten that it feels like there is nothing to know. The number 4072 means four thousands, no hundreds, seven tens and two ones. Each position is worth ten times the one to its right, and the digits available at each position run from 0 to 9 — one short of the base."
            },
            {
              "t": "p",
              "x": "Binary is the same machinery with the base set to two. Each position is worth twice the one to its right, and the only digits are 0 and 1. The place values run 1, 2, 4, 8, 16, 32, 64, 128, and so on upward. Committing the first ten or so powers of two to memory pays for itself immediately, because it turns conversion from arithmetic into recognition."
            },
            {
              "t": "worked",
              "q": "Convert the byte 10110101 to decimal.",
              "steps": [
                "Write the place values above the bits, right to left: 128, 64, 32, 16, 8, 4, 2, 1.",
                "Line them up with the digits: 1·128, 0·64, 1·32, 1·16, 0·8, 1·4, 0·2, 1·1.",
                "Keep only the positions holding a 1: 128, 32, 16, 4 and 1.",
                "Add them: 128 + 32 = 160, + 16 = 176, + 4 = 180, + 1 = 181."
              ],
              "answer": "181. Reading right to left with doubling place values is the only technique this direction needs."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 175\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"52\" y=\"36\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">worth</text>\n<text x=\"52\" y=\"76\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">bit</text>\n<text x=\"52\" y=\"116\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">adds</text>\n<rect x=\"60\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"89\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"89\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">128</text><text x=\"89\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">128</text><rect x=\"130\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"159\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#666D72\" class=\"mono\">0</text><text x=\"159\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">64</text><text x=\"159\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#3A4145\">—</text><rect x=\"200\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"229\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"229\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">32</text><text x=\"229\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">32</text><rect x=\"270\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"299\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"299\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">16</text><text x=\"299\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">16</text><rect x=\"340\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"369\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#666D72\" class=\"mono\">0</text><text x=\"369\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">8</text><text x=\"369\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#3A4145\">—</text><rect x=\"410\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"439\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"439\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">4</text><text x=\"439\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">4</text><rect x=\"480\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"509\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#666D72\" class=\"mono\">0</text><text x=\"509\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">2</text><text x=\"509\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#3A4145\">—</text><rect x=\"550\" y=\"46\" width=\"58\" height=\"46\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"579\" y=\"76\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"579\" y=\"36\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">1</text><text x=\"579\" y=\"116\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">1</text>\n<line x1=\"60\" y1=\"132\" x2=\"618\" y2=\"132\" stroke=\"#2E3438\"/>\n<text x=\"618\" y=\"158\" text-anchor=\"end\" font-size=\"15\" fill=\"#EDEFF0\">128 + 32 + 16 + 4 + 1 = 181</text>\n</svg>",
              "cap": "Converting 10110101. Each position is worth twice the one to its right, and the value is the sum of the positions holding a 1."
            },
            {
              "t": "h",
              "x": "Going the other way"
            },
            {
              "t": "p",
              "x": "Converting decimal to binary has two standard methods, and it is worth being fluent in both because they suit different situations."
            },
            {
              "t": "p",
              "x": "The first is repeated division by two, reading the remainders bottom to top. It is mechanical and never requires you to know any powers of two, which makes it reliable under pressure."
            },
            {
              "t": "worked",
              "q": "Convert 200 to binary by repeated division.",
              "steps": [
                "200 ÷ 2 = 100 remainder 0. 100 ÷ 2 = 50 remainder 0. 50 ÷ 2 = 25 remainder 0.",
                "25 ÷ 2 = 12 remainder 1. 12 ÷ 2 = 6 remainder 0. 6 ÷ 2 = 3 remainder 0.",
                "3 ÷ 2 = 1 remainder 1. 1 ÷ 2 = 0 remainder 1.",
                "Read the remainders from the last division backwards: 1, 1, 0, 0, 1, 0, 0, 0."
              ],
              "answer": "11001000. Check it: 128 + 64 + 8 = 200."
            },
            {
              "t": "p",
              "x": "The second method is subtracting the largest power of two that fits, repeatedly. It is faster once the powers are familiar, and it builds the intuition that a binary number is just a sum of distinct powers of two."
            },
            {
              "t": "worked",
              "q": "Convert 200 to binary by subtracting powers.",
              "steps": [
                "The largest power of two under 200 is 128. Take it; 72 remains. Place a 1 in the 128 column.",
                "64 fits in 72. Take it; 8 remains. Place a 1 in the 64 column.",
                "32 and 16 do not fit in 8, so both columns get 0.",
                "8 fits exactly; 0 remains. The 4, 2 and 1 columns get 0."
              ],
              "answer": "11001000, matching the division method. Every whole number has exactly one binary representation — this is the uniqueness of base-2 expansion."
            },
            {
              "t": "note",
              "x": "A useful sanity check: an n-bit binary number is odd exactly when its last bit is 1, because every other place value is even. Testing <code>n & 1</code> is the fastest odd/even test there is, and it is why you see it in performance-sensitive code instead of <code>n % 2</code>."
            }
          ]
        },
        {
          "title": "Hexadecimal, and why it exists",
          "blocks": [
            {
              "t": "p",
              "x": "Binary is correct but unreadable. A 32-bit value written out is thirty-two characters of ones and zeros that the eye cannot chunk, and transcribing one by hand is an invitation to error. Hexadecimal — base sixteen — exists to fix exactly this, and it works because sixteen is a power of two."
            },
            {
              "t": "p",
              "x": "Four bits hold sixteen possible values, which is precisely one hex digit. So conversion between binary and hex needs no arithmetic at all: you split the bits into groups of four and translate each group independently. Nothing carries across group boundaries. Decimal has no such property, which is why nobody writes memory addresses in decimal."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Nibble",
                  "Four bits, half a byte, exactly one hex digit. The name is a joke that stuck."
                ],
                [
                  "Hex digits",
                  "0-9 then A-F, where A is 10 and F is 15. Case is conventionally irrelevant."
                ],
                [
                  "0x prefix",
                  "The near-universal marker that a literal is hexadecimal: 0xFF. Binary uses 0b, octal uses 0o or a leading zero."
                ]
              ]
            },
            {
              "t": "worked",
              "q": "Convert 10110101 to hexadecimal, and 0x2F to decimal.",
              "steps": [
                "Split the byte into nibbles: 1011 and 0101.",
                "1011 is 8 + 2 + 1 = 11, which is B. 0101 is 4 + 1 = 5.",
                "So the byte is 0xB5. Note one byte is always exactly two hex digits.",
                "For 0x2F: 2 is worth 2 × 16 = 32, and F is 15. 32 + 15 = 47."
              ],
              "answer": "0xB5, and 47. Since one byte is two hex digits, a hex dump lines up in neat columns — the practical reason the format won."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 210\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"26\" font-size=\"12\" fill=\"#666D72\">high nibble</text>\n<text x=\"330\" y=\"26\" font-size=\"12\" fill=\"#666D72\">low nibble</text>\n<rect x=\"60\" y=\"40\" width=\"180\" height=\"48\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"90\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"130\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">0</text><text x=\"170\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"210\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><path d=\"M150 96 L150 118\" stroke=\"#666D72\" stroke-width=\"1.4\"/><path d=\"M144 112 L150 120 L156 112\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/><text x=\"150\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">8 + 2 + 1 = 11</text><text x=\"150\" y=\"180\" text-anchor=\"middle\" font-size=\"30\" fill=\"#EDEFF0\" class=\"mono\">B</text>\n<rect x=\"330\" y=\"40\" width=\"180\" height=\"48\" rx=\"7\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"360\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">0</text><text x=\"400\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><text x=\"440\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">0</text><text x=\"480\" y=\"72\" text-anchor=\"middle\" font-size=\"20\" fill=\"#EDEFF0\" class=\"mono\">1</text><path d=\"M420 96 L420 118\" stroke=\"#666D72\" stroke-width=\"1.4\"/><path d=\"M414 112 L420 120 L426 112\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.4\"/><text x=\"420\" y=\"146\" text-anchor=\"middle\" font-size=\"13\" fill=\"#9AA1A6\">4 + 1 = 5</text><text x=\"420\" y=\"180\" text-anchor=\"middle\" font-size=\"30\" fill=\"#EDEFF0\" class=\"mono\">5</text>\n<text x=\"600\" y=\"180\" text-anchor=\"end\" font-size=\"22\" fill=\"#EDEFF0\" class=\"mono\">= 0xB5</text>\n<line x1=\"270\" y1=\"40\" x2=\"270\" y2=\"88\" stroke=\"#2E3438\" stroke-dasharray=\"3 3\"/>\n</svg>",
              "cap": "Because 16 is 2⁴, each group of four bits converts independently. No carrying crosses the dashed line, which is why binary-to-hex needs no arithmetic at all."
            },
            {
              "t": "p",
              "x": "You will meet hex constantly: colours on the web as #RRGGBB, where #FF0000 is full red; memory addresses in a debugger; byte values in a network packet dump; and permission masks. Being able to move between the three bases without thinking is a small skill with a very high frequency of use."
            }
          ]
        },
        {
          "title": "Bitwise operations",
          "blocks": [
            {
              "t": "p",
              "x": "Once numbers are bit patterns, you can operate on the bits directly rather than on the value they represent. There are six operations to know, and they act on each bit position independently."
            },
            {
              "t": "terms",
              "items": [
                [
                  "AND (&)",
                  "1 only when both inputs are 1. Used to test or clear bits."
                ],
                [
                  "OR (|)",
                  "1 when either input is 1. Used to set bits."
                ],
                [
                  "XOR (^)",
                  "1 when the inputs differ. Used to toggle bits, and to detect difference."
                ],
                [
                  "NOT (~)",
                  "Flips every bit. Width matters: ~0 is all ones, whose value depends on the type's size."
                ],
                [
                  "Left shift (<<)",
                  "Moves bits toward the high end, filling with zeros. Each shift doubles the value."
                ],
                [
                  "Right shift (>>)",
                  "Moves bits toward the low end. Each shift halves, discarding what falls off the end."
                ]
              ]
            },
            {
              "t": "p",
              "x": "The dominant use of AND and OR is masking: constructing a pattern that selects the bits you care about and ignores the rest. This is how a single integer can hold a dozen independent yes/no settings."
            },
            {
              "t": "worked",
              "q": "A file permission byte uses bit 2 for read, bit 1 for write, bit 0 for execute. Given p = 0b110, test for write, add execute, and remove read.",
              "steps": [
                "Testing: build a mask with only the write bit set, which is 0b010. Compute p & 0b010 = 0b010, which is non-zero, so write is on.",
                "Adding: OR with the execute mask. 0b110 | 0b001 = 0b111.",
                "Removing: AND with the inverse of the read mask. ~0b100 is ...11111011, so 0b111 & ~0b100 = 0b011.",
                "Toggling would be XOR: 0b011 ^ 0b001 = 0b010, turning execute back off."
              ],
              "answer": "Test with &, set with |, clear with & ~mask, toggle with ^. These four idioms cover essentially all flag manipulation you will ever write."
            },
            {
              "t": "p",
              "x": "This is exactly what Unix permissions are. The familiar chmod 755 is three octal digits, one per user class, and each digit is three bits: 7 is 111 (read, write, execute), 5 is 101 (read and execute, no write). Octal survives here precisely because one octal digit is three bits and permissions come in threes."
            },
            {
              "t": "h",
              "x": "Shifts as arithmetic"
            },
            {
              "t": "p",
              "x": "Shifting left by one is multiplication by two; shifting right by one is integer division by two. Compilers do this substitution for you now, so writing x << 3 instead of x * 8 buys nothing but confusion. Shifts remain worth knowing for building masks — 1 << n gives a mask for bit n — and for reading code that predates good optimisers."
            },
            {
              "t": "note",
              "x": "One trap: right shift on negative numbers. An <em>arithmetic</em> shift copies the sign bit inward, preserving the sign, while a <em>logical</em> shift fills with zeros, turning a negative number into a large positive one. C's behaviour on signed types is implementation-defined; Java gives you both, spelled &gt;&gt; and &gt;&gt;&gt;. When it matters, be explicit."
            }
          ]
        },
        {
          "title": "Negative numbers and two's complement",
          "blocks": [
            {
              "t": "p",
              "x": "Nothing in a bit pattern says whether it is signed. The interpretation is a decision made by the type, and the encoding that essentially all hardware settled on is two's complement. It is worth understanding why, because the alternatives fail in instructive ways."
            },
            {
              "t": "p",
              "x": "The obvious approach, sign-magnitude, reserves the top bit for the sign and reads the rest as a magnitude. It has two immediate problems. There are two zeros, 00000000 and 10000000, which must be treated as equal despite differing bit patterns. And addition needs special-case logic: adding a positive to a negative means comparing magnitudes and subtracting, which is a different circuit from ordinary addition."
            },
            {
              "t": "p",
              "x": "Two's complement fixes both. To negate a number, invert every bit and add one. The result is that ordinary binary addition works unchanged across positive and negative values, with no special cases and no second zero. One adder circuit handles everything, which is why the hardware won the argument."
            },
            {
              "t": "worked",
              "q": "Interpret 11110000 as an 8-bit two's complement number.",
              "steps": [
                "The leading bit is 1, so the value is negative.",
                "Invert every bit: 11110000 becomes 00001111.",
                "That is 8 + 4 + 2 + 1 = 15.",
                "Add one to get 16, then apply the negative sign."
              ],
              "answer": "-16. Sanity check by addition: 11110000 + 00010000 = 100000000, which truncates to 00000000 in eight bits. It is the additive inverse of 16, which is what negative sixteen means."
            },
            {
              "t": "h",
              "x": "Range and overflow"
            },
            {
              "t": "p",
              "x": "With n bits, two's complement covers -2ⁿ⁻¹ up to 2ⁿ⁻¹ - 1. For eight bits that is -128 to 127. The range is asymmetric: there is one more negative value than positive, because zero occupies a slot on the positive side. This asymmetry has a sharp edge — the absolute value of the most negative number is not representable, so abs(-128) in an 8-bit type returns -128."
            },
            {
              "t": "worked",
              "q": "What is 127 + 1 in a signed 8-bit type?",
              "steps": [
                "127 is 01111111.",
                "Adding 1 carries all the way up: 10000000.",
                "That pattern's leading bit is 1, so as a signed value it is negative.",
                "Inverting and adding one gives 128, so the value is -128."
              ],
              "answer": "-128. The number wrapped from the largest positive to the most negative. In C this is undefined behaviour for signed types, and compilers exploit that assumption in ways that surprise people."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 -20 660 270\" xmlns=\"http://www.w3.org/2000/svg\">\n<circle cx=\"200\" cy=\"115\" r=\"100\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<line x1=\"200.0\" y1=\"23.0\" x2=\"200.0\" y2=\"7.0\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><line x1=\"203.8\" y1=\"19.1\" x2=\"204.1\" y2=\"11.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"207.5\" y1=\"19.3\" x2=\"208.2\" y2=\"11.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"211.3\" y1=\"19.7\" x2=\"212.2\" y2=\"11.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"215.0\" y1=\"20.2\" x2=\"216.3\" y2=\"12.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"218.7\" y1=\"20.8\" x2=\"220.3\" y2=\"13.0\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"222.4\" y1=\"21.7\" x2=\"224.3\" y2=\"13.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"226.1\" y1=\"22.6\" x2=\"228.2\" y2=\"14.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"229.7\" y1=\"23.7\" x2=\"232.1\" y2=\"16.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"233.2\" y1=\"24.9\" x2=\"236.0\" y2=\"17.4\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"236.7\" y1=\"26.3\" x2=\"239.8\" y2=\"18.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"240.2\" y1=\"27.8\" x2=\"243.5\" y2=\"20.6\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"243.6\" y1=\"29.5\" x2=\"247.2\" y2=\"22.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"246.9\" y1=\"31.2\" x2=\"250.8\" y2=\"24.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"250.2\" y1=\"33.1\" x2=\"254.3\" y2=\"26.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"253.3\" y1=\"35.2\" x2=\"257.8\" y2=\"28.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"254.1\" y1=\"40.6\" x2=\"263.5\" y2=\"27.6\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><line x1=\"259.4\" y1=\"39.6\" x2=\"264.4\" y2=\"33.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"262.3\" y1=\"42.0\" x2=\"267.5\" y2=\"35.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"265.2\" y1=\"44.5\" x2=\"270.6\" y2=\"38.6\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"267.9\" y1=\"47.1\" x2=\"273.5\" y2=\"41.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"270.5\" y1=\"49.8\" x2=\"276.4\" y2=\"44.4\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"273.0\" y1=\"52.7\" x2=\"279.1\" y2=\"47.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"275.4\" y1=\"55.6\" x2=\"281.7\" y2=\"50.6\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"277.7\" y1=\"58.6\" x2=\"284.1\" y2=\"53.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"279.8\" y1=\"61.7\" x2=\"286.5\" y2=\"57.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"281.9\" y1=\"64.8\" x2=\"288.7\" y2=\"60.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"283.8\" y1=\"68.1\" x2=\"290.7\" y2=\"64.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"285.5\" y1=\"71.4\" x2=\"292.7\" y2=\"67.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"287.2\" y1=\"74.8\" x2=\"294.4\" y2=\"71.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"288.7\" y1=\"78.3\" x2=\"296.1\" y2=\"75.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"290.1\" y1=\"81.8\" x2=\"297.6\" y2=\"79.0\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"287.5\" y1=\"86.6\" x2=\"302.7\" y2=\"81.6\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><line x1=\"292.4\" y1=\"88.9\" x2=\"300.1\" y2=\"86.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"293.3\" y1=\"92.6\" x2=\"301.1\" y2=\"90.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"294.2\" y1=\"96.3\" x2=\"302.0\" y2=\"94.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"294.8\" y1=\"100.0\" x2=\"302.7\" y2=\"98.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"295.3\" y1=\"103.7\" x2=\"303.3\" y2=\"102.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"295.7\" y1=\"107.5\" x2=\"303.7\" y2=\"106.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"295.9\" y1=\"111.2\" x2=\"303.9\" y2=\"110.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"296.0\" y1=\"115.0\" x2=\"304.0\" y2=\"115.0\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"295.9\" y1=\"118.8\" x2=\"303.9\" y2=\"119.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"295.7\" y1=\"122.5\" x2=\"303.7\" y2=\"123.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"295.3\" y1=\"126.3\" x2=\"303.3\" y2=\"127.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"294.8\" y1=\"130.0\" x2=\"302.7\" y2=\"131.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"294.2\" y1=\"133.7\" x2=\"302.0\" y2=\"135.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"293.3\" y1=\"137.4\" x2=\"301.1\" y2=\"139.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"292.4\" y1=\"141.1\" x2=\"300.1\" y2=\"143.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"287.5\" y1=\"143.4\" x2=\"302.7\" y2=\"148.4\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><line x1=\"290.1\" y1=\"148.2\" x2=\"297.6\" y2=\"151.0\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"288.7\" y1=\"151.7\" x2=\"296.1\" y2=\"154.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"287.2\" y1=\"155.2\" x2=\"294.4\" y2=\"158.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"285.5\" y1=\"158.6\" x2=\"292.7\" y2=\"162.2\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"283.8\" y1=\"161.9\" x2=\"290.7\" y2=\"165.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"281.9\" y1=\"165.2\" x2=\"288.7\" y2=\"169.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"279.8\" y1=\"168.3\" x2=\"286.5\" y2=\"172.8\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"277.7\" y1=\"171.4\" x2=\"284.1\" y2=\"176.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"275.4\" y1=\"174.4\" x2=\"281.7\" y2=\"179.4\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"273.0\" y1=\"177.3\" x2=\"279.1\" y2=\"182.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"270.5\" y1=\"180.2\" x2=\"276.4\" y2=\"185.6\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"267.9\" y1=\"182.9\" x2=\"273.5\" y2=\"188.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"265.2\" y1=\"185.5\" x2=\"270.6\" y2=\"191.4\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"262.3\" y1=\"188.0\" x2=\"267.5\" y2=\"194.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"259.4\" y1=\"190.4\" x2=\"264.4\" y2=\"196.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"254.1\" y1=\"189.4\" x2=\"263.5\" y2=\"202.4\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><line x1=\"253.3\" y1=\"194.8\" x2=\"257.8\" y2=\"201.5\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"250.2\" y1=\"196.9\" x2=\"254.3\" y2=\"203.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"246.9\" y1=\"198.8\" x2=\"250.8\" y2=\"205.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"243.6\" y1=\"200.5\" x2=\"247.2\" y2=\"207.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"240.2\" y1=\"202.2\" x2=\"243.5\" y2=\"209.4\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"236.7\" y1=\"203.7\" x2=\"239.8\" y2=\"211.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"233.2\" y1=\"205.1\" x2=\"236.0\" y2=\"212.6\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"229.7\" y1=\"206.3\" x2=\"232.1\" y2=\"213.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"226.1\" y1=\"207.4\" x2=\"228.2\" y2=\"215.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"222.4\" y1=\"208.3\" x2=\"224.3\" y2=\"216.1\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"218.7\" y1=\"209.2\" x2=\"220.3\" y2=\"217.0\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"215.0\" y1=\"209.8\" x2=\"216.3\" y2=\"217.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"211.3\" y1=\"210.3\" x2=\"212.2\" y2=\"218.3\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"207.5\" y1=\"210.7\" x2=\"208.2\" y2=\"218.7\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"203.8\" y1=\"210.9\" x2=\"204.1\" y2=\"218.9\" stroke=\"#EDEFF0\" stroke-width=\"0.7\"/><line x1=\"200.0\" y1=\"207.0\" x2=\"200.0\" y2=\"223.0\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><line x1=\"196.2\" y1=\"210.9\" x2=\"195.9\" y2=\"218.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"192.5\" y1=\"210.7\" x2=\"191.8\" y2=\"218.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"188.7\" y1=\"210.3\" x2=\"187.8\" y2=\"218.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"185.0\" y1=\"209.8\" x2=\"183.7\" y2=\"217.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"181.3\" y1=\"209.2\" x2=\"179.7\" y2=\"217.0\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"177.6\" y1=\"208.3\" x2=\"175.7\" y2=\"216.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"173.9\" y1=\"207.4\" x2=\"171.8\" y2=\"215.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"170.3\" y1=\"206.3\" x2=\"167.9\" y2=\"213.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"166.8\" y1=\"205.1\" x2=\"164.0\" y2=\"212.6\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"163.3\" y1=\"203.7\" x2=\"160.2\" y2=\"211.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"159.8\" y1=\"202.2\" x2=\"156.5\" y2=\"209.4\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"156.4\" y1=\"200.5\" x2=\"152.8\" y2=\"207.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"153.1\" y1=\"198.8\" x2=\"149.2\" y2=\"205.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"149.8\" y1=\"196.9\" x2=\"145.7\" y2=\"203.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"146.7\" y1=\"194.8\" x2=\"142.2\" y2=\"201.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"145.9\" y1=\"189.4\" x2=\"136.5\" y2=\"202.4\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><line x1=\"140.6\" y1=\"190.4\" x2=\"135.6\" y2=\"196.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"137.7\" y1=\"188.0\" x2=\"132.5\" y2=\"194.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"134.8\" y1=\"185.5\" x2=\"129.4\" y2=\"191.4\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"132.1\" y1=\"182.9\" x2=\"126.5\" y2=\"188.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"129.5\" y1=\"180.2\" x2=\"123.6\" y2=\"185.6\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"127.0\" y1=\"177.3\" x2=\"120.9\" y2=\"182.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"124.6\" y1=\"174.4\" x2=\"118.3\" y2=\"179.4\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"122.3\" y1=\"171.4\" x2=\"115.9\" y2=\"176.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"120.2\" y1=\"168.3\" x2=\"113.5\" y2=\"172.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"118.1\" y1=\"165.2\" x2=\"111.3\" y2=\"169.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"116.2\" y1=\"161.9\" x2=\"109.3\" y2=\"165.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"114.5\" y1=\"158.6\" x2=\"107.3\" y2=\"162.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"112.8\" y1=\"155.2\" x2=\"105.6\" y2=\"158.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"111.3\" y1=\"151.7\" x2=\"103.9\" y2=\"154.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"109.9\" y1=\"148.2\" x2=\"102.4\" y2=\"151.0\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"112.5\" y1=\"143.4\" x2=\"97.3\" y2=\"148.4\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><line x1=\"107.6\" y1=\"141.1\" x2=\"99.9\" y2=\"143.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"106.7\" y1=\"137.4\" x2=\"98.9\" y2=\"139.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"105.8\" y1=\"133.7\" x2=\"98.0\" y2=\"135.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"105.2\" y1=\"130.0\" x2=\"97.3\" y2=\"131.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.7\" y1=\"126.3\" x2=\"96.7\" y2=\"127.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.3\" y1=\"122.5\" x2=\"96.3\" y2=\"123.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.1\" y1=\"118.8\" x2=\"96.1\" y2=\"119.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.0\" y1=\"115.0\" x2=\"96.0\" y2=\"115.0\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.1\" y1=\"111.2\" x2=\"96.1\" y2=\"110.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.3\" y1=\"107.5\" x2=\"96.3\" y2=\"106.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"104.7\" y1=\"103.7\" x2=\"96.7\" y2=\"102.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"105.2\" y1=\"100.0\" x2=\"97.3\" y2=\"98.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"105.8\" y1=\"96.3\" x2=\"98.0\" y2=\"94.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"106.7\" y1=\"92.6\" x2=\"98.9\" y2=\"90.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"107.6\" y1=\"88.9\" x2=\"99.9\" y2=\"86.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"112.5\" y1=\"86.6\" x2=\"97.3\" y2=\"81.6\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><line x1=\"109.9\" y1=\"81.8\" x2=\"102.4\" y2=\"79.0\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"111.3\" y1=\"78.3\" x2=\"103.9\" y2=\"75.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"112.8\" y1=\"74.8\" x2=\"105.6\" y2=\"71.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"114.5\" y1=\"71.4\" x2=\"107.3\" y2=\"67.8\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"116.2\" y1=\"68.1\" x2=\"109.3\" y2=\"64.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"118.1\" y1=\"64.8\" x2=\"111.3\" y2=\"60.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"120.2\" y1=\"61.7\" x2=\"113.5\" y2=\"57.2\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"122.3\" y1=\"58.6\" x2=\"115.9\" y2=\"53.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"124.6\" y1=\"55.6\" x2=\"118.3\" y2=\"50.6\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"127.0\" y1=\"52.7\" x2=\"120.9\" y2=\"47.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"129.5\" y1=\"49.8\" x2=\"123.6\" y2=\"44.4\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"132.1\" y1=\"47.1\" x2=\"126.5\" y2=\"41.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"134.8\" y1=\"44.5\" x2=\"129.4\" y2=\"38.6\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"137.7\" y1=\"42.0\" x2=\"132.5\" y2=\"35.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"140.6\" y1=\"39.6\" x2=\"135.6\" y2=\"33.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"145.9\" y1=\"40.6\" x2=\"136.5\" y2=\"27.6\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><line x1=\"146.7\" y1=\"35.2\" x2=\"142.2\" y2=\"28.5\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"149.8\" y1=\"33.1\" x2=\"145.7\" y2=\"26.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"153.1\" y1=\"31.2\" x2=\"149.2\" y2=\"24.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"156.4\" y1=\"29.5\" x2=\"152.8\" y2=\"22.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"159.8\" y1=\"27.8\" x2=\"156.5\" y2=\"20.6\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"163.3\" y1=\"26.3\" x2=\"160.2\" y2=\"18.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"166.8\" y1=\"24.9\" x2=\"164.0\" y2=\"17.4\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"170.3\" y1=\"23.7\" x2=\"167.9\" y2=\"16.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"173.9\" y1=\"22.6\" x2=\"171.8\" y2=\"14.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"177.6\" y1=\"21.7\" x2=\"175.7\" y2=\"13.9\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"181.3\" y1=\"20.8\" x2=\"179.7\" y2=\"13.0\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"185.0\" y1=\"20.2\" x2=\"183.7\" y2=\"12.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"188.7\" y1=\"19.7\" x2=\"187.8\" y2=\"11.7\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"192.5\" y1=\"19.3\" x2=\"191.8\" y2=\"11.3\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><line x1=\"196.2\" y1=\"19.1\" x2=\"195.9\" y2=\"11.1\" stroke=\"#9AA1A6\" stroke-width=\"0.7\"/><text x=\"200.0\" y=\"-5.0\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">0</text><text x=\"317.9\" y=\"80.7\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">64</text><text x=\"272.9\" y=\"219.3\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">127</text><text x=\"127.1\" y=\"219.3\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">-128</text><text x=\"82.1\" y=\"80.7\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">-64</text>\n<path d=\"M258 44 A100 100 0 0 1 262 52\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<path d=\"M252 36 L266 46 L254 56\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.8\"/>\n<text x=\"360\" y=\"66\" font-size=\"14\" fill=\"#EDEFF0\">Counting up from 127 does not</text>\n<text x=\"360\" y=\"88\" font-size=\"14\" fill=\"#EDEFF0\">reach 128. It reaches -128.</text>\n<text x=\"360\" y=\"122\" font-size=\"13\" fill=\"#9AA1A6\">The eight bits form a closed ring of</text>\n<text x=\"360\" y=\"142\" font-size=\"13\" fill=\"#9AA1A6\">256 values. Signed and unsigned differ</text>\n<text x=\"360\" y=\"162\" font-size=\"13\" fill=\"#9AA1A6\">only in where the ring is cut.</text>\n<text x=\"360\" y=\"196\" font-size=\"12\" fill=\"#666D72\" class=\"mono\">01111111 + 1 = 10000000</text>\n</svg>",
              "cap": "Eight bits form a ring of 256 values. Unsigned cuts the ring at 0 and counts to 255; signed cuts it at -128 and counts through 0 to 127. Overflow is just the ring closing."
            },
            {
              "t": "note",
              "x": "This is not academic. The Ariane 5 rocket was destroyed in 1996 by an overflow converting a 64-bit float to a 16-bit signed integer. Aircraft, spreadsheets and video games have all shipped bugs that were, at bottom, a number leaving its range. When a value can grow without bound, the type must be chosen deliberately."
            }
          ]
        },
        {
          "title": "Fractions and floating point",
          "blocks": [
            {
              "t": "p",
              "x": "Whole numbers are the easy case. Fractions force a choice, because a fixed number of bits cannot represent an infinite set of real numbers, and the two ways of spending those bits have very different consequences."
            },
            {
              "t": "p",
              "x": "Fixed point picks a spot for the binary point and leaves it there — say, sixteen bits of whole number and sixteen of fraction. Arithmetic is then ordinary integer arithmetic with a shift, so it is fast and exact within its range. The cost is inflexibility: the same format must handle both astronomical and microscopic values, and it cannot."
            },
            {
              "t": "p",
              "x": "Floating point instead stores a number in scientific notation: a sign, a fraction (the mantissa or significand), and an exponent saying where the point goes. This buys enormous range — a float64 spans roughly 10⁻³⁰⁸ to 10³⁰⁸ — at the price of variable precision. Numbers near zero are packed densely; numbers in the billions are spaced far apart."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Sign bit",
                  "1 bit. 0 for positive, 1 for negative."
                ],
                [
                  "Exponent",
                  "11 bits in a float64, stored with a bias of 1023 so it can represent negative exponents without its own sign."
                ],
                [
                  "Mantissa",
                  "52 stored bits. A leading 1 is implied and not stored, giving 53 bits of effective precision — about 15 to 17 decimal digits."
                ],
                [
                  "float32",
                  "The same scheme with 8 exponent bits and 23 mantissa bits. Roughly 7 decimal digits, which is why it is the default in machine learning where precision matters less than memory."
                ]
              ]
            },
            {
              "t": "worked",
              "q": "Represent 6.5 as a float64.",
              "steps": [
                "Write it in binary: 6 is 110 and 0.5 is the first fractional place, so 6.5 is 110.1.",
                "Normalise so exactly one 1 sits left of the point: 1.101 × 2².",
                "The exponent is 2, stored biased: 2 + 1023 = 1025, which is 10000000001.",
                "The mantissa stores the bits after the leading 1: 101 followed by 49 zeros. The sign bit is 0."
              ],
              "answer": "0 10000000001 1010000…0. Exact, because 6.5 is a sum of powers of two. Numbers that are not, are where the trouble starts."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"60\" y=\"40\" width=\"34\" height=\"44\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<rect x=\"98\" y=\"40\" width=\"150\" height=\"44\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<rect x=\"252\" y=\"40\" width=\"348\" height=\"44\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"77\" y=\"30\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">1 bit</text>\n<text x=\"173\" y=\"30\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">11 bits</text>\n<text x=\"426\" y=\"30\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">52 bits</text>\n<text x=\"77\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">sign</text>\n<text x=\"173\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">exponent</text>\n<text x=\"426\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">mantissa</text>\n<text x=\"60\" y=\"112\" font-size=\"12\" fill=\"#666D72\">6.5 stored as:</text>\n<text x=\"77\" y=\"140\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">0</text>\n<text x=\"173\" y=\"140\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">10000000001</text>\n<text x=\"426\" y=\"140\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">1010000000 … 0</text>\n<line x1=\"60\" y1=\"156\" x2=\"600\" y2=\"156\" stroke=\"#2E3438\"/>\n<text x=\"60\" y=\"180\" font-size=\"13\" fill=\"#9AA1A6\">6.5 = 110.1 in binary = 1.101 × 2². Exponent 2 is stored biased as 2 + 1023 = 1025;</text>\n<text x=\"60\" y=\"200\" font-size=\"13\" fill=\"#9AA1A6\">the leading 1 is implied, so only 101 is kept in the mantissa.</text>\n</svg>",
              "cap": "The three fields of a float64. Widening the exponent buys range; widening the mantissa buys precision. float32 splits the same trade 1 / 8 / 23."
            },
            {
              "t": "h",
              "x": "The 0.1 problem"
            },
            {
              "t": "p",
              "x": "In base ten, one third has no finite representation — 0.3333… repeats forever. Which fractions repeat depends on the base: a fraction terminates only when its denominator's prime factors divide the base. Base ten is 2 × 5, so tenths and fifths terminate. Base two has only the factor 2, so one tenth repeats forever in binary."
            },
            {
              "t": "p",
              "x": "This means 0.1 cannot be stored exactly in any binary floating point format. It is rounded to the nearest representable value, which is very slightly more than a tenth. So is 0.2. Adding the two rounded values and rounding again gives a result that is not the stored value of 0.3."
            },
            {
              "t": "code",
              "x": "0.1 + 0.2 === 0.3        // false\n0.1 + 0.2               // 0.30000000000000004\n\n// compare with a tolerance instead\nMath.abs(a - b) < 1e-9  // true"
            },
            {
              "t": "p",
              "x": "The consequences are practical. Never test floating point values for exact equality; compare against a small tolerance chosen for your domain. Never accumulate money in floats — store integer cents, or use a decimal type. And never assume a sum is order-independent: floating point addition is not associative, so (a + b) + c can differ from a + (b + c), which is why parallel reductions can produce results that vary between runs."
            },
            {
              "t": "note",
              "x": "Three special values complete the picture. Infinity results from overflow or division of a non-zero by zero. NaN, not-a-number, results from 0/0 and similar, and has the peculiar property that NaN !== NaN — the standard way to test for it. And there are two zeros, +0 and -0, which compare equal but behave differently: 1/+0 is Infinity and 1/-0 is -Infinity."
            }
          ]
        },
        {
          "title": "Representing text",
          "blocks": [
            {
              "t": "p",
              "x": "Text is the last major representation, and it is where the assumption that a character is a byte causes the most damage. It is worth walking through how the situation arrived at where it is."
            },
            {
              "t": "p",
              "x": "ASCII, standardised in 1963, assigns the numbers 0 to 127 to English letters, digits, punctuation and control codes. Seven bits, so it fits in a byte with one to spare. The layout was designed with care: digits sit at 48 to 57, uppercase at 65 to 90, lowercase at 97 to 122. Uppercase and lowercase differ by exactly 32, which is a single bit, so case conversion is one bitwise operation."
            },
            {
              "t": "worked",
              "q": "Convert 'A' to 'a' using bit manipulation.",
              "steps": [
                "'A' is 65, which is 01000001. 'a' is 97, which is 01100001.",
                "The only difference is bit 5, worth 32.",
                "Setting that bit lowercases: c | 0b00100000.",
                "Clearing it uppercases: c & ~0b00100000."
              ],
              "answer": "A single OR or AND. This trick works only for ASCII letters — applying it to 'é' or 'Σ' produces nonsense, which is exactly why it should stay in the history books."
            },
            {
              "t": "p",
              "x": "The trouble is that 128 characters cover one language. The 1990s produced dozens of incompatible extensions using the eighth bit, and text carried no indication of which one it was written in, so files opened in the wrong region turned to mojibake. Unicode solves the identity problem by assigning every character in every script a unique number called a code point, written U+0041 for A. Unicode defines the numbers; it does not define how to store them."
            },
            {
              "t": "terms",
              "items": [
                [
                  "Code point",
                  "A number identifying a character, from U+0000 to U+10FFFF. About 150,000 are currently assigned."
                ],
                [
                  "Encoding",
                  "A rule for turning code points into bytes. UTF-8, UTF-16 and UTF-32 are three different rules for the same code points."
                ],
                [
                  "UTF-8",
                  "Variable width, one to four bytes. ASCII text is byte-identical to its ASCII encoding, which is the main reason it won the web."
                ],
                [
                  "Grapheme cluster",
                  "What a reader would call a single character, which may be several code points — a letter plus a combining accent, or an emoji with a skin-tone modifier."
                ]
              ]
            },
            {
              "t": "p",
              "x": "UTF-8 encodes a code point in one to four bytes. A byte starting with 0 is a lone ASCII character. A byte starting with 110 begins a two-byte sequence, 1110 begins three, and 11110 begins four. Every continuation byte starts with 10, which makes the encoding self-synchronising: from any position in a stream you can find the next character boundary by scanning for a byte that does not start with 10."
            },
            {
              "t": "worked",
              "q": "Encode é, code point U+00E9, in UTF-8.",
              "steps": [
                "U+00E9 is 233, which is 11101001 in binary — eight bits, too many for the seven a single UTF-8 byte allows.",
                "So use the two-byte form: 110xxxxx 10xxxxxx, which carries eleven payload bits.",
                "Pad the code point to eleven bits: 00011101001, then split as 00011 and 101001.",
                "Fill the templates: 11000011 and 10101001."
              ],
              "answer": "0xC3 0xA9. This is why a file written as UTF-8 and read as Latin-1 shows é as Ã©: the two bytes get interpreted separately."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"24\" font-size=\"11\" fill=\"#666D72\">length</text>\n<text x=\"290\" y=\"24\" font-size=\"11\" fill=\"#666D72\">lead byte</text>\n<text x=\"400\" y=\"24\" font-size=\"11\" fill=\"#666D72\">continuation bytes</text>\n<line x1=\"60\" y1=\"32\" x2=\"600\" y2=\"32\" stroke=\"#2E3438\"/>\n<text x=\"60\" y=\"52\" font-size=\"12.5\" fill=\"#9AA1A6\">1 byte</text><text x=\"128\" y=\"52\" font-size=\"12\" fill=\"#666D72\">U+0000 – U+007F</text><text x=\"290\" y=\"52\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">0xxxxxxx</text><text x=\"400\" y=\"52\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\"></text><text x=\"60\" y=\"86\" font-size=\"12.5\" fill=\"#9AA1A6\">2 bytes</text><text x=\"128\" y=\"86\" font-size=\"12\" fill=\"#666D72\">U+0080 – U+07FF</text><text x=\"290\" y=\"86\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">110xxxxx</text><text x=\"400\" y=\"86\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">10xxxxxx</text><text x=\"60\" y=\"120\" font-size=\"12.5\" fill=\"#9AA1A6\">3 bytes</text><text x=\"128\" y=\"120\" font-size=\"12\" fill=\"#666D72\">U+0800 – U+FFFF</text><text x=\"290\" y=\"120\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">1110xxxx</text><text x=\"400\" y=\"120\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">10xxxxxx 10xxxxxx</text><text x=\"60\" y=\"154\" font-size=\"12.5\" fill=\"#9AA1A6\">4 bytes</text><text x=\"128\" y=\"154\" font-size=\"12\" fill=\"#666D72\">U+10000 – U+10FFFF</text><text x=\"290\" y=\"154\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">11110xxx</text><text x=\"400\" y=\"154\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">10xxxxxx 10xxxxxx 10xxxxxx</text>\n<line x1=\"60\" y1=\"176\" x2=\"600\" y2=\"176\" stroke=\"#2E3438\"/>\n<text x=\"60\" y=\"200\" font-size=\"13\" fill=\"#9AA1A6\">é is U+00E9 = 233 = 11101001, eleven bits when padded: 00011 101001</text>\n<text x=\"60\" y=\"230\" font-size=\"15\" fill=\"#EDEFF0\" class=\"mono\">110<tspan fill=\"#9AA1A6\">00011</tspan>  10<tspan fill=\"#9AA1A6\">101001</tspan>   =   0xC3 0xA9</text>\n</svg>",
              "cap": "UTF-8's byte templates. The lead byte announces the length through its leading ones, and every continuation byte starts 10 — so from any point in a stream you can find the next character boundary by skipping bytes beginning with 10."
            },
            {
              "t": "p",
              "x": "UTF-16, used internally by JavaScript, Java and Windows, uses two bytes for common characters and a four-byte surrogate pair for the rest. This is why \"👍\".length is 2 in JavaScript: length counts 16-bit code units, not characters. And even counting code points is not enough, because a family emoji is several code points joined by zero-width joiners, and an accented letter may be a base letter plus a combining mark."
            },
            {
              "t": "note",
              "x": "The practical rule: decode bytes to text at the boundary of your program, work in text internally, and encode back to bytes on the way out. Never slice a string at a byte offset unless you know it is ASCII. When you need to count or reverse what a human would call characters, use a grapheme-aware library — Intl.Segmenter in JavaScript, the unicodedata and regex modules in Python."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Work these with pen and paper before checking. The first four are mechanical; the last four require reasoning about consequences, which is the part that transfers."
            }
          ],
          "exercises": [
            {
              "q": "Convert 0b11010110 to decimal and to hexadecimal.",
              "steps": [
                "Place values with a 1: 128, 64, 16, 4, 2.",
                "128 + 64 = 192, + 16 = 208, + 4 = 212, + 2 = 214.",
                "For hex, split into nibbles: 1101 and 0110.",
                "1101 is 13, which is D. 0110 is 6."
              ],
              "answer": "214 and 0xD6.",
              "kind": "mc",
              "options": [
                "214 and 0xD6",
                "218 and 0xDA",
                "214 and 0xB6",
                "206 and 0xCE"
              ],
              "correct": 0
            },
            {
              "q": "Convert 173 to binary using both methods, and confirm they agree.",
              "steps": [
                "Subtracting powers: 128 fits, leaving 45. 64 does not fit; 32 does, leaving 13. 16 does not fit; 8 does, leaving 5; 4 leaves 1; 1 leaves 0.",
                "Columns with a 1: 128, 32, 8, 4, 1.",
                "That gives 10101101.",
                "Division check: 173, 86 r1, 43 r0, 21 r1, 10 r1, 5 r0, 2 r1, 1 r0, 0 r1 — read backwards, 10101101."
              ],
              "answer": "10101101, or 0xAD. Both methods agree, as they must.",
              "kind": "mc",
              "options": [
                "10101101",
                "10110101",
                "10101011",
                "11010101"
              ],
              "correct": 0
            },
            {
              "q": "What is 0b1010 & 0b0110, 0b1010 | 0b0110, and 0b1010 ^ 0b0110?",
              "steps": [
                "AND keeps positions where both are 1: only the 2s position qualifies.",
                "OR keeps positions where either is 1: the 8s, 4s and 2s.",
                "XOR keeps positions where they differ: the 8s and the 4s.",
                "Convert each: 0010, 1110, 1100."
              ],
              "answer": "2, 14 and 12. Note that AND + XOR reconstructs OR here, which holds in general: a | b equals (a & b) ^ (a ^ b).",
              "kind": "mc",
              "options": [
                "2, 14 and 12",
                "8, 14 and 6",
                "2, 12 and 14",
                "0, 15 and 12"
              ],
              "correct": 0
            },
            {
              "q": "Interpret 10000001 as unsigned, and as 8-bit two's complement.",
              "steps": [
                "Unsigned, the place values are simply 128 and 1.",
                "Signed, the leading 1 means negative.",
                "Invert: 01111110, which is 126.",
                "Add one: 127, so the value is -127."
              ],
              "answer": "129 unsigned, -127 signed. Same eight bits, two different numbers — the type decides, not the data.",
              "kind": "mc",
              "options": [
                "129 unsigned, −127 signed",
                "129 unsigned, −1 signed",
                "−127 unsigned, 129 signed",
                "129 unsigned, −128 signed"
              ],
              "correct": 0
            },
            {
              "q": "An unsigned 8-bit counter holds 255 and is incremented. A signed one holds 127 and is incremented. What happens in each?",
              "steps": [
                "Unsigned: 11111111 + 1 = 100000000, and the ninth bit is discarded, leaving 00000000.",
                "So the unsigned counter wraps to 0, which is defined and specified behaviour.",
                "Signed: 01111111 + 1 = 10000000, which reads as -128.",
                "In C, signed overflow is undefined behaviour, so the compiler may assume it never happens and optimise accordingly."
              ],
              "answer": "0 and -128. The signed case is the dangerous one, because the compiler is permitted to remove a check like <code>if (x + 1 < x)</code> entirely on the grounds that it can never be true.",
              "kind": "mc",
              "options": [
                "0 and −128",
                "256 and 128",
                "0 and 127",
                "0 and −127"
              ],
              "correct": 0
            },
            {
              "q": "Why does 0.1 + 0.2 !== 0.3, but 0.5 + 0.25 === 0.75?",
              "steps": [
                "A binary fraction terminates only when its denominator is a power of two.",
                "0.5 is 1/2 and 0.25 is 1/4, both exact, and their sum 0.75 is 3/4, also exact.",
                "0.1 is 1/10, whose denominator has a factor of 5, so it repeats forever in binary and must be rounded.",
                "Two rounded operands plus a rounded result puts the sum a few ulps away from the stored value of 0.3."
              ],
              "answer": "Exactness depends on whether the denominator is a power of two. Any fraction whose denominator is not will be approximated.",
              "kind": "mc",
              "options": [
                "0.5 and 0.25 have denominators that are powers of two, so both are stored exactly",
                "0.5 and 0.25 are smaller, so the rounding error is too small to see",
                "0.75 happens to round to the correct value while 0.3 does not",
                "Floats store two decimal places exactly, and 0.1 needs three"
              ],
              "correct": 0
            },
            {
              "q": "A file contains the bytes 0xC3 0xA9. How many characters is that in UTF-8, and what goes wrong if it is read as Latin-1?",
              "steps": [
                "0xC3 is 11000011, and a leading 110 marks the start of a two-byte sequence.",
                "0xA9 is 10101001, and the leading 10 confirms a continuation byte.",
                "Together they decode to one character, U+00E9, é.",
                "Latin-1 maps every byte to its own character, so it yields two: Ã and ©."
              ],
              "answer": "One character in UTF-8, two in Latin-1. This is the entire mechanism behind mojibake.",
              "kind": "mc",
              "options": [
                "One character in UTF-8, two in Latin-1",
                "Two characters in both",
                "One character in both",
                "Two in UTF-8, one in Latin-1"
              ],
              "correct": 0
            },
            {
              "q": "You are storing prices for an online shop. Why is a float the wrong type, and what should you use?",
              "steps": [
                "Prices are decimal fractions, and most cannot be represented exactly in binary floating point.",
                "Small rounding errors accumulate across additions, and a total may end at 19.999999999999996.",
                "Rounding for display hides the error while the stored value stays wrong, so ledgers stop reconciling.",
                "Store an integer count of the smallest unit — cents — or use a decimal type with base-ten semantics."
              ],
              "answer": "Integer cents, or a proper decimal type. The general rule: floats are for measurements, integers and decimals are for counts and money.",
              "kind": "mc",
              "options": [
                "Store an integer count of cents, or use a decimal type",
                "Store floats and round only when displaying",
                "Store floats with more decimal places",
                "Store the price as a string"
              ],
              "correct": 0
            },
            {
              "kind": "write",
              "q": "A group of four bits — exactly one hexadecimal digit — is called a ___.",
              "accept": [
                "nibble"
              ],
              "hint": "one word",
              "steps": [
                "Sixteen is 2⁴, so one hex digit covers exactly four bits.",
                "That is half of an eight-bit byte.",
                "The name is a pun on byte."
              ],
              "answer": "A nibble. Two nibbles make a byte, which is why one byte is always exactly two hex digits."
            },
            {
              "kind": "write",
              "q": "The encoding that represents a negative integer by inverting every bit and adding one is called ___.",
              "accept": [
                "two's complement",
                "twos complement"
              ],
              "hint": "two words",
              "steps": [
                "Sign-magnitude produces two zeros and needs special-case addition.",
                "Inverting and adding one leaves ordinary binary addition working across both signs.",
                "One adder circuit then handles positive and negative alike."
              ],
              "answer": "Two's complement. It is why 127 + 1 wraps to −128 rather than erroring."
            },
            {
              "kind": "write",
              "q": "In a float64, the field holding the significant digits after the implied leading 1 is the ___.",
              "accept": [
                "mantissa",
                "significand"
              ],
              "hint": "one word",
              "steps": [
                "A float64 splits into 1 sign bit, 11 exponent bits and 52 fraction bits.",
                "The leading 1 of the normalised form is implied and not stored.",
                "The stored fraction bits give about 15 to 17 decimal digits of precision."
              ],
              "answer": "The mantissa, also called the significand. Widening it buys precision; widening the exponent buys range."
            }
          ]
        }
      ],
      "vocab": [
        [
          "0x prefix",
          "The near-universal marker that a literal is hexadecimal: 0xFF. Binary uses 0b, octal uses 0o or a leading zero."
        ],
        [
          "AND (&)",
          "1 only when both inputs are 1. Used to test or clear bits."
        ],
        [
          "ASCII",
          "The 7-bit encoding covering English letters, digits and punctuation, occupying code points 0 to 127."
        ],
        [
          "Bit",
          "One binary digit, holding 0 or 1. The word is a contraction of binary digit, coined by John Tukey."
        ],
        [
          "Byte",
          "Eight bits treated as a unit. Eight is a historical convention, not a law, but it is now universal."
        ],
        [
          "Code point",
          "A number identifying a character, from U+0000 to U+10FFFF. About 150,000 are currently assigned."
        ],
        [
          "Encoding",
          "A rule for turning code points into bytes. UTF-8, UTF-16 and UTF-32 are three different rules for the same code points."
        ],
        [
          "Exponent",
          "11 bits in a float64, stored with a bias of 1023 so it can represent negative exponents without its own sign."
        ],
        [
          "float32",
          "The same scheme with 8 exponent bits and 23 mantissa bits. Roughly 7 decimal digits, which is why it is the default in machine learning where precision matters less than memory."
        ],
        [
          "Grapheme cluster",
          "What a reader would call a single character, which may be several code points — a letter plus a combining accent, or an emoji with a skin-tone modifier."
        ],
        [
          "Hex digits",
          "0-9 then A-F, where A is 10 and F is 15. Case is conventionally irrelevant."
        ],
        [
          "Left shift (<<)",
          "Moves bits toward the high end, filling with zeros. Each shift doubles the value."
        ],
        [
          "Machine epsilon",
          "The smallest gap between representable floats near 1, and the scale of unavoidable rounding error."
        ],
        [
          "Mantissa",
          "52 stored bits. A leading 1 is implied and not stored, giving 53 bits of effective precision — about 15 to 17 decimal digits."
        ],
        [
          "Masking",
          "Using AND or OR with a bit pattern to test, set or clear specific bits."
        ],
        [
          "Mojibake",
          "Text corrupted by decoding bytes with the wrong encoding, as when UTF-8 is read as Latin-1."
        ],
        [
          "Nibble",
          "Four bits, half a byte, exactly one hex digit. The name is a joke that stuck."
        ],
        [
          "Noise margin",
          "The voltage gap between what counts as 0 and what counts as 1. Wide margins are why digital signals survive being copied while analogue ones degrade."
        ],
        [
          "Normalisation (floats)",
          "Rewriting a number as 1.something × 2ⁿ so the leading digit is always 1 and need not be stored."
        ],
        [
          "NOT (~)",
          "Flips every bit. Width matters: ~0 is all ones, whose value depends on the type's size."
        ],
        [
          "OR (|)",
          "1 when either input is 1. Used to set bits."
        ],
        [
          "Overflow",
          "A result leaving the range its type can represent, wrapping around rather than growing."
        ],
        [
          "Right shift (>>)",
          "Moves bits toward the low end. Each shift halves, discarding what falls off the end."
        ],
        [
          "Sign bit",
          "1 bit. 0 for positive, 1 for negative."
        ],
        [
          "Two's complement",
          "Representing negatives by inverting all bits and adding one, so one adder handles both signs."
        ],
        [
          "Unicode",
          "The standard assigning a unique code point to every character in every script."
        ],
        [
          "UTF-8",
          "Variable width, one to four bytes. ASCII text is byte-identical to its ASCII encoding, which is the main reason it won the web."
        ],
        [
          "Word",
          "The number of bits a processor handles as one natural chunk — 64 on most machines you will use."
        ],
        [
          "XOR (^)",
          "1 when the inputs differ. Used to toggle bits, and to detect difference."
        ]
      ]
    },
  "functions": {
      "title": "Functions",
      "blurb": "The first real abstraction: a named, reusable unit of behaviour with a contract at its edges, and the stack machinery that makes calling one work.",
      "chapters": [
        {
          "title": "Parameters, return values, and the contract",
          "blocks": [
            {
              "t": "p",
              "x": "A function packages a piece of behaviour behind a name. The point is not merely to avoid retyping code — it is that the caller no longer needs to know how the behaviour is implemented, only what it promises to do given certain inputs. That promise is the function's contract: its parameters describe what it needs, its return value describes what it produces, and anything else it does is a side effect the signature does not advertise."
            },
            {
              "t": "p",
              "x": "Parameters and arguments are often used interchangeably but name different things. A parameter is the name declared in the function's definition; an argument is the actual value supplied at a particular call site. def area(width, height) declares two parameters; area(3, 4) supplies two arguments. The distinction matters once default values, keyword arguments and variadic parameters enter the picture, because then the mapping from arguments to parameters is no longer purely positional."
            },
            {
              "t": "list",
              "items": [
                "<strong>Positional parameters</strong>: matched to arguments by order.",
                "<strong>Keyword parameters</strong>: matched by name, order-independent at the call site.",
                "<strong>Default parameters</strong>: filled in when the caller omits an argument.",
                "<strong>Variadic parameters</strong>: *args / **kwargs style, collecting an unknown number of extras."
              ]
            },
            {
              "t": "p",
              "x": "A side effect is anything a function does besides computing its return value: mutating an argument, writing to a file, printing, changing a global. A function with no side effects, called with the same arguments, always returns the same result — which is exactly the property that makes it easy to test, cache and reason about in isolation. The next chapters build toward why that property is worth protecting."
            },
            {
              "t": "note",
              "x": "A signature is a promise, not a guarantee. Static types can enforce the shapes of parameters and the return value, but nothing in most languages stops a function from silently doing more than its name suggests — which is precisely why <code>get_user(id)</code> that also writes to a database is a design smell: the name lied about the contract."
            }
          ]
        },
        {
          "title": "The call stack",
          "blocks": [
            {
              "t": "p",
              "x": "Every call needs somewhere to keep the caller's place, the arguments it was given, and its own local variables — and that somewhere is a stack frame, also called an activation record. Calling a function pushes a new frame; returning pops it. Because frames are pushed and popped in strict last-in-first-out order, whichever function is deepest in the chain of calls is always the one currently running."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"30\" font-size=\"12\" fill=\"#666D72\">calling main() -&gt; outer() -&gt; inner()</text>\n<rect x=\"40\" y=\"230\" width=\"220\" height=\"46\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"55\" y=\"258\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">main()</text>\n<rect x=\"40\" y=\"176\" width=\"220\" height=\"46\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"55\" y=\"204\" font-size=\"13\" fill=\"#9AA1A6\" class=\"mono\">outer(x=3)</text>\n<rect x=\"40\" y=\"118\" width=\"220\" height=\"46\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"55\" y=\"140\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">inner(y=4)</text>\n<text x=\"55\" y=\"156\" font-size=\"11\" fill=\"#9AA1A6\">return address, y, locals</text>\n<line x1=\"300\" y1=\"30\" x2=\"300\" y2=\"290\" stroke=\"#2E3438\"/>\n<text x=\"330\" y=\"50\" font-size=\"12\" fill=\"#666D72\">what each frame holds</text>\n<text x=\"330\" y=\"76\" font-size=\"13\" fill=\"#9AA1A6\">- the return address (where to resume)</text>\n<text x=\"330\" y=\"98\" font-size=\"13\" fill=\"#9AA1A6\">- the parameters for this call</text>\n<text x=\"330\" y=\"120\" font-size=\"13\" fill=\"#9AA1A6\">- this call's local variables</text>\n<text x=\"330\" y=\"142\" font-size=\"13\" fill=\"#9AA1A6\">- saved registers, if the machine needs them</text>\n<text x=\"330\" y=\"176\" font-size=\"13\" fill=\"#EDEFF0\">inner() cannot see outer()'s frame directly —</text>\n<text x=\"330\" y=\"196\" font-size=\"13\" fill=\"#EDEFF0\">it only reaches x through a parameter</text>\n<text x=\"330\" y=\"216\" font-size=\"13\" fill=\"#EDEFF0\">or a closure.</text>\n<text x=\"40\" y=\"296\" font-size=\"12.5\" fill=\"#666D72\">Stack grows downward here. inner() returns, its frame is popped,</text>\n<text x=\"40\" y=\"314\" font-size=\"12.5\" fill=\"#666D72\">and outer() resumes exactly where it left off.</text>\n</svg>",
              "cap": "Three nested calls, three frames. Each frame holds a return address, its parameters, and its own locals — inner() cannot reach outer()'s x except through what outer() explicitly passed it."
            },
            {
              "t": "p",
              "x": "This is why local variables in different calls never collide, even when two calls to the same function are on the stack at once, as happens in recursion: each call gets its own frame, and therefore its own copy of every local variable and parameter. It is also why the frame's memory is reclaimed automatically the instant the function returns — the stack pointer simply moves back, and there is nothing left to garbage-collect."
            },
            {
              "t": "p",
              "x": "Stack memory is finite and comparatively small — often one or a few megabytes per thread — in contrast to the heap, which is large and used for data whose lifetime the program controls explicitly. Pushing more frames than the stack can hold, most commonly through recursion with no working base case, raises a stack overflow: the one crash whose name describes its own cause."
            },
            {
              "t": "worked",
              "q": "A function f calls g, which calls h. Inside h, an exception is thrown and uncaught. What does the runtime print, and why does it list three functions in reverse order?",
              "steps": [
                "The exception is raised while h's frame is the topmost one on the stack.",
                "To report where things went wrong, the runtime walks the stack from the top down.",
                "That walk visits h's frame first, then g's, then f's, because that is the order in which they were pushed and are now stacked.",
                "The printed trace lists them in that same top-to-bottom order: h, then g, then f."
              ],
              "answer": "A stack trace listing h, g, f from top to bottom — the exact reverse of the call order, because a stack trace is read off the call stack itself, and the stack is last-in-first-out."
            }
          ]
        },
        {
          "title": "Passing conventions: value, reference, and sharing",
          "blocks": [
            {
              "t": "p",
              "x": "How arguments reach a function's parameters is one of the most persistently confusing topics in programming, mostly because “pass by reference” gets used loosely for two genuinely different mechanisms. Pass by value copies the argument's value into the parameter; the function operates on its own copy, and nothing the function does to the parameter is visible to the caller. Pass by reference gives the function direct access to the caller's own variable, so writes through the parameter are writes to the caller's variable."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"30\" font-size=\"12\" fill=\"#666D72\">def bump(n): n = n + 1</text>\n<rect x=\"40\" y=\"50\" width=\"90\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"85\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">x = 5</text>\n<line x1=\"130\" y1=\"67\" x2=\"180\" y2=\"67\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" marker-end=\"url(#arrfa)\"/>\n<rect x=\"180\" y=\"50\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#242C31\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"235\" y=\"72\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">n = 5 (copy)</text>\n<text x=\"40\" y=\"112\" font-size=\"13\" fill=\"#9AA1A6\">n = n + 1 rebinds the local n. x is untouched: 5.</text>\n<line x1=\"40\" y1=\"134\" x2=\"620\" y2=\"134\" stroke=\"#2E3438\"/>\n<text x=\"40\" y=\"164\" font-size=\"12\" fill=\"#666D72\">def push(lst): lst.append(1)</text>\n<rect x=\"40\" y=\"184\" width=\"90\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"85\" y=\"206\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">a = []</text>\n<line x1=\"130\" y1=\"201\" x2=\"180\" y2=\"201\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" marker-end=\"url(#arrfb)\"/>\n<rect x=\"180\" y=\"184\" width=\"110\" height=\"34\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"235\" y=\"206\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">lst (copy)</text>\n<line x1=\"130\" y1=\"201\" x2=\"290\" y2=\"240\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/>\n<line x1=\"290\" y1=\"201\" x2=\"290\" y2=\"240\" stroke=\"#666D72\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/>\n<rect x=\"230\" y=\"240\" width=\"120\" height=\"14\" rx=\"4\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1\"/>\n<text x=\"290\" y=\"250\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\" class=\"mono\">the one list object</text>\n<text x=\"380\" y=\"206\" font-size=\"13\" fill=\"#9AA1A6\">a and lst are two names</text>\n<text x=\"380\" y=\"224\" font-size=\"13\" fill=\"#9AA1A6\">for the same object — append mutates</text>\n<text x=\"380\" y=\"242\" font-size=\"13\" fill=\"#9AA1A6\">it, so the caller sees [1].</text>\n<defs>\n<marker id=\"arrfa\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"#9AA1A6\"/></marker>\n<marker id=\"arrfb\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"#9AA1A6\"/></marker>\n</defs>\n</svg>",
              "cap": "Rebinding a parameter (top) never affects the caller. Mutating a shared object through a parameter (bottom) does — the parameter and the caller's variable are two names for one object."
            },
            {
              "t": "p",
              "x": "Most popular languages — Python, Java, JavaScript, Ruby — use a third convention sometimes called call by sharing or call by object reference. What is copied is not the object but a reference to it. Reassigning the parameter to a new object has no effect on the caller, because that only changes what the local name points to. Mutating the object the reference points to is visible to the caller, because there is only one object and both names point at it."
            },
            {
              "t": "p",
              "x": "This single rule resolves nearly every “why didn't my function change the argument” question: rebinding a name is invisible outside the function; mutating the object a name refers to is visible everywhere that object is reachable. C++ is the outlier worth knowing about, because it offers true pass by reference explicitly via <code>&amp;</code> parameters, on top of pass by value as the default — the caller's variable and the parameter genuinely become the same storage location, not merely two references to one object."
            },
            {
              "t": "note",
              "x": "Immutable arguments make the whole distinction moot in practice: if a string or a tuple cannot be mutated, whether it was “copied” or “shared” is unobservable, and the only way a function can appear to change one is by returning a new value for the caller to use."
            }
          ]
        },
        {
          "title": "Closures: functions that remember",
          "blocks": [
            {
              "t": "p",
              "x": "A closure is a function bundled together with the variables it captured from the scope it was defined in, kept alive even after that enclosing call has returned. Ordinarily a local variable's storage disappears the moment its function returns — the frame is popped. A closure is the exception: if an inner function that references an outer variable escapes (by being returned, stored, or passed elsewhere), the language keeps that variable alive for as long as the closure exists."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"30\" font-size=\"12\" fill=\"#666D72\">function makeCounter() { let n = 0; return () =&gt; ++n; }</text>\n<rect x=\"40\" y=\"50\" width=\"220\" height=\"70\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"55\" y=\"74\" font-size=\"12.5\" fill=\"#666D72\">makeCounter's scope</text>\n<text x=\"55\" y=\"98\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">n = 0</text>\n<text x=\"55\" y=\"112\" font-size=\"11\" fill=\"#9AA1A6\">would normally die when the call returns</text>\n<rect x=\"330\" y=\"50\" width=\"220\" height=\"70\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"345\" y=\"74\" font-size=\"12.5\" fill=\"#9AA1A6\">the returned function</text>\n<text x=\"345\" y=\"98\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">() =&gt; ++n</text>\n<line x1=\"260\" y1=\"85\" x2=\"330\" y2=\"85\" stroke=\"#EDEFF0\" stroke-width=\"1.4\" marker-end=\"url(#arrfc)\"/>\n<text x=\"270\" y=\"76\" font-size=\"11\" fill=\"#9AA1A6\">keeps n alive</text>\n<text x=\"40\" y=\"160\" font-size=\"13\" fill=\"#9AA1A6\">Calling the returned function three times: 1, 2, 3 —</text>\n<text x=\"40\" y=\"180\" font-size=\"13\" fill=\"#9AA1A6\">the same n survives across calls because the closure holds a live reference to it,</text>\n<text x=\"40\" y=\"200\" font-size=\"13\" fill=\"#9AA1A6\">not a snapshot of its value at the moment makeCounter() returned.</text>\n<defs><marker id=\"arrfc\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6 Z\" fill=\"#EDEFF0\"/></marker></defs>\n</svg>",
              "cap": "makeCounter's local n would ordinarily die when the call returns. Because the returned function closes over it, n survives — kept alive for as long as anything can still call that function."
            },
            {
              "t": "p",
              "x": "Closures capture variables, not values, in essentially every mainstream language — which is exactly the source of the classic closure-in-a-loop bug covered in the variables booklet. It is also what makes closures useful for memoisation (caching results in a variable the returned function can see but nothing else can), for building simple counters and accumulators without a class, and for the whole pattern of decorators and middleware, where a function wraps another function and closes over it to call it later."
            },
            {
              "t": "code",
              "x": "def memoize(f):\n    cache = {}\n    def wrapper(n):\n        if n not in cache:\n            cache[n] = f(n)\n        return cache[n]\n    return wrapper\n\n# wrapper closes over both cache and f; each memoized\n# function gets its own private cache that nothing else can reach."
            }
          ]
        },
        {
          "title": "Purity and higher-order functions",
          "blocks": [
            {
              "t": "p",
              "x": "A pure function's output depends only on its inputs, and it has no side effects at all — no mutation of arguments, no I/O, no reading or writing anything outside its own parameters and locals. Pure functions have a property called referential transparency: a call to one can be replaced by its result everywhere it appears, without changing what the program does. This is what lets a compiler cache, reorder or parallelise pure calls freely, and what lets a human reason about one function without holding the rest of the program in their head."
            },
            {
              "t": "p",
              "x": "A function is higher-order if it takes another function as an argument, returns one, or both. This falls directly out of functions being ordinary values in most modern languages: if a function can be assigned to a variable, it can be passed to a parameter or handed back as a return value the same as any other value. map, filter and the memoize decorator above are all higher-order — they take behaviour as a parameter rather than hard-coding it."
            },
            {
              "t": "list",
              "items": [
                "<strong>Pure</strong>: no side effects, same output for the same input, always. Easiest to test and cache.",
                "<strong>Impure but total</strong>: no side effects avoided — e.g. reads a global — but still terminates and returns for every input.",
                "<strong>Higher-order</strong>: a function that takes or returns a function. Orthogonal to purity — map is higher-order and can be applied purely or impurely depending on the function passed to it."
              ]
            },
            {
              "t": "note",
              "x": "In practice almost no real program is entirely pure — something eventually has to print, write to a database, or read the clock. The useful discipline is not eliminating side effects but isolating them: push impurity to the edges of the program (I/O, boundaries with the outside world) and keep the core logic in between as pure functions. That structure is what the functional programming node builds out fully."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The passing-convention questions are the ones that trip people up in interviews and in real bug reports alike."
            }
          ],
          "exercises": [
            {
              "q": "def f(n): n += 1. Then x = 5; f(x); print(x). What prints?",
              "kind": "mc",
              "options": [
                "5",
                "6",
                "An error",
                "None"
              ],
              "correct": 0,
              "steps": [
                "Integers are immutable, so n += 1 rebinds the local n to a new object.",
                "Rebinding a parameter only changes what that local name points to.",
                "x, in the caller's scope, was never touched.",
                "The call-by-sharing rule: rebind is local, mutate is shared — this is a rebind."
              ],
              "answer": "5. The function received a copy of the reference to 5, rebound its own copy, and left the caller's x untouched."
            },
            {
              "q": "def f(lst): lst += [1]. Then a = [1, 2]; f(a); print(a). What prints, and would the answer change if the body were lst = lst + [1] instead?",
              "kind": "mc",
              "options": [
                "[1, 2, 1]; yes, it would change to [1, 2]",
                "[1, 2]; no change either way",
                "[1, 2, 1] either way",
                "An error either way"
              ],
              "correct": 0,
              "steps": [
                "lst += [1] on a list calls the in-place extend, mutating the shared object.",
                "That mutation is visible through every name referring to the list, including a.",
                "lst = lst + [1] instead builds a brand-new list and rebinds only the local lst.",
                "The caller's a would then be left as the original, unmutated list."
              ],
              "answer": "[1, 2, 1] as written, because += mutates in place. Switching to lst = lst + [1] makes it a rebind, and a would print as [1, 2] — the same distinction as rebinding versus mutating a name."
            },
            {
              "q": "Three closures are created in a loop over range(3) using var in JavaScript, each logging its loop variable later. What do they log, and what single change fixes it?",
              "kind": "mc",
              "options": [
                "3, 3, 3; change var to let",
                "0, 1, 2; no fix needed",
                "0, 1, 2; change var to let",
                "3, 3, 3; no fix exists"
              ],
              "correct": 0,
              "steps": [
                "var is function-scoped, so all three closures capture the same single binding.",
                "By the time any closure runs, the loop has finished and that binding holds its final value, 3.",
                "let creates a fresh binding per iteration.",
                "Each closure then captures its own iteration's value instead of one shared one."
              ],
              "answer": "3, 3, 3 with var, because every closure shares one binding. Switching to let gives 0, 1, 2, since each iteration gets its own fresh variable for the closures to capture."
            },
            {
              "q": "Why does calling a recursive function with no working base case eventually crash with a stack overflow rather than simply running forever?",
              "kind": "write",
              "accept": [
                "stack overflow",
                "call stack overflow",
                "stack is finite",
                "runs out of stack memory",
                "stack exhaustion"
              ],
              "hint": "name the resource that gets exhausted",
              "steps": [
                "Every call pushes a new frame holding its parameters and locals.",
                "With no base case ever reached, calls keep being pushed and none are ever popped.",
                "Frames occupy real, finite memory — typically a fixed, comparatively small region per thread.",
                "That memory runs out well before the recursion would ever finish on its own."
              ],
              "answer": "It runs out of stack space. The recursion does not run forever because the stack, unlike the heap, is small and fixed — the crash is a resource limit, not the program noticing an infinite loop."
            },
            {
              "q": "A function is described as having referential transparency. What does that let you do to a call to it that you could not safely do to a call with side effects?",
              "kind": "write",
              "accept": [
                "replace it with its result",
                "substitute its value",
                "cache or memoize it",
                "replace the call with its return value"
              ],
              "hint": "think about substitution",
              "steps": [
                "Referential transparency means the call always produces the same result for the same arguments and does nothing else.",
                "That means every occurrence of the call is interchangeable with its result.",
                "A call with side effects cannot be replaced this way, because skipping the call also skips its effect.",
                "This substitutability is exactly what caching, memoising, and reordering pure calls rely on."
              ],
              "answer": "Replace the call with its return value (or cache that value) anywhere it appears, without changing the program's behaviour — which is unsafe for a function with side effects, since the call is doing more than producing a value."
            },
            {
              "q": "map(str.upper, words) is described as higher-order. Is it also necessarily pure?",
              "kind": "mc",
              "options": [
                "No — higher-order and pure are independent; it depends on the function passed in",
                "Yes — all higher-order functions are pure",
                "No — higher-order functions are never pure",
                "Yes, but only when passed a lambda"
              ],
              "correct": 0,
              "steps": [
                "Higher-order describes a function's relationship to other functions: it takes or returns one.",
                "Purity describes whether a function has side effects and is deterministic.",
                "map itself just applies whatever function it is given to each element.",
                "If that function is impure — say it prints each element — the map call is impure too, despite map being higher-order either way."
              ],
              "answer": "No, the two properties are independent. map(str.upper, words) happens to be pure because str.upper is pure, but map(print, words) is higher-order and impure at once."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Argument",
          "The actual value supplied at a call site, matched to a parameter."
        ],
        [
          "Parameter",
          "The name a function declares to receive an argument."
        ],
        [
          "Signature",
          "A function's parameters and return type — its contract with callers."
        ],
        [
          "Side effect",
          "Anything a function does besides computing its return value."
        ],
        [
          "Stack frame",
          "The record of one function call: return address, parameters, locals."
        ],
        [
          "Activation record",
          "Another name for a stack frame."
        ],
        [
          "Stack overflow",
          "A crash from pushing more frames than the stack can hold, usually via unbounded recursion."
        ],
        [
          "Pass by value",
          "The parameter receives a copy of the argument's value."
        ],
        [
          "Pass by reference",
          "The parameter is the caller's own variable, not a copy."
        ],
        [
          "Call by sharing",
          "Pass a copy of a reference; mutation is shared, rebinding is not."
        ],
        [
          "Closure",
          "A function bundled with the variables it captured from its enclosing scope."
        ],
        [
          "Lexical scope",
          "Scope determined by where code is written, not by who calls it."
        ],
        [
          "Pure function",
          "No side effects; same output for the same input, always."
        ],
        [
          "Referential transparency",
          "A call can be replaced by its result without changing behaviour."
        ],
        [
          "Higher-order function",
          "A function that takes a function as an argument, returns one, or both."
        ],
        [
          "Decorator",
          "A higher-order function that wraps another function to extend its behaviour."
        ],
        [
          "Memoisation",
          "Caching a function's results, keyed by its arguments, inside a closure or table."
        ],
        [
          "Variadic parameter",
          "A parameter that collects an arbitrary number of extra arguments."
        ]
      ]
    },
  "recursion": {
      "title": "Recursion",
      "blurb": "A function defined in terms of smaller versions of itself, the stack that makes it possible, and the discipline that keeps it from running away.",
      "chapters": [
        {
          "title": "Base case and recursive case",
          "blocks": [
            {
              "t": "p",
              "x": "A recursive function has two parts that must both be present: a base case, which is solved directly with no further recursive call, and a recursive case, which reduces the problem to one or more smaller instances of the same problem and combines their results. Every recursive call must move strictly closer to a base case, or the recursion never terminates."
            },
            {
              "t": "code",
              "x": "def factorial(n):\n    if n == 0:          # base case\n        return 1\n    return n * factorial(n - 1)   # recursive case: smaller problem"
            },
            {
              "t": "p",
              "x": "The recursive case trusts that the recursive call correctly solves the smaller problem — this is sometimes called the recursive leap of faith. You do not need to trace every level to convince yourself factorial(n - 1) works; you only need to check that the base case is correct and that the recursive case correctly builds a solution to n from a correct solution to n - 1. That is the same logical shape as proof by induction, and it is not a coincidence: recursion is induction, executed."
            },
            {
              "t": "note",
              "x": "Forgetting the base case, or writing a recursive case that does not actually shrink the problem — calling factorial(n) again instead of factorial(n - 1), say — produces infinite recursion. Unlike an infinite loop, which simply spins, infinite recursion crashes, because each call consumes stack space that a loop's single frame does not."
            }
          ]
        },
        {
          "title": "The stack, revisited",
          "blocks": [
            {
              "t": "p",
              "x": "Recursion relies entirely on the call stack mechanics covered in the functions booklet: each recursive call gets its own frame, with its own copy of the parameters and locals, stacked on top of the caller's frame. This is what lets factorial(4) call factorial(3) without the two calls' local n variables colliding — they are simply in different frames."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 680 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"28\" font-size=\"12\" fill=\"#666D72\">def countdown(n): countdown(n - 1) — depth grows with the input</text>\n<rect x=\"40\" y=\"200\" width=\"500\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"48\" y=\"217\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">countdown(5)</text>\n<rect x=\"40\" y=\"174\" width=\"440\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"48\" y=\"191\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">countdown(4)</text>\n<rect x=\"40\" y=\"148\" width=\"380\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"48\" y=\"165\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">countdown(3)</text>\n<rect x=\"40\" y=\"122\" width=\"320\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"48\" y=\"139\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">countdown(2)</text>\n<rect x=\"40\" y=\"96\" width=\"260\" height=\"24\" rx=\"4\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"48\" y=\"113\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">countdown(1)</text>\n<rect x=\"40\" y=\"70\" width=\"200\" height=\"24\" rx=\"4\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"48\" y=\"87\" font-size=\"11\" fill=\"#EDEFF0\" class=\"mono\">countdown(0) — base case</text>\n<line x1=\"560\" y1=\"60\" x2=\"560\" y2=\"224\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"572\" y=\"70\" font-size=\"11.5\" fill=\"#9AA1A6\">6 frames live</text>\n<text x=\"572\" y=\"86\" font-size=\"11.5\" fill=\"#9AA1A6\">at once, deepest</text>\n<text x=\"572\" y=\"102\" font-size=\"11.5\" fill=\"#9AA1A6\">first to return</text>\n<text x=\"40\" y=\"248\" font-size=\"12.5\" fill=\"#666D72\">n frames for input n — reaching the base case is what stops the stack from growing further.</text>\n</svg>",
              "cap": "Recursion depth equals stack depth. countdown(5) pushes five frames before reaching the base case, then they pop off in reverse as each call returns."
            },
            {
              "t": "p",
              "x": "This is also the entire explanation for why deep recursion can crash where an equivalent loop would not: a loop reuses one frame for every iteration, while recursion allocates a new one per call. A recursive function processing a million-element list, one element per call, needs roughly a million stack frames live at once — often far more than the stack can hold, even though the equivalent loop would use a constant, tiny amount of stack space."
            },
            {
              "t": "worked",
              "q": "A language's stack can hold about 10,000 frames before overflowing. A naive recursive function processes one list element per call with no tail-call elimination. What is the largest list it can safely process, and what should you do instead for larger lists?",
              "steps": [
                "Each element processed corresponds to one recursive call, hence one stack frame.",
                "The stack overflows once frames exceed roughly 10,000.",
                "So the function is safe for lists somewhat under that size, with a margin for whatever other frames are already on the stack.",
                "For larger lists, rewrite the traversal as an explicit loop, or restructure the recursion to be tail-recursive in a language that actually eliminates tail calls."
              ],
              "answer": "Roughly up to a few thousand elements, well short of 10,000 once other overhead is counted — and for real inputs, which are routinely far larger, convert the recursion to iteration rather than trust that the input will stay small."
            }
          ]
        },
        {
          "title": "Tail calls and tail-call elimination",
          "blocks": [
            {
              "t": "p",
              "x": "A call is in tail position if it is the very last thing the function does — its result is returned immediately, with no further computation after it. factorial(n) as written above is not tail-recursive, because after factorial(n - 1) returns, the function still has to multiply by n. Rewriting it with an accumulator that carries the running product makes the recursive call the last action."
            },
            {
              "t": "code",
              "x": "def factorial_tail(n, acc=1):\n    if n == 0:\n        return acc\n    return factorial_tail(n - 1, acc * n)   # nothing left to do after this call"
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 720 258\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">stack depth over time, same problem</text>\n<line x1=\"60\" y1=\"200\" x2=\"600\" y2=\"200\" stroke=\"#2E3438\"/><line x1=\"60\" y1=\"30\" x2=\"60\" y2=\"206\" stroke=\"#2E3438\"/>\n<text x=\"38\" y=\"40\" font-size=\"11\" fill=\"#666D72\" text-anchor=\"end\">depth</text>\n<polyline points=\"60,190 110,170 160,150 210,130 260,110 310,90 360,70 410,50 660,50 660,190\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"46\" font-size=\"12\" fill=\"#9AA1A6\">non-tail: return n * f(n-1)</text>\n<text x=\"330\" y=\"64\" font-size=\"11\" fill=\"#666D72\">must keep this frame to multiply after the call returns</text>\n<polyline points=\"60,190 660,190\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"330\" y=\"176\" font-size=\"12\" fill=\"#EDEFF0\">tail call: return f(n-1, acc*n)</text>\n<text x=\"330\" y=\"212\" font-size=\"11\" fill=\"#666D72\">nothing left to do after the call — the frame can be reused</text>\n<text x=\"40\" y=\"228\" font-size=\"12.5\" fill=\"#666D72\">A tail-call-eliminating runtime turns the flat line into O(1) stack space;</text>\n<text x=\"40\" y=\"246\" font-size=\"12.5\" fill=\"#666D72\">without it, both still cost O(n) frames.</text>\n</svg>",
              "cap": "A non-tail call must keep its frame around to use the result. A tail call has nothing left to do, so a runtime that recognises this can reuse the frame instead of stacking a new one."
            },
            {
              "t": "p",
              "x": "Tail-call elimination (or tail-call optimisation) is the runtime technique of recognising a tail call and reusing the current frame instead of pushing a new one, turning what looks like unbounded recursion into constant stack space — effectively converting it into a loop under the hood. Scheme guarantees this in its specification; several functional languages do the same. Python, Java and JavaScript's mainstream engines, notably, do not perform it, which means writing “tail-recursive” code in those languages is a style choice with no actual stack-space benefit — an explicit loop is still the only guaranteed-safe option for unbounded depth."
            },
            {
              "t": "note",
              "x": "Whether a call is technically in tail position is a syntactic question, independent of whether the language exploits it. return f(x) is tail position; return f(x) + 1 is not; return f(x) if cond else g(x) is, because whichever branch runs, nothing happens afterward. Restructuring toward tail position is only worth doing where the runtime is documented to actually eliminate it."
            }
          ]
        },
        {
          "title": "Branching recursion and the cost of recomputation",
          "blocks": [
            {
              "t": "p",
              "x": "Recursion that makes a single call per invocation, like factorial, produces a stack that is deep but narrow: one path down to the base case. Recursion that makes more than one call per invocation, like the naive Fibonacci function below, produces a tree — and the same subproblem can appear repeatedly across different branches of that tree."
            },
            {
              "t": "code",
              "x": "def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)   # two calls: the tree branches"
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">fib(5) — the recursion tree, every leaf recomputed from scratch</text>\n<circle cx=\"330\" cy=\"50\" r=\"20\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"330\" y=\"55\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">f(5)</text>\n<line x1=\"330\" y1=\"70\" x2=\"210\" y2=\"106\" stroke=\"#2E3438\"/><line x1=\"330\" y1=\"70\" x2=\"450\" y2=\"106\" stroke=\"#2E3438\"/>\n<circle cx=\"210\" cy=\"120\" r=\"18\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"210\" y=\"125\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">f(4)</text>\n<circle cx=\"450\" cy=\"120\" r=\"18\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"450\" y=\"125\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">f(3)</text>\n<line x1=\"210\" y1=\"138\" x2=\"130\" y2=\"174\" stroke=\"#2E3438\"/><line x1=\"210\" y1=\"138\" x2=\"290\" y2=\"174\" stroke=\"#2E3438\"/>\n<line x1=\"450\" y1=\"138\" x2=\"390\" y2=\"174\" stroke=\"#2E3438\"/><line x1=\"450\" y1=\"138\" x2=\"510\" y2=\"174\" stroke=\"#2E3438\"/>\n<circle cx=\"130\" cy=\"188\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"130\" y=\"193\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">f(3)</text>\n<circle cx=\"290\" cy=\"188\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"290\" y=\"193\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">f(2)</text>\n<circle cx=\"390\" cy=\"188\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"390\" y=\"193\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">f(2)</text>\n<circle cx=\"510\" cy=\"188\" r=\"16\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"510\" y=\"193\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\" class=\"mono\">f(1)</text>\n<line x1=\"130\" y1=\"204\" x2=\"90\" y2=\"238\" stroke=\"#2E3438\"/><line x1=\"130\" y1=\"204\" x2=\"170\" y2=\"238\" stroke=\"#2E3438\"/>\n<line x1=\"290\" y1=\"204\" x2=\"250\" y2=\"238\" stroke=\"#2E3438\"/><line x1=\"290\" y1=\"204\" x2=\"330\" y2=\"238\" stroke=\"#2E3438\"/>\n<line x1=\"390\" y1=\"204\" x2=\"350\" y2=\"238\" stroke=\"#2E3438\"/><line x1=\"390\" y1=\"204\" x2=\"430\" y2=\"238\" stroke=\"#2E3438\"/>\n<circle cx=\"90\" cy=\"250\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"90\" y=\"254\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\" class=\"mono\">f(2)</text>\n<circle cx=\"170\" cy=\"250\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"170\" y=\"254\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\" class=\"mono\">f(1)</text>\n<circle cx=\"250\" cy=\"250\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"250\" y=\"254\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\" class=\"mono\">f(1)</text>\n<circle cx=\"330\" cy=\"250\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"330\" y=\"254\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\" class=\"mono\">f(0)</text>\n<circle cx=\"350\" cy=\"250\" r=\"0\" fill=\"none\"/>\n<circle cx=\"430\" cy=\"250\" r=\"13\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/><text x=\"430\" y=\"254\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\" class=\"mono\">f(0)</text>\n<text x=\"40\" y=\"290\" font-size=\"12.5\" fill=\"#9AA1A6\">f(3) is computed twice here, f(2) three times —</text>\n<text x=\"40\" y=\"308\" font-size=\"12.5\" fill=\"#9AA1A6\">the tree has roughly 2^n nodes with no cache, versus n with one.</text>\n</svg>",
              "cap": "fib(5)'s call tree. fib(3) is recomputed from scratch on two separate branches, fib(2) on three — with no cache, the tree has roughly 2ⁿ nodes for an answer that only needed n additions."
            },
            {
              "t": "p",
              "x": "The naive recursive Fibonacci is exponential, O(2ⁿ), purely from recomputing identical subproblems — fib(3) is computed independently every time it is needed, with no memory that it was already solved. Recording each result the first time it is computed and reusing it thereafter — memoisation — collapses this to O(n), because there are only n distinct subproblems no matter how many times the tree would otherwise revisit them. This exact idea, generalised, is what the dynamic programming node is built on."
            },
            {
              "t": "note",
              "x": "Whether recursion is efficient or catastrophic hinges entirely on whether its subproblems overlap. Divide-and-conquer recursion, like merge sort, splits into genuinely disjoint subproblems and stays efficient without any memoisation. Fibonacci-style recursion splits into overlapping subproblems and needs memoisation, or a rewrite to an iterative bottom-up form, to avoid exponential blowup."
            }
          ]
        },
        {
          "title": "Converting recursion to iteration",
          "blocks": [
            {
              "t": "p",
              "x": "Any recursive function can be rewritten iteratively, because the call stack is just a data structure, and any data structure can be managed explicitly instead of implicitly. The general recipe is to maintain your own stack (or queue) holding the state each recursive call would have received, then loop: pop a piece of state, process it, and push whatever new states its recursive calls would have made."
            },
            {
              "t": "code",
              "x": "# recursive\ndef sum_list(lst):\n    if not lst:\n        return 0\n    return lst[0] + sum_list(lst[1:])\n\n# iterative, explicit stack in place of the call stack\ndef sum_list_iter(lst):\n    total, stack = 0, list(lst)\n    while stack:\n        total += stack.pop()\n    return total"
            },
            {
              "t": "p",
              "x": "For simple linear recursion like this, the iterative version is usually a straightforward accumulator loop, as shown. For branching recursion like a tree traversal, the iterative version keeps an explicit stack (for depth-first order) or queue (for breadth-first order) of nodes still to visit, which is precisely how the trees and graph-algorithms nodes implement traversal without recursion when depth is a concern."
            },
            {
              "t": "list",
              "items": [
                "<strong>Prefer recursion</strong> when the problem is naturally recursive (trees, divide-and-conquer) and depth is bounded and small, for the sake of clarity.",
                "<strong>Prefer iteration</strong> when depth could be large or unbounded, when the language has no tail-call elimination, or when the constant overhead of function calls matters."
              ]
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "Trace by hand before checking — the point of recursion is to trust the smaller call rather than mentally unrolling all of it."
            }
          ],
          "exercises": [
            {
              "q": "def f(n): return 1 if n == 0 else n + f(n - 1). How many stack frames are live at the deepest point of f(4)?",
              "kind": "mc",
              "options": [
                "5",
                "4",
                "1",
                "16"
              ],
              "correct": 0,
              "steps": [
                "The calls made are f(4), f(3), f(2), f(1), f(0).",
                "Each call's frame stays on the stack until that call returns.",
                "At the deepest point, f(0) has just been called and none have returned yet.",
                "That is 5 frames: f(4) through f(0), all still live."
              ],
              "answer": "5. One frame per call from f(4) down to the base case f(0), all live simultaneously at the deepest point, before any of them start returning."
            },
            {
              "q": "Is return fib(n - 1) + fib(n - 2) a tail call?",
              "kind": "mc",
              "options": [
                "No — addition happens after both calls return",
                "Yes — it is the return statement",
                "Yes, for the first call only",
                "It depends on the language"
              ],
              "correct": 0,
              "steps": [
                "A call is in tail position only if it is the very last action before returning.",
                "Here, both fib(n-1) and fib(n-2) must return before the + can be computed.",
                "That addition is work that happens after each call returns, not nothing.",
                "So neither call is in tail position, and this function cannot benefit from tail-call elimination as written."
              ],
              "answer": "No. Both recursive calls have work left to do after they return — the addition — so neither is in tail position, regardless of the language."
            },
            {
              "q": "A recursive Fibonacci function is memoised with a dictionary keyed by n. What does this change about the shape of its recursion tree?",
              "kind": "write",
              "accept": [
                "removes duplicate subtrees",
                "collapses to linear",
                "no repeated work",
                "each n computed once",
                "becomes O(n)"
              ],
              "hint": "what happens to the repeated branches",
              "steps": [
                "Without memoisation, each value of n is recomputed independently every time it is needed.",
                "A memo dictionary stores each n's result the first time it is computed.",
                "Every later call for that same n returns the cached value instead of recursing further.",
                "The tree's repeated subtrees are replaced by a single lookup, collapsing total work from exponential to linear."
              ],
              "answer": "Each distinct n is computed exactly once; every repeat visit becomes an O(1) lookup instead of a re-expanded subtree, turning the O(2ⁿ) tree into O(n) total work."
            },
            {
              "q": "Why does merge sort's recursion stay efficient without any memoisation, while naive Fibonacci's does not?",
              "kind": "mc",
              "options": [
                "Merge sort's subproblems never overlap; Fibonacci's do",
                "Merge sort has a base case and Fibonacci doesn't",
                "Merge sort is iterative underneath",
                "Fibonacci has more recursive calls per level"
              ],
              "correct": 0,
              "steps": [
                "Merge sort splits an array into two genuinely disjoint halves each time.",
                "Neither half's work is ever repeated elsewhere in the recursion.",
                "Naive Fibonacci splits into fib(n-1) and fib(n-2), which themselves both eventually recompute fib(n-2), fib(n-3), and so on.",
                "Overlapping subproblems are what memoisation exists to fix; disjoint ones need no such fix."
              ],
              "answer": "Merge sort's subproblems are disjoint — the two halves share no work — so there is nothing to recompute. Fibonacci's subproblems overlap heavily, which is what makes memoisation necessary there and pointless for merge sort."
            },
            {
              "q": "Rewrite sum_list from the iteration chapter to run in a language with no tail-call elimination, and explain why the recursive version's stack usage would still be a problem even in a language that does have it, if used at all here.",
              "kind": "write",
              "accept": [
                "not tail recursive",
                "addition happens after the call",
                "return lst[0] + sum_list",
                "it is not in tail position"
              ],
              "hint": "look at what happens to lst[0] after the recursive call returns",
              "steps": [
                "The recursive version returns lst[0] + sum_list(lst[1:]).",
                "After sum_list(lst[1:]) returns, the function still has to add lst[0] to it.",
                "That addition is work left to do after the call, so the call is not in tail position.",
                "Tail-call elimination only helps calls that are actually in tail position — this one is not, so it would still cost O(n) stack frames even in Scheme."
              ],
              "answer": "The recursive call is not in tail position — the addition happens after it returns — so tail-call elimination would not help here regardless of the language; only an explicit accumulator (as in the tail-recursive factorial) or an iterative rewrite avoids the O(n) stack usage."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Base case",
          "The case solved directly, with no further recursive call."
        ],
        [
          "Recursive case",
          "The case that reduces the problem to a smaller instance and combines results."
        ],
        [
          "Recursive leap of faith",
          "Trusting a recursive call to solve the smaller problem correctly, without tracing it."
        ],
        [
          "Stack overflow",
          "A crash from exceeding the stack's finite frame capacity, typically via unbounded recursion."
        ],
        [
          "Tail position",
          "The very last action in a function, whose result is returned with no further work."
        ],
        [
          "Tail call",
          "A function call made in tail position."
        ],
        [
          "Tail-call elimination",
          "A runtime reusing the current frame for a tail call instead of pushing a new one."
        ],
        [
          "Accumulator",
          "A parameter carrying a running result forward, enabling tail-recursive rewrites."
        ],
        [
          "Overlapping subproblems",
          "The same smaller problem recurring across different branches of a recursion."
        ],
        [
          "Memoisation",
          "Caching a function's results by argument to avoid recomputing overlapping subproblems."
        ],
        [
          "Divide and conquer",
          "Recursion into disjoint subproblems whose results are combined; no overlap to memoise."
        ],
        [
          "Explicit stack",
          "A stack data structure managed by hand, used to convert recursion into a loop."
        ]
      ]
    },
  "pointers": {
      "title": "Pointers and references",
      "blurb": "Values that hold a location rather than data — where every linked structure, every aliasing bug, and every use-after-free ultimately lives.",
      "chapters": [
        {
          "title": "Addresses and dereferencing",
          "blocks": [
            {
              "t": "p",
              "x": "Every value a running program touches lives somewhere in memory, and that somewhere has a numeric address. A pointer is a value whose content is one of those addresses — not the data itself, but a description of where to find it. Dereferencing a pointer means following that address to read or write what is actually stored there."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"28\" font-size=\"12\" fill=\"#666D72\">int x = 42; int *p = &amp;x;</text>\n<text x=\"40\" y=\"46\" font-size=\"12\" fill=\"#666D72\">address</text>\n<rect x=\"40\" y=\"76\" width=\"90\" height=\"42\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"85\" y=\"102\" text-anchor=\"middle\" font-size=\"14\" fill=\"#EDEFF0\" class=\"mono\">42</text>\n<text x=\"85\" y=\"66\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">0x7ffee4</text>\n<text x=\"85\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">x</text>\n<rect x=\"260\" y=\"76\" width=\"110\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"315\" y=\"102\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">0x7ffee4</text>\n<text x=\"315\" y=\"66\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\" class=\"mono\">0x7ffef0</text>\n<text x=\"315\" y=\"134\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">p</text>\n<path d=\"M315 76 C315 40 130 40 130 92\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<path d=\"M138 86 L130 92 L136 99\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<text x=\"420\" y=\"90\" font-size=\"12.5\" fill=\"#9AA1A6\">p does not hold 42 — it holds</text>\n<text x=\"420\" y=\"110\" font-size=\"12.5\" fill=\"#9AA1A6\">the address where 42 lives.</text>\n<text x=\"420\" y=\"132\" font-size=\"12.5\" fill=\"#9AA1A6\">*p follows it to read 42.</text>\n<text x=\"40\" y=\"200\" font-size=\"12.5\" fill=\"#666D72\">*p reads 42. *p = 7 changes x to 7 — through p, without naming x.</text>\n</svg>",
              "cap": "p does not contain 42. It contains the address of the variable that does. Dereferencing — *p — is the instruction to go and look."
            },
            {
              "t": "p",
              "x": "This single indirection is what makes shared, mutable structures possible at all. Passing x by value to a function gives it a copy; passing &x, the address of x, lets the function reach the original and change it. Every language that supports linked structures — lists, trees, graphs — needs some form of this, whether it is spelled as an explicit pointer in C, an object reference in Java, or a Python name bound to a heap object."
            },
            {
              "t": "p",
              "x": "A null pointer is a reserved address meaning \"points at nothing\", and dereferencing one is meaningless by construction — there is no data to follow it to. Most language runtimes catch this and crash predictably (a null pointer exception, a segmentation fault); a few older or lower-level ones do not, and reading through a null pointer silently reads whatever happens to sit at address zero, which is a much harder bug to diagnose."
            },
            {
              "t": "note",
              "x": "\"Pointer\" and \"reference\" are used almost interchangeably in casual conversation, but some languages distinguish them precisely: a reference is guaranteed to point at a valid object and cannot be reseated to arithmetic offsets, while a raw pointer offers no such guarantee and can be moved, compared and computed on like any other number. Where the distinction exists, it exists specifically to rule out a category of pointer bugs by construction."
            }
          ]
        },
        {
          "title": "Stack versus heap allocation",
          "blocks": [
            {
              "t": "p",
              "x": "Where a pointer is allowed to point matters as much as what pointers are. The functions booklet covers the call stack: each call gets a frame holding its own locals, and that frame is popped the instant the call returns. A pointer to a stack-allocated local is only valid for as long as that frame exists — which, for a value returned from the function that created it, is exactly zero time."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">int* make() { int local = 5; return &amp;local; }  vs  int* make() { return malloc(...); }</text>\n<rect x=\"40\" y=\"50\" width=\"260\" height=\"150\" rx=\"6\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"55\" y=\"70\" font-size=\"12\" fill=\"#666D72\">stack — this call's frame</text>\n<rect x=\"60\" y=\"86\" width=\"140\" height=\"40\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"130\" y=\"110\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\" class=\"mono\">local = 5</text>\n<text x=\"60\" y=\"150\" font-size=\"12.5\" fill=\"#EDEFF0\">Popped the instant make() returns.</text>\n<text x=\"60\" y=\"172\" font-size=\"12.5\" fill=\"#EDEFF0\">A pointer to it is now dangling.</text>\n<rect x=\"360\" y=\"50\" width=\"260\" height=\"150\" rx=\"6\" fill=\"none\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"375\" y=\"70\" font-size=\"12\" fill=\"#666D72\">heap — outlives the call</text>\n<rect x=\"380\" y=\"86\" width=\"140\" height=\"40\" rx=\"5\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"450\" y=\"110\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\" class=\"mono\">malloc'd int</text>\n<text x=\"380\" y=\"150\" font-size=\"12.5\" fill=\"#EDEFF0\">Survives until freed (or garbage</text>\n<text x=\"380\" y=\"172\" font-size=\"12.5\" fill=\"#EDEFF0\">collected) — safe to return a pointer to it.</text>\n<text x=\"40\" y=\"232\" font-size=\"12.5\" fill=\"#9AA1A6\">The rule: never return the address of a local. Return heap memory, or return the value itself.</text>\n</svg>",
              "cap": "Returning the address of a stack local hands the caller a pointer to memory that is about to be reused. Heap allocation exists precisely to outlive the call that created it."
            },
            {
              "t": "p",
              "x": "The heap is the other region: memory explicitly requested (malloc, new, or an object literal in a garbage-collected language) that persists until it is explicitly freed, or until nothing reachable points to it any more. Anything that needs to outlive the call that created it — a node added to a data structure, an object returned to a caller, a buffer handed to another thread — belongs on the heap, not the stack."
            },
            {
              "t": "worked",
              "q": "In C: int* make_answer() { int x = 42; return &x; }. What happens when the caller dereferences the returned pointer?",
              "steps": [
                "x is a local variable, allocated in make_answer's stack frame.",
                "The function returns, and that frame is popped — its memory is now free for reuse.",
                "The returned pointer still holds x's old address, which is now unowned.",
                "Dereferencing it reads whatever the next function call happens to have written into that same stack space — undefined, and often silently wrong rather than crashing."
              ],
              "answer": "Undefined behaviour: the value read is whatever now occupies that reused stack slot, which is why this bug often appears to work in testing and fails unpredictably later. The fix is to allocate x on the heap, or to return it by value so the caller gets its own copy."
            },
            {
              "t": "note",
              "x": "Garbage-collected languages hide this distinction from you but do not eliminate it underneath: Python, Java and JavaScript automatically place anything that might outlive its creating call on the heap, and a garbage collector reclaims heap objects once nothing reachable points to them. The stack-versus-heap decision still happens — the runtime just makes it for you instead of a compiler flagging it as a bug."
            }
          ]
        },
        {
          "title": "Shallow copies, deep copies, and aliasing",
          "blocks": [
            {
              "t": "p",
              "x": "Copying a pointer copies the address, not the data it points to — after p2 = p1, both pointers refer to the exact same memory, a situation the variables booklet calls aliasing. This is often exactly what you want (passing a large structure without duplicating it) and occasionally exactly what bites you (mutating through one name and being surprised the other sees it too)."
            },
            {
              "t": "p",
              "x": "A shallow copy duplicates one level of structure but leaves nested pointers shared: copying a list of pointers to objects gives you a new list containing the same object pointers. A deep copy follows every pointer recursively and duplicates everything it finds, at the cost of walking the entire structure and of having to decide what to do about cycles, which naive recursive deep-copying will loop on forever unless it tracks what it has already visited."
            },
            {
              "t": "list",
              "items": [
                "<strong>No copy (aliasing)</strong>: two names, one object. Cheapest, and the default when you assign or pass a reference.",
                "<strong>Shallow copy</strong>: new top-level container, shared contents. Independent at exactly one level.",
                "<strong>Deep copy</strong>: new everything, all the way down. Safest, most expensive, and needs cycle tracking."
              ]
            },
            {
              "t": "worked",
              "q": "A tree-copying function recurses into every child pointer to build a duplicate. What happens if the input graph has a cycle, and what is the general fix?",
              "steps": [
                "The function calls itself on each child it visits, with no memory of what it has already copied.",
                "If a child pointer eventually leads back to an ancestor, the function calls itself on that ancestor again.",
                "That triggers copying its children again, including the cycle, forever.",
                "The general fix tracks already-visited nodes in a map from original pointer to its copy, and returns the existing copy instead of recursing when a node is seen again."
              ],
              "answer": "Infinite recursion and a stack overflow. Real deep-copy implementations (Python's copy.deepcopy included) maintain exactly this seen-before map, which is also what lets them handle shared substructure correctly instead of duplicating it twice."
            }
          ]
        },
        {
          "title": "Dangling pointers and ownership",
          "blocks": [
            {
              "t": "p",
              "x": "A dangling pointer is one that still holds an address, but the memory at that address is no longer valid for that purpose — because it was freed, because a stack frame it pointed into was popped, or because the object was moved. Dereferencing one is undefined: it might crash immediately, might silently read garbage, or might — most dangerously — read or write memory that has since been reallocated for something else entirely."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">free(p); ... q = malloc(...); *p = 9;</text>\n<rect x=\"60\" y=\"52\" width=\"130\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\" stroke-dasharray=\"4 3\"/>\n<text x=\"125\" y=\"78\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\" class=\"mono\">freed</text>\n<text x=\"125\" y=\"122\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">p still points here</text>\n<line x1=\"260\" y1=\"73\" x2=\"196\" y2=\"73\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/><path d=\"M204 68 L196 73 L204 78\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.4\"/>\n<rect x=\"260\" y=\"52\" width=\"80\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"300\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">p</text>\n<rect x=\"420\" y=\"52\" width=\"80\" height=\"42\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<text x=\"460\" y=\"76\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" class=\"mono\">q</text>\n<path d=\"M420 94 C 420 128, 125 128, 125 96\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><path d=\"M119 102 L125 96 L131 102\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/>\n<text x=\"60\" y=\"164\" font-size=\"13\" fill=\"#EDEFF0\">The allocator reused the freed slot for q's allocation.</text>\n<text x=\"60\" y=\"186\" font-size=\"13\" fill=\"#EDEFF0\">*p = 9 now silently corrupts q's memory instead of crashing —</text>\n<text x=\"60\" y=\"208\" font-size=\"13\" fill=\"#EDEFF0\">the classic use-after-free, and why it is so hard to reproduce.</text>\n</svg>",
              "cap": "Use-after-free: p still points at freed memory that the allocator has since handed to q. Writing through p now corrupts q's data instead of crashing, which is exactly why the bug can go unnoticed for a long time."
            },
            {
              "t": "p",
              "x": "A double free — calling free on the same pointer twice — is the same family of bug from the other direction, and it can corrupt the allocator's own internal bookkeeping, which is part of why use-after-free and double-free bugs are treated as security vulnerabilities rather than mere crashes: corrupted allocator state is something an attacker can sometimes steer."
            },
            {
              "t": "p",
              "x": "The general fix is to make it structurally clear who is responsible for freeing what, which is the idea behind ownership. A single-owner model (as in Rust, enforced by the compiler) says exactly one pointer owns an object at a time, and the object is freed automatically when that owner goes out of scope; passing it elsewhere transfers ownership rather than duplicating access. Reference counting (Python, Swift, C++'s shared_ptr) instead tracks how many references exist and frees the object when the count hits zero. Tracing garbage collection (Java, JavaScript, Go) sidesteps explicit freeing altogether by periodically finding everything unreachable from a set of roots and reclaiming it."
            },
            {
              "t": "note",
              "x": "Reference counting has one well-known gap: a cycle of objects referencing each other keeps every count above zero even when nothing outside the cycle can reach any of them, leaking the whole group. Tracing collectors do not have this problem, because reachability, not a count, is what decides whether something survives — which is the trade Python makes by combining reference counting with an occasional cycle-detecting pass."
            }
          ]
        },
        {
          "title": "Pointer arithmetic and arrays",
          "blocks": [
            {
              "t": "p",
              "x": "In languages that expose pointer arithmetic directly, the arrays booklet's indexing formula and pointers turn out to be the same idea seen from two sides. An array name decays to a pointer to its first element, and a[i] is defined to mean exactly *(a + i) — dereference the address i elements past a. Adding 1 to a pointer does not add one byte; it adds one element's worth of bytes, because the compiler knows the pointer's type and scales accordingly."
            },
            {
              "t": "code",
              "x": "int a[5] = {10, 20, 30, 40, 50};\nint *p = a;        // decays to &a[0]\n*(p + 2)           // 30 — same as a[2]\np++;               // now points at a[1], not one byte later"
            },
            {
              "t": "worked",
              "q": "int arr[4] of 4-byte ints starts at address 2000. What address does arr + 3 point to, and what does *(arr + 3) read?",
              "steps": [
                "Pointer arithmetic scales by the element size, not by raw bytes.",
                "arr + 3 means the address 3 elements past the start.",
                "3 elements at 4 bytes each is 12 bytes, so the address is 2000 + 12 = 2012.",
                "*(arr + 3) dereferences that address, which is exactly arr[3]."
              ],
              "answer": "Address 2012, and *(arr + 3) reads the same value as arr[3] — because that is the definition of array indexing in a language with pointer arithmetic, not a coincidence."
            },
            {
              "t": "note",
              "x": "Walking a pointer past the end of its array — even by one, even without dereferencing it in some language specifications — is undefined behaviour, not merely a runtime error waiting to happen. Compilers are permitted to assume it never occurs and to optimise on that assumption, which has produced real bugs where a bounds check was deleted entirely because the compiler proved it could only matter in a case its own rules say is impossible."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The dangling-pointer and aliasing questions are the ones worth internalising — they show up in production code far more often than pointer arithmetic does."
            }
          ],
          "exercises": [
            {
              "q": "def f(node): node.value = node.value + 1. Called as f(root) where root is a pointer/reference to a tree node. Does the caller's tree change?",
              "kind": "mc",
              "options": [
                "Yes — node is an alias for the same object the caller's root refers to",
                "No — f received a copy of the node",
                "Only if node is returned and reassigned",
                "It depends on the language's garbage collector"
              ],
              "correct": 0,
              "steps": [
                "The parameter node receives a copy of the reference, not a copy of the object.",
                "Both node and root now point at the same underlying object.",
                "Mutating a field through node mutates the one object both names reach.",
                "The caller sees the change, exactly as with any other aliased mutable object."
              ],
              "answer": "Yes. This is the same call-by-sharing rule as the functions and variables booklets: the reference is copied, the object is not."
            },
            {
              "q": "A function returns a pointer to a local array declared inside it. In a language with manual memory management, what is guaranteed about the returned pointer?",
              "kind": "mc",
              "options": [
                "Nothing — it is dangling the instant the function returns",
                "It remains valid for one more function call",
                "It is valid as long as the caller does not call any other function first",
                "It is automatically promoted to heap memory"
              ],
              "correct": 0,
              "steps": [
                "The local array lives in the function's own stack frame.",
                "Returning pops that frame immediately, before the caller resumes.",
                "The memory is now unowned and available for the very next call to reuse.",
                "No language guarantee protects it — this is squarely the programmer's responsibility to avoid."
              ],
              "answer": "Nothing is guaranteed — the pointer is dangling immediately. The fix is always to allocate on the heap or return by value, never to return the address of a local."
            },
            {
              "q": "a = [[1], [2]]; b = list(a) (a shallow copy). b[0].append(9). What is a[0]?",
              "kind": "write",
              "accept": [
                "[1, 9]",
                "[1,9]"
              ],
              "hint": "a list with two numbers",
              "steps": [
                "list(a) creates a new outer list.",
                "But it fills that list with the same inner list references as a.",
                "b[0] and a[0] are therefore the same object.",
                "Appending through b[0] is visible through a[0] too."
              ],
              "answer": "[1, 9]. Only a deep copy would have made b[0] independent of a[0]."
            },
            {
              "q": "Two pointers reference each other and nothing else in the program can reach either one. Under pure reference counting with no cycle collector, are they ever freed?",
              "kind": "mc",
              "options": [
                "No — each holds the other's count above zero forever",
                "Yes, immediately, since nothing external references them",
                "Yes, but only when the program exits",
                "It depends on which one was created first"
              ],
              "correct": 0,
              "steps": [
                "Each object's reference count includes the count from the other object in the cycle.",
                "Dropping every external reference still leaves each object's count at one — from its partner.",
                "Neither count ever reaches zero.",
                "Neither object is ever freed, even though the pair is completely unreachable from outside."
              ],
              "answer": "No — a reference cycle leaks under pure reference counting, since each object keeps the other's count above zero. This is exactly why Python pairs reference counting with a separate cycle-detecting collector."
            },
            {
              "q": "Why is a null pointer dereference generally safer, from a security standpoint, than a use-after-free?",
              "kind": "write",
              "accept": [
                "null crashes predictably",
                "use-after-free can be exploited",
                "null is a fixed known address",
                "use-after-free lets an attacker control the memory"
              ],
              "hint": "think about what an attacker can control in each case",
              "steps": [
                "A null dereference almost always touches the same fixed, unmapped low address every time.",
                "Runtimes and hardware reliably trap that and crash the program immediately and predictably.",
                "A use-after-free instead touches memory the allocator has since handed to something else.",
                "An attacker who can influence what gets allocated into that freed slot can sometimes shape what the dangling pointer reads or writes, turning a bug into a controllable exploit."
              ],
              "answer": "A null dereference reliably crashes at a fixed, well-understood address. A use-after-free touches memory that may since hold attacker-influenced data, which is why it is a favourite target for real exploits rather than just a crash."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Pointer",
          "A value holding a memory address rather than data itself."
        ],
        [
          "Dereference",
          "Following a pointer to read or write the data at its address."
        ],
        [
          "Null pointer",
          "A reserved address meaning \"points at nothing\"; dereferencing it is invalid."
        ],
        [
          "Stack allocation",
          "Memory in the current call's frame, freed automatically when the call returns."
        ],
        [
          "Heap allocation",
          "Memory that persists until explicitly freed or garbage collected."
        ],
        [
          "Aliasing",
          "Two or more pointers referring to the same object."
        ],
        [
          "Shallow copy",
          "Duplicates one level of structure; nested pointers remain shared."
        ],
        [
          "Deep copy",
          "Duplicates a structure all the way down, following every pointer."
        ],
        [
          "Dangling pointer",
          "A pointer whose target is no longer valid — freed, popped, or moved."
        ],
        [
          "Use-after-free",
          "Dereferencing a pointer after its memory has been freed and possibly reused."
        ],
        [
          "Double free",
          "Freeing the same memory twice, which can corrupt the allocator's bookkeeping."
        ],
        [
          "Ownership",
          "A discipline for deciding which pointer is responsible for freeing an object."
        ],
        [
          "Reference counting",
          "Freeing an object once the count of references to it reaches zero."
        ],
        [
          "Tracing garbage collection",
          "Reclaiming memory unreachable from a set of roots, rather than counting references."
        ],
        [
          "Pointer arithmetic",
          "Adding to a pointer moves it by whole elements, scaled by the pointed-to type's size."
        ]
      ]
    },
  "oop": {
      "title": "Object-oriented design",
      "blurb": "Bundling state with the behaviour that guards it, and modelling how those bundles relate — with an honest look at where the style stops helping.",
      "chapters": [
        {
          "title": "Encapsulation and invariants",
          "blocks": [
            {
              "t": "p",
              "x": "An object bundles data with the operations that are allowed to touch it. The point of that bundling is not organisation for its own sake — it is that an object can maintain an invariant, a fact about its own state that stays true no matter what callers do, as long as they only go through its methods."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"380\" y=\"40\" width=\"240\" height=\"150\" rx=\"12\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"500\" y=\"30\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">BankAccount</text>\n<rect x=\"396\" y=\"60\" width=\"208\" height=\"40\" rx=\"6\" fill=\"#20272B\" stroke=\"#2E3438\"/>\n<text x=\"500\" y=\"84\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\" class=\"mono\">private balance</text>\n<rect x=\"396\" y=\"112\" width=\"208\" height=\"34\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"500\" y=\"134\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\" class=\"mono\">withdraw(amount)</text>\n<rect x=\"396\" y=\"154\" width=\"208\" height=\"26\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"500\" y=\"171\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\" class=\"mono\">deposit(amount)</text>\n<text x=\"40\" y=\"80\" font-size=\"13\" fill=\"#9AA1A6\">Outside code cannot</text>\n<text x=\"40\" y=\"100\" font-size=\"13\" fill=\"#9AA1A6\">touch balance directly —</text>\n<text x=\"40\" y=\"120\" font-size=\"13\" fill=\"#9AA1A6\">only through methods that</text>\n<text x=\"40\" y=\"140\" font-size=\"13\" fill=\"#9AA1A6\">check the invariant first.</text>\n<line x1=\"240\" y1=\"80\" x2=\"376\" y2=\"80\" stroke=\"#9AA1A6\" stroke-width=\"1.2\" stroke-dasharray=\"3 3\"/>\n<text x=\"40\" y=\"170\" font-size=\"13\" fill=\"#666D72\">withdraw() can refuse to go below zero.</text>\n<text x=\"40\" y=\"190\" font-size=\"13\" fill=\"#666D72\">A public field could not.</text>\n</svg>",
              "cap": "A private balance can only change through withdraw() and deposit(), which can enforce the invariant that balance never goes negative. A public field offers no such gate — any caller can set it to anything."
            },
            {
              "t": "p",
              "x": "This is why encapsulation is described as hiding data, but the more useful framing is hiding responsibility: the class, and only the class, is responsible for keeping its own state consistent. A getter and setter pair that simply reads and writes a field unchecked provides no more safety than a public field did — encapsulation is doing its job only when the methods actually enforce something a caller could otherwise violate."
            },
            {
              "t": "worked",
              "q": "A BankAccount exposes a public balance field. A caller sets account.balance = -50. Whose bug is it, and where does the fix belong?",
              "steps": [
                "The class never stated a rule preventing a negative balance, because a public field enforces nothing.",
                "Any code with a reference to the account can set the field to any value.",
                "The invariant \"balance never goes negative\" is a property the class should own.",
                "Making the field private and routing changes through a withdraw() method that checks the balance first fixes it at the source, for every future caller."
              ],
              "answer": "It is the class's design that is at fault, not the caller — a public field made no promise to break. The fix belongs inside the class: encapsulate the field and validate in the one method that changes it."
            }
          ]
        },
        {
          "title": "Composition over inheritance",
          "blocks": [
            {
              "t": "p",
              "x": "Inheritance models an is-a relationship: a Dog is an Animal, so Dog inherits Animal's fields and methods. It is appealing because it is concise, but a class hierarchy is a rigid, compile-time decision, and real categories rarely stay as clean as the diagram that first seemed to describe them."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 230\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"24\" font-size=\"12\" fill=\"#666D72\">inheritance — is-a, fixed at compile time</text>\n<rect x=\"60\" y=\"42\" width=\"120\" height=\"34\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"120\" y=\"63\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">Animal</text>\n<line x1=\"120\" y1=\"76\" x2=\"90\" y2=\"104\" stroke=\"#2E3438\"/><line x1=\"120\" y1=\"76\" x2=\"150\" y2=\"104\" stroke=\"#2E3438\"/>\n<rect x=\"40\" y=\"104\" width=\"100\" height=\"30\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"90\" y=\"123\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">Dog</text>\n<rect x=\"150\" y=\"104\" width=\"100\" height=\"30\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"200\" y=\"123\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">Robot Dog?</text>\n<text x=\"60\" y=\"160\" font-size=\"12.5\" fill=\"#9AA1A6\">A robot dog is not really an Animal —</text>\n<text x=\"60\" y=\"180\" font-size=\"12.5\" fill=\"#9AA1A6\">but the hierarchy has nowhere else to put it.</text>\n<text x=\"380\" y=\"24\" font-size=\"12\" fill=\"#666D72\">composition — has-a, assembled at runtime</text>\n<rect x=\"380\" y=\"42\" width=\"130\" height=\"34\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"445\" y=\"63\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">RobotDog</text>\n<line x1=\"445\" y1=\"76\" x2=\"445\" y2=\"100\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<rect x=\"385\" y=\"100\" width=\"120\" height=\"28\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.1\"/><text x=\"445\" y=\"118\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">LeggedMovement</text>\n<line x1=\"445\" y1=\"128\" x2=\"445\" y2=\"150\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<rect x=\"385\" y=\"150\" width=\"120\" height=\"28\" rx=\"5\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.1\"/><text x=\"445\" y=\"168\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">BarkSound</text>\n<text x=\"380\" y=\"200\" font-size=\"12.5\" fill=\"#9AA1A6\">Swap in a WheeledMovement instead —</text>\n<text x=\"380\" y=\"220\" font-size=\"12.5\" fill=\"#9AA1A6\">no hierarchy to redesign.</text>\n</svg>",
              "cap": "A hierarchy has to decide, once, where everything fits — and a robot dog does not fit an Animal tree cleanly. Composition assembles behaviour from swappable parts instead, decided at runtime rather than baked into the class."
            },
            {
              "t": "p",
              "x": "Composition models a has-a relationship instead: an object holds references to other objects that provide pieces of its behaviour, and those pieces can be swapped, tested independently, and combined in ways a single-inheritance tree cannot express (most languages allow inheriting from only one class, precisely because multiple inheritance's ambiguities are hard to resolve cleanly). \"Favour composition over inheritance\" does not mean inheritance is never right — a genuine, stable is-a relationship is still a reasonable fit — it means reach for it deliberately rather than by default."
            },
            {
              "t": "note",
              "x": "A useful test: if you are inheriting mainly to reuse a chunk of code, and the is-a relationship is shaky, that is the composition smell. A Bird that inherits fly() from FlyingAnimal breaks the moment a Penguin needs to be a Bird too — composition would instead give Penguin a NoFlight behaviour and Sparrow a Flight behaviour, with no shared ancestor forced to accommodate both."
            }
          ]
        },
        {
          "title": "Polymorphism and interfaces",
          "blocks": [
            {
              "t": "p",
              "x": "Polymorphism lets code call a method without knowing which concrete type will actually handle it, and have the right implementation run anyway. A loop that calls shape.area() on a list of mixed Circle, Square and Triangle objects never branches on what kind of shape it has — each object supplies its own area() and the correct one runs."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">for (Shape s : shapes) { s.area(); } — one call site, three behaviours</text>\n<rect x=\"40\" y=\"90\" width=\"150\" height=\"34\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"115\" y=\"111\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" class=\"mono\">s.area()</text>\n<line x1=\"190\" y1=\"107\" x2=\"260\" y2=\"68\" stroke=\"#666D72\" stroke-width=\"1\"/>\n<line x1=\"190\" y1=\"107\" x2=\"260\" y2=\"107\" stroke=\"#666D72\" stroke-width=\"1\"/>\n<line x1=\"190\" y1=\"107\" x2=\"260\" y2=\"146\" stroke=\"#666D72\" stroke-width=\"1\"/>\n<rect x=\"270\" y=\"52\" width=\"140\" height=\"30\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"340\" y=\"71\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">Circle.area()</text>\n<rect x=\"270\" y=\"92\" width=\"140\" height=\"30\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"340\" y=\"111\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">Square.area()</text>\n<rect x=\"270\" y=\"132\" width=\"140\" height=\"30\" rx=\"5\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"340\" y=\"151\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">Triangle.area()</text>\n<text x=\"445\" y=\"70\" font-size=\"12.5\" fill=\"#9AA1A6\">The loop never checks what</text>\n<text x=\"445\" y=\"90\" font-size=\"12.5\" fill=\"#9AA1A6\">kind of shape it has — each</text>\n<text x=\"445\" y=\"110\" font-size=\"12.5\" fill=\"#9AA1A6\">object computes its own area.</text>\n<text x=\"40\" y=\"200\" font-size=\"12.5\" fill=\"#666D72\">This is late binding: the method is resolved at the call, based on the</text>\n<text x=\"40\" y=\"220\" font-size=\"12.5\" fill=\"#666D72\">object's real type — not the variable's declared type.</text>\n</svg>",
              "cap": "One call site, resolved differently depending on the object's actual runtime type — late binding, in contrast to a function whose target is fixed at compile time."
            },
            {
              "t": "p",
              "x": "An interface formalises the promise that makes this safe: it declares a contract (these methods exist, with these signatures) without saying how they are implemented. \"Program to an interface, not an implementation\" means calling code should depend only on that contract, so any class honouring it can be substituted freely — a caller expecting a Shape works identically whether it is handed a Circle or a class defined a year later that no one who wrote the loop has ever seen."
            },
            {
              "t": "p",
              "x": "This is what makes plugin architectures, dependency injection, and mock objects in tests all possible with the same mechanism: something is written against an interface, and a different concrete type satisfying that interface is substituted underneath it, with the calling code never needing to change."
            }
          ]
        },
        {
          "title": "Liskov substitution",
          "blocks": [
            {
              "t": "p",
              "x": "The Liskov substitution principle sharpens what a subtype is actually promising: anywhere a Base is expected, a Derived must be usable without the caller noticing a difference in behaviour, not merely in the method signatures being compatible. Violating it produces a subtype that type-checks perfectly and still breaks code written against the base type."
            },
            {
              "t": "worked",
              "q": "Square extends Rectangle and overrides setWidth to also update height (keeping the sides equal). Code written for Rectangle does: r.setWidth(5); r.setHeight(4); assert r.area() == 20. What happens when r is actually a Square, and what does this reveal?",
              "steps": [
                "Rectangle's contract implies width and height can be set independently.",
                "Square's override breaks that: setWidth(5) also silently forces height to 5.",
                "setHeight(4) then forces width to 4 as well, to keep the square's sides equal.",
                "The final area is 4 × 4 = 16, not the 5 × 4 = 20 the caller's logic assumed."
              ],
              "answer": "16, not 20 — a silent violation of a promise the base type made. This is the textbook Liskov violation: Square is a mathematically valid subtype of Rectangle, but not a behaviourally valid one in this design, which is exactly why the principle checks behaviour, not just method signatures."
            },
            {
              "t": "note",
              "x": "The practical fix is usually to stop modelling the relationship as inheritance at all. An immutable Shape hierarchy where neither Rectangle nor Square exposes independent setters sidesteps the problem entirely, since there is no setWidth to misbehave — another case where the honest fix is composition or immutability rather than a cleverer subclass."
            }
          ]
        },
        {
          "title": "SOLID, and where it stops helping",
          "blocks": [
            {
              "t": "list",
              "items": [
                "<strong>Single responsibility</strong>: a class should have one reason to change. An Order class that also renders HTML and talks to the database has three.",
                "<strong>Open/closed</strong>: open for extension, closed for modification — add new behaviour by adding new code, not by editing code that already works.",
                "<strong>Liskov substitution</strong>: a subtype must be usable anywhere its base type is expected, without surprises.",
                "<strong>Interface segregation</strong>: many small, specific interfaces beat one large one that forces implementers to support methods they do not need.",
                "<strong>Dependency inversion</strong>: depend on interfaces, not concrete classes, so high-level policy does not depend on low-level detail."
              ]
            },
            {
              "t": "p",
              "x": "Each principle is a response to a specific pain felt on real codebases, and each is genuinely useful when that pain is present. The trouble starts when they are applied preemptively, before the pain exists: an interface with exactly one implementation and no plausible second one is ceremony, not design, and a single 20-line class split into five single-method classes to satisfy single-responsibility \"on principle\" is usually harder to read than the class it replaced, not easier."
            },
            {
              "t": "note",
              "x": "The pragmatic reading of SOLID is retrospective as much as prospective: when a class keeps changing for unrelated reasons, split it — that is single responsibility earning its keep. When you have never needed a second implementation of something, the interface in front of it is speculative generality, and speculative generality is a cost paid today for a benefit that may never arrive."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The Liskov and encapsulation questions are the ones interviewers actually probe — they test whether you understand the promise a design makes, not just its syntax."
            }
          ],
          "exercises": [
            {
              "q": "An Order class calculates tax, renders an HTML receipt, and saves itself to a database. What SOLID principle does this violate, and what is the fix?",
              "kind": "mc",
              "options": [
                "Single responsibility — split into a tax calculator, a renderer, and a repository",
                "Liskov substitution — Order should not inherit from anything",
                "Interface segregation — Order needs a smaller interface",
                "Open/closed — Order should be marked final"
              ],
              "correct": 0,
              "steps": [
                "Tax rules, HTML rendering and database schema are three unrelated reasons the class could need to change.",
                "A change to any one of them requires editing and retesting a class that has nothing to do with the other two.",
                "Single responsibility asks for one reason to change per class.",
                "Splitting into three focused classes gives each concern its own class, changed only when that concern changes."
              ],
              "answer": "Single responsibility. Splitting the class means a tax-law change, a redesign, and a schema migration each touch only the class actually responsible for that concern."
            },
            {
              "q": "Bird has a fly() method inherited by every subclass, including Penguin. What does this suggest about the design, and what is the composition-based fix?",
              "kind": "mc",
              "options": [
                "Give Penguin and Sparrow separate movement components instead of a shared fly() on Bird",
                "Override fly() in Penguin to throw an exception",
                "Make Penguin not extend Bird at all",
                "Add an isFlightless boolean flag to Bird"
              ],
              "correct": 0,
              "steps": [
                "Inheriting fly() forces every subclass to either fly or awkwardly override the method to fail.",
                "An overridden method that throws violates Liskov substitution: code expecting a working fly() breaks on a Penguin.",
                "A boolean flag pushes the problem into every caller, who now has to check it before calling fly().",
                "Giving each bird a movement component — FlightMovement or NoFlightMovement — models the real variation directly, without a broken shared method."
              ],
              "answer": "Replace the shared fly() with swappable movement components. This is the composition-over-inheritance fix: the variation lives in a component, not in an override that breaks the base class's contract."
            },
            {
              "q": "A codebase defines an interface with exactly one implementation, and no second implementation has ever been planned. Is the interface earning its cost?",
              "kind": "write",
              "accept": [
                "no",
                "not really",
                "probably not",
                "speculative generality"
              ],
              "hint": "one word or a short phrase",
              "steps": [
                "An interface's value comes from letting callers be written against a contract rather than a concrete class.",
                "That value is realised when a second, different implementation actually exists or is genuinely imminent.",
                "With exactly one implementation ever, nothing is actually being decoupled from anything.",
                "The interface is pure ceremony in this case — speculative generality paid for upfront with no realised benefit."
              ],
              "answer": "No — with a single implementation and no real plan for a second, the interface is speculative generality: cost paid now for a flexibility benefit that may never be used."
            },
            {
              "q": "A Square class extends Rectangle and forces width and height to stay equal. Code written generically against Rectangle sets width and height independently and gets a wrong area for a Square. Which principle is violated?",
              "kind": "mc",
              "options": [
                "Liskov substitution",
                "Single responsibility",
                "Interface segregation",
                "Dependency inversion"
              ],
              "correct": 0,
              "steps": [
                "The principle in question concerns whether a subtype can replace its base type without surprising callers.",
                "Square type-checks as a Rectangle but silently breaks an assumption Rectangle's contract implied.",
                "That mismatch between the type system's approval and actual behavioural compatibility is exactly Liskov's concern.",
                "It is not about responsibilities, interface size, or dependency direction, which the other principles address."
              ],
              "answer": "Liskov substitution. Square is not a behaviourally valid substitute for Rectangle, even though it compiles as one."
            },
            {
              "q": "A private field is wrapped in a getter and a setter that do nothing but read and write it directly, with no validation. Has this class achieved meaningful encapsulation?",
              "kind": "write",
              "accept": [
                "no",
                "not really",
                "no meaningful encapsulation"
              ],
              "hint": "one word",
              "steps": [
                "Encapsulation's value is in enforcing an invariant a caller could otherwise violate.",
                "A getter and setter with no logic let a caller set the field to literally anything, same as a public field would.",
                "No rule is being checked or enforced anywhere in this design.",
                "So nothing has actually been protected — the private keyword adds a wrapper, not a guarantee."
              ],
              "answer": "No — an unchecked getter/setter pair offers the same lack of protection as a public field. Encapsulation is doing real work only when the methods actually enforce something."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Encapsulation",
          "Bundling state with the behaviour responsible for keeping it consistent."
        ],
        [
          "Invariant",
          "A fact about an object's state that stays true across every valid operation on it."
        ],
        [
          "Inheritance",
          "Modelling an is-a relationship by deriving one class's fields and methods from another."
        ],
        [
          "Composition",
          "Modelling a has-a relationship by holding references to other objects that provide behaviour."
        ],
        [
          "Polymorphism",
          "Calling a method without knowing which concrete type will handle it, and getting the right one anyway."
        ],
        [
          "Interface",
          "A contract of method signatures with no attached implementation."
        ],
        [
          "Late binding",
          "Resolving which method implementation runs at the moment of the call, based on the object's real type."
        ],
        [
          "Liskov substitution principle",
          "A subtype must be usable anywhere its base type is expected, without behavioural surprises."
        ],
        [
          "Single responsibility",
          "A class should have exactly one reason to change."
        ],
        [
          "Open/closed principle",
          "Open for extension, closed for modification — add behaviour without editing what already works."
        ],
        [
          "Interface segregation",
          "Prefer several small, specific interfaces over one large general one."
        ],
        [
          "Dependency inversion",
          "Depend on interfaces rather than concrete classes, so policy does not depend on detail."
        ],
        [
          "Speculative generality",
          "Flexibility built in before it is needed, paid for now against a benefit that may never arrive."
        ]
      ]
    },
  "testing": {
      "title": "Testing and debugging",
      "blurb": "Proving to yourself that code does what you claim, and finding out fast when it stops — with an honest look at what a test actually proves.",
      "chapters": [
        {
          "title": "What a test actually proves",
          "blocks": [
            {
              "t": "p",
              "x": "Edsger Dijkstra's observation still holds: testing can show the presence of bugs, never their absence. A passing test suite means the specific inputs you tried behaved as expected — it says nothing certain about the inputs you did not try. This is not an argument against testing; it is the correct expectation to hold about what testing buys you, so you neither over-trust a green suite nor dismiss testing as pointless because it cannot prove universal correctness."
            },
            {
              "t": "p",
              "x": "A well-formed test has three parts, and naming them helps keep tests from sprawling into unclear scripts. Arrange sets up the situation: create the objects, seed the data. Act performs the one operation under test. Assert checks that the outcome matches what was expected. Keeping these visually distinct — often with blank lines between them — makes a failing test's meaning obvious without reading the whole test file."
            },
            {
              "t": "code",
              "x": "def test_withdraw_below_balance_raises():\n    account = BankAccount(balance=100)          # arrange\n\n    with pytest.raises(InsufficientFunds):\n        account.withdraw(150)                    # act\n\n    assert account.balance == 100                # assert: unchanged on failure"
            },
            {
              "t": "note",
              "x": "A test that asserts on implementation details rather than observable behaviour — checking that a private helper method was called a specific number of times, say, rather than checking the result it produces — is brittle: it breaks when you refactor the internals without changing what the code actually does, which trains people to stop trusting test failures."
            }
          ]
        },
        {
          "title": "Unit, integration, and end-to-end",
          "blocks": [
            {
              "t": "p",
              "x": "Tests differ in how much of the real system they exercise, and that scope trades directly against speed and realism. A unit test isolates a small piece of logic — often one function or class — with everything around it faked or removed, and can run in milliseconds because there is no database, network, or file system involved. An end-to-end test drives the real system through its real interface, as close to what a user actually does as automation allows, and is correspondingly slow and occasionally flaky from incidental timing issues that have nothing to do with the bug it is meant to catch."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M250 40 L340 110 L160 110 Z\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"250\" y=\"85\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">end-to-end</text>\n<path d=\"M160 110 L340 110 L375 175 L125 175 Z\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"250\" y=\"150\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">integration</text>\n<path d=\"M125 175 L375 175 L415 235 L85 235 Z\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"250\" y=\"212\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">unit</text>\n<text x=\"450\" y=\"60\" font-size=\"12\" fill=\"#9AA1A6\">Few, slow, realistic —</text>\n<text x=\"450\" y=\"78\" font-size=\"12\" fill=\"#9AA1A6\">the real app end to end.</text>\n<text x=\"450\" y=\"140\" font-size=\"12\" fill=\"#9AA1A6\">Some, moderate speed —</text>\n<text x=\"450\" y=\"158\" font-size=\"12\" fill=\"#9AA1A6\">real DB, faked network.</text>\n<text x=\"450\" y=\"200\" font-size=\"12\" fill=\"#9AA1A6\">Many, fast, isolated —</text>\n<text x=\"450\" y=\"218\" font-size=\"12\" fill=\"#9AA1A6\">pure logic, no I/O.</text>\n</svg>",
              "cap": "The testing pyramid: many fast, isolated unit tests at the base; fewer integration tests checking that pieces cooperate; a small number of end-to-end tests confirming the whole system is wired together correctly."
            },
            {
              "t": "p",
              "x": "Integration tests sit between the two, checking that two or more real pieces cooperate correctly — a repository against a real (often disposable, containerised) database, say, with the network layer above it still faked. The shape is a pyramid rather than a rectangle because unit tests are cheap enough to write many of, catch bugs closest to their source, and run fast enough to execute on every save, while end-to-end tests are reserved for confirming the handful of critical paths actually work when everything is wired together for real."
            },
            {
              "t": "worked",
              "q": "\"Checkout applies sales tax based on the shipping address.\" What level should carry most of the testing for this rule, and why?",
              "steps": [
                "The tax calculation itself is pure logic over an address and a subtotal — no database, network, or UI involved.",
                "That logic can be tested in complete isolation, quickly and deterministically, as a unit test.",
                "Only the fact that checkout actually calls the tax calculator, and passes it the right address, needs confirming beyond that.",
                "One integration or end-to-end test proving the wiring works is enough; the tax rules themselves do not need to be re-verified through the slow path."
              ],
              "answer": "A unit test on the tax calculator carries the bulk of the coverage, with one broader test confirming the pieces are connected. Pushing all of this into end-to-end tests would make the suite slow and would still test the same logic no more thoroughly."
            }
          ]
        },
        {
          "title": "Mocks, stubs, fakes, and their costs",
          "blocks": [
            {
              "t": "p",
              "x": "A test double stands in for a real dependency so a unit test can run without it. A stub returns canned answers to calls it expects. A mock additionally records how it was called, so a test can assert an interaction happened. A fake is a lightweight working implementation — an in-memory database standing in for a real one — good enough for tests without the overhead of the genuine article."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"26\" font-size=\"12\" fill=\"#666D72\">what the test actually exercises</text>\n<rect x=\"40\" y=\"46\" width=\"150\" height=\"40\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/><text x=\"115\" y=\"70\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">your code</text>\n<line x1=\"190\" y1=\"66\" x2=\"250\" y2=\"66\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<rect x=\"250\" y=\"46\" width=\"150\" height=\"40\" rx=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"325\" y=\"70\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#EDEFF0\">mock database</text>\n<text x=\"250\" y=\"112\" font-size=\"11.5\" fill=\"#9AA1A6\">returns whatever YOU told it to —</text>\n<text x=\"250\" y=\"130\" font-size=\"11.5\" fill=\"#9AA1A6\">a belief about the real shape.</text>\n<rect x=\"490\" y=\"46\" width=\"150\" height=\"40\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\" stroke-dasharray=\"4 3\"/><text x=\"565\" y=\"70\" text-anchor=\"middle\" font-size=\"12\" fill=\"#666D72\">real database</text>\n<text x=\"490\" y=\"112\" font-size=\"11.5\" fill=\"#666D72\">never actually consulted —</text>\n<text x=\"490\" y=\"130\" font-size=\"11.5\" fill=\"#666D72\">its real shape could differ.</text>\n<text x=\"40\" y=\"176\" font-size=\"13\" fill=\"#EDEFF0\">If the belief encoded in the mock is wrong, the test and the code agree with each other</text>\n<text x=\"40\" y=\"196\" font-size=\"13\" fill=\"#EDEFF0\">and are both wrong — passing tests, broken production.</text>\n</svg>",
              "cap": "A test built entirely on mocks only ever verifies that your code behaves consistently with your own beliefs about the dependency — it never checks that those beliefs match the real thing."
            },
            {
              "t": "p",
              "x": "The risk grows with how heavily a codebase leans on mocks: if every test replaces the database with a hand-written stub, none of those tests ever discover that a query has a syntax error, that a column was renamed, or that the real database returns nulls in a shape the stub never anticipated. The mocks were tested against each other, and the system underneath was never actually exercised."
            },
            {
              "t": "note",
              "x": "The practical discipline is to mock at architectural boundaries you actually own — your own repository interface, say — rather than mocking a third-party library's internals directly, and to keep at least one integration test per boundary that talks to the real thing, so the assumption encoded in every mock is checked somewhere, even if only occasionally and in CI rather than on every save."
            }
          ]
        },
        {
          "title": "Writing tests that stay useful",
          "blocks": [
            {
              "t": "p",
              "x": "A test name should describe the behaviour under test well enough that a failure report is meaningful without opening the file: test_withdraw_below_balance_raises_insufficient_funds says far more than test_withdraw_2. One assertion of intent per test — even if that means several assert statements checking one coherent outcome — keeps a failure pointing at exactly one thing, rather than forcing you to figure out which of five unrelated checks in one giant test actually broke."
            },
            {
              "t": "list",
              "items": [
                "<strong>Test behaviour, not implementation</strong>: assert on outputs and observable effects, not on which private method got called.",
                "<strong>One reason to fail</strong>: a focused test tells you exactly what broke; a sprawling one makes you investigate.",
                "<strong>Deterministic</strong>: no reliance on real wall-clock time, network availability, or execution order between tests.",
                "<strong>Fast enough to run constantly</strong>: a slow suite gets skipped, and a skipped suite catches nothing."
              ]
            },
            {
              "t": "note",
              "x": "Flaky tests — ones that fail intermittently with no code change — are worse than no test at all once a team learns to reflexively re-run a failure hoping it passes the second time. That habit generalises to genuine failures too, and a real regression starts slipping through a suite everyone has quietly learned to distrust."
            }
          ]
        },
        {
          "title": "From bug report to fix",
          "blocks": [
            {
              "t": "p",
              "x": "A vague bug report — \"the total is sometimes wrong\" — is not yet actionable. The first job is turning it into a concrete, minimal reproduction: the smallest input and the smallest sequence of steps that reliably trigger the wrong behaviour. Writing that reproduction as a failing test before touching the fix serves two purposes at once: it proves you actually understood the report, and it becomes a permanent guard against the same bug returning silently later."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 660 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"40\" y=\"24\" font-size=\"12\" fill=\"#666D72\">100 commits, bug introduced somewhere — binary search over history</text>\n<line x1=\"60\" y1=\"80\" x2=\"600\" y2=\"80\" stroke=\"#2E3438\" stroke-width=\"2\"/>\n<circle cx=\"60\" cy=\"80\" r=\"5\" fill=\"#EDEFF0\"/><text x=\"60\" y=\"100\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">good</text>\n<circle cx=\"600\" cy=\"80\" r=\"5\" fill=\"#9AA1A6\"/><text x=\"600\" y=\"100\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">bad (now)</text>\n<circle cx=\"330\" cy=\"80\" r=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"330\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">test #50</text>\n<circle cx=\"465\" cy=\"80\" r=\"6\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"465\" y=\"60\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">test #75</text>\n<circle cx=\"397\" cy=\"80\" r=\"6\" fill=\"#FFFFFF\"/><text x=\"397\" y=\"130\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#EDEFF0\">first bad commit</text>\n<text x=\"40\" y=\"164\" font-size=\"12.5\" fill=\"#9AA1A6\">Each test halves the remaining range — about log₂(100) ≈ 7 tests to find</text>\n<text x=\"40\" y=\"184\" font-size=\"12.5\" fill=\"#9AA1A6\">the exact commit, versus up to 100 checked one by one.</text>\n</svg>",
              "cap": "Bisecting a regression: test the midpoint commit, keep the half that still shows the failure, repeat. Roughly log₂(n) tests find the exact commit that introduced it, out of n candidates."
            },
            {
              "t": "p",
              "x": "When the bug was not present some time ago and is present now, bisecting the commit history — testing a commit halfway between known-good and known-bad, then repeating on whichever half still shows the failure — finds the exact introducing commit in about log₂(n) tests rather than checking commits one at a time. git bisect automates exactly this search, and it works because it is the same halving idea as binary search, applied to history instead of a sorted array."
            },
            {
              "t": "p",
              "x": "Reading a stack trace productively means reading it from the top down for where the failure was detected, then scanning down through the frames for the first one that is actually your own code rather than a library or a runtime internal — that is usually where the real mistake lives, even though the crash may have surfaced several calls later."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The mock and bisect questions are where the reasoning pays off in real debugging sessions, not just in the abstract."
            }
          ],
          "exercises": [
            {
              "q": "Every test passes, but a bug ships to production in a code path where the database was mocked in every test. What is the most likely explanation?",
              "kind": "mc",
              "options": [
                "The mock encoded a wrong belief about the real database's behaviour",
                "The test framework has a bug",
                "Mocking is inherently unsafe and should never be used",
                "The bug is unrelated to testing practice"
              ],
              "correct": 0,
              "steps": [
                "A mock only returns what it was told to return, based on the author's assumption about the real dependency.",
                "If that assumption does not match the real database's actual behaviour, the tests can pass while the real system fails.",
                "The tests were verifying consistency with the mock, not correctness against reality.",
                "Adding at least one integration test against the real database would have caught the mismatch."
              ],
              "answer": "The mock encoded an incorrect belief about the real dependency, and since nothing tested against the real thing, that mismatch went unnoticed until production."
            },
            {
              "q": "A bug was introduced somewhere in the last 200 commits. Using git bisect, roughly how many test runs are needed to find the exact commit?",
              "kind": "mc",
              "options": [
                "About 8",
                "About 100",
                "About 200",
                "Exactly 2"
              ],
              "correct": 0,
              "steps": [
                "Bisecting halves the remaining range of suspect commits on each test.",
                "200 commits need about log2(200) halvings to narrow to one.",
                "log2(200) is a little under 8.",
                "So roughly 8 test runs pin down the exact commit, versus up to 200 checked one at a time."
              ],
              "answer": "About 8 — log2(200) ≈ 7.6, rounded up. This is exactly why bisecting scales so much better than a linear commit-by-commit search."
            },
            {
              "q": "A test named test_checkout_2 fails in CI. What is the main cost of that name, compared to test_checkout_rejects_expired_card?",
              "kind": "write",
              "accept": [
                "unclear what broke",
                "have to open the file",
                "no information from the name",
                "does not describe the behavior"
              ],
              "hint": "what do you have to do that you would not with a better name",
              "steps": [
                "A failure report is usually just the test name and a stack trace at first glance.",
                "test_checkout_2 conveys no information about what behaviour was being verified.",
                "Someone triaging the failure must open the test file and read its body just to know what broke.",
                "test_checkout_rejects_expired_card tells the reader the failing behaviour immediately, without opening anything."
              ],
              "answer": "You have to open the test file just to learn what behaviour failed — a descriptive name would have told you that from the failure report alone."
            },
            {
              "q": "A test asserts that a private helper method was called exactly twice, rather than asserting on the function's return value. What happens the next time someone refactors the internals without changing external behaviour?",
              "kind": "mc",
              "options": [
                "The test breaks even though nothing observable changed",
                "The test is unaffected, since refactors preserve behaviour",
                "The test becomes more reliable",
                "The test starts running faster"
              ],
              "correct": 0,
              "steps": [
                "Asserting on an implementation detail ties the test to how the code happens to be written, not what it does.",
                "A refactor that changes the internal call pattern, while preserving the actual output, will break this assertion.",
                "The test fails despite no real regression having occurred.",
                "This trains people to distrust test failures, since a red test no longer reliably signals a real problem."
              ],
              "answer": "The test breaks despite no behavioural regression — a classic symptom of asserting on implementation rather than on observable output."
            },
            {
              "q": "A user reports \"the total is wrong sometimes.\" What is the correct first step before attempting any fix?",
              "kind": "write",
              "accept": [
                "write a failing test",
                "reproduce it",
                "find a minimal reproduction",
                "write a test that reproduces it"
              ],
              "hint": "turn the vague report into something concrete",
              "steps": [
                "A vague report cannot be verified as fixed or not fixed.",
                "The report needs to become a specific, minimal case that reliably triggers the behaviour.",
                "Writing that case as a failing test proves the report is understood correctly.",
                "It also becomes a permanent regression guard once the fix makes it pass."
              ],
              "answer": "Reproduce the report as a concrete case and write it as a failing test before changing any code — this confirms understanding and prevents the bug from silently returning."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Arrange-act-assert",
          "The three-part shape of a well-formed test: set up, perform, verify."
        ],
        [
          "Unit test",
          "A test isolating a small piece of logic, with dependencies faked or removed."
        ],
        [
          "Integration test",
          "A test checking that two or more real components cooperate correctly."
        ],
        [
          "End-to-end test",
          "A test driving the real system through its real interface, as a user would."
        ],
        [
          "Test double",
          "A stand-in for a real dependency used in a test."
        ],
        [
          "Stub",
          "A test double that returns canned answers to expected calls."
        ],
        [
          "Mock",
          "A test double that also records and verifies how it was called."
        ],
        [
          "Fake",
          "A lightweight working implementation used in place of a real dependency."
        ],
        [
          "Flaky test",
          "A test that fails intermittently with no underlying code change."
        ],
        [
          "Minimal reproduction",
          "The smallest input and steps that reliably trigger a reported bug."
        ],
        [
          "Bisecting",
          "Binary-searching commit history for the change that introduced a regression."
        ],
        [
          "Regression",
          "A previously working behaviour that has broken."
        ]
      ]
    },
  "modules": {
    "title": "Modules and interfaces",
    "blurb": "Splitting a system into parts that hide their internals behind a contract — the discipline that keeps a codebase changeable as it grows past what one person can hold in their head.",
    "chapters": [
      {
        "title": "Why split a system at all",
        "blocks": [
          {
            "t": "p",
            "x": "A program small enough to fit in one file, understood entirely by the person who wrote it an hour ago, does not need modules. The need shows up as a codebase grows past what any one person holds in their head at once, and past what any one person wrote alone: modules are the mechanism for letting different parts change, be understood, and be tested somewhat independently of each other, rather than as one undifferentiated mass where touching anything risks breaking everything."
          },
          {
            "t": "p",
            "x": "The functions booklet's idea of packaging behaviour behind a name and a contract is the same idea one level up: a module packages a group of related functions, types, and state behind a boundary, so that everything outside the boundary only needs to know what the module promises, never how it keeps that promise."
          }
        ]
      },
      {
        "title": "Interfaces, contracts, and information hiding",
        "blocks": [
          {
            "t": "p",
            "x": "A module's public interface is the set of functions, types, and values it exposes to the outside — its contract. Everything else, the private implementation, is free to change at any time as long as the contract holds. This separation is called information hiding, and its entire value proposition is that a caller depending only on the interface never has to change when the internals do."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 640 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"180\" y=\"40\" width=\"280\" height=\"180\" rx=\"10\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1\"/>\n<rect x=\"180\" y=\"40\" width=\"280\" height=\"36\" rx=\"10\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"320\" y=\"63\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">public interface</text>\n<text x=\"320\" y=\"110\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#9AA1A6\">private implementation</text>\n<text x=\"320\" y=\"132\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\">(data structures, helper functions,</text>\n<text x=\"320\" y=\"150\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\">internal state — free to change)</text>\n<rect x=\"20\" y=\"92\" width=\"120\" height=\"36\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"80\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">caller A</text>\n<rect x=\"500\" y=\"92\" width=\"120\" height=\"36\" rx=\"6\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"560\" y=\"114\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">caller B</text>\n<line x1=\"140\" y1=\"58\" x2=\"180\" y2=\"58\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M172 52 L180 58 L172 64\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/>\n<line x1=\"460\" y1=\"58\" x2=\"500\" y2=\"110\" stroke=\"#9AA1A6\" stroke-width=\"1.3\" stroke-dasharray=\"3 3\"/>\n<line x1=\"500\" y1=\"110\" x2=\"460\" y2=\"58\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/><path d=\"M453 62 L460 58 L458 67\" fill=\"none\" stroke=\"#9AA1A6\" stroke-width=\"1.3\"/>\n<text x=\"320\" y=\"246\" text-anchor=\"middle\" font-size=\"12.5\" fill=\"#666D72\">Both callers only ever touch the interface strip — never the internals beneath it.</text>\n</svg>",
            "cap": "Callers depend only on the interface at the top of the box. Whatever sits inside — how the module actually does its job — can be rewritten entirely without either caller noticing, as long as the interface's promises still hold."
          },
          {
            "t": "note",
            "x": "Information hiding is the same underlying idea the object-oriented design booklet calls encapsulation, applied at the scale of a whole module or package rather than a single class — the two concepts differ in granularity, not in kind."
          }
        ]
      },
      {
        "title": "Coupling and cohesion",
        "blocks": [
          {
            "t": "p",
            "x": "Cohesion measures how closely related the things inside one module are to each other; coupling measures how much one module depends on the details of another. The standard advice — high cohesion within modules, low coupling between them — sounds like a slogan until you see what violating each side costs: low cohesion means a module is really several unrelated concerns wearing one name, so changing one concern risks breaking an unrelated one bundled alongside it. High coupling means a change in one module ripples into others that depend on its internals rather than its interface, defeating the entire point of drawing a boundary."
          },
          {
            "t": "list",
            "items": [
              "<strong>High cohesion</strong>: everything in the module serves one clear purpose; a good module name is easy to write truthfully.",
              "<strong>Low coupling</strong>: a module depends on another's interface, never its internals — the only thing allowed to change silently.",
              "<strong>The trade-off is real</strong>: splitting things too finely can itself create excess coupling between too many small pieces that must coordinate."
            ]
          }
        ]
      },
      {
        "title": "Dependency direction and layering",
        "blocks": [
          {
            "t": "p",
            "x": "In a layered architecture, higher-level modules (a reporting feature, a UI) depend on lower-level ones (a database access layer, a core domain model) — not the other way around. When a low-level module starts depending on a high-level one, the result is a circular dependency: two modules each need the other, which means neither can be understood, tested, or deployed without the other, defeating the separation that layering was meant to buy."
          },
          {
            "t": "p",
            "x": "Dependency inversion pushes this further: rather than a high-level module depending directly on a low-level module's concrete implementation, both depend on a shared abstraction (an interface) that the low-level module implements. This is why the oop booklet's advice to depend on interfaces rather than concrete classes matters beyond a single class — applied at the module level, it is what lets a database module be swapped for a different one without the reporting module that uses it ever noticing."
          },
          {
            "t": "worked",
            "q": "A low-level 'database' module starts importing and calling a function from a high-level 'reporting' module, which already depends on the database module for its own queries. What has just happened, and why is it a problem?",
            "steps": [
              "Reporting depends on database (for queries) — that direction is normal, high-level depending on low-level.",
              "Database now also depends on reporting — a low-level module depending on a high-level one.",
              "Together, database and reporting now depend on each other: a circular dependency.",
              "Neither module can be built, tested, or reasoned about in isolation any more — understanding one requires understanding the other, and a change to either risks breaking both."
            ],
            "answer": "A circular dependency has formed, and it collapses the layering the two modules were supposed to have — the fix is to move whatever database needs from reporting into a lower, shared module (or an abstraction) that both can depend on without depending on each other."
          }
        ]
      },
      {
        "title": "Semantic versioning and breaking changes",
        "blocks": [
          {
            "t": "p",
            "x": "When a module is published for others to depend on, its version number becomes a promise. Semantic versioning encodes that promise as major.minor.patch: a patch bump means a bug fix with no interface change, a minor bump adds new interface surface without breaking existing callers, and a major bump signals that something in the public interface changed in a way that can break code depending on it — a function removed, a parameter's meaning changed, a required argument added."
          },
          {
            "t": "p",
            "x": "This is exactly why the interface/implementation boundary from earlier in this booklet matters practically, not just architecturally: a module's maintainer can rewrite its entire private implementation — for performance, for clarity, for a different underlying algorithm — and ship it as a patch release, because nothing in the public contract moved. Only a change visible through that contract requires warning callers with a major version bump."
          },
          {
            "t": "note",
            "x": "A change that looks small from the inside can still be a major bump from the outside — tightening a validation rule that used to silently accept a certain input, for instance, breaks any caller that relied on the old, looser behaviour, even though the function's signature never changed."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "The circular-dependency and interface-stability questions are the two ideas most worth carrying into an actual codebase review."
          }
        ],
        "exercises": [
          {
            "q": "Module A calls three functions from module B's public interface. B's maintainer completely rewrites B's internals — different data structures, different algorithm — while keeping all three function signatures and their observable behaviour identical. What does module A need to change?",
            "steps": [
              "Module A depends only on B's public interface, per the information-hiding boundary described in this booklet.",
              "The interface's three function signatures and behaviour are unchanged, even though everything behind them is different.",
              "Since A never referenced B's internals, nothing A relies on has moved.",
              "A needs no code changes at all — at most a rebuild or redeploy, depending on the language and deployment setup, but zero edits."
            ],
            "answer": "Nothing in module A's code needs to change — that a complete internal rewrite requires zero changes in every caller is the entire payoff of hiding implementation behind a stable interface."
          },
          {
            "q": "Which pair correctly describes what architects generally aim for when splitting a system into modules?",
            "kind": "mc",
            "options": [
              "High cohesion within each module, low coupling between modules",
              "Low cohesion within each module, high coupling between modules",
              "High cohesion and high coupling everywhere, since more connections mean more functionality",
              "Cohesion and coupling describe the same property and can't be considered separately"
            ],
            "correct": 0,
            "steps": [
              "Cohesion is about how related the things inside one module are to each other.",
              "Coupling is about how much one module depends on another's internals.",
              "A module with unrelated responsibilities bundled together (low cohesion) is hard to name honestly and risky to change.",
              "Modules that depend heavily on each other's internals (high coupling) can't be changed, tested, or understood independently — defeating the point of splitting them apart."
            ],
            "answer": "High cohesion within modules, low coupling between them — each module does one clear thing, and modules interact only through stable interfaces, not shared internals."
          },
          {
            "q": "A low-level 'database' module starts importing and calling functions from a high-level 'reporting' module, which already depends on 'database' for its own queries. What architectural problem has just been created?",
            "kind": "mc",
            "options": [
              "A circular dependency — database and reporting now each depend on the other",
              "Nothing — imports between any two modules are always safe",
              "Proper dependency inversion, since both modules now depend on each other equally",
              "A performance improvement, since the two modules can now share code more directly"
            ],
            "correct": 0,
            "steps": [
              "Reporting depending on database is the normal, expected direction — high-level using low-level.",
              "Database depending on reporting reverses that for at least one function.",
              "The two modules now depend on each other in both directions — a circular dependency.",
              "Circular dependencies mean neither module can be built, tested, or reasoned about without the other, which is exactly what layering is meant to prevent."
            ],
            "answer": "A circular dependency — the fix is to move whatever database needs out of reporting and into a lower module (or a shared abstraction) that both can depend on without depending on each other."
          },
          {
            "q": "In semantic versioning (major.minor.patch), which position must be incremented when a change removes or renames something in a module's public interface, breaking existing callers?",
            "kind": "write",
            "accept": [
              "major",
              "the major version",
              "major version",
              "first number"
            ],
            "hint": "the leftmost of the three numbers",
            "steps": [
              "A patch bump is reserved for internal fixes that don't touch the public interface.",
              "A minor bump adds new interface surface without breaking anything already there.",
              "Removing or renaming something existing callers rely on is exactly the kind of change that can break them.",
              "That level of change is what the major version position is reserved to signal."
            ],
            "answer": "The major version — any change that can break an existing caller's use of the public interface requires a major version bump under semantic versioning."
          },
          {
            "q": "What is the general term for a module concealing its internal data structures and implementation details, exposing only a defined interface to the outside — the same underlying idea the object-oriented design booklet calls encapsulation, but applied at module scale?",
            "kind": "write",
            "accept": [
              "information hiding",
              "encapsulation"
            ],
            "hint": "covered early in this booklet, right before the interface/implementation figure",
            "steps": [
              "The module's internals — data structures, helper functions, private state — are deliberately not exposed.",
              "Only the defined public interface is visible to callers.",
              "This is what lets the internals change freely without breaking anything outside.",
              "At the scale of a single class, this same idea has another common name: encapsulation."
            ],
            "answer": "Information hiding (equivalently, encapsulation at module scale) — concealing internals behind a stable interface is what makes independent change possible."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Module",
        "A unit of a system grouping related functions, types, and state behind a boundary."
      ],
      [
        "Public interface",
        "The functions, types, and values a module exposes to callers — its contract."
      ],
      [
        "Private implementation",
        "Everything behind a module's interface, free to change without affecting callers."
      ],
      [
        "Information hiding",
        "Concealing a module's internals behind a stable public interface."
      ],
      [
        "Coupling",
        "How much one module depends on another module's details."
      ],
      [
        "Cohesion",
        "How closely related the responsibilities inside one module are to each other."
      ],
      [
        "Circular dependency",
        "Two modules that each depend on the other, directly or indirectly."
      ],
      [
        "Layered architecture",
        "An arrangement where higher-level modules depend on lower-level ones, not vice versa."
      ],
      [
        "Dependency inversion",
        "High- and low-level modules both depending on a shared abstraction, rather than one depending directly on the other's concrete implementation."
      ],
      [
        "Abstraction",
        "An interface capturing what something does without committing to how."
      ],
      [
        "Semantic versioning",
        "A major.minor.patch scheme signalling the size and safety of a change."
      ],
      [
        "Breaking change",
        "A change to a public interface that can break existing callers."
      ],
      [
        "Major version",
        "The semantic-versioning position incremented for a breaking change."
      ]
    ]
  },
  "functional":   {
      "title": "Functional programming",
      "blurb": "A different default from the imperative style most of this map assumes: build programs out of functions that never mutate anything and always give the same output for the same input, then push every unavoidable side effect to the thinnest possible edge.",
      "chapters": [
        {
          "title": "Pure functions",
          "blocks": [
            {
              "t": "p",
              "x": "A pure function has two properties, and both matter: given the same inputs, it always returns the same output, and calling it changes nothing else — no global variable updated, no file written, no argument mutated in place. A function that logs, that reads the current time, that mutates a list it was passed, or that reads a global counter is impure, even if it also returns a sensible value."
            },
            {
              "t": "p",
              "x": "The payoff of purity is almost entirely about reasoning. A pure function can be understood completely by reading its own body — no need to trace through the rest of the program to know what it might affect. It can be tested with plain input/output examples, no setup or mocks required (see the testing booklet). It can be called in any order, any number of times, or not at all, and nothing about the rest of the program's behavior changes — which is exactly what makes it safe to run in parallel or to cache (memoize) freely."
            },
            {
              "t": "note",
              "x": "\"No side effects\" doesn't mean \"does nothing real.\" A pure function can still do substantial work — parsing, computing, transforming — it just returns its result rather than reaching out to change something. The actual writing, printing or sending happens elsewhere, deliberately, which is the subject of a later chapter in this booklet."
            }
          ]
        },
        {
          "title": "Immutability",
          "blocks": [
            {
              "t": "p",
              "x": "Functional style pairs pure functions with immutable data: instead of modifying a list, a record or an object in place, an operation on it produces a new value and leaves the original untouched. Appending to an immutable list doesn't grow the original list; it returns a new list that shares as much of the original's structure as it safely can, which is cheaper than it sounds — most implementations reuse the unchanged parts rather than copying everything."
            },
            {
              "t": "p",
              "x": "The direct benefit is that a reference to an immutable value is a reliable snapshot — nothing else in the program can ever change it out from under you, which eliminates an entire category of bug from the pointers/aliasing world (see the pointers booklet): two names referring to the same mutable object, one of which mutates it while the other still expects the old value. With immutable data that scenario simply can't happen, because nothing can mutate it at all."
            },
            {
              "t": "code",
              "x": "// mutable style\nlet cart = [];\ncart.push(item);           // cart is changed in place; every other holder of `cart` sees the change\n\n// immutable style\nconst cart = [];\nconst cart2 = [...cart, item];   // cart is untouched; cart2 is a new array with item added"
            }
          ]
        },
        {
          "title": "map, filter, fold",
          "blocks": [
            {
              "t": "p",
              "x": "Three higher-order functions cover the overwhelming majority of what a hand-written loop is doing: map applies a function to every element of a collection and returns a new collection of the results, one-to-one. filter keeps only the elements that pass a predicate, discarding the rest — the count can shrink but every kept value is untouched. fold (also called reduce) combines every element into a single accumulated result, one element at a time, given a starting value and a combining function."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 740 300' xmlns='http://www.w3.org/2000/svg'><text x='30' y='26' font-size='12.5' fill='#666D72'>map, filter, fold as one pipeline over [1,2,3,4,5,6]</text><text x='40' y='70' font-size='12' fill='#9AA1A6'>start</text><rect x='40' y='84' width='140' height='34' rx='6' fill='#0E1113' stroke='#666D72' stroke-width='1.2'/><text x='110' y='106' text-anchor='middle' font-size='12.5' fill='#EDEFF0'>1 2 3 4 5 6</text><line x1='180' y1='101' x2='230' y2='101' stroke='#666D72' marker-end='url(#af)'/><text x='205' y='88' text-anchor='middle' font-size='11' fill='#9AA1A6'>map x&#178;</text><rect x='230' y='84' width='190' height='34' rx='6' fill='#0E1113' stroke='#666D72' stroke-width='1.2'/><text x='325' y='106' text-anchor='middle' font-size='12.5' fill='#EDEFF0'>1 4 9 16 25 36</text><line x1='420' y1='101' x2='470' y2='101' stroke='#666D72' marker-end='url(#af)'/><text x='445' y='88' text-anchor='middle' font-size='11' fill='#9AA1A6'>filter even</text><rect x='470' y='84' width='120' height='34' rx='6' fill='#0E1113' stroke='#666D72' stroke-width='1.2'/><text x='530' y='106' text-anchor='middle' font-size='12.5' fill='#EDEFF0'>4 16 36</text><line x1='590' y1='101' x2='640' y2='101' stroke='#EDEFF0' marker-end='url(#af2)'/><text x='615' y='88' text-anchor='middle' font-size='11' fill='#9AA1A6'>fold +, 0</text><rect x='640' y='84' width='70' height='34' rx='6' fill='#20272B' stroke='#EDEFF0' stroke-width='1.4'/><text x='675' y='106' text-anchor='middle' font-size='13' fill='#EDEFF0'>56</text><text x='40' y='170' font-size='12' fill='#666D72'>map transforms every element (1&#178;..6&#178;) without touching how many there are.</text><text x='40' y='194' font-size='12' fill='#666D72'>filter keeps only the elements passing a test (even) — the count can shrink, values don't change.</text><text x='40' y='218' font-size='12' fill='#666D72'>fold combines everything left into one value (a running sum starting from 0) — 4+16+36 = 56.</text><text x='40' y='250' font-size='11.5' fill='#9AA1A6'>None of the three steps mutates the array that came before it — each produces a new value.</text><defs><marker id='af' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'><path d='M0,0 L6,3 L0,6 Z' fill='#666D72'/></marker><marker id='af2' markerWidth='8' markerHeight='8' refX='6' refY='3' orient='auto'><path d='M0,0 L6,3 L0,6 Z' fill='#EDEFF0'/></marker></defs></svg>",
              "cap": "Squaring every element, keeping the even results, then summing what's left — three separate, composable steps instead of one loop doing all three jobs interleaved."
            },
            {
              "t": "worked",
              "q": "Using map (square), then filter (keep even), then fold (sum, starting at 0) on [1,2,3,4,5,6], what's the final result — worked through each step?",
              "steps": [
                "map x → x² on [1,2,3,4,5,6] gives [1,4,9,16,25,36].",
                "filter for even values keeps 4, 16, 36 (1, 9, 25 are odd and are dropped).",
                "fold with + starting at 0: 0+4=4, 4+16=20, 20+36=56.",
                "Final result: 56."
              ],
              "answer": "56 — the squares of 1..6 are [1,4,9,16,25,36]; the even ones are 4, 16, 36; and their sum is 56."
            },
            {
              "t": "p",
              "x": "Each of these has a law-like property that makes them safe to compose: map(f) followed by map(g) is the same as map(x => g(f(x))) in one pass, and an empty collection maps, filters or folds to a predictable, unsurprising result (an empty collection, an empty collection, and the starting value, respectively) with no special-cased edge behavior to remember."
            }
          ]
        },
        {
          "title": "Higher-order functions and partial application",
          "blocks": [
            {
              "t": "p",
              "x": "map, filter and fold are all higher-order functions: functions that take another function as an argument (or return one). Once functions are values that can be passed around like any other data — stored in a variable, put in a list, passed as an argument — a whole family of patterns opens up beyond the three above: sorting by a custom comparator, running a callback once some condition holds, building a pipeline of transformations to apply in sequence."
            },
            {
              "t": "p",
              "x": "Partial application takes this further: fixing some of a function's arguments ahead of time produces a new function that only needs the rest. A generic multiply(a, b) function, partially applied with a=2, produces a new double(b) function — the same underlying logic, specialized. Currying is the closely related technique of restructuring a multi-argument function into a chain of single-argument functions, so that partial application falls out automatically rather than needing special support."
            },
            {
              "t": "code",
              "x": "const multiply = (a, b) => a * b;\nconst double = (b) => multiply(2, b);   // partial application by hand\n\n// curried form: multiply = a => b => a * b\nconst double2 = multiply(2);            // partial application falls out for free"
            }
          ]
        },
        {
          "title": "Function composition and pipelines",
          "blocks": [
            {
              "t": "p",
              "x": "If a function's whole contract is \"input in, output out, nothing else touched,\" then two such functions can be chained directly: feed the first's output straight into the second, with total confidence that nothing hidden passed between them. Composition — building compose(f, g) = x => f(g(x)) — turns a sequence of small, individually-testable transformations into one larger one, without ever writing a loop that interleaves their logic."
            },
            {
              "t": "p",
              "x": "This is the deeper reason map/filter/fold read as a pipeline rather than a loop: each stage is a small pure transformation, and the pipeline itself is just those transformations composed in sequence. Debugging a pipeline stage-by-stage — checking the output after just the map, then after the filter — is straightforward precisely because each stage is independently pure; debugging a single hand-written loop that mixed squaring, filtering and summing in one pass would require re-deriving which line did which job."
            }
          ]
        },
        {
          "title": "Effects at the edges",
          "blocks": [
            {
              "t": "p",
              "x": "No real program can be entirely pure — something eventually has to read a file, make a network call, or print to a screen, and those are, by definition, side effects. Functional style doesn't pretend otherwise; it isolates where effects are allowed to happen. The common pattern is a functional core, imperative shell: the core does all the actual decision-making as pure functions, and a thin outer shell handles every effect, calling into the core to figure out what to do and then, separately, doing it."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox='0 0 640 380' xmlns='http://www.w3.org/2000/svg'><text x='30' y='26' font-size='12.5' fill='#666D72'>Functional core, imperative shell</text><rect x='60' y='50' width='520' height='260' rx='12' fill='#0E1113' stroke='#666D72' stroke-width='1.3' stroke-dasharray='6 5'/><text x='320' y='76' text-anchor='middle' font-size='12' fill='#9AA1A6'>shell — reads input, writes output, talks to the network and disk</text><rect x='190' y='120' width='260' height='150' rx='10' fill='#171B1D' stroke='#EDEFF0' stroke-width='1.4'/><text x='320' y='146' text-anchor='middle' font-size='12' fill='#EDEFF0'>core — pure functions</text><text x='320' y='170' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>same input always</text><text x='320' y='188' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>gives same output</text><text x='320' y='206' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>no I/O, no mutation,</text><text x='320' y='224' text-anchor='middle' font-size='11.5' fill='#9AA1A6'>no side effects</text><text x='320' y='250' text-anchor='middle' font-size='11' fill='#666D72'>cheap to test — no mocks needed</text><text x='90' y='340' font-size='11.5' fill='#666D72'>The shell fetches data, calls into the core to decide what to do with it, then</text><text x='90' y='360' font-size='11.5' fill='#666D72'>performs the effects the core computed — the core itself never touches the outside world.</text></svg>",
              "cap": "The shell owns every side effect — reading input, writing output — and calls into a pure core to decide what those effects should be. The core itself never touches the outside world, which is what keeps it trivially testable."
            },
            {
              "t": "p",
              "x": "The practical benefit shows up directly in testing: the pure core can be tested with plain input/output assertions, no database, no filesystem, no network mock required. Only the thin shell — usually far smaller than the core — needs the heavier integration-style tests from the testing booklet, because it's the only part actually touching the outside world."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check whether purity, immutability and the map/filter/fold vocabulary translate into being able to actually restructure code, not just define the terms."
            }
          ],
          "exercises": [
            {
              "q": "Which of these functions is pure?",
              "kind": "mc",
              "options": [
                "function addToCart(cart, item) { cart.push(item); return cart; }",
                "function withItem(cart, item) { return [...cart, item]; }",
                "function logAndAdd(cart, item) { console.log('adding', item); cart.push(item); return cart; }",
                "function nextId() { return counter++; }"
              ],
              "correct": 1,
              "steps": [
                "Option A mutates its cart argument in place with push — the caller's array changes as a side effect, so it's impure.",
                "Option C both mutates cart and performs I/O (logging) — two separate reasons it's impure.",
                "Option D reads and mutates an outside counter variable and returns a different value on every call even with no arguments — impure by both criteria.",
                "Option B takes cart and item and returns a brand-new array via spread, leaving the original cart completely untouched, and always produces the same output for the same inputs — that's the pure one."
              ],
              "answer": "withItem — it returns a new array without mutating its arguments, and always produces the same output for the same input, unlike the other three which mutate, log, or depend on external state."
            },
            {
              "q": "Rewrite this loop as a map/filter/fold pipeline (in words or pseudocode is fine): given a list of order totals, keep only the ones over $50, then compute their combined total.",
              "kind": "write",
              "accept": [
                "filter totals over 50 then fold/reduce with sum",
                "filter(x > 50) then fold(+, 0)",
                "orders.filter(t => t > 50).reduce((a,b) => a+b, 0)"
              ],
              "hint": "no squaring or transforming is needed here — which two of the three operations does this actually require?",
              "steps": [
                "The original loop does two jobs at once: skip totals ≤ $50, and accumulate the rest into a running sum.",
                "No per-element transformation is needed (no map step) — every kept value is used as-is.",
                "filter(t => t > 50) isolates the \"keep only totals over 50\" job on its own.",
                "fold (reduce) with + starting at 0 isolates the \"combine into one total\" job: orders.filter(t => t > 50).reduce((sum, t) => sum + t, 0)."
              ],
              "answer": "filter the totals for t > 50, then fold/reduce the remainder with + starting at 0 — no map step is needed since no per-element transformation happens, only selection and combination."
            },
            {
              "q": "Why is an immutable list append (\"return a new list with the item added\") described as often cheaper than it sounds, rather than as an expensive full copy every time?",
              "steps": [
                "A naive mental model assumes immutability means copying the entire structure on every change, which would indeed be expensive for large collections.",
                "Most functional data structures instead share the unchanged parts of the old structure with the new one, since those parts are guaranteed never to be mutated by anyone.",
                "Only the small part that's actually different (the new item, and the minimal bookkeeping needed to attach it) needs to be freshly allocated.",
                "This structural sharing is what keeps operations on immutable data close to the cost of the equivalent mutable operation, rather than paying for a full deep copy on every single change."
              ],
              "answer": "Because immutable data structures typically use structural sharing: the unchanged parts of the original are reused (safe, since they can never be mutated by anyone), and only the small newly-different part is freshly allocated — not a full copy of the whole structure."
            },
            {
              "q": "In the functional-core/imperative-shell figure, why does the core being pure make it \"trivially testable,\" specifically compared to testing the shell?",
              "kind": "write",
              "accept": [
                "the core only needs plain input/output assertions with no mocks, database, or network setup, while the shell touches real external systems and needs integration-style tests",
                "because the core has no side effects it can be tested with just inputs and expected outputs, whereas the shell requires mocking or hitting real io"
              ],
              "hint": "think about what setup a test needs when the code under test has zero side effects, versus when it reads a file or calls a network",
              "steps": [
                "Testing a pure function requires only supplying inputs and checking the returned output — no database, filesystem, or network needs to exist or be mocked for the test to be meaningful.",
                "Testing the shell, by contrast, means testing code whose entire job is talking to the outside world — a real or mocked file, network, or terminal is unavoidably part of what's being tested.",
                "Mocking external systems is exactly the heavier, more fragile kind of test setup the testing booklet describes trading off against real integration tests.",
                "Because the shell is deliberately kept thin (most of the actual logic lives in the pure core), the amount of code that needs that heavier testing is minimized — most of the program's behavior is covered by cheap, pure-function tests instead."
              ],
              "answer": "Because a pure function's entire behavior is captured by input in, output out — a test just supplies inputs and checks the result, with no database, file, or network involved. The shell, by contrast, is defined by touching the outside world, so testing it requires real or mocked I/O; keeping the shell thin minimizes how much of the program needs that heavier kind of test."
            },
            {
              "q": "A colleague argues that using map/filter/fold instead of a hand-written loop is just a stylistic preference with no real benefit. Give one concrete reason it's more than style.",
              "steps": [
                "A hand-written loop that squares, filters, and sums in one pass interleaves three separate concerns into one block of code and one set of loop variables.",
                "Splitting the same logic into map, then filter, then fold makes each stage independently nameable, testable and debuggable — you can inspect the output after just the map step, in isolation, which a fused loop doesn't allow without adding temporary variables.",
                "Each of map/filter/fold also comes with predictable behavior on edge cases (empty input, for instance) that don't need to be re-derived or re-tested for every new loop that happens to use the same shape.",
                "This isn't purely cosmetic: it changes what has to be understood, tested and debugged as one unit versus several independent, smaller units — a real reduction in cognitive load, not just a different way to write the same thing."
              ],
              "answer": "It's not purely stylistic: splitting a fused loop into map/filter/fold stages makes each stage independently inspectable, testable and debuggable (you can check the output after just the map step), and each operation carries predictable, already-understood behavior on edge cases like empty input — genuinely reducing what has to be verified as a single unit, not just changing how it looks."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Pure function",
          "A function whose output depends only on its inputs and which causes no side effects."
        ],
        [
          "Side effect",
          "Any observable change other than a function's return value — mutation, I/O, logging."
        ],
        [
          "Immutability",
          "Data that cannot be changed after creation; operations return new values instead."
        ],
        [
          "Structural sharing",
          "Reusing the unchanged parts of an immutable structure instead of copying them."
        ],
        [
          "Referential transparency",
          "An expression can be replaced by its value with no change in program behavior."
        ],
        [
          "map",
          "Transform every element of a collection into a new collection, one-to-one."
        ],
        [
          "filter",
          "Keep only the elements of a collection that pass a predicate."
        ],
        [
          "fold / reduce",
          "Combine every element of a collection into a single accumulated value."
        ],
        [
          "Higher-order function",
          "A function that takes a function as an argument or returns one."
        ],
        [
          "Partial application",
          "Fixing some of a function's arguments ahead of time to produce a new, narrower function."
        ],
        [
          "Currying",
          "Restructuring a multi-argument function into a chain of single-argument functions."
        ],
        [
          "Function composition",
          "Building a new function by chaining the output of one function into the input of another."
        ],
        [
          "Functional core, imperative shell",
          "Isolating side effects in a thin outer layer while keeping the decision logic pure."
        ],
        [
          "Memoization",
          "Caching a pure function's results, valid precisely because the same input always gives the same output."
        ],
        [
          "Mutation",
          "Changing a value in place rather than producing a new one."
        ]
      ]
    }
});
