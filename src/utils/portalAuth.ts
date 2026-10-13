import customFetch from "./customFetch"

export interface PortalMeResponse {
  success: boolean
  user: {
    _id: string
    fullname: string
    email: string
    clientRole: "owner" | "manager" | "booking" | "billing" | "viewer"
  }
  client: { _id: string; name: string }
  company: { name: string; logo: string | null } | null
}

// Mirrors work.wk's userQuery (dashboardlayout.tsx) — the one query every
// authenticated screen in this app ultimately depends on to know who's
// logged in and which Client they represent.
export const meQuery = {
  queryKey: ["portal-me"],
  queryFn: async (): Promise<PortalMeResponse> => {
    const { data } = await customFetch.get("/portal/me")
    return data
  },
}
