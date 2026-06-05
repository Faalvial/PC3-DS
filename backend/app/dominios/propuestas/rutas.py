from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.db import db_context

router = APIRouter(tags=["Gestión de Propuestas"])


@router.post("/crear")
async def crear_propuesta(titulo: str, texto_principal: str):
    nueva_propuesta = {
        "titulo": titulo,
        "fecha_creacion": datetime.now(timezone.utc),
        "estado": "ACTIVA",
        "conteo_firmas": 0,
        "hash_criptografico": None,
        "elementos": [
            {"tipo": "DOCUMENTO_PRINCIPAL", "texto": texto_principal}
        ]
    }

    # Inserción simple en MongoDB
    resultado = await db_context.db.propuestas.insert_one(nueva_propuesta)

    return {
        "mensaje": "Iniciativa Legislativa creada con éxito.",
        "propuesta_id": str(resultado.inserted_id)
    }