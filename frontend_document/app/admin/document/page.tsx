'use client';

import { useEffect, useState } from "react";
import { Button, message, TableColumnType } from "antd";
import { CheckCircle, Clock, XCircle, EarthLock, Earth, Pen } from "lucide-react";

import { getDocuments } from "@/actions/document.actions";
import ModalCreateDocument from "@/components/ui/Admin/Document/Modal/ModalCreateDocument";
import DataGrid from "@/components/ui/Table/DataGrid";
import { IDocumentResponse } from "@/types/document";
import PreviewPanel from "@/components/ui/Admin/Document/PreviewPanel";
import { Tooltip } from "antd";
import { reloadSWR } from "@/utils/swrReload";

export default function DocumentPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
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

    return (
        <>
            <div className="flex flex-col md:flex-row w-full gap-6">
                {/* Bảng bên trái */}
                <div className="flex-1 min-w-0 overflow-x-auto">
                    <DataGrid<IDocumentResponse>
                        nameTable="document"
                        columns={columns}
                        rowKey="id"
                        singleSelect={true}
                        fetcher={async (search: string, page: number, limit: number) => {
                            const res = await getDocuments(search, page, limit);
                            return res;
                        }}
                        btnAddInfo={{
                            title: 'Thêm tài liệu',
                            onClick: () => setIsShowModalCreate(true),
                        }}
                        onSelectionChange={(item: IDocumentResponse | null) => {
                            setSelectedItem(item ?? undefined);
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
            </div>

            <ModalCreateDocument
                visible={isShowModalCreate}
                onCancel={() => {
                    setIsShowModalCreate(false)
                    reloadSWR()
                }}
            />
        </>
    );
}
