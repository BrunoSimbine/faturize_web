"use client"
import { OrdersDialog } from "@/components/orders-dialog";
import { getAllOrders, getMethods } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton"
import type { UniqueIdentifier } from '@dnd-kit/core';

import { OrderActionsCell } from "@/components/order-actions-cell"

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

import * as React from "react"

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  LoaderIcon,
  ClockIcon,
  XCircleIcon,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


function formatDate(inputDate: string): string {
    const date = new Date(inputDate);

    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day: number = date.getDate();
    const month: string = months[date.getMonth()];

    const hour: string = date.getHours().toString().padStart(2, '0');

    return `${day} ${month}, ${hour}h`;
}

function shortenUUID(uuid: string, size: number): string {
    return uuid.substring(0, size);
}

export const schema = z.object({
  id: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string(),
  amount: z.number(),
  paid: z.number(),
  expires: z.string(),
  status: z.number(),
})



const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left pl-2">Id</div>,
    cell: ({ row }) => (
      <TableCellViewer item={row.original} />
    ),
    enableHiding: true,
    meta: {
      hidden: true
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left text-xs">Montante</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MZN",
      }).format(amount)

      return <div className="text-left font-bold">{formatted}</div>
    },
  },
  {
    accessorKey: "paid",
    header: () => <div className="text-left hidden md:block">Pago</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("paid"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MZN",
      }).format(amount)

      return <div className="text-left font-medium hidden md:block">{formatted}</div>
    },
  },
  {
    accessorKey: "dateCreated",
    header: () => <div className="text-left text-xs">Criado</div>,
    cell: ({ row }) => {
      const date = row.getValue("dateCreated") as string;

      return <div className="text-left font-medium">{formatDate(date)}</div>
    },
  },
  {
    accessorKey: "expires",
    header: () => (
      <div className="text-left hidden sm:block">Expira</div>
    ),
    cell: ({ row }) => {
      const date = row.getValue("expires") as string;

      return (
        <div className="text-left font-medium hidden sm:block">
          {formatDate(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-left hidden lg:block">Descricao</div>
    ),
    cell: () => {
      return (
        <div className="text-left font-medium hidden lg:block">
          Mensalidade Junho
        </div>
      );
    },
  },

{
  accessorKey: "status",
  header: () => <div className="text-left text-xs">Status</div>,
  cell: ({ row }) => (
    <Badge 
      variant="outline"
      className="flex text-muted-foreground"
    >
      {row.original.status === 0 && (
        <>
          <LoaderIcon />
          Pendente
        </>
      )}
      {row.original.status === 1 && (
        <>
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          Pago
        </>
      )}
      {row.original.status === 2 && (
        <>
          <ClockIcon className="text-yellow-500 dark:text-yellow-400" />
          Expirado
        </>
      )}
      {row.original.status === 3 && (
        <>
          <XCircleIcon className="text-red-500 dark:text-red-400" />
          Cancelado
        </>
      )}
    </Badge>
  ),
},
{
  id: "actions",
  cell: ({ row }) => <OrderActionsCell row={row} />,
}

]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}


export function OrdersTable() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {

      const orders = await getAllOrders();
      const payMethods = await getMethods();
      setData(orders);
      setMethods(payMethods);
      setLoading(false);
      console.log(methods);
      console.log(columnVisibility);
    }

    fetchData();
  }, []);

  const [data, setData] = React.useState([]);
  const [methods, setMethods] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  })

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: {
        id: false, // isso esconde a coluna 'id'
      },
      rowSelection,
      columnFilters,
      pagination,
    },

    getRowId: (row) => row?.id?.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <>
    {loading ? (
      <div className="flex flex-col space-y-3 my-2">
        <div className="flex justify-between">
          <Skeleton className="h-[35px] w-[400px]" />
          <Skeleton className="h-[35px] w-[100px]" />
        </div>

        <Skeleton className="h-[425px] w-full rounded-xl" />

      </div>
      ) : (


<div>
      <div className="py-4 flex justify-between mx-auto">
        <Input
          placeholder="Buscar Id"
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-2"
        />
        <OrdersDialog />
      </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>

      <div className="flex items-center justify-between py-5">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[15, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>

      )}
    </>
  )
}



function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 mx-0 text-left text-foreground ">
          <span className="block md:hidden">{shortenUUID(item.id, 4)}</span>
          <span className="hidden md:block">{shortenUUID(item.id, 10)}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.id}</SheetTitle>
          <SheetDescription>
            Showing total visitors for the last 6 months
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          
          
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Submit</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}


