import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class User(Base):
    __tablename__ = 'users'

    user_id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4, index = True)
    username = Column(String(20), unique = True, index = True, nullable = False)
    group = Column(String(20), index = True, nullable = False)
    hashed_password = Column(String(255), nullable = False)
