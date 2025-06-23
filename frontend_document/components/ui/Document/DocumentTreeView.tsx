import type { ITreeNode } from '@/types/tree';
import { Tree } from 'antd';
import { HiFolderOpen, HiOutlineDocument } from 'react-icons/hi2';
import { FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa6';
import type { AntdTreeNodeAttribute } from 'antd/es/tree/Tree';

interface DocumentTreeViewProps {
    treeData: ITreeNode[];
    selectedKeys: React.Key[];
    onSelect: (keys: React.Key[], info: any) => void;
    expandedKeys: React.Key[];
    onExpand: (keys: React.Key[]) => void;
}

function renderIcon(props: any) {
    if (!props.isLeaf) {
        return <HiFolderOpen className="text-yellow-500 w-5 h-5" />;
    }
    const name: string = props.name || '';
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
        return <FaFileImage className="text-blue-400 w-5 h-5" />;
    }
    if (['pdf'].includes(ext || '')) {
        return <FaFilePdf className="text-red-500 w-5 h-5" />;
    }
    if (['doc', 'docx'].includes(ext || '')) {
        return <FaFileWord className="text-blue-600 w-5 h-5" />;
    }
    return <HiOutlineDocument className="text-gray-400 w-5 h-5" />;
}

export default function DocumentTreeView({
    treeData,
    selectedKeys,
    onSelect,
    expandedKeys,
    onExpand,
}: DocumentTreeViewProps) {
    return (
        <div className="h-full bg-white rounded-xl shadow p-2 overflow-auto">
            <Tree
                treeData={treeData}
                selectedKeys={selectedKeys}
                onSelect={onSelect}
                expandedKeys={expandedKeys}
                onExpand={onExpand}
                showLine={{ showLeafIcon: false }}
                height={600}
                autoExpandParent={false}
                icon={renderIcon}
                className="custom-treeview [&_.ant-tree]:bg-transparent [&_.ant-tree]:!text-base"
            />
        </div>
    );
}