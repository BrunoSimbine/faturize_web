"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { getSignatures, getPackages } from "@/services/api"
import { Button } from "@/components/ui/button"
import { SignatureForm } from "@/components/signature-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(inputDate: string): string {
  const date = new Date(inputDate)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hour = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day} ${month} ${year}, ${hour}:${minutes}`
}

export type Package = {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  devices: number
  users: number
  dateCreated: string
  dateUpdated: string
}

export type Signature = {
  id: string
  packageId: string
  companyId: string
  orderId: string
  isActive: boolean
  expires: string
  dateCreated: string
  dateUpdated: string
}

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<Signature[]>([])
  const [packages, setPackages] = React.useState<Record<string, Package>>({})

  // 🔹 Carregar dados apenas uma vez
  React.useEffect(() => {
    async function fetchData() {
      const [signatures, allPackages] = await Promise.all([
        getSignatures(),
        getPackages(),
      ])

      // Converter lista de pacotes em mapa (id → pacote)
      const pkgMap: Record<string, Package> = {}
      allPackages.forEach((p: Package) => {
        pkgMap[p.id] = p
      })

      setPackages(pkgMap)
      setData(signatures)
    }

    fetchData()
  }, [])

  // 🔹 Definir colunas após pacotes estarem carregados
  const columns = React.useMemo<ColumnDef<Signature>[]>(() => [
    {
      accessorKey: "packageId",
      header: "Pacote",
      cell: ({ row }) => {
        const pkg = packages[row.getValue("packageId") as string]
        return <div className="capitalize">{pkg ? pkg.name : "..."}</div>
      },
    },
    {
      accessorKey: "dateCreated",
      header: "Inicia",
      cell: ({ row }) => (
        <div className="lowercase">{formatDate(row.getValue("dateCreated"))}</div>
      ),
    },
    {
      accessorKey: "expires",
      header: "Expira",
      cell: ({ row }) => (
        <div className="lowercase">{formatDate(row.getValue("expires"))}</div>
      ),
    },
    {
      id: "amount",
      header: () => <div className="text-right">Valor</div>,
      cell: ({ row }) => {
        const pkg = packages[row.getValue("packageId") as string]
        const amount = pkg?.monthlyPrice ?? 0
        const formatted = new Intl.NumberFormat("pt-MZ", {
          style: "currency",
          currency: "MZN",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem>Detalhes de pagamento</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [packages])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="mx-3 flex flex-col gap-2 py-4 md:py-6 p-2  md:px-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Assinaturas</h1>
      </div>

      <div>
        <div className="flex items-center">
          <SignatureForm />
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} selecionadas.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
