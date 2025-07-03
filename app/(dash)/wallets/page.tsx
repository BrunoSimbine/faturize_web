"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"

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
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Separator } from "@/components/ui/separator"

export default function SharePage() {
  return (
    <div className="p-2 mt-4 md:px-3">
      <div className="border-b pb-2 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Gateways de Pagamento</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Adicionar Gateway</CardTitle>
          <CardDescription>
            Configure um novo método de pagamento para sua plataforma.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex space-x-2">
            <div className="flex w-full flex-col gap-6">
              <Tabs defaultValue="smart">
                <TabsList className="mb-3">
                  <TabsTrigger value="smart">SimGateway</TabsTrigger>
                  <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
                </TabsList>

                <TabsContent value="smart">
                  <Card>
                    <CardHeader>
                      <CardTitle>Credenciais SimGateway</CardTitle>
                      <CardDescription>
                        Insira os dados fornecidos pelo SimGateway.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="nome">Nome</Label>
                        <Input id="nome" placeholder="Nome do gateway" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="public-key">Chave Pública</Label>
                        <Input id="public-key" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="private-key">Chave Privada</Label>
                        <Input id="private-key" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Salvar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="mpesa">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuração M-Pesa</CardTitle>
                      <CardDescription>
                        Preencha os campos abaixo para integrar o M-Pesa.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="consumer-key">Consumer Key</Label>
                        <Input id="consumer-key" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="consumer-secret">Consumer Secret</Label>
                        <Input id="consumer-secret" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Salvar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="text-sm font-medium">
              Métodos de pagamento ativos
            </div>
            <div className="grid gap-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatars/03.png" alt="Imagem do usuário" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">+258841234567</p>
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
                    <DropdownMenuItem>Desativar</DropdownMenuItem>
                    <DropdownMenuItem>Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
