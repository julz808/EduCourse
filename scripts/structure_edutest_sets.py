#!/usr/bin/env python3
"""
Structure EduTest questions into organized sets for the EduCoach platform.

This script assigns set_id values to EduTest questions in the Supabase database:
- Diagnostic test: 1 question per sub-skill per difficulty level
- Practice tests: 5 tests with distribution matching actual EduTest exams
- Drill sets: Remaining questions organized by sub-skill

Usage:
    python structure_edutest_sets.py
"""

import os
import random
import sys

# Check for required packages
try:
    import requests
    from dotenv import load_dotenv
    from collections import defaultdict
except ImportError as e:
    print(f"Error: Required package not found: {e}")
    print("Please install required packages using: pip install python-dotenv requests")
    sys.exit(1)

# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print(f"Error loading .env file: {e}")
    sys.exit(1)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not found in environment variables")
    print("Make sure SUPABASE_URL and SUPABASE_KEY are set in your .env file")
    sys.exit(1)

# Headers for Supabase API requests
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"  # Don't return the updated records to save bandwidth
}

# Define test sections and their target question counts for practice tests
PRACTICE_TEST_STRUCTURE = {
    "Verbal Reasoning": 38,  # ~35-40 questions
    "Reading Comprehension": 28,  # ~25-30 questions
    "Written Expression": 1,  # 1 question
    "Mathematics": 33,  # ~30-35 questions
    "Non-verbal Reasoning": 33  # ~30-35 questions
}

# Main function
def main():
    try:
        # Step 1: Fetch all EduTest questions from Supabase
        print("Fetching EduTest questions from database...")
        
        # Endpoint for the educoach_questions table
        endpoint = f"{SUPABASE_URL}/rest/v1/educoach_questions"
        
        # Query parameters to filter for EduTest questions with set_id='raw'
        params = {
            "select": "*",
            "test_type": "eq.EduTest",
            "set_id": "eq.raw"
        }
        
        # Make the request
        try:
            response = requests.get(endpoint, headers=headers, params=params)
            response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        except requests.exceptions.RequestException as e:
            print(f"Error connecting to Supabase: {e}")
            return
        
        # Extract questions from response
        all_questions = response.json()
        
        if not all_questions:
            print("No EduTest questions found in the database.")
            return
        
        print(f"Found {len(all_questions)} EduTest questions with set_id='raw'.")
        
        # Organize questions by test_section, sub_skill, and difficulty
        organized_questions = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
        for question in all_questions:
            test_section = question.get('test_section', 'Unknown')
            sub_skill = question.get('sub_skill', 'Unknown')
            difficulty = question.get('difficulty', 0)
            
            if not test_section or not sub_skill or not difficulty:
                print(f"Warning: Question {question.get('id')} has missing metadata and will be skipped")
                continue
                
            organized_questions[test_section][sub_skill][difficulty].append(question)
        
        # Track which questions have been assigned
        assigned_questions = set()
        assignment_stats = {
            'diagnostic': 0,
            'practice_1': 0, 'practice_2': 0, 'practice_3': 0, 'practice_4': 0, 'practice_5': 0,
            'drills': defaultdict(int)
        }
        
        # Step 2: Create diagnostic test - 1 question per sub-skill per difficulty
        print("\nCreating diagnostic test set...")
        diagnostic_questions = []
        
        for test_section, skills in organized_questions.items():
            for sub_skill, difficulties in skills.items():
                for difficulty in range(1, 6):  # Difficulty levels 1-5
                    if difficulty in difficulties and difficulties[difficulty]:
                        # Select one random question for this sub-skill and difficulty
                        question = random.choice(difficulties[difficulty])
                        diagnostic_questions.append(question)
                        assigned_questions.add(question['id'])
                        assignment_stats['diagnostic'] += 1
        
        # Update diagnostic questions in the database
        update_questions(diagnostic_questions, 'diagnostic')
        
        # Step 3: Create practice tests
        print("\nCreating practice test sets...")
        practice_sets = {f'practice_{i}': [] for i in range(1, 6)}
        
        # Distribute questions by test section according to target counts
        for practice_set_id in practice_sets.keys():
            for test_section, target_count in PRACTICE_TEST_STRUCTURE.items():
                # Find all questions for this test section that haven't been assigned yet
                available_questions = [
                    q for section in organized_questions.items() if section[0] == test_section
                    for skill in section[1].values() 
                    for difficulty in skill.values()
                    for q in difficulty
                    if q['id'] not in assigned_questions
                ]
                
                # Randomly select the target number of questions (or as many as available)
                num_to_select = min(target_count, len(available_questions))
                if num_to_select == 0:
                    print(f"Warning: No questions available for {test_section} in {practice_set_id}")
                    continue
                    
                selected_questions = random.sample(available_questions, num_to_select)
                
                # Add to practice set and mark as assigned
                practice_sets[practice_set_id].extend(selected_questions)
                for q in selected_questions:
                    assigned_questions.add(q['id'])
                    assignment_stats[practice_set_id] += 1
        
        # Update practice test questions in the database
        for practice_set_id, questions in practice_sets.items():
            update_questions(questions, practice_set_id)
        
        # Step 4: Assign remaining questions to drill sets
        print("\nCreating drill sets...")
        drill_questions = defaultdict(list)
        
        # Process remaining unassigned questions
        for test_section, skills in organized_questions.items():
            for sub_skill, difficulties in skills.items():
                for difficulty, questions in difficulties.items():
                    for question in questions:
                        if question['id'] not in assigned_questions:
                            drill_set_id = f"drill-{sub_skill.replace(' ', '-').lower()}"
                            drill_questions[drill_set_id].append(question)
                            assigned_questions.add(question['id'])
                            assignment_stats['drills'][drill_set_id] += 1
        
        # Update drill set questions in the database
        for drill_set_id, questions in drill_questions.items():
            update_questions(questions, drill_set_id)
        
        # Print summary statistics
        print_summary(assignment_stats)
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

