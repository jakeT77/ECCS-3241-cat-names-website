# /app.py

from flask import Flask, render_template, request, jsonify
from datetime import datetime
import tensorflow as tf                      # pip install tensorflow-cpu
from PIL import Image
import numpy as np
import base64
import io

# ====================== #
# Global Declarations    #
# ====================== #

app = Flask( __name__ )

model = tf.keras.models.load_model('./static/model/car_classifier.keras')
class_names = ['Abyssinian', 'American Bobtail', 'American Curl', 'American Shorthair', 'Bengal', 'Birman', 'Bombay', 'British Shorthair', 'Egyptian Mau', 'Exotic Shorthair', 'Maine Coon', 'Manx', 'Norwegian Forest', 'Persian', 'Ragdoll', 'Russian Blue', 'Scottish Fold', 'Siamese', 'Sphynx', 'Turkish Angora']

image_path = './static/testing/upload.jpeg'

# ====================== #
# Website Routes         #
# ====================== #

# home page
@app.route( '/' )
def index():
    server_log( 'index', 'Rendering Main index.html' )
    return render_template( 'index.html' )

@app.route('/generate')
def generate():

    img = tf.keras.utils.load_img(image_path, target_size=(180, 180))
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    
    server_log( 'upload', f"{class_names[np.argmax(score)]}: {100 * np.max(score):.2f}%" )
    
    return f"{class_names[np.argmax(score)]}: {100 * np.max(score):.2f}%"

@app.route('/upload', methods=['POST'])
def upload():
    server_log( 'upload', 'Attempting to save uploaded image' )
    try:
        # Get the base64 image data from the request
        data = request.get_json()
        image_data = data['image_data']

        # Decode the base64 image data
        img_data = base64.b64decode(image_data)

        # Save the image as a JPEG file
        with open(image_path, 'wb') as f:
            f.write(img_data)

        server_log( 'upload', 'Image successfully saved as JPEG' )
        return jsonify({"message": "Image successfully saved as JPEG!"}), 200
    except Exception as e:
        server_log( 'upload', f'error: {str(e)}' )
        return jsonify({"error": str(e)}), 400


# ====================== #
# Helper Functions       #
# ====================== #

def server_log( source, message ):
    timestamp = datetime.now().strftime( '%d/%b/%Y %H:%M:%S' )
    print( f'\033[31mPY-SERVER - - [{timestamp}][{source.upper()}]: {message}\033[0m' )

# ====================== #
# Driver Code            #
# ====================== #

if __name__ == '__main__':
    
    app.run( debug=True )
