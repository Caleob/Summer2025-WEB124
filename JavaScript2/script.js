/*
Written by Caleob King
Date:7/6/2025

Notable things learned in this project (js):
There were a LOT of new things I had to learn in the javascript to make this work.

I wanted to modify the drum kit file to use the webcam. I started with one of the other
projects in the tutorial but it got into the weeds with a server and I didn't feel like I
could make that work so I found (and gave credit to) an online source for using the webcam with js.

After the video stream was pasted to the canvas I found that it was just a 1d array with
red, green, blue, and alpha vlaues in a row so I was able to strip off the top of the screen
and look for changes in it fairly efficiently.

I think if I wanted to improve this I would try to 'debounce' the information so that only one
sound would play and it would be hard to trigger each sound so soon after the being played.

I also really liked how the original file used a compact loop to add all the event listeners.
This seems like a trick I want to learn for later use.

*/

// Video variables
const video = document.getElementById('webCamVideo');
const status = document.getElementById('status');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let previousFrameData = null; //Store previous frame data for comparison

// Not sure of all of this - SOURCE: https://www.youtube.com/watch?v=k4QebSqA8zU "How to Access the Webcam — Easy JavaScript Tutoria"
navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
    video.srcObject = stream
}).catch((error) => {
    console.error(error);
});

function processFrame() {
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the top 20 pixels of image data
    const imageData = ctx.getImageData(0, 0, canvas.width, 20);
    
    // Analyze the frame
    playSounds(analyzeFrame(imageData)); // Loops through movement detection and plays appropriate sounds

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Get all buttons
const soundButtons = document.querySelectorAll('.key');

// Add event listener to each sound button
soundButtons.forEach(button => {
    button.addEventListener('click', () => {
        const soundName = button.querySelector('.sound').textContent;
        const audio = document.querySelector(`audio[data-key="${soundName}"]`);
        audio.currentTime = 0; // Reset audio to start
        audio.play(); // Plays the sound from the audio element
    });
});

function analyzeFrame(imageData) {
    const threshold = 80000;
    const width = imageData.width;
    const data = imageData.data;
    let movementValues = [null, null, null, null, null];
    let movementDetected = [false,false,false,false,false];

    //REVIEW - If no previous frame, store current frame and return no movement
    if (!previousFrameData) {
        previousFrameData = data;
        return [0, 0, 0, 0, 0];
    }

    for (let y = 0; y < 20; y++) {
        for (let buttonRegion = 0; buttonRegion < 5; buttonRegion++) {
            const regionWidth = Math.floor(width / 5); //Calculate region width
            for (let x = buttonRegion * regionWidth; x < (buttonRegion + 1) * regionWidth; x++) {
                const index = (y * width + x) * 4;
                const r = data[index]; // Red
                const g = data[index + 1]; // Green
                const b = data[index + 2]; // Blue
                
                //Compare current RGB values to previous frame on all three colors
                const prevR = previousFrameData[index];
                const prevG = previousFrameData[index + 1];
                const prevB = previousFrameData[index + 2];
                
                //Calculate RGB difference and totals them up
                const rDiff = Math.abs(r - prevR);
                const gDiff = Math.abs(g - prevG);
                const bDiff = Math.abs(b - prevB);
                const totalDiff = rDiff + gDiff + bDiff;
                
                if (movementValues[buttonRegion] === null) {
                    movementValues[buttonRegion] = totalDiff;
                    movementDetected[buttonRegion] = false;
                } else {
                    movementValues[buttonRegion] += totalDiff;
                    movementDetected[buttonRegion] = (movementValues[buttonRegion] > threshold);
                }
            }
        }
    }

    //Store current frame as previous frame for next comparison
    previousFrameData = data;
    console.log(movementDetected);
    return movementDetected;
}

function playSounds(soundStates) {
    audioElements = [
        document.querySelector('audio[data-key="clap"]'),
        document.querySelector('audio[data-key="hihat"]'),
        document.querySelector('audio[data-key="kick"]'),
        document.querySelector('audio[data-key="snare"]'),
        document.querySelector('audio[data-key="tom"]')
    ];
    soundStates.forEach((state, index) => {
        if (state) {
            audioElements[index].currentTime = 0; // Reset audio to start
            audioElements[index].play();
        }
    });
}

setInterval(processFrame, 200);