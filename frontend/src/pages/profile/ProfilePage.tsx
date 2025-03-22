import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Save as SaveIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

/**
 * User profile page component
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message
      alert('Profile updated successfully');
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Show success message
      alert('Password updated successfully');
    }, 1000);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Grid container spacing={4}>
        {/* Profile sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Member since {new Date().toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Profile tabs */}
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="fullWidth"
            >
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<LockIcon />} label="Security" />
            </Tabs>
            
            {/* Profile tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleProfileSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            {/* Security tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handlePasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;