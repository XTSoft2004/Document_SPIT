'use client';

import { useEffect, useState } from "react";
import { Button, message, TableColumnType } from "antd";
import { CheckCircle, Clock, XCircle, EarthLock, Earth, Pen } from "lucide-react";

import { getDocuments, updateDocument } from "@/actions/document.actions";
import ModalCreateDocument from "@/components/ui/Admin/Document/Modal/ModalCreateDocument";
import DataGrid from "@/components/ui/Table/DataGrid";
import { IDocumentResponse } from "@/types/document";
import PreviewPanel from "@/components/ui/Admin/Document/PreviewPanel";
import { Tooltip } from "antd";
import { mutateTable, reloadTable } from "@/utils/swrReload";
import ModalUpdateDocument from "@/components/ui/Admin/Document/Modal/ModalUpdateDocument";
import { mutate } from "swr";

export default function DocumentPage() {
    const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse>();
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
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
        }, {
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
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="text"
                        icon={<Pen />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocument(record);
                            setIsShowModalUpdate(true);
                        }}
                    />
                </Tooltip>
            ),
        },
    ];

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
                        btnAddInfo={{
                            title: 'Thêm tài liệu',
                            onClick: () => setIsShowModalCreate(true),
                        }}
                        onSelectionChange={(item: IDocumentResponse | null) => {
                            setSelectedItem(item ?? undefined);
                            reloadTable('document');
                        }}
                    />
                </div>                {/* Preview bên phải */}
                <div className={`transition-all duration-300 ease-in-out ${selectedItem
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
                </div>
            </div>

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
