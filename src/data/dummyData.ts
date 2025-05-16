import { DiagnosticTest, PracticeTest, DrillCategory, TestResult, Question } from "../types";

// Dummy Diagnostic Tests
export const diagnosticTests: DiagnosticTest[] = [
  {
    id: 1,
    title: "Year 7 Diagnostic – NAPLAN",
    skills: ["Reading", "Numeracy", "Language Conventions"],
    questionCount: 45,
    estimatedTime: "60 minutes",
    questions: [
      {
        id: 1,
        text: "What is the main idea of the following passage?\n\nThe Great Barrier Reef stretches for over 2,300 kilometers along the coast of Queensland, Australia. It is the world's largest coral reef ecosystem and can be seen from outer space. The reef is home to thousands of species of marine life, including fish, mollusks, and various types of coral.",
        options: [
          "The Great Barrier Reef is visible from space",
          "The Great Barrier Reef is a diverse ecosystem in Australia",
          "The Great Barrier Reef is 2,300 kilometers long",
          "Australia has many natural wonders"
        ],
        correctAnswer: 1,
        explanation: "The passage primarily focuses on the Great Barrier Reef as a diverse ecosystem in Australia, mentioning its size, location, and biodiversity.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Main Idea"
      },
      {
        id: 2,
        text: "Calculate: 3/4 × 16",
        options: ["4", "8", "12", "16"],
        correctAnswer: 2,
        explanation: "3/4 × 16 = 3 × 4 = 12",
        type: "mcq",
        topic: "Numeracy",
        subSkill: "Fractions"
      },
      {
        id: 3,
        text: "Which sentence contains correct punctuation?",
        options: [
          "The dog barked at the mailman, who ran away quickly.",
          "The dog barked at the mailman who ran away quickly.",
          "The dog barked at the mailman who, ran away quickly.",
          "The dog barked, at the mailman who ran away quickly."
        ],
        correctAnswer: 0,
        explanation: "The first option correctly uses a comma before the relative clause that provides additional information.",
        type: "mcq",
        topic: "Language Conventions",
        subSkill: "Punctuation"
      },
      {
        id: 4,
        text: "The following text describes characters in a story. Based on this excerpt, what can you infer about Tom's personality?\n\n'Tom glanced at his watch again and sighed. Three minutes had passed since he last checked. He tapped his foot impatiently and rearranged his perfectly aligned pencils for the fourth time. Meanwhile, Sarah sprawled across her desk, unbothered by the upcoming deadline.'",
        options: [
          "Tom is relaxed and carefree",
          "Tom is disorganized but talented",
          "Tom is anxious and particular about order",
          "Tom is confident about meeting the deadline"
        ],
        correctAnswer: 2,
        explanation: "Tom's repeated checking of his watch, sighing, foot tapping, and rearranging of 'perfectly aligned pencils' all suggest he is anxious and particular about order.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Inference"
      },
      {
        id: 5,
        text: "If a rectangular garden has a length of 12 meters and a width of 8 meters, what is its area?",
        options: ["20 m²", "60 m²", "96 m²", "120 m²"],
        correctAnswer: 2,
        explanation: "Area of rectangle = length × width = 12 m × 8 m = 96 m²",
        type: "mcq",
        topic: "Numeracy",
        subSkill: "Measurement"
      }
    ]
  },
  {
    id: 2,
    title: "Year 9 Diagnostic – NAPLAN",
    skills: ["Reading", "Writing", "Language Conventions"],
    questionCount: 50,
    estimatedTime: "75 minutes",
    questions: [
      {
        id: 1,
        text: "Analyze the following graph showing Australia's exports over a 10-year period. Which industry showed the most consistent growth?",
        options: ["Mining", "Agriculture", "Education", "Tourism"],
        correctAnswer: 0,
        explanation: "The graph shows that mining exports consistently increased over the entire period, while other industries had more fluctuation.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Data Interpretation"
      },
      {
        id: 2,
        text: "Choose the sentence with the correct use of apostrophes.",
        options: [
          "The dogs' bone's were buried in the yard's corner.",
          "The dog's bones were buried in the yard's corner.",
          "The dogs bones were buried in the yards corner.",
          "The dog's bone's were buried in the yard's corner."
        ],
        correctAnswer: 1,
        explanation: "Option B correctly uses apostrophes to show possession: the bones belonging to one dog ('dog's') and the corner of the yard ('yard's').",
        type: "mcq",
        topic: "Language Conventions",
        subSkill: "Punctuation"
      },
      // Add more sample questions as needed
    ]
  },
  {
    id: 3,
    title: "Selective Entry Preparation",
    skills: ["Verbal Reasoning", "Numerical Reasoning", "Abstract Reasoning"],
    questionCount: 60,
    estimatedTime: "90 minutes",
    questions: []
  },
  {
    id: 4,
    title: "ACER Scholarship Diagnostic",
    skills: ["Humanities", "Mathematics", "Written Expression"],
    questionCount: 75,
    estimatedTime: "120 minutes",
    questions: []
  },
];

