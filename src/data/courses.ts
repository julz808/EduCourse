
import { type Course } from '@/types';

export const courses: Course[] = [
  {
    id: 'year-5-naplan',
    title: 'Year 5 NAPLAN Preparation',
    shortDescription: 'Build foundational skills in reading, writing, language conventions, and numeracy. Practice real-style adaptive questions and timed tests.',
    fullDescription: 'Our comprehensive Year 5 NAPLAN preparation course provides students with the essential skills and confidence needed to excel in their NAPLAN tests. Through adaptive learning technology and personalized practice, students will master key concepts while building test-taking strategies.',
    price: 99,
    target: 'Year 5 students (or Year 4 preparing early)',
    skills: [
      'Reading comprehension and analysis',
      'Basic to intermediate numeracy',
      'Grammar and punctuation',
      'Spelling and vocabulary',
      'Narrative and persuasive writing'
    ],
    image: '/images/courses/naplan-5.jpg',
    slug: 'year-5-naplan'
  },
  {
    id: 'year-7-naplan',
    title: 'Year 7 NAPLAN Preparation',
    shortDescription: 'Advanced practice for high-performing students preparing for Year 7 NAPLAN. Covers harder numeracy, grammar, inference, and essay writing.',
    fullDescription: 'Our Year 7 NAPLAN preparation course is designed for students aiming for excellence in their NAPLAN assessment. With challenging content and comprehensive coverage of all test domains, students will develop advanced skills and strategies.',
    price: 119,
    target: 'Year 7 students and ambitious Year 6s',
    skills: [
      'Complex reading comprehension',
      'Advanced numeracy and problem solving',
      'Advanced grammar and language conventions',
      'Critical thinking and analysis',
      'Sophisticated essay structure and vocabulary'
    ],
    image: '/images/courses/naplan-7.jpg',
    slug: 'year-7-naplan'
  },
  {
    id: 'acer-scholarship',
    title: 'ACER Scholarship Exam Preparation',
    shortDescription: 'Prepare for ACER\'s Cooperative Scholarship Test (Levels P, 1, 2). Includes reading, mathematics, writing prompts, and high-order reasoning.',
    fullDescription: 'Our ACER Scholarship Exam preparation course gives students the competitive edge needed to excel in this challenging assessment. Covering all test components with specialized practice materials, we help students develop the advanced skills required for success.',
    price: 149,
    target: 'Students in Year 5–9 applying for private school scholarships',
    skills: [
      'Abstract reasoning and pattern recognition',
      'Advanced mathematical reasoning',
      'Critical reading and comprehension',
      'Creative and analytical writing',
      'Problem solving under time pressure'
    ],
    image: '/images/courses/acer.jpg',
    slug: 'acer-scholarship'
  },
  {
    id: 'edutest-scholarship',
    title: 'EduTest Scholarship Preparation',
    shortDescription: 'Covers all 5 sections of the EduTest exam: Verbal Reasoning, Numerical Reasoning, Reading, Mathematics, and Written Expression.',
    fullDescription: 'Our comprehensive EduTest Scholarship preparation program is designed specifically for the unique format and requirements of EduTest examinations. With focused practice and strategic guidance, students will build confidence and competence across all test sections.',
    price: 149,
    target: 'Students applying to independent schools (Years 5–9)',
    skills: [
      'Verbal reasoning and vocabulary',
      'Numerical reasoning and problem solving',
      'Reading comprehension strategies',
      'Mathematical applications',
      'Written expression techniques'
    ],
    image: '/images/courses/edutest.jpg',
    slug: 'edutest-scholarship'
  },
  {
    id: 'vic-selective',
    title: 'VIC Selective Entry High School Preparation',
    shortDescription: 'Full prep for Victoria\'s Year 9 selective exam (Melbourne High, Mac.Robertson, etc.). Includes reading, mathematics, verbal/quant reasoning, and dual writing tasks.',
    fullDescription: 'Our Victoria Selective Entry preparation course provides comprehensive coverage of all components needed for success in this competitive examination. With targeted practice materials and expert guidance, students will develop the advanced skills required for Victoria\'s prestigious selective high schools.',
    price: 159,
    target: 'Year 8 students sitting the VIC selective test',
    skills: [
      'Verbal and quantitative reasoning',
      'Advanced mathematics',
      'Analytical reading comprehension',
      'Dual writing tasks - creative and analytical',
      'Test-taking strategies for time management'
    ],
    image: '/images/courses/vic-selective.jpg',
    slug: 'vic-selective'
  },
  {
    id: 'nsw-selective',
    title: 'NSW Selective Entry High School Preparation',
    shortDescription: 'Master the NSW Selective High School Placement Test. Includes Reading, Mathematical Reasoning, Thinking Skills, and Writing.',
    fullDescription: 'Our NSW Selective Entry preparation course is specially designed for students aiming to secure placement in NSW\'s competitive selective high schools. Covering all test components with extensive practice materials, we help students develop the advanced skills and confidence needed to excel.',
    price: 159,
    target: 'Year 6 students preparing for Year 7 entry to NSW Selective Schools',
    skills: [
      'Reading comprehension and interpretation',
      'Mathematical reasoning and problem solving',
      'Critical and creative thinking skills',
      'Persuasive and narrative writing',
      'Strategies for managing exam pressure'
    ],
    image: '/images/courses/nsw-selective.jpg',
    slug: 'nsw-selective'
  }
];

export const faqs = [
  {
    question: "How long do I have access to the course?",
    answer: "You have 12 months of access from the date of purchase."
  },
  {
    question: "Are the practice tests similar to the real exams?",
    answer: "Yes, our practice tests are designed to closely mimic the format, difficulty level, and timing of the actual exams."
  },
  {
    question: "Can I use this course on multiple devices?",
    answer: "Yes, you can access your course on any device with a web browser - computers, tablets, and smartphones."
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer: "Yes, we offer a 7-day money-back guarantee if you're not completely satisfied with your purchase."
  },
  {
    question: "How do the diagnostic tests work?",
    answer: "Our diagnostic tests assess your current knowledge and skills, then generate a personalized study plan focusing on areas where you need the most improvement."
  },
  {
    question: "Do you provide feedback on practice essays?",
    answer: "Yes, our AI-powered system provides detailed feedback on structure, content, language use, and areas for improvement on all written responses."
  }
];
