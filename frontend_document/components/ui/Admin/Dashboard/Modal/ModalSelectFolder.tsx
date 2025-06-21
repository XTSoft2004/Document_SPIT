import React, { useEffect, useState } from 'react';
import { Modal, Button, List, Typography, Skeleton } from 'antd';
import { FileImageOutlined, FileOutlined, FilePdfOutlined, FolderFilled, FolderOutlined } from '@ant-design/icons';
import PathFolder from '@/components/ui/Document/breadcrumb-folder';
import { IFileInfo, ILoadFolder } from '@/types/driver';
import { loadFolder } from '@/actions/driver.action';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoIcon from '@mui/icons-material/Photo';
import DescriptionIcon from '@mui/icons-material/Description';
const { Text } = Typography;

interface ModalSelectFolderProps {
    open: boolean;
    onClose: () => void;
    onSelectFolder: (folderId: IFileInfo) => void;
}

const getIcon = (isFolder: boolean, typeDocument: string) => {
    if (isFolder) return <FolderFilled className="text-xl" style={{ color: '#faad14' }} />
    switch (typeDocument) {
        case 'image':
            return <PhotoIcon className="text-xl" style={{ color: '#1890ff' }} />
        case 'png':
            return <PhotoIcon className="text-xl" style={{ color: '#1890ff' }} />
        case 'pdf':
            return <PictureAsPdfIcon className="text-xl" style={{ color: '#ff4d4f' }} />
        case 'docx':
            return <DescriptionIcon className="text-xl" style={{ color: '#1890ff' }} />
        default:
            return <FileOutlined className="text-xl" />
    }
}

const ModalSelectFolder: React.FC<ModalSelectFolderProps> = ({ open, onClose, onSelectFolder }) => {
    const [currentFolderId, setCurrentFolderId] = useState('1YNGtw_N86pgMmY6uYA4MEbZAzgGH7kSS')
    const [path, setPath] = useState<IFileInfo[]>([
        {
            id: '1YNGtw_N86pgMmY6uYA4MEbZAzgGH7kSS',
            name: 'Home',
        },
    ]);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [items, setItems] = useState<ILoadFolder[]>([])

    useEffect(() => {
        const fetchFolder = async () => {
            setLoading(true)
            setError(null)
            setItems([])
            try {
                const response = await loadFolder(currentFolderId, true)
                setItems(response.data)
            } catch (err) {
                console.error('Error fetching folder:', err)
                setError('Failed to load folder. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchFolder()
    }, [currentFolderId])

    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    const skeletonCards = (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Array.from({ length: 15 }, (_, index) => (
                <div
                    key={index}
                    style={{
                        flex: '0 0 calc(20% - 13px)', // 5 items per row with 16px gap
                        marginBottom: 16,
                    }}
                >
                    <Skeleton.Input
                        active
                        style={{
                            width: '100%',
                            height: 48,
                            borderRadius: 10,
                            display: 'block',
                        }}
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
                    onClick={() => {
                        if (selectedFolderId) {
                            onSelectFolder({
                                id: selectedFolderId,
                                name: items.find(item => item.id === selectedFolderId)?.name || ''
                            });
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
                    setCurrentFolderId={setCurrentFolderId} />
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
                                    setPath(prev => [...prev, { id: folder.id, name: folder.name }])
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
                    {loading && skeletonCards}
                </List>
            </div>
        </Modal>
    );
};

export default ModalSelectFolder;