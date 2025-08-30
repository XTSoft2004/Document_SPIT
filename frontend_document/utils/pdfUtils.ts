import jsPDF from 'jspdf';

export interface ImageFile {
    file: File;
    id: string;
    preview: string;
}

export const convertImagesToPDF = async (images: ImageFile[], documentName: string): Promise<File> => {
    return new Promise((resolve, reject) => {
        try {
            const pdf = new jsPDF();
            let loadedImages = 0;

            if (images.length === 0) {
                reject(new Error('Không có ảnh để chuyển đổi'));
                return;
            }

            images.forEach((imageFile, index) => {
                const img = new Image();
                img.onload = () => {
                    // Tính toán kích thước để fit vào trang PDF
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const margin = 20;
                    const maxWidth = pdfWidth - (margin * 2);
                    const maxHeight = pdfHeight - (margin * 2);

                    let imgWidth = img.width;
                    let imgHeight = img.height;

                    // Scale để fit vào trang
                    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                    imgWidth *= ratio;
                    imgHeight *= ratio;

                    // Tính vị trí để center ảnh
                    const x = (pdfWidth - imgWidth) / 2;
                    const y = (pdfHeight - imgHeight) / 2;

                    // Thêm trang mới nếu không phải ảnh đầu tiên
                    if (index > 0) {
                        pdf.addPage();
                    }

                    // Thêm ảnh vào PDF
                    pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);

                    loadedImages++;

                    // Khi tất cả ảnh đã được load và thêm vào PDF
                    if (loadedImages === images.length) {
                        // Tạo blob từ PDF
                        const pdfBlob = pdf.output('blob');
                        
                        // Tạo file từ blob
                        const pdfFile = new File([pdfBlob], `${documentName}.pdf`, {
                            type: 'application/pdf'
                        });

                        resolve(pdfFile);
                    }
                };

                img.onerror = () => {
                    reject(new Error(`Không thể load ảnh: ${imageFile.file.name}`));
                };

                img.src = imageFile.preview;
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

export const createImageFile = (file: File): Promise<{ file: File; id: string; preview: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve({
                file,
                id: `img_${Date.now()}_${Math.random()}`,
                preview: e.target?.result as string
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
