"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn-ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn-ui/chart"

export const description = "A radial chart with stacked sections"

const chartData = [{ month: "january", mobile: 570, desktop: 1200 }]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function ChartRadialStacked() {
    const totalVisitors = chartData[0].desktop + chartData[0].mobile

    return (
        <Card className="flex flex-col rounded-xl border-0 shadow-none">
            <CardHeader className="items-center pb-0">
                <CardTitle>Dung lượng Google Drive</CardTitle>
                <CardDescription className="mt-2">
                    {new Date().toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[200px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    // Cast viewBox to any to access cx and cy, or define a proper type if available
                                    const cx = (viewBox as any)?.cx
                                    const cy = (viewBox as any)?.cy
                                    if (typeof cx !== "number" || typeof cy !== "number") return null

                                    return (
                                        <foreignObject
                                            x={cx - 75}
                                            y={cy - 50}
                                            width={150}
                                            height={100}
                                            className="overflow-visible"
                                        >
                                            <div className="flex flex-col items-center justify-center text-center pt-5">
                                                <p className="text-2xl font-bold text-foreground">{totalVisitors.toLocaleString()}</p>
                                                <p className="text-muted-foreground">Dung lượng</p>

                                                <div className="mt-2 text-sm w-100">
                                                    <div className="flex items-center justify-center pt-5">
                                                        <span className="mr-1 text-muted-foreground">Còn trống:</span>
                                                        <span className="text-green-600 font-semibold text-base">20GB</span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <span className="mr-1 text-muted-foreground">Đã dùng:</span>
                                                        <span className="text-red-600 font-semibold text-base">5GB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </foreignObject>
                                    )
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="desktop"
                            fill="#dc2626"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="mobile"
                            stackId="a"
                            cornerRadius={5}
                            fill="#16a34a"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>

            </CardContent>
        </Card>
    )
}
