import React, { useState } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    Paper,
} from '@mui/material';
import { database } from '../Utils/firebase';
import { v4 as uuidv4 } from 'uuid';
import { ref, set, get ,update} from 'firebase/database';
const BuyerSellerTable = () => {
    const [TableData, setTableData] = React.useState([]);
    const [successMessage, setSuccessMessage] = React.useState('');
    const fetchProductList = async () => {
        try {
            const productListRef = ref(database, 'Input');
            const snapshot = await get(productListRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const Inputs = data;
                console.log(Inputs);

                let  sellerData=Inputs.SellerID?.map((obj, ind) => {
                    return { id: ind+'s', name: obj, type: "Seller" }
                }) || []
                let buyerData=Inputs.BuyerID?.map((obj, ind) => {
                    return { id: (ind + 'b'), name: obj, type: "Buyer" }
                }) || []
                let newTableData = [...sellerData, ...buyerData]
                console.log(newTableData)
                setTableData(newTableData)
            } else {
                console.log('No product list available.');
            }
        } catch (error) {
            console.error('Error fetching product list:', error);
        }
    };

    React.useEffect(() => {
        
        fetchProductList();
    }, []);



    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('BuyerID');

    const handleDelete = (ind) => {
        const route=TableData[ind].type=='Buyer'?'BuyerID':'SellerID'
        const dbRef = ref(database, 'Input/'); // Your database reference
        
        // 1. Get the current data from the database
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
                data[route]=data[route].filter(obj=>obj!=TableData[ind].name) // Remove the element at the found index
                console.log(data)
              // 4. Update the database with the modified array
              update(dbRef, data)
                .then(() => {
                  console.log('Element deleted successfully!');
                  fetchProductList();
                })
                .catch((error) => {
                  console.error('Error deleting element:', error);
                });
        
            
          } else {
            console.log('No data found at this location.');
          }
        }).catch((error) => {
          console.error('Error getting data:', error);
        });
        
    };

    const handleAdd = () => {

        const dbRef = ref(database, 'Input/'+newType);

        get(dbRef).then((snapshot) => {
            const existingArray = snapshot.val() || [];
            existingArray.push(newName);
        
            set(dbRef, existingArray)
                .then(() => {
                    setNewName('');
                    setNewType('');
                    setSuccessMessage('Product added to inventory!');
                    fetchProductList();
                });
        });
        
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Buyers and Sellers</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {TableData.map((person,ind) => (
                            <TableRow key={person.id}>
                                <TableCell>{person.name}</TableCell>
                                <TableCell>{person.type}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(ind)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <TextField
                    label="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    variant="outlined"
                />
                <Select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="BuyerID">Buyer</MenuItem>
                    <MenuItem value="SellerID">Seller</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={handleAdd}>
                    Add
                </Button>
            </div>
        </div>
    );
};

export default BuyerSellerTable;
