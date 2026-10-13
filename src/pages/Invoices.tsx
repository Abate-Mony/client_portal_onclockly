import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useNavigate } from "react-router"
import { ReceiptText } from "lucide-react"
import { invoicesQuery } from "@/utils/queries/invoices"
import { Card, EmptyState } from "@/components/ui"
import { Status } from "@/components/Status"
import { PageTitle } from "@/components/PageTitle"
import { fmtMoney } from "@/utils/format"

export function Invoices() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery(invoicesQuery())
  const invoices = data?.invoices ?? []

  return (
    <div className="animate-fade-in">
      <PageTitle title="Invoices" description="View invoice details and download PDF copies." />

      {isLoading ? (
        <Card className="h-40 skeleton" />
      ) : error ? (
        <EmptyState icon={<ReceiptText size={20} />} title="Couldn't load invoices" description="You may not have permission to view this, or something went wrong." />
      ) : invoices.length === 0 ? (
        <EmptyState icon={<ReceiptText size={20} />} title="No invoices yet" description="Invoices sent to you will show up here." />
      ) : (
        <>
          <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-border">
                <tr className="text-xs uppercase tracking-wider text-slate-400">
                  {["Invoice", "Description", "Amount", "Status", "Due date"].map(h => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => (
                  <tr key={inv._id} onClick={() => navigate(`/invoices/${inv._id}`)} className="hover:bg-slate-50/70 cursor-pointer transition-colors text-sm">
                    <td className="px-5 py-4 font-medium text-primary">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4 font-medium text-slate-900">{inv.lineItems[0]?.description ?? "—"}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{fmtMoney(inv.total, inv.currency)}</td>
                    <td className="px-5 py-4"><Status status={inv.displayStatus} /></td>
                    <td className="px-5 py-4 text-slate-500">{dayjs(inv.dueDate).format("D MMM YYYY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {invoices.map(inv => (
              <Card key={inv._id} onClick={() => navigate(`/invoices/${inv._id}`)} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary mb-1">{inv.invoiceNumber}</p>
                    <p className="font-semibold text-slate-900 truncate">{inv.lineItems[0]?.description ?? "—"}</p>
                    <p className="text-xs text-slate-500 mt-1">{fmtMoney(inv.total, inv.currency)} · Due {dayjs(inv.dueDate).format("D MMM YYYY")}</p>
                  </div>
                  <Status status={inv.displayStatus} />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
