from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class LessonSection(Base):
    __tablename__ = "lesson_sections"

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

    section_type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )

    content: Mapped[str] = mapped_column(
        Text, nullable=False
    )

    order_index: Mapped[int] = mapped_column(
        Integer, nullable=False
    )

    lesson = relationship(
        "Lesson",
        back_populates="sections",
    )