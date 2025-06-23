'use client';
import Header from "@/layout/Header";
import GridDocument from "@/components/ui/Document/GridDocument";
import getTree from "@/actions/driver.actions";
import getContent from "@/utils/getContent";

export default async function DocumentPage({ params }: { params: { slug: string[] } }) {
    const { data } = await getTree();
    const slug = params.slug || [];
    const content = getContent(data, slug);

    if (!content.items.length)
        return (
            <>
                <Header />
                <div className="text-center mt-8 text-2xl text-gray-400">
                    <span role="img" aria-label="Not found">😕</span> Tài liệu không được tìm thấy
                </div>
            </>
        );

    return (
        <>
            <Header />
            <GridDocument content={content.items} data={data} slug={slug} path={content.path} />
        </>
    );
}