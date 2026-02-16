from pydantic import BaseModel


class ReportCreate(BaseModel):
    title: str
    description: str
    photo_url: str | None = None


class ReportStatusUpdate(BaseModel):
    status: str


class ReportOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    category: str
    priority: str
    ai_summary: str | None = None
    suspicious_flag: bool
    user_id: int
    photo_url: str | None = None

    class Config:
        from_attributes = True
