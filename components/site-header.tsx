"use client"
import { BadgeCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

import { getCompany, getSignature, getPackage } from '@/services/api';

 
export function SiteHeader() {

  type Company = {
    name: string;
    imageUrl: string;
    description: string;
    id: string;
    dateCreated: string;
    dateUpdated: string;
  };

  type Signature = {
    dateCreated: string;
    dateUpdated: string;
    id: string;
    packageId: string;
    companyId: string;
    orderId: string;
    isActive: boolean;
    expires: string;
  };

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
  };

  const [company, setCompany] = useState<Company>({
    name: " ",
    imageUrl: " ",
    description: " ",
    id: " ",
    dateCreated: " ",
    dateUpdated: " ",
  });

  const [signature, setSignature] = useState<Signature>({
    dateCreated: "",
    dateUpdated: "",
    id: "",
    packageId: "",
    companyId: "",
    orderId: "",
    isActive: false,
    expires: "",
  });

  const [systemPackage, setSystemPackage] = useState<Package>({
    id: "",
    name: "",
    description: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    devices: 0,
    users: 0,
    dateCreated: "",
    dateUpdated: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const myCompany = await getCompany();
        const mySignature = await getSignature();

        setCompany(myCompany);
        setSignature(mySignature);
        console.log(signature);

        // Busca o pacote inicial
        if (mySignature.packageId) {
          const myPackage = await getPackage(mySignature.packageId);
          setSystemPackage(myPackage);
        }

        // Atualiza o pacote a cada 2 segundos
        const intervalId = setTimeout(async () => {
          if (mySignature.packageId) {
            const myPackage = await getPackage(mySignature.packageId);
            setSystemPackage(myPackage);
          }
        }, 2000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    fetchData();
  }, []);


  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{company.name}</h1>

        {systemPackage.name && (
          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600"
          >
            <BadgeCheckIcon className="mr-1 h-4 w-4" />
            {systemPackage.name}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
