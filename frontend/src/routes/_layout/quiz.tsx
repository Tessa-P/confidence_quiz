import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/quiz")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Confidence Quiz",
      },
    ],
  }),
})

function Home() {
  return (
    <div>
      
    </div>
  )
}