import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import type { Dispensary } from "../types"

interface DispensaryTableViewProps {
  dispensaries: Dispensary[]
  onViewDetails: (dispensary: Dispensary) => void
  onVerify: (dispensaryId: string) => void
  onUnverify: (dispensaryId: string) => void
}

export function DispensaryTableView({
  dispensaries,
  onViewDetails,
  onVerify,
  onUnverify,
}: DispensaryTableViewProps) {
  if (dispensaries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No dispensaries found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispensaries.map((dispensary) => (
            <TableRow key={dispensary.id}>
              <TableCell className="font-medium">{dispensary.name}</TableCell>
              <TableCell>{dispensary.email}</TableCell>
              <TableCell>{dispensary.phone}</TableCell>
              <TableCell>{dispensary.licenseNumber}</TableCell>
              <TableCell>
                <Badge variant={dispensary.isActive ? "default" : "secondary"}>
                  {dispensary.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={dispensary.isVerified ? "default" : "destructive"}>
                  {dispensary.isVerified ? "Verified" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(dispensary)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {!dispensary.isVerified ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onVerify(dispensary.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUnverify(dispensary.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
