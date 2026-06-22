from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Pedido
from schemas import PedidoCreate, PedidoOut
from typing import List

router = APIRouter(prefix="/pedidos", tags=["pedidos"])

@router.get("/", response_model=List[PedidoOut])
def get_pedidos(db: Session = Depends(get_db)):
    return db.query(Pedido).order_by(Pedido.fecha.desc()).all()

@router.post("/", response_model=PedidoOut)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    items_dict = [i.dict() for i in pedido.items]
    nuevo = Pedido(
        numero_orden = pedido.numero_orden,
        mesa         = pedido.mesa,
        items        = items_dict,
        total        = pedido.total
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.patch("/{pedido_id}/listo", response_model=PedidoOut)
def marcar_listo(pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    pedido.estado = "listo"
    db.commit()
    db.refresh(pedido)
    return pedido