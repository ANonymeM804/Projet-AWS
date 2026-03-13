//ecouter apres la creation du document non pas avant
document.addEventListener("DOMContentLoaded", () => { 

  const mur = document.getElementById("mur");//recuperation de l'elem html ou on ajout le post it
  const popup = document.getElementById("popup-postit");//recuperation de la fenetre
  const textarea = document.getElementById("postit-text");//recuperation de la zone de texte

  let x = 0;
  let y = 0;
  let texte = " ";
  let created_at;
  let couleur = "#FFE566"; //la couleur du postit est jaune par defaut
  let username = sessionStorage.getItem("username");

  //ecouter lors du double click
  mur.addEventListener("dblclick", function(event){

     const rect = mur.getBoundingClientRect();

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

    popup.style.display="none"; //cahcer la fenetre 
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
                let date;
                if (data.created_at) {
                     date= new Date(data.created_at.replace(" ", "T"));
                } else date= new Date();

                // Formater pour n’afficher que date + heure
                const dateStr = date.toLocaleDateString('fr-FR');
                const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const dateAffiche = `${dateStr} ${timeStr}`;

                creerPostit(x, y, couleur, texte, username, dateAffiche);
                //redirection
                //window.location.href = "/mur_postits";
              
              })
            .catch(err => console.error("Erreur ajout post-it :", err));

  });


  function creerPostit(x,y,couleur,texte, username, created_at){
        const postit = document.createElement("div");
        postit.style.display = "flex";
        postit.style.flexDirection = "column";
        postit.style.justifyContent = "space-between"; 
        postit.className="postit";
        postit.style.left = x + "px";
        postit.style.top = y + "px";
        postit.style.background = couleur;
        postit.style.height="310px";
        postit.style.width="310px";
        postit.style.position="absolute";
        postit.style.border="1px solid #000";
        postit.style.boxShadow="0 6px 8px rgba(0, 0, 0, 0.6)";
        

        // Ajouter le nom de l'utilisateur
        const userEl = document.createElement("div");
        userEl.textContent = username;
        userEl.style.borderBottom = "1px solid #555";
        userEl.style.fontSize = "12px";
        userEl.style.color = "#333";
        userEl.style.margin="10px";
        postit.appendChild(userEl);

         // Ajouter le texte du post-it
        const texteEl = document.createElement("div");
        texteEl.textContent = texte;
        texteEl.style.fontWeight = "bold";
        texteEl.style.fontSize = "27px";
        texteEl.style.margin="12px";
        texteEl.style.textAlign = "center";
        texteEl.style.fontFamily = "'Caveat', cursive";
        texteEl.style.wordBreak = "break-word"; //couper les mots trop longs
        texteEl.style.overflowWrap = "break-word"; //forcer un retour à la ligne
        texteEl.style.whiteSpace = "pre-wrap"; //garder les retours à la ligne du textarea
        postit.appendChild(texteEl);

        // Ajouter l'heure de création
        const dateEl = document.createElement("div");
        dateEl.style.borderTop = "1px solid #555";
        dateEl.style.height="30px";
        dateEl.textContent = created_at;
        dateEl.style.fontSize = "12px";
        dateEl.style.color = "#555";
        dateEl.style.margin="10px";
        postit.appendChild(dateEl);

        mur.appendChild(postit);

        popup.style.display="none";
        textarea.value="";
  }
  
   //logout
  const logout=this.document.getElementById("logout");
    logout.addEventListener("click",async(e)=>{
        e.preventDefault();
        await fetch('/logout', { method: 'POST' });
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        
    }   );
});