import customFetch from "@/utils/customFetch"

export type JobChangeRequestStatus = "pending" | "approved" | "declined" | "cancelled"
export type JobChangeRequestType = "reschedule" | "cancel"

export interface PortalJobChangeRequest {
  _id: string
  job: string | null
  type: JobChangeRequestType
  requestedDate?: string
  requestedStartTime?: string
  requestedEndTime?: string
  reason: string
  originalDate: string
  originalStartTime: string
  originalEndTime: string
  status: JobChangeRequestStatus
  reviewNotes?: string
  createdAt: string
}

export const bookingChangeRequestsQuery = (bookingId: string) => ({
  queryKey: ["portal-booking-change-requests", bookingId],
  queryFn: async (): Promise<{ requests: PortalJobChangeRequest[] }> => {
    const { data } = await customFetch.get(`/portal/bookings/${bookingId}/change-requests`)
    return data
  },
})

export interface CreateRescheduleRequestInput {
  requestedDate: string
  requestedStartTime: string
  requestedEndTime: string
  reason?: string
}

export const createRescheduleRequest = async (bookingId: string, input: CreateRescheduleRequestInput) => {
  const { data } = await customFetch.post<{ request: PortalJobChangeRequest }>(`/portal/bookings/${bookingId}/reschedule-request`, input)
  return data.request
}

export const createCancelRequest = async (bookingId: string, input: { reason?: string }) => {
  const { data } = await customFetch.post<{ request: PortalJobChangeRequest }>(`/portal/bookings/${bookingId}/cancel-request`, input)
  return data.request
}

export const withdrawJobChangeRequest = async (id: string) => {
  const { data } = await customFetch.patch<{ request: PortalJobChangeRequest }>(`/portal/change-requests/${id}/cancel`)
  return data.request
}