def update_questions(questions, set_id):
    """
    Update questions in the database with the assigned set_id
    """
    if not questions:
        return
    
    print(f"Assigning {len(questions)} questions to set_id: {set_id}")
    
    # Endpoint for the educoach_questions table
    endpoint = f"{SUPABASE_URL}/rest/v1/educoach_questions"
    
    # Update questions in batches to avoid request size limits
    batch_size = 50
    for i in range(0, len(questions), batch_size):
        batch = questions[i:i+batch_size]
        
        # Process each question in the batch
        for question in batch:
            # Prepare the update payload
            data = {"set_id": set_id}
            
            # Make the PATCH request for this question
            question_endpoint = f"{endpoint}?id=eq.{question['id']}"
            try:
                response = requests.patch(question_endpoint, headers=headers, json=data)
                if response.status_code >= 300:
                    print(f"Error updating question {question['id']}: {response.status_code}")
                    print(response.text)
            except requests.exceptions.RequestException as e:
                print(f"Request error updating question {question['id']}: {e}")

def print_summary(stats):
    """
    Print summary statistics of question assignments
    """
    print("\n--- ASSIGNMENT SUMMARY ---")
    print(f"Diagnostic test: {stats['diagnostic']} questions")
    
    print("\nPractice tests:")
    for i in range(1, 6):
        print(f"  Practice test {i}: {stats[f'practice_{i}']} questions")
    
    print("\nDrill sets:")
    for drill_set, count in sorted(stats['drills'].items()):
        print(f"  {drill_set}: {count} questions")
    
    total = stats['diagnostic'] + sum(stats[f'practice_{i}'] for i in range(1, 6)) + sum(stats['drills'].values())
    print(f"\nTotal questions assigned: {total}")

if __name__ == "__main__":
    main() 