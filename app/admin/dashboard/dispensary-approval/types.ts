export interface VerificationDocument {
  id: string
  documentType: string
  fileUrl: string
  status: string
  submittedAt: string
  reviewedAt?: string
  reviewNotes?: string
}

export interface Dispensary {
  id: string
  name: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  posType: string
  isActive: boolean
  isVerified: boolean
  verificationStatus: string
  createdAt: string
  VerificationDocument?: VerificationDocument[]
}

export type ViewMode = "table" | "card"
