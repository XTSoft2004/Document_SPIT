'use client';

import { useState } from "react";
import { Button } from "antd";
import { Tag, XCircle } from "lucide-react";
import { IDocumentResponse } from "@/types/document";

interface PreviewPanelProps {
    selectedItem: IDocumentResponse;
    onClose: () => void;
    onReload: () => void;
}

const PreviewPanel = ({ selectedItem, onClose, onReload }: PreviewPanelProps) => {
    const [loading, setLoading] = useState(true);

    if (!selectedItem) {
        return (
            <div className="p-8 text-gray-400 text-center flex flex-col items-center justify-center h-full">
                <Tag size={40} color="gray" className="mb-4" />
                <span className="text-lg">Chọn một tài liệu để xem trước</span>
            </div>
        );
    }

    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(selectedItem.typeFile?.toLowerCase());

    return (
        <div className="w-full md:w-[350px] h-[90%]">
            <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col">
                <div className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    Xem trước file:
                    <div className="flex items-center">
                        <Button type="text" onClick={onReload} className="ml-2">
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 1 1 18.364 6.636" />
                            </svg>
                        </Button>
                        <Button type="text" onClick={onClose} className="ml-2" aria-label="Đóng xem trước">
                            <XCircle size={20} />
                        </Button>
                    </div>
                </div>

                {isImage ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-1 flex items-center justify-center">
                        <img
                            src={`http://localhost:5000/driver/preview/${selectedItem?.fileId}`}
                            alt="Xem trước ảnh"
                            className="max-h-[800px] max-w-full object-contain"
                            style={{ margin: 'auto' }}
                            onLoad={() => setLoading(false)}
                        />
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
                                <span className="ml-2 text-gray-500">Đang tải...</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-1">
                        <iframe
                            key={selectedItem.fileId + (loading ? '-loading' : '')}
                            src={`http://localhost:5000/driver/preview/${selectedItem?.fileId}#toolbar=0`}
                            title="Xem trước file"
                            width="100%"
                            height="100%"
                            className="border-0 min-h-[700px] h-full"
                            onLoad={() => setLoading(false)}
                            style={{ display: loading ? 'none' : 'block' }}
                        />
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                                <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></span>
                                <span className="ml-2 text-gray-500">Đang tải...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewPanel;
