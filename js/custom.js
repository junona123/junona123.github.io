document.addEventListener("DOMContentLoaded", function () {
      function showPopup() {
        const popup = document.getElementById("successPopup");
        popup.classList.add("show");

        setTimeout(() => {
            popup.classList.remove("show");
        }, 3000);
    }

    const form = document.getElementById("contactForm");
    const outputBox = document.getElementById("formMessage");

    // ==============================
    // REALIO LAIKO VALIDACIJA
    // ==============================

    function showError(input, message) {
        input.classList.add("input-error");

        let error = input.parentElement.querySelector(".error-text");
        if (!error) {
            error = document.createElement("div");
            error.classList.add("error-text");
            input.parentElement.appendChild(error);
        }
        error.textContent = message;
    }

    function clearError(input) {
        input.classList.remove("input-error");

        let error = input.parentElement.querySelector(".error-text");
        if (error) error.textContent = "";
    }

    function validateName(value) {
        return /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/.test(value);
    }

    function validateEmail(value) {
        return /^\S+@\S+\.\S+$/.test(value);
    }

    function validateNotEmpty(value) {
        return value.trim() !== "";
    }

    // --- REALIU LAIKU TIKRINIMAS ---
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const address = document.getElementById("address");

    firstname.addEventListener("input", () => {
        validateName(firstname.value)
            ? clearError(firstname)
            : showError(firstname, "Vardas gali būti tik raidės.");
    });

    lastname.addEventListener("input", () => {
        validateName(lastname.value)
            ? clearError(lastname)
            : showError(lastname, "Pavardė gali būti tik raidės.");
    });

    email.addEventListener("input", () => {
        validateEmail(email.value)
            ? clearError(email)
            : showError(email, "Neteisingas el. pašto formatas.");
    });

    address.addEventListener("input", () => {
        validateNotEmpty(address.value)
            ? clearError(address)
            : showError(address, "Adresas negali būti tuščias.");
    });

    // Prijungiame realaus laiko validaciją
    document.getElementById("firstname").addEventListener("input", e => validateName(e.target));
    document.getElementById("lastname").addEventListener("input", e => validateName(e.target));
    document.getElementById("email").addEventListener("input", e => validateEmail(e.target));
    document.getElementById("address").addEventListener("input", e => validateAddress(e.target));
    document.getElementById("q1").addEventListener("input", e => validateRating(e.target));
    document.getElementById("q2").addEventListener("input", e => validateRating(e.target));
    document.getElementById("q3").addEventListener("input", e => validateRating(e.target));

    // ==============================
    // FORMOS SUBMIT + VIDURKIS + POPUP
    // ==============================

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // sustabdomas formos persikrovimas

        // Surenkame formos duomenis
        const data = {
            firstname: document.getElementById("firstname").value.trim(),
            lastname: document.getElementById("lastname").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            q1: Number(document.getElementById("q1").value),
            q2: Number(document.getElementById("q2").value),
            q3: Number(document.getElementById("q3").value)
        };

        // Konsolė
        console.log("Gauti formos duomenys:", data);

        // Vidurkio skaičiavimas
        const average = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);

        // Atvaizdavimas svetainėje
        outputBox.innerHTML = `
            <h5>Gauti duomenys:</h5>
            <p><strong>Vardas:</strong> ${data.firstname}</p>
            <p><strong>Pavardė:</strong> ${data.lastname}</p>
            <p><strong>El. paštas:</strong> ${data.email}</p>
            <p><strong>Telefono numeris:</strong> ${data.phone}</p>
            <p><strong>Adresas:</strong> ${data.address}</p>
            <p><strong>1. Paslaugų kokybė:</strong> ${data.q1}</p>
            <p><strong>2. Bendravimas:</strong> ${data.q2}</p>
            <p><strong>3. Rekomendacija:</strong> ${data.q3}</p>

            <hr>

            <p><strong>${data.firstname} ${data.lastname}: ${average}</strong></p>
        `;

        // stilius
        outputBox.style.padding = "15px";
        outputBox.style.background = "#f4f4f4";
        outputBox.style.borderRadius = "6px";
        outputBox.style.marginTop = "10px";

        // Popup pranešimas
        const popup = document.createElement("div");
        popup.className = "popup-message";
        popup.textContent = "Duomenys pateikti sėkmingai!";
        document.body.appendChild(popup);
        showPopup();

        setTimeout(() => popup.classList.add("show"), 10);
        setTimeout(() => {
            popup.classList.remove("show");
            popup.remove();
        }, 3000);
    });
});
const phone = document.getElementById("phone");

