
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    // Affichage des messages d'erreur de redirection (si jamais)
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const success = params.get("success");

    if (error === "missing") {
      messageDiv.textContent = "Tous les champs sont obligatoires.";
      messageDiv.classList.add("error");
    } else if (error === "invalid") {
      messageDiv.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
      messageDiv.classList.add("error");
    } else if (success === "signup") {
      messageDiv.textContent = "Compte créé avec succès. Vous pouvez maintenant vous connecter.";
      messageDiv.classList.add("success");
    }

    // Interception du formulaire avec fetch
    form.addEventListener('submit', async function(e) {
      e.preventDefault(); // Empêche la soumission classique

      // Réinitialiser le message
      messageDiv.textContent = '';
      messageDiv.className = 'message';

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // Validations côté client
      if (!username || !password) {
        messageDiv.textContent = 'Tous les champs sont obligatoires.';
        messageDiv.classList.add('error');
        return;
      }
      if (password.length < 8) {
        messageDiv.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
        messageDiv.classList.add('error');
        return;
      }

      try {
        const response = await fetch('/login', {
          method: 'POST',
          credentials: "include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Stocker le username dans sessionStorage
          sessionStorage.setItem('username', data.user.username);
          // Rediriger vers le mur
          window.location.href = data.redirect || '/mur_postits';
        } else {
          // Gérer les erreurs (ex: identifiants incorrects)
          messageDiv.textContent = data.error || 'Nom d\'utilisateur ou mot de passe incorrect.';
          messageDiv.classList.add('error');
        }
      } catch (err) {
        console.error('Erreur réseau :', err);
        messageDiv.textContent = 'Erreur de connexion au serveur.';
        messageDiv.classList.add('error');
      }
    });