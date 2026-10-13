import { useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react"
import customFetch from "@/utils/customFetch"
import { Button, Card, Input } from "@/components/ui"

export function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Always succeeds (the backend never reveals whether the email is
      // registered) — see authControler.ts's forgotPassword.
      await customFetch.post("/auth/forgot-password", { email })
      setSent(true)
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
            {sent ? <CheckCircle2 size={21} /> : <ShieldCheck size={21} />}
          </div>
          {sent ? (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">Check your email</h1>
              <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">If an account exists for {email}, we've sent a password reset link to it.</p>
              <Button variant="ghost" className="w-full" onClick={() => navigate("/login")}>Back to sign in</Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">Reset your password</h1>
              <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">Enter your email and we'll send you a secure reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email address" type="email" placeholder="you@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
                <Button type="submit" className="w-full" loading={submitting}>Send reset link</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/login")}>
                  <ArrowLeft size={14} /> Back to sign in
                </Button>
              </form>
            </>
          )}
        </Card>
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">Powered by <span className="font-semibold text-slate-500">OnClockly</span></footer>
    </div>
  )
}
