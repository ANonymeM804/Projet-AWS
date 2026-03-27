const mur = document.getElementById("mur");
const userInfo = document.getElementById("user-info");
const usersLink = document.getElementById("utilisateurs");
const logoutBtn = document.getElementById("logout");

let currentUser = null;

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
            userInfo.textContent = `Connecté : ${data.username}`;

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

// Charger les post-its
async function chargerPostits() {
    try {
        const response = await fetch("/liste", {
            credentials: "include"
        });

        const postits = await response.json();

        mur.textContent = "";

        postits.forEach(postit => {
            const postitEl = document.createElement("div");
            postitEl.style.display = "flex";
            postitEl.style.flexDirection = "column";
            postitEl.style.justifyContent = "space-between";
            postitEl.className = "postit";

            postitEl.style.left = postit.x + "px";
            postitEl.style.top = postit.y + "px";
            postitEl.style.background = postit.color || "#FFE566";
            postitEl.style.height = "250px";
            postitEl.style.width = "250px";
            postitEl.style.position = "absolute";
            postitEl.style.zIndex = "1";
            postitEl.style.border = "1px solid #000";
            postitEl.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.6)";

            // auteur
            const userEl = document.createElement("div");
            userEl.textContent = postit.username;
            userEl.style.borderBottom = "1px solid #555";
            userEl.style.fontSize = "17px";
            userEl.style.color = "#333";
            userEl.style.margin = "10px";
            postitEl.appendChild(userEl);

            // texte
            const texteEl = document.createElement("div");
            texteEl.textContent = postit.text;
            texteEl.style.fontWeight = "bold";
            texteEl.style.fontSize = "27px";
            texteEl.style.margin = "12px";
            texteEl.style.textAlign = "center";
            texteEl.style.fontFamily = "'Caveat', cursive";
            texteEl.style.wordBreak = "break-word";
            texteEl.style.overflowWrap = "break-word";
            texteEl.style.whiteSpace = "pre-wrap";
            postitEl.appendChild(texteEl);

            // date
            const dateEl = document.createElement("div");
            dateEl.style.borderTop = "1px solid #555";
            dateEl.style.height = "30px";
            dateEl.textContent = new Date(postit.created_at).toLocaleString("fr-FR");
            dateEl.style.fontSize = "17px";
            dateEl.style.color = "#555";
            dateEl.style.margin = "10px";
            postitEl.appendChild(dateEl);

            // droits
            const isAdmin = currentUser && currentUser.role === "admin";
            const isOwner = currentUser && currentUser.id === postit.user_id;
            const canEdit = currentUser && (currentUser.can_edit === 1 || currentUser.can_edit === true);
            const canDelete = currentUser && (currentUser.can_delete === 1 || currentUser.can_delete === true);

            const peutModifier = isAdmin || (isOwner && canEdit);
            const peutSupprimer = isAdmin || (isOwner && canDelete);

            if (peutModifier || peutSupprimer) {
                const actionsEl = document.createElement("div");
                actionsEl.style.display = "flex";
                actionsEl.style.justifyContent = "center";
                actionsEl.style.gap = "8px";
                actionsEl.style.marginBottom = "10px";

                if (peutModifier) {
                    const btnModifier = document.createElement("button");
                    btnModifier.textContent = "Modifier";
                    btnModifier.style.background = "#A8EDCA";
                    btnModifier.style.border = "1px solid #1a1a2e";
                    btnModifier.style.padding = "6px 10px";
                    btnModifier.style.cursor = "pointer";

                    btnModifier.addEventListener("click", async () => {
                        const nouveauTexte = prompt("Modifier le texte :", postit.text);
                        if (nouveauTexte === null) return;

                        const nouvelleCouleur = prompt("Modifier la couleur :", postit.color || "#FFE566");
                        if (nouvelleCouleur === null) return;

                        try {
                            const response = await fetch("/modifier", {
                                method: "POST",
                                credentials: "include",
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
                        }
                    });

                    actionsEl.appendChild(btnModifier);
                }

                if (peutSupprimer) {
                    const btnSupprimer = document.createElement("button");
                    btnSupprimer.textContent = "Supprimer";
                    btnSupprimer.style.background = "#FF8FAB";
                    btnSupprimer.style.border = "1px solid #1a1a2e";
                    btnSupprimer.style.padding = "6px 10px";
                    btnSupprimer.style.cursor = "pointer";

                    btnSupprimer.addEventListener("click", async () => {
                        const confirmation = confirm("Supprimer ce post-it ?");
                        if (!confirmation) return;

                        try {
                            const response = await fetch("/effacer", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    id: postit.id
                                })
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                alert(result.error || "Erreur suppression");
                                return;
                            }

                            await chargerPostits();
                        } catch (error) {
                            console.error("Erreur suppression :", error);
                        }
                    });

                    actionsEl.appendChild(btnSupprimer);
                }

                postitEl.appendChild(actionsEl);
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

document.addEventListener("DOMContentLoaded", async () => {
    await initialiserMur();

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            await fetch("/logout", {
                method: "POST",
                credentials: "include"
            });

            sessionStorage.removeItem("username");
            window.location.href = "/login";
        });
    }
});