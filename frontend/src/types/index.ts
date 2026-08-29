export interface QuizQuestion {
    id: number | null
    question_label: string
    question_text: string
    option_a: string
    option_b: string
    correct_answer: string
}

export interface QuizAnswer {
    id: number | null
    respondent_id: number
    question_id: number
    answer_given: number
    confidence_given: number
}

export interface Respondent {
    id: number | null
    // eventually a respondent will have other properties, {created_at, demographics, etc}
}