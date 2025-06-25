'use client';

import { useState, useEffect } from "react";
import { Button } from "antd";
import { Tag, XCircle, RefreshCw, File, Image as ImageIcon, FileText, Download, Eye } from "lucide-react";
import { IDocumentResponse } from "@/types/document";
import globalConfig from "@/app.config";
import { getCodeView } from "@/actions/document.actions";
import NotificationService from "../../Notification/NotificationService";

interface PreviewPanelProps {
    selectedItem: IDocumentResponse;
    onClose: () => void;
    onReload: () => void;
}

const PreviewPanel = ({ selectedItem, onClose, onReload }: PreviewPanelProps) => {
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [codeView, setCodeView] = useState<string | null>(null);
    // Reset loading state khi selectedItem thay đổi
    useEffect(() => {
        setLoading(true);
        setImageError(false);
        if (selectedItem?.fileId) {
            fetchDocumentCode(selectedItem);
        }
    }, [selectedItem?.fileId]);

    const fetchDocumentCode = async (document: IDocumentResponse) => {
        const response = await getCodeView(document.id);
        if (response.ok) {
            setCodeView(response.data.code);
            // NotificationService.success({
            //     message: `Tải mã xem trước thành công | ${response.data.code || 'N/A'}`,
            //     description: "Mã xem trước đã được tải thành công.",
            // });
        }
    }

    if (!selectedItem) {
        return (
            <div className="w-full md:w-[350px] h-[calc(100vh-140px)] flex items-center justify-center">
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
        <div className="w-full md:w-[350px] h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-3 duration-300 ml-3">
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
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
                                    {selectedItem.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                type="text"
                                size="small"
                                onClick={onReload}
                                className="!p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-lg transition-colors"
                                icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                            />
                            <Button
                                type="text"
                                size="small"
                                onClick={onClose}
                                className="!p-2 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-lg transition-colors text-gray-500"
                                icon={<XCircle className="w-4 h-4" />}
                            />
                        </div>
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

                {/* Content */}
                <div className="flex-1 p-4 relative">
                    {isImage ? (
                        <div className="relative h-full group">
                            {/* Loading state */}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Đang tải hình ảnh...</span>
                                    </div>
                                </div>
                            )}

                            {/* Error state */}
                            {imageError && (
                                <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-3 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-red-500 dark:text-red-400" />
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">Không thể tải hình ảnh</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Vui lòng thử lại sau</p>
                                    </div>
                                </div>
                            )}

                            {/* Image */}
                            {!imageError && (
                                <div className="h-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                    <img
                                        src={`${globalConfig.baseUrl}/document/view/${codeView}`}
                                        alt="Xem trước ảnh"
                                        className={`w-full h-full object-contain transition-all duration-500 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                                            } group-hover:scale-105`}
                                        onLoad={() => setLoading(false)}
                                        onError={() => {
                                            setLoading(false);
                                            setImageError(true);
                                        }}
                                    />

                                    {/* Image overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative h-full">
                            {/* Loading state */}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-xl z-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Đang tải PDF...</span>
                                    </div>
                                </div>
                            )}

                            {/* PDF iframe */}
                            <div className="h-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white">
                                <iframe
                                    key={selectedItem.fileId + (loading ? '-loading' : '')}
                                    src={`${globalConfig.baseUrl}/document/view/${codeView}#toolbar=0&navpanes=0&scrollbar=0`}
                                    title="Xem trước PDF"
                                    width="100%"
                                    height="100%"
                                    className={`border-0 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'
                                        }`}
                                    onLoad={() => setLoading(false)}
                                />
                            </div>

                            {/* PDF indicator */}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-red-500" />
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">PDF</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                {loading ? 'Đang tải...' : 'Sẵn sàng'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedItem.totalViews && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedItem.totalViews} lượt xem
                                </span>
                            )}
                            <Button
                                type="text"
                                size="small"
                                className="!p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                icon={<Download className="w-3 h-3" />}
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = `${globalConfig.baseUrl}/document/download/${selectedItem.fileId}`;
                                    link.download = selectedItem.name;
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
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
