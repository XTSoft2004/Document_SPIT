import React, { useState } from "react";
import { Button } from "antd";
import { FolderFilled } from "@ant-design/icons";
import { IFileInfo } from "@/types/driver";
import ModalSelectFolder from "../ui/Admin/Dashboard/Modal/ModalSelectFolder";

interface FolderSelectorProps {
    onSelect: (folder: IFileInfo, breadcrumb: string) => void;
    folderIdCurrent?: string
}

const FolderSelector: React.FC<FolderSelectorProps> = ({ onSelect, folderIdCurrent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<IFileInfo | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<string>("");

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)} block>
                Chọn thư mục
            </Button>
            <ModalSelectFolder
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectFolder={(folder: IFileInfo, bc: string) => {
                    setSelected(folder);
                    setBreadcrumb(bc);
                    onSelect(folder, bc);
                    setIsModalOpen(false);
                }}
                folderIdCurrent={folderIdCurrent}
            />
            <div className="flex items-center mt-2">
                <FolderFilled className="text-xl" style={{ color: "#faad14" }} />
                {selected ? (
                    <span className="ml-2 text-black truncate max-w-xs" title={breadcrumb}>
                        {breadcrumb}
                    </span>
                ) : (
                    <span className="ml-2 text-black">Chưa chọn thư mục</span>
                )}
            </div>
        </>
    );
};

export default FolderSelector;
