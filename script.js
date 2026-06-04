
let startTime = null;
let previousEndTime = null;
let currentWordIndex = 0;
let timerInterval = null;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
let currentMode = "easy";

const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const restartBtn = document.getElementById("restart-btn");
const timerDisplay = document.getElementById("timer");
const modeButtons = document.querySelectorAll(".mode-btn");
const wordsToType = [];

const COLOR_CORRECT = "#00e676";
const COLOR_WRONG = "#ff5252";


const allWords = {
    fr: {
        easy: ["chat", "chien", "soleil", "maison", "arbre",
            "livre", "table", "fleur", "porte", "route"],
        medium: ["clavier", "fenetre", "chemise", "voiture", "jardin",
            "planete", "montagne", "riviere", "musique", "couleur"],
        hard: ["developpement", "synchroniser", "extraordinaire", "informatique", "philosophie",
            "authentification", "perpendiculaire", "electromagnet", "infrastructure", "precipitation"]
    },
    en: {
        easy: ["apple", "banana", "grape", "orange", "cherry",
            "cat", "dog", "run", "jump", "play"],
        medium: ["keyboard", "monitor", "printer", "charger", "battery",
            "window", "button", "simple", "sample", "change"],
        hard: ["synchronize", "complicated", "development", "extravagant", "misconception",
            "philosophical", "infrastructure", "electromagnetic", "authentication", "perpendicular"]
    },
    es: {
        easy: ["gato", "perro", "casa", "libro", "mesa",
            "flor", "luna", "agua", "cielo", "rojo"],
        medium: ["teclado", "ventana", "camisa", "jardin", "planeta",
            "montana", "musica", "ciudad", "tiempo", "comida"],
        hard: ["extraordinario", "sincronizar", "informatica", "perpendicular", "autenticacion",
            "infraestructura", "electromagnet", "precipitacion", "complicado", "desarrollo"]
    },
    it: {
        easy: ["gatto", "cane", "sole", "casa", "albero",
            "libro", "tavolo", "fiore", "porta", "strada"],
        medium: ["tastiera", "finestra", "camicia", "macchina", "giardino",
            "pianeta", "montagna", "fiume", "musica", "colore"],
        hard: ["sviluppo", "sincronizzare", "straordinario", "informatica", "filosofia",
            "autenticazione", "perpendicolare", "elettromagnete", "infrastruttura", "precipitazione"]
    },
    mg: {
        easy: ["soa", "vary", "rano", "trano", "mena",
            "vola", "afo", "hazo", "lena", "omby"],
        medium: ["fitiavana", "fahafahana", "fahalalana", "fandrosoana", "firaisana",
            "fiarovana", "fitaovana", "fanabeazana", "fivavahana", "fahendrena"],
        hard: ["fitondrantenana", "fanambarana", "fampandrosoana", "firaisankina", "fanaovambola",
            "fitaovampanazavana", "fanabeazambahoaka", "fiarovantenana", "fandraisanakina", "fampiroboroboana"]
    },
    tr: {
        easy: ["kedi", "kopek", "gunes", "ev", "agac",
            "kitap", "masa", "cicek", "kapi", "yol"],
        medium: ["klavye", "pencere", "gomlek", "araba", "bahce",
            "gezegen", "dag", "nehir", "muzik", "renk"],
        hard: ["gelistirme", "senkronize", "olaganustu", "bilisim", "felsefe",
            "dogrulama", "dik", "elektromanyetik", "altyapi", "yagis"]
    },
    ru: {
        easy: ["kot", "pes", "dom", "les", "reka",
            "kniga", "stol", "tsvet", "dver", "put"],
        medium: ["klavisha", "okno", "rubashka", "mashina", "sad",
            "planeta", "gora", "muzyka", "gorod", "vremya"],
        hard: ["razrabotka", "sinhronizatsiya", "chrezvychayniy", "informatika", "filosofiya",
            "autentifikatsiya", "perpendikulyar", "elektromagnit", "infrastruktura", "osadki"]
    },
    ko: {
        easy: ["goyang", "gaja", "jib", "chaek", "kkot",
            "mul", "bul", "san", "dal", "byeol"],
        medium: ["kibodeu", "changmun", "eumak", "dosi", "jadongcha",
            "haengseong", "gangmul", "saekkal", "sigan", "jeongwon"],
        hard: ["gaebal", "donggihwa", "bibomhan", "jeongbohak", "cheolhak",
            "injeung", "sujikseon", "jeonjagi", "inpeuhra", "gangsuyang"]
    },
    ja: {
        easy: ["neko", "inu", "ie", "hon", "hana",
            "mizu", "hi", "yama", "tsuki", "hoshi"],
        medium: ["kibodo", "mado", "ongaku", "toshi", "kuruma",
            "wakusei", "kawa", "iro", "jikan", "niwa"],
        hard: ["kaihatsu", "dokika", "hijoni", "joho", "tetsugaku",
            "ninsho", "suichoku", "denji", "infura", "kosuiryo"]
    },
    zh: {
        easy: ["mao", "gou", "jia", "shu", "hua",
            "shui", "huo", "shan", "yue", "xing"],
        medium: ["jianpan", "chuanghu", "yinyue", "chengshi", "qiche",
            "xingqiu", "heliu", "yanse", "shijian", "huayuan"],
        hard: ["kaifa", "tongbu", "feifan", "xinxi", "zhexue",
            "renzheng", "chuizhi", "dianci", "jichu", "jiangshui"]
    }
};

