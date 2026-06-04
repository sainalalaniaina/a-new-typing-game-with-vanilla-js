const loginBtn  = document.getElementById("login-btn");
const errorMsg  = document.getElementById("login-error");

loginBtn.addEventListener("click", function() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        errorMsg.textContent = "Remplis tous les champs !";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (!users[username]) {
        errorMsg.textContent = "Ce pseudo n'existe pas !";
        return;
    }

    if (users[username].password !== password) {
        errorMsg.textContent = "Mot de passe incorrect !";
        return;
    }

    localStorage.setItem("currentUser", username);

    window.location.href = "index.html";
});