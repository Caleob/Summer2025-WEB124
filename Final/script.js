/*
Written by Caleob King
Date:7/25/25
*/

// Get references to the input and button
const responseInput = document.getElementById('num');
const calculateButton = document.querySelector('button');
const columnElements = document.querySelectorAll('.column');

const initialColumnContent = {
    addition: "addition",
    subtraction: "subtraction",
    multiplication: "multiplication",
    division: "division"
};

function addAddition(numberValue) {
    
    for (let i = 1; i <= 10; i++) {
        const additionResult = (numberValue + i);
        columnElements[0].innerHTML += `<p>${numberValue}+${i} = ${additionResult}</p>`;
    }
}


function addSubtraction(numberValue) {
    
    let i = 1;
    while (i <= 10) {
        const subtractionResult = (numberValue - i);
        columnElements[1].innerHTML += `<p>${numberValue}-${i} = ${subtractionResult}</p>`;
        i++;
    }
}


function addMultiplication(numberValue) {
    
    let i = 1;
    do {
        const multiplicationResult = (numberValue * i);
        columnElements[2].innerHTML += `<p>${numberValue}x${i} = ${multiplicationResult}</p>`;
        i++;
    } while (i <= 10);
}


function addDivision(numberValue) {
    
    for (let i = 1; i <= 10; i += 1) {
        const divisionResult = (numberValue / i).toFixed(2); // Division by zero??
        columnElements[3].innerHTML += `<p>${numberValue}÷${i} = ${divisionResult}</p>`;
    }
}

calculateButton.addEventListener('click', () => {
    const inputValue = responseInput.value;

    // Reset the column headings
    columnElements.forEach(column => {
        column.innerHTML = initialColumnContent[column.id];
    });

    // Attempt to convert the input value to a number
    const numberValue = parseFloat(inputValue);

    // Check if the value is a valid number
    if (!isNaN(numberValue) && inputValue.trim() !== '') {
        addAddition(numberValue);
        addSubtraction(numberValue);
        addMultiplication(numberValue);
        addDivision(numberValue);
    } else {
        // Erase the input field
        console.log('Invalid input. Clearing the field.');
    }
    responseInput.value = ''; // Clear the input field
});

