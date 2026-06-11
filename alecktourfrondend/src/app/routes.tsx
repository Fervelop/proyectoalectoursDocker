import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import PackageDetail from "./pages/PackageDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Profile from "./pages/Profile";
import Personalization from "./pages/Personalization";
import Benefits from "./pages/Benefits";
import Corporate from "./pages/Corporate";
import TravelInfo from "./pages/TravelInfo";
import Reservas from "./pages/Reservas";
import HotelDetail from "./pages/HotelDetail";
import VerifyEmail from "./pages/VerifyEmail";
import PreferencesForm from "./pages/PreferencesForm";
import AdminDashboard from "./pages/Admindashboard";
import FAQ from "./pages/faq";
import Contact from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/",               Component: Home },
  { path: "/search",         Component: SearchResults },
  { path: "/package/:id",    Component: PackageDetail },
  { path: "/login",          Component: Login },
  { path: "/register",       Component: Register },
  { path: "/checkout/:id",   Component: Checkout },
  { path: "/confirmation",   Component: Confirmation },
  { path: "/benefits",       Component: Benefits },
  { path: "/corporate",      Component: Corporate },
  { path: "/travel-info",    Component: TravelInfo },
  { path: "/hotel/:id",      Component: HotelDetail },
  { path: "/verify",         Component: VerifyEmail },
  { path: "/faq",            Component: FAQ },
  { path: "/contact",        Component: Contact },
  { path: "/reset-password", Component: ResetPassword },

  // Rutas protegidas (requieren login)
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/personalize/:id",
    element: (
      <ProtectedRoute>
        <Personalization />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reservas",
    element: (
      <ProtectedRoute>
        <Reservas />
      </ProtectedRoute>
    ),
  },
  {
    path: "/preferences",
    element: (
      <ProtectedRoute>
        <PreferencesForm />
      </ProtectedRoute>
    ),
  },

  // Ruta exclusiva admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);