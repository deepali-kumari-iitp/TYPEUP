
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LessonSectionResponse(BaseModel):
    id: int
    title: str
    section_type: str
    content: str
    order_index: int

    model_config = ConfigDict(from_attributes=True)


class WordBankResponse(BaseModel):
    id: int
    title: str
    words: str
    difficulty: str

    model_config = ConfigDict(from_attributes=True)


class LessonListResponse(BaseModel):
    id: int
    day_number: int
    title: str
    description: str
    duration_minutes: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LessonResponse(LessonListResponse):
    sections: list[LessonSectionResponse] = Field(default_factory=list)
    word_banks: list[WordBankResponse] = Field(default_factory=list)
