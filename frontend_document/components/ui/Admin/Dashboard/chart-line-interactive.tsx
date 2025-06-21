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

export const description = "An interactive line chart"

const chartData = [
    { date: "2024-04-01", file: 5 },
    { date: "2024-04-02", file: 8 },
    { date: "2024-04-03", file: 6 },
    { date: "2024-04-04", file: 7 },
    { date: "2024-04-05", file: 10 },
    { date: "2024-04-06", file: 12 },
    { date: "2024-04-07", file: 9 },
    { date: "2024-04-08", file: 11 },
    { date: "2024-04-09", file: 13 },
    { date: "2024-04-10", file: 15 },
    { date: "2024-04-11", file: 14 },
    { date: "2024-04-12", file: 16 },
    { date: "2024-04-13", file: 18 },
    { date: "2024-04-14", file: 17 },
    { date: "2024-04-15", file: 19 },
    { date: "2024-04-16", file: 20 },
    { date: "2024-04-17", file: 22 },
    { date: "2024-04-18", file: 21 },
    { date: "2024-04-19", file: 23 },
    { date: "2024-04-20", file: 25 },
    { date: "2024-04-21", file: 24 },
]

const chartConfig = {
    views: {
        label: "Page Views",
        color: "#3b82f6", // blue-500
    },
    file: {
        label: "File",
        color: "#22c55e", // green-500
    },
} satisfies ChartConfig

export function ChartLineInteractive() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("file")

    return (
        <Card className="py-4 sm:py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 my-5 mx-5">
                    <CardTitle>Line Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
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
            </CardContent>
        </Card>
    )
}
