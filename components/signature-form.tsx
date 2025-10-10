"use client"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export function SignatureForm() {
 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchData() {

    }

    fetchData();
  }, []);

  const handleClick = async () => { 
    setLoading(true);
  }
  return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><IconPlus /> Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Credenciais SparkPaga</DialogTitle>
              <DialogDescription>
                Insira os dados fornecidos pelo SparkPaga.
              </DialogDescription>
            </DialogHeader>
            
          <div className="grid gap-3">
            <Label htmlFor="description">
              Metodo
            </Label>
            <div className="col-span-3 w-full">
              <div className="relative w-full">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Metodos de Pagamento</SelectLabel>
                      <SelectItem value="apple" className="flex justify-between"><div>Ola</div><div>Mundo</div></SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div> 

          <div className="grid gap-3">
            <Label htmlFor="phone">
              Conta
            </Label>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex h-full items-center pl-3 text-muted-foreground select-none text-sm">
                +258
              </span>
              <Input
                id="phone"
                type="tel"
                className="w-full pl-14 h-10 outline-none border border-input rounded-md text-sm shadow-sm focus:ring-1 focus:ring-ring"
                placeholder="84xxxxxxx"
              />
            </div>
          </div>


            <DialogFooter>
              <Button onClick={handleClick} type="button" disabled={loading}>
              Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}
