// UI-only mirror of the backend's src/utils/clientPermissions.ts — used to
// decide what to render (nav links, dashboard widgets, accept/decline
// buttons), never to actually enforce anything. The real gate is server-
// side (requireClientPermission on every /portal/* route); this just
// avoids showing a link/button that would 403 if used.
import type { ClientRole } from "./types/invitation"

export type ClientAction = "booking:read" | "booking:create" | "booking:update" | "booking:cancel" | "quote:read" | "quote:accept" | "invoice:read"

const CLIENT_PERMISSIONS: Record<ClientRole, Set<ClientAction>> = {
  owner: new Set(["booking:read", "booking:create", "booking:update", "booking:cancel", "quote:read", "quote:accept", "invoice:read"]),
  manager: new Set(["booking:read", "booking:create", "booking:update", "booking:cancel", "quote:read", "invoice:read"]),
  booking: new Set(["booking:read", "booking:create", "booking:update", "booking:cancel"]),
  billing: new Set(["quote:read", "invoice:read"]),
  viewer: new Set(["booking:read"]),
}

export const canClient = (clientRole: ClientRole | undefined, action: ClientAction): boolean =>
  !!clientRole && (CLIENT_PERMISSIONS[clientRole]?.has(action) ?? false)
