import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Store
      </Typography>
      <Box mt={4} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button variant="contained" color="primary" size="large" onClick={()=>navigate('/buy')}>
          Buy Product
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={()=>navigate('/sell')}>
          Sell Product
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={()=>navigate('/parties')}>
          Stakeholders info
        </Button>
        <Button variant="outlined" color="secondary" size="large" onClick={()=>navigate('/viewOrder')}>
          View Orders
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
