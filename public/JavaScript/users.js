const tableBody = document.getElementById("usersTableBody");
const template = document.getElementById("userRowTemplate");
let csrfToken; 

async function chargerUtilisateurs() {
    try {
        const response = await fetch("/admin/users-data", {
            credentials: "include"
        });

        const users = await response.json();

        tableBody.innerHTML = "";

        users.forEach(user => {
            const clone = template.content.cloneNode(true);

            clone.querySelector(".id").textContent = user.id;
            clone.querySelector(".username").textContent = user.username;
            clone.querySelector(".created-at").textContent =
                new Date(user.created_at).toLocaleString("fr-FR");

            const roleSelect = clone.querySelector(".role-select");
            const createCheckbox = clone.querySelector(".create-checkbox");
            const editCheckbox = clone.querySelector(".edit-checkbox");
            const deleteCheckbox = clone.querySelector(".delete-checkbox");
            const saveBtn = clone.querySelector(".save-btn");
            const deleteBtn = clone.querySelector(".delete-btn");

            roleSelect.value = user.role;
            createCheckbox.checked = user.can_create;
            editCheckbox.checked = user.can_edit;
            deleteCheckbox.checked = user.can_delete;

            // Protéger les admins
            if (user.role === "admin") {
                roleSelect.disabled = true;
                createCheckbox.disabled = true;
                editCheckbox.disabled = true;
                deleteCheckbox.disabled = true;

                saveBtn.disabled = true;
                deleteBtn.disabled = true;

                saveBtn.textContent = "🔒 Protégé";
                deleteBtn.textContent = "🔒 Protégé";
            } else {
                saveBtn.addEventListener("click", async function () {
                    const role = roleSelect.value;
                    const can_create = createCheckbox.checked;
                    const can_edit = editCheckbox.checked;
                    const can_delete = deleteCheckbox.checked;

                    try {
                        const response = await fetch(`/admin/users/${user.id}/rights`, {
                            method: "POST",
                            credentials: "include",
                            headers: {'Content-Type': "application/json",
                                      'CSRF-Token': csrfToken },
                            body: JSON.stringify({
                                role,
                                can_create,
                                can_edit,
                                can_delete
                            })
                        });

                        const result = await response.json();

                        if (result.success) {
                            const msg = document.createElement("div");
                            msg.textContent = "✔ Modifié avec succès";
                            msg.style.color = "green";
                            document.body.appendChild(msg);
                            setTimeout(() => msg.remove(), 2000);

                            await chargerUtilisateurs();
                        } else {
                            alert(result.error || "Erreur lors de la mise à jour.");
                        }
                    } catch (error) {
                        console.error("Erreur update droits :", error);
                        alert("Erreur serveur.");
                    }
                });

                deleteBtn.addEventListener("click", async function () {
                    const confirmation = confirm(`Supprimer l'utilisateur ${user.username} ?`);
                    if (!confirmation) return;

                    try {
                        const response = await fetch(`/admin/users/${user.id}/delete`, {
                            method: "POST",
                            headers: {'CSRF-Token': csrfToken },
                            credentials: "include"

                        });

                        const result = await response.json();

                        if (result.success) {
                            alert("Utilisateur supprimé avec succès.");
                            await chargerUtilisateurs();
                        } else {
                            alert(result.error || "Erreur lors de la suppression.");
                        }
                    } catch (error) {
                        console.error("Erreur suppression utilisateur :", error);
                        alert("Erreur serveur.");
                    }
                });
            }

            tableBody.appendChild(clone);
        });
    } catch (error) {
        console.error("Erreur chargement utilisateurs :", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    csrfToken = document.querySelector('input[name="_csrf"]').value; // récupère le token depuis le hidden input

    chargerUtilisateurs();


    const logout = document.getElementById("logout");

    if (logout) {
        logout.addEventListener("click", async (e) => {
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