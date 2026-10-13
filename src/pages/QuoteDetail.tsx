import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Check, Clock3 } from "lucide-react"
import toast from "react-hot-toast"
import customFetch from "@/utils/customFetch"
import { meQuery } from "@/utils/portalAuth"
import { quoteQuery } from "@/utils/queries/quotes"
import { Button, Card, Textarea } from "@/components/ui"
import { Status } from "@/components/Status"
import { fmtMoney } from "@/utils/format"
import { canClient } from "@/utils/clientPermissions"

function LineItems({ quote }: { quote: { items: { description: string; quantity: number; unitPrice: number; amount: number }[]; subtotal: number; taxRate?: number; taxAmount?: number; total: number; currency: string } }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border"><h2 className="font-semibold text-slate-900">Line items</h2></div>
      <div className="hidden sm:grid grid-cols-5 px-5 py-3 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="col-span-2">Description</span><span>Qty</span><span>Unit price</span><span className="text-right">Total</span>
      </div>
      {quote.items.map((item, i) => (
        <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-5 py-4 border-t border-slate-100 text-sm">
          <span className="font-medium text-slate-800 sm:col-span-2">{item.description}</span>
          <span className="sm:hidden text-right font-medium">{fmtMoney(item.amount, quote.currency)}</span>
          <span className="hidden sm:block text-slate-500">{item.quantity}</span>
          <span className="hidden sm:block text-slate-500">{fmtMoney(item.unitPrice, quote.currency)}</span>
          <span className="hidden sm:block text-right font-medium">{fmtMoney(item.amount, quote.currency)}</span>
        </div>
      ))}
      <div className="border-t border-border bg-slate-50/50 px-5 py-4 flex justify-end">
        <div className="w-full sm:w-64 space-y-2 text-sm">
          <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{fmtMoney(quote.subtotal, quote.currency)}</span></div>
          {!!quote.taxRate && quote.taxRate > 0 && (
            <div className="flex justify-between text-slate-500"><span>VAT ({quote.taxRate}%)</span><span>{fmtMoney(quote.taxAmount ?? 0, quote.currency)}</span></div>
          )}
          <div className="flex justify-between pt-2 border-t border-border text-base font-semibold text-slate-950"><span>Total</span><span>{fmtMoney(quote.total, quote.currency)}</span></div>
        </div>
      </div>
    </Card>
  )
}

export function QuoteDetail() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [declining, setDeclining] = useState(false)
  const [reason, setReason] = useState("")

  const { data, isLoading } = useQuery(quoteQuery(id))
  const { data: me } = useQuery(meQuery)
  const quote = data?.quote

  const respondMutation = useMutation({
    mutationFn: (action: "accept" | "decline") =>
      customFetch.post(`/portal/quotes/${id}/${action}`, action === "decline" ? { declineReason: reason || undefined } : {}),
    onSuccess: (_res, action) => {
      toast.success(action === "accept" ? "Quote approved successfully" : "Quote declined")
      setDeclining(false)
      qc.invalidateQueries({ queryKey: ["portal-quote", id] })
    },
    onError: (err: any) => toast.error(err?.response?.data?.msg ?? "Couldn't record your response — try again."),
  })

  if (isLoading) return <Card className="h-40 skeleton" />
  if (!quote) return null

  const isRespondable = quote.status === "sent" || quote.status === "viewed"
  const canAccept = canClient(me?.user.clientRole, "quote:accept")
  const expiringSoon = isRespondable && dayjs(quote.validUntil).diff(dayjs(), "day") <= 10

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" className="!-ml-3 mb-4" onClick={() => navigate("/quotes")}><ArrowLeft size={15} /> Back to quotes</Button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-primary">{quote.quoteNumber}</span><Status status={quote.status} /></div>
          <h1 className="text-2xl font-semibold text-slate-950">{quote.title}</h1>
          <p className="text-sm text-slate-500 mt-1">Valid until {dayjs(quote.validUntil).format("D MMMM YYYY")}</p>
        </div>
      </div>

      {expiringSoon && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 flex gap-3">
          <Clock3 size={18} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">This quote expires soon</p>
            <p className="text-xs text-amber-700 mt-0.5">Please review and respond by {dayjs(quote.validUntil).format("D MMMM YYYY")}.</p>
          </div>
        </div>
      )}

      <LineItems quote={quote} />

      {isRespondable && canAccept && (
        <Card className="p-5 mt-5">
          {!declining ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Ready to respond?</p>
                <p className="text-sm text-slate-500 mt-0.5">Your response will be shared with your account manager.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDeclining(true)}>Decline</Button>
                <Button onClick={() => respondMutation.mutate("accept")} loading={respondMutation.isPending}><Check size={15} /> Approve quote</Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-slate-900 mb-1">Decline quote</p>
              <p className="text-sm text-slate-500 mb-4">You can optionally tell us why.</p>
              <Textarea placeholder="Reason for declining (optional)" value={reason} onChange={setReason} />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" onClick={() => setDeclining(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => respondMutation.mutate("decline")} loading={respondMutation.isPending}>Confirm decline</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {isRespondable && !canAccept && (
        <p className="text-sm text-slate-500 text-center mt-5">Only an account owner can accept or decline this quote.</p>
      )}
    </div>
  )
}
