import React from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, File } from 'lucide-react';
import type { ITreeNode } from '@/types/tree';
import { HiFolderOpen, HiOutlineDocument } from 'react-icons/hi2';
import { FaFilePdf, FaFileWord } from 'react-icons/fa6';

interface TreeViewProps {
    treeData: ITreeNode[];
    selectedKeys: React.Key[];
    expandedKeys: React.Key[];
    onSelect: (keys: React.Key[], info: { node: ITreeNode }) => void;
    onExpand: (keys: React.Key[]) => void;
}

interface TreeNodeProps {
    node: ITreeNode;
    level: number;
    selectedKeys: React.Key[];
    expandedKeys: React.Key[];
    onSelect: (keys: React.Key[], info: { node: ITreeNode }) => void;
    onExpand: (keys: React.Key[]) => void;
}

const getFileIcon = (name: string, isFolder: boolean) => {
    if (isFolder) return <HiFolderOpen className="w-8 h-8 text-yellow-500 fill-yellow-400" />;
    if (name.endsWith('.pdf')) return <FaFilePdf className="w-8 h-8 text-red-500" />;
    if (name.endsWith('.doc') || name.endsWith('.docx')) return <FaFileWord className="w-8 h-8 text-blue-600" />;
    return <HiOutlineDocument className="w-8 h-8 text-gray-400" />;
};

const TreeNode = ({ node, level, selectedKeys, expandedKeys, onSelect, onExpand }: TreeNodeProps) => {
    const isSelected = selectedKeys.includes(node.key);
    const isExpanded = expandedKeys.includes(node.key);
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = level * 12 + 8; // 12px per level + 8px base

    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasChildren) return;

        const newExpandedKeys = isExpanded
            ? expandedKeys.filter(key => key !== node.key)
            : [...expandedKeys, node.key];
        onExpand(newExpandedKeys);
    };

    const handleSelect = () => {
        onSelect([node.idDocument], { node });
    };

    return (
        <div className="select-none">
            {/* Node content */}
            <div
                className={`flex items-center py-1 pr-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={handleSelect}
            >
                {/* Expand/Collapse button */}
                <div className="w-4 h-4 flex items-center justify-center mr-1 flex-shrink-0">
                    {hasChildren && (
                        <button
                            onClick={handleToggleExpand}
                            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-3 h-3 text-gray-600" />
                            ) : (
                                <ChevronRight className="w-3 h-3 text-gray-600" />
                            )}
                        </button>
                    )}
                </div>

                {/* Icon */}
                <div className="w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0">
                    {getFileIcon(node.title, !node.isLeaf)}
                </div>

                {/* Title with truncation */}
                <span
                    className={`text-sm truncate flex-1 min-w-0 transition-colors duration-150 ${isSelected
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700 group-hover:text-gray-900'
                        }`}
                    title={node.title}
                >
                    {node.title}
                </span>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="transition-all duration-200 ease-in-out">
                    {node.children?.map((child) => (
                        <TreeNode
                            key={child.key}
                            node={child}
                            level={level + 1}
                            selectedKeys={selectedKeys}
                            expandedKeys={expandedKeys}
                            onSelect={onSelect}
                            onExpand={onExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeView = ({ treeData, selectedKeys, expandedKeys, onSelect, onExpand }: TreeViewProps) => {
    return (
        <div className="w-full">
            {treeData.map((node) => (
                <TreeNode
                    key={node.key}
                    node={node}
                    level={0}
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys}
                    onSelect={onSelect}
                    onExpand={onExpand}
                />
            ))}
        </div>
    );
};

export default TreeView;