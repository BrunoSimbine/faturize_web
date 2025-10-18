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

// Formata datas de forma simples
function formatDate(inputDate: string): string {
  const date = new Date(inputDate)
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Intl.DateTimeFormat("pt-MZ", options).format(date)
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

// Hook para carregar dados
function useSignaturesData() {
  const [signatures, setSignatures] = React.useState<Signature[]>([])
  const [packagesMap, setPackagesMap] = React.useState<Record<string, Package>>({})

  React.useEffect(() => {
    async function fetchData() {
      const [signaturesData, packagesList] = await Promise.all([
        getSignatures(),
        getPackages(),
      ])

      const map: Record<string, Package> = {}
      packagesList.forEach((p: Package) => (map[p.id] = p))

      setSignatures(signaturesData)
      setPackagesMap(map)
    }

    fetchData()
  }, [])

  return { signatures, packagesMap }
}

export default function DataTableDemo() {
  const { signatures, packagesMap } = useSignaturesData()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Acessa pacote de forma segura
  const getPackage = (pkgId: string) => packagesMap[pkgId]

  const columns = React.useMemo<ColumnDef<Signature>[]>(
    () => [
      {
        accessorKey: "packageId",
        header: "Pacote",
        cell: ({ row }) => getPackage(row.getValue("packageId") as string)?.name || "...",
      },
      {
        accessorKey: "dateCreated",
        header: "Início",
        cell: ({ row }) => formatDate(row.getValue("dateCreated")),
      },
      {
        accessorKey: "expires",
        header: "Expira",
        cell: ({ row }) => formatDate(row.getValue("expires")),
      },
      {
        id: "users",
        header: "Usuários",
        cell: ({ row }) => getPackage(row.getValue("packageId") as string)?.users ?? "...",
      },
      {
        id: "devices",
        header: "Dispositivos",
        cell: ({ row }) => getPackage(row.getValue("packageId") as string)?.devices ?? "...",
      },
      {
        id: "amount",
        header: "Valor",
        cell: ({ row }) => {
          const amount = getPackage(row.getValue("packageId") as string)?.monthlyPrice ?? 0
          return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(amount).replace("MTn", "MT")
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (row.original.isActive ? "Ativo" : "Inativo"),
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
    ],
    [packagesMap]
  )

  const table = useReactTable({
    data: signatures,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="mx-5 flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Assinaturas</h1>
        <SignatureForm />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

      <div className="flex items-center justify-between py-4">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} selecionadas
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
