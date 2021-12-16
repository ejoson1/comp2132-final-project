// Grab page elements
p1 = document.getElementById("p01");
p2 = document.getElementById("p02");

rollStart = document.getElementById("roll");
resetButton = document.getElementById("reset");
winnerHeading = document.getElementById("winner-display");
roundDisplay = document.getElementById("current-round");
popup = document.getElementById("popup");

// Constants
const DEFAULT_SCORE = 0;
const DICE_DEFAULT = 1;
const MAX_DICE_VALUE = 6;
const MAX_GAME_ROUNDS = 3;
const ROUND_OVER = 4;
const FADE_OFFSET = 500;
const STARTING_ROUND = 1;

// Game Variables
let currentRound = STARTING_ROUND;
let gameActive = false;
let p1Total = 0;
let p2Total = 0;

// Player class
class Player {
    // score is a default value of 0
    // totalScore is a default value of 1
    constructor(score = DEFAULT_SCORE, totalScore = DEFAULT_SCORE) {
        this.score = score;
        this.totalScore = totalScore;
    }

    // Set a new score
    setScore(newScore) {
        this.score = newScore;
    }

    // Set a new total score
    setTotalScore(newTotalScore) {
        this.totalScore = newTotalScore;
    }

    // Return the score
    getScore() {
        return this.score
    }

    // Return the total score
    getTotalScore() {
        return this.totalScore;
    }
}

// Dice class
class Dice {
    // value is defaulted at 1
    constructor(value = DICE_DEFAULT) {
        this.value = value;
    }

    // Randomize a value between 1-6 and set then new value
    randomizeDice() {
        let newValue = 0;
        newValue = Math.floor(Math.random() * MAX_DICE_VALUE) + 1;
        
        this.value = newValue;
    }

    // Generate a default dice image of 1
    generateDefault() {
        let returnString = null;
        let imagePath = null;

        imagePath = `images/dice_1.png`
        returnString = `<img src=${imagePath}></img>`

        return returnString;
    }

    // Randomize a dice value, then return an image of the new dice value
    generateDice() {
        this.randomizeDice();
        let returnString = null;
        let imagePath = null;
        let diceImg = this.value;

        imagePath = `images/dice_${diceImg}.png`
        returnString = `<img src=${imagePath}></img>`

        return returnString;
    }

    // Return the value
    getValue() {
        return this.value;
    }
}

// Generate dice field div for each player
function createDiceField() {
    p01.innerHTML += `<div id= "p01-dice-field"></div>`;
    p02.innerHTML += `<div id= "p02-dice-field"></div>`; 
}

// Clear the dice field div for each player
function clearDiceField() {
    document.getElementById("p01-dice-field").innerHTML = "";
    document.getElementById("p02-dice-field").innerHTML = ""; 
}

// Generate default dices and display in each player's dice field
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

// Play a round of the dice game
function playRound(){
    // Clear the existing dice field
    clearDiceField();
    gameActive = true;

    // Create new dice objects for each player
    d1 = new Dice();
    d2 = new Dice();

    // Rounds specific variables for player dice images and score
    let p01Dices = null;
    let p02Dices = null;
    let p1RoundScore = 0;
    let p2RoundScore = 0;

    // Roll two dices for player one, get the value of each roll
    p01Dices = d1.generateDice();
    let d1Value1 = d1.getValue();
    p01Dices += d1.generateDice();
    let d1Value2 = d1.getValue();

    // Roll two dices for player two, get the value of each roll
    p02Dices = d2.generateDice();
    let d2Value1 = d2.getValue();
    p02Dices += d2.generateDice();
    let d2Value2 = d2.getValue();

    // While game is active and before three rounds
    if (gameActive == true && currentRound <= MAX_GAME_ROUNDS) {
        // Display the current round
        roundDisplay.innerHTML = `Round ${currentRound}`;

        // Calculate player one's score and set the new value
        p1RoundScore = calculateScores(d1Value1, d1Value2);
        playerOne.setScore(p1RoundScore);

        // Add player one's round score to the total score and set the new total score
        p1Total += p1RoundScore;
        playerOne.setTotalScore(p1Total);
        // Update the display to show player one scores
        // Used the long form of document.getElementID() because for some reason declaring them as variables at the top wouldn't work
        document.getElementById("p01-round-score").innerHTML = `Round Score: ${playerOne.getScore()}`; 
        document.getElementById("p01-total-score").innerHTML = `Total Score: ${playerOne.getTotalScore()}`;

        // Calculate and set player two's values
        p2RoundScore = calculateScores(d2Value1, d2Value2);
        playerTwo.setScore(p2RoundScore);

        // Add player two's total values and update the display
        p2Total += p2RoundScore;
        playerTwo.setTotalScore(p2Total);
        document.getElementById("p02-round-score").innerHTML = `Round Score: ${playerTwo.getScore()}`;
        document.getElementById("p02-total-score").innerHTML = `Total Score: ${playerTwo.getTotalScore()}`;

        // Get dice field elements
        p1DiceField = document.getElementById("p01-dice-field");
        p2DiceField = document.getElementById("p02-dice-field");

        // Update each player's dice field with the generated images
        p1DiceField.innerHTML += `${p01Dices}`;
        p2DiceField.innerHTML += `${p02Dices}`;
        currentRound++; 
        
        // Once the round has reach the limit, calculate the win conditions
        if (currentRound == ROUND_OVER) {
            // Disable the roll start button (for fast clickers)
            rollStart.disabled = true; 
            calculateWinCondition();
        }
    }
}

