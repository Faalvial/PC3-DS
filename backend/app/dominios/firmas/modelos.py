from pydantic import BaseModel, Field


class FirmaRequest(BaseModel):
    # Se espera el DNI en texto plano, pero se hasheará en el controlador por seguridad
    dni_ciudadano: str = Field(..., min_length=8, max_length=8, description="DNI del ciudadano")


class FirmaResponse(BaseModel):
    mensaje: str
    total_firmas_actuales: int