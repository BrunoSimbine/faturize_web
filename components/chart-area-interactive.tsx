"use client"

import { getInvoicing } from '@/services/api';
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

const chartConfig = {
  views: {
    label: "Pagamentos ",
  },
  faturamento: {
    label: "faturamento",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig

export type Faturamento = {
  date: string
  faturamento: number
} 

export function ChartAreaInteractive() {

  const [faturamento, setFaturamento] = useState<Faturamento[]>([]);

  const [showChart, setShowChart] = useState(false)
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("faturamento")

  useEffect(() => {
    async function fetchData()
    {
      const listaFaturamento = await getInvoicing() as Faturamento[];
      setFaturamento(listaFaturamento);
      setShowChart(true)   
      setActiveChart("faturamento")   
    }
    fetchData()
  }, [])
  

  return (
<span>
      {!showChart ? (
        <span className="mx-4 lg:mx-0">
          <Skeleton className="h-[450px] w-full rounded-xl" />
        </span>
      ) : (
        <Card className="mx-4 lg:mx-0">
          <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 mb-3 pb-3 sm:pb-0">
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>
                Veja os pagamentos concluidos nos últimos dias.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[280px] w-full"
            >

<BarChart
            accessibilityLayer
            data={faturamento}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>

            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </span>
  )
}
