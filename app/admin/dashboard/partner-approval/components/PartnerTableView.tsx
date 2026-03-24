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
import { Eye } from "lucide-react"
import type { DeliveryPartner } from "../types"

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function getStatusBadgeClass(status: string) {
  if (status === "APPROVED") return "bg-green-500 text-white"
  if (status === "REJECTED") return "bg-red-500 text-white"
  if (status === "SENT_FOR_APPROVAL") return "bg-blue-500 text-white"
  if (status === "APPROVED_WITH_SOME_CHANGES") return "bg-orange-500 text-white"
  return "bg-gray-400 text-white"
}

interface PartnerTableViewProps {
  partners: DeliveryPartner[]
  onViewDetails: (partner: DeliveryPartner) => void
}

export function PartnerTableView({ partners, onViewDetails }: PartnerTableViewProps) {
  if (partners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No delivery partners found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Drivers</TableHead>
            <TableHead>Vehicles</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-medium">{partner.companyName}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.phone}</TableCell>
              <TableCell>{partner._count?.drivers || 0}</TableCell>
              <TableCell>{partner._count?.vehicles || 0}</TableCell>
              <TableCell>
                <Badge variant={partner.isActive ? "default" : "secondary"}>
                  {partner.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={`text-xs ${getStatusBadgeClass(partner.verificationStatus ?? "WAITING_FOR_DOCUMENT")}`}
                >
                  {formatStatus(partner.verificationStatus ?? "WAITING_FOR_DOCUMENT")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onViewDetails(partner)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
