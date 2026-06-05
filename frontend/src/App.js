import React, { useState } from 'react';
import './App.css';

function App() {
  // Estados para Crear Propuesta
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [propuestaId, setPropuestaId] = useState('');

  // Estados para Firmar
  const [dni, setDni] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [totalFirmas, setTotalFirmas] = useState(0);

  // URL de tu Backend
  const API_URL = 'http://localhost:5001/api/v1/propuestas';

  // --- CASO DE USO 1: CREAR PROPUESTA ---
  const handleCrearPropuesta = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/crear?titulo=${titulo}&texto_principal=${texto}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        setPropuestaId(data.propuesta_id);
        setMensaje(`¡Propuesta creada! ID: ${data.propuesta_id}`);
      } else {
        setMensaje(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  // --- CASO DE USO 2: FIRMAR PROPUESTA ---
  const handleFirmar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${propuestaId}/firmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni_ciudadano: dni }) // Pydantic validará que tenga 8 caracteres
      });
      const data = await response.json();

      if (response.ok) {
        setTotalFirmas(data.total_firmas_actuales);
        setMensaje('¡Firma validada y registrada exitosamente!');
        setDni(''); // Limpiamos el input
      } else {
        // El Proxy legal nos devuelve el error (Ej: DNI repetido, plazo vencido)
        setMensaje(`Error Legal: ${data.detail}`);
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Voz del Ciudadano 🇵🇪</h1>

      {/* Alertas de Mensajes */}
      {mensaje && <div style={{ padding: '10px', background: '#e2f0d9', color: '#385723', marginBottom: '20px', borderRadius: '5px' }}>
        <strong>Aviso:</strong> {mensaje}
      </div>}

      {/* --- SECCIÓN 1: CREAR --- */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>1. Crear Iniciativa Legislativa</h2>
        <form onSubmit={handleCrearPropuesta}>
          <input
            type="text" placeholder="Título de la propuesta" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            value={titulo} onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="Texto principal de la ley..." required rows="4" style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            value={texto} onChange={(e) => setTexto(e.target.value)}
          ></textarea>
          <button type="submit" style={{ padding: '10px 20px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Registrar Propuesta
          </button>
        </form>
      </div>

      {/* --- SECCIÓN 2: FIRMAR --- */}
      <div style={{ border: '2px solid #0056b3', padding: '20px', borderRadius: '8px' }}>
        <h2>2. Participación Ciudadana</h2>
        <p><strong>Firmas actuales:</strong> <span style={{ fontSize: '24px', color: '#0056b3' }}>{totalFirmas}</span> / 25000</p>

        <form onSubmit={handleFirmar}>
          <input
            type="text" placeholder="ID de la propuesta" required style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            value={propuestaId} onChange={(e) => setPropuestaId(e.target.value)}
          />
          <input
            type="text" placeholder="Tu DNI (8 dígitos)" required minLength={8} maxLength={8} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            value={dni} onChange={(e) => setDni(e.target.value)}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            Firmar Digitalmente
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;