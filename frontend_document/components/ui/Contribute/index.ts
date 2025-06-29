// Main component
export { default as ContributeForm } from './ContributeForm'

// Sub-components (exported for potential reuse)
export { default as CourseSelector } from './CourseSelector'
export { default as FileUploader } from './FileUploader'
export { default as FormActions } from './FormActions'

// Types and utilities
export type { ContributeFormData } from './contributeUtils'
export {
  createEmptyFormData,
  validateForm,
  uploadDocument,
  fileToBase64,
} from './contributeUtils'
