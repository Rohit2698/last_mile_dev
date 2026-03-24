"use client"

import { useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/components/ui/form"
import { FormInputField } from "@/components/fields/FormInputField"
import { useProfileWizard } from "./useProfileWizard"
import { VerificationDocument } from "./types"
import { LICENSE_SLOTS } from "./util"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { ExternalLink, Loader2, Trash2, Upload } from "lucide-react"

function getStatusBadgeClass(status: string) {
  if (status === "APPROVED") return "bg-green-500 text-white dark:bg-green-600"
  if (status === "REJECTED") return "bg-red-500 text-white dark:bg-red-600"
  return "bg-yellow-500 text-white dark:bg-yellow-600"
}

function LicenseSlot({
  label,
  documentType,
  doc,
  isUploading,
  onUpload,
  onRequestDelete,
}: {
  label: string
  documentType: string
  doc: VerificationDocument | undefined
  isUploading: boolean
  onUpload: (documentType: string, file: File) => void
  onRequestDelete: (id: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const canDelete = doc && (doc.status === "PENDING" || doc.status === "REJECTED")

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>

      {doc ? (
        <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <Badge className={`text-xs capitalize ${getStatusBadgeClass(doc.status)}`}>
                {doc.status.toLowerCase()}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                Uploaded {new Date(doc.submittedAt).toLocaleDateString()}
              </p>
              {doc.reviewNotes && (
                <p className="text-xs text-muted-foreground">Note: {doc.reviewNotes}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            {canDelete && (
              <button
                onClick={() => onRequestDelete(doc.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
          <span className="text-xs">{isUploading ? "Uploading…" : "Click to upload"}</span>
          <span className="text-xs opacity-60">Images or PDF, max 10 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onUpload(documentType, file)
            e.target.value = ""
          }
        }}
      />
    </div>
  )
}

export function ProfilePage() {
  const {
    basicInfoForm,
    documents,
    isLoadingInfo,
    isLoadingDocs,
    onUpdateBasicInfo,
    onUploadDocument,
    onDeleteDocument,
    isUpdatingInfo,
    uploadingType,
    isDeletingDoc,
    deleteConfirmId,
    setDeleteConfirmId,
  } = useProfileWizard()

  return (
    <DashboardLayout role="dispensary">
      <div className="space-y-6 p-4 max-w-3xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your dispensary profile and verification documents
          </p>
        </div>

        {/* Basic Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          {isLoadingInfo ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Form {...basicInfoForm}>
              <form
                onSubmit={basicInfoForm.handleSubmit(onUpdateBasicInfo)}
                className="space-y-4"
              >
                <FormInputField
                  control={basicInfoForm.control}
                  name="name"
                  label="Dispensary Name"
                  placeholder="Enter dispensary name"
                  required
                />
                <FormInputField
                  control={basicInfoForm.control}
                  name="phone"
                  label="Phone Number"
                  placeholder="Enter phone number"
                />
                <FormInputField
                  control={basicInfoForm.control}
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                />
                <FormInputField
                  control={basicInfoForm.control}
                  name="licenseNumber"
                  label="License Number"
                  placeholder="Enter license number"
                />
                <Button type="submit" disabled={isUpdatingInfo}>
                  {isUpdatingInfo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>
          )}
        </Card>

        {/* Verification Documents */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-1">Verification Documents</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Upload both sides of your dispensary license to verify your account.
          </p>

          {isLoadingDocs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LICENSE_SLOTS.map((slot) => (
                <LicenseSlot
                  key={slot.documentType}
                  label={slot.label}
                  documentType={slot.documentType}
                  doc={documents?.find((d) => d.documentType === slot.documentType)}
                  isUploading={uploadingType === slot.documentType}
                  onUpload={onUploadDocument}
                  onRequestDelete={setDeleteConfirmId}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <ConfirmationModal
        open={deleteConfirmId !== null}
        onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}
        onConfirm={onDeleteDocument}
        title="Delete document?"
        description="This will permanently remove the document from storage and cannot be undone."
        confirmText="Delete"
        isLoading={isDeletingDoc}
        variant="destructive"
      />
    </DashboardLayout>
  )
}
