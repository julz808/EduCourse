import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type QuestionAttempt = {
  question_id: number;
  test_type: string;
  set_id: string;
  is_correct: boolean;
  time_spent: number;
};

export function useQuestionAttempts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const saveAttempt = useMutation({
    mutationFn: async (attempt: QuestionAttempt) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('student_question_attempts')
        .insert({
          user_id: user.id,
          question_id: attempt.question_id,
          test_type: attempt.test_type,
          set_id: attempt.set_id,
          is_correct: attempt.is_correct,
          time_spent: attempt.time_spent,
          attempted_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving question attempt:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
    }
  });
  
  return { saveAttempt };
} 