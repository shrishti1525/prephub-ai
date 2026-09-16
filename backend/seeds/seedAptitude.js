const AptitudeQuestion = require("../models/AptitudeQuestion");

const sampleQuestions = [
  // Quantitative Aptitude
  {
    category: "Quantitative",
    topic: "Time and Work",
    difficulty: "Easy",
    question: "A can complete a piece of work in 12 days and B can complete the same work in 24 days. Working together, in how many days will they finish the work?",
    options: ["6 days", "8 days", "10 days", "16 days"],
    correctOptionIndex: 1,
    explanation: "A's 1-day work = 1/12. B's 1-day work = 1/24. Combined 1-day work = 1/12 + 1/24 = 3/24 = 1/8. Hence, together they take 8 days."
  },
  {
    category: "Quantitative",
    topic: "Speed, Distance & Time",
    difficulty: "Medium",
    question: "A train running at 72 km/h crosses a 200m long platform in 22 seconds. What is the length of the train?",
    options: ["220 m", "240 m", "260 m", "280 m"],
    correctOptionIndex: 1,
    explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance in 22 seconds = 20 * 22 = 440 m. Train length = Total distance - platform length = 440 - 200 = 240 m."
  },
  {
    category: "Quantitative",
    topic: "Profit and Loss",
    difficulty: "Medium",
    question: "A shopkeeper sells an article at 20% profit. If the cost price increases by 10% and selling price increases by 8%, what is the new profit percentage?",
    options: ["15.4%", "17.8%", "18.2%", "20.0%"],
    correctOptionIndex: 1,
    explanation: "Let CP = 100, SP = 120. New CP = 110. New SP = 120 * 1.08 = 129.6. Profit = 129.6 - 110 = 19.6. Profit % = (19.6 / 110) * 100 ≈ 17.82%."
  },
  {
    category: "Quantitative",
    topic: "Percentages & Ratio",
    difficulty: "Easy",
    question: "In an exam, 35% students failed in Math and 42% failed in English. If 15% failed in both, what percentage passed in both subjects?",
    options: ["38%", "42%", "48%", "52%"],
    correctOptionIndex: 0,
    explanation: "Total failed in at least one subject = 35 + 42 - 15 = 62%. Students passed in both = 100 - 62 = 38%."
  },
  {
    category: "Quantitative",
    topic: "Permutations & Combinations",
    difficulty: "Hard",
    question: "In how many distinct ways can the letters of the word 'LEADER' be arranged such that the vowels always appear together?",
    options: ["72", "144", "120", "48"],
    correctOptionIndex: 0,
    explanation: "Vowels in LEADER are E, A, E (3 vowels with two E's). Treat (E,A,E) as one unit. Remaining letters: L, D, R (3 consonants). Total units = 3 + 1 = 4 units arranged in 4! ways = 24. Within the vowel unit: 3! / 2! = 3 ways. Total arrangements = 24 * 3 = 72."
  },

  // Logical Reasoning
  {
    category: "Logical",
    topic: "Number Series",
    difficulty: "Easy",
    question: "Find the next number in the series: 3, 7, 15, 31, 63, ?",
    options: ["95", "111", "127", "129"],
    correctOptionIndex: 2,
    explanation: "Pattern is (n * 2) + 1. 3*2+1=7; 7*2+1=15; 15*2+1=31; 31*2+1=63; 63*2+1=127."
  },
  {
    category: "Logical",
    topic: "Blood Relations",
    difficulty: "Medium",
    question: "Pointing to a photograph, a woman says: 'He is the son of the only daughter of the father of my brother.' How is the man related to the woman?",
    options: ["Brother", "Son", "Nephew", "Uncle"],
    correctOptionIndex: 1,
    explanation: "'Father of my brother' = woman's father. 'Only daughter of my father' = the woman herself. 'Son of the woman' = her son."
  },
  {
    category: "Logical",
    topic: "Syllogisms",
    difficulty: "Medium",
    question: "Statements: All laptops are electronic. Some electronic devices are portable. Conclusions: I. Some laptops are portable. II. All portable items are electronic.",
    options: ["Only I follows", "Only II follows", "Neither I nor II follows", "Both I and II follow"],
    correctOptionIndex: 2,
    explanation: "Laptops and portable devices are not necessarily connected; some electronic devices being portable doesn't mean laptops must be portable, nor does it mean all portable devices are electronic."
  },
  {
    category: "Logical",
    topic: "Direction Sense",
    difficulty: "Easy",
    question: "Rohan walks 10m North, turns right and walks 15m, turns right again and walks 10m, and finally turns left and walks 5m. How far is he from his starting point?",
    options: ["15 m", "20 m", "25 m", "30 m"],
    correctOptionIndex: 1,
    explanation: "North 10m and South 10m cancel each other out on the vertical axis. East movement = 15m + 5m = 20m. Distance = 20m East."
  },
  {
    category: "Logical",
    topic: "Coding-Decoding",
    difficulty: "Medium",
    question: "If 'CAMPUS' is coded as 'EDORWU', how is 'OFFER' coded in that language?",
    options: ["QHHGT", "QGHHT", "PGGHT", "QHHTG"],
    correctOptionIndex: 0,
    explanation: "Each letter is shifted forward by +2 positions in the alphabet. O(+2)->Q, F(+2)->H, F(+2)->H, E(+2)->G, R(+2)->T = QHHGT."
  },

  // Verbal Ability
  {
    category: "Verbal",
    topic: "Sentence Correction",
    difficulty: "Medium",
    question: "Identify the grammatically correct sentence:",
    options: [
      "Neither the manager nor the employees was present at the review meeting.",
      "Neither the manager nor the employees were present at the review meeting.",
      "Neither the manager or the employees was present at the review meeting.",
      "Neither the manager nor the employees has been present at the review meeting."
    ],
    correctOptionIndex: 1,
    explanation: "In 'Neither... nor' constructions, the verb agrees with the subject closest to it. Here, 'employees' is plural, so 'were' is correct."
  },
  {
    category: "Verbal",
    topic: "Vocabulary & Synonyms",
    difficulty: "Easy",
    question: "Choose the word most nearly SYNONYMOUS to 'PRAGMATIC':",
    options: ["Theoretical", "Realistic", "Arrogant", "Fictional"],
    correctOptionIndex: 1,
    explanation: "'Pragmatic' means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations."
  },
  {
    category: "Verbal",
    topic: "Antonyms",
    difficulty: "Easy",
    question: "Choose the word most nearly OPPOSITE in meaning to 'EPHEMERAL':",
    options: ["Transient", "Fleeting", "Permanent", "Obscure"],
    correctOptionIndex: 2,
    explanation: "'Ephemeral' means lasting for a very short time. The opposite is 'Permanent'."
  },
  {
    category: "Verbal",
    topic: "Idioms & Phrases",
    difficulty: "Medium",
    question: "What is the meaning of the idiom: 'To burn the candle at both ends'?",
    options: [
      "To be overly extravagant with money",
      "To work excessively hard from early morning until late night",
      "To cause an irrecoverable disaster",
      "To waste resources carelessly"
    ],
    correctOptionIndex: 1,
    explanation: "To burn the candle at both ends means to exhaust one's energy by working very late and getting up very early."
  },
  {
    category: "Verbal",
    topic: "Para Jumbles",
    difficulty: "Hard",
    question: "Arrange into a coherent paragraph:\nP: This results in high scalability for enterprise workloads.\nQ: Modern cloud architectures decouple computing power from storage.\nR: Because independent scaling optimizes server utilization and cost.\nS: As a result, businesses only pay for the active compute time.",
    options: ["Q-R-P-S", "Q-P-R-S", "R-Q-P-S", "P-Q-S-R"],
    correctOptionIndex: 1,
    explanation: "Q introduces the core premise (decoupling compute and storage). P follows logically explaining the architectural result (high scalability). R gives the rationale (independent scaling), and S concludes with financial benefits."
  }
];

async function seedAptitudeData() {
  try {
    const count = await AptitudeQuestion.countDocuments();
    if (count === 0) {
      await AptitudeQuestion.insertMany(sampleQuestions);
      console.log(`Seeded ${sampleQuestions.length} aptitude questions successfully.`);
    }
  } catch (err) {
    console.error("Error seeding aptitude data:", err.message);
  }
}

module.exports = { seedAptitudeData };
