import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../Utils/firebase';
import { IconButton, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Grid from '@mui/material/Grid';
function ButtonField(props) {
  const { setOpen, InputProps: { ref } = {}, inputProps: { 'aria-label': ariaLabel } = {} } = props;

  return (
    <IconButton
      variant="outlined"
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      <CalendarMonthIcon />
    </IconButton>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      slots={{ ...props.slots, field: ButtonField }}
      slotProps={{ ...props.slotProps, field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsArray = Object.values(data);
          productsArray.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          setProducts(productsArray);
          setFilteredProducts(productsArray);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDateChange = (date) => {
    setFilterDate(date);
    if (date) {
      const filtered = products.filter(product => {
        const productDate = new Date(product.dateAdded);
        return (
          productDate.getFullYear() === date.year() &&
          productDate.getMonth() === date.month() &&
          productDate.getDate() === date.date()
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Header and Date Picker in the same row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Order History</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ButtonDatePicker
            label={filterDate == null ? 'Select Date' : filterDate.format('MM/DD/YYYY')}
            value={filterDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </Box>

      {filterDate && (
        <Typography variant="h6" sx={{ paddingLeft: '8px' }}>
          Selected Date: {filterDate.format('MM/DD/YYYY')}
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ borderRadius: 2, padding: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {product.quantity} {product.unit}{product.quantity > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Price: ₹{product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date Added: {product.dateAdded}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Price: ₹{product.quantity * product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
