import { TransactionsTable } from "@/components/transactions-table"
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

export default async function TransactionPage() {

  return ( 

    <div className="p-2 mt-4 md:px-3">
      <div className="border-b pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Transacoes</h1>

        <Select>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Selecione o periodo" />
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
      <TransactionsTable />
    </div>
  );
}