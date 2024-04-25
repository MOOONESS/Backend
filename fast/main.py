from fastapi import FastAPI, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from fastapi.responses import StreamingResponse
import json
import logging
import asyncio

logger = logging.getLogger()

app = FastAPI()

origins = [
    "*"
]

# add CORS so our web page can connect to our api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionBase(BaseModel):
    id: int
    nature: str
    numero: int
    pos: int
    latitude: float
    longitude: float


class TransactionModel(TransactionBase):
    id: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Depends(get_db)

models.Base.metadata.create_all(bind=engine)


@app.post("/drone/", response_model=TransactionModel)
async def create_drone(drone: TransactionBase, db: Session = db_dependency):
    print("------------")
    print(drone)
    db_drone = models.drone(**drone.dict())
    db.add(db_drone)
    db.commit()
    db.refresh(db_drone)
    return db_drone


@app.put("/drone/{drone_id}", response_model=TransactionModel)
async def update_drone(drone_id: int, drone: TransactionBase, db: Session = db_dependency):
    db_drone = db.query(models.drone).filter(models.drone.id == drone_id).first()
    if db_drone is None:
        raise HTTPException(status_code=404, detail="Drone not found")
    for key, value in drone.dict().items():
        setattr(db_drone, key, value)
    db.commit()
    db.refresh(db_drone)
    return db_drone


@app.delete("/drone/{drone_id}", response_model=TransactionModel)
async def delete_drone(drone_id: int, db: Session = db_dependency):
    db_drone = db.query(models.drone).filter(models.drone.id == drone_id).first()
    if db_drone is None:
        raise HTTPException(status_code=404, detail="Drone not found")
    db.delete(db_drone)
    db.commit()
    return db_drone 


@app.get("/drones/sse")
async def drone_events(db: Session = db_dependency):
    async def event_generator():
        while True:
            drones = db.query(models.drone).all()
            data = [
                {
                    "id": drone.id,
                    "nature": drone.nature,
                    "numero": drone.numero,
                    "pos": drone.pos,
                    "latitude": drone.latitude,
                    "longitude": drone.longitude
                }
                for drone in drones
            ]
            event = {
                "data": json.dumps(data)
            }
            yield f"{json.dumps(event)}\n\n"
            
            await asyncio.sleep(15)  # Adjust the interval as needed

    return EventSourceResponse(event_generator(), media_type="text/event-stream")