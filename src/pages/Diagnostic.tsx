import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { diagnosticTests } from "../data/dummyData";
import { useUser } from "../context/UserContext";
import { useProduct } from "../context/ProductContext";
import { TestResult, TestType } from "../types";
import { toast } from "@/hooks/use-toast";
import { useProductQuestions } from "@/hooks/useProductQuestions";
import { useQuestionAttempts } from "@/hooks/useQuestionAttempts";

const Diagnostic = () => {
  const navigate = useNavigate();
  const { updateAfterTest } = useUser();
  const { selectedProduct } = useProduct();
  const { data: questions, isLoading } = useProductQuestions('diagnostic');
  const { saveAttempt } = useQuestionAttempts();
  
  const [activeDiagnostic, setActiveDiagnostic] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  
  // Filter tests based on current product
  const filteredTests = diagnosticTests.filter(test => {
    if (!selectedProduct) return true; // Safety check
    // Match test name with selected product
    return test.title.toLowerCase().includes(selectedProduct.name.toLowerCase());
  });
  
  // Reset active test when product changes
  useEffect(() => {
    setActiveDiagnostic(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
  }, [selectedProduct]);

  const handleStartDiagnostic = () => {
    if (!questions || questions.length === 0) return;
    
    setActiveDiagnostic(1); // Use a dummy ID since we're using real questions
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(Array(questions.length).fill(false));
    setStartTime(new Date());
    setQuestionStartTime(new Date());
  };

  const handleOptionSelect = (index: number) => {
    if (!questions) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
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
        set_id: 'diagnostic',
        is_correct: isCorrect,
        time_spent: timeSpent
      });
    } catch (error) {
      console.error('Error saving question attempt:', error);
    }
    
    // Mark question as answered
    const updatedAnswers = [...answeredQuestions];
    updatedAnswers[currentQuestionIndex] = true;
    setAnsweredQuestions(updatedAnswers);
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
      finishDiagnostic();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };
  
  const finishDiagnostic = () => {
    if (!questions || !startTime) return;
    
    // Calculate time spent
    const endTime = new Date();
    const timeSpentMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Calculate score
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Create topic results
    const topicResults: { [key: string]: number } = {};
    const subSkillResults: { [key: string]: number } = {};
    
    // Track correct answers by topic and subskill
    const topicCounts: { [key: string]: { correct: number, total: number } } = {};
    const subSkillCounts: { [key: string]: { correct: number, total: number } } = {};
    
    // Go through each question to build topic and subskill results
    questions.forEach((question, index) => {
      const isCorrect = answeredQuestions[index] && 
        selectedOption === question.correct_answer;
      
      // Update topic counts
      if (!topicCounts[question.topic]) {
        topicCounts[question.topic] = { correct: 0, total: 0 };
      }
      topicCounts[question.topic].total += 1;
      if (isCorrect) {
        topicCounts[question.topic].correct += 1;
      }
      
      // Update subskill counts
      const subSkill = question.sub_skill;
      if (!subSkillCounts[subSkill]) {
        subSkillCounts[subSkill] = { correct: 0, total: 0 };
      }
      subSkillCounts[subSkill].total += 1;
      if (isCorrect) {
        subSkillCounts[subSkill].correct += 1;
      }
    });
    
    // Calculate percentages for topics
    Object.entries(topicCounts).forEach(([topic, counts]) => {
      topicResults[topic] = Math.round((counts.correct / counts.total) * 100);
    });
    
    // Calculate percentages for subskills
    Object.entries(subSkillCounts).forEach(([subSkill, counts]) => {
      subSkillResults[subSkill] = Math.round((counts.correct / counts.total) * 100);
    });
    
    // Create test result
    const testResult: TestResult = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      testType: selectedProduct?.slug as TestType,
      testId: 1, // Use a dummy ID since we're using real questions
      testName: "EduTest Diagnostic Assessment",
      score,
      totalQuestions: questions.length,
      timeSpentMinutes,
      topicResults,
      subSkillResults
    };
    
    // Update user performance
    updateAfterTest(testResult);
    
    // Show toast and reset state
    toast({
      title: "Diagnostic Test Completed!",
      description: `You scored ${score}%. View your results in the Insights section.`,
    });
    
    // Reset state
    setActiveDiagnostic(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setCorrectAnswers(0);
    
    // Navigate to insights
    navigate("/dashboard/insights");
  };
  
  // Current question from Supabase
  const currentQuestion = questions && activeDiagnostic && currentQuestionIndex < questions.length ? 
    questions[currentQuestionIndex] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-edu-navy mb-2">Diagnostic Tests</h1>
        <p className="text-edu-navy/70">
          These tests help identify your strengths and areas for improvement 
          {selectedProduct ? ` for ${selectedProduct.name}` : ''}.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading diagnostic tests...</p>
        </div>
      ) : !activeDiagnostic ? (
        // List of available diagnostic tests
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card className="border border-edu-teal/10 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-edu-navy">EduTest Diagnostic Assessment</CardTitle>
              <CardDescription>
                Verbal Reasoning • Non-verbal Reasoning • Mathematics
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-edu-navy/80">
              <div className="flex justify-between mb-2">
                <span>Questions:</span>
                <span className="font-medium">{questions?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">45-60 minutes</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-edu-teal hover:bg-edu-teal/90"
                onClick={handleStartDiagnostic}
                disabled={!questions || questions.length === 0}
              >
                Start Diagnostic
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : currentQuestion ? (
        // Active diagnostic test question view
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-edu-navy/70">
              <span>EduTest Diagnostic Assessment</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-edu-navy/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock size={14} />
                <span className="text-sm">Question {currentQuestionIndex + 1} of {questions?.length || 0}</span>
              </div>
            </div>
          </div>
          
          <Card className="edu-card">
            <div className="flex justify-between mb-6">
              <span className="text-sm text-edu-navy/70">
                {currentQuestion.topic} • {currentQuestion.sub_skill}
              </span>
              <button className="text-edu-navy/70 hover:text-edu-navy flex items-center gap-1">
                <Flag size={16} />
                <span className="text-sm">Flag</span>
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
              {/* If there was an image for the question, it would go here */}
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
                className="btn-secondary bg-white border border-edu-teal/50 text-edu-navy hover:bg-edu-light-blue"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              
              {!showFeedback ? (
                <Button
                  onClick={() => handleOptionSelect(0)}
                  disabled={selectedOption !== null}
                  className={`btn-primary ${selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Submit
                </Button>
              ) : (
                <Button onClick={handleNext} className="btn-primary">
                  {currentQuestionIndex < (questions?.length || 0) - 1 ? 'Next' : 'Finish'}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No questions available for this diagnostic test.</p>
          <Button 
            className="mt-4"
            onClick={() => setActiveDiagnostic(null)}
          >
            Back to Tests
          </Button>
        </div>
      )}
    </div>
  );
};

export default Diagnostic;
