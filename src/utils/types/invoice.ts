export type InvoiceStatus = "sent" | "paid" | "cancelled"
export type InvoiceDisplayStatus = "draft" | "sent" | "paid" | "cancelled" | "overdue"

export interface InvoiceLineItem {
  description: string
  type: "hourly" | "fixed" | "adjustment"
  job: string | null
  date?: string
  startTime?: string
  endTime?: string
  location?: string
  minutes?: number
  quantity: number
  rate: number
  amount: number
}

export interface PortalInvoice {
  _id: string
  invoiceNumber: string
  currency: string
  clientSnapshot?: { name?: string; billingEmail?: string } | null
  jobs: string[]
  issueDate: string
  dueDate: string
  servicePeriod?: { start?: string; end?: string } | null
  purchaseOrderNumber?: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number
  amountPaid: number
  status: InvoiceStatus
  balanceDue: number
  isOverdue: boolean
  displayStatus: InvoiceDisplayStatus
  paidAt?: string | null
  paymentReference?: string
  paymentMethod?: string
}
