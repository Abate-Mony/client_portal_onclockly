import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Download } from "lucide-react"
import toast from "react-hot-toast"
import customFetch from "@/utils/customFetch"
import { invoiceQuery } from "@/utils/queries/invoices"
import { Button, Card } from "@/components/ui"
import { Status } from "@/components/Status"
import { fmtMoney } from "@/utils/format"

export function InvoiceDetail() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  const { data, isLoading } = useQuery(invoiceQuery(id))
  const invoice = data?.invoice

  // Same blob-download mechanism as work.wk's InvoiceDetail.tsx.
  const handleDownloadPdf = async () => {
    setDownloading(true)
    try {
      const response = await customFetch.get(`/portal/invoices/${id}/pdf`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.download = `${invoice?.invoiceNumber ?? "invoice"}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Invoice PDF downloaded")
    } catch {
      toast.error("Couldn't download the PDF — try again.")
    } finally {
      setDownloading(false)
    }
  }

  if (isLoading) return <Card className="h-40 skeleton" />
  if (!invoice) return null

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" className="!-ml-3 mb-4" onClick={() => navigate("/invoices")}><ArrowLeft size={15} /> Back to invoices</Button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2"><span className="text-xs font-semibold text-primary">{invoice.invoiceNumber}</span><Status status={invoice.displayStatus} /></div>
          <h1 className="text-2xl font-semibold text-slate-950">{invoice.lineItems[0]?.description ?? invoice.invoiceNumber}</h1>
          <p className="text-sm text-slate-500 mt-1">Issued {dayjs(invoice.issueDate).format("D MMMM YYYY")} · Due {dayjs(invoice.dueDate).format("D MMMM YYYY")}</p>
        </div>
        <Button onClick={handleDownloadPdf} loading={downloading}><Download size={15} /> Download PDF</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h2 className="font-semibold text-slate-900">Line items</h2></div>
        <div className="hidden sm:grid grid-cols-5 px-5 py-3 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="col-span-2">Description</span><span>Qty</span><span>Unit price</span><span className="text-right">Total</span>
        </div>
        {invoice.lineItems.map((item, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-5 py-4 border-t border-slate-100 text-sm">
            <span className="font-medium text-slate-800 sm:col-span-2">{item.description}</span>
            <span className="sm:hidden text-right font-medium">{fmtMoney(item.amount, invoice.currency)}</span>
            <span className="hidden sm:block text-slate-500">{item.quantity}</span>
            <span className="hidden sm:block text-slate-500">{fmtMoney(item.rate, invoice.currency)}</span>
            <span className="hidden sm:block text-right font-medium">{fmtMoney(item.amount, invoice.currency)}</span>
          </div>
        ))}
        <div className="border-t border-border bg-slate-50/50 px-5 py-4 flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{fmtMoney(invoice.subtotal, invoice.currency)}</span></div>
            {!!invoice.vatRate && invoice.vatRate > 0 && (
              <div className="flex justify-between text-slate-500"><span>VAT ({invoice.vatRate}%)</span><span>{fmtMoney(invoice.vatAmount, invoice.currency)}</span></div>
            )}
            <div className="flex justify-between pt-2 border-t border-border text-base font-semibold text-slate-950"><span>Total</span><span>{fmtMoney(invoice.total, invoice.currency)}</span></div>
            {invoice.amountPaid > 0 && (
              <div className="flex justify-between text-slate-500"><span>Paid</span><span>{fmtMoney(invoice.amountPaid, invoice.currency)}</span></div>
            )}
            {invoice.balanceDue > 0 && (
              <div className="flex justify-between font-semibold text-slate-900"><span>Balance due</span><span>{fmtMoney(invoice.balanceDue, invoice.currency)}</span></div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
