"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/services/auth';
import { createCompany, getCompanies, refreshToken } from '@/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { IconPlus } from "@tabler/icons-react";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Company = {
  name: string;
  imageUrl: string;
  description: string;
  id: string;
  dateCreated: string;
  dateUpdated: string;
};

function daysSince(dateString: string): number {
  const inputDate = new Date(dateString); // datetime da API
  const now = new Date();

  const startOfInput = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffInMs = startOfNow.getTime() - startOfInput.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Calcula a diferença em dias
}

export default function Company() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchCompanies = async () => {
      try {
        const companiesResponse = await getCompanies();
        setCompanies(companiesResponse);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
      }
    };

    fetchCompanies();
  }, [router]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await createCompany({ name, description, imageUrl: 'default.png' });
      setName('');
      setDescription('');
      setLoading(false);
      setOpen(false);
      window.location.reload(); // Reload the page after creating the company
    } catch (error) {
      console.error(error);
      setLoading(false); // Reset loading state in case of error
    }
  };

  const handleConnect = async (id: string) => {
    await refreshToken(id);
    router.replace('/dashboard');
  };

  const renderCompanyCard = (company: Company) => (
    <div key={company.id} className="w-full">
      <div className="relative group">
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
          <img
            src="https://minio.faturizze.com/statics/project.jpg"
            alt="Imagem"
            className="w-full h-full object-cover"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleConnect(company.id)}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1"
          >
            Conectar
          </Button>
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
        <div className="text-sm font-medium">{company.name}</div>
        <div className="text-xs text-muted-foreground">{daysSince(company.dateCreated)} dias atrás</div>
      </div>
    </div>
  );

  return (
    <div className="mx-3">
      <Navbar />
      <div className="mt-3 flex justify-between container mx-auto">
        <h2 className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
          Projectos
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <IconPlus /> Adicionar
            </Button>
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
        {companies.map(renderCompanyCard)}
      </div>
    </div>
  );
}
