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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

const ManageShops = () => {
  const { t, i18n } = useTranslation();
  const [shops, setShops] = useState([
    {
      id: 1,
      name: "Solar Solutions Pro",
      ownerName: "أحمد محمد",
      email: "ahmed@solarsolutions.com",
      phone: "+966501234567",
      whatsapp: "+966501234567",
      address: "شارع الملك فهد، الرياض",
      description: "متجر متخصص في حلول الطاقة الشمسية للمنازل والشركات",
      services: ["تركيب الألواح", "صيانة الأنظمة", "استشارات"],
      status: "active",
      image: "/shop1.jpg",
    },
    {
      id: 2,
      name: "Green Energy Store",
      ownerName: "فاطمة علي",
      email: "fatima@greenenergy.com",
      phone: "+966502345678",
      whatsapp: "+966502345678",
      address: "شارع التحلية، جدة",
      description: "متجر رائد في توفير حلول الطاقة المتجددة",
      services: ["بيع المعدات", "تركيب", "تدريب"],
      status: "active",
      image: "/shop2.jpg",
    },
    {
      id: 3,
      name: "Sun Power Center",
      ownerName: "خالد عبدالله",
      email: "khalid@sunpower.com",
      phone: "+966503456789",
      whatsapp: "+966503456789",
      address: "شارع العليا، الدمام",
      description: "مركز متخصص في أنظمة الطاقة الشمسية التجارية",
      services: ["أنظمة تجارية", "صيانة", "مراقبة"],
      status: "pending",
      image: "/shop3.jpg",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    description: "",
    services: [],
    status: "pending",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenDialog = (shop = null) => {
    if (shop) {
      setEditingShop(shop);
      setFormData(shop);
    } else {
      setEditingShop(null);
      setFormData({
        name: "",
        ownerName: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        description: "",
        services: [],
        status: "pending",
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

  const handleSubmit = () => {
    if (!formData.name || !formData.ownerName || !formData.email) {
      setSnackbar({
        open: true,
        message: t("shops.fillRequiredFields"),
        severity: "error",
      });
      return;
    }

    if (editingShop) {
      setShops((prev) =>
        prev.map((shop) =>
          shop.id === editingShop.id ? { ...formData, id: shop.id } : shop
        )
      );
      setSnackbar({
        open: true,
        message: t("shops.updateShop") + " " + t("common.success"),
        severity: "success",
      });
    } else {
      const newShop = {
        ...formData,
        id: Math.max(...shops.map((s) => s.id)) + 1,
      };
      setShops((prev) => [...prev, newShop]);
      setSnackbar({
        open: true,
        message: t("shops.addShop") + " " + t("common.success"),
        severity: "success",
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (shopId) => {
    if (window.confirm(t("shops.deleteConfirmation"))) {
      setShops((prev) => prev.filter((shop) => shop.id !== shopId));
      setSnackbar({
        open: true,
        message: t("shops.delete") + " " + t("common.success"),
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
      case "pending":
        return "warning";
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
              <TableCell>{t("shops.owner")}</TableCell>
              <TableCell>{t("shops.contact")}</TableCell>
              <TableCell>{t("shops.location")}</TableCell>
              <TableCell>{t("shops.services")}</TableCell>
              <TableCell>{t("shops.status")}</TableCell>
              <TableCell>{t("shops.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#4caf50" }}>
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
                  <Typography variant="body2" fontWeight="medium">
                    {shop.ownerName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {shop.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{shop.phone}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {shop.whatsapp}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{shop.address}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {shop.services.map((service, index) => (
                      <Chip
                        key={index}
                        label={service}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t(`shops.status.${shop.status}`)}
                    color={getStatusColor(shop.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
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
                        onClick={() => handleDelete(shop.id)}
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
          {editingShop ? t("shops.editShop") : t("shops.addNewShop")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.name")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.ownerName")}
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("shops.email")}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
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
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t("shops.status")}</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  label={t("shops.status")}
                >
                  <MenuItem value="active">{t("shops.status.active")}</MenuItem>
                  <MenuItem value="inactive">
                    {t("shops.status.inactive")}
                  </MenuItem>
                  <MenuItem value="pending">
                    {t("shops.status.pending")}
                  </MenuItem>
                </Select>
              </FormControl>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("shops.cancel")}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingShop ? t("shops.updateShop") : t("shops.addShop")}
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

export default ManageShops;
