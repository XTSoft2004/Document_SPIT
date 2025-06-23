'use client';

import { useEffect, useState } from "react";
import { mutate } from "swr";
import { Button, message, TableColumnType } from "antd";
import { CheckCircle, Clock, XCircle, Tag, Pen, EarthLock, Earth } from "lucide-react";

import { getDocuments } from "@/actions/document.actions";
import ModalCreateUser from "@/components/ui/Admin/User/ModalCreateUser";
import NotificationService from "@/components/ui/Notification/NotificationService";
import DataGrid from "@/components/ui/Table/DataGrid";
import { IDocumentResponse } from "@/types/document";
import PreviewPanel from "@/components/ui/Admin/Document/PreviewPanel";
import { Tooltip } from "antd";

export default function DocumentPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);

    const columns: TableColumnType<IDocumentResponse>[] = [
        {
            title: 'Tên tài liệu',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        },
        {
            title: 'Lượt tải',
            dataIndex: 'totalDownloads',
            key: 'totalDownloads',
            width: 50,
            align: 'center',
        },
        {
            title: 'Lượt xem',
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 50,
            align: 'center',
        },
        {
            title: 'Trạng thái tài liệu',
            dataIndex: 'isPrivate',
            key: 'isPrivate',
            width: 100,
            align: 'center',
            render: (isPrivate: boolean) => (
                <Tooltip title={isPrivate ? "Riêng tư" : "Công khai"}>
                    <span className="flex items-center justify-center">
                        {isPrivate ? (
                            <EarthLock size={24} color="#ff7875" />
                        ) : (
                            <Earth size={24} color="#52c41a" />
                        )}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Trạng thái duyệt tài liệu',
            dataIndex: 'statusDocument',
            key: 'statusDocument',
            width: 150,
            align: 'center',
            render: (status: string) => {
                const icons: Record<string, JSX.Element> = {
                    Approved: <CheckCircle size={18} color="#52c41a" />,
                    Pending: <Clock size={18} color="#faad14" />,
                    Rejected: <XCircle size={18} color="#ff4d4f" />,
                };

                const labels: Record<string, string> = {
                    Approved: "Đã duyệt",
                    Pending: "Đang chờ duyệt",
                    Rejected: "Không duyệt",
                };

                return (
                    <span className="flex items-center justify-center gap-2">
                        {icons[status]}
                        <span>{labels[status] ?? "Không xác định"}</span>
                    </span>
                );
            }
        },
        // {
        //     title: 'Thời gian cập nhật',
        //     dataIndex: 'modifiedDate',
        //     key: 'modifiedDate',
        //     width: 150,
        //     render: (dateStr: string) =>
        //         new Date(dateStr).toLocaleString('vi-VN', {
        //             year: 'numeric',
        //             month: '2-digit',
        //             day: '2-digit',
        //             hour: '2-digit',
        //             minute: '2-digit',
        //         }),
        // },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="text"
                        icon={<Pen />}
                        onClick={() => setSelectedDocument(record)}
                    />
                </Tooltip>
            ),
        },
    ];

    const [selectedItem, setSelectedItem] = useState<IDocumentResponse>();
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (selectedItem) {
    //         NotificationService.success({
    //             message: `Đã chọn tài liệu: ${selectedItem.fileId}`,
    //         });
    //     }
    // }, [selectedItem]);

    return (
        <>
            <div className="flex w-full overflow-hidden gap-6">
                {/* Bảng bên trái */}
                <div className="flex-1 min-w-0">
                    <DataGrid<IDocumentResponse>
                        nameTable="documents"
                        columns={columns}
                        rowKey="id"
                        singleSelect={true}
                        fetcher={(search, page, limit) => getDocuments(search, page, limit)}
                        btnAddInfo={{
                            title: 'Thêm tài liệu',
                            onClick: () => setIsShowModalCreate(true),
                        }}
                        onSelectionChange={(item: IDocumentResponse | null) => {
                            setSelectedItem(item ?? undefined);
                            mutate('documents');
                        }}
                    />
                </div>

                {/* Preview bên phải */}
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
            </div >
        </>
    );
}
