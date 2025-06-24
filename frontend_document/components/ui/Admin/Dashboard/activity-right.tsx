'use client'

import { Avatar, Card } from "antd";

const ActivityCard = ({ index }: { index: number }) => (
    <Card key={index} className="min-w-[200px] mb-3">
        <Card.Meta
            avatar={
                <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index + 1}`} />
            }
            title={
                <span className="flex items-center gap-2">
                    <span
                        className="font-semibold truncate text-sm max-w-[110px]"
                        title={`User Name ${index + 1}`}
                    >
                        {`User Name ${index + 1}`.slice(0, 15)}
                    </span>
                    <span
                        className="text-gray-500 text-sm truncate max-w-[80px]"
                        title={`- ${2 + index} hours ago`}
                    >
                        - {2 + index} hours ago
                    </span>
                </span>
            }
            description={
                <div>
                    <p>This is the description</p>
                    <p>This is the description</p>
                </div>
            }
        />
    </Card>
);

export default function ActivityRight() {
    return (
        <div className="flex flex-col gap-4 p-4 pt-0">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Activity</h2>
                <a className="flex items-center text-sm text-blue-500 hover:underline cursor-pointer">
                    <span>View All</span>
                    <svg
                        className="ml-1 w-4 h-4"
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
            <div className="overflow-auto max-h-[100vh] scrollbar-hide">
                {Array.from({ length: 20 }).map((_, idx) => (
                    <ActivityCard key={idx} index={idx} />
                ))}
            </div>
        </div>
    );
}
