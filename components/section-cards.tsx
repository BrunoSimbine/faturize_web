"use client";

import { getCompanyDetails } from '@/services/api';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type Company = {
  received: number;
  send: number;
  tax: number;
  balance: number;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  }).format(value).replace("MTn", "MT").replace("MZN", "MT");
};

export function SectionCards() {
  const [loading, setLoading] = useState(true);
  const [company, setCompanyDetails] = useState<Company>({
    received: 0,
    send: 0,
    tax: 0,
    balance: 0,
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyDetails = await getCompanyDetails() as Company;
        setCompanyDetails(companyDetails);
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  const cardContent = [
    {
      title: "Total Recebido",
      value: company.received 
    },
    {
      title: "Total Enviado",
      value: company.send
    },
    {
      title: "Taxas Pagas",
      value: company.tax
    },
    {
      title: "Balanço",
      value: company.balance
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl:grid-cols-2 @5xl:grid-cols-4 mb-2">
      {loading ? (
        Array(4).fill(null).map((_, index) => (
          <div key={index} className="@container/card">
            <Skeleton className="h-[115px] rounded-xl @[250px]/card:text-3xl" />
          </div>
        ))
      ) : (
        cardContent.map((card, index) => (
          <Card key={index} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {formatCurrency(card.value)}
              </CardTitle>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}
