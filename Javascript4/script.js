/*
Written by Caleob King
Date:7/20/2025

*** I wanted to test myself to build something that might be useful in my math class this year
*** I built this program to test if someone can identify the type of graph transformation

Notable things learned in this project (js):

For some reason I don't think of making an ARRAY of DOM elements. But I see from this example
that this is an incredibly versatile techinique in javascript

I've seen it before but I was reminded of the utility of using js to update a class (like 'up')
and then letting the CSS handle the movmeents and animation.
It's an interesting and non-intuitive way to create animation

I also used the ability to add some data to each element and then use that data to test a win condition.
*/


const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const transformations = document.querySelectorAll('.transform');
const communicationElement = document.querySelector('h2');
let transformSelected = null;

let lastHole = 0;
let timeUp = false;
let score = 0;

//this is a list of possible equations and values
const shiftPossibilities = [
{ equation: 'images/equation_0.png', transformation: 'images/horizontal_stretch.png' },
{ equation: 'images/equation_1.png', transformation: 'images/horizontal_compression.png' },
{ equation: 'images/equation_2.png', transformation: 'images/vertical_shift_up.png' },
{ equation: 'images/equation_3.png', transformation: 'images/vertical_shift_down.png' },
{ equation: 'images/equation_4.png', transformation: 'images/horizontal_shift_left.png' },
{ equation: 'images/equation_5.png', transformation: 'images/horizontal_shift_right.png' },
{ equation: 'images/equation_6.png', transformation: 'images/vertical_stretch.png' },
{ equation: 'images/equation_7.png', transformation: 'images/vertical_compression.png' }
];

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// A more efficient method -  it cycles trhough the list using moduluo %
// but never lands on the same hole twice.
function randomHole(holes) {
    const offset = Math.floor(Math.random() * (holes.length - 1)) + 1;
    lastHole = (lastHole + offset) % holes.length;
    return holes[lastHole];
}

function peep() {
    const time = randomTime(1200, 4000);
    const hole = randomHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    peep();
    setTimeout(() => timeUp = true, 45000)
}

function bonk(e) {
    console.log(this.dataset.shift,transformSelected);
    if(!e.isTrusted) return; // cheater!
    const shiftValue = this.dataset.shift;
    if (transformSelected == shiftValue) {
        score++;
        this.parentNode.classList.remove('up');
        scoreBoard.textContent = score;
        assignRandomEquationAndTransformation(this); //reset the equation for this mole
    }
    else {
        transformSelected = null;
        communicationElement.textContent = '--SELECT THE TRANSFORMATION--'
    }
}

// Function to assign a random equation and its corresponding transformation to a mole
function assignRandomEquationAndTransformation(moleElement) {
    const randomIndex = Math.floor(Math.random() * shiftPossibilities.length);
    const selectedShift = shiftPossibilities[randomIndex];

    // Set the data-shift attribute (the correct transformation for this mole)
    moleElement.dataset.shift = selectedShift.transformation;

    // Find or create the equation image element
    let equationImg = moleElement.querySelector('.equation');
    if (!equationImg) {
        equationImg = document.createElement('img');
        equationImg.classList.add('equation');
        moleElement.appendChild(equationImg);
    }
    // Set the equation image source
    equationImg.src = selectedShift.equation;
}

// Initialize moles with random equations and transformations
moles.forEach(mole => {
mole.addEventListener('click', bonk);
assignRandomEquationAndTransformation(mole); // Assign initial random values
});

//this goes through all the transformations and sets up
// the transform selected (for checking and also for cursor transformation)

for (let i = 0; i < transformations.length; i++) {
    transformations[i].addEventListener('click', function() {
    const fullPathTransformSelected = this.childNodes[1].src;
    //I'm no good with regex expressions and honestly I don't plan to get good at this skill
    //I got some AI help to change the file name into a nice format for display
    //I do think I understand the methods at work here split,splice, join, replace, and toUpperCase
    transformSelected = fullPathTransformSelected.split('/').slice(-2).join('/')
    communicationElement.textContent = transformSelected.slice(7).replace(/\.[^.]+$/, '').replace(/_/g, ' ').toUpperCase();
    });
}

document.addEventListener('mousemove', function(e) {
//console.log(transformSelected);
if (transformSelected !== null) {
    document.body.style.cursor = 'crosshair';
} else {
    document.body.style.cursor = 'default';
}
});