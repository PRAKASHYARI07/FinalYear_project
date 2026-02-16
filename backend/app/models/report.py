from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.db.base_class import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department = Column(String)
    status = Column(String, default="pending")
    category = Column(String, default="general")
    priority = Column(String, default="medium")

    ai_summary = Column(String, nullable=True)
    suspicious_flag = Column(Boolean, default=False)
    photo_url = Column(String, nullable=True)  # Path to uploaded photo

    user_id = Column(Integer, ForeignKey("users.id"))
