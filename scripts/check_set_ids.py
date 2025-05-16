#!/usr/bin/env python3
"""
Check what set_id values are currently assigned to EduTest questions
"""

import os
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

# Check all EduTest questions and their set_id values
try:
    print("Checking EduTest questions and their set_id values:")
    
    # Get all unique set_id values for EduTest questions
    response = requests.get(endpoint, headers=headers, 
                          params={"select": "set_id", "test_type": "eq.EduTest"})
    response.raise_for_status()
    data = response.json()
    
    set_ids = {}
    for item in data:
        set_id = item.get('set_id')
        set_ids[set_id] = set_ids.get(set_id, 0) + 1
    
    print(f"\nFound {len(set_ids)} unique set_id values across {len(data)} EduTest questions:")
    
    for set_id, count in sorted(set_ids.items(), key=lambda x: x[1], reverse=True):
        print(f"  - '{set_id}': {count} questions")
    
    # Get distribution by test_section for a sample set_id
    if 'raw' in set_ids and set_ids['raw'] > 0:
        print("\nBreakdown of 'raw' set_id by test_section:")
        response = requests.get(endpoint, headers=headers, 
                              params={"select": "test_section", "test_type": "eq.EduTest", "set_id": "eq.raw"})
        response.raise_for_status()
        raw_data = response.json()
        
        sections = {}
        for item in raw_data:
            section = item.get('test_section')
            sections[section] = sections.get(section, 0) + 1
        
        for section, count in sorted(sections.items(), key=lambda x: x[1], reverse=True):
            print(f"  - {section}: {count} questions")
    
except Exception as e:
    print(f"Error: {e}")
    exit(1) 