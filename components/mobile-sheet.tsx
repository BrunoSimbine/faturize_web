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
    {name: "Settings", href: "/settings"},
  ]

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


export function MobileSheet() {

  const pathname = usePathname()

  return (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>

              {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href) 
               return (
                  <Link
                    href={link.href}
                    className={isActive ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground" }
                   >
                   {link.name}
                   </Link>
                )
            })}
            </nav>
          </SheetContent>
        </Sheet>
  );
}
