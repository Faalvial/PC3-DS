from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import conectar_bd, cerrar_bd
from app.core.config import settings
from app.dominios.propuestas.rutas import router as router_propuestas
from app.dominios.firmas.rutas import router as router_firmas

app = FastAPI(
    title="Voz del Ciudadano API",
    version="1.0.0"
)

# --- CONFIGURACIÓN DE CORS ---
app.add_middleware(
    CORSMiddleware,
    # Autorizamos estrictamente a la URL del frontend leída desde el .env
    allow_origins=[settings.CLIENT_URL],
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todos los headers
)

@app.on_event("startup")
async def startup_db_client():
    await conectar_bd()

@app.on_event("shutdown")
async def shutdown_db_client():
    await cerrar_bd()

# Registro de Rutas
app.include_router(router_propuestas, prefix="/api/v1/propuestas")
app.include_router(router_firmas, prefix="/api/v1/propuestas")