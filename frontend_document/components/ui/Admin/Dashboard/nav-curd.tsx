"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn-ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/shadcn-ui/sidebar"

import { AirVent } from 'lucide-react';
export function NavCRUD() {
    const items = [{
        name: "Quản lý tài liệu",
        url: "#",
        icon: AirVent,
    },
    {
        name: "Quản lý người dùng",
        url: "#",
        icon: AirVent,
    },
    {
        name: "Quản lý lịch sử",
        url: "#",
        icon: AirVent,
    },
    {
        name: "Quản lý thông báo",
        url: "#",
        icon: AirVent,
    },
    {
        name: "Quản lý danh mục",
        url: "#",
        icon: AirVent,
    }]
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quản lý dữ liệu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
