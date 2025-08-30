export default function RenderFolderLink({ folderId, name }: { folderId: string; name: string }) {
    if (!folderId) {
        return <span className="italic text-gray-400">Chưa có</span>;
    }

    return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-700 font-medium text-xs border border-yellow-200">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline mr-1 text-yellow-400">
                <path d="M3 7a2 2 0 0 1 2-2h4.465a2 2 0 0 1 1.414.586l1.535 1.535A2 2 0 0 0 14.828 8H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            {folderId
                ? (
                    <a
                        href={`https://drive.google.com/drive/folders/${folderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-35 truncate inline-block text-yellow-700 underline"
                        title={folderId}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {name}
                    </a>
                )
                : <span className="italic text-gray-400">Chưa có</span>
            }
        </span>
    );
}
