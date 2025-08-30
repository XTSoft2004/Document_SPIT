"use client"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/shadcn-ui/sidebar"

import { AirVent, ChartNoAxesGantt, Book, UserRound, History, Bell, ChartColumnStacked, Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition, useRef, useEffect } from 'react';

interface MenuItem {
    name: string;
    url: string;
    icon: React.ComponentType<any>;
    children?: MenuItem[];
}

export function NavCRUD() {
    const [isPending, startTransition] = useTransition();
    const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const pathname = usePathname();

    const items: MenuItem[] = [
        {
            name: "Quản lý người dùng",
            url: "/admin/user",
            icon: UserRound,
        },
        {
            name: "Quản lý tài liệu",
            url: "/admin/document",
            icon: Book,
            children: [
                {
                    name: "Tất cả tài liệu",
                    url: "/admin/document",
                    icon: AirVent,
                },
                {
                    name: "Tài liệu chưa duyệt",
                    url: "/admin/document/pending",
                    icon: AirVent,
                },
                {
                    name: "Tài liệu đã từ chối",
                    url: "/admin/document/rejected",
                    icon: ChartColumnStacked,
                },
            ]
        },
        {
            name: "Quản lý khoa",
            url: "/admin/department",
            icon: Book,
        },
        {
            name: "Quản lý môn học",
            url: "/admin/course",
            icon: Book,
        },
        {
            name: "Quản lý danh mục",
            url: "/admin/category",
            icon: ChartColumnStacked,
        },
        {
            name: "Quản lý lịch sử",
            url: "/admin/history",
            icon: History,
            children: [
                {
                    name: "Tất cả lịch sử",
                    url: "/admin/history",
                    icon: History,
                },
                {
                    name: "Lịch sử đăng nhập",
                    url: "/admin/history/login",
                    icon: UserRound,
                },
                {
                    name: "Lịch sử hoạt động",
                    url: "/admin/history/activity",
                    icon: ChartColumnStacked,
                },
            ]
        },
        {
            name: "Quản lý thông báo",
            url: "#",
            icon: Bell,
            children: [
                {
                    name: "Thông báo hệ thống",
                    url: "/admin/notification/system",
                    icon: Bell,
                },
                {
                    name: "Thông báo người dùng",
                    url: "/admin/notification/user",
                    icon: UserRound,
                },
            ]
        }
    ]

    const { isMobile } = useSidebar();
    const router = useRouter();

    const toggleItem = (itemName: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(itemName)) {
            newOpenItems.delete(itemName);
        } else {
            newOpenItems.add(itemName);
        }
        setOpenItems(newOpenItems);
    };

    const isItemOpen = (itemName: string) => openItems.has(itemName);

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

    const hasActiveChild = (item: MenuItem) => {
        if (!item.children) return false;
        return item.children.some(child => pathname === child.url);
    };

    const renderMenuItem = (item: MenuItem) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = isCurrentPage(item.url) || hasActiveChild(item);
        const isOpen = isItemOpen(item.name);

        return (
            <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                    <button
                        type="button"
                        onClick={() => {
                            if (hasChildren) {
                                toggleItem(item.name);
                            } else {
                                handleNavigation(item.url);
                            }
                        }}
                        className={`flex items-center gap-2 w-full text-left transition-all duration-200 hover:scale-[1.01] group ${isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:translate-x-1"
                            } ${isLoading(item.url) ? "opacity-70" : ""} ${item.url === "#" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isLoading(item.url) || item.url === "#"}
                    >
                        {isLoading(item.url) ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            item.icon && <item.icon className="transition-transform duration-200 group-hover:scale-110" />
                        )}
                        <span className="transition-all duration-200">{item.name}</span>

                        {/* Children indicator with rotation animation */}
                        {hasChildren && (
                            <div className="ml-auto transition-transform duration-200 ease-in-out">
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4 transform rotate-0" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 transform rotate-0" />
                                )}
                            </div>
                        )}

                        {/* Loading indicator */}
                        {!hasChildren && isLoading(item.url) && (
                            <div className="ml-auto">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                        )}

                        {/* Current page indicator with glow effect */}
                        {!hasChildren && isCurrentPage(item.url) && !isLoading(item.url) && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
                        )}

                        {/* Disabled indicator with pulse */}
                        {!hasChildren && item.url === "#" && (
                            <div className="ml-auto text-xs text-gray-400 dark:text-gray-500 animate-pulse">Soon</div>
                        )}
                    </button>
                </SidebarMenuButton>

                {/* Children menu with smooth animation */}
                {hasChildren && (
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                            }`}
                    >
                        <SidebarMenuSub className="animate-in slide-in-from-top-2 duration-200">
                            {item.children!.map((child, index) => (
                                <SidebarMenuSubItem
                                    key={child.name}
                                    className={`transition-all duration-200 ease-out ${isOpen
                                        ? 'translate-x-0 opacity-100'
                                        : '-translate-x-2 opacity-0'
                                        }`}
                                    style={{
                                        transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                                    }}
                                >
                                    <SidebarMenuSubButton asChild>
                                        <button
                                            type="button"
                                            onClick={() => handleNavigation(child.url)}
                                            className={`flex items-center gap-2 w-full text-left transition-all duration-200 hover:scale-[1.02] ${isCurrentPage(child.url)
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                                                : "hover:bg-gray-50 dark:hover:bg-gray-700 hover:translate-x-1"
                                                } ${isLoading(child.url) ? "opacity-70" : ""} ${child.url === "#" ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                            disabled={isLoading(child.url) || child.url === "#"}
                                        >
                                            {isLoading(child.url) ? (
                                                <Loader2 className="animate-spin h-4 w-4" />
                                            ) : (
                                                child.icon && <child.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                            )}
                                            <span className="transition-all duration-200">{child.name}</span>

                                            {/* Loading indicator with pulse */}
                                            {isLoading(child.url) && (
                                                <div className="ml-auto">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                </div>
                                            )}

                                            {/* Current page indicator with glow */}
                                            {isCurrentPage(child.url) && !isLoading(child.url) && (
                                                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
                                            )}

                                            {/* Disabled indicator */}
                                            {child.url === "#" && (
                                                <div className="ml-auto text-xs text-gray-400 dark:text-gray-500 animate-pulse">Soon</div>
                                            )}
                                        </button>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </div>
                )}
            </SidebarMenuItem>
        );
    };

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
                {items.map((item) => renderMenuItem(item))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
