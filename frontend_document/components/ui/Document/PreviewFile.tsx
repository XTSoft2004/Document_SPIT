import React, { useState } from 'react'
import { Card, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import globalConfig from '@/app.config'

const PreviewFile: React.FC<{
  fileId: string
  visible: boolean
  onClose: () => void
}> = ({ fileId, visible, onClose }) => {
  const [loading, setLoading] = useState(true)

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="70%"
      destroyOnHidden
      className="!p-0"
      closeIcon={<CloseOutlined />}
      styles={{
        body: {
          padding: 0,
          borderRadius: 20,
          overflow: 'hidden',
          background: '#fff',
        },
      }}
      style = {{ top: 48 }}
    >
      <div className="relative h-[80vh] flex justify-center items-center box-border p-6">
        {loading && (
          <div className="absolute inset-4 z-10 flex justify-center items-center bg-white/95 rounded-xl transition-opacity">
            <Card loading className="w-full h-full !border-none !shadow-none !bg-transparent" />
          </div>
        )}
        <embed
          src={`${globalConfig.baseUrl}/driver/preview/${fileId}#toolbar=0`}
          className={`w-full h-full border-none bg-white object-contain transition-opacity duration-400 p-3 box-border rounded-lg
            ${loading ? 'opacity-0' : 'opacity-100'}
          `}
          type="application/pdf"
          onLoad={() => setLoading(false)}
          title="File Preview"
        />
      </div>
    </Modal>
  )
}

export default PreviewFile
