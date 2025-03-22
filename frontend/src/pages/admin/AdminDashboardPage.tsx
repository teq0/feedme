import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from '@mui/material';
import {
  People as UsersIcon,
  RestaurantMenu as RecipesIcon,
  Kitchen as IngredientsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data for users
const MOCK_USERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'user' },
];

// Mock data for recipes
const MOCK_RECIPES = [
  { id: '1', name: 'Spaghetti Carbonara', author: 'John Doe', isPublic: true },
  { id: '2', name: 'Vegetable Curry', author: 'Jane Smith', isPublic: true },
  { id: '3', name: 'Chicken Stir Fry', author: 'Bob Johnson', isPublic: false },
  { id: '4', name: 'Greek Salad', author: 'Alice Brown', isPublic: true },
];

// Mock data for ingredients
const MOCK_INGREDIENTS = [
  { id: '1', name: 'Chicken Breast', category: 'Meat' },
  { id: '2', name: 'Rice', category: 'Grains' },
  { id: '3', name: 'Tomatoes', category: 'Vegetables' },
  { id: '4', name: 'Olive Oil', category: 'Oils' },
];

/**
 * Admin dashboard page component
 */
const AdminDashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">{MOCK_USERS.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Recipes
              </Typography>
              <Typography variant="h3">{MOCK_RECIPES.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Ingredients
              </Typography>
              <Typography variant="h3">{MOCK_INGREDIENTS.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admin tabs */}
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          variant="fullWidth"
        >
          <Tab icon={<UsersIcon />} label="Users" />
          <Tab icon={<RecipesIcon />} label="Recipes" />
          <Tab icon={<IngredientsIcon />} label="Ingredients" />
        </Tabs>
        
        {/* Users tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_USERS.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="view">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="delete" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Recipes tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Public</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_RECIPES.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell>{recipe.id}</TableCell>
                    <TableCell>{recipe.name}</TableCell>
                    <TableCell>{recipe.author}</TableCell>
                    <TableCell>{recipe.isPublic ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="view">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="delete" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Ingredients tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_INGREDIENTS.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell>{ingredient.id}</TableCell>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="delete" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button variant="contained" color="primary">
              Add Ingredient
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminDashboardPage;