import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useNavigate } from "react-router"
import { CalendarDays, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { bookingsQuery } from "@/utils/queries/bookings"
import { bookingRequestsQuery, cancelBookingRequest } from "@/utils/queries/bookingRequests"
import { meQuery } from "@/utils/portalAuth"
import { canClient } from "@/utils/clientPermissions"
import { Button, Card, EmptyState } from "@/components/ui"
import { Status } from "@/components/Status"
import { PageTitle } from "@/components/PageTitle"
import { RequestBookingModal } from "@/components/RequestBookingModal"

function YourRequests() {
  const qc = useQueryClient()
  const { data } = useQuery(bookingRequestsQuery())
  const requests = (data?.requests ?? []).filter(r => r.status === "pending" || r.status === "declined")

  const cancelMutation = useMutation({
    mutationFn: cancelBookingRequest,
    onSuccess: () => {
      toast.success("Request cancelled.")
      qc.invalidateQueries({ queryKey: ["portal-booking-requests"] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.msg ?? "Couldn't cancel this request."),
  })

  if (requests.length === 0) return null

  return (
    <div className="mb-5 space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your requests</p>
      {requests.map(r => (
        <Card key={r._id} className="p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-900 truncate">{r.service}</p>
              <Status status={r.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Preferred {dayjs(r.preferredDate).format("D MMM YYYY")}{r.preferredTime ? ` · ${r.preferredTime}` : ""}
            </p>
            {r.status === "declined" && r.reviewNotes && (
              <p className="text-xs text-slate-500 mt-1">{r.reviewNotes}</p>
            )}
          </div>
          {r.status === "pending" && (
            <Button variant="ghost" size="sm" loading={cancelMutation.isPending} onClick={() => cancelMutation.mutate(r._id)}>Cancel</Button>
          )}
        </Card>
      ))}
    </div>
  )
}

export function Bookings() {
  const navigate = useNavigate()
  const [requesting, setRequesting] = useState(false)
  const { data, isLoading, error } = useQuery(bookingsQuery())
  const { data: me } = useQuery(meQuery)
  const bookings = data?.bookings ?? []
  const canRequest = canClient(me?.user.clientRole, "booking:create")

  return (
    <div className="animate-fade-in">
      <PageTitle
        title="Bookings"
        description="View and manage your upcoming and past services."
        action={canRequest ? <Button onClick={() => setRequesting(true)}><Plus size={15} /> Request a booking</Button> : undefined}
      />

      {canRequest && <YourRequests />}

      {isLoading ? (
        <Card className="h-40 skeleton" />
      ) : error ? (
        <EmptyState icon={<CalendarDays size={20} />} title="Couldn't load bookings" description="You may not have permission to view this, or something went wrong." />
      ) : bookings.length === 0 ? (
        <EmptyState icon={<CalendarDays size={20} />} title="No bookings yet" description="Upcoming and past bookings will show up here." />
      ) : (
        <>
          <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-border">
                <tr className="text-xs uppercase tracking-wider text-slate-400">
                  {["Service", "Date & time", "Site", "Status", "Cost"].map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => (
                  <tr key={b._id} onClick={() => navigate(`/bookings/${b._id}`)} className="hover:bg-slate-50/70 cursor-pointer transition-colors text-sm">
                    <td className="px-5 py-4 font-medium text-slate-900">{b.title}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {dayjs(b.date).format("D MMM YYYY")}
                      <span className="block text-xs text-slate-400 mt-0.5">{b.startTime}–{b.endTime}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{b.location}</td>
                    <td className="px-5 py-4"><Status status={b.status} /></td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {b.chargeType === "fixed" ? (b.chargeAmount != null ? `£${b.chargeAmount.toFixed(2)}` : "—") : b.chargeRate != null ? `£${b.chargeRate.toFixed(2)}/hr` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {bookings.map(b => (
              <Card key={b._id} onClick={() => navigate(`/bookings/${b._id}`)} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary mb-1">{dayjs(b.date).format("D MMM YYYY")}</p>
                    <p className="font-semibold text-slate-900 truncate">{b.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{b.startTime}–{b.endTime} · {b.location}</p>
                  </div>
                  <Status status={b.status} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {requesting && <RequestBookingModal onClose={() => setRequesting(false)} />}
    </div>
  )
}
