'use client';

import { useEffect, useState } from "react";
import { Button, message, TableColumnType } from "antd";
import { CheckCircle, Clock, XCircle, EarthLock, Earth, Pen } from "lucide-react";

import { getDocuments, updateDocument } from "@/actions/document.actions";
import ModalCreateDocument from "@/components/ui/Admin/Document/Modal/All/ModalCreateDocument";
import DataGrid from "@/components/ui/Table/DataGrid";
import { IDocumentResponse } from "@/types/document";
import PreviewPanel from "@/components/ui/Admin/Document/PreviewPanel";
import { Tooltip } from "antd";
import { mutateTable, reloadTable } from "@/utils/swrReload";
import ModalUpdateDocument from "@/components/ui/Admin/Document/Modal/All/ModalUpdateDocument";
import { mutate } from "swr";
import { ICourseResponse } from "@/types/course";
import { getCourse } from "@/actions/course.action";
import { set } from "react-hook-form";
import { getFilteredColumnsTableDocument } from "@/components/ui/Admin/Document/ColumnsTableDocument";

export default function DocumentPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IDocumentResponse>();
    const [loading, setLoading] = useState(true);

    const listColumn = getFilteredColumnsTableDocument(['name', 'courseName', 'statusDocument', 'totalDownloads', 'totalViews', 'fullNameUser', 'isPrivate']);
    const [columns, setColumns] = useState<TableColumnType<IDocumentResponse>[]>(listColumn);

    useEffect(() => {
        setColumns([
            ...columns,
            {
                title: 'Thao tác',
                key: 'actions',
                width: 90,
                align: 'center',
                render: (_, record) => (
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<Pen size={18} />}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDocument(record);
                                setIsShowModalUpdate(true);
                            }}
                            className="hover:bg-blue-50"
                        />
                    </Tooltip>
                ),
            },
        ]);
    }, []);


    return (
        <>
            <div className="flex flex-col md:flex-row w-full">
                {/* Bảng bên trái */}
                <div className="flex-1 min-w-0">
                    <DataGrid<IDocumentResponse>
                        nameTable="document"
                        columns={columns}
                        rowKey="id"
                        singleSelect={true}
                        fetcher={async (search: string, page: number, limit: number) => {
                            const res = await getDocuments(search, page, limit);
                            return res;
                        }}
                        // btnAddInfo={{
                        //     title: 'Thêm tài liệu',
                        //     onClick: () => setIsShowModalCreate(true),
                        // }}
                        onSelectionChange={(item: IDocumentResponse | null) => {
                            setSelectedItem(item ?? undefined);
                            reloadTable('document');
                        }}
                    />
                </div>
                {/* Preview bên phải */}
                <div
                    className={`h-[75vh] ml-3 transition-all duration-300 ease-in-out flex flex-col ${selectedItem
                        ? 'w-full md:w-[350px] opacity-100 translate-x-0'
                        : 'w-0 opacity-0 translate-x-4 overflow-hidden'
                        }`}
                // style={{ height: '100%' }}
                >
                    {selectedItem && (
                        <PreviewPanel
                            selectedItem={selectedItem}
                            onClose={() => setSelectedItem(undefined)}
                            className="ml-0"
                            showCloseButton={true}
                        />
                    )}
                </div>
            </div >

            <ModalCreateDocument
                visible={isShowModalCreate}
                onCancel={() => {
                    setIsShowModalCreate(false)
                    reloadTable('document');
                }}
            />

            <ModalUpdateDocument
                visible={isShowModalUpdate}
                Document={selectedDocument}
                onCancel={() => {
                    setIsShowModalUpdate(false);
                    setSelectedDocument(undefined);
                    reloadTable('document');
                }}
            />
        </>
    );
}