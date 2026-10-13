import { useState } from "react"
import { isAxiosError } from "axios"
import { Eye, EyeOff } from "lucide-react"
import { Navigate, useNavigate, useOutletContext } from "react-router"
import toast from "react-hot-toast"
import customFetch from "@/utils/customFetch"
import type { InvitationOutletContext } from "@/utils/types/invitation"
import { CLIENT_ROLE_LABELS } from "@/utils/types/invitation"

const inputClass =
  "w-full h-11 px-4 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"

export function NewPortalUserPage() {
  const navigate = useNavigate()
  const { token, invite, isLoading } = useOutletContext<InvitationOutletContext>()

  const [fullname, setFullname] = useState(invite?.fullname ?? "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-xl" />
        <div className="h-11 bg-muted rounded-xl" />
        <div className="h-11 bg-muted rounded-xl" />
        <div className="h-11 bg-muted rounded-xl" />
      </div>
    )
  }

  if (!invite) {
    return <Navigate replace to={`/invite/${encodeURIComponent(token)}/status/invalid`} />
  }
  if (invite.accountExists) {
    return <Navigate replace to={`/invite/${encodeURIComponent(token)}/status/account-exists`} />
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!fullname.trim()) nextErrors.fullname = "Enter your full name."
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters."
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match."
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)

    try {
      await customFetch.post(`/portal/invitations/${encodeURIComponent(token)}/accept`, {
        fullname: fullname.trim(),
        password,
      })

      navigate(`/invite/${encodeURIComponent(token)}/success`, {
        replace: true,
        state: { clientName: invite.client.name },
      })
    } catch (err) {
      const code = isAxiosError(err) ? (err.response?.data as { code?: string } | undefined)?.code : undefined
      const message = isAxiosError(err)
        ? (err.response?.data?.msg ?? err.response?.data?.message ?? "Unable to accept invitation.")
        : "Unable to accept invitation."

      // The backend re-validates on every submit — any of these means the
      // token's state changed since the initial fetch (a double-submit,
      // or a revoke/resend in between). Re-route to the right state
      // instead of just toasting a generic error.
      if (code === "ACCOUNT_EXISTS") {
        toast.error(message)
        navigate(`/invite/${encodeURIComponent(token)}/status/account-exists`, { replace: true })
        return
      }
      if (code === "INVITATION_EXPIRED" || code === "INVITATION_REVOKED" || code === "INVITATION_ACCEPTED") {
        const status = code === "INVITATION_EXPIRED" ? "expired" : code === "INVITATION_REVOKED" ? "revoked" : "already-accepted"
        toast.error(message)
        navigate(`/invite/${encodeURIComponent(token)}/status/${status}`, { replace: true })
        return
      }

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-muted border border-border rounded-xl px-5 py-4">
        {[
          { label: "Client", value: invite.client.name },
          { label: "Role", value: CLIENT_ROLE_LABELS[invite.clientRole] },
          { label: "Email", value: invite.email },
        ].map((row, index, arr) => (
          <div key={row.label} className={`flex items-center justify-between py-2 ${index < arr.length - 1 ? "border-b border-border" : ""}`}>
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-semibold text-foreground text-right">{row.value}</span>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Create your account</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Full name</label>
            <input value={fullname} onChange={e => setFullname(e.target.value)} placeholder="John Smith" className={inputClass} />
            {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Email address</label>
            <input value={invite.email} readOnly className={`${inputClass} bg-muted text-muted-foreground cursor-not-allowed`} />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button type="button" onClick={() => setPasswordVisible(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">At least 8 characters.</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                type={confirmVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button type="button" onClick={() => setConfirmVisible(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {confirmVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-11 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {loading ? "Accepting invitation…" : "Accept invitation & create account"}
      </button>
    </div>
  )
}
