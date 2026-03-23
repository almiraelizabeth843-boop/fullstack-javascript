import { createBrowserRouter } from "react-router";
import Homescreen from "./pages/App";
import Aboutscreen from "./pages/About";
import ErrorScreen from "./errors";
import RootLayout from "./components/layout/RootLayout";
import Loginscreen from "./pages/auth/Login";
import SignupPage from "./pages/auth/signup";
import AuthRootLayout from "./components/layout/AuthRootLayout";
import VerifyOtpPage from "./pages/auth/verifyotp";
import FavoritesPage from "./pages/Favorites";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorScreen,
    children: [
      { index: true, Component: Homescreen }, // '/'
      { path: "about", Component: Aboutscreen }, // '/about'
      { path: "favorites", Component: FavoritesPage }, // '/favorites'
    ],
  },

  {path: "/login", Component: Loginscreen},
  {path: "/forgot-password", Component: ForgotPasswordPage},
  {path: "/reset-password", Component: ResetPasswordPage},
  {
    path: "/register",
    Component: AuthRootLayout,
    children: [
      { index: true, Component: SignupPage }, // "/register"
      {path: "verify-otp", Component: VerifyOtpPage}, // "/register/verify-otp"
    ],
  },
  
]);
