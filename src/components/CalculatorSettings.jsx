import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  Divider,
  Alert,
  Stack,
  LinearProgress,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  SolarPower as SolarPowerIcon,
  BatteryChargingFull as BatteryIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";

const defaultAppliances = [
  { id: 1, name: "calculator.appliances.light", watt: 12 },
  { id: 2, name: "calculator.appliances.fan", watt: 70 },
  { id: 3, name: "calculator.appliances.refrigerator", watt: 200 },
  { id: 4, name: "calculator.appliances.iron", watt: 1200 },
  { id: 5, name: "calculator.appliances.other", watt: 0 },
];

const CalculatorSettings = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [openPanelDialog, setOpenPanelDialog] = useState(false);
  const [openBatteryDialog, setOpenBatteryDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [panelFormData, setPanelFormData] = useState({
    name: "",
    power: "",
    efficiency: "",
    price: "",
    brand: "",
  });
  const [batteryFormData, setBatteryFormData] = useState({
    name: "",
    capacity: "",
    voltage: "",
    price: "",
    brand: "",
  });
  const [appliances, setAppliances] = useState(defaultAppliances);
  const [applianceForm, setApplianceForm] = useState({ name: "", watt: "" });
  const [editingAppliance, setEditingAppliance] = useState(null);
  const [openApplianceDialog, setOpenApplianceDialog] = useState(false);

  // Mock data for solar panels
  const [solarPanels, setSolarPanels] = useState([
    {
      id: 1,
      name: "SunPower X-Series 400W",
      power: 400,
      efficiency: 22.8,
      price: 1200,
      brand: "SunPower",
    },
    {
      id: 2,
      name: "LG NeON R 380W",
      power: 380,
      efficiency: 21.4,
      price: 980,
      brand: "LG",
    },
    {
      id: 3,
      name: "Canadian Solar HiKu 370W",
      power: 370,
      efficiency: 20.3,
      price: 850,
      brand: "Canadian Solar",
    },
  ]);

  // Mock data for batteries
  const [batteries, setBatteries] = useState([
    {
      id: 1,
      name: "Tesla Powerwall 2",
      capacity: 13.5,
      voltage: 48,
      price: 8500,
      brand: "Tesla",
    },
    {
      id: 2,
      name: "LG Chem RESU 10H",
      capacity: 9.8,
      voltage: 48,
      price: 6500,
      brand: "LG Chem",
    },
    {
      id: 3,
      name: "Sonnen ecoLinx 10",
      capacity: 10,
      voltage: 48,
      price: 7200,
      brand: "Sonnen",
    },
  ]);

  const handlePanelInputChange = (field, value) => {
    setPanelFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBatteryInputChange = (field, value) => {
    setBatteryFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplianceInputChange = (field, value) => {
    setApplianceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePanelSubmit = () => {
    if (!panelFormData.name || !panelFormData.power || !panelFormData.price) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingItem) {
      // Update existing panel
      setSolarPanels((prev) =>
        prev.map((panel) =>
          panel.id === editingItem.id
            ? { ...panelFormData, id: panel.id }
            : panel
        )
      );
    } else {
      // Add new panel
      const newPanel = {
        ...panelFormData,
        id: Date.now(),
        power: parseFloat(panelFormData.power),
        efficiency: parseFloat(panelFormData.efficiency),
        price: parseFloat(panelFormData.price),
      };
      setSolarPanels((prev) => [...prev, newPanel]);
    }

    handleClosePanelDialog();
  };

  const handleBatterySubmit = () => {
    if (
      !batteryFormData.name ||
      !batteryFormData.capacity ||
      !batteryFormData.price
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingItem) {
      // Update existing battery
      setBatteries((prev) =>
        prev.map((battery) =>
          battery.id === editingItem.id
            ? { ...batteryFormData, id: battery.id }
            : battery
        )
      );
    } else {
      // Add new battery
      const newBattery = {
        ...batteryFormData,
        id: Date.now(),
        capacity: parseFloat(batteryFormData.capacity),
        voltage: parseFloat(batteryFormData.voltage),
        price: parseFloat(batteryFormData.price),
      };
      setBatteries((prev) => [...prev, newBattery]);
    }

    handleCloseBatteryDialog();
  };

  const handleApplianceSubmit = () => {
    if (!applianceForm.name || applianceForm.watt === "") {
      alert("Please fill in all required fields");
      return;
    }
    if (editingAppliance) {
      setAppliances((prev) =>
        prev.map((a) =>
          a.id === editingAppliance.id
            ? { ...applianceForm, id: a.id, watt: Number(applianceForm.watt) }
            : a
        )
      );
    } else {
      const newAppliance = {
        ...applianceForm,
        id: Date.now(),
        watt: Number(applianceForm.watt),
      };
      setAppliances((prev) => [...prev, newAppliance]);
    }
    setOpenApplianceDialog(false);
    setEditingAppliance(null);
    setApplianceForm({ name: "", watt: "" });
  };

  const handleEditPanel = (panel) => {
    setEditingItem(panel);
    setPanelFormData(panel);
    setOpenPanelDialog(true);
  };

  const handleEditBattery = (battery) => {
    setEditingItem(battery);
    setBatteryFormData(battery);
    setOpenBatteryDialog(true);
  };

  const handleEditAppliance = (appliance) => {
    setEditingAppliance(appliance);
    setApplianceForm({ name: appliance.name, watt: appliance.watt });
    setOpenApplianceDialog(true);
  };

  const handleDeletePanel = (panelId) => {
    if (window.confirm("Are you sure you want to delete this solar panel?")) {
      setSolarPanels((prev) => prev.filter((panel) => panel.id !== panelId));
    }
  };

  const handleDeleteBattery = (batteryId) => {
    if (window.confirm("Are you sure you want to delete this battery?")) {
      setBatteries((prev) =>
        prev.filter((battery) => battery.id !== batteryId)
      );
    }
  };

  const handleDeleteAppliance = (id) => {
    if (window.confirm("Are you sure you want to delete this appliance?")) {
      setAppliances((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleClosePanelDialog = () => {
    setOpenPanelDialog(false);
    setEditingItem(null);
    setPanelFormData({
      name: "",
      power: "",
      efficiency: "",
      price: "",
      brand: "",
    });
  };

  const handleCloseBatteryDialog = () => {
    setOpenBatteryDialog(false);
    setEditingItem(null);
    setBatteryFormData({
      name: "",
      capacity: "",
      voltage: "",
      price: "",
      brand: "",
    });
  };

  const handleCloseApplianceDialog = () => {
    setOpenApplianceDialog(false);
    setEditingAppliance(null);
    setApplianceForm({ name: "", watt: "" });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Appliance Settings Section */}
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
      <Typography variant="h3"
                fontWeight="700"
                gutterBottom
                sx={{
                  background: "linear-gradient(45deg, #fff 30%, #e3f2fd 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
          {t("calculator.applianceSettings") || "Appliance Settings"}
        </Typography>
        <Typography
                variant="h6"
                sx={{ opacity: 0.9, fontWeight: 300, maxWidth: 600 }}
              >
          {t("calculator.applianceSettingsDesc") ||
            "Manage the appliances and their default wattages for the user calculator."}
        </Typography>
        <Button
         variant="contained"
         size="large"
         startIcon={!isRTL ? <AddIcon /> : null}
          onClick={() => setOpenApplianceDialog(true)}
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
       
          {t("calculator.addAppliance") || "Add Appliance"}
        </Button>
        </Box>
        </CardContent>
        </Card>
      
      <Box sx={{ mb: 4 }}>
   


        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("calculator.appliance")}</TableCell>
                <TableCell>{t("calculator.watt")}</TableCell>
                <TableCell align="center">
                  {t("calculator.actions.actions") || "Actions"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appliances.map((appliance) => (
                <TableRow key={appliance.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LightbulbIcon
                        fontSize="small"
                        sx={{ color: "#fbc02d" }}
                      />
                      <Typography variant="body2">
                        {t(appliance.name)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{appliance.watt}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditAppliance(appliance)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAppliance(appliance.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Add/Edit Appliance Dialog */}
      <Dialog
        open={openApplianceDialog}
        onClose={handleCloseApplianceDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingAppliance
            ? t("calculator.editAppliance") || "Edit Appliance"
            : t("calculator.addAppliance") || "Add Appliance"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t("calculator.appliance")}
            value={applianceForm.name}
            onChange={(e) => handleApplianceInputChange("name", e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t("calculator.watt")}
            type="number"
            value={applianceForm.watt}
            onChange={(e) => handleApplianceInputChange("watt", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApplianceDialog}>
            {t("calculator.actions.cancel")}
          </Button>
          <Button onClick={handleApplianceSubmit} variant="contained">
            {editingAppliance
              ? t("calculator.actions.save")
              : t("calculator.addAppliance")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalculatorSettings;
