"use client"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
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

import { getAllMethods, createWallet } from '@/services/api';


export function SparkpagaForm() {

  type PaymentMethod = {
    id: string;
    name: string;
    dateCreated: string;
    dateUpdated: string;
  };
 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>({
    id: "",
    name: "",
    dateCreated: "",
    dateUpdated: ""
  });
  const [clientId, setClientId] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [label, setLabel] = useState('');
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function fetchData() {

      const payMethods = await getAllMethods();;
      setSelectedMethod(payMethods[0]);
      console.log(selectedMethod);
      setMethods(payMethods);
    }

    fetchData();
  }, []);

  const handleClick = async () => { 

    setLoading(true);
    try {
      if (!selectedMethod) {
        toast("Falha a criar carteira", {
          description: "Seleciona um metodo",
        })
      } else {
        // Simulando uma ação async, como login
        if(selectedMethod.id == ""){
          console.log("Nao ha nada!");
        }
        await createWallet({clientId: clientId, publicKey: publicKey, label: label, payMethodId: selectedMethod.id, account: "+258"+account});
        setAccount('')
        setClientId('')
        setPublicKey('')
        setLabel('')
        setOpen(false);
        window.location.reload();        
      }

    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response: { data: { type?: string; solution?: string } } };

        toast(error.response.data.type || "Falha ao criar carteira", {
          description: error.response.data.solution || "Não foi possível criar uma carteira",
        });
      } else {
        toast("Erro inesperado", {
          description: "Algo correu mal. Tente novamente.",
        });
      }
    } finally {
      setLoading(false);
    }

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
            <Label htmlFor="label">Label</Label>
            <Input
              id="client-label"
              className="text-sm"
              value={label}
              onChange={e => setLabel(e.target.value)}
              />
          </div>


          <div className="grid gap-3">
            <Label htmlFor="description">
              Metodo
            </Label>
            <div className="col-span-3 w-full">
              <div className="relative w-full">
                <Select
                  onValueChange={(value) => {
                    const method = methods.find((m) => m.id === value);
                    if (method) { setSelectedMethod(method); console.log(method)}
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Metodos de Pagamento</SelectLabel>
                        {methods.map((item) => (
                              <SelectItem key={item.id} value={JSON.stringify({ id: item.id, name: item.name })}>
                                {item.name}
                              </SelectItem>
                        ))}
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
                value={account}
                onChange={e => setAccount(e.target.value)}
                className="w-full pl-14 h-10 outline-none border border-input rounded-md text-sm shadow-sm focus:ring-1 focus:ring-ring"
                placeholder="84xxxxxxx"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="public-key">Id do Cliente</Label>
            <Input
              id="client-od"
              className="text-sm"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="private-key">Chave Publica</Label>
            <Input
              id="public-key"
              className="text-sm"
              value={publicKey}
              onChange={e => setPublicKey(e.target.value)}
              />
          </div>

            <DialogFooter>
              <Button onClick={handleClick} type="button" disabled={loading}>
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
