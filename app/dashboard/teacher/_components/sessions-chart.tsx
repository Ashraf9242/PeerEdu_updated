
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionsChartProps {
    teacherId: string;
    chartData: { date: string; sessions: number }[];
}

// Async component wrapper
export async function SessionsChart({ teacherId }: { teacherId: string }) {
    const { getTeacherDashboardData } = await import("../_actions/get-dashboard-data");
    const { chartData } = await getTeacherDashboardData(teacherId);
    return <SessionsChartClient teacherId={teacherId} chartData={chartData} />;
}

export function SessionsChartClient({ chartData }: SessionsChartProps) {
    const chartConfig = {
        sessions: {
            label: "Sessions",
            color: "hsl(var(--primary))",
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Completed sessions in the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: 'short' })}
                        />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="sessions" fill="var(--color-sessions)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function SessionsChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[200px] w-full" />
            </CardContent>
        </Card>
    )
}
