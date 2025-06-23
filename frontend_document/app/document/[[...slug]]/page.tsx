'use client';
import Header from "@/layout/Header";
import GridDocument from "@/components/ui/Document/GridDocument";

export default async function DocumentPage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug || [];

    return (
        <>
            <Header />
            <GridDocument />
        </>
    );
}