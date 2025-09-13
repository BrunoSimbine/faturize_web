"use client"


import Link from "next/link"
import { ApiKeyTable } from "@/components/apikey-table"

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


        <ApiKeyTable />

      </div>

    </div>
  );
}