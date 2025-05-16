#!/usr/bin/env python3
"""
Check what questions exist in the educoach_questions table
"""

import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not found in environment variables")
    exit(1)

# Headers for Supabase API requests
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Endpoint for the educoach_questions table
endpoint = f"{SUPABASE_URL}/rest/v1/educoach_questions"

# Check how many questions total
try:
    response = requests.get(endpoint, headers=headers, params={"select": "count"})
    response.raise_for_status()
    total_count = response.json()
    print(f"Total questions in database: {len(total_count)}")
except Exception as e:
    print(f"Error: {e}")
    exit(1)

# Examine the actual schema from a sample question
try:
    print("\nExamining database schema from sample question...")
    response = requests.get(endpoint, headers=headers, params={"select": "*", "limit": 1})
    response.raise_for_status()
    sample = response.json()
    
    if sample:
        print("Fields in the questions table:")
        for key in sample[0].keys():
            print(f"  - {key}: {type(sample[0][key]).__name__}")
    else:
        print("No questions found to examine schema")
except Exception as e:
    print(f"Error: {e}")

# Check all available test types
try:
    print("\nListing unique test_type values (case sensitive):")
    response = requests.get(endpoint, headers=headers, params={"select": "test_type"})
    response.raise_for_status()
    test_type_data = response.json()
    
    test_types = {}
    for item in test_type_data:
        test_type = item.get('test_type')
        if test_type:
            test_types[test_type] = test_types.get(test_type, 0) + 1
    
    for test_type, count in sorted(test_types.items()):
        print(f"  - '{test_type}': {count} questions")
except Exception as e:
    print(f"Error: {e}")

# Check specifically for the exact capitalization of "EduTest"
try:
    print("\nChecking for 'EduTest' questions (exact match):")
    response = requests.get(endpoint, headers=headers, params={"select": "count", "test_type": "eq.EduTest"})
    response.raise_for_status()
    edutest_exact = response.json()
    print(f"  Questions with test_type = 'EduTest': {len(edutest_exact)}")
    
    # Also check lowercase
    response = requests.get(endpoint, headers=headers, params={"select": "count", "test_type": "eq.edutest"})
    response.raise_for_status()
    edutest_lower = response.json()
    print(f"  Questions with test_type = 'edutest': {len(edutest_lower)}")
    
    # Check if any questions have set_id already assigned
    response = requests.get(endpoint, headers=headers, 
                          params={"select": "count", "test_type": "eq.EduTest", "set_id": "not.is.null"})
    response.raise_for_status()
    with_set_id = response.json()
    print(f"  'EduTest' questions with set_id already assigned: {len(with_set_id)}")
    
    # Display a sample of the first few EduTest questions
    print("\nSample of EduTest questions:")
    response = requests.get(endpoint, headers=headers, 
                          params={"select": "id,test_type,test_section,sub_skill,difficulty,set_id", 
                                 "test_type": "eq.EduTest", "limit": 3})
    response.raise_for_status()
    samples = response.json()
    
    for i, sample in enumerate(samples):
        print(f"\nSample {i+1}:")
        for key, value in sample.items():
            print(f"  {key}: {value}")
    
except Exception as e:
    print(f"Error examining EduTest questions: {e}")
    
print("\nFinished checking database.") 