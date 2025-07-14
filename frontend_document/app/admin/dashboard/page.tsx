import { ChartLineInteractive } from "@/components/ui/Admin/Dashboard/chart-line-interactive";
import DraggerUpload from "@/components/ui/Admin/Dashboard/dragger-upload";
import { SectionCards } from "@/components/ui/Admin/Dashboard/section-cards";

export default function DashboardPage() {
    return (
        <div className="space-y-3">
            <SectionCards />

            <div className="px-4 lg:px-6">
                <DraggerUpload />
            </div>

            <div className="px-4 lg:px-6">
                <ChartLineInteractive />
            </div>
        </div>
    );
}