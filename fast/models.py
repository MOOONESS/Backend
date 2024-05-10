from database import Base 
from sqlalchemy import Column, Integer, String, Boolean, Float
from sqlalchemy import Column, Integer, String

class drone(Base):
    __tablename__ = 'drones'
    
    id = Column(Integer, primary_key=True)
    nature = Column(String)
    numero = Column(Integer)
    pos = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    
