"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

const navLinks = [
    {name: "Home", href: "/home"},
    {name: "Orders", href: "/orders"},
    {name: "Dashboard", href: "/dashboard"},
    {name: "Settings", href: "/general"},
  ]

export function Navbar() {


  const pathname = usePathname()
  return (
          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>

            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href) 
               return (
                  <Link
                    href={link.href}
                    className={isActive ? "text-foreground transition-colors hover:text-foreground" : "text-muted-foreground transition-colors hover:text-foreground" }
                   >
                   {link.name}
                   </Link>
                )
            })}

          </nav>
  );
}
