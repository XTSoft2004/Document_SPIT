import { AppSidebar } from "@/components/ui/Admin/Dashboard/app-sidebar";
import { SectionCards } from "@/components/ui/Admin/Dashboard/section-cards";
import { SiteHeader } from "@/components/ui/Admin/Dashboard/site-header";
import { SidebarProvider } from "@/components/ui/shadcn-ui/sidebar";
import { ChartRadialStacked } from "@/components/ui/Admin/Dashboard/radial-chart";
import { ChartLineInteractive } from "@/components/ui/Admin/Dashboard/chart-line-interactive";
import ActivityRight from "@/components/ui/Admin/Dashboard/activity-right";
import DraggerUpload from "@/components/ui/Admin/Dashboard/dragger-upload";
import RightSidebar from "@/components/ui/Admin/Dashboard/right-sidebar";

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

                            {/* Mobile-only widget */}
                            {typeof window !== "undefined" && window.location.pathname === "/admin/dashboard" && (
                                <div className="md:hidden px-4 lg:px-6 space-y-4 overflow-x-auto">
                                    <ChartRadialStacked />
                                    <hr className="border-gray-200" />
                                    <ActivityRight />
                                </div>
                            )}
                        </main>

                        {/* Right-side widget (desktop) */}
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
