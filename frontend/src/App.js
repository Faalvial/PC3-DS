import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5001/api/v1';

// --- PANTALLA 1: LOGIN ---
const PantallaLogin = ({ setPantalla, setUsuarioLogueado }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, password })
      });
      const data = await res.json();

      if (res.ok) {
        setUsuarioLogueado(data.token);
        setPantalla('HOME');
      } else {
        setMensaje(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMensaje('Error conectando al servidor.');
    }
  };

  return (
    <div className="tarjeta">
      <h2>1. Iniciar Sesión</h2>
      {mensaje && <p className="alerta-error">{mensaje}</p>}
      <form onSubmit={manejarLogin}>
        <input type="text" placeholder="DNI (8 dígitos)" required minLength={8} maxLength={8} value={dni} onChange={(e) => setDni(e.target.value)} />
        <input type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-primario">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <span className="enlace" onClick={() => setPantalla('REGISTRO')}>Regístrate aquí</span></p>
    </div>
  );
};

// --- PANTALLA 2: REGISTRO ---
const PantallaRegistro = ({ setPantalla }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, password })
      });
      const data = await res.json();

      if (res.ok) {
        alert("Registro exitoso. Ahora inicia sesión.");
        setPantalla('LOGIN');
      } else {
        setMensaje(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMensaje('Error conectando al servidor.');
    }
  };

  return (
    <div className="tarjeta">
      <h2>2. Registro de Ciudadano</h2>
      {mensaje && <p className="alerta-error">{mensaje}</p>}
      <form onSubmit={manejarRegistro}>
        <input type="text" placeholder="DNI (8 dígitos)" required minLength={8} maxLength={8} value={dni} onChange={(e) => setDni(e.target.value)} />
        <input type="password" placeholder="Crea una Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-secundario">Registrarme</button>
      </form>
      <p><span className="enlace" onClick={() => setPantalla('LOGIN')}>Volver al Login</span></p>
    </div>
  );
};

// --- PANTALLA 3: HOME / DASHBOARD ---
const PantallaHome = ({ setPantalla, setPropuestaSeleccionada }) => {
  const [propuestas, setPropuestas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarPropuestas = async () => {
      try {
        const res = await fetch(`${API_BASE}/propuestas/listar`);
        if (res.ok) {
          const data = await res.json();
          setPropuestas(data);
        }
      } catch (error) {
        console.error("Error cargando propuestas");
      }
    };
    cargarPropuestas();
  }, []);

  const propuestasFiltradas = propuestas.filter(p =>
    p.titulo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="tarjeta">
      <h2>3. Dashboard de Iniciativas</h2>
      <input
        type="text" placeholder="Buscar propuesta por título..."
        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <button onClick={() => setPantalla('CREAR')} className="btn-primario" style={{ marginBottom: '20px' }}>
        + Crear Nueva Propuesta
      </button>

      <div className="lista-propuestas">
        {propuestasFiltradas.map(p => (
          <div key={p._id} className="item-propuesta">
            <h3>{p.titulo}</h3>
            <p><strong>Firmas:</strong> <span style={{color: '#0056b3'}}>{p.conteo_firmas || 0}</span> / 25000</p>
            <button onClick={() => { setPropuestaSeleccionada(p._id); setPantalla('DETALLES'); }} className="btn-secundario">
              Ver y Firmar
            </button>
          </div>
        ))}
        {propuestasFiltradas.length === 0 && <p>No se encontraron propuestas.</p>}
      </div>
    </div>
  );
};

