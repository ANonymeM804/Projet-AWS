const mur = document.getElementById("mur");
const userInfo = document.getElementById("user-info");

async function chargerUtilisateur() {
    try {
        const response = await fetch("/session-user");
        const data = await response.json();

        if (data && data.user && data.user.username) {
            userInfo.textContent = `Connecté : ${data.user.username}`;
        } else {
            userInfo.textContent = "Utilisateur non connecté";
        }
    } catch (error) {
        console.error("Erreur utilisateur :", error);
        userInfo.textContent = "Erreur utilisateur";
    }
}
async function initialiserMur() {
    await chargerUtilisateur();
}

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