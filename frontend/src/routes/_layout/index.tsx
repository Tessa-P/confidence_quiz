import Question from "@/components/question"
import CalibrationChart from "@/components/CalibrationChart"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

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

type QuizResponses = Record<string, QuestionResponse>

const QUESTIONS = [
  {
    id: "Q4.1",
    question: "Mars has one moon, just like Earth",
    optionA: "True",
    optionB: "False",
    correct: "B"
  },
  {
    id: "Q4.2",
    question: "Scurvy is caused by a deficit of vitamin C",
    optionA: "True",
    optionB: "False",
    correct: "A"
  },
  {
    id: "Q4.3",
    question: "Brass is made from iron and copper",
    optionA: "True",
    optionB: "False",
    correct: "B"
  },
  {
    id: "Q4.4",
    question: "One tablespoon of oil has more calories than one tablespoon of butter",
    optionA: "True",
    optionB: "False",
    correct: "A"
  },
  {
    id: "Q4.5",
    question: "Helium is the lightest element",
    optionA: "True",
    optionB: "False",
    correct: "B"
  },
  {
    id: "Q4.6",
    question: "The common cold is cause by bacteria",
    optionA: "True",
    optionB: "False",
    correct: "B"
  },
  {
    id: "Q4.7",
    question: "The deepest place on Earth is in the Pacific Ocean",
    optionA: "True",
    optionB: "False",
    correct: "A"
  },
  {
    id: "Q4.8",
    question: "Seasons are caused by the earth orbiting the sun in an elliptical path",
    optionA: "True",
    optionB: "False",
    correct: "B"
  },
  {
    id: "Q4.9",
    question: "Jupiter is the largest planet in our solar system",
    optionA: "True",
    optionB: "False",
    correct: "A"
  },
  {
    id: "Q4.10",
    question: "The atoms in a solid are more densely packed than atoms in a gas",
    optionA: "True",
    optionB: "False",
    correct: "A"
  }
]

function Home() {
  const [responses, setResponses] = useState<QuizResponses>({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(id: string, answer: string, confidence: number) {
    setResponses((prev) => ({
      ...prev,
      [id]: { answer, confidence },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Welcome to the Confidence Quiz</h1>
      <h2>Are these science facts true or false?</h2>

      {QUESTIONS.map(({ id, question, optionA, optionB }) => (
        <Question
          key={id}
          question={question}
          optionA={optionA}
          optionB={optionB}
          onChange={(answer, confidence) => handleChange(id, answer, confidence)}
        />
      ))}

      <button
        className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        onClick={() => setSubmitted(true)}
      >
        See my results
      </button>

      {submitted && (
        <CalibrationChart responses={responses} questions={QUESTIONS} />
      )}
    </div>
  )
}
