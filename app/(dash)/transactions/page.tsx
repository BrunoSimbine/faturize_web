import { TransactionsTable } from "@/components/transactions-table"
import * as React from "react"

export default async function TransactionPage() {

  return ( 

    <div className="p-2 mt-4 md:px-3">
      <div className="border-b pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transacoes</h1>
      </div>
      <TransactionsTable />
    </div>
  );
}