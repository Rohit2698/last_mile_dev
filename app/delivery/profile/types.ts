export interface PartnerProfile {
  id: string
  email: string
  companyName: string
  phone?: string
  address?: string
  logoUrl?: string
  isActive: boolean
  isVerified: boolean
  verificationStatus: string
  createdAt: string
}

export interface PartnerProfileFormData {
  companyName: string
  phone: string
  address: string
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
