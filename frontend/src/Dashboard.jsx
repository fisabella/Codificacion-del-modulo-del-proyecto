import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [form, setForm] = useState({
    nombre: '', cedula: '', telefono: '', medico: '', especialidad: '', numero_orden: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const token = localStorage.getItem('token');

  const fetchPacientes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/pacientes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPacientes(res.data.pacientes);
    } catch {
      setMensaje('Error al cargar pacientes o sesión vencida');
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/pacientes/${editandoId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:3001/pacientes', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setForm({ nombre: '', cedula: '', telefono: '', medico: '', especialidad: '', numero_orden: '' });
      setEditandoId(null);
      fetchPacientes();
    } catch {
      alert('Error al guardar paciente');
    }
  };

  const handleEdit = (paciente) => {
    setForm({
      nombre: paciente.nombre,
      cedula: paciente.cedula,
      telefono: paciente.telefono,
      medico: paciente.medico,
      especialidad: paciente.especialidad,
      numero_orden: paciente.numero_orden
    });
    setEditandoId(paciente.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await axios.delete(`http://localhost:3001/pacientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPacientes();
      } catch {
        alert('Error al eliminar paciente');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="loginPHP-container">
      <div className="form-section">
        <h2>{editandoId ? 'Editar Paciente' : 'Registro de Pacientes'}</h2>
        <form onSubmit={handleSubmit}>
          {['nombre', 'cedula', 'telefono', 'medico', 'especialidad', 'numero_orden'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit">{editandoId ? 'Actualizar' : 'Guardar'}</button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm({ nombre: '', cedula: '', telefono: '', medico: '', especialidad: '', numero_orden: '' });
              }}
            >
              Cancelar edición
            </button>
          )}
        </form>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="list-section">
        <h2>Pacientes Registrados</h2>
        {mensaje && <p className="message-error">{mensaje}</p>}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Médico</th>
                <th>Especialidad</th>
                <th>N° Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cedula}</td>
                  <td>{p.telefono}</td>
                  <td>{p.medico}</td>
                  <td>{p.especialidad}</td>
                  <td>{p.numero_orden}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="delete-btn" onClick={() => handleDelete(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
