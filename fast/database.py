from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,Session
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE = 'postgresql://postgres:13644107@localhost:5432/pfa'

engine = create_engine(URL_DATABASE, pool_size=20, max_overflow=10)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
