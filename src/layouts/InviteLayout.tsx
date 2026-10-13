import { useCallback, useEffect, useState } from "react"
import { Outlet, useParams } from "react-router"
import { Mail } from "lucide-react"
import customFetch from "@/utils/customFetch"
import type { InviteData, InvitationOutletContext } from "@/utils/types/invitation"

// Mirrors work.wk's AccpetInviteLayout.tsx, adapted to this backend's
// path-param token convention (/portal/invitations/:token) rather than a
// ?token= query string.
export function InviteLayout() {
  const { token = "" } = useParams()
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshInvitation = useCallback(async () => {
    if (!token) {
      setError("Invitation token is missing.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data } = await customFetch.get(`/portal/invitations/${encodeURIComponent(token)}`)
      // The backend always returns a top-level `invitation` key — an
      // object for a real token, or explicit `null` for status "invalid".
      setInvite(data.invitation)
    } catch (err: any) {
      setInvite(null)
      setError(err?.response?.data?.msg ?? err?.response?.data?.message ?? "Unable to validate this invitation.")
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    refreshInvitation()
  }, [refreshInvitation])

  const context: InvitationOutletContext = { token, invite, isLoading, error }

  return (
    <div className="min-h-full bg-secondary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-lg font-bold text-foreground text-center mb-8">OnClockly Client Portal</h1>

        {!isLoading && invite && invite.status === "pending" && (
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-4">
              <Mail size={20} className="text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">You're invited</p>
            <h2 className="text-xl font-bold text-foreground">
              Access the <span className="text-primary">{invite.client.name}</span> portal
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">Invited by {invite.company.name}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <Outlet context={context} />
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Powered by <span className="font-semibold text-muted-foreground">OnClockly</span>
        </p>
      </div>
    </div>
  )
}
