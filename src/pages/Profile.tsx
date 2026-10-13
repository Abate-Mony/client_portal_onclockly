import { useQuery } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { meQuery } from "@/utils/portalAuth"
import { logoutClient } from "@/utils/logout"
import { CLIENT_ROLE_LABELS } from "@/utils/types/invitation"
import { Button, Card } from "@/components/ui"
import { PageTitle, SectionTitle } from "@/components/PageTitle"

// Editing contact details, changing password, and notification
// preferences all need backend endpoints that don't exist yet (there's
// no authenticated "update my own profile" or "change my password while
// logged in" route anywhere in this codebase, not even for staff) — shown
// as read-only + a clear note rather than forms that would silently do
// nothing on submit. Sign out is real.
export function Profile() {
  const { data } = useQuery(meQuery)

  return (
    <div className="animate-fade-in">
      <PageTitle title="Profile" description="Your account details and sign-out." />

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <SectionTitle>Contact details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div><p className="text-xs text-slate-400 mb-1">Full name</p><p className="text-sm font-medium text-slate-800">{data?.user.fullname}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Email address</p><p className="text-sm font-medium text-slate-800">{data?.user.email}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Role</p><p className="text-sm font-medium text-slate-800">{data ? CLIENT_ROLE_LABELS[data.user.clientRole] : ""}</p></div>
              <div><p className="text-xs text-slate-400 mb-1">Account</p><p className="text-sm font-medium text-slate-800">{data?.client.name}</p></div>
            </div>
            <p className="text-xs text-slate-400 mt-5 pt-5 border-t border-border">
              Editing your details and changing your password from here isn't available yet. Contact your service provider if anything needs updating, or use "Forgot password" on the sign-in screen to reset it.
            </p>
          </Card>
        </div>

        <div>
          <Button variant="ghost" className="w-full !justify-start text-red-600" onClick={() => logoutClient()}>
            <LogOut size={15} /> Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
