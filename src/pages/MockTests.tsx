import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { practiceTests } from "../data/dummyData";
import { useUser } from "../context/UserContext";
import { useTestType } from "../context/TestTypeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { TestResult } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductQuestions } from "@/hooks/useProductQuestions";
import { useQuestionAttempts } from "@/hooks/useQuestionAttempts";

const PracticeTests = () => {
  const navigate = useNavigate();
  const { updateAfterTest } = useUser();
  const { testType } = useTestType();
  const [activeTestId, setActiveTestId] = useState<number | null>(null);
  const [selectedPracticeId, setSelectedPracticeId] = useState<string>('practice_1');
  const { data: questions, isLoading } = useProductQuestions(activeTestId ? selectedPracticeId : undefined);
  const { saveAttempt } = useQuestionAttempts();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  
  // Available practice sets
  const practiceSets = [
    { id: 'practice_1', name: 'Practice Test 1' },
    { id: 'practice_2', name: 'Practice Test 2' },
    { id: 'practice_3', name: 'Practice Test 3' },
    { id: 'practice_4', name: 'Practice Test 4' },
    { id: 'practice_5', name: 'Practice Test 5' },
  ];
  
  // Reset active test when test type changes
  useEffect(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    setActiveTestId(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
  }, [testType]);
  
  const handleStartTest = () => {
    if (!questions || questions.length === 0) return;
    
    setActiveTestId(1); // Use a dummy ID since we're using the selectedPracticeId
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedOption(null);
    setShowFeedback(false);
    
    // Start timer - 60 minutes for practice test
    setTimeLeft(60 * 60); // 60 minutes in seconds
    setStartTime(new Date());
    setQuestionStartTime(new Date());
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  const handleOptionSelect = (index: number) => {
    if (!questions) return;
    
    setSelectedOption(index);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const isCorrect = index === currentQuestion.correct_answer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Calculate time spent on this question
    const timeSpent = questionStartTime ? 
      Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000) : 0;
    
    // Save the attempt to Supabase
    try {
      saveAttempt.mutate({
        question_id: currentQuestion.id,
        test_type: 'EduTest',
        set_id: selectedPracticeId,
        is_correct: isCorrect,
        time_spent: timeSpent
      });
    } catch (error) {
      console.error('Error saving question attempt:', error);
    }
    
    setShowFeedback(true);
  };
  
  const handleNext = () => {
    if (!questions) return;
    
    setSelectedOption(null);
    setShowFeedback(false);
    setQuestionStartTime(new Date()); // Reset timer for next question
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Test is complete
      finishTest();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setQuestionStartTime(new Date()); // Reset timer
    }
  };
  
  const finishTest = () => {
    // Clean up timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    if (!questions || !startTime) return;
    
    // Calculate time spent
    const endTime = new Date();
    const timeSpentMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Calculate score
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Create topic and subskill results
    const topicResults: { [key: string]: number } = {};
    const subSkillResults: { [key: string]: number } = {};
    
    // Track results by topic and subskill
    const topicCounts: { [key: string]: { correct: number, total: number } } = {};
    const subSkillCounts: { [key: string]: { correct: number, total: number } } = {};
    
    // Assume a 1-to-1 mapping of questions with correct answers, since we don't track individual answers yet
    questions.forEach((question, index) => {
      const isCorrect = index < correctAnswers; // Simplification
      
      // Update topic counts
      if (!topicCounts[question.topic]) {
        topicCounts[question.topic] = { correct: 0, total: 0 };
      }
      topicCounts[question.topic].total++;
      if (isCorrect) {
        topicCounts[question.topic].correct++;
      }
      
      // Update subskill counts
      const subSkill = question.sub_skill;
      if (!subSkillCounts[subSkill]) {
        subSkillCounts[subSkill] = { correct: 0, total: 0 };
      }
      subSkillCounts[subSkill].total++;
      if (isCorrect) {
        subSkillCounts[subSkill].correct++;
      }
    });
    
    // Calculate percentages
    Object.entries(topicCounts).forEach(([topic, counts]) => {
      topicResults[topic] = Math.round((counts.correct / counts.total) * 100);
    });
    
    Object.entries(subSkillCounts).forEach(([subSkill, counts]) => {
      subSkillResults[subSkill] = Math.round((counts.correct / counts.total) * 100);
    });
    
    // Create test result
    const testResult: TestResult = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      testType: testType,
      testId: 1, // Dummy ID
      testName: `EduTest ${selectedPracticeId.replace('_', ' ').toUpperCase()}`,
      score,
      totalQuestions,
      timeSpentMinutes,
      topicResults,
      subSkillResults
    };
    
    // Update user performance
    updateAfterTest(testResult);
    
    // Show toast
    toast({
      title: "Practice Test Completed!",
      description: `You scored ${score}% on this practice test. Great job!`,
    });
    
    // Reset state
    setActiveTestId(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    
    // Navigate to insights
    navigate("/dashboard/insights");
  };
  
  // Current question from Supabase
  const currentQuestion = questions && activeTestId && currentQuestionIndex < questions.length ? 
    questions[currentQuestionIndex] : null;
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-edu-navy mb-2">Practice Tests</h1>
        <p className="text-edu-navy/70">
          Full-length simulated exams to help you prepare for your real tests.
        </p>
      </div>

      {!activeTestId ? (
        // Practice test selection
        <Card className="max-w-3xl mx-auto border border-edu-teal/10">
          <CardHeader>
            <CardTitle className="text-edu-navy">EduTest Practice Tests</CardTitle>
            <CardDescription>Select a practice test to begin</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="practice-test" className="text-sm font-medium">
                Choose a practice test
              </label>
              <Select 
                value={selectedPracticeId}
                onValueChange={setSelectedPracticeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a practice test" />
                </SelectTrigger>
                <SelectContent>
                  {practiceSets.map(set => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Questions:</span>
                <span className="font-medium">{isLoading ? 'Loading...' : questions?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Duration:</span>
                <span className="font-medium">60 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Question Types:</span>
                <span className="font-medium">Multiple choice</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full bg-edu-teal hover:bg-edu-teal/90"
              onClick={handleStartTest}
              disabled={isLoading || !questions || questions.length === 0}
            >
              {isLoading ? 'Loading questions...' : 'Start Practice Test'}
            </Button>
          </CardFooter>
        </Card>
      ) : currentQuestion ? (
        // Active test view
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-edu-navy/70">
              <span>EduTest {selectedPracticeId.replace('_', ' ').toUpperCase()}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-edu-navy/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock size={14} />
                <span className="text-sm">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          
          <Card className="edu-card">
            <div className="flex justify-between mb-6">
              <span className="text-sm text-edu-navy/70">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button className="text-edu-navy/70 hover:text-edu-navy flex items-center gap-1">
                <Flag size={16} />
                <span className="text-sm">Flag</span>
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
            </div>
            
            {currentQuestion.options && (
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleOptionSelect(index)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-lg border transition-colors ${
                      selectedOption === index
                        ? 'border-edu-teal bg-edu-teal/10'
                        : 'border-gray-200 hover:border-edu-teal/50'
                    } ${
                      showFeedback && index === currentQuestion.correct_answer
                        ? 'border-green-500 bg-green-50'
                        : ''
                    } ${
                      showFeedback && selectedOption === index && index !== currentQuestion.correct_answer
                        ? 'border-red-500 bg-red-50'
                        : ''
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            )}
            
            {showFeedback && (
              <div className="mb-6 p-4 bg-edu-light-blue rounded-lg">
                <h3 className="font-semibold mb-2">Explanation</h3>
                <p>{currentQuestion.explanation || 'No explanation available.'}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrevious}
                className="bg-white border border-edu-teal/50 text-edu-navy hover:bg-edu-light-blue"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              
              {!showFeedback ? (
                <Button
                  onClick={() => handleOptionSelect(0)}
                  disabled={selectedOption !== null}
                  className="bg-edu-teal hover:bg-edu-teal/90"
                >
                  Submit
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-edu-teal hover:bg-edu-teal/90">
                  {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No questions available for this test.</p>
          <Button 
            className="mt-4 bg-edu-teal hover:bg-edu-teal/90"
            onClick={() => setActiveTestId(null)}
          >
            Back to Tests
          </Button>
        </div>
      )}
    </div>
  );
};

export default PracticeTests;
