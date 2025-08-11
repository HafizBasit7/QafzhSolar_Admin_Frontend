import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  FormHelperText,
  Divider,
  Paper,
  Input,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  ContactPhone as ContactPhoneIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteImageIcon,
} from "@mui/icons-material";
import {
  useEngineers,
  useAddEngineer,
  useUpdateEngineer,
  useDeleteEngineer,
} from "../hooks/useEngineer";
import locationsData from "../data/locations.json";
import servicesData from "../data/services.json";
import specializationsData from "../data/specializations.json";
import { uploadImage } from "../../utils/Upload/Upload.js";

const ManageEngineers = () => {
  const { t, i18n } = useTranslation();
  const { data: engineersData, isLoading, error } = useEngineers();
  const addEngineerMutation = useAddEngineer();
  const updateEngineerMutation = useUpdateEngineer();
  const deleteEngineerMutation = useDeleteEngineer();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsappPhone: "",
    email: "",
    services: [],
    specializations: [],
    governorate: "",
    city: "",
    address: "",
    experience: {
      years: "",
    },
    certifications: [],
    profileImageUrl: "",
    portfolioImages: [],
    availability: {
      status: "Available",
      workingHours: {
        start: "08:00",
        end: "17:00",
      },
      workingDays: [],
    },
    pricing: {
      hourlyRate: "",
      currency: "USD",
      minimumCharge: "",
    },
  });

  const [errors, setErrors] = useState({});

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [engineerToDelete, setEngineerToDelete] = useState(null);

  // Get data from JSON files
  const governorates = locationsData.governorates;
  const services = servicesData.services;
  const specializations = specializationsData.specializations;

  const workingDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currencies = ["USD", "YER", "SAR"];

  // Image upload handlers
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingProfile(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, profileImageUrl: imageUrl }));
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      // You might want to show an error message to the user here
    } finally {
      setUploadingProfile(false);
    }
  };

  const handlePortfolioImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingPortfolio(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        portfolioImages: [...prev.portfolioImages, imageUrl],
      }));
    } catch (error) {
      console.error("Failed to upload portfolio image:", error);
      // You might want to show an error message to the user here
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const removePortfolioImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter((_, i) => i !== index),
    }));
  };

  const handleOpenDialog = (engineer = null) => {
    if (engineer) {
      setEditingEngineer(engineer);
      setFormData(engineer);
    } else {
      setEditingEngineer(null);
      setFormData({
        name: "",
        phone: "",
        whatsappPhone: "",
        email: "",
        services: [],
        specializations: [],
        governorate: "",
        city: "",
        address: "",
        experience: {
          years: "",
        },
        certifications: [],
        profileImageUrl: "",
        portfolioImages: [],
        availability: {
          status: "Available",
          workingHours: {
            start: "08:00",
            end: "17:00",
          },
          workingDays: [],
        },
        pricing: {
          hourlyRate: "",
          currency: "USD",
          minimumCharge: "",
        },
      });
    }
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEngineer(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.governorate)
      newErrors.governorate = "Governorate is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.experience.years)
      newErrors.experienceYears = "Experience years is required";
    if (!formData.pricing.hourlyRate)
      newErrors.hourlyRate = "Hourly rate is required";
    if (!formData.pricing.minimumCharge)
      newErrors.minimumCharge = "Minimum charge is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingEngineer) {
        await updateEngineerMutation.mutateAsync({
          engineerId: editingEngineer._id,
          engineerData: formData,
        });
        setModalTitle(t("engineers.updateSuccess"));
        setModalMessage(t("engineers.updateSuccessMessage"));
        setShowSuccessModal(true);
      } else {
        await addEngineerMutation.mutateAsync(formData);
        setModalTitle(t("engineers.addSuccess"));
        setModalMessage(t("engineers.addSuccessMessage"));
        setShowSuccessModal(true);
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save engineer:", error);
      setModalTitle(t("engineers.saveError"));
      setModalMessage(t("engineers.saveErrorMessage"));
      setShowErrorModal(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSpecializationToggle = (specialization) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const handleWorkingDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        workingDays: prev.availability.workingDays.includes(day)
          ? prev.availability.workingDays.filter((d) => d !== day)
          : [...prev.availability.workingDays, day],
      },
    }));
  };

  const handleDelete = async (engineerId) => {
    setEngineerToDelete(engineerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEngineerMutation.mutateAsync(engineerToDelete);
      setModalTitle(t("engineers.deleteSuccess"));
      setModalMessage(t("engineers.deleteSuccessMessage"));
      setShowSuccessModal(true);
      setShowDeleteModal(false);
      setEngineerToDelete(null);
    } catch (error) {
      console.error("Failed to delete engineer:", error);
      setModalTitle(t("engineers.deleteError"));
      setModalMessage(t("engineers.deleteErrorMessage"));
      setShowErrorModal(true);
      setShowDeleteModal(false);
      setEngineerToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
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
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || "Failed to load engineers"}
        </Alert>
      </Container>
    );
  }

  const engineers = engineersData?.data || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
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
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography  variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                  background: "linear-gradient(45deg, #fff 30%, #e3f2fd 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
          {t("engineers.title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            },
            transition: "all 0.3s ease",
          }}
        
        >
          {t("engineers.addEngineer")}
        </Button>
      </Box>
      </CardContent>
      </Card>

      {/* Engineers Grid */}
      <Grid container spacing={3}>
        {engineers.map((engineer) => (
          <Grid item xs={12} sm={6} lg={4} key={engineer._id}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={engineer.profileImageUrl}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    {engineer.name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {engineer.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {engineer.experience?.years} {t("engineers.years")}{" "}
                      {t("engineers.experience")}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(engineer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(engineer._id)}
                      disabled={deleteEngineerMutation.isPending}
                    >
                      {deleteEngineerMutation.isPending ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* Contact Info */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">{engineer.phone}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">{engineer.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationIcon
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {engineer.city}, {engineer.governorate}
                    </Typography>
                  </Box>
                </Box>

                {/* Services */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    {t("engineers.services")}:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {engineer.services?.slice(0, 3).map((service) => (
                      <Chip
                        key={service}
                        label={service}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                    {engineer.services?.length > 3 && (
                      <Chip
                        label={`+${engineer.services.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                {/* Status */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={
                      engineer.isActive
                        ? t("engineers.active")
                        : t("common.inactive")
                    }
                    color={engineer.isActive ? "success" : "error"}
                    size="small"
                  />
                  {engineer.isVerified && (
                    <Chip
                      icon={<StarIcon />}
                      label={t("engineers.verified")}
                      color="warning"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Engineer Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {editingEngineer
              ? t("engineers.editEngineer")
              : t("engineers.addEngineer")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {t("engineers.basicInformation")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.name")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.email")}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.phone")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.whatsappPhone")}
                value={formData.whatsappPhone}
                onChange={(e) =>
                  handleInputChange("whatsappPhone", e.target.value)
                }
              />
            </Grid>

            {/* Profile Image Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("engineers.profileImage")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={formData.profileImageUrl}
                  sx={{ width: 80, height: 80 }}
                >
                  {formData.name?.charAt(0) || "?"}
                </Avatar>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleProfileImageUpload}
                    disabled={uploadingProfile}
                  />
                  <label htmlFor="profile-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      disabled={uploadingProfile}
                    >
                      {uploadingProfile ? (
                        <CircularProgress size={20} />
                      ) : (
                        t("engineers.uploadProfileImage")
                      )}
                    </Button>
                  </label>
                </Box>
              </Box>
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                {t("engineers.location")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.governorate}>
                <InputLabel>{t("engineers.governorate")}</InputLabel>
                <Select
                  value={formData.governorate}
                  onChange={(e) =>
                    handleInputChange("governorate", e.target.value)
                  }
                  label={t("engineers.governorate")}
                >
                  {governorates.map((gov) => (
                    <MenuItem key={gov} value={gov}>
                      {gov}
                    </MenuItem>
                  ))}
                </Select>
                {errors.governorate && (
                  <FormHelperText>{errors.governorate}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.city")}
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("engineers.address")}
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>

            {/* Experience */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                {t("engineers.experience")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.experienceYears")}
                type="number"
                value={formData.experience.years}
                onChange={(e) =>
                  handleNestedInputChange("experience", "years", e.target.value)
                }
                error={!!errors.experienceYears}
                helperText={errors.experienceYears}
              />
            </Grid>

            {/* Services & Specializations */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                {t("engineers.servicesAndSpecializations")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("engineers.services")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {services.map((service) => (
                  <Chip
                    key={service}
                    label={service}
                    onClick={() => handleServiceToggle(service)}
                    color={
                      formData.services.includes(service)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      formData.services.includes(service)
                        ? "filled"
                        : "outlined"
                    }
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("engineers.specializations")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {specializations.map((spec) => (
                  <Chip
                    key={spec}
                    label={spec}
                    onClick={() => handleSpecializationToggle(spec)}
                    color={
                      formData.specializations.includes(spec)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      formData.specializations.includes(spec)
                        ? "filled"
                        : "outlined"
                    }
                    size="small"
                  />
                ))}
              </Box>
            </Grid>

            {/* Portfolio Images */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("engineers.portfolioImages")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                {formData.portfolioImages.map((imageUrl, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt={`Portfolio ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 8,
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
                      onClick={() => removePortfolioImage(index)}
                    >
                      <DeleteImageIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="portfolio-image-upload"
                type="file"
                onChange={handlePortfolioImageUpload}
                disabled={uploadingPortfolio}
              />
              <label htmlFor="portfolio-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingPortfolio}
                >
                  {uploadingPortfolio ? (
                    <CircularProgress size={20} />
                  ) : (
                    t("engineers.uploadPortfolioImage")
                  )}
                </Button>
              </label>
            </Grid>

            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                {t("engineers.pricing")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("engineers.hourlyRate")}
                type="number"
                value={formData.pricing.hourlyRate}
                onChange={(e) =>
                  handleNestedInputChange(
                    "pricing",
                    "hourlyRate",
                    e.target.value
                  )
                }
                error={!!errors.hourlyRate}
                helperText={errors.hourlyRate}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label={t("engineers.minimumCharge")}
                type="number"
                value={formData.pricing.minimumCharge}
                onChange={(e) =>
                  handleNestedInputChange(
                    "pricing",
                    "minimumCharge",
                    e.target.value
                  )
                }
                error={!!errors.minimumCharge}
                helperText={errors.minimumCharge}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>{t("engineers.currency")}</InputLabel>
                <Select
                  value={formData.pricing.currency}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "pricing",
                      "currency",
                      e.target.value
                    )
                  }
                  label={t("engineers.currency")}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Availability */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>
                {t("engineers.availability")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t("engineers.status")}</InputLabel>
                <Select
                  value={formData.availability.status}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "availability",
                      "status",
                      e.target.value
                    )
                  }
                  label={t("engineers.status")}
                >
                  <MenuItem value="Available">
                    {t("engineers.available")}
                  </MenuItem>
                  <MenuItem value="Busy">{t("engineers.busy")}</MenuItem>
                  <MenuItem value="Unavailable">
                    {t("engineers.unavailable")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("engineers.workingDays")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {workingDays.map((day) => (
                  <Chip
                    key={day}
                    label={day.slice(0, 3)}
                    onClick={() => handleWorkingDayToggle(day)}
                    color={
                      formData.availability.workingDays.includes(day)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      formData.availability.workingDays.includes(day)
                        ? "filled"
                        : "outlined"
                    }
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.workingHoursStart")}
                type="time"
                value={formData.availability.workingHours.start}
                onChange={(e) =>
                  handleNestedInputChange("availability", "workingHours", {
                    ...formData.availability.workingHours,
                    start: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("engineers.workingHoursEnd")}
                type="time"
                value={formData.availability.workingHours.end}
                onChange={(e) =>
                  handleNestedInputChange("availability", "workingHours", {
                    ...formData.availability.workingHours,
                    end: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            {t("engineers.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              addEngineerMutation.isPending || updateEngineerMutation.isPending
            }
            startIcon={
              addEngineerMutation.isPending ||
              updateEngineerMutation.isPending ? (
                <CircularProgress size={20} />
              ) : null
            }
          >
            {addEngineerMutation.isPending || updateEngineerMutation.isPending
              ? t("engineers.saving")
              : editingEngineer
              ? t("engineers.updateEngineerButton")
              : t("engineers.addEngineerButton")}
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
        <DialogTitle>{t("engineers.deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t("engineers.deleteConfirmMessage")}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>
            {t("engineers.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleteEngineerMutation.isPending}
          >
            {deleteEngineerMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              t("engineers.delete")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageEngineers;
