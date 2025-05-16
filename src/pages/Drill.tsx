import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Flag, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import { useTestType } from "../context/TestTypeContext";
import { drillCategories } from "../data/dummyData";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionAttempts } from "@/hooks/useQuestionAttempts";

type EducoachQuestion = {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  test_type: string;
  set_id: string;
  question_type: string;
  input_type: string;
  difficulty: string;
  topic: string;
  sub_skill: string;
  created_at: string;
  updated_at: string | null;
};

const Drill = () => {
  const navigate = useNavigate();
  const { updateAfterDrill } = useUser();
  const { testType } = useTestType();
  const { saveAttempt } = useQuestionAttempts();
  
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [subSkill, setSubSkill] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [immediateFeedback, setImmediateFeedback] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [drillQuestions, setDrillQuestions] = useState<EducoachQuestion[]>([]);
  
  // Reset states when test type changes
  useEffect(() => {
    setSubject('');
    setTopic('');
    setSubSkill('');
    setShowQuestion(false);
  }, [testType]);
  
  // Reset timer when starting a drill or moving to a new question
  useEffect(() => {
    if (showQuestion) {
      setTimeLeft(60);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showQuestion, currentQuestionIndex]);
  
  // Fetch drill questions when subSkill changes
  const fetchDrillQuestions = async () => {
    if (!subSkill) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('educoach_questions')
        .select('*')
        .eq('test_type', 'EduTest')
        .eq('sub_skill', subSkill)
        .ilike('set_id', 'drill-%')
        .limit(10); // Limit to 10 questions per drill
      
      if (error) {
        console.error('Error fetching drill questions:', error);
        throw error;
      }
      
      setDrillQuestions(data as EducoachQuestion[] || []);
    } catch (error) {
      console.error('Error fetching drill questions:', error);
      toast({
        title: "Error",
        description: "Failed to load drill questions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartDrill = async () => {
    if (subject && topic && subSkill) {
      await fetchDrillQuestions();
      
      if (drillQuestions.length === 0) {
        toast({
          title: "No Questions",
          description: "No questions available for this sub-skill.",
        });
        return;
      }
      
      setShowQuestion(true);
      setCurrentQuestionIndex(0);
      setCorrectAnswers(0);
      setStartTime(new Date());
      setQuestionStartTime(new Date());
    }
  };
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    if (immediateFeedback) {
      setShowFeedback(true);
      
      // Check if answer is correct
      if (drillQuestions && drillQuestions[currentQuestionIndex]) {
        const currentQuestion = drillQuestions[currentQuestionIndex];
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
            set_id: currentQuestion.set_id,
            is_correct: isCorrect,
            time_spent: timeSpent
          });
        } catch (error) {
          console.error('Error saving question attempt:', error);
        }
      }
    }
  };
  
  const handleSubmit = () => {
    if (!immediateFeedback && selectedOption !== null) {
      setShowFeedback(true);
      
      // Check if answer is correct
      if (drillQuestions && drillQuestions[currentQuestionIndex]) {
        const currentQuestion = drillQuestions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correct_answer;
        
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
            set_id: currentQuestion.set_id,
            is_correct: isCorrect,
            time_spent: timeSpent
          });
        } catch (error) {
          console.error('Error saving question attempt:', error);
        }
      }
    }
  };
  
  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setQuestionStartTime(new Date()); // Reset timer for next question
    
    if (currentQuestionIndex < drillQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Drill is complete
      finishDrill();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setQuestionStartTime(new Date()); // Reset timer for previous question
    }
  };
  
  const finishDrill = () => {
    if (!startTime) return;
    
    // Calculate time spent
    const endTime = new Date();
    const timeSpentMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Update user performance
    updateAfterDrill(
      topic,
      subSkill,
      correctAnswers,
      drillQuestions.length,
      timeSpentMinutes
    );
    
    // Show toast and reset state
    const score = Math.round((correctAnswers / drillQuestions.length) * 100);
    toast({
      title: "Drill Completed!",
      description: `You scored ${score}% on the ${subSkill} drill. Great job!`,
    });
    
    // Reset state
    setShowQuestion(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setCorrectAnswers(0);
    
    // Navigate to dashboard
    navigate("/dashboard");
  };
  
  // Filter drill categories based on test type
  const filteredDrillCategories = drillCategories.filter(cat => {
    if (testType === 'NAPLAN') return ['Mathematics', 'English'].includes(cat.subject);
    if (testType === 'Selective Entry') return true; // All categories apply
    if (testType === 'ACER Scholarship') return true; // All categories apply
    if (testType === 'EduTest') return ['Mathematics', 'English', 'Science'].includes(cat.subject);
    return true;
  });
  
  // Get available topics for selected subject
  const availableTopics = subject ? 
    filteredDrillCategories.find(cat => cat.subject === subject)?.topics || {} : {};
  
  // Get available subskills for selected topic
  const availableSubSkills = topic && subject ? 
    availableTopics[topic] || [] : [];
  
  // Current question
  const currentQuestion = showQuestion && drillQuestions.length > 0 ? 
    drillQuestions[currentQuestionIndex] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-edu-navy mb-1">Drill Practice</h1>
        <p className="text-edu-navy/70">Select a subject and topic to practice specific skills</p>
      </div>
      
      {!showQuestion ? (
        <Card className="edu-card max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Select your drill</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDrillCategories.map((cat) => (
                    <SelectItem key={cat.subject} value={cat.subject}>{cat.subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {subject && (
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(availableTopics).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {topic && (
              <div className="space-y-2">
                <Label>Sub-skill</Label>
                <Select onValueChange={setSubSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={handleStartDrill}
              disabled={!subject || !topic || !subSkill || isLoading}
              className={`w-full btn-primary mt-4 ${(!subject || !topic || !subSkill || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading Questions...' : 'Start Practice'}
            </Button>
          </div>
        </Card>
      ) : currentQuestion ? (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-edu-navy/70">
              <span>{subject}</span>
              <ChevronRight size={16} />
              <span>{topic}</span>
              <ChevronRight size={16} />
              <span>{subSkill}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="immediate-feedback"
                  checked={immediateFeedback}
                  onCheckedChange={setImmediateFeedback}
                />
                <Label htmlFor="immediate-feedback" className="text-sm">
                  Immediate Feedback
                </Label>
              </div>
              
              <div className="bg-edu-navy/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock size={14} />
                <span className="text-sm">{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          <Card className="edu-card">
            <div className="flex justify-between mb-6">
              <span className="text-sm text-edu-navy/70">Question {currentQuestionIndex + 1} of {drillQuestions.length}</span>
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
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn-secondary bg-white border border-edu-teal/50 text-edu-navy hover:bg-edu-light-blue"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
              
              {!showFeedback ? (
                <Button 
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className={`btn-primary ${selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Submit
                </Button>
              ) : (
                <Button onClick={handleNext} className="btn-primary">
                  {currentQuestionIndex < drillQuestions.length - 1 ? 'Next' : 'Finish'}
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No questions available for this drill.</p>
          <Button 
            className="mt-4"
            onClick={() => setShowQuestion(false)}
          >
            Back to Drills
          </Button>
        </div>
      )}
    </div>
  );
};

export default Drill;
