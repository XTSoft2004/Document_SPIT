import DocumentPageClient from "@/components/ui/Document/DocumentPageClient";
import getContent from "@/utils/getContent";
import { convertToTreeData } from "@/utils/convertToTreeData";
import { getTree } from "@/actions/driver.actions";

export default async function DocumentPage({ params }: { params: { slug: string[] } }) {
    const { data } = await getTree();
    const slug = params.slug || [];
    const content = getContent(data, slug);
    const treeData = convertToTreeData(data);

    return (
        <DocumentPageClient
            data={data}
            content={content.items}
            slug={slug}
            path={content.path}
            treeData={treeData}
        />
    );
}