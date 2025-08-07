import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useShops,
  useAddShop,
  useUpdateShop,
  useDeleteShop,
} from "../hooks/useShop";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  DialogContentText,
  OutlinedInput,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { uploadImage } from "../../utils/Upload/Upload";
import locationsData from "../data/locations.json";
import servicesData from "../data/services.json";
import productCategoriesData from "../data/productCategories.json";
import brandsData from "../data/brands.json";
import workingDaysData from "../data/workingDays.json";

const ManageShops = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // API hooks
  const { data: shops = [], isLoading, error, refetch } = useShops();
  const addShopMutation = useAddShop();
  const updateShopMutation = useUpdateShop();
  const deleteShopMutation = useDeleteShop();

  // State for dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [shopToDelete, setShopToDelete] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsappPhone: "",
    email: "",
    website: "",
    governorate: "",
    address: "",
    description: "",
    location: {
      latitude: 0,
      longitude: 0,
    },
    services: [],
    productCategories: [],
    brands: [],
    establishedYear: "",
    licenseNumber: "",
    workingHours: {
      openTime: "09:00",
      closeTime: "17:00",
      workingDays: [],
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    logoUrl: "",
    images: [],
    notes: "",
    isVerified: false,
  });

  // Image upload states
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleOpenDialog = (shop = null) => {
    if (shop) {
      setEditingShop(shop);
      setFormData({
        name: shop.name || "",
        phone: shop.phone || "",
        whatsappPhone: shop.whatsappPhone || "",
        email: shop.email || "",
        website: shop.website || "",
        governorate: shop.governorate || "",
        address: shop.address || "",
        description: shop.description || "",
        location: shop.location || { latitude: 0, longitude: 0 },
        services: shop.services || [],
        productCategories: shop.productCategories || [],
        brands: shop.brands || [],
        establishedYear: shop.establishedYear?.toString() || "",
        licenseNumber: shop.licenseNumber || "",
        workingHours: shop.workingHours || {
          openTime: "09:00",
          closeTime: "17:00",
          workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        },
        socialMedia: shop.socialMedia || {
          facebook: "",
          instagram: "",
          twitter: "",
        },
        logoUrl: shop.logoUrl || "",
        images: shop.images || [],
        notes: shop.notes || "",
        isVerified: shop.isVerified || false,
      });
    } else {
      setEditingShop(null);
      setFormData({
        name: "",
        phone: "",
        whatsappPhone: "",
        email: "",
        website: "",
        governorate: "",
        address: "",
        description: "",
        location: { latitude: 0, longitude: 0 },
        services: [],
        productCategories: [],
        brands: [],
        establishedYear: "",
        licenseNumber: "",
        workingHours: {
          openTime: "09:00",
          closeTime: "17:00",
          workingDays: [],
        },
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: "",
        },
        logoUrl: "",
        images: [],
        notes: "",
        isVerified: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingShop(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = {
      name: t("shops.name"),
      email: t("shops.email"),
      phone: t("shops.phone"),
      governorate: t("shops.governorate"),
    };

    // const missingFields = [];
    // for (const [field, label] of Object.entries(requiredFields)) {
    //   if (!formData[field] || formData[field].toString().trim() === "") {
    //     missingFields.push(label);
    //   }
    // }

    // if (missingFields.length > 0) {
    //   setModalTitle(t("shops.fillRequiredFields"));
    //   setModalMessage(
    //     `${t("shops.fillRequiredFieldsMessage")} ${missingFields.join(", ")}`
    //   );
    //   setShowErrorModal(true);
    //   return;
    // }

    // Validate website URL format if provided
    // if (formData.website && !isValidUrl(formData.website)) {
    //   setModalTitle(t("shops.validationError"));
    //   setModalMessage(t("shops.invalidWebsiteMessage"));
    //   setShowErrorModal(true);
    //   return;
    // }

    // Validate social media URLs if provided
    // const socialMediaFields = ["facebook", "instagram", "twitter"];
    // for (const field of socialMediaFields) {
    //   if (
    //     formData.socialMedia[field] &&
    //     !isValidUrl(formData.socialMedia[field])
    //   ) {
    //     setModalTitle(t("shops.validationError"));
    //     setModalMessage(
    //       t(
    //         `shops.invalid${
    //           field.charAt(0).toUpperCase() + field.slice(1)
    //         }Message`
    //       )
    //     );
    //     setShowErrorModal(true);
    //     return;
    //   }
    // }

    // Validate established year
    // if (formData.establishedYear) {
    //   const year = parseInt(formData.establishedYear);
    //   if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
    //     setModalTitle(t("shops.validationError"));
    //     setModalMessage(t("shops.invalidYearMessage"));
    //     setShowErrorModal(true);
    //     return;
    //   }
    // }

    try {
      if (editingShop) {
        await updateShopMutation.mutateAsync({
          shopId: editingShop._id,
          shopData: formData,
        });
        setModalTitle(t("shops.updateSuccess"));
        setModalMessage(t("shops.updateSuccessMessage"));
        setShowSuccessModal(true);
      } else {
        await addShopMutation.mutateAsync(formData);
        setModalTitle(t("shops.addSuccess"));
        setModalMessage(t("shops.addSuccessMessage"));
        setShowSuccessModal(true);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save shop:", error);
      setModalTitle(t("shops.saveError"));
      setModalMessage(t("shops.saveErrorMessage"));
      setShowErrorModal(true);
    }
  };

  const handleDelete = async (shopId) => {
    setShopToDelete(shopId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteShopMutation.mutateAsync(shopToDelete);
      setModalTitle(t("shops.deleteSuccess"));
      setModalMessage(t("shops.deleteSuccessMessage"));
      setShowSuccessModal(true);
      setShowDeleteModal(false);
      setShopToDelete(null);
    } catch (error) {
      console.error("Failed to delete shop:", error);
      setModalTitle(t("shops.deleteError"));
      setModalMessage(t("shops.deleteErrorMessage"));
      setShowErrorModal(true);
      setShowDeleteModal(false);
      setShopToDelete(null);
    }
  };

  const handleViewDetails = (shop) => {
    setSelectedShop(shop);
    setOpenDetailsDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

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
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("shops.errorLoading")}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t("shops.title")}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t("shops.subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={!isRTL ? <AddIcon /> : null}
          endIcon={isRTL ? <AddIcon /> : null}
          sx={{
            background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #45a049 0%, #3d8b40 100%)",
            },
          }}
          onClick={() => handleOpenDialog()}
        >
          {t("shops.addShop")}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("shops.shop")}</TableCell>
              <TableCell>{t("shops.contact")}</TableCell>
              <TableCell>{t("shops.location")}</TableCell>
              <TableCell>{t("shops.services")}</TableCell>
              <TableCell>{t("shops.status")}</TableCell>
              <TableCell>{t("shops.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#4caf50" }} src={shop.logoUrl}>
                      <StoreIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {shop.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {shop.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <PhoneIcon fontSize="small" />
                      {shop.phone}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <EmailIcon fontSize="small" />
                      {shop.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocationIcon fontSize="small" />
                    {shop.governorate}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {shop.address}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {shop.services?.slice(0, 3).map((service, index) => (
                      <Chip
                        key={index}
                        label={service}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ))}
                    {shop.services?.length > 3 && (
                      <Chip
                        label={`+${shop.services.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`shops.status.${shop.verificationStatus}`)}
                    color={getStatusColor(shop.verificationStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title={t("shops.viewDetails")}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(shop)}
                        sx={{ color: "#1976d2" }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("shops.edit")}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(shop)}
                        sx={{ color: "#1976d2" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("shops.delete")}>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(shop._id)}
                        sx={{ color: "#d32f2f" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Shop Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("shops.shopDetails")}</DialogTitle>
        <DialogContent>
          {selectedShop && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    sx={{ width: 80, height: 80, bgcolor: "#4caf50" }}
                    src={selectedShop.logoUrl}
                  >
                    <StoreIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedShop.name}
                    </Typography>
                    {selectedShop.description && (
                      <Typography variant="body2" color="textSecondary">
                        {selectedShop.description}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.contactInfo")}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                    {selectedShop.phone}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <EmailIcon fontSize="small" />
                    {selectedShop.email}
                  </Typography>
                  {selectedShop.website && (
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <WebsiteIcon fontSize="small" />
                      {selectedShop.website}
                    </Typography>
                  )}
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.location")}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LocationIcon fontSize="small" />
                    {selectedShop.governorate}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedShop.address}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {t("shops.services")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {selectedShop.services?.map((service, index) => (
                    <Chip key={index} label={service} size="small" />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.productCategories")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {selectedShop.productCategories?.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.brands")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {selectedShop.brands?.map((brand, index) => (
                    <Chip
                      key={index}
                      label={brand}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.workingHours")}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>{t("shops.openTime")}:</strong>{" "}
                    {selectedShop.workingHours?.openTime}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("shops.closeTime")}:</strong>{" "}
                    {selectedShop.workingHours?.closeTime}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("shops.workingDays")}:</strong>{" "}
                    {selectedShop.workingHours?.workingDays?.join(", ")}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.socialMedia")}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {selectedShop.socialMedia?.facebook && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Facebook:</strong>{" "}
                      {selectedShop.socialMedia.facebook}
                    </Typography>
                  )}
                  {selectedShop.socialMedia?.instagram && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Instagram:</strong>{" "}
                      {selectedShop.socialMedia.instagram}
                    </Typography>
                  )}
                  {selectedShop.socialMedia?.twitter && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Twitter:</strong>{" "}
                      {selectedShop.socialMedia.twitter}
                    </Typography>
                  )}
                </Box>

                <Typography variant="h6" gutterBottom>
                  {t("shops.additionalInfo")}
                </Typography>
                <Box>
                  <Typography variant="body2">
                    <strong>{t("shops.establishedYear")}:</strong>{" "}
                    {selectedShop.establishedYear}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("shops.licenseNumber")}:</strong>{" "}
                    {selectedShop.licenseNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("shops.createdAt")}:</strong>{" "}
                    {formatDate(selectedShop.createdAt)}
                  </Typography>
                  {selectedShop.notes && (
                    <Typography variant="body2">
                      <strong>{t("shops.notes")}:</strong> {selectedShop.notes}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>
            {t("shops.close")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingShop ? t("shops.editShop") : t("shops.addNewShop")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {t("shops.basicInformation")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.name")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.email")}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.phone")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.whatsapp")}
                value={formData.whatsappPhone}
                onChange={(e) =>
                  handleInputChange("whatsappPhone", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.website")}
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.licenseNumber")}
                value={formData.licenseNumber}
                onChange={(e) =>
                  handleInputChange("licenseNumber", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t("shops.governorate")}</InputLabel>
                <Select
                  value={formData.governorate}
                  label={t("shops.governorate")}
                  onChange={(e) =>
                    handleInputChange("governorate", e.target.value)
                  }
                >
                  {locationsData.governorates.map((governorate) => (
                    <MenuItem key={governorate} value={governorate}>
                      {governorate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.establishedYear")}
                type="number"
                value={formData.establishedYear}
                onChange={(e) =>
                  handleInputChange("establishedYear", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("shops.address")}
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("shops.description")}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={3}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.location")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.latitude")}
                type="number"
                value={formData.location.latitude}
                onChange={(e) =>
                  handleInputChange("location", {
                    ...formData.location,
                    latitude: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.longitude")}
                type="number"
                value={formData.location.longitude}
                onChange={(e) =>
                  handleInputChange("location", {
                    ...formData.location,
                    longitude: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>

            {/* Services */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.services")}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t("shops.selectServices")}</InputLabel>
                <Select
                  multiple
                  value={formData.services}
                  label={t("shops.selectServices")}
                  input={<OutlinedInput label={t("shops.selectServices")} />}
                  onChange={(e) =>
                    handleInputChange("services", e.target.value)
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {servicesData.services.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Product Categories */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.productCategories")}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t("shops.selectProductCategories")}</InputLabel>
                <Select
                  multiple
                  value={formData.productCategories}
                  label={t("shops.selectProductCategories")}
                  input={
                    <OutlinedInput label={t("shops.selectProductCategories")} />
                  }
                  onChange={(e) =>
                    handleInputChange("productCategories", e.target.value)
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {productCategoriesData.categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brands */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.brands")}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t("shops.selectBrands")}</InputLabel>
                <Select
                  multiple
                  value={formData.brands}
                  label={t("shops.selectBrands")}
                  input={<OutlinedInput label={t("shops.selectBrands")} />}
                  onChange={(e) => handleInputChange("brands", e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {brandsData.brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Working Hours */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.workingHours")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.openTime")}
                type="time"
                value={formData.workingHours.openTime}
                onChange={(e) =>
                  handleInputChange("workingHours", {
                    ...formData.workingHours,
                    openTime: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.closeTime")}
                type="time"
                value={formData.workingHours.closeTime}
                onChange={(e) =>
                  handleInputChange("workingHours", {
                    ...formData.workingHours,
                    closeTime: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t("shops.selectWorkingDays")}</InputLabel>
                <Select
                  multiple
                  value={formData.workingHours.workingDays}
                  label={t("shops.selectWorkingDays")}
                  input={<OutlinedInput label={t("shops.selectWorkingDays")} />}
                  onChange={(e) =>
                    handleInputChange("workingHours", {
                      ...formData.workingHours,
                      workingDays: e.target.value,
                    })
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {workingDaysData.days.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Social Media */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.socialMedia")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("shops.facebook")}
                value={formData.socialMedia.facebook}
                onChange={(e) =>
                  handleInputChange("socialMedia", {
                    ...formData.socialMedia,
                    facebook: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("shops.instagram")}
                value={formData.socialMedia.instagram}
                onChange={(e) =>
                  handleInputChange("socialMedia", {
                    ...formData.socialMedia,
                    instagram: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("shops.twitter")}
                value={formData.socialMedia.twitter}
                onChange={(e) =>
                  handleInputChange("socialMedia", {
                    ...formData.socialMedia,
                    twitter: e.target.value,
                  })
                }
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.images")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t("shops.logo")}
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="logo-upload"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploadingLogo(true);
                      try {
                        const uploadedUrl = await uploadImage(file);
                        handleInputChange("logoUrl", uploadedUrl);
                      } catch (error) {
                        console.error("Error uploading logo:", error);
                        setModalTitle(t("shops.uploadError"));
                        setModalMessage(t("shops.logoUploadErrorMessage"));
                        setShowErrorModal(true);
                      } finally {
                        setUploadingLogo(false);
                      }
                    }
                  }}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={
                      uploadingLogo ? (
                        <CircularProgress size={20} />
                      ) : (
                        <UploadIcon />
                      )
                    }
                    disabled={uploadingLogo}
                    fullWidth
                  >
                    {uploadingLogo
                      ? t("shops.uploading")
                      : t("shops.uploadLogo")}
                  </Button>
                </label>
                {formData.logoUrl && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {t("shops.shopImages")}
                </Typography>
                <input
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  id="images-upload"
                  type="file"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      setUploadingImages(true);
                      try {
                        const uploadPromises = files.map((file) =>
                          uploadImage(file)
                        );
                        const uploadedUrls = await Promise.all(uploadPromises);
                        handleInputChange("images", [
                          ...formData.images,
                          ...uploadedUrls,
                        ]);
                      } catch (error) {
                        console.error("Error uploading images:", error);
                        setModalTitle(t("shops.uploadError"));
                        setModalMessage(t("shops.imagesUploadErrorMessage"));
                        setShowErrorModal(true);
                      } finally {
                        setUploadingImages(false);
                      }
                    }
                  }}
                />
                <label htmlFor="images-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={
                      uploadingImages ? (
                        <CircularProgress size={20} />
                      ) : (
                        <UploadIcon />
                      )
                    }
                    disabled={uploadingImages}
                    fullWidth
                  >
                    {uploadingImages
                      ? t("shops.uploading")
                      : t("shops.uploadImages")}
                  </Button>
                </label>
                {formData.images.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {formData.images.map((image, index) => (
                      <Box key={index} sx={{ position: "relative" }}>
                        <img
                          src={image}
                          alt={`Shop image ${index + 1}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            backgroundColor: "error.main",
                            color: "white",
                            "&:hover": { backgroundColor: "error.dark" },
                          }}
                          onClick={() =>
                            handleInputChange(
                              "images",
                              formData.images.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                {t("shops.additionalInfo")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("shops.notes")}
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("shops.cancel")}</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={addShopMutation.isPending || updateShopMutation.isPending}
          >
            {addShopMutation.isPending || updateShopMutation.isPending ? (
              <CircularProgress size={20} />
            ) : editingShop ? (
              t("shops.updateShop")
            ) : (
              t("shops.addShop")
            )}
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
            {t("shops.ok")}
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
            {t("shops.ok")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
        <DialogTitle>{t("shops.deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("shops.deleteConfirmMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>
            {t("shops.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleteShopMutation.isPending}
          >
            {deleteShopMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              t("shops.delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageShops;
