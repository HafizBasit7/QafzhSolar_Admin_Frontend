import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import "./i18n";
import Layout from "./components/Layout";
import AdminDashboard from "./components/AdminDashboard";
import ProductApprovals from "./components/ProductApprovals";
import ManageEngineers from "./components/ManageEngineers";
import ManageShops from "./components/ManageShops";
import ManageAds from "./components/ManageAds";
import CalculatorSettings from "./components/CalculatorSettings";
import Login from "./components/Login";

// Create theme with Tajawal font support
const createAppTheme = (direction) => {
  const isRTL = direction === "rtl";

  return createTheme({
    direction,
    palette: {
      mode: "light",
      primary: {
        main: "#00cc00", // Darker green
        light: "#4caf50",
        dark: "#2e7d32",
      },
      secondary: {
        main: "#0d5bb8", // Darker blue
        light: "#1976d2",
        dark: "#1565c0",
      },
      background: {
        default: "#f5f5f5",
        paper: "rgba(255, 255, 255, 0.9)",
      },
      text: {
        primary: "#2c3e50",
        secondary: "#7f8c8d",
      },
      success: {
        main: "#00cc00",
        light: "#4caf50",
        dark: "#2e7d32",
      },
      warning: {
        main: "#e65100", // Darker orange
        light: "#ff9800",
        dark: "#e65100",
      },
      error: {
        main: "#d32f2f",
        light: "#ef5350",
        dark: "#c62828",
      },
      info: {
        main: "#7b1fa2", // Darker purple
        light: "#9c27b0",
        dark: "#6a1b9a",
      },
    },
    typography: {
      fontFamily: isRTL
        ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      h1: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 700 : 600,
      },
      h2: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 700 : 600,
      },
      h3: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 600 : 600,
      },
      h4: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 600 : 600,
      },
      h5: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 500 : 600,
      },
      h6: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 500 : 600,
      },
      body1: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 400 : 400,
      },
      body2: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 400 : 400,
      },
      button: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 500 : 500,
        textTransform: "none",
      },
      caption: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 400 : 400,
      },
      overline: {
        fontFamily: isRTL
          ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontWeight: isRTL ? 400 : 400,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: isRTL
              ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            direction: isRTL ? "rtl" : "ltr",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: isRTL
              ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: isRTL
              ? "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              : "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontWeight: isRTL ? 500 : 500,
          },
        },
      },
    },
  });
};

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isRTL } = useLanguage();
  const theme = createAppTheme(isRTL ? "rtl" : "ltr");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <AdminDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/product-approvals"
                    element={
                      <PrivateRoute>
                        <ProductApprovals />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/manage-engineers"
                    element={
                      <PrivateRoute>
                        <ManageEngineers />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/manage-shops"
                    element={
                      <PrivateRoute>
                        <ManageShops />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/manage-ads"
                    element={
                      <PrivateRoute>
                        <ManageAds />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/calculator-settings"
                    element={
                      <PrivateRoute>
                        <CalculatorSettings />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
