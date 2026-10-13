import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { ChevronRight, Building2 } from "lucide-react"
import { sitesQuery } from "@/utils/queries/sites"
import { Card, EmptyState } from "@/components/ui"
import { PageTitle } from "@/components/PageTitle"
import { getInitials } from "@/utils/getInitials"

export function Sites() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery(sitesQuery())
  const sites = data?.sites ?? []

  return (
    <div className="animate-fade-in">
      <PageTitle title="Sites" description="Your service addresses and booking history." />

      {isLoading ? (
        <Card className="h-40 skeleton" />
      ) : error ? (
        <EmptyState icon={<Building2 size={20} />} title="Couldn't load sites" description="You may not have permission to view this, or something went wrong." />
      ) : sites.length === 0 ? (
        <EmptyState icon={<Building2 size={20} />} title="No sites yet" description="Your service locations will show up here." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {sites.map(site => (
            <Card key={site._id} onClick={() => navigate(`/sites/${site._id}`)} className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-primary flex items-center justify-center text-xs font-bold">{getInitials(site.name)}</div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{site.name}</p>
                {site.formattedAddress && <p className="text-xs text-slate-500 mt-1 truncate">{site.formattedAddress}</p>}
              </div>
              <ChevronRight size={17} className="text-slate-300" />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
