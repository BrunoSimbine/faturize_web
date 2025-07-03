"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';
import { getToken } from '@/services/auth';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";



import { useState, useEffect } from 'react';
import { IconPlus } from "@tabler/icons-react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

import { createCompany, getCompanies, refreshToken } from '@/services/api';

export default function Company() {

  type Company = {
    name: string;
    imageUrl: string;
    description: string;
    id: string;
    dateCreated: string;
    dateUpdated: string;
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    const token = getToken();
    if(token)
    {
      const fetchCompanies = async () => {
        try {
          const companiesResponse = await getCompanies();
          setCompanies(companiesResponse);
        } catch (error) {
          console.error("Erro ao buscar empresas:", error);
        }
      };

      fetchCompanies();
    }else{
      router.replace('/login');
    }

  }, [router]);

  const handleSave = async () => {

    setLoading(true);

    try {
       await createCompany({
        name: name,
        description: description,
        imageUrl: 'default.png'

      });

      setName('');
      setDescription('');
      setLoading(false);
      // Fechar o diálogo
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }

  };

  const handleConnect = async (id: string) => {
    await refreshToken(id);

    router.replace('/dashboard');
  };


  return (
    <div className="mx-3">
      <Navbar />
      <div className="mt-3 flex justify-between container mx-auto">
        <h2 className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Projectos
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><IconPlus /> Adicionar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Projecto</DialogTitle>
              <DialogDescription>
                Adicione um projecto clicando em adicionar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Nome
                </Label>
                <Input
                  id="company"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>

            </div>
            <DialogFooter>
              <Button onClick={handleSave} type="button" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        
      </div>
      <div className="m-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 container mx-auto">

{companies.map((company) => (
  <div key={company.id} className="w-full">
    <div className="relative group">
      {/* Imagem com botões sobrepostos */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
        <img
          src="http://173.249.17.22:9000/faturize/foto.jpg"
          alt="Image"
          className="w-full h-full object-cover"
        />

        {/* Botão inferior direito - "Conectar" */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleConnect(company.id)}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1"
        >
          Conectar
        </Button>

        {/* Dropdown canto superior direito - visível no hover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Remover</DropdownMenuItem>
            <DropdownMenuItem>Detalhes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Informações abaixo da imagem */}
      <div className="text-sm font-medium">{company.name}</div>
      <div className="text-xs text-muted-foreground">Updated 6 days ago</div>
    </div>
  </div>
))}



      </div>
    </div>
  );
}


