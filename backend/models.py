from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Producto(Base):
    __tablename__ = "productos"

    id       = Column(Integer, primary_key=True, index=True)
    codigo   = Column(String, unique=True, index=True)
    nombre   = Column(String)
    precio   = Column(Float)
    categoria = Column(String)

class Pedido(Base):
    __tablename__ = "pedidos"

    id            = Column(Integer, primary_key=True, index=True)
    numero_orden  = Column(Integer)
    mesa          = Column(Integer)
    items         = Column(JSON)   # lista de {codigo, nombre, precio, cantidad}
    total         = Column(Float)
    estado        = Column(String, default="pendiente")
    fecha         = Column(DateTime, default=datetime.now)

    factura = relationship("Factura", back_populates="pedido", uselist=False)

class Factura(Base):
    __tablename__ = "facturas"

    id         = Column(Integer, primary_key=True, index=True)
    pedido_id  = Column(Integer, ForeignKey("pedidos.id"))
    mesa       = Column(Integer)
    total      = Column(Float)
    fecha      = Column(DateTime, default=datetime.now)

    pedido = relationship("Pedido", back_populates="factura")