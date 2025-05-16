#!/usr/bin/env python3
"""
Script to generate questions for EduTest Scholarship tests.
This script will loop through all sub-skills and generate 50 questions per sub-skill
(10 per difficulty level from 1 to 5).
"""

import os
import json
import time
import requests
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Set OpenAI API key directly 
OPENAI_API_KEY = "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"
openai.api_key = OPENAI_API_KEY

# Supabase details
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Supabase table name - CHANGE THIS to match your actual table name
# Common table names - uncomment the one you want to use
# SUPABASE_TABLE = "questions"
# SUPABASE_TABLE = "test_questions"
# SUPABASE_TABLE = "edutest_questions"
SUPABASE_TABLE = "educoach_questions"  # Using this as default

# Define EduTest sub-skill structure
EDUTEST_STRUCTURE = {
  "Verbal Reasoning": [
    "Logical Deduction",
    "Semantic Relationships",
    "Verbal Classification",
    "Word Analogies"
  ],
  "Non-verbal Reasoning": [
    "Abstract Reasoning",
    "Pattern Recognition",
    "Spatial Visualisation",
    "Visual Problem-Solving"
  ],
  "Reading Comprehension": [
    "Advanced Vocabulary",
    "Author's Intent",
    "Critical Text Analysis",
    "Interpreting Complex Texts",
    "Making Inferences"
  ],
  "Mathematics": [
    "Number Operations",
    "Pre-Algebraic Reasoning",
    "Geometric Reasoning",
    "Data Analysis",
    "Problem-Solving"
  ],
  "Written Expression": [
    "Creative Writing",
    "Persuasive Writing"
  ]
}

def format_edutest_prompt(section, sub_skill, difficulty):
    return f"""You are a test design expert working for EduCourse, an Australian learning platform that creates high-quality practice questions for selective school and scholarship tests.

🎯 Your task:
Generate a **single high-quality test question** for the **EduTest Scholarship Exam (Year 7 Entry)**. Your response will be used in a live student testing platform and must be returned as strict JSON for automatic database ingestion.

---

📋 Configuration Parameters:
- Test Type: EduTest
- Year Level: Year 6 (Year 7 Entry)
- Section: {section}
- Sub-skill: {sub_skill}
- Difficulty: {difficulty} (1 = very easy, 5 = very hard)

---

🧠 Guidelines:
- The question must assess the **exact sub-skill listed above** — do not generalize.
- Use an academic tone appropriate for high-performing Year 6 students.
- All spelling must follow UK/Australian English.
- Include **detailed reasoning** in the explanation.
- If question_type is Multiple Choice, ensure distractors are plausible and reflect common student misconceptions.
- If the sub-skill requires visual logic or layout (e.g. Spatial Visualisation, Geometric Reasoning), include a `diagram_spec` field.
- If the section is **Reading Comprehension**, the question must include a `linked_passage_id`.

---

🧾 Output Requirements (JSON only):
Return a single JSON object in the following format:

```json
{{
  "question_id": "",  // leave blank — we will auto-generate
  "test_type": "EduTest",
  "year_level": "Year 6 (Year 7 Entry)",
  "test_section": "{section}",
  "sub_skill": "{sub_skill}",
  "difficulty": {difficulty},
  "question_type": "Multiple Choice" | "Short Answer" | "Written Prompt",
  "input_type": "Text" | "Image + Text" | "Diagram" | "Numeric Entry",
  "question": "",
  "options": ["", "", "", ""],  // Optional, only for MCQ
  "correct_answer": "",
  "explanation": "",
  "source_url": "custom-generated",
  "linked_passage_id": "",  // Only for Reading Comprehension
  "diagram_spec": "",        // Only for visual sub-skills
  "image_url": ""            // Optional – only if referencing a known asset
}}
```
⛔ Do not include any explanations, commentary, or Markdown formatting outside the JSON object. Only return the JSON block.

🧩 Difficulty calibration:
Level 1: simple recall or direct inference
Level 3: standard EduTest difficulty
Level 5: abstract, multi-step logic, with subtle distractors or traps
"""

def generate_question(section, sub_skill, difficulty):
    """Generate a single question using OpenAI GPT-4o"""
    try:
        prompt = format_edutest_prompt(section, sub_skill, difficulty)
        
        # Make sure API key is set correctly before each request
        openai.api_key = OPENAI_API_KEY
        
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract content from response
        content = response.choices[0].message.content
        
        # Try to parse JSON from the response
        # Handle cases where there might be markdown or other text around the JSON
        try:
            # First attempt - try direct parsing
            question_data = json.loads(content)
        except json.JSONDecodeError:
            # Second attempt - try to extract JSON using common patterns
            try:
                # Look for JSON block in markdown code blocks
                if "```json" in content:
                    json_content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    json_content = content.split("```")[1].strip()
                else:
                    # Just try to find content between curly braces
                    start = content.find('{')
                    end = content.rfind('}') + 1
                    if start >= 0 and end > start:
                        json_content = content[start:end]
                    else:
                        raise ValueError("Could not extract JSON content")
                
                question_data = json.loads(json_content)
            except (json.JSONDecodeError, ValueError) as e:
                print(f"ERROR: Could not parse JSON from response for {sub_skill} (difficulty {difficulty})")
                print(f"Response content: {content}")
                print(f"Error: {str(e)}")
                return None
        
        # Add additional fields
        question_data.update({
            "test_type": "EduTest",
            "year_level": "Year 6 (Year 7 Entry)",
            "test_section": section,
            "sub_skill": sub_skill,
            "difficulty": difficulty,
            "set_id": "raw",
            "source_url": "custom-generated",
            "correct_answer_source": "GPT-4"
        })
        
        return question_data
        
    except Exception as e:
        print(f"ERROR: Failed to generate question for {sub_skill} (difficulty {difficulty})")
        print(f"Error: {str(e)}")
        
        # If we hit quota limits, exit the program to prevent further useless API calls
        if "quota" in str(e).lower() or "exceeded" in str(e).lower():
            print("\n\n⚠️ API QUOTA EXCEEDED! Please check your OpenAI billing and upgrade your plan.")
            print("Exiting program to prevent further API calls.")
            exit(1)
            
        return None

