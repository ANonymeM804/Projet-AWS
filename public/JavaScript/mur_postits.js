const mur = document.getElementById("mur");
const userInfo = document.getElementById("user-info");
const usersLink = document.getElementById("utilisateurs");
const logoutBtn = document.getElementById("logout");

// Afficher les alertes d'erreur basées sur les paramètres d'URL
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "create_denied") {
        alert("Création interdite, contactez votre administrateur");
    }

    if (error === "edit_denied") {
        alert("Modification interdite, contactez votre administrateur");
    }

    if (error === "delete_denied") {
        alert("Suppression interdite, contactez votre administrateur");
    }
});
// Fonction pour afficher une alerte personnalisée
function showAlert(message) {
    const box = document.getElementById("alertBox");
    if (!box) return;

    box.textContent = message;
    box.classList.remove("hidden");//

    // disparaît après 3 secondes
    setTimeout(() => {
        box.classList.add("hidden");
    }, 3000);
}



let currentUser = null;// Variable globale pour stocker les informations de l'utilisateur connecté

// Charger l'utilisateur connecté
async function chargerUtilisateur() {
    try {
        const response = await fetch("/session-user", {
            credentials: "include"
        });

        const data = await response.json();

        console.log("SESSION USER =", data);

        if (data && data.username) {
            currentUser = data;
            userInfo.innerHTML = `
                <div class="user-box">
                    <div class="user-avatar">👤</div>
                    <div class="user-name">${data.username}</div>
                </div>
            `;
                        //userInfo.textContent = `Connecté : ${data.username}`;

            // ICI : cacher le lien si pas admin
            if (usersLink && data.role !== "admin") {
                usersLink.style.display = "none";
            }

        } else {
            userInfo.textContent = "Utilisateur non connecté";

            if (usersLink) {
                usersLink.style.display = "none";
            }
        }

    } catch (error) {
        console.error("Erreur utilisateur :", error);
        userInfo.textContent = "Erreur utilisateur";

        if (usersLink) {
            usersLink.style.display = "none";
        }
    }
}