function getRandomWord() {
    const langEl = document.getElementById("lang");
    const lang = langEl ? langEl.value : "en";
    const liste = allWords[lang][currentMode];
    return liste[Math.floor(Math.random() * liste.length)];
}

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
}

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
}

function calculerWPM() {
    if (!startTime) return 0;
    const secondes = (Date.now() - startTime) / 1000;
    const minutes = secondes / 60;
    if (minutes === 0) return 0;
    let totalCaracteres = 0;
    for (let i = 0; i < currentWordIndex; i++) {
        totalCaracteres += wordsToType[i].length;
    }
    return Math.round((totalCaracteres / 5) / minutes);
}

function getConseil(wpm, accuracy) {
    if (accuracy < 80) return {
        titre: "🎯 Travaille ta précision !",
        texte: "Tu fais beaucoup d'erreurs. Ralentis et concentre-toi sur chaque lettre."
    };
    if (accuracy < 90) return {
        titre: "📈 Bonne progression !",
        texte: "Ta précision est correcte mais vise 95%+ avant d'augmenter ta vitesse."
    };
    if (wpm < 20) return {
        titre: "⌨️ Continue de t'entraîner !",
        texte: "Entraîne-toi 15 minutes par jour et ne regarde pas ton clavier !"
    };
    if (wpm < 40) return {
        titre: "💪 Tu progresses bien !",
        texte: "Apprends la position des doigts sur la rangée ASDF JKL pour aller plus vite."
    };
    if (wpm < 60) return {
        titre: "🚀 Très bien !",
        texte: "Travaille ta régularité pour maintenir ce rythme sur toute la partie."
    };
    return {
        titre: "🏆 Excellent !",
        texte: "Tu es un expert ! Essaie le mode difficile pour repousser tes limites."
    };
}

function finDeJeu() {
    inputField.disabled = true;
    stopTimer();
    const wpm = calculerWPM();
    const accuracy = calculerAccuracy();
    const score = Math.round(wpm * (accuracy / 100));

    let html =
        "🎉 Terminé ! " +
        "WPM : <strong>" + wpm + "</strong> | " +
        "Précision : <strong>" + accuracy + "%</strong> | " +
        "Score : <strong>" + score + "</strong>";

    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const conseil = getConseil(wpm, accuracy);
        html +=
            "<br><br>" +
            "<div class='conseil-box'>" +
            "<strong class='conseil-titre'>" + conseil.titre + "</strong>" +
            "<p class='conseil-texte'>" + conseil.texte + "</p>" +
            "</div>";
    }

    results.innerHTML = html;
}

function highlightNextWord() {
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.fontWeight = "normal";
        }
        wordElements[currentWordIndex].style.color = "#c4a55a";
        wordElements[currentWordIndex].style.fontWeight = "bold";
    }
}

