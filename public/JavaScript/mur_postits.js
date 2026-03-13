const mur = document.getElementById("mur");
const userInfo = document.getElementById("user-info");

async function chargerUtilisateur() {
    try {
        const response = await fetch("/session-user");
        const data = await response.json();

        if (data && data.username) {
            userInfo.textContent = `Connecté : ${data.username}`;
        } else {
            userInfo.textContent = "Utilisateur inconnu";
        }
    } catch (error) {
        console.error("Erreur utilisateur :", error);
        userInfo.textContent = "Erreur utilisateur";
    }
}

async function chargerPostits() {
    try {
        const response = await fetch("/liste");
        const postits = await response.json();

        mur.innerHTML = "";

        postits.forEach(postit => {
            const div = document.createElement("div");
            div.classList.add("postit");

            div.style.left = postit.x + "px";
            div.style.top = postit.y + "px";
            div.style.zIndex = postit.id;

            div.innerHTML = `
                <div class="postit-text">${postit.text}</div>
                <div class="postit-meta">
                    <span class="postit-author">@${postit.username}</span>
                    <span class="postit-date">${new Date(postit.created_at).toLocaleString("fr-FR")}</span>
                </div>
            `;

            mur.appendChild(div);
        });

    } catch (error) {
        console.error("Erreur chargement post-its :", error);
    }
}

async function initialiserMur() {
    await chargerUtilisateur();
    await chargerPostits();
}

initialiserMur();