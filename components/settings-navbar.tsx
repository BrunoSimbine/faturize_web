"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"


const navLinks = [
    {name: "Geral", href: "/general"},
    {name: "Seguranca", href: "/security"},
    {name: "Suporte", href: "/support"}
  ]

export function SettingsNavbar() {


  const pathname = usePathname()
  return (
          <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href) 
               return (
                  <Link
                    href={link.href}
                    className={isActive ? "font-semibold text-primary" : " " }
                   >
                   {link.name}
                   </Link>
                )
            })}

          </nav>
  );
}
