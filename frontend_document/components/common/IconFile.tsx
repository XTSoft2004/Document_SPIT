import { FaFilePdf, FaFileWord } from "react-icons/fa6";
import { HiFolderOpen, HiOutlineDocument } from "react-icons/hi2";

const getFileIcon = (name: string, isFolder: boolean) => {
    if (isFolder) return <HiFolderOpen className="w-8 h-8 text-yellow-500 fill-yellow-400" />;
    if (name.endsWith('.pdf')) return <FaFilePdf className="w-8 h-8 text-red-500" />;
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FaFileWord className="w-8 h-8 text-blue-600" />;
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp')) {
        return (
            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                <path fill="#90CAF9" d="M40 45L8 45 8 3 30 3 40 13z"></path><path fill="#E1F5FE" d="M38.5 14L29 14 29 4.5z"></path><path fill="#1565C0" d="M21 23L14 33 28 33z"></path><path fill="#1976D2" d="M28 26.4L23 33 33 33zM31.5 23A1.5 1.5 0 1 0 31.5 26 1.5 1.5 0 1 0 31.5 23z"></path>
            </svg>
        )
    }
    return <HiOutlineDocument className="w-8 h-8 text-gray-400" />;
};

export default getFileIcon;