from abc import ABC, abstractmethod
from typing import List

class ElementoLegislativo(ABC):
    @abstractmethod
    def extraer_texto(self) -> str:
        pass

class DocumentoPrincipal(ElementoLegislativo):
    def __init__(self, texto: str):
        self.texto = texto

    def extraer_texto(self) -> str:
        return f"--- DOCUMENTO PRINCIPAL ---\n{self.texto}\n"

class Modificacion(ElementoLegislativo):
    def __init__(self, autor: str, texto: str):
        self.autor = autor
        self.texto = texto

    def extraer_texto(self) -> str:
        return f"--- MODIFICACIÓN (Por: {self.autor}) ---\n{self.texto}\n"

class PropuestaNormativa(ElementoLegislativo):
    def __init__(self, id_propuesta: str):
        self.id_propuesta = id_propuesta
        self.elementos: List[ElementoLegislativo] = []

    def agregar_elemento(self, elemento: ElementoLegislativo):
        self.elementos.append(elemento)

    def extraer_texto(self) -> str:
        # Extrae de forma recursiva todo el contenido para el hash
        return "".join([elemento.extraer_texto() for elemento in self.elementos])