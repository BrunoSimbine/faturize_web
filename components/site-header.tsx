"use client"
import { BadgeCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

import { getCompany } from '@/services/api';

 
export function SiteHeader() {

  type Company = {
    name: string;
    imageUrl: string;
    description: string;
    id: string;
    packageId: string;
    packageExpires: string;
    dateCreated: string;
    dateUpdated: string;
  };

  const [company, setCompany] = useState<Company>({
    name: " ",
    imageUrl: " ",
    description: " ",
    id: " ",
    packageId: " ",
    packageExpires: " ",
    dateCreated: " ",
    dateUpdated: " ",
  });

  useEffect(() => {
    async function fetchData() {

      const myCompany = await getCompany();
      setCompany(myCompany);
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
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
          {company.packageId}
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
