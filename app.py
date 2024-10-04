# /app.py

from flask import Flask, render_template, request
from datetime import datetime
import tensorflow as tf                      # pip install tensorflow-cpu
from PIL import Image
import numpy as np
import io

# ====================== #
# Global Declarations    #
# ====================== #

app = Flask( __name__ )

model = tf.keras.models.load_model('./static/model/car_classifier.keras')
class_names = ['Abyssinian', 'American Bobtail', 'American Curl', 'American Shorthair', 'Bengal', 'Birman', 'Bombay', 'British Shorthair', 'Egyptian Mau', 'Exotic Shorthair', 'Maine Coon', 'Manx', 'Norwegian Forest', 'Persian', 'Ragdoll', 'Russian Blue', 'Scottish Fold', 'Siamese', 'Sphynx', 'Turkish Angora']

# ====================== #
# Website Routes         #
# ====================== #

# home page
@app.route( '/' )
def index():
    server_log( 'index', 'Rendering Main index.html' )
    return render_template( 'index.html' )

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        server_log( 'upload', 'no image :(' )
        return 'No image part', 400
    
    image = request.files['image'].read()
    image = preprocess_image(image)
    
    # Make prediction
    predictions = model.predict(image)
    probabilities = np.max(predictions, axis=1)[0]
    predicted_class = np.argmax(predictions, axis=1)[0]
    
    predicted_class_name = class_names[predicted_class]
    
    server_log( 'upload', f"{predicted_class_name}: {probabilities:.2f}%" )
    
    return f"{predicted_class_name}: {probabilities:.2f}%"

@app.route('/process-image', methods=['POST'])
def process_image():
    # Get the binary data from the request
    image_data = request.data
    
    # Create a BytesIO object from the binary data
    image_file = io.BytesIO(image_data)
    
    # Process the image here (e.g., save it, resize it, etc.)
    # For example, saving the image:
    with open('saved_image.jpg', 'wb') as f:
        f.write(image_data)
    
    return "Image processed successfully"

# ====================== #
# Helper Functions       #
# ====================== #

def server_log( source, message ):
    timestamp = datetime.now().strftime( '%d/%b/%Y %H:%M:%S' )
    print( f'\033[31mPY-SERVER - - [{timestamp}][{source.upper()}]: {message}\033[0m' )
    
def preprocess_image(image):
    img = Image.open(io.BytesIO(image)).convert('RGB')
    img = img.resize((180, 180)) 
    img = np.array(img) / 255.0
    return img.reshape((1,) + img.shape)

# ====================== #
# Driver Code            #
# ====================== #

if __name__ == '__main__':
    
    app.run( debug=True )
