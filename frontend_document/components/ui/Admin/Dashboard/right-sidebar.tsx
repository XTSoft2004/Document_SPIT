// components/ui/Admin/Dashboard/right-sidebar.tsx
"use client"

import { usePathname } from "next/navigation"
import { ChartRadialStacked } from "./radial-chart"
import ActivityRight from "./activity-right"

function RightSidebar() {
    const pathname = usePathname()
    const isDashboard = pathname === "/admin/dashboard"

    if (!isDashboard) return null

    return (
        <aside className="hidden md:flex sticky top-[72px] self-start flex-col w-1/4 max-w-xs p-4 space-y-4 bg-white dark:bg-gray-800 shadow-md rounded-xl mr-4 border border-gray-100 dark:border-gray-700">
            <ChartRadialStacked />
            <hr className="border-gray-200 dark:border-gray-600" />
            <ActivityRight />
        </aside>
    )
}

export function RightSidebarMobile() {
    const pathname = usePathname()
    const isDashboard = pathname === "/admin/dashboard"

    if (!isDashboard) return null

    return (
        <div className="md:hidden px-4 lg:px-6 space-y-4 overflow-x-auto">
            <ChartRadialStacked />
            <hr className="border-gray-200 dark:border-gray-600" />
            <ActivityRight />
        </div>
    )
}

export default RightSidebar;