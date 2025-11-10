"use client";

import { useEffect, useState } from "react";
import { LineChart, CartesianGrid, XAxis, Tooltip, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { getDailySummary } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";
import type { TooltipProps } from "recharts";

export interface DailySummary {
  walletId: string;       // UUID ou identificador da wallet
  date: string;           // MM-dd-aaaa
  totalSent: number;      // Total enviado
  totalReceived: number;  // Total recebido
  totalFees: number;      // Taxas totais
}

interface AggregatedData {
  day: number;
  value: number;
}

// Função de agregação por dia, agora mais flexível
function aggregateByDay(summaries: DailySummary[], key: keyof DailySummary): AggregatedData[] {
  const grouped = summaries.reduce<Record<number, number>>((acc, ds) => {
    const day = Number(ds.date.split("-")[2]); 
    acc[day] = (acc[day] || 0) + Number(ds[key]);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([day, value]) => ({ day: Number(day), value }))
    .sort((a, b) => a.day - b.day);
}

// Função de formatação para moeda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  }).format(value).replace("MTn", "MT").replace("MZN", "MT");
};

// Custom Tooltip
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl bg-indigo-500 p-1 shadow-lg text-white">
      <p className="text-xs opacity-80">Dia {label}</p>
      <p className="font-semibold text-xs">{formatCurrency(value)}</p>
    </div>
  );
};

export function WalletMonthlyCharts() {
  const [summaries, setSummaries] = useState<DailySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const mySummaries = await getDailySummary();
        setSummaries(mySummaries);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Agregando os dados para cada categoria
  const totalSentData = aggregateByDay(summaries, "totalSent");
  const totalReceivedData = aggregateByDay(summaries, "totalReceived");
  const totalFeesData = aggregateByDay(summaries, "totalFees");

  // Função para renderizar o gráfico
  const renderChart = (title: string, data: AggregatedData[], color: string) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            {formatCurrency(total)}
            <Badge variant="outline" className="text-green-500 bg-green-500/10 border-none ml-2">
              <TrendingUp className="h-4 w-4" />
              <span>{(total / 20).toFixed(2)}%</span>
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
                  dot
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
  };

  return (
    <div className="gap-4 px-4 lg:px-6">
      {loading ? (
        <Skeleton className="h-[325px] w-full rounded-xl" />
      ) : (
        <>
          {renderChart("Ganhos", totalReceivedData, "#10B981")}
          {renderChart("Gastos", totalSentData, "#EF4444")}
          {renderChart("Taxas Pagas", totalFeesData, "#6366F1")}
        </>
      )}
    </div>
  );
}
