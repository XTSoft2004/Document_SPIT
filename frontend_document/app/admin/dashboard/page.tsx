import { AppSidebar } from "@/components/ui/Admin/Dashboard/app-sidebar"
import { ChartAreaInteractive } from "@/components/ui/Admin/Dashboard/chart-area-interactive"
import { DataTable } from "@/components/ui/Admin/Dashboard/data-table"
import { SectionCards } from "@/components/ui/Admin/Dashboard/section-cards"
import { SiteHeader } from "@/components/ui/Admin/Dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn-ui/sidebar"

import data from "./data.json"
import { ChartRadialStacked } from "@/components/ui/Admin/Dashboard/radial-chart"
import { ChartLineInteractive } from "@/components/ui/Admin/Dashboard/chart-line-interactive"
import ActivityRight from "@/components/ui/Admin/Dashboard/activity-right"
import DraggerUpload from "@/components/ui/Admin/Dashboard/dragger-upload"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <div className="sticky top-0 z-10 w-full bg-white">
          <SiteHeader />
        </div>
        <div className="flex flex-1 flex-row h-[calc(100vh-64px)]">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />

                <div className="px-4 lg:px-6">
                  <DraggerUpload />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartLineInteractive />

                  <div className="rounded-xl border bg-card text-card-foreground shadow flex-col mt-3 md:hidden">
                    <ChartRadialStacked />
                    <hr className="my-6 border-t border-gray-200 mx-auto " style={{ width: "70%" }} />
                    <ActivityRight />
                  </div>
                </div>


                {/* <DataTable data={data} /> */}
              </div>
            </div>
          </div>
          <div
            className="hidden md:flex mr-3 driver-item sticky top-[71px] self-start rounded-xl border bg-card text-card-foreground shadow flex-col"
            style={{ width: "20%", height: "calc(100vh - 10vh - 24px)" }}
          >
            <ChartRadialStacked />
            <hr className="my-6 border-t border-gray-200 mx-auto " style={{ width: "70%" }} />
            <ActivityRight />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider >
  )
}
