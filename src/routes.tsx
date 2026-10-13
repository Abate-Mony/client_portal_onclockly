import { createBrowserRouter } from "react-router"
import { queryClient } from "@/lib/queryClient"
import { Login } from "./pages/Login"
import { ForgotPassword } from "./pages/ForgotPassword"
import { ResetPassword } from "./pages/ResetPassword"
import { Dashboard } from "./pages/Dashboard"
import { Documents } from "./pages/Documents"
import { Profile } from "./pages/Profile"
import { PortalLayout, portalRootLoader } from "./layouts/PortalLayout"
import { InviteLayout } from "./layouts/InviteLayout"
import { AcceptInvitePage } from "./pages/invite/AcceptInvitePage"
import { NewPortalUserPage } from "./pages/invite/NewPortalUserPage"
import { InvitationStatusPage } from "./pages/invite/InvitationStatusPage"
import { InvitationSuccessPage } from "./pages/invite/InvitationSuccessPage"
import { Bookings } from "./pages/Bookings"
import { BookingDetail } from "./pages/BookingDetail"
import { Quotes } from "./pages/Quotes"
import { QuoteDetail } from "./pages/QuoteDetail"
import { Invoices } from "./pages/Invoices"
import { InvoiceDetail } from "./pages/InvoiceDetail"
import { Sites } from "./pages/Sites"
import { SiteDetail } from "./pages/SiteDetail"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    // Path-param tokens throughout (/invite/:token/...), matching the
    // backend's /portal/invitations/:token convention — not work.wk's
    // ?token= query-string shape.
    path: "/invite/:token",
    element: <InviteLayout />,
    children: [
      { index: true, element: <AcceptInvitePage /> },
      { path: "new-user", element: <NewPortalUserPage /> },
      { path: "status/:status", element: <InvitationStatusPage /> },
      { path: "success", element: <InvitationSuccessPage /> },
    ],
  },
  {
    path: "/",
    element: <PortalLayout />,
    loader: portalRootLoader(queryClient),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "bookings", element: <Bookings /> },
      { path: "bookings/:id", element: <BookingDetail /> },
      { path: "quotes", element: <Quotes /> },
      { path: "quotes/:id", element: <QuoteDetail /> },
      { path: "invoices", element: <Invoices /> },
      { path: "invoices/:id", element: <InvoiceDetail /> },
      { path: "sites", element: <Sites /> },
      { path: "sites/:id", element: <SiteDetail /> },
      { path: "documents", element: <Documents /> },
      { path: "profile", element: <Profile /> },
    ],
  },
])
