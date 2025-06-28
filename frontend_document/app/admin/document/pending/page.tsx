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

export default function DocumentPendingPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalReview, setIsShowModalReview] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IDocumentResponse>();
    const [loading, setLoading] = useState(true);

    const columns: TableColumnType<IDocumentResponse>[] = [
        {
            title: 'Tên tài liệu',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: 'Trạng thái tài liệu',
            dataIndex: 'isPrivate',
            key: 'isPrivate',
            width: 150,
            align: 'center',
            render: (isPrivate: boolean, record: IDocumentResponse) => (
                <select
                    value={isPrivate ? "private" : "public"}
                    onChange={async (e) => {
                        const newValue = e.target.value === "private";
                        const isPrivateValue = newValue;
                        const response = await updateDocument(record.id.toString(), { isPrivate: isPrivateValue });
                        if (response.ok) {
                            message.success(`Đã cập nhật trạng thái tài liệu thành ${newValue ? 'riêng tư' : 'công khai'}`);
                            reloadTable('document');
                            return;
                        }
                        message.error(response.message || 'Cập nhật trạng thái tài liệu thất bại');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-1 rounded-full border 
                            ${isPrivate
                            ? "border-[#ff7875] bg-[#fff1f0] text-[#ff4d4f] font-semibold"
                            : "border-[#52c41a] bg-[#f6ffed] text-[#389e0d] font-medium"} 
                            text-sm min-w-[110px] text-center outline-none appearance-none cursor-pointer`}                >
                    <option value="public" className="text-[#389e0d] font-medium text-left">
                        🌍 Công khai
                    </option>
                    <option value="private" className="text-[#ff4d4f] font-semibold text-left">
                        🔒 Riêng tư
                    </option>
                </select>
            ),
        }, {
            title: 'Trạng thái duyệt tài liệu',
            dataIndex: 'statusDocument',
            key: 'statusDocument',
            width: 180,
            align: 'center',
            render: (status: string, record: IDocumentResponse) => (
                <select
                    value={status || "Pending"}
                    onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                            // Gọi API cập nhật trạng thái duyệt tại đây
                            const response = await updateDocument(record.id.toString(), { statusDocument: newStatus });
                            if (!response.ok) {
                                message.error(response.message || 'Cập nhật trạng thái duyệt thất bại');
                                return;
                            }
                            const statusLabels: Record<string, string> = {
                                Approved: "đã duyệt",
                                Pending: "đang chờ duyệt",
                                Rejected: "không duyệt",
                            };
                            message.success(`Đã cập nhật trạng thái duyệt thành ${statusLabels[newStatus]}`);
                            // Reload data sau khi cập nhật
                            reloadTable('document');
                        } catch (error) {
                            message.error('Cập nhật trạng thái duyệt thất bại');
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-1 rounded-full border 
                            ${status === "Approved"
                            ? "border-[#52c41a] bg-[#f6ffed] text-[#389e0d] font-semibold"
                            : status === "Rejected"
                                ? "border-[#ff4d4f] bg-[#fff1f0] text-[#cf1322] font-semibold"
                                : "border-[#faad14] bg-[#fffbe6] text-[#d48806] font-medium"} 
                            text-sm min-w-[130px] text-center outline-none appearance-none cursor-pointer`}                >
                    <option value="Pending" className="text-[#d48806] font-medium text-left">
                        ⏳ Đang chờ duyệt
                    </option>
                    <option value="Approved" className="text-[#389e0d] font-semibold text-left">
                        ✅ Đã duyệt
                    </option>
                    <option value="Rejected" className="text-[#cf1322] font-semibold text-left">
                        ❌ Không duyệt
                    </option>
                </select>
            ),
        }, {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Tooltip title="Duyệt tài liệu">
                        <Button
                            type="primary"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDocument(record);
                                setIsShowModalReview(true);
                            }}
                        >
                            Duyệt
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];


    const [courses, setCourses] = useState<ICourseResponse[]>([]);
    const fetchDepartments = async () => {
        const response = await getCourse();
        if (response.ok) {
            setCourses(response.data);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full h-[80vh]">
                {/* Bảng bên trái */}
                <div className="flex-1 min-w-0">
                    <DataGrid<IDocumentResponse>
                        nameTable="document_pending"
                        columns={columns}
                        rowKey="id"
                        singleSelect={true}
                        fetcher={async (search: string, page: number, limit: number) => {
                            // Chỉ lấy tài liệu có status = "Pending"
                            const res = await getDocuments(search, page, limit, "pending");
                            return res;
                        }}
                        btnAddInfo={{
                            title: 'Thêm tài liệu chờ duyệt',
                            onClick: () => setIsShowModalCreate(true),
                        }}
                        onSelectionChange={(item: IDocumentResponse | null) => {
                            setSelectedItem(item ?? undefined);
                            reloadTable('document_pending');
                        }}
                    />
                </div>

                {/* Preview bên phải */}
                {/* <div className={`ml-3 transition-all duration-300 ease-in-out ${selectedItem
                    ? 'w-full md:w-[350px] opacity-100 translate-x-0'
                    : 'w-0 opacity-0 translate-x-4 overflow-hidden'
                    }`}>
                    {selectedItem && (
                        <PreviewPanel
                            selectedItem={selectedItem}
                            onClose={() => setSelectedItem(undefined)}
                            onReload={() => {
                                setLoading(true);
                                setSelectedItem(undefined);
                                setTimeout(() => setSelectedItem(selectedItem), 100);
                            }}
                        />
                    )}
                </div> */}
            </div>

            <ModalPendingDocument
                visible={isShowModalCreate}
                courses={courses}
                onCancel={() => setIsShowModalCreate(false)}
                onSuccess={() => {
                    setIsShowModalCreate(false);
                    reloadTable('document_pending');
                }}
            />

            <ModalReviewDocument
                visible={isShowModalReview}
                Document={selectedDocument}
                courses={courses}
                onCancel={() => {
                    setIsShowModalReview(false);
                    setSelectedDocument(undefined);
                    reloadTable('document_pending');
                }}
            />
        </>
    );
}
