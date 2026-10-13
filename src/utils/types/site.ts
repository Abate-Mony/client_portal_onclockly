export type SiteStatus = "active" | "inactive"

export interface PortalSite {
  _id: string
  name: string
  address?: { line1?: string; line2?: string; city?: string; county?: string; postcode?: string; country?: string }
  formattedAddress?: string
  coordinates?: { lat: number; lng: number } | null
  contact?: { name?: string; phone?: string; email?: string }
  instructions?: string
  accessInstructions?: string
  parkingInstructions?: string
  status: SiteStatus
}
