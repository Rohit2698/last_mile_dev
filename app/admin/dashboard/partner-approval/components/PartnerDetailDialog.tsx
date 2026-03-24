import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react"
import type { DeliveryPartner, VerificationDocument } from "../types"

interface PartnerDetailDialogProps {
  isOpen: boolean
  isLoading?: boolean
  partner: DeliveryPartner | null
  onClose: () => void
  onVerify: (partnerId: string) => void
  onUnverify: (partnerId: string) => void
  onApproveDocument: (documentId: string) => void
  onRejectDocument: (documentId: string) => void
}

function getVerificationStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "APPROVED") return "default"
  if (status === "REJECTED") return "destructive"
  return "outline"
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function DocumentRow({
  doc,
  onApprove,
  onReject,
}: {
  doc: VerificationDocument
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  return (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {doc.documentType
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </p>
          <p className="text-xs text-gray-500">
            Submitted: {new Date(doc.submittedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge
          variant={
            doc.status === "APPROVED"
              ? "default"
              : doc.status === "REJECTED"
                ? "destructive"
                : "secondary"
          }
        >
          {doc.status}
        </Badge>
      </div>
      {doc.fileUrl && (
        <a
          href={doc.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          View Document
        </a>
      )}
      {doc.reviewNotes && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">Review Notes:</span> {doc.reviewNotes}
        </p>
      )}
      {doc.status === "PENDING" && (
        <div className="flex gap-2 pt-1">
          <Button variant="default" size="sm" onClick={() => onApprove(doc.id)}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Approve
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onReject(doc.id)}>
            <XCircle className="h-3 w-3 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  )
}

function PartnerDetailBody({
  partner,
  onApproveDocument,
  onRejectDocument,
}: {
  partner: DeliveryPartner
  onApproveDocument: (id: string) => void
  onRejectDocument: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <Building2 className="h-4 w-4" /> Company Name
          </p>
          <p className="text-base font-semibold">{partner.companyName}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <Mail className="h-4 w-4" /> Email
          </p>
          <p className="text-base">{partner.email}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <Phone className="h-4 w-4" /> Phone
          </p>
          <p className="text-base">{partner.phone}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <MapPin className="h-4 w-4" /> Address
          </p>
          <p className="text-base">{partner.address}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Created At</p>
          <p className="text-base">{new Date(partner.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant={partner.isActive ? "default" : "secondary"}>
              {partner.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={partner.isVerified ? "default" : "destructive"}>
              {partner.isVerified ? "Verified" : "Not Verified"}
            </Badge>
            {partner.verificationStatus && (
              <Badge variant={getVerificationStatusBadgeVariant(partner.verificationStatus)}>
                {formatStatus(partner.verificationStatus)}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {partner.verificationDocuments && partner.verificationDocuments.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Verification Documents
          </h4>
          <div className="space-y-2">
            {partner.verificationDocuments.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onApprove={onApproveDocument}
                onReject={onRejectDocument}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function PartnerDetailDialog({
  isOpen,
  isLoading,
  partner,
  onClose,
  onVerify,
  onUnverify,
  onApproveDocument,
  onRejectDocument,
}: PartnerDetailDialogProps) {
  const hasPendingOrRejectedDocs = partner?.verificationDocuments?.some(
    (doc) => doc.status === "PENDING" || doc.status === "REJECTED"
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Partner Details</DialogTitle>
          <DialogDescription>
            Review the partner information, verification status, and submitted documents
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && partner && (
          <PartnerDetailBody
            partner={partner}
            onApproveDocument={onApproveDocument}
            onRejectDocument={onRejectDocument}
          />
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {partner && !partner.isVerified && (
            <Button
              disabled={!!hasPendingOrRejectedDocs}
              onClick={() => onVerify(partner.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Partner
            </Button>
          )}
          {partner && partner.isVerified && (
            <Button variant="destructive" onClick={() => onUnverify(partner.id)}>
              <XCircle className="h-4 w-4 mr-2" />
              Revoke Verification
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
