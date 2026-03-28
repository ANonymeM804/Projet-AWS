const mur = document.getElementById("mur");
const userInfo = document.getElementById("user-info");
const usersLink = document.getElementById("utilisateurs");
const logoutBtn = document.getElementById("logout");



let currentUser = null;// Variable globale pour stocker les informations de l'utilisateur connecté

// Charger l'utilisateur connecté
async function chargerUtilisateur() {
    try {
        const response = await fetch("/session-user", {
            credentials: "include"//ajout de credentials pour inclure les cookies de session
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
        const response = await fetch("/liste");
        const postits = await response.json();

        mur.textContent= "";

        postits.forEach(postit => {
            const postitEl = document.createElement("div");
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
            

            // Ajouter le nom de l'utilisateur
            const userEl = document.createElement("div");
            userEl.textContent = postit.username;
            userEl.style.borderBottom = "1px solid #555";
            userEl.style.fontSize = "17px";
            userEl.style.color = "#333";
            userEl.style.margin="10px";
            postitEl.appendChild(userEl);

            // Ajouter le texte du post-it
            const texteEl = document.createElement("div");
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
            dateEl.textContent = postit.created_at;
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

//ecouter apres la creation du document non pas avant
document.addEventListener("DOMContentLoaded", () => { 

  const mur = document.getElementById("mur");//recuperation de l'elem html ou on ajout le post it
  const popup = document.getElementById("popup-postit");//recuperation de la fenetre
  const textarea = document.getElementById("postit-text");//recuperation de la zone de texte

  let x = 0;
  let y = 0;
  let texte = " ";
  let couleur = "#FFE566"; //la couleur du postit est jaune par defaut

  //ecouter lors du double click
  mur.addEventListener("dblclick", function(event){

     const rect = mur.getBoundingClientRect(); //retourne la position

    //recuperation des position dans le mur et non pas dans l'ecran
      x=event.clientX -rect.left;
      y=event.clientY -rect.top;

      popup.style.display="flex"; //afficher le pop
      textarea.focus();  //mettre le curseur dans le champs de texte
  });

  document.querySelectorAll(".color").forEach(c => { //recuperer les couleurs 

      c.addEventListener("click", ()=>{ //si un click est survenu sur une des couleurs dans c'est elle qui est choisie
          couleur = c.dataset.color;
      });
  });

  document.getElementById("annuler").addEventListener("click", ()=>{

    popup.style.display="none"; //cacher la fenetre 
    textarea.value="";

  });

  document.getElementById("coller").addEventListener("click", ()=>{

       texte = textarea.value.trim();
       if(!texte) return;
      
      //envoyer le postit au serveur
        fetch("/ajouter",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({text: texte, x: x, y: y, color: couleur}) // user_id à récupérer de la session
            }) 
            .then(res => res.json())
            .then(data => {
                console.log("Post-it ajouté");
                window.location.href = "/mur_postits";
              
              })
            .catch(err => console.error("Erreur ajout post-it :", err));

  });



//logout
const logout=this.document.getElementById("logout");
     logout.addEventListener("click",async(e)=>{
            e.preventDefault();
            await fetch('/logout', { method: 'POST' });
            sessionStorage.removeItem('username');
            window.location.href = '/login';
            
        }  );

});