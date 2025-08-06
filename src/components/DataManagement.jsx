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
  IconButton,
  Alert,
  CircularProgress,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const DataManagement = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("locations");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState("");

  // Mock data - in real app, this would be fetched from API
  const [locationsData, setLocationsData] = useState({
    governorates: [
      {
        name: "Sana'a",
        nameAr: "صنعاء",
        cities: ["Al-Safia", "Al-Sabeen", "Al-Thawra", "Al-Wahda", "Al-Zubairi"]
      },
      {
        name: "Aden",
        nameAr: "عدن",
        cities: ["Al-Mansoura", "Al-Mu'alla", "Al-Tawahi", "Al-Buraiqah"]
      }
    ]
  });

  const [servicesData, setServicesData] = useState({
    services: [
      {
        id: "install",
        name: "Install",
        nameAr: "تركيب",
        description: "Solar panel installation services",
        descriptionAr: "خدمات تركيب الألواح الشمسية"
      },
      {
        id: "repair",
        name: "Repair",
        nameAr: "إصلاح",
        description: "Solar system repair and maintenance",
        descriptionAr: "إصلاح وصيانة الأنظمة الشمسية"
      }
    ]
  });

  const [specializationsData, setSpecializationsData] = useState({
    specializations: [
      {
        id: "residential",
        name: "Residential",
        nameAr: "سكني",
        description: "Residential solar installations",
        descriptionAr: "التركيبات الشمسية السكنية"
      },
      {
        id: "commercial",
        name: "Commercial",
        nameAr: "تجاري",
        description: "Commercial solar installations",
        descriptionAr: "التركيبات الشمسية التجارية"
      }
    ]
  });

  const [formData, setFormData] = useState({});

  const handleOpenDialog = (type, item = null) => {
    setEditType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setEditType("");
    setFormData({});
  };

  const handleSave = () => {
    // In real app, this would save to API
    console.log("Saving:", editType, formData);
    handleCloseDialog();
  };

  const handleDelete = (type, id) => {
    // In real app, this would delete from API
    console.log("Deleting:", type, id);
  };

  const getDisplayName = (item, field = "name") => {
    if (i18n.language === "ar") {
      return item[`${field}Ar`] || item[field];
    }
    return item[field];
  };

  const renderLocationsTab = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Governorates & Cities</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("governorate")}
        >
          Add Governorate
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {locationsData.governorates.map((governorate, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    {getDisplayName(governorate)}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog("governorate", governorate)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete("governorate", governorate.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Cities:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {governorate.cities.map((city, cityIndex) => (
                    <Chip
                      key={cityIndex}
                      label={city}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderServicesTab = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Services</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("service")}
        >
          Add Service
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {servicesData.services.map((service) => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    {getDisplayName(service)}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog("service", service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete("service", service.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  {getDisplayName(service, "description")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderSpecializationsTab = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Specializations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("specialization")}
        >
          Add Specialization
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {specializationsData.specializations.map((specialization) => (
          <Grid item xs={12} md={6} key={specialization.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">
                    {getDisplayName(specialization)}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog("specialization", specialization)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete("specialization", specialization.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  {getDisplayName(specialization, "description")}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDialogContent = () => {
    switch (editType) {
      case "governorate":
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name (English)"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name (Arabic)"
                value={formData.nameAr || ""}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cities (comma separated)"
                value={formData.cities?.join(", ") || ""}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  cities: e.target.value.split(",").map(city => city.trim()) 
                })}
                helperText="Enter cities separated by commas"
              />
            </Grid>
          </Grid>
        );
      
      case "service":
      case "specialization":
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name (English)"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name (Arabic)"
                value={formData.nameAr || ""}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description (English)"
                multiline
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description (Arabic)"
                multiline
                rows={3}
                value={formData.descriptionAr || ""}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              />
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Data Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage locations, services, and specializations for the engineer management system
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex" }}>
            <Button
              variant={activeTab === "locations" ? "contained" : "text"}
              onClick={() => setActiveTab("locations")}
              sx={{ mr: 2 }}
            >
              Locations
            </Button>
            <Button
              variant={activeTab === "services" ? "contained" : "text"}
              onClick={() => setActiveTab("services")}
              sx={{ mr: 2 }}
            >
              Services
            </Button>
            <Button
              variant={activeTab === "specializations" ? "contained" : "text"}
              onClick={() => setActiveTab("specializations")}
            >
              Specializations
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tab Content */}
      {activeTab === "locations" && renderLocationsTab()}
      {activeTab === "services" && renderServicesTab()}
      {activeTab === "specializations" && renderSpecializationsTab()}

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? `Edit ${editType}` : `Add ${editType}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderDialogContent()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataManagement; 