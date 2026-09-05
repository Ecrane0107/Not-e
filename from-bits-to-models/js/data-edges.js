const EDGES = [
  ["binary","variables"], ["variables","control"], ["variables","strings"],
  ["variables","arrays"], ["variables","pointers"], ["control","functions"],
  ["functions","recursion"], ["functions","oop"], ["functions","functional"],
  ["functions","modules"], ["functions","testing"],

  ["arrays","linked"], ["pointers","linked"], ["linked","stackqueue"],
  ["arrays","hash"], ["strings","hash"], ["pointers","trees"], ["recursion","trees"],
  ["trees","heaps"], ["trees","graphsds"], ["discrete","graphsds"],
  ["recursion","complexity"], ["arrays","complexity"], ["discrete","complexity"],
  ["complexity","sorting"], ["divide","sorting"], ["sorting","searching"],
  ["recursion","divide"], ["complexity","greedy"], ["recursion","backtrack"],
  ["recursion","dp"], ["complexity","dp"], ["backtrack","dp"],
  ["graphsds","graphalgo"], ["stackqueue","graphalgo"], ["heaps","graphalgo"],
  ["greedy","graphalgo"], ["strings","stringalgo"], ["dp","stringalgo"],

  ["discrete","prob"], ["prob","stats"], ["prob","infotheory"],
  ["calculus","optimization"], ["linalg","optimization"], ["optimization","graddesc"],

  ["pointers","memory"], ["memory","os"], ["os","concurrency"], ["os","networking"],
  ["hash","databases"], ["trees","databases"], ["networking","distributed"],
  ["concurrency","distributed"], ["concurrency","gpu"], ["linalg","gpu"],

  ["arrays","datawrangle"], ["stats","datawrangle"],
  ["datawrangle","supervised"], ["linalg","supervised"], ["prob","supervised"],
  ["datawrangle","unsupervised"], ["prob","unsupervised"],
  ["supervised","evaluation"], ["stats","evaluation"], ["infotheory","evaluation"],
  ["graddesc","nn"], ["supervised","nn"], ["linalg","nn"],
  ["nn","backprop"], ["calculus","backprop"],
  ["backprop","cnn"], ["backprop","rnn"],
  ["unsupervised","embeddings"], ["linalg","embeddings"],
  ["backprop","attention"], ["embeddings","attention"], ["rnn","attention"],
  ["nn","rl"], ["prob","rl"],
  ["gpu","scaletrain"], ["distributed","scaletrain"], ["backprop","scaletrain"],

  ["cnn","cv"], ["rnn","nlp"], ["stringalgo","nlp"], ["embeddings","nlp"],
  ["attention","llm"], ["scaletrain","llm"], ["infotheory","llm"], ["nlp","llm"],
  ["llm","finetune"], ["evaluation","finetune"],
  ["llm","rag"], ["embeddings","rag"], ["databases","rag"],
  ["llm","agents"], ["rag","agents"], ["rl","agents"],
  ["evaluation","mlops"], ["distributed","mlops"], ["databases","mlops"],
  ["llm","alignment"], ["rl","alignment"], ["evaluation","alignment"],

  ["agents","relevance"], ["alignment","relevance"], ["mlops","relevance"]
];
