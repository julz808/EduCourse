import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProduct } from '@/context/ProductContext';

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

export function useProductQuestions(setId?: string) {
  const { selectedProduct } = useProduct();
  
  return useQuery({
    queryKey: ['questions', selectedProduct?.slug, setId],
    queryFn: async () => {
      try {
        // Debug logs
        console.log('Selected product:', selectedProduct);
        console.log('Set ID:', setId);
        
        if (!selectedProduct?.slug) {
          console.log('No product selected');
          return [];
        }
        
        // For EduTest, ensure we're using the correct test_type with proper capitalization
        // The database has 'EduTest' (capital E and T) while our code was using 'edutest'
        const testType = selectedProduct.slug.toLowerCase().includes('edutest') ? 'EduTest' : selectedProduct.slug;
        console.log('Using test_type filter:', testType);
        
        let query = supabase
          .from('educoach_questions')
          .select('*')
          .eq('test_type', testType);
        
        if (setId) {
          query = query.eq('set_id', setId);
        }
        
        console.log('Running query for test_type:', testType, 'and set_id:', setId || 'all');
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching questions:', error);
          throw error;
        }
        
        console.log('Fetched questions count:', data?.length || 0);
        console.log('First question sample:', data?.[0] || 'No questions found');
        
        return data as EducoachQuestion[];
      } catch (error) {
        console.error('Error in useProductQuestions:', error);
        return [];
      }
    },
    enabled: !!selectedProduct?.slug,
    retry: false,
  });
} 