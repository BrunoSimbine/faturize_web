"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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

import { getSignatures, getPackages } from "@/services/api"

// ========================
// Utils
// ========================
const formatDate = (input: string) => {
  if (!input) return "-"
  const date = new Date(input)
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  })
    .format(value)
    .replace("MTn", "MT").replace("MZN", "MT")

// ========================
// Types
// ========================
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

// ========================
// Hook para dados
// ========================
function useSignaturesData() {
  const [signatures, setSignatures] = React.useState<Signature[]>([])
  const [packages, setPackages] = React.useState<Record<string, Package>>({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      try {
        const [signaturesData, packagesList] = await Promise.all([
          getSignatures(),
          getPackages(),
        ])

        const pkgMap = Object.fromEntries(
          packagesList.map((p: Package) => [p.id, p])
        )

        setSignatures(signaturesData)
        setPackages(pkgMap)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { signatures, packages, loading }
}

// ========================
// Tabela principal
// ========================
export default function SignaturesTable() {
  const { signatures, packages, loading } = useSignaturesData()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const getPackage = React.useCallback(
    (pkgId: string) => packages[pkgId],
    [packages]
  )

  const columns = React.useMemo<ColumnDef<Signature>[]>(
    () => [
      {
        accessorKey: "packageId",
        header: "Pacote",
        cell: ({ row }) => getPackage(row.getValue("packageId"))?.name ?? "—",
      },
      {
        accessorKey: "expires",
        header: "Expira",
        cell: ({ row }) => {
          const expires: string = row.getValue("expires");
          return <span>{expires ? formatDate(expires) : "-"}</span>;
        },
      },
      {
        id: "users",
        header: () => <div className="text-left hidden md:block">Usuários</div>,
          cell: ({ row }) =>(
          <span
            className="hidden md:block">
            {getPackage(row.getValue("packageId"))?.users ?? "—"}
          </span>
        ),
      },
      {
        id: "devices",
        header: () => <div className="text-left hidden md:block">Dispositivos</div>,
        cell: ({ row }) =>(
          <span
            className="hidden md:block">
            {getPackage(row.getValue("packageId"))?.devices ?? "—"}
          </span>
        ),
      },
      {
        id: "amount",
        header: "Valor",
        cell: ({ row }) => {
          const pkg = getPackage(row.getValue("packageId"))
          return pkg ? formatCurrency(pkg.monthlyPrice) : "—"
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const expires = row.getValue("expires");
          const isActive = row.original.isActive;
          
          // Se expires estiver vazio, exibe 'Pagamento Pendentes'
          if (!expires) {
            return (
              <span className="text-yellow-500 font-medium">
                Por Pagar
              </span>
            );
          }

          // Se expires não estiver vazio, exibe 'Ativo' ou 'Inativo' com base no status
          return (
            <span
              className={`${
                isActive ? "text-green-600 font-medium" : "text-red-500"
              }`}
            >
              {isActive ? "Ativo" : "Inativo"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
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
    [getPackage]
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

  // ========================
  // Render
  // ========================
  return (
    <div className="mx-5 flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Assinaturas</h1>
        <SignatureForm />
      </div>

      {loading ? (
        <Skeleton className="h-[250px] w-full rounded-xl" />
      ) : (
        <>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhum resultado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} selecionadas
            </span>

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
        </>
      )}
    </div>
  )
}
