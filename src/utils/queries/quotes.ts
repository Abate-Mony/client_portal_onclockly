import customFetch from "@/utils/customFetch"
import type { PortalQuote } from "@/utils/types/quote"
import type { PaginatedResponse } from "./bookings"

export const quotesQuery = (params?: Record<string, string>) => ({
  queryKey: ["portal-quotes", params],
  queryFn: async (): Promise<{ quotes: PortalQuote[] } & PaginatedResponse> => {
    const { data } = await customFetch.get("/portal/quotes", { params })
    return data
  },
})

export const quoteQuery = (id: string) => ({
  queryKey: ["portal-quote", id],
  queryFn: async (): Promise<{ quote: PortalQuote }> => {
    const { data } = await customFetch.get(`/portal/quotes/${id}`)
    return data
  },
})
