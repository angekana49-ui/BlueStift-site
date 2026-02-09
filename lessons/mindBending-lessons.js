// ==========================================
// 🧠 MIND-BENDING CONCEPTS
// ==========================================

const mindBendingLessons = {
  title: "Mind-Bending Concepts",
  lessons: [
    {
      id: "game-theory-decisions",
      icon: "♟🎲🎰",
      title: "Game Theory",
      subtitle: "Rational choices can lead to collective disasters",
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "Prisoner's Dilemma: betray or stay silent?",
            text: "Two criminals arrested, interrogated separately. Each faces choice: betray partner (defect) or stay silent (cooperate). Payoff matrix: Both silent → 1 year each. Both betray → 5 years each. One betrays, other silent → betrayer goes free (0 years), silent gets 10 years. Rational choice? Betray (dominant strategy). Result? Both betray, both get 5 years. Cooperation (both silent = 1 year each) is better, but irrational individually.",
            emoji: "😇👿"
          }
        },
        {
          type: "concept",
          content: {
            title: "Dominant Strategy & Nash Equilibrium",
            text: "Dominant strategy: best choice regardless of opponent's action. In Prisoner's Dilemma, 'betray' dominates 'silent' (betray always gives shorter sentence). Nash Equilibrium: no player can improve outcome by changing strategy alone. Both betraying = Nash Equilibrium (neither benefits from unilateral switch). Example: If A betrays, B's best = betray (5y vs 10y). If A silent, B's best still betray (0y vs 1y). Symmetrically for A. Both betray = stable.",
            highlight: "Nash Equilibrium: no player benefits from solo strategy change",
            emoji: "🤥🤥",
            formula: "Strategy s* is Nash Eq if U_i(s*) ≥ U_i(s_i', s*_{-i}) for all players i, strategies s_i'"
          }
        },
        {
          type: "concept",
          content: {
            title: "Iterated Games: Tit-for-Tat",
            text: "Repeat Prisoner's Dilemma many times → cooperation emerges. Tit-for-Tat strategy: (1) First round, cooperate. (2) Every subsequent round, copy opponent's previous move. If they betrayed, you betray next round. If they cooperated, you cooperate. Axelrod's tournament (1980): Tit-for-Tat won against complex strategies. Lesson: simple, forgiving, retaliatory strategies succeed in repeated interactions. Real-world: diplomacy, business relationships.",
            highlight: "Repeated games → cooperation becomes rational",
            emoji: "🤔🤨🤗",
            formula: "Cooperation emerges when: δ(benefit of mutual cooperation) > immediate defection gain, where δ = probability of future rounds"
          }
        },
        {
          type: "concept",
          content: {
            title: "Zero-Sum vs Non-Zero-Sum",
            text: "Zero-sum: one player's gain = other's loss. Total payoff = 0. Example: poker (money changes hands, total constant). Non-zero-sum: both can win or lose together. Prisoner's Dilemma is non-zero-sum (both cooperate → both benefit). Real economy: mostly non-zero-sum (trade creates value). Zero-sum thinking leads to conflict. Non-zero-sum thinking enables cooperation, mutual benefit.",
            highlight: "Real world mostly non-zero-sum (cooperation profitable)",
            emoji: "Σ ➡ 0️⃣",
            formula: "Zero-sum: Σ payoffs = 0. Non-zero-sum: Σ payoffs ≠ 0"
          }
        },
        {
          type: "concept",
          content: {
            title: "Tragedy of the Commons",
            text: "Shared resource + individual rationality = collective ruin. Example: Grazing commons. Each farmer benefits from adding one cow (+1 utility). Cost of overgrazing distributed across all farmers (−0.1 each if 10 farmers). Rational choice: add cow (+1 > −0.1). Every farmer does this → commons destroyed. Solution: regulation, privatization, or community management. Climate change = global commons tragedy.",
            highlight: "Individual rationality + shared resource = collective disaster",
            emoji: "🤑🤑",
            formula: "Private benefit > shared cost per individual → overexploitation"
          }
        },
        {
          type: "concept",
          content: {
            title: "Mechanism Design: Engineering Incentives",
            text: "Reverse game theory: design rules/incentives to achieve desired outcome. Example: auction design. Second-price (Vickrey) auction: highest bidder wins, pays SECOND-highest bid. Truth-telling becomes dominant strategy (bidding true value optimal). Used in ad auctions (Google AdWords). Mechanism design = 'engineering' games to align individual rationality with social optimum. Nobel Prize 2007 (Hurwicz, Maskin, Myerson).",
            highlight: "Design game rules to make desired behavior rational",
            emoji: "🙃🤪",
            formula: "Mechanism M induces outcome O if rational play under M yields O"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🧐🧐 Why do soldiers in trenches sometimes cooperate with enemy?",
            text: "WWI trench warfare: 'live and let live' system emerged. Opposing sides tacitly agreed not to shoot during meals, quiet periods. Why? Iterated Prisoner's Dilemma. Defecting (shooting) provokes retaliation. Cooperating (not shooting) reciprocated. Soldiers realized mutual non-aggression better than constant combat. Officers had to rotate troops to prevent 'fraternization'. Game theory predicts cooperation in repeated interactions."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤔 Can game theory explain nuclear deterrence?",
            text: "Mutually Assured Destruction (MAD): if one country launches nukes, other retaliates → both destroyed. Nash Equilibrium: no one launches (launching = guaranteed destruction, not launching = survival). Credible threat: opponent believes you'll retaliate. Game theory formalized Cold War strategy. Concern: irrational actors or miscalculation could break equilibrium. Nuclear game = high-stakes Prisoner's Dilemma where cooperation = survival."
          }
        },
        {
          type: "quiz",
          content: {
            question: "In Prisoner's Dilemma, what is the Nash Equilibrium outcome?",
            options: [
              "Both players cooperate",
              "Both players betray",
              "One cooperates, one betrays",
              "No equilibrium exists"
            ],
            correct: 1,
            explanation: "Both betraying is Nash Equilibrium. Neither player can improve outcome by unilaterally changing strategy. If A betrays, B's best response = betray (5y vs 10y). If B betrays, A's best = betray. (Both betray) is stable, though (both cooperate) yields better collective outcome (1y each vs 5y each)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "In iterated Prisoner's Dilemma, which strategy historically performed best?",
            options: [
              "Always betray",
              "Always cooperate",
              "Tit-for-Tat (copy opponent's previous move)",
              "Random choices"
            ],
            correct: 2,
            explanation: "Tit-for-Tat won Axelrod's tournament. Strategy: (1) First round, cooperate. (2) Thereafter, copy opponent's last move. Succeeds because: nice (cooperates first), retaliatory (punishes betrayal), forgiving (returns to cooperation). Repeated interactions make cooperation rational. Example: opponent cooperates → you cooperate → mutual benefit continues."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Game Theory = Mathematics of Strategic Interaction",
            text: "Players choose strategies to maximize payoffs. Nash Equilibrium: stable outcome where no unilateral change benefits. Prisoner's Dilemma shows individual rationality ≠ collective optimum. Repeated games enable cooperation (Tit-for-Tat). Tragedy of Commons: shared resources overexploited. Mechanism design: engineer incentives for desired outcomes. Game theory explains war, economics, evolution, cooperation.",
            keyTakeaway: "Rational individual choices can lead to collectively bad outcomes. Cooperation emerges in repeated interactions. Incentives determine behavior."
          }
        }
      ]
    },

    {
      id: "cognitive-illusions",
      icon: "😵😲",
      title: "Cognitive Illusions",
      subtitle: "Your brain is a prediction machine — optimized for survival, not truth",
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "You don't see reality — you see your brain's best guess",
            text: "Vision feels immediate, direct. Reality: light hits retina (2D image, upside-down, blind spot). Brain reconstructs 3D world from ambiguous data using predictions based on past experience. Visual system = hypothesis generator, not camera. Optical illusions exploit this: brain's assumptions fail, revealing prediction machinery. You don't see world as it is — you see world as brain thinks it is.",
            emoji: "😲😰"
          }
        },
        {
          type: "concept",
          content: {
            title: "Confirmation Bias: Seeking Support, Ignoring Disconfirmation",
            text: "Tendency to search for, interpret, favor information confirming existing beliefs. Example: Believe astrology works → remember accurate predictions, forget wrong ones. Wason selection task: test rule 'if card has vowel on one side, has even number on other'. Given cards: A, K, 4, 7. Which to flip? Correct: A (check even) and 7 (check vowel). Most flip A and 4 (seeking confirmation), not 7 (seeking disconfirmation). Science combats this via falsification (Popper): test predictions that could prove theory WRONG.",
            highlight: "Humans naturally seek confirmation, avoid disconfirmation",
            emoji: "👍👌😄",
            formula: "P(accept evidence | confirms belief) > P(accept evidence | contradicts belief)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Availability Heuristic: Vivid Events Seem Frequent",
            text: "Estimating probability by ease of recalling examples. Plane crashes: vivid, widely reported → seem common. Car crashes: frequent but mundane → underestimated. Reality: flying safer than driving (0.07 deaths per billion passenger-km vs 3.1 for cars). Media coverage distorts perceived risk. Terrorism, shark attacks feel likely because memorable. Heart disease, diabetes kill far more but lack drama. Brain uses memory accessibility as frequency proxy — often wrong.",
            highlight: "Ease of recall ≠ actual frequency",
            emoji: "🤔🤪🤕",
            formula: "Estimated P(event) ∝ ease of recalling examples (biased proxy)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Anchoring Effect: First Number Sticks",
            text: "Initial value (anchor) disproportionately influences subsequent judgment. Experiment: Spin wheel (random number 10 or 65). Then estimate % of African countries in UN. Wheel=10 → median guess 25%. Wheel=65 → median guess 45%. Random anchor affects unrelated estimate! Negotiations: first offer anchors. Retail: original price $100, sale $60 feels like deal (even if worth $40). Brain insufficiently adjusts from anchor.",
            highlight: "Initial number biases estimates, even when irrelevant",
            emoji: "¹²³⁴⁰²",
            formula: "Final estimate = Anchor + insufficient adjustment"
          }
        },
        {
          type: "concept",
          content: {
            title: "Dunning-Kruger Effect: Ignorance Breeds Confidence",
            text: "Incompetent people overestimate competence (lack skill AND lack meta-cognitive ability to recognize incompetence). Skilled people underestimate (aware of knowledge gaps). Graph: beginners overconfident, experts appropriately cautious. Example: 'I can drive!' after 2 lessons vs professional racer saying 'driving is complex'. Why? Incompetence prevents self-assessment. As skill grows, awareness of difficulty grows faster than confidence.",
            highlight: "Unskilled overestimate, skilled underestimate (relatively)",
            emoji: "🤪🤪➡😎",
            formula: "Perceived ability = f(actual skill, metacognitive awareness). Low skill → low awareness → inflated perception"
          }
        },
        {
          type: "concept",
          content: {
            title: "Inattentional Blindness: Gorilla Walking Through",
            text: "Fail to notice unexpected stimulus in plain sight when attention directed elsewhere. Famous experiment: watch video, count basketball passes. ~50% miss person in gorilla suit walking through scene. Attention = spotlight. Outside spotlight = effectively invisible, even if eyes physically register. Implications: eyewitness testimony unreliable, driving while distracted dangerous. Consciousness ≠ passive recording — active, selective construction.",
            highlight: "What's not attended often not consciously seen",
            emoji: "👨‍🦯👨‍🦯",
            formula: "Conscious perception = Sensory input × Attention. No attention → no conscious experience."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "😱The Müller-Lyer illusion persists even when you know it's wrong",
            text: "Two lines same length, different arrowheads (<—>—> vs >—<—<). One looks longer. Measuring proves equal length. Yet illusion persists! Knowing truth doesn't override perception. Why? Visual system processes before conscious awareness. Low-level modules apply heuristics (interpret arrowheads as depth cues) automatically. Cognitive penetration limited — perception somewhat modular, immune to belief."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "👨‍🔬🕵️‍♀️ Can you trust your memories?",
            text: "Memory isn't playback — it's reconstruction. Each recall modifies memory. Elizabeth Loftus: showed subjects car crash video. Later asked 'How fast when cars SMASHED?' vs 'How fast when cars HIT?'. 'Smashed' group estimated higher speed, later falsely remembered broken glass (none existed). Memories are malleable, influenced by language, suggestion, later events. Eyewitness testimony frighteningly unreliable."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Confirmation bias means you tend to do what?",
            options: [
              "Seek information that challenges your beliefs",
              "Seek information that supports your beliefs",
              "Ignore all information",
              "Remember everything equally"
            ],
            correct: 1,
            explanation: "Confirmation bias: favoring info confirming existing beliefs. Example: Believe coffee is healthy → notice studies showing benefits, dismiss studies showing risks. Combating this requires actively seeking disconfirming evidence. Science uses falsification: design experiments that could prove theory WRONG, not just right."
          }
        },
        {
          type: "quiz",
          content: {
            question: "The Dunning-Kruger effect describes what phenomenon?",
            options: [
              "Experts overestimate their skill",
              "Beginners underestimate their skill",
              "Incompetent people overestimate competence",
              "Everyone accurately assesses their ability"
            ],
            correct: 2,
            explanation: "Dunning-Kruger: unskilled people overestimate ability (lack skill AND awareness of what skill requires). Skilled people slightly underestimate (aware of complexity). Example: after 1 cooking lesson, think you're chef. After culinary school, realize how much you don't know. Meta-cognitive awareness correlates with skill."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Your Brain Optimizes for Speed, Not Accuracy",
            text: "Perception = active construction via predictions. Confirmation bias seeks support. Availability heuristic overweights vivid events. Anchoring biases estimates. Dunning-Kruger: incompetence breeds overconfidence. Inattentional blindness: unseen unless attended. Memory is reconstructive. Illusions persist despite knowledge. Brain evolved for survival, not truth. Understanding biases doesn't eliminate them — but awareness helps.",
            keyTakeaway: "Cognitive illusions reveal brain's prediction machinery. Awareness of biases essential for rational thinking. Perception ≠ reality."
          }
        }
      ]
    },

    {
      id: "consciousness-problem",
      icon: "🎭🎨",
      title: "The Consciousness Problem",
      subtitle: "Why does anything feel like something?",
      duration: "5 min",
      difficulty: 5,
      steps: [
        {
          type: "hook",
          content: {
            title: "😵🥴You are conscious. But WHY does it feel like anything to be you?",
            text: "Zombie thought experiment: imagine being physically/behaviorally identical to you, but no inner experience. Lights are off inside. Philosophical zombie reacts to pain (withdraws hand, says 'ouch'), but doesn't FEEL pain. Are zombies conceivable? If yes, consciousness isn't just brain function — something extra (hard problem). If no, consciousness necessarily arises from physical processes. Either way, explaining WHY remains deeply puzzling.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Easy Problems vs Hard Problem",
            text: "Easy problems (Chalmers): explain mechanisms. How do neurons process visual info? How does brain integrate information? How does attention work? These are hard scientifically, but 'easy' philosophically — answerable via neuroscience. Hard problem: why does processing feel like something? Why is there subjective experience (qualia)? Could explain every neural mechanism yet still wonder: why isn't processing 'dark' (zombie)? Hard problem: explaining phenomenal consciousness itself.",
            highlight: "Easy: mechanisms. Hard: why mechanisms feel like anything",
            emoji: "⚙⚙",
            formula: "Mechanism explanation ≠ phenomenology explanation (explanatory gap)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Qualia: The What-It's-Like-Ness",
            text: "Qualia (singular: quale): subjective, qualitative properties of experience. Redness of red, painfulness of pain, taste of chocolate. Mary's Room: neuroscientist Mary knows all physical facts about color vision but has lived in black-white room. Upon leaving, sees red apple. Does she learn something new? If yes, qualia aren't fully captured by physical facts (physicalism challenged). If no, knowledge = ability/acquaintance, not new facts (physicalism preserved). Debate ongoing.",
            highlight: "Qualia = subjective properties of conscious experience",
            emoji: "",
            formula: "Quale: first-person, subjective, ineffable aspect of experience"
          }
        },
        {
          type: "concept",
          content: {
            title: "Neural Correlates of Consciousness (NCC)",
            text: "NCC: minimal neural mechanisms sufficient for conscious experience. Example: visual awareness correlates with activity in V1 (primary visual cortex) + higher areas. Global Workspace Theory: consciousness = information globally available to cognitive systems. Integrated Information Theory (Tononi): consciousness = integrated information (φ, phi). Higher φ = more conscious. Predicts thermostats have tiny consciousness (controversial). NCCs identify CORRELATES, not explanations. Correlation ≠ causation ≠ constitution.",
            highlight: "NCC: brain activity correlating with consciousness",
            emoji: "",
            formula: "Φ (phi) = integrated information (IIT measure of consciousness)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Theories of Consciousness",
            text: "(1) Dualism: mind and matter distinct substances (Descartes). Problem: interaction (how does immaterial mind affect physical brain?). (2) Physicalism: consciousness is physical process. Problem: hard problem (why physical = phenomenal?). (3) Panpsychism: consciousness fundamental property of matter (even electrons have proto-experience). Problem: combination (how do micro-experiences combine to macro-consciousness?). (4) Illusionism: phenomenal consciousness illusion — only seems like something. No consensus.",
            highlight: "Competing theories, no agreement",
            emoji: "",
            formula: "Open question: Is consciousness physical, fundamental, or illusory?"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Combination Problem",
            text: "If micro-entities (atoms, quarks) have micro-experiences (panpsychism), how do they combine to form unified macro-experience (you)? Your brain: ~86 billion neurons. Do neurons have experiences? If yes, why don't you experience 86 billion separate consciousnesses? Why unified field? Combination problem: explaining how micro-subjects → macro-subject. Analogous to: how do H₂O molecules → wetness? But consciousness seems different — subjective unity.",
            highlight: "How micro-experiences → unified macro-consciousness?",
            emoji: "",
            formula: "n micro-subjects → 1 macro-subject? (Binding problem)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤖Could AI be conscious? How would we know?",
            text: "Turing Test: behavioral indistinguishability from human. But zombies pass Turing Test yet lack consciousness (by definition). Behavioral tests insufficient. Could use NCC: scan AI's 'brain' for integrated information? But IIT controversial. Fundamental problem: consciousness subjectively known but objectively inaccessible. Can't directly experience another's consciousness. Other minds problem applies to AI, animals, even other humans (we infer based on similarity, behavior)."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🧐💥Is consciousness an evolutionary accident?",
            text: "Epiphenomenalism: consciousness is byproduct of brain processes, causally inert (like steam from engine — exists but doesn't drive anything). If true, consciousness doesn't affect behavior (zombie would behave identically). Problem: then why did evolution produce it? Alternative: consciousness aids survival (attention, planning, self-monitoring). But explaining HOW physical processes → phenomenality remains hard problem. Evolution explains function, not phenomenology."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is the 'hard problem' of consciousness?",
            options: [
              "Explaining how neurons fire",
              "Explaining why processing feels like something",
              "Building conscious AI",
              "Measuring brain activity"
            ],
            correct: 1,
            explanation: "Hard problem (Chalmers): why does information processing have subjective, phenomenal character? Could explain all brain mechanisms (easy problems) yet wonder: why experience at all? Why not 'dark' processing (zombie)? Gap between physical description and phenomenology = explanatory gap. No agreed solution."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What are qualia?",
            options: [
              "Types of neurons",
              "Subjective properties of experience (redness, painfulness)",
              "Unconscious brain processes",
              "Memory formations"
            ],
            correct: 1,
            explanation: "Qualia: subjective, qualitative aspects of experience. What it's LIKE to see red, feel pain, taste coffee. First-person, private, ineffable. Contrast: neural firing pattern (third-person, public, describable). Whether qualia reducible to physical facts = hotly debated. Mary's Room thought experiment explores this."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Consciousness = Deepest Mystery",
            text: "Hard problem: why does processing feel like anything? Easy problems: mechanisms (explainable via neuroscience). Qualia: subjective properties. NCC: neural correlates (correlation ≠ explanation). Theories: dualism, physicalism, panpsychism, illusionism — no consensus. Combination problem: how micro → macro consciousness. Other minds problem: can't directly access another's experience. Consciousness = first-person phenomenon in third-person science.",
            keyTakeaway: "Explaining mechanisms doesn't explain phenomenology. Why physical processes → subjective experience remains unsolved. Consciousness = biggest mystery in science/philosophy."
          }
        }
      ]
    },

    {
      id: "paradoxes-logic",
      icon: "🤔🤯",
      title: "Paradoxes & Logic",
      subtitle: "This sentence is false. True or false?",
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "'This sentence is false.' — True or false?",
            text: "If true, then it's false (sentence says so). If false, then it's true (falsely claiming to be false). Contradiction either way. Liar Paradox: self-referential statement creating logical loop. Cannot consistently assign truth value. Not solvable by thinking harder — reveals limits of classical logic. Some statements are neither true nor false (or both). Paradoxes shattered foundations of mathematics (Russell's Paradox, 1901), forced new logic systems.",
            emoji: "😮🤯"
          }
        },
        {
          type: "concept",
          content: {
            title: "Russell's Paradox: Set of All Sets Not Containing Themselves",
            text: "Naïve set theory: any property defines a set. Consider R = {sets that don't contain themselves}. Example: set of cats doesn't contain itself (set ≠ cat), so R contains it. Question: Does R contain itself? If yes, then R shouldn't contain R (by definition). If no, then R should contain R. Contradiction. Russell's Paradox shattered naïve set theory, forced axiomatization (ZFC set theory). Showed unrestricted comprehension leads to inconsistency.",
            highlight: "Self-reference + naïve comprehension → contradiction",
            emoji: "",
            formula: "R = {x | x ∉ x}. Then R ∈ R ↔ R ∉ R (contradiction)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Gödel's Incompleteness Theorems",
            text: "1st Theorem: any consistent formal system containing arithmetic has true statements unprovable within system. 2nd Theorem: system can't prove its own consistency. Proof: constructed sentence G saying 'This sentence is unprovable'. If provable, then false (contradiction). If unprovable, then true (but unprovable). So unprovable truth exists. Shattered Hilbert's program (complete formalization of math). Some truths transcend formal proof.",
            highlight: "No consistent system proves all arithmetic truths",
            emoji: "",
            formula: "For system S: ∃ statement G such that S ⊬ G and S ⊬ ¬G (undecidable)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Sorites Paradox: Heap Problem",
            text: "1 grain of sand ≠ heap. Adding 1 grain to non-heap doesn't make heap. By induction, no number of grains = heap. But clearly 10,000 grains = heap. Where's the boundary? Sorites (Greek: heap) exposes vagueness. No precise line between heap/non-heap, bald/non-bald, tall/short. Classical logic demands bivalence (true XOR false). Vague predicates violate this. Solutions: fuzzy logic (degrees of truth), supervaluationism (multiple precisifications), epistemicism (precise but unknown boundary). No consensus.",
            highlight: "Vague predicates create paradoxes in classical logic",
            emoji: "",
            formula: "∀n [(n grains ≠ heap) → (n+1 grains ≠ heap)] leads to absurdity"
          }
        },
        {
          type: "concept",
          content: {
            title: "Zeno's Paradoxes: Motion is Impossible?",
            text: "Achilles races tortoise (head start). To catch up, Achilles must reach tortoise's starting point. By then, tortoise advanced. To reach THAT point, tortoise advanced again. Infinite steps → Achilles never catches up. Yet obviously does. Resolution: infinite series can sum to finite value. Example: 1/2 + 1/4 + 1/8 + ... = 1 (geometric series). Calculus resolved Zeno's paradoxes via limits. But metaphysical question remains: is space/time infinitely divisible?",
            highlight: "Infinite series can have finite sum (calculus)",
            emoji: "",
            formula: "Σ (1/2)ⁿ = 1 (geometric series, |r|<1)"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Barber Paradox: Who Shaves the Barber?",
            text: "Village barber shaves all men who don't shave themselves. Does barber shave himself? If yes, then shouldn't (shaves only non-self-shavers). If no, then should (shaves all non-self-shavers). Contradiction. Russell's Paradox in disguise. Resolution: no such barber exists (specification is inconsistent). Not all descriptions refer to existing objects. Self-referential definitions can be contradictory, hence describing nothing.",
            highlight: "Self-referential specifications can be inconsistent",
            emoji: "",
            formula: "B shaves x ↔ x doesn't shave x. Then B shaves B ↔ B doesn't shave B (contradiction)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can you prove this statement is unprovable?",
            text: "Statement S: 'This statement is unprovable.' If provable, then false (claims to be unprovable) → inconsistency. If unprovable, then true → consistent but incomplete (true unprovable statement exists). This is essentially Gödel's construction. Self-reference + formal systems → incompleteness. Cannot have complete consistent proof system for arithmetic. Some truths transcend proof."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Are there true mathematical statements we can never know?",
            text: "Continuum Hypothesis (CH): is there cardinality between ℵ₀ and 2^ℵ₀? Gödel proved: can't disprove CH in ZFC. Cohen proved: can't prove CH in ZFC. CH is independent of ZFC axioms — neither provable nor disprovable. So yes, statements exist whose truth unknowable from standard axioms. Truth depends on which axioms you accept (pluralism in math foundations)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Liar Paradox: 'This sentence is false.' What's the issue?",
            options: [
              "The sentence is grammatically incorrect",
              "Self-reference creates logical contradiction",
              "The sentence is meaningless",
              "It's obviously true"
            ],
            correct: 1,
            explanation: "Self-reference creates loop: if true, then false (it says so). If false, then true (falsely claiming falsity). Either assignment leads to contradiction. Classical logic can't handle it. Some resolve via paraconsistent logic (contradictions allowed), others via truth-value gaps (neither true nor false). Reveals limits of bivalence."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Gödel's 1st Incompleteness Theorem proves what?",
            options: [
              "All mathematical statements are provable",
              "Consistent systems can prove all truths",
              "Consistent arithmetic systems have unprovable truths",
              "Math is inconsistent"
            ],
            correct: 2,
            explanation: "Any consistent formal system containing arithmetic has true statements unprovable in that system. Gödel constructed sentence G: 'I am unprovable.' If provable, false (contradiction). If unprovable, true (self-verifying). So unprovable truth exists. Incompleteness = limit of formal proof, not truth itself."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Logic Has Limits",
            text: "Liar Paradox: self-reference → contradiction. Russell's Paradox: naïve set theory inconsistent. Gödel: consistent systems incomplete (unprovable truths exist). Sorites: vagueness breaks bivalence. Zeno: infinity requires calculus to resolve. Barber: self-referential specifications can be inconsistent. Paradoxes aren't puzzles to solve — they reveal boundaries of logic, language, formal systems.",
            keyTakeaway: "Not all statements are decidable. Self-reference creates loops. Formal systems can't prove all truths. Paradoxes = limits of reason."
          }
        }
      ]
    },

    {
      id: "butterfly-effect",
      icon: "🦋🌫🌪",
      title: "The Butterfly Effect",
      subtitle: "Tiny causes can have enormous effects — but not predictably",
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "Butterfly flaps wings in Brazil → tornado in Texas?",
            text: "Metaphor coined by Lorenz (1972). Real question: do small perturbations in initial conditions lead to vastly different outcomes? Answer: yes, in chaotic systems. Weather is chaotic — tiny measurement error (0.000001°C difference) grows exponentially, making long-term prediction impossible. After ~2 weeks, forecast no better than random guess. Chaos ≠ randomness. Deterministic equations, but sensitive dependence on initial conditions.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Sensitive Dependence on Initial Conditions",
            text: "Chaotic system: small difference δ₀ in initial state grows exponentially with time. After time t, difference ≈ δ₀ × eᵏᵗ where λ = Lyapunov exponent (λ>0 for chaos). Example: λ=0.1/day, δ₀=0.01°C. After 10 days: 0.01 × e¹ ≈ 0.027°C. After 100 days: 0.01 × e¹⁰ ≈ 220°C (totally different weather). Exponential growth = sensitivity. Small errors explode rapidly.",
            highlight: "Error grows exponentially: δ(t) ≈ δ₀ eᵏᵗ where λ>0",
            emoji: "",
            formula: "Lyapunov exponent λ > 0 → chaos (exponential divergence)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Lorenz Attractor: Deterministic Chaos",
            text: "Lorenz (1963) simulated weather with 3 equations (simplified atmosphere). Re-ran simulation with slightly different start (0.506 vs 0.506127). Expected similar outcomes. Got completely different trajectories. Discovered: deterministic equations can produce unpredictable behavior (chaos). Lorenz attractor: butterfly-shaped plot in phase space. Trajectories never repeat but confined to attractor. Chaos = predictable rules, unpredictable outcomes.",
            highlight: "Deterministic ≠ predictable (chaos)",
            emoji: "",
            formula: "dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz (Lorenz system, chaotic for typical parameters)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Chaos vs Randomness",
            text: "Random: no pattern, unpredictable by definition (coin flip, quantum measurement). Chaos: deterministic rules, but appears random due to sensitivity. Given exact initial conditions, chaotic system perfectly predictable. But exact = impossible (quantum uncertainty, measurement precision). So chaotic systems effectively unpredictable despite determinism. Weather: deterministic physics, but chaotic → forecasts fail beyond ~2 weeks. Dice: deterministic (Newtonian physics), but sensitive to tiny variations → appears random.",
            highlight: "Chaos = deterministic but unpredictable. Random = no determinism",
            emoji: "",
            formula: "Chaos: deterministic equations + sensitive IC. Random: no equation."
          }
        },
        {
          type: "concept",
          content: {
            title: "Examples of Chaotic Systems",
            text: "(1) Weather: ~10-day predictability limit. (2) Solar system: planet orbits chaotic over millions of years (Laskar). Earth's orbit stable ~4 billion years, but precise position unpredictable beyond ~100 million years. (3) Turbulent fluids: smoke plume, blood flow. (4) Population dynamics: logistic map xₙ₊₁ = rxₙ(1-xₙ) chaotic for r>~3.57. (5) Double pendulum: wildly unpredictable motion. (6) Heart rhythms: healthy hearts show chaotic variability (too regular = pathological).",
            highlight: "Chaos ubiquitous: weather, orbits, fluids, populations, heart",
            emoji: "",
            formula: "Logistic map: xₙ₊₁ = rxₙ(1-xₙ) exhibits period-doubling route to chaos"
          }
        },
        {
          type: "concept",
          content: {
            title: "Limits of Prediction",
            text: "Laplace's demon (1814): given positions/velocities of all particles + laws of physics → predict future with certainty. Chaos shattered this. Even if you know laws exactly, tiny uncertainty in initial conditions → exponentially growing error → prediction impossible beyond timescale 1/λ (Lyapunov timescale). Weather: λ ~ 0.1/day → ~10 days. Solar system: ~5 million years. Quantum mechanics adds another layer: fundamental randomness (not just measurement error).",
            highlight: "Chaos + quantum uncertainty → strict prediction limits",
            emoji: "",
            formula: "Prediction horizon ≈ (1/λ) × ln(tolerance/error₀)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Does butterfly actually cause tornado?",
            text: "No — metaphor, not literal causation. Weather is nonlinear: many small perturbations accumulate. Single butterfly? Negligible. But illustrates sensitivity: tiny changes propagate. Better phrasing: 'predictability limited by sensitivity to small perturbations'. Tornado has complex causes (temperature gradients, humidity, wind shear). Butterfly flap? Part of chaotic background that makes specific prediction impossible, not direct cause."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can we ever predict chaotic systems?",
            text: "Ensemble forecasting: run many simulations with slightly varied initial conditions. Spread of outcomes estimates uncertainty. If all predict rain → confident. If half predict rain, half sun → uncertain. Can't predict specific trajectory, but can estimate probabilities, identify attractors. Weather: 3-day forecast ~90% accurate, 10-day ~50%. Chaos limits precision, not all knowledge."
          }
        },
        {
          type: "quiz",
          content: {
            question: "In chaotic system, how does small error in initial condition grow?",
            options: [
              "Linearly over time",
              "Stays constant",
              "Exponentially over time",
              "Decreases over time"
            ],
            correct: 2,
            explanation: "Error grows exponentially: δ(t) ≈ δ₀ eᵏᵗ where λ = Lyapunov exponent (λ>0 for chaos). Example: λ=0.1, δ₀=0.01. After 10 units: 0.027. After 20: 0.74. After 30: 2.0. After 100: 22,000! Exponential growth = hallmark of chaos. Small uncertainty explodes."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What distinguishes chaos from randomness?",
            options: [
              "Chaos is unpredictable, randomness is predictable",
              "Chaos follows deterministic rules, randomness doesn't",
              "They're the same thing",
              "Chaos occurs in nature, randomness only in theory"
            ],
            correct: 1,
            explanation: "Chaos: deterministic equations (Lorenz system, pendulum) but sensitive to initial conditions → appears random. Randomness: no underlying deterministic rule (quantum measurement, true randomness). Chaos is 'deterministic unpredictability'. Given exact IC, chaos predictable; but exact IC impossible → effectively unpredictable."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Chaos = Deterministic Unpredictability",
            text: "Butterfly effect: sensitivity to initial conditions. Small errors grow exponentially (δ ∝ eᵏᵗ). Chaotic systems: deterministic rules but unpredictable outcomes. Lorenz attractor: simple equations → complex behavior. Chaos ≠ randomness (deterministic vs non-deterministic). Ubiquitous: weather, orbits, fluids, populations. Prediction limits: ~10 days (weather), ~5 million years (solar system). Laplace's demon impossible — chaos + quantum = fundamental unpredictability.",
            keyTakeaway: "Knowing laws of physics doesn't guarantee predictability. Chaos imposes limits even with perfect knowledge of rules."
          }
        }
      ]
    },

    {
      id: "time-perception",
      icon: "⏳🕔",
      title: "Time Perception",
      subtitle: "Time speeds up as you age — literally in your brain",
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "Why does time accelerate with age?",
            text: "At 10 years old, 1 year = 10% of your life (enormous). At 50, 1 year = 2% of life (tiny). Proportional theory: experienced duration = time / total lifetime. So psychological year shrinks proportionally with age. Also, novelty declines. Childhood: everything new → rich memories → feels long. Adulthood: routine → sparse memories → feels short. Brain encodes change, not duration. Less change = subjectively faster time.",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "Prospective vs Retrospective Duration",
            text: "Prospective: duration while experiencing (waiting in line feels long). Retrospective: duration when remembering (vacation flew by, but remembering feels long if eventful). Paradox: boring event feels long while happening, short when recalling (few memories). Exciting event feels short while happening, long when recalling (many memories). Brain judges duration by information density. Sparse encoding = short retrospective duration.",
            highlight: "Prospective ≠ retrospective (attention vs memory)",
            emoji: "",
            formula: "Retrospective duration ∝ memory density (events encoded)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Attention Shrinks Time",
            text: "Focused attention makes time pass quickly. Boredom (attention wanders) makes time drag. Example: flow state (deep focus) — hours feel like minutes. Explanation: attention directed to task → not monitoring time. Clock-checking makes time slower (attention on duration). Watched pot never boils = attention paradox. Internal clock model: pacemaker emits pulses, attention gates them to accumulator. More attention to time → more pulses counted → longer perceived duration.",
            highlight: "Attention to time → slower. Attention to task → faster",
            emoji: "",
            formula: "Perceived duration ∝ attention to temporal passage"
          }
        },
        {
          type: "concept",
          content: {
            title: "Emotion Warps Time",
            text: "Fear dilates time. Car crash survivors report slow-motion experience. Explanation: amygdala activation enhances memory encoding → retrospectively feels longer (not actually slowed during event — tested via perceptual tasks during fear, no dilation). Anger also dilates. Happiness compresses (positive emotions → time flies). Depression dilates (negative emotions → time drags). Emotional arousal affects memory consolidation, retrospective duration judgment.",
            highlight: "Fear/anger → time slows. Happiness → time speeds",
            emoji: "",
            formula: "Arousal ↑ → memory density ↑ → retrospective duration ↑"
          }
        },
        {
          type: "concept",
          content: {
            title: "Novelty Expands Time",
            text: "New experiences feel longer. Vacation in unfamiliar place → many distinct memories → retrospectively feels long. Daily commute (routine) → few memories → time vanishes. Holiday paradox: week flies by while experiencing (engaging), feels long when recalling (eventful). Strategy to slow time: seek novelty, break routines, create memories. Familiarity compresses time, novelty expands it.",
            highlight: "Novelty → rich encoding → longer retrospective time",
            emoji: "",
            formula: "Subjective duration ∝ distinctiveness of memories"
          }
        },
        {
          type: "concept",
          content: {
            title: "Present Duration vs Remembered Duration",
            text: "Present: duration influenced by attention, arousal, task difficulty. Remembered: duration influenced by memory richness. Peak-end rule (Kahneman): remembered duration determined by peak intensity + end, not actual duration. Example: colonoscopy. 60 sec painful vs 90 sec (60 sec painful + 30 sec less painful). Patients prefer 90 sec (longer actual, shorter remembered). Brain ignores duration, focuses on peak + end. Duration neglect.",
            highlight: "Peak-end rule: remembered duration ≠ actual duration",
            emoji: "",
            formula: "Remembered utility ≈ (peak experience + end experience) / 2"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can you slow down time?",
            text: "Prospectively: no (physics is fixed). But subjectively: yes. (1) Novelty: new experiences create rich memories. (2) Mindfulness: attention to present moment makes prospective time feel fuller. (3) Break routines: distinctiveness → richer encoding. Childhood feels long because constant learning/novelty. Adulthood: routine → time compresses. Solution: inject novelty — travel, learn skills, meet people. Enrich memory = expand subjective life."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Do other animals perceive time differently?",
            text: "Probably yes. Fly has ~250 Hz visual flicker fusion frequency (humans: ~60 Hz). Fly sees world in slow-motion relative to us — our hand-swat is telegraphed. Metabolic rate correlates with time perception: smaller animals (faster metabolism) perceive faster. Mouse perceives human as slow giant. Elephant might perceive faster subjective time than us. Heartbeat hypothesis: subjective time scales with heart rate. All mammals experience ~same number of heartbeats per lifetime (~1 billion)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Why does time seem to speed up with age?",
            options: [
              "Brain slows down",
              "Less novelty and proportionally smaller life fraction",
              "Memory worsens",
              "Physics changes"
            ],
            correct: 1,
            explanation: "Two factors: (1) Proportional: at 50, 1 year = 2% of life (tiny). At 5, 1 year = 20% (huge). (2) Novelty: childhood = constant new experiences → rich memories → feels long. Adulthood = routine → sparse memories → feels short. Brain encodes change/novelty, not duration. Solution: seek novelty to expand subjective time."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Boring lecture feels long while attending, but short when recalling. Why?",
            options: [
              "Memory is broken",
              "Prospective (attention wanders) vs retrospective (few memories)",
              "Clock is wrong",
              "Emotions confuse brain"
            ],
            correct: 1,
            explanation: "Prospectively: bored → attention to time passage → feels long. Retrospectively: boring → few memories encoded → feels short. Exciting event: opposite. Prospective vs retrospective duration dissociate. Memory density determines retrospective duration. Attention determines prospective duration."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Time = Brain Construction",
            text: "Physical time (physics) constant. Psychological time (perception) variable. Speeds up with age (proportional theory + novelty decline). Prospective (attention) vs retrospective (memory) durations differ. Emotion warps: fear dilates, happiness compresses. Novelty expands retrospective time. Peak-end rule: remembered duration ≠ actual. To slow subjective time: seek novelty, break routines, live mindfully. Time perception = active construction, not passive recording.",
            keyTakeaway: "Subjective time depends on attention, memory, emotion, novelty. Aging accelerates time via proportion + routine. Novelty is antidote."
          }
        }
      ]
    },

    {
      id: "simulation-hypothesis",
      icon: "🖥🌌",
      title: "The Simulation Hypothesis",
      subtitle: "Are we in a computer simulation? Here's the argument",
      duration: "5 min",
      difficulty: 4,
      steps: [
        {
          type: "hook",
          content: {
            title: "Statistically, you're probably in a simulation",
            text: "Bostrom's trilemma (2003): exactly one is true. (1) Civilizations go extinct before reaching simulation capability. (2) Advanced civilizations choose not to run ancestor simulations. (3) We are almost certainly in a simulation. Reasoning: if (1) and (2) false, then many simulations exist. Simulated beings vastly outnumber base-reality beings. So probability you're simulated ≈ 1. Counterintuitive but logically rigorous (if premises accepted).",
            emoji: ""
          }
        },
        {
          type: "concept",
          content: {
            title: "The Computational Argument",
            text: "Assume: (A) Consciousness substrate-independent (implementable on silicon). (B) Future civilization has massive computation. (C) They run ancestor simulations (history of civilization). Each base-reality civilization could run millions of simulations. If N civilizations, M simulations each → N×M simulated worlds vs N base worlds. Ratio: M simulated per 1 base. If M >> 1, most conscious beings are simulated. You're random sample → likely simulated. P(simulated) = M/(M+1) ≈ 1 as M→∞.",
            highlight: "Simulated beings outnumber base-reality beings (if simulations run)",
            emoji: "",
            formula: "P(simulated) = (# simulations) / (# simulations + 1) → 1 as simulations → ∞"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Trilemma: Only One Option True",
            text: "(1) Almost all civilizations go extinct before posthuman stage (technological maturity to run simulations). Why? Self-destruction, resource depletion, existential risks. (2) Posthuman civilizations exist but choose not to simulate (ethical reasons, lack of interest, resource allocation). (3) If (1) and (2) false, simulations common → we're likely in one. Logically exhaustive. Can't escape trilemma — one must be true. Bostrom: agnostic which, but implications profound regardless.",
            highlight: "Trilemma: extinction OR no interest OR we're simulated",
            emoji: "",
            formula: "¬(1) ∧ ¬(2) → (3). One of {1, 2, 3} must be true."
          }
        },
        {
          type: "concept",
          content: {
            title: "Potential 'Glitches' in Reality",
            text: "If simulated, expect artifacts: (1) Computational limits → resolution bounds (Planck scale?). (2) Optimization → only render observed regions (quantum measurement collapse?). (3) Discrete spacetime (loop quantum gravity hints?). (4) Fine-tuning of constants (simulation parameters?). (5) Occasional glitches (déjà vu, Mandela effect?). But equally explainable by physics. No definitive test yet. Simulation hypothesis unfalsifiable? Some propose experiments (search for computational artifacts in cosmic rays, lattice structure in spacetime).",
            highlight: "Quantum mechanics, Planck scale = simulation artifacts?",
            emoji: "",
            formula: "If simulated: discrete spacetime, observation-dependent rendering, parameter fine-tuning?"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Nested Simulations Problem",
            text: "If we're simulated, simulators might also be simulated (meta-simulation). Turtles all the way down? Each level requires less fidelity (coarse-graining). But infinite regress requires infinite resources. Resolution: base reality exists somewhere (Level 0). Or: loop (simulation simulating itself — strange loop). Or: no base reality (rejected — computation requires substrate). Most likely: finite nesting depth, terminating in base reality. You could be Level-5 simulated, unaware of Levels 0-4 above.",
            highlight: "Nested simulations possible, but finite depth likely",
            emoji: "",
            formula: "Level-n simulation requires fewer resources than Level-(n-1) (coarse-graining)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Implications If True",
            text: "(1) Ontology: physical laws are software, not fundamental. (2) Metaphysics: simulators = 'gods' (created universe, set parameters). (3) Ethics: simulators morally responsible? Are we? (4) Eschatology: will simulation end? (5) Theology: reconciles creation with naturalism. (6) Epistemology: can we know base reality truths? (7) Practical: almost none (physics unchanged within simulation). Living in Matrix ≈ living in 'base reality' if physics consistent. Does it matter?",
            highlight: "Profound metaphysical implications, but practical life unchanged",
            emoji: "",
            formula: "If physics laws consistent, simulated life indistinguishable from base life"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Could we create simulations ourselves?",
            text: "Already doing it (video games, VR). Question: conscious simulations? Requires: (1) Consciousness computable (computational theory of mind). (2) Sufficient complexity (how much?). (3) Right architecture (neural networks?). If we reach technological singularity, create conscious AIs in simulated worlds → we're simulation-ancestors. Recursive: if we simulate, likely we're simulated (otherwise why would civilization at base-level simulate?). Self-reference loop."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can we test the hypothesis?",
            text: "Hard. Proposals: (1) Search for computational substrate limits in physics (Planck-scale discreteness). (2) Resource optimization artifacts (unused regions = lower fidelity). (3) Statistical anomalies in 'random' distributions (cosmic rays, quantum outcomes). (4) Try to communicate with simulators (prayer? hacking reality?). Problem: any observation could be 'part of simulation'. Unfalsifiable ≈ unscientific (Popper). But still philosophically interesting thought experiment."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What is Bostrom's Simulation Argument?",
            options: [
              "We are definitely in a simulation",
              "One of three propositions must be true (extinction, no interest, or we're simulated)",
              "Simulations are impossible",
              "Base reality doesn't exist"
            ],
            correct: 1,
            explanation: "Bostrom's trilemma: (1) Civilizations go extinct before simulation-capability, OR (2) Advanced civilizations don't run simulations, OR (3) We're almost certainly simulated. One MUST be true (logically exhaustive). Bostrom doesn't claim (3) definitely true — argues one of three is true, and if (1)+(2) false, then (3) follows. Not proof we're simulated, but strong probabilistic argument IF civilizations run simulations."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If 1000 civilizations each run 1 million simulations, what's probability you're in base reality?",
            options: [
              "50%",
              "~0.0001% (1 in 1 million)",
              "1%",
              "Depends on your experience"
            ],
            correct: 1,
            explanation: "Total beings: 1000 (base) + 1000×1,000,000 (simulated) = 1000 + 1 billion = ~1 billion. P(base) = 1000 / 1,000,001,000 ≈ 0.0001%. P(simulated) ≈ 99.9999%. Random sampling: you're likely simulated. This is core of Bostrom's argument — if simulations common, simulated beings vastly outnumber base beings."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Simulation Hypothesis = Modern Philosophical Puzzle",
            text: "Bostrom's trilemma: extinction OR no simulations OR we're simulated. If post-human civilizations run ancestor simulations, most conscious beings are simulated → you're likely simulated (statistical argument). Potential artifacts: quantum mechanics, fine-tuning, glitches? Nested simulations possible. Profound metaphysical implications, but practical life unchanged. Currently unfalsifiable. Whether simulation or base reality: experience is real to experiencer. Cartesian doubt updated for 21st century.",
            keyTakeaway: "If advanced civilizations run simulations, probability we're base reality approaches zero. Trilemma forces uncomfortable conclusions."
          }
        }
      ]
    }
  ]
};

console.log('✅ mindBending-lessons.js loaded:', mindBendingLessons.lessons.length, 'lessons');