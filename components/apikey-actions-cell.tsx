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

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"

import {  } from '@/services/api';
import type { Row } from "@tanstack/react-table"

type ApiKeyType = {
  id: string
  name: string
  dateCreated: string
  dateUpdated: string
  lastActivity: string
  callbackUrl: string
}
export function ApiKeyActionsCell({ row }: { row: Row<ApiKeyType> }) {


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu {row.original.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem >
            Mudar Token
          </DropdownMenuItem>
          <DropdownMenuItem>
            Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pagamento Manual */}
      <AlertDialog >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar pagamento manual?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja marcar este pagamento como manual? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction >Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancelamento */}
      <AlertDialog >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja cancelar este item? Esta ação é permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction >Sim, Cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}
