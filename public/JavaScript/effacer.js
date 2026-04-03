//affichage postits
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

        //console.log("SESSION USER =", data);

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

// Charger les post-its
async function chargerPostits() {
    try {
        const response = await fetch("/User_postit_liste");
        const postits = await response.json();
        mur.textContent= "";

        postits.forEach(postit => {

            //div postit
            const postitEl = document.createElement("div");

            postitEl.dataset.id = postit.id;
            postitEl.dataset.x = postit.x;
            postitEl.dataset.y = postit.y;
            postitEl.dataset.zindex= postit.zindex;

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
            postitEl.style.zIndex=postit.zindex;
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

            //Ajouter boutton de suppression
            const suppEl=document.createElement("img");
            suppEl.className="effacer-img";
            suppEl.src="./ressources/corbeille.png";
            suppEl.alt = "Supprimer"; 
            suppEl.style.background = "transparent";
            suppEl.style.width="23px";
            suppEl.style.border="none";
            suppEl.style.borderRadius="50%";
            suppEl.style.fontSize="16px";
            headerEl.appendChild(suppEl);

            postitEl.appendChild(headerEl);

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
            
            if(postit.modified ) {dateEl.textContent = "modifié le : " +new Date(postit.modified_at).toLocaleString() + " par " +  postit.modified_by;}
            else {dateEl.textContent = new Date(postit.created_at).toLocaleString();}


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
//initialiser mur postits
initialiserMur();


document.addEventListener("DOMContentLoaded", () => {

    const csrfToken = document.querySelector('input[name="_csrf"]').value; // récupère le token depuis le hidden input

    //controle des bouttons de chaque postit
    const mur = document.getElementById("mur");

    //effacer
    mur.addEventListener("click", (event) => {
        if (event.target.classList.contains("effacer-img")) {

            const popup = document.getElementById("popup-supprimer");
            const postit = event.target.closest(".postit");

            //recuperer l'id du postit
            const postit_id= postit.dataset.id;
            popup.style.display = "flex";

            //annuler la suppression
            document.getElementById("annuler").addEventListener("click", ()=>{
            popup.style.display="none"; //cacher la fenetre 
            });

            //confirmer la suppression
            document.getElementById("supprimer").addEventListener("click", ()=>{

                //envoyer le postit au serveur
                    fetch("/effacer",{
                        method: "POST",
                        headers: {'Content-Type': "application/json",
                                  'CSRF-Token': csrfToken},
                        body:JSON.stringify({id: postit_id})
                        }) 
                        .then(res => res.json())
                        .then(data => {
                            console.log("Post-it supprime");
                            popup.style.display = "none";
                            window.location.href = "/mur_postits";
                        
                        })
                        .catch(err => console.error("Erreur suppression post-it :", err));
                        

            });


        }
    });
    

    //deplacer postit
    mur.addEventListener("mousedown", function(elem){

        //seulement si on clique sur un postit
        const postit=elem.target.closest(".postit");
        if (!postit) return; //si on appuit sur un elem qui n'est pas postit

        //recuperer la position actuelle du postit
        const x=parseInt(postit.dataset.x);
        const y=parseInt(postit.dataset.y);

        postit.style.zIndex= postit.dataset.zindex +1; 

        //nouvelle position du postit
        let newX, newY;

        //calcul des offsets
        const offsetX= elem.clientX - x;
        const offsetY= elem.clientY - y;

        //au deplacement
        function onMouseMove(elemMov){
            newX=parseInt(elemMov.clientX )- offsetX;
            newY=parseInt(elemMov.clientY )- offsetY;

            postit.style.left= newX +"px";
            postit.style.top= newY +"px";  

            
        }
        
        //au relachement
        function onMouseUp(){
            document.removeEventListener("mousemove",onMouseMove);
            document.removeEventListener("mouseup",onMouseUp);
            
            if(newX && newY){
                //envoyer les nouvelles coordonnées au serveur
                fetch("/deplacement",{
                        method: "POST",
                        headers: {'Content-Type': "application/json",
                                  'CSRF-Token': csrfToken},
                        body:JSON.stringify({id: postit.dataset.id, x: newX, y: newY}) 
                        }) 
                        .then(res => res.json())
                        .then(data => {
                            console.log("Post-it deplacé");
                            window.location.href = "/effacer";
                        
                        })
                        .catch(err => console.error("Erreur modification post-it :", err));
                    }
                        
            
        }

        
        document.addEventListener("mousemove",onMouseMove);
        document.addEventListener("mouseup",onMouseUp);

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

