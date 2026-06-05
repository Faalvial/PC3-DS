import hashlib
import multiprocessing
from app.dominios.propuestas.composite import PropuestaNormativa


class MotorCriptografico:
    @staticmethod
    def _hashear_bloque(bloque_texto: str) -> str:
        return hashlib.sha256(bloque_texto.encode('utf-8')).hexdigest()

    def generar_sello(self, texto_completo: str) -> str:
        # Dividir el documento en fragmentos para procesamiento paralelo
        tamaño_bloque = max(1, len(texto_completo) // 12)
        bloques = [texto_completo[i:i + tamaño_bloque] for i in range(0, len(texto_completo), tamaño_bloque)]

        # Procesamiento paralelo optimizado para 12 núcleos físicos
        with multiprocessing.Pool(processes=12) as pool:
            hashes_parciales = pool.map(self._hashear_bloque, bloques)

        hash_maestro = hashlib.sha256("".join(hashes_parciales).encode('utf-8')).hexdigest()
        return hash_maestro


class IntegracionCongreso:
    async def enviar_expediente(self, id_propuesta: str, hash_seguridad: str):
        # Simulación de petición HTTP externa a la API gubernamental
        print(f"Expediente {id_propuesta} enviado al Congreso. SHA-256: {hash_seguridad}")
        return True


class OrquestadorCierreFacade:
    def __init__(self):
        self.cripto = MotorCriptografico()
        self.api_congreso = IntegracionCongreso()

    async def ejecutar_cierre(self, propuesta: PropuestaNormativa):
        # 1. Obtener contenido unificado usando el Composite
        texto_crudo = propuesta.extraer_texto()

        # 2. Generar el hash maestro usando procesamiento paralelo
        sello_criptografico = self.cripto.generar_sello(texto_crudo)

        # 3. Transmitir el paquete
        await self.api_congreso.enviar_expediente(propuesta.id_propuesta, sello_criptografico)

        return sello_criptografico