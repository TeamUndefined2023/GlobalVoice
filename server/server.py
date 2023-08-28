import asyncio
import websockets
import numpy as np
import skimage.transform
from tensorflow.keras.models import load_model

# Load your trained model
model = load_model('../model/ASL.h5')  # Replace with your model's path

# Create a dictionary for label mapping
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I',
    9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q',
    17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
    25: 'Z', 26: 'del', 27: 'nothing', 28: 'space'
}

async def recognize_gesture(websocket, path):
    async for message in websocket:
        # Process the incoming data (if needed)
        # For example, you can convert image data from base64 to numpy array

        # Perform hand gesture recognition
        # Replace this with your image preprocessing and prediction logic
        # For simplicity, let's assume 'recognized_label' is the recognized label
        recognized_label = 'A'  # Replace with your recognition logic

        recognized_word = recognized_label  # Initially, just use the recognized label

        await websocket.send(f'{{"word": "{recognized_word}"}}')

start_server = websockets.serve(recognize_gesture, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
