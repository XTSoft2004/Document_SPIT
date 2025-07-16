'use client';

import { use, useEffect, useState } from "react";
import { Button, message, TableColumnType } from "antd";
import { CheckCircle, Clock, XCircle, EarthLock, Earth, Pen, Trash2 } from "lucide-react";

import { deleteDocument, getDocuments, updateDocument } from "@/actions/document.actions";
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
import NotificationService from "@/components/ui/Notification/NotificationService";
import ConfirmDeleteModal from "@/components/ui/Admin/Document/Modal/ConfirmDeleteModal";
import ConfirmRestoreModal from "@/components/ui/Admin/Document/Modal/ConfirmRestoreModal";
// import SimpleConfirmDeleteModal from "@/components/ui/Admin/Document/Modal/SimpleConfirmDeleteModal"; // Uncomment để dùng modal đơn giản


export default function DocumentRejectedPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalReview, setIsShowModalReview] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IDocumentResponse>();
    const [loading, setLoading] = useState(true);
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<IDocumentResponse>();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isShowConfirmRestore, setIsShowConfirmRestore] = useState(false);
    const [documentToRestore, setDocumentToRestore] = useState<IDocumentResponse>();
    const [restoreLoading, setRestoreLoading] = useState(false);

    // Hàm xử lý xóa tài liệu với kiểm tra mật khẩu
    const handleDeleteDocument = async () => {
        if (!documentToDelete) return;

        try {
            setDeleteLoading(true);
            // Gọi API xóa tài liệu
            const response = await deleteDocument(documentToDelete.id.toString());

            if (response.ok) {
                NotificationService.success({
                    message: "Xóa tài liệu thành công",
                    description: `Tài liệu "${documentToDelete.name}" đã được xóa vĩnh viễn.`,
                });

                // Reload các bảng
                reloadTable('document');
                reloadTable('document_pending');
                reloadTable('document_rejected');

                // Đóng modal
                setIsShowConfirmDelete(false);
                setDocumentToDelete(undefined);
            } else {
                throw new Error('delete_failed');
            }
        } catch (error) {
            if (error instanceof Error && error.message === 'password') {
                throw error; // Để modal hiển thị lỗi mật khẩu
            } else {
                NotificationService.error({
                    message: "Xóa tài liệu thất bại",
                    description: `Không thể xóa tài liệu "${documentToDelete.name}". Vui lòng thử lại.`,
                });
            }
        } finally {
            setDeleteLoading(false);
        }
    };

    // Hàm xử lý khôi phục tài liệu với kiểm tra mật khẩu
    const handleRestoreDocument = async () => {
        if (!documentToRestore) return;

        try {
            setRestoreLoading(true);

            // Gọi API khôi phục tài liệu
            const response = await updateDocument(documentToRestore.id.toString(), { statusDocument: 'Approved' });

            if (response.ok) {
                NotificationService.success({
                    message: "Khôi phục tài liệu thành công",
                    description: `Tài liệu "${documentToRestore.name}" đã được khôi phục về trạng thái đã duyệt.`,
                });

                // Reload các bảng
                reloadTable('document');
                reloadTable('document_pending');
                reloadTable('document_rejected');

                // Đóng modal
                setIsShowConfirmRestore(false);
                setDocumentToRestore(undefined);
            } else {
                throw new Error('restore_failed');
            }
        } catch (error) {
            if (error instanceof Error && error.message === 'password') {
                throw error; // Để modal hiển thị lỗi mật khẩu
            } else {
                NotificationService.error({
                    message: "Khôi phục tài liệu thất bại",
                    description: `Không thể khôi phục tài liệu "${documentToRestore.name}". Vui lòng thử lại.`,
                });
            }
        } finally {
            setRestoreLoading(false);
        }
    };

    const columns: TableColumnType<IDocumentResponse>[] = [
        ...getFilteredColumnsTableDocument(['name', 'statusDocument', 'fullNameUser', 'courseName', 'isPrivate']),
        {
            title: 'Thao tác',
            key: 'actions',
            width: 180,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Tooltip title="Khôi phục tài liệu">
                        <Button
                            type="text"
                            size="middle"
                            icon={
                                <Clock
                                    size={18}
                                    style={{ color: "#22c55e" }} // Màu xanh (tailwind: green-500)
                                />
                            }
                            onClick={async (e) => {
                                e.stopPropagation();
                                // Hiển thị modal xác nhận khôi phục
                                setDocumentToRestore(record);
                                setIsShowConfirmRestore(true);
                            }}
                            style={{ color: "#22c55e" }} // Đảm bảo màu cho icon
                        />
                    </Tooltip>

                    <Tooltip title="Xoá tài liệu">
                        <Button
                            type="text"
                            size="middle"
                            icon={
                                <Trash2
                                    size={18}
                                // Màu đỏ (tailwind: red-500)
                                />
                            }
                            onClick={async (e) => {
                                e.stopPropagation();
                                // Hiển thị modal xác nhận xóa
                                setDocumentToDelete(record);
                                setIsShowConfirmDelete(true);
                            }}
                            style={{ color: "#ef4444" }} // Đảm bảo màu cho icon
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

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

            {/* Modal xác nhận khôi phục tài liệu */}
            <ConfirmRestoreModal
                visible={isShowConfirmRestore}
                document={documentToRestore}
                onCancel={() => {
                    setIsShowConfirmRestore(false);
                    setDocumentToRestore(undefined);
                }}
                onConfirm={handleRestoreDocument}
                loading={restoreLoading}
            />

            {/* Modal xác nhận xóa tài liệu */}
            <ConfirmDeleteModal
                visible={isShowConfirmDelete}
                document={documentToDelete}
                onCancel={() => {
                    setIsShowConfirmDelete(false);
                    setDocumentToDelete(undefined);
                }}
                onConfirm={handleDeleteDocument}
                loading={deleteLoading}
            />
        </>
    );
}
