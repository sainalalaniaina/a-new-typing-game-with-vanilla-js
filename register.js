const registerBtn    = document.getElementById("register-btn");
const errorMsg       = document.getElementById("register-error");
const successMsg     = document.getElementById("register-success");

registerBtn.addEventListener("click", function() {
    const username  = document.getElementById("username").value.trim();
    const password  = document.getElementById("password").value;
    const confirm   = document.getElementById("password-confirm").value;

    errorMsg.textContent   = "";
    successMsg.textContent = "";

    if (username === "" || password === "" || confirm === "") {
        errorMsg.textContent = "Remplis tous les champs !";
        return;
    }

    if (username.length < 3) {
        errorMsg.textContent = "Le pseudo doit faire au moins 3 caractères !";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "Le mot de passe doit faire au moins 6 caractères !";
        return;
    }

    if (password !== confirm) {
        errorMsg.textContent = "Les mots de passe ne correspondent pas !";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username]) {
        errorMsg.textContent = "Ce pseudo est déjà pris !";
        return;
    }

    users[username] = { password: password };
    localStorage.setItem("users", JSON.stringify(users));

    successMsg.textContent = "Compte créé avec succès !";
    setTimeout(function() {
        window.location.href = "login.html";
    }, 1500);
});