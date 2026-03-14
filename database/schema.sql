-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS postits;
DROP TABLE IF EXISTS users;

-- Table des utilisateurs
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des post-its
CREATE TABLE postits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    color TEXT DEFAULT '#FFE566',
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

