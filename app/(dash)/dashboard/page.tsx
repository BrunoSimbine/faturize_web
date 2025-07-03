import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as React from "react"


export default function Page() {

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="border-b mx-6 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <Select>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>2025</SelectLabel>
              <SelectItem value="apple">Junho</SelectItem>
              <SelectItem value="banana">Maio</SelectItem>
              <SelectItem value="blueberry">Abril</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <SectionCards />
      <div className="lg:px-6">
        <ChartAreaInteractive />
      </div>
    </div>
  )
}
