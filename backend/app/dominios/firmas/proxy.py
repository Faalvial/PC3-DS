from datetime import datetime, timezone
from fastapi import HTTPException
from app.core.db import db_context


class ProxyValidacionLegal:
    def __init__(self, propuesta_id: str):
        self.propuesta_id = propuesta_id
        self.db = db_context.db

    async def registrar_firma(self, dni_hash: str) -> int:
        from bson import ObjectId

        # 1. Recuperar estado de la propuesta
        propuesta = await self.db.propuestas.find_one({"_id": ObjectId(self.propuesta_id)})
        if not propuesta:
            raise HTTPException(status_code=404, detail="Propuesta no encontrada.")

        # 2. Validar límite de firmas
        if propuesta.get("conteo_firmas", 0) >= 25000:
            raise HTTPException(status_code=403, detail="La iniciativa ya alcanzó el límite constitucional.")

        # 3. Validar vigencia de 90 días
        dias_activa = (datetime.now(timezone.utc) - propuesta["fecha_creacion"].replace(tzinfo=timezone.utc)).days
        if dias_activa > 90:
            raise HTTPException(status_code=403, detail="El plazo de recolección ha caducado.")

        # 4. Validar unicidad de firma
        firma_previa = await self.db.firmas.find_one({
            "propuesta_id": self.propuesta_id,
            "dni_hash": dni_hash
        })
        if firma_previa:
            raise HTTPException(status_code=400, detail="El ciudadano ya ha firmado esta propuesta.")

        # 5. Inserción real (Sujeto)
        await self.db.firmas.insert_one({
            "propuesta_id": self.propuesta_id,
            "dni_hash": dni_hash,
            "fecha": datetime.now(timezone.utc)
        })

        # Actualizar contador
        resultado = await self.db.propuestas.find_one_and_update(
            {"_id": ObjectId(self.propuesta_id)},
            {"$inc": {"conteo_firmas": 1}},
            return_document=True
        )

        return resultado["conteo_firmas"]