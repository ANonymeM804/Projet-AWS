const mur = document.getElementById("mur");
const tableBody = document.getElementById("users-table-body");

// Charger les post-its depuis le serveur
async function chargerUtilisateurs() {
    try {
        const response = await fetch("/admin/users-data", { credentials: "include" } );
        const users = await response.json();

        tableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            // Ajouter les données de l'utilisateur à la ligne
            row.innerHTML = `
                
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>
                    <select class="role-select">
                        <option value="user" ${user.role === "user" ? "selected" : ""}>user</option>
                        <option value="admin" ${user.role === "admin" ? "selected" : ""}>admin</option>
                            ${user.role === "admin" 
                            ? '<span class="badge-admin">ADMIN</span>' 
                            : 'user'}
                    </select>
                </td>
                <td><input type="checkbox" class="create-checkbox" ${user.can_create ? "checked" : ""}></td>
                <td><input type="checkbox" class="edit-checkbox" ${user.can_edit ? "checked" : ""}></td>
                <td><input type="checkbox" class="delete-checkbox" ${user.can_delete ? "checked" : ""}></td>
                <td>${new Date(user.created_at).toLocaleString("fr-FR")}</td>
                <td>
                    <div class="actions">
                        <button class="save-btn">💾 Enregistrer</button>
                        <button class="delete-btn">🗑 Supprimer</button>
                    </div>
                </td>
            `;// Afficher les droits de l'utilisateur et son rôle, avec une indication visuelle pour les admins

            // Protéger les comptes admin contre la suppression et la modification de droits
            if (user.role === "admin") {
                const deleteBtn = row.querySelector(".delete-btn");
                const saveBtn = row.querySelector(".save-btn");

                // Désactiver suppression
                if (deleteBtn) {
                    deleteBtn.disabled = true;
                    deleteBtn.textContent = "Admin protégé";
                }

                // empêcher modification des droits admin
                const checkboxes = row.querySelectorAll("input[type='checkbox']");
                const select = row.querySelector(".role-select");

                checkboxes.forEach(cb => cb.disabled = true);
                if (select) select.disabled = true; 
            }

            // Gestion des événements pour les boutons
            const saveBtn = row.querySelector(".save-btn");
            const deleteBtn = row.querySelector(".delete-btn");

            saveBtn.addEventListener("click", async function () {
                const role = row.querySelector(".role-select").value;
                const can_create = row.querySelector(".create-checkbox").checked;
                const can_edit = row.querySelector(".edit-checkbox").checked;
                const can_delete = row.querySelector(".delete-checkbox").checked;

                try {
                    const response = await fetch(`/admin/users/${user.id}/rights`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        credentials: "include"
                        
                        },
                        body: JSON.stringify({
                            role,
                            can_create,
                            can_edit,
                            can_delete
                        })
                    });

                    const result = await response.json();

                    if (result.success) {
                        //alert("Droits mis à jour avec succès.");
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

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erreur chargement utilisateurs :", error);
    }
}

chargerUtilisateurs();



initialiserMur();

//controle des bouttons
document.addEventListener("DOMContentLoaded", () => {

    //logout
    const logout=this.document.getElementById("logout");
    logout.addEventListener("click",async(e)=>{
            e.preventDefault();
            await fetch('/logout', { method: 'POST' });
            sessionStorage.removeItem('username');
            window.location.href = '/login';
            
        }   );
   

 });