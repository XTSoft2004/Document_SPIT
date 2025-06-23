import Header from "@/layout/Header";
import GridDocument from "@/components/ui/Document/GridDocument";
import { getTree } from "@/actions/driver.actions";
import getContent from "@/utils/getContent";
import { useState } from "react";

export default async function DocumentPage({ params }: { params: { slug: string[] } }) {
    const { data } = await getTree();
    const slug = params.slug || [];
    const content = getContent(data, slug);

    return (
        <>
            <Header />
            <GridDocument content={content.items} slug={slug} path={content.path} />
        </>
    );
}