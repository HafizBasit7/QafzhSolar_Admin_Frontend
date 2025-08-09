import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Chip,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Engineering as EngineeringIcon,
  Store as StoreIcon,
  Campaign as CampaignIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import { useDashboardCounts } from "../hooks/useDashboard";

/**
 * AdminDashboard
 * - Keeps all original logic (translations, navigation, hook calls)
 * - Adds responsive & polished UI
 * - Preserves `change` and `changeType` indicators (with icons and chips)
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: countsData, isLoading, error } = useDashboardCounts();

  // Stats (keeps change/changeType from original)
  const statsCards = [
    {
      title: t("dashboard.stats.pendingApprovals"),
      value: countsData?.data?.pendingApprovals || "0",
      change: "+2",
      changeType: "increase",
      color: "#e65100", // Darker orange
      icon: <InventoryIcon />,
      description: t("dashboard.stats.pendingApprovalsDesc"),
    },
    {
      title: t("dashboard.stats.totalEngineers"),
      value: countsData?.data?.totalEngineers || "0",
      change: "+5",
      changeType: "increase",
      color: "#0d5bb8", // Darker blue
      icon: <EngineeringIcon />,
      description: t("dashboard.stats.totalEngineersDesc"),
    },
    {
      title: t("dashboard.stats.verifiedShops"),
      value: countsData?.data?.verifiedShops || "0",
      change: "+3",
      changeType: "increase",
      color: "#00cc00", // Darker green
      icon: <StoreIcon />,
      description: t("dashboard.stats.verifiedShopsDesc"),
    },
    {
      title: t("dashboard.stats.activeAds"),
      value: countsData?.data?.activeAds || "0",
      change: "-1",
      changeType: "decrease",
      color: "#7b1fa2", // Darker purple
      icon: <CampaignIcon />,
      description: t("dashboard.stats.activeAdsDesc"),
    },
  ];

  // Quick actions (keeps path & descriptions)
  const quickActions = [
    {
      title: t("dashboard.actions.reviewProducts"),
      icon: <InventoryIcon />,
      color: "#e65100", // Darker orange
      path: "/product-approvals",
      description: t("dashboard.actions.reviewProductsDesc"),
    },
    {
      title: t("dashboard.actions.addEngineer"),
      icon: <EngineeringIcon />,
      color: "#0d5bb8", // Darker blue
      path: "/manage-engineers",
      description: t("dashboard.actions.addEngineerDesc"),
    },
    {
      title: t("dashboard.actions.addShop"),
      icon: <StoreIcon />,
      color: "#00cc00", // Darker green
      path: "/manage-shops",
      description: t("dashboard.actions.addShopDesc"),
    },
    {
      title: t("dashboard.actions.uploadAd"),
      icon: <CampaignIcon />,
      color: "#7b1fa2", // Darker purple
      path: "/manage-ads",
      description: t("dashboard.actions.uploadAdDesc"),
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || t("dashboard.errorLoading") || "Failed to load dashboard data"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Header Section */}
      <Box sx={{ mb: { xs: 3, md: 6 } }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: "1.6rem", md: "2.125rem" } }}>
          {t("dashboard.welcome")}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {t("dashboard.subtitle")}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: { xs: 4, md: 6 } }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                minHeight: 200,
                background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.99) 100%)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${card.color}20`,
                borderRadius: 3,
                transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 18px 36px ${card.color}30`,
                  border: `1px solid ${card.color}40`,
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Top Row: Icon and change chip */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { fontSize: 28 } })}
                  </Box>

                  <Chip
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {card.changeType === "increase" ? <TrendingUpIcon sx={{ fontSize: 18 }} /> : <TrendingDownIcon sx={{ fontSize: 18 }} />}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {card.change}
                        </Typography>
                      </Box>
                    }
                    size="small"
                    sx={{
                      backgroundColor: card.changeType === "increase" ? "rgba(0,200,83,0.08)" : "rgba(244,67,54,0.08)",
                      color: card.changeType === "increase" ? "success.main" : "error.main",
                      border: `1px solid ${card.changeType === "increase" ? "rgba(0,200,83,0.12)" : "rgba(244,67,54,0.12)"}`,
                      fontWeight: 700,
                    }}
                  />
                </Box>

                {/* Value */}
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    color: card.color,
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "2rem", md: "2.6rem" },
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </Typography>

                {/* Title */}
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: "auto" }}>
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 3,
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: { xs: 2.5, md: 4 } }}>
              {t("dashboard.quickActions")}
            </Typography>

            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card
                    elevation={2}
                    onClick={() => handleNavigation(action.path)}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      p: { xs: 2.5, md: 3 },
                      height: "100%",
                      minHeight: 160,
                      background: "rgba(255,255,255,0.92)",
                      border: `1px solid ${action.color}20`,
                      borderRadius: 3,
                      transition: "transform 0.28s, box-shadow 0.28s",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.02)",
                        boxShadow: `0 14px 28px ${action.color}25`,
                        border: `1px solid ${action.color}40`,
                      },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.75,
                        borderRadius: 2,
                        backgroundColor: `${action.color}12`,
                        color: action.color,
                        mb: 1.5,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.cloneElement(action.icon, { sx: { fontSize: 34 } })}
                    </Box>

                    <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
                      {action.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                      {action.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
