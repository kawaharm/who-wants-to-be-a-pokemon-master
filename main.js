/*******************************
 * ******** VARIABLES **********
 * *****************************/
let host;   // Host Class
let currentQuestion = 0;    // Question counter
let hostDamage = 0;     // Damage to Host
let userDamage = 0;     // Damage to User
let questionNode = document.querySelector(".question");
let hostInfo = document.querySelector(".nameAndLvl");
let playNode = document.querySelector("#playMenu");
let hostHpBar = document.querySelector("#hostHp");
let captionNode = document.querySelector("#captionBar");
let userHpBar = document.querySelector("#userHp");
let backButton = document.createElement("button");
let messageNode = document.querySelector("#messageMenu");
let answer = true;     // Boolean for answer choice verification


/*************************************
 * ******** EVENT LISTENERS **********
 * ***********************************/
// Start Screen //
// User clicks LET'S PLAY button //
document.getElementById("input-form").addEventListener("submit", function (e) {
    // Please don't refresh the page (the default behavior of a form)
    e.preventDefault();

    // Grab value from username input on Start Screen
    const username = document.getElementById("input-text").value;

    // Switch from Start Screen to Main Screen
    updateMenu(1);

    // Switch main theme song to music during guessing question
    mainTheme.pause();
    suspenseSound.play(); 

    // Add username to Main Screen 
    document.querySelector(".username").innerHTML = username;
    let caption = document.createElement("h3");
    caption.setAttribute("class", "caption");
    caption.innerHTML = `What will ${username} do?`;
    captionNode.appendChild(caption);
})

document.addEventListener("click", function (e) {
    // User clicks Play -> show question choices
    if (e.target === document.querySelector("#play")) {
        updateMenu(2);
        suspenseSound.pause();
        suspenseSound.load();
        questionSound.play();
    }
    // User clicks Help -> show How To Play
    else if (e.target === document.querySelector("#help")) {
        updateMenu(3);
    }
    // User clicks Hint -> show hint options
    else if (e.target === document.querySelector("#hint")) {
        updateMenu(4);
    }
    // User clicks Run -> return to Start Screen and reset elements
    else if (e.target === document.querySelector("#run")) {
        updateMenu(1);
        startGame();
        questionSound.pause();
        questionSound.load();
    }

    // User clicks Back -> goes to previous screen
    if (e.target.classList.contains("backButton")) {
        // Check what screen you are currently on
        if (e.target.parentNode.getAttribute("id") === "playMenu") {
            updateMenu(2);
        }
        else if (e.target.parentNode.getAttribute("id") === "helpMenu") {
            updateMenu(3);
        }
        else if (e.target.parentNode.getAttribute("id") === "hintMenu") {
            updateMenu(4);
        }
        else if (e.target.parentNode.getAttribute("id") === "verifyMenu") {
            updateMenu(9);
        }
    }

    // Hint Menu //
    // User clicks 50:50 button -> Removes two random wrong answer choices
    if (e.target.getAttribute("id") === "fifty50") {
        // Pick number 0, 1, or 2 randomly and push onto empty array
        let randomArr = [];
        while (randomArr.length < 2) {
            let random = Math.floor(Math.random() * 3);
            // If IndexOf === -1, then element is not present
            if (randomArr.indexOf(random) === -1) {
                randomArr.push(random);
            }
        }
        // Hide two random answer choices from Play Menu
        document.querySelectorAll(".wrong")[randomArr[0]].classList.toggle("hidden");
        document.querySelectorAll(".wrong")[randomArr[1]].classList.toggle("hidden");
        updateMenu(4);
        document.querySelector("#fifty50").classList.toggle("hidden");  // Hide 50:50 button
    }
    // User clicks Call A Trainer -> Reveals answer to question
    else if (e.target.getAttribute("id") === "call-a-trainer") {
        let correctChoice = document.querySelector(".correct").textContent;
        // Display message briefly then return to Main Menu
        let count = 0;
        let message = document.createElement("h3");
        message.textContent = `Trainer: I think its ${correctChoice}!`;
        message.setAttribute("class", "message");
        messageNode.appendChild(message);
        updateMenu(7);
        let displayMessage = setInterval(function () {
            message.textContent;
            if (count > 3) {
                clearInterval(displayMessage);
                updateMenu(6);
                messageNode.removeChild(message);
                document.querySelector("#call-a-trainer").classList.toggle("hidden");   // Hide Call A Trainer button
            }
            count++;
        }, 1000);
    }

    // Play Menu //
    // Verify answer choice with user before proceeding to results
    if (e.target.classList.contains("correct")) {
        updateMenu(9);
        answer = true;
        // Play verify sound
        questionSound.pause();
        questionSound.load();
        verifySound.play();
    }
    // Verify answer choice with user before proceeding to results
    else if (e.target.classList.contains("wrong")) {
        updateMenu(9);
        answer = false;
        // Play verify sound
        questionSound.pause();
        questionSound.load();
        verifySound.play();
    }
    // If answer is correct: 
    if (e.target.getAttribute("id") === "verifyButton" && answer === true) {
        // Generate message for correct answer
        let message = document.createElement("h3");
        message.textContent = "It's Super Effective!";
        message.setAttribute("class", "message");
        messageNode.appendChild(message);
        updateMenu(10);
        hostDamage += 10;   // Host receives 10 HP damage
        currentQuestion += 1;   // Increment Question counter
        updateHpBar(hostDamage, userDamage);    // Update host and user HP bar
        // Play correct answer sound
        verifySound.pause();
        verifySound.load();
        correctSound.play();

        // Check if host HP is zero. If so, commence Victory sequence
        if (hostHpBar.getAttribute("value") === "0") {
            messageNode.removeChild(message);
            victorySeq();
        }
        // If host HP above zero, display message briefly then return to main menu
        else {
            let count = 0;
            let displayMessage = setInterval(function () {
                message.textContent;
                if (count > 3) {
                    clearInterval(displayMessage);
                    messageNode.removeChild(message);
                    updateMenu(6);
                    // Proceed to next question
                    nextQuestion(currentQuestion);  
                    correctSound.pause();
                    correctSound.load();
                    suspenseSound.play();
                }
                count++;
            }, 1000);
        }
    }

    // If answer is incorrect:
    if (e.target.getAttribute("id") === "verifyButton" && answer === false) {
       // Commence Game Over sequence and play wrong answer sound
       verifySound.pause(); 
       verifySound.load();
       wrongSound.play();
       gameOver();
    }
})


