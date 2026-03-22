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
import { Mail, Phone, MapPin, CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react"
import type { Dispensary } from "../types"

interface DispensaryDetailDialogProps {
  isOpen: boolean
  dispensary: Dispensary | null
  onClose: () => void
  onVerify: (dispensaryId: string) => void
  onUnverify: (dispensaryId: string) => void
}

export function DispensaryDetailDialog({
  isOpen,
  dispensary,
  onClose,
  onVerify,
  onUnverify,
}: DispensaryDetailDialogProps) {
  if (!dispensary) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dispensary Details</DialogTitle>
          <DialogDescription>
            Review the dispensary information and verification status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base font-semibold">{dispensary.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Number</p>
              <p className="text-base font-semibold">{dispensary.licenseNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" /> Email
              </p>
              <p className="text-base">{dispensary.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" /> Phone
              </p>
              <p className="text-base">{dispensary.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> Address
              </p>
              <p className="text-base">{dispensary.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">POS Type</p>
              <p className="text-base">{dispensary.posType || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base">
                {new Date(dispensary.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={dispensary.isActive ? "default" : "secondary"}>
              {dispensary.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={dispensary.isVerified ? "default" : "destructive"}>
              {dispensary.isVerified ? "Verified" : "Not Verified"}
            </Badge>
            {dispensary.verificationStatus && (
              <Badge variant="outline">
                {dispensary.verificationStatus}
              </Badge>
            )}
          </div>

          {dispensary.VerificationDocument && dispensary.VerificationDocument.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Verification Documents
              </h3>
              <div className="space-y-2">
                {dispensary.VerificationDocument.map((doc) => (
                  <div key={doc.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{doc.documentType}</p>
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!dispensary.isVerified && (
            <Button onClick={() => onVerify(dispensary.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Dispensary
            </Button>
          )}
          {dispensary.isVerified && (
            <Button variant="destructive" onClick={() => onUnverify(dispensary.id)}>
              <XCircle className="h-4 w-4 mr-2" />
              Revoke Verification
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
