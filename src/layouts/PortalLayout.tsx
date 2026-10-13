import { useState } from "react"
import { Outlet, redirect, NavLink, useNavigate } from "react-router"
import type { QueryClient } from "@tanstack/react-query"
import { useQuery } from "@tanstack/react-query"
import {
  Bell, CalendarDays, FileCheck2, FileText, Home, Menu,
  ReceiptText, MapPin, UserRound, X,
} from "lucide-react"
import { meQuery } from "@/utils/portalAuth"
import { getInitials } from "@/utils/getInitials"
import { canClient } from "@/utils/clientPermissions"
import { Button } from "@/components/ui"

// The auth guard the scaffold's own comment flagged as missing — mirrors
// work.wk's dashboardLoader/userQuery shape: ensureQueryData forces the
// request to actually happen (not just register the query), so a 401
// here reliably means "no valid session" before any child route renders.
export const portalRootLoader = (queryClient: QueryClient) => async () => {
  try {
    await queryClient.ensureQueryData(meQuery)
    return null
  } catch {
    return redirect("/login")
  }
}

const nav = [
  { to: "/", label: "Home", icon: Home, action: null },
  { to: "/bookings", label: "Bookings", icon: CalendarDays, action: "booking:read" as const },
  { to: "/quotes", label: "Quotes", icon: FileCheck2, action: "quote:read" as const },
  { to: "/invoices", label: "Invoices", icon: ReceiptText, action: "invoice:read" as const },
  { to: "/sites", label: "Sites", icon: MapPin, action: "booking:read" as const },
  { to: "/documents", label: "Documents", icon: FileText, action: null },
  { to: "/profile", label: "Profile", icon: UserRound, action: null },
]

function Brand({ companyName }: { companyName: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold tracking-tight shadow-sm">
        {getInitials(companyName)}
      </div>
      <div className="leading-tight">
        <p className="font-semibold text-slate-900">{companyName}</p>
        <p className="text-xs text-slate-400">Client portal</p>
      </div>
    </div>
  )
}

export function PortalLayout() {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const { data } = useQuery(meQuery)
  const clientRole = data?.user.clientRole
  const companyName = data?.company?.name ?? "OnClockly"
  const items = nav.filter(item => !item.action || canClient(clientRole, item.action))

  const go = (to: string) => {
    navigate(to)
    setMenu(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-full bg-background text-foreground">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-white border-r border-border flex-col p-4 z-30">
        <div className="px-2 py-2 mb-6"><Brand companyName={companyName} /></div>
        <nav className="space-y-1 flex-1">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <item.icon size={17} />{item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <header className="lg:hidden sticky top-0 z-30 h-16 bg-white border-b border-border px-4 flex items-center justify-between">
        <Brand companyName={companyName} />
        <Button variant="ghost" className="!px-2" onClick={() => setMenu(v => !v)}>
          {menu ? <X size={19} /> : <Menu size={19} />}
        </Button>
      </header>

      {menu && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 p-4 animate-fade-in">
          <nav className="space-y-1">
            {items.map(item => (
              <button
                key={item.to}
                onClick={() => go(item.to)}
                className="w-full flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <item.icon size={17} />{item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="lg:ml-60">
        <header className="hidden lg:flex h-16 bg-white border-b border-border px-8 items-center justify-between sticky top-0 z-20">
          <p className="text-sm text-slate-500">{data?.client.name}</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="!px-2" aria-label="Notifications"><Bell size={17} /></Button>
            <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
              {data ? getInitials(data.user.fullname) : ""}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{data?.user.fullname}</p>
              <p className="text-xs text-slate-400">Client account</p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-border px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 flex justify-around">
        {items.slice(0, 5).map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `flex flex-col items-center gap-1 min-w-14 py-1 text-xs font-medium ${isActive ? "text-primary" : "text-slate-400"}`}
          >
            <item.icon size={19} />{item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
