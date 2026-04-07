import time
import sys
import json
import os
sys.path.append('..')
from generate import generate_text  # AI text generation function
from Models.text_to_speech import text_to_speech
from Models.speech_to_text import transcribe_audio
from Models.record_audio import record_audio
from Scrapper.scrap import get_github_details, get_leetcode_details

from redis_global import redis_client
input_file = "recording.wav"
resume_path = os.path.join("..", "constant", "resume.pdf")

def get_chat():
    chat_keys = redis_client.keys("chat:*")
    chat_history = []
    
    for key in chat_keys:
        chat_message = json.loads(redis_client.get(key))
        chat_history.append(chat_message)
    
    return chat_history

def get_candidate_profile():
    github_details = []
    leetcode_details = ""

    try:
        github_details = get_github_details(resume_path)
    except Exception:
        github_details = []

    try:
        leetcode_details = get_leetcode_details(resume_path)
    except Exception:
        leetcode_details = ""

    return {
        "github_details": github_details,
        "leetcode_details": leetcode_details
    }


intro_chat= get_chat()
candidate_profile = get_candidate_profile()

pre_prompt = f""" You are an AI interviewer simulating a real-world technical interview experience. You have already conducted the introduction round, and here is the information from that chat: {intro_chat}.

🎯 Objective:
Your goal is to conduct a structured technical interview that assesses the candidate's problem-solving skills, technical knowledge, and ability to optimize solutions. The interview should be interactive, engaging, and adaptive—just like a real human interviewer.

🔍 Interview Flow:
1️⃣ Start with Core Computer Science Questions (OOPs & DBMS):

Begin by asking two to three fundamental questions from Object-Oriented Programming (OOPs) and Database Management Systems (DBMS).
You can refer to the {intro_chat} to tailor questions based on the candidate's background.
Ensure that your questions challenge their conceptual understanding, rather than just asking for definitions.
2️⃣ Move on to Algorithmic Coding Questions:

Once the candidate has answered the core CS questions, transition into few coding problem related to the candidate profile data collected from the resume and coding profiles: {candidate_profile}.
Use this direct candidate data to personalize questions instead of relying on any RAG pipeline.
Ensure the question matches their expertise level while also pushing their problem-solving abilities.
3️⃣ Evaluate the Candidate’s Approach (Brute Force vs. Optimal):

If they provide a brute-force solution, challenge them to optimize it.
Ask guiding questions like:
"Can you reduce the time complexity?" or "Is there a way to use a more efficient data structure?"
If they give an optimal approach, acknowledge their correctness and conclude the interview professionally.
4️⃣ Ending the Interview:

If the candidate struggles to optimize the brute-force solution, let the discussion continue for a limited time before gracefully transitioning to the next round.
If they answer everything correctly, close the interview on a positive note, providing feedback or a brief summary.
🔹 Tone & Behavior:
Be engaging, professional, and slightly challenging, just like a real technical interviewer.
Adapt based on the candidate’s responses—if they seem confident, increase difficulty slightly; if they struggle, provide hints.
Maintain a time constraint for each section to simulate a real interview setting (~2 minutes per question).
Ensure a smooth transition between rounds to keep the interview flow natural."""



def conduct_mock_interview():
    start_time = time.time()
    conversation_done = False  # AI will change this when it's time to exit
    conversation_duration = 500  # Min duration (2.5 minutes)
    chat_context = [pre_prompt]  # Store conversation history

    while not conversation_done:
        ai_prompt = "\n".join(chat_context) + """\n Give the response as now we are moving to the next section 
        \n Continue the conversation naturally. Engage with the candidate, ask relevant questions, and encourage discussion as mentioned in the above prompt.
        \n Do not Generate whole Template, just a sentance base on the context.
        \n If the conversation has reached a logical stopping point and enough engagement has occurred,
          set 'conversation_done = True' in your response."""
        
        ai_response = generate_text(ai_prompt)  # AI generates the next response
        chat_context.append(f"AI: {ai_response}")  # Store AI's response
        
        print("AI:", ai_response)
        # text_to_speech(ai_response)
        
        # record_audio(output_file="recording.wav")
        user_response = input("User: ")  # Candidate replies
        # user_response = transcribe_audio(input_file)  # Candidate replies
        chat_context.append(f"User: {user_response}")  # Store User's response

        # Store the chat in Redis
        chat_id = redis_client.incr("technical_interview_chat_id")
        chat_message = {"user": "User", "message": user_response}
        redis_client.set(f"technical_interview:chat:{chat_id}", json.dumps(chat_message))
        chat_message = {"user": "AI", "message": ai_response}
        redis_client.set(f"technical_interview:chat:{chat_id+1}", json.dumps(chat_message))

        # AI DECIDES WHEN TO EXIT (Checks for 'conversation_done = True' in its response)
        if "conversation_done = True" in ai_response:
            closure_prompt = "\n".join(chat_context) + "\n Generate a closing statement to end the conversation. \n Do not Generate whole Template, just a sentance base on the context. \n Also add a statement to move to the technical section."
            closure_statement = generate_text(closure_prompt)
            print("AI:", closure_statement)
            chat_context.append(f"AI: {closure_statement}")
            break
        elif time.time() - start_time > conversation_duration:
            closure_prompt = "\n".join(chat_context) + "\n Generate a closing statement to end the conversation. \n Do not Generate whole Template, just a sentance base on the context. \n Also add a statement to move to the technical section."
            closure_statement = generate_text(closure_prompt)
            print("AI:", closure_statement)
            chat_context.append(f"AI: {closure_statement}")
            break

conduct_mock_interview()
