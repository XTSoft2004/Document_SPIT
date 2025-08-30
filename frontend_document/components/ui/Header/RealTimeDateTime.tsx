'use client';

import { useEffect, useState } from 'react';

const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const months = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
];

export default function RealTimeDateTime() {
    const [dateTime, setDateTime] = useState<Date | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // Set lần đầu ngay sau khi mounted
        setDateTime(new Date());

        return () => clearInterval(interval);
    }, []);

    if (!dateTime) return null; // tránh SSR mismatch

    const weekday = weekdays[dateTime.getDay()];
    const day = dateTime.getDate();
    const month = months[dateTime.getMonth()];
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours().toString().padStart(2, '0');
    const minute = dateTime.getMinutes().toString().padStart(2, '0');
    const second = dateTime.getSeconds().toString().padStart(2, '0');

    return (
        <div className="text-sm text-gray-700 font-medium px-3 py-2 bg-gray-100 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-200">
            <span className="hidden md:inline whitespace-nowrap">
                {`${weekday}, ${day} ${month}, ${year} - ${hour}:${minute}:${second}`}
            </span>
        </div>
    );
}