// Dummy Practice Tests
export const practiceTests: PracticeTest[] = [
  {
    id: 1,
    title: "Year 7 NAPLAN Reading",
    description: "Full-length practice test with varied question types.",
    questions: 40,
    duration: "65 min",
    durationMinutes: 65,
    difficulty: "Medium",
    questionsList: [
      {
        id: 1,
        text: "Read the following passage and answer the question:\n\nThe beach was almost deserted. A few seagulls circled overhead, occasionally diving down to investigate something in the sand. The waves crashed against the shore, leaving behind small shells and seaweed. In the distance, dark clouds were gathering, promising rain later in the day.\n\nBased on the passage, what time of day is it most likely to be?",
        options: ["Early morning", "Midday", "Late afternoon", "Night"],
        correctAnswer: 2,
        explanation: "The passage mentions 'dark clouds were gathering' which suggests it's later in the day, specifically late afternoon, when weather often changes.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Inference"
      },
      {
        id: 2,
        text: "Which word is a synonym for 'benevolent'?",
        options: ["Malicious", "Kind", "Arrogant", "Timid"],
        correctAnswer: 1,
        explanation: "'Benevolent' means kind or generous, so 'kind' is the correct synonym.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Vocabulary"
      },
      {
        id: 3,
        text: "Identify the main purpose of this advertisement:\n\n'Tired of sleepless nights? CloudRest mattresses conform to your body's shape, providing unparalleled support for your back and neck. Our patented cooling technology keeps you at the perfect temperature all night long. Join thousands of satisfied customers who have discovered the secret to a perfect night's sleep. Now with a 100-night risk-free trial!'",
        options: [
          "To inform people about sleep problems",
          "To convince people to buy CloudRest mattresses",
          "To explain mattress technology advances",
          "To compare different mattress brands"
        ],
        correctAnswer: 1,
        explanation: "The primary purpose is to persuade people to purchase CloudRest mattresses by highlighting benefits and offering a risk-free trial.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Author Purpose"
      }
    ]
  },
  {
    id: 2,
    title: "Year 9 NAPLAN Numeracy",
    description: "Calculator and non-calculator sections included.",
    questions: 48,
    duration: "70 min",
    durationMinutes: 70,
    difficulty: "Medium-Hard",
    questionsList: [
      {
        id: 1,
        text: "Solve for x: 3x - 7 = 14",
        options: ["3", "5", "7", "9"],
        correctAnswer: 2,
        explanation: "3x - 7 = 14\n3x = 21\nx = 7",
        type: "mcq",
        topic: "Numeracy",
        subSkill: "Algebra"
      },
      {
        id: 2,
        text: "A rectangular prism has a length of 8 cm, width of 5 cm, and height of 3 cm. What is its volume?",
        options: ["40 cm³", "64 cm³", "120 cm³", "240 cm³"],
        correctAnswer: 2,
        explanation: "Volume = length × width × height = 8 × 5 × 3 = 120 cm³",
        type: "mcq",
        topic: "Numeracy",
        subSkill: "Measurement"
      },
      {
        id: 3,
        text: "If the probability of an event occurring is 0.35, what is the probability of it not occurring?",
        options: ["0.35", "0.5", "0.65", "0.75"],
        correctAnswer: 2,
        explanation: "The probability of an event not occurring is 1 - the probability of it occurring. So 1 - 0.35 = 0.65",
        type: "mcq",
        topic: "Numeracy",
        subSkill: "Probability"
      }
    ]
  },
  {
    id: 3,
    title: "Selective Entry Test 1",
    description: "Comprehensive practice for selective school entry.",
    questions: 65,
    duration: "90 min",
    durationMinutes: 90,
    difficulty: "Hard",
    questionsList: []
  },
  {
    id: 4,
    title: "ACER Scholarship Test",
    description: "Written expression and humanities focus.",
    questions: 45,
    duration: "75 min",
    durationMinutes: 75,
    difficulty: "Advanced",
    questionsList: []
  },
];

