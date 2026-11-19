from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(
    Integer, primary_key=True
)

    day_number: Mapped[int] = mapped_column(
        Integer, unique=True, nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(150), nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text, nullable=False
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer, default=30, nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    sections = relationship(
        "LessonSection",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )

    word_banks = relationship(
        "WordBank",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )