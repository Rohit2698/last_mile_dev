export interface BasicInfo {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  licenseNumber?: string
  isActive: boolean
  isVerified: boolean
  verificationStatus: string
  createdAt: string
}

export interface BasicInfoFormData {
  name: string
  phone: string
  address: string
  licenseNumber: string
}

export interface VerificationDocument {
  id: string
  documentType: string
  fileUrl: string
  imagekitFileId?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  submittedAt: string
  reviewedAt?: string
  reviewNotes?: string
}
