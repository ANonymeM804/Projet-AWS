const express=require("express");
const app= express();

const accueil=require("./routes/accueil");
const mur_postits=require("./routes/mur_postits");
const signup=require("./routes/signup");
const login=require("./routes/login");


app.use(accueil);
app.use(mur_postits);
app.use(signup);
app.use(login);


app.listen(3000,()=>{console.log( "serveur démaré sur http://localhost:3000")});