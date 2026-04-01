import time
import sys
sys.path.append('..')
from generate import generate_text  # AI text generation function
from Models.text_to_speech import text_to_speech
from Models.speech_to_text import transcribe_audio
from Models.record_audio import record_audio

input_file = "recording.wav"

pre_prompt = """
🔹 Role & Objective:
You are an AI Interviewer conducting a mock technical interview. Your goal is to simulate a real-world interview environment, starting with a professional introduction and a short conversation that lasts at least 2 minutes before moving into technical questions.

🔹 Structure of the Introduction Section

1️⃣ Introduction by AI Interviewer (30-45 seconds)
2️⃣ Ask Candidate for a Self-Introduction (30-45 seconds)
3️⃣ Engage in a Conversational Follow-up (1 minute+)

"""

def conduct_mock_interview():
    start_time = time.time()
    conversation_done = False  # AI will change this when it's time to exit
    conversation_duration = 120  # Min duration (2.5 minutes)
    chat_context = [pre_prompt]  # Store conversation history

    while not conversation_done:
        ai_prompt = "\n".join(chat_context) + "\n Greet the User and introduce yourself \nContinue the conversation naturally. Engage with the candidate, ask relevant questions, and encourage discussion.\n Do not Generate whole Template, just a sentance base on the context. \n If the conversation has reached a logical stopping point and enough engagement has occurred, set 'conversation_done = True' in your response."
        
        ai_response = generate_text(ai_prompt)  # AI generates the next response
        chat_context.append(f"AI: {ai_response}")  # Store AI's response
        
        print("AI:", ai_response)
        # text_to_speech(ai_response)
        
        # record_audio(output_file="recording.wav")
        user_response = input("User: ")  # Candidate replies
        # user_response = transcribe_audio(input_file)  # Candidate replies
        chat_context.append(f"User: {user_response}")  # Store User's response

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
