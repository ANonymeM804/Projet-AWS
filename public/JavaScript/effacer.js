document.addEventListener("DOMContentLoaded", () => {

    const creer=document.getElementById("creation");
    const username= sessionStorage.getItem("username");

    creer.addEventListener("click", (e) => {
        if (!username) {
            e.preventDefault(); // bloque la redirection
            alert("Veiller vous connectr pour créer un post-it");
        }
    });

    const effacer=document.getElementById("suppression");
    effacer.addEventListener("click", (e) => {
        if (!username) {
            e.preventDefault(); // bloque la redirection
            alert("Veiller vous connectr pour créer un post-it");
        }
    });

    const modifier=document.getElementById("modification");

    modifier.addEventListener("click", (e) => {
        if (!username) {
            e.preventDefault(); // bloque la redirection
            alert("Veiller vous connectr pour créer un post-it");
        }
    });

 });