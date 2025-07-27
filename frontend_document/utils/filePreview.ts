export const handleFilePreview = async (
  file: any,
  setPreviewSrc: (src: string | null) => void,
  setPreviewType: (type: 'image' | 'pdf' | 'unsupported' | null) => void,
  onError?: () => void,
) => {
  try {
    console.log('handleFilePreview called with:', file);
    
    if (!file || !file.originFileObj) {
      console.log('No file or originFileObj');
      setPreviewSrc(null)
      return
    }

    // Lấy file type từ file object hoặc originFileObj
    const fileType = file.type || file.originFileObj.type
    console.log('File type detected:', fileType);
    
    if (fileType.startsWith('image/')) {
      console.log('Processing as image');
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject()
      })
      setPreviewSrc(src)
      setPreviewType('image')
    } else if (fileType === 'application/pdf') {
      console.log('Processing as PDF');
      const src = URL.createObjectURL(file.originFileObj as File)
      console.log('PDF URL created:', src);
      setPreviewSrc(src)
      setPreviewType('pdf')
    } else {
      console.log('Unsupported file type:', fileType);
      setPreviewSrc(null)
      setPreviewType('unsupported')
      onError?.()
    }
  } catch (error) {
    console.error('Error in handleFilePreview:', error);
    setPreviewSrc(null)
    setPreviewType('unsupported')
    onError?.()
  }
}
