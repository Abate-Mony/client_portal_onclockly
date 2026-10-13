import customFetch from "@/utils/customFetch"

export type BookingRequestStatus = "pending" | "approved" | "declined" | "cancelled"

export interface PortalBookingRequest {
  _id: string
  service: string
  preferredDate: string
  preferredTime?: string
  notes: string
  status: BookingRequestStatus
  reviewNotes?: string
  convertedJob: string | null
  createdAt: string
}

export const bookingRequestsQuery = (status?: BookingRequestStatus) => ({
  queryKey: ["portal-booking-requests", status ?? "all"],
  queryFn: async (): Promise<{ requests: PortalBookingRequest[] }> => {
    const { data } = await customFetch.get("/portal/bookings/requests", {
      params: status ? { status } : undefined,
    })
    return data
  },
})

export interface CreateBookingRequestInput {
  service: string
  preferredDate: string
  preferredTime?: string
  notes?: string
}

export const createBookingRequest = async (input: CreateBookingRequestInput) => {
  const { data } = await customFetch.post<{ request: PortalBookingRequest }>("/portal/bookings/requests", input)
  return data.request
}

export const cancelBookingRequest = async (id: string) => {
  const { data } = await customFetch.patch<{ request: PortalBookingRequest }>(`/portal/bookings/requests/${id}/cancel`)
  return data.request
}
