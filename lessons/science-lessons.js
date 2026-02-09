// ==========================================
// 🔬 SCIENCE & PHYSICS
// ==========================================
const scienceLessons = {
  title: "Science & Physics",
  lessons: [
    {
      id: "forces-and-motion",
      icon: "✈🛰🏍",
      title: "Forces & Motion",
      subtitle: "You're falling right now at 9.8 m/s²",
      duration: "4 min",
      difficulty: 1,
      steps: [
        {
          type: "hook",
          content: {
            title: "You're falling right now. At 9.8 m/s²",
            text: "Earth pulls you downward with force F = mg. You don't fall through the floor because it pushes back with equal force (Newton's Third Law). Every second, you're in a stalemate with gravity. Standing still is actually a force battle.",
            emoji: "🌍"
          }
        },
        {
          type: "concept",
          content: {
            title: "Newton's Laws: The Force Trinity",
            text: "1st Law (Inertia): Objects resist change in motion. Moving stays moving, still stays still — unless acted upon. 2nd Law (F = ma): Force equals mass times acceleration. Push harder = faster acceleration. 3rd Law (Action-Reaction): Every force has equal opposite force. You push Earth down, Earth pushes you up.",
            highlight: "F = ma (Newton's Second Law)",
            emoji: "⚖️",
            formula: "Force (N) = mass (kg) × acceleration (m/s²)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Gravity: The Universal Attractor",
            text: "Every mass attracts every other mass. Newton's law of gravitation: F = G(m₁m₂)/r². G = gravitational constant (6.67×10⁻¹¹). On Earth's surface, g ≈ 9.8 m/s² — you accelerate downward at 9.8 meters per second every second when falling. Terminal velocity occurs when air resistance equals gravitational force.",
            highlight: "g = 9.8 m/s² on Earth",
            emoji: "🪐↔🌍",
            formula: "F = G(m₁m₂)/r²"
          }
        },
        {
          type: "concept",
          content: {
            title: "Friction: The Motion Brake",
            text: "Friction opposes motion between surfaces. Two types: static (prevents initial motion) and kinetic (slows moving objects). Friction force: F = μN where μ = coefficient of friction, N = normal force. Without friction, walking impossible — feet would slip infinitely. Tires grip road via friction.",
            highlight: "F_friction = μN",
            emoji: "🏎",
            formula: "Coefficient × Normal Force"
          }
        },
        {
          type: "concept",
          content: {
            title: "Momentum: Mass in Motion",
            text: "Momentum p = mv (mass × velocity). Heavy object moving = large momentum. Conservation law: total momentum before collision = total momentum after. Car crash: momentum transfers between vehicles. Airbags extend collision time, reducing force (F = Δp/Δt). Same momentum change, less force.",
            highlight: "p = mv (momentum)",
            emoji: "🚀",
            formula: "Momentum conserved in isolated systems"
          }
        },
        {
          type: "concept",
          content: {
            title: "Energy of Motion",
            text: "Kinetic energy KE = ½mv². Doubles when speed doubles? No — quadruples! Energy proportional to velocity SQUARED. Car at 60 mph has 4× energy of car at 30 mph. Why high-speed crashes are devastating. Stopping distance increases with v², not v.",
            highlight: "KE = ½mv²",
            emoji: "🏍🌫",
            formula: "Energy increases with square of velocity"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🐘🔨 In space, a feather and hammer fall at same speed",
            text: "Apollo 15 astronaut David Scott proved it on the Moon (1971). No air resistance, so gravity accelerates all objects equally regardless of mass. Galileo predicted this 400 years earlier by dropping objects from Leaning Tower of Pisa. Mass doesn't affect gravitational acceleration."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🧐Why don't we feel Earth spinning at 1,670 km/h?",
            text: "At equator, Earth's surface moves 1,670 km/h. We don't feel it because velocity is constant (no acceleration). Newton's 1st law: constant motion = feels like rest. Only acceleration (change in motion) is felt. When car accelerates, you feel pushed back — that's acceleration, not velocity."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If mass doubles but acceleration stays same, what happens to force?",
            options: [
              "Force halves",
              "Force stays same",
              "Force doubles",
              "Force quadruples"
            ],
            correct: 2,
            explanation: "F = ma. If m doubles and a constant, then F must double. Force directly proportional to mass when acceleration fixed."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Car traveling 60 mph has how much more kinetic energy than at 30 mph?",
            options: [
              "2× more",
              "3× more",
              "4× more",
              "6× more"
            ],
            correct: 2,
            explanation: "KE = ½mv². Velocity doubles (30→60), so KE increases by 2² = 4×. Energy scales with v², not v. This is why high speeds are exponentially more dangerous."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Motion = Forces + Math",
            text: "Every movement obeys Newton's laws. F = ma connects force, mass, acceleration. Momentum conserved. Energy scales with v². Understanding motion means predicting trajectories, designing vehicles, analyzing crashes. Physics turned chaos into calculable reality.",
            keyTakeaway: "Newton's laws govern all classical motion. Master F = ma, and you can predict how objects move under any forces."
          }
        }
      ]
    },

    {
      id: "light-and-photons",
      icon: "☀🌤",
      title: "Light & Photons",
      subtitle: "Light takes 8 minutes to reach you from the Sun",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Light takes 8 minutes to reach you",
            text: "The Sun is 150 million km away. Light travels at c = 299,792,458 m/s. Distance ÷ speed = 150×10⁹m ÷ 3×10⁸m/s ≈ 500 seconds = 8.3 minutes. You see the Sun as it was 8 minutes ago. Looking at stars = looking back in time.",
            emoji: "☀😎"
          }
        },
        {
          type: "concept",
          content: {
            title: "Light: Wave AND Particle",
            text: "Wave-particle duality: light behaves as electromagnetic wave (wavelength λ, frequency f) AND as particles (photons). Energy of photon: E = hf where h = Planck's constant (6.63×10⁻³⁴ J·s). Higher frequency = higher energy. Gamma rays (high f) more energetic than radio waves (low f).",
            highlight: "E = hf (photon energy)",
            emoji: "☀",
            formula: "c = λf (speed = wavelength × frequency)"
          }
        },
        {
          type: "concept",
          content: {
            title: "The Electromagnetic Spectrum",
            text: "All light is EM radiation, differing only in wavelength. Radio (λ > 1m), Microwave (1mm-1m), Infrared (750nm-1mm), Visible (380-750nm), Ultraviolet (10-380nm), X-ray (0.01-10nm), Gamma (<0.01nm). Visible light is TINY slice. Most of universe invisible to human eyes.",
            highlight: "Visible light: 380-750 nanometers",
            emoji: "〰〰",
            formula: "All EM waves travel at c in vacuum"
          }
        },
        {
          type: "concept",
          content: {
            title: "Refraction: Light Bending",
            text: "Light slows in denser media. Vacuum: c. Water: 0.75c. Glass: 0.67c. When light enters new medium at angle, it bends (Snell's law: n₁sinθ₁ = n₂sinθ₂). This bending creates rainbows (dispersion), lenses (focus), and mirages (atmospheric refraction).",
            highlight: "n₁sinθ₁ = n₂sinθ₂ (Snell's Law)",
            emoji: "☀〽",
            formula: "Light bends when changing speed"
          }
        },
        {
          type: "concept",
          content: {
            title: "Reflection: Law of Mirrors",
            text: "Angle of incidence = angle of reflection. Light bounces off surfaces predictably. Smooth surfaces (mirrors) = specular reflection (clear image). Rough surfaces = diffuse reflection (scattered). Total internal reflection occurs when light tries exiting dense medium at shallow angle — basis for fiber optics.",
            highlight: "θᵢ = θᵣ (reflection angles equal)",
            emoji: "👸 ∣ 👸",
            formula: "Smooth surface → clear reflection"
          }
        },
        {
          type: "concept",
          content: {
            title: "Why Sky Blue, Sunset Red?",
            text: "Rayleigh scattering: shorter wavelengths (blue ~450nm) scatter more than longer (red ~700nm). Blue scatters in all directions → sky appears blue. At sunset, light travels through MORE atmosphere, scattering away all blue, leaving red/orange. Scattering ∝ 1/λ⁴.",
            highlight: "Scattering ∝ 1/λ⁴",
            emoji: "🌇⛅",
            formula: "Short wavelengths scatter more"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🐌 Nothing can go faster than light — here's why",
            text: "Special relativity: as object approaches c, its mass increases toward infinity. Infinite mass requires infinite energy to accelerate. c is cosmic speed limit, not because physics 'forbids' it, but because energy requirements become infinite. Light itself is massless, so it travels at c."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "💫 Can light escape a black hole?",
            text: "No. Event horizon is where escape velocity = c. Inside event horizon, even light can't escape because required velocity exceeds c (impossible). Black holes are 'black' because no light escapes to reach our eyes. Hawking radiation (quantum effect) is only exception."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If light's frequency doubles, what happens to its energy?",
            options: [
              "Energy halves",
              "Energy doubles",
              "Energy quadruples",
              "Energy stays same"
            ],
            correct: 1,
            explanation: "E = hf. Energy directly proportional to frequency. Double f → double E. This is why UV light (high f) causes sunburn but radio waves (low f) don't."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Why does straw look bent in water?",
            options: [
              "Water breaks the straw",
              "Refraction — light bends when changing speed",
              "Optical illusion only",
              "Reflection from glass"
            ],
            correct: 1,
            explanation: "Light slows entering water, causing refraction (bending) per Snell's law. Brain interprets bent light rays as bent straw. Physical phenomenon, not illusion."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Light = Information Carrier",
            text: "Light is fastest thing in universe (c = 299,792,458 m/s), carries energy (E = hf), and behaves as wave + particle. Refraction, reflection, scattering explain rainbows, mirrors, blue sky. Universe's speed limit due to mass-energy relation. Understanding light = understanding how we perceive reality.",
            keyTakeaway: "Light is electromagnetic radiation obeying wave-particle duality. Speed c is cosmic limit. E = hf links energy to frequency."
          }
        }
      ]
    },

    {
      id: "energy-conservation",
      icon: "💡🕯🌩",
      title: "Energy Conservation",
      subtitle: "Your body runs on 100 watts, like a light bulb",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Your body runs on 100 watts",
            text: "Basal metabolic rate ≈ 2000 kcal/day. 1 kcal = 4184 J. That's 8.37 million joules per day ÷ 86,400 seconds ≈ 97 watts continuous. Similar power as incandescent bulb. You're a biological machine converting chemical energy (food) into heat and work.",
            emoji: "🔋"
          }
        },
        {
          type: "concept",
          content: {
            title: "First Law: Energy Conserved",
            text: "Energy cannot be created or destroyed — only transformed. Total energy in isolated system remains constant. ΔE_system = 0. Food (chemical energy) → ATP → muscle contraction (kinetic) + heat. Battery (chemical) → electrons (electrical) → light (photons) + heat. Every process conserves total energy.",
            highlight: "ΔE_total = 0 (conservation)",
            emoji: "⚡♻",
            formula: "Energy transforms, never disappears"
          }
        },
        {
          type: "concept",
          content: {
            title: "Forms of Energy",
            text: "Kinetic (motion): KE = ½mv². Potential (position): PE = mgh (gravitational). Chemical (bonds): stored in ATP, glucose, batteries. Thermal (heat): random molecular motion. Electromagnetic (light): E = hf. Nuclear: E = mc². Mass itself is energy. All forms interconvertible.",
            highlight: "E = mc² (mass-energy equivalence)",
            emoji: "",
            formula: "Different forms, same fundamental quantity"
          }
        },
        {
          type: "concept",
          content: {
            title: "Second Law: Entropy Increases",
            text: "Energy transformations increase disorder (entropy). Heat flows hot → cold, never reverse spontaneously. Organized energy (electricity) → disorganized (heat). Why perpetual motion machines impossible. Universe trending toward maximum entropy (heat death). Arrow of time defined by entropy increase.",
            highlight: "ΔS_universe > 0 (entropy increases)",
            emoji: "🥵🥶",
            formula: "Disorder always increases overall"
          }
        },
        {
          type: "concept",
          content: {
            title: "Efficiency: Lost Energy",
            text: "No real process 100% efficient. Car engine: ~25% efficient (75% becomes waste heat). Incandescent bulb: ~5% light, 95% heat. LED: ~40% efficient. Efficiency = (useful output)/(total input) × 100%. Carnot efficiency sets theoretical maximum based on temperature difference.",
            highlight: "η = W_out/Q_in (efficiency)",
            emoji: "",
            formula: "Real processes always waste energy as heat"
          }
        },
        {
          type: "concept",
          content: {
            title: "Power: Energy Per Time",
            text: "Power = energy/time. Measured in watts (W = J/s). 100W bulb uses 100 joules per second. Human body: ~100W continuous. Car engine: ~100,000W (100 kW). Nuclear reactor: billions of watts (GW). Power tells how FAST energy transforms, not how much total energy exists.",
            highlight: "P = E/t (power in watts)",
            emoji: "🏋️‍♂️",
            formula: "1 watt = 1 joule per second"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "💥Annihilating 1 gram of matter releases Hiroshima-level energy",
            text: "E = mc². For m = 0.001 kg, E = 0.001 × (3×10⁸)² = 9×10¹³ joules ≈ 21 kilotons TNT. Hiroshima bomb ≈ 15 kilotons. Tiny mass contains enormous energy. Why nuclear weapons/reactors so powerful. Why Sun shines: converts 4 million tons mass → energy every second."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🛑 Why does everything eventually stop moving?",
            text: "Friction converts kinetic energy → heat. Heat dissipates into environment, increasing entropy. Moving object's organized kinetic energy becomes disorganized thermal motion of molecules. Energy conserved (1st law), but becomes less useful (2nd law). Perpetual motion violates thermodynamics."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Ball dropped from height h. Just before hitting ground, what's its speed v?",
            options: [
              "v = √(gh)",
              "v = √(2gh)",
              "v = gh",
              "v = 2gh"
            ],
            correct: 1,
            explanation: "Energy conservation: PE_top = KE_bottom. mgh = ½mv². Cancel m, solve: v² = 2gh, so v = √(2gh). Speed independent of mass (neglecting air resistance)."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Which transformation violates thermodynamics?",
            options: [
              "Electrical → light + heat",
              "Heat → work at 100% efficiency",
              "Chemical → kinetic + heat",
              "Nuclear → heat + light"
            ],
            correct: 1,
            explanation: "2nd law: cannot convert heat → work at 100% efficiency. Some energy MUST become waste heat, increasing entropy. Other transformations allowed if entropy increases overall."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Energy = Universe's Currency",
            text: "Energy conserved (1st law) but entropy increases (2nd law). All processes transform energy between forms: kinetic, potential, chemical, thermal, electromagnetic, nuclear. Power measures rate of transformation (watts). E = mc² reveals mass-energy equivalence. Understanding energy = understanding why universe evolves.",
            keyTakeaway: "Energy transforms but never disappears. Total conserved, but usefulness decreases due to entropy. Efficiency always <100%."
          }
        }
      ]
    },

    {
      id: "temperature-absolute-zero",
      icon: "🌡❄",
      title: "Temperature & Absolute Zero",
      subtitle: "At -273.15°C, all atomic motion stops",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Absolute zero: -273.15°C. Nothing can be colder",
            text: "Temperature measures average kinetic energy of atoms. At absolute zero (0 Kelvin = -273.15°C), atoms have minimum possible energy — quantum ground state. Not 'frozen still' (uncertainty principle forbids that), but minimum quantum motion. You can't extract more energy because there's none left to extract.",
            emoji: "🥶🥶"
          }
        },
        {
          type: "concept",
          content: {
            title: "Temperature = Atomic Motion",
            text: "Temperature is NOT 'hotness' — it's average kinetic energy of particles. Hot object: atoms vibrate violently. Cold object: atoms move slowly. Kelvin scale starts at absolute zero. T(K) = T(°C) + 273.15. Room temp ≈ 293K. Celsius/Fahrenheit are arbitrary; Kelvin is fundamental.",
            highlight: "T(K) = T(°C) + 273.15",
            emoji: "🌡🤒",
            formula: "Temperature measures kinetic energy"
          }
        },
        {
          type: "concept",
          content: {
            title: "Heat Transfer: Three Mechanisms",
            text: "Conduction: atoms collide, transferring energy (touch hot stove). Convection: bulk fluid motion carries heat (hot air rises). Radiation: electromagnetic waves carry energy (Sun warms Earth through vacuum). All three increase entropy. Heat ALWAYS flows hot → cold until equilibrium (Zeroth Law).",
            highlight: "Heat flows hot → cold spontaneously",
            emoji: "",
            formula: "Q = mcΔT (heat transfer)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Phase Transitions: Energy Without Temperature Change",
            text: "Ice → water → vapor. Each transition requires energy (latent heat) but temperature DOESN'T change during transition. Ice at 0°C + energy → water at 0°C. Energy breaks molecular bonds, not increases kinetic energy. L_fusion(water) = 334 kJ/kg. L_vaporization = 2257 kJ/kg. Why steam burns worse than hot water.",
            highlight: "Phase change needs energy, no temp change",
            emoji: "🧊🔥",
            formula: "Q = mL (latent heat)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Thermal Expansion: Atoms Need Space",
            text: "Objects expand when heated. Atoms vibrate more, needing more space. Linear expansion: ΔL = αL₀ΔT where α = coefficient of expansion. Bridges have expansion joints. Thermometers use liquid expansion. Why glass cracks under rapid temperature change (thermal stress). Other example, Popcorn!",
            highlight: "ΔL = αL₀ΔT (expansion)",
            emoji: "🌽💥🍿",
            formula: "Hotter = larger (generally)"
          }
        },
        {
          type: "concept",
          content: {
            title: "Extreme Temperatures",
            text: "Coldest achieved: ~0.0000000001 K (laser cooling). Hottest created: ~5.5 trillion K (Large Hadron Collider, recreating Big Bang conditions 0.000001 sec after universe birth). Sun's core: 15 million K. Cosmic microwave background: 2.7 K (leftover Big Bang radiation). Temperature spans 20+ orders of magnitude.",
            highlight: "Observable range: 10⁻¹⁰ K to 10¹³ K",
            emoji: "❄🥶",
            formula: "Universe explores vast temperature space"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "👩🏽‍🔬 Can you reach absolute zero?",
            text: "Third Law of Thermodynamics: impossible to reach 0 K in finite steps. You can approach arbitrarily close but never actually reach it. Quantum mechanics: even at 0 K, 'zero-point energy' remains (Heisenberg uncertainty principle). Particles can never be completely at rest."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "😵Negative absolute temperature — hotter than infinity?",
            text: "In certain quantum systems, negative Kelvin temperatures exist (e.g., -1 K). Sounds colder than 0 K but actually HOTTER than +∞ K. Why? Temperature is defined by entropy vs energy relationship. Negative T means adding energy DECREASES entropy (population inversion). Counterintuitive but mathematically consistent."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Water boils at 100°C. What's this in Kelvin?",
            options: [
              "100 K",
              "273 K",
              "373 K",
              "173 K"
            ],
            correct: 2,
            explanation: "T(K) = T(°C) + 273.15. So 100°C + 273.15 = 373.15 K ≈ 373 K. Kelvin starts at absolute zero; Celsius is shifted by 273.15."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Why does steam burn worse than boiling water?",
            options: [
              "Steam is hotter than 100°C",
              "Steam releases latent heat when condensing",
              "Steam has more kinetic energy",
              "Steam penetrates skin better"
            ],
            correct: 1,
            explanation: "Steam at 100°C condenses on skin, releasing L_vaporization = 2257 kJ/kg as heat. Water at 100°C only transfers sensible heat (mcΔT). Latent heat >> sensible heat for same mass."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Temperature = Energy at Atomic Scale",
            text: "Temperature measures average kinetic energy of particles. Absolute zero (0 K = -273.15°C) is minimum energy state. Heat flows hot → cold, increasing entropy. Phase changes absorb/release latent heat without temperature change. Thermal expansion explains material behavior. Temperature spans 20+ orders of magnitude in universe.",
            keyTakeaway: "Temperature is kinetic energy. Absolute zero is unreachable lower limit. Heat transfer always increases entropy."
          }
        }
      ]
    },

    {
      id: "waves-and-vibrations",
      icon: "🌫〰〰",
      title: "Waves & Vibrations",
      subtitle: "Sound can't travel in space — no medium to vibrate",
      duration: "4 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Sound can't travel in space. Here's why",
            text: "Sound is mechanical wave — requires medium (air, water, solid) to propagate. Space is near-vacuum. No molecules to vibrate = no sound transmission. Movie explosions in space? Fiction. Reality: silent. Light (EM wave) doesn't need medium, so we see stars but can't hear them.",
            emoji: "🔇"
          }
        },
        {
          type: "concept",
          content: {
            title: "Wave Anatomy: Wavelength, Frequency, Speed",
            text: "Wavelength (λ): distance between wave peaks. Frequency (f): oscillations per second (Hertz). Wave equation: v = λf (speed = wavelength × frequency). Higher frequency = shorter wavelength if speed constant. Sound in air: v ≈ 343 m/s. Light in vacuum: c = 299,792,458 m/s.",
            highlight: "v = λf (wave equation)",
            emoji: "📡〰",
            formula: "Speed determined by medium properties"
          }
        },
        {
          type: "concept",
          content: {
            title: "Transverse vs Longitudinal",
            text: "Transverse: oscillation ⊥ propagation direction (light, water waves). Imagine shaking rope up-down — wave travels horizontally. Longitudinal: oscillation ∥ propagation direction (sound). Compressions and rarefactions travel through medium. Both types transfer energy without transferring matter.",
            highlight: "Transverse ⊥, Longitudinal ∥",
            emoji: "🌊🔊",
            formula: "Different geometries, same wave physics"
          }
        },
        {
          type: "concept",
          content: {
            title: "Interference: Waves Add",
            text: "Constructive interference: waves in phase → amplitudes add (louder sound, brighter light). Destructive interference: waves out of phase → cancel (silence, darkness). Principle of superposition: total wave = sum of individual waves. Creates beats (sound), diffraction patterns (light), standing waves (strings).",
            highlight: "Superposition: waves ADD algebraically",
            emoji: "🎵➕🎵",
            formula: "Constructive = amplify, Destructive = cancel"
          }
        },
        {
          type: "concept",
          content: {
            title: "Resonance: Matching Frequencies",
            text: "System oscillates with maximum amplitude at natural frequency. Wine glass shatters when sound frequency matches glass's natural frequency — resonance. Bridge collapses if wind creates resonance. Musical instruments use resonance (string, air column). Potentially destructive (structures) or useful (music, MRI).",
            highlight: "Resonance = maximum energy transfer",
            emoji: "ↈ🎶",
            formula: "Drive at natural frequency → large amplitude"
          }
        },
        {
          type: "concept",
          content: {
            title: "Doppler Effect: Motion Changes Frequency",
            text: "Source moving toward you: waves compressed → higher frequency (ambulance siren pitch rises approaching). Moving away: waves stretched → lower frequency (pitch drops receding). Doppler shift: Δf/f ≈ v/c for sound, relativistic formula for light. How we measure star velocities (redshift/blueshift).",
            highlight: "Δf/f ≈ v/v_wave (Doppler)",
            emoji: "🚑🔊",
            formula: "Motion toward → higher f, away → lower f"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🧐🚓 Why does sound travel faster in solids than air?",
            text: "Wave speed depends on medium's stiffness and density: v = √(stiffness/density). Solids: atoms tightly bound (high stiffness). Air: molecules loosely connected. Sound in steel ≈ 5000 m/s. Sound in air ≈ 343 m/s. Tight atomic bonds transmit vibrations faster."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🗣📢 What's the loudest sound possible?",
            text: "Atmospheric pressure ≈ 101,325 Pa. Sound is pressure variation. Maximum variation = ±101,325 Pa → 194 dB (decibels). Above this, 'sound' becomes shock wave. Krakatoa eruption (1883) ≈ 180 dB, heard 3000 miles away. Anything >194 dB isn't sound — it's explosion."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Sound frequency 440 Hz, speed 343 m/s. What's wavelength λ?",
            options: [
              "λ = 0.78 m",
              "λ = 1.28 m",
              "λ = 343 m",
              "λ = 150,920 m"
            ],
            correct: 0,
            explanation: "v = λf, so λ = v/f = 343/440 ≈ 0.78 m. This is middle A on piano. Lower frequency → longer wavelength. Bass notes have wavelengths several meters."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Two waves arrive at point, both with amplitude A. If perfectly IN PHASE, what's resultant amplitude?",
            options: [
              "0 (cancel)",
              "A (unchanged)",
              "2A (double)",
              "A² (square)"
            ],
            correct: 2,
            explanation: "Constructive interference: in-phase waves ADD amplitudes. A + A = 2A. Energy increases 4× (intensity ∝ amplitude²). Destructive (out of phase) gives A − A = 0."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Waves = Energy Transfer Without Matter Transfer",
            text: "Waves carry energy through space via oscillations. Mechanical waves (sound) need medium; EM waves (light) don't. v = λf relates speed, wavelength, frequency. Interference creates patterns. Resonance amplifies at natural frequency. Doppler effect shifts frequency with motion. Understanding waves = understanding energy propagation.",
            keyTakeaway: "Waves obey v = λf. Interference can amplify or cancel. Resonance matches natural frequency. Doppler shifts frequency with relative motion."
          }
        }
      ]
    },

    {
      id: "electricity-and-magnetism",
      icon: "🌩🌩",
      title: "Electricity & Magnetism",
      subtitle: "Moving charges create magnetic fields — that's how motors work",
      duration: "5 min",
      difficulty: 2,
      steps: [
        {
          type: "hook",
          content: {
            title: "Every electric current creates a magnetic field",
            text: "Wire carrying current I generates circular magnetic field around it. That's electromagnetism — discovered by Ørsted (1820). Reverse also true: moving magnet through wire coil generates current (Faraday's induction). This symmetry powers generators, motors, transformers. Civilization runs on moving electrons creating moving magnetic fields.",
            emoji: "🔌🧲"
          }
        },
        {
          type: "concept",
          content: {
            title: "Electric Charge: Fundamental Property",
            text: "Charge comes in two types: positive (+) and negative (−). Like charges repel, opposite attract. Coulomb's law: F = kq₁q₂/r² where k = 8.99×10⁹ N·m²/C². Similar to gravity but 10³⁶× stronger. Electron charge: e = −1.6×10⁻¹⁹ C. Charge is quantized (comes in multiples of e) and conserved.",
            highlight: "F = kq₁q₂/r² (Coulomb's Law)",
            emoji: "⚛💫",
            formula: "Charge conserved, quantized"
          }
        },
        {
          type: "concept",
          content: {
            title: "Electric Current: Charge Flow",
            text: "Current I = charge/time (amperes). 1 A = 1 C/s. Direction: conventional current flows + to − (opposite electron flow). Ohm's Law: V = IR where V = voltage (electric potential difference), R = resistance. Voltage is 'pressure' pushing charges. Resistance opposes flow. Power dissipated: P = IV = I²R = V²/R.",
            highlight: "V = IR (Ohm's Law)",
            emoji: "🔋⚡",
            formula: "Current measures charge flow rate"
          }
        },
        {
          type: "concept",
          content: {
            title: "Magnetic Fields: Moving Charge",
            text: "Stationary charge creates electric field. Moving charge creates magnetic field. Field strength B measured in Tesla (T). Lorentz force on moving charge: F = qvB sinθ. Force perpendicular to both velocity and field — causes circular motion. Particle accelerators and mass spectrometers use this. Earth's magnetic field ≈ 50 μT protects from solar wind.",
            highlight: "F = qvB sinθ (Lorentz force)",
            emoji: "⚛🧲",
            formula: "Moving charge creates B field"
          }
        },
        {
          type: "concept",
          content: {
            title: "Electromagnetic Induction: Faraday's Law",
            text: "Changing magnetic flux through loop induces voltage: ε = −dΦ/dt where Φ = BA (magnetic flux). Moving magnet near coil → induced current. Negative sign (Lenz's law): induced current opposes change causing it. How generators work: rotate coil in magnetic field → changing flux → current. Transform kinetic → electrical energy.",
            highlight: "ε = −dΦ/dt (Faraday's Law)",
            emoji: "ↈ🧲⚡",
            formula: "Changing B field induces voltage"
          }
        },
        {
          type: "concept",
          content: {
            title: "Maxwell's Equations: Unifying EM",
            text: "Four equations describe all classical electromagnetism: (1) Gauss's law (electric flux), (2) No magnetic monopoles, (3) Faraday's law (induction), (4) Ampère-Maxwell law (magnetic field from current + changing E field). Together predict electromagnetic waves traveling at c. Light IS electromagnetic wave. Unification of electricity, magnetism, optics.",
            highlight: "Maxwell unified E, M, light",
            emoji: "💡🤝🧲",
            formula: "EM waves travel at c = 1/√(ε₀μ₀)"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤓 Why do magnets have North and South poles (no monopoles)?",
            text: "Unlike electric charges (exist isolated as + or −), magnetic poles ALWAYS come in pairs (N-S). Cut bar magnet in half → you get two smaller N-S magnets, never isolated N or S. Maxwell's equations forbid magnetic monopoles. Why? Deep connection to topology and quantum mechanics. Monopoles would revolutionize physics if discovered."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "⚡ Lightning carries ~30,000 amperes",
            text: "Typical lightning bolt: 30,000 A, 100 million volts, lasts ~0.2 seconds. Energy ≈ 1 billion joules (250 kWh). Temperature ≈ 30,000 K (5× Sun's surface). Why thunder? Rapid heating creates shock wave. Lightning is nature's massive current discharge between cloud and ground. Humans survive because current doesn't pass through heart long."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If voltage doubles and resistance stays same, current does what?",
            options: [
              "Halves",
              "Stays same",
              "Doubles",
              "Quadruples"
            ],
            correct: 2,
            explanation: "Ohm's Law: V = IR, so I = V/R. If V doubles and R constant, I must double. Current directly proportional to voltage when resistance fixed."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What happens when you move magnet through wire coil?",
            options: [
              "Nothing",
              "Coil heats up",
              "Current is induced in coil",
              "Magnet gets weaker"
            ],
            correct: 2,
            explanation: "Faraday's Law: changing magnetic flux induces voltage → current. Moving magnet changes flux through coil. This is basis for electrical generators — convert mechanical motion into electricity."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Electromagnetism = Unified Force",
            text: "Electric charges create fields (Coulomb). Moving charges create current (I = Q/t). Current creates magnetic field. Changing magnetic field induces voltage (Faraday). Maxwell unified electricity, magnetism, light into single framework. V = IR governs circuits. F = qvB governs charged particle motion. EM powers modern civilization.",
            keyTakeaway: "Electricity and magnetism are two aspects of single electromagnetic force. Moving E creates M, changing M creates E. Light is EM wave."
          }
        }
      ]
    },

    {
      id: "black-holes",
      icon: "🕳♨",
      title: "Black Holes",
      subtitle: "Time stops at the event horizon",
      duration: "5 min",
      difficulty: 3,
      steps: [
        {
          type: "hook",
          content: {
            title: "At event horizon, time literally stops (from outside view)",
            text: "General relativity: massive gravity warps spacetime. At Schwarzschild radius r_s = 2GM/c², escape velocity equals c. Watch someone fall in — they appear to freeze, redshift to invisibility as time dilation approaches infinity. For falling person, they cross horizon in finite proper time. Time itself becomes relative near black hole.",
            emoji: "⌛🕛"
          }
        },
        {
          type: "concept",
          content: {
            title: "Formation: Stellar Collapse",
            text: "Star with M > 20 M_☉ (Mass of sun) exhausts fusion fuel → core collapses. If remnant mass > 3 M_☉ (Tolman-Oppenheimer-Volkoff limit), gravity overcomes neutron degeneracy pressure → collapse to singularity. No known force can stop it. Schwarzschild radius: r_s = 2GM/c². For Sun: r_s = 3 km. For Earth: r_s = 9 mm.",
            highlight: "r_s = 2GM/c² (Schwarzschild radius)",
            emoji: "🌟💥",
            formula: "Event horizon radius"
          }
        },
        {
          type: "concept",
          content: {
            title: "Event Horizon: Point of No Return",
            text: "Boundary where escape velocity = c. Inside: all future worldlines lead to singularity (spacetime geometry itself). Light emitted inward at horizon stays at horizon (frozen from outside observer). Area theorem: event horizon area never decreases (Hawking). Analogous to entropy → black hole thermodynamics. Surface gravity κ = c⁴/4GM.",
            highlight: "Inside horizon: all paths lead to singularity",
            emoji: "🕳",
            formula: "Escape velocity at r_s equals c"
          }
        },
        {
          type: "concept",
          content: {
            title: "Singularity: Infinite Density",
            text: "At center: all mass compressed to point of infinite density, infinite curvature. General relativity predicts singularity but also breaks down there (quantum effects dominate at Planck scale ℓ_P = 1.6×10⁻³⁵ m). What happens at singularity? Unknown. Need quantum gravity theory. String theory, loop quantum gravity attempt to resolve.",
            highlight: "Singularity: where GR breaks down",
            emoji: "⚫⨀",
            formula: "Density → ∞, curvature → ∞"
          }
        },
        {
          type: "concept",
          content: {
            title: "Tidal Forces: Spaghettification",
            text: "Gradient in gravitational field stretches objects radially. Difference in force between head and feet: ΔF ≈ 2GM m h/r³ where h = height. For stellar black hole (M ≈ 10 M_☉), spaghettification begins BEFORE horizon. For supermassive (M ≈ 10⁹ M_☉), can cross horizon intact, spaghettified later. Tidal force ∝ M/r³.",
            highlight: "Tidal force ∝ M/r³",
            emoji: "🍝",
            formula: "Larger BH → weaker tides at horizon"
          }
        },
        {
          type: "concept",
          content: {
            title: "Hawking Radiation: Black Holes Evaporate",
            text: "Quantum field theory near horizon: virtual particle pairs appear. One escapes, one falls in. Net effect: black hole radiates. Temperature T_H = ℏc³/8πGM k_B. Smaller black holes hotter. Stellar black hole: T ≈ 60 nanokelvin. Evaporation time t ≈ M³. Solar-mass BH: 10⁶⁷ years. Micro black holes: evaporate explosively.",
            highlight: "T_H ∝ 1/M (Hawking temperature)",
            emoji: "🕳♨",
            formula: "Black holes evaporate via quantum effects"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "📸First direct image of black hole: M87* (2019)",
            text: "Event Horizon Telescope: Earth-sized radio interferometer imaged supermassive black hole (M = 6.5 billion M_☉) in galaxy M87, 55 million light-years away. Resolved event horizon shadow (diameter ~40 billion km). Photon ring: light orbiting at 1.5 r_s. Direct visual confirmation of general relativity predictions."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "🤔 What if you fell into black hole?",
            text: "Two perspectives. Outside observer: you slow down, redshift, appear to freeze at horizon forever. Your perspective: finite proper time to cross horizon, then reach singularity in ~10⁻⁵ sec (for solar-mass BH). You see outside universe blueshifted, sped up. No firewall at horizon (equivalence principle) — cross smoothly."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If black hole doubles its mass, event horizon radius does what?",
            options: [
              "Doubles",
              "Quadruples",
              "Stays same",
              "Halves"
            ],
            correct: 0,
            explanation: "r_s = 2GM/c². Radius directly proportional to mass. Double M → double r_s. Area increases 4× (A = 4πr_s²), consistent with area theorem and entropy."
          }
        },
        {
          type: "quiz",
          content: {
            question: "Hawking radiation temperature depends on mass how?",
            options: [
              "T ∝ M",
              "T ∝ M²",
              "T ∝ 1/M",
              "T independent of M"
            ],
            correct: 2,
            explanation: "T_H ∝ 1/M. More massive black holes are COLDER. Stellar BH ≈ nanokelvin. Primordial micro-BH could be extremely hot, evaporating explosively. Inverse relationship from quantum gravity."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Black Holes = Spacetime Singularities",
            text: "Formed from stellar collapse when M > 3 M_☉. Event horizon at r_s = 2GM/c² is point of no return. Singularity at center where GR breaks down. Tidal forces spaghettify. Hawking radiation causes eventual evaporation. Time dilation extreme near horizon. Direct imaging confirms predictions. Black holes are laboratories for extreme physics.",
            keyTakeaway: "Black holes are regions where gravity warps spacetime so severely that escape is impossible. Event horizon marks boundary, singularity is center."
          }
        }
      ]
    },

    {
      id: "quantum-mechanics",
      icon: "⚛⚛",
      title: "Quantum Mechanics",
      subtitle: "Particles don't have definite properties until you measure them",
      duration: "5 min",
      difficulty: 4,
      steps: [
        {
          type: "hook",
          content: {
            title: "An electron doesn't have a position until you measure it",
            text: "Classical physics: objects have definite position and momentum always. Quantum mechanics: particle described by wavefunction ψ. |ψ|² gives probability of finding particle at location. No definite position until measurement — only probability distribution. Heisenberg uncertainty: Δx Δp ≥ ℏ/2. Can't know both position and momentum precisely.",
            emoji: "🤪⚛"
          }
        },
        {
          type: "concept",
          content: {
            title: "Wave-Particle Duality",
            text: "All matter exhibits wave and particle properties. Light: acts as wave (interference) and particle (photoelectric effect). Electrons: diffract like waves (double-slit) but detected as particles. de Broglie wavelength: λ = h/p. Higher momentum → shorter wavelength. Macroscopic objects: wavelength too small to observe. Quantum effects dominate at atomic scales.",
            highlight: "λ = h/p (de Broglie)",
            emoji: "ↈ⚛",
            formula: "All matter has wave properties"
          }
        },
        {
          type: "concept",
          content: {
            title: "Superposition: Multiple States Simultaneously",
            text: "Quantum system can exist in linear combination of states: |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. Electron spin: simultaneously up AND down until measured. Double-slit: particle goes through BOTH slits. Measurement collapses superposition → single eigenstate. Probability |α|² for state |0⟩, |β|² for |1⟩.",
            highlight: "|ψ⟩ = α|0⟩ + β|1⟩ (superposition)",
            emoji: "🔥⚛ = 🧊⚛",
            formula: "Quantum states can be in multiple states"
          }
        },
        {
          type: "concept",
          content: {
            title: "Heisenberg Uncertainty Principle",
            text: "Fundamental limit on precision of complementary measurements: Δx Δp ≥ ℏ/2 (position-momentum), ΔE Δt ≥ ℏ/2 (energy-time). Not measurement limitation — intrinsic to nature. Can't prepare particle with definite x and p. Narrow position wavefunction → broad momentum distribution. Consequence of wave nature and Fourier analysis.",
            highlight: "Δx Δp ≥ ℏ/2",
            emoji: "🐱‍👤⚛",
            formula: "Fundamental precision limit"
          }
        },
        {
          type: "concept",
          content: {
            title: "Quantum Entanglement",
            text: "Two particles in entangled state: |ψ⟩ = (|↑↓⟩ − |↓↑⟩)/√2. Measure first particle spin → instantly know second particle spin, regardless of distance. Einstein's 'spooky action'. Bell's theorem (1964): no local hidden variable theory can reproduce quantum predictions. Entanglement verified experimentally (Nobel 2022). Used in quantum computing, cryptography.",
            highlight: "Entanglement = non-local correlations",
            emoji: "🔗⚛",
            formula: "Bell inequality violations prove QM"
          }
        },
        {
          type: "concept",
          content: {
            title: "Schrödinger Equation: Time Evolution",
            text: "Governs how quantum state evolves: iℏ ∂ψ/∂t = Ĥψ where Ĥ = Hamiltonian (energy operator). Deterministic evolution of wavefunction. Time-independent: Ĥψ = Eψ (eigenvalue equation). Solutions give energy levels. Hydrogen atom: E_n = −13.6 eV/n². Explains atomic spectra, chemical bonding, solid-state physics. Foundation of quantum chemistry.",
            highlight: "iℏ ∂ψ/∂t = Ĥψ",
            emoji: "🙀⚛👻",
            formula: "Quantum state evolution equation"
          }
        },
        {
          type: "curiosity",
          content: {
            title: "⚛🧙‍♂️ Quantum tunneling: particles pass through barriers",
            text: "Classical: particle with E < V_barrier reflects. Quantum: wavefunction decays exponentially in barrier but non-zero beyond. Transmission probability: T ∝ exp(−2κa) where κ ∝ √(V−E), a = barrier width. Alpha decay, scanning tunneling microscope, semiconductor devices use tunneling. Particles don't 'go over' barrier — they tunnel THROUGH."
          }
        },
        {
          type: "curiosity",
          content: {
            title: "📏🧐Does measurement 'create' reality?",
            text: "Measurement problem: wavefunction collapse not described by Schrödinger equation. Copenhagen interpretation: measurement causes collapse. Many-worlds: all outcomes occur, universe branches. Decoherence: entanglement with environment causes apparent collapse. No consensus on interpretation. All agree on predictions, disagree on meaning."
          }
        },
        {
          type: "quiz",
          content: {
            question: "If you measure particle's position very precisely, what happens to momentum uncertainty?",
            options: [
              "Momentum uncertainty decreases",
              "Momentum uncertainty stays same",
              "Momentum uncertainty increases",
              "Momentum becomes zero"
            ],
            correct: 2,
            explanation: "Δx Δp ≥ ℏ/2. If Δx decreases (precise position), Δp must increase to maintain inequality. Precise position → uncertain momentum. Fundamental trade-off, not measurement error."
          }
        },
        {
          type: "quiz",
          content: {
            question: "What does wavefunction |ψ|² represent?",
            options: [
              "Particle's definite position",
              "Probability density of finding particle",
              "Particle's energy",
              "Particle's velocity"
            ],
            correct: 1,
            explanation: "|ψ(x)|² dx = probability of finding particle in interval [x, x+dx]. Born rule: wavefunction squared gives probability density. Particle doesn't have definite position — only probability distribution until measured."
          }
        },
        {
          type: "conclusion",
          content: {
            title: "Quantum Mechanics = Probabilistic Physics",
            text: "Particles exhibit wave-particle duality (λ = h/p). Superposition allows multiple states simultaneously. Heisenberg uncertainty (Δx Δp ≥ ℏ/2) limits precision. Entanglement creates non-local correlations. Schrödinger equation governs evolution. Measurement collapses wavefunction. QM revolutionized understanding of atomic/molecular/solid-state physics. Foundation of modern technology.",
            keyTakeaway: "At quantum scale, determinism replaced by probability. Particles lack definite properties until measured. Uncertainty fundamental, not technological."
          }
        }
      ]
    }
  ]
};

console.log('✅ science-lessons.js loaded:', scienceLessons.lessons.length, 'lessons');
