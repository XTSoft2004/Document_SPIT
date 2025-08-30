'use client'
import { IRanking } from "@/types/statistical";
import { getRanking } from "@/actions/statistical.actions";
import { useEffect, useState } from "react";

export function useRankingData() {
    const [rankings, setRankings] = useState<IRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const response = await getRanking();
                console.log('Response:', response.data);
                setRankings(response.data);
                console.log('Rankings fetched successfully:', rankings);
            } catch (err) {
                setError('Có lỗi xảy ra khi tải dữ liệu');
                console.error('Error fetching rankings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    return { rankings, loading, error };
}
