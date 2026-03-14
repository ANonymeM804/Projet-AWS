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

        // mur.innerHTML = "";
        mur.textContent= "";

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