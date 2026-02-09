// ==========================================
// 💻 PROGRAMMING & TECH
// ==========================================
const techLessons = {
  title: "Programming & Tech",
  lessons: [
    {
      id: "binary-logic",
      icon: "¹⁰¹⁰⁰¹¹⁰",
      title: "Binary & Logic",
      subtitle: "Everything digital is just switches — billions of them",
      duration: "4 min",
      difficulty: 1,
      steps: [
        {
          type: "hook",
          content: {
            title: "1 + 1 = 10. Mind = 🤔🤯",
            text: "Computers use base-2 (binary) instead of base-10 (decimal). In binary: 0, 1, 10, 11, 100, 101... Why? Electronic circuits have two stable states — ON (1) or OFF (0). One transistor = one bit. Modern processor: 50 billion transistors = 50 billion tiny switches flipping on/off billions times per second.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Binary: Base-2 Number System",
            text: "Decimal 13 = 1×10¹ + 3×10⁰. Binary 1101 = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8+4+0+1 = 13. Each position is power of 2. Rightmost = 2⁰=1, next = 2¹=2, then 2²=4, 2³=8, etc. To convert decimal to binary: repeatedly divide by 2, track remainders. Example: 13÷2=6 R1, 6÷2=3 R0, 3÷2=1 R1, 1÷2=0 R1. Read remainders bottom-up: 1101.",
            highlight: "Binary position n represents 2ⁿ",
            emoji: "",
            formula: "Number = Σ(digit × 2ⁿ) where n = position from right (starting at 0)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Logic Gates: Building Blocks",
            text: "Gates perform operations on bits. AND gate: output 1 only if BOTH inputs 1. OR gate: output 1 if ANY input 1. NOT gate: inverts input (0→1, 1→0). XOR gate: output 1 if inputs DIFFER. Example: 1 AND 0 = 0, 1 OR 0 = 1, NOT 1 = 0, 1 XOR 1 = 0. Combine gates → create adders, multipliers, memory, CPUs. All computation reduces to logic gates.",
            highlight: "All digital operations = combinations of logic gates",
            emoji: "",
            formula: "AND: A·B, OR: A+B, NOT: Ā, XOR: A⊕B"
          }
        },
        {
          type: "concept",
          content: {
            title: "Bytes, Kilobytes, Data Size",
            text: "Bit = single binary digit (0 or 1). Byte = 8 bits. Can represent 2⁸ = 256 different values (0-255). 1 KB = 1024 bytes (not 1000 — computers use powers of 2). 1 MB = 1024 KB = 1,048,576 bytes. 1 GB = 1024 MB ≈ 1 billion bytes. Example: ASCII character uses 1 byte. Text 'HELLO' = 5 bytes. Image 1920×1080 pixels × 3 colors = 6.2 MB uncompressed.",
            highlight: "1 KB = 2¹⁰ = 2*2*2...(10 times) = 1024 bytes (not 1000)",
            emoji: "",
            formula: "Byte = 8 bits, can store 0-255"
          }
        },
        {
          type: "concept",
          content: {
            title: "Hexadecimal: Shorthand for Binary",
            text: "Base-16: uses 0-9, A-F (A=10, B=11...F=15). Each hex digit = 4 bits. Binary 11010110 = hex D6 (1101=D=13, 0110=6=6). Compact representation. Example: Color #FF5733 = Red=FF=255, Green=57=87, Blue=33=51. Memory addresses shown in hex (0x4A2F). Easier for humans than long binary strings.",
            highlight: "1 hex digit = 4 bits exactly",
            emoji: "",
            formula: "Hex 0-F maps to binary 0000-1111"
          }
        },
        {
          type: "concept",
          content: {
            title: "Boolean Algebra: Math of Logic",
            text: "Variables are TRUE (1) or FALSE (0). Operations: AND (·), OR (+), NOT (¯). Laws: A·1=A, A+0=A, A·Ā=0, A+Ā=1. De Morgan's: NOT(A AND B) = NOT(A) OR NOT(B). Used to simplify circuits. Example: (A·B)+(A·C) = A·(B+C) — factor out A. Fewer gates = faster, cheaper circuits.",
            highlight: "Boolean algebra simplifies logic circuits",
            emoji: "",
            formula: "De Morgan: (A·B)¯ = Ā+B̄, (A+B)¯ = Ā·B̄"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Why 1024 instead of 1000?",
            text: "Storage uses powers of 2 because binary. 2¹⁰ = 1024 ≈ 1000. Called 'kibibyte' (KiB) vs 'kilobyte' (KB). Hard drive makers use 1000 (decimal) to inflate size on box. Computer reports 1024 (binary). 'Missing' space explained by this difference. 1 TB hard drive = 931 GiB actual usable."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can quantum computers use qubits beyond 0 and 1?",
            text: "Yes! Qubit can be 0, 1, or SUPERPOSITION of both (α|0⟩+β|1⟩). Measures as 0 or 1, but before measurement exists in both states. 3 classical bits: 8 possible values (000-111), store one. 3 qubits: can be in superposition of all 8 simultaneously. Exponential speedup for certain problems."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Convert binary 1011 to decimal",
            options: [
              "9",
              "11",
              "13",
              "15"
            ],
            correct: 1,
            explanation: "1011 = 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8+0+2+1 = 11. Remember: positions from right are 2⁰=1, 2¹=2, 2²=4, 2³=8."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is 1 AND 1 in binary logic?",
            options: [
              "0",
              "1",
              "10",
              "11"
            ],
            correct: 1,
            explanation: "AND gate outputs 1 only if BOTH inputs are 1. So 1 AND 1 = 1. Compare: 1 AND 0 = 0, because not both inputs are 1."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Binary = Language of Machines",
            text: "Everything digital reduces to 1s and 0s — voltage HIGH or LOW, transistor ON or OFF. Binary is base-2 positional notation. Logic gates (AND, OR, NOT, XOR) combine to perform computation. Bytes (8 bits) store data. Hexadecimal shorthand for binary. Boolean algebra simplifies circuits. Understanding binary = understanding how computers think.",
            keyTakeaway: "Computers use binary because circuits have two stable states. All computation = billions of transistors switching between 0 and 1."
          }
        }
      ]
    },

    {
      id: "algorithms-complexity",
      icon: "¹²³➡♾",
      title: "Algorithms & Complexity",
      subtitle: "Some problems take longer than universe's lifetime to solve",
      duration: "5 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Sorting 1 billion items: 30 seconds or 31,000 years?",
            text: "Algorithm choice matters enormously. Bubble sort (bad): ~n² operations = (10⁹)² = 10¹⁸ operations ≈ 31,000 years at 1 GHz. Merge sort (good): ~n log n = 10⁹ × 30 ≈ 3×10¹⁰ operations ≈ 30 seconds. Same task, million-fold difference. Algorithm efficiency determines feasibility.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Big O Notation: Growth Rate",
            text: "Describes how runtime grows with input size n. O(1) = constant time (array access). O(log n) = logarithmic (binary search). O(n) = linear (loop through array). O(n log n) = linearithmic (good sorting). O(n²) = quadratic (nested loops). O(2ⁿ) = exponential (try all subsets). Example: O(n²) means doubling input quadruples time. O(log n) means doubling input adds constant time.",
            highlight: "Big O ignores constants, focuses on growth",
            emoji: "",
            formula: "O(f(n)) = upper bound on growth rate where n = input size"
          }
        },
        {
          type: "concept",
          content: {
            title: "Sorting Algorithms Compared",
            text: "Bubble sort: O(n²) — repeatedly swap adjacent elements. Simple but slow. Selection sort: O(n²) — find minimum, place it. Merge sort: O(n log n) — divide array, merge sorted halves. Quicksort: O(n log n) average, O(n²) worst — pick pivot, partition. For n=1,000,000: O(n²) ≈ 1 trillion operations. O(n log n) ≈ 20 million operations. 50,000× faster!",
            highlight: "O(n log n) is optimal for comparison sorting",
            emoji: "",
            formula: "n² vs n log n: difference explodes as n grows"
          }
        },
        {
          type: "concept",
          content: {
            title: "Search Algorithms: Linear vs Binary",
            text: "Linear search: O(n) — check each item sequentially. Binary search: O(log n) — require sorted array, repeatedly halve search space. Example: n=1,000,000. Linear: worst case 1,000,000 checks. Binary: worst case log₂(1,000,000) ≈ 20 checks. 50,000× faster! But binary needs sorted data. Trade-off: sort once O(n log n), search many times O(log n).",
            highlight: "Binary search: log₂(n) means doubling n adds just 1 step",
            emoji: "",
            formula: "log₂(n) = number of times to halve n until reaching 1"
          }
        },
        {
          type: "concept",
          content: {
            title: "P vs NP: Million Dollar Question",
            text: "P = problems solvable in polynomial time (O(nᵏ)). NP = problems verifiable in polynomial time. Example: Sudoku. Checking solution: easy (P). Finding solution: hard (NP). P=NP? asks: if solution verifiable quickly, can we find it quickly? Most believe P≠NP, but unproven. Clay Millennium Prize: $1 million for proof. Affects cryptography, optimization, AI.",
            highlight: "P=NP? is biggest unsolved problem in CS",
            emoji: "",
            formula: "P ⊆ NP, but P = NP? remains open"
          }
        },
        {
          type: "concept",
          content: {
            title: "Space Complexity: Memory Usage",
            text: "Time complexity = speed. Space complexity = memory. O(1) space = constant memory (in-place algorithm). O(n) space = proportional to input. Merge sort: O(n) space (creates temporary arrays). Quicksort: O(log n) space average (recursion stack). Trade-off: faster algorithms often use more memory. Example: hash table O(n) space for O(1) lookup.",
            highlight: "Space-time tradeoff: speed often costs memory",
            emoji: "",
            formula: "Space complexity measures auxiliary memory, not input storage"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Traveling Salesman Problem: exponential nightmare",
            text: "Given n cities, find shortest route visiting all once. Brute force: try all permutations = n! routes. For n=20: 20! ≈ 2.4×10¹⁸ routes. At 1 billion routes/sec: 76 years. For n=70: more routes than atoms in universe. NP-hard problem. No known polynomial algorithm. Real-world logistics use approximations."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Why is 2ⁿ so terrifying?",
            text: "Exponential growth explodes. 2¹⁰ = 1024. 2²⁰ ≈ 1 million. 2³⁰ ≈ 1 billion. 2⁶⁴ ≈ 18 quintillion. Cracking 64-bit key: try all 2⁶⁴ possibilities. At 1 billion/sec: 584 years. 128-bit: would take longer than universe exists. Why encryption works — exponential complexity protects."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If algorithm is O(n²) and n doubles, time does what?",
            options: [
              "Doubles",
              "Triples",
              "Quadruples",
              "Stays same"
            ],
            correct: 2,
            explanation: "O(n²) means time ∝ n². If n doubles, n² becomes (2n)² = 4n². Time quadruples. Example: n=1000 → 1,000,000 ops. n=2000 → 4,000,000 ops (4× more)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Binary search on sorted array of 1,000,000 items: max comparisons?",
            options: [
              "About 20",
              "About 1,000",
              "About 500,000",
              "Exactly 1,000,000"
            ],
            correct: 0,
            explanation: "Binary search is O(log n). log₂(1,000,000) ≈ 20. Each comparison halves remaining items. Example: 1M→500K→250K→...→1. Takes about 20 halvings to reach 1."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Algorithm Choice = Everything",
            text: "Big O notation describes growth rate: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ). Sorting: O(n log n) vs O(n²) = 50,000× difference for large n. Search: O(log n) binary vs O(n) linear. P vs NP asks if verification ease implies solution ease. Space-time tradeoffs. Exponential algorithms (O(2ⁿ)) intractable for large n.",
            keyTakeaway: "Algorithm efficiency matters infinitely more than hardware speed. O(n log n) on slow computer beats O(n²) on supercomputer for large n."
          }
        }
      ]
    },

    {
      id: "neural-networks-deep",
      icon: "🧠",
      title: "Neural Networks",
      subtitle: "AI learns by adjusting 175 billion parameters",
      duration: "5 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "GPT-3 has 175 billion parameters — more than human brain synapses",
            text: "Human brain: ~86 billion neurons, ~100 trillion synapses. GPT-3: 175 billion parameters (weights). Each parameter = adjustable number affecting output. Training: show model text, adjust parameters to predict next word. After training on ~500 billion words, model 'understands' language statistically. Not consciousness — pattern matching at massive scale.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Artificial Neuron: Weighted Sum + Activation",
            text: "Neuron receives inputs x₁, x₂, ..., xₙ. Each input has weight w₁, w₂, ..., wₙ. Neuron computes: z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b (where b = bias). Then applies activation function: y = σ(z). Common activations: ReLU(z) = max(0,z), sigmoid(z) = 1/(1+e⁻ᶻ), tanh. Activation adds non-linearity — without it, network = linear regression.",
            highlight: "Neuron output = activation(weighted_sum + bias)",
            emoji: "",
            formula: "y = σ(Σwᵢxᵢ + b) where σ = activation function"
          }
        },
        {
          type: "concept",
          content: {
            title: "Network Architecture: Layers",
            text: "Input layer: receives data (e.g., image pixels). Hidden layers: process information. Output layer: produces result (e.g., class probabilities). Deep network = many hidden layers (hence 'deep learning'). Example: image classification. Input: 28×28 = 784 pixels. Hidden: 128 neurons. Output: 10 neurons (digits 0-9). Total parameters: 784×128 + 128×10 ≈ 100,000 weights to learn.",
            highlight: "Deep = many layers between input and output",
            emoji: "",
            formula: "Parameters = (n_input × n_hidden) + (n_hidden × n_output) + biases"
          }
        },
        {
          type: "concept",
          content: {
            title: "Training: Gradient Descent",
            text: "Goal: minimize loss function L(θ) where θ = all parameters. Loss measures prediction error. Gradient descent: iteratively adjust parameters in direction that reduces loss. θₙₑw = θₒₗd - η∇L (where η = learning rate, ∇L = gradient). Example: image classifier predicts '7' but should be '3'. Backpropagation computes how each weight contributed to error. Adjust weights slightly to reduce error next time.",
            highlight: "Training = iteratively reduce error using calculus",
            emoji: "",
            formula: "θₙₑw = θₒₗd - η(dL/dθ) where η = learning rate (e.g., 0.001)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Backpropagation: Chain Rule",
            text: "How to compute gradient ∇L? Chain rule from calculus. Loss depends on output. Output depends on last layer. Last layer depends on previous layer. Etc. Chain rule: dL/dw = (dL/dy)(dy/dz)(dz/dw). Backprop computes gradients layer-by-layer backwards from output to input. Efficient algorithm — without it, deep learning impossible. Calculates gradient for millions/billions of parameters.",
            highlight: "Backprop = applying chain rule backward through network",
            emoji: "",
            formula: "dL/dwᵢ = (dL/dy)(dy/dz)(dz/dwᵢ) via chain rule"
          }
        },
        {
          type: "concept",
          content: {
            title: "Overfitting vs Generalization",
            text: "Overfitting: model memorizes training data but fails on new data. Like student memorizing answers without understanding. Solution: regularization (penalize large weights), dropout (randomly disable neurons during training), more data. Generalization: model performs well on unseen data. Goal of ML. Test set: data model NEVER saw during training — measures true performance.",
            highlight: "Good model generalizes, doesn't memorize",
            emoji: "",
            formula: "Error_total = Error_bias + Error_variance + Error_noise"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Why 'deep' learning?",
            text: "Shallow networks (1-2 layers): limited expressiveness. Deep networks: each layer learns progressively abstract features. Image recognition: layer 1 = edges, layer 2 = textures, layer 3 = parts (eyes, wheels), layer 4 = objects (faces, cars). Depth allows hierarchical representation. Universal approximation theorem: even 1-layer network can approximate any function, but needs exponentially more neurons than deep network."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can neural networks prove P=NP?",
            text: "No — neural networks don't prove theorems rigorously. They approximate functions through statistical learning. Even if network 'solves' NP-complete problem on test cases, doesn't prove polynomial algorithm exists. Networks are heuristic, not formal proof. AlphaGo beats humans at Go but doesn't prove optimal strategy. Neural nets complement traditional algorithms, don't replace mathematical proof."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Network has 100 input neurons, 50 hidden, 10 output. How many weights connect input to hidden layer? (ignore biases)",
            options: [
              "150",
              "500",
              "5,000",
              "10,000"
            ],
            correct: 2,
            explanation: "Each input connects to each hidden neuron. Weights = input × hidden = 100 × 50 = 5,000. Example: first hidden neuron receives 100 inputs (1 from each input neuron), so 100 weights. 50 hidden neurons × 100 weights each = 5,000 total."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What does gradient descent do?",
            options: [
              "Increases loss function",
              "Adjusts parameters to decrease error",
              "Adds more layers to network",
              "Removes overfitting"
            ],
            correct: 1,
            explanation: "Gradient descent iteratively adjusts parameters in direction that reduces loss (error). Like descending hill — follow steepest slope downward. Example: if increasing weight w increases error, gradient descent decreases w. Formula: w_new = w_old - η(dL/dw)."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Neural Networks = Universal Function Approximators",
            text: "Artificial neurons compute weighted sums + activation. Layers stack to form deep networks. Training adjusts billions of parameters via gradient descent and backpropagation. Deep networks learn hierarchical representations. Generalization (not overfitting) is goal. Modern AI: GPT-3 (175B parameters), AlphaGo, image recognition — all neural networks at core.",
            keyTakeaway: "Neural networks learn by example, adjusting parameters to minimize error. Depth enables abstraction. Backpropagation + gradient descent make training feasible."
          }
        }
      ]
    },

    {
      id: "internet-protocols",
      icon: "🌐",
      title: "How the Internet Actually Works",
      subtitle: "95% of internet traffic flows through underwater cables",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Undersea cables carry 95% of internet — not satellites",
            text: "~450 fiber-optic cables lie on ocean floor, totaling 1.3 million km. Thickness: garden hose. Data travels as light pulses at 200,000 km/s through glass fiber. Latency Earth-to-satellite: 250ms. Latency NYC-London cable: 30ms. Bandwidth: cable = 400 Tbps per fiber pair. Satellite = few Gbps. Cables win on every metric. Sharks occasionally bite them (fiber looks like bioelectric signals).",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "TCP/IP: Internet's Foundation",
            text: "TCP/IP = two protocols working together. IP (Internet Protocol): addressing and routing. Each device has IP address (e.g., 192.168.1.1). Packets sent to destination IP, routers forward based on routing tables. TCP (Transmission Control Protocol): reliable delivery. Splits data into packets, numbers them, ensures arrival, retransmits if lost. Example: downloading file. TCP splits into packets, IP routes each, TCP reassembles at destination.",
            highlight: "IP = addressing, TCP = reliable delivery",
            emoji: "",
            formula: "Internet = TCP/IP stack (Application/Transport/Internet/Link layers)"
          }
        },
        {
          type: "concept",
          content: {
            title: "DNS: Phone Book of Internet",
            text: "Humans use domain names (google.com). Computers use IP addresses (142.250.185.46). DNS (Domain Name System) translates names → IPs. Hierarchical: .com → google.com → www.google.com. DNS query: browser asks recursive resolver → checks root servers → .com servers → google's authoritative servers → returns IP. Cached for speed. DNS = distributed database, ~13 root servers worldwide (replicated to hundreds).",
            highlight: "DNS translates human-readable names to IP addresses",
            emoji: "",
            formula: "Domain → DNS lookup → IP address → connection"
          }
        },
        {
          type: "concept",
          content: {
            title: "HTTP/HTTPS: Web Communication",
            text: "HTTP (HyperText Transfer Protocol): client-server communication for web. Request methods: GET (fetch data), POST (send data), PUT (update), DELETE (remove). Status codes: 200 (OK), 404 (Not Found), 500 (Server Error). HTTPS = HTTP + TLS/SSL encryption. Data encrypted between browser and server. Public key cryptography: server has certificate, establishes encrypted channel. Modern web = HTTPS only (Chrome marks HTTP as 'Not Secure').",
            highlight: "HTTPS = HTTP encrypted with TLS/SSL",
            emoji: "",
            formula: "Browser → HTTPS GET request → Server responds → Browser renders"
          }
        },
        {
          type: "concept",
          content: {
            title: "Packets & Routing",
            text: "Data split into packets (typically ~1500 bytes each). Each packet: header (source IP, dest IP, sequence number) + payload (data). Packets travel independently through network. Routers examine dest IP, forward to next hop based on routing table. Packets may take different paths. TCP reassembles at destination using sequence numbers. Packet switching = efficient, resilient (no single point of failure).",
            highlight: "Packets travel independently, reassembled at destination",
            emoji: "",
            formula: "Message → split into packets → routed separately → reassembled"
          }
        },
        {
          type: "concept",
          content: {
            title: "Latency vs Bandwidth",
            text: "Latency = time for packet to travel point A → B (milliseconds). Bandwidth = data rate (Mbps, Gbps). Analogy: latency = time for truck to drive cross-country. Bandwidth = truck capacity. Low latency crucial for gaming (50ms good, 200ms unplayable). High bandwidth crucial for streaming (4K needs 25 Mbps). Speed of light limits latency: Earth circumference/c ≈ 133ms minimum theoretical.",
            highlight: "Latency ≠ bandwidth (both matter)",
            emoji: "",
            formula: "Transfer time = latency + (file_size / bandwidth)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "What happens when you type google.com and press Enter?",
            text: "1) Browser checks cache for IP. 2) If not cached, DNS query (recursive resolver → root → .com → google DNS). 3) TCP connection to IP (3-way handshake: SYN, SYN-ACK, ACK). 4) TLS handshake (establish encryption). 5) HTTP GET request for /. 6) Google server responds (HTML). 7) Browser parses HTML, requests CSS/JS/images. 8) Renders page. All in ~100ms."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "IPv4 exhaustion: why IPv6?",
            text: "IPv4 addresses: 32 bits = 2³² ≈ 4.3 billion addresses. Seemed enough in 1981. Now? 8 billion people, multiple devices each. IPv4 exhausted. IPv6: 128 bits = 2¹²⁸ ≈ 340 undecillion addresses. Enough for every atom on Earth to have trillion IPs. Transition slow (backwards compatibility issues), but IPv6 deployment growing (Google: ~40% users on IPv6)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What does DNS do?",
            options: [
              "Encrypts data",
              "Translates domain names to IP addresses",
              "Routes packets",
              "Stores website files"
            ],
            correct: 1,
            explanation: "DNS (Domain Name System) translates human-readable domain names (google.com) into IP addresses (142.250.185.46) that computers use. Like phone book: name → number. Example: type 'youtube.com' → DNS returns IP → browser connects to that IP."
          }
        },
        {
          type: "quiz",
          content: {
            question: "TCP ensures reliable delivery by doing what?",
            options: [
              "Numbering packets and retransmitting lost ones",
              "Using faster cables",
              "Compressing data",
              "Encrypting packets"
            ],
            correct: 0,
            explanation: "TCP numbers packets sequentially. Receiver sends acknowledgments (ACKs). If ACK not received, sender retransmits packet. Example: send packets 1,2,3. Packet 2 lost. Receiver says 'got 1, need 2'. Sender retransmits 2. Ensures all data arrives correctly ordered."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Internet = Layered Protocols + Physical Infrastructure",
            text: "Physical layer: undersea cables (light pulses). IP layer: addressing and routing packets. TCP layer: reliable delivery. Application layer: HTTP, DNS, etc. DNS translates names → IPs. Packets travel independently through routers. TCP reassembles. HTTPS encrypts communication. Understanding internet = understanding protocols at each layer.",
            keyTakeaway: "Internet = TCP/IP protocols + fiber-optic cables. Packets routed independently, reassembled reliably. DNS translates names, HTTPS encrypts."
          }
        }
      ]
    },

    {
      id: "cryptography-security",
      icon: "🗝🔐",
      title: "Cryptography & Security",
      subtitle: "Breaking 256-bit encryption would take longer than universe exists",
      duration: "5 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "256-bit key: 2²⁵⁶ = 10⁷⁷ possibilities. Universe has 10⁸⁰ atoms",
            text: "AES-256 encryption: key space = 2²⁵⁶ ≈ 10⁷⁷ possible keys. Try 1 billion keys/second? Would take 10⁶⁰ years (universe age: 10¹⁰ years). Even if every atom in universe was supercomputer trying 1 billion keys/second: still 10⁻³ years ≈ 8 hours. But no such computational universe exists. Mathematically unbreakable by brute force.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Symmetric Encryption: Same Key Both Sides",
            text: "Alice and Bob share secret key K. Encryption: C = E(K, P) where P = plaintext, C = ciphertext. Decryption: P = D(K, C). Same key for both operations. AES (Advanced Encryption Standard): block cipher, 128/192/256-bit keys. Fast, secure. Problem: key distribution. How do Alice and Bob agree on K without eavesdropper Eve learning it? Symmetric encryption is efficient but requires secure key exchange.",
            highlight: "Symmetric: same key encrypts and decrypts",
            emoji: "",
            formula: "Ciphertext = Encrypt(Key, Plaintext), Plaintext = Decrypt(Key, Ciphertext)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Public Key Cryptography: Mathematical Magic",
            text: "Each person has key pair: public key (everyone knows) + private key (kept secret). Alice encrypts with Bob's PUBLIC key → only Bob's PRIVATE key can decrypt. Mathematically: easy to compute C = Encrypt(PublicKey, P), but extremely hard to reverse without PrivateKey. RSA algorithm: based on prime factorization difficulty. Multiply two 300-digit primes: easy. Factor 600-digit product: impossible (no known efficient algorithm).",
            highlight: "Public key encrypts, private key decrypts (asymmetric)",
            emoji: "",
            formula: "C = Encrypt(PublicKey_Bob, P), P = Decrypt(PrivateKey_Bob, C)"
          }
        },
        {
          type: "concept",
          content: {
            title: "RSA Algorithm: Factorization Hardness",
            text: "Choose two large primes p, q (each ~300 digits). Compute n = p×q (600 digits). Public key includes n. Private key uses p, q. Security: factoring n back to p, q is computationally infeasible. Best known factoring algorithm: exponential time. Example: RSA-2048 (617-digit n) — estimated 10²⁰ years to factor with current computers. Quantum computers (Shor's algorithm) would break RSA, hence post-quantum cryptography research.",
            highlight: "RSA security = prime factorization is exponentially hard",
            emoji: "",
            formula: "n = p×q (easy), but given n, find p and q (hard)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Hash Functions: One-Way Transformations",
            text: "Hash H(data) produces fixed-size output (hash/digest). Properties: (1) Deterministic: same input → same hash. (2) One-way: given hash, can't find input. (3) Collision-resistant: hard to find two inputs with same hash. SHA-256: outputs 256-bit hash. Example: password storage. Store H(password), not password. Login: check if H(entered_password) = stored_hash. Attacker stealing database gets hashes, not passwords (if hashed properly with salt).",
            highlight: "Hash: easy to compute forward, impossible to reverse",
            emoji: "",
            formula: "hash = H(data) where H is one-way function (SHA-256, etc.)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Digital Signatures: Authenticity + Non-repudiation",
            text: "Alice signs message: signature = Sign(PrivateKey_Alice, message). Anyone can verify: Verify(PublicKey_Alice, message, signature) → true/false. Ensures: (1) Alice sent it (authentication), (2) message not modified (integrity), (3) Alice can't deny sending it (non-repudiation). Used in software updates (verify publisher), blockchain transactions, legal documents. Example: Git commits are signed so you know Linus Torvalds actually wrote that code.",
            highlight: "Digital signature: only private key can sign, anyone can verify with public key",
            emoji: "",
            formula: "sig = Sign(PrivateKey, msg), Verify(PublicKey, msg, sig) → boolean"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Quantum computers will break RSA — here's why",
            text: "Shor's algorithm (1994): quantum algorithm factors integers in polynomial time. Classical: exponential (intractable). Quantum computer with ~4000 logical qubits could factor RSA-2048 in hours. Current quantum computers: ~100 noisy qubits (not yet cryptographically relevant). Estimates: 10-20 years until RSA broken. Solution: post-quantum cryptography (lattice-based, hash-based) — algorithms believed quantum-resistant."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Why can't you just 'try all passwords'?",
            text: "Password length matters exponentially. 8-char lowercase (26 options per char): 26⁸ ≈ 200 billion combinations. At 1 billion/sec: 200 seconds. Add uppercase + numbers + symbols (95 options): 95⁸ ≈ 6 quadrillion. Takes 70 days. 12-char complex: 95¹² ≈ 10²³ combinations = 3 million years. Each extra character multiplies combinations by 95. Exponential growth protects."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Alice wants to send encrypted message to Bob. What key does she use?",
            options: [
              "Her own private key",
              "Her own public key",
              "Bob's public key",
              "Bob's private key"
            ],
            correct: 2,
            explanation: "Alice encrypts with Bob's PUBLIC key. Only Bob's PRIVATE key can decrypt. Public keys are for encryption (everyone can use them), private keys for decryption (only owner has it). Example: sending email to bob@example.com → encrypt with Bob's public key → only Bob can read."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Hash function takes 'password123' and outputs 256-bit hash. If one letter changes, hash does what?",
            options: [
              "Changes slightly",
              "Changes completely (avalanche effect)",
              "Stays the same",
              "Becomes shorter"
            ],
            correct: 1,
            explanation: "Cryptographic hash has avalanche effect: tiny input change → completely different output. SHA-256('password123') vs SHA-256('password124') → totally different 256-bit hashes. Property crucial for security — can't predict hash from similar inputs."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Cryptography = Math Protecting Digital World",
            text: "Symmetric encryption (AES): fast, same key both sides. Asymmetric (RSA): public key encrypts, private key decrypts — solves key distribution. Hash functions (SHA-256): one-way, collision-resistant. Digital signatures: authentication + integrity. Security based on computational hardness (factorization, discrete log). Quantum computers threaten current crypto — post-quantum algorithms in development.",
            keyTakeaway: "Modern cryptography uses mathematical hardness (exponential brute-force time) to secure data. Breaking 256-bit encryption = computationally infeasible."
          }
        }
      ]
    },

    {
      id: "quantum-computing-future",
      icon: "🖥⚛",
      title: "Quantum Computing",
      subtitle: "3 qubits can be in 8 states simultaneously",
      duration: "5 min",
      difficulty: 4,
      steps: [
        {
          type: "hook",
          content: {
            title: "3 classical bits: 8 possible values (000-111), stores ONE at a time",
            text: "3 qubits: superposition of ALL 8 values simultaneously. n qubits → 2ⁿ states in superposition. 300 qubits → 2³⁰⁰ ≈ 10⁹⁰ states (more than atoms in universe). Classical computer with 300 bits stores ONE of 2³⁰⁰ values. Quantum computer processes ALL 2³⁰⁰ values in parallel. Exponential parallelism — but reading output collapses superposition to single result. Quantum advantage comes from clever algorithm design.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Qubit: Quantum Bit",
            text: "Classical bit: 0 OR 1 (definite state). Qubit: superposition α|0⟩ + β|1⟩ where |α|² + |β|² = 1. α, β are complex probability amplitudes. Before measurement: qubit is BOTH 0 and 1. Measurement collapses to 0 (probability |α|²) or 1 (probability |β|²). Example: α = β = 1/√2 → 50% chance each. Physically: electron spin (up/down), photon polarization (horizontal/vertical), superconducting circuits (current clockwise/counterclockwise).",
            highlight: "Qubit = α|0⟩ + β|1⟩ where |α|² + |β|² = 1",
            emoji: "",
            formula: "Measurement collapses: |0⟩ with prob |α|², |1⟩ with prob |β|²"
          }
        },
        {
          type: "concept",
          content: {
            title: "Quantum Gates: Manipulating Superposition",
            text: "Classical gate: AND, OR, NOT. Quantum gate: unitary operations on qubits. Hadamard gate H: creates superposition. H|0⟩ = (|0⟩+|1⟩)/√2 (equal superposition). CNOT gate: entangles qubits. Pauli gates (X, Y, Z): rotations. Gates described by complex matrices. Example: X gate (quantum NOT): X|0⟩ = |1⟩, X|1⟩ = |0⟩. Quantum gates are reversible (invertible matrices) — information preserved.",
            highlight: "Quantum gates = unitary matrices acting on qubit states",
            emoji: "",
            formula: "H|0⟩ = (|0⟩+|1⟩)/√2 (Hadamard creates superposition)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Entanglement: Einstein's 'Spooky Action'",
            text: "Entangled qubits: measurement of one INSTANTLY affects other, regardless of distance. Bell state: (|00⟩+|11⟩)/√2. Measure first qubit → get 0 or 1 randomly (50-50). But second qubit ALWAYS matches first. If first = 0, second = 0. If first = 1, second = 1. Correlation despite spatial separation. Not faster-than-light communication (can't control measurement outcome), but non-local correlation. Entanglement enables quantum teleportation, quantum key distribution.",
            highlight: "Entanglement = correlated qubits, measurement of one affects other",
            emoji: "",
            formula: "Bell state: |Φ⁺⟩ = (|00⟩+|11⟩)/√2 (maximally entangled)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Quantum Algorithms: Shor's and Grover's",
            text: "Shor's algorithm: factors N-bit integer in O((log N)³) time (polynomial). Classical best: sub-exponential but still intractable for large N. Breaks RSA encryption. Grover's algorithm: searches unsorted database of N items in O(√N) time. Classical: O(N) (must check each). Quadratic speedup. Example: N = 1,000,000 items. Classical: 1 million checks. Quantum: 1,000 checks. Not exponential speedup, but significant.",
            highlight: "Shor's: exponential speedup (factoring). Grover's: quadratic speedup (search)",
            emoji: "",
            formula: "Shor: O(poly log N) vs classical O(exp(N^(1/3))). Grover: O(√N) vs O(N)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Decoherence: The Enemy",
            text: "Qubits are fragile. Interaction with environment destroys superposition (decoherence). Timescale: microseconds to milliseconds. Quantum computation must finish before decoherence. Error correction: encode logical qubit in multiple physical qubits (e.g., surface code: 1 logical needs ~1000 physical qubits). Current quantum computers: noisy intermediate-scale quantum (NISQ) — 50-100 qubits, limited coherence. Fault-tolerant quantum computer: millions of physical qubits needed.",
            highlight: "Decoherence = superposition destroyed by environment interaction",
            emoji: "",
            formula: "Coherence time = time before decoherence ruins computation"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Why can't quantum computers solve all problems exponentially faster?",
            text: "Common misconception: quantum computers are 'exponentially faster supercomputers.' Reality: only certain problems benefit. Shor's algorithm (factoring): exponential speedup. Grover's (search): quadratic speedup. Many problems (sorting, matrix multiplication): NO quantum advantage proven. Quantum computers complement classical, not replace. Some problems (simulation of quantum systems) naturally quantum — exponential advantage there."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Quantum supremacy achieved (2019)",
            text: "Google's 53-qubit Sycamore processor: performed computation in 200 seconds that would take classical supercomputer ~10,000 years (claimed). Sampling problem (not useful application, but demonstrates quantum advantage). IBM disputed claim (said classical could do in 2.5 days with different algorithm). Regardless, milestone: quantum computer performed task beyond practical classical reach."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If you have 5 qubits in superposition, how many states exist simultaneously?",
            options: [
              "5",
              "10",
              "25",
              "32"
            ],
            correct: 3,
            explanation: "n qubits → 2ⁿ states in superposition. 5 qubits → 2⁵ = 32 states (00000, 00001, ..., 11111) exist simultaneously. Example: 1 qubit = 2 states (|0⟩,|1⟩), 2 qubits = 4 states (|00⟩,|01⟩,|10⟩,|11⟩), 3 qubits = 8 states, etc. Exponential growth."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What happens when you measure a qubit in superposition α|0⟩ + β|1⟩?",
            options: [
              "Get both 0 and 1",
              "Get α and β values",
              "Superposition collapses to 0 or 1 probabilistically",
              "Qubit remains in superposition"
            ],
            correct: 2,
            explanation: "Measurement collapses superposition to definite state: |0⟩ with probability |α|², or |1⟩ with probability |β|². Example: α=β=1/√2 → 50% chance 0, 50% chance 1. After measurement, qubit is in measured state (superposition destroyed). Can't 'read out' α and β directly."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Quantum Computing = Harnessing Superposition + Entanglement",
            text: "Qubits exist in superposition (α|0⟩+β|1⟩). n qubits → 2ⁿ states simultaneously. Quantum gates manipulate superposition. Entanglement creates correlations. Measurement collapses to classical result. Shor's algorithm breaks RSA (exponential speedup). Grover's searches (quadratic speedup). Decoherence limits current systems. Quantum advantage proven for specific problems, not universal speedup.",
            keyTakeaway: "Quantum computers exploit superposition and entanglement for exponential parallelism. Not faster for all problems, but revolutionary for quantum simulation, cryptography, optimization."
          }
        }
      ]
    }
  ]
};

console.log('✅ tech-lessons.js loaded:', techLessons.lessons.length, 'lessons');