// Drill Categories with Topics and Sub-skills
export const drillCategories: DrillCategory[] = [
  {
    subject: "Mathematics",
    topics: {
      "Numbers": ["Fractions", "Decimals", "Percentages", "Ratios"],
      "Algebra": ["Equations", "Expressions", "Functions", "Patterns"],
      "Geometry": ["Shapes", "Angles", "Transformations", "Measurement"],
      "Statistics": ["Data Analysis", "Probability", "Graphs", "Measures"]
    }
  },
  {
    subject: "English",
    topics: {
      "Reading": ["Comprehension", "Analysis", "Inference", "Main Idea"],
      "Writing": ["Structure", "Vocabulary", "Style", "Purpose"],
      "Grammar": ["Syntax", "Parts of Speech", "Sentence Structure", "Tense"],
      "Vocabulary": ["Word Meanings", "Context Clues", "Synonyms/Antonyms", "Word Families"]
    }
  },
  {
    subject: "Science",
    topics: {
      "Biology": ["Cells", "Systems", "Ecology", "Genetics"],
      "Chemistry": ["Elements", "Compounds", "Reactions", "Properties"],
      "Physics": ["Forces", "Energy", "Electricity", "Motion"],
      "Earth Science": ["Geology", "Weather", "Space", "Environment"]
    }
  }
];

// Drill questions by topic and sub-skill
export const drillQuestions: {[key: string]: {[key: string]: Question[]}} = {
  "Numbers": {
    "Fractions": [
      {
        id: 1,
        text: "What is 2/3 of 24?",
        options: ["8", "12", "16", "18"],
        correctAnswer: 2,
        explanation: "2/3 of 24 = 2/3 × 24 = 16",
        type: "mcq",
        topic: "Numbers",
        subSkill: "Fractions"
      },
      {
        id: 2,
        text: "Which fraction is equivalent to 4/10?",
        options: ["2/5", "2/8", "8/20", "4/12"],
        correctAnswer: 0,
        explanation: "4/10 = 2/5 (both numerator and denominator divided by 2)",
        type: "mcq",
        topic: "Numbers",
        subSkill: "Fractions"
      },
      {
        id: 3,
        text: "Add the fractions: 1/4 + 2/3",
        options: ["3/7", "3/12", "11/12", "1/12"],
        correctAnswer: 2,
        explanation: "1/4 + 2/3 = 3/12 + 8/12 = 11/12",
        type: "mcq",
        topic: "Numbers",
        subSkill: "Fractions"
      }
    ],
    "Decimals": [
      {
        id: 1,
        text: "What is 3.45 + 2.8?",
        options: ["5.53", "6.25", "6.45", "5.25"],
        correctAnswer: 1,
        explanation: "3.45 + 2.8 = 3.45 + 2.80 = 6.25",
        type: "mcq",
        topic: "Numbers",
        subSkill: "Decimals"
      }
    ]
  },
  "Reading": {
    "Comprehension": [
      {
        id: 1,
        text: "Read the paragraph and answer the question:\n\nAustralia is known for its unique wildlife. Many species, such as kangaroos and koalas, are found nowhere else on Earth. These animals have adapted to Australia's harsh conditions over millions of years.\n\nAccording to the paragraph, why are animals like kangaroos and koalas unique?",
        options: [
          "They can only survive in harsh conditions",
          "They migrated to Australia from other continents",
          "They are only found in Australia",
          "They have existed for millions of years"
        ],
        correctAnswer: 2,
        explanation: "The paragraph states that many species 'are found nowhere else on Earth,' which means they are unique to Australia.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Comprehension"
      }
    ],
    "Inference": [
      {
        id: 1,
        text: "Read the statement and answer the question:\n\nSarah glanced nervously at her watch, then hurried to gather her belongings. The sky was growing darker by the minute.\n\nWhat can you infer from this statement?",
        options: [
          "Sarah is late for an appointment",
          "Sarah is afraid of the dark",
          "A storm might be approaching",
          "Sarah's watch is broken"
        ],
        correctAnswer: 2,
        explanation: "The mention of Sarah hurrying and the sky 'growing darker' suggests that a storm might be approaching, and she's trying to get somewhere before it hits.",
        type: "mcq",
        topic: "Reading",
        subSkill: "Inference"
      }
    ]
  }
};

