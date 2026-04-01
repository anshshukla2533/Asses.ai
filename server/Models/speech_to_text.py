import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('ASSEMBLYAI_API_KEY')

# Upload and transcribe function
def transcribe_audio(filename):
    upload_endpoint = "https://api.assemblyai.com/v2/upload"
    transcribe_endpoint = "https://api.assemblyai.com/v2/transcript"
    headers = { "authorization": API_KEY }

    # Function to upload the audio file
    def upload_file(filename):
        def read_file(filename, chunk_size=5242880):
            with open(filename, 'rb') as _file:
                while True:
                    data = _file.read(chunk_size)
                    if not data:
                        break
                    yield data

        upload_response = requests.post(upload_endpoint, headers=headers, data=read_file(filename))
        audio_url = upload_response.json()['upload_url']
        return audio_url

    # Function to start transcription
    def transcribe(audio_url):
        transcribe_request = {"audio_url": audio_url}
        transcribe_response = requests.post(transcribe_endpoint, json=transcribe_request, headers=headers)
        job_id = transcribe_response.json()['id']
        return job_id

    # Function to poll for the transcription result
    def poll(transcribe_id):
        polling_endpoint = transcribe_endpoint + '/' + transcribe_id
        polling_response = requests.get(polling_endpoint, headers=headers)
        return polling_response.json()

    # Main logic to get the transcription
    def get_transcription_result(audio_url):
        transcribe_id = transcribe(audio_url)
        while True:
            data = poll(transcribe_id)
            if data['status'] == 'completed':
                return data['text'], None
            elif data['status'] == 'error':
                return None, data['error']

    # Upload the file and get the transcription
    audio_url = upload_file(filename)
    text, error = get_transcription_result(audio_url)

    if error:
        raise Exception(f"Error in transcription: {error}")

    return text

if __name__ == "__main__":
    filename = "recording.wav"