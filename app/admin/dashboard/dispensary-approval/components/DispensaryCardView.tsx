import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Eye, CheckCircle, XCircle, FileText } from "lucide-react"
import type { Dispensary } from "../types"

interface DispensaryCardViewProps {
  dispensaries: Dispensary[]
  onViewDetails: (dispensary: Dispensary) => void
  onVerify: (dispensaryId: string) => void
  onUnverify: (dispensaryId: string) => void
}

export function DispensaryCardView({
  dispensaries,
  onViewDetails,
  onVerify,
  onUnverify,
}: DispensaryCardViewProps) {
  if (dispensaries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No dispensaries found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dispensaries.map((dispensary) => (
        <Card key={dispensary.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{dispensary.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{dispensary.licenseNumber}</p>
              </div>
              <div className="flex gap-1">
                <Badge variant={dispensary.isActive ? "default" : "secondary"} className="text-xs">
                  {dispensary.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="truncate">{dispensary.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span>{dispensary.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="truncate">{dispensary.address}</span>
              </div>
            </div>
            <div className="pt-2 border-t space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={dispensary.isVerified ? "default" : "destructive"}>
                  {dispensary.isVerified ? "Verified" : "Pending"}
                </Badge>
                {dispensary.verificationStatus && (
                  <Badge variant="outline" className="text-xs">
                    {dispensary.verificationStatus}
                  </Badge>
                )}
              </div>
              {dispensary.VerificationDocument && dispensary.VerificationDocument.length > 0 && (
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <FileText className="h-3 w-3 mr-1" />
                  {dispensary.VerificationDocument.length} document{dispensary.VerificationDocument.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(dispensary)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              {!dispensary.isVerified ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onVerify(dispensary.id)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verify
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onUnverify(dispensary.id)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Revoke
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
