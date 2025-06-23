// components/ui/Admin/Dashboard/right-sidebar.tsx
"use client"

import { useEffect, useState } from "react"
import { ChartRadialStacked } from "./radial-chart"
import ActivityRight from "./activity-right"

export default function RightSidebar() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin/dashboard")) {
            setShow(true)
        }
    }, [])

    if (!show) return null

    return (
        <aside className="hidden md:flex sticky top-[72px] self-start flex-col w-1/4 max-w-xs p-4 space-y-4 bg-white shadow-md rounded-xl mr-4">
            <ChartRadialStacked />
            <hr className="border-gray-200" />
            <ActivityRight />
        </aside>
    )
}