// Calculate score based on valueOne and valueTwo, return the calculated score
function calculateScores(valueOne, valueTwo) {
    let returnValue = 0;
    
    // If either values are 1, score is 0
    if (valueOne == DICE_DEFAULT || valueTwo == DICE_DEFAULT) {
        returnValue = 0;
    }
    // If valueOne is equal to valueTwo, score is added value multiplied by 2
    else if (valueOne == valueTwo) {
        returnValue = (valueOne+valueTwo)*2;
    }
    // Else add the two values together
    else {
        returnValue = valueOne + valueTwo;
    }
    // Return the calculated score
    return returnValue;
}

// Calculate the game's win condition and display the popup
function calculateWinCondition() {
    // If player one's total score is higher, player one (you) wins
    if (playerOne.getTotalScore() > playerTwo.getTotalScore()) {
        $("#popup").fadeIn(FADE_OFFSET);
        winnerHeading.innerHTML = "You Win!"
        p1.classList.add("winner");
        p2.classList.add("loser");
    }
    // If player two's total score is higher, player two (CPU) wins
    else if (playerTwo.getTotalScore() > playerOne.getTotalScore()) {
        $("#popup").fadeIn(FADE_OFFSET);
        winnerHeading.innerHTML = "You Lose!"
        p2.classList.add("winner");
        p1.classList.add("loser");
    }
    // else the game is a draw
    else {
        $("#popup").fadeIn(FADE_OFFSET);
        winnerHeading.innerHTML = "Draw!" 
    }
}

// Remove style classlists used for player's win conditions
function clearClassLists() {
    p1.classList.remove("winner");
    p1.classList.remove("loser");
    p2.classList.remove("winner");
    p2.classList.remove("loser");
}

// Reset the entire game by clearing values and setting scores to zero. Setup defaults
function gameWipe() {
    clearClassLists();
    clearDiceField();
    setupDefaultDice();
    p1Total = DEFAULT_SCORE;
    p2Total = DEFAULT_SCORE;
    playerOne.setScore(DEFAULT_SCORE);
    playerOne.setTotalScore(DEFAULT_SCORE);
    playerTwo.setScore(DEFAULT_SCORE);
    playerTwo.setTotalScore(DEFAULT_SCORE);
    document.getElementById("p01-round-score").innerHTML = `Round Score: ${playerOne.getScore()}`;
    document.getElementById("p01-total-score").innerHTML = `Total Score: ${playerOne.getTotalScore()}`;
    document.getElementById("p02-round-score").innerHTML = `Round Score: ${playerTwo.getScore()}`;
    document.getElementById("p02-total-score").innerHTML = `Total Score: ${playerTwo.getTotalScore()}`;

    currentRound = STARTING_ROUND;
    roundDisplay.innerHTML = `Game has not yet begun`;

    rollStart.disabled = false;

    gameActive = false;
    $("#popup").fadeOut(FADE_OFFSET);
}

// Perform playRound() function on each click
rollStart.addEventListener("click", playRound);

// Perform gameWipe() and reset the game on click
resetButton.addEventListener("click", gameWipe);

// Create two player objects
playerOne = new Player();
playerTwo = new Player();

// Create the dice field and setup default dice
createDiceField();
setupDefaultDice();
