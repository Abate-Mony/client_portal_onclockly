import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Info, X } from "lucide-react"
import toast from "react-hot-toast"
import { createRescheduleRequest } from "@/utils/queries/jobChangeRequests"
import { Button, Input, Textarea } from "@/components/ui"

export function RescheduleBookingModal({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [requestedDate, setRequestedDate] = useState("")
  const [requestedStartTime, setRequestedStartTime] = useState("")
  const [requestedEndTime, setRequestedEndTime] = useState("")
  const [reason, setReason] = useState("")

  const mutation = useMutation({
    mutationFn: () => createRescheduleRequest(bookingId, { requestedDate, requestedStartTime, requestedEndTime, reason: reason.trim() || undefined }),
    onSuccess: () => {
      toast.success("Request sent — we'll be in touch to confirm the new time.")
      qc.invalidateQueries({ queryKey: ["portal-booking-change-requests", bookingId] })
      onClose()
    },
    onError: (err: any) => toast.error(err?.response?.data?.msg ?? "Couldn't send your request — try again."),
  })

  const canSubmit = requestedDate.length > 0 && requestedStartTime.length > 0 && requestedEndTime.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-slate-900">Request reschedule</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" label="New date" value={requestedDate} onChange={e => setRequestedDate(e.target.value)} />
            <Input type="time" label="Start time" value={requestedStartTime} onChange={e => setRequestedStartTime(e.target.value)} />
          </div>
          <Input type="time" label="End time" value={requestedEndTime} onChange={e => setRequestedEndTime(e.target.value)} />
          <Textarea label="Reason (optional)" placeholder="Anything that would help us accommodate this" value={reason} onChange={setReason} />

          <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-3">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">This sends a request, not a confirmed change — our team will review it and reach out to confirm the new time.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!canSubmit}>Send request</Button>
        </div>
      </div>
    </div>
  )
}
