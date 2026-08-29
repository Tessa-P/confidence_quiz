import string
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, SQLModel

from app.api.deps import SessionDep
from collections.abc import Sequence

from app.models import QuizQuestion, QuizAnswer, Respondent

router = APIRouter()


class AnswerCreate(SQLModel):
    respondent_ID: str
    question_ID: int
    answer_given: str
    confidence_given: int


class RespondentCreate(SQLModel):
    respondent_ID: str


@router.get("/questions", response_model=list[QuizQuestion])
def get_questions(session: SessionDep) -> Sequence[QuizQuestion]:
    return session.exec(select(QuizQuestion).order_by(QuizQuestion.id)).all()  # type: ignore


@router.post("/answers")
def create_answer(*, session: SessionDep, answer_in: AnswerCreate):
    new_answer = QuizAnswer(
        respondent_id=answer_in.respondent_ID,
        question_id=answer_in.question_ID,
        answer_given=answer_in.answer_given,
        confidence_given=answer_in.confidence_given,
    )

    session.add(new_answer)
    session.commit()
    session.refresh(new_answer)
    return new_answer


@router.post("/respondents")
def create_respondent(*, session: SessionDep, respondent_in: RespondentCreate):
    new_respondent = Respondent(respondent_id=respondent_in.respondent_ID)

    session.add(new_respondent)
    session.commit()
    session.refresh(new_respondent)
    return new_respondent
