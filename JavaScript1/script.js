/*
Written by Caleob King
Date:6/22/2025

Notable things learned in this project (js):
There were a LOT of new things I had to learn in the javascript to make this work.

I had to look up and use the split command to turn dates and times into separate numbers
I had to learn about the unix time and how that worked to use the Date() type and learn methods for it

I hadn't used the modulo operator much but it came in really useful here to manage rotation and angles.

I found managing the interval events challenging. It too  bit to realize
the intervals returned a unique identifier and then use that to clear when the clock type switches
*/



const dateElement = document.querySelector('.date');
const secondHandElement = document.querySelector('.second-hand');
const minuteHandElement = document.querySelector('.min-hand');
const hourHandElement = document.querySelector('.hour-hand');
const sunRiseImgElement = document.querySelector('#rise');
const sunSetImgElement = document.querySelector('#set');
let simulationStartTime = new Date(); //Used to speed run through the year quickly - reset when fast clock is started
const button1 = document.getElementById('button-1');
const button2 = document.getElementById('button-2');
let clockInterval = null; //this is the interval I plan to use to switch clock speeds

function timeToSecond(timeString) {
    const parts = timeString.split(':'); 
    const hrs = parseInt(parts[0], 10); 
    const min = parseInt(parts[1], 10);
    const sec = parseInt(parts[2], 10);

    return hrs*3600+min*60+sec;
}

function secondToAngle(second) {
    return (360*(second)) /(24*3600);
}

function sunPositions(currenDateNum) {
    const riseTimeStr = data[currenDateNum].Sunrise;
    const setTimeStr = data[currenDateNum].Sunset;
    const riseAngle = secondToAngle(timeToSecond(riseTimeStr));
    const setAngle = secondToAngle(timeToSecond(setTimeStr));
    //const riseAngle = 90;
    //const setAngle = 270;

    sunRiseImgElement.style.transform = 'translate(140px, -90%) rotate(' + (riseAngle-90)%360 + 'deg)';
    sunSetImgElement.style.transform = 'translate(-200px, -90%) rotate(' + (setAngle-270)%360 + 'deg)';
}

function moonPhasePicture(currentDateNum) {
    const moonImageElement = document.querySelector('.moon-container img');
    moonImageElement.src = data[currentDateNum].MoonPhase;
}

function placeClockHands(currentTime) {
    const totalSeconds = timeToSecond(currentTime);
    const seconds = totalSeconds % 60;
    const minutes = (totalSeconds / 60) % 60;
    const hours = (totalSeconds / 3600) % 24;

    const hourAngle = (hours / 24) * 360;
    const minuteAngle = (minutes / 60) * 360;
    const secondAngle = (seconds / 60) * 360;

    hourHandElement.style.transform = 'rotate(' + (hourAngle-270)%360 + 'deg)';
    minuteHandElement.style.transform = 'rotate(' + (minuteAngle-270)%360 + 'deg)';
    secondHandElement.style.transform = 'rotate(' + (secondAngle-270)%360 + 'deg)';
}

function setDate(inputDate) {
    const startOfYear = new Date(2025, 0, 1);
    const timeDifferenceMs = inputDate.getTime() - startOfYear.getTime();
    const dayDifference = timeDifferenceMs / (1000 * 3600 * 24);
    return Math.floor(dayDifference);
}

function setTime(inputDate) {
    return inputDate.getHours()+':'+inputDate.getMinutes()+':'+inputDate.getSeconds();
}

function displayDate(currentDate) {
    dateElement.textContent = data[currentDate].Date
}

function realTimeClock() {
    const now = new Date();
    const dateNum = setDate(now);
    const time = setTime(now);

    sunPositions(dateNum);
    moonPhasePicture(dateNum);
    placeClockHands(time);
    displayDate(dateNum);
}

function fastClock() {
    const simulationRunTime = 600000
    const startOfYear = new Date(2025, 0, 1);
    const now=new Date();
    const timeDifferenceMs = now.getTime() - simulationStartTime.getTime();
    const msInYear = 365*24*3600*1000;
    const simulationFraction = (timeDifferenceMs%simulationRunTime)/simulationRunTime;

    const simulationDate = new Date(startOfYear.getTime() + msInYear*simulationFraction);
    
    const dateNum = setDate(simulationDate);
    const time = setTime(simulationDate);

    sunPositions(dateNum);
    moonPhasePicture(dateNum);
    placeClockHands(time);
    displayDate(dateNum);
}

button1.addEventListener('click', () => {
    clearInterval(clockInterval);
    secondHandElement.style.visibility = 'visible';
    minuteHandElement.style.visibility = 'visible';
    clockInterval = setInterval(realTimeClock, 1000);
});
button2.addEventListener('click', () => {
    clearInterval(clockInterval);
    simulationStartTime = new Date();
    secondHandElement.style.visibility = 'hidden';
    minuteHandElement.style.visibility = 'hidden';
    clockInterval = setInterval(fastClock,50)
});