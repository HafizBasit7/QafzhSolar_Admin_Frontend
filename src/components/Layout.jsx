import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Engineering as EngineeringIcon,
  Store as StoreIcon,
  Campaign as CampaignIcon,
  Calculate as CalculateIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountCircleIcon,
  AccountBalance 
} from "@mui/icons-material";
import LanguageToggle from "./LanguageToggle";
import { useLogout } from "../hooks/useAuth";
import logo from "../assets/mylogo.png";

const drawerWidth = 280;

const menuItems = [
  { text: "navigation.dashboard", icon: <DashboardIcon />, path: "/" },
  {
    text: "navigation.productApprovals",
    icon: <InventoryIcon />,
    path: "/product-approvals",
  },
  {
    text: "navigation.manageEngineers",
    icon: <EngineeringIcon />,
    path: "/manage-engineers",
  },
  {
    text: "navigation.manageShops",
    icon: <StoreIcon />,
    path: "/manage-shops",
  },
  { text: "navigation.manageAds", icon: <CampaignIcon />, path: "/manage-ads" },
  {
    text: "navigation.calculatorSettings",
    icon: <CalculateIcon />,
    path: "/calculator-settings",
  },
  {
    text: "navigation.bankDetails",
    icon: <AccountBalance />,
    path: "/bank-details",
  }
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 3,
          background: "#1877f2",
          color: "white",
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          // src="/logo.png"
          src = {logo}
          alt="Qahzah Logo"
          sx={{
            width: { xs: 80, md: 100 }, // Responsive sizing
            height: 'auto', // Maintain aspect ratio
            mx: "auto",
            mb: 2,
            borderRadius: 8,
            objectFit: "contain",
            transition: 'all 0.3s ease', // Smooth hover effects
            '&:hover': {
              transform: 'scale(1.05)', // Subtle hover animation
              opacity: 0.9
            }
          }}
          onError={(e) => {
            console.error("Logo failed to load");
    e.target.src = '/logo-fallback.png'; // Fallback image path
    e.target.style.display = "block"; // Ensure fallback is visible
    e.target.style.width = '100px'; // Maintain consistent sizing
    e.target.style.height = 'auto';
          }}
        />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("dashboard.title")}
        </Typography>
        {/* <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {t("common.adminPanel")}
        </Typography> */}
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 204, 0, 0.1)",
                  color: "#00cc00",
                },
                "&.Mui-selected": {
                  backgroundColor: "#1877f2",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1877f2",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(item.text)}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", direction: isRTL ? "rtl" : "ltr" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ...(isRTL
            ? {
                right: { sm: `${drawerWidth}px` },
                left: 0,
              }
            : {
                left: { sm: `${drawerWidth}px` },
                right: 0,
              }),
          background: "#1877f2",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge={isRTL ? "end" : "start"}
            onClick={handleDrawerToggle}
            sx={{
              ...(isRTL ? { ml: 2 } : { mr: 2 }),
              display: { sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color:"white" }}>
            {t("dashboard.title")}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <LanguageToggle />
            <Tooltip title={t("common.profile")} arrow sx={{color:"white" }}>
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "#f5f5f5",
          ...(isRTL && {
            marginRight: { sm: `${drawerWidth}px` },
            marginLeft: 0,
          }),
          ...(!isRTL && {
            marginLeft: { sm: `${drawerWidth}px` },
            marginRight: 0,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          position: "fixed",
          top: 0,
          ...(isRTL && { right: 0 }),
          ...(!isRTL && { left: 0 }),
          height: "100vh",
          zIndex: 1200,
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: isRTL
                ? "-2px 0 10px rgba(0, 0, 0, 0.1)"
                : "2px 0 10px rgba(0, 0, 0, 0.1)",
              position: "fixed",
              top: 0,
              ...(isRTL && { right: 0 }),
              ...(!isRTL && { left: 0 }),
              height: "100vh",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleLogout}>{t("common.logout")}</MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