/*************************************************
 * ********   HOST CLASS AND QUESTIONS  **********
 * ***********************************************/

class Character {
    constructor(name, level) {
        this.name = name;
        this.health = 80;
        this.level = level;
    }
}

const myQuestions = [
    {
        question: "According to the old saying, what “is the root of all evil”?",
        answers: [
            { choice: "A: Food", correct: false },
            { choice: "B: Clothing", correct: false },
            { choice: "C: Money", correct: true },
            { choice: "D: Javascript", correct: false },
        ]
    },
    {
        question: "In the United States, what is traditionally the proper way to address a judge?",
        answers: [
            { choice: "A: Your Holiness", correct: false },
            { choice: "B: Your Honor", correct: true },
            { choice: "C: Your eminence", correct: false },
            { choice: "D: $ echo 'Yo Judge!'", correct: false },
        ]
    },
    {
        question: "This electric mouse is the best-known species in the widely-popular Pokemon franchise.",
        answers: [
            { choice: "A: Raichu", correct: false },
            { choice: "B: Thundercat", correct: false },
            { choice: "C: Logitech MX Master 3", correct: false },
            { choice: "D: Pikachu", correct: true },
        ]
    },
    {
        question: "HTML is the abbreviation for what standard web browser language?",
        answers: [
            { choice: "A: How To Measure Love", correct: false },
            { choice: "B: Holy Trinity Master Language", correct: false },
            { choice: "C: Ham Tomato Mustard Lettuce", correct: false },
            { choice: "D: Hypertext Markup Language", correct: true },
        ]
    },
    {
        question: "Who are two members of the organized crime syndicate Team Rocket?",
        answers: [
            { choice: "A: Bezos and Musk", correct: false },
            { choice: "B: Mario and Luigi", correct: false },
            { choice: "C: Jesse and James", correct: true },
            { choice: "D: Batman and Robin", correct: false },
        ]
    },
    {
        question: "Last year’s most visited website in the United States was:",
        answers: [
            { choice: "A: Google", correct: false },
            { choice: "B: Youtube", correct: true },
            { choice: "C: Facebook", correct: false },
            { choice: "D: Stack Overflow", correct: false },
        ]
    },
    {
        question: "Regis Philbin was born on Aug 25th, a birth date that is not shared by which celebrity?",
        answers: [
            { choice: "A: Will Smith", correct: true },
            { choice: "B: Blake Lively", correct: false },
            { choice: "C: Sean Connery", correct: false },
            { choice: "D: Billy Ray Cyrus", correct: false },
        ]
    },
    {
        question: "Fill in blank: There are ___ in the world: Those who understand binary, and those who don't.",
        answers: [
            { choice: "A: 2 kinds of people", correct: false },
            { choice: "B: 3 kinds of people", correct: false },
            { choice: "C: 10 kinds of people", correct: true },
            { choice: "D: 100 kinds of people", correct: false },
        ]
    },
]


