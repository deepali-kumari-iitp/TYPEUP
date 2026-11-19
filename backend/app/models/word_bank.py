from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class WordBank(Base):
    __tablename__ = "word_banks"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True
    )

    lesson_id: Mapped[int] = mapped_column(
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150), nullable=False
    )

    words: Mapped[str] = mapped_column(
        Text, nullable=False
    )

    difficulty: Mapped[str] = mapped_column(
        String(30), default="beginner", nullable=False
    )

    lesson = relationship(
        "Lesson",
        back_populates="word_banks",
    )