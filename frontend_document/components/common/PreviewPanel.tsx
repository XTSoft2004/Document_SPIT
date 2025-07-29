'use client';

import { useState, useEffect } from "react";
import { Button } from "antd";
import { XCircle, RefreshCw, Image as ImageIcon, FileText, Download, Eye } from "lucide-react";
import { IDocumentResponse } from "@/types/document";
import globalConfig from "@/app.config";
import { getCodeView } from "@/actions/document.actions";
import Image from "next/image";
import PreviewCommon from "./PreviewCommon";
import NotificationService from "../ui/Notification/NotificationService";

interface PreviewPanelProps {
    selectedItem: IDocumentResponse;
    onClose: () => void;
    className?: string; // Thêm className cho customization
    showCloseButton?: boolean; // Option để ẩn/hiện nút close
}

const PreviewPanel = ({
    selectedItem,
    onClose,
    className = "",
    showCloseButton = true
}: PreviewPanelProps) => {
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [codeView, setCodeView] = useState<string | null>(null);

    // Reset loading state khi selectedItem hoặc codeView thay đổi
    useEffect(() => {
        setLoading(true);
        setImageError(false);
    }, [codeView]);
    // Reset loading state khi selectedItem thay đổi
    useEffect(() => {
        setLoading(true);
        setImageError(true);
    }, []);

    // const fetchDocumentCode = async (document: IDocumentResponse) => {
    //     const response = await getCodeView(document.id);
    //     if (response.ok) {
    //         setCodeView(response.data.code);
    //         // NotificationService.success({
    //         //     message: `Tải mã xem trước thành công | ${response.data.code || 'N/A'}`,
    //         //     description: "Mã xem trước đã được tải thành công.",
    //         // });
    //         return;
    //     }
    //     // NotificationService.error({
    //     //     message: response.message || "Không thể tải mã xem trước",
    //     //     description: "Vui lòng thử lại sau.",
    //     // });
    //     setImageError(true);
    // }

    // const reloadPreview = async () => {
    //     setLoading(true);
    //     if (selectedItem) {
    //         await fetchDocumentCode(selectedItem);
    //     }
    // }

    if (!selectedItem) {
        return (
            <div className={`w-full h-[100%] flex items-center justify-center ${className}`}>
                <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
                        <Eye className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Xem trước tài liệu
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Chọn một tài liệu từ danh sách để xem trước nội dung
                    </p>
                </div>
            </div>
        );
    }

    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(selectedItem.typeFile?.toLowerCase());

    return (
        <div className={`w-full h-[100%] animate-in fade-in slide-in-from-right-3 duration-300 ${className}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col overflow-hidden transform transition-all duration-200 hover:shadow-2xl">

                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                {isImage ? (
                                    <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                    Xem trước
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[160px] lg:max-w-[200px]">
                                    {selectedItem.name}
                                </p>
                            </div>
                        </div>

                        {showCloseButton && (
                            <div className="flex items-center gap-1">
                                {/* <Button
                                    type="text"
                                    size="small"
                                    onClick={reloadPreview}
                                    className="!p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-lg transition-colors"
                                    icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                                /> */}
                                <Button
                                    type="text"
                                    size="small"
                                    onClick={onClose}
                                    className="!p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-lg transition-colors text-gray-500"
                                    icon={<XCircle className="w-4 h-4" />}
                                />
                            </div>
                        )}

                        {/* {!showCloseButton && (
                            <Button
                                type="text"
                                size="small"
                                onClick={reloadPreview}
                                className="!p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-lg transition-colors"
                                icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                            />
                        )} */}
                    </div>

                    {/* File info badges */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${isImage
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}>
                            {isImage ? 'Hình ảnh' : 'PDF'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                            {selectedItem.typeFile?.toUpperCase()}
                        </span>
                    </div>
                </div>

                <PreviewCommon documentId={selectedItem.id} fileName={selectedItem.fileName} />

                {/* Footer */}
                <div className="px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                {loading ? 'Đang tải...' : 'Sẵn sàng'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedItem.totalViews && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                                    {selectedItem.totalViews} lượt xem
                                </span>
                            )}
                            <Button
                                type="text"
                                size="small"
                                className="!p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                icon={<Download className="w-3 h-3" />}
                                onClick={() => {
                                    const downloadUrl = `${globalConfig.baseUrl}/document/download/${selectedItem.fileId}`;
                                    const link = document.createElement('a')
                                    link.href = downloadUrl
                                    link.download = selectedItem.fileName || 'document'
                                    link.style.display = 'none'
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                    NotificationService.loading({
                                        message: 'Đang tải xuống',
                                        description: `Vui lòng đợi trong giây lát...`,
                                        duration: 3,
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
