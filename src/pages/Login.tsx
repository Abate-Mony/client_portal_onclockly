import { useState } from "react"
import { Link } from "react-router"
import { ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"
import customFetch from "@/utils/customFetch"
import { Button, Card, Input } from "@/components/ui"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await customFetch.post("/client-auth/login", { email, password })
      window.location.href = "/"
    } catch {
      toast.error("Couldn't log in — check your email and password.")
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
          <h1 className="text-2xl font-semibold text-slate-950">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">Sign in to manage your bookings and documents.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={submitting}>Sign in</Button>
            <p className="text-xs text-center text-slate-400">No account? Ask your service provider for an invite.</p>
          </form>
        </Card>
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">Powered by <span className="font-semibold text-slate-500">OnClockly</span></footer>
    </div>
  )
}
