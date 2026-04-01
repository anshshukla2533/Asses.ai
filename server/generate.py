import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# Configure the API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize the model
model = genai.GenerativeModel("gemini-1.5-pro")

# Function to generate text
def generate_text(prompt):
    # Generate text
    response = model.generate_content(prompt)
    
    return response.candidates[0].content.parts[0].text