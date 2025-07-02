import { useState } from "react";
import { useAppContext } from "../../../config/context/ComponentContext";
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  CircularProgress,
  Paper,
  Alert
} from '@mui/material';
import { Lock as LockIcon, Email as EmailIcon } from '@mui/icons-material';

const AdministrateurLogin = () => {
  const [loading, setLoading] = useState(false);
  const { handleLogin, navigateTo, errors } = useAppContext();

  const login = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const state = await handleLogin(
        { email: e.target.email.value, password: e.target.password.value },
        "admin"
      );
      state && navigateTo("/administrateur", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper elevation={6} sx={{
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.1)'
        }}>
          {/* Image Section */}
          <Box sx={{
            flex: 1,
            background: `linear-gradient(rgba(230, 230, 230, 0.8),rgba(164, 164, 164, 0.8), rgba(0, 0, 0, 0.8))`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            p: 4
          }}>
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <img 
                src="../pictures/ofppt.png" 
                alt="ISTA Logo"
                style={{ 
                  width: '60%', 
                  marginBottom: '2rem',
                }} 
              />
              <Typography variant="h4" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body1">
                Institut Spécialisée de Technologie Appliquée Tiznit
              </Typography>
            </Box>
          </Box>

          {/* Form Section */}
          <Box sx={{
            flex: 1,
            p: 6,
            minWidth: 400,
            backgroundColor: 'background.paper'
          }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LockIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                Admin Login
              </Typography>
            </Box>

            <Box component="form" onSubmit={login} sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={Boolean(errors?.email)}
                helperText={errors?.email}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
                placeholder="exemple@ofppt.ma"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(errors?.password)}
                helperText={errors?.password}
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
                placeholder="••••••••"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Grid container sx={{ mt: 3 }}>
                <Grid item xs>
                  <Link href="#!" variant="body2" color="text.secondary">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdministrateurLogin;