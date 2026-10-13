import { Badge, type BadgeVariant } from "./ui"

// Ported from the Figma design's local Status component (ClientPortal.tsx)
// — covers booking/quote/invoice statuses in one place since all three
// share the same badge styling language.
const config: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Pending confirmation", variant: "warning" },
  published: { label: "Confirmed", variant: "info" },
  pending: { label: "Pending review", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  sent: { label: "Sent", variant: "info" },
  viewed: { label: "Viewed", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "danger" },
  expired: { label: "Expired", variant: "neutral" },
  paid: { label: "Paid", variant: "success" },
  overdue: { label: "Sent · overdue", variant: "warning" },
}

export function Status({ status }: { status: string }) {
  const item = config[status] ?? { label: status, variant: "neutral" as const }
  return <Badge variant={item.variant} dot>{item.label}</Badge>
}