/***********************************
 * ******** SOUND EFFECTS **********
 * *********************************/
let mainTheme = new Audio('./audio/main-theme.mp3');    // Start Screen music
mainTheme.volume = 0.3;
let suspenseSound = new Audio('./audio/lets-play.mp3'); // Play before every question
suspenseSound.volume = 0.3;
let questionSound = new Audio('./audio/question-music.mp3');    // Play during every question
questionSound.volume = 0.3;
let correctSound = new Audio('./audio/correct-answer.mp3');     // Play after correct guess results 
correctSound.volume = 0.3;
let wrongSound = new Audio('./audio/wrong-answer.mp3');     // Play after wrong guess results 
wrongSound.volume = 0.3;
let verifySound = new Audio('./audio/final-answer.mp3');    // Play during verifying ("Is this your final answer?")
verifySound.volume = 0.3;
let victorySound = new Audio('./audio/victory.mp3')     // Play during Victory sequence
victorySound.volume = 0.3;

// Play main theme song at load
mainTheme.addEventListener("loadeddata", function() {
    this.play();
})


/*******************************
 * ******** FUNCTIONS **********
 * *****************************/
// Creates host character for Regis
function createCharacters() {
    host = new Character('Regis', '99');
    let hostName = document.createElement("span");
    let hostLvl = document.createElement("span");
    hostName.innerText = host.name;
    hostLvl.innerText = `Lv:${host.level}`;
    hostInfo.appendChild(hostName);
    hostInfo.appendChild(hostLvl);
}

// Start Game with  
function startGame() {
    // Reset game back to initial settings
    reset();
    createCharacters();

    // Start at first question 
    currentQuestion = 0;
    nextQuestion(currentQuestion);  
}

// Generates new questions 
function nextQuestion(num) {
    // If host HP is zero, commence Victory sequence
    if (hostHpBar.getAttribute("value") === 0) {
        victorySeq();
    }

    // Add next question
    let prevQuestion = document.querySelector(".question").lastChild;
    let newQuestion = document.createElement("h3");
    newQuestion.textContent = myQuestions[num].question;
    questionNode.replaceChild(newQuestion, prevQuestion);

    // Remove previous answer choices
    resetChoices();

    // Add new answer choices
    let choiceCount = 1;
    myQuestions[num].answers.forEach(function (answer) {
        let button = document.createElement("button");
        button.setAttribute("id", `choice${choiceCount}`);
        button.innerText = answer.choice;
        button.classList.add("playButton", "choices");
        // Add class "correct" if answer is correct, "wrong" if incorrect
        if (answer.correct) {
            button.classList.add("correct");
        } else {
            button.classList.add("wrong")
        }
        playNode.appendChild(button);
        choiceCount++;
    });

    // Add back button
    backButton.textContent = "Back";
    backButton.classList.add("backButton", "choices");
    playNode.appendChild(backButton);
}

// Reset game back to inital settings
function reset() {
    // Remove username
    document.querySelector(".username").innerHTML = "";
    while (captionNode.firstChild) {
        captionNode.removeChild(captionNode.firstChild);
    }
    // Remove all answer choices and back button
    while (playNode.firstChild) {
        playNode.removeChild(playNode.firstChild);
    }
    // Reset all hint buttons
    document.querySelector("#fifty50").setAttribute("class", "choices");
    document.querySelector("#call-a-trainer").setAttribute("class", "choices");

    // Remove all class traits from character
    while (hostInfo.firstChild) {
        hostInfo.removeChild(hostInfo.firstChild);
    }
    // Reset battle damage
    hostDamage = 0;
    userDamage = 0;
    updateHpBar(hostDamage, userDamage);
}

