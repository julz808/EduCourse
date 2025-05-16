export type TestType = 'NAPLAN' | 'Selective Entry' | 'EduTest' | 'ACER Scholarship' | 
  'edutest' | 'acer' | 'naplan-year5' | 'naplan-year7' | 'vic-selective' | 'nsw-selective';

export type Question = {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  type: 'mcq' | 'text' | 'number';
  topic: string;
  subSkill: string;
};

export type TestResult = {
  id: number;
  date: string;
  testType: TestType;
  testId: number;
  testName: string;
  score: number;
  totalQuestions: number;
  timeSpentMinutes: number;
  topicResults: { [key: string]: number }; // percentage scores by topic
  subSkillResults: { [key: string]: number }; // percentage scores by subskill
};

export type UserPerformance = {
  questionsAnswered: number;
  avgAccuracy: number;
  lastTestScore: number;
  streak: number;
  testResults: TestResult[];
  skillMastery: {
    [skill: string]: number; // 0-100 percentage
  };
  topicMastery: {
    [topic: string]: number; // 0-100 percentage
  };
  subSkillMastery: {
    [subSkill: string]: number; // 0-100 percentage
  };
  totalStudyTimeMinutes: number;
};

export type DiagnosticTest = {
  id: number;
  title: string;
  skills: string[];
  questionCount: number;
  estimatedTime: string;
  questions: Question[];
};

export type PracticeTest = {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: string;
  durationMinutes: number;
  difficulty: string;
  questionsList: Question[];
};

export type DrillCategory = {
  subject: string;
  topics: {
    [topic: string]: string[];
  };
};

export type Course = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  target: string;
  skills: string[];
  image: string;
  slug: string;
};

export type FAQ = {
  question: string;
  answer: string;
};
