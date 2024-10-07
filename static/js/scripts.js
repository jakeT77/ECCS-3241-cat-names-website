// /static/scripts.js

// on start
document.addEventListener('DOMContentLoaded', function () {



    // cat gender selector
    const initialSelection = document.querySelector('[name="radio"]:checked');

    if (initialSelection) {
        const selectedValue = initialSelection.id.split('-')[1];
        selector(selectedValue);
    } else {
        console.log('No radio button is initially selected.');
    }

    const radios = document.querySelectorAll('[name="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedValue = radio.id.split('-')[1];
            selector(selectedValue);
        });
    });

    function selector(x) {
        const out = document.getElementById('selection')
        if (x == 'm') {
            out.innerText = 'Mr. Kitty'
            out.classList = ['m']
        }
        else if (x == 'f') {
            out.innerHTML = 'Ms. Kitty'
            out.classList = ['f']
        }
        else {
            console.log('incorrect selector: ', x)
        }
    }


    // image drop and load
    const input = document.getElementById('imageInput');
    const previewContainer = document.getElementById('preview');

    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = file.name;
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
    });

    const dropArea = document.querySelector('.drop-area');
    ['dragenter', 'dragover'].forEach(function (event) {
        dropArea.addEventListener(event, function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('active');
        });
    });

    ['dragleave', 'drop'].forEach(function (event) {
        dropArea.addEventListener(event, function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('active');
        });
    });

    dropArea.addEventListener('drop', function (e) {
        const files = e.target.files || e.dataTransfer.files;
        handleFiles(files);
    });

    input.addEventListener('change', function (e) {
        const files = e.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (!files.length) return;

        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = file.name;
            img.id = 'img'
            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);

            upload(img);
        };

        reader.readAsDataURL(file);
    }
});


// generator code: 
function generate() {

    fetch('/generate')

    // document.getElementById('overlay').style.fontSize = '150px'
    // document.getElementById('overlay').style.height = '100%'
}

// image upload helper
function upload() {
    const imgElement = document.getElementById('img');
    const imgSrc = imgElement.src;

    // Check if the src is in base64 format
    if (imgSrc.startsWith('data:image/jpeg;base64,')) {
        // Remove the prefix so you only send the base64 string
        const base64Data = imgSrc.replace('data:image/jpeg;base64,', '');

        // Send the base64 data to the Flask server
        fetch('/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image_data: base64Data })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    } else {
        console.error('The image source is not in Base64 format.');
    }
}

