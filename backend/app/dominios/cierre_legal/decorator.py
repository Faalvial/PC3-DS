class PropuestaInmutableException(Exception):
    pass

class DecoradorCongelamientoLegal:
    def __init__(self, propuesta_base):
        self._propuesta = propuesta_base
        self._congelada = True

    def agregar_elemento(self, elemento):
        if self._congelada:
            raise PropuestaInmutableException("Bloqueo legal: La propuesta ha sido empaquetada criptográficamente.")
        self._propuesta.agregar_elemento(elemento)

    def extraer_texto(self) -> str:
        return self._propuesta.extraer_texto()