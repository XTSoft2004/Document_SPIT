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

export const metadata = {
    title: "Trang chủ | Quản trị",
    description: "Trang chủ quản trị hệ thống tài liệu SPIT.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
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
                        <main className="flex-1 overflow-y-auto overflow-x-auto p-2 md:p-3 lg:p-5 space-y-6">
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
        </SidebarProvider>
    );
}
