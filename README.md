# Who Wants To Be A Pokemon Master

## Introduction

For my first project as a prospective software engineer, I have built a trivia game like no other. Blending two of my childhood pastimes, I proudly present: **WHO WANTS TO BE A POKEMON MASTER!** A crossover of the hit tv show _Who Wants To Be A Millionaire_ and popular video game franchise _Pokemon_, players choose Pikachu to take the hot seat against the original show host Regis Philbin as they answer multiple-choice questions using a RPG battle system similar to the Generation I Pokemon games. Each correct answer depletes a portion of the host's health points and gets you one step closer to victory. But beware, one wrong answer and your journey ends, sending you straight to the Pokemon Center to tend to your fainted Pikachu. So, do you have what it takes to be the next Pokemon Master?

## User Stories

- As a user, I want to

## Wireframe Flowchart

I created a case diagram using wireframes that illustrates what events happen when a certain button is clicked. I also measured the areas of each main component of the game knowing that I would map it out using the CSS grid system.

![project1-wireframe](https://user-images.githubusercontent.com/92088326/141669633-550f20c6-25d3-4b22-8988-ce46fad25f1d.png)

# Playing The Game

## How To Play

GAME: https://kawaharm.github.io/who-wants-to-be-a-pokemon-master2/

1. At the Start Screen, enter your name and click LET'S PLAY or hit Enter.
2. In the Main Menu, there are four buttons:
   - **PLAY:** Unveils 4 answer choices to the question. Players choose which of the four is the correct answer and will be asked "Is that your final answer?" before continuing. Answering correctly will deplete a portion of the host's HP and take the player to the next question. Answer incorrectly, the game is over.
   - **HELP:** Instructions/How To Play
   - **HINT:** Pick from two "Lifelines", each that can only be used once throughout the entire game.
     - 50-50: _Removes two random incorrect answer choices_
     - Call A Trainer: _A very intellectual trainer tells you the correct answer_
   - **RUN:** Quit the game and return back to the Start Screen.
3. Keep answering correctly until the host's HP is completely drained.
4. Claim your title as a Pokemon Master!

## Screenshots

#### Start Screen

![screenshot-start](https://user-images.githubusercontent.com/92088326/141709071-b1ff93ae-0463-4554-a01c-d01676c0cfdb.jpg)

#### Main Menu

![screenshot-main](https://user-images.githubusercontent.com/92088326/141709079-39ee3cf2-720a-4042-8fc5-1e3521267440.jpg)

#### Play Menu

![screenshot-choices](https://user-images.githubusercontent.com/92088326/141709532-a30c5c68-79b1-4a70-a511-0b7a844b6784.jpg)

#### Take that Regis!

![screenshot-correct](https://user-images.githubusercontent.com/92088326/141709545-9bc2f53b-c321-4dc1-9954-da66e4e3735b.jpg)

# How It Works

## Start Screen

The game switches off between two main `div` containers: the Start Screen and Main Screen. The game initializes on the Start Screen that contains an input textbox and submit button. Once the player enters a username and clicks the submit button, an event handler hides the Start Screen and unhides the Main Screen by toggling the `class="hidden"` in each `div`. At the same time, the event handler grabs the string from the textbox and copies the value onto the Main Screen, where it is displayed in the player's HP bar and caption.

```
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
```

## Main Screen

The Main Screen is divided into three horizontal sections: Host container (top), User container (middle), and Main Menu (bottom).

### Host Container

The Host container displays the host's name, level, HP bar, questions, and image. The host characteristics, such as the name and level, are built using a class and constructor method. This is so I can add more hosts besides Regis Philbin in the future. The questions are stored in an array of objects called `myQuestions`. Each object contains a question string and answer array with each answer choice and correct boolean (true if correct answer, false if wrong answer) nested in objects. The function `nextQuestion(num)` generates the questions onto the Host container by taking in the current index (num) of the question array.

```
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
```

### User Container

The User container displays the player's name (from Start Screen), level, HP bar and image.

### Main Menu

The Main Menu is where all the user interface controls happen. The player has four menu options: PLAY, HELP, HINT, and RUN. A click event handler utilizes the `e.target` property to access the four menus. Each time a button is pressed in the Main Menu, the function `updateMenu(id)` is called to toggle the `class="hidden"` of the Main Menu node and the button's parent node based on the case number (id) parameter. For example, in the Main Menu, all menus except the Main Menu are hidden because they share a "hidden" class. If the player clicks the PLAY button, the click event handler invokes `updateMenu(2)` to hide the Main Menu by adding the "hidden" class to its node and removing the "hidden" class from the PLAY button's parent node.

```
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
```

### Play Menu

The Play Menu consists of 4 answer choice buttons and a back button that returns to the Main Menu. The answer choices are generated by a `forEach` loop in the `nextQuestion(num)` function that goes through the answer arrays of the `myQuestions` array and creates a button with a class of "correct" or "wrong" based on the correct boolean as noted earlier.

```
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
```

Each time a choice is selected, the player is then asked "Is this your final answer?" to which they press the YES or BACK button. Clicking the YES button with the correct answer will increment the `hostDamage` value and subtract it from the host's max HP bar value.

### Hint Menu

## Game Over and Victory Sequence
