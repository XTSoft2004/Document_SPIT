import React, { useState } from 'react'
import { Card, Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import globalConfig from '@/app.config'
import styles from './PreviewFile.module.css'

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
      className={styles.customModal}
      closeIcon={<CloseOutlined />}
    >
    <div className={styles.previewWrapper}>
      {loading && (
        <div className={styles.loadingContainer}>
        <Card loading variant="borderless" className={styles.loadingCard} />
        </div>
      )}
      <embed
        src={`${globalConfig.baseUrl}/driver/preview/${fileId}#toolbar=0`}
        className={`${styles.embed} ${
        loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        type="application/pdf"
        onLoad={() => setLoading(false)}
        title="File Preview"
        style={loading ? { display: 'none !important' } : {}}
      />
    </div>
    </Modal>
  )
}

export default PreviewFile
