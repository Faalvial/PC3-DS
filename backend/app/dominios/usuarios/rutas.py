from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.db import db_context
import bcrypt

router = APIRouter(tags=["Usuarios"])


class Credenciales(BaseModel):
    dni: str
    password: str


@router.post("/registro")
async def registrar_usuario(datos: Credenciales):
    if len(datos.dni) != 8:
        raise HTTPException(status_code=400, detail="DNI inválido")

    usuario_existente = await db_context.db.usuarios.find_one({"dni": datos.dni})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Usuario ya registrado")

    # Hashear password con bcrypt
    salt = bcrypt.gensalt()
    password_hasheada = bcrypt.hashpw(datos.password.encode('utf-8'), salt).decode('utf-8')

    nuevo_usuario = {
        "dni": datos.dni,
        "password": password_hasheada
    }
    await db_context.db.usuarios.insert_one(nuevo_usuario)

    return {"mensaje": "Registro exitoso EN LA NUBE"}


@router.post("/login")
async def login_usuario(datos: Credenciales):
    usuario = await db_context.db.usuarios.find_one({"dni": datos.dni})

    if not usuario or not bcrypt.checkpw(datos.password.encode('utf-8'), usuario["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {"mensaje": "Login exitoso", "token": datos.dni}