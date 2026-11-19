
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.database import get_db
from app.models import Lesson
from app.schemas.lesson import LessonListResponse, LessonResponse


router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"],
)


@router.get(
    "/",
    response_model=list[LessonListResponse],
    status_code=status.HTTP_200_OK,
)
def get_lessons(db: Session = Depends(get_db)):
    """Return all lessons ordered by day number."""

    statement = select(Lesson).order_by(Lesson.day_number.asc())

    return db.scalars(statement).all()


@router.get(
    "/{day_number}",
    response_model=LessonResponse,
    status_code=status.HTTP_200_OK,
)
def get_lesson_by_day(
    day_number: int,
    db: Session = Depends(get_db),
):
    """Return a lesson with its sections and practice word banks."""

    if day_number < 1 or day_number > 30:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found.",
        )

    statement = (
        select(Lesson)
        .options(
            selectinload(Lesson.sections),
            selectinload(Lesson.word_banks),
        )
        .where(Lesson.day_number == day_number)
    )

    lesson = db.scalars(statement).first()

    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found.",
        )

    return lesson
