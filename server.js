const express=require("express");
const app= express();

const accueil=require("./routes/accueil");
app.use(accueil);

app.listen(3000,()=>{console.log( "serveur démaré sur http://localhost:3000")});