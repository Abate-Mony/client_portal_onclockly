export type ClientRole = "owner" | "manager" | "booking" | "billing" | "viewer"
export type InvitationStatus = "pending" | "accepted" | "expired" | "revoked" | "invalid"

export interface InviteData {
  _id: string
  company: { _id: string; name: string }
  client: { _id: string; name: string }
  email: string
  fullname?: string
  clientRole: ClientRole
  status: InvitationStatus
  expiresAt: string
  accountExists: boolean
}

export interface InvitationOutletContext {
  token: string
  invite: InviteData | null
  isLoading: boolean
  error: string | null
}

export const CLIENT_ROLE_LABELS: Record<ClientRole, string> = {
  owner: "Owner",
  manager: "Manager",
  booking: "Booking",
  billing: "Billing",
  viewer: "Viewer",
}
