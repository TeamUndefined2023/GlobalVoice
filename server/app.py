import cv2
import numpy as np
import mediapipe as mp
import skimage.transform
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
socketio = SocketIO(app, cors_allowed_origins='*')

# Load your trained model
model = load_model('../model/ASL.h5')

# Define constants
imageSize = 64
target_dims = (imageSize, imageSize, 3)

# Create a dictionary for label mapping
# classifying the labels with the letter they are representing
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I',
    9: 'J', 10: 'K', 11: 'L', 12: 'M', 13: 'N', 14: 'O', 15: 'P', 16: 'Q',
    17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
    25: 'Z', 26: 'del', 27: 'nothing', 28: 'space'
}

# Initialize MediaPipe Hand module
mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

# API endpoint for predicting ASL gesture
# @app.route('/predict_asl', methods=['POST'])
# def predict_asl():
@socketio.on('send_frame')
def handle_frame(data):
    try:
        # Get image data from POST request
        image_data = base64.b64decode(data['image'])  # Decode base64 to bytes
        print('img', image_data)
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Detect hands in the frame
        results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        # ... (rest of the gesture detection and prediction logic)
        
        frame = cv2.resize(frame, target_dims[:2])
        frame = skimage.transform.resize(frame, target_dims)
        frame_arr = np.asarray(frame).reshape((-1, *target_dims))
        # print(frame)

        predictions = model.predict(frame_arr)
        predicted_label_idx = np.argmax(predictions)
        print(predicted_label_idx)

        # # Modify the code to match the previous example
        predicted_label = "?"
        if predicted_label_idx in labels_dict:
            predicted_label = labels_dict[predicted_label_idx]

        # Return the predicted word
        response = {'predicted_word': predicted_label}
        # return jsonify(response)
        socketio.emit('predicted_word', response)
    except Exception as e:
        print('error', e)
        # return jsonify({'error': str(e)})


@socketio.on('connect')
def handle_connect():
    print('Client connected')

if __name__ == '__main__':
    # app.run(debug=True, host='0.0.0.0', port=5000)
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)

