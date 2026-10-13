import customFetch from "@/utils/customFetch"
import type { PortalSite } from "@/utils/types/site"
import type { PaginatedResponse } from "./bookings"

export const sitesQuery = (params?: Record<string, string>) => ({
  queryKey: ["portal-sites", params],
  queryFn: async (): Promise<{ sites: PortalSite[] } & PaginatedResponse> => {
    const { data } = await customFetch.get("/portal/sites", { params })
    return data
  },
})

export const siteQuery = (id: string) => ({
  queryKey: ["portal-site", id],
  queryFn: async (): Promise<{ site: PortalSite }> => {
    const { data } = await customFetch.get(`/portal/sites/${id}`)
    return data
  },
})
