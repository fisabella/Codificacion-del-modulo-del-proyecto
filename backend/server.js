import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3001;
const SECRET = 'supersecreto';

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('data.db');

app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  db.get(`SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?`,
    [usuario, contrasena],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Error interno' });
      if (row) {
        const token = jwt.sign({ usuario }, SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
      } else {
        res.json({ success: false });
      }
    });
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No autorizado' });

  try {
    const token = auth.split(' ')[1];
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

app.get('/dashboard', authMiddleware, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, SECRET);
  res.json({ mensaje: `Bienvenido ${decoded.usuario}` });
});

app.post('/pacientes', authMiddleware, (req, res) => {
  const { nombre, cedula, telefono, medico, especialidad, numero_orden } = req.body;
  db.run(
    `INSERT INTO pacientes (nombre, cedula, telefono, medico, especialidad, numero_orden)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, cedula, telefono, medico, especialidad, numero_orden],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar paciente' });
      res.json({ success: true });
    }
  );
});

app.get('/pacientes', authMiddleware, (req, res) => {
  db.all(`SELECT * FROM pacientes`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener pacientes' });
    res.json({ pacientes: rows });
  });
});

app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
