import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

export function InvitationSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { clientName?: string } | undefined
  const clientName = state?.clientName ?? "the portal"

  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={1.5} />
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">All set</p>
      <h2 className="text-xl font-bold text-foreground mb-2">You're all set!</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        You now have access to <strong className="text-foreground">{clientName}</strong>.
      </p>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="w-full h-11 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        Go to dashboard
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
