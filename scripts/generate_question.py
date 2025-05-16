from dotenv import load_dotenv
import os
import openai

# Load environment variables from .env file
load_dotenv()

# Set OpenAI API key from environment
openai.api_key = os.getenv("OPENAI_API_KEY")

# Example function to generate a question using GPT-4o
def generate_question(prompt):
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates test questions."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

# Example usage
if __name__ == "__main__":
    prompt = "Generate a multiple-choice math question for 10th grade students about quadratic equations."
    question = generate_question(prompt)
    print(question) 