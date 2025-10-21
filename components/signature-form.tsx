"use client"
import { useState, useEffect } from "react"
import { getPackages, createSignature } from '@/services/api'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SignatureForm() {
  type Package = {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    devices: number;
    users: number;
    dateCreated: string;
    dateUpdated: string;
  }

  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const myPackages = await getPackages()
      setPackages(myPackages)
    }
    fetchData()
  }, [])

  // Validação de número moçambicano
  const validatePhone = (value: string): boolean => {
    const regex = /^(84|85|86|87)\d{7}$/ // começa com 84,85,86,87 + 7 dígitos = 9 total
    return regex.test(value)
  }

  const handleClick = async () => {
    if (!validatePhone(phone)) {
      toast("Falha ao gerar fatura", {
        description: "Insira um numero M-Pesa ou eMola valido!",
      });
      return
    }

    setError("")
    setLoading(true)
    await createSignature({ packageId: selectedPackage, account: "+258" + phone, isYearly: false })
    setLoading(false)
    window.location.reload()
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // remove qualquer caractere não numérico
    if (value.length <= 9) setPhone(value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-3"><IconPlus /> Adicionar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assinaturas</DialogTitle>
          <DialogDescription>
            Renovar Assinatura.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Label htmlFor="package">Pacote</Label>
          <Select value={selectedPackage} onValueChange={setSelectedPackage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um pacote" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pacotes Disponíveis</SelectLabel>
                {packages.map(pkg => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.monthlyPrice} MTn/mês
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="phone">Contacto (Para Pagamento)</Label>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex h-full items-center pl-3 text-muted-foreground select-none text-sm">
              +258
            </span>
            <Input
              id="phone"
              type="tel"
              className={`w-full pl-14 h-10 outline-none border rounded-md text-sm shadow-sm focus:ring-1 ${error ? "border-red-500" : "border-input"}`}
              placeholder="84xxxxxxx"
              value={phone}
              onChange={handlePhoneChange}
            />
          </div>
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>

        <DialogFooter>
          <Button onClick={handleClick} type="button" disabled={loading}>
            {loading ? "Enviando Fatura..." : "Assinar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
