
//const https = require("https");//https pour le serveur sécurisé
//const fs = require("fs");//fs pour lire les fichiers de certificats SSL
const path = require("path");//path pour gérer les chemins de fichiers
const express = require("express");//express pour créer le serveur web
const session = require("express-session");//express-session pour gérer les sessions utilisateur
const app = express();
const helmet = require('helmet');//securite headers, eviter attaque clickjacking
const csurf = require('csurf'); //jeton
const nunjucks = require('nunjucks');

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.use(helmet());


app.use(
   helmet.contentSecurityPolicy({
     directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"], 
      connectSrc: ["'self'"], // pour fetch/AJAX
      objectSrc: ["'none'"],
   }
  })
 );


app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "sticko_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true, // cookie non accessible depuis js
        maxAge: 1000 * 60 * 60, //garder le cookie 1h si il n'est pas supprimé
        sameSite: 'lax'    // Protège contre CSRF
    }
}));

// Middleware
app.use(csurf({
  cookie: false,
  value: (req) => req.headers['csrf-token'] //lire dans le header
}));
app.use(express.json());
app.use(express.static('public', { etag: false }));//ne pas reveler les inodes
app.set('etag', false);

app.disable('x-powered-by');//ne pas reveler qu'on utilise express

// Importation des routes
const accueil = require("./routes/accueil");
const mur_postits = require("./routes/mur_postits");
const signup = require("./routes/signup");
const login = require("./routes/login");
const ajouter = require("./routes/ajouter");
const list = require("./routes/list");
const effacer = require("./routes/effacer");
const modifier = require("./routes/modifier");
const logout = require("./routes/logout");
const guest = require("./routes/guest");
const admin = require("./routes/admin");

// Utilisation des routes
app.use(accueil);
app.use(mur_postits);
app.use(signup);
app.use(login);
app.use(ajouter);
app.use(list);
app.use(modifier);
app.use(effacer);
app.use(logout);
app.use(guest);
app.use(admin);

// Démarrage du serveur HTTPS
/*const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "certs", "server.key")),//lecture de la clé privée
    cert: fs.readFileSync(path.join(__dirname, "certs", "server.cert"))//lecture du certificat SSL
};
https.createServer(sslOptions, app).listen(3001, () => {
    console.log("Serveur HTTPS démarré sur https://localhost:3001");
});*/

// server.js ou app.js
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Token CSRF invalide
    return res.status(403).json({ success: false, error: 'csrf_invalid' });
  }
  next(err);
});

// Démarrage 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});