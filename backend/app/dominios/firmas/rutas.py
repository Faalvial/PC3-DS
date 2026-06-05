import hashlib
from fastapi import APIRouter, BackgroundTasks
from app.dominios.firmas.modelos import FirmaRequest, FirmaResponse
from app.dominios.firmas.proxy import ProxyValidacionLegal
from app.dominios.cierre_legal.fachada import OrquestadorCierreFacade
from app.dominios.propuestas.composite import PropuestaNormativa, DocumentoPrincipal

router = APIRouter(tags=["Participación Ciudadana"])


async def reconstruir_propuesta_desde_bd(propuesta_id: str) -> PropuestaNormativa:
    # Función auxiliar para instanciar el Composite con datos de MongoDB
    # (Simulada para mantener el enfoque en la arquitectura)
    propuesta = PropuestaNormativa(propuesta_id)
    propuesta.agregar_elemento(DocumentoPrincipal("Contenido íntegro extraído de BD..."))
    return propuesta


@router.post("/{propuesta_id}/firmar", response_model=FirmaResponse)
async def firmar_iniciativa(
        propuesta_id: str,
        request: FirmaRequest,
        tareas_fondo: BackgroundTasks
):
    # 1. Hashear el DNI inmediatamente en la capa de entrada
    dni_hash = hashlib.sha256(request.dni_ciudadano.encode('utf-8')).hexdigest()

    # 2. El Proxy intercepta y aplica las reglas de los 90 días y el límite
    proxy = ProxyValidacionLegal(propuesta_id)
    nuevo_total = await proxy.registrar_firma(dni_hash)

    # 3. Regla de negocio: Detonar el cierre al alcanzar la meta
    if nuevo_total == 25000:
        # Reconstruimos la estructura (Patrón Composite)
        propuesta_ensamblada = await reconstruir_propuesta_desde_bd(propuesta_id)

        # Instanciamos la Fachada
        orquestador = OrquestadorCierreFacade()

        # Delegamos el hash (usando el procesamiento paralelo) y el envío al Congreso
        # como una tarea en segundo plano para responder de inmediato al usuario
        tareas_fondo.add_task(orquestador.ejecutar_cierre, propuesta_ensamblada)

    return FirmaResponse(
        mensaje="Firma registrada y validada correctamente.",
        total_firmas_actuales=nuevo_total
    )