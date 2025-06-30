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
        <div className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 ${className}`}>
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="mt-3 w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base order-2 sm:order-1 transition-all duration-200 hover:bg-gray-50"
            >
                <span className="hidden sm:inline">{cancelText}</span>
                <span className="sm:hidden">Hủy</span>
            </Button>
            <Button
                type="button"
                onClick={onSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base order-1 sm:order-2 transition-all duration-200 hover:shadow-lg active:scale-95"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner />
                        <span className="hidden sm:inline">Đang tải lên...</span>
                        <span className="sm:hidden">Đang tải...</span>
                    </div>
                ) : (
                    <>
                        <span className="hidden sm:inline">{submitText}</span>
                        <span className="sm:hidden">Đóng góp</span>
                    </>
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
