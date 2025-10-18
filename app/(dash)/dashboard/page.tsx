"use client"

import { SectionCards } from "@/components/section-cards"
import { WalletMonthlyCharts } from "@/components/chart-area-interactive"
import * as React from "react"


export default function Page() {

  return (
    <div className="flex flex-col gap-2 py-4 md:py-6">
      <div className="mx-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <SectionCards />
      <WalletMonthlyCharts />
    </div>
  )
}
