window.addEventListener('load', () => {
    // Objects
    const canvas = document.querySelector("#sheet");
    const clearBtn = document.querySelector("#clear-btn");
    const result = document.querySelector("#result");
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const model = tf.loadLayersModel("../tfjs_model/model.json").then(function(model) {
        window.model = model;
    });

    // Variables
    let painting = false;
    const imgWidth = 28;
    const imgHeight = 28;
    const predictionThreshold = 0.7;

    canvas.addEventListener('mousedown', () => { painting = true; });
    canvas.addEventListener('mousemove', (e) => {
        if (!painting)
            return;
        context.lineWidth = 30;
        context.strokeStyle = 'blue';
        context.lineCap = 'round';
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    canvas.addEventListener('mouseup', () => {
        painting = false;
        context.beginPath();
        let img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0, imgWidth, imgHeight);
            data = context.getImageData(0, 0, imgWidth, imgHeight).data;
            let input = [];

            getBoundingBoxes(img, canvas);

            for (let i = 0; i < data.length; i += 4)
                input.push(data[i + 2] / 255);

            window.model.predict([tf.tensor(input).reshape([1, 28, 28, 1])]).array().then(function(scores) {
                scores = scores[0];
                console.log("scores: " + scores);
                let maxScore = Math.max(...scores);
                if (maxScore > predictionThreshold)
                    predicted = scores.indexOf(maxScore);
                else
                    predicted = "";
                result.innerHTML += predicted;
            });
        }
        img.src = canvas.toDataURL();
    });

    clearBtn.onclick = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        result.innerHTML = "";
    };
});

function getBoundingBoxes(img, canvas) {
    let src = cv.imread(img);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 0, 255, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let boundingBoxes = [];
    console.log(contours.size());
    for (let i = 0; i < contours.size(); i++) {
        boundingBoxes.push(cv.boundingRect(contours.get(i)));
    }
    for (const box of boundingBoxes) {
        console.log(' width:' + box.width + ' height:' + box.height);
        let rectangleColor = new cv.Scalar(255, 0, 0);
        let contoursColor = new cv.Scalar(255, 255, 255);
        let point1 = new cv.Point(box.x, box.y);
        let point2 = new cv.Point(box.x + box.width, box.y + box.height);
        cv.drawContours(src, contours, 0, contoursColor, 1, 8, hierarchy, 100);
        cv.rectangle(src, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
        cv.imshow(canvas, src);
    }
}