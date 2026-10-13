import { Navigate, useOutletContext } from "react-router"
import type { InvitationOutletContext } from "@/utils/types/invitation"

// Pure dispatcher — mirrors work.wk's AcceptInvitePage.tsx, minus the
// "existing-user" branch: the client-portal invite flow has no
// accept-existing-account endpoint (createClientPortalInvitation already
// blocks inviting an email that belongs to any existing account, so this
// is only reachable via a genuine race — routed to a plain status message
// rather than a claim-this-account flow that doesn't exist here).
export function AcceptInvitePage() {
  const { token, invite, isLoading, error } = useOutletContext<InvitationOutletContext>()

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-5 bg-muted rounded-lg w-2/3 mx-auto" />
        <div className="h-4 bg-muted rounded-lg w-1/2 mx-auto" />
        <div className="h-20 bg-muted rounded-xl mt-2" />
        <div className="h-11 bg-muted rounded-xl" />
      </div>
    )
  }

  if (error || !invite) {
    return <Navigate to={`/invite/${encodeURIComponent(token)}/status/invalid`} replace />
  }
  if (invite.status === "expired") {
    return <Navigate to={`/invite/${encodeURIComponent(token)}/status/expired`} replace />
  }
  if (invite.status === "revoked") {
    return <Navigate to={`/invite/${encodeURIComponent(token)}/status/revoked`} replace />
  }
  if (invite.status === "accepted") {
    return <Navigate to={`/invite/${encodeURIComponent(token)}/status/already-accepted`} replace />
  }
  if (invite.accountExists) {
    return <Navigate to={`/invite/${encodeURIComponent(token)}/status/account-exists`} replace />
  }

  return <Navigate to={`/invite/${encodeURIComponent(token)}/new-user`} replace />
}
