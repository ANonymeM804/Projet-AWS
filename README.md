
Description du projet et consignes
Conditions d’achèvement

Le but du projet est de créer une application de post-it sociale. Il s'agit tout simplement d'une liste de messages, écrits par des utilisateurs, placés à des coordonnées quelconques sur la page
Description

Notre application est une collection de messages, composés par des auteurs. Un message a au moins :

    un texte,
    une date et heure,
    des coordonnées x et y dans le plan,
    un auteur.

Ces champs sont reflétés dans une table SQL. Une autre table SQL sera utilisée pour stocker les utilisateurs et leurs mots de passe (et d'éventuelles autres données relatives aux utilisateurs).

L'application est composée de deux vues :

    Une page pour enregistrer un nouvel utilisateur. 
    Une page principale, présentant les post-its, et :
        soit un formulaire de login, si l'utilisateur n'est pas connecté,
        soit un lien de déconnexion, si l'utilisateur est connecté.

La page principale est tout simplement un fond blanc (ou autre couleur), sur lequel sont affichés des post-its créés par les utilisateurs, sous forme d'encadrés jaunes (ou autre).

Lorsque l'utilisateur fait double-clic sur un point quelconque de la page, il a la possibilité de créer un nouveau post-it. Les coordonnées du double-click déterminent l'endroit où le post-it est créé.

Chaque post-it présente son texte, sa date de création, et son auteur. Les post-it plus récents s'affichent par dessus les post-its plus anciens.

Uniquement les utilisateurs connectés ont droit de créer un post-it. Lorsque l'utilisateur fait double-clic n'importe où dans la page, un popup s'ouvre, permettant de donner le texte du post-it. Après validation, une requête est envoyée au serveur et le post-it est inséré dans la base de données. Si l'insertion s'effectue avec succès, le nouveau post-it est affiché dans l'interface.

En plus d'afficher les informations décrites ci-dessus, uniquement pour les post-its créés par l'utilisateur connecté, donner un moyen (bouton, lien, croix, ...) de supprimer le post-it. Demander confirmation avant de supprimer. Lorsque l'utilisateur confirme, envoyer une requête, mettre à jour la base de données, et actualiser l'affichage en cas de succès.

Exemple de découpage en gestionnaires :

    Route / : présentant la page principale.
    Route /signup : permettant de créer un nouvel utilisateur.
    Route /login : permettant de se connecter. Redirige vers / après un login réussi.
    Route /logout : permettant de se déconnecter. Redirige vers / après un logout réussi.
    Route /ajouter : permettant d'ajouter un post-it.
        Si AJAX, renvoie un code de succès/erreur.
        Si non-AJAX, redirige vers / après un ajout réussi.
    Route /effacer : permettant d'éliminer un post-it.
        Si AJAX, renvoie un code de succès/erreur.
        Si non-AJAX, redirige vers / après un ajout réussi.
    Route /liste : renvoyant la liste des post-its au format JSON (ou XML, ou autre), pour un traitement chez le client. Uniquement si AJAX.

Modules supplémentaires (au moins 5 sur 9)

    Ajouter la possibilité de modifier ses propres post-its.

    (Obligatoire en SeCReTS et IRS) Définir quatre niveaux d'accès à l'application : création, modification, effacement, administration. Les administrateurs ont droit de modifier/effacer les post-its de tout le monde. Ajouter une page d'administration, accessible uniquement aux administrateurs, pour donner/enlever ces droits aux utilisateurs.

    Créer un utilisateur spécial guest, qui correspond aux droits des utilisateurs non-connectés.

    Gérer plusieurs tableaux de post-its : dans ce cas, chaque tableau a un identifiant (par exemple toto, et sera accessible à l'adresse http://serveur-postits/toto).

    Gérer le drag 'n drop: les utilisateurs ont droit de déplacer leurs propres post-its. Déplacer un post-it le remet en avant par rapport aux autres.

    Vérifier que votre affichage est adapté à tous les écrans, notamment aux écrans mobiles. Ajouter de la gestion d'évènements tactiles, et tester avec un téléphone ou tablette.

    Utiliser une base de données No-SQL (par exemple MongoDB) à la place de SQL.

    (Obligatoire en parcours SeCReTS et IRS) Configurer https sur le serveur Node.js.

    Faire en sorte qu'à chaque ajout/suppression/modification d'un post-it, tous les navigateurs qui affichent le même tableau soient mis à jour automatiquement.
    
    
Comment faire fonctionner postgre sur son local:

Installer PostgreSQL
	```bash
	sudo apt install postgresql postgresql-contrib
	
installer le driver postgresql pour node: 
	```bash
	npm install pg

Créer un utilisateur et une base PostgreSQL pour le projet
	```bash
	sudo -u postgres psql
	-- Créer un utilisateur
	CREATE USER nom_user WITH PASSWORD 'motdepasse';
	-- Créer une base et donner les droits à l'utilisateur
	CREATE DATABASE nom_db OWNER nom_user;
	GRANT ALL PRIVILEGES ON DATABASE nom_db TO nom_user;

installer dotenv
	```bash
	npm install dotenv
	
Créer un fichier .env à la racine du projet et mettre dedans
	```bash
	DATABASE_URL=postgres://nom_user:motdepasse@localhost:5432/nom_db
	
Lancer les migrations Knex pour créer les tables
	```bash
	npx knex migrate:latest

