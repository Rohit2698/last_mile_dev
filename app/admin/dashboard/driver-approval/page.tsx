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
import { Search, Eye, User, Phone, Mail, IdCard, Calendar } from "lucide-react"
import { Pagination } from "@/components/Pagination"

interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  licenseExpiration: string
  status: string
  isActive: boolean
  createdAt: string
  deliveryPartner?: {
    id: string
    companyName: string
  }
  vehicle?: {
    id: string
    name: string
    plateNumber: string
  }
}

export default function DriverApprovalPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    fetchDrivers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  const fetchDrivers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get("/admin/drivers", {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setDrivers(response.data.data)
        setTotalPages(Math.ceil(response.data.meta.total / response.data.meta.limit))
      }
    } catch (error) {
      console.error("Error fetching drivers:", error)
      toast.error("Failed to fetch drivers")
    } finally {
      setIsLoading(false)
    }
  }

  const viewDetails = async (driver: Driver) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await apiClient.get(`/admin/drivers/${driver.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setSelectedDriver(response.data.data)
        setIsDetailOpen(true)
      }
    } catch (error) {
      console.error("Error fetching driver details:", error)
      toast.error("Failed to fetch driver details")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      ACTIVE: { variant: "default", label: "Active" },
      INACTIVE: { variant: "secondary", label: "Inactive" },
      ON_DELIVERY: { variant: "default", label: "On Delivery" },
      OFF_DUTY: { variant: "secondary", label: "Off Duty" },
    }

    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Driver Approval
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage driver applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Drivers</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
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
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading drivers...</p>
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No drivers found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">
                          {driver.firstName} {driver.lastName}
                        </TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>
                          {driver.deliveryPartner?.companyName || "N/A"}
                        </TableCell>
                        <TableCell>{getStatusBadge(driver.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(driver)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>
              Review the driver information and status
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <User className="h-4 w-4 mr-1" /> Full Name
                  </p>
                  <p className="text-base font-semibold">
                    {selectedDriver.firstName} {selectedDriver.lastName}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> Email
                  </p>
                  <p className="text-base">{selectedDriver.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1" /> Phone
                  </p>
                  <p className="text-base">{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <IdCard className="h-4 w-4 mr-1" /> License Number
                  </p>
                  <p className="text-base">{selectedDriver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> License Expiration
                  </p>
                  <p className="text-base">
                    {new Date(selectedDriver.licenseExpiration).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Delivery Partner</p>
                  <p className="text-base">
                    {selectedDriver.deliveryPartner?.companyName || "Not assigned"}
                  </p>
                </div>
                {selectedDriver.vehicle && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Assigned Vehicle</p>
                    <p className="text-base">
                      {selectedDriver.vehicle.name} ({selectedDriver.vehicle.plateNumber})
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-base">
                    {new Date(selectedDriver.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(selectedDriver.status)}
                <Badge variant={selectedDriver.isActive ? "default" : "secondary"}>
                  {selectedDriver.isActive ? "Active Account" : "Inactive Account"}
                </Badge>
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
