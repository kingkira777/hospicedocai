import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
    Link,
    Divider
} from '@mui/material';


import api from '../../utils/axios';
import { ShowAlert } from '../../utils/sweetAlert';
import { useNavigate } from 'react-router';

export default function SignUp() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Sign Up Data:', formData);

    try {
      const { data } = await api.post('/auth/register', formData);
      console.log("Sign Up Response:", data);
      navigate('/sign-in');
    } catch (error) {
      console.error("Sign Up Error:", error);
      ShowAlert({title: 'Error', text: 'User creation failed', icon: 'error', isToast: true});
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Sign up for Hospice
          </Typography>
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            Documents (IQ)
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Welcome user, please sign up to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Company Name"
              name="company"
              autoFocus
              value={formData.company}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Retype Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
              helperText={
                formData.password !== formData.confirmPassword && formData.confirmPassword !== '' 
                ? "Passwords must match" 
                : ""
              }
            />
            
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.2,
                textTransform: 'none',
                borderColor: '#2196f3',
                color: '#2196f3',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              CREATE ACCOUNT
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="textSecondary">OR</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link 
                  href="/sign-in" // Update this path to match your Toolpad/Router config
                  underline="hover" 
                  sx={{ cursor: 'pointer', fontWeight: 'bold', color: '#2196f3' }}
                >
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}