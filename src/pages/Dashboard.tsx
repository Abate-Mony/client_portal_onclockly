import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import dayjs from "dayjs"
import { CalendarDays, ChevronRight, Clock3, FileCheck2, MapPin, ReceiptText } from "lucide-react"
import { meQuery } from "@/utils/portalAuth"
import { canClient } from "@/utils/clientPermissions"
import { bookingsQuery } from "@/utils/queries/bookings"
import { quotesQuery } from "@/utils/queries/quotes"
import { invoicesQuery } from "@/utils/queries/invoices"
import { fmtMoney } from "@/utils/format"
import { Button, Card } from "@/components/ui"
import { Status } from "@/components/Status"

function greeting() {
  const hour = dayjs().hour()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function NextBookingCard({ go }: { go: (page: string) => void }) {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery(bookingsQuery({ status: "published", limit: "1" }))
  const next = data?.bookings[0]

  if (isLoading) return <Card className="h-32 mb-5 skeleton" />
  if (!next) return null

  return (
    <Card className="overflow-hidden mb-5">
      <div className="bg-primary px-5 py-4 text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium"><CalendarDays size={16} /> Next booking</div>
        <Button variant="ghost" size="sm" className="!text-white hover:!bg-white/10" onClick={() => go("/bookings")}>
          View all <ChevronRight size={14} />
        </Button>
      </div>
      <button className="w-full text-left p-5 sm:p-6 hover:bg-slate-50 transition-colors" onClick={() => navigate(`/bookings/${next._id}`)}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{dayjs(next.date).format("MMM")}</span>
            <span className="text-xl font-bold text-primary leading-none">{dayjs(next.date).format("D")}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap"><h2 className="font-semibold text-slate-900">{next.title}</h2><Status status={next.status} /></div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Clock3 size={14} /> {next.startTime}–{next.endTime}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {next.location}</span>
            </div>
          </div>
          <ChevronRight size={18} className="hidden sm:block text-slate-300" />
        </div>
      </button>
    </Card>
  )
}

function QuotesAwaitingCard({ go }: { go: (page: string) => void }) {
  const { data, isLoading } = useQuery(quotesQuery({ status: "sent", limit: "1" }))
  const count = data?.total ?? 0
  const first = data?.quotes[0]

  if (isLoading) return <Card className="h-28 skeleton" />

  return (
    <button onClick={() => go("/quotes")} className="text-left rounded-xl border border-amber-200 bg-amber-50/60 p-5 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg bg-white text-amber-600 flex items-center justify-center border border-amber-100"><FileCheck2 size={17} /></div>
        <ChevronRight size={16} className="text-amber-400" />
      </div>
      <p className="text-2xl font-semibold text-slate-950 mt-5">{count}</p>
      <p className="text-sm font-medium text-slate-700">{count === 1 ? "Quote awaiting your response" : "Quotes awaiting your response"}</p>
      {first && <p className="text-xs text-slate-500 mt-1">{first.title} · {fmtMoney(first.total, first.currency)}</p>}
    </button>
  )
}

function OutstandingInvoicesCard({ go }: { go: (page: string) => void }) {
  const { data, isLoading } = useQuery(invoicesQuery({ status: "sent", limit: "50" }))
  const invoices = data?.invoices ?? []
  const total = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0)
  const currency = invoices[0]?.currency ?? "GBP"
  const overdueCount = invoices.filter(inv => inv.isOverdue).length

  if (isLoading) return <Card className="h-28 skeleton" />

  return (
    <button onClick={() => go("/invoices")} className="text-left rounded-xl border border-rose-200 bg-rose-50/60 p-5 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg bg-white text-rose-500 flex items-center justify-center border border-rose-100"><ReceiptText size={17} /></div>
        <ChevronRight size={16} className="text-rose-400" />
      </div>
      <p className="text-2xl font-semibold text-slate-950 mt-5">{fmtMoney(total, currency)}</p>
      <p className="text-sm font-medium text-slate-700">{invoices.length} outstanding invoice{invoices.length === 1 ? "" : "s"}</p>
      {overdueCount > 0 && <p className="text-xs text-rose-600 mt-1">{overdueCount === 1 ? "One invoice is overdue" : `${overdueCount} invoices are overdue`}</p>}
    </button>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  // The root loader (portalRootLoader) already guarantees this resolves —
  // ensureQueryData populated the cache before this route ever rendered.
  const { data: me } = useQuery(meQuery)
  const clientRole = me?.user.clientRole
  const firstName = me?.user.fullname.split(" ")[0] ?? ""
  const go = (page: string) => navigate(page)

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <p className="text-sm font-medium text-primary mb-1">{dayjs().format("dddd, D MMMM")}</p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">{greeting()}, {firstName}</h1>
        <p className="text-sm text-slate-500 mt-1.5">Here's what's happening with your services.</p>
      </div>

      {canClient(clientRole, "booking:read") && <NextBookingCard go={go} />}

      <div className="grid sm:grid-cols-2 gap-4 mb-7">
        {canClient(clientRole, "quote:read") && <QuotesAwaitingCard go={go} />}
        {canClient(clientRole, "invoice:read") && <OutstandingInvoicesCard go={go} />}
      </div>
    </div>
  )
}
