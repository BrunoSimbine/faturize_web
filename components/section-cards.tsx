"use client"

import { getCompanyDetails } from '@/services/api';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type Company = {
  invoices: number
  transactions: number
  credits: number
  balance: number
} 

export function SectionCards() {

  const [loading, setLoading] = useState(true);

  const [company, setCompanyDetails] = useState<Company>({
    balance: 0,
    invoices: 0,
    transactions: 0,
    credits: 0
  });

  useEffect(() => {

      const fetchCompanies = async () => {
        try {
          const companyDetails = await getCompanyDetails() as Company;
          setCompanyDetails(companyDetails);
          setLoading(false);
        } catch (error) {
          console.error("Erro ao buscar empresas:", error);
        }
      };

      fetchCompanies();

  }, []);


      const creditos = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MZN",
      }).format(company.credits)

  return (
<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
  {loading ? (
    <>
      <div className="@container/card">
        <Skeleton className="h-[115px] @[250px]/card:text-3xl rounded-xl" />
      </div>
      <div className="@container/card">
        <Skeleton className="h-[115px] @[250px]/card:text-3xl rounded-xl" />
      </div>
      <div className="@container/card">
        <Skeleton className="h-[115px] @[250px]/card:text-3xl rounded-xl" />
      </div>
      <div className="@container/card">
        <Skeleton className="h-[115px] @[250px]/card:text-3xl rounded-xl" />
      </div>
    </>
  ) : (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pagamentos Gerados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "MZN",
              }).format(company.balance)
            }
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Concluidos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {company?.invoices}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pendentes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {company?.transactions}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Créditos Restantes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {creditos}
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  )}
</div>

  )
}
