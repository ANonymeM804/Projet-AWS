
const express = require("express");
const session = require("express-session");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "sticko_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

//variale
var postit_list = {}; 
class postit{
    constructor(id, user_id, text,date){
        this.id=id;
        this.user_id=user_id;
        this.text=text;
        this.date=date;
    }
}

// Routes
const accueil = require("./routes/accueil");
const mur_postits = require("./routes/mur_postits");
const signup = require("./routes/signup");
const login = require("./routes/login");
const ajouter = require("./routes/ajouter");
const list = require("./routes/list");

app.use(accueil);
app.use(mur_postits);
app.use(signup);
app.use(login);
app.use(ajouter);
app.use(list);

// Serveur
app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});