import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import { useEffect, useState } from 'react';
import './App.css';

function Header() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatoFecha = hora.toLocaleDateString();
  const formatoHora = hora.toLocaleTimeString();

  return (
    <header className="header">
      <h1>Bienvenidos a Salud Médica</h1>
      <div className="datetime">
        <span>{formatoFecha}</span>
        <span>{formatoHora}</span>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      Derechos de autor © Isabel Álvarez
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
