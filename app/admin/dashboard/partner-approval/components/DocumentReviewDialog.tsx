import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle } from "lucide-react"

interface DocumentReviewDialogProps {
  isOpen: boolean
  action: "approve" | "reject" | null
  onClose: () => void
  onConfirm: (notes: string) => void
}

export function DocumentReviewDialog({
  isOpen,
  action,
  onClose,
  onConfirm,
}: DocumentReviewDialogProps) {
  const [notes, setNotes] = useState("")

  if (!action) return null

  const isApprove = action === "approve"

  const handleConfirm = () => {
    onConfirm(notes)
    setNotes("")
  }

  const handleClose = () => {
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isApprove ? "Approve Document" : "Reject Document"}</DialogTitle>
          <DialogDescription>
            {isApprove
              ? "Add an optional note for approving this document."
              : "Please provide a reason for rejecting this document."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            placeholder={isApprove ? "Optional review notes..." : "Reason for rejection..."}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={isApprove ? "default" : "destructive"} onClick={handleConfirm}>
            {isApprove ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