// Remove all answer choices and back button
function resetChoices() {
        while (playNode.firstChild) {
            playNode.removeChild(playNode.firstChild);
        }
}

// Update Host HP Bar
function updateHpBar(hostDamage, userDamage) {
    let hpMax = 80;
    hostHpBar.setAttribute("value", hpMax - hostDamage);
    userHpBar.setAttribute("value", hpMax - userDamage);
}

// Game Over sequence
function gameOver() {
    userDamage = 80;
    updateHpBar(hostDamage, userDamage);    // User HP down to zero
    // Displays game over message briefly
    let message = document.createElement("h3");
    message.textContent = "You have fainted!";
    message.setAttribute("class", "message");
    messageNode.appendChild(message);
    updateMenu(10);
    let count = 0;
    let displayMessage = setInterval(function () {
        message.textContent;
        if (count > 2) {
            clearInterval(displayMessage);
            messageNode.removeChild(message);
            updateMenu(8);  // Return back to Start Screen
            startGame();
        }
        count++;
    }, 1000);
}

// Victory sequence
function victorySeq() {
    // Display victory message briefly
    let message = document.createElement("h3");
    message.textContent = "Host has fainted!";
    message.setAttribute("class", "message");
    messageNode.appendChild(message);
    let count = 0;
    let displayMessage = setInterval(function () {
        message.textContent;
        if (count > 2) {
            clearInterval(displayMessage);
            message.textContent = "You are now a Pokemon Master!!!"
            victorySound.play();    // Play victory sound
            setTimeout(function() {
                messageNode.removeChild(message);
                updateMenu(8);  // Return back to Start Screen
                startGame();
            }, 8000)
        }
        count++;
    }, 1000);
}

// Menu toggling function
function updateMenu(id) {
    switch(id) {
        case 1:     // Start Screen <-> Main Menu
            document.getElementById("startScreen").classList.toggle("hidden");
            document.getElementById("mainContainer").classList.toggle("hidden");
            document.getElementById("mainMenu").classList.toggle("hidden");
            break;
        case 2:     // Main Menu <-> Play Menu
            document.getElementById("mainMenu").classList.toggle("hidden");
            document.getElementById("playMenu").classList.toggle("hidden");
            break;
        case 3:     // Main Menu <-> Help Menu
            document.getElementById("mainMenu").classList.toggle("hidden");
            document.getElementById("helpMenu").classList.toggle("hidden");
            break;
        case 4:     // Main Menu <-> Hint Menu
            document.getElementById("mainMenu").classList.toggle("hidden");
            document.getElementById("hintMenu").classList.toggle("hidden");
            break;
        case 5:     // Play Menu <-> Message Menu
            document.getElementById("playMenu").classList.toggle("hidden");
            document.getElementById("messageMenu").classList.toggle("hidden");
            break;
        case 6:     // Main Menu <-> Message Menu
            document.getElementById("messageMenu").classList.toggle("hidden");
            document.getElementById("mainMenu").classList.toggle("hidden");
            break;
        case 7:     // Hint Menu <-> Message Menu
            document.getElementById("hintMenu").classList.toggle("hidden");
            document.getElementById("messageMenu").classList.toggle("hidden");
            break;
        case 8:     // Start Screen <-> Message Menu
            document.getElementById("messageMenu").classList.toggle("hidden");
            document.getElementById("mainContainer").classList.toggle("hidden");
            document.getElementById("startScreen").classList.toggle("hidden");
            break;
        case 9:     // Verify Menu <-> Play Menu
            document.getElementById("playMenu").classList.toggle("hidden");
            document.getElementById("verifyMenu").classList.toggle("hidden");
            break;
        case 10:    // Verify Menu <-> Message Menu
            document.getElementById("verifyMenu").classList.toggle("hidden");
            document.getElementById("messageMenu").classList.toggle("hidden");
            break;
    }
}
// Invoke Game //
startGame();
