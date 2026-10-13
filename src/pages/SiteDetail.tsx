import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react"
import { siteQuery } from "@/utils/queries/sites"
import { Button, Card } from "@/components/ui"
import { SectionTitle } from "@/components/PageTitle"

export function SiteDetail() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery(siteQuery(id))
  const site = data?.site

  if (isLoading) return <Card className="h-40 skeleton" />
  if (!site) return null

  return (
    <div className="animate-fade-in max-w-2xl">
      <Button variant="ghost" className="!-ml-3 mb-4" onClick={() => navigate("/sites")}><ArrowLeft size={15} /> Back to sites</Button>

      <h1 className="text-2xl font-semibold text-slate-950 mb-6">{site.name}</h1>

      <Card className="p-5 sm:p-6 mb-5">
        <SectionTitle>Address & contact</SectionTitle>
        <div className="flex flex-col gap-3 mt-2">
          {site.formattedAddress && (
            <div className="flex gap-3"><MapPin size={17} className="text-slate-400 mt-0.5 shrink-0" /><p className="text-sm text-slate-700">{site.formattedAddress}</p></div>
          )}
          {site.contact?.phone && (
            <div className="flex gap-3"><Phone size={17} className="text-slate-400 mt-0.5 shrink-0" /><p className="text-sm text-slate-700">{site.contact.phone}</p></div>
          )}
          {site.contact?.email && (
            <div className="flex gap-3"><Mail size={17} className="text-slate-400 mt-0.5 shrink-0" /><p className="text-sm text-slate-700">{site.contact.email}</p></div>
          )}
        </div>
      </Card>

      {site.accessInstructions && (
        <Card className="p-5 sm:p-6 mb-5"><SectionTitle>Access</SectionTitle><p className="text-sm text-slate-700">{site.accessInstructions}</p></Card>
      )}
      {site.parkingInstructions && (
        <Card className="p-5 sm:p-6 mb-5"><SectionTitle>Parking</SectionTitle><p className="text-sm text-slate-700">{site.parkingInstructions}</p></Card>
      )}
      {site.instructions && (
        <Card className="p-5 sm:p-6"><SectionTitle>Other instructions</SectionTitle><p className="text-sm text-slate-700">{site.instructions}</p></Card>
      )}
    </div>
  )
}
