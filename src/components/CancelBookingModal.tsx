import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Info, X } from "lucide-react"
import toast from "react-hot-toast"
import { createCancelRequest } from "@/utils/queries/jobChangeRequests"
import { Button, Textarea } from "@/components/ui"

export function CancelBookingModal({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [reason, setReason] = useState("")

  const mutation = useMutation({
    mutationFn: () => createCancelRequest(bookingId, { reason: reason.trim() || undefined }),
    onSuccess: () => {
      toast.success("Request sent — we'll confirm the cancellation shortly.")
      qc.invalidateQueries({ queryKey: ["portal-booking-change-requests", bookingId] })
      onClose()
    },
    onError: (err: any) => toast.error(err?.response?.data?.msg ?? "Couldn't send your request — try again."),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-slate-900">Request cancellation</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Textarea label="Reason (optional)" placeholder="Let us know why, if you'd like" value={reason} onChange={setReason} />

          <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-3">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">This sends a request, not an instant cancellation — our team will review it and confirm.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={() => mutation.mutate()} loading={mutation.isPending}>Send request</Button>
        </div>
      </div>
    </div>
  )
}
