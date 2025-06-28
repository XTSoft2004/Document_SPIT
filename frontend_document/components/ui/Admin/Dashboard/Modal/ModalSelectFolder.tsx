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
    folderIdCurrent?: string;
    onClose: () => void;
    onSelectFolder: (folderId: IFileInfo, breadcrumb: string) => void;
    defaultFolderId?: string; // Thêm prop để có folder mặc định
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

const ModalSelectFolder: React.FC<ModalSelectFolderProps> = ({ 
    open, 
    folderIdCurrent, 
    onClose, 
    onSelectFolder, 
    defaultFolderId 
}) => {
    // Lấy folder ID với fallback
    const getFolderId = () => {
        return folderIdCurrent || defaultFolderId || '';
    };

    // Khởi tạo với lazy initialization
    const [currentFolderId, setCurrentFolderId] = useState(() => getFolderId());

    // Cập nhật currentFolderId khi folderIdCurrent thay đổi
    useEffect(() => {
        const newFolderId = getFolderId();
        setCurrentFolderId(newFolderId);
    }, [folderIdCurrent, defaultFolderId]);

    // Khởi tạo path với lazy initialization
    const [path, setPath] = useState<IFileInfo[]>(() => [
        {
            id: getFolderId(),
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
            const folderId = getFolderId();
            setCurrentFolderId(folderId);
            setPath([
                {
                    id: folderId,
                    name: 'Home',
                },
            ]);
            setSelectedFolderId(null);
            setError(null);
            setNewFolderName('');
            setCreatingFolder(false);
            setIsCreatingFolder(false);
            setFolderNameError(null);
        }
    }, [open, folderIdCurrent, defaultFolderId]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ILoadFolder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [folderNameError, setFolderNameError] = useState<string | null>(null);

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
        if (!newFolderName.trim() || isCreatingFolder) return;

        // Reset error
        setFolderNameError(null);

        // Kiểm tra tên folder có trùng lặp không
        const isDuplicate = items.some(item => 
            item.name.toLowerCase() === newFolderName.trim().toLowerCase()
        );
        
        if (isDuplicate) {
            setFolderNameError('Tên thư mục đã tồn tại');
            return false;
        }

        // Kiểm tra currentFolderId có hợp lệ không
        if (!currentFolderId) {
            setFolderNameError('Không xác định được thư mục hiện tại');
            return false;
        }

        setIsCreatingFolder(true);
        try {
            // Tạo folder mới
            const createResponse = await createFolder(newFolderName, currentFolderId);
            
            if (!createResponse.ok) {
                setFolderNameError(createResponse.message || 'Tạo thư mục thất bại');
                return false;
            }

            // Tải lại danh sách thư mục sau khi tạo mới
            await fetchFolder();
            
            NotificationService.success({
                message: `Thư mục "${newFolderName}" đã được tạo thành công.`,
            });
            
            // Reset state sau khi tạo thành công
            setNewFolderName('');
            setCreatingFolder(false);
            return true;
        } catch (error) {
            console.error('Error creating folder:', error);
            setFolderNameError('Có lỗi xảy ra khi tạo thư mục');
            return false;
        } finally {
            setIsCreatingFolder(false);
        }
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
                onClick={() => {
                    setCreatingFolder(true);
                }}
                style={isMobile ? { width: '100%' } : {}}
                disabled={creatingFolder}
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
                {/* Form tạo folder - hiển thị ở đầu khi đang tạo */}
                {creatingFolder && (
                    <div style={{ marginBottom: 16 }}>
                        <div
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px dashed #1890ff',
                                borderRadius: isMobile ? 8 : 10,
                                padding: isMobile ? '12px 16px' : 12,
                                gap: 8,
                                background: '#f0f5ff',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isMobile ? 12 : 10,
                            }}>
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
                                    onChange={(e) => {
                                        setNewFolderName(e.target.value);
                                        setFolderNameError(null); // Clear error when typing
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isCreatingFolder) {
                                            handleCreateFolder();
                                        } else if (e.key === 'Escape' && !isCreatingFolder) {
                                            setCreatingFolder(false);
                                            setNewFolderName('');
                                            setFolderNameError(null);
                                        }
                                    }}
                                />
                            </div>
                            {folderNameError && (
                                <div style={{
                                    color: '#ff4d4f',
                                    fontSize: 12,
                                    marginTop: 4,
                                    marginLeft: isMobile ? 32 : 26
                                }}>
                                    {folderNameError}
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 8,
                                marginTop: 8,
                                paddingTop: 8,
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setCreatingFolder(false);
                                        setNewFolderName('');
                                        setFolderNameError(null);
                                    }}
                                    disabled={isCreatingFolder}
                                    style={{
                                        borderRadius: 6,
                                        minWidth: 60
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    disabled={!newFolderName.trim() || isCreatingFolder}
                                    loading={isCreatingFolder}
                                    onClick={handleCreateFolder}
                                    style={{
                                        borderRadius: 6,
                                        minWidth: 60,
                                        boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
                                    }}
                                >
                                    Tạo
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nội dung folder */}
                {loading ? (
                    <List
                        grid={isMobile ? { gutter: 8, column: 1 } : { gutter: 16, column: 5 }}
                        dataSource={[]}
                        renderItem={() => null}
                    >
                        {skeletonCards}
                    </List>
                ) : items.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 200,
                        color: '#8c8c8c'
                    }}>
                        <FolderFilled style={{ fontSize: 48, marginBottom: 16, color: '#d9d9d9' }} />
                        <Text style={{ fontSize: 16, color: '#8c8c8c' }}>
                            Không có tài liệu nào
                        </Text>
                        <Text style={{ fontSize: 14, color: '#bfbfbf', marginTop: 8 }}>
                            Thư mục này đang trống
                        </Text>
                    </div>
                ) : (
                    <List
                        grid={isMobile ? { gutter: 8, column: 1 } : { gutter: 16, column: 5 }}
                        dataSource={items}
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
                                    }} 
                                    onClick={() => setSelectedFolderId(folder.id)}
                                    onDoubleClick={() => {
                                        if (folder.isFolder) {
                                            setPath(prev => [...prev, { id: folder.id, name: folder.name }]);
                                            setCurrentFolderId(folder.id);
                                            setSelectedFolderId(null);
                                        }
                                    }}
                                >
                                    {getIcon(folder.isFolder, folder.typeDocument)}
                                    <Text style={{
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
                    />
                )}
            </div>
    </Modal>
    );
};

export default ModalSelectFolder;
