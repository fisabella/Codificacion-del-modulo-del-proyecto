import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE,
    contrasena TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    cedula TEXT,
    telefono TEXT,
    medico TEXT,
    especialidad TEXT,
    numero_orden TEXT
  )`);

  db.run(`INSERT OR IGNORE INTO usuarios (usuario, contrasena) VALUES ('master', '1234')`);
});

db.close(() => {
  console.log("Base de datos inicializada correctamente.");
});
