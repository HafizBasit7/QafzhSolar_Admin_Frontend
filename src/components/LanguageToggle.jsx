import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Tooltip,
} from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      changeLanguage(newLanguage);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
        {t("common.language")}:
      </Typography>
      <ToggleButtonGroup
        value={currentLanguage}
        exclusive
        onChange={handleLanguageChange}
        size="small"
        sx={{
          "& .MuiToggleButton-root": {
            px: 2,
            py: 0.5,
            fontSize: "0.75rem",
            fontWeight: 500,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "rgba(255, 255, 255, 0.8)",
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.25)",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          },
        }}
      >
        <Tooltip title={t("common.english")} arrow>
          <ToggleButton value="en" aria-label="English">
            EN
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t("common.arabic")} arrow>
          <ToggleButton value="ar" aria-label="Arabic">
            عربي
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LanguageToggle;
