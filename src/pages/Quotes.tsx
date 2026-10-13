import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useNavigate } from "react-router"
import { FileCheck2 } from "lucide-react"
import { quotesQuery } from "@/utils/queries/quotes"
import { Card, EmptyState } from "@/components/ui"
import { Status } from "@/components/Status"
import { PageTitle } from "@/components/PageTitle"
import { fmtMoney } from "@/utils/format"

export function Quotes() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery(quotesQuery())
  const quotes = data?.quotes ?? []

  return (
    <div className="animate-fade-in">
      <PageTitle title="Quotes" description="Review quotes and respond to those awaiting approval." />

      {isLoading ? (
        <Card className="h-40 skeleton" />
      ) : error ? (
        <EmptyState icon={<FileCheck2 size={20} />} title="Couldn't load quotes" description="You may not have permission to view this, or something went wrong." />
      ) : quotes.length === 0 ? (
        <EmptyState icon={<FileCheck2 size={20} />} title="No quotes yet" description="Quotes sent to you will show up here." />
      ) : (
        <>
          <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-border">
                <tr className="text-xs uppercase tracking-wider text-slate-400">
                  {["Quote", "Service", "Amount", "Status", "Valid until"].map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map(q => (
                  <tr key={q._id} onClick={() => navigate(`/quotes/${q._id}`)} className="hover:bg-slate-50/70 cursor-pointer transition-colors text-sm">
                    <td className="px-5 py-4 font-medium text-primary">{q.quoteNumber}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">{q.title}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{fmtMoney(q.total, q.currency)}</td>
                    <td className="px-5 py-4"><Status status={q.status} /></td>
                    <td className="px-5 py-4 text-slate-500">{dayjs(q.validUntil).format("D MMM YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {quotes.map(q => (
              <Card key={q._id} onClick={() => navigate(`/quotes/${q._id}`)} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary mb-1">{q.quoteNumber}</p>
                    <p className="font-semibold text-slate-900 truncate">{q.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{fmtMoney(q.total, q.currency)} · Valid until {dayjs(q.validUntil).format("D MMM YYYY")}</p>
                  </div>
                  <Status status={q.status} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
