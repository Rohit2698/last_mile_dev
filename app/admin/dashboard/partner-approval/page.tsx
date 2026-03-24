"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import apiClient from "@/lib/apiClient"
import { toast } from "react-toastify"
import { Search, Eye, Building2, Phone, Mail, MapPin, Users, Car } from "lucide-react"

interface DeliveryPartner {
  id: string
  companyName: string
  email: string
  phone: string
  address: string
  isActive: boolean
  createdAt: string
  _count?: {
    drivers: number
    vehicles: number
    routes: number
    partnerDispensaryLinks: number
  }
}

export default function PartnerApprovalPage() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    fetchPartners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  const fetchPartners = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get("/admin/delivery-partners", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setPartners(response.data.data)
        setTotalPages(Math.ceil(response.data.meta.total / response.data.meta.limit))
      }
    } catch (error) {
      console.error("Error fetching delivery partners:", error)
      toast.error("Failed to fetch delivery partners")
    } finally {
      setIsLoading(false)
    }
  }

  const viewDetails = async (partner: DeliveryPartner) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get(`/admin/delivery-partners/${partner.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSelectedPartner(response.data.data)
        setIsDetailOpen(true)
      }
    } catch (error) {
      console.error("Error fetching partner details:", error)
      toast.error("Failed to fetch partner details")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Delivery Partner Approval
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage delivery partner applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Delivery Partners</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by company or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading delivery partners...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No delivery partners found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Drivers</TableHead>
                      <TableHead>Vehicles</TableHead>
                      <TableHead>Status</TableHead>
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
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(partner)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delivery Partner Details</DialogTitle>
            <DialogDescription>
              Review the delivery partner information and statistics
            </DialogDescription>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Building2 className="h-4 w-4 mr-1" /> Company Name
                  </p>
                  <p className="text-base font-semibold">{selectedPartner.companyName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> Email
                  </p>
                  <p className="text-base">{selectedPartner.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1" /> Phone
                  </p>
                  <p className="text-base">{selectedPartner.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Address
                  </p>
                  <p className="text-base">{selectedPartner.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-base">
                    {new Date(selectedPartner.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-base">
                    <Badge variant={selectedPartner.isActive ? "default" : "secondary"}>
                      {selectedPartner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Drivers</p>
                          <p className="text-2xl font-bold">
                            {selectedPartner._count?.drivers || 0}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Vehicles</p>
                          <p className="text-2xl font-bold">
                            {selectedPartner._count?.vehicles || 0}
                          </p>
                        </div>
                        <Car className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Routes</p>
                          <p className="text-2xl font-bold">
                            {selectedPartner._count?.routes || 0}
                          </p>
                        </div>
                        <MapPin className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Partners</p>
                          <p className="text-2xl font-bold">
                            {selectedPartner._count?.partnerDispensaryLinks || 0}
                          </p>
                        </div>
                        <Building2 className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