// Charger tous les post-its
async function chargerPostits() {
    try {
        const response = await fetch("/liste", { credentials: "include" } );
        const postits = await response.json();

        console.log("POSTITS =", postits);

        mur.innerHTML = "";

        postits.forEach(postit => {
            const postitEl = document.createElement("div");
            postitEl.className = "postit";

            postitEl.style.position = "absolute";
            postitEl.style.left = `${postit.x}px`;//positionner le post-it selon les coordonnées x et y
            postitEl.style.top = `${postit.y}px`;
            postitEl.style.width = "250px";
            postitEl.style.minHeight = "200px";
            postitEl.style.background = postit.color ;//couleur du post-it
            postitEl.style.border = "2px solid #1a1a2e";
            postitEl.style.boxShadow = "4px 4px 0 #1a1a2e";//effet de relief
            postitEl.style.padding = "12px";
            postitEl.style.display = "flex";
            postitEl.style.flexDirection = "column";
            postitEl.style.justifyContent = "space-between";
            postitEl.style.zIndex = "1";

            // auteur
            const userEl = document.createElement("div");
            userEl.textContent = `@${postit.username}`;
            userEl.style.fontSize = "15px";
            userEl.style.fontWeight = "bold";
            userEl.style.borderBottom = "1px solid #555";
            userEl.style.marginBottom = "10px";
            userEl.style.paddingBottom = "6px";
            postitEl.appendChild(userEl);

            // texte
            const textEl = document.createElement("div");
            textEl.textContent = postit.text;
            textEl.style.fontWeight = "bold";
            textEl.style.fontSize = "24px";
            textEl.style.textAlign = "center";
            textEl.style.fontFamily = "'Caveat', cursive";
            textEl.style.wordBreak = "break-word";//couper les mots trop longs
            textEl.style.overflowWrap = "break-word";
            textEl.style.whiteSpace = "pre-wrap";//garder les retours à la ligne du textarea
            textEl.style.flex = "1";
            postitEl.appendChild(textEl);

            // date
            const dateEl = document.createElement("div");
            dateEl.textContent = new Date(postit.created_at).toLocaleString("fr-FR");
            dateEl.style.borderTop = "1px solid #555";
            dateEl.style.marginTop = "10px";
            dateEl.style.paddingTop = "6px";
            dateEl.style.fontSize = "13px";
            dateEl.style.color = "#555";
            postitEl.appendChild(dateEl);

            // droits
            const isAdmin = currentUser && currentUser.role === "admin";
            const isOwner = currentUser && currentUser.id === postit.user_id;
            const canEdit = currentUser && (currentUser.can_edit === 1 || currentUser.can_edit === true);
            const canDelete = currentUser && (currentUser.can_delete === 1 || currentUser.can_delete === true);

            const canShowEdit = isAdmin || (isOwner && canEdit);
            const canShowDelete = isAdmin || (isOwner && canDelete);

            if (canShowEdit || canShowDelete) {
                const actions = document.createElement("div");
                actions.style.display = "flex";
                actions.style.gap = "10px";
                actions.style.marginTop = "10px";
                actions.style.justifyContent = "center";

                if (canShowEdit) {
                    const editBtn = document.createElement("button");
                    editBtn.textContent = "Modifier";
                    editBtn.style.background = "#4CAF50";
                    editBtn.style.color = "white";
                    editBtn.style.border = "none";
                    editBtn.style.padding = "6px 10px";
                    editBtn.style.cursor = "pointer";
                    editBtn.style.borderRadius = "4px";

                    editBtn.addEventListener("click", async () => {
                        const nouveauTexte = prompt("Modifier le texte du post-it :", postit.text);
                        if (nouveauTexte === null) return;

                        const nouvelleCouleur = prompt("Modifier la couleur (ex: #FFE566) :", postit.color || "#FFE566");
                        if (nouvelleCouleur === null) return;

                        try {
                            const response = await fetch("/modifier", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    id: postit.id,
                                    text: nouveauTexte,
                                    color: nouvelleCouleur
                                })
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                alert(result.error || "Erreur modification");
                                return;
                            }

                            await chargerPostits();
                        } catch (error) {
                            console.error("Erreur modification :", error);
                            alert("Erreur serveur");
                        }
                    });

                    actions.appendChild(editBtn);
                }

                if (canShowDelete) {
                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Supprimer";
                    deleteBtn.style.background = "#d62828";
                    deleteBtn.style.color = "white";
                    deleteBtn.style.border = "none";
                    deleteBtn.style.padding = "6px 10px";
                    deleteBtn.style.cursor = "pointer";
                    deleteBtn.style.borderRadius = "4px";

                    deleteBtn.addEventListener("click", async () => {
                        const confirmation = confirm("Supprimer ce post-it ?");
                        if (!confirmation) return;

                        try {
                            const response = await fetch("/effacer", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ id: postit.id })
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                alert(result.error || "Erreur suppression");
                                return;
                            }

                            await chargerPostits();
                        } catch (error) {
                            console.error("Erreur suppression :", error);
                            alert("Erreur serveur");
                        }
                    });

                    actions.appendChild(deleteBtn);
                }

                postitEl.appendChild(actions);
            }

            mur.appendChild(postitEl);
        });

    } catch (error) {
        console.error("Erreur chargement post-its :", error);
    }
}

async function initialiserMur() {
    await chargerUtilisateur();
    await chargerPostits();
}

//initialiserMur();
document.addEventListener("DOMContentLoaded", async () => {

    // charger utilisateur + postits
    await initialiserMur();

    // logout
    const logout = document.getElementById("logout");
    if (logout) {
        logout.addEventListener("click", async (e) => {
            e.preventDefault();

            await fetch('/logout');

            window.location.href = '/login';
        });
    }

});

// logout
document.addEventListener("DOMContentLoaded", () => {
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            try {
                await fetch("/logout", { method: "GET" }, { credentials: "include" });
                window.location.href = "/login";
            } catch (error) {
                console.error("Erreur logout :", error);
            }
        });
    }
});