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

import { AirVent, ChartNoAxesGantt, Book, UserRound, History, Bell, ChartColumnStacked, Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';

export function NavCRUD() {
    const [isPending, startTransition] = useTransition();
    const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
    const pathname = usePathname();

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

    const { isMobile } = useSidebar();
    const router = useRouter();
    const handleNavigation = (url: string) => {
        if (url === "#" || pathname === url) return;

        setLoadingUrl(url);

        // Trigger global loading
        if ((window as any).startPageTransition) {
            (window as any).startPageTransition();
        }

        startTransition(() => {
            router.push(url);
            // Reset loading state sau khi navigate
            setTimeout(() => {
                setLoadingUrl(null);
                if ((window as any).stopPageTransition) {
                    (window as any).stopPageTransition();
                }
            }, 600);
        });
    };

    const isCurrentPage = (url: string) => pathname === url;
    const isLoading = (url: string) => loadingUrl === url && isPending;
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">            <SidebarMenuButton asChild>
            <button
                type="button"
                onClick={() => handleNavigation("/admin/dashboard")}
                className={`flex items-center gap-2 w-full text-left transition-all duration-200 ${isCurrentPage("/admin/dashboard")
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    } ${isLoading("/admin/dashboard") ? "opacity-70" : ""}`}
                disabled={isLoading("/admin/dashboard")}
            >
                {isLoading("/admin/dashboard") ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <ChartNoAxesGantt />
                )}
                <span>Trang chủ</span>
                {isLoading("/admin/dashboard") && (
                    <div className="ml-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                )}
            </button>
        </SidebarMenuButton>
            <SidebarGroupLabel>Quản lý dữ liệu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>                        <SidebarMenuButton asChild>
                        <button
                            type="button"
                            onClick={() => handleNavigation(item.url)}
                            className={`flex items-center gap-2 w-full text-left transition-all duration-200 ${isCurrentPage(item.url)
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                } ${isLoading(item.url) ? "opacity-70" : ""} ${item.url === "#" ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={isLoading(item.url) || item.url === "#"}
                        >
                            {isLoading(item.url) ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                item.icon && <item.icon />
                            )}
                            <span>{item.name}</span>

                            {/* Loading indicator */}
                            {isLoading(item.url) && (
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                            )}

                            {/* Current page indicator */}
                            {isCurrentPage(item.url) && !isLoading(item.url) && (
                                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}

                            {/* Disabled indicator */}
                            {item.url === "#" && (
                                <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">Soon</div>
                            )}
                        </button>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
