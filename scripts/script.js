p1 = document.getElementById("p01");
p2 = document.getElementById("p02");

rollStart = document.getElementById("roll");
resetButton = document.getElementById("reset");
winnerHeading = document.getElementById("winner-display");
roundDisplay = document.getElementById("current-round");
popup = document.getElementById("popup");

let currentRound = 1;
let gameActive = false;
let gameWinner = "";

let p1Total = 0;
let p2Total = 0;

class Player {
    constructor(score = 0, totalScore = 0) {
        this.score = score;
        this.totalScore = totalScore;
    }

    setScore(newScore) {
        this.score = newScore;
    }

    setTotalScore(newTotalScore) {
        this.totalScore = newTotalScore;
    }

    getScore() {
        return this.score
    }

    getTotalScore() {
        return this.totalScore;
    }
}

class Dice {
    constructor(value = 1) {
        this.value = value;
    }

    randomizeDice() {
        let newValue = 0;
        newValue = Math.floor(Math.random() * 6) + 1;
        
        this.value = newValue;
    }

    generateDefault() {
        let returnString = null;
        let imagePath = null;

        imagePath = `images/dice_1.png`
        returnString = `<img src=${imagePath}></img>`

        return returnString;
    }

    generateDice() {
        this.randomizeDice();
        let returnString = null;
        let imagePath = null;
        let diceImg = this.value;

        imagePath = `images/dice_${diceImg}.png`
        returnString = `<img src=${imagePath}></img>`

        return returnString;
    }

    getValue() {
        return this.value;
    }
}

function createDiceField() {
    p01.innerHTML += `<div id= "p01-dice-field"></div>`;
    p02.innerHTML += `<div id= "p02-dice-field"></div>`; 
}

function clearDiceField() {
    document.getElementById("p01-dice-field").innerHTML = "";
    document.getElementById("p02-dice-field").innerHTML = ""; 
}

function setupDefaultDice() {
    d1 = new Dice();

    let p01Dices = null;
    let p02Dices = null;

    p01Dices = d1.generateDefault();
    p01Dices += d1.generateDefault();
    p02Dices = d1.generateDefault();
    p02Dices += d1.generateDefault();

    p1DiceField = document.getElementById("p01-dice-field");
    p2DiceField = document.getElementById("p02-dice-field");

    p1DiceField.innerHTML += `${p01Dices}`;
    p2DiceField.innerHTML += `${p02Dices}`;
}

function playRound(){
    clearDiceField();
    gameActive = true;

    d1 = new Dice();
    d2 = new Dice();

    let p01Dices = null;
    let p02Dices = null;
    let p1RoundScore = 0;
    let p2RoundScore = 0;

    p01Dices = d1.generateDice();
    let d1Value1 = d1.getValue();
    p01Dices += d1.generateDice();
    let d1Value2 = d1.getValue();

    p02Dices = d2.generateDice();
    let d2Value1 = d2.getValue();
    p02Dices += d2.generateDice();
    let d2Value2 = d2.getValue();

    if (gameActive == true && currentRound <= 3) {
        roundDisplay.innerHTML = `Round ${currentRound}`;
        p1RoundScore = calculateScores(d1Value1, d1Value2);
        playerOne.setScore(p1RoundScore);

        p1Total += p1RoundScore;
        playerOne.setTotalScore(p1Total);
        document.getElementById("p01-round-score").innerHTML = `Round Score: ${playerOne.getScore()}`;
        document.getElementById("p01-total-score").innerHTML = `Total Score: ${playerOne.getTotalScore()}`;

        p2RoundScore = calculateScores(d2Value1, d2Value2);
        playerTwo.setScore(p2RoundScore);

        p2Total += p2RoundScore;
        playerTwo.setTotalScore(p2Total);
        document.getElementById("p02-round-score").innerHTML = `Round Score: ${playerTwo.getScore()}`;
        document.getElementById("p02-total-score").innerHTML = `Total Score: ${playerTwo.getTotalScore()}`;

        p1DiceField = document.getElementById("p01-dice-field");
        p2DiceField = document.getElementById("p02-dice-field");

        p1DiceField.innerHTML += `${p01Dices}`;
        p2DiceField.innerHTML += `${p02Dices}`;
        currentRound++;    
    }
    else {
        calculateWinCondition();
        if (gameWinner == "p1") {
            $("#popup").fadeIn(300);
            winnerHeading.innerHTML = "You Win!"
        }
        else if (gameWinner == "p2") {
            $("#popup").fadeIn(300);
            winnerHeading.innerHTML = "You Lose!"
        }
        else if (gameWinner == "draw") {
            $("#popup").fadeIn(300);
            winnerHeading.innerHTML = "Draw!"            
        }
    }
    
}

function calculateScores(valueOne, valueTwo) {
    let returnValue = 0;
    
    if (valueOne == 1 || valueTwo == 1) {
        returnValue = 0;
    }
    else if (valueOne == valueTwo) {
        returnValue = (valueOne+valueTwo)*2;
    }
    else {
        returnValue = valueOne + valueTwo;
    }

    return returnValue;
}

function calculateWinCondition() {
    if (playerOne.getTotalScore() > playerTwo.getTotalScore()) {
        gameWinner = "p1";
    }
    else if (playerTwo.getTotalScore() > playerOne.getTotalScore()) {
        gameWinner = "p2";
    }
    else {
        gameWinner = "draw"
    }
}

function gameWipe() {
    p1Total = 0;
    p2Total = 0;
    playerOne.setScore(0);
    playerOne.setTotalScore(0);
    playerTwo.setScore(0);
    playerTwo.setTotalScore(0);
    document.getElementById("p01-round-score").innerHTML = `Round Score: ${playerOne.getScore()}`;
    document.getElementById("p01-total-score").innerHTML = `Total Score: ${playerOne.getTotalScore()}`;
    document.getElementById("p02-round-score").innerHTML = `Round Score: ${playerTwo.getScore()}`;
    document.getElementById("p02-total-score").innerHTML = `Total Score: ${playerTwo.getTotalScore()}`;

    currentRound = 1;
    roundDisplay.innerHTML = `Game has not yet begun`;

    gameActive = false;
    setupDefaultDice();
    popup.style.display = "none";
}

rollStart.addEventListener("click", playRound);
resetButton.addEventListener("click", gameWipe);


playerOne = new Player();
playerTwo = new Player();

createDiceField();
setupDefaultDice();
