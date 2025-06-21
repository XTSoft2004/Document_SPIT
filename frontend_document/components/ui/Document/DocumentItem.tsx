import React from 'react'
import {
  FileOutlined,
  FolderOpenFilled,
  FileImageFilled,
  FilePdfFilled,
  FileWordFilled,
} from '@ant-design/icons'
import { Tooltip } from 'antd'

type Props = {
  item: any
  onClick: () => void
}

const getIcon = (isFolder: boolean, typeDocument: string) => {
  if (isFolder)
    return <FolderOpenFilled className="text-yellow-400 bg-yellow-100 rounded p-1 text-2xl" />
  switch (typeDocument) {
    case 'image':
      return <FileImageFilled className="text-sky-400 bg-sky-100 rounded p-1 text-2xl" />
    case 'pdf':
      return <FilePdfFilled className="text-red-500 bg-red-100 rounded p-1 text-2xl" />
    case 'docx':
      return <FileWordFilled className="text-indigo-500 bg-indigo-100 rounded p-1 text-2xl" />
    default:
      return <FileOutlined className="text-slate-500 bg-slate-100 rounded p-1 text-2xl" />
  }
}

const DocumentItem: React.FC<Props> = ({ item, onClick }) => (
  <li
    className={`flex flex-col justify-center p-3 rounded-xl shadow transition-all min-h-[48px] bg-white cursor-pointer max-w-full hover:shadow-lg`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3 min-w-0">
      {getIcon(item.isFolder, item.typeDocument)}
      <Tooltip title={item.name}>
        <span className="font-semibold text-slate-800 text-base truncate max-w-[160px]">{item.name}</span>
      </Tooltip>
      <span className="text-slate-400 text-sm ml-auto whitespace-nowrap">{new Date(item.createdTime).toLocaleDateString()}</span>
    </div>
  </li>
)

export default DocumentItem