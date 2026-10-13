import customFetch from "@/utils/customFetch"
import type { PortalInvoice } from "@/utils/types/invoice"
import type { PaginatedResponse } from "./bookings"

export const invoicesQuery = (params?: Record<string, string>) => ({
  queryKey: ["portal-invoices", params],
  queryFn: async (): Promise<{ invoices: PortalInvoice[] } & PaginatedResponse> => {
    const { data } = await customFetch.get("/portal/invoices", { params })
    return data
  },
})

export const invoiceQuery = (id: string) => ({
  queryKey: ["portal-invoice", id],
  queryFn: async (): Promise<{ invoice: PortalInvoice }> => {
    const { data } = await customFetch.get(`/portal/invoices/${id}`)
    return data
  },
})
