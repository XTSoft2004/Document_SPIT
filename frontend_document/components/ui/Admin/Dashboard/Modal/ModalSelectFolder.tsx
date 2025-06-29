import React, { useEffect, useState } from 'react';
import { Modal, Button, List, Typography, Skeleton } from 'antd';
import { FileOutlined, FolderFilled, ReloadOutlined } from '@ant-design/icons';
import PathFolder from '@/components/ui/Document/breadcrumb-folder';
import { IFileInfo, ILoadFolder } from '@/types/driver';
import { createFolder, loadFolder } from '@/actions/driver.actions';
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
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

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
    }; const skeletonCards = isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 8 }, (_, index) => (
                <Skeleton.Input
                    key={index}
                    active
                    style={{ width: '100%', height: 56, borderRadius: 8 }}
                />
            ))}
        </div>
    ) : (
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

    return (<Modal
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
        width={isMobile ? '95%' : 960}
        style={isMobile ? { top: 20 } : {}}
    >
        <div className='my-2'>
            <PathFolder
                path={path}
                setPath={setPath}
                setCurrentFolderId={setCurrentFolderId}
            />
        </div>            <div className='mb-3' style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? 12 : 0
        }}>
            <Button
                type="dashed"
                onClick={() => setCreatingFolder(true)}
                style={isMobile ? { width: '100%' } : {}}
            >
                + Tạo thư mục mới
            </Button>
            <Button
                type="text"
                icon={<ReloadOutlined style={{ fontSize: 18 }} />}
                onClick={fetchFolder}
                title="Tải lại thư mục"
                style={isMobile ? { width: '100%' } : {}}
            >
                {isMobile && 'Tải lại thư mục'}
            </Button>
        </div>            <div style={{ maxHeight: isMobile ? 300 : 400, overflowY: 'auto', overflowX: 'hidden' }}>
            <List
                grid={isMobile ? { gutter: 8, column: 1 } : { gutter: 16, column: 5 }}
                dataSource={loading ? [] : items}
                renderItem={(folder) => (
                    <List.Item>
                        <Button
                            type={selectedFolderId === folder.id ? "primary" : "text"}
                            style={{
                                width: '100%',
                                height: isMobile ? 56 : 48,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                border: selectedFolderId === folder.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                                borderRadius: isMobile ? 8 : 10,
                                background: selectedFolderId === folder.id ? '#e6f7ff' : '#fafafa',
                                cursor: 'pointer',
                                padding: isMobile ? '12px 16px' : 12,
                                gap: isMobile ? 12 : 10,
                            }} onClick={() => setSelectedFolderId(folder.id)}
                            onDoubleClick={() => {
                                if (folder.isFolder) {
                                    setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
                                    setCurrentFolderId(folder.id);
                                    setSelectedFolderId(null);
                                }
                            }}
                        >
                            {getIcon(folder.isFolder, folder.typeDocument)}                                <Text style={{
                                fontSize: isMobile ? 16 : 14,
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                flex: 1
                            }}>
                                {folder.name}
                            </Text>
                            {isMobile && folder.isFolder && (
                                <Button
                                    type="text"
                                    size="small"
                                    style={{
                                        fontSize: 16,
                                        color: '#1890ff',
                                        padding: '4px 8px',
                                        height: 'auto',
                                        minWidth: 'auto'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
                                        setCurrentFolderId(folder.id);
                                        setSelectedFolderId(null);
                                    }}
                                >
                                    →
                                </Button>
                            )}
                        </Button>
                    </List.Item>
                )}
            >                    {creatingFolder && (
                <List.Item>
                    <div
                        style={{
                            width: '100%',
                            height: isMobile ? 56 : 48,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            border: '1px dashed #1890ff',
                            borderRadius: isMobile ? 8 : 10,
                            padding: isMobile ? '12px 16px' : 12,
                            gap: isMobile ? 12 : 10,
                            background: '#f0f5ff',
                        }}
                    >
                        <FolderFilled style={{ color: '#1890ff', fontSize: isMobile ? 20 : 16 }} />
                        <input
                            autoFocus
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: isMobile ? 16 : 14,
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
