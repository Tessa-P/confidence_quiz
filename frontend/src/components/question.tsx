import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

interface QuestionProps {
  question: string
  question_label: string
  optionA: string
  optionB: string
  answer: string
  show: boolean
  onChange?: (answer: string, confidence: number) => void
}

// Slider snaps to 55, 65, 75, 85, 95
const CONFIDENCE_MIN = 55
const CONFIDENCE_MAX = 95
const CONFIDENCE_STEP = 10

export default function Question({ question, question_label, optionA, optionB, answer, show, onChange }: QuestionProps) {
  const [selected, setSelected] = useState<string>("")
  const [confidence, setConfidence] = useState<number>(75)

  function handleAnswerChange(value: string) {
    setSelected(value)
    onChange?.(value, confidence) 
  }

  function handleConfidenceChange(value: number[]) {
    setConfidence(value[0])
    onChange?.(selected, value[0])
  }

  // make this "show" thing work properly

  return (
    <div className="flex items-start gap-8">
      {/* Question + radio options */}
      <div className="flex-1">
        <h3 className="font-medium mb-3">{question_label}: {question}</h3>
        <RadioGroup value={selected} onValueChange={handleAnswerChange}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="A" id={`${question}-A`} />
              <Label htmlFor={`${question}-A`}><div className={show && answer === "A" ? 'font-bold': ''}>{optionA}</div></Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="B" id={`${question}-B`} />
            <Label htmlFor={`${question}-B`}><div className={show && answer === "B" ? 'font-bold': ''}>{optionB}</div></Label>
          </div>
        </RadioGroup>
      </div>

      {/* Confidence slider */}
      <div className="flex flex-col items-center gap-2 w-40 pt-1">
        <span className="text-sm text-muted-foreground">Confidence</span>
        <Slider
          min={CONFIDENCE_MIN}
          max={CONFIDENCE_MAX}
          step={CONFIDENCE_STEP}
          value={[confidence]}
          onValueChange={handleConfidenceChange}
        />
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleConfidenceChange([Math.max(CONFIDENCE_MIN, confidence - CONFIDENCE_STEP)])}
            className="px-3 py-1 text-sm font-medium border rounded hover:bg-muted transition-colors disabled:opacity-50"
            disabled={confidence <= CONFIDENCE_MIN}
          >
            −
          </button>
          <span className="text-sm font-medium w-12 text-center">{confidence}%</span>
          <button 
            onClick={() => handleConfidenceChange([Math.min(CONFIDENCE_MAX, confidence + CONFIDENCE_STEP)])}
            className="px-3 py-1 text-sm font-medium border rounded hover:bg-muted transition-colors disabled:opacity-50"
            disabled={confidence >= CONFIDENCE_MAX}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
