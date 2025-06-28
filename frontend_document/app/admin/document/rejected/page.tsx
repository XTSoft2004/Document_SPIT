'use client';

import { use, useEffect, useState } from "react";
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
import ModalReviewDocument from "@/components/ui/Admin/Document/Modal/Pending/ModalReviewDocument";
import { ICourseResponse } from "@/types/course";
import { getCourse } from "@/actions/course.action";
import ModalPendingDocument from "@/components/ui/Admin/Document/Modal/Pending/ModalPendingDocument";
import { getFilteredColumnsTableDocument } from "@/components/ui/Admin/Document/ColumnsTableDocument";




export default function DocumentRejectedPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalReview, setIsShowModalReview] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IDocumentResponse>();
    const [loading, setLoading] = useState(true);


    const listColumn = getFilteredColumnsTableDocument(['name', 'statusDocument', 'fullNameUser', 'courseName', 'isPrivate']);
    const [columns, setColumns] = useState<TableColumnType<IDocumentResponse>[]>(listColumn);
    useEffect(() => {
        setColumns([
            ...columns,
            {
                title: 'Thao tác',
                key: 'actions',
                width: 180,
                render: (_, record) => (
                    <div className="flex gap-2">
                        <Tooltip title="Khôi phục tài liệu">
                            <Button
                                type="primary"
                                size="small"
                                icon={<CheckCircle size={16} />}
                                className="bg-green-500 hover:bg-green-600 border-green-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                Khôi phục
                            </Button>
                        </Tooltip>

                        <Tooltip title="Xoá tài liệu">
                            <Button
                                type="primary"
                                size="small"
                                danger
                                icon={<XCircle size={16} />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                Xoá
                            </Button>
                        </Tooltip>
                    </div>
                ),
            },
        ]);
    }, []);

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full h-[80vh]">
                {/* Bảng bên trái */}
                <div className="flex-1 min-w-0">
                    <DataGrid<IDocumentResponse>
                        nameTable="document_rejected"
                        columns={columns}
                        rowKey="id"
                        singleSelect={true}
                        fetcher={async (search: string, page: number, limit: number) => {
                            // Chỉ lấy tài liệu có status = "Pending"
                            const res = await getDocuments(search, page, limit, "rejected");
                            return res;
                        }}
                        onSelectionChange={(item: IDocumentResponse | null) => {
                            setSelectedItem(item ?? undefined);
                            reloadTable('document_rejected');
                        }}
                    />
                </div>

                {/* Preview bên phải */}
                <div className={`ml-3 transition-all duration-300 ease-in-out ${selectedItem
                    ? 'w-full md:w-[350px] opacity-100 translate-x-0'
                    : 'w-0 opacity-0 translate-x-4 overflow-hidden'
                    }`}>
                    {selectedItem && (
                        <PreviewPanel
                            selectedItem={selectedItem}
                            onClose={() => setSelectedItem(undefined)}
                            className="ml-0"
                        />
                    )}
                </div>
            </div>
        </>
    );
}
