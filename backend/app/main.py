
from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import engine
from app.api.v1.lessons import router as lessons_router

app = FastAPI(
    title="TYPEUP API",
    description="Backend API for the TYPEUP typing learning platform.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(lessons_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Welcome to TYPEUP API!",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "TYPEUP Backend",
    }


@app.get("/health/db")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "success": True,
            "database": "connected",
            "name": "typeup_db",
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed.",
        )
