export const handleFilePreview = async (
  file: any,
  setPreviewSrc: (src: string | null) => void,
  setPreviewType: (type: 'image' | 'pdf' | 'unsupported' | null) => void,
  onError?: () => void,
) => {
  try {
    if (!file || !file.originFileObj) {
      setPreviewSrc(null)
      return
    }

    // Lấy file type từ file object hoặc originFileObj
    const fileType = file.type || file.originFileObj.type

    if (fileType.startsWith('image/')) {
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject()
      })
      setPreviewSrc(src)
      setPreviewType('image')
    } else if (fileType === 'application/pdf') {
      const src = URL.createObjectURL(file.originFileObj as File)

      setPreviewSrc(src)
      setPreviewType('pdf')
    } else {
      setPreviewSrc(null)
      setPreviewType('unsupported')
      onError?.()
    }
  } catch (error) {
    console.error('Error in handleFilePreview:', error)
    setPreviewSrc(null)
    setPreviewType('unsupported')
    onError?.()
  }
}