// Initial dummy test results for charts
export const initialTestResults: TestResult[] = [
  {
    id: 1,
    date: "2023-12-15",
    testType: "NAPLAN",
    testId: 1,
    testName: "Year 7 NAPLAN Reading",
    score: 65,
    totalQuestions: 40,
    timeSpentMinutes: 58,
    topicResults: {
      "Reading": 65,
      "Writing": 60,
      "Numeracy": 70,
      "Language Conventions": 62
    },
    subSkillResults: {
      "Main Idea": 75,
      "Inference": 60,
      "Vocabulary": 80,
      "Text Structure": 50,
      "Author Purpose": 60
    }
  },
  {
    id: 2,
    date: "2024-01-20",
    testType: "NAPLAN",
    testId: 2,
    testName: "Year 7 NAPLAN Numeracy",
    score: 72,
    totalQuestions: 45,
    timeSpentMinutes: 62,
    topicResults: {
      "Reading": 68,
      "Writing": 65,
      "Numeracy": 75,
      "Language Conventions": 70
    },
    subSkillResults: {
      "Main Idea": 78,
      "Inference": 65,
      "Vocabulary": 85,
      "Text Structure": 60,
      "Author Purpose": 65
    }
  },
  {
    id: 3,
    date: "2024-02-15",
    testType: "NAPLAN",
    testId: 3,
    testName: "Year 7 NAPLAN Language",
    score: 70,
    totalQuestions: 38,
    timeSpentMinutes: 55,
    topicResults: {
      "Reading": 70,
      "Writing": 68,
      "Numeracy": 72,
      "Language Conventions": 75
    },
    subSkillResults: {
      "Main Idea": 82,
      "Inference": 68,
      "Vocabulary": 88,
      "Text Structure": 70,
      "Author Purpose": 62
    }
  },
  {
    id: 4,
    date: "2024-03-10",
    testType: "NAPLAN",
    testId: 1,
    testName: "Year 7 NAPLAN Combined",
    score: 75,
    totalQuestions: 50,
    timeSpentMinutes: 68,
    topicResults: {
      "Reading": 75,
      "Writing": 72,
      "Numeracy": 76,
      "Language Conventions": 78
    },
    subSkillResults: {
      "Main Idea": 88,
      "Inference": 72,
      "Vocabulary": 90,
      "Text Structure": 78,
      "Author Purpose": 65
    }
  },
  {
    id: 5,
    date: "2024-04-05",
    testType: "NAPLAN",
    testId: 2,
    testName: "Year 7 NAPLAN Full Practice",
    score: 82,
    totalQuestions: 55,
    timeSpentMinutes: 72,
    topicResults: {
      "Reading": 82,
      "Writing": 76,
      "Numeracy": 84,
      "Language Conventions": 80
    },
    subSkillResults: {
      "Main Idea": 92,
      "Inference": 78,
      "Vocabulary": 94,
      "Text Structure": 82,
      "Author Purpose": 70
    }
  }
];
