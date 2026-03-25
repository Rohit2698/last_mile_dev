"use client"

import React from "react"
import { PlusCircle, User, Truck, MapPin, CheckCircle, XCircle, Clock } from "lucide-react"
import { TripTimelineEvent } from "@/app/api/react-query/trips"
import { format } from "date-fns"

interface TimelineSectionProps {
  timeline: TripTimelineEvent[]
}

const EVENT_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  CREATED:    { icon: <PlusCircle size={16} />,   color: "text-gray-500 bg-gray-100" },
  ASSIGNED:   { icon: <User size={16} />,         color: "text-amber-600 bg-amber-100" },
  IN_TRANSIT: { icon: <Truck size={16} />,        color: "text-blue-600 bg-blue-100" },
  ARRIVED:    { icon: <MapPin size={16} />,        color: "text-violet-600 bg-violet-100" },
  COMPLETED:  { icon: <CheckCircle size={16} />,  color: "text-green-600 bg-green-100" },
  FAILED:     { icon: <XCircle size={16} />,      color: "text-red-600 bg-red-100" },
}

const DEFAULT_CONFIG = { icon: <Clock size={16} />, color: "text-gray-500 bg-gray-100" }

const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  if (timeline.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold text-base mb-3">Status Timeline</h2>
        <p className="text-sm text-muted-foreground">No timeline events yet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <h2 className="font-semibold text-base">Status Timeline</h2>

      <ol className="relative border-l border-border ml-4 space-y-6">
        {timeline.map((event, i) => {
          const cfg = EVENT_CONFIG[event.status] ?? DEFAULT_CONFIG
          const isLast = i === timeline.length - 1
          return (
            <li key={i} className="ml-6">
              <span
                className={`absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-background ${cfg.color}`}
              >
                {cfg.icon}
              </span>
              <div className={`${isLast ? "opacity-100" : "opacity-80"}`}>
                <p className="text-sm font-semibold">{event.label}</p>
                <time className="text-xs text-muted-foreground">
                  {format(new Date(event.timestamp), "MMM d, yyyy · h:mm a")}
                </time>
                {event.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default TimelineSection
