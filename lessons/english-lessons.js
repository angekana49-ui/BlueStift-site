// ==========================================
// 🗣️ ENGLISH LANGUAGE
// ==========================================

// 🔒 Helper function to protect English content from Google Translate
function en(text) {
  return `<span class="notranslate">${text}</span>`;
}

const englishLessons = {
  title: "English Language",
  lessons: [
    {
      id: "everyday-english",
      icon: "🗨",
      title: "Everyday English",
      subtitle: "The 1000 words that cover 85% of daily conversations",
      duration: "4 min",
      difficulty: 1,
      steps: [
        {
          type: "hook",
          content: {
            title: "1000 words = 85% of English conversations",
            text: `English has ~170,000 words. Native speakers use ~20,000-35,000. But daily conversation? Just ~1,000 words cover 85% of what people actually say. ${en("'Go', 'get', 'make', 'have', 'do'")} → appear in millions of phrases. Strategy: learn common words deeply (all meanings, collocations), not rare words superficially.`,
            emoji: "💬"
          }
        },
        {
          type: "concept",
          content: {
            title: "High-Frequency Verbs: The Workhorses",
            text: `Top 10 verbs: ${en("'be', 'have', 'do', 'say', 'get', 'make', 'go', 'know', 'take', 'see'")}. These appear constantly with multiple meanings. Example: ${en("'get'")} has 20+ meanings → ${en("\"get hungry\", \"get home\", \"get it\" (understand), \"get angry\", \"get married\"")}. Learn verb + common collocations. ${en("\"Make a mistake\", \"do homework\", \"take a break\", \"have a look\"")}`,
            highlight: "Master 10 verbs → unlock thousands of phrases",
            emoji: "🔑",
            formula: "High-frequency verb + noun/adjective = core expression patterns"
          }
        },
        {
          type: "concept",
          content: {
            title: "Functional Words: The Glue",
            text: `Articles: ${en("'a', 'an', 'the'")}. Prepositions: ${en("'in', 'on', 'at', 'to', 'for', 'with'")}. Pronouns: ${en("'I', 'you', 'he', 'she', 'it', 'we', 'they'")}. Conjunctions: ${en("'and', 'but', 'or', 'because', 'so'")}. These carry little meaning alone but structure sentences. Example: ${en("\"I'm going to the store\"")} → ${en("'to'")} + ${en("'the'")}  connect ideas. Mistakes in function words signal non-native. Native speakers use automatically.`,
            highlight: "Function words = sentence architecture",
            emoji: "🗝️",
            formula: "Content words (meaning) + function words (structure) = fluent English"
          }
        },
        {
          type: "concept",
          content: {
            title: "Common Phrases: Chunks, Not Words",
            text: `Native speakers think in chunks (multi-word units), not individual words. Examples: ${en("\"How are you?\", \"I don't know\", \"What do you mean?\", \"It depends\", \"Never mind\", \"Let me see\", \"By the way\"")}. Learn these as single units → faster recall, more natural speech. Formulaic sequences = ~30-40% of native speech. Chunk learning >> word-by-word translation.`,
            highlight: "Phrases = stored as single units in memory",
            emoji: "🧩",
            formula: "Fluency = large repertoire of memorized chunks"
          }
        },
        {
          type: "concept",
          content: {
            title: "Polite Formulas: Social Lubrication",
            text: `Politeness markers signal respect, reduce face-threat. ${en("\"Could you...?\", \"Would you mind...?\", \"I was wondering if...\", \"May I...?\"")}. Compare directness levels: ${en("\"Give me water\"")} (rude) → ${en("\"Can I have water?\"")} (neutral) → ${en("\"Could I possibly have some water, please?\"")} (very polite). Context determines level. Formal situations, requests, strangers → higher politeness. Friends, commands → lower acceptable.`,
            highlight: `Politeness = modal verbs + question form + ${en("'please'")}`,
            emoji: "🤝",
            formula: "Directness inversely proportional to politeness (generally)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Contractions: Spoken English Reality",
            text: `Writing: ${en("\"I am going to the store. I do not know.\"")}  Speaking: ${en("\"I'm gonna the store. I dunno.\"")} Native speech heavily contracted: ${en("'I'm', 'you're', 'it's', 'don't', 'can't', 'won't', 'gonna', 'wanna', 'gotta'")}. Formal writing avoids contractions. Casual speech uses them constantly. Not using contractions → sounds robotic, overly formal. Example: ${en("\"I will not go\"")} vs ${en("\"I won't go\"")} (latter = natural).`,
            highlight: "Contractions = natural spoken English",
            emoji: "🎤",
            formula: "Spoken frequency: contractions ~70%, full forms ~30%"
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Why ${en("\"How are you?\"")} doesn't really ask how you are 🤔`,
            text: `${en("\"How are you?\"")} = phatic expression (social ritual, not information request). Expected response: ${en("\"Fine, thanks\"")} or ${en("\"Good, how are you?\"")} — not honest emotional state. Answering truthfully (${en("\"Actually, I'm exhausted and stressed\"")}) violates social script. Cultural function: acknowledge presence, show politeness, maintain relationship. Similar expressions: ${en("\"What's up?\"")} (don't describe what's literally up), ${en("\"How's it going?\"")} (rhetorical). Pragmatics > semantics.`
          }
        },
        {
          type: "curiosity",
          content: {
            title: `The most versatile word in English: ${en("\"get\"")} 🎯`,
            text: `${en("\"Get\"")} has 50+ meanings across contexts. Obtain: ${en("\"get a job\"")}. Become: ${en("\"get tired\"")}. Arrive: ${en("\"get home\"")}. Understand: ${en("\"I get it\"")}. Receive: ${en("\"get a gift\"")}. Cause: ${en("\"get things done\"")}. Prepare: ${en("\"get ready\"")}. Phrasal verbs: ${en("'get up', 'get on', 'get over', 'get along', 'get by', 'get through'")}. Mastering ${en("\"get\"")} = mastering 5% of English by itself. Native speakers use ${en("\"get\"")} ~200 times per day (average).`
          }
        },
        {
          type: "quiz",
          content: {
            question: "Which sentence is most polite? 🙏",
            options: [
              en("\"Give me the salt\""),
              en("\"Can I have the salt?\""),
              en("\"Could you possibly pass the salt, please?\""),
              en("\"Salt me\"")
            ],
            correct: 2,
            explanation: `${en("\"Could you possibly pass the salt, please?\"")} uses multiple politeness markers: modal ${en("'could'")}, ${en("'possibly'")} (hedging), ${en("'please'")}. Most polite = most indirect. ${en("\"Can I have...?\"")} is neutral politeness. ${en("\"Give me...\"")} is direct (rude unless very informal context). Politeness cushions requests, reduces imposition.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `What does ${en("\"I'm gonna go\"")} mean? 🚶`,
            options: [
              en("\"I am going to go\" (contracted)"),
              en("\"I'm gone already\""),
              en("\"I want to go\""),
              en("\"I'm a gonna (person named Gonna)\"")
            ],
            correct: 0,
            explanation: `${en("\"Gonna\"")} = casual pronunciation of ${en("\"going to\"")}. ${en("\"I'm gonna go\"")} = ${en("\"I am going to go\"")}. Common contractions: ${en("'gonna'")} (going to), ${en("'wanna'")} (want to), ${en("'gotta'")} (got to/have to). Natural in speech, avoided in formal writing. Native speakers use automatically. Not using them = sounds overly formal, non-native.`
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Master the Frequent, Not the Obscure 🎯",
            text: `1,000 high-frequency words = 85% of daily English. Focus on: versatile verbs (${en("'get', 'make', 'do'")}), function words (prepositions, articles), common chunks (${en("\"How are you?\", \"I don't know\"")}). Learn politeness formulas for social smoothness. Use contractions in speech for naturalness. Think in phrases, not individual words. Frequency-based learning >> alphabetical vocabulary lists.`,
            keyTakeaway: "✨ Daily English = small set of words used repeatedly in many ways. Master core vocabulary deeply → communicate effectively fast."
          }
        }
      ]
    },

    {
      id: "grammar-intuition",
      icon: "≈✅",
      title: "Grammar as Intuition",
      subtitle: "Native speakers don't know rules — they feel correctness",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: `${en("\"The big red car\"")} sounds right. ${en("\"The red big car\"")} sounds wrong. Why? 🤔`,
            text: `Native speakers instantly feel second sentence is wrong but can't explain why. Rule: opinion adjectives (${en("big, beautiful")}) precede fact adjectives (${en("red, wooden")}). Order: Opinion-Size-Age-Shape-Color-Origin-Material-Purpose + NOUN. ${en("\"Beautiful small old round red French wooden dining table.\"")} Natives never learned this — acquired through exposure. Grammar = unconscious pattern recognition, not conscious rule application.`,
            emoji: "🎨"
          }
        },
        {
          type: "concept",
          content: {
            title: "Acquisition vs Learning (Krashen's Hypothesis)",
            text: `Acquisition: subconscious internalization through meaningful exposure (how children learn). Results in intuitive knowledge — can't explain rules but use correctly. Learning: conscious study of rules (classroom grammar). Results in explicit knowledge — can explain but slower application. Native fluency comes from acquisition, not learning. Adults need both: learning provides shortcuts, acquisition builds intuition. Input (reading, listening) → acquisition. Study → learning.`,
            highlight: "Acquisition (subconscious) > Learning (conscious) for fluency",
            emoji: "🧠",
            formula: "Fluency = acquired intuition + learned rules (for error correction)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Sentence Structure: SVO Pattern",
            text: `English basic order: Subject-Verb-Object. ${en("\"I (S) eat (V) apples (O).\"")} Questions: invert with auxiliary. ${en("\"Do you eat apples?\"")} Negation: auxiliary + ${en("'not'")}. ${en("\"I don't eat apples.\"")} Passive: Object becomes subject. ${en("\"Apples are eaten (by me).\"")} 90% of sentences follow SVO. Deviations = emphasis or special constructions. Understanding SVO → generate infinite grammatical sentences. Pattern is mental template.`,
            highlight: "SVO = English default sentence architecture",
            emoji: "🏛️",
            formula: `${en("S + V + O")} → declarative. ${en("Aux + S + V + O")} → question. ${en("S + Aux + not + V + O")} → negative`
          }
        },
        {
          type: "concept",
          content: {
            title: "Tense vs Aspect: Time Complexity",
            text: `Tense = when (past, present, future). Aspect = how action unfolds (simple, progressive, perfect). Matrix: Present Simple (${en("\"I eat\"")}), Present Progressive (${en("\"I'm eating\"")}), Present Perfect (${en("\"I've eaten\"")}), Past Simple (${en("\"I ate\"")}), Past Progressive (${en("\"I was eating\"")}), etc. Native speakers feel differences: ${en("\"I eat apples\"")} (habit) vs ${en("\"I'm eating an apple\"")} (now) vs ${en("\"I've eaten apples\"")} (experience). Aspect adds nuance beyond time.`,
            highlight: "Aspect = action internal structure (completion, duration, repetition)",
            emoji: "⏱️",
            formula: "Tense (when) × Aspect (how) = 12+ verb forms in English"
          }
        },
        {
          type: "concept",
          content: {
            title: "Articles: The Definiteness System",
            text: `${en("'A/an'")} = indefinite (introducing new, non-specific). ${en("'The'")} = definite (known, specific). Zero article = generic or mass nouns. Examples: ${en("\"I saw a dog\"")} (first mention), ${en("\"The dog was big\"")} (same dog, now known). ${en("\"Dogs are animals\"")} (generic, no article). ${en("\"I like music\"")} (mass noun). Articles signal information status: new vs old, specific vs generic. Native intuition: if listener can identify referent → ${en("'the'")}. If not → ${en("'a'")}.`,
            highlight: "Articles encode definiteness and information structure",
            emoji: "📍",
            formula: `New/non-specific → ${en("'a'")}. Known/specific → ${en("'the'")}. Generic/mass → Ø (no article)`
          }
        },
        {
          type: "concept",
          content: {
            title: "Prepositions: Spatial to Abstract Metaphor",
            text: `Prepositions start spatial: ${en("'in'")} (contained), ${en("'on'")} (surface contact), ${en("'at'")} (point). Then extend metaphorically. Time: ${en("\"in summer\", \"on Monday\", \"at 3pm\"")}. Abstract: ${en("\"in trouble\", \"on purpose\", \"at peace\"")}. Rules incomplete — many are idiomatic. ${en("\"Interested in\", \"good at\", \"afraid of\"")} → must memorize collocation. Preposition choice often arbitrary historically. Native speakers memorize chunks, not rules.`,
            highlight: "Prepositions = spatial logic + metaphor + idiom",
            emoji: "🗺️",
            formula: "Spatial meaning → metaphorical extension (image schemas in cognitive linguistics)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Why ${en("\"I have been being\"")} is grammatically correct but sounds weird 🤯`,
            text: `${en("\"I have been being annoying\"")} = Present Perfect Progressive of ${en("'be'")}. Technically grammatical (${en("have + been + being + adjective")}), but rarely used because ${en("'be'")} describes states, not actions. Progressive aspect implies ongoing action, contradicts stative nature of ${en("'be'")}. Native speakers avoid because feels unnatural, even if rule-compliant. Grammar = rules PLUS usage preferences. Grammatical ≠ natural.`
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Children never say ${en("\"I goed\"")} or ${en("\"I eated\"")} at random 🧒`,
            text: `Kids overgeneralize regular past tense: ${en("'go'")} → ${en("'goed'")} (not ${en("'went'")}), ${en("'eat'")} → ${en("'eated'")} (not ${en("'ate'")}). This proves they're not just imitating — they extracted the rule (add ${en("-ed")} for past) and applied creatively. Errors show active grammar construction, not passive memorization. Eventually, frequency of irregular forms overrides overgeneralization. Evidence for innate language acquisition device (Chomsky) or statistical learning mechanism.`
          }
        },
        {
          type: "quiz",
          content: {
            question: "Which adjective order sounds natural? 🎨",
            options: [
              en("\"The wooden beautiful old table\""),
              en("\"The old beautiful wooden table\""),
              en("\"The beautiful old wooden table\""),
              en("\"The table old beautiful wooden\"")
            ],
            correct: 2,
            explanation: `${en("\"The beautiful old wooden table\"")} follows Opinion-Age-Material order. Rule: opinion adjectives (${en("beautiful, ugly")}) precede fact adjectives (${en("old, wooden")}). Native speakers feel this intuitively without knowing rule. Order violations sound immediately wrong to native ears. Universal across languages with adjectives.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `What's the difference: ${en("\"I eat apples\"")} vs ${en("\"I'm eating an apple\"")}? 🍎`,
            options: [
              "No difference, both mean the same",
              "First is habit/general, second is happening now",
              "First is past, second is future",
              "First is formal, second is casual"
            ],
            correct: 1,
            explanation: `${en("\"I eat apples\"")} = Simple present (habitual, general truth). ${en("\"I'm eating an apple\"")} = Present progressive (action happening right now). Aspect distinction: simple (states, habits) vs progressive (ongoing actions). Also note article: ${en("'apples'")} (plural, general) vs ${en("'an apple'")} (singular, specific). Grammar encodes nuanced meaning differences.`
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Grammar = Internalized Patterns, Not Memorized Rules 🧠",
            text: `Native speakers have intuition (subconscious grammar knowledge) from acquisition through exposure. Explicit rules help learners but aren't how natives operate. Master SVO structure, tense-aspect system, article definiteness, preposition collocations. Children's overgeneralization errors prove active grammar construction. Grammaticality ≠ naturalness. Exposure + pattern recognition → fluency. Study rules as shortcuts, but prioritize input for acquisition.`,
            keyTakeaway: "✨ Grammar intuition comes from massive exposure, not rule memorization. Acquire patterns through reading/listening, use rules to error-correct."
          }
        }
      ]
    },

    {
      id: "phonetics-accent",
      icon: "🎙📊",
      title: "Phonetics & Accent",
      subtitle: "English has 44 sounds but only 26 letters — chaos ensues",
      duration: "5 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: `${en("\"Read\"")} rhymes with ${en("\"lead\"")} AND with ${en("\"lead\"")} (different words) 🤯`,
            text: `English spelling-pronunciation relationship = chaotic. ${en("'Read'")} (present) rhymes with ${en("'lead'")} (metal). ${en("'Read'")} (past) rhymes with ${en("'lead'")} (verb). Same spelling, different sounds. Or: ${en("'ough'")} = 8+ pronunciations: ${en("through /uː/, though /oʊ/, tough /ʌf/, cough /ɔf/, bough /aʊ/")}. Why? Historical vowel shifts, borrowed words, spelling standardized before pronunciation. IPA (International Phonetic Alphabet) solves this: one symbol = one sound.`,
            emoji: "📤"
          }
        },
        {
          type: "concept",
          content: {
            title: "IPA: One Symbol, One Sound",
            text: `English has ~44 phonemes (distinct sounds) but 26 letters. IPA provides unique symbol for each sound. Vowels: ${en("/iː/ (bee), /ɪ/ (bit), /e/ (bed), /æ/ (cat), /ɑː/ (father), /ɔː/ (thought), /ʊ/ (book), /uː/ (food), /ʌ/ (cup), /ɜː/ (bird), /ə/ (about - schwa)")}. Consonants: ${en("/θ/ (think), /ð/ (this), /ʃ/ (ship), /ʒ/ (measure), /ŋ/ (sing), /tʃ/ (church), /dʒ/ (judge)")}. Diphthongs: ${en("/aɪ/ (eye), /aʊ/ (now), /eɪ/ (day)")}. Learning IPA = pronunciation precision.`,
            highlight: "IPA eliminates spelling-sound ambiguity",
            emoji: "📖",
            formula: "Phoneme = minimal distinctive sound unit. English ≈ 44 phonemes."
          }
        },
        {
          type: "concept",
          content: {
            title: "Minimal Pairs: Sound Contrasts",
            text: `Minimal pair: two words differing by one phoneme. ${en("'Bet' /bet/")} vs ${en("'bat' /bæt/")} (vowel). ${en("'Sip' /sɪp/")} vs ${en("'zip' /zɪp/")} (consonant voicing). ${en("'Sheep' /ʃiːp/")} vs ${en("'ship' /ʃɪp/")} (vowel length). Native speakers distinguish automatically. Non-natives may not hear difference if phoneme absent in L1. Example: Japanese lacks ${en("/l/")} vs ${en("/r/")} distinction → ${en("'light'")} and ${en("'right'")} sound identical initially. Training minimal pairs improves discrimination.`,
            highlight: "Minimal pairs train phonemic awareness",
            emoji: "🎯",
            formula: "Contrastive phonemes → meaning difference. Allophones (variants) → no meaning difference."
          }
        },
        {
          type: "concept",
          content: {
            title: "Stress & Rhythm: The Music of English",
            text: `English is stress-timed language: stressed syllables occur at roughly regular intervals, unstressed syllables compressed. Compare: ${en("\"CATS eat MICE\"")} (2 beats) vs ${en("\"The CATalog LISTED the MICroscope\"")} (3 beats, same timing despite more syllables). Unstressed vowels reduce to schwa ${en("/ə/")}: ${en("'about' /əˈbaʊt/, 'banana' /bəˈnænə/")}. Word stress changes meaning: ${en("'REcord'")} (noun) vs ${en("'re-CORD'")} (verb). Sentence stress indicates focus: ${en("\"I didn't steal the MONEY\"")} (someone else did) vs ${en("\"I didn't STEAL the money\"")} (did something else with it).`,
            highlight: "Stress-timing + vowel reduction = English rhythm",
            emoji: "🎵",
            formula: "Stressed syllables ≈ isochronous (equal time intervals). Unstressed = compressed."
          }
        },
        {
          type: "concept",
          content: {
            title: "Connected Speech: Words Merge",
            text: `Native speech: words link, sounds change. Linking: consonant + vowel → connect. ${en("\"An apple\" /ə.næ.pəl/")} sounds like ${en("\"a napple\"")}. Assimilation: sounds become similar to neighbors. ${en("\"Green beans\" /griːm.biːnz/")} → ${en("/m/")} (labial) before ${en("/b/")}. Elision: sounds disappear. ${en("\"Next please\" /neks.pliːz/")} → ${en("/nekspliːz/")} (no ${en("/t/")}). Intrusion: sounds appear. ${en("\"Go away\" /gəʊ.ə.weɪ/")} → ${en("/gəʊ.wə.weɪ/")} (w appears). Why speech hard to understand: sounds change in context.`,
            highlight: "Connected speech ≠ isolated word pronunciation",
            emoji: "🔗",
            formula: "Citation form (dictionary) → connected speech (actual) via phonological processes"
          }
        },
        {
          type: "concept",
          content: {
            title: "Accent vs Dialect: Pronunciation vs Grammar/Vocabulary",
            text: `Accent = pronunciation differences (phonetics/phonology). Dialect = grammar + vocabulary + pronunciation. Everyone has accent — no 'neutral' or 'correct' accent. Standard accents: Received Pronunciation (UK), General American (US). Regional: Southern US drawl, Scottish brogue, Cockney (London). Intelligibility matters more than 'correctness'. International English: various accents mutually intelligible. Accent prejudice = social, not linguistic. Comprehensibility goal, not native-like accent.`,
            highlight: "All accents equally valid linguistically",
            emoji: "🌍",
            formula: "Accent = pronunciation variation. Dialect = accent + grammar + vocabulary."
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Why ${en("\"Pacific Ocean\"")} is pronounced differently than spelled 🌊`,
            text: `Spelling: ${en("'Pacific'")}. Pronunciation: ${en("/pəˈsɪfɪk/")} — first vowel is schwa ${en("/ə/")}, not ${en("/æ/")} (${en("'a'")}). Why? Unstressed syllables reduce to schwa in English (stress-timing). ${en("'Ocean'")}: ${en("/ˈoʊʃən/")} — ${en("'ea'")} → ${en("/ə/")}, ${en("'c'")} → ${en("/ʃ/")}. Spelling preserves etymology (Latin), pronunciation evolved. English spelling reform failed historically. Result: spelling-sound chaos. Must learn pronunciation separately from spelling (hence IPA's usefulness).`
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can you learn perfect native accent as adult? 🎭",
            text: `Critical Period Hypothesis: accent acquisition ~age 12. After puberty, native-like accent extremely rare (though not impossible — Joseph Conrad learned English at 20, became master writer but kept Polish accent). Phonetic fossilization: L1 phonemes interfere with L2. But perfect accent unnecessary for communication. Comprehensibility > native-like. Many successful bilinguals retain accent. Accent = identity marker, not deficit.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `What is schwa ${en("/ə/")}? 📤`,
            options: [
              "A stressed vowel sound",
              "The most common vowel in English (unstressed syllables)",
              "A consonant sound",
              "An error in pronunciation"
            ],
            correct: 1,
            explanation: `Schwa ${en("/ə/")} = mid-central vowel, most common sound in English. Appears in unstressed syllables: ${en("'about' /əˈbaʊt/, 'sofa' /ˈsoʊfə/, 'banana' /bəˈnænə/")}. Sounds like ${en("'uh'")}. Native speakers reduce unstressed vowels to schwa automatically (vowel reduction). Stress-timing causes this. Not pronouncing schwa = overly careful, non-native rhythm.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `Minimal pair: ${en("'sheep' /ʃiːp/")} vs ${en("'ship' /ʃɪp/")}. What differs? 🐑🚢`,
            options: [
              "Consonants differ",
              "Stress placement differs",
              `Vowel quality differs (${en("/iː/")} vs ${en("/ɪ/")})`,
              "No difference in pronunciation"
            ],
            correct: 2,
            explanation: `Vowel quality distinguishes them. ${en("'Sheep'")} = long tense ${en("/iː/")}, ${en("'ship'")} = short lax ${en("/ɪ/")}. This contrast exists in English but not all languages. Japanese speakers initially struggle (both sound like ${en("'sheep'")}). Minimal pairs train ear to hear phonemic contrasts. Drilling minimal pairs improves both perception and production.`
          }
        },
        {
          type: "conclusion",
          content: {
            title: "English Pronunciation = Complex System Beyond Spelling 🎵",
            text: `44 phonemes, 26 letters → spelling-pronunciation chaos. IPA provides one-to-one sound-symbol mapping. Minimal pairs reveal phonemic contrasts. Stress-timing creates rhythm: stressed syllables isochronous, unstressed compressed to schwa. Connected speech: linking, assimilation, elision. Accent = pronunciation variation (all valid). Comprehensibility > native-like accent. Learn IPA, practice minimal pairs, master stress patterns, embrace accent diversity.`,
            keyTakeaway: "✨ Pronunciation is systematic despite spelling chaos. IPA unlocks sound system. Stress and rhythm matter more than individual sounds for intelligibility."
          }
        }
      ]
    },

    {
      id: "pragmatics-meaning",
      icon: "♟⚙",
      title: "Pragmatics: Meaning Beyond Words",
      subtitle: `${en("\"Can you pass the salt?\"")} isn't really a question about ability`,
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: `${en("\"Can you pass the salt?\"")} — Testing ability or making request? 🧂`,
            text: `Literal meaning (semantics): question about hearer's ability. Intended meaning (pragmatics): polite request to pass salt. Answering ${en("\"Yes\"")} without passing = technically correct but pragmatically failure. Context determines meaning. Pragmatics studies how context shapes interpretation beyond literal meaning. Grice's Cooperative Principle: speakers follow conversational maxims (quality, quantity, relevance, manner). Violations → implicature (implied meaning).`,
            emoji: "🧂"
          }
        },
        {
          type: "concept",
          content: {
            title: "Speech Acts: Doing Things with Words",
            text: `Austin's Speech Act Theory: utterances don't just describe — they perform actions. Locutionary act (literal meaning): ${en("\"I promise to come.\"")} Illocutionary act (intended function): promising. Perlocutionary act (effect): hearer trusts. Types: assertives (claim truth), directives (request action), commissives (commit speaker), expressives (convey feeling), declarations (change reality). ${en("\"I now pronounce you married\"")} = declarative — words make it true.`,
            highlight: "Saying = doing (performative utterances)",
            emoji: "💬",
            formula: "Utterance = locution (what's said) + illocution (what's meant) + perlocution (effect)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Implicature: The Unspoken Meaning",
            text: `Conventional implicature: meaning tied to expression. ${en("\"John is poor but honest\"")} implicates poverty usually contrasts negatively with honesty. Conversational implicature: derived from context + Grice's maxims. Example: ${en("\"How was the movie?\" \"The popcorn was good.\"")} Violation of Relevance → implicates movie was bad (if good, would say so). Implicature = cancellable (${en("\"The popcorn was good, and actually the movie was too\"")}) unlike entailment.`,
            highlight: "What's meant > what's said (often)",
            emoji: "💭",
            formula: "Implicature = inferred meaning from utterance + context + conversational maxims"
          }
        },
        {
          type: "concept",
          content: {
            title: "Politeness Theory: Face-Saving",
            text: `Brown & Levinson: speakers manage 'face' (social image). Positive face = desire to be liked. Negative face = desire for autonomy. Face-threatening acts (FTA): requests, criticism, refusals. Politeness strategies: (1) Bald on-record (${en("\"Pass the salt\"")}). (2) Positive politeness (${en("\"Could you be a star and pass the salt?\"")}). (3) Negative politeness (${en("\"Sorry to bother you, but could you possibly pass the salt?\"")}). (4) Off-record (${en("\"It's bland\"")}). Strategy choice depends on power, distance, imposition.`,
            highlight: "Politeness = face management via linguistic strategies",
            emoji: "🤝",
            formula: "FTA weight = Power(S, H) + Distance(S, H) + Imposition(FTA)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Deixis: Context-Dependent Reference",
            text: `Deictic expressions require context for interpretation. Person deixis: ${en("'I', 'you', 'he'")} (depends on speaker/hearer). Place deixis: ${en("'here', 'there'")} (depends on location). Time deixis: ${en("'now', 'then', 'yesterday'")} (depends on utterance time). Example: ${en("\"I'll meet you here tomorrow\"")} — ${en("'I'")} = speaker, ${en("'you'")} = hearer, ${en("'here'")} = speaker's location, ${en("'tomorrow'")} = day after speech. Same sentence has different referents in different contexts. Context-dependence = core feature of language use.`,
            highlight: "Meaning anchored to speech situation (speaker, place, time)",
            emoji: "📍",
            formula: "Deictic meaning = expression + context parameters (who, where, when)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Indirect Speech Acts: Saying One Thing, Meaning Another",
            text: `Direct: ${en("\"Pass the salt\"")} (imperative = command). Indirect: ${en("\"Can you pass the salt?\"")} (interrogative form, directive function). Why indirectness? Politeness. Questions sound less imposing than commands. Conventional indirectness: ${en("\"Can/could/would you...?\"")} standardized as polite requests. Hearer recognizes via convention + context. Non-conventional: ${en("\"It's cold in here\"")} (indirect request to close window). Higher indirectness = higher politeness (generally).`,
            highlight: "Form ≠ function in indirect speech acts",
            emoji: "🎭",
            formula: "Indirectness level ∝ politeness (context-dependent)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Why ${en("\"That's interesting\"")} often means ${en("\"I disagree but am being polite\"")} 🤔`,
            text: `${en("\"That's interesting\"")} literal meaning: genuinely intriguing. Pragmatic meaning (often): polite dismissal or disagreement. Implicature via Manner maxim violation: if truly interesting, would elaborate (${en("\"That's fascinating because...\"")}) Brief ${en("\"interesting\"")} → damning with faint praise. Tone/context crucial. Sarcasm, understatement, euphemism = pragmatic phenomena where meaning ≠ words. Cultural knowledge required for interpretation.`
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can you lie by telling the truth? (Misleading implicature) 🎯",
            text: `Professor writes recommendation: ${en("\"Mr. Smith has excellent handwriting and was always punctual.\"")} Literally true. But implicature: avoiding mention of academic ability → implicates poor student. Gricean maxim of Quantity: be as informative as required. Saying less → implicates withheld info is negative. Lying via selective truth = pragmatic deception. Courts distinguish literal truth from misleading testimony.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `${en("\"Can you pass the salt?\"")} What is the intended function? 🧂`,
            options: [
              "Questioning hearer's physical ability",
              "Making a polite request (indirect speech act)",
              "Testing hearer's knowledge",
              "Making a statement"
            ],
            correct: 1,
            explanation: `Indirect speech act: interrogative form (${en("\"can you?\"")}) functions as directive (request). Conventional politeness strategy. Direct equivalent: ${en("\"Pass the salt\"")} (imperative). Indirect = more polite because framed as question about ability (respects hearer's autonomy/negative face). Answering ${en("\"Yes\"")} without passing misses pragmatic point.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `A: ${en("\"How was the movie?\"")} B: ${en("\"The popcorn was good.\"")} What's implicated? 🍿`,
            options: [
              "The movie was excellent",
              "B only ate popcorn",
              "The movie was probably bad (relevance violation → implicature)",
              "B is hungry"
            ],
            correct: 2,
            explanation: `Gricean implicature via Relevance maxim. Question about movie, answer about popcorn = apparent irrelevance. But cooperative principle → assume relevance. Inference: if movie were good, B would say so. Talking about popcorn instead → implicates movie was bad. Cancellable: ${en("\"Popcorn was good, and movie was great too!\"")} Implicature = pragmatic, not semantic.`
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Meaning = Words + Context + Social Norms 💡",
            text: `Pragmatics: how context shapes meaning beyond literal semantics. Speech acts: utterances perform actions (promise, request, apologize). Implicature: meaning inferred from context + conversational maxims (Grice). Politeness: face management via linguistic strategies (indirectness, hedging). Deixis: context-dependent reference (${en("I, here, now")}). Indirect speech acts: form ≠ function. Understanding pragmatics = understanding how language actually works in social interaction.`,
            keyTakeaway: "✨ Literal meaning is just starting point. Context, intentions, social relationships determine actual communication. Master pragmatics to sound native."
          }
        }
      ]
    },

    {
      id: "etymology-word-origins",
      icon: "📜🔍",
      title: "Etymology: Words Tell Stories",
      subtitle: `${en("\"Salary\"")} comes from Roman soldiers paid in salt (${en("sal")})`,
      duration: "5 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: `${en("\"Salary\"")} = Latin ${en("'salarium'")} (salt money). Romans paid soldiers in salt 🧂`,
            text: `Salt was valuable (food preservation before refrigeration). Roman soldiers received ${en("'salarium'")} (salt allowance). Word evolved: ${en("salarium")} → ${en("salary")}. Etymology reveals history through words. English = Germanic base + massive Latin/French/Greek borrowing. 60% of English words have Latin/Greek roots. Understanding etymology: (1) improves vocabulary retention (stories stick), (2) reveals meaning patterns, (3) connects related words (family trees).`,
            emoji: "🧂"
          }
        },
        {
          type: "concept",
          content: {
            title: "Word Families: Roots Spread Meaning",
            text: `Latin root ${en("'port'")} (carry) → ${en("'transport'")} (carry across), ${en("'export'")} (carry out), ${en("'import'")} (carry in), ${en("'portable'")} (able to be carried), ${en("'porter'")} (one who carries), ${en("'report'")} (carry back info), ${en("'support'")} (carry from under). Greek ${en("'graph'")} (write) → ${en("'telegraph'")} (write at distance), ${en("'photograph'")} (light-writing), ${en("'biography'")} (life-writing), ${en("'autograph'")} (self-writing). Learn root → unlock dozens of words. Morphology: roots + prefixes + suffixes = systematic.`,
            highlight: "One root = family of related words",
            emoji: "🌳",
            formula: "Root meaning propagates through derived words via affixation"
          }
        },
        {
          type: "concept",
          content: {
            title: "Borrowing: English as Linguistic Magpie",
            text: `English borrows massively. Old English (Germanic base): common words (${en("house, water, come, go")}). Norman Conquest (1066): French vocabulary floods in (${en("government, justice, art, cuisine")}). Renaissance: Latin/Greek for science/philosophy (${en("atom, democracy, psychology")}). Modern: global borrowing (${en("karate, yoga, safari, tsunami")}). Result: synonyms with register differences. Germanic = informal (${en("\"kingly\"")}), French = formal (${en("\"royal\"")}), Latin = technical (${en("\"regal\"")}). Layered vocabulary system.`,
            highlight: "English = Germanic grammar + Romance/Greek vocabulary",
            emoji: "🗺️",
            formula: "Old English (Anglo-Saxon) + Norman French + Latin/Greek + global = Modern English"
          }
        },
        {
          type: "concept",
          content: {
            title: "Semantic Shift: Meanings Change Over Time",
            text: `${en("\"Nice\"")} (Latin ${en("'nescius'")} = ignorant) → foolish → fastidious → pleasant. ${en("\"Awful\"")} (awe-full = inspiring awe) → terrible. ${en("\"Artificial\"")} (artful) → fake. ${en("\"Meat\"")} (any food) → animal flesh specifically. Semantic broadening: ${en("'dog'")} (specific breed) → all canines. Narrowing: ${en("'deer'")} (any animal) → specific species. Amelioration: ${en("'knight'")} (servant) → noble warrior. Pejoration: ${en("'villain'")} (farm worker) → evildoer. Etymology explains why spelling/meaning disconnect.`,
            highlight: "Word meanings drift over centuries (semantic change)",
            emoji: "🔄",
            formula: "Semantic change types: broadening, narrowing, amelioration, pejoration, metaphor"
          }
        },
        {
          type: "concept",
          content: {
            title: "Cognates: Related Words Across Languages",
            text: `Indo-European language family shares roots. English ${en("'mother'")}, German ${en("'Mutter'")}, Spanish ${en("'madre'")}, Latin ${en("'mater'")}, Greek ${en("'meter'")}, Sanskrit ${en("'mātṛ'")} ← Proto-Indo-European ${en("*méh₂tēr")}. Sound correspondences systematic (Grimm's Law): p/f (Latin ${en("'pater'")}/English ${en("'father'")}), t/th (Latin ${en("'tres'")}/English ${en("'three'")}). Cognates = common ancestry. False friends: words that look similar but differ (English ${en("'embarrassed'")} vs Spanish ${en("'embarazada'")} = pregnant). Etymology reveals true vs false cognates.`,
            highlight: "Cognates = shared ancestry, systematic sound changes",
            emoji: "🌍",
            formula: "Proto-language → daughter languages via regular sound changes (historical linguistics)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Neologisms: New Words Enter Language",
            text: `Coinage: ${en("'google'")} (now verb), ${en("'xerox', 'kleenex'")}. Compounding: ${en("'smartphone', 'Brexit', 'mansplain'")}. Blending: ${en("'brunch'")} (breakfast+lunch), ${en("'smog'")} (smoke+fog), ${en("'motel'")} (motor+hotel). Acronyms: ${en("'radar'")} (radio detection and ranging), ${en("'scuba', 'laser'")}. Borrowing: ${en("'emoji'")} (Japanese), ${en("'selfie'")} (Australian?). Back-formation: ${en("'edit'")} ← ${en("'editor'")}, ${en("'televise'")} ← ${en("'television'")}. Language constantly evolves. New technology, culture → new words. Etymology continues in real-time.`,
            highlight: "Living language = constant word creation",
            emoji: "✨",
            formula: "Neologisms enter via: coinage, compounding, blending, acronymy, borrowing, back-formation"
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Why ${en("\"Wednesday\"")} is pronounced ${en("\"Wensday\"")} 🗓️`,
            text: `Etymology: ${en("'Wednesday'")} = Woden's day (Germanic god). Old English ${en("'Wōdnesdæg'")}. Sound change: ${en("/d/")} deleted in ${en("/dn/")} cluster → ${en("'Wensday'")}. Spelling preserved historical form, pronunciation evolved. Similar: ${en("'sword'")} (silent w), ${en("'knight'")} (silent k, gh). English spelling frozen ~15th century (printing press standardization). Pronunciation continued changing. Result: spelling-sound mismatch. Etymology explains 'weird' spellings.`
          }
        },
        {
          type: "curiosity",
          content: {
            title: `Can you deduce ${en("\"pedestrian\"")} means 'person who walks'? 🚶`,
            text: `Latin ${en("'ped-'")} (foot) + ${en("'-estrian'")} (related to). Cognates: ${en("'pedal'")} (foot lever), ${en("'pedometer'")} (foot measure), ${en("'pedicure'")} (foot care), ${en("'centipede'")} (hundred feet), ${en("'expedite'")} (literally: free the feet → hurry). Greek variant ${en("'pod-'")}: ${en("'podium'")} (foot platform), ${en("'tripod'")} (three feet). Etymology reveals: ${en("'pedestrian'")} = foot-related person = walker. Learning roots = decoding unfamiliar words.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `Latin root ${en("'scrib/script'")} means 'write'. What does ${en("\"manuscript\"")} mean? ✏️`,
            options: [
              "A type of paper",
              `Handwritten document (${en("manu")} = hand + ${en("script")} = write)`,
              "A book cover",
              "A printing machine"
            ],
            correct: 1,
            explanation: `${en("\"Manuscript\"")} = ${en("'manu-'")} (hand, Latin ${en("'manus'")}) + ${en("'script'")} (write, Latin ${en("'scribere'")}). Literally: hand-written. Before printing press, all books were manuscripts. Related: ${en("'manual'")} (by hand), ${en("'manufacture'")} (make by hand), ${en("'describe'")} (write down), ${en("'prescribe'")} (write before), ${en("'scribe'")} (writer). Etymology breaks down complex words into meaningful parts.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `Why do ${en("\"kingly\"")} (Germanic), ${en("\"royal\"")} (French), ${en("\"regal\"")} (Latin) mean similar things? 👑`,
            options: [
              "Pure coincidence",
              "English borrowed from multiple languages for same concept",
              "They actually mean different things",
              "One is the correct term, others are errors"
            ],
            correct: 1,
            explanation: `English has layered vocabulary: Old English (Germanic) → everyday words. Norman French → elevated/formal terms. Latin → technical/academic words. All three mean 'related to king/monarch' but different registers. Germanic = colloquial, French = formal, Latin = scholarly. Synonyms with stylistic differences. Result of English's complex borrowing history. Choose based on context/formality.`
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Words = Time Capsules of History 📚",
            text: `Etymology: study of word origins and evolution. Words encode history: ${en("'salary'")} (Roman salt payment), ${en("'nice'")} (ignorant → pleasant). Roots propagate meaning: ${en("'port'")} (carry) → transport/import/export/support. English borrows massively: Germanic base + French/Latin/Greek layers. Semantic shift: meanings change over time. Cognates reveal language families (Indo-European). Neologisms: living language evolves constantly. Understanding etymology improves vocabulary, reveals connections, explains spelling 'irregularities'.`,
            keyTakeaway: "✨ Learn word roots → unlock word families. Etymology makes vocabulary learning systematic and memorable through stories."
          }
        }
      ]
    },

    {
      id: "register-code-switching",
      icon: "🎭🔀",
      title: "Register & Code-Switching",
      subtitle: "You speak differently to your boss vs your best friend — and that's grammar",
      duration: "4 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: `To boss: ${en("\"Could you possibly review this?\"")} To friend: ${en("\"Check this out!\"")} 💼👥`,
            text: `Same request, different formulations. Why? Register: language variety appropriate to social situation (formality, power, distance). Factors: audience (who), purpose (why), context (where). Formal register: complex syntax, Latinate vocabulary, explicit connectors, passive voice. Informal: simple syntax, contractions, slang, active voice. Native speakers code-switch automatically based on context. Pragmatic competence = matching register to situation.`,
            emoji: "💼"
          }
        },
        {
          type: "concept",
          content: {
            title: "Formality Continuum: Frozen to Intimate",
            text: `Five levels (Joos): (1) Frozen: unchanging language (legal documents, religious liturgy, wedding vows). (2) Formal: one-way communication (speeches, presentations, academic writing). (3) Consultative: professional interaction (job interview, doctor-patient). (4) Casual: friends, peers (relaxed conversation, some slang). (5) Intimate: family, close friends (private vocabulary, nonverbal cues). Move up = more explicit, complex, polite. Move down = more implicit, simple, direct. Mismatching register = social awkwardness.`,
            highlight: "Register = appropriate language for social context",
            emoji: "📊",
            formula: "Formality ∝ social distance + power asymmetry + seriousness of topic"
          }
        },
        {
          type: "concept",
          content: {
            title: "Linguistic Features Across Registers",
            text: `Formal: passive voice (${en("\"Mistakes were made\"")}), nominalizations (${en("\"investigation\"")} vs ${en("\"investigate\"")}), complex sentences, Latinate vocabulary, no contractions. Informal: active voice (${en("\"I made mistakes\"")}), verbs over nouns, simple/compound sentences, Germanic vocabulary, contractions (${en("\"I'm\", \"don't\"")}). Academic: hedging (${en("\"suggests\", \"may indicate\"")}), citations, impersonal constructions. Casual: slang (${en("\"cool\", \"dude\"")}), intensifiers (${en("\"so\", \"really\"")}), fillers (${en("\"like\", \"you know\"")}), ellipsis (${en("\"Going to store\"")} = ${en("\"I'm going to the store\"")}).`,
            highlight: "Grammar/vocabulary shift with formality",
            emoji: "📝",
            formula: "Formal register: + passives, + nominalizations, + hedging, - contractions"
          }
        },
        {
          type: "concept",
          content: {
            title: "Code-Switching: Alternating Between Varieties",
            text: `Situational: change context → change variety (formal meeting → casual break). Metaphorical: signal identity, solidarity, authority within conversation. Bilingual code-switching: alternating languages mid-conversation (common in multilingual communities). Example: Spanglish, switching between Spanish and English. Functions: quote someone, emphasize, exclude/include listener, show expertise. Not random — follows grammatical constraints (can't switch mid-word). Sociolinguistic skill, not deficiency.`,
            highlight: "Code-switching = linguistic flexibility, not confusion",
            emoji: "🔀",
            formula: "Code-switching governed by: syntactic constraints + pragmatic functions + social meaning"
          }
        },
        {
          type: "concept",
          content: {
            title: "Jargon vs Plain English: Audience Awareness",
            text: `Jargon: specialized vocabulary for in-group (medical, legal, technical). Functions: precision, efficiency, gatekeeping. ${en("\"Myocardial infarction\"")} (medical jargon) vs ${en("\"heart attack\"")} (plain English). Same referent, different audiences. Overusing jargon = alienating non-experts. Plain English movement: clarity over complexity. Good writing: adjust technicality to audience. Expert to expert? Jargon OK. Expert to public? Simplify. Register competence = audience awareness.`,
            highlight: "Match technical level to audience knowledge",
            emoji: "🎯",
            formula: "Effective communication = content + appropriate register for audience"
          }
        },
        {
          type: "concept",
          content: {
            title: "Politeness Strategies Across Cultures",
            text: `Anglo-Saxon cultures: negative politeness (respect autonomy, indirect requests, ${en("\"Could you...\", \"Would you mind...\"")}).Mediterranean cultures: positive politeness (solidarity, warmth, direct). Asian cultures: hierarchical politeness (honorifics, age/status-based forms). English register affects politeness: formal = more indirect/polite. Cross-cultural miscommunication: directness perceived as rude (or indirectness as dishonest). Register awareness includes cultural norms.`,
            highlight: "Politeness norms = culturally specific",
            emoji: "🌍",
            formula: "Politeness = linguistic form + cultural expectations (both required)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Why do people \"talk fancy\" in job interviews? 🎩",
            text: `Formal register signals: competence, education, professionalism, respect for situation. Job interview = high-stakes, power asymmetry (employer evaluates candidate), professional context. Using casual register (${en("\"Yeah, I totally crushed that project, dude!\"")}) = pragmatic failure. Formal register = appropriate. Sociolinguistic research: people judged as more competent/trustworthy when using situationally appropriate register. Register competence = social competence.`
          }
        },
        {
          type: "curiosity",
          content: {
            title: "Can you code-switch TOO much? (Audience design theory) 🎭",
            text: `Audience Design (Bell): speakers adjust style to audience. Accommodation theory: converge (become more similar) to show solidarity, diverge to assert difference. Over-accommodation: trying too hard to match audience → sounds fake. Example: older person using youth slang excessively → awkward. Authentic register-switching = subtle, fluid. Forced = transparent, off-putting. Native speakers calibrate unconsciously. Learners must develop sociolinguistic intuition through exposure.`
          }
        },
        {
          type: "quiz",
          content: {
            question: "Which is most appropriate for academic essay? 📚",
            options: [
              en("\"I think the data shows that people are way happier when they exercise.\""),
              en("\"The data suggests a positive correlation between physical activity and subjective well-being.\""),
              en("\"So like, when people work out, they're totally happier, you know?\""),
              en("\"People feel good after exercising, obviously.\"")
            ],
            correct: 1,
            explanation: `Option 2 uses formal academic register: hedging (${en("\"suggests\"")}), technical vocabulary (${en("\"correlation\", \"subjective well-being\"")}), passive construction, no contractions. Option 1: too informal (${en("\"way happier\", \"I think\"")}). Option 3: casual (${en("\"like\", \"you know\"")}). Option 4: assertive without hedging (${en("\"obviously\"")} too certain). Academic writing = tentative, impersonal, precise.`
          }
        },
        {
          type: "quiz",
          content: {
            question: `Friend asks ${en("\"Wanna grab coffee?\"")} Appropriate response? ☕`,
            options: [
              en("\"I would be delighted to accept your invitation for a coffee beverage.\""),
              en("\"Yeah, sounds good!\""),
              en("\"One must decline owing to prior commitments.\""),
              en("\"Affirmative. Coffee acquisition proposed.\"")
            ],
            correct: 1,
            explanation: `Casual situation requires casual register. ${en("\"Yeah, sounds good!\"")} matches friend's informal tone (${en("\"Wanna\"")} = want to). Option 1: overly formal (awkwardly mismatched). Option 3: frozen register (absurdly formal). Option 4: robotic/technical. Register mismatch = pragmatic failure (technically grammatical but socially inappropriate). Code-switch to match context.`
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Register = Social Grammar ⚙️",
            text: `Register: language variety appropriate to situation. Formality continuum: frozen → formal → consultative → casual → intimate. Linguistic features shift: passive/active voice, complex/simple syntax, Latinate/Germanic vocabulary, hedging/directness. Code-switching: alternating between varieties situationally or metaphorically. Jargon: match technicality to audience. Politeness strategies culturally variable. Native speakers adjust register automatically. Learners must develop sociolinguistic awareness: grammatical competence + pragmatic competence = communicative competence.`,
            keyTakeaway: "✨ Speaking appropriately = choosing right register for context. Match formality to situation, audience, purpose. Social fluency requires register flexibility."
          }
        }
      ]
    }
  ]
};

console.log('✅ english-lessons.js loaded:', englishLessons.lessons.length, 'lessons');