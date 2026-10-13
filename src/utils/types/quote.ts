export type QuoteStatus = "sent" | "viewed" | "accepted" | "declined" | "expired"

export interface QuoteLineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface PortalQuote {
  _id: string
  quoteNumber: string
  status: QuoteStatus
  title: string
  description?: string
  client?: { name?: string; contactName?: string; address?: Record<string, string> } | null
  site?: Record<string, unknown> | null
  items: QuoteLineItem[]
  template?: { accentColor?: string } | null
  subtotal: number
  taxRate?: number
  taxAmount?: number
  total: number
  currency: string
  validUntil: string
  notes?: string
  terms?: string
  sentAt?: string | null
  viewedAt?: string | null
  acceptedAt?: string | null
  acceptedBy?: { name: string; email: string } | null
  declinedAt?: string | null
  declinedBy?: { name: string; email: string } | null
  declineReason?: string
}
