import customFetch from "@/utils/customFetch"
import type { PortalBooking } from "@/utils/types/booking"

export interface PaginatedResponse {
  total: number
  totalPages: number
  currentPage: number
}

export const bookingsQuery = (params?: Record<string, string>) => ({
  queryKey: ["portal-bookings", params],
  queryFn: async (): Promise<{ bookings: PortalBooking[] } & PaginatedResponse> => {
    const { data } = await customFetch.get("/portal/bookings", { params })
    return data
  },
})

export const bookingQuery = (id: string) => ({
  queryKey: ["portal-booking", id],
  queryFn: async (): Promise<{ booking: PortalBooking }> => {
    const { data } = await customFetch.get(`/portal/bookings/${id}`)
    return data
  },
})
