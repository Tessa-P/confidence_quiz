import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Footer } from "@/components/Common/Footer"

export const Route = createFileRoute("/_layout")({
  component: Layout,
})

function Layout() {
  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
