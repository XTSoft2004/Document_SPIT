"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn-ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn-ui/chart"
import { ILineChartDate } from "@/types/statistical"
import { getLineChartDate } from "@/actions/statistical.actions"
import { useEffect, useState } from "react"
import useSWR from "swr"

export const description = "An interactive line chart"



const chartConfig = {
    views: {
        label: "Số lượng tài liệu:",
        color: "#3b82f6", // blue-500
    },
    file: {
        label: "Tài liệu:",
        color: "#22c55e", // green-500
    },
} satisfies ChartConfig

export function ChartLineInteractive() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("file")

    const fetcher = async () => {
        try {
            const response = await getLineChartDate()
            if (response.ok) {
                return response.data
            }
            return []
        } catch (error) {
            console.error("Error fetching chart data:", error)
            return []
        }
    }

    const { data: chartData = [], isLoading, error } = useSWR("lineChartData", fetcher, {
        refreshInterval: 10000, // Real-time update every 10 seconds
        revalidateOnFocus: true, // Revalidate when window gets focus
        revalidateOnReconnect: true, // Revalidate when reconnect
        dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
        errorRetryCount: 3, // Retry 3 times on error
        errorRetryInterval: 2000, // Wait 2 seconds between retries
    })

    return (
        <Card className="py-4 sm:py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 my-5 mx-5">
                    <CardTitle className="flex items-center gap-2">
                        Biều đồ đường
                        {isLoading && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs">Đang cập nhật...</span>
                            </div>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Hiển thị biểu đồ tài liệu trong 15 ngày gần đây • Tự động cập nhật mỗi 10 giây
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                {error ? (
                    <div className="flex items-center justify-center h-[250px] text-center">
                        <div className="text-red-500">
                            <p className="text-sm">Không thể tải dữ liệu biểu đồ</p>
                            <p className="text-xs text-muted-foreground mt-1">Đang thử lại...</p>
                        </div>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                interval={2}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("vi-VN", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="views"
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("vi-VN", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }}
                                    />
                                }
                            />
                            <Line
                                dataKey={activeChart}
                                type="monotone"
                                stroke="#22c55e" // màu xanh lá cây (green-500 Tailwind)
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
