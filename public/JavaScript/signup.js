

  const form = document.getElementById('signupForm');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const message = document.getElementById('message');

  // Lire les erreurs venant du serveur
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  if (error === "username") {
    message.textContent = "Ce nom d'utilisateur existe déjà.";
    message.classList.add("error");
  }

  if (error === "missing") {
    message.textContent = "Tous les champs sont obligatoires.";
    message.classList.add("error");
  }

  if (error === "password") {
    message.textContent = "Les mots de passe ne correspondent pas.";
    message.classList.add("error");
  }

  // Vérification côté navigateur avant envoi
  form.addEventListener('submit', function (e) {
    message.textContent = '';
    message.className = 'message';

    if (password.value !== confirmPassword.value) {
      e.preventDefault();
      message.textContent = 'Les mots de passe ne correspondent pas.';
      message.classList.add('error');
      return;
    }

    if (password.value.length < 8) {
      e.preventDefault();
      message.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
      message.classList.add('error');
    }
  });