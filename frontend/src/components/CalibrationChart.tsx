import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { QuizQuestion } from "@/types"

interface QuestionResponse {
  answer: string
  confidence: number
}

interface Props {
  responses: Record<string, QuestionResponse>
  questions: QuizQuestion[]
}

interface dataEntry {
  confidence: number
  accuracy: number | null
  count: number
}

export default function CalibrationChart({ responses, questions }: Props) {
  // For each confidence level, calculate how many answered questions at that
  // confidence were correct, expressed as a percentage
  const confidenceLevels = [55, 65, 75, 85, 95]

  const data = confidenceLevels.map((level) => {
    const questionsAtLevel = questions.filter(
      (q) => responses[String(q.id)]?.confidence === level,
    )
    const answered = questionsAtLevel.length
    const correct = questionsAtLevel.filter(
      (q) => responses[String(q.id)]?.answer === q.correct_answer,
    ).length

    return {
      confidence: level,
      // null when no questions answered at this level — breaks the line
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : null,
      count: answered,
    }
  })

  function getMinimumAccuracy (data: dataEntry[]): number {
    // for entry in data
    return Math.min(...data.map(entry => entry.accuracy).filter(val => val !== null))
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold text-lg">Calibration</h2>
      <p className="text-sm text-muted-foreground">
        For each confidence level, what % of those questions did you actually get right?
        A perfectly calibrated person follows the diagonal.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="confidence"
            type="number"
            domain={[50, 100]}
            ticks={confidenceLevels}
            tickFormatter={(v) => `${v}%`}
            label={{ value: "Stated confidence", position: "insideBottom", offset: -4 }}
          />
          <YAxis
            domain={[(Math.min(getMinimumAccuracy(data)), 50), 100]}
            tickFormatter={(v) => `${v}%`}
            // ticks={confidenceLevels}
            label={{ value: "Actually correct", angle: -90, position: "insideLeft", offset: 10 }}
          />
          {/* Perfect calibration diagonal */}
          <ReferenceLine
            segment={[{ x: 55, y: 55 }, { x: 95, y: 95 }]}
            stroke="#94a3b8"
            strokeDasharray="6 3"
            label={{ value: "Perfect", position: "insideTopLeft", fontSize: 11, fill: "#94a3b8" }}
          />
          <Tooltip
            formatter={(value, _name, props) => [
              value !== null ? `${value}%` : "No data",
              `Correct (${props.payload?.count ?? 0} question${props.payload?.count === 1 ? "" : "s"})`,
            ]}
            labelFormatter={(label) => `Confidence: ${label}%`}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 5, fill: "#3b82f6" }}
            connectNulls={false}
            name="Accuracy"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
