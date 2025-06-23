"use client"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/shadcn-ui/sidebar"

import { AirVent, ChartNoAxesGantt, Book, UserRound, History, Bell, ChartColumnStacked } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NavCRUD() {
    const items = [
        {
            name: "Quản lý tài liệu",
            url: "/admin/document",
            icon: Book,
        },
        {
            name: "Quản lý người dùng",
            url: "/admin/user",
            icon: UserRound,
        },
        {
            name: "Quản lý lịch sử",
            url: "#",
            icon: History,
        },
        {
            name: "Quản lý thông báo",
            url: "#",
            icon: Bell,
        },
        {
            name: "Quản lý danh mục",
            url: "#",
            icon: ChartColumnStacked,
        }]
    const { isMobile } = useSidebar()
    const router = useRouter()
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuButton asChild>
                <button
                    type="button"
                    onClick={() => router.push("/admin/dashboard")}
                    className="flex items-center gap-2 w-full text-left"
                >
                    <ChartNoAxesGantt />
                    <span>Trang chủ</span>
                </button>
            </SidebarMenuButton>
            <SidebarGroupLabel>Quản lý dữ liệu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <button
                                type="button"
                                onClick={() => router.push(item.url)}
                                className="flex items-center gap-2 w-full text-left"
                            >
                                {item.icon && <item.icon />}
                                <span>{item.name}</span>
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
