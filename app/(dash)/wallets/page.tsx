"use client"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
import { useState, useEffect } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"

import { getWallets, deleteWallet } from '@/services/api';
import { SparkpagaForm } from "@/components/sparkpaga-form"

export default function SharePage() {

  type Wallet = {
    id: string;
    clientId: string;
    publicKey: string;
    label: string;
    payMethodId: string;
    account: string;
    accountName: string;
  };

  const [wallets, setWallets] = useState<Wallet[]>([]);


  useEffect(() => {
    async function fetchData() {
      const myWallets = await getWallets();
      setWallets(myWallets);
    }

    fetchData();
  }, []);

  return (
    <div className="mx-3 flex flex-col gap-2 py-4 md:py-6 p-2  md:px-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Carteiras</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Adicionar Carteira</CardTitle>
          <CardDescription>
            Configure uma nova carteira para sua conta.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <SparkpagaForm />

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="text-sm font-medium">
              Carteiras ativas
            </div>
            <div className="grid gap-6">

              {wallets.map((item) => (

                <div key={item.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="/avatars/03.png" alt="Imagem do usuário" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.account}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                        size="icon"
                      >
                        <MoreVerticalIcon />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem
                        onClick={async () => {
                          await deleteWallet(item.id);
                          window.location.reload();
                        }}
                      >
                        Apagar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

              ))}

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
