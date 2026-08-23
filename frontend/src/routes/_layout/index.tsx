import Question from "@/components/question"
import CalibrationChart from "@/components/CalibrationChart"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getApiUrl } from "@/lib/api"
import { QuizQuestion } from "@/types"

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
  "Which country had more people in 2019?", // TODO: update this to 2025
  "Are these science facts true or false?"
]

type QuizResponses = Record<string, QuestionResponse>

function Home() {
  const [responses, setResponses] = useState<QuizResponses>({})
  const [submitted, setSubmitted] = useState(false)

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
  for (let i=0; i < numChunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    questionChunks.push(quizQuestions.slice(start, end))
  }


  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Welcome to the Confidence Quiz</h1>

      {questionChunks.map((chunk, chunkIndex) => (
        <div key={`chunk-${chunkIndex}`} className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold mt-4">{headers[chunkIndex]}</h2>

          {chunk.map(({ id, question_text, optionA, optionB }) => (
        <Question
          key={id ?? `question-${question_text}`}
          question={question_text}
          optionA={optionA}
          optionB={optionB}
          onChange={(answer, confidence) => handleChange(String(id), answer, confidence)}
        />
      ))}
        </div>
      ))}


      

      <button
        className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        onClick={() => setSubmitted(true)}
      >
        See my results
      </button>

      {submitted && (
        <CalibrationChart responses={responses} questions={quizQuestions} />
      )}
    </div>
  )
}
