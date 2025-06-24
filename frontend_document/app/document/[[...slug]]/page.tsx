import Header from "@/layout/Header";
import GridDocument from "@/components/ui/Document/GridDocument";
import { getTree } from "@/actions/driver.actions";
import getContent from "@/utils/getContent";
import { convertToTreeData } from "@/utils/convertToTreeData";

export default async function DocumentPage({ params }: { params: { slug: string[] } }) {
    const { data } = await getTree();
    const slug = params.slug || [];
    const content = getContent(data, slug);
    const treeData = convertToTreeData(data);

    return (
        <>
            <div className="h-screen flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 bg-white">
                    <Header />
                </div>
                <div className="flex-1 overflow-auto">
                    <GridDocument
                        data={data}
                        content={content.items}
                        slug={slug}
                        path={content.path}
                        treeData={treeData}
                    />
                </div>
            </div>
        </>
    );
}