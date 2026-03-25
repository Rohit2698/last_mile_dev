"use client"

import React from "react"
import { User, Phone, Mail, Car, IdCard, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TripDetailDriver, TripDetailOrder } from "@/app/api/react-query/trips"
import { format } from "date-fns"

interface DriverSectionProps {
  driver: TripDetailDriver
  order: TripDetailOrder
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

const DriverSection: React.FC<DriverSectionProps> = ({ driver, order }) => {
  const fullName = `${driver.firstName} ${driver.lastName}`

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Driver</h2>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <a href={`tel:${driver.phone}`}>
              <Phone size={14} />
              Call
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <a href={`sms:${driver.phone}`}>
              <MessageSquare size={14} />
              SMS
            </a>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User size={20} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold">{fullName}</p>
          <p className="text-sm text-muted-foreground">{driver.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={<Phone size={15} />} label="Phone" value={driver.phone} />
        <InfoRow icon={<Mail size={15} />} label="Email" value={driver.email} />
        {driver.licenseNumber && (
          <InfoRow icon={<IdCard size={15} />} label="License #" value={driver.licenseNumber} />
        )}
        {driver.licenseExpiration && (
          <InfoRow
            icon={<IdCard size={15} />}
            label="License Expiry"
            value={format(new Date(driver.licenseExpiration), "MMM d, yyyy")}
          />
        )}
        {order.vehicle && (
          <InfoRow
            icon={<Car size={15} />}
            label="Vehicle"
            value={`${order.vehicle.make ?? ""} ${order.vehicle.model ?? ""} · ${order.vehicle.plateNumber}`}
          />
        )}
      </div>
    </div>
  )
}

export default DriverSection
