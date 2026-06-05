from fastapi import APIRouter
from datetime import datetime, timezone
from app.core.db import db_context
from bson import ObjectId

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

@router.get("/listar")
async def listar_propuestas():
    cursor = db_context.db.propuestas.find({}, {"elementos": 0})  # No traemos textos largos aquí
    propuestas = await cursor.to_list(length=100)

    # Formateamos el ObjectId para que JSON lo entienda
    for p in propuestas:
        p["_id"] = str(p["_id"])

    # Ordenamos por firmas de mayor a menor (Pantalla 3)
    propuestas.sort(key=lambda x: x.get("conteo_firmas", 0), reverse=True)
    return propuestas


@router.get("/{propuesta_id}")
async def obtener_detalle(propuesta_id: str):
    from fastapi import HTTPException
    try:
        propuesta = await db_context.db.propuestas.find_one({"_id": ObjectId(propuesta_id)})
    except:
        raise HTTPException(status_code=400, detail="ID de propuesta inválido")
    
    if not propuesta:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")
    
    propuesta["_id"] = str(propuesta["_id"])
    return propuesta

    propuesta["_id"] = str(propuesta["_id"])
    return propuesta