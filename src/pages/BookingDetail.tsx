import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, CalendarClock, CalendarDays, CheckCircle2, Download, MapPin, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import { bookingQuery } from "@/utils/queries/bookings"
import { bookingChangeRequestsQuery, withdrawJobChangeRequest } from "@/utils/queries/jobChangeRequests"
import { meQuery } from "@/utils/portalAuth"
import { canClient } from "@/utils/clientPermissions"
import { Button, Card } from "@/components/ui"
import { Status } from "@/components/Status"
import { SectionTitle } from "@/components/PageTitle"
import { fmtMoney } from "@/utils/format"
import { RescheduleBookingModal } from "@/components/RescheduleBookingModal"
import { CancelBookingModal } from "@/components/CancelBookingModal"

export function BookingDetail() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [rescheduling, setRescheduling] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const { data, isLoading } = useQuery(bookingQuery(id))
  const { data: me } = useQuery(meQuery)
  const { data: changeRequestsData } = useQuery(bookingChangeRequestsQuery(id))
  const booking = data?.booking

  const withdrawMutation = useMutation({
    mutationFn: withdrawJobChangeRequest,
    onSuccess: () => {
      toast.success("Request withdrawn.")
      qc.invalidateQueries({ queryKey: ["portal-booking-change-requests", id] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.msg ?? "Couldn't withdraw this request."),
  })

  if (isLoading) return <Card className="h-40 skeleton" />
  if (!booking) return null

  const pendingRequest = changeRequestsData?.requests.find(r => r.status === "pending")
  const eligible = ["draft", "published"].includes(booking.status) && !dayjs(booking.date).isBefore(dayjs(), "day")
  const canReschedule = eligible && canClient(me?.user.clientRole, "booking:update")
  const canCancel = eligible && canClient(me?.user.clientRole, "booking:cancel")

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" className="!-ml-3 mb-4" onClick={() => navigate("/bookings")}><ArrowLeft size={15} /> Back to bookings</Button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="mb-2"><Status status={booking.status} /></div>
          <h1 className="text-2xl font-semibold text-slate-950">{booking.title}</h1>
        </div>
        {!pendingRequest && (canReschedule || canCancel) && (
          <div className="flex gap-2 shrink-0">
            {canReschedule && <Button variant="outline" onClick={() => setRescheduling(true)}><CalendarClock size={14} /> Request reschedule</Button>}
            {canCancel && <Button variant="outline" onClick={() => setCancelling(true)}><XCircle size={14} /> Request cancellation</Button>}
          </div>
        )}
      </div>

      {pendingRequest && (
        <Card className="p-4 mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {pendingRequest.type === "reschedule" ? "Reschedule request pending" : "Cancellation request pending"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {pendingRequest.type === "reschedule"
                ? `Requested ${dayjs(pendingRequest.requestedDate).format("D MMM YYYY")} · ${pendingRequest.requestedStartTime}–${pendingRequest.requestedEndTime}`
                : "Awaiting staff review."}
            </p>
          </div>
          <Button variant="ghost" size="sm" loading={withdrawMutation.isPending} onClick={() => withdrawMutation.mutate(pendingRequest._id)}>Withdraw</Button>
        </Card>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <SectionTitle>Service details</SectionTitle>
            {booking.description && <p className="text-sm text-slate-600 leading-relaxed mb-5">{booking.description}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <CalendarDays size={17} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Date & time</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{dayjs(booking.date).format("D MMM YYYY")}<br />{booking.startTime}–{booking.endTime}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={17} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Service site</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {booking.location}<br />
                    {booking.address && <span className="font-normal text-slate-500">{booking.address}</span>}
                  </p>
                </div>
              </div>
            </div>

            {(booking.siteSnapshot?.accessInstructions || booking.siteSnapshot?.parkingInstructions) && (
              <div className="mt-5 pt-5 border-t border-border grid sm:grid-cols-2 gap-4">
                {booking.siteSnapshot?.accessInstructions && (
                  <div><p className="text-xs text-slate-400 mb-1">Access</p><p className="text-sm text-slate-700">{booking.siteSnapshot.accessInstructions}</p></div>
                )}
                {booking.siteSnapshot?.parkingInstructions && (
                  <div><p className="text-xs text-slate-400 mb-1">Parking</p><p className="text-sm text-slate-700">{booking.siteSnapshot.parkingInstructions}</p></div>
                )}
              </div>
            )}

            {booking.status === "completed" && (
              <div className="mt-6 rounded-lg bg-emerald-50 text-emerald-700 p-3 text-sm flex gap-2">
                <CheckCircle2 size={17} /> Completed on {dayjs(booking.date).format("D MMM YYYY")}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {booking.chargeAmount != null && booking.chargeType === "fixed" && (
            <Card className="p-5">
              <SectionTitle>Cost</SectionTitle>
              <p className="text-2xl font-semibold text-slate-950">{fmtMoney(booking.chargeAmount)}</p>
            </Card>
          )}
          {booking.chargeRate != null && booking.chargeType === "hourly" && (
            <Card className="p-5">
              <SectionTitle>Rate</SectionTitle>
              <p className="text-2xl font-semibold text-slate-950">{fmtMoney(booking.chargeRate)}<span className="text-sm font-normal text-slate-500">/hr</span></p>
            </Card>
          )}
          {booking.invoice && (
            <Card className="p-5">
              <SectionTitle>Linked invoice</SectionTitle>
              <Link to={`/invoices/${booking.invoice}`}>
                <Button variant="outline" className="w-full"><Download size={14} /> View invoice</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {rescheduling && <RescheduleBookingModal bookingId={id} onClose={() => setRescheduling(false)} />}
      {cancelling && <CancelBookingModal bookingId={id} onClose={() => setCancelling(false)} />}
    </div>
  )
}
