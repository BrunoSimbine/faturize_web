"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Link from "next/link"

export default function DevelopersPage() {

  return (
    <div className="p-2 mt-4 md:px-3">
      <div className="border-b pb-2 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Developers</h1>

      </div>

      <div className="space-y-4 my-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Chaves da API</h2>
            <p className="text-sm text-muted-foreground">
              Crie uma chave que libera acesso total à API, permitindo ampla interação com sua conta.{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Saiba mais
              </Link>
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>TOKEN</TableHead>
              <TableHead>ÚLTIMO USO</TableHead>
              <TableHead>CRIAÇÃO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Chave Padrao</TableCell>
              <TableCell className="truncate max-w-xs">
                pk_test_51iRfh0...
              </TableCell>
              <TableCell>29 de jun.</TableCell>
              <TableCell>29 de jun.</TableCell>
              <TableCell className="text-right">...</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>







      <div className="space-y-4 my-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Webhooks</h2>
            <p className="text-sm text-muted-foreground">
                Informe a URL que será chamada sempre que ocorrerem eventos importantes. 
              <Link href="#" className="text-blue-600 hover:underline">
                Saiba mais
              </Link>
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead>TIPO</TableHead>
              <TableHead>ULTIMO USO</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>https://api.example.com</TableCell>
              <TableCell className="truncate max-w-xs">
                Direct
              </TableCell>
              <TableCell>29 de jun.</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell className="text-right">...</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>


    </div>
  );
}