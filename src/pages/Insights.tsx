
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useTestType } from "../context/TestTypeContext";
import { useMemo } from "react";
import { TestResult } from "../types";

const COLORS = ['#7accc8', '#f26c5a', '#8884d8', '#ffc658'];

const Insights = () => {
  const { userPerformance } = useUser();
  const { testType } = useTestType();
  
  // Filter results by test type
  const filteredResults = useMemo(() => {
    return userPerformance.testResults.filter(result => result.testType === testType);
  }, [userPerformance.testResults, testType]);
  
  // Format test results for the progress chart
  const progressData = useMemo(() => {
    return filteredResults.map(result => ({
      date: result.date.split('-')[1], // Just use month for simplicity
      score: result.score
    }));
  }, [filteredResults]);
  
  // Generate topic data from the most recent test
  const topicData = useMemo(() => {
    if (filteredResults.length === 0) {
      return [
        { name: 'Reading', score: 82 },
        { name: 'Writing', score: 64 },
        { name: 'Numeracy', score: 76 },
        { name: 'Grammar', score: 85 }
      ];
    }
    
    const latestResult = filteredResults[filteredResults.length - 1];
    return Object.entries(latestResult.topicResults).map(([name, score]) => ({
      name,
      score
    }));
  }, [filteredResults]);
  
  // Generate subskill data from the most recent test
  const subSkillData = useMemo(() => {
    if (filteredResults.length === 0) {
      return [
        { name: 'Main Idea', score: 88 },
        { name: 'Inference', score: 72 },
        { name: 'Vocabulary', score: 90 },
        { name: 'Text Structure', score: 78 },
        { name: 'Author Purpose', score: 65 }
      ];
    }
    
    const latestResult = filteredResults[filteredResults.length - 1];
    return Object.entries(latestResult.subSkillResults).map(([name, score]) => ({
      name,
      score
    }));
  }, [filteredResults]);
  
  // Calculate average score from filtered tests
  const averageScore = useMemo(() => {
    if (filteredResults.length === 0) return 73;
    
    const sum = filteredResults.reduce((acc, result) => acc + result.score, 0);
    return Math.round(sum / filteredResults.length);
  }, [filteredResults]);
  
  // Calculate total study time
  const totalStudyHours = Math.round(userPerformance.totalStudyTimeMinutes / 60);
  
  // Generate time distribution data
  const timeData = useMemo(() => {
    const topicTimes: {[key: string]: number} = {};
    
    filteredResults.forEach(result => {
      Object.keys(result.topicResults).forEach(topic => {
        if (!topicTimes[topic]) {
          topicTimes[topic] = 0;
        }
        // Allocate time proportionally based on the topics in the test
        const topicCount = Object.keys(result.topicResults).length;
        topicTimes[topic] += result.timeSpentMinutes / topicCount;
      });
    });
    
    return Object.entries(topicTimes).map(([name, value]) => ({
      name,
      value: Math.round(value / 60) // Convert to hours
    }));
  }, [filteredResults]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-edu-navy mb-1">Insights</h1>
        <p className="text-edu-navy/70">Track your {testType} test progress and identify areas for improvement</p>
      </div>
      
      {/* Overall Progress */}
      <Card className="edu-card">
        <h2 className="text-xl font-semibold mb-6">Progress Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Line type="monotone" dataKey="score" stroke="#7accc8" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="edu-card">
          <h3 className="text-sm text-edu-navy/70 mb-1">Average Score</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-edu-navy">{averageScore}%</p>
            <span className="text-xs text-edu-teal flex items-center pb-1">
              <TrendingUp size={12} className="mr-0.5" /> +5%
            </span>
          </div>
        </Card>
        
        <Card className="edu-card">
          <h3 className="text-sm text-edu-navy/70 mb-1">Tests Completed</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-edu-navy">{filteredResults.length}</p>
            <span className="text-xs text-edu-teal flex items-center pb-1">
              <TrendingUp size={12} className="mr-0.5" /> +{Math.min(3, filteredResults.length)}
            </span>
          </div>
        </Card>
        
        <Card className="edu-card">
          <h3 className="text-sm text-edu-navy/70 mb-1">Study Time</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-edu-navy">{totalStudyHours}h</p>
            <span className="text-xs text-edu-teal flex items-center pb-1">
              <TrendingUp size={12} className="mr-0.5" /> +7h
            </span>
          </div>
        </Card>
      </div>
      
      {/* Performance by Topic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="edu-card">
          <h2 className="text-xl font-semibold mb-6">Performance by Topic</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" fill="#7accc8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="edu-card">
          <h2 className="text-xl font-semibold mb-6">Reading Sub-Skills</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subSkillData} layout="vertical" margin={{ top: 5, right: 30, left: 70, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" fill="#f26c5a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Distribution */}
        <Card className="edu-card">
          <h2 className="text-xl font-semibold mb-6">Study Time Distribution</h2>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={timeData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={80} 
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} hours`, 'Time']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* AI Recommendations */}
        <Card className="edu-card col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Recommendations</h2>
          <div className="space-y-4">
            <div className="bg-edu-light-blue rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Revise: Fractions & Ratios</h3>
                <span className="bg-edu-teal/20 text-edu-teal text-xs px-2 py-1 rounded-full">High Priority</span>
              </div>
              <p className="text-sm text-edu-navy/70">
                Your performance in fractions and ratios is below average. We recommend focusing on these topics.
              </p>
            </div>
            
            <div className="bg-edu-light-blue rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Practice: Inference Questions</h3>
                <span className="bg-edu-coral/20 text-edu-coral text-xs px-2 py-1 rounded-full">Medium Priority</span>
              </div>
              <p className="text-sm text-edu-navy/70">
                You're struggling with inference questions in reading comprehension. Try our targeted drill.
              </p>
            </div>
            
            <div className="bg-edu-light-blue rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Continue: Grammar & Punctuation</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Strength</span>
              </div>
              <p className="text-sm text-edu-navy/70">
                You're performing well in grammar and punctuation. Keep up the good work!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
