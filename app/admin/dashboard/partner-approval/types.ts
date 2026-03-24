export interface VerificationDocument {
  id: string
  documentType: string
  fileUrl: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  submittedAt: string
  reviewedAt?: string
  reviewNotes?: string
}

export interface DeliveryPartner {
  id: string
  companyName: string
  email: string
  phone: string
  address: string
  isActive: boolean
  isVerified: boolean
  verificationStatus: string
  createdAt: string
  verificationDocuments?: VerificationDocument[]
  _count?: {
    drivers: number
    vehicles: number
    routes: number
    partnerDispensaryLinks: number
  }
}
