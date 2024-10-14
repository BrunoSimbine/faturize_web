import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"


export default function Security() {
  return (
    <>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Senha</CardTitle>
          <CardDescription>
            Selecione editar para alterar a senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="*********" defaultValue="************" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Editar</Button>
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Autenticacao de 2 factores</CardTitle>
          <CardDescription>
            Adicione uma cama extra de seguranca.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input
              placeholder="Project Name"
              defaultValue="+258847942230"
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="include" defaultChecked />
              <label
                htmlFor="include"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Activar autenticacao de dois factores.
              </label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Editar</Button>
        </CardFooter>
      </Card>
    </> 
  )
}