def upload_to_supabase(question_data):
    """Upload a question to Supabase"""
    try:
        # Make a copy of the data to avoid modifying the original
        data_to_upload = question_data.copy()
        
        # Remove any fields that might conflict with Supabase's primary key
        if "id" in data_to_upload:
            del data_to_upload["id"]
        
        # Remove empty question_id field (Supabase will generate one)
        if "question_id" in data_to_upload and (data_to_upload["question_id"] == "" or data_to_upload["question_id"] is None):
            del data_to_upload["question_id"]
        
        # Make sure options is a proper JSON array if it exists
        if "options" in data_to_upload and isinstance(data_to_upload["options"], list):
            # It's already a list, so we're good
            pass
        
        # Print what we're about to upload for debugging
        print(f"\nUploading data: {json.dumps(data_to_upload)[:100]}...")
        
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        # Use the specified table name
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
            headers=headers,
            json=data_to_upload
        )
        
        # Get more detailed error info if available
        if response.status_code >= 400:
            print(f"Status code: {response.status_code}")
            print(f"Response text: {response.text}")
            response.raise_for_status()
            
        return True
        
    except Exception as e:
        print(f"ERROR: Failed to upload question")
        print(f"Error: {str(e)}")
        return False

def main():
    """Main function to generate and upload questions"""
    print("Starting EduTest question generation with OpenAI API key:", OPENAI_API_KEY[:10] + "..." + OPENAI_API_KEY[-5:])
    print("Supabase URL:", SUPABASE_URL)
    print("Supabase Table:", SUPABASE_TABLE)
    
    # Check if API key is valid by making a test call
    try:
        openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "Test connection. Reply with OK."}],
            max_tokens=5
        )
        print("✅ OpenAI connection successful!")
    except Exception as e:
        print(f"❌ OpenAI connection failed: {str(e)}")
        print("Please check your API key and try again.")
        return
    
    # Test Supabase connection
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
        }
        
        # Try to get a single row to check if table exists
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}?limit=1",
            headers=headers
        )
        
        response.raise_for_status()
        print("✅ Supabase connection and table successful!")
        
        # Try a test insertion with minimal data to validate the table structure
        print("Testing Supabase insertion...")
        try:
            test_data = {
                "question": "Test question",
                "test_type": "EduTest",
                "year_level": "Year 6 (Year 7 Entry)",
                "test_section": "Test",
                "sub_skill": "Test",
                "difficulty": 1,
                "set_id": "test",
                "question_type": "Multiple Choice",
                "input_type": "Text",
                "correct_answer": "Test",
                "explanation": "Test explanation",
                "options": ["A", "B", "C", "D"]
            }
            
            test_headers = {
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            
            test_response = requests.post(
                f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
                headers=test_headers,
                json=test_data
            )
            
            if test_response.status_code >= 400:
                print(f"❌ Test insertion failed: {test_response.status_code}")
                print(f"Response: {test_response.text}")
                print("Continuing anyway, but uploads may fail.")
            else:
                print("✅ Test insertion successful!")
                
        except Exception as e:
            print(f"❌ Test insertion error: {str(e)}")
            print("Continuing anyway, but uploads may fail.")
    
    except Exception as e:
        print(f"❌ Supabase connection failed: {str(e)}")
        print(f"Please check if the table '{SUPABASE_TABLE}' exists in your Supabase project.")
        print("You may need to edit this script to change SUPABASE_TABLE to the correct table name.")
        return
    
    # Ask user if they want to continue with question generation
    response = input("\nDo you want to continue with question generation? (y/n): ")
    if response.lower() != 'y':
        print("Exiting.")
        return
    
    # Loop through all sections and sub-skills
    for section, sub_skills in EDUTEST_STRUCTURE.items():
        print(f"\n=== Generating questions for section: {section} ===")
        
        for sub_skill in sub_skills:
            print(f"\n--- Sub-skill: {sub_skill} ---")
            
            # For each difficulty level (1-5)
            for difficulty in range(1, 6):
                print(f"Generating 10 questions for difficulty level {difficulty}...")
                
                # Generate 10 questions per difficulty level
                for i in range(1, 11):
                    print(f"  Question {i}/10...", end="", flush=True)
                    
                    # Generate question
                    question_data = generate_question(section, sub_skill, difficulty)
                    
                    # Skip if question generation failed
                    if question_data is None:
                        print(" Failed to generate, skipping.")
                        continue
                    
                    # Upload to Supabase
                    success = upload_to_supabase(question_data)
                    
                    if success:
                        print(f" Uploaded: {sub_skill} (difficulty {difficulty}) ✅")
                    else:
                        print(" Failed to upload.")
                    
                    # Rate limiting to avoid API throttling
                    time.sleep(1)

if __name__ == "__main__":
    main() 