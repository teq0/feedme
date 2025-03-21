import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Mock data for inventory
const MOCK_INVENTORY = [
  {
    id: '1',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 500,
    unit: 'g',
    expiryDate: '2023-12-30',
  },
  {
    id: '2',
    name: 'Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'l',
    expiryDate: '2023-12-25',
  },
  {
    id: '3',
    name: 'Eggs',
    category: 'Dairy',
    quantity: 12,
    unit: 'piece',
    expiryDate: '2024-01-05',
  },
  {
    id: '4',
    name: 'Tomatoes',
    category: 'Vegetables',
    quantity: 6,
    unit: 'piece',
    expiryDate: '2023-12-28',
  },
  {
    id: '5',
    name: 'Rice',
    category: 'Grains',
    quantity: 2,
    unit: 'kg',
    expiryDate: null,
  },
  {
    id: '6',
    name: 'Olive Oil',
    category: 'Oils',
    quantity: 500,
    unit: 'ml',
    expiryDate: '2024-06-15',
  },
];

// Categories for filter and form
const CATEGORIES = [
  'All',
  'Meat',
  'Dairy',
  'Vegetables',
  'Fruits',
  'Grains',
  'Oils',
  'Spices',
  'Baking',
  'Canned Goods',
  'Frozen',
  'Other',
];

// Common units
const COMMON_UNITS = [
  'g',
  'kg',
  'ml',
  'l',
  'tsp',
  'tbsp',
  'cup',
  'oz',
  'lb',
  'piece',
  'slice',
  'clove',
];

// Form values interface
interface InventoryFormValues {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string | null;
}

// Sort type
type SortField = 'name' | 'category' | 'quantity' | 'expiryDate';
type SortDirection = 'asc' | 'desc';

/**
 * Inventory page component
 */
const InventoryPage = () => {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [filteredInventory, setFilteredInventory] = useState(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Initialize form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    defaultValues: {
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      expiryDate: null,
    },
  });

  // Filter inventory based on search term and category filter
  useEffect(() => {
    let filtered = inventory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'category') {
        return sortDirection === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortField === 'quantity') {
        return sortDirection === 'asc'
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      } else if (sortField === 'expiryDate') {
        // Handle null expiry dates
        if (!a.expiryDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.expiryDate) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc'
          ? a.expiryDate.localeCompare(b.expiryDate)
          : b.expiryDate.localeCompare(a.expiryDate);
      }
      return 0;
    });

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, categoryFilter, sortField, sortDirection]);

  // Handle sort request
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Open dialog for adding or editing an item
  const handleOpenDialog = (itemId?: string) => {
    if (itemId) {
      const item = inventory.find((i) => i.id === itemId);
      if (item) {
        reset({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          expiryDate: item.expiryDate,
        });
        setEditingItem(itemId);
      }
    } else {
      reset({
        name: '',
        category: '',
        quantity: 0,
        unit: '',
        expiryDate: null,
      });
      setEditingItem(null);
    }
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form submission
  const onSubmit = (data: InventoryFormValues) => {
    if (editingItem) {
      // Update existing item
      setInventory(
        inventory.map((item) =>
          item.id === editingItem
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: Date.now().toString(),
        ...data,
      };
      setInventory([...inventory, newItem]);
    }
    handleCloseDialog();
  };

  // Handle delete item
  const handleDeleteItem = (itemId: string) => {
    setInventory(inventory.filter((item) => item.id !== itemId));
  };

  // Check if an item is expiring soon (within 3 days)
  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  // Check if an item is expired
  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Ingredient Inventory
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Ingredient
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
              }}
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Inventory table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Ingredient
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'category'}
                  direction={sortField === 'category' ? sortDirection : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'quantity'}
                  direction={sortField === 'quantity' ? sortDirection : 'asc'}
                  onClick={() => handleSort('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'expiryDate'}
                  direction={sortField === 'expiryDate' ? sortDirection : 'asc'}
                  onClick={() => handleSort('expiryDate')}
                >
                  Expiry Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: isExpired(item.expiryDate)
                      ? 'error.light'
                      : isExpiringSoon(item.expiryDate)
                      ? 'warning.light'
                      : 'inherit',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>
                    {item.expiryDate ? (
                      <>
                        {new Date(item.expiryDate).toLocaleDateString()}
                        {isExpired(item.expiryDate) && (
                          <Chip
                            label="Expired"
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                        {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                          <Chip
                            label="Expiring Soon"
                            size="small"
                            color="warning"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleOpenDialog(item.id)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteItem(item.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No ingredients found. Try adjusting your filters or add a new ingredient.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Ingredient' : 'Add Ingredient'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Ingredient name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      label="Ingredient Name"
                      autoFocus
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category} sx={{ mt: 1 }}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        {...field}
                        labelId="category-label"
                        label="Category"
                      >
                        {CATEGORIES.filter((c) => c !== 'All').map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.category && (
                        <Typography variant="caption" color="error">
                          {errors.category.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Quantity must be positive' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      label="Quantity"
                      type="number"
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Controller
                  name="unit"
                  control={control}
                  rules={{ required: 'Unit is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.unit} sx={{ mt: 1 }}>
                      <InputLabel id="unit-label">Unit</InputLabel>
                      <Select
                        {...field}
                        labelId="unit-label"
                        label="Unit"
                      >
                        {COMMON_UNITS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.unit && (
                        <Typography variant="caption" color="error">
                          {errors.unit.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="expiryDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      fullWidth
                      label="Expiry Date"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.expiryDate}
                      helperText={errors.expiryDate?.message || 'Leave empty if not applicable'}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryPage;