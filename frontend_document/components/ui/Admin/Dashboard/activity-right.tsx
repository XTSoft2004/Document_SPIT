'use client'
import { Avatar, Card } from "antd";

export default function ActivityRight() {
    return (
        <div className="flex flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold up">Activity</h2>
                <a className="flex items-center text-sm text-blue-500 hover:underline">
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

            {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-600">No recent activity.</p>
            </div> */}

            <div
                style={{
                    maxHeight: 'calc(100vh - 67vh)',
                    overflowY: 'auto',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE 10+
                }}
                className="scrollbar-hide"
            >
                <style jsx>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {Array.from({ length: 10 }).map((_, idx) => (
                    <Card key={idx} style={{ minWidth: 200, marginBottom: 12 }}>
                        <Card.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${idx + 1}`} />}
                            title={
                                <span className="flex items-center gap-2">
                                    <span className="font-semibold truncate inline-block align-bottom text-sm max-w-[110px]" title={`User Name ${idx + 1}`}>
                                        {`User Name ${idx + 1}`.slice(0, 15)}
                                    </span>
                                    <span className="text-gray-500 text-sm truncate max-w-[80px] inline-block align-bottom" title={`- ${2 + idx} hours ago`}>
                                        - {2 + idx} hours ago
                                    </span>
                                </span>
                            }
                            description={
                                <>
                                    <p>This is the description</p>
                                    <p>This is the description</p>
                                </>
                            }
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
}