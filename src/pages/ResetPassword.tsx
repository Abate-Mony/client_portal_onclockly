import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"
import { isAxiosError } from "axios"
import customFetch from "@/utils/customFetch"
import { Button, Card, Input } from "@/components/ui"

export function ResetPassword() {
  const { token = "" } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    if (password !== confirmPassword) { setError("Passwords do not match."); return }

    setSubmitting(true)
    try {
      await customFetch.post("/auth/reset-password", { token, password })
      toast.success("Password updated — sign in with your new password.")
      navigate("/login")
    } catch (err) {
      toast.error(isAxiosError(err) ? (err.response?.data?.msg ?? "This reset link is invalid or has expired.") : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-border flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">OnClockly Client Portal</span>
      </header>
      <main className="flex-1 flex items-center justify-center p-5">
        <Card className="w-full max-w-md p-6 sm:p-8 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
            <ShieldCheck size={21} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-950">Choose a new password</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">Use at least 8 characters.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="New password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            <Input label="Confirm password" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={error ?? undefined} />
            <Button type="submit" className="w-full" loading={submitting}>Update password</Button>
          </form>
        </Card>
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">Powered by <span className="font-semibold text-slate-500">OnClockly</span></footer>
    </div>
  )
}
