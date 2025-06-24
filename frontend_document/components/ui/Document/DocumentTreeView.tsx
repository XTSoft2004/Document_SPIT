import type { ITreeNode } from '@/types/tree';
import { GetProps, Tree } from 'antd';
const { DirectoryTree } = Tree;
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
interface DocumentTreeViewProps {
    treeData: ITreeNode[];
    selectedKeys: React.Key[];
    onSelect: (keys: React.Key[], info: any) => void;
    expandedKeys: React.Key[];
    onExpand: (keys: React.Key[]) => void;
}

export default function DocumentTreeView({
    treeData,
    selectedKeys,
    onSelect,
    expandedKeys,
    onExpand,
}: DocumentTreeViewProps) {
    return (
        <DirectoryTree
            treeData={treeData}
            selectedKeys={selectedKeys}
            onSelect={onSelect}
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            showLine={true}
            autoExpandParent={false}
            className="custom-treeview [&_.ant-tree]:bg-transparent [&_.ant-tree]:!text-base"
        />
    );
}