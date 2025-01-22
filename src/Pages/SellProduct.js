import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import Autocomplete from '@mui/material/Autocomplete';
import { ref, set, get } from 'firebase/database';
import { TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { database } from '../Utils/firebase';

export default function SellProduct() {
    const [date, setDate] = React.useState(dayjs());
    const [productName, setProductName] = React.useState('');
    const [quantity, setQuantity] = React.useState('');
    const [SellerID,setSellerID]= React.useState('');
    const [price, setPrice] = React.useState('');
    const [unit, setUnit] = React.useState('Kg');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [productNames, setProductNames] = React.useState([]); 
    const [SellerIDs, setSellerIDs] = React.useState([]);
    const units = ['Kg', 'Crate', 'Bag'];

    // Fetch product names from Firebase
    React.useEffect(() => {
        const fetchProductList = async () => {
            try {
                const productListRef = ref(database, 'Input');
                const snapshot = await get(productListRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const Inputs = data;
                    setProductNames(Inputs.productList);
                    setSellerIDs(Inputs.SellerID)
                } else {
                    console.log('No product list available.');
                }
            } catch (error) {
                console.error('Error fetching product list:', error);
            }
        };

        fetchProductList();
    }, []);

    const handleEnter = () => {
        const id = uuidv4();
        const data = {
            id,
            productName,
            quantity,
            unit,
            price,
            dateAdded: date.format('YYYY-MM-DD'), // Store date as a string
        };

        set(ref(database, 'sell/products/' + id), data)
            .then(() => {
                setSuccessMessage('Product added to inventory!');
                setProductName('');
                setQuantity('');
                setPrice('');
                setUnit('Kg');
                setDate(dayjs());
            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px', margin: 'auto', marginTop: '20px' }}>
                <FormControl fullWidth>
                <Autocomplete
                    value={SellerID}
                    disablePortal
                    options={SellerIDs}
                    sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                        setSellerID(newValue);
                      }}
                    renderInput={(params) => <TextField {...params} label="Seller" />}
                />
                </FormControl>
                <FormControl fullWidth>
                <Autocomplete
                    value={productName}
                    disablePortal
                    options={productNames}
                    sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                        setProductName(newValue);
                      }}
                    renderInput={(params) => <TextField {...params} label="Product" />}
                />
                </FormControl>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{ flex: 2 }}
                    />
                    <FormControl style={{ flex: 1 }}>
                        <Select
                            labelId="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) {
                                  return <div style={{color:"#888"}}>Unit</div>;
                                }
                    
                                return selected
                              }}
                              inputProps={{ 'aria-label': 'Without label' }}
                        >
                            {units.map((name, index) => (
                                <MenuItem key={index} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                />
                <DatePicker
                    label="Date Added"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                />
                <Button variant="contained" color="primary" onClick={handleEnter}>
                    Add Product
                </Button>

                {successMessage && (
                    <Alert severity="success" style={{ marginTop: '16px' }}>
                        {successMessage}
                    </Alert>
                )}
            </div>
        </LocalizationProvider>
    );
}
