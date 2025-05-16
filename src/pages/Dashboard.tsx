
import { ArrowRight, BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUser } from "../context/UserContext";
import { useTestType } from "../context/TestTypeContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userPerformance } = useUser();
  const { testType } = useTestType();
  
  // Filter test results by test type
  const filteredResults = useMemo(() => {
    return userPerformance.testResults.filter(result => result.testType === testType);
  }, [userPerformance.testResults, testType]);
  
  // Get the lowest subskill scores to recommend drills
  const recommendedDrills = Object.entries(userPerformance.subSkillMastery)
    .sort(([_, scoreA], [__, scoreB]) => scoreA - scoreB)
    .slice(0, 2)
    .map(([subSkill, _]) => subSkill);
    
  // Get recent test name if available
  const recentTestName = filteredResults.length > 0 
    ? filteredResults[filteredResults.length - 1].testName 
    : "Year 9 NAPLAN Reading - Section 2";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-edu-navy mb-1">Welcome back, Julian!</h1>
        <p className="text-edu-navy/70">Continue your {testType} test preparation journey</p>
      </div>
      
      {/* Continue where you left off */}
      <Card className="edu-card bg-gradient-to-br from-edu-teal/10 to-edu-light-blue border-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Continue where you left off</h2>
            <p className="text-edu-navy/70 mb-4">
              {recentTestName} - Next Section
            </p>
            <div className="flex gap-2 mb-4">
              <span className="bg-edu-teal/20 px-3 py-1 rounded-full text-xs text-edu-teal">
                <Clock size={12} className="inline mr-1" /> 15 questions left
              </span>
              <span className="bg-edu-light-blue px-3 py-1 rounded-full text-xs text-edu-navy/70">
                <TrendingUp size={12} className="inline mr-1" /> 65% complete
              </span>
            </div>
            <Button 
              className="btn-primary flex items-center gap-2"
              onClick={() => navigate("/dashboard/practice-tests")}
            >
              <span>Resume</span>
              <ArrowRight size={16} />
            </Button>
          </div>
          <div className="hidden lg:block">
            <BookOpen size={120} className="text-edu-teal/20" />
          </div>
        </div>
      </Card>
      
      {/* Stats Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="edu-card">
            <h3 className="text-sm text-edu-navy/70 mb-1">Questions Answered</h3>
            <p className="text-3xl font-bold text-edu-navy">{userPerformance.questionsAnswered}</p>
            <span className="text-xs text-edu-teal">
              +{filteredResults.length > 0 ? 
                filteredResults[filteredResults.length - 1].totalQuestions : 
                24} this week
            </span>
          </Card>
          
          <Card className="edu-card">
            <h3 className="text-sm text-edu-navy/70 mb-1">Average Accuracy</h3>
            <p className="text-3xl font-bold text-edu-navy">{userPerformance.avgAccuracy}%</p>
            <div className="mt-2">
              <Progress value={userPerformance.avgAccuracy} className="h-1.5" />
            </div>
          </Card>
          
          <Card className="edu-card">
            <h3 className="text-sm text-edu-navy/70 mb-1">Last Test Score</h3>
            <p className="text-3xl font-bold text-edu-navy">{userPerformance.lastTestScore}%</p>
            <span className="text-xs text-edu-teal">+5% from previous</span>
          </Card>
          
          <Card className="edu-card">
            <h3 className="text-sm text-edu-navy/70 mb-1">Daily Streak</h3>
            <p className="text-3xl font-bold text-edu-navy">{userPerformance.streak} days</p>
            <span className="text-xs text-edu-teal">Keep it up!</span>
          </Card>
        </div>
      </div>
      
      {/* Suggested next drill */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="edu-card col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
          <div className="space-y-4">
            <div className="bg-edu-light-blue rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Fractions & Decimals Drill</h3>
                <p className="text-sm text-edu-navy/70">15 questions • ~20 minutes</p>
              </div>
              <Button 
                className="btn-secondary"
                onClick={() => navigate("/dashboard/drill")}
              >Start</Button>
            </div>
            
            <div className="bg-edu-light-blue rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {recommendedDrills[0] || "Vocabulary Builder"}
                </h3>
                <p className="text-sm text-edu-navy/70">20 questions • ~25 minutes</p>
              </div>
              <Button 
                className="btn-secondary"
                onClick={() => navigate("/dashboard/drill")}
              >Start</Button>
            </div>
          </div>
        </Card>
        
        <Card className="edu-card">
          <h2 className="text-xl font-semibold mb-4">Skills breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Reading Comprehension</span>
                <span className="text-sm text-edu-teal">
                  {userPerformance.topicMastery["Reading"] || 85}%
                </span>
              </div>
              <Progress value={userPerformance.topicMastery["Reading"] || 85} className="h-1.5" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Numerical Reasoning</span>
                <span className="text-sm text-edu-teal">
                  {userPerformance.topicMastery["Numeracy"] || 72}%
                </span>
              </div>
              <Progress value={userPerformance.topicMastery["Numeracy"] || 72} className="h-1.5" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Writing</span>
                <span className="text-sm text-edu-coral">
                  {userPerformance.topicMastery["Writing"] || 58}%
                </span>
              </div>
              <Progress value={userPerformance.topicMastery["Writing"] || 58} className="h-1.5" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Grammar & Spelling</span>
                <span className="text-sm text-edu-teal">
                  {userPerformance.topicMastery["Grammar"] || 92}%
                </span>
              </div>
              <Progress value={userPerformance.topicMastery["Grammar"] || 92} className="h-1.5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
