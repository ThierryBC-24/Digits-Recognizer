window.addEventListener('load', () => {
    // Variables
    let painting = false;
    let paintingColor = '#3aafa9';
    const imgWidth = 28;
    const imgHeight = 28;
    const padding = 90;
    let lastDigitX = 0;
    const predictionThreshold = 0.5;

    // Objects
    const inputCanvas = document.querySelector("#inputSheet");
    const displayCanvas = document.querySelector("#displaySheet");
    const inputCTX = inputCanvas.getContext("2d");
    const displayCTX = displayCanvas.getContext("2d");
    const clearBtn = document.querySelector("#clear-btn");
    const result = document.querySelector("#result");
    const rect = inputCanvas.getBoundingClientRect();
    tf.loadLayersModel("../tfjs_model/model.json").then(function(model) {
        window.model = model;
    });
    // Hidden canvas for resizing
    const copyCanvas = document.createElement('canvas');
    const copyCTX = copyCanvas.getContext("2d");
    copyCanvas.style.display = 'none';
    copyCanvas.width = imgWidth;
    copyCanvas.height = imgHeight;
    document.body.appendChild(copyCanvas);

    inputCanvas.addEventListener('mousedown', () => { painting = true; });
    inputCanvas.addEventListener('mousemove', (e) => {
        if (!painting)
            return;
        inputCTX.lineWidth = 15;
        inputCTX.strokeStyle = paintingColor;
        inputCTX.lineCap = 'round';
        inputCTX.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        inputCTX.stroke();
        inputCTX.beginPath();
        inputCTX.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    inputCanvas.addEventListener('mouseup', () => {
        painting = false;
        inputCTX.beginPath();
        let img = new Image();

        img.onload = () => {
            box = getBoundingBox(img);
            let input = [];
            // Resize digits to 28 x 28
            copyCTX.drawImage(
                inputCanvas, 
                box.x - padding,
                box.y - padding,
                box.width + 2 * padding,
                box.height + 2 * padding,
                0,
                0,
                imgWidth,
                imgHeight
            );
            data = copyCTX.getImageData(0, 0, imgWidth, imgHeight).data;
            
            // Convert rgb from data to inverse black and white
            for (let i = 0; i < data.length; i += 4) {
                let rgbValue = data[i] + data[i + 1] + data[i + 2];
                let color = 0;
                if (rgbValue > 510) 
                    color = 255;
                else if (rgbValue >= 255)
                    color = 255;
                input.push(parseFloat(color) / 255);
            }

            // Update predictions
            window.model.predict([tf.tensor(input).reshape([1, 28, 28, 1])]).array().then(function(scores) {
                scores = scores[0];
                let maxScore = Math.max(...scores);
                if (maxScore > predictionThreshold) {
                    if (box.x > lastDigitX) {
                        result.innerHTML += scores.indexOf(maxScore);
                        lastDigitX = box.x;
                    }
                    else
                        result.innerHTML = scores.indexOf(maxScore) + result.innerHTML;
                        
                    displayCTX.drawImage(img, 0, 0);
                    inputCTX.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
                    copyCTX.clearRect(0, 0, copyCanvas.width, copyCanvas.height);
                }
                else {
                    inputCTX.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
                    copyCTX.clearRect(0, 0, copyCanvas.width, copyCanvas.height);
                } 
            });
        }
        img.src = inputCanvas.toDataURL();
    });

    clearBtn.onclick = () => {
        displayCTX.clearRect(0, 0, inputCanvas.width, inputCanvas.height);
        result.innerHTML = "";
        lastDigitX = 0;
    };
});

function getBoundingBox(img) {
    let src = cv.imread(img);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 0, 255, cv.THRESH_BINARY);
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    return cv.boundingRect(contours.get(0));
}