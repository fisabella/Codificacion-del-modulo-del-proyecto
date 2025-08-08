import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', {
        usuario,
        contrasena,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard'; 
      } else {
        setError('CONTRASEÑA O USURIO INCORRECTOS');
      }
    } catch {
      setError("CONTRASEÑA O USURIO INCORRECTOS ");
    }
  };

  return (
    <div className="loginPHP-container">
      <div className="form-section">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
        {error && <p className="message-error">{error}</p>}
      </div>
    </div>
  );
}
