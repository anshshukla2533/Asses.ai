import pyttsx3
text_speech = pyttsx3.init()

def text_to_speech(text):
    text_speech.say(text)
    text_speech.runAndWait()