import base64
import numpy as np
from flask import Flask, request, jsonify
from PIL import Image
from io import BytesIO
import tensorflow as tf
import os

app = Flask(__name__)

# Load the pre-trained model
model = tf.keras.models.load_model('mnist_classification_model.h5')




@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse and validate the incoming JSON request
        data = request.json
        if 'Image' not in data:
            return jsonify({'error': 'Missing "Image" key in the request'}), 400

        # Decode the base64 image
        image_data = base64.b64decode(data['Image'].split(',')[1])

        # Open the image
        image = Image.open(BytesIO(image_data))
        image.save("original_image_fixed.png")  # Save the original image for debugging

        # Convert to grayscale
        print("Original Image Mode:", image.mode)
        image = image.convert('L')
        image.save("grayscale_image_fixed.png")  # Save grayscale image for debugging

        # Log pixel values
        image_array = np.array(image)
        print("Grayscale pixel values (min, max):", image_array.min(), image_array.max())

        # Resize to 28x28
        image = image.resize((28, 28))
        image.save("resized_image_fixed.png")  # Save resized image

        # Convert to numpy array and normalize
        image_array = np.array(image).astype('float32') / 255.0
        print("Normalized pixel values (min, max):", image_array.min(), image_array.max())

        # Flatten for model input
        image_array = image_array.reshape(1, 28 * 28)

        # Predict using the model
        prediction = model.predict(image_array)
        print("Prediction probabilities:", prediction)
        predicted_digit = int(np.argmax(prediction))  # Convert to Python int
        
        print("predicted_digit", predicted_digit)

        return jsonify( predicted_digit)

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("FLASK_RUN_PORT", 8000))
    app.run(host='0.0.0.0', port=8000, debug=True)
