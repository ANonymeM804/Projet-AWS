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



//controle des bouttons
document.addEventListener("DOMContentLoaded", () => {

    const username= sessionStorage.getItem("username");
    if(username){
        const accueil=document.getElementById("accueil");
        accueil.style.display="none";
    }

    
    const creer=document.getElementById("creation");
    if(!username) {
        creer.style.display="none";
    }else
    {    creer.addEventListener("click", (e) => {
            if (!username) {
                e.preventDefault(); // bloque la redirection
                alert("Veiller vous connectr pour créer un post-it");
            }
        });}

    const effacer=document.getElementById("suppression");
    if(!username) {
        effacer.style.display="none";
    }else
    {    effacer.addEventListener("click", (e) => {
            if (!username) {
                e.preventDefault(); // bloque la redirection
                alert("Veiller vous connectr pour créer un post-it");
            }
        });}

    const modifier=document.getElementById("modification");
    if(!username) {
        modifier.style.display="none";
    }else
    {    modifier.addEventListener("click", (e) => {
            if (!username) {
                e.preventDefault(); // bloque la redirection
                alert("Veiller vous connectr pour créer un post-it");
            }
        });}

//logout
    const logout=this.document.getElementById("logout");
    if(!username){
        logout.style.display="none";
    }else
    {    logout.addEventListener("click",async(e)=>{
            e.preventDefault();
            await fetch('/logout', { method: 'POST' });
            sessionStorage.removeItem('user');
            window.location.href = '/login';
            
        }   );}

 });