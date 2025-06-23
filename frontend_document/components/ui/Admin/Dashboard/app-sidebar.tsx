"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/ui/Admin/Dashboard/nav-documents"
import { NavMain } from "@/components/ui/Admin/Dashboard/nav-main"
import { NavSecondary } from "@/components/ui/Admin/Dashboard/nav-secondary"
import { NavUser } from "@/components/ui/Admin/Dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/shadcn-ui/sidebar"
import { NavCRUD } from "./nav-curd"
import { Image } from "antd";
import { useRouter } from "next/navigation"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="gap-0 p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              // asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 flex items-center space-x-3 h-90"
            >
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => {
                  router.push('/admin/dashboard');

                  // Use next/navigation router
                  // If using next/router (for pages directory), import useRouter from 'next/router'
                  // For app directory, import useRouter from 'next/navigation'
                  // Here is for app directory:
                  // import { useRouter } from 'next/navigation'
                  // const router = useRouter();
                  // router.push('/admin/dashboard');
                  // But hooks can't be used here directly, so move hook to parent component

                  // We'll lift useRouter to AppSidebar and pass as prop or use a callback
                  // But for simplicity, see below in main component
                }}
                id="sidebar-logo"
              >
                <div className="flex items-center justify-center h-12 w-12">
                  <Image
                    src="/images/logo/logo_clb.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full object-contain"
                    style={{ objectFit: "contain" }}
                    preview={false}
                  />
                </div>
                <span className="font-semibold text-lg text-primary">
                  Document SPIT
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavCRUD />
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
