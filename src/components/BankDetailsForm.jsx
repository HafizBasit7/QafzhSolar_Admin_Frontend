import React, { useState } from "react";
import { Box, TextField, Button, Grid, Paper, Typography } from "@mui/material";

const BankDetailsForm = () => {
  const [form, setForm] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    cardNumber: "",
    expiryDate: "",
    upiId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Call API to save bank details
    console.log("Bank details saved:", form);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" mb={2}>Add / Update Bank Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Account Holder Name" name="accountHolder" value={form.accountHolder} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="IBAN" name="iban" value={form.iban} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="SWIFT/BIC Code" name="swiftCode" value={form.swiftCode} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField type="month" fullWidth label="Expiry Date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="UPI / Digital Payment ID (Optional)" name="upiId" value={form.upiId} onChange={handleChange} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSave} fullWidth>Save Bank Details</Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BankDetailsForm;
