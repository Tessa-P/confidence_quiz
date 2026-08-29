from sqlmodel import SQLModel, Field


# Generic message
class QuizQuestion(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    question_label: str
    question_text: str
    option_a: str
    option_b: str
    correct_answer: str # will always be "A" or "B"

class QuizAnswer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    respondent_id: str = Field(foreign_key="respondent.respondent_id")
    question_id: int = Field(foreign_key="quizquestion.id")
    answer_given: str # will always be "A" or "B" 
    confidence_given: int

class Respondent(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    respondent_id: str = Field(unique=True, index=True)

