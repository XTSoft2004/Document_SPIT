import '@/app/globals.css';
import { AppSidebar } from "@/components/ui/Admin/Dashboard/app-sidebar";
import { SectionCards } from "@/components/ui/Admin/Dashboard/section-cards";
import { SiteHeader } from "@/components/ui/Admin/Dashboard/site-header";
import { SidebarProvider } from "@/components/ui/shadcn-ui/sidebar";
import { ChartRadialStacked } from "@/components/ui/Admin/Dashboard/radial-chart";
import { ChartLineInteractive } from "@/components/ui/Admin/Dashboard/chart-line-interactive";
import ActivityRight from "@/components/ui/Admin/Dashboard/activity-right";
import DraggerUpload from "@/components/ui/Admin/Dashboard/dragger-upload";
import RightSidebar, { RightSidebarMobile } from "@/components/ui/Admin/Dashboard/right-sidebar";
import { GlobalPageLoader } from "@/components/ui/page-transition-loader";
import { AuthProvider } from '@/context/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Quản trị - SPIT Admin",
    description: "Bảng điều khiển quản trị hệ thống SPIT Document. Quản lý tài liệu, người dùng, thống kê và cấu hình hệ thống một cách hiệu quả.",
    keywords: [
        'quản trị SPIT',
        'bảng điều khiển admin',
        'quản lý tài liệu',
        'thống kê hệ thống',
        'admin dashboard'
    ],
    openGraph: {
        title: "Quản trị hệ thống - SPIT Document",
        description: "Bảng điều khiển quản trị hệ thống SPIT Document",
        type: 'website',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AuthProvider>
                <GlobalPageLoader />
                <div className="w-full h-screen flex overflow-hidden bg-gray-50 text-gray-800">
                    {/* Sidebar */}
                    <AppSidebar />

                    {/* Main content area */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {/* Header */}
                        <header className="sticky top-0 z-20 bg-white shadow-sm w-full">
                            <SiteHeader />
                        </header>

                        {/* Content body */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Main content scrollable */}
                            <main className="flex-1 overflow-y-auto overflow-x-auto p-1 md:p-2 xlF:p-3 space-y-6">
                                <div className="min-w-full">
                                    {children}
                                </div>

                                <RightSidebarMobile />
                            </main>

                            {/* Right-side widget (desktop) */}
                            <RightSidebar />
                        </div>
                    </div>
                </div>
            </AuthProvider>
        </SidebarProvider>
    );
}
