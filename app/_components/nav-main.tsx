"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  label,
}: {
  label?: string;
  items: {
    title: string;
    url?: string;
    icon?: React.FC<React.SVGProps<SVGElement>> | LucideIcon | string | null;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items?.map((item, idx) =>
          item.items?.length ? (
            <Collapsible
              key={item.title + idx}
              asChild
              defaultOpen={item.items.some(
                (subItem) =>
                  pathname.startsWith(subItem.url) || pathname.startsWith(item.url!),
              )}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "font-medium hover:bg-secondary",
                      (item.items.some((subItem) => pathname.startsWith(subItem.url)) ||
                        pathname.startsWith(item.url!)) &&
                        "bg-primary! text-primary-foreground!",
                    )}
                    tooltip={item.title}
                  >
                    {item.url ? (
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 hover:underline"
                      >
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                      </Link>
                    ) : (
                      <>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                      </>
                    )}
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mr-0 pr-0">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className={cn(
                            "text-xs font-medium hover:bg-secondary",
                            pathname.startsWith(subItem.url) && "bg-secondary! text-primary!",
                          )}
                          asChild
                        >
                          <Link href={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title + idx}>
              <SidebarMenuButton
                className={cn(
                  "font-medium hover:bg-secondary",
                  pathname.startsWith(item.url!) && "bg-primary! text-primary-foreground!",
                )}
                tooltip={item.title}
                asChild
              >
                <Link href={item.url!}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
