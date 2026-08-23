export interface QuizQuestion {
    id: number | null
    question_label: string
    question_text: string
    optionA: string
    optionB: string
    correct_answer: string
}

export interface QuizAnswer {
    id: number | null
    respondent_id: number
    question_id: number
    answer_given: number
    confidence: number
}

export interface Respondent {
    id: number | null
    // eventually a respondent will have other properties, {created_at, demographics, etc}
}