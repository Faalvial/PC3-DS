# 🏛️ Plataforma "Voz del Ciudadano"

## 📋 Descripción del Proyecto

**Voz del Ciudadano** es una plataforma digital que permite a los ciudadanos proponer iniciativas legislativas y reunir firmas digitales para validarlas constitucionalmente.

### Características Principales
✅ Autenticación segura con DNI y contraseña (bcrypt)  
✅ Crear y gestionar propuestas legislativas  
✅ Firmar digitalmente propuestas con validación de 90 días  
✅ Cierre automático al alcanzar 25,000 firmas  
✅ Generación criptográfica de sello SHA-256  
✅ Interfaz React intuitiva (5 pantallas)  
✅ Backend con arquitectura limpia (4 patrones de diseño)  

---

## 🛠️ Requisitos Previos

### Para el Backend (Python)
- **Python** ≥ 3.8
- **pip** (gestor de paquetes de Python)
- **MongoDB Atlas** (cuenta gratuita en [mongodb.com](https://www.mongodb.com))

### Para el Frontend (React)
- **Node.js** ≥ 16.x
- **npm** o **yarn** (gestor de paquetes de Node)

### Herramientas Opcionales
- **Postman** o **Insomnia** para probar endpoints
- **VS Code** recomendado

---

## 📦 Instalación

### 1️⃣ Clonar o Descargar el Proyecto

```bash
# Si está en GitHub
git clone <url-del-repositorio>
cd PC3final

# O navega a la carpeta ya descargada
cd c:\Users\USER\Desktop\PC3final
```

### 2️⃣ Configurar Backend (Python)

#### Paso A: Instalar Dependencias

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar paquetes
pip install -r requirements.txt
```

#### Paso B: Crear Archivo .env

En la carpeta `backend/`, crea un archivo `.env` con tu configuración de MongoDB:

```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
PORT=5001
```

**¿Cómo obtener `MONGO_URI`?**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster (M0 gratuito)
4. En "Connect" → "Connect your application" → Copia el connection string
5. Reemplaza `<username>` y `<password>` con tus credenciales
6. Pega en el `.env`

#### Paso C: Ejecutar Backend

```bash
# Desde la carpeta backend/
uvicorn app.main:app --reload --host 0.0.0.0 --port 5001
```

**Salida esperada:**
```
INFO:     Uvicorn running on http://0.0.0.0:5001
INFO:     Application startup complete
Conexión exitosa a MongoDB Atlas.
```

✅ Backend listo en: **http://localhost:5001**

---

### 3️⃣ Configurar Frontend (React)

#### Paso A: Instalar Dependencias

```bash
cd frontend

# Instalar paquetes
npm install
```

#### Paso B: Ejecutar Frontend

```bash
# Desde la carpeta frontend/
npm start
```

**Salida esperada:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

✅ Frontend listo en: **http://localhost:3000**

---

## 🚀 Ejecución Completa (Opción Rápida)

Si tienes ambos entornos configurados:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # (Windows) o source venv/bin/activate (Mac/Linux)
uvicorn app.main:app --reload --port 5001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Resultado:**
- Backend corriendo en: **http://localhost:5001**
- Frontend corriendo en: **http://localhost:3000**
- CORS habilitado para comunicación entre ellos ✅

---

## 📱 Flujo de Uso

### Pantalla 1️⃣: Login
```
┌──────────────────────┐
│ Iniciar Sesión       │
│                      │
│ DNI: [________]      │
│ Contraseña: [____]   │
│ [Ingresar]           │
│                      │
│ ¿Sin cuenta?         │
│ Regístrate aquí      │
└──────────────────────┘
```
- Ingresa tu DNI (8 dígitos) y contraseña
- Si no tienes cuenta, haz clic en "Regístrate aquí"

### Pantalla 2️⃣: Registro
```
┌──────────────────────┐
│ Crear Nueva Cuenta   │
│                      │
│ DNI: [________]      │
│ Contraseña: [____]   │
│ [Crear Cuenta]       │
└──────────────────────┘
```
- DNI debe tener exactamente 8 dígitos
- La contraseña se encripta automáticamente
- Serás redirigido al login después de registrarte

### Pantalla 3️⃣: Dashboard
```
┌──────────────────────────────────┐
│ 📊 Dashboard                     │
│ Propuestas Activas               │
│                                  │
│ [Crear Nueva Propuesta]          │
│                                  │
│ Propuesta 1: 1,250 firmas        │
│ Propuesta 2: 890 firmas          │
│ Propuesta 3: 450 firmas          │
│ (Ordenadas por firmas ↓)         │
└──────────────────────────────────┘
```
- Lista todas las propuestas activas
- Ordenadas por cantidad de firmas (mayor a menor)

### Pantalla 4️⃣: Crear Propuesta
```
┌──────────────────────────────────┐
│ ✏️ Nueva Iniciativa Legislativa   │
│                                  │
│ Título: [_______________]        │
│                                  │
│ Redacción:                       │
│ [                              ] │
│ [                              ] │
│ [                              ] │
│                                  │
│ [Enviar Propuesta]               │
└──────────────────────────────────┘
```
- Ingresa título + redacción completa
- Mínimo 50 caracteres en el texto
- Se crea con 0 firmas y estado "ACTIVA"

### Pantalla 5️⃣: Detalles de Propuesta
```
┌──────────────────────────────────┐
│ Propuesta: "Reforma Tributaria"  │
│ Estado: 🟢 ACTIVA                │
│ Firmas: 15,234 / 25,000 (60%)   │
│                                  │
│ Contenido: "Art. 1..."           │
│ Plazo restante: 42 días          │
│                                  │
│ [🖊️ Firmar Digitalmente]          │
│ [Volver]                         │
└──────────────────────────────────┘
```
- Visualiza detalles de la propuesta
- Haz clic en "Firmar Digitalmente" para añadir tu firma
- Tu DNI se valida automáticamente

---

## 🔌 Endpoints API

### Autenticación

```
POST /api/v1/usuarios/registro
Body: { "dni": "12345678", "password": "micontraseña" }
Response: { "mensaje": "Registro exitoso EN LA NUBE" }

POST /api/v1/usuarios/login
Body: { "dni": "12345678", "password": "micontraseña" }
Response: { "mensaje": "Login exitoso", "token": "12345678" }
```

### Propuestas

```
POST /api/v1/propuestas/crear
Params: titulo, texto_principal
Response: { "mensaje": "...", "propuesta_id": "ObjectId" }

GET /api/v1/propuestas/listar
Response: [ { "_id": "...", "titulo": "...", "conteo_firmas": 123, ... } ]

GET /api/v1/propuestas/{propuesta_id}
Response: { "_id": "...", "titulo": "...", "elementos": [ ... ] }
```

### Firmas

```
POST /api/v1/firmas/{propuesta_id}/firmar
Body: { "dni_ciudadano": "12345678" }
Response: { "mensaje": "Firma registrada...", "total_firmas_actuales": 1500 }
```

---

## 📁 Estructura del Proyecto

```
PC3final/
│
├── backend/
│   ├── requirements.txt          # Dependencias Python
│   ├── .env                      # Configuración (NO VERSIONABLE)
│   │
│   └── app/
│       ├── main.py               # Punto de entrada FastAPI
│       │
│       ├── core/
│       │   ├── config.py         # Configuración centralizada
│       │   └── db.py             # Conexión MongoDB
│       │
│       └── dominios/
│           ├── usuarios/
│           │   └── rutas.py      # Endpoints login/registro
│           │
│           ├── propuestas/
│           │   ├── rutas.py      # Endpoints CRUD propuestas
│           │   └── composite.py  # Patrón Composite
│           │
│           ├── firmas/
│           │   ├── rutas.py      # Endpoints firma digital
│           │   ├── modelos.py    # Modelos Pydantic
│           │   └── proxy.py      # Patrón Proxy (validaciones)
│           │
│           └── cierre_legal/
│               ├── fachada.py    # Patrón Facade (orquestación)
│               └── decorator.py  # Patrón Decorator (inmutabilidad)
│
├── frontend/
│   ├── package.json              # Dependencias Node.js
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── App.js                # 5 Pantallas React
│       ├── App.css               # Estilos
│       └── index.js              # Punto de entrada
│
├── README.md                      # Este archivo
└── SRS.md                         # Especificación de requisitos
```

---

## 🔐 Seguridad

✅ **Contraseñas:** Encriptadas con bcrypt (factor ≥ 10)  
✅ **DNI:** Hasheado en SHA-256 para tabla de firmas  
✅ **CORS:** Configurado para aceitar solo localhost:3000  
✅ **Sesiones:** Token en localStorage del navegador  
✅ **Validaciones:** Plazo de 90 días, unicidad de firmas, estado de propuestas  

---

## 🚨 Troubleshooting

### ❌ Error: "ModuleNotFoundError: No module named 'fastapi'"
**Solución:** Asegúrate de activar el entorno virtual y ejecutar `pip install -r requirements.txt`

### ❌ Error: "Conexión rechazada a MongoDB"
**Solución:** Verifica que:
- Tu `MONGO_URI` en `.env` sea correcto
- Tu IP esté permitida en MongoDB Atlas (Security → Network Access → Add Current IP)
- Tengas conexión a internet

### ❌ Frontend muestra CORS error
**Solución:** Verifica que en `backend/.env` tengas `CLIENT_URL=http://localhost:3000` correcto

### ❌ Puerto 5001 ya está en uso
**Solución:** Usa otro puerto: `uvicorn app.main:app --port 5002`

### ❌ Puerto 3000 ya está en uso
**Solución:** Configura otro puerto en frontend: `PORT=3001 npm start`

---

## 📚 Documentación Adicional

- **Especificación de Requisitos:** Ver [SRS.md](SRS.md)
- **Patrones de Diseño:** 4 patrones implementados (Composite, Proxy, Decorator, Facade)
- **Base de Datos:** MongoDB Atlas (NoSQL)
- **Frontend:** React 19.2.7 con React Router 7.17.0

---

## 📝 Licencia

Proyecto educativo. Uso libre.

---

## ✅ Checklist de Verificación

Antes de reportar problemas, verifica:

- [ ] Python 3.8+ instalado: `python --version`
- [ ] Node.js 16+ instalado: `node --version`
- [ ] MongoDB Atlas cuenta creada y cluster activo
- [ ] `.env` creado en `backend/` con `MONGO_URI` válido
- [ ] `pip install -r requirements.txt` ejecutado correctamente
- [ ] `npm install` ejecutado en `frontend/`
- [ ] Backend corriendo en puerto 5001
- [ ] Frontend corriendo en puerto 3000
- [ ] Browser abierto en http://localhost:3000

---

**¡La plataforma está lista para ejecutarse!** 🎉

Para dudas o problemas, revisa el [SRS.md](SRS.md) para detalles técnicos completos.
