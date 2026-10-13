import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Info, X } from "lucide-react"
import toast from "react-hot-toast"
import { createBookingRequest } from "@/utils/queries/bookingRequests"
import { Button, Input, Textarea } from "@/components/ui"

export function RequestBookingModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [service, setService] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const [notes, setNotes] = useState("")

  const mutation = useMutation({
    mutationFn: () => createBookingRequest({ service: service.trim(), preferredDate, preferredTime: preferredTime || undefined, notes: notes.trim() || undefined }),
    onSuccess: () => {
      toast.success("Request sent — we'll be in touch to confirm the details.")
      qc.invalidateQueries({ queryKey: ["portal-booking-requests"] })
      onClose()
    },
    onError: (err: any) => toast.error(err?.response?.data?.msg ?? "Couldn't send your request — try again."),
  })

  const canSubmit = service.trim().length > 0 && preferredDate.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-slate-900">Request a booking</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Input label="What do you need?" placeholder="e.g. Office cleaning" value={service} onChange={e => setService(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" label="Preferred date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
            <Input type="time" label="Preferred time (optional)" value={preferredTime} onChange={e => setPreferredTime(e.target.value)} />
          </div>
          <Textarea label="Notes (optional)" placeholder="Anything else that would help us plan this" value={notes} onChange={setNotes} />

          <div className="flex gap-2.5 rounded-lg bg-blue-50 border border-blue-100 px-3.5 py-3">
            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">This sends a request, not a confirmed booking — our team will review it and reach out to confirm the details.</p>
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
