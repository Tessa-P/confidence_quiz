from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.api.deps import SessionDep

from app.models import QuizQuestion, QuizAnswer, Respondent

router = APIRouter()

@router.get("/questions", response_model=list[QuizQuestion])
def get_questions(
    session: SessionDep
) -> list[QuizQuestion]:
    return session.exec(select(QuizQuestion)).all()