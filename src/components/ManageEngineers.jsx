import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  WhatsApp as WhatsAppIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const ManageEngineers = () => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    description: "",
    experience: "",
    location: "",
    services: [],
    image: null,
  });

  // Mock data for engineers
  const [engineers, setEngineers] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+966501234567",
      whatsapp: "+966501234567",
      description:
        "Certified solar engineer with 5 years of experience in residential and commercial installations.",
      experience: "5",
      location: "Riyadh",
      services: ["Solar Installation", "Maintenance", "Consultation"],
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Sarah Al-Mansouri",
      email: "sarah@example.com",
      phone: "+966502345678",
      whatsapp: "+966502345678",
      description:
        "Specialized in large-scale solar projects and system optimization.",
      experience: "3",
      location: "Jeddah",
      services: ["System Design", "Project Management", "Technical Support"],
      image: "https://via.placeholder.com/150",
    },
  ]);

  const locations = [
    "Riyadh",
    "Jeddah",
    "Dammam",
    "Mecca",
    "Medina",
    "Abha",
    "Tabuk",
    "Jizan",
  ];

  const availableServices = [
    "Solar Installation",
    "Maintenance",
    "Consultation",
    "System Design",
    "Project Management",
    "Technical Support",
    "Inspection",
    "Repair",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert(t("engineers.fillRequiredFields"));
      return;
    }

    if (editingEngineer) {
      // Update existing engineer
      setEngineers((prev) =>
        prev.map((engineer) =>
          engineer.id === editingEngineer.id
            ? { ...formData, id: engineer.id }
            : engineer
        )
      );
    } else {
      // Add new engineer
      const newEngineer = {
        ...formData,
        id: Date.now(),
      };
      setEngineers((prev) => [...prev, newEngineer]);
    }

    handleCloseDialog();
  };

  const handleEdit = (engineer) => {
    setEditingEngineer(engineer);
    setFormData(engineer);
    setOpenDialog(true);
  };

  const handleDelete = (engineerId) => {
    if (window.confirm(t("engineers.deleteConfirmation"))) {
      setEngineers((prev) =>
        prev.filter((engineer) => engineer.id !== engineerId)
      );
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEngineer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      description: "",
      experience: "",
      location: "",
      services: [],
      image: null,
    });
  };

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
            {t("engineers.title")}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t("engineers.subtitle")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            },
          }}
        >
          {t("dashboard.actions.addEngineer")}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
              <TableCell fontWeight="bold">{t("engineers.engineer")}</TableCell>
              <TableCell fontWeight="bold">{t("engineers.contact")}</TableCell>
              <TableCell fontWeight="bold">
                {t("engineers.experience")}
              </TableCell>
              <TableCell fontWeight="bold">{t("engineers.location")}</TableCell>
              <TableCell fontWeight="bold">{t("engineers.services")}</TableCell>
              <TableCell fontWeight="bold" align="center">
                {t("engineers.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {engineers.map((engineer) => (
              <TableRow
                key={engineer.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={engineer.image} sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="500">
                        {engineer.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {engineer.description.substring(0, 50)}...
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <EmailIcon sx={{ fontSize: 16, mr: 1 }} />
                      {engineer.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <PhoneIcon sx={{ fontSize: 16, mr: 1 }} />
                      {engineer.phone}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <WhatsAppIcon sx={{ fontSize: 16, mr: 1 }} />
                      {engineer.whatsapp}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {engineer.experience} {t("engineers.years")}
                </TableCell>
                <TableCell>{engineer.location}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {engineer.services.slice(0, 2).map((service) => (
                      <Chip key={service} label={service} size="small" />
                    ))}
                    {engineer.services.length > 2 && (
                      <Chip
                        label={`+${engineer.services.length - 2} more`}
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Tooltip title={t("engineers.edit")}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(engineer)}
                        sx={{
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.2)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("engineers.delete")}>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(engineer.id)}
                        sx={{
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.2)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Engineer Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
          {editingEngineer
            ? t("engineers.editEngineer")
            : t("engineers.addNewEngineer")}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("engineers.name")} *`}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("engineers.email")} *`}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${t("engineers.phone")} *`}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("engineers.whatsapp")}
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("engineers.experienceYears")}
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t("engineers.location")}</InputLabel>
                <Select
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("engineers.description")}
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {t("engineers.servicesOffered")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableServices.map((service) => (
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
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="engineer-image"
              />
              <label htmlFor="engineer-image">
                <Button variant="outlined" component="span">
                  {t("engineers.uploadImage")}
                </Button>
              </label>
              {formData.image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.image}
                    alt="Engineer"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {t("engineers.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              },
            }}
          >
            {editingEngineer ? t("engineers.update") : t("engineers.add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageEngineers;
