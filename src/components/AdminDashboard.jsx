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
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Engineering as EngineeringIcon,
  Store as StoreIcon,
  Campaign as CampaignIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const statsCards = [
    {
      title: t("dashboard.stats.pendingApprovals"),
      value: "12",
      change: "+2",
      changeType: "increase",
      color: "#e65100", // Darker orange
      icon: <InventoryIcon />,
      description: t("dashboard.stats.pendingApprovalsDesc"),
    },
    {
      title: t("dashboard.stats.totalEngineers"),
      value: "45",
      change: "+5",
      changeType: "increase",
      color: "#0d5bb8", // Darker blue
      icon: <EngineeringIcon />,
      description: t("dashboard.stats.totalEngineersDesc"),
    },
    {
      title: t("dashboard.stats.verifiedShops"),
      value: "23",
      change: "+3",
      changeType: "increase",
      color: "#00cc00", // Darker green
      icon: <StoreIcon />,
      description: t("dashboard.stats.verifiedShopsDesc"),
    },
    {
      title: t("dashboard.stats.activeAds"),
      value: "8",
      change: "-1",
      changeType: "decrease",
      color: "#7b1fa2", // Darker purple
      icon: <CampaignIcon />,
      description: t("dashboard.stats.activeAdsDesc"),
    },
  ];

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {t("dashboard.welcome")}
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          {t("dashboard.subtitle")}
        </Typography>
      </Box>

      {/* Stats Cards - Larger and More Professional */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                minHeight: 200,
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)",
                backdropFilter: "blur(20px)",
                border: `2px solid ${card.color}20`,
                borderRadius: 4,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 20px 40px ${card.color}30`,
                  border: `2px solid ${card.color}40`,
                },
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header - No Icons or Change Indicators */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: `${card.color}15`,
                      color: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { fontSize: 32 } })}
                  </Box>
                </Box>

                {/* Value - Centered */}
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    color: card.color,
                    fontWeight: "bold",
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "3rem" },
                    textAlign: "center",
                  }}
                >
                  {card.value}
                </Typography>

                {/* Title - Centered */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    color: "text.primary",
                    textAlign: "center",
                  }}
                >
                  {card.title}
                </Typography>

                {/* Description - Centered */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    fontWeight: 500,
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions - Larger and More Professional */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)",
              backdropFilter: "blur(20px)",
              border: "2px solid rgba(0, 0, 0, 0.08)",
              borderRadius: 4,
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 4 }}
            >
              {t("dashboard.quickActions")}
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      p: 3,
                      height: "100%",
                      minHeight: 180,
                      background: "rgba(255, 255, 255, 0.8)",
                      border: `2px solid ${action.color}20`,
                      borderRadius: 3,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        transform: "translateY(-6px) scale(1.02)",
                        boxShadow: `0 16px 32px ${action.color}25`,
                        border: `2px solid ${action.color}40`,
                      },
                    }}
                    onClick={() => handleNavigation(action.path)}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        backgroundColor: `${action.color}15`,
                        color: action.color,
                        mb: 2,
                        mx: "auto",
                        width: "fit-content",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.cloneElement(action.icon, {
                        sx: { fontSize: 36 },
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        mb: 1,
                        color: "text.primary",
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.5,
                      }}
                    >
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
