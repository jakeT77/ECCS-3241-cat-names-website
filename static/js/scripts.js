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
        };

        reader.readAsDataURL(file);
    }
});


// generator code: 
function generate() {
    const img = document.getElementById('img')

    sendImageDataToServer(img);

    // document.getElementById('overlay').style.fontSize = '150px'
    // document.getElementById('overlay').style.height = '100%'
}

// image upload helper
function sendImageDataToServer(imgElement) {
    const blob = getImageData(imgElement);

    fetch('/process-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: blob,
    })
        .then(response => response.text())
        .then(data => {
            console.log('Response received:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getImageData(imgElement) {
    const base64String = imgElement.getAttribute('src');

    // Create a new Blob object from the base64 string
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    return blob;
}