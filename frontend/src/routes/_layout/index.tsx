import Question from "@/components/question"
import CalibrationChart from "@/components/CalibrationChart"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getApiUrl } from "@/lib/api"
import { QuizQuestion } from "@/types"
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute("/_layout/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Confidence Quiz",
      },
    ],
  }),
})

interface QuestionResponse {
  answer: string
  confidence: number
}

const headers: string[] = [
  "Are these animal facts true or false?",
  "Which historical figure was born first?",
  "Which country had more people in 2025?",
  "Are these science facts true or false?"
]

type QuizResponses = Record<string, QuestionResponse>

function Home() {
  const [responses, setResponses] = useState<QuizResponses>({})
  const [respondent_ID] = useState(() => uuidv4())
  const [show, setShow] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { data: quizQuestions, isLoading, error } = useQuery<QuizQuestion[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      const response = await fetch(getApiUrl('api/v1/confidence_quiz/questions'))
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      return response.json()
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  })

  function handleChange(id: string, answer: string, confidence: number) {
    setResponses((prev) => ({
      ...prev,
      [id]: { answer, confidence },
    }))
  }

  async function submitRespondent(respondent_ID: string) {
    await fetch(getApiUrl('api/v1/confidence_quiz/respondents'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        respondent_ID: respondent_ID
      })
    })
  }

  async function submitResponse(respondentId: string, question: number, answer: string, confidence: number) {
    await fetch(getApiUrl('api/v1/confidence_quiz/answers'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        respondent_ID: respondentId,
        question_ID: question,
        answer_given: answer,
        confidence_given: confidence
      })
    })
  }

  async function handleSubmission(respondent_ID: string, responses: QuizResponses) {
    setIsSubmitting(true)
    setSubmitSuccess(false)
    
    try {
      await submitRespondent(respondent_ID)
      
      for (const [question_id, response] of Object.entries(responses)) {
        await submitResponse(respondent_ID, Number(question_id), response.answer, response.confidence)
      }
      
      setSubmitted(true)
      setShow(true)
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Failed to submit answers:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Welcome to the Confidence Quiz</h1>
        <p>Loading questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Welcome to the Confidence Quiz</h1>
        <p className="text-red-500">Error loading questions. Please try again later.</p>
      </div>
    )
  }

  if (quizQuestions === undefined) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Welcome to the Confidence Quiz</h1>
        <p className="text-red-500">Error loading questions. Please try again later.</p>
      </div>
    )
  }

  const chunkSize = 10
  const numChunks = quizQuestions.length / chunkSize

  const questionChunks: QuizQuestion[][] = []
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    questionChunks.push(quizQuestions.slice(start, end))
  }


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Welcome to the Confidence Quiz</h1>
      <p>
        Below is a series of questions that have one clear correct answer. Please select the answer you think is true, along with how confident you are that that is the correct answer. If you are 75% confident on 100 questions, you should expect to get about 75 of them correct. At the end, you will see how close your confidence matches reality.  Good luck!
      </p>

      {questionChunks.map((chunk, chunkIndex) => (
        <div key={`chunk-${chunkIndex}`} className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold mt-4">{headers[chunkIndex]}</h2>

          {chunk.map(({ id, question_label, question_text, option_a, option_b, correct_answer }) => (
            <Question
              key={id ?? `question-${question_text}`}
              question_label={question_label}
              question={question_text}
              option_a={option_a}
              option_b={option_b}
              answer={correct_answer}
              show={show}
              onChange={(answer, confidence) => handleChange(String(id), answer, confidence)}
            />
          ))}
        </div>
      ))}

      <button
        className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleSubmission(respondent_ID, responses)}
        disabled={isSubmitting || submitSuccess}
      >
        {submitSuccess ? 'Answers submitted!' : isSubmitting ? 'Submitting...' : 'See my results'}
      </button>

      {isSubmitting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Submitting your answers...</span>
        </div>
      )}

      {submitSuccess && !isSubmitting && (
        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          ✓ Your answers have been successfully submitted!
        </div>
      )}

      {submitted && (
        <CalibrationChart responses={responses} questions={quizQuestions} />
      )}

      {/* <pre><p>userID: {respondent_ID}</p></pre>
      <pre>{JSON.stringify(responses, null, 2)}</pre>
      <pre>{Object.entries(responses).map(([id, response]) => (
        <div>
          <p>Question: {id}</p>
          <p>Answer: {response.answer}</p>
          <p>Confidence: {response.confidence}</p>
          <br />
        </div>
      ))}</pre> */}
    </div>
  )
}
