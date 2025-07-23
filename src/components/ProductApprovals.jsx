import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  Container,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";

const PRODUCTS_PER_PAGE = 6;

const ProductApprovals = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [page, setPage] = useState(1);

  // Mock data for pending products with multiple images
  const [pendingProducts] = useState([
    {
      id: 1,
      name: "Solar Panel 300W",
      user: "Ahmed Hassan",
      userEmail: "ahmed@example.com",
      price: 2500,
      description: "High-efficiency solar panel with 300W output",
      images: [
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      ],
      category: "Solar Panels",
      location: "Riyadh",
      submittedDate: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      name: "Battery Storage System",
      user: "Sarah Al-Mansouri",
      userEmail: "sarah@example.com",
      price: 1800,
      description: "10kWh lithium battery storage system",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
      ],
      category: "Batteries",
      location: "Jeddah",
      submittedDate: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      name: "Solar Inverter 5kW",
      user: "Mohammed Al-Rashid",
      userEmail: "mohammed@example.com",
      price: 3200,
      description: "Grid-tie solar inverter with monitoring",
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      ],
      category: "Inverters",
      location: "Dammam",
      submittedDate: "2024-01-13",
      status: "pending",
    },
    {
      id: 4,
      name: "Solar Mounting System",
      user: "Fatima Al-Zahra",
      userEmail: "fatima@example.com",
      price: 1200,
      description: "Aluminum mounting system for rooftop installation",
      images: [
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
      ],
      category: "Mounting Systems",
      location: "Abha",
      submittedDate: "2024-01-12",
      status: "pending",
    },
    {
      id: 5,
      name: "Solar Charge Controller",
      user: "Omar Al-Sayed",
      userEmail: "omar@example.com",
      price: 450,
      description: "MPPT charge controller for solar systems",
      images: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop",
      ],
      category: "Controllers",
      location: "Tabuk",
      submittedDate: "2024-01-11",
      status: "pending",
    },
    {
      id: 6,
      name: "Solar Cable Set",
      user: "Layla Al-Mahmoud",
      userEmail: "layla@example.com",
      price: 350,
      description: "High-quality DC cables for solar installations",
      images: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=400&h=300&fit=crop",
      ],
      category: "Accessories",
      location: "Jizan",
      submittedDate: "2024-01-10",
      status: "pending",
    },
    {
      id: 7,
      name: "Hybrid Solar System Kit",
      user: "Yousef Al-Qahtani",
      userEmail: "yousef@example.com",
      price: 5400,
      description: "Complete hybrid solar system kit for home use.",
      images: [
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      ],
      category: "Kits",
      location: "Makkah",
      submittedDate: "2024-01-09",
      status: "pending",
    },
    {
      id: 8,
      name: "Off-grid Inverter",
      user: "Huda Al-Farsi",
      userEmail: "huda@example.com",
      price: 4100,
      description: "Off-grid inverter for remote solar installations.",
      images: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      ],
      category: "Inverters",
      location: "Al Khobar",
      submittedDate: "2024-01-08",
      status: "pending",
    },
    {
      id: 9,
      name: "Flexible Solar Panel",
      user: "Salem Al-Mutairi",
      userEmail: "salem@example.com",
      price: 2100,
      description: "Lightweight flexible solar panel for portable use.",
      images: [
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      ],
      category: "Solar Panels",
      location: "Yanbu",
      submittedDate: "2024-01-07",
      status: "pending",
    },
    {
      id: 10,
      name: "Solar Water Pump",
      user: "Mona Al-Suwailem",
      userEmail: "mona@example.com",
      price: 3200,
      description: "Solar-powered water pump for agricultural use.",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop",
      ],
      category: "Pumps",
      location: "Al Ahsa",
      submittedDate: "2024-01-06",
      status: "pending",
    },
  ]);

  useEffect(() => {
    setPage(1);
  }, [pendingProducts.length]);

  const totalPages = Math.ceil(pendingProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = pendingProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setOpenDialog(true);
  };

  const handleNextImage = () => {
    if (selectedProduct) {
      setSelectedImageIndex((prev) =>
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleApprove = (productId) => {
    // Here you would typically make an API call to approve the product
    console.log("Approving product:", productId);
    // Update the product status in your state/database
    alert(t("products.approvalSuccess"));
  };

  const handleReject = (productId) => {
    if (!rejectionReason.trim()) {
      alert(t("products.provideRejectionReason"));
      return;
    }
    // Here you would typically make an API call to reject the product
    console.log("Rejecting product:", productId, "Reason:", rejectionReason);
    setRejectionReason("");
    setOpenDialog(false);
    alert(t("products.rejectionSuccess"));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t("products.title")}
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        {t("products.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product.id}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent>
                {/* Product image without multiple images indicator */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      objectFit: "cover",
                      mr: 2,
                      border: "2px solid rgba(0, 0, 0, 0.1)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80?text=No+Image";
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      by {product.user}
                    </Typography>
                    <Chip
                      label={t(`products.status.${product.status}`)}
                      color={getStatusColor(product.status)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.category")}:</strong> {product.category}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.location")}:</strong> {product.location}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.price")}:</strong> SAR {product.price}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.submitted")}:</strong>{" "}
                  {product.submittedDate}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <Tooltip title={t("products.viewDetails")}>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewProduct(product)}
                      sx={{
                        transform: isRTL ? "scaleX(-1)" : "none",
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={isRTL ? undefined : <ApproveIcon />}
                    endIcon={isRTL ? <ApproveIcon /> : undefined}
                    onClick={() => handleApprove(product.id)}
                    size="small"
                    sx={{
                      px: 2,
                      py: 1,
                      "& .MuiButton-startIcon": {
                        mr: isRTL ? 0 : 1,
                        ml: isRTL ? 1 : 0,
                      },
                      "& .MuiButton-endIcon": {
                        ml: isRTL ? 0 : 1,
                        mr: isRTL ? 1 : 0,
                      },
                    }}
                  >
                    {t("products.approve")}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={isRTL ? undefined : <RejectIcon />}
                    endIcon={isRTL ? <RejectIcon /> : undefined}
                    onClick={() => handleViewProduct(product)}
                    size="small"
                    sx={{
                      px: 2,
                      py: 1,
                      "& .MuiButton-startIcon": {
                        mr: isRTL ? 0 : 1,
                        ml: isRTL ? 1 : 0,
                      },
                      "& .MuiButton-endIcon": {
                        ml: isRTL ? 0 : 1,
                        mr: isRTL ? 1 : 0,
                      },
                    }}
                  >
                    {t("products.reject")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Product Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle>
          {t("products.productDetails")} - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={selectedProduct.images[selectedImageIndex]}
                  alt={selectedProduct.name}
                  sx={{
                    width: "100%",
                    height: 300,
                    borderRadius: 3,
                    objectFit: "cover",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <IconButton
                    onClick={isRTL ? handleNextImage : handlePrevImage}
                    sx={{ mr: 1 }}
                  >
                    {isRTL ? <NextIcon /> : <PrevIcon />}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ alignSelf: "center", mx: 2 }}
                  >
                    {selectedImageIndex + 1} / {selectedProduct.images.length}
                  </Typography>
                  <IconButton
                    onClick={isRTL ? handlePrevImage : handleNextImage}
                  >
                    {isRTL ? <PrevIcon /> : <NextIcon />}
                  </IconButton>
                </Box>

                {/* Image Thumbnails */}
                <Box sx={{ mt: 2 }}>
                  <ImageList
                    sx={{ width: "100%", height: 80 }}
                    cols={3}
                    rowHeight={80}
                  >
                    {selectedProduct.images.map((image, index) => (
                      <ImageListItem
                        key={index}
                        sx={{
                          cursor: "pointer",
                          border:
                            index === selectedImageIndex
                              ? "2px solid #00cc00"
                              : "2px solid transparent",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                        onClick={() => handleImageClick(index)}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`${selectedProduct.name} - Image ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.seller")}:</strong>{" "}
                  {selectedProduct.user}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.email")}:</strong>{" "}
                  {selectedProduct.userEmail}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.category")}:</strong>{" "}
                  {selectedProduct.category}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.location")}:</strong>{" "}
                  {selectedProduct.location}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.price")}:</strong> SAR{" "}
                  {selectedProduct.price}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.submitted")}:</strong>{" "}
                  {selectedProduct.submittedDate}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>{t("products.description")}:</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {selectedProduct.description}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t("engineers.cancel")}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={isRTL ? undefined : <ApproveIcon />}
            endIcon={isRTL ? <ApproveIcon /> : undefined}
            onClick={() => {
              handleApprove(selectedProduct?.id);
              setOpenDialog(false);
            }}
            sx={{
              px: 3,
              py: 1.5,
              "& .MuiButton-startIcon": {
                mr: isRTL ? 0 : 1.5,
                ml: isRTL ? 1.5 : 0,
              },
              "& .MuiButton-endIcon": {
                ml: isRTL ? 0 : 1.5,
                mr: isRTL ? 1.5 : 0,
              },
            }}
          >
            {t("products.approve")}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={isRTL ? undefined : <RejectIcon />}
            endIcon={isRTL ? <RejectIcon /> : undefined}
            onClick={() => {
              const reason = prompt(t("products.rejectionReasonPrompt"));
              if (reason) {
                setRejectionReason(reason);
                handleReject(selectedProduct?.id);
              }
            }}
            sx={{
              px: 3,
              py: 1.5,
              "& .MuiButton-startIcon": {
                mr: isRTL ? 0 : 1.5,
                ml: isRTL ? 1.5 : 0,
              },
              "& .MuiButton-endIcon": {
                ml: isRTL ? 0 : 1.5,
                mr: isRTL ? 1.5 : 0,
              },
            }}
          >
            {t("products.reject")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductApprovals;
