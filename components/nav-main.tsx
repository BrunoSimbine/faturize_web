"use client"

import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
}) {

  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname.startsWith(item.url)
            return (
                <SidebarMenuItem
                  key={item.title}
                  className={isActive 
                    ? "bg-accent text-accent-foreground rounded-md transition-colors hover:text-accent-foreground text-lg" 
                    : "text-muted-foreground transition-colors hover:text-foreground text-lg"
                  }
                >
                  <Link href={item.url}>

                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span className="text-base my-1">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>

  )
}
