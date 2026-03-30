const mur = document.getElementById("mur");
const userInfo = document.getElementById("user-info");
const usersLink = document.getElementById("utilisateurs");
const logoutBtn = document.getElementById("logout");

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
            userInfo.textContent = `👤 Connecté : ${data.username}`;

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

async function chargerPostits() {
    try {
        const response = await fetch("/User_postit_liste");
        const postits = await response.json();

        mur.textContent= "";

        postits.forEach(postit => {

            //div postit
            const postitEl = document.createElement("div");

            console.log(postit);

            postitEl.dataset.id = postit.id;
            postitEl.dataset.text=postit.text;
            postitEl.dataset.color=postit.color;

            postitEl.style.display = "flex";
            postitEl.style.flexDirection = "column";
            postitEl.style.justifyContent = "space-between"; 
            postitEl.className="postit";
            postitEl.style.left = postit.x+ "px";
            postitEl.style.top = postit.y + "px";
            postitEl.style.background = postit.color;
            postitEl.style.height="250px";
            postitEl.style.width="250px";
            postitEl.style.position="absolute";
            postitEl.style.zIndex="1";
            postitEl.style.border="1px solid #000";
            postitEl.style.boxShadow="0 6px 8px rgba(0, 0, 0, 0.6)";

            //l'entete
            const headerEl = document.createElement("div");
            headerEl.style.display = "flex";
            headerEl.style.justifyContent = "space-between"; 
            headerEl.style.alignItems = "center";
            headerEl.style.marginLeft="5px";
            headerEl.style.marginRight="5px";
            headerEl.style.marginTop="10px";
            headerEl.style.borderBottom = "1px solid #555";


            // Ajouter le nom de l'utilisateur
            const userEl = document.createElement("div");
            userEl.textContent = postit.username;
            userEl.style.fontSize = "17px";
            userEl.style.color = "#333";
            headerEl.appendChild(userEl);

            //Ajouter boutton de modification
            const modifEl=document.createElement("img");
            modifEl.className="modifier-img";
            modifEl.src="./ressources/modifier.png";
            modifEl.alt = "Modifier"; 
            modifEl.style.background = "transparent";
            modifEl.style.width="21px";
            modifEl.style.border="none";
            modifEl.style.marginBottom="2px";
            modifEl.style.fontSize="16px";
            headerEl.appendChild(modifEl);
            postitEl.appendChild(headerEl);

            // Ajouter le texte du post-it
            const texteEl = document.createElement("div");
            texteEl.className=""
            texteEl.textContent = postit.text;
            texteEl.style.fontWeight = "bold";
            texteEl.style.fontSize = "27px";
            texteEl.style.margin="12px";
            texteEl.style.textAlign = "center";
            texteEl.style.fontFamily = "'Caveat', cursive";
            texteEl.style.wordBreak = "break-word"; //couper les mots trop longs
            texteEl.style.overflowWrap = "break-word"; //forcer un retour à la ligne
            texteEl.style.whiteSpace = "pre-wrap"; //garder les retours à la ligne du textarea
            postitEl.appendChild(texteEl);

            // Ajouter l'heure de création
            const dateEl = document.createElement("div");
            dateEl.style.borderTop = "1px solid #555";
            dateEl.style.height="30px";

            if(postit.modified === 1) {
                if(postit.modified_by === postit.username){dateEl.textContent = "modifié le : " + postit.modified_at }
                else {dateEl.textContent = "modifié le : " +postit.modified_at + " par " +  postit.modified_by;}
            }
            else {dateEl.textContent = postit.created_at;}
            
            dateEl.style.fontSize = "17px";
            dateEl.style.color = "#555";
            dateEl.style.margin="10px";
            postitEl.appendChild(dateEl);

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

initialiserMur();

document.addEventListener("DOMContentLoaded", () => {

    //controle des bouttons de chaque postit

    const mur = document.getElementById("mur");
    const textarea = document.getElementById("postit-text");
    let postit_id="";
    let couleur = "#FFE566";

    mur.addEventListener("click", (event) => {
        if (event.target.classList.contains("modifier-img")) {

            const popup = document.getElementById("popup-postit");
            const postit = event.target.closest(".postit");

            //recuperer la couleur du postit
            couleur=postit.dataset.color;

            //recuperer le text du postit dans le champs de text
            textarea.value=postit.dataset.text;

            //recuperer l'id du postit
            postit_id= postit.dataset.id;
            popup.style.display = "flex";

            //annuler la modification
            document.getElementById("annuler").addEventListener("click", ()=>{
                popup.style.display="none"; //cacher la fenetre 
            });

            //recuperer les couleurs 
            document.querySelectorAll(".color").forEach(c => { 
                c.addEventListener("click", ()=>{ //si un click est survenu sur une des couleurs dans c'est elle qui est choisie
                    couleur = c.dataset.color;
                });
            });

    

            //confirmer la modification
            document.getElementById("coller").addEventListener("click", ()=>{

                const texte = textarea.value;

                //envoyer le postit au serveur
                fetch("/modifier",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body:JSON.stringify({id: postit_id, text: texte, color: couleur, modified_by: currentUser.username}) 
                    }) 
                    .then(res => res.json())
                    .then(data => {
                        console.log("Post-it modifié");
                        window.location.href = "/mur_postits";
                    
                    })
                    .catch(err => console.error("Erreur modification post-it :", err));
                        

            });


      }
    });

    

    //logout
    const logout=this.document.getElementById("logout");
      logout.addEventListener("click",async(e)=>{
            e.preventDefault();
            await fetch('/logout', { method: 'POST' });
            sessionStorage.removeItem('username');
            window.location.href = '/login';
            
        }   );
    

 });
