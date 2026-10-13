import { FileText } from "lucide-react"
import { EmptyState } from "@/components/ui"
import { PageTitle } from "@/components/PageTitle"

// No ClientDocument model/backend exists yet — this is a genuine future
// milestone, not just empty data (see the client-portal plan's Milestone
// 2+ list). Showing an honest "not available yet" state rather than a
// fake document list with nothing behind it.
export function Documents() {
  return (
    <div className="animate-fade-in">
      <PageTitle title="Documents" description="Files securely shared with you by your service provider." />
      <EmptyState
        icon={<FileText size={20} />}
        title="Document sharing is coming soon"
        description="This isn't built yet — check back in a future update, or contact your service provider directly for any documents you need now."
      />
    </div>
  )
}
