import { useLocation } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  MenuBook as RecipesIcon,
  Kitchen as InventoryIcon,
  CalendarMonth as MealPlanIcon,
  Recommend as RecommendIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Navigation items
interface NavItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

/**
 * Sidebar component with navigation
 */
const Sidebar = ({ drawerWidth, mobileOpen, onDrawerToggle }: SidebarProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Navigation items
  const navItems: NavItem[] = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Recipes', path: '/recipes', icon: <RecipesIcon />, requireAuth: true },
    { text: 'Inventory', path: '/inventory', icon: <InventoryIcon />, requireAuth: true },
    { text: 'Meal Plans', path: '/meal-plans', icon: <MealPlanIcon />, requireAuth: true },
    { text: 'Recommendations', path: '/recommendations', icon: <RecommendIcon />, requireAuth: true },
    { text: 'Admin', path: '/admin', icon: <AdminIcon />, requireAuth: true, adminOnly: true },
  ];

  // Filter items based on auth status
  const filteredItems = navItems.filter(
    (item) =>
      (!item.requireAuth || isAuthenticated) && (!item.adminOnly || isAdmin)
  );

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {filteredItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navigation"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;