// --- PANTALLA 4: DETALLES Y FIRMA ---
const PantallaDetalles = ({ setPantalla, propuestaSeleccionada, usuarioLogueado }) => {
  const [propuesta, setPropuesta] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDetalle = async () => {
      const res = await fetch(`${API_BASE}/propuestas/${propuestaSeleccionada}`);
      if (res.ok) setPropuesta(await res.json());
    };
    cargarDetalle();
  }, [propuestaSeleccionada]);

  const manejarFirma = async () => {
    try {
      const res = await fetch(`${API_BASE}/propuestas/${propuestaSeleccionada}/firmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni_ciudadano: usuarioLogueado })
      });
      const data = await res.json();

      if (res.ok) {
        setMensaje('¡Firma validada y registrada exitosamente!');
        setPropuesta({ ...propuesta, conteo_firmas: data.total_firmas_actuales });
      } else {
        setMensaje(`Error Legal: ${data.detail}`);
      }
    } catch (error) {
      setMensaje('Error de conexión.');
    }
  };

  if (!propuesta) return <p>Cargando detalles...</p>;

  return (
    <div className="tarjeta">
      <h2>4. Detalles de la Propuesta</h2>
      <button onClick={() => setPantalla('HOME')} className="btn-texto">← Volver al Dashboard</button>

      <div style={{ background: '#f8f9fa', padding: '15px', marginTop: '15px', borderRadius: '5px' }}>
        <h3>{propuesta.titulo}</h3>
        <p><strong>Estado:</strong> {propuesta.estado}</p>
        <p><strong>Firmas Recolectadas:</strong> {propuesta.conteo_firmas} / 25000</p>
        <hr/>
        <h4>Documento Principal:</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {propuesta.elementos?.[0]?.texto || "Sin texto disponible."}
        </p>
      </div>

      {mensaje && <p className={mensaje.includes('Error') ? 'alerta-error' : 'alerta-exito'}>{mensaje}</p>}

      <button onClick={manejarFirma} className="btn-exito" style={{ marginTop: '20px', width: '100%' }}>
        Firmar Digitalmente como DNI: {usuarioLogueado}
      </button>
    </div>
  );
};

// --- PANTALLA 5: CREACIÓN ---
const PantallaCrear = ({ setPantalla }) => {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarCreacion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/propuestas/crear?titulo=${encodeURIComponent(titulo)}&texto_principal=${encodeURIComponent(texto)}`, {
        method: 'POST',
      });

      if (res.ok) {
        alert("Propuesta creada con éxito.");
        setPantalla('HOME');
      } else {
        const data = await res.json();
        setMensaje(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMensaje('Error conectando al servidor.');
    }
  };

  return (
    <div className="tarjeta">
      <h2>5. Redactar Iniciativa Legislativa</h2>
      <button onClick={() => setPantalla('HOME')} className="btn-texto">← Volver al Dashboard</button>
      {mensaje && <p className="alerta-error">{mensaje}</p>}

      <form onSubmit={manejarCreacion} style={{ marginTop: '20px' }}>
        <input type="text" placeholder="Título de la Ley" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <textarea placeholder="Redacta los artículos de la ley aquí..." required rows="6" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <button type="submit" className="btn-primario" style={{ width: '100%' }}>Publicar Propuesta</button>
      </form>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [pantallaActual, setPantallaActual] = useState('LOGIN');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [propuestaSeleccionada, setPropuestaSeleccionada] = useState(null);

  const renderizarPantalla = () => {
    switch (pantallaActual) {
      case 'LOGIN': return <PantallaLogin setPantalla={setPantallaActual} setUsuarioLogueado={setUsuarioLogueado} />;
      case 'REGISTRO': return <PantallaRegistro setPantalla={setPantallaActual} />;
      case 'HOME': return <PantallaHome setPantalla={setPantallaActual} setPropuestaSeleccionada={setPropuestaSeleccionada} />;
      case 'DETALLES': return <PantallaDetalles setPantalla={setPantallaActual} propuestaSeleccionada={propuestaSeleccionada} usuarioLogueado={usuarioLogueado} />;
      case 'CREAR': return <PantallaCrear setPantalla={setPantallaActual} />;
      default: return <PantallaLogin setPantalla={setPantallaActual} setUsuarioLogueado={setUsuarioLogueado} />;
    }
  };

  return (
    <div className="contenedor-app">
      <header className="cabecera">
        <h1>Voz del Ciudadano 🇵🇪</h1>
        {usuarioLogueado && <span className="estado-sesion">Sesión: DNI {usuarioLogueado} <button onClick={() => {setUsuarioLogueado(null); setPantallaActual('LOGIN')}} className="btn-texto">Salir</button></span>}
      </header>
      {renderizarPantalla()}
    </div>
  );
}

export default App;