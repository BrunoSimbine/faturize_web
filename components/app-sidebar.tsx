"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconListDetails,
  IconReport,
  IconSettings,
  IconCreditCard,
  IconBusinessplan,
  IconPackages,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { LogoImage } from "@/components/logo-image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    /*
    {
      title: "Faturas",
      url: "/orders",
      icon: IconReceiptDollar,
    },
    */
    {
      title: "Carteiras",
      url: "/wallets",
      icon: IconCreditCard,
    },
    {
      title: "Transações",
      url: "/transactions",
      icon: IconListDetails,
    },
    {
      title: "Assinaturas",
      url: "/signature",
      icon: IconPackages,
    },
    /*
    {
      title: "Colaboradores",
      url: "/users",
      
      icon: IconUsers,
    },
    
    {
      title: "Desenvolvedores",
      url: "/developers",
      icon: IconUserCode,
    },
    */
  ],
  navClouds: [
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configuracoes",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Actividades",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Alertas",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Creditos",
      url: "#",
      icon: IconBusinessplan,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <LogoImage />
              </a> 
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
