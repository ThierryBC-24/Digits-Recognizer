window.addEventListener('load', () => {
    const canvas = document.querySelector("#sheet");
    const context = canvas.getContext("2d");
    let painting = false;
    const rect = canvas.getBoundingClientRect();

    canvas.addEventListener('mousedown', () => { painting = true; });
    canvas.addEventListener('mouseup', () => { 
        painting = false; 
        context.beginPath();
    });
    canvas.addEventListener('mousemove', (e) => {
        if (!painting)
            return;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
});