# EduCoach Scripts

This directory contains utility scripts for the EduCoach platform.

## Setup

Before running any scripts, make sure you have the required Python packages installed:

```bash
pip install python-dotenv requests
```

## Available Scripts

### Structure EduTest Sets

The `structure_edutest_sets.py` script organizes EduTest questions into structured sets for the platform:

- Diagnostic test: 1 question per sub-skill per difficulty level
- 5 Practice tests: Distribution matching actual EduTest exams
- Drill sets: Remaining questions organized by sub-skill

To run:

```bash
python scripts/structure_edutest_sets.py
```

#### How it works

1. Fetches all EduTest questions without a set_id from Supabase
2. Creates a diagnostic test with 1 question per sub-skill per difficulty level
3. Creates 5 practice tests with distributions matching actual EduTest exams
4. Assigns remaining questions to drill sets organized by sub-skill
5. Prints a summary of the assignments

#### Requirements

- Python 3.6+
- A `.env` file in the project root with Supabase credentials:
  ```
  SUPABASE_URL=your_supabase_url
  SUPABASE_KEY=your_supabase_key
  ``` 