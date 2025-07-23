import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Campaign as CampaignIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const ManageAds = () => {
  const { t, i18n } = useTranslation();
  const [ads, setAds] = useState([
    {
      id: 1,
      title: "أفضل حلول الطاقة الشمسية",
      description: "احصل على أفضل أنظمة الطاقة الشمسية بأسعار منافسة",
      image: "/ad1.jpg",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      clicks: 1250,
      impressions: 5000,
    },
    {
      id: 2,
      title: "تركيب الألواح الشمسية",
      description: "خدمة تركيب احترافية للألواح الشمسية مع ضمان الجودة",
      image: "/ad2.jpg",
      startDate: "2024-02-01",
      endDate: "2024-11-30",
      status: "active",
      clicks: 890,
      impressions: 3200,
    },
    {
      id: 3,
      title: "صيانة أنظمة الطاقة الشمسية",
      description: "خدمات صيانة دورية لأنظمة الطاقة الشمسية",
      image: "/ad3.jpg",
      startDate: "2024-03-01",
      endDate: "2024-10-31",
      status: "inactive",
      clicks: 0,
      impressions: 0,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    startDate: "",
    endDate: "",
    status: "inactive",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDialog = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setFormData(ad);
    } else {
      setEditingAd(null);
      setFormData({
        title: "",
        description: "",
        image: null,
        startDate: "",
        endDate: "",
        status: "inactive",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAd(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      setSnackbar({
        open: true,
        message: t("ads.fillRequiredFields"),
        severity: "error",
      });
      return;
    }

    if (editingAd) {
      setAds((prev) =>
        prev.map((ad) =>
          ad.id === editingAd.id
            ? {
                ...formData,
                id: ad.id,
                clicks: ad.clicks,
                impressions: ad.impressions,
              }
            : ad
        )
      );
      setSnackbar({
        open: true,
        message: t("ads.updateAd") + " " + t("common.success"),
        severity: "success",
      });
    } else {
      const newAd = {
        ...formData,
        id: Math.max(...ads.map((a) => a.id)) + 1,
        clicks: 0,
        impressions: 0,
      };
      setAds((prev) => [...prev, newAd]);
      setSnackbar({
        open: true,
        message: t("ads.addAd") + " " + t("common.success"),
        severity: "success",
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (adId) => {
    if (window.confirm(t("ads.deleteConfirmation"))) {
      setAds((prev) => prev.filter((ad) => ad.id !== adId));
      setSnackbar({
        open: true,
        message: t("ads.delete") + " " + t("common.success"),
        severity: "success",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const isRTL = i18n.language === "ar";

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
            {t("ads.title")}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t("ads.subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={!isRTL ? <AddIcon /> : null}
          endIcon={isRTL ? <AddIcon /> : null}
          sx={{
            background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)",
            },
          }}
          onClick={() => handleOpenDialog()}
        >
          {t("ads.addAd")}
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
              <TableCell>{t("ads.ad")}</TableCell>
              <TableCell>{t("ads.startDate")}</TableCell>
              <TableCell>{t("ads.endDate")}</TableCell>
              <TableCell>النقرات</TableCell>
              <TableCell>المشاهدات</TableCell>
              <TableCell>{t("ads.status")}</TableCell>
              <TableCell>{t("ads.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#9c27b0", width: 60, height: 60 }}>
                      {ad.image ? (
                        <img
                          src={ad.image}
                          alt={ad.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src="/dummy-ad.jpg"
                          alt="dummy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {ad.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {ad.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(ad.startDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(ad.endDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {ad.clicks.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {ad.impressions.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`ads.${ad.status}`)}
                    color={getStatusColor(ad.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title={t("ads.edit")}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(ad)}
                        sx={{ color: "#1976d2" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("ads.delete")}>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(ad.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAd ? t("ads.editAd") : t("ads.addNewAd")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("ads.adTitle")}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("ads.adDescription")}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    {t("ads.uploadImage")}
                  </Button>
                </label>
                {formData.image && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("ads.startDate")}
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("ads.endDate")}
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t("ads.status")}</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  label={t("ads.status")}
                >
                  <MenuItem value="active">{t("ads.active")}</MenuItem>
                  <MenuItem value="inactive">{t("ads.inactive")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("ads.cancel")}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAd ? t("ads.updateAd") : t("ads.addAd")}
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