function highlightCaracteres() {
    const spans = wordDisplay.children;
    const span = spans[currentWordIndex];
    const attendu = wordsToType[currentWordIndex];
    const saisi = inputField.value;

    let html = "";
    for (let i = 0; i < attendu.length; i++) {
        if (i < saisi.length) {
            if (saisi[i] === attendu[i]) {
                html += '<span style="color:' + COLOR_CORRECT + '">' + attendu[i] + '</span>';
            } else {
                html += '<span style="color:' + COLOR_WRONG + ';text-decoration:underline">' + attendu[i] + '</span>';
            }
        } else {
            html += '<span style="color:#fff">' + attendu[i] + '</span>';
        }
    }
    span.innerHTML = html + " ";
}

function startTest() {
    const wordCountEl = document.getElementById("word-count");
    const wordCount = wordCountEl ? parseInt(wordCountEl.value) : 30;
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    totalCharsTyped = 0;
    correctCharsTyped = 0;
    inputField.disabled = false;
    inputField.value = "";
    results.innerHTML = "WPM : 0 | Accuracy : 0% | Score : 0";
    stopTimer();
    timerDisplay.textContent = "⏱️ Temps : 0s";

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord());
    }

    wordsToType.forEach(function (word, index) {
        const span = document.createElement("span");
        span.textContent = word + " ";
        span.style.color = "#fff";
        if (index === 0) {
            span.style.color = "#FFD166";
            span.style.fontWeight = "bold";
        }
        wordDisplay.appendChild(span);
    });

    inputField.focus();
}

function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        previousEndTime = Date.now();
        demarrerTimer();
    }
}

function updateWord(event) {
    if (event.key === " ") {
        event.preventDefault();

        const saisi = inputField.value.trim();
        const attendu = wordsToType[currentWordIndex];

        if (saisi === "") return;

        totalCharsTyped += saisi.length;
        correctCharsTyped += compterCorrects(saisi, attendu);

        const span = wordDisplay.children[currentWordIndex];
        if (saisi === attendu) {
            span.style.color = COLOR_CORRECT;
            span.style.textDecoration = "none";
        } else {
            span.style.color = COLOR_WRONG;
            span.style.textDecoration = "line-through";
        }
        span.style.fontWeight = "normal";

        inputField.value = "";
        currentWordIndex++;
        highlightNextWord();

        const wpm = calculerWPM();
        const accuracy = calculerAccuracy();
        results.innerHTML = "WPM : <strong>" + wpm + "</strong> | Accuracy : <strong>" + accuracy + "%</strong>";

        if (currentWordIndex >= wordsToType.length) {
            finDeJeu();
        }
    }
}

inputField.addEventListener("input", function () {
    if (currentWordIndex < wordsToType.length) {
        highlightCaracteres();
    }
});

inputField.addEventListener("keydown", function (event) {
    startTimer();
    updateWord(event);
});

modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        currentMode = btn.getAttribute("data-mode");
        modeButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        startTest();
    });
});

restartBtn.addEventListener("click", function () { startTest(); });

const langEl = document.getElementById("lang");
if (langEl) {
    langEl.addEventListener("change", function () { startTest(); });
}

const wordCountEl = document.getElementById("word-count");
if (wordCountEl) {
    wordCountEl.addEventListener("change", function () { startTest(); });
}

function checkUser() {
    const currentUser = localStorage.getItem("currentUser");
    const userDisplay = document.getElementById("user-display");
    const langSelector = document.getElementById("lang-selector");
    const wordCountSelector = document.getElementById("word-count-selector");
    const msgOnConnecte = document.querySelector(".msg-non-connecte");

    if (currentUser) {
        if (userDisplay) {
            userDisplay.innerHTML =
                '<span id="user-name">👤 ' + currentUser + '</span>' +
                '<button id="logout-btn" onclick="logout()">Déconnexion</button>';
        }
        if (langSelector) {
            langSelector.style.display = "inline-flex";
            langSelector.style.gap = "8px";
            langSelector.style.alignItems = "center";
        }
        if (wordCountSelector) {
            wordCountSelector.style.display    = "inline-flex";
            wordCountSelector.style.gap        = "8px";
            wordCountSelector.style.alignItems = "center";
        }
        if (msgOnConnecte) {
            msgOnConnecte.style.display = "none";
        }
        
    } else {
        if (userDisplay) {
            userDisplay.innerHTML =
                '<a href="login.html" class="btn-connexion">Connexion</a>';
        }

        if (langSelector) {
            langSelector.style.display = "none";
        }

        if(wordCountSelector) {
            wordCountSelector.style.display = "none";
        }
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

checkUser();
startTest();