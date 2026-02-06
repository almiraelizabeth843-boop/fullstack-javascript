import { createBrowserRouter } from "react-router";
import Homescreen from "./pages/App";
import Aboutscreen from "./pages/About";
import ErrorScreen from "./errors";
import RootLayout from "./components/layout/RootLayout";
import Loginscreen from "./pages/auth/Login";
import SignupPage from "./pages/auth/signup";
import AuthRootLayout from "./components/layout/AuthRootLayout";
import VerifyOtpPage from "./pages/auth/verifyotp";
// import ConfirmPasswordPage from "./pages/auth/confirm_password";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorScreen,
    children: [
      { index: true, Component: Homescreen }, // '/'
      { path: "about", Component: Aboutscreen }, // '/about'
         
    ],
  },

  {path: "/login", Component: Loginscreen},
  {
    path: "/register",
    Component: AuthRootLayout,
    children: [
      { index: true, Component: SignupPage }, // "/register"
      {path: "verify-otp", Component: VerifyOtpPage}, // "/register/verify-otp"
      // {path: "confirm-password", Component: ConfirmPasswordPage}, // "/register/confirm-password"
    ],
  },
  
]);
