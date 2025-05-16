
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserPerformance, TestResult } from '../types';
import { initialTestResults } from '../data/dummyData';

interface UserContextProps {
  userPerformance: UserPerformance;
  updateAfterTest: (newTestResult: TestResult) => void;
  updateAfterDrill: (
    topic: string, 
    subSkill: string, 
    correctAnswers: number, 
    totalQuestions: number,
    timeSpentMinutes: number
  ) => void;
  resetPerformance: () => void;
}

const initialPerformance: UserPerformance = {
  questionsAnswered: 342,
  avgAccuracy: 76,
  lastTestScore: 82,
  streak: 5,
  testResults: initialTestResults,
  skillMastery: {
    "Reading": 85,
    "Writing": 64,
    "Numeracy": 76,
    "Language Conventions": 85
  },
  topicMastery: {
    "Reading": 82,
    "Writing": 64,
    "Numeracy": 76,
    "Grammar": 85
  },
  subSkillMastery: {
    "Main Idea": 88,
    "Inference": 72,
    "Vocabulary": 90,
    "Text Structure": 78,
    "Author Purpose": 65
  },
  totalStudyTimeMinutes: 580,
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userPerformance, setUserPerformance] = useState<UserPerformance>(initialPerformance);

  const updateAfterTest = (newTestResult: TestResult) => {
    setUserPerformance(prev => {
      // Calculate new questions answered
      const questionsAnswered = prev.questionsAnswered + newTestResult.totalQuestions;
      
      // Add new test result
      const updatedResults = [...prev.testResults, newTestResult];
      
      // Calculate new average accuracy across all tests
      const totalCorrect = updatedResults.reduce(
        (sum, result) => sum + (result.score * result.totalQuestions / 100), 0);
      const totalQuestions = updatedResults.reduce(
        (sum, result) => sum + result.totalQuestions, 0);
      const avgAccuracy = Math.round((totalCorrect / totalQuestions) * 100);
      
      // Update skill and topic mastery
      const skillMastery = { ...prev.skillMastery };
      const topicMastery = { ...prev.topicMastery };
      const subSkillMastery = { ...prev.subSkillMastery };
      
      // Update topic mastery scores
      Object.entries(newTestResult.topicResults).forEach(([topic, score]) => {
        if (topicMastery[topic] !== undefined) {
          // Weighted average: 70% previous + 30% new score
          topicMastery[topic] = Math.round(0.7 * topicMastery[topic] + 0.3 * score);
        } else {
          topicMastery[topic] = score;
        }
      });
      
      // Update sub-skill mastery scores
      Object.entries(newTestResult.subSkillResults).forEach(([subSkill, score]) => {
        if (subSkillMastery[subSkill] !== undefined) {
          // Weighted average: 70% previous + 30% new score
          subSkillMastery[subSkill] = Math.round(0.7 * subSkillMastery[subSkill] + 0.3 * score);
        } else {
          subSkillMastery[subSkill] = score;
        }
      });
      
      // Update total study time
      const totalStudyTimeMinutes = prev.totalStudyTimeMinutes + newTestResult.timeSpentMinutes;
      
      return {
        ...prev,
        questionsAnswered,
        avgAccuracy,
        lastTestScore: newTestResult.score,
        testResults: updatedResults,
        topicMastery,
        subSkillMastery,
        totalStudyTimeMinutes
      };
    });
  };
  
  const updateAfterDrill = (
    topic: string, 
    subSkill: string, 
    correctAnswers: number, 
    totalQuestions: number,
    timeSpentMinutes: number
  ) => {
    setUserPerformance(prev => {
      // Calculate new questions answered
      const questionsAnswered = prev.questionsAnswered + totalQuestions;
      
      // Calculate accuracy for this drill
      const drillAccuracy = Math.round((correctAnswers / totalQuestions) * 100);
      
      // Update average accuracy (weighted)
      const prevTotalQuestions = prev.questionsAnswered;
      const newAvgAccuracy = Math.round(
        ((prev.avgAccuracy * prevTotalQuestions) + (drillAccuracy * totalQuestions)) / 
        (prevTotalQuestions + totalQuestions)
      );
      
      // Update sub-skill mastery
      const subSkillMastery = { ...prev.subSkillMastery };
      if (subSkillMastery[subSkill] !== undefined) {
        // Weighted average: 80% previous + 20% new score
        subSkillMastery[subSkill] = Math.round(0.8 * subSkillMastery[subSkill] + 0.2 * drillAccuracy);
      } else {
        subSkillMastery[subSkill] = drillAccuracy;
      }
      
      // Update topic mastery by averaging all sub-skills in this topic
      const topicMastery = { ...prev.topicMastery };
      const subSkillsInTopic = Object.entries(subSkillMastery)
        .filter(([skill, _]) => skill === subSkill || skill.includes(topic))
        .map(([_, score]) => score);
      
      if (subSkillsInTopic.length > 0) {
        const avgTopicScore = Math.round(
          subSkillsInTopic.reduce((sum, score) => sum + score, 0) / subSkillsInTopic.length
        );
        topicMastery[topic] = avgTopicScore;
      }
      
      // Update total study time
      const totalStudyTimeMinutes = prev.totalStudyTimeMinutes + timeSpentMinutes;
      
      return {
        ...prev,
        questionsAnswered,
        avgAccuracy: newAvgAccuracy,
        lastTestScore: drillAccuracy,
        topicMastery,
        subSkillMastery,
        totalStudyTimeMinutes
      };
    });
  };
  
  const resetPerformance = () => {
    setUserPerformance(initialPerformance);
  };

  return (
    <UserContext.Provider value={{ 
      userPerformance, 
      updateAfterTest, 
      updateAfterDrill,
      resetPerformance
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
