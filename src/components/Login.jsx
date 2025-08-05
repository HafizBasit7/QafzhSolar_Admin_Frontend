import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // TanStack Query login mutation
  const loginMutation = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    loginMutation.mutate(
      {
        email: email,
        password: password,
      },
      {
        onSuccess: (result) => {
          // If login successful, show success modal then redirect
          if (result.success) {
            setSuccessMessage("Login successful! Redirecting to dashboard...");
            setShowSuccessModal(true);

            // Redirect after 2 seconds
            setTimeout(() => {
              setShowSuccessModal(false);
              navigate("/");
            }, 2000);
          }
        },
        onError: (error) => {
          setErrorMessage(
            error.message || "Login failed. Please check your credentials."
          );
          setShowErrorModal(true);
        },
      }
    );
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 370,
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Admin Login
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle color="success" />
          Login Successful
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog
        open={showErrorModal}
        onClose={handleCloseErrorModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Error color="error" />
          Login Failed
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please check your credentials and try again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorModal} color="primary">
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
