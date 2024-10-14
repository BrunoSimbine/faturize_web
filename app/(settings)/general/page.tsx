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


export default function General() {
  return (
    <>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Nome Comercial</CardTitle>
          <CardDescription>
            Usado como identificador no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Empresa, LTD" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Editar</Button>
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Endereco</CardTitle>
          <CardDescription>
            Localizacao fiscal para correspondencias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Empresa, LTD" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Editar</Button>
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>NUIT</CardTitle>
          <CardDescription>
            Para questoes fiscais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Empresa, LTD" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Editar</Button>
        </CardFooter>
      </Card>
    </> 
  )
}
