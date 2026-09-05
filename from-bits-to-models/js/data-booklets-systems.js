Object.assign(BOOKLETS, {
  "databases": {
      "title": "Databases",
      "blurb": "Storing and querying data that has to outlive the process that wrote it, survive concurrent writers, and answer questions fast — built on the hash tables and trees you've already met, arranged around durability and correctness guarantees.",
      "chapters": [
        {
          "title": "Why not just files?",
          "blocks": [
            {
              "t": "p",
              "x": "A database earns its complexity by solving problems that plain files handle badly: querying by arbitrary criteria without scanning everything, letting many processes read and write concurrently without corrupting each other's work, and surviving a crash mid-write without losing or duplicating data. Every one of those is a real engineering problem — a hash table (from the hash booklet) already gives O(1) average lookup by key, but a database needs that plus durability across power loss, plus correctness when a hundred clients write at once."
            },
            {
              "t": "p",
              "x": "The relational model, still the dominant one, organizes data into tables (rows and columns) and lets you query by describing what you want (SQL) rather than how to fetch it — the database's query planner decides how, using indexes and statistics about the data it's actually storing."
            }
          ]
        },
        {
          "title": "Relational modelling and normalisation",
          "blocks": [
            {
              "t": "p",
              "x": "A table's rows share the same columns; a primary key uniquely identifies each row, and a foreign key in one table references a primary key in another, encoding a relationship (an order references a customer) without duplicating the customer's data into every order row. Normalisation is the discipline of structuring tables to avoid storing the same fact in two places — if a customer's address lives redundantly in every one of their orders, updating it means finding and fixing every copy, and missing one produces silently inconsistent data."
            },
            {
              "t": "p",
              "x": "The normal forms formalize this incrementally: roughly, first normal form requires atomic column values (no comma-separated lists crammed into one field), and third normal form (the common practical target) requires that every non-key column depends on the whole primary key and nothing but the key. Denormalization — deliberately reintroducing redundancy — is a legitimate trade-off too, usually to avoid the join cost of reassembling normalized data on every read of a hot query path."
            },
            {
              "t": "note",
              "x": "Normalisation optimizes for write correctness (one place to update); denormalisation optimizes for read speed (no reassembly needed). Neither is universally right — it depends on whether the table is write-heavy or read-heavy, which is a question the evaluation booklet's instinct (measure, don't assume) applies here too."
            }
          ]
        },
        {
          "title": "Indexes and query plans",
          "blocks": [
            {
              "t": "p",
              "x": "Without an index, finding rows matching a condition means a full table scan — checking every row, O(n). An index is a separate, ordered structure (commonly a B-tree, the balanced structure the trees booklet ends on, or a hash index for exact-match lookups) that maps a column's values to the rows containing them, turning a scan into an O(log n) lookup at the cost of extra storage and slower writes, since every insert now has to update the index too."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Finding email = 'zoe@x.com' among 1M rows: scan versus index</text>\n<text x=\"30\" y=\"56\" font-size=\"12\" fill=\"#9AA1A6\">Without index — full table scan</text>\n<g>\n<rect x=\"30\" y=\"66\" width=\"620\" height=\"18\" fill=\"#0E1113\" stroke=\"#2E3438\"/>\n<rect x=\"30\" y=\"66\" width=\"620\" height=\"18\" fill=\"none\" stroke=\"#2E3438\"/>\n<rect x=\"340\" y=\"66\" width=\"22\" height=\"18\" fill=\"#20272B\" stroke=\"#EDEFF0\"/>\n</g>\n<text x=\"30\" y=\"100\" font-size=\"11\" fill=\"#666D72\">checks up to all 1,000,000 rows, one by one — O(n)</text>\n<text x=\"30\" y=\"146\" font-size=\"12\" fill=\"#9AA1A6\">With a B-tree index on email</text>\n<rect x=\"320\" y=\"156\" width=\"80\" height=\"24\" fill=\"#0E1113\" stroke=\"#EDEFF0\"/><text x=\"360\" y=\"172\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#EDEFF0\">m...</text>\n<line x1=\"350\" y1=\"180\" x2=\"300\" y2=\"206\" stroke=\"#2E3438\"/><line x1=\"390\" y1=\"180\" x2=\"440\" y2=\"206\" stroke=\"#2E3438\"/>\n<rect x=\"260\" y=\"206\" width=\"80\" height=\"22\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"300\" y=\"221\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">t...</text>\n<rect x=\"400\" y=\"206\" width=\"80\" height=\"22\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/><text x=\"440\" y=\"221\" text-anchor=\"middle\" font-size=\"10\" fill=\"#EDEFF0\">z...→row</text>\n<text x=\"30\" y=\"246\" font-size=\"11\" fill=\"#666D72\">~log(1M) ≈ 20 steps to the row via the index, versus up to 1,000,000 for the scan — O(log n) vs O(n)</text>\n</svg>",
              "cap": "The scan checks rows in whatever order they're stored; the index narrows the search by comparing against a small number of internal nodes, the same balancing trick the trees booklet's B-tree section covers."
            },
            {
              "t": "p",
              "x": "A query plan is what the database actually decides to do to answer a specific query — which index (if any) to use, which order to join multiple tables in, whether to sort before or after filtering. \"Reading a query plan\" (the DETAILS check for this node) means looking at that decision and spotting when the planner chose a full scan where an index existed, usually because the query didn't structure its filter in a way the planner could match to the index, or because the planner's statistics about the data were stale."
            }
          ]
        },
        {
          "title": "Transactions, ACID, and isolation",
          "blocks": [
            {
              "t": "p",
              "x": "A transaction groups multiple operations so they succeed or fail together — transferring money between two accounts needs the debit and the credit to happen as one unit, or a crash between them leaves money vanished or duplicated. ACID names the guarantees: Atomicity (all-or-nothing), Consistency (the database moves between valid states, respecting its own constraints), Isolation (concurrent transactions don't see each other's half-finished work), Durability (once committed, a transaction survives a crash)."
            },
            {
              "t": "p",
              "x": "Isolation is the subtlest of the four, because perfect isolation (as if transactions ran one at a time) is expensive, so most databases offer weaker, faster isolation levels by default and let you opt into stronger ones. Read committed (a common default) prevents reading another transaction's uncommitted changes but still allows a value you already read to change if you read it again later in the same transaction (a non-repeatable read); serializable, the strongest level, behaves as if every transaction ran alone, one after another, at the cost of more blocking or more aborted-and-retried transactions under contention."
            },
            {
              "t": "note",
              "x": "This is a direct trade-off, not a free upgrade: stronger isolation means more locking or more conflict detection, which means lower throughput under concurrent load. Choosing an isolation level is choosing how much correctness risk you're willing to trade for how much throughput — a decision that should be explicit, not left at whatever the default happens to be."
            }
          ]
        },
        {
          "title": "Beyond relational: key-value, document, and vector stores",
          "blocks": [
            {
              "t": "p",
              "x": "Relational databases aren't the only shape. A key-value store (conceptually, the hash table from the hash booklet, made durable and networked) trades away joins and complex queries for very fast, simple lookups by key — a good fit when access is always \"give me the record for this ID.\" A document store keeps semi-structured records (commonly JSON) without a fixed schema across all rows, useful when different records legitimately have different shapes."
            },
            {
              "t": "p",
              "x": "A vector store indexes high-dimensional embeddings (vectors produced by an ML model, covered later) and answers \"which stored vectors are closest to this query vector\" instead of exact-match or range queries — the retrieval half of retrieval-augmented generation. None of these replace relational databases outright; picking among them is about matching the store's strengths to the query pattern you actually have, and production systems frequently use more than one kind side by side."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These mix conceptual (why a guarantee exists) with diagnostic (what's slow, and why) — the two skills the DETAILS check for this node actually asks for."
            }
          ],
          "exercises": [
            {
              "q": "A query filtering on `email` takes 4 seconds on a 10-million-row table even though an index exists on `email`. What's the most likely first thing to check?",
              "kind": "mc",
              "options": [
                "Whether the query's filter is written in a form the planner can actually match to the index",
                "Whether the table has a primary key",
                "Whether the database supports transactions",
                "Whether the rows are stored in a document format"
              ],
              "correct": 0,
              "steps": [
                "An index existing doesn't guarantee it's used — the planner has to recognize that a filter can use it.",
                "Common culprits: wrapping the column in a function (`LOWER(email) = ...`), a type mismatch between the filter value and the column, or stale statistics making a full scan look cheaper than it is to the planner.",
                "Checking the actual query plan (an EXPLAIN, in most SQL databases) shows directly whether the index was used or a full scan happened instead.",
                "Primary keys and transaction support are unrelated to why this specific query is slow."
              ],
              "answer": "Check the query plan to see whether the index was actually used — an index existing doesn't guarantee the planner matched it to this specific filter; a function wrapped around the column, a type mismatch, or stale statistics are the usual reasons an index gets skipped in favor of a full scan."
            },
            {
              "q": "Explain why serializable isolation typically reduces a database's throughput under concurrent load, compared to a weaker isolation level.",
              "kind": "write",
              "accept": [
                "more locking or conflict detection needed to simulate transactions running one at a time",
                "has to prevent transactions from seeing effects of concurrent transactions, requiring more blocking or aborts"
              ],
              "hint": "think about what has to happen to make concurrent transactions behave as if they ran one after another",
              "steps": [
                "Serializable isolation has to produce results equivalent to every transaction running one at a time, with no overlap.",
                "To guarantee this while still running transactions concurrently for speed, the database must detect or prevent conflicting concurrent access.",
                "That detection/prevention takes the form of more locking (blocking other transactions) or more conflict checking with aborts-and-retries when a real conflict is found.",
                "Both of those reduce how much work can actually proceed concurrently, which is the throughput cost of the stronger guarantee."
              ],
              "answer": "To guarantee behavior equivalent to running transactions one at a time, the database has to add locking or conflict detection that blocks or aborts concurrent transactions when their work would actually overlap — that extra coordination is exactly what a weaker isolation level skips, which is why it's faster but riskier."
            },
            {
              "q": "You're designing a table for an application that reads a user's profile on every page load but updates it rarely. Should you lean toward normalizing or denormalizing the profile data?",
              "steps": [
                "Normalisation optimizes for write correctness at some read cost (possible joins to reassemble data); denormalisation optimizes for read speed at some write-consistency cost.",
                "This workload is read-heavy (every page load) and write-light (rare updates).",
                "The read cost of normalisation (extra joins on a hot path) is paid far more often than the write-consistency benefit is exercised.",
                "Denormalizing (storing the frequently-read profile data flatter, even if slightly redundant) trades a rare write-time cost for a much more common read-time win."
              ],
              "answer": "Lean toward denormalizing — the read path is exercised on every page load while writes are rare, so the read-speed benefit of avoiding joins is paid off far more often than the write-consistency cost of denormalisation is incurred."
            },
            {
              "q": "A vector store answers 'which stored items are closest to this query' rather than exact-match lookups. What kind of data does it index, and where does that data typically come from?",
              "kind": "write",
              "accept": [
                "embeddings from a machine learning model",
                "vectors produced by an ml model, used for similarity search",
                "high dimensional embeddings"
              ],
              "hint": "this is the retrieval half of a system covered later in the ai track",
              "steps": [
                "Vector stores index high-dimensional numeric vectors, not raw text or structured rows directly.",
                "These vectors are embeddings — numeric representations produced by a machine learning model that places semantically similar items near each other in the vector space.",
                "'Closest' is then measured by a distance or similarity function between vectors, not by matching a key exactly.",
                "This is exactly the retrieval mechanism behind retrieval-augmented generation, covered later in the ai track."
              ],
              "answer": "It indexes embeddings — high-dimensional vectors produced by a machine learning model, positioned so that semantically similar items land near each other — and answers nearest-neighbor queries against them rather than exact-match lookups. This is the retrieval mechanism behind retrieval-augmented generation."
            },
            {
              "q": "Why does adding an index speed up reads but slow down writes?",
              "steps": [
                "An index is a separate structure (often a B-tree) that must stay in sync with the table's actual data.",
                "A read that matches the index can skip scanning most of the table, which is the entire speed benefit.",
                "But every insert, update, or delete that touches an indexed column now also has to update the index structure, not just the table row.",
                "More indexes means more structures to keep in sync on every write, which is the direct source of the write-side slowdown — it's a genuine trade-off, not a free win."
              ],
              "answer": "An index is extra structure kept in sync with the table; reads benefit because they can search the index instead of scanning every row, but every write now has to update both the table and every index touching the changed columns, which is real added work per write — more indexes means faster reads and slower writes, not faster everything."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Table",
          "A relation of rows sharing the same columns."
        ],
        [
          "Primary key",
          "The column (or columns) that uniquely identifies a row."
        ],
        [
          "Foreign key",
          "A column referencing another table's primary key, encoding a relationship."
        ],
        [
          "Normalisation",
          "Structuring tables to avoid storing the same fact redundantly in multiple places."
        ],
        [
          "Denormalisation",
          "Deliberately reintroducing redundancy to speed up reads at the cost of write complexity."
        ],
        [
          "Index",
          "An auxiliary structure mapping column values to rows, turning a scan into a fast lookup."
        ],
        [
          "B-tree",
          "A balanced tree structure commonly used to implement database indexes."
        ],
        [
          "Query plan",
          "The concrete sequence of operations a database chooses to answer a specific query."
        ],
        [
          "Full table scan",
          "Checking every row to answer a query, in the absence of a usable index."
        ],
        [
          "Transaction",
          "A group of operations that succeed or fail together as one unit."
        ],
        [
          "ACID",
          "Atomicity, Consistency, Isolation, Durability — the transaction guarantees a database offers."
        ],
        [
          "Isolation level",
          "How much of a concurrent transaction's in-progress work another transaction can observe."
        ],
        [
          "Serializable isolation",
          "The strongest isolation level: behaves as if transactions ran one at a time."
        ],
        [
          "Key-value store",
          "A durable, networked hash table optimized for lookup by key."
        ],
        [
          "Document store",
          "A database storing semi-structured records without a single fixed schema."
        ],
        [
          "Vector store",
          "A database indexing high-dimensional embeddings for nearest-neighbor similarity search."
        ]
      ]
    },
  "memory": {
      "title": "Memory management",
      "blurb": "What actually happens underneath a variable or a pointer (from the pointers booklet): where the bytes live, who's responsible for freeing them, and why the same data can be fast or slow to access depending purely on how it's laid out.",
      "chapters": [
        {
          "title": "Stack versus heap",
          "blocks": [
            {
              "t": "p",
              "x": "A running program has (at least) two regions of memory for its data. The stack holds local variables and function call bookkeeping in a strict last-in-first-out order: calling a function pushes a new frame holding its locals and return address, and returning pops that frame off, all in O(1) with no searching required. The heap holds everything whose size or lifetime isn't known at compile time or doesn't fit the strict call-and-return pattern — allocated explicitly (malloc, new, or implicitly by a language runtime) and freed independently of any particular function call."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 260\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Stack grows with each call; heap holds independently-lived allocations</text>\n<text x=\"120\" y=\"52\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">Stack</text>\n<rect x=\"60\" y=\"178\" width=\"120\" height=\"36\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"120\" y=\"200\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">main()</text>\n<rect x=\"60\" y=\"140\" width=\"120\" height=\"36\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"120\" y=\"162\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">compute()</text>\n<rect x=\"60\" y=\"102\" width=\"120\" height=\"36\" fill=\"#20272B\" stroke=\"#EDEFF0\" stroke-width=\"1.6\"/><text x=\"120\" y=\"124\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">helper() ← top</text>\n<text x=\"30\" y=\"236\" font-size=\"11\" fill=\"#666D72\">grows ↑, shrinks ↓ — exactly the call stack, LIFO</text>\n<line x1=\"350\" y1=\"40\" x2=\"350\" y2=\"240\" stroke=\"#23282B\"/>\n<text x=\"530\" y=\"52\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">Heap</text>\n<rect x=\"400\" y=\"80\" width=\"90\" height=\"30\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"445\" y=\"99\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">block A</text>\n<rect x=\"500\" y=\"80\" width=\"50\" height=\"30\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-dasharray=\"2,2\"/><text x=\"525\" y=\"99\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\">free</text>\n<rect x=\"560\" y=\"80\" width=\"70\" height=\"30\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"595\" y=\"99\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">block B</text>\n<rect x=\"400\" y=\"130\" width=\"60\" height=\"30\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-dasharray=\"2,2\"/><text x=\"430\" y=\"149\" text-anchor=\"middle\" font-size=\"9.5\" fill=\"#666D72\">free</text>\n<rect x=\"470\" y=\"130\" width=\"110\" height=\"30\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"525\" y=\"149\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#EDEFF0\">block C</text>\n<text x=\"400\" y=\"200\" font-size=\"11\" fill=\"#666D72\">allocated and freed in any order — no call structure required</text>\n</svg>",
              "cap": "Stack frames appear and vanish strictly with function calls; heap blocks can be allocated and freed in any order, which is exactly why the heap needs an allocator to track free space at all."
            },
            {
              "t": "p",
              "x": "This is why stack allocation is essentially free and heap allocation isn't: the stack's discipline (only ever touch the top) means no bookkeeping is needed to find free space, while the heap's arbitrary allocate/free order means the allocator has to actively track which regions are free and find a suitably-sized one on every allocation."
            }
          ]
        },
        {
          "title": "Allocation strategies and fragmentation",
          "blocks": [
            {
              "t": "p",
              "x": "A heap allocator maintains a free list — a record of which regions aren't currently in use — and has to pick one when a new allocation request arrives. First-fit takes the first free region big enough; best-fit searches for the smallest region that still fits, minimizing wasted space per allocation but costing more time to search and tending to leave many tiny, useless leftover fragments."
            },
            {
              "t": "p",
              "x": "Fragmentation is the deeper problem underlying this choice: external fragmentation is free memory scattered in pieces too small individually to satisfy a request, even though the total free space would be enough; internal fragmentation is space wasted inside an allocated block because it was rounded up to some fixed size class. A pattern of repeatedly allocating and freeing different-sized blocks is exactly what produces external fragmentation over a program's lifetime, which is why long-running processes (servers, not short scripts) are the ones where allocator choice and fragmentation actually matter in practice."
            },
            {
              "t": "note",
              "x": "Fixed-size allocators (slab or pool allocators) sidestep fragmentation entirely for objects of one known size, by pre-carving memory into uniform slots and reusing freed slots for the next same-sized request — no searching, no fragmentation, at the cost of only working for that one size class."
            }
          ]
        },
        {
          "title": "Manual freeing versus garbage collection",
          "blocks": [
            {
              "t": "p",
              "x": "Manual memory management (C's malloc/free, C++'s new/delete) puts the programmer in charge of deciding exactly when a heap allocation is no longer needed and freeing it explicitly. This gives precise, predictable control over when memory is reclaimed — but two mistakes are always one line away: freeing something still in use elsewhere (leaving a dangling pointer, from the pointers booklet, that dereferences into now-invalid memory) or forgetting to free something no longer reachable at all (a memory leak, which slowly exhausts available memory over the program's lifetime)."
            },
            {
              "t": "p",
              "x": "Garbage collection automates this: the runtime periodically determines which heap objects are no longer reachable from any live variable and reclaims them itself, eliminating both dangling-pointer and leak bugs of this specific kind (a reference cycle, discussed next, is a partial exception) at the cost of unpredictable pauses when collection runs and some memory overhead for the bookkeeping. Mark-and-sweep, the classic approach, starts from every reachable root (stack variables, globals) and marks everything transitively reachable from them, then sweeps — reclaiming everything left unmarked."
            },
            {
              "t": "note",
              "x": "This is a genuine trade-off between control and safety, not a strictly-better option in either direction: systems programming (operating system kernels, real-time systems where an unpredictable GC pause is unacceptable) still leans manual; most application-level languages (Python, Java, JavaScript, Go) default to garbage collection because the safety and productivity gain outweighs the performance cost for most workloads."
            }
          ]
        },
        {
          "title": "Reference counting and cycles",
          "blocks": [
            {
              "t": "p",
              "x": "Reference counting is a different, simpler garbage-collection strategy: every heap object carries a count of how many references point to it, incremented on each new reference and decremented when a reference goes away; when the count hits zero, the object is immediately freed. It's predictable (no separate collection pass, no pause) and used by Python's CPython implementation and Swift, among others."
            },
            {
              "t": "p",
              "x": "Its specific weakness is cycles: if object A references object B and B references A, and nothing outside the pair references either, both counts stay at 1 forever even though the pair is genuinely unreachable from anywhere the program can still get to — a reference-counting-only collector leaks that pair permanently. Real reference-counting systems fix this either with a periodic cycle-detecting collector running alongside the reference counts (CPython's actual approach) or with weak references — references that don't increment the count, deliberately used for one side of a relationship that's expected to form cycles, such as a child node's back-pointer to its parent."
            }
          ]
        },
        {
          "title": "Cache lines, locality, and false sharing",
          "blocks": [
            {
              "t": "p",
              "x": "Memory access time isn't uniform — the arrays booklet's cache-locality discussion already establishes that a CPU fetches memory in fixed-size chunks called cache lines (commonly 64 bytes), not individual bytes, and that accessing memory in the order it's laid out in (spatial locality) is dramatically faster than jumping around, because each cache-line fetch brings in several nearby values for free."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 220\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"30\" y=\"24\" font-size=\"12.5\" fill=\"#666D72\">Row-major traversal (matches layout) versus column-major (jumps a full row each step)</text>\n<text x=\"30\" y=\"56\" font-size=\"12\" fill=\"#9AA1A6\">by rows — sequential</text>\n<g font-family=\"monospace\" font-size=\"11\">\n<rect x=\"30\" y=\"68\" width=\"36\" height=\"26\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"48\" y=\"85\" text-anchor=\"middle\" fill=\"#EDEFF0\">1</text>\n<rect x=\"66\" y=\"68\" width=\"36\" height=\"26\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"84\" y=\"85\" text-anchor=\"middle\" fill=\"#EDEFF0\">2</text>\n<rect x=\"102\" y=\"68\" width=\"36\" height=\"26\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"120\" y=\"85\" text-anchor=\"middle\" fill=\"#EDEFF0\">3</text>\n<rect x=\"138\" y=\"68\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\"/><text x=\"156\" y=\"85\" text-anchor=\"middle\" fill=\"#666D72\">4</text>\n</g>\n<text x=\"200\" y=\"85\" font-size=\"11\" fill=\"#666D72\">← one cache-line fetch covers steps 1-3</text>\n<text x=\"30\" y=\"140\" font-size=\"12\" fill=\"#9AA1A6\">by columns — strided</text>\n<g font-family=\"monospace\" font-size=\"11\">\n<rect x=\"30\" y=\"152\" width=\"36\" height=\"26\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"48\" y=\"169\" text-anchor=\"middle\" fill=\"#EDEFF0\">1</text>\n<rect x=\"66\" y=\"152\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-dasharray=\"2,2\"/><text x=\"84\" y=\"169\" text-anchor=\"middle\" fill=\"#666D72\">.</text>\n<rect x=\"102\" y=\"152\" width=\"36\" height=\"26\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-dasharray=\"2,2\"/><text x=\"120\" y=\"169\" text-anchor=\"middle\" fill=\"#666D72\">.</text>\n<rect x=\"138\" y=\"152\" width=\"36\" height=\"26\" fill=\"#20272B\" stroke=\"#EDEFF0\"/><text x=\"156\" y=\"169\" text-anchor=\"middle\" fill=\"#EDEFF0\">2</text>\n</g>\n<text x=\"200\" y=\"169\" font-size=\"11\" fill=\"#666D72\">← step 2 is a full row away — a fresh cache-line fetch, no reuse</text>\n<text x=\"30\" y=\"204\" font-size=\"11\" fill=\"#666D72\">Same data, same total accesses — row-major reuses each fetched cache line; column-major discards it.</text>\n</svg>",
              "cap": "This is exactly the arrays booklet's row-major-order point applied to a whole traversal: matching your loop order to memory layout can be the difference between a handful of cache-line fetches and one fetch per element."
            },
            {
              "t": "p",
              "x": "False sharing is a subtler, multi-threaded version of the same issue: if two threads on different CPU cores modify two different variables that happen to sit on the same 64-byte cache line, the cores constantly invalidate each other's cached copy of that line even though the threads never actually touch each other's data — the hardware's cache-coherence protocol can't tell \"different variable, same line\" from a real conflict, so it treats every write as if it might be one. The fix is usually padding: deliberately spacing hot per-thread variables far enough apart that they land on different cache lines."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check both the mental model (stack vs heap, what GC actually automates) and the specific diagnostic the DETAILS check for this node asks for: explaining a row-versus-column traversal gap."
            }
          ],
          "exercises": [
            {
              "q": "Why is allocating a local variable on the stack essentially free, while allocating on the heap requires real work by an allocator?",
              "kind": "mc",
              "options": [
                "The stack only ever grows or shrinks at its top, so there's no free space to search for",
                "The stack is made of faster hardware than the heap",
                "Heap memory is stored on disk, not in RAM",
                "Stack variables don't actually use any memory"
              ],
              "correct": 0,
              "steps": [
                "Stack allocation and deallocation happen strictly in last-in-first-out order, tied to function calls and returns.",
                "Because only the top of the stack is ever touched, there's no need to search for free space or track a list of available regions — a new frame just goes right after the current top.",
                "The heap's allocations and frees happen in arbitrary order, so an allocator has to actively track which regions are free and search for a suitably-sized one on every request.",
                "Stack and heap live in the same physical RAM — the speed difference is about bookkeeping, not different hardware."
              ],
              "answer": "Because the stack only ever grows or shrinks at its top, in strict call/return order — there's no free space to search for or track. The heap's allocations and frees happen in arbitrary order, so an allocator has to actively maintain and search a free list on every request, which is real, non-free work."
            },
            {
              "q": "Two heap objects A and B reference each other and nothing else in the program references either one. Under pure reference counting (no cycle detector), what happens to them?",
              "kind": "write",
              "accept": [
                "they leak, never get freed because their reference counts never reach zero",
                "memory leak because each keeps the other's count above zero"
              ],
              "hint": "think about what each object's reference count actually is, even though neither is reachable from the rest of the program",
              "steps": [
                "A's reference count includes the reference from B, and B's reference count includes the reference from A.",
                "Even though nothing else in the program can reach A or B anymore, each one still holds a reference to the other.",
                "Reference counting only frees an object when its count reaches exactly zero.",
                "Since each object's count is kept at 1 by the other, neither ever reaches zero — both leak permanently unless something breaks the cycle (a cycle detector, or a weak reference on one side)."
              ],
              "answer": "They leak. Each object's reference count is kept at 1 by the other (A references B, B references A), so under pure reference counting neither count ever reaches zero, even though the pair is genuinely unreachable from the rest of the program — this is exactly the failure mode that weak references or a separate cycle-detecting collector exist to fix."
            },
            {
              "q": "Traversing a large 2D matrix column-by-column is often dramatically slower than row-by-row, even though both visit the same number of elements. Explain why, referencing how the matrix is actually laid out in memory.",
              "steps": [
                "A 2D matrix is stored in memory as one contiguous block, in row-major order (each row laid out one after another) in most languages.",
                "Traversing row-by-row visits memory in the same order it's physically laid out, so consecutive accesses usually fall within the same already-fetched cache line.",
                "Traversing column-by-column jumps a full row's width in memory between consecutive accesses, so each access is very likely to require a fresh cache-line fetch from further-away memory.",
                "Same total number of element accesses, but row-major traversal reuses far more of what each cache-line fetch brought in — the gap is a locality difference, not an algorithmic one."
              ],
              "answer": "Because the matrix is stored contiguously in row-major order, row-by-row traversal matches that layout and reuses each fetched cache line across several consecutive elements; column-by-column traversal jumps a full row's width between accesses, defeating that reuse and triggering a fresh, slower cache-line fetch on nearly every step — same element count, very different memory behavior."
            },
            {
              "q": "Two threads on different CPU cores each modify their own separate counter variable, and performance is unexpectedly bad. The variables are never actually shared. What's a likely cause?",
              "kind": "mc",
              "options": [
                "False sharing — the two variables happen to sit on the same cache line",
                "A reference cycle between the two variables",
                "External fragmentation from too many small allocations",
                "The variables are stored on the stack instead of the heap"
              ],
              "correct": 0,
              "steps": [
                "The symptom (bad performance despite no real data sharing) is the classic signature of false sharing.",
                "If the two threads' counters happen to be placed close enough in memory to land on the same cache line, the cache-coherence protocol treats every write to either one as a potential conflict with the other.",
                "This forces constant invalidation and re-fetching of that cache line across cores, even though the threads never actually read or write each other's data.",
                "Reference cycles and fragmentation are unrelated to this symptom; stack-versus-heap placement doesn't itself cause cross-core cache invalidation the way sharing a cache line does."
              ],
              "answer": "False sharing — the two variables likely sit close enough in memory to land on the same 64-byte cache line, so the hardware's cache-coherence protocol invalidates that line across cores on every write to either variable, even though the threads never actually touch each other's data. Padding the variables apart, onto separate cache lines, is the usual fix."
            },
            {
              "q": "Garbage collection eliminates dangling-pointer bugs from manual freeing, but a GC'd program can still leak memory. How is that possible?",
              "steps": [
                "Garbage collection reclaims objects that are unreachable from any live root — but it can only do that for objects that actually become unreachable.",
                "If a program keeps holding a reference to an object it no longer actually needs (e.g. an ever-growing cache, or a global list that's only ever appended to), that object stays reachable and the collector correctly leaves it alone.",
                "This is a logical leak, not a memory-safety bug — the collector is doing exactly what it's supposed to do, given what the program is still referencing.",
                "GC guarantees no use-after-free and no manual double-free bugs, but it doesn't guarantee the program only holds references to things it should still care about."
              ],
              "answer": "Because garbage collection only reclaims objects that are actually unreachable — if the program itself keeps a live reference to something it no longer needs (an ever-growing cache, a list that's only appended to, a forgotten event-listener registration), the object stays reachable and the collector correctly leaves it alone. GC removes dangling-pointer and this-object-is-truly-unreachable-leak bugs, not logical leaks caused by holding onto references too long."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Stack",
          "LIFO memory region for local variables and call bookkeeping; allocation/deallocation is O(1)."
        ],
        [
          "Heap",
          "Memory region for allocations of arbitrary lifetime, managed by an allocator."
        ],
        [
          "Stack frame",
          "The block of stack memory holding one function call's locals and return address."
        ],
        [
          "Allocator",
          "The runtime component that tracks free heap memory and services allocation requests."
        ],
        [
          "Free list",
          "An allocator's record of which heap regions are currently unused."
        ],
        [
          "Fragmentation",
          "Wasted or unusable memory, either scattered free space (external) or padding inside blocks (internal)."
        ],
        [
          "Slab/pool allocator",
          "A fixed-size-object allocator that avoids fragmentation for one known object size."
        ],
        [
          "Dangling pointer",
          "A pointer to memory that has already been freed."
        ],
        [
          "Memory leak",
          "Allocated memory that's no longer needed but never freed, or unreachable but never reclaimed."
        ],
        [
          "Garbage collection",
          "Automatic reclamation of heap objects no longer reachable from any live reference."
        ],
        [
          "Mark-and-sweep",
          "A GC strategy: mark everything reachable from the roots, then reclaim everything unmarked."
        ],
        [
          "Reference counting",
          "A GC strategy that frees an object immediately when its incoming-reference count hits zero."
        ],
        [
          "Reference cycle",
          "Mutually-referencing objects that stay above a zero reference count despite being unreachable."
        ],
        [
          "Weak reference",
          "A reference that doesn't increment an object's reference count, used to avoid cycles."
        ],
        [
          "Cache line",
          "The fixed-size chunk (commonly 64 bytes) a CPU fetches from memory at once."
        ],
        [
          "Spatial locality",
          "Accessing memory addresses close together in sequence, which reuses fetched cache lines."
        ],
        [
          "False sharing",
          "Performance loss from unrelated variables on different cores sharing one cache line."
        ]
      ]
    },
  "os": {
    "title": "Operating Systems",
    "blurb": "Processes, threads, scheduling and virtual memory — the layer that turns one CPU and some RAM into the illusion that every program has the machine to itself.",
    "chapters": [
      {
        "title": "Processes: the unit of isolation",
        "blocks": [
          {
            "t": "p",
            "x": "A process is a running program plus everything the operating system tracks to keep it isolated from every other process: its own address space, its own file descriptors, its own view of the machine. A program is a file on disk; a process is that program loaded into memory and actually executing, with the OS bookkeeping — the process control block — that records its state, its registers when it isn't currently running, and the resources it holds."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 660 380\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"45\" y=\"25\" width=\"110\" height=\"50\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"100\" y=\"55\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">New</text>\n<rect x=\"245\" y=\"25\" width=\"110\" height=\"50\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"300\" y=\"55\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Ready</text>\n<rect x=\"245\" y=\"145\" width=\"110\" height=\"50\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"300\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Running</text>\n<rect x=\"465\" y=\"145\" width=\"130\" height=\"50\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"530\" y=\"175\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Waiting</text>\n<rect x=\"245\" y=\"285\" width=\"110\" height=\"50\" rx=\"8\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"300\" y=\"315\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Terminated</text>\n<line x1=\"155\" y1=\"50\" x2=\"245\" y2=\"50\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"245,50 235,45 235,55\" fill=\"#666D72\"/>\n<text x=\"200\" y=\"42\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">admitted</text>\n<line x1=\"290\" y1=\"75\" x2=\"290\" y2=\"145\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"290,145 285,135 295,135\" fill=\"#666D72\"/>\n<text x=\"230\" y=\"112\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">dispatch</text>\n<line x1=\"315\" y1=\"145\" x2=\"315\" y2=\"75\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"315,75 310,85 320,85\" fill=\"#666D72\"/>\n<text x=\"400\" y=\"112\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">preempted</text>\n<line x1=\"355\" y1=\"165\" x2=\"465\" y2=\"165\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"465,165 455,160 455,170\" fill=\"#666D72\"/>\n<text x=\"410\" y=\"157\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">I/O wait</text>\n<path d=\"M480,145 C 430,90 360,60 355,55\" fill=\"none\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"355,55 365,53 361,63\" fill=\"#666D72\"/>\n<text x=\"470\" y=\"80\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">I/O complete</text>\n<line x1=\"300\" y1=\"195\" x2=\"300\" y2=\"285\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"300,285 295,275 305,275\" fill=\"#666D72\"/>\n<text x=\"330\" y=\"240\" text-anchor=\"middle\" font-size=\"10\" fill=\"#9AA1A6\">exit</text>\n</svg>",
            "cap": "A process moves between five states as the OS admits, schedules, preempts and eventually terminates it. “Ready” and “Running” are both alive and runnable — the only difference is whether the scheduler has actually given this process the CPU right now."
          },
          {
            "t": "p",
            "x": "The states in the figure exist because there are always more processes wanting to run than there are CPU cores to run them on. New covers loading and setup; Ready means runnable but not currently assigned a core; Running means actually executing; Waiting means blocked on something outside the CPU's control, most often I/O; Terminated means finished, with the OS reclaiming its resources. The scheduler's whole job is deciding, moment to moment, which Ready process becomes the Running one."
          }
        ]
      },
      {
        "title": "Threads and the illusion of simultaneity",
        "blocks": [
          {
            "t": "p",
            "x": "A thread is a unit of execution within a process, and a process can have many. Threads inside one process share that process's address space and file descriptors, but each keeps its own stack and its own set of registers — which is exactly the boundary of what a context switch has to save and restore. Switching between threads of the same process is cheaper than switching between processes precisely because there's no address space to swap."
          },
          {
            "t": "p",
            "x": "On a single core, running “multiple things at once” is an illusion built from rapid switching: the OS runs one thread for a short slice of time, saves its state, loads another thread's saved state, and runs that one — fast enough that, to a human, it looks simultaneous. On a machine with multiple cores, some of that simultaneity is real: different cores genuinely execute different threads at the same instant, while time-slicing still handles the case where there are more runnable threads than cores."
          },
          {
            "t": "note",
            "x": "A context switch isn't free — it costs the time to save and restore state, plus an indirect cost from a cold cache: the new thread's data isn't the data currently sitting in the core's cache lines (see memory), so its first several memory accesses run slow until the cache fills back up with its working set. This is part of why a scheduler that switches too eagerly can lose net throughput even while looking maximally “fair.”"
          }
        ]
      },
      {
        "title": "Scheduling policies and fairness",
        "blocks": [
          {
            "t": "p",
            "x": "Given more runnable threads than cores, the scheduler must decide an order, and different orders optimize for different things. First-come-first-served is simple but lets one long job block everything behind it. Round robin gives every runnable thread a fixed time slice in rotation, bounding how long anything waits at the cost of more context switches. Priority scheduling lets more important work go first, at the cost of a real risk: a low-priority thread can wait forever if higher-priority work never stops arriving, a failure called starvation."
          },
          {
            "t": "list",
            "items": [
              "<strong>Throughput</strong>: total work completed per unit time — favored by minimizing switching overhead.",
              "<strong>Latency</strong>: how long a given piece of work waits before it starts — favored by short time slices and preemption.",
              "<strong>Fairness</strong>: whether every thread gets a reasonable share — favored by round robin and its relatives.",
              "<strong>Starvation avoidance</strong>: guaranteeing nothing waits forever, usually via priority aging — gradually raising a waiting thread's priority the longer it's been waiting."
            ]
          },
          {
            "t": "p",
            "x": "No policy maximizes all four at once, which is why real schedulers (Linux's Completely Fair Scheduler, for instance) are tuned compromises rather than a pure implementation of any single idea. A related failure worth knowing by name is priority inversion: a low-priority thread holds a lock that a high-priority thread needs, and medium-priority threads that need neither lock preempt the low-priority one, indirectly blocking the high-priority thread indefinitely — famously the bug that nearly stranded the Mars Pathfinder rover, fixed by having a thread temporarily inherit the priority of whoever is waiting on its lock."
          }
        ]
      },
      {
        "title": "Virtual memory and paging",
        "blocks": [
          {
            "t": "p",
            "x": "Every process sees its own private address space starting near zero, as if it owned all of memory — even though many processes are running at once on the same physical RAM. The OS provides this by giving each process virtual addresses and translating them to physical addresses behind the scenes, one fixed-size page at a time, via a per-process page table."
          },
          {
            "t": "fig",
            "svg": "<svg viewBox=\"0 0 660 340\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"150\" y=\"20\" font-size=\"11.5\" fill=\"#666D72\">virtual address</text>\n<rect x=\"150\" y=\"30\" width=\"140\" height=\"40\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"220\" y=\"55\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">page # (VPN)</text>\n<rect x=\"290\" y=\"30\" width=\"120\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1.2\"/>\n<text x=\"350\" y=\"55\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">offset</text>\n<line x1=\"220\" y1=\"70\" x2=\"220\" y2=\"115\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"220,115 215,105 225,105\" fill=\"#666D72\"/>\n<rect x=\"120\" y=\"115\" width=\"220\" height=\"115\" rx=\"4\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"230\" y=\"132\" text-anchor=\"middle\" font-size=\"11\" fill=\"#9AA1A6\">page table</text>\n<text x=\"140\" y=\"155\" font-size=\"11.5\" fill=\"#EDEFF0\" font-family=\"monospace\">VPN 0 -&gt; frame 5</text>\n<text x=\"140\" y=\"180\" font-size=\"11.5\" fill=\"#EDEFF0\" font-family=\"monospace\">VPN 1 -&gt; frame 2</text>\n<text x=\"140\" y=\"205\" font-size=\"11.5\" fill=\"#EDEFF0\" font-family=\"monospace\">VPN 2 -&gt; frame 9</text>\n<line x1=\"220\" y1=\"230\" x2=\"220\" y2=\"275\" stroke=\"#666D72\" stroke-width=\"1.3\"/>\n<polygon points=\"220,275 215,265 225,265\" fill=\"#666D72\"/>\n<line x1=\"350\" y1=\"70\" x2=\"350\" y2=\"275\" stroke=\"#666D72\" stroke-width=\"1.2\" stroke-dasharray=\"4 3\"/>\n<text x=\"360\" y=\"170\" font-size=\"10.5\" fill=\"#666D72\">offset unchanged</text>\n<text x=\"205\" y=\"270\" text-anchor=\"end\" font-size=\"11.5\" fill=\"#666D72\">physical address</text>\n<rect x=\"150\" y=\"280\" width=\"140\" height=\"40\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"220\" y=\"305\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\">frame # (PFN)</text>\n<rect x=\"290\" y=\"280\" width=\"120\" height=\"40\" fill=\"#0E1113\" stroke=\"#2E3438\" stroke-width=\"1.2\"/>\n<text x=\"350\" y=\"305\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">offset</text>\n</svg>",
            "cap": "A virtual address splits into a page number and an offset within the page. The page table maps the page number to a physical frame number; the offset passes through unchanged, since it just locates a byte within whichever page it lands in."
          },
          {
            "t": "p",
            "x": "Paging buys three things at once: isolation, since one process's virtual addresses simply can't reach another's physical frames without going through its own page table; convenient overcommit, since pages of a process that aren't currently needed can be evicted to disk and reloaded on demand rather than requiring all of a process's memory to sit in RAM simultaneously; and a simple address space per process, since a program can be written and compiled as if it owned all of memory starting from zero."
          },
          {
            "t": "p",
            "x": "Address translation happens on every single memory access, which would be ruinously slow if it always meant walking the full page table in RAM — so hardware caches recent translations in a small, fast lookup table called the TLB (translation lookaside buffer), and most accesses hit that cache. A miss there costs a real page-table walk; a reference to a page that's been evicted to disk causes a page fault, which the OS handles by pulling the page back into RAM — and if a process's working set genuinely doesn't fit in RAM, this happens so often that the machine spends more time paging than computing, a state called thrashing."
          }
        ]
      },
      {
        "title": "System calls and the kernel boundary",
        "blocks": [
          {
            "t": "p",
            "x": "A program cannot touch hardware, another process's memory, or most of what the OS manages directly — the CPU itself enforces this by running ordinary program code in a restricted user mode, and only OS code in a privileged kernel mode that can execute any instruction and touch any resource. Crossing that boundary happens through a system call: a controlled trap that switches the CPU into kernel mode, runs OS code to do the actual privileged work, and switches back."
          },
          {
            "t": "p",
            "x": "read() over a network socket is a clean example of the whole stack this chapter has covered acting together. The calling process traps into the kernel; if no data has arrived yet, the OS marks the process Waiting and schedules something else to run on that core; when the network hardware signals that a packet arrived, the OS copies its data into the process's buffer and moves the process back to Ready; the scheduler eventually dispatches it back to Running, and only then does the system call actually return with bytes in hand."
          },
          {
            "t": "note",
            "x": "This is exactly why blocking I/O is cheap for the OS but can be expensive for an application with many concurrent connections: each blocked thread is idle but still holds a full stack and a process-control-block entry. Event loops and async I/O (see concurrency) exist specifically to avoid parking a whole OS thread per pending operation."
          }
        ]
      },
      {
        "title": "Exercises",
        "blocks": [
          {
            "t": "p",
            "x": "The last two connect scheduling and memory back to costs you can actually feel in a slow program."
          }
        ],
        "exercises": [
          {
            "q": "A thread pool uses many more OS threads than there are CPU cores, on the theory that more threads means more work gets done. Under what condition does adding threads past the core count start hurting throughput, and why?",
            "steps": [
              "With more runnable threads than cores, the scheduler must time-slice, incurring a context switch on every handoff.",
              "Each context switch costs direct overhead (saving and restoring state) plus indirect overhead (a colder cache for the newly-scheduled thread, per the cache-locality cost discussed in memory).",
              "If threads are CPU-bound (constantly wanting the core, not blocked waiting on I/O), adding more of them past the core count only increases how often switches happen, without adding any real parallelism, since only core-count threads can ever run simultaneously.",
              "The condition flips for I/O-bound threads: while one thread is blocked waiting on a disk or network response, another can use the core, so extra threads there add real throughput up to a much higher count."
            ],
            "answer": "For CPU-bound work, once thread count exceeds core count, extra threads add pure context-switch overhead without adding parallelism — throughput can actually fall. For I/O-bound work, extra threads keep helping much further, since blocked threads aren't competing for the core at all."
          },
          {
            "q": "Which scenario best describes priority inversion?",
            "steps": [
              "Priority inversion requires three actors: a low-priority thread holding a shared resource, a high-priority thread wanting that same resource, and one or more medium-priority threads that need neither.",
              "The low-priority thread holds the lock but can't finish and release it because medium-priority threads keep preempting it for unrelated work.",
              "The high-priority thread is blocked waiting on the lock, and indirectly blocked by threads of lower priority than itself — the inversion.",
              "Priority inheritance fixes it by temporarily boosting the lock-holder's priority to match whoever is waiting on it, so medium-priority work can no longer preempt it."
            ],
            "answer": "A high-priority thread is blocked waiting on a lock held by a low-priority thread, while medium-priority threads that need neither the lock nor care about the high-priority thread keep preempting the low-priority holder — indefinitely delaying the high-priority thread.",
            "kind": "mc",
            "options": [
              "A high-priority thread is indirectly blocked because medium-priority threads keep preempting the low-priority thread holding a lock it needs",
              "A high-priority thread simply runs slower than a low-priority one",
              "Two threads of equal priority deadlock on the same lock",
              "The scheduler assigns priorities in reverse order by mistake"
            ],
            "correct": 0
          },
          {
            "q": "A process's working set is larger than available physical RAM, and the machine's disk activity light is constantly on while CPU usage stays low. What's happening, and what's the underlying cause?",
            "steps": [
              "Low CPU usage with heavy disk activity, on a machine that should be busy computing, points at page faults dominating over actual instruction execution.",
              "Each time the process touches a page that's been evicted to disk, the OS must fault it back in — a slow operation compared to a cache or RAM hit.",
              "If the working set (the pages actively being used) doesn't fit in RAM, pages get evicted and immediately needed again, causing a cycle of constant faulting.",
              "This condition — spending more time paging than computing — is called thrashing, and the fix is either more RAM, a smaller working set, or fewer concurrently-running processes competing for the same RAM."
            ],
            "answer": "Thrashing: the working set doesn't fit in RAM, so pages are constantly evicted and faulted back in, and the machine spends most of its time servicing page faults instead of running instructions.",
            "kind": "mc",
            "options": [
              "Thrashing — the working set exceeds RAM, causing constant page faults",
              "A deadlock between two processes",
              "Priority inversion between the OS and the application",
              "A normal, healthy level of disk caching"
            ],
            "correct": 0
          },
          {
            "kind": "write",
            "q": "The OS record tracking a process's state, saved registers and resources — everything needed to pause and later resume it exactly where it left off — is called the process ___.",
            "accept": [
              "control block",
              "pcb"
            ],
            "hint": "three words, often abbreviated to three letters",
            "steps": [
              "When a process stops running (preempted, or blocked on I/O), its register values must be saved somewhere so it can resume correctly later.",
              "The OS keeps one such record per process, including its state, saved registers, and resource handles.",
              "This is the process control block, referenced by the scheduler on every context switch."
            ],
            "answer": "The process control block (PCB) — the OS's per-process bookkeeping record."
          },
          {
            "kind": "write",
            "q": "The small, fast hardware cache that stores recently-used virtual-to-physical address translations, avoiding a full page-table walk on most memory accesses, is called the ___.",
            "accept": [
              "tlb",
              "translation lookaside buffer"
            ],
            "hint": "a three-letter acronym",
            "steps": [
              "A full page-table walk on every single memory access would make every access as slow as several extra memory reads.",
              "Hardware instead caches recent virtual-to-physical translations in a small, very fast lookup table.",
              "A hit there resolves the translation in essentially one cycle; a miss falls back to the slower full walk."
            ],
            "answer": "The TLB (translation lookaside buffer) — the reason paging doesn't cost a full page-table walk on every memory access."
          }
        ]
      }
    ],
    "vocab": [
      [
        "Process",
        "A running program together with the OS's bookkeeping for its isolated state: address space, file descriptors, resources."
      ],
      [
        "Thread",
        "A unit of execution within a process; threads of one process share its address space but each keeps its own stack and registers."
      ],
      [
        "Context switch",
        "Saving one thread's or process's state and loading another's so the CPU can run it — the mechanism behind time-slicing."
      ],
      [
        "Process control block",
        "The OS's per-process record of state, saved registers and held resources."
      ],
      [
        "Scheduling",
        "The policy the OS uses to decide which runnable thread gets the CPU next."
      ],
      [
        "Round robin",
        "A scheduling policy giving every runnable thread a fixed time slice in rotation."
      ],
      [
        "Starvation",
        "A thread waiting indefinitely because higher-priority work keeps arriving ahead of it."
      ],
      [
        "Priority inversion",
        "A high-priority thread indirectly blocked by lower-priority threads via a shared lock held by an intermediate thread."
      ],
      [
        "Priority inheritance",
        "The fix for priority inversion: temporarily raising a lock-holder's priority to match the highest-priority thread waiting on it."
      ],
      [
        "Virtual memory",
        "The abstraction giving each process its own private address space, translated to physical memory by the OS and hardware."
      ],
      [
        "Page table",
        "The per-process data structure mapping virtual page numbers to physical frame numbers."
      ],
      [
        "TLB (translation lookaside buffer)",
        "A small hardware cache of recent virtual-to-physical address translations."
      ],
      [
        "Page fault",
        "A trap triggered when a process accesses a page that isn't currently resident in physical RAM."
      ],
      [
        "Thrashing",
        "Spending more time servicing page faults than executing instructions, because the working set exceeds available RAM."
      ],
      [
        "System call",
        "A controlled trap from user mode into kernel mode, used to request a privileged OS service."
      ],
      [
        "Kernel mode",
        "The privileged CPU mode in which OS code can execute any instruction and access any resource."
      ],
      [
        "User mode",
        "The restricted CPU mode ordinary programs run in, unable to directly touch hardware or other processes."
      ]
    ]
  },
  "concurrency": {
      "title": "Concurrency",
      "blurb": "Doing several things at once without corrupting shared state or deadlocking — the discipline that turns “multiple threads” from a hazard into a feature.",
      "chapters": [
        {
          "title": "Why concurrency exists",
          "blocks": [
            {
              "t": "p",
              "x": "Two separate pressures push programs toward doing more than one thing at a time. The first is waiting: a thread that issues a network request or a disk read spends most of its time doing nothing but waiting for a response, and a program that only ever does one thing at a time wastes that idle stretch instead of using it to make progress elsewhere. The second is hardware: a modern machine has many CPU cores, and a program confined to one thread can only ever use one of them, no matter how many sit idle beside it."
            },
            {
              "t": "p",
              "x": "Concurrency is the general idea of structuring a program as multiple independent-ish streams of execution that can make progress without waiting on each other in lockstep. Whether those streams actually run at the same physical instant is a separate question, covered later in this booklet — what matters first is what goes wrong the moment two streams touch the same piece of state."
            },
            {
              "t": "note",
              "x": "This booklet builds directly on operating systems: processes and threads, and the scheduler that hands out CPU time between them, are the machinery concurrency is built from. If “context switch” or “thread” feels unfamiliar, os is the natural prerequisite."
            }
          ]
        },
        {
          "title": "Race conditions and critical sections",
          "blocks": [
            {
              "t": "p",
              "x": "A race condition happens when the correctness of a result depends on the timing of operations that were supposed to be independent — specifically, when two threads read and write the same piece of shared state without coordination. The classic example is a counter that two threads both increment. Incrementing looks like one operation in source code, but the machine actually does it in three separate steps: read the current value, add one, write the new value back. That gap between reading and writing is where the race lives."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 680 300\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"28\" font-size=\"12.5\" fill=\"#9AA1A6\">shared variable: counter</text>\n<line x1=\"20\" y1=\"45\" x2=\"660\" y2=\"45\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"20\" y=\"75\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"500\">Thread A</text>\n<text x=\"20\" y=\"175\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"500\">Thread B</text>\n<text x=\"20\" y=\"270\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"500\">counter</text>\n<g font-family=\"monospace\" font-size=\"12.5\">\n<rect x=\"140\" y=\"55\" width=\"150\" height=\"36\" rx=\"6\" fill=\"#0E1113\" stroke=\"#666D72\"/>\n<text x=\"215\" y=\"78\" text-anchor=\"middle\" fill=\"#EDEFF0\">read counter → 0</text>\n<rect x=\"320\" y=\"55\" width=\"150\" height=\"36\" rx=\"6\" fill=\"#0E1113\" stroke=\"#666D72\"/>\n<text x=\"395\" y=\"78\" text-anchor=\"middle\" fill=\"#EDEFF0\">write counter = 1</text>\n<rect x=\"230\" y=\"155\" width=\"150\" height=\"36\" rx=\"6\" fill=\"#0E1113\" stroke=\"#666D72\"/>\n<text x=\"305\" y=\"178\" text-anchor=\"middle\" fill=\"#EDEFF0\">read counter → 0</text>\n<rect x=\"470\" y=\"155\" width=\"150\" height=\"36\" rx=\"6\" fill=\"#0E1113\" stroke=\"#666D72\"/>\n<text x=\"545\" y=\"178\" text-anchor=\"middle\" fill=\"#EDEFF0\">write counter = 1</text>\n</g>\n<line x1=\"215\" y1=\"91\" x2=\"215\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/>\n<line x1=\"305\" y1=\"191\" x2=\"305\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/>\n<line x1=\"395\" y1=\"91\" x2=\"395\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/>\n<line x1=\"545\" y1=\"191\" x2=\"545\" y2=\"250\" stroke=\"#23282B\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/>\n<circle cx=\"215\" cy=\"260\" r=\"3\" fill=\"#666D72\"/><text x=\"225\" y=\"264\" font-size=\"11\" fill=\"#666D72\">0</text>\n<circle cx=\"305\" cy=\"260\" r=\"3\" fill=\"#666D72\"/><text x=\"315\" y=\"264\" font-size=\"11\" fill=\"#666D72\">0</text>\n<circle cx=\"395\" cy=\"260\" r=\"3\" fill=\"#EDEFF0\"/><text x=\"405\" y=\"264\" font-size=\"11\" fill=\"#EDEFF0\">1</text>\n<circle cx=\"545\" cy=\"260\" r=\"3\" fill=\"#EDEFF0\"/><text x=\"555\" y=\"264\" font-size=\"11\" fill=\"#EDEFF0\">1 (should be 2)</text>\n</svg>",
              "cap": "Both threads read counter while it is still 0, so both compute 0+1 and both write back 1. Two increments happened, but the counter only advanced by one — a lost update, because the read-modify-write sequence was not treated as one indivisible step."
            },
            {
              "t": "p",
              "x": "The stretch of code that touches the shared state — here, the read-modify-write sequence — is called a critical section. The fix is never to make the individual reads or writes faster; it is to guarantee that only one thread is ever inside the critical section at a time, so the interleaving in the figure above simply cannot happen. That guarantee is what locks provide, covered next."
            }
          ]
        },
        {
          "title": "Locks, semaphores, deadlock and livelock",
          "blocks": [
            {
              "t": "p",
              "x": "A mutex (mutual exclusion lock) is the simplest tool for protecting a critical section: a thread must acquire the lock before entering, and any other thread that tries to acquire it while it's held simply waits. A semaphore generalizes this to a count — instead of one holder, up to N threads may hold it at once, which is the right tool when a resource has multiple interchangeable units, such as a fixed-size connection pool."
            },
            {
              "t": "p",
              "x": "Locks solve the race condition but introduce a new failure mode. Deadlock happens when threads wait on each other in a cycle that can never resolve: each is holding something another one needs, and none will let go first."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"50\" y=\"40\" width=\"110\" height=\"46\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"105\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Thread T1</text>\n<rect x=\"470\" y=\"40\" width=\"110\" height=\"46\" rx=\"8\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.2\"/>\n<text x=\"525\" y=\"68\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Thread T2</text>\n<rect x=\"260\" y=\"120\" width=\"110\" height=\"46\" rx=\"8\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"315\" y=\"148\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Lock L1</text>\n<rect x=\"260\" y=\"230\" width=\"110\" height=\"46\" rx=\"8\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"315\" y=\"258\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">Lock L2</text>\n<line x1=\"260\" y1=\"140\" x2=\"160\" y2=\"75\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<polygon points=\"160,75 172,80 168,68\" fill=\"#EDEFF0\"/>\n<text x=\"185\" y=\"98\" font-size=\"11\" fill=\"#EDEFF0\">holds</text>\n<line x1=\"105\" y1=\"86\" x2=\"280\" y2=\"230\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/>\n<polygon points=\"280,230 268,224 274,236\" fill=\"#666D72\"/>\n<text x=\"150\" y=\"180\" font-size=\"11\" fill=\"#9AA1A6\">wants</text>\n<line x1=\"370\" y1=\"250\" x2=\"470\" y2=\"78\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<polygon points=\"470,78 458,80 466,90\" fill=\"#EDEFF0\"/>\n<text x=\"455\" y=\"175\" font-size=\"11\" fill=\"#EDEFF0\">holds</text>\n<line x1=\"525\" y1=\"86\" x2=\"350\" y2=\"140\" stroke=\"#666D72\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/>\n<polygon points=\"350,140 362,138 358,150\" fill=\"#666D72\"/>\n<text x=\"430\" y=\"105\" font-size=\"11\" fill=\"#9AA1A6\">wants</text>\n</svg>",
              "cap": "A circular-wait deadlock. T1 holds L1 and wants L2; T2 holds L2 and wants L1. Each is stuck waiting for a lock the other refuses to release, and neither will ever get it — the cycle in the arrows is the signature of a deadlock."
            },
            {
              "t": "p",
              "x": "Four conditions must all hold for deadlock to be possible: mutual exclusion (locks aren't shareable), hold-and-wait (a thread keeps what it has while waiting for more), no preemption (a lock can't be forcibly taken away), and circular wait (a cycle of threads each waiting on the next). Break any one and deadlock becomes impossible — in practice, the cheapest fix is usually eliminating circular wait by imposing a global order on lock acquisition (always acquire L1 before L2, everywhere in the codebase, so the cycle in the figure can never form). Livelock is the more embarrassing cousin: threads aren't blocked, they're actively running, but they keep changing state in response to each other in a way that never converges — two people repeatedly stepping aside for each other in a hallway, neither ever getting through."
            }
          ]
        },
        {
          "title": "Async, event loops, futures and tasks",
          "blocks": [
            {
              "t": "p",
              "x": "Locks and threads are one answer to concurrency; an event loop is a different one, aimed specifically at I/O-bound waiting rather than CPU-bound work. Instead of parking a whole OS thread while a network call is pending, a single thread runs a loop that dispatches ready work, and when a piece of work would have to wait, it registers a callback and hands control back to the loop instead of blocking."
            },
            {
              "t": "list",
              "items": [
                "<strong>Callback</strong>: a function registered to run when an operation completes — the original way to structure async code, prone to deeply nested “callback hell”.",
                "<strong>Future / promise</strong>: an object representing a value that doesn't exist yet but will, letting async code be composed and chained rather than nested.",
                "<strong>Task / coroutine</strong>: a unit of async work that can suspend at an <code>await</code> point and be resumed later, letting async code read almost like ordinary sequential code.",
                "<strong>Event loop</strong>: the single-threaded scheduler that runs ready callbacks and tasks, and polls for I/O completion, one iteration at a time."
              ]
            },
            {
              "t": "p",
              "x": "This is why async code and OS threads solve overlapping but distinct problems. An event loop lets one thread juggle thousands of pending network connections cheaply, because a suspended task costs far less than a blocked OS thread's stack and process-control-block entry (see os). But it doesn't help with CPU-bound work at all: a task that's actually computing, not waiting, blocks the whole loop until it finishes, since there's still only one thread running it."
            }
          ]
        },
        {
          "title": "Concurrency versus parallelism",
          "blocks": [
            {
              "t": "p",
              "x": "The two words get used interchangeably in casual speech but name genuinely different things. Concurrency is about structure: a program is concurrent if it's composed of multiple independently-progressing pieces, whether or not they ever execute at the literal same instant. Parallelism is about execution: work is parallel if pieces of it are physically running at the same instant, which requires multiple cores."
            },
            {
              "t": "note",
              "x": "A single-core machine running an event loop is concurrent — many tasks are in flight, interleaved — but not parallel, since only one instruction executes at any given nanosecond. A multi-core machine running independent, non-interacting computations in separate threads is parallel. The two compose: an async event loop that farms CPU-heavy pieces of work out to a thread pool is both concurrent (in its overall structure) and parallel (in how the farmed-out pieces actually execute)."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "The scenarios below are the two failure modes this booklet centers on, plus the vocabulary that names them precisely."
            }
          ],
          "exercises": [
            {
              "q": "Two threads both run `balance = balance + amount` on a shared, unlocked bank balance variable, at nearly the same time. What class of bug is this, and what is the minimal fix?",
              "steps": [
                "The statement is not atomic: it reads balance, computes the sum, then writes it back — three separate steps at the machine level.",
                "If both threads read the old balance before either writes back the new one, one thread's update is silently lost — the same lost-update pattern as the counter example.",
                "This is a race condition, specifically on the critical section formed by the read-modify-write sequence.",
                "The minimal fix is to protect that critical section with a mutex, so only one thread can be inside the read-modify-write sequence at a time."
              ],
              "answer": "It's a race condition (a lost update) caused by an unprotected, non-atomic read-modify-write. The fix is to wrap the read-modify-write in a mutex so the two threads' critical sections can never interleave."
            },
            {
              "kind": "mc",
              "q": "Which single change below is guaranteed to make the deadlock in this booklet's lock-ordering figure impossible, without removing any locking?",
              "options": [
                "Require every thread that needs both L1 and L2 to always acquire L1 before L2",
                "Make both locks semaphores with a count of 2 instead of 1",
                "Have T1 and T2 run on different CPU cores",
                "Rename the locks so their acquisition order is alphabetical only sometimes"
              ],
              "correct": 0,
              "steps": [
                "Deadlock here requires circular wait: T1 waits on what T2 holds, and T2 waits on what T1 holds.",
                "If every thread that needs both locks acquires them in the same fixed global order, no thread can ever be holding L2 while waiting on L1 — the cycle can't form.",
                "Raising the semaphore count just permits more simultaneous holders, which doesn't touch the ordering problem; running on different cores changes parallelism, not lock ordering; a sometimes-alphabetical order isn't a guarantee."
              ],
              "answer": "A fixed global lock-acquisition order (option 1) removes the possibility of circular wait, which is one of the four necessary conditions for deadlock — breaking any one of the four makes deadlock impossible."
            },
            {
              "kind": "write",
              "q": "An event loop lets one thread manage thousands of pending network connections cheaply because a suspended task is much lighter-weight than a blocked OS ___.",
              "accept": [
                "thread",
                "os thread"
              ],
              "hint": "the thing that has its own stack and a process-control-block entry",
              "steps": [
                "A blocked OS thread still holds a full stack and a scheduler-visible process-control-block entry, even while doing nothing.",
                "A suspended async task, by contrast, is typically just a small saved-state object the event loop tracks internally.",
                "That difference in per-unit cost is exactly why one event-loop thread can juggle far more pending operations than one-thread-per-connection would allow."
              ],
              "answer": "Thread — a parked OS thread is far more expensive to hold idle than a suspended async task."
            },
            {
              "kind": "mc",
              "q": "A program is running on a single CPU core, using an event loop to interleave 500 pending network requests. Is this concurrent, parallel, both, or neither?",
              "options": [
                "Concurrent but not parallel",
                "Parallel but not concurrent",
                "Both concurrent and parallel",
                "Neither"
              ],
              "correct": 0,
              "steps": [
                "Concurrency is about structure: many independently-progressing tasks are in flight, interleaved by the event loop.",
                "Parallelism requires multiple things physically executing at the same instant, which requires more than one core.",
                "With only one core, only one instruction ever executes at any given nanosecond, so this cannot be parallel, no matter how many tasks are interleaved."
              ],
              "answer": "Concurrent but not parallel — the tasks are structurally interleaved (concurrency) but only one instruction runs at any instant, since there's only one core (no parallelism)."
            },
            {
              "q": "Two threads keep politely backing off and retrying whenever they detect contention for a resource, and neither is ever blocked, yet neither makes real progress for a long stretch. Name this failure mode and explain how it differs from deadlock.",
              "steps": [
                "Neither thread is blocked or waiting indefinitely — both are actively running and changing state, which rules out deadlock by definition.",
                "But their state changes are entirely reactive to each other, in a way that never actually converges to progress.",
                "This is livelock: threads stay active and responsive but make no forward progress, unlike deadlock where they simply freeze.",
                "A common cause is retry logic that backs off in a way that stays perfectly synchronized between the contending threads; the usual fix is randomized backoff, so the synchrony that keeps them colliding is broken by chance."
              ],
              "answer": "This is livelock — unlike deadlock, the threads are never blocked and keep actively running, but their mutual reactions prevent any real progress. Randomized backoff is a standard fix."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Race condition",
          "A bug where correctness depends on the timing of unsynchronized accesses to shared state."
        ],
        [
          "Critical section",
          "The stretch of code that touches shared state and must not run concurrently on more than one thread."
        ],
        [
          "Mutex",
          "A lock allowing at most one holder at a time, used to protect a critical section."
        ],
        [
          "Semaphore",
          "A generalized lock allowing up to N simultaneous holders, useful for pools of interchangeable resources."
        ],
        [
          "Deadlock",
          "A cycle of threads each waiting on a resource the next one holds, so none can ever proceed."
        ],
        [
          "Livelock",
          "Threads that stay active and keep changing state in reaction to each other without ever making progress."
        ],
        [
          "Circular wait",
          "The condition, necessary for deadlock, where a chain of threads waiting on each other forms a cycle."
        ],
        [
          "Atomic operation",
          "An operation that appears to happen as one indivisible step, with no interleaving possible partway through."
        ],
        [
          "Lost update",
          "The result of two threads racing on a non-atomic read-modify-write, where one thread's write silently overwrites the effect of another's."
        ],
        [
          "Event loop",
          "A single-threaded scheduler that dispatches ready callbacks and tasks and polls for I/O completion."
        ],
        [
          "Callback",
          "A function registered to run once a pending operation completes."
        ],
        [
          "Future / promise",
          "An object standing in for a value that doesn't exist yet but will once an async operation completes."
        ],
        [
          "Coroutine / task",
          "A unit of async work that can suspend at an await point and later resume, without blocking a whole thread."
        ],
        [
          "Concurrency",
          "A program's structure being composed of multiple independently-progressing pieces, whether or not they run simultaneously."
        ],
        [
          "Parallelism",
          "Multiple pieces of work physically executing at the same instant, which requires multiple cores."
        ],
        [
          "Starvation",
          "A thread that is never granted the resource or CPU time it needs, though not necessarily deadlocked."
        ]
      ]
    },
  "networking": {
      "title": "Networking",
      "blurb": "Moving bytes between machines reliably over a medium that drops packets, reorders them, and occasionally disappears entirely.",
      "chapters": [
        {
          "title": "Layers and packet switching",
          "blocks": [
            {
              "t": "p",
              "x": "Networking is built as a stack of layers, each solving one problem and handing the result to the layer above. The link layer moves frames between directly-connected devices on the same physical network. The internet layer (IP) routes packets between arbitrary machines across many intermediate networks, without any guarantee of delivery. The transport layer (TCP or UDP) adds — or deliberately doesn't add — reliability and ordering on top of IP. The application layer (HTTP and the rest) is the actual protocol your program speaks."
            },
            {
              "t": "p",
              "x": "Data is carried by packet switching: a message is broken into packets, each stamped with its destination and sent independently, and routers along the way forward each packet based only on its own header, with no dedicated circuit reserved for the conversation. This is why the internet tolerates a link going down mid-transfer — packets simply route around it — at the cost of packets that can arrive out of order, get duplicated, or vanish."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 640 330\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">encapsulation, outermost to innermost</text>\n<rect x=\"20\" y=\"45\" width=\"600\" height=\"250\" rx=\"8\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<text x=\"36\" y=\"68\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"500\">Ethernet frame header</text>\n<text x=\"590\" y=\"68\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">link layer</text>\n<rect x=\"55\" y=\"85\" width=\"530\" height=\"190\" rx=\"8\" fill=\"none\" stroke=\"#B3BBC1\" stroke-width=\"1.3\"/>\n<text x=\"71\" y=\"108\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"500\">IP packet header</text>\n<text x=\"565\" y=\"108\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">internet layer</text>\n<rect x=\"90\" y=\"125\" width=\"460\" height=\"130\" rx=\"8\" fill=\"none\" stroke=\"#838B91\" stroke-width=\"1.3\"/>\n<text x=\"106\" y=\"148\" font-size=\"12.5\" fill=\"#EDEFF0\" font-weight=\"500\">TCP segment header</text>\n<text x=\"530\" y=\"148\" text-anchor=\"end\" font-size=\"11\" fill=\"#666D72\">transport layer</text>\n<rect x=\"125\" y=\"165\" width=\"390\" height=\"70\" rx=\"6\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.2\"/>\n<text x=\"320\" y=\"195\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\">HTTP request/response bytes</text>\n<text x=\"320\" y=\"213\" text-anchor=\"middle\" font-size=\"11\" fill=\"#666D72\">application layer payload</text>\n</svg>",
              "cap": "Each layer wraps the one above it in its own header. The application's HTTP bytes sit innermost; TCP wraps them in a segment header, IP wraps that in a packet header, and Ethernet wraps that in a frame header for the physical hop. A router only needs to read the IP layer to forward the packet onward."
            }
          ]
        },
        {
          "title": "TCP versus UDP",
          "blocks": [
            {
              "t": "p",
              "x": "IP alone only makes a best effort: it may drop, duplicate, or reorder packets, and it never tells you which happened. The transport layer decides what to do about that, and offers two very different answers. TCP is connection-oriented and reliable: it numbers every byte, retransmits anything that isn't acknowledged in time, and reassembles everything in order before handing it to the application — at the cost of setup overhead and head-of-line blocking, where one lost packet stalls everything behind it until it's resent. UDP is connectionless and makes no such promises: packets go out and may or may not arrive, in any order, with no retransmission — but with far lower overhead and no head-of-line stall."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 620 240\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"90\" y=\"26\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"500\">Client</text>\n<line x1=\"90\" y1=\"36\" x2=\"90\" y2=\"215\" stroke=\"#23282B\" stroke-width=\"1.2\"/>\n<text x=\"530\" y=\"26\" text-anchor=\"middle\" font-size=\"13\" fill=\"#EDEFF0\" font-weight=\"500\">Server</text>\n<line x1=\"530\" y1=\"36\" x2=\"530\" y2=\"215\" stroke=\"#23282B\" stroke-width=\"1.2\"/>\n<line x1=\"90\" y1=\"70\" x2=\"530\" y2=\"70\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<polygon points=\"530,70 518,65 518,75\" fill=\"#EDEFF0\"/>\n<text x=\"310\" y=\"62\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" font-family=\"monospace\">SYN</text>\n<line x1=\"530\" y1=\"120\" x2=\"90\" y2=\"120\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<polygon points=\"90,120 102,115 102,125\" fill=\"#EDEFF0\"/>\n<text x=\"310\" y=\"112\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" font-family=\"monospace\">SYN-ACK</text>\n<line x1=\"90\" y1=\"170\" x2=\"530\" y2=\"170\" stroke=\"#EDEFF0\" stroke-width=\"1.3\"/>\n<polygon points=\"530,170 518,165 518,175\" fill=\"#EDEFF0\"/>\n<text x=\"310\" y=\"162\" text-anchor=\"middle\" font-size=\"12\" fill=\"#EDEFF0\" font-family=\"monospace\">ACK</text>\n<text x=\"310\" y=\"200\" text-anchor=\"middle\" font-size=\"11.5\" fill=\"#9AA1A6\">connection established — data may now flow either way</text>\n</svg>",
              "cap": "TCP's three-way handshake. The client proposes a sequence number (SYN); the server acknowledges it and proposes its own (SYN-ACK); the client acknowledges that. Both sides now agree the connection is open before a single byte of application data is sent."
            },
            {
              "t": "p",
              "x": "Retransmission works off that same sequence numbering: the sender starts a timer for each segment, and if no acknowledgment arrives before it expires, the sender assumes the segment was lost and sends it again. Because the receiver acknowledges by sequence number, TCP can also detect and discard duplicates and reorder segments that arrived out of sequence, presenting the application with one clean, in-order byte stream regardless of what actually happened at the packet level underneath."
            },
            {
              "t": "list",
              "items": [
                "<strong>TCP</strong>: reliable, ordered, connection-oriented — web pages, file transfers, anything where a missing chunk must not be silently skipped.",
                "<strong>UDP</strong>: unreliable, unordered, connectionless — live video and voice, DNS lookups, game state updates, anything where a stale retransmit is worse than a dropped packet."
              ]
            }
          ]
        },
        {
          "title": "HTTP, TLS and DNS",
          "blocks": [
            {
              "t": "p",
              "x": "HTTP is the application-layer protocol underneath the web: a client sends a request (a method like GET or POST, a path, headers) and a server sends back a response (a status code, headers, a body). It's stateless by default — each request stands alone — which is why cookies and tokens exist, to carry identity across requests that the protocol itself doesn't remember."
            },
            {
              "t": "p",
              "x": "TLS sits between TCP and HTTP (the “S” in HTTPS) and does two jobs: it encrypts the connection so an eavesdropper on the network sees only ciphertext, and it authenticates the server via a certificate chain, so the client can be reasonably confident it's actually talking to the domain it asked for and not an impersonator. Setting up TLS costs its own round trips, on top of TCP's handshake, which is why connection reuse (keeping one TLS connection open across many requests) matters for latency."
            },
            {
              "t": "worked",
              "q": "Walk through what happens, layer by layer, from typing a URL to a page rendering.",
              "steps": [
                "DNS resolution: the browser looks up the domain name and gets back an IP address — often served from a local or ISP-level cache rather than a fresh full lookup.",
                "TCP handshake: the browser opens a TCP connection to that IP on port 443, exchanging SYN / SYN-ACK / ACK.",
                "TLS handshake: client and server negotiate encryption and the server proves its identity via its certificate; an encrypted channel is now open.",
                "HTTP request/response: the browser sends an HTTP GET for the page over that encrypted channel, and the server responds with a status code, headers, and the HTML body.",
                "Rendering: the browser parses the HTML and, for every additional resource the page references (images, scripts, stylesheets), may repeat some or all of the steps above, reusing the existing connection where possible."
              ],
              "answer": "DNS lookup → TCP handshake → TLS handshake → HTTP request/response → parse and render, with subsequent resource fetches reusing the connection where the protocol allows it."
            }
          ]
        },
        {
          "title": "Latency, bandwidth and backpressure",
          "blocks": [
            {
              "t": "p",
              "x": "Latency and bandwidth are both “speed” in casual conversation but measure genuinely different things. Latency is how long one bit takes to make the trip — dominated by physical distance and the speed of light in fiber, plus each hop's processing time, and it has a floor that more capacity cannot lower. Bandwidth is how many bits per second the connection can carry once the trip has started — a wider pipe, not a faster one. A satellite link can have huge bandwidth and terrible latency at the same time; adding more bandwidth to a high-latency link does nothing to make an interactive request feel snappier."
            },
            {
              "t": "p",
              "x": "Backpressure is what happens when a receiver can't keep up with a sender: without it, data piles up in buffers until they overflow and packets are dropped, or — worse — buffers grow so large that everything queued behind them suffers extra latency without ever being dropped, a problem specific enough to have its own name, bufferbloat. TCP's flow control is a built-in form of backpressure: the receiver advertises how much buffer space it has left, and the sender throttles to match, rather than firehosing data the receiver has nowhere to put."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These connect the handshake, the layer diagram, and the latency/bandwidth distinction back to judgment calls you'd actually make."
            }
          ],
          "exercises": [
            {
              "kind": "mc",
              "q": "A game needs to send player-position updates 30 times per second. A stale update is useless the moment a newer one exists. Which transport protocol fits, and why?",
              "options": [
                "UDP — retransmitting a stale position is worse than just dropping it",
                "TCP — reliability is always the safer default",
                "Both are equivalent for this use case",
                "Neither — this requires a dedicated physical circuit"
              ],
              "correct": 0,
              "steps": [
                "TCP guarantees in-order, reliable delivery, but that means a lost packet blocks everything behind it (head-of-line blocking) until it's retransmitted.",
                "For a fast stream of position updates, an old, retransmitted position is not just useless once a newer one exists — waiting for it actively delays the delivery of the current, useful data.",
                "UDP drops what doesn't arrive and never blocks later packets waiting for it, which matches this use case far better despite offering no reliability guarantee."
              ],
              "answer": "UDP — the application-level cost of a dropped position update is near zero (a newer one is coming in 1/30th of a second), while TCP's head-of-line blocking would actively delay fresher data behind a retransmit of stale data."
            },
            {
              "q": "Explain, using the encapsulation figure, why a router forwarding a packet toward its destination only needs to read the IP header and not the TCP header or the HTTP payload inside it.",
              "steps": [
                "The IP header is the outer-but-one layer, sitting directly around the TCP segment, and it's the one that carries the destination address routing decisions are based on.",
                "TCP's header (sequence numbers, ports) matters to the two endpoints reassembling the byte stream, not to intermediate routers moving the packet closer to its destination.",
                "The HTTP payload is application data that only the receiving application ever needs to interpret.",
                "A router therefore only needs to unwrap as far as the IP header, read the destination address, and forward — which is also why encryption of the TCP/HTTP layers (as TLS provides) doesn't stop routing from working."
              ],
              "answer": "Routing decisions are made purely from the IP header's destination address; the TCP header and HTTP payload are irrelevant to a router's job and can even be encrypted without breaking routing."
            },
            {
              "kind": "write",
              "q": "A link has enormous capacity but a half-second round trip because it bounces off a satellite. The metric that's bad here — the one that more capacity cannot fix — is ___.",
              "accept": [
                "latency"
              ],
              "hint": "not bandwidth",
              "steps": [
                "Bandwidth measures bits per second once the trip is underway; this link has plenty of that.",
                "Latency measures how long one bit takes to make the trip in the first place, set largely by distance and the speed of light.",
                "Adding more bandwidth widens the pipe but does nothing to shorten the physical trip, so latency stays bad regardless."
              ],
              "answer": "Latency — a wider pipe (more bandwidth) does not shorten a trip whose delay comes from physical distance."
            },
            {
              "q": "A receiver's buffer is filling up faster than the application can drain it. Contrast what happens with proper backpressure versus what happens without it.",
              "steps": [
                "Without backpressure, the sender keeps sending at full speed regardless of the receiver's state, and the receiver's buffer either overflows (dropping data) or grows unboundedly (adding latency to everything queued behind it — bufferbloat).",
                "With backpressure, the receiver signals how much room it has left, and the sender throttles its rate to match.",
                "TCP implements this via flow control: the receiver's advertised window tells the sender how much unacknowledged data it may have in flight."
              ],
              "answer": "Without backpressure, the buffer overflows (drops) or grows unboundedly (added latency for everything behind it); with backpressure, the receiver signals its available capacity and the sender throttles to match, which is what TCP's flow control does."
            },
            {
              "kind": "mc",
              "q": "Which of these best describes what TLS adds on top of a plain TCP connection?",
              "options": [
                "Encryption of the data plus authentication of the server's identity",
                "Faster packet delivery via a dedicated circuit",
                "Guaranteed in-order delivery, which TCP otherwise lacks",
                "A reduction in the number of round trips needed to connect"
              ],
              "correct": 0,
              "steps": [
                "TCP already guarantees in-order, reliable delivery on its own — that's not something TLS adds.",
                "TLS's two jobs are encrypting the byte stream so eavesdroppers see only ciphertext, and authenticating the server via a certificate chain.",
                "TLS costs extra round trips on top of TCP's handshake, rather than reducing them."
              ],
              "answer": "Encryption plus server authentication via a certificate — TLS doesn't touch ordering or reliability, which TCP already provides."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Packet switching",
          "Breaking a message into independently-routed packets rather than reserving a dedicated circuit for the conversation."
        ],
        [
          "IP (Internet Protocol)",
          "The internet-layer protocol that routes packets between machines, on a best-effort, no-guarantee basis."
        ],
        [
          "TCP",
          "A transport protocol providing reliable, ordered, connection-oriented delivery via acknowledgment and retransmission."
        ],
        [
          "UDP",
          "A transport protocol providing unreliable, unordered, connectionless delivery with minimal overhead."
        ],
        [
          "Three-way handshake",
          "TCP's SYN / SYN-ACK / ACK exchange that establishes a connection before data flows."
        ],
        [
          "Retransmission",
          "Resending a segment whose acknowledgment did not arrive before a timer expired."
        ],
        [
          "Head-of-line blocking",
          "A lost packet stalling delivery of everything already-arrived behind it, until the loss is resolved."
        ],
        [
          "HTTP",
          "The stateless, request/response application-layer protocol underneath the web."
        ],
        [
          "TLS",
          "The protocol that encrypts a connection and authenticates the server, sitting between TCP and HTTP."
        ],
        [
          "DNS",
          "The system that resolves a domain name into an IP address."
        ],
        [
          "Latency",
          "How long one unit of data takes to make a trip; bounded below by distance and the speed of light."
        ],
        [
          "Bandwidth",
          "How much data per second a connection can carry once the trip is underway."
        ],
        [
          "Backpressure",
          "A receiver signalling its available capacity so a sender throttles instead of overwhelming it."
        ],
        [
          "Bufferbloat",
          "Excess buffering that adds latency to everything queued behind it, without ever dropping data."
        ],
        [
          "Encapsulation",
          "Each network layer wrapping the layer above it in its own header before handing it down."
        ]
      ]
    },
  "distributed":   {
      "title": "Distributed Systems",
      "blurb": "Many machines behaving as one — where partial failure isn't an edge case to handle, it's the normal condition the whole design has to assume.",
      "chapters": [
        {
          "title": "Partial failure is the default, not the exception",
          "blocks": [
            {
              "t": "p",
              "x": "A single-machine program either runs or crashes — there's rarely an in-between state to reason about. A distributed system made of many machines connected by a network has a third, much more common state: partial failure. One node can be slow, one link can drop packets, one machine can be up but unreachable from where you're standing, all while the rest of the system keeps running fine. Worse, from any single node's point of view, a slow response and a dead remote machine look identical — both are silence, and there's no way to tell them apart just by waiting."
            },
            {
              "t": "p",
              "x": "This single fact — you cannot reliably tell \"slow\" from \"dead\" over a network — is the source of nearly every hard problem in this booklet: how do you keep data available when a machine holding it might be gone, how do multiple machines agree on anything when messages can be delayed or lost, and how do you retry a failed-looking request without accidentally doing it twice."
            }
          ]
        },
        {
          "title": "Replication and sharding",
          "blocks": [
            {
              "t": "p",
              "x": "Replication keeps multiple copies of the same data on different machines, so losing one machine doesn't lose the data — the tradeoff is keeping those copies consistent with each other as writes happen. Sharding (partitioning) does the opposite job: instead of copying everything everywhere, it splits the data itself across machines, so each shard holds only a slice of the total and no single machine needs to store or serve all of it. Real systems typically do both at once — data is sharded for scale, and each shard is separately replicated for durability."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 620 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">3 shards over a hash space of 1024 keys, each shard replicated &#215;3</text>\n<rect x=\"30\" y=\"55\" width=\"170\" height=\"220\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\" rx=\"8\"/>\n<text x=\"115\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">shard A: keys 0-341</text>\n<circle cx=\"115\" cy=\"115\" r=\"22\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"115\" y=\"120\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">P</text>\n<circle cx=\"70\" cy=\"185\" r=\"18\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\" stroke-dasharray=\"3,3\"/>\n<text x=\"70\" y=\"190\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">R</text>\n<circle cx=\"160\" cy=\"185\" r=\"18\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\" stroke-dasharray=\"3,3\"/>\n<text x=\"160\" y=\"190\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">R</text>\n<rect x=\"225\" y=\"55\" width=\"170\" height=\"220\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\" rx=\"8\"/>\n<text x=\"310\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">shard B: keys 342-682</text>\n<circle cx=\"310\" cy=\"115\" r=\"22\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"310\" y=\"120\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">P</text>\n<circle cx=\"265\" cy=\"185\" r=\"18\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\" stroke-dasharray=\"3,3\"/>\n<text x=\"265\" y=\"190\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">R</text>\n<circle cx=\"355\" cy=\"185\" r=\"18\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\" stroke-dasharray=\"3,3\"/>\n<text x=\"355\" y=\"190\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">R</text>\n<rect x=\"420\" y=\"55\" width=\"170\" height=\"220\" fill=\"none\" stroke=\"#23282B\" stroke-width=\"1\" rx=\"8\"/>\n<text x=\"505\" y=\"75\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">shard C: keys 683-1023</text>\n<circle cx=\"505\" cy=\"115\" r=\"22\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<text x=\"505\" y=\"120\" text-anchor=\"middle\" font-size=\"11\" fill=\"#EDEFF0\">P</text>\n<circle cx=\"460\" cy=\"185\" r=\"18\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\" stroke-dasharray=\"3,3\"/>\n<text x=\"460\" y=\"190\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">R</text>\n<circle cx=\"550\" cy=\"185\" r=\"18\" fill=\"none\" stroke=\"#9BA3A9\" stroke-width=\"1.6\" stroke-dasharray=\"3,3\"/>\n<text x=\"550\" y=\"190\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#9AA1A6\">R</text>\n<text x=\"115\" y=\"250\" text-anchor=\"middle\" font-size=\"10.5\" fill=\"#666D72\">P = primary, R = replica</text>\n</svg>",
              "cap": "1024 possible key-hash values split evenly across 3 shards (1024/3 ≈ 341.3 per shard, so boundaries fall at 341 and 682). Each shard has one primary (P, solid) taking writes and two replicas (R, dashed) that copy from it — losing one machine anywhere loses neither data nor availability."
            },
            {
              "t": "p",
              "x": "Sharding by a hash of the key (as in the figure) spreads load evenly and predictably, but it complicates any query that spans many keys at once — a range scan or a join now has to fan out across every shard that might hold relevant data, then merge the results, rather than reading sequentially from one place."
            }
          ]
        },
        {
          "title": "Consensus and the CAP theorem",
          "blocks": [
            {
              "t": "p",
              "x": "Consensus is the problem of getting multiple machines to agree on a single value or a single order of operations, even though messages can be delayed, reordered, or lost, and machines themselves can crash. It underlies leader election (agreeing on which replica is currently the primary) and any operation that must appear to happen exactly once, in one agreed order, across the whole system. Algorithms like Paxos and Raft solve this by requiring a quorum — a majority of nodes — to agree before a value is considered committed, which is precisely what tolerates the minority of nodes being slow, unreachable, or down."
            },
            {
              "t": "p",
              "x": "The CAP theorem states that when a network partition happens — some machines can't reach others — a distributed system must choose between consistency (every read sees the latest write, everywhere) and availability (every request gets a response, even if it might be stale). It cannot guarantee both during the partition. Since partitions are a real, unavoidable fact of operating over an actual network, the honest way to read CAP is not \"pick 2 of 3\" — partition tolerance isn't optional — but \"decide, for this partition, whether to sacrifice consistency (an AP system) or availability (a CP system).\" A banking ledger typically chooses CP (refuse a request rather than risk an inconsistent balance); a shopping cart typically chooses AP (let the customer keep shopping, reconcile any conflict later)."
            }
          ]
        },
        {
          "title": "Failure detection, retries, and idempotency",
          "blocks": [
            {
              "t": "p",
              "x": "Because you can't distinguish \"slow\" from \"dead\" directly, failure detectors work by suspicion rather than certainty: if a node hasn't responded to a heartbeat within some timeout, treat it as failed and route around it — accepting that this will occasionally be wrong about a node that was just slow, and building the rest of the system to tolerate that mistake rather than to prevent it. Getting the timeout right is itself a tradeoff: too short and healthy-but-slow nodes get needlessly treated as dead; too long and a real failure takes too long to notice and route around."
            },
            {
              "t": "p",
              "x": "Retrying a request that appeared to fail is the natural response to this uncertainty, but it introduces a new problem: if the original request actually succeeded and only the response was lost, retrying it blindly repeats the effect — charging a customer twice, incrementing a counter twice. Idempotency is the property that fixes this: a request tagged with a unique idempotency key can be retried freely, because the receiving system recognizes a repeated key and returns the original result instead of redoing the work. Designing an operation to be naturally idempotent (\"set balance to $50\" rather than \"add $10\") sidesteps the problem entirely where the operation allows it."
            }
          ]
        },
        {
          "title": "Queues, event logs, and the exactly-once myth",
          "blocks": [
            {
              "t": "p",
              "x": "Message queues and event logs decouple producers of work from consumers of it — a producer writes a message once and moves on, and one or more consumers process it whenever they're ready, which absorbs bursts of load and lets producers and consumers fail or restart independently. The delivery guarantee they offer is usually stated as one of three levels: at-most-once (a message might be silently dropped, but never duplicated), at-least-once (a message is never silently dropped, but might be delivered more than once), or exactly-once (delivered precisely once, no drops, no duplicates)."
            },
            {
              "t": "note",
              "x": "\"Exactly-once\" delivery, taken completely literally at the network and process level, is not achievable in a system where messages can be lost and machines can crash mid-operation — there is always some window where a crash right after processing but right before acknowledging looks identical to not having processed it at all, forcing a retry. What real systems that advertise exactly-once actually provide is effectively-once processing: at-least-once delivery combined with idempotent handling (often via deduplication on a message ID) at the consumer, so the observable effect matches exactly-once even though delivery itself does not."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These work the sharding numbers from this booklet's figure and check the reasoning behind CAP, idempotency, and delivery guarantees."
            }
          ],
          "exercises": [
            {
              "q": "The figure splits a 1024-value hash space evenly across 3 shards. Compute the boundary key values and confirm they match the figure's 0-341 / 342-682 / 683-1023 split.",
              "steps": [
                "1024 / 3 = 341.33, so each shard should hold roughly 341-342 keys.",
                "Shard A: keys 0 through 341 (342 keys). Shard B: keys 342 through 682 (341 keys). Shard C: keys 683 through 1023 (341 keys).",
                "342 + 341 + 341 = 1024, accounting for every key exactly once — matching the figure."
              ],
              "answer": "Boundaries at 341/342 and 682/683, giving shards of 342, 341, and 341 keys respectively — 1024 keys total, exactly matching the figure."
            },
            {
              "kind": "mc",
              "q": "A network partition splits a distributed database into two halves that can't reach each other. Per the CAP theorem, what must the system give up during the partition?",
              "options": [
                "Either full consistency or full availability — it cannot guarantee both while the partition lasts",
                "Nothing — a well-designed system can guarantee consistency, availability, and partition tolerance simultaneously",
                "Partition tolerance, since that's the one property that's actually optional",
                "Durability, since CAP is fundamentally about not losing data"
              ],
              "correct": 0,
              "steps": [
                "CAP applies specifically during an actual network partition, which is the scenario described here.",
                "To stay available on both sides of the split, a node has to answer requests without knowing what the other side is doing — risking inconsistency. To stay consistent, some requests must be refused until the partition heals — sacrificing availability.",
                "Partition tolerance is not the flexible choice here — partitions happen on real networks whether the system likes it or not, so the actual choice is between consistency and availability."
              ],
              "answer": "It must give up either full consistency or full availability for the duration of the partition — CAP says a real system can't guarantee both while nodes can't communicate."
            },
            {
              "kind": "write",
              "q": "A unique key attached to a request so that retrying it is safe — the receiving system recognizes a repeat and returns the original result instead of redoing the work — enables what property, called ___?",
              "accept": [
                "idempotency",
                "idempotence"
              ],
              "hint": "the same request, applied twice, has the same effect as applying it once",
              "steps": [
                "The problem: a client can't tell whether a failed-looking request actually succeeded, so it wants to retry safely.",
                "Attaching a unique idempotency key lets the server recognize \"I've already handled this exact request\" and return the prior result rather than repeating the effect.",
                "This property — repeating an operation has the same effect as doing it once — is called idempotency."
              ],
              "answer": "Idempotency — repeating the same request (identified by its key) has no additional effect beyond the first time."
            },
            {
              "q": "A payment API times out on a client, but the payment actually succeeded on the server before the response was lost in transit. The client retries with the same idempotency key. Walk through what should happen.",
              "steps": [
                "The client can't distinguish \"the server never got my request\" from \"the server processed it but the response didn't make it back\" — both look like silence, per this booklet's opening point about partial failure.",
                "The server, seeing a request with an idempotency key it has already processed, does not charge the customer again — it looks up the stored result from the first attempt and returns that instead.",
                "The customer is charged exactly once, and the client gets a successful response on the retry — the idempotency key is what prevented the retry from becoming a duplicate charge."
              ],
              "answer": "The server recognizes the repeated idempotency key, skips reprocessing, and returns the original result — so the customer is charged once despite the client retrying, turning what could've been a duplicate charge into a safe no-op retry."
            },
            {
              "kind": "mc",
              "q": "A message queue is described as providing \"exactly-once\" processing. What is actually happening under the hood, in essentially every real implementation?",
              "options": [
                "At-least-once delivery combined with idempotent handling (often deduplication by message ID) at the consumer",
                "A network-level guarantee that no message can ever be lost, duplicated, or delayed",
                "At-most-once delivery, since duplicates are impossible if delivery is limited to once",
                "A special hardware requirement that makes crashes impossible during message processing"
              ],
              "correct": 0,
              "steps": [
                "True exactly-once delivery at the network/process level isn't achievable — a crash at the wrong moment always leaves ambiguity about whether processing completed.",
                "What real systems do instead is guarantee at-least-once delivery (never silently drop a message) and pair it with idempotent consumer-side handling, often deduplicating by a message ID.",
                "The combination makes the observable effect indistinguishable from exactly-once, even though the underlying delivery mechanism is really at-least-once plus deduplication."
              ],
              "answer": "At-least-once delivery plus idempotent (deduplicating) handling at the consumer — producing effectively-once behavior, since true exactly-once delivery isn't achievable when crashes and lost messages are possible."
            }
          ]
        }
      ],
      "vocab": [
        [
          "Partial failure",
          "A state where some parts of a distributed system are down or unreachable while the rest keeps running — the normal condition, not an edge case."
        ],
        [
          "Replication",
          "Keeping multiple copies of the same data on different machines for durability and availability."
        ],
        [
          "Sharding (partitioning)",
          "Splitting data across machines so each holds only a slice of the total, for scale."
        ],
        [
          "Primary / replica",
          "The node accepting writes for a shard (primary) versus nodes that copy from it (replicas)."
        ],
        [
          "Consensus",
          "Getting multiple machines to agree on a single value or order of operations despite failures and unreliable messaging."
        ],
        [
          "Quorum",
          "A majority of nodes required to agree before a value is considered committed."
        ],
        [
          "Leader election",
          "The consensus problem of agreeing which replica currently acts as primary."
        ],
        [
          "CAP theorem",
          "During a network partition, a system must choose between full consistency and full availability — it can't guarantee both."
        ],
        [
          "Partition tolerance",
          "A system's ability to keep operating despite a network partition; treated as non-negotiable since partitions happen regardless."
        ],
        [
          "Failure detector",
          "A mechanism (typically heartbeat-and-timeout based) for suspecting a node has failed, since \"slow\" and \"dead\" look identical over a network."
        ],
        [
          "Idempotency",
          "The property that repeating an operation has the same effect as performing it once."
        ],
        [
          "Idempotency key",
          "A unique identifier attached to a request so a retry can be recognized and safely deduplicated."
        ],
        [
          "At-least-once delivery",
          "A guarantee that a message is never silently dropped, though it may be delivered more than once."
        ],
        [
          "At-most-once delivery",
          "A guarantee that a message is never duplicated, though it may be silently dropped."
        ],
        [
          "Effectively-once processing",
          "At-least-once delivery combined with idempotent handling, producing exactly-once-like observable behavior."
        ],
        [
          "Event log",
          "An append-only, ordered record of events that consumers can read and replay independently."
        ]
      ]
    },
  "gpu":   {
      "title": "GPU and Parallelism",
      "blurb": "Thousands of simple cores running the same arithmetic on different data at once — the hardware architecture that turned deep learning from a theoretical curiosity into something trainable in practice.",
      "chapters": [
        {
          "title": "Why matrix multiplication wants a different chip",
          "blocks": [
            {
              "t": "p",
              "x": "A CPU is built around a handful of complex cores — typically single digits to a few dozen — each with deep pipelines, branch prediction, and large caches, optimized to run a wide variety of sequential, branch-heavy code as fast as possible for one thread at a time. That design is excellent at doing one arbitrary thing quickly, and comparatively poor at doing millions of identical, independent things at once, because most of a CPU core's transistor budget goes toward making a single stream of instructions fast rather than toward running many streams in parallel."
            },
            {
              "t": "p",
              "x": "A GPU inverts that trade-off: thousands of small, comparatively simple cores, optimized for throughput on identical arithmetic applied to different data simultaneously. This turns out to be exactly the shape of the linear algebra underneath a neural network — as the linear algebra booklet covers, a matrix multiply is literally millions of independent multiply-add operations, each one trivial and each one able to run at the same time as all the others. A GPU is built to chew through exactly that, while a CPU would work through most of them one at a time."
            }
          ]
        },
        {
          "title": "SIMD, threads, warps, and occupancy",
          "blocks": [
            {
              "t": "p",
              "x": "SIMD (single instruction, multiple data) means one instruction operates on several data elements at once. GPUs extend this into SIMT (single instruction, multiple threads): a group of threads — a warp, 32 of them on current NVIDIA hardware — executes the exact same instruction in lockstep, one thread per data element, on a single core cluster. This is why GPU code is written as a kernel: a single function describing what one thread does, launched across a huge number of threads that each run it on their own slice of the data."
            },
            {
              "t": "p",
              "x": "Branch divergence is the SIMT model's characteristic weakness: if threads within one warp take different branches of an if/else, the warp does not actually run both branches in parallel — it executes each branch in sequence, masking off whichever threads don't apply to that branch, so a warp that diverges pays for both paths' cost rather than either one alone. Writing kernels where nearby threads follow the same control flow (or restructuring data-dependent branching out of the innermost loop entirely) avoids this cost."
            },
            {
              "t": "p",
              "x": "Occupancy is the ratio of active warps on a streaming multiprocessor (SM, the GPU's basic compute unit) to the maximum it could hold, given how much register and shared-memory space each thread block needs. Low occupancy means many cores sit idle waiting for work. It's a useful diagnostic, but not the whole story — high occupancy alone doesn't guarantee a kernel is well optimized, since a memory-bound kernel (covered next) can be memory-limited regardless of how many warps are scheduled."
            }
          ]
        },
        {
          "title": "The memory hierarchy, and why data movement dominates",
          "blocks": [
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 700 400\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"60\" y=\"24\" font-size=\"12.5\" fill=\"#9AA1A6\">GPU memory hierarchy &#8212; smaller and faster at top, larger and slower at bottom</text>\n<rect x=\"60\" y=\"44\" width=\"150\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#EDEFF0\" stroke-width=\"1.4\"/>\n<text x=\"76\" y=\"74\" font-size=\"13.5\" fill=\"#EDEFF0\">Registers &#8212; ~1 cycle</text>\n<rect x=\"60\" y=\"108\" width=\"260\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#D2D8DC\" stroke-width=\"1.4\"/>\n<text x=\"76\" y=\"138\" font-size=\"13.5\" fill=\"#EDEFF0\">Shared memory / L1 &#8212; ~20&#8211;30 cycles</text>\n<rect x=\"60\" y=\"172\" width=\"370\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#B3BBC1\" stroke-width=\"1.4\"/>\n<text x=\"76\" y=\"202\" font-size=\"13.5\" fill=\"#EDEFF0\">L2 cache &#8212; ~200 cycles</text>\n<rect x=\"60\" y=\"236\" width=\"480\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#9BA3A9\" stroke-width=\"1.4\"/>\n<text x=\"76\" y=\"266\" font-size=\"13.5\" fill=\"#EDEFF0\">Global memory (HBM) &#8212; ~400&#8211;800 cycles</text>\n<rect x=\"60\" y=\"300\" width=\"590\" height=\"50\" rx=\"6\" fill=\"#0E1113\" stroke=\"#666D72\" stroke-width=\"1.4\"/>\n<text x=\"76\" y=\"330\" font-size=\"13.5\" fill=\"#EDEFF0\">Host memory &#8212; over PCIe / NVLink, microseconds</text>\n</svg>",
              "cap": "Each tier down the stack is slower but larger. Figures are typical orders of magnitude for reasoning about a kernel, not a specific chip's datasheet. A kernel that keeps its working set in registers and shared memory can be tens to hundreds of times faster than one that repeatedly round-trips to global memory, before either does a single extra floating-point operation."
            },
            {
              "t": "p",
              "x": "Every tier down this stack trades speed for size: registers are private to a single thread and vanish the instant it finishes; shared memory is fast, on-chip, and shared within a thread block; global memory (built from high-bandwidth memory, HBM, on modern accelerator cards) holds everything else the kernel needs and is orders of magnitude slower to reach than shared memory; and data that starts on the host (the CPU's own memory) has to cross PCIe or NVLink to even arrive at the GPU in the first place, the slowest hop of all."
            },
            {
              "t": "p",
              "x": "Arithmetic intensity is the ratio of floating-point operations performed to bytes moved from memory to do them. An operation with high arithmetic intensity, like a large matrix multiply, reuses each loaded value many times before moving on, so it can keep compute units continuously busy — it's compute-bound. An operation with low arithmetic intensity, like an elementwise function applied once to every entry of a tensor, does roughly one flop per byte loaded and spends most of its time waiting on memory rather than computing — it's memory-bound. The roofline model plots achievable throughput as a function of arithmetic intensity, capped by whichever of peak compute or peak memory bandwidth is the binding constraint for that particular operation — a simple, useful way to predict in advance whether a faster chip will actually help (only if you're compute-bound) or whether reducing memory traffic is what would actually help instead."
            }
          ]
        },
        {
          "title": "Batching and arithmetic intensity in practice",
          "blocks": [
            {
              "t": "p",
              "x": "Batching multiple training examples into one matrix multiply, rather than processing them one at a time, is the single biggest lever for keeping a GPU's cores fed. At a small batch size the GPU is under-saturated: most of a training step's fixed cost — kernel launch overhead, memory transfer setup — is paid regardless of batch size, so doubling the batch from an under-saturated size barely changes the total step time at all, only how many samples that time was spent on."
            },
            {
              "t": "fig",
              "svg": "<svg viewBox=\"0 0 680 400\" xmlns=\"http://www.w3.org/2000/svg\">\n<text x=\"20\" y=\"24\" font-size=\"12\" fill=\"#9AA1A6\">per-sample training cost vs. batch size (hypothetical GPU, fixed overhead 2ms/step)</text>\n<line x1=\"70\" y1=\"310\" x2=\"600\" y2=\"310\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<line x1=\"70\" y1=\"310\" x2=\"70\" y2=\"50\" stroke=\"#23282B\" stroke-width=\"1\"/>\n<text x=\"335\" y=\"345\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\">batch size</text>\n<text x=\"30\" y=\"180\" text-anchor=\"middle\" font-size=\"12\" fill=\"#9AA1A6\" transform=\"rotate(-90 30 180)\">ms / sample</text>\n<polyline points=\"110,70 185,190 260,250 335,280 410,275.8 485,273.7 560,272.6\" fill=\"none\" stroke=\"#EDEFF0\" stroke-width=\"2\"/>\n<circle cx=\"110\" cy=\"70\" r=\"4\" fill=\"#EDEFF0\"/>\n<circle cx=\"185\" cy=\"190\" r=\"4\" fill=\"#EDEFF0\"/>\n<circle cx=\"260\" cy=\"250\" r=\"3.5\" fill=\"#9BA3A9\"/>\n<circle cx=\"335\" cy=\"280\" r=\"4.5\" fill=\"#FFFFFF\"/>\n<circle cx=\"410\" cy=\"275.8\" r=\"3.5\" fill=\"#9BA3A9\"/>\n<circle cx=\"485\" cy=\"273.7\" r=\"3.5\" fill=\"#9BA3A9\"/>\n<circle cx=\"560\" cy=\"272.6\" r=\"4\" fill=\"#EDEFF0\"/>\n<text x=\"110\" y=\"52\" text-anchor=\"middle\" font-size=\"11\" fill=\"#DDE3E7\">16 &#8594; 0.125ms</text>\n<text x=\"185\" y=\"215\" text-anchor=\"middle\" font-size=\"11\" fill=\"#DDE3E7\">32 &#8594; 0.063ms</text>\n<text x=\"335\" y=\"300\" text-anchor=\"middle\" font-size=\"11\" fill=\"#FFFFFF\">128 &#8594; min, 0.016ms</text>\n<text x=\"560\" y=\"255\" text-anchor=\"end\" font-size=\"11\" fill=\"#DDE3E7\">1024 &#8594; 0.019ms, &#8776;floor</text>\n<text x=\"100\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">16</text>\n<text x=\"175\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">32</text>\n<text x=\"250\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">64</text>\n<text x=\"325\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">128</text>\n<text x=\"395\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">256</text>\n<text x=\"470\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">512</text>\n<text x=\"540\" y=\"328\" font-size=\"10.5\" fill=\"#666D72\">1024</text>\n</svg>",
              "cap": "Below batch 128 the GPU is under-saturated, so total step time stays near the fixed 2ms overhead and per-sample cost falls hyperbolically as that overhead is spread across more samples — batch 32 to 64 barely changes step time, exactly as the earlier practice question described. Past 128 the cores are saturated and each extra sample costs its true marginal compute time (0.02ms), so per-sample cost stops falling and creeps toward that floor instead."
            },
            {
              "t": "worked",
              "q": "Using the figure's model (fixed overhead 2ms while under-saturated, marginal cost 0.02ms/sample once batch exceeds 128), compute the per-sample cost at batch 64 and at batch 1024.",
              "steps": [
                "At batch 64 (under the saturation point of 128), total step time stays near the fixed 2ms, so per-sample cost is 2ms ÷ 64 = 0.03125ms.",
                "At batch 1024 (past saturation), total step time is 2ms + 0.02ms × (1024 - 128) = 2 + 17.92 = 19.92ms.",
                "Per-sample cost at batch 1024 is 19.92 ÷ 1024 ≈ 0.01945ms — very close to, but still slightly above, the 0.02ms compute-bound floor."
              ]
            },
            {
              "t": "p",
              "x": "The knee in the curve, at batch 128 here, is where the GPU transitions from under-saturated to saturated. Below it, larger batches are nearly free — you're amortizing overhead you were already paying. At and past it, the GPU's compute is the actual bottleneck, and no further batching reduces the per-sample cost meaningfully; only a faster chip, more chips, or a cheaper computation (lower precision, fewer flops) does."
            }
          ]
        },
        {
          "title": "Precision, tensor cores, and kernel fusion",
          "blocks": [
            {
              "t": "p",
              "x": "Standard 32-bit floating point (fp32) uses 4 bytes per number; half precision (fp16 or bfloat16) uses 2. Halving the bytes per value directly doubles arithmetic intensity for the same amount of compute, since half as many bytes need to move to feed the same number of flops, and it lets twice as much data fit in the fast on-chip tiers of the memory hierarchy at once. Mixed-precision training exploits this by keeping a master copy of the weights in fp32 for numerical stability while doing most of the actual matrix-multiply arithmetic in fp16 or bfloat16."
            },
            {
              "t": "p",
              "x": "Tensor cores are specialized hardware units, separate from the general-purpose SIMT cores, that compute a small fixed-size matrix multiply-accumulate directly in hardware — dramatically faster than the equivalent sequence of general-purpose instructions. This is a major reason mixed-precision training is often outright faster, not merely more memory-efficient: it isn't just moving less data, it's routing the arithmetic itself through hardware built for exactly that shape of computation."
            },
            {
              "t": "p",
              "x": "Kernel fusion combines several sequential, individually simple operations into a single kernel launch, so intermediate results stay in fast on-chip memory the whole time instead of being written out to slow global memory after each operation and read back in for the next one. This doesn't reduce the total arithmetic performed at all — it reduces the memory traffic, which for a chain of small, elementwise-ish operations is usually the actual bottleneck, exactly per the roofline reasoning above."
            }
          ]
        },
        {
          "title": "Exercises",
          "blocks": [
            {
              "t": "p",
              "x": "These check memory sizing, the batching curve, branch divergence cost, and where arithmetic intensity does and doesn't help."
            }
          ],
          "exercises": [
            {
              "q": "How much GPU memory do the weights of a 13-billion-parameter model take up in fp16, and in fp32?",
              "steps": [
                "fp16 uses 2 bytes per parameter: 13 × 10⁹ × 2 = 26 × 10⁹ bytes.",
                "fp32 uses 4 bytes per parameter, exactly double: 52 × 10⁹ bytes."
              ],
              "answer": "About 26GB in fp16, 52GB in fp32 — before accounting for activations, optimizer state, or the KV cache at inference time, all of which add substantially more."
            },
            {
              "kind": "mc",
              "q": "Per the batching figure's model, why does per-sample cost fall by roughly half going from batch 16 to batch 32, but only fall slightly going from batch 512 to batch 1024?",
              "options": [
                "Below the saturation point, fixed overhead is spread across more samples (nearly free scaling); past it, the GPU is compute-bound and each extra sample costs close to its true marginal compute time",
                "The GPU physically runs twice as fast once the batch size exceeds 512",
                "Batch sizes above 512 are rounded down internally by the hardware",
                "Per-sample cost is unrelated to batch size in either regime"
              ],
              "correct": 0,
              "steps": [
                "At batch 16 and 32, total step time is dominated by fixed overhead paid once per step regardless of batch size, so per-sample cost is roughly (fixed cost)/(batch size) — halving as batch doubles.",
                "By batch 512–1024, the GPU is well past its saturation point, so total step time grows roughly linearly with batch size and per-sample cost has flattened out near its compute-bound floor.",
                "The transition between these two regimes is exactly the knee in the plotted curve."
              ],
              "answer": "Under-saturated batches get nearly-free scaling because fixed overhead is amortized; saturated batches are compute-bound, so per-sample cost has already flattened near its floor and further batching barely helps."
            },
            {
              "kind": "write",
              "q": "The group of (typically 32) threads that a GPU executes in lockstep, one instruction at a time, on the same core cluster is called a ___.",
              "accept": [
                "warp",
                "a warp",
                "gpu warp"
              ],
              "hint": "not a thread block, and not an SM — the unit in between",
              "steps": [
                "SIMT hardware groups threads into fixed-size units that all execute the same instruction simultaneously, each on its own data.",
                "On current NVIDIA hardware that unit is 32 threads.",
                "This is the unit that suffers branch divergence when its threads disagree about which branch to take."
              ],
              "answer": "A warp — the fixed-size group of threads (32, on current NVIDIA hardware) that execute in lockstep."
            },
            {
              "q": "Inside a kernel, 8 of the 32 threads in a warp take the \"if\" branch of a conditional and the other 24 take the \"else\" branch. Explain what the warp actually does, and why the total time is closer to (cost of if) + (cost of else) than to max(cost of if, cost of else).",
              "steps": [
                "A warp executes one instruction at a time across all 32 of its threads in lockstep — it cannot have some threads running \"if\" instructions while others simultaneously run \"else\" instructions.",
                "Instead, the warp runs the \"if\" branch's instructions first, with the 24 \"else\"-bound threads masked off (idle but still occupying warp slots), then runs the \"else\" branch's instructions with the 8 \"if\"-bound threads masked off.",
                "Because both branches are executed serially by the same warp rather than in parallel by different threads, the warp pays for the sum of both branches' instruction cost, not just the larger of the two."
              ],
              "answer": "The warp serializes the two branches — running each once with the non-matching threads masked off — so it pays roughly the sum of both branches' cost, which is the entire reason branch-divergent code inside a warp is expensive."
            },
            {
              "kind": "mc",
              "q": "Which is more likely to be memory-bound rather than compute-bound: a large dense matrix multiply, or an elementwise activation function applied once to a large tensor?",
              "options": [
                "The elementwise activation function, because it performs roughly one flop per byte loaded and reuses nothing",
                "The matrix multiply, because matrices are always larger than activation tensors",
                "Neither can be memory-bound on modern hardware",
                "Both are equally likely to be memory-bound, since arithmetic intensity does not depend on the operation"
              ],
              "correct": 0,
              "steps": [
                "Arithmetic intensity is flops performed per byte moved. A matrix multiply reuses each loaded value across many multiply-adds, giving it high arithmetic intensity — compute-bound.",
                "An elementwise activation loads each value, performs one operation on it, and writes it back out — roughly one flop per byte moved, giving it low arithmetic intensity.",
                "Low arithmetic intensity is exactly the roofline model's signature of a memory-bound operation, regardless of how fast the chip's compute units are."
              ],
              "answer": "The elementwise activation — its arithmetic intensity is low (about one flop per byte moved), which is the roofline model's definition of memory-bound."
            }
          ]
        }
      ],
      "vocab": [
        [
          "SIMD",
          "Single instruction, multiple data — one instruction applied to several data elements at once."
        ],
        [
          "SIMT",
          "Single instruction, multiple threads — the GPU execution model where a warp of threads runs one instruction in lockstep."
        ],
        [
          "Warp",
          "A fixed-size group (32, on current NVIDIA hardware) of threads executed in lockstep on the same core cluster."
        ],
        [
          "Kernel (GPU)",
          "A function written to run as many parallel threads, each operating on its own slice of the data."
        ],
        [
          "Streaming multiprocessor (SM)",
          "A GPU's basic compute unit, hosting a number of cores and scheduling warps onto them."
        ],
        [
          "Occupancy",
          "The ratio of active warps on an SM to the maximum it could hold, given register and shared-memory usage."
        ],
        [
          "Branch divergence",
          "The cost paid when threads in one warp take different branches, forcing the warp to execute both branches serially."
        ],
        [
          "Global memory / HBM",
          "The GPU's main memory tier — large capacity, shared across all threads, and orders of magnitude slower than on-chip memory."
        ],
        [
          "Shared memory",
          "Fast, on-chip memory shared within a single thread block, much quicker to access than global memory."
        ],
        [
          "Arithmetic intensity",
          "Floating-point operations performed per byte of data moved from memory to perform them."
        ],
        [
          "Roofline model",
          "A model capping achievable throughput by whichever of peak compute or peak memory bandwidth binds for a given arithmetic intensity."
        ],
        [
          "Memory-bound",
          "An operation whose runtime is limited by data movement rather than by compute, typically low arithmetic intensity."
        ],
        [
          "Compute-bound",
          "An operation whose runtime is limited by the compute units themselves rather than by data movement."
        ],
        [
          "Mixed precision",
          "Training with most arithmetic in a lower-precision format (fp16/bfloat16) while keeping a master weight copy in fp32."
        ],
        [
          "Tensor core",
          "Specialized hardware computing a small fixed-size matrix multiply-accumulate directly, faster than general-purpose SIMT instructions."
        ],
        [
          "Kernel fusion",
          "Combining multiple sequential operations into one kernel launch to avoid round-tripping intermediate results through slow memory."
        ],
        [
          "PCIe / NVLink",
          "The interconnects moving data between host (CPU) memory and GPU memory, or between GPUs; the slowest hop in the hierarchy."
        ]
      ]
    }
});
