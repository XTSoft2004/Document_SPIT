import React, { useEffect, useState } from 'react';
import { Modal, Button, List, Typography, Skeleton } from 'antd';
import { FileOutlined, FolderFilled, ReloadOutlined } from '@ant-design/icons';
import PathFolder from '@/components/ui/Document/breadcrumb-folder';
import { IFileInfo, ILoadFolder } from '@/types/driver';
import { createFolder, loadFolder } from '@/actions/driver.action';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoIcon from '@mui/icons-material/Photo';
import DescriptionIcon from '@mui/icons-material/Description';
import { set } from 'zod';
import NotificationService from '@/components/ui/Notification/NotificationService';

const { Text } = Typography;

interface ModalSelectFolderProps {
    open: boolean;
    onClose: () => void;
    onSelectFolder: (folderId: IFileInfo, breadcrumb: string) => void;
}

const getIcon = (isFolder: boolean, typeDocument: string) => {
    if (isFolder) return <FolderFilled className="text-xl" style={{ color: '#faad14' }} />
    switch (typeDocument) {
        case 'image':
        case 'png':
            return <PhotoIcon className="text-xl" style={{ color: '#1890ff' }} />
        case 'pdf':
            return <PictureAsPdfIcon className="text-xl" style={{ color: '#ff4d4f' }} />
        case 'docx':
            return <DescriptionIcon className="text-xl" style={{ color: '#1890ff' }} />
        default:
            return <FileOutlined className="text-xl" />
    }
};

const ModalSelectFolder: React.FC<ModalSelectFolderProps> = ({ open, onClose, onSelectFolder }) => {
    const [currentFolderId, setCurrentFolderId] = useState('1YNGtw_N86pgMmY6uYA4MEbZAzgGH7kSS');
    const [path, setPath] = useState<IFileInfo[]>([
        {
            id: '1YNGtw_N86pgMmY6uYA4MEbZAzgGH7kSS',
            name: 'Home',
        },
    ]);

    // Khôi phục trạng thái khi mở modal
    useEffect(() => {
        if (open) {
            setCurrentFolderId('1YNGtw_N86pgMmY6uYA4MEbZAzgGH7kSS');
            setPath([
                {
                    id: '1YNGtw_N86pgMmY6uYA4MEbZAzgGH7kSS',
                    name: 'Home',
                },
            ]);
            setSelectedFolderId(null);
            setError(null);
            setNewFolderName('');
            setCreatingFolder(false);
        }
    }, [open]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ILoadFolder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        fetchFolder();
    }, [currentFolderId]);

    const fetchFolder = async () => {
        setLoading(true);
        setError(null);
        setItems([]);
        try {
            const response = await loadFolder(currentFolderId, true);
            setItems(response.data);
        } catch (err) {
            console.error('Error fetching folder:', err);
            setError('Failed to load folder. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return;

        NotificationService.loading({
            message: `Đang tao thư mục "${newFolderName}"...`,
        });
        // Giả lập API tạo folder mới
        const createResponse = await createFolder(newFolderName, currentFolderId);
        if (!createResponse.ok) {
            NotificationService.error({
                message: createResponse.message || 'Tạo thư mục thất bại, vui lòng thử lại sau.',
            });
            return;
        }

        fetchFolder(); // Tải lại danh sách thư mục sau khi tạo mới
        NotificationService.success({
            message: `Thư mục "${newFolderName}" đã được tạo thành công.`,
        });
        // setItems(prev => [...prev, newFolder]);
        setNewFolderName('');
        setCreatingFolder(false);
    };

    const skeletonCards = (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Array.from({ length: 15 }, (_, index) => (
                <div key={index} style={{ flex: '0 0 calc(20% - 13px)', marginBottom: 16 }}>
                    <Skeleton.Input
                        active
                        style={{ width: '100%', height: 48, borderRadius: 10 }}
                    />
                </div>
            ))}
        </div>
    );

    return (
        <Modal
            title={`Chọn thư mục tải lên`}
            open={open}
            onCancel={onClose}
            footer={[
                <Button
                    key="select"
                    onClick={() => {
                        if (selectedFolderId) {
                            const selectedFolder = items.find(item => item.id === selectedFolderId);
                            const breadcrumb = path
                                .concat(selectedFolder ? [{ id: selectedFolder.id, name: selectedFolder.name }] : [])
                                .map(item => item.name)
                                .join(' / ');
                            onSelectFolder(
                                {
                                    id: selectedFolderId,
                                    name: selectedFolder?.name || ''
                                },
                                breadcrumb
                            );
                        }
                        onClose();
                    }}
                    disabled={!selectedFolderId}
                >
                    Chọn
                </Button>,
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            width={960}
        >
            <div className='my-2'>
                <PathFolder
                    path={path}
                    setPath={setPath}
                    setCurrentFolderId={setCurrentFolderId}
                />
            </div>

            <div className='mb-3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button type="dashed" onClick={() => setCreatingFolder(true)}>
                    + Tạo thư mục mới
                </Button>
                <Button
                    type="text"
                    icon={<ReloadOutlined style={{ fontSize: 18 }} />}
                    onClick={fetchFolder}
                    title="Tải lại thư mục"
                />
            </div>

            <div style={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
                <List
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={loading ? [] : items}
                    renderItem={(folder) => (
                        <List.Item>
                            <Button
                                type={selectedFolderId === folder.id ? "primary" : "text"}
                                style={{
                                    width: '100%',
                                    height: 48,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    border: selectedFolderId === folder.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                                    borderRadius: 10,
                                    background: selectedFolderId === folder.id ? '#e6f7ff' : '#fafafa',
                                    cursor: 'pointer',
                                    padding: 12,
                                    gap: 10,
                                }}
                                onClick={() => setSelectedFolderId(folder.id)}
                                onDoubleClick={() => {
                                    setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
                                    setCurrentFolderId(folder.id);
                                }}
                            >
                                {getIcon(folder.isFolder, folder.typeDocument)}
                                <Text style={{ fontSize: 14, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {folder.name}
                                </Text>
                            </Button>
                        </List.Item>
                    )}
                >
                    {creatingFolder && (
                        <List.Item>
                            <div
                                style={{
                                    width: '100%',
                                    height: 48,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    border: '1px dashed #1890ff',
                                    borderRadius: 10,
                                    padding: 12,
                                    gap: 10,
                                    background: '#f0f5ff',
                                }}
                            >
                                <FolderFilled style={{ color: '#1890ff' }} />
                                <input
                                    autoFocus
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: 14,
                                    }}
                                    placeholder="Nhập tên thư mục..."
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateFolder();
                                            setCreatingFolder(false);
                                        }
                                    }}
                                />
                            </div>
                        </List.Item>
                    )}
                    {loading && skeletonCards}
                </List>
            </div>
        </Modal>
    );
};

export default ModalSelectFolder;
