import { Button } from '@/components/ui/shadcn-ui/button';

interface FormActionsProps {
    isSubmitting: boolean;
    isFormValid: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    submitText?: string;
    cancelText?: string;
    className?: string;
}

export default function FormActions({
    isSubmitting,
    isFormValid,
    onCancel,
    onSubmit,
    submitText = "Đóng góp tài liệu",
    cancelText = "Hủy",
    className = ""
}: FormActionsProps) {
    return (
        <div className={`flex justify-end space-x-4 ${className}`}>
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                {cancelText}
            </Button>
            <Button
                type="button"
                onClick={onSubmit}
                disabled={!isFormValid || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
                {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                        <LoadingSpinner />
                        <span>Đang tải lên...</span>
                    </div>
                ) : (
                    submitText
                )}
            </Button>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
