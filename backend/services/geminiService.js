/**
 * PrepHub AI - Gemini AI Service
 * Supports Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
 * with robust offline simulation fallback so the platform always works.
 */

// Role-specific placement keywords
const ROLE_KEYWORDS = {
  frontend: [
    "React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Redux", "Tailwind",
    "Next.js", "REST APIs", "Webpack", "Vite", "Responsive Design", "Performance Optimization",
    "State Management", "Jest", "Unit Testing", "Git"
  ],
  backend: [
    "Node.js", "Express", "MongoDB", "Mongoose", "PostgreSQL", "MySQL", "RESTful APIs",
    "JWT", "Authentication", "Bcrypt", "Microservices", "Redis", "Docker", "System Design",
    "Database Indexing", "Caching", "Git"
  ],
  fullstack: [
    "React", "Node.js", "Express", "MongoDB", "MERN", "JavaScript", "REST APIs",
    "JWT", "Git", "System Design", "Responsive UI", "State Management", "CI/CD",
    "Database Modeling", "SQL", "Cloud Deployment"
  ],
  sde: [
    "Data Structures", "Algorithms", "Java", "C++", "Python", "OOPs", "DBMS",
    "Operating Systems", "Computer Networks", "System Design", "SQL", "Git",
    "Time Complexity", "Dynamic Programming", "Graphs", "Problem Solving"
  ],
  data: [
    "Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Scikit-Learn",
    "Data Visualization", "Tableau", "PowerBI", "Statistics", "Data Cleaning",
    "Exploratory Data Analysis", "Feature Engineering"
  ]
};

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // Triggers fallback
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      console.warn("Gemini API call returned status:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn("Gemini API error:", err.message);
    return null;
  }
}

/**
 * Analyze Resume against a Target Role
 */
