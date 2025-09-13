import { SectionCards } from "@/components/section-cards"
import * as React from "react"

export default function Page() {

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="border-b mx-6 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <SectionCards />
      <div className="lg:px-6">
        {/* <ChartAreaInteractive />  */}
      </div>
    </div>
  )
}
