//general variables
const myName = "Caleob King";
const n1 = 3.14159;
const n2 = 2.718;

// HTML elements
const para1 = document.getElementById("p1");

// Change text content in paragraph 1
para1.textContent = myName;

// Change text content in paragraph 2
const numberSum = n1 + n2;
document.getElementById("p2").textContent = numberSum;

// Change text content in paragraph 3
const numberMult = n1*n2;
document.getElementById("p3").textContent = numberMult;

// Change text content in paragraph 4
const myNameAddNum = myName + n1;
document.getElementById("p4").textContent = myNameAddNum;

// Change text content in paragraph 5
const myNameMultNum = myName * n2;
document.getElementById("p5").textContent = myNameMultNum;

// Change text content in paragraph 6
const ageCompare = 47 >= numberMult;
document.getElementById("p6").textContent = ageCompare;