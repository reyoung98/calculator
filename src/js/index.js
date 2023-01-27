// defining all fields and buttons
const resultField = document.querySelector('.calc__result');
const inputField = document.querySelector('.calc__input');
const addBtn = document.querySelector('#btn-plus');
const minusBtn = document.querySelector('#btn-minus');
const multBtn = document.querySelector('#btn-mult');
const divBtn = document.querySelector('#btn-divide');
const clearBtn = document.querySelector('#btn-clear');
const equalBtn = document.querySelector('#btn-equals');
const calcBtns = document.querySelectorAll('.calc__btn')
const numBtn1 = document.querySelector('#num1');
const numBtn2 = document.querySelector('#num2');
const numBtn3 = document.querySelector('#num3');
const numBtn4 = document.querySelector('#num4');
const numBtn5 = document.querySelector('#num5');
const numBtn6 = document.querySelector('#num6');
const numBtn7 = document.querySelector('#num7');
const numBtn8 = document.querySelector('#num8');
const numBtn9 = document.querySelector('#num9');
const numBtn0 = document.querySelector('#num0');
const numBtnFloat = document.querySelector('#float');
const numBtns = document.querySelectorAll('.num-btn');

// global variables for future use
let operation; // add, subtract, divide, multiply
let currentNum = 0; // the user's current input
let total; // the running total of all operations
let numBtnClicked = false; // stores when a number button is clicked

// what happens when any number button is pressed
const inputNum = (num) => {
    if (currentNum !== 0) {
        resultField.innerHTML += num;
        currentNum = Number(resultField.innerHTML);
        console.log(currentNum);
    } else {
        resultField.innerHTML = num;
        currentNum = Number(resultField.innerHTML);
    }

    unFocus()  // important not just for styling but also calculations - if you switch from numpad to keyboard and press Enter, need to unfocus numBtn or else will get extra digit appended
}

// Defining operation functions - parameters come from button event listeners below
const operate = (operator, btnName) => {

    if (!operation) {       // no previous operation was done
        total = currentNum;
        currentNum = 0;
    } else if (operation && numBtnClicked) {  // for cases such as 4 + 5 + 7... the 'add' operator is already selected. First add 4 + 5, update total, then move on to add the 7.
        evaluate(operation);
        total = currentNum;
        currentNum = 0;
    }

    operation = `${operator}`;      // depending on which button we pressed, the name of that operation is stored (add, subtract...)
    numBtnClicked = false;

    unFocus() 
    btnName.classList.add('calc__btn-selected'); // add background to this operation
}

// Reset everything using the clear button
const clear = () => {
    resultField.innerHTML = 0;
    currentNum = 0;
    total = 0;
    operation = null;
    inputField.value = 0;
    unFocus()
    numBtnClicked = false;
}

// remove background and focus from selected operator
const unFocus = () => {
    for (let calcBtn of calcBtns) {
        calcBtn.classList.remove('calc__btn-selected');
        calcBtn.blur();
    }
}

// what happens when you click the = sign
const evaluate = () => {

    currentNum = Number(resultField.innerHTML);

    if (numBtnClicked) {

        switch (operation) {
            case "add":
                total += currentNum;
                break;
            case "subtract":
                total -= currentNum;
                break;
            case "multiply":
                total *= currentNum;
                break;
            case "divide":
                total /= currentNum;
                break;
            default:
                total = currentNum;
        }

        resultField.innerHTML = total;
        currentNum = total;
    }

    operation = null;
    numBtnClicked = false;
    unFocus();
}

// Button event listeners: calling the operate function with different arguments
addBtn.addEventListener('click', () => { operate("add", addBtn) });
minusBtn.addEventListener('click', () => { operate("subtract", minusBtn) });
multBtn.addEventListener('click', () => { operate("multiply", multBtn) });
divBtn.addEventListener('click', () => { operate("divide", divBtn) });
clearBtn.addEventListener('click', clear);

// Each number button calls the inputNum function with a number
numBtn1.addEventListener('click', () => { inputNum(1) });
numBtn2.addEventListener('click', () => { inputNum(2) });
numBtn3.addEventListener('click', () => { inputNum(3) });
numBtn4.addEventListener('click', () => { inputNum(4) });
numBtn5.addEventListener('click', () => { inputNum(5) });
numBtn6.addEventListener('click', () => { inputNum(6) });
numBtn7.addEventListener('click', () => { inputNum(7) });
numBtn8.addEventListener('click', () => { inputNum(8) });
numBtn9.addEventListener('click', () => { inputNum(9) });
numBtn0.addEventListener('click', () => { inputNum(0) });
numBtnFloat.addEventListener('click', () => { inputNum('.')});

for (let numBtn of numBtns) {
    numBtn.addEventListener('click', () => {
        console.log("num button clicked!!!")
        numBtnClicked = true;
        numBtn.blur();
    })
}

// pressing the equal button runs the evaluate function
equalBtn.addEventListener('click', evaluate)

/////////////////////////////////////////////////////////////////////////////////////

// Bonus - let's make it keyboard accessible!

// Add event listeners for pressing the number keys
const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

for (let num of nums) {
    document.addEventListener('keydown', (e) => {
        if (e.key == num) {
            inputNum(num);
        }
        numBtnClicked = true;
    })
}

document.addEventListener('keydown', (e) => {
    if (e.key == '.' || e.key == ',') {
        inputNum('.')
    }
    console.log(`operation: ${operation}`);
})

// Add event listeners for pressing the operator keys

document.addEventListener('keydown', (e) => {
    if (e.key == '+') {
        operate("add", addBtn);
    };
});

document.addEventListener('keydown', (e) => {
    if (e.key == '-') {
        operate("subtract", minusBtn);
    };
});

document.addEventListener('keydown', (e) => {
    if (e.key == '*') {
        operate("multiply", multBtn);
    };
});

document.addEventListener('keydown', (e) => {
    if (e.key == '/') {
        operate("divide", divBtn);
    };
});

// pressing enter button runs evaluate function
document.addEventListener('keydown', (e) => { 
    if (e.key == "Enter") {
        evaluate()
    }
});

// pressing backspace clears everything
document.addEventListener('keydown', (e) => {
    if (e.key === "Backspace") {
        clear()
    }
})

