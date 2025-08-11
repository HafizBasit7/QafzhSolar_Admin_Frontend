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
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import {
  useProducts,
  useProductDetails,
  useUpdateProductStatus,
} from "../hooks/useProduct";

const PRODUCTS_PER_PAGE = 6;

const ProductApprovals = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [page, setPage] = useState(1);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionModalReason, setRejectionModalReason] = useState("");

  // Fetch products using React Query
  const { data: productsData, isLoading, error, refetch } = useProducts();
  const updateProductStatusMutation = useUpdateProductStatus();

  // Get product details when a product is selected
  const { data: productDetails, isLoading: detailsLoading } = useProductDetails(
    selectedProduct?._id
  );

  // Filter products to show only pending ones
  const allProducts = productsData || [];
  const pendingProducts = allProducts.filter(
    (product) => product.status === "pending"
  );
  const totalPages = Math.ceil(pendingProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = pendingProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [pendingProducts.length]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setOpenDialog(true);
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setSelectedImageIndex((prev) =>
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleApprove = async (productId) => {
    try {
      await updateProductStatusMutation.mutateAsync({
        productId,
        updateData: { status: "approved" },
      });
      setModalTitle(t("products.approvalSuccess"));
      setModalMessage(t("products.approvalSuccessMessage"));
      setShowSuccessModal(true);
      refetch(); // Refetch the products list
    } catch (error) {
      console.error("Failed to approve product:", error);
      setModalTitle(t("products.approvalError"));
      setModalMessage(t("products.approvalErrorMessage"));
      setShowErrorModal(true);
    }
  };

  const handleReject = async (productId) => {
    if (!rejectionModalReason.trim()) {
      setModalTitle(t("products.provideRejectionReason"));
      setModalMessage(t("products.provideRejectionReasonMessage"));
      setShowErrorModal(true);
      return;
    }

    try {
      await updateProductStatusMutation.mutateAsync({
        productId,
        updateData: {
          status: "rejected",
          rejectionReason: rejectionModalReason,
        },
      });
      setRejectionModalReason("");
      setOpenDialog(false);
      setShowRejectionModal(false);
      setModalTitle(t("products.rejectionSuccess"));
      setModalMessage(t("products.rejectionSuccessMessage"));
      setShowSuccessModal(true);
      refetch(); // Refetch the products list
    } catch (error) {
      console.error("Failed to reject product:", error);
      setModalTitle(t("products.rejectionError"));
      setModalMessage(t("products.rejectionErrorMessage"));
      setShowErrorModal(true);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("products.loading")}
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          {t("products.errorLoading")}: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
        <Card
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          mb: 4,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ py: 4 }}>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t("products.title")}
      </Typography>
       <Typography
                variant="h6"
                sx={{ opacity: 0.9, fontWeight: 300, maxWidth: 600 }}
              >
        {t("products.subtitle")}
      </Typography>
      </CardContent>
      </Card>

      {/* No Products Message */}
      {pendingProducts.length === 0 && (
        <Card
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: 4,
            border: "2px dashed #dee2e6",
            p: 6,
            textAlign: "center",
            maxWidth: 600,
            mx: "auto",
            mt: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "4rem",
              mb: 2,
              opacity: 0.7,
            }}
          >
            {t("products.noProducts.icon")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {t("products.noProducts.title")}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3, fontWeight: 400 }}
          >
            {t("products.noProducts.subtitle")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.6,
              opacity: 0.8,
            }}
          >
            {t("products.noProducts.description")}
          </Typography>
        </Card>
      )}

      {/* Products Grid */}
      {pendingProducts.length > 0 && (
        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product._id}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent>
                {/* Product image */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {product.images?.[0] && (
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
                    />
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.contactInfo?.phone || product.phone}
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
                  <strong>{t("products.type")}:</strong> {product.type}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.condition")}:</strong>{" "}
                  {product.condition}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.location")}:</strong>{" "}
                  {product.governorate}, {product.city}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.price")}:</strong> {product.price}{" "}
                  {product.currency}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.submitted")}:</strong>{" "}
                  {formatDate(product.createdAt)}
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
                    onClick={() => handleApprove(product._id)}
                    size="small"
                    disabled={updateProductStatusMutation.isPending}
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
                    {updateProductStatusMutation.isPending ? (
                      <CircularProgress size={16} />
                    ) : (
                      t("products.approve")
                    )}
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
      )}

      {pendingProducts.length > 0 && totalPages > 1 && (
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
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <>
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
                    />
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
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
                        {selectedImageIndex + 1} /{" "}
                        {selectedProduct.images.length}
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
                              alt={`${selectedProduct.name} - Image ${
                                index + 1
                              }`}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  </>
                ) : null}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.phone")}:</strong>{" "}
                  {selectedProduct.contactInfo?.phone || selectedProduct.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.whatsapp")}:</strong>{" "}
                  {selectedProduct.contactInfo?.whatsapp ||
                    selectedProduct.whatsappPhone}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.type")}:</strong> {selectedProduct.type}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.condition")}:</strong>{" "}
                  {selectedProduct.condition}
                </Typography>
                {/* <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.brand")}:</strong>{" "}
                  {selectedProduct.brand || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.model")}:</strong>{" "}
                  {selectedProduct.model || "N/A"}
                </Typography> */}
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.location")}:</strong>{" "}
                  {selectedProduct.governorate}, {selectedProduct.city}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.price")}:</strong>{" "}
                  {selectedProduct.price} {selectedProduct.currency}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.negotiable")}:</strong>{" "}
                  {selectedProduct.isNegotiable ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>{t("products.submitted")}:</strong>{" "}
                  {formatDate(selectedProduct.createdAt)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>{t("products.description")}:</strong>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {selectedProduct.description || "No description provided"}
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
              handleApprove(selectedProduct?._id);
              setOpenDialog(false);
            }}
            disabled={updateProductStatusMutation.isPending}
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
            {updateProductStatusMutation.isPending ? (
              <CircularProgress size={16} />
            ) : (
              t("products.approve")
            )}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={isRTL ? undefined : <RejectIcon />}
            endIcon={isRTL ? <RejectIcon /> : undefined}
            onClick={() => {
              setShowRejectionModal(true);
            }}
            disabled={updateProductStatusMutation.isPending}
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

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessModal(false)}>
            {t("engineers.ok")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <Dialog
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorModal(false)}>
            {t("engineers.ok")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog
        open={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle>{t("products.rejectionReasonPrompt")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectionModalReason}
            onChange={(e) => setRejectionModalReason(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectionModal(false)}>
            {t("engineers.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleReject(selectedProduct?._id);
              setShowRejectionModal(false);
            }}
            disabled={updateProductStatusMutation.isPending}
          >
            {t("products.reject")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductApprovals;
