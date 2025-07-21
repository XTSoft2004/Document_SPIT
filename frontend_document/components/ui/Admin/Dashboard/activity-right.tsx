'use client'

import { IHistory } from "@/types/history";
import { Avatar, Card } from "antd";
import { useEffect, useState } from "react";
import { getHistory } from "@/actions/history.actions";

function formatTimeAgo(modifiedDate: string | number | Date): string {
    const modified = new Date(modifiedDate);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - modified.getTime()) / 1000);

    if (seconds < 60) return `- ${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `- ${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `- ${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `- ${days} ngày trước`;
}

const ActivityCard = ({ item }: { item: IHistory }) => (
    <Card key={item.id} className="min-w-[200px] mb-3">
        <Card.Meta
            avatar={
                <Avatar
                    src={"https://via.placeholder.com/150"}
                    alt={item.fullname}
                    className="w-8 h-8"
                />
            }
            title={
                <span className="flex items-center gap-2">
                    <span
                        className="font-semibold truncate text-sm max-w-[100px]"
                        title={`${item.fullname}`}
                    >
                        {`${item.fullname}`.slice(0, 15)}
                    </span>
                    <span
                        className="text-gray-500 text-sm truncate max-w-[90px]"
                        title={`${formatTimeAgo(item.modifiedDate)}`}
                    >
                        {formatTimeAgo(item.modifiedDate)}
                    </span>
                </span >
            }
            description={
                <div
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                    }}
                >
                    <p className="m-0">{item.description}</p>
                </div>
            }
        />
    </Card >
);

export default function ActivityRight() {
    const [activity, setActivity] = useState<IHistory[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await getHistory('', 1, 10, false, false);
                setActivity(response.data);
            } catch (error) {
                console.error("Failed to fetch activity:", error);
            }
        };

        fetchActivity();
    }, []);

    return (
        <div className="flex flex-col gap-4 p-2 sm:p-4 pt-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-semibold">Activity</h2>
                <a className="flex items-center text-xs sm:text-sm text-blue-500 hover:underline cursor-pointer">
                    <span>View All</span>
                    <svg
                        className="ml-1 w-3 h-3 sm:w-4 sm:h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </a>
            </div>

            {/* Activity List */}
            <div className="overflow-auto max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh] scrollbar-hide space-y-2">
                {activity.map((item) => (
                    <ActivityCard item={item} key={item.id} />
                ))}
            </div>
        </div>
    );
}
