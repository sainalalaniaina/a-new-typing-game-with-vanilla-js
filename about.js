const currentUser = localStorage.getItem("currentUser");
const userDisplayAbout = document.getElementById("user-display-about");

if (currentUser) {
    if (userDisplayAbout) {
        userDisplayAbout.innerHTML =
            '<span id="user-name">👤 ' + currentUser + '</span>' +
            '<button id="logout-btn" onclick="logout()">Déconnexion</button>';
    }
    
} else {
    if (userDisplayAbout) {
        userDisplayAbout.innerHTML = '<a href="login.html" class="btn-connexion">Se connecter</a>';
    }
}