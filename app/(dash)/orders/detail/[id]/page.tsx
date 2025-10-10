"use client"
import Link from "next/link"

import { use } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getOrderById } from '@/services/api';
import {
  CheckCircle2Icon,
  LoaderIcon,
  XCircleIcon,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
interface PageProps {
  params: Promise<{ id: string }>
}

function formatDate(inputDate: string): string {
    const date = new Date(inputDate);

    const months: string[] = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", 
                              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const day: number = date.getDate();
    const month: string = months[date.getMonth()];

    const hour: string = date.getHours().toString().padStart(2, '0');

    return `${day} ${month}, ${hour}h`;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params)

  type Order = {
    amount: number;
    description: string;
    paid: number;
    client: string;
    expires: string;
    status: number;
    id: string;
    dateCreated: string;
    dateUpdated: string;
  };

  const [order, setOrder] = useState<Order>({
    amount: 0,
    description: "",
    paid: 0,
    client: "",
    expires: "",
    status: 0,
    id: "",
    dateCreated: "",
    dateUpdated: ""
  })
  
  useEffect(() => {
    async function fetchData() {

      try {
        const myOrder = await getOrderById(id);
        setOrder(myOrder);
      } catch(error) {
        console.log(error)
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-2 mt-4 md:px-3">
      <Breadcrumb className="pb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/orders">Pagamentos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detalhes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Detalhes de pagamento</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "MZN" }).format(order.amount)}</h1>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">ID Pagamento</span>
            <span className="font-semibold">#{order.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm flex items-center gap-2">
              <Button variant="ghost"> <Copy /> </Button> <Button variant="link">pay.faturize.co.mz/{order.id}</Button>
            </p>
            <Badge 
              variant="outline"
              className="flex text-muted-foreground"
            >
              {order.status === 0 && (
                <>
                  <LoaderIcon />
                  Pendente
                </>
              )}
              {order.status === 1 && (
                <>
                  <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                  Pago
                </>
              )}
              {order.status === 2 && (
                <>
                  <ClockIcon className="text-yellow-500 dark:text-yellow-400" />
                  Expirado
                </>
              )}
              {order.status === 3 && (
                <>
                  <XCircleIcon className="text-red-500 dark:text-red-400" />
                  Cancelado
                </>
              )}
            </Badge>
          </div>
          <div className="bg-muted p-4 rounded-md text-sm">
            <p>
              Pago:{" "}
              <strong>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "MZN",
                }).format(order.paid)}
              </strong>
            </p>
            <div className="w-full bg-gray-200 h-1 rounded-full my-2">
              <div
                className={`h-1 rounded-full ${
                  order.status === 2
                    ? "bg-yellow-500"
                    : order.status === 3
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min((order.paid / order.amount) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Gerado: <strong>{formatDate(order.dateCreated)}</strong>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" /> Expira: <strong>{formatDate(order.expires)}</strong>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
