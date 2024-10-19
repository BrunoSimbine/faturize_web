"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"


const navLinks = [
    {name: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" />},
    {name: "Playground", href: "/playground", icon: <Users className="h-4 w-4" />},
    /*
    {name: "Transacoes", href: "/orders", icon: <ShoppingCart className="h-4 w-4" />},
    {name: "Developer", href: "/developer", icon: <Users className="h-4 w-4" />},
    {name: "PagOnline", href: "/payments", icon: <Users className="h-4 w-4" />},
    
    {name: "Produtos", href: "/products", icon: <Package className="h-4 w-4" /> },
    {name: "Servicos", href: "/services", icon: <Package className="h-4 w-4" /> },
    */
    {name: "Usuarios", href: "/users", icon: <Users className="h-4 w-4" />},
    {name: "Clientes", href: "/clients", icon: <Users className="h-4 w-4" />},
    /*
    {name: "Notificacoes", href: "/notofications", icon: <Users className="h-4 w-4" />},
    */

    
  ]

export function DashboardNavbar() {


  const pathname = usePathname()
  return (
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href) 
               return (
                  <Link
                    href={link.href}
                    className={isActive ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary" : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" }
                   >
                   {link.icon}
                   {link.name}
                   </Link>
                )
            })}

          </nav>

  );
}
