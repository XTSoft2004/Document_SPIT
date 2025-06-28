import { updateDocument } from "@/actions/document.actions";
import { IDocumentResponse } from "@/types/document";
import { reloadTable } from "@/utils/swrReload";
import { TableColumnType } from "antd";
import NotificationService from "../../Notification/NotificationService";



// Tất cả các columns có sẵn
export const allColumnsTableDocument: TableColumnType<IDocumentResponse>[] = [
    {
        title: 'Tên tài liệu',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (name: string) => {
            return (
                <span className="max-w-48 truncate inline-block" title={name}>
                    {name}
                </span>
            )
        },
    },
    {
        title: 'Lượt tải',
        dataIndex: 'totalDownloads',
        key: 'totalDownloads',
        width: 100,
        align: 'center',
    },
    {
        title: 'Lượt xem',
        dataIndex: 'totalViews',
        key: 'totalViews',
        width: 100,
        align: 'center',
    },
    {
        title: 'Người đăng tải',
        dataIndex: 'fullNameUser',
        key: 'fullNameUser',
        width: 150,
        align: 'center',
        render: (fullNameUser: string) => {
            return (
                <span className="max-w-48 truncate inline-block" title={fullNameUser}>{fullNameUser}</span>
            );
        },
    },
    {
        title: 'Thư mục',
        dataIndex: 'folderId',
        key: 'folderId',
        width: 50,
        align: 'center',
        render: (folderId: string) => (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-700 font-medium text-xs border border-yellow-200">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline mr-1 text-yellow-400">
                    <path d="M3 7a2 2 0 0 1 2-2h4.465a2 2 0 0 1 1.414.586l1.535 1.535A2 2 0 0 0 14.828 8H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                {folderId
                    ? (
                        <span className="max-w-16 truncate inline-block" title={folderId}>
                            {folderId}
                        </span>
                    )
                    : <span className="italic text-gray-400">Chưa có</span>
                }
            </span>
        ),
    },
    {
        title: 'Môn học',
        dataIndex: 'courseName',
        key: 'courseName',
        width: 100,
        align: 'center',
        render: (courseName: string) => {
            return (
                <span className="max-w-30 truncate inline-block" title={courseName}>
                    {courseName}
                </span>
            )
        }
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
                        NotificationService.success({
                            message: `Đã cập nhật trạng thái tài liệu thành ${newValue ? 'riêng tư' : 'công khai'}`
                        });
                        reloadTable('document');
                        reloadTable('document_pending');
                        reloadTable('document_rejected');
                        return;
                    }
                    NotificationService.success({
                        message: response.message || 'Cập nhật trạng thái tài liệu thất bại'
                    });
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
    },
    {
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
                    // Gọi API cập nhật trạng thái duyệt tại đây
                    const response = await updateDocument(record.id.toString(), { statusDocument: newStatus });
                    if (response.ok) {
                        const statusLabels: Record<string, string> = {
                            Approved: "đã duyệt",
                            Pending: "đang chờ duyệt",
                            Rejected: "không duyệt",
                        };
                        NotificationService.success({
                            message: `Đã cập nhật trạng thái duyệt thành ${statusLabels[newStatus]}`
                        });
                        // Reload data sau khi cập nhật
                        reloadTable('document');
                        reloadTable('document_pending');
                        reloadTable('document_rejected');

                        return;
                    }
                    NotificationService.error({
                        message: 'Cập nhật trạng thái duyệt thất bại'
                    });
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
    }
];

// Định nghĩa type cho các column keys có thể có
/**
 * Lấy danh sách key của allColumnsTableDocument một cách tự động.
 */
export type DocumentColumnKey = typeof allColumnsTableDocument[number]['key'];

/**
 * Hàm để lấy các columns theo list key được chỉ định
 */
export const getFilteredColumnsTableDocument = (
    columnKeys: DocumentColumnKey[]
): TableColumnType<IDocumentResponse>[] => {
    return allColumnsTableDocument.filter(column =>
        columnKeys.includes(column.key as DocumentColumnKey)
    );
};
