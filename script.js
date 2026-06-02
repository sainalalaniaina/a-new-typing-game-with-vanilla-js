/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let timerInterval = null;
let totalCharsTyped = 0;
let correctCharsTyped = 0;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const restartBtn = document.getElementById("restart-btn");
const timerDisplay = document.getElementById("timer");
const modeButtons = document.querySelectorAll(".mode-btn");


const COLOR_CORRECT = "#5b9e6e"; 
const COLOR_WRONG = "#c0392b";    

let currentMode = "easy";

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry",
        "cat", "dog", "run", "jump", "play",
        "sun", "sky", "tree", "fish", "book"
    ],
    medium: ["keyboard", "monitor", "printer", "charger", "battery",
        "window", "button", "simple", "sample", "change"
    ],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception",
        "philosophical", "infrastructure", "electromagnetic", "authentication", "perpendicular"
    ]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode || currentMode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

function demarrerTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        if (startTime === null) return;
        const secondes = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = "⏱️ Temps : " + secondes + "s";
    }, 500);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
};

function compterCorrects(saisi, attendu) {
    let corrects = 0;
    for (let i = 0; i < saisi.length; i++) {
        if (saisi[i] === attendu[i]) corrects++;
    }
    return corrects;
}

function calculerAccuracy() {
    if (totalCharsTyped === 0) return 0;
    return Math.round((correctCharsTyped / totalCharsTyped) * 100);
};

// Initialize the typing test
const startTest = (wordCount = 10) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    totalCharsTyped = 0;
    correctCharsTyped = 0;
    inputField.disabled = false;
    stopTimer();
    timerDisplay.textContent = "⏱️ Temps : 0s";

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(currentMode));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.color = "#FFFFFF";
        if (index === 0) {
            span.style.color = "#c4a55a"; // Highlight first word
            span.style.fontWeight = "bold";
        }
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.innerHTML = "WPM : 0 | Accuracy : 0% | Score : 0";
    inputField.focus();
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime){ 
        startTime = Date.now();
    demarrerTimer();
}
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

const calculerWPM = () => {
    if (!startTime) return 0;
    const secondes = (Date.now() - startTime) / 1000;
    const minutes = secondes / 60;
    if (minutes === 0) return 0;

    let totalCaracteres = 0;
    for (let i = 0; i < currentWordIndex; i++) {
        totalCaracteres += wordsToType[i].length;
    }
    const mots = totalCaracteres / 5;
    return Math.round(mots / minutes);
};

const finDeJeu = () => {
    inputField.disabled = true;
    stopTimer();
    const wpm = calculerWPM();
    const accuracy = calculerAccuracy();
    const score = Math.round(wpm * (accuracy / 100));
    results.innerHTML =
        "🎉 Terminé ! " +
        "WPM : <strong>" + wpm + "</strong> | " +
        "Précision : <strong>" + accuracy + "%</strong> | " +
        "Score final : <strong>" + score + "</strong>";
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        totalCharsTyped += inputField.value.trim().length;
        correctCharsTyped += compterCorrects(inputField.value.trim(), wordsToType[currentWordIndex]);

        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            const { wpm, accuracy } = getCurrentStats();
            results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
                const span = wordDisplay.children[currentWordIndex];
                if (span) {
                    span.style.color = COLOR_CORRECT;
                    span.style.textDecoration = "none";
                }
            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces

            if (currentWordIndex >= wordsToType.length) {
                finDeJeu();
            }
        } else {
            inputField.value = "";
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
            wordElements[currentWordIndex - 1].style.fontWeight = "normal";
        }
        wordElements[currentWordIndex].style.color = "#FFD166";
        wordElements[currentWordIndex].style.fontWeight = "bold";
    }
};

function highlightCaracteres() {
    const spans   = wordDisplay.children;
    const span    = spans[currentWordIndex];
    const attendu = wordsToType[currentWordIndex];
    const saisi   = inputField.value;

    let html = "";
    for (let i = 0; i < attendu.length; i++) {
        if (i < saisi.length) {
            if (saisi[i] === attendu[i]) {
                html += '<span style="color:green">' + attendu[i] + '</span>';
            } else {
                html += '<span style="color:red;text-decoration:underline">' + attendu[i] + '</span>';
            }
        } else {
            html += '<span style="color:#FFFFFF">' + attendu[i] + '</span>';
        }
    }
    span.innerHTML = html + " ";
}

inputField.addEventListener("input", function() {
    if (currentWordIndex < wordsToType.length) {
        highlightCaracteres();
    }
});

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentMode = btn.getAttribute("data-mode");
        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        startTest();
    });
});

// Start the test
startTest();

restartBtn.addEventListener("click", () => startTest());