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
        usuario, contrasena,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      } else {
        setError('Credenciales inválidas');
      }
    } catch {
      setError('Error de servidor');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={e => setContrasena(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
