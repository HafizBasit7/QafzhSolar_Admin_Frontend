import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAds, useAddAd, useUpdateAd, useDeleteAd } from "../hooks/useAds";
import { AdsService } from "../../API_Callings/Advertisements/AdsService";
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
  Snackbar,
  CircularProgress,
  Fade,
  Slide,
  Divider,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Campaign as CampaignIcon,
  CloudUpload as CloudUploadIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { uploadImage } from "../../utils/Upload/Upload";

const ManageAds = () => {
  const { t, i18n } = useTranslation();

  // API hooks
  const { data: ads = [], isLoading, error, refetch } = useAds();
  const addAdMutation = useAddAd();
  const updateAdMutation = useUpdateAd();
  const deleteAdMutation = useDeleteAd();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    phone: "",
    active: true,
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDialog = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title || "",
        description: ad.description || "",
        imageUrl: ad.imageUrl || "",
        link: ad.link || "",
        phone: ad.phone || "",
        active: ad.active !== undefined ? ad.active : true,
      });
      setImagePreview(ad.imageUrl || null);
    } else {
      setEditingAd(null);
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        link: "",
        phone: "",
        active: true,
      });
      setImagePreview(null);
    }
    setSelectedImageFile(null);
    setImageUploading(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAd(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message:
            t("ads.invalidImageType") || "Please select a valid image file",
          severity: "error",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message:
            t("ads.imageTooLarge") || "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }

      setSelectedImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      setSnackbar({
        open: true,
        message: t("ads.fillRequiredFields"),
        severity: "error",
      });
      return;
    }

    try {
      setImageUploading(true);

      if (editingAd) {
        // For updating ads, use the new method that handles image uploads
        if (selectedImageFile) {
          // Upload new image and update ad
          await AdsService.updateAdWithImage(
            editingAd._id,
            formData,
            selectedImageFile
          );
        } else {
          // Update without changing image
          await updateAdMutation.mutateAsync({
            adId: editingAd._id,
            adData: formData,
          });
        }
        setSnackbar({
          open: true,
          message: t("ads.updateAd") + " " + t("common.success"),
          severity: "success",
        });
      } else {
        // For adding new ads
        let finalFormData = { ...formData };

        if (selectedImageFile) {
          // Upload image first, then create ad
          const imageUrl = await AdsService.uploadAdImage(selectedImageFile);
          finalFormData.imageUrl = imageUrl;
        }

        await addAdMutation.mutateAsync(finalFormData);
        setSnackbar({
          open: true,
          message: t("ads.addAd") + " " + t("common.success"),
          severity: "success",
        });
      }

      handleCloseDialog();
      // Refetch ads to show updated data
      refetch();
    } catch (error) {
      console.error("Failed to save ad:", error);
      setSnackbar({
        open: true,
        message: t("ads.saveError") || "Error saving ad",
        severity: "error",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDelete = async (adId) => {
    if (window.confirm(t("ads.deleteConfirmation"))) {
      try {
        await deleteAdMutation.mutateAsync(adId);
        setSnackbar({
          open: true,
          message: t("ads.delete") + " " + t("common.success"),
          severity: "success",
        });
      } catch (error) {
        console.error("Failed to delete ad:", error);
        setSnackbar({
          open: true,
          message: t("ads.deleteError") || "Error deleting ad",
          severity: "error",
        });
      }
    }
  };

  const getStatusColor = (active) => {
    return active ? "success" : "error";
  };

  const isRTL = i18n.language === "ar";

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
          {t("ads.errorLoading") || "Error loading ads"}
        </Alert>
        <Button variant="outlined" onClick={() => refetch()} sx={{ mt: 2 }}>
          {t("common.retry") || "Retry"}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Professional Header Section */}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                  background: "linear-gradient(45deg, #fff 30%, #e3f2fd 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("ads.title")}
              </Typography>
              <Typography
                variant="h6"
                sx={{ opacity: 0.9, fontWeight: 300, maxWidth: 600 }}
              >
                {t("ads.subtitle")}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={!isRTL ? <AddIcon /> : null}
              endIcon={isRTL ? <AddIcon /> : null}
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
              {t("ads.addAd")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Professional Table */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TableContainer>
         
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    py: 2.5,
                  }}
                >
                  {t("ads.ad")}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    py: 2.5,
                  }}
                >
                  {t("ads.link")}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    py: 2.5,
                  }}
                >
                  {t("ads.phone")}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    py: 2.5,
                  }}
                >
                  {t("ads.createdAt")}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    py: 2.5,
                  }}
                >
                  {t("ads.status")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    py: 2.5,
                  }}
                >
                  {t("ads.actions")}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
           {ads.map((ad) => (
        <TableRow
          key={ad._id}
          sx={{
            // do NOT change layout on hover (no transform/scale/translate)
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            },
            // only animate background + box-shadow to avoid reflow
            transition: "background-color 0.2s ease, box-shadow 0.2s ease",
            willChange: "background-color, box-shadow",
            "&:nth-of-type(even)": {
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            },
          }}
        >
                  <TableCell sx={{ py: 2.5 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 2.5 }}
                    >
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          border: "3px solid",
                          borderColor: "primary.main",
                          borderRadius: 2,
                        }}
                      >
                        {ad.imageUrl ? (
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <CampaignIcon
                            sx={{ fontSize: 35, color: "primary.main" }}
                          />
                        )}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="700"
                          sx={{ color: "text.primary", mb: 0.5 }}
                        >
                          {ad.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {ad.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {ad.link ? (
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ad.link.length > 30
                            ? ad.link.substring(0, 30) + "..."
                            : ad.link}
                        </a>
                      ) : (
                        "-"
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ad.phone || "-"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ad.active ? t("ads.active") : t("ads.inactive")}
                      color={getStatusColor(ad.active)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title={t("ads.edit")} arrow>
                        <IconButton
                          size="medium"
                          onClick={() => handleOpenDialog(ad)}
                          sx={{
                            color: "primary.main",
                            backgroundColor: "rgba(25, 118, 210, 0.08)",
                            border: "1px solid rgba(25, 118, 210, 0.2)",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "white",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("ads.delete")} arrow>
                        <IconButton
                          size="medium"
                          onClick={() => handleDelete(ad._id)}
                          sx={{
                            color: "error.main",
                            backgroundColor: "rgba(211, 47, 47, 0.08)",
                            border: "1px solid rgba(211, 47, 47, 0.2)",
                            "&:hover": {
                              backgroundColor: "error.main",
                              color: "white",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Professional Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
            py: 3,
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          {editingAd ? t("ads.editAd") : t("ads.addNewAd")}
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Title Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("ads.adTitle")}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Grid>

            {/* Description Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("ads.adDescription")}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={4}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Grid>

            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t("ads.adImage")}
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="ad-image-upload"
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageUploading(true);
                      try {
                        const uploadedUrl = await uploadImage(file);
                        handleInputChange("imageUrl", uploadedUrl);
                        setSnackbar({
                          open: true,
                          message:
                            t("ads.uploadSuccess") ||
                            "Image uploaded successfully",
                          severity: "success",
                        });
                      } catch (error) {
                        console.error("Error uploading image:", error);
                        setSnackbar({
                          open: true,
                          message:
                            t("ads.uploadError") || "Error uploading image",
                          severity: "error",
                        });
                      } finally {
                        setImageUploading(false);
                      }
                    }
                  }}
                />
                <label htmlFor="ad-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={
                      imageUploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CloudUploadIcon />
                      )
                    }
                    disabled={imageUploading}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                      mb: 2,
                    }}
                  >
                    {imageUploading
                      ? t("ads.uploading") || "Uploading..."
                      : t("ads.uploadImage") || "Upload Image"}
                  </Button>
                </label>
                {formData.imageUrl && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      border: "2px dashed #e0e0e0",
                      borderRadius: 2,
                      textAlign: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <img
                      src={formData.imageUrl}
                      alt="Ad preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 8,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {t("ads.imagePreview")}
                    </Typography>
                  </Box>
                )}
                <TextField
                  fullWidth
                  label={t("ads.imageUrl")}
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  variant="outlined"
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "white",
                      },
                    },
                  }}
                  helperText={t("ads.imageUrlHelper")}
                />
              </Box>
            </Grid>

            {/* Link Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("ads.link")}
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                placeholder="https://example.com"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Grid>

            {/* Phone and Status Row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("ads.phone")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1234567890"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                    },
                  },
                }}
              >
                <InputLabel>{t("ads.status")}</InputLabel>
                <Select
                  value={formData.active}
                  onChange={(e) => handleInputChange("active", e.target.value)}
                  label={t("ads.status")}
                >
                  <MenuItem value={true}>
                    <Chip
                      label={t("ads.active")}
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {t("ads.active")}
                  </MenuItem>
                  <MenuItem value={false}>
                    <Chip
                      label={t("ads.inactive")}
                      color="error"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {t("ads.inactive")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            background: "rgba(255, 255, 255, 0.8)",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              borderColor: "grey.400",
              color: "grey.700",
              "&:hover": {
                borderColor: "grey.600",
                backgroundColor: "grey.50",
              },
            }}
          >
            {t("ads.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            disabled={
              addAdMutation.isPending ||
              updateAdMutation.isPending ||
              imageUploading
            }
            startIcon={
              addAdMutation.isPending ||
              updateAdMutation.isPending ||
              imageUploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
          >
            {addAdMutation.isPending ||
            updateAdMutation.isPending ||
            imageUploading
              ? t("ads.uploading") || "Uploading..."
              : editingAd
              ? t("ads.updateAd") || "Update Ad"
              : t("ads.addAd") || "Add Ad"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageAds;