phone.addEventListener("input", () => {
    let raw = phone.value.replace(/\D/g, ""); // paliekame tik skaičius

    // 1. Jei prasideda 8 -> keičiame į 6 (lietuviškas numeris)
    if (raw.startsWith("8")) {
        raw = "6" + raw.substring(1);
    }

    // 2. Visada turi prasidėti 6, bet NELIEČIAME kol dar nieko neįvesta
    if (raw.length > 0 && !raw.startsWith("6")) {
        raw = "6" + raw;
    }

    // 3. Limituojame iki 8 skaitmenų (pvz. 61234567)
    raw = raw.substring(0, 8);

    // 4. Formatuojame sklandžiai
    let formatted = "+370 ";

    if (raw.length > 0) formatted += raw.substring(0, 1);      // +370 6
    if (raw.length > 1) formatted += raw.substring(1, 3);      // +370 612
    if (raw.length > 3) formatted += " " + raw.substring(3);   // +370 612 3456

    phone.value = formatted;
});
// ---------------- REAL-TIME VALIDACIJA + SUBMIT AKTYVAVIMAS ----------------

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");

    const fields = {
        firstname: document.getElementById("firstname"),
        lastname: document.getElementById("lastname"),
        email: document.getElementById("email"),
        address: document.getElementById("address"),
        q1: document.getElementById("q1"),
        q2: document.getElementById("q2"),
        q3: document.getElementById("q3"),
    };

    // ------ VIENOS REIKŠMĖS VALIDAVIMO FUNKCIJA ------
    function validateField(id, value) {
        switch (id) {
            case "firstname":
            case "lastname":
                return /^[A-Za-zÀ-ž\s]+$/.test(value);   // tik raidės
            case "email":
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case "address":
                return value.length > 3;
            case "q1":
            case "q2":
            case "q3":
                return value >= 1 && value <= 10;
            default:
                return true;
        }
    }

    // ------ TIKRINA VISUS LAUKUS ------
    function checkFormValidity() {
        let allGood = true;

        Object.entries(fields).forEach(([id, input]) => {
            const valid = validateField(id, input.value.trim());

            if (!valid) {
                input.classList.add("error");
                allGood = false;
            } else {
                input.classList.remove("error");
            }
        });

        // suaktyvinam arba išjungiam mygtuką
        submitBtn.disabled = !allGood;
    }

    // ------ VALIDACIJA REALIU LAIKU ------
    Object.values(fields).forEach((input) => {
        input.addEventListener("input", checkFormValidity);
    });

    // Pirmas patikrinimas
    checkFormValidity();
});
// 2. Duomenų rinkinys

const cardIcons =  ["🍎","🍌","🍇","🍒","🍉","🥝","🍓","🍍",
    "🍑","🍆","🥑","🍋"];

const board = document.getElementById("game-board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const winMessage = document.getElementById("win-message");
const bestEasyEl = document.getElementById('best-easy');
const bestHardEl = document.getElementById('best-hard');
const timerEl = document.getElementById("timer");

loadBestScores();

let moves = 0;
let matches = 0;
let firstCard = null;
let lockBoard = false;
let timer = 0;
let timerInterval = null;


// Eventai
document.getElementById("start").addEventListener("click", startGame);
document.getElementById("reset").addEventListener("click", startGame);
document.getElementById("difficulty").addEventListener("change", startGame);

// ❗ Pagrindinė start funkcija
function startGame() {
    winMessage.textContent = "";
    moves = 0;
    matches = 0;

    movesEl.textContent = 0;
    matchesEl.textContent = 0;
    
    firstCard = null;
    lockBoard = false;

    board.innerHTML = "";
    firstCard = null;
    lockBoard = false;

    let difficulty = document.getElementById("difficulty").value;

    let rows = difficulty === "easy" ? 3 : 4;
    let cols = difficulty === "easy" ? 4 : 6;
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    let totalCards = rows * cols; // 12 arba 24
    let neededPairs = totalCards / 2;

    let icons = cardIcons.slice(0, neededPairs);

    let deck = [...icons, ...icons];
    deck.sort(() => Math.random() - 0.5);

    deck.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = icon;
        card.textContent = "";
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    stopTimer();  // sustabdo, jei buvęs laikmatis veikė
    startTimer(); // paleidžia naują laikmatį

    });
    
}
function loadBestScores() {
    const bestEasy = localStorage.getItem("best_easy");
    const bestHard = localStorage.getItem("best_hard");

    bestEasyEl.textContent = bestEasy ? bestEasy : "-";
    bestHardEl.textContent = bestHard ? bestHard : "-";
}
function saveBestScore(difficulty, moves) {
    if (difficulty === "easy") {
        const best = localStorage.getItem("best_easy");
        if (!best || moves < best) {
            localStorage.setItem("best_easy", moves);
            bestEasyEl.textContent = moves;
        }
    } else {
        const best = localStorage.getItem("best_hard");
        if (!best || moves < best) {
            localStorage.setItem("best_hard", moves);
            bestHardEl.textContent = moves;
        }
    }
}

// ❗ Kortelių paspaudimas
function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains("flipped") || this.classList.contains("matched")) return;

    this.classList.add("flipped");
    this.textContent = this.dataset.value;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    moves++;
    movesEl.textContent = moves;

    if (firstCard.dataset.value === this.dataset.value) {
        firstCard.classList.add("matched");
        this.classList.add("matched");

        firstCard = null;
        matches++;
        matchesEl.textContent = matches;

        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            this.classList.remove("flipped");

            firstCard.textContent = "";
            this.textContent = "";

            firstCard = null;
            lockBoard = false;
        }, 1000);
    }
}
function startTimer() {
    timer = 0;
    timerEl.textContent = timer;

    timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}



function checkWin() {
    let neededPairs = board.children.length / 2;
    if (matches === neededPairs) {
        winMessage.textContent = "Laimėjote!";
        stopTimer();
        const difficulty = document.getElementById("difficulty").value;
        saveBestScore(difficulty, moves);
    }
}