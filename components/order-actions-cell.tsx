// components/order-actions-cell.tsx
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { MoreVerticalIcon } from "lucide-react"
import { isBefore, startOfDay } from "date-fns"

import { cancelOrder, extendOrder, manualConfirmOrder } from '@/services/api';
import type { Row } from "@tanstack/react-table"

type OrderType = {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  amount: number;
  paid: number;
  expires: string;
  status: number;
};

export function OrderActionsCell({ row }: { row: Row<OrderType> }) {
  const [openManual, setOpenManual] = React.useState(false)
  const [openCancel, setOpenCancel] = React.useState(false)
  const [openExtend, setOpenExtend] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())

  const handleManualConfirm = async () => {
    try {
      await manualConfirmOrder(row.original.id)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
    setOpenManual(false)
  }

  const handleCancelConfirm = async () => {
    try {
      await cancelOrder(row.original.id)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
    setOpenCancel(false)
  }

  const handleExtendConfirm = async () => {
    if (!selectedDate) return
    try {
      await extendOrder({ orderId: row.original.id, expires: selectedDate.toISOString() })
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
    setOpenExtend(false)
  }

  const isStatus0 = row.original.status === 0 // Pendente
  const isStatus1 = row.original.status === 1 // Pago
  const isStatus2 = row.original.status === 2 // Expirado
  const isStatus3 = row.original.status === 3 // Cancelado

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setOpenManual(true)} disabled={!isStatus0}>
            Pagamento Manual
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenExtend(true)} disabled={isStatus1 || isStatus3}>
            Prorrogar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenCancel(true)} disabled={isStatus1 || isStatus2 || isStatus3}>
            Cancelar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pagamento Manual */}
      <AlertDialog open={openManual} onOpenChange={setOpenManual}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pagamento manual?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja marcar este pagamento como manual? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleManualConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancelamento */}
      <AlertDialog open={openCancel} onOpenChange={setOpenCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja cancelar este item? Esta ação é permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>Sim, Cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Prorrogação */}
      <Drawer open={openExtend} onOpenChange={setOpenExtend}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Prorrogar expiração</DrawerTitle>
            <DrawerDescription>Escolha uma nova data de expiração para esta ordem.</DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
            />
          </div>

          <DrawerFooter>
            <Button onClick={handleExtendConfirm} disabled={!selectedDate}>
              Confirmar nova data
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
