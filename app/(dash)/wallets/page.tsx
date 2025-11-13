"use client";

import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"

import { getWallets, activateWallet } from "@/services/api";
import { SparkpagaForm } from "@/components/sparkpaga-form";

// Tipagem para facilitar a leitura do código

type Wallet = {
  id: string;
  clientId: string;
  publicKey: string;
  label: string;
  payMethodId: string;
  account: string;
  accountName: string;
  isActive: boolean;
};

const WalletItem = ({ wallet, onActivate }: { wallet: Wallet; onActivate: () => void }) => {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/avatars/03.png" alt="Imagem do usuário" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">
            {wallet.label} -{" "}
            <span
              className={`${
                wallet.isActive ? "text-green-600" : "text-red-600"
              } font-semibold`}
            >
              {wallet.isActive ? "Ativa" : "Inativa"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">{wallet.account}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={onActivate}>Ativar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default function SharePage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  // Filtrando as carteiras ativas
  const activeWallets = wallets.filter(wallet => wallet.isActive);

  useEffect(() => {
    const fetchData = async () => {
      const myWallets = await getWallets();
      setWallets(myWallets);

    };
    
    fetchData();
  }, []);


  const handleActivateWallet = async (walletId: string) => {
    try
    {
      await activateWallet(walletId);
      window.location.reload();
    }catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as { response: { data: { type?: string; solution?: string } } };

        toast(error.response.data.type || "Falha ao ativar a carteira", {
          description: error.response.data.solution || "Não foi possível ativar a carteira",
        });
      } else {
        toast("Erro inesperado", {
          description: "Algo correu mal. Tente novamente.",
        });
      }
    }

  };

  return (
    <div className="mx-3 flex flex-col gap-2 py-4 md:py-6 p-2 md:px-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Carteiras</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Adicionar Carteira</CardTitle>
          <CardDescription>Configure uma nova carteira para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <SparkpagaForm />
          <Separator className="my-4" />
          <div className="space-y-4">
            {/* Exibindo o número de carteiras ativas e disponíveis */}
            <div className="text-sm font-medium">
              Carteiras ativas ({activeWallets.length}/{wallets.length})
            </div>
            <div className="grid gap-6">
              {wallets.map(wallet => (
                <WalletItem key={wallet.id} wallet={wallet} onActivate={() => handleActivateWallet(wallet.id)} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
