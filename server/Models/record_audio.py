import pyaudio
import wave
import keyboard
import threading

def record_audio(output_file="recording.wav", sample_rate=44100, chunk=1024, channels=2):
    """
    Records audio and saves it as a WAV file. Recording stops when the Enter key is pressed.

    Parameters:
    - output_file (str): The name of the output WAV file.
    - sample_rate (int): The sample rate of the recording.
    - chunk (int): The number of frames per buffer.
    - channels (int): The number of audio channels (1 for mono, 2 for stereo).
    """
    
    # Initialize PyAudio
    audio = pyaudio.PyAudio()
    
    # Open a new stream for recording
    stream = audio.open(format=pyaudio.paInt16, channels=channels,
                        rate=sample_rate, input=True,
                        frames_per_buffer=chunk)

    print("Recording started. Press Enter to stop...")

    # Store the recorded frames in a list
    frames = []

    # Function to record audio until Enter is pressed
    def record():
        while not keyboard.is_pressed('enter'):
            data = stream.read(chunk)
            frames.append(data)

    # Start recording in a separate thread to allow key press detection
    recording_thread = threading.Thread(target=record)
    recording_thread.start()

    # Wait until the recording thread finishes (Enter key is pressed)
    recording_thread.join()

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    
    # Terminate the PortAudio interface
    audio.terminate()

    print("Recording finished.")

    # Save the recorded data as a WAV file
    with wave.open(output_file, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))

    print(f"Audio saved as {output_file}")

# Example usage
if __name__ == "__main__":
    record_audio()
