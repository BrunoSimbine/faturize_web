"use client"

import { useState, useEffect } from "react"

import { Calendar } from "@/components/ui/calendar"
import { isBefore, startOfDay } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { IconPlus } from "@tabler/icons-react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMethods, createOrder } from '@/services/api';
import { Label } from "@/components/ui/label"

export function OrdersDialog() {

  type PaymentMethod = {
    id: string;
    name: string;
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [amount, setAmount] = useState('');
  const [payMethodId, setPayMethodId] = useState('');
  const [payerAccount, setPayerAccount] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleClick = async () => {
    setLoading(true);
    try {

      if (!date) {
        // Mostrar erro ou impedir submissão
        console.error("A data está indefinida");
        return;
      }
      // Simulando uma ação async, como login
      await createOrder({amount: parseFloat(amount), payMethodId: payMethodId, account: payerAccount, expires: date.toISOString()});
      setOpen(false);
      setAmount('')
      setPayerAccount('')

      window.location.reload();
    } catch (err) {
      console.error('Erro ao logar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const idSelecionado = event.target.value;
    setPayMethodId(idSelecionado);
    console.log('ID selecionado:', idSelecionado);
  };

  useEffect(() => {
    async function fetchData() {

      const payMethods = await getMethods();
      setPayMethodId(payMethods[0].id);
      setMethods(payMethods);
    }

    fetchData();
  }, []);

 return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="secondary"><IconPlus /> Adicionar</Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Gerar Fatura</DialogTitle>
      </DialogHeader>
      <div className="grid gap-3 py-2">
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="amount" className="text-right">
      Valor
    </Label>
    <div className="col-span-3 flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring focus-within:border-black">
      <span className="text-muted-foreground mr-2 select-none">MZN</span>
      <input
        id="amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        inputMode="decimal"
        className="w-full bg-transparent outline-none border-0 p-0 text-sm"
        placeholder="0.00"
      />
    </div>
  </div>
  
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="description" className="text-right">
      Metodo
    </Label>
    <div className="col-span-3 w-full">
      <div className="relative w-full">
        <select
          id="custom-select"
          name="custom-select"
          value={payMethodId}
          onChange={handleMethodChange}
          className="appearance-none w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm transition focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        >
          {methods.map((method) => {
            return (
              <option key={method.id}>{method.name}</option>
            )
          })}
        </select>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="phone" className="text-right">
      Conta
    </Label>
    <div className="col-span-3 flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring focus-within:border-black">
      <span className="text-muted-foreground mr-2 select-none">+258</span>
      <input
        id="phone"
        type="text"
        value={payerAccount}
        onChange={e => setPayerAccount(e.target.value)}
        className="w-full bg-transparent outline-none border-0 p-0 text-sm"
        placeholder="84xxxxxxx"
      />
    </div>
  </div>

  <div className="grid grid-cols-4 items-center items-start gap-4 hidden sm:block">
    <Label htmlFor="description" className="text-right">
      Validade
    </Label>
    <div className="flex justify-center items-center ">
      <div className="flex justify-center mx-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
        />
      </div>
    </div>
  </div>

  <div className="grid grid-cols-4 gap-4 sm:hidden">
    <div className="col-span-4 flex justify-center ">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) =>
          isBefore(startOfDay(date), startOfDay(new Date()))
        }
      />
    </div>
  </div>



</div>

      <DialogFooter>
        <Button type="button" disabled={loading} onClick={handleClick}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Aguarde
            </>
          ) : (
            'Salvar'
          )}
        </Button>  
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )

}