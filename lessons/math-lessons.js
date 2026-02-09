// ==========================================
// 📐 MATHEMATICS
// ==========================================
const mathLessons = {
  title: "Mathematics",
  lessons: [
    {
      id: "whats-a-number-really",
      icon: "¹²³⁴",
      title: "What's a Number, Really?",
      subtitle: "The most powerful abstraction humans ever invented",
      duration: "4 min",
      difficulty: 1,
      steps: [
        {
          type: "hook",
          content: {
            title: "You can't count past 4",
            text: "Flash 7 dots for 0.1 seconds — most people guess '6' or '8'. Flash 3 dots? Instant recognition. Beyond 4, your brain doesn't COUNT — it estimates. So how do we handle billions, trillions, infinity? Numbers. The cognitive hack that shattered our biological limits.",
            emoji: "😌"
          }
        },
        {
          type: "concept",
          content: {
            title: "Numbers = Pure Abstraction",
            text: "Three apples 🍎🍎🍎 and three stars ⭐⭐⭐ share nothing physical — except 'three-ness'. That pattern exists nowhere in reality. You can't touch 'three'. You can't see 'three'. Yet it describes apples, stars, thoughts, galaxies. Numbers are humanity's first abstract language: patterns divorced from objects.",
            highlight: "Three-ness exists only in minds",
            emoji: "🔢"
          }
        },
        {
          type: "concept",
          content: {
            title: "Notation vs Quantity",
            text: "Same quantity, infinite representations: 10₁₀ = 1010₂ = A₁₆ = 12₈ = ten fingers = X (Roman). Babylonians counted in base-60 (hence 60 seconds, 360 degrees). Mayans used base-20. Binary uses 2. The QUANTITY never changes — only the notation. Math transcends language.",
            highlight: "10₁₀ = 1010₂ = A₁₆ = 12₈",
            emoji: "😏",
            formula: "Same value, different bases"
          }
        },
        {
          type: "concept",
          content: {
            title: "Zero: The Revolutionary Nothing",
            text: "Ancient Rome had no zero. Can't write 'nothing' in Roman numerals. No zero = no place-value = no algebra. Compare 105 vs 15 — same digits, but POSITION matters because of zero. India invented 0 around 500 CE. Mathematics exploded. Zero isn't 'nothing' — it's the placeholder that unlocked infinity.",
            highlight: "105 = 1×10² + 0×10¹ + 5×10⁰",
            emoji: "0➡😎",
            formula: "Zero enables positional notation"
          }
        },
        {
          type: "concept",
          content: {
            title: "Operations = Mathematical Verbs",
            text: "Addition (2+3=5): combine. Subtraction (5−2=3): remove. Multiplication (4×3=12): repeated addition. Division (12÷3=4): split equally. Exponentiation (2³=8): repeated multiplication. Each operation transforms numbers. They don't just exist — they interact, evolve, cascade.",
            highlight: "4×3 = 4+4+4 = 12",
            emoji: "🤓",
            formula: "Operations are transformations"
          }
        },
        {
          type: "concept",
          content: {
            title: "Nature's Hidden Mathematics",
            text: "Sunflower spirals: 21 clockwise, 34 counterclockwise. Pine cones: 8 and 13 scales. Nautilus shells: chambers follow 1,1,2,3,5,8,13... The Fibonacci sequence (Fₙ = Fₙ₋₁ + Fₙ₋₂) appears everywhere. Why? It's nature's most efficient packing algorithm. Math isn't invented — it's discovered in reality's source code.",
            highlight: "Fibonacci: 1,1,2,3,5,8,13,21,34,55...",
            emoji: "🌻",
            formula: "Fₙ = Fₙ₋₁ + Fₙ₋₂"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "👽If aliens contact us, they'll send primes",
            text: "Prime numbers (2,3,5,7,11,13...) can't be divided — they're mathematical atoms, universal across spacetime. In 1974, the Arecibo message transmitted primes into space: a cosmic 'hello' any intelligence would recognize. Receive a prime sequence? It's not random. It's someone thinking."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🧐Why does π appear in probability?",
            text: "π = 3.14159... comes from circles, right? Yet it emerges in random walks, bell curves, and Buffon's needle (drop needles on lined paper — probability involves π). No circles involved. Why does randomness encode circles? Because π describes periodic cycles, and probability IS cycles in disguise. The universe thinks in circles."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What revolutionary capability did zero enable?",
            options: [
              "Counting to infinity",
              "Measuring time accurately",
              "Place-value systems (105 ≠ 15)",
              "Using negative numbers"
            ],
            correct: 2,
            explanation: "Zero as placeholder enables positional notation: 105 (one hundred five) vs 15 (fifteen). Without it, no algebra, no calculus, no modern mathematics. Zero is the gate to abstraction."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Sunflower spirals typically follow which pattern?",
            options: [
              "Random distributions",
              "Perfect symmetry (20 and 20)",
              "Prime number sequences",
              "Fibonacci numbers (21 and 34)"
            ],
            correct: 3,
            explanation: "Sunflowers grow 21 clockwise and 34 counterclockwise spirals — consecutive Fibonacci numbers. This maximizes seed packing efficiency. Nature optimizes using math."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Numbers = Thinking Beyond Biology",
            text: "Before numbers, thought was limited to what senses could detect. After numbers, humans could reason about infinity, atoms, dimensions beyond three. Numbers aren't just tools — they're cognitive extensions. Learning math isn't memorizing rules. It's expanding what minds can conceive.",
            keyTakeaway: "Numbers are abstractions that let consciousness transcend physical limitations. They're reality's programming language."
          }
        }
      ]
    },

    {
      id: "fractions-and-fair-shares",
      icon: "🍕🍰",
      title: "Fractions and Fair Shares",
      subtitle: "How humanity learned to divide the indivisible",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "1 ÷ 3 = ???",
            text: "Ancient Egyptians had a problem: divide 1 loaf among 3 workers. You can't cut it into 'point-three-three-three' pieces. So they invented unit fractions: 1/2 + 1/6. Instead of decimal thinking, they thought in parts. Fractions aren't decimals in disguise — they're a completely different number system.",
            emoji: "🤔"
          }
        },
        {
          type: "concept",
          content: {
            title: "Anatomy of a Fraction",
            text: "3/4 = relationship between part and whole. Numerator (3) = parts you have. Denominator (4) = parts that make a whole. It's a RATIO, not a static number. 3/4 = 6/8 = 0.75 = 75% — same relationship, different representations. Fractions capture proportions, not just quantities.",
            highlight: "3/4 = part/whole ratio",
            emoji: "😶",
            formula: "a/b where b ≠ 0"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Equivalence Principle",
            text: "1/2 = 2/4 = 3/6 = 4/8 = ... infinite equivalent forms. Multiply or divide numerator AND denominator by same number — ratio stays unchanged. Why? Because you're scaling both part and whole proportionally. Like zooming a photo: dimensions change, but proportions don't.",
            highlight: "1/2 = 2/4 = 50/100 = 0.5",
            emoji: "😮",
            formula: "(a×k)/(b×k) = a/b for any k ≠ 0"
          }
        },
        {
          type: "concept",
          content: {
            title: "Adding Fractions: Common Ground",
            text: "Can't add 1/3 + 1/4 directly — different denominators = different 'units'. Solution: find common denominator (12). Convert: 1/3 = 4/12, 1/4 = 3/12. Now add: 4/12 + 3/12 = 7/12. Like converting dollars to euros before adding — need common measurement.",
            highlight: "1/3 + 1/4 = 4/12 + 3/12 = 7/12",
            emoji: "🤨",
            formula: "a/b + c/d = (ad + bc)/(bd)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Multiplying Fractions: Simplicity Itself",
            text: "Multiply fractions? Multiply straight across: (2/3) × (3/4) = 6/12 = 1/2. Why so easy? You're finding 'fraction OF fraction' — 2/3 OF 3/4 means multiply. No common denominator needed. Multiplication is fundamentally simpler than addition for fractions.",
            highlight: "(2/3) × (3/4) = 6/12 = 1/2",
            emoji: "😇",
            formula: "(a/b) × (c/d) = (ac)/(bd)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Division: Flip and Multiply",
            text: "Dividing by fraction = multiply by its reciprocal. (1/2) ÷ (1/4) = (1/2) × (4/1) = 4/2 = 2. Why? Division asks 'how many fit?' How many quarters fit in a half? Two. Reciprocal flips the question into multiplication.",
            highlight: "(a/b) ÷ (c/d) = (a/b) × (d/c)",
            emoji: "🙃",
            formula: "Dividing = multiply by reciprocal"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🧐Ancient Egypt used only unit fractions",
            text: "Egyptians wrote ALL fractions as sums of unit fractions (1/n). Instead of 3/4, they'd write 1/2 + 1/4. Instead of 2/5, they'd use 1/3 + 1/15. Why? Their notation couldn't handle non-unit fractions. This 'limitation' created incredibly sophisticated fraction arithmetic — they had to be creative within constraints."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "What fraction of reality can you describe with fractions?",
            text: "Rationals (fractions) seem everywhere, but they're actually RARE. Between any two fractions lie infinite more fractions — yet they don't fill the number line. √2, π, e can't be written as fractions. These 'irrationals' are MORE common than rationals. Fractions describe only a tiny sliver of mathematical reality."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is 2/3 + 3/4?",
            options: [
              "5/7",
              "8/12 + 9/12 = 17/12",
              "5/12",
              "1"
            ],
            correct: 1,
            explanation: "Need common denominator (12). Convert: 2/3 = 8/12, 3/4 = 9/12. Add: 8/12 + 9/12 = 17/12. Can also write as 1 5/12 (mixed number)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is (2/5) × (3/7)?",
            options: [
              "5/12",
              "6/35",
              "6/12",
              "5/35"
            ],
            correct: 1,
            explanation: "Multiply across: (2×3)/(5×7) = 6/35. Multiplication of fractions is direct — no common denominator needed. You're finding 'fraction OF fraction'."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Fractions = Precision Beyond Whole Numbers",
            text: "Whole numbers count discrete objects. Fractions measure continuous reality — time, space, probability. They're not 'broken numbers' but a parallel number system capturing relationships, not quantities. Master fractions, and you can describe reality with infinite precision.",
            keyTakeaway: "Fractions represent ratios and proportions — the mathematics of relationships, not just counting."
          }
        }
      ]
    },

    {
      id: "infinity-and-beyond",
      icon: "∞ ℵ",
      title: "Infinity & Beyond",
      subtitle: "Some infinities are bigger than others",
      duration: "5 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "∞ + 1 = ∞",
            text: "Add one to infinity — you get infinity back. Multiply infinity by billion — still infinity. But here's the twist: some infinities are BIGGER than others. Mathematically provable. Georg Cantor proved it in 1891 and nearly went insane contemplating it. Welcome to the deepest rabbit hole in mathematics.",
            emoji: "🤪"
          }
        },
        {
          type: "concept",
          content: {
            title: "Countable Infinity (ℵ₀)",
            text: "Natural numbers (1,2,3,4...) go on forever. That's infinity. But you can COUNT them: 1st, 2nd, 3rd... Even integers (...-2,-1,0,1,2...) are countable — just alternate: 0,1,-1,2,-2,3,-3... Even fractions (1/1, 1/2, 2/1, 1/3...) are countable! This size of infinity is called ℵ₀ (aleph-null).",
            highlight: "ℵ₀ = countable infinity",
            emoji: "😏",
            formula: "ℕ = {1,2,3,4,...}"
          }
        },
        {
          type: "concept",
          content: {
            title: "Uncountable Infinity (ℵ₁)",
            text: "Real numbers between 0 and 1: 0.1, 0.11, 0.111, 0.1111... Infinite decimals. Try listing them all — IMPOSSIBLE. Cantor's diagonal proof: any 'complete' list misses numbers. You literally cannot count them, even with infinite time. This infinity (ℵ₁) is LARGER than ℵ₀. Mind-bending but rigorous.",
            highlight: "ℝ (reals) > ℕ (naturals)",
            emoji: "😧",
            formula: "ℵ₁ > ℵ₀"
          }
        },
        {
          type: "concept",
          content: {
            title: "Cantor's Diagonal Argument",
            text: "Proof by contradiction: Assume you've listed ALL decimals between 0 and 1. Now create a new number: change 1st digit of 1st number, 2nd digit of 2nd number, etc. This new number differs from EVERY listed number. Contradiction! The reals between 0 and 1 are uncountably infinite.",
            highlight: "Diagonal method proves uncountability",
            emoji: "😨",
            formula: "New number differs at position n from nth number"
          }
        },
        {
          type: "concept",
          content: {
            title: "Hilbert's Hotel Paradox",
            text: "Imagine hotel with infinite rooms (1,2,3...), all full. Guest arrives. Solution? Everyone moves: room 1→2, 2→3, 3→4... Room 1 now free! Infinite bus arrives with infinite guests? Move everyone to EVEN rooms (1→2, 2→4, 3→6...), ODD rooms now free. Infinity + infinity = infinity. Arithmetic breaks down.",
            highlight: "∞ + ∞ = ∞",
            emoji: "🤩",
            formula: "Infinite set has same size as proper subset"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Continuum Hypothesis",
            text: "Is there an infinity BETWEEN ℵ₀ and ℵ₁? Cantor believed no. But Kurt Gödel and Paul Cohen proved it's UNDECIDABLE — you can't prove it true OR false within standard mathematics. It's independent of axioms. Some mathematical questions have no answer.",
            highlight: "Some questions transcend proof",
            emoji: "😱🔁",
            formula: "2^ℵ₀ = ℵ₁ ?"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "😵There are more real numbers between 0 and 1 than integers total",
            text: "Interval (0,1) contains uncountably infinite reals. All integers (...-2,-1,0,1,2...) are merely countably infinite. So a tiny interval of the number line has MORE numbers than the entire integer line stretching to ±∞. Small can be infinitely larger than big."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤔Can you reach infinity?",
            text: "Infinity isn't a destination — it's a process without end. 1,2,3,... never 'arrives' at infinity. It keeps going. Infinity is POTENTIAL, not actual. Except in set theory, where infinity is treated as completed totality. So which is it? Depends on your axioms. Mathematics has multiple consistent infinities."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Which set is larger?",
            options: [
              "Natural numbers (1,2,3...)",
              "All integers (...-2,-1,0,1,2...)",
              "All real numbers between 0 and 1",
              "They're all the same size"
            ],
            correct: 2,
            explanation: "Real numbers between 0 and 1 are UNCOUNTABLY infinite (ℵ₁). Naturals and integers are both COUNTABLY infinite (ℵ₀). Reals form strictly larger infinity. Proven by Cantor's diagonal argument."
          }
        },
        {
          type: "quiz",
          content: {
            question: "In Hilbert's Hotel (infinite rooms, all full), infinite bus arrives. Can they fit?",
            options: [
              "No, hotel is full",
              "Yes, move everyone to even rooms, odds become free",
              "Yes, build more rooms",
              "Need to kick someone out"
            ],
            correct: 1,
            explanation: "Move guest in room n to room 2n. All even rooms now occupied, all infinite odd rooms free for infinite bus guests. Infinity accommodates infinity."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Infinity Breaks Intuition",
            text: "Infinity isn't just 'really big' — it's a fundamentally different type of quantity where arithmetic rules dissolve. Some infinities are larger than others. Questions exist with no provable answer. Infinity reveals mathematics at its most abstract, pushing human thought beyond physical constraints into pure logic.",
            keyTakeaway: "Infinity isn't one thing — it's a hierarchy of sizes. Mathematics can prove some infinities exceed others, shattering intuition."
          }
        }
      ]
    },

    {
      id: "secret-life-equations",
      icon: "⚖🛰",
      title: "The Secret Life of Equations",
      subtitle: "Finding hidden truths through balance",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "x + 5 = 12. What is x?",
            text: "Seems trivial: x = 7. But think deeper: you just solved for an UNKNOWN. Something was hidden, and you uncovered it through logic. Every equation is a detective story — clues on both sides, truth in the middle. Ancient Babylonians used equations to divide inheritance 4000 years ago. Same principle, different unknowns.",
            emoji: "👀"
          }
        },
        {
          type: "concept",
          content: {
            title: "Equations = Balanced Statements",
            text: "Equation: two expressions equal. 3x + 2 = 11 means left side EQUALS right side. Like balanced scales — add weight to one side, must add to other to maintain equilibrium. Whatever you do to one side, do to other. This principle solves ALL equations.",
            highlight: "Left = Right (always)",
            emoji: "🤠",
            formula: "If a = b, then a + c = b + c"
          }
        },
        {
          type: "concept",
          content: {
            title: "Solving = Isolating the Unknown",
            text: "Goal: get variable alone. Example: 3x + 2 = 11. Subtract 2 from both sides: 3x = 9. Divide both by 3: x = 3. Check: 3(3) + 2 = 9 + 2 = 11 ✓. Every step maintains balance while peeling away layers to reveal x.",
            highlight: "Undo operations in reverse order",
            emoji: "😷",
            formula: "3x + 2 = 11 → 3x = 9 → x = 3"
          }
        },
        {
          type: "concept",
          content: {
            title: "Inverse Operations: The Undoing",
            text: "Every operation has opposite: +/−, ×/÷, ^/√. Solving uses inverses to 'undo' operations around variable. Added 5? Subtract 5. Multiplied by 3? Divide by 3. Squared? Take square root. Operations and inverses cancel: x + 5 − 5 = x.",
            highlight: "Operation + Inverse = Identity",
            emoji: "🙃",
            formula: "x + 5 − 5 = x × 3 ÷ 3 = x² √ = x"
          }
        },
        {
          type: "concept",
          content: {
            title: "Systems of Equations: Multiple Unknowns",
            text: "One equation, one variable: x + 2 = 5 → x = 3. Two equations, two variables: x + y = 5 AND x − y = 1. Solve simultaneously: add equations → 2x = 6 → x = 3, then y = 2. Each equation is a constraint; together they pinpoint unique solution.",
            highlight: "n equations for n unknowns",
            emoji: "🐱‍🚀👻",
            formula: "x + y = 5, x − y = 1 → x = 3, y = 2"
          }
        },
        {
          type: "concept",
          content: {
            title: "Quadratic Equations: x²",
            text: "When x is squared: ax² + bx + c = 0. Example: x² − 5x + 6 = 0. Solutions? Factor: (x−2)(x−3) = 0. So x = 2 OR x = 3. Quadratics often have TWO solutions. Represents parabola crossing x-axis twice. Geometry meets algebra.",
            highlight: "Quadratic → up to 2 solutions",
            emoji: "🤓👨‍🎓",
            formula: "x = [−b ± √(b²−4ac)] / 2a"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "👳‍♂️ Al-Khwarizmi invented 'algebra' — literally",
            text: "The word 'algebra' comes from al-jabr (Arabic: 'restoration') — from Persian mathematician Al-Khwarizmi's 820 CE book. He systematized equation-solving, giving us step-by-step methods still taught today. His name also gave us 'algorithm'. One man, two foundational terms."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤔Why do we use 'x' for unknowns?",
            text: "Arabic word for 'unknown' is 'shay' (thing). Spanish translators used 'xei'. French abbreviated to 'x'. Pure historical accident — could've been any letter. Yet 'x marks the spot' became universal. Sometimes conventions emerge from randomness, then solidify into permanence."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Solve: 2x − 4 = 10",
            options: [
              "x = 3",
              "x = 7",
              "x = 6",
              "x = 14"
            ],
            correct: 1,
            explanation: "Add 4 to both sides: 2x = 14. Divide both by 2: x = 7. Check: 2(7) − 4 = 14 − 4 = 10 ✓"
          }
        },
        {
          type: "quiz",
          content: {
            question: "How many solutions can x² = 9 have?",
            options: [
              "Zero",
              "One (x = 3)",
              "Two (x = 3 or x = −3)",
              "Infinite"
            ],
            correct: 2,
            explanation: "x² = 9 has TWO solutions: x = 3 and x = −3. Both squared equal 9. Quadratics typically have two solutions (unless discriminant = 0)."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Equations = Logical Archaeology",
            text: "Every equation hides a truth. Solving is excavation — carefully removing layers using logical tools (inverse operations, balance) until the unknown is revealed. From simple x + 2 = 5 to Einstein's E = mc², equations encode relationships, compress knowledge, and let us solve for what we cannot directly observe.",
            keyTakeaway: "Equations are balanced statements. Solving maintains balance while isolating unknowns. Master this, and you can uncover hidden truths systematically."
          }
        }
      ]
    },

    {
      id: "patterns-functions",
      icon: "∬📉📊",
      title: "Patterns, Functions & Relationships",
      subtitle: "How things change together",
      duration: "5 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "y = 2x means 'double everything'",
            text: "Input 3 → output 6. Input 10 → output 20. Input 1000 → output 2000. The pattern never breaks. That's a function: reliable transformation machine. Input → process → output. Predictable. Repeatable. The heartbeat of mathematics and programming.",
            emoji: "💍🔀💍💍"
          }
        },
        {
          type: "concept",
          content: {
            title: "Functions = Input-Output Machines",
            text: "Function: rule linking input (x) to EXACTLY ONE output (y). f(x) = 2x means 'double input'. f(3) = 6. f(10) = 20. Notation f(x) reads 'f of x' or 'function of x'. Same input ALWAYS gives same output. Deterministic. Reliable. Foundation of computation.",
            highlight: "f(x) → exactly one output",
            emoji: " 1️⃣🧙‍♂️➡3️⃣",
            formula: "f: X → Y (domain → codomain)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Graphing Functions: Visual Stories",
            text: "Plot function on coordinate plane: x-axis (horizontal), y-axis (vertical). Each point (x, y) satisfies equation. y = 2x plots as straight line through origin. y = x² plots as U-shaped parabola. Graph SHOWS relationship — how y responds to x. Picture worth thousand equations.",
            highlight: "Graph = visual function",
            emoji: "📈",
            formula: "Point (x,y) means f(x) = y"
          }
        },
        {
          type: "concept",
          content: {
            title: "Linear Functions: Constant Change",
            text: "Form: y = mx + b. m = slope (steepness), b = y-intercept (starting point). y = 2x + 3: slope 2 means 'up 2 for every 1 right'. Starts at y = 3. Linear = constant rate of change. Distance = speed × time is linear. Salary = hourly rate × hours is linear.",
            highlight: "y = mx + b (slope-intercept)",
            emoji: "📏",
            formula: "slope m = Δy/Δx (rise over run)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Quadratic Functions: Acceleration",
            text: "Form: y = ax² + bx + c. Graph is parabola — U-shape (or upside-down if a < 0). Represents acceleration: y = x² means output grows quadratically. Falling objects follow h = −4.9t² + v₀t + h₀. Area of square: A = s². Quadratics model squared relationships everywhere.",
            highlight: "y = ax² + bx + c (parabola)",
            emoji: "🎢 ⬛",
            formula: "Vertex form: y = a(x−h)² + k"
          }
        },
        {
          type: "concept",
          content: {
            title: "Exponential Functions: Explosive Growth",
            text: "Form: y = aᵇˣ. Example: y = 2ˣ. x = 0 → y = 1. x = 1 → y = 2. x = 2 → y = 4. x = 10 → y = 1024. Doubles every step. Compound interest: A = P(1+r)ᵗ. Bacterial growth. Nuclear chain reactions. Exponentials explode — slowly at first, then violently.",
            highlight: "y = aᵇˣ (exponential growth)",
            emoji: "📈💥",
            formula: "e^x where e ≈ 2.718 (natural exponential)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🕵️‍♀️ Why is e ≈ 2.718 'natural'?",
            text: "e is unique: y = eˣ has slope equal to its value at every point. Derivative of eˣ is eˣ. Rate of change equals current value. This makes it 'natural' for modeling continuous growth (population, radioactive decay, compound interest compounded infinitely). e is growth's fundamental constant."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🎎Functions compose like Russian dolls",
            text: "f(x) = 2x, g(x) = x + 3. Composition: f(g(x)) = f(x+3) = 2(x+3) = 2x + 6. Function inside function. Like programming: nested operations. g(f(x)) = g(2x) = 2x + 3— DIFFERENT result. Order matters. Composition is how complex systems emerge from simple functions."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If f(x) = 3x + 2, what is f(4)?",
            options: [
              "11",
              "14",
              "12",
              "10"
            ],
            correct: 1,
            explanation: "Substitute x = 4: f(4) = 3(4) + 2 = 12 + 2 = 14. Function notation means 'replace x with the input value and calculate'."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What shape does y = x² graph as?",
            options: [
              "Straight line",
              "Circle",
              "Parabola (U-shape)",
              "Exponential curve"
            ],
            correct: 2,
            explanation: "Quadratic functions (y = ax² + bx + c) always graph as parabolas. y = x² is simplest case: U-shaped curve with vertex at origin."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Functions = Mathematical Relationships",
            text: "Functions capture how things depend on each other: distance on time, cost on quantity, growth on rate. Every formula, every algorithm, every physical law is a function. Master functions, and you can model reality — predict outcomes, optimize systems, understand change itself.",
            keyTakeaway: "Functions are deterministic transformations. Input → process → output. Linear (constant rate), quadratic (acceleration), exponential (explosive). Reality speaks in functions."
          }
        }
      ]
    },

    {
      id: "shapes-space-symmetry",
      icon: "🔴⬜📐",
      title: "Shapes, Space & Symmetry",
      subtitle: "The geometry of everything around you",
      duration: "5 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Triangle angles ALWAYS sum to 180°",
            text: "Draw any triangle — tiny, huge, skinny, fat. Measure angles. Add them. You get 180°. Always. No exceptions. This isn't coincidence — it's geometric law. Euclid proved it 2300 years ago. Some truths are eternal, carved into space's structure itself.",
            emoji: "😐🤐😑"
          }
        },
        {
          type: "concept",
          content: {
            title: "Fundamental Shapes & Properties",
            text: "Circle: all points equidistant from center. Area = πr², circumference = 2πr. Triangle: 3 sides, angles sum to 180°. Area = ½bh. Square: 4 equal sides, 4 right angles. Area = s². Rectangle: opposite sides equal. Area = lw. Pentagon: 5 sides. Hexagon: 6 sides. Each shape has signature properties.",
            highlight: "Shape properties are invariant",
            emoji: "⚪♻⬜♻🔺*2",
            formula: "Triangle: A = ½bh, Square: A = s², Circle: A = πr²"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Pythagorean Theorem",
            text: "Right triangle (one 90° angle): a² + b² = c² where c is hypotenuse (longest side). Example: legs 3 and 4 → hypotenuse = √(9+16) = √25 = 5. This ratio (3:4:5) appears in architecture, music, art. Discovered 2500+ years ago, used daily in construction, navigation, graphics.",
            highlight: "a² + b² = c²",
            emoji: "📐",
            formula: "Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)..."
          }
        },
        {
          type: "concept",
          content: {
            title: "Coordinate Systems: Mapping Space",
            text: "2D plane: two perpendicular axes (x horizontal, y vertical). Every point has coordinates (x,y). Origin = (0,0). Distance formula between (x₁,y₁) and (x₂,y₂): d = √[(x₂−x₁)² + (y₂−y₁)²]. Pythagoras in disguise! Coordinates let us algebratize geometry — solve spatial problems with equations.",
            highlight: "Point (x,y) locates position precisely",
            emoji: "🗺📌",
            formula: "d = √[(Δx)² + (Δy)²]"
          }
        },
        {
          type: "concept",
          content: {
            title: "3D Space: Adding Depth",
            text: "Add z-axis (depth) to x,y plane. Now points are (x,y,z). 3D distance: d = √[(Δx)² + (Δy)² + (Δz)²]. Cube vertices: 8 corners. Sphere: all points distance r from center. Volume of cube: V = s³. Volume of sphere: V = (4/3)πr³. Surface area of sphere: S = 4πr². Third dimension adds volume, not just area.",
            highlight: "3D = width × height × depth",
            emoji: "📦🌍",
            formula: "Sphere: V = (4/3)πr³, S = 4πr²"
          }
        },
        {
          type: "concept",
          content: {
            title: "Symmetry: Nature's Aesthetic",
            text: "Reflection symmetry: mirror line divides shape into identical halves (butterfly, human face). Rotation symmetry: looks same after rotation (starfish, snowflake). Translation symmetry: pattern repeats (wallpaper, crystals). Symmetry isn't just beauty — it's efficiency. Snowflakes are 6-fold symmetric because water molecules bond hexagonally. Form follows physics.",
            highlight: "Symmetry = efficiency + beauty",
            emoji: "💞💫",
            formula: "n-fold symmetry = repeats every 360°/n"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🐝Bees build hexagonal honeycombs — here's why",
            text: "Hexagons tile perfectly (no gaps) using least perimeter for given area. Circles would leave gaps. Squares use more wax per area. Hexagons = maximum storage, minimum material. Bees evolved to solve calculus optimization problem without math. Nature computes optimal solutions through evolution."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤔🤔Why can't you tile floor with pentagons?",
            text: "Regular polygon tiles plane if interior angle divides 360°. Triangle: 60° (360°/60° = 6 fit). Square: 90° (4 fit). Hexagon: 120° (3 fit). Pentagon: 108° — doesn't divide 360° evenly! Gaps appear. Only 3 regular polygons tile perfectly. Geometry constrains possibility itself."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Right triangle has legs 6 and 8. What's the hypotenuse?",
            options: [
              "12",
              "14",
              "10",
              "100"
            ],
            correct: 2,
            explanation: "Use Pythagorean theorem: c² = 6² + 8² = 36 + 64 = 100, so c = √100 = 10. This is double the classic (3,4,5) triangle."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is the area of circle with radius 3?",
            options: [
              "9",
              "6π",
              "9π",
              "3π"
            ],
            correct: 2,
            explanation: "Area = πr² = π(3)² = 9π ≈ 28.27. Always square the radius first, then multiply by π."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Geometry = Space's Language",
            text: "Shapes aren't arbitrary — they emerge from space's rules. Triangles sum to 180° because flat space curves a certain way. Pythagorean theorem connects algebra and geometry. Symmetry reveals underlying constraints. Understanding geometry means reading reality's blueprints. Every building, every machine, every molecule follows geometric principles.",
            keyTakeaway: "Geometry studies spatial relationships. Shapes have invariant properties. Formulas compress spatial truths. Master geometry, and space becomes predictable."
          }
        }
      ]
    },

    {
      id: "dimensions-beyond-three",
      icon: "📦🎲",
      title: "Dimensions Beyond Three",
      subtitle: "Imagining the invisible fourth dimension",
      duration: "5 min",
      difficulty: 4,
      steps: [
        {
          type: "hook",
          content: {
            title: "A 4D being could see inside your stomach without cutting you open",
            text: "Just like you can see inside a 2D square drawn on paper (you're above it in 3D), a 4D being exists 'above' our 3D space. They'd see your insides as easily as you see a drawing's interior. Your skin isn't a barrier in the fourth dimension. Mind-bending but mathematically rigorous.",
            emoji: "👻👽"
          }
        },
        {
          type: "concept",
          content: {
            title: "Understanding Dimensions Progressively",
            text: "0D = point (no movement). 1D = line (move forward/back). 2D = plane (add left/right). 3D = space (add up/down). 4D = ??? (add... what?). Fourth dimension is perpendicular to all three existing ones. We can't visualize it, but we can CALCULATE it. Math transcends perception.",
            highlight: "Each dimension ⊥ (perpendicular) to previous",
            emoji: "📏⬜🎲",
            formula: "nD = n perpendicular axes"
          }
        },
        {
          type: "concept",
          content: {
            title: "Coordinates in 4D Space",
            text: "3D point: (x, y, z). 4D point: (x, y, z, w). Fourth coordinate w represents position along fourth axis. Distance formula extends: d = √[(Δx)² + (Δy)² + (Δz)² + (Δw)²]. Same Pythagorean pattern — just one more term. Algebra doesn't care about visualization limits.",
            highlight: "4D point = (x, y, z, w)",
            emoji: "",
            formula: "d₄ = √[(Δx)² + (Δy)² + (Δz)² + (Δw)²]"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Tesseract: 4D Cube",
            text: "Cube (3D) has 8 corners, 12 edges, 6 faces. Tesseract (4D cube) has 16 corners, 32 edges, 24 faces, 8 'cells' (3D cubes). Built by extending cube in w-direction. We can't build it physically, but we can PROJECT it into 3D — like projecting 3D cube onto 2D paper creates illusion of depth.",
            highlight: "Tesseract = 4D hypercube",
            emoji: "😕🙃∞",
            formula: "nD cube has 2ⁿ vertices"
          }
        },
        {
          type: "concept",
          content: {
            title: "Projections: Shadows of Higher Dimensions",
            text: "3D cube casts 2D shadow (square). 4D tesseract casts 3D 'shadow' (nested cubes). We see 4D objects only through 3D projections — distorted, incomplete. Like Plato's cave: prisoners see shadows on wall, not objects themselves. We're prisoners seeing 3D shadows of 4D reality.",
            highlight: "Projection loses one dimension",
            emoji: "🌍🔀⚪",
            formula: "nD object → (n−1)D shadow"
          }
        },
        {
          type: "concept",
          content: {
            title: "Spacetime: 4D We Actually Experience",
            text: "Einstein's relativity treats time as fourth dimension. Spacetime coordinates: (x, y, z, t). Events are 4D points. Your worldline through spacetime is 4D curve. We don't see time as spatial dimension, but physics treats it mathematically identical. 4D isn't science fiction — it's relativity.",
            highlight: "Spacetime = (x, y, z, t)",
            emoji: "🎲🕑",
            formula: "Spacetime interval: s² = c²t² − x² − y² − z²"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "😲If you lived in 4D, you could tie knots in your intestines without cutting",
            text: "3D beings can unknot 2D knot by lifting loop into third dimension. 4D being could unknot 3D knot (like your tied shoelaces) by lifting into fourth dimension. Surgery would be revolutionized — access any internal organ without incision. Just 'reach around' through fourth dimension."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤔🕵️‍♂️ Can reality have more than 4 dimensions?",
            text: "String theory proposes 10 or 11 dimensions. Extra dimensions could be 'curled up' so tiny we don't notice — like garden hose looks 1D from afar but is actually 2D surface. Maybe we're 3D beings living on surface of higher-dimensional space. Math allows it; observation hasn't confirmed it. Yet."
          }
        },
        {
          type: "quiz",
          content: {
            question: "How many coordinates does a 4D point have?",
            options: [
              "3 (x, y, z)",
              "4 (x, y, z, w)",
              "5 (x, y, z, w, t)",
              "Infinite"
            ],
            correct: 1,
            explanation: "4D point requires 4 coordinates: (x, y, z, w). Each coordinate represents position along one of four perpendicular axes."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is a tesseract?",
            options: [
              "A 3D cube",
              "A 4D hypercube",
              "A 5D shape",
              "A geometric illusion"
            ],
            correct: 1,
            explanation: "Tesseract is 4D analogue of cube. Just as cube has 8 corners, tesseract has 16. We can calculate its properties even though we can't visualize it directly."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Dimensions = Degrees of Freedom",
            text: "Dimension isn't mystical — it's direction of movement. 4D space is as mathematically rigorous as 3D, just unvisualizable. We navigate 4D spacetime daily (moving through space AND time). Higher dimensions might exist, curled microscopically. Mathematics lets consciousness transcend perceptual limitations. You can think beyond what you can see.",
            keyTakeaway: "Dimensions are perpendicular directions. We calculate 4D+ rigorously despite inability to visualize. Math transcends biological constraints."
          }
        }
      ]
    }
  ]
};

console.log('✅ math-lessons.js loaded:', mathLessons.lessons.length, 'lessons');