"use client"

import { TransactionsTable } from "@/components/transactions-table"
import * as React from "react"

export default function TransactionPage() {

  return ( 

    <div className="mx-3 flex flex-col gap-2 py-4 md:py-6 p-2  md:px-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transações</h1>
      </div>
      <TransactionsTable />
    </div>
  );
}