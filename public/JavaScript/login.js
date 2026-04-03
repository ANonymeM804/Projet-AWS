document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    // Affichage des messages d'erreur de redirection (si jamais)
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const success = params.get("success");

    const csrfToken = document.querySelector('input[name="_csrf"]').value; // récupère le token depuis le hidden input

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

      const response = await fetch('/login', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json',
                   'CSRF-Token': csrfToken 
         },
        body: JSON.stringify({ username, password})
      });

      let data;
      try {
        data = await response.json(); 
      } catch (err) {
        const text = await response.text();
        console.error('Réponse brute du serveur:', text);
        messageDiv.textContent = 'Erreur de connexion (CSRF peut-être invalide)';
        messageDiv.classList.add('error');
        return;
      }

      if (response.ok && data.success) {
        sessionStorage.setItem('username', data.user.username);
        window.location.href = data.redirect || '/mur_postits';
      } else {
        messageDiv.textContent = data.error || 'Nom d\'utilisateur ou mot de passe incorrect.';
        messageDiv.classList.add('error');
      }
    });

  });