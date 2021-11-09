window.addEventListener('load', () => {
    const canvas = document.querySelector("#sheet");
    const clearBtn = document.querySelector("#clear-btn");
    const result = document.querySelector("#result");
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const model = tf.loadLayersModel("../tfjs_model/model.json").then(function(model) {
        window.model = model;
    });

    let painting = false;
    const imgWidth = 28;
    const imgHeight = 28;
    const predictionThreshold = 0.9;

    canvas.addEventListener('mousedown', () => { painting = true; });
    canvas.addEventListener('mouseup', () => {
        painting = false;
        context.beginPath();
        let img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0, imgWidth, imgHeight);
            data = context.getImageData(0, 0, imgWidth, imgHeight).data;
            let input = [];

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
                result.innerHTML = predicted;
            });
        }
        img.src = canvas.toDataURL();
    });

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

    clearBtn.onclick = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        result.innerHTML = "";
    };
});