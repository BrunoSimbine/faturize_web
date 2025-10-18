"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

import { getTransactions, getWallets, getMethods } from '@/services/api';
import { setLocalMethods, setLocalWallets } from "@/services/auth";

import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 📅 Formatação de data moderna e localizada
function formatDate(inputDate: string): string {
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(inputDate));
}

// 🔢 Função auxiliar para encurtar IDs
function shortenUUID(uuid: string, size: number): string {
  return uuid.substring(0, size);
}

// 🧱 Esquema dos dados
export const schema = z.object({
  id: z.string(),
  sid: z.string(),
  name: z.string(),
  account: z.string(),
  tax: z.string(),
  walletId: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
  amount: z.number(),
  paid: z.number(),
  expires: z.string(),
  isReceived: z.boolean(),
  status: z.number(),
});

type Transaction = z.infer<typeof schema>

type Wallet = {
  id: string
  name: string
  payMethodId: string
  balance: number
}

type Method = {
  id: string
  name: string
}

// 🔒 Caches globais (fora do componente)
let walletsCache: Wallet[] = []
let methodsCache: Method[] = []

// 💰 Função para formatação monetária
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  })
    .format(value)
    .replace("MZN", "MTn");
}

function handleTransactionDetails(id: string) {
  console.log("Detalhes:", id);
}

function getPayMethodNameByWalletId(walletId: string): string {
  const wallet = walletsCache.find(w => w.id === walletId);
  if (!wallet) return "—";
  const method = methodsCache.find(m => m.id === wallet.payMethodId);
  return method?.name ?? "—";
}

// 🧩 Colunas da tabela
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left pl-1">Sid</div>,
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Montante</div>,
    cell: ({ row }) => {
      const amount = row.original.amount;
      const isReceived = row.original.isReceived;

      const amountClass = isReceived
        ? "text-left font-medium text-green-500 dark:text-green-400"
        : "text-left font-medium text-red-500 dark:text-red-400";

      const symbol = isReceived ? "+" : "-";

      return (
        <div className={amountClass}>
          {symbol}{formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "tax",
    header: () => <div className="text-left">Taxa</div>,
    cell: ({ row }) => <div className="text-left font-medium">{formatCurrency(Number(row.original.tax))}</div>,
  },
  {
    accessorKey: "walletId",
    header: () => <div className="text-left">Método</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium inline">
        <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3">
          {getPayMethodNameByWalletId(row.original.walletId)}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left hidden md:block">Nome</div>,
    cell: ({ row }) => <div className="text-left font-medium hidden md:block">{row.original.name}</div>,
  },
  {
    accessorKey: "account",
    header: () => <div className="text-left hidden sm:block">Conta</div>,
    cell: ({ row }) => <div className="text-left font-medium hidden sm:block">{row.original.account}</div>,
  },
  {
    accessorKey: "dateCreated",
    header: () => <div className="text-left hidden md:block">Data</div>,
    cell: ({ row }) => <div className="text-left font-medium hidden md:block">{formatDate(row.original.dateCreated)}</div>,
  },
];

// 🧱 Componente principal
export function TransactionsTable() {
  const [data, setData] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  React.useEffect(() => {
    async function fetchData() {
      const [transactions, wallets, methods] = await Promise.all([
        getTransactions(),
        getWallets(),
        getMethods(),
      ]);

      setData(transactions);
      walletsCache = wallets;
      methodsCache = methods;
      setLocalWallets(wallets);
      setLocalMethods(methods);
      setLoading(false);
    }

    fetchData();
  }, []);

  // 🔎 Filtro unificado por Sid ou Conta
  const filteredData = React.useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data;
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(term) ||
        item.account.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData.map(({ id }) => id),
    [filteredData]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[35px] w-[370px]" />
          <Skeleton className="h-[325px] w-full rounded-xl" />
        </div>
      ) : (
        <div>
          {/* 🔍 Campo de busca unificado */}
          <div className="flex flex-col sm:flex-row gap-3 pb-4">
            <Input
              placeholder="Buscar por Sid ou Conta"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      Nenhuma transação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 📄 Paginação */}
          <div className="flex items-center justify-between py-5">
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Linhas por página
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20" id="rows-per-page">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </div>

              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}>
                  <ChevronsLeftIcon />
                </Button>
                <Button variant="outline" className="size-8" size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}>
                  <ChevronLeftIcon />
                </Button>
                <Button variant="outline" className="size-8" size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}>
                  <ChevronRightIcon />
                </Button>
                <Button variant="outline" className="hidden size-8 lg:flex" size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}>
                  <ChevronsRightIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 🧲 Linha arrastável
function DraggableRow({ row }: { row: Row<Transaction> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id });
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}

// 📜 Detalhes da transação
function TableCellViewer({ item }: { item: Transaction }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          onClick={() => handleTransactionDetails(item.id)}
          variant="link"
          className="w-fit px-0 mx-0 text-left text-foreground"
        >
          {shortenUUID(item.id, 7)}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>Detalhes da Transação</SheetTitle>
          <SheetDescription>{item.id}</SheetDescription>
        </SheetHeader>
        <div className="text-sm flex flex-1 flex-col gap-3 overflow-y-auto mx-5 mt-3">
          <div className="grid grid-cols-2">
            <p className="font-bold">Data</p>
            <p className="text-muted-foreground">{formatDate(item.dateCreated)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Método</p>
            <p className="text-muted-foreground">{getPayMethodNameByWalletId(item.walletId)}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">{item.isReceived ? "Emissor" : "Beneficiário"}</p>
            <p className="text-muted-foreground">{item.name}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Conta</p>
            <p className="text-muted-foreground">{item.account}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Montante</p>
            <p className="text-muted-foreground">{formatCurrency(Number(item.amount))}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-bold">Taxa</p>
            <p className="text-muted-foreground">{formatCurrency(Number(item.tax))}</p>
          </div>
        </div>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
