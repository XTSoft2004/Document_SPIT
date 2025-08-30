'use client'
import RankingPageClient from "./RankingPageClient";
import TopRankingTable from "./TopRankingTable";
import { useRankingData } from "@/hooks/useRankingData";

export default function RankingPageWrapper() {
    const { rankings, loading } = useRankingData();

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Ranking Content with responsive container */}
            <div className="w-full">
                <RankingPageClient />
            </div>

            {/* Top 10 Table */}
            <div className="w-full">
                <TopRankingTable rankings={rankings} loading={loading} />
            </div>
        </div>
    );
}
