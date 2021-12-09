p1 = document.getElementById("p01");
p2 = document.getElementById("p02");

rollStart = document.getElementById("roll");
resetButton = document.getElementById("reset-game");

class Player {
    constructor(name, score = 0, totalScore = 0) {
        this.name = name;
        this.score = score;
        this.totalScore = score;
    }

    displayDetails() {
        let returnString = null;

        returnString = `<h2>${this.name}</h2>`
        returnString += `<p>Round Score: ${this.score}</p>`
        returnString += `<p>Total Score: ${this.score}</p>`

        const dice01 = new Dice();
        const dice02 = new Dice();

        returnString += dice01.generateDice();
        returnString += dice02.generateDice();

        return returnString;
    }
}

class Dice {
    constructor(value = 1) {
        this.value = value;
    }

    generateDice() {
        let returnString = null;
        let imagePath = null;

        imagePath = `images/dice_1.png`
        returnString = `<img src=${imagePath}></img>`

        return returnString
    }
}

playerOne = new Player("You");
playerTwo = new Player("CPU");

p01.innerHTML = playerOne.displayDetails();
p02.innerHTML = playerTwo.displayDetails();
