import { getTree } from "@/actions/driver.actions";
import DocumentPageWrapper from "@/components/ui/Document/DocumentPageWrapper";
import { IDriveResponse } from "@/types/driver";
import { IIndexResponse } from "@/types/global";
import useSWR from "swr";

export default async function DocumentPage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug || [];

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <DocumentPageWrapper slug={slug} />
        </div>
    );
}