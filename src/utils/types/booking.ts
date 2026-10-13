export type BookingStatus = "draft" | "published" | "completed" | "cancelled"

export interface PortalBooking {
  _id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  minutes: number
  location: string
  address?: string
  coordinates?: { lat: number; lng: number } | null
  status: BookingStatus
  priority?: string
  site: string | null
  siteSnapshot?: { name: string; accessInstructions?: string; parkingInstructions?: string } | null
  chargeType?: "hourly" | "fixed"
  chargeRate?: number
  chargeAmount?: number
  billingStatus?: "not_billable" | "pending" | "ready" | "invoiced"
  invoice: string | null
}