async function analyzeResume(resumeText, targetRole) {
  const normalizedRole = (targetRole || "Software Development Engineer").toLowerCase();
  
  // Try Gemini live first
  const prompt = `
You are an expert technical recruiter and ATS scanner for campus placements.
Analyze the following resume text for the role of "${targetRole}":
Resume Content:
"""
${resumeText.slice(0, 4000)}
"""

Respond ONLY in valid JSON format with this exact structure:
{
  "atsScore": <number between 40 and 95>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "suggestions": [
    "<actionable suggestion 1 with XYZ formula>",
    "<actionable suggestion 2 on technical skills>",
    "<actionable suggestion 3 on project metrics>"
  ],
  "categoryScores": {
    "skillsMatch": <number 50-98>,
    "experienceImpact": <number 50-98>,
    "readability": <number 60-98>
  }
}
`;

  const geminiResponse = await callGemini(prompt);
  if (geminiResponse) {
    try {
      // Clean possible markdown code fences
      const cleaned = geminiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (e) {
      console.warn("Failed to parse Gemini response as JSON, falling back to smart simulation");
    }
  }

  // Smart Offline Fallback Analyzer
  return simulateAtsAnalysis(resumeText, normalizedRole);
}

function simulateAtsAnalysis(text, roleKey) {
  let keyList = ROLE_KEYWORDS.sde;
  if (roleKey.includes("front")) keyList = ROLE_KEYWORDS.frontend;
  else if (roleKey.includes("back")) keyList = ROLE_KEYWORDS.backend;
  else if (roleKey.includes("full") || roleKey.includes("mern") || roleKey.includes("web")) keyList = ROLE_KEYWORDS.fullstack;
  else if (roleKey.includes("data") || roleKey.includes("ml") || roleKey.includes("ai")) keyList = ROLE_KEYWORDS.data;

  const textLower = text.toLowerCase();
  const matchedKeywords = [];
  const missingKeywords = [];

  keyList.forEach((kw) => {
    if (textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Calculate score based on keyword match ratio and metrics
  const hasMetrics = /\d+%|\d+x|\$\d+|\b\d+\s*(users|requests|ms|seconds|records|stars)/i.test(text);
  const hasActionVerbs = /\b(built|designed|implemented|optimized|developed|architected|deployed|reduced|scaled)\b/i.test(text);

  let skillsScore = Math.min(95, Math.max(45, Math.round((matchedKeywords.length / keyList.length) * 100)));
  let impactScore = (hasMetrics ? 82 : 62) + (hasActionVerbs ? 10 : 0);
  let readabilityScore = text.length > 500 && text.length < 5000 ? 88 : 70;

  const atsScore = Math.round((skillsScore * 0.5) + (impactScore * 0.3) + (readabilityScore * 0.2));

  const strengths = [];
  if (matchedKeywords.length > 0) {
    strengths.push(`Identified core placement tech skills: ${matchedKeywords.slice(0, 4).join(", ")}`);
  }
  if (hasActionVerbs) {
    strengths.push("Good use of active engineering action verbs (e.g., built, designed, optimized)");
  } else {
    strengths.push("Clear formatting structure and project breakdown");
  }
  if (hasMetrics) {
    strengths.push("Includes quantifiable impact and numerical metrics in project descriptions");
  } else {
    strengths.push("Direct mapping of relevant academic coursework and project experience");
  }

  const suggestions = [
    hasMetrics
      ? "Ensure all bullet points follow Google's X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'"
      : "Add quantifiable metrics to your projects (e.g. 'Improved API latency by 35%', 'handled 500+ requests')",
    missingKeywords.length > 0
      ? `Incorporate industry-standard keywords like ${missingKeywords.slice(0, 3).join(", ")} into your projects or skills section.`
      : "Highlight GitHub repo links and live demo links for all top capstone projects.",
    "Keep bullet points concise (1 to 2 lines max) with high impact technical terminology."
  ];

  return {
    atsScore,
    strengths,
    missingKeywords: missingKeywords.slice(0, 6),
    suggestions,
    categoryScores: {
      skillsMatch: skillsScore,
      experienceImpact: impactScore,
      readability: readabilityScore
    }
  };
}

/**
 * Generate DSA Problem Hints & Approach
 */
async function getDsaHint(problemTitle, topic, difficulty) {
  const prompt = `
You are a top LeetCode & DSA interview mentor.
Provide an intelligent hint, optimal approach, and complexity analysis for:
Problem: "${problemTitle}"
Topic: "${topic}"
Difficulty: "${difficulty}"

Do NOT write full copy-paste code. Help the student think and solve it.
Respond ONLY in valid JSON format:
{
  "intuition": "<1-2 sentence core mental model>",
  "optimalApproach": "<Step-by-step breakdown of the optimal algorithm>",
  "recommendedDataStructure": "<e.g., Monotonic Stack, Min-Heap, Trie, Two Pointers>",
  "timeComplexity": "<e.g., O(N log N)>",
  "spaceComplexity": "<e.g., O(1) or O(N)>",
  "commonPitfall": "<A typical edge case students fail on>"
}
`;

  const geminiResponse = await callGemini(prompt);
  if (geminiResponse) {
    try {
      const cleaned = geminiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse Gemini DSA response, falling back to simulated hint");
    }
  }

  // Simulated fallback
  return simulateDsaHint(problemTitle, topic, difficulty);
}

function simulateDsaHint(title, topic, difficulty) {
  const lowerTopic = (topic || "").toLowerCase();

  let approach = "Start by breaking down the input constraints to determine acceptable time complexity.";
  let ds = "Hash Map / Two Pointers";
  let time = "O(N)";
  let space = "O(N)";
  let pitfall = "Watch out for empty inputs, single element lists, and integer overflow.";

  if (lowerTopic.includes("array") || lowerTopic.includes("string")) {
    approach = "1. Consider if sorting helps, or if a Frequency Map / Two Pointers can reduce quadratic loops.\n2. In-place pointer manipulation or prefix sums can solve subarray sum variants in linear time.";
    ds = "Two Pointers / Frequency Array";
    time = "O(N)";
    space = "O(1) or O(K)";
    pitfall = "Off-by-one indexing, empty strings, duplicate elements.";
  } else if (lowerTopic.includes("tree") || lowerTopic.includes("bst")) {
    approach = "1. Determine if the problem is bottom-up (post-order DFS returning height/sum) or top-down (pre-order passing bounds).\n2. For level-order questions, use BFS with a Queue and queue.length per level.";
    ds = "Recursion Stack / Queue (BFS)";
    time = "O(N)";
    space = "O(H) where H is tree height";
    pitfall = "Null root check, skewed tree recursion depth exceeding stack limit.";
  } else if (lowerTopic.includes("graph")) {
    approach = "1. Model the problem as vertices and edges.\n2. Use BFS for shortest path in unweighted graphs, Dijkstra for weighted, and DFS / Union-Find for connected components or cycle detection.";
    ds = "Adjacency List + Visited Set";
    time = "O(V + E)";
    space = "O(V + E)";
    pitfall = "Disconnected graph components, cycles causing infinite loops if visited set is omitted.";
  } else if (lowerTopic.includes("dp") || lowerTopic.includes("dynamic")) {
    approach = "1. Define the state: dp[i] = optimal solution up to index i.\n2. Find recurrence relation by expressing choice at step i.\n3. Base cases: initialize dp[0]. Optimize space to O(1) if only previous row/step is needed.";
    ds = "1D / 2D DP Array";
    time = "O(N) or O(N*M)";
    space = "O(N) or O(1) space-optimized";
    pitfall = "Incorrect base case initialization and state transition order.";
  } else if (lowerTopic.includes("stack") || lowerTopic.includes("queue")) {
    approach = "1. If finding next greater/smaller element, maintain a Monotonic Stack.\n2. Push indices onto stack rather than values to track distances effortlessly.";
    ds = "Monotonic Stack";
    time = "O(N)";
    space = "O(N)";
    pitfall = "Not clearing or handling remaining elements left in the stack.";
  }

  return {
    intuition: `For "${title}", the key pattern often lies in ${lowerTopic || "fundamental data structures"} avoiding brute-force O(N²) iterations.`,
    optimalApproach: approach,
    recommendedDataStructure: ds,
    timeComplexity: time,
    spaceComplexity: space,
    commonPitfall: pitfall
  };
}

/**
 * Generate Personalized AI Placement Study Plan
 */
async function generatePersonalizedPlan({ targetRole, durationDays, hoursPerDay, currentStats }) {
  const days = durationDays === 30 ? 30 : 7;
  const hours = hoursPerDay || 3;
  const role = targetRole || "Software Development Engineer";
  const {
    totalProblems = 0,
    solvedTopics = [],
    difficultyBreakdown = { Easy: 0, Medium: 0, Hard: 0 },
    aptitudeAverage = 0,
    aptitudeWeakest = "Quantitative",
    resumeAtsScore = 0
  } = currentStats || {};

  const prompt = `
You are a principal technical hiring coach and placement director.
Analyze this candidate's preparation data for the target role "${role}":
- Total DSA Problems Solved: ${totalProblems} (Easy: ${difficultyBreakdown.Easy || 0}, Medium: ${difficultyBreakdown.Medium || 0}, Hard: ${difficultyBreakdown.Hard || 0})
- Covered Topics: ${solvedTopics.join(", ") || "None recorded"}
- Placement Aptitude Average Accuracy: ${aptitudeAverage}% (Weakest area: ${aptitudeWeakest})
- Resume ATS Score: ${resumeAtsScore ? resumeAtsScore + "/100" : "Unscanned"}
- Candidate's Sprint Horizon: ${days} Days (${hours} hours of study per day)

Generate an aggressive, highly specific ${days}-day roadmap.
Respond ONLY with valid JSON with this exact structure:
{
  "diagnostics": {
    "dsaGaps": ["<specific gap 1>", "<specific gap 2>"],
    "aptitudeGaps": ["<specific gap 1>", "<specific gap 2>"],
    "resumeStatus": "<1 sentence assessment of resume readiness>",
    "keyAdvice": "<1-2 sentence high impact placement strategy>"
  },
  "dailySchedule": [
    {
      "dayNumber": 1,
      "title": "<Focus topic of the day>",
      "dsaTask": "<Specific problem pattern and 2 problems to solve>",
      "aptitudeTask": "<Specific aptitude subtopic to drill for 20 mins>",
      "coreCsTask": "<Core CS/System Design/HR concept to master>"
    }
  ]
}
Ensure dailySchedule has exactly ${days} entries numbered 1 to ${days}.
`;

  const geminiResponse = await callGemini(prompt);
  if (geminiResponse) {
    try {
      const cleaned = geminiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.dailySchedule && Array.isArray(parsed.dailySchedule)) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse Gemini Study Plan, falling back to simulated planner");
    }
  }

  return simulateStudyPlan({ role, days, hours, totalProblems, solvedTopics, aptitudeWeakest, resumeAtsScore });
}

function simulateStudyPlan({ role, days, hours, totalProblems, solvedTopics, aptitudeWeakest, resumeAtsScore }) {
  const templateDays = [
    {
      title: "Arrays & Two Pointers Mastery",
      dsaTask: "Solve 2 Medium Two-Pointer problems: Container With Most Water, 3Sum",
      aptitudeTask: "20 mins on Speed, Time & Distance shortcut formulas",
      coreCsTask: "Revise Process vs Thread and CPU Scheduling algorithms (OS)"
    },
    {
      title: "Sliding Window & Substring Patterns",
      dsaTask: "Solve Longest Substring Without Repeating Characters and Minimum Window Substring",
      aptitudeTask: "15 mins on Time & Work unitary method problems",
      coreCsTask: "Revise Indexing, B-Trees vs Hash Indexing, and ACID properties (DBMS)"
    },
    {
      title: "Fast & Slow Pointers and Linked Lists",
      dsaTask: "Solve Linked List Cycle II and Reverse Nodes in k-Group",
      aptitudeTask: "20 mins on Blood Relations and Family Tree mapping (Logical)",
      coreCsTask: "Revise TCP vs UDP, 3-Way Handshake, and OSI Layers (Networks)"
    },
    {
      title: "Trees & Binary Search Trees (DFS/BFS)",
      dsaTask: "Solve Lowest Common Ancestor and Level Order Traversal (BFS)",
      aptitudeTask: "15 mins on Syllogisms and Venn diagram deduction (Logical)",
      coreCsTask: "Revise OOPs 4 Pillars (Polymorphism, Inheritance, Encapsulation, Abstraction) with code examples"
    },
    {
      title: "Monotonic Stack & Heap / Priority Queue",
      dsaTask: "Solve Daily Temperatures and Top K Frequent Elements",
      aptitudeTask: "20 mins on Profit & Loss and Percentage change tricks",
      coreCsTask: "Revise REST architectural constraints, idempotency, and HTTP status codes"
    },
    {
      title: "Dynamic Programming Foundations",
      dsaTask: "Solve House Robber and Longest Common Subsequence (LCS)",
      aptitudeTask: "15 mins on Sentence Correction and Subject-Verb agreement rules (Verbal)",
      coreCsTask: "Prepare Top 3 behavioral stories using STAR method (Situation, Task, Action, Result)"
    },
    {
      title: "Mock Assessment & Full Sprint Review",
      dsaTask: "Take a timed 60-minute mock test with 2 mixed LeetCode Medium questions",
      aptitudeTask: "Full 20-question mixed placement aptitude diagnostic test",
      coreCsTask: "Final resume audit on PrepHub AI ATS scanner to ensure 75+ match score"
    }
  ];

  const schedule = [];
  for (let i = 1; i <= days; i++) {
    const template = templateDays[(i - 1) % templateDays.length];
    schedule.push({
      dayNumber: i,
      title: `Day ${i}: ${template.title}`,
      dsaTask: template.dsaTask,
      aptitudeTask: template.aptitudeTask,
      coreCsTask: template.coreCsTask,
      completed: false
    });
  }

  const dsaGaps = [];
  if (totalProblems < 10) dsaGaps.push("Need higher problem volume in Trees and Graph traversals");
  if (!solvedTopics.includes("Dynamic Programming")) dsaGaps.push("Zero Dynamic Programming problems tracked yet");
  if (dsaGaps.length === 0) dsaGaps.push("Focus on transitioning from Medium to Hard problem patterns");

  const aptitudeGaps = [
    `Low confidence detected in ${aptitudeWeakest || "Quantitative"} aptitude`,
    "Improve test time management: aim for < 60 seconds per question"
  ];

  const resumeStatus = resumeAtsScore > 75
    ? "Resume is in strong placement shape (Score: " + resumeAtsScore + "/100). Focus heavily on technical problem solving."
    : "Resume needs optimization for ATS filters. Add quantifiable impact metrics and key technical placement keywords.";

  const keyAdvice = `Dedicate ${hours} focused hours daily without distractions. Alternate between 1 hour of DSA problem solving and 45 mins of aptitude/CS fundamentals.`;

  return {
    diagnostics: {
      dsaGaps,
      aptitudeGaps,
      resumeStatus,
      keyAdvice
    },
    dailySchedule: schedule
  };
}

module.exports = {
  analyzeResume,
  getDsaHint,
  generatePersonalizedPlan
};
