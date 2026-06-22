from pydantic import BaseModel
from datetime import datetime
from typing import List, Any

class ProductoOut(BaseModel):
    codigo: str
    nombre: str
    precio: float
    categoria: str

    class Config:
        from_attributes = True

class ItemPedido(BaseModel):
    codigo: str
    nombre: str
    precio: float
    cantidad: int

class PedidoCreate(BaseModel):
    numero_orden: int
    mesa: int
    items: List[ItemPedido]
    total: float

class PedidoOut(PedidoCreate):
    id: int
    estado: str
    fecha: datetime

    class Config:
        from_attributes = True

class FacturaCreate(BaseModel):
    pedido_id: int
    mesa: int
    total: float

class FacturaOut(FacturaCreate):
    id: int
    fecha: datetime

    class Config:
        from_attributes = True