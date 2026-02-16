from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.routers import admin


from app.db.database import engine
from app.db.base import Base
from app.models import user, report
from app.routers import user as user_router
from app.routers import report as report_router


app = FastAPI(
    title="FixIt API",
    swagger_ui_parameters={"url": "/openapi.json"}
)

# Add CORS middleware FIRST - before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Then add routes
app.include_router(admin.router)
app.include_router(user_router.router)
app.include_router(report_router.router)

@app.get("/")
def root():
    return {"message": "FixIt backend with PostgreSQL is running"}
