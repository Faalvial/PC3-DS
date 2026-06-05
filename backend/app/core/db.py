from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class BaseDeDatos:
    cliente: AsyncIOMotorClient = None
    db = None

db_context = BaseDeDatos()

async def conectar_bd():
    # Usamos la URI proveniente del archivo .env
    db_context.cliente = AsyncIOMotorClient(settings.MONGO_URI)
    db_context.db = db_context.cliente.voz_ciudadana_db
    print("Conexión exitosa a MongoDB Atlas.")

async def cerrar_bd():
    if db_context.cliente:
        db_context.cliente.close()