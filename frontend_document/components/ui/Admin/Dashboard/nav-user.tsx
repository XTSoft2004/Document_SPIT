"use client"

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn-ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn-ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/shadcn-ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { use, useEffect } from "react"
import Link from "next/link"
import NotificationService from "../../Notification/NotificationService"
import { logoutAccount } from "@/actions/auth.actions"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { getInfo } = useAuth();
  const info = getInfo();

  const handleLogout = async () => {
    try {
      await logoutAccount();
      window.location.href = '/';
      localStorage.clear();
      NotificationService.success({ message: 'Đăng xuất thành công' });
    } catch (error) {
      NotificationService.error({ message: 'Đăng xuất thất bại' });
      console.error('Logout failed:', error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border shadow rounded-xl"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage className="object-cover" src={info?.avatarUrl} alt={info?.username} />
                <AvatarFallback className="rounded-lg">{info?.fullname.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{info?.username}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {info?.email || "No email provided"}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage className="object-cover" src={info?.avatarUrl} alt={info?.username} />
                  <AvatarFallback className="rounded-lg">{info?.fullname.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{info?.username}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {info?.email || "No email provided"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${info?.username}`} className="flex items-center gap-2">
                  <UserCircleIcon />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCircleIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()} className="flex items-center gap-2">
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem >
    </SidebarMenu >
  )
}
