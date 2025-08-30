import { Card, Skeleton } from 'antd';

interface LoadingSkeletonProps {
    count?: number;
    columns?: number;
    showImage?: boolean;
    imageHeight?: string;
    rows?: number;
}

export default function LoadingSkeleton({
    count = 5,
    columns = 5,
    showImage = true,
    imageHeight = '6rem',
    rows = 1
}: LoadingSkeletonProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
    }[columns] || 'grid-cols-5';

    return (
        <div className={`grid ${gridCols} gap-4`}>
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="rounded-xl">
                    {showImage && (
                        <div
                            className="w-full mb-2 bg-gray-200 rounded"
                            style={{ height: imageHeight }}
                        />
                    )}
                    <Skeleton active paragraph={{ rows }} title={false} />
                </Card>
            ))}
        </div>
    );
}
