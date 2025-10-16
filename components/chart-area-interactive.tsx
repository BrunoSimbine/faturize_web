"use client";

import { useEffect, useState } from "react";
import { LineChart, CartesianGrid, XAxis, Tooltip, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { getDailySummary } from '@/services/api';
import type { TooltipProps } from "recharts";

export interface DailySummary {
  walletId: string;       // UUID ou identificador da wallet
  date: string;             // MM-dd-aaaa
  totalSent: number;      // Total enviado
  totalReceived: number;  // Total recebido
  totalFees: number;      // Taxas totais
}

interface AggregatedData {
  day: number;
  value: number;
}

function aggregateByDay(summaries: DailySummary[], key: keyof DailySummary): AggregatedData[] {
  const grouped = summaries.reduce<Record<number, number>>((acc, ds) => {
    // Extrai o dia diretamente da string "aaaa-MM-dd"
    const day = Number(String(ds.date).split("-")[2]); 
    acc[day] = (acc[day] || 0) + (ds[key] as number);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([day, value]) => ({ day: Number(day), value }))
    .sort((a, b) => a.day - b.day);
}


// Custom tooltip
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value ?? 0;

  return (
    <div className="rounded-xl bg-indigo-500 p-1 shadow-lg text-white">
      <p className="text-xs opacity-80 ">Dia {label}</p>
      <p className="font-semibold text-xs">
        {new Intl.NumberFormat("pt-MZ", {
          style: "currency",
          currency: "MZN",
        }).format(value)}
      </p>
    </div>
  );
};

export function WalletMonthlyCharts() {
  const [mounted, setMounted] = useState(false);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {

      const fetchCompanies = async () => {
        try {
          const mySummaries = await getDailySummary();
          setSummaries(mySummaries);
          setMounted(true);
        } catch (error) {
          console.error("Erro ao buscar empresas:", error);
        }
      };

    fetchCompanies();

  }, []);

  if (!mounted) return null;

  const totalSentData = aggregateByDay(summaries, "totalSent");
  const totalReceivedData = aggregateByDay(summaries, "totalReceived");
  const totalFeesData = aggregateByDay(summaries, "totalFees");
  
  const renderChart = (title: string, data: AggregatedData[], color: string) => {
  const total: number = data.reduce((sum: number, d: AggregatedData) => sum + d.value, 0)
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          {new Intl.NumberFormat("pt-MZ", {
            style: "currency",
            currency: "MZN",
          }).format(total) }
          <Badge variant="outline" className="text-green-500 bg-green-500/10 border-none ml-2">
            <TrendingUp className="h-4 w-4" />
            <span>{total/20}%</span>
          </Badge>
        </CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={1} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={true}
                filter="url(#line-glow)"
              />
              <defs>
                <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card  gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
      {renderChart("Total Recebido", totalReceivedData, "#10B981")}
      {renderChart("Total Enviado", totalSentData, "#EF4444")}
      {renderChart("Taxas Pagas", totalFeesData, "#6366F1")}
    </div>
  );
}
