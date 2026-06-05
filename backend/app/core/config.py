from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = 5001
    MONGO_URI: str
    CLIENT_URL: str

    class Config:
        env_file = ".env"

# Instanciamos la configuración para importarla en otros archivos
settings = Settings()