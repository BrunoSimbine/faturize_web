import { OrdersTable } from "@/components/orders-table"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import * as React from "react"

export default async function OrdersPage() {

  return (
    <div className="p-2 mt-4 md:px-3">
      <Breadcrumb className="pb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <BreadcrumbPage>Pagamentos</BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="border-b pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Lista de Pagamentos</h1>

      </div>
      <OrdersTable />
    </div>
  );
}