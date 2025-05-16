// Simple script to check the database for edutest questions
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load env variables manually since we're using ESM
const envFile = fs.readFileSync('./.env', 'utf8');
const envVars = dotenv.parse(envFile);

const SUPABASE_URL = envVars.SUPABASE_URL;
const SUPABASE_KEY = envVars.SUPABASE_KEY;

async function checkDatabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Supabase URL or key not found in environment variables');
    return;
  }

  console.log('Connecting to:', SUPABASE_URL);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  try {
    // Check for available tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error querying tables:', tablesError);
    } else {
      console.log('Available tables:', tables);
    }
    
    // Check for any questions
    const { data: allQuestions, error: allQuestionsError } = await supabase
      .from('educoach_questions')
      .select('*')
      .limit(1);
    
    if (allQuestionsError) {
      console.error('Error querying questions:', allQuestionsError);
    } else {
      console.log('Question sample:', allQuestions);
      if (allQuestions.length === 0) {
        console.log('No questions found in the educoach_questions table!');
      }
    }
    
    // Check available test types
    const { data: testTypes, error: testTypesError } = await supabase
      .from('educoach_questions')
      .select('test_type')
      .limit(20);
    
    if (testTypesError) {
      console.error('Error querying test types:', testTypesError);
    } else {
      const uniqueTestTypes = [...new Set(testTypes.map(item => item.test_type))];
      console.log('Available test types:', uniqueTestTypes);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase(); 