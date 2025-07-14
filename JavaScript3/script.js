/*
Written by Caleob King
Date:7/13/2025

Notable things learned in this project (js):
I got more experience with canvas elements, I think I understand more about getting the 2d context and how
that differs from the element itself.

I applied the mouse down and mouse up events to do do different things when the system was in different modes

I still find arrow functions confusing to write but they are at least coming easier to me at this point.

For some reason the image (backgrounds) I used keep getting horribly pixilated.
I'm not sure what I am doing there but that is one thing I wouold try to improve.

Also, I think most progrsams store the draw paths in an array of values so that they can be redrwan if the
canvas size changes. That would be the next feature I tried to implement if I was trying to make this more useful.

*/

const canvasBackground = document.querySelector('#backgroundCanvas');
const ctxBackground = canvasBackground.getContext('2d');

const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth - 220; // controls: 200px + 20px margin
    canvas.height = window.innerHeight * 0.95;
}

function drawBackground(backgroundIndex) {
const backgroundImage = new Image();
backgroundImage.src = `images/image_${backgroundIndex}.png`;
backgroundImage.onload = () => {
    const scaleFactor = Math.min(.5*canvasBackground.width / backgroundImage.width, .5*canvasBackground.height / backgroundImage.height);
    const scaledWidth = backgroundImage.width * scaleFactor;
    const scaledHeight = backgroundImage.height * scaleFactor;
    const x = (canvasBackground.width - scaledWidth) / 2;
    const y = (canvasBackground.height - scaledHeight) / 2;
    ctxBackground.drawImage(backgroundImage, x, y, scaledWidth, scaledHeight);
};
}

resizeCanvas();
drawBackground(1);

window.addEventListener('resize', resizeCanvas);

let brushSize = 10;
let textSize = 14;
let mode = 'paint';
let backgroundIndex = 0;

function logState() {
    console.log(`Background: ${backgroundIndex}, Brush: ${brushSize}, Text: ${textSize}, Mode: ${mode}`);
    // used to keep track of anything that changes
}

const buttons = document.querySelectorAll('.controlButton');

// Image up
buttons[0].addEventListener('click', () => {
backgroundIndex = (backgroundIndex + 1) % 4;
drawBackground(backgroundIndex);
logState();
});

// Image down
buttons[1].addEventListener('click', () => {
backgroundIndex = Math.max(0, backgroundIndex - 1);
drawBackground(backgroundIndex);
logState();
});

// Brush up
buttons[2].addEventListener('click', () => {
brushSize++;
logState();
});

// Brush down
buttons[3].addEventListener('click', () => {
brushSize = Math.max(1, brushSize - 1); // Limit to 1 pixel width or more
logState();
});

// Text size up
buttons[4].addEventListener('click', () => {
textSize++;
logState();
});

// Text size down
buttons[5].addEventListener('click', () => {
textSize = Math.max(4, textSize - 1); // Limit to 4pt or more
logState();
});

// Paint Brush
buttons[6].addEventListener('click', () => {
mode = 'paint';
logState();
});

// Arrow
buttons[7].addEventListener('click', () => {
mode = 'arrow';
logState();
});

// Text
buttons[8].addEventListener('click', () => {
mode = 'text';
logState();
});



let drawing = false;
let arrowStart = null;

function drawArrow(x1, y1, x2, y2) {
    const headLength = 4*brushSize; // length of head in pixels
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    // calculate the arrow points
    const angle1 = angle + Math.PI / 6;
    const angle2 = angle - Math.PI / 6;
    const x3 = x2 - headLength * Math.cos(angle1);
    const y3 = y2 - headLength * Math.sin(angle1);
    const x4 = x2 - headLength * Math.cos(angle2);
    const y4 = y2 - headLength * Math.sin(angle2);

    // line
    ctx.strokeStyle = 'black';
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // draw the head
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x4, y4);
    ctx.stroke();

    console.log(`Drawing line from (${x1}, ${y1}) to (${x2}, ${y2}) with dx: ${dx}, dy: ${dy}, angle: ${angle * 180 / Math.PI} degrees`);
}

canvas.addEventListener('mousedown', e => {
const x = e.offsetX;
const y = e.offsetY;

if (mode === 'paint') {
    drawing = true;
} else if (mode === 'arrow') {
    arrowStart = { x, y };
} else if (mode === 'text') {
    const userText = window.prompt('Enter text:');
    if (userText) {
    ctx.fillStyle = 'black';
    ctx.font = `${textSize}px sans-serif`;
    ctx.fillText(userText, x, y);
    }
}
});

canvas.addEventListener('mouseup', e => {
if (mode === 'paint') {
    drawing = false;
} else if (mode === 'arrow' && arrowStart) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;
    drawArrow(arrowStart.x, arrowStart.y, x2, y2);
    arrowStart = null;
}
});

canvas.addEventListener('mousemove', e => {
if (drawing && mode === 'paint') {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(e.offsetX, e.offsetY, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
}
});