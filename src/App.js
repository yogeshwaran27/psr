import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SellIcon from '@mui/icons-material/Sell';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyProduct from './Pages/BuyProduct';
import Orders from './Pages/Orders';
import NotFound from './Pages/NotFound';
import Home from './Pages/Home';
import SellProduct from './Pages/SellProduct';
import Stakeholder from './Pages/Stakeholder';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Pages',
  },
  {
    segment: 'buy',
    title: 'Buy',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'sell',
    title: 'Sell',
    icon: <SellIcon />,
  },
  {
    segment: 'parties',
    title: 'Stakeholder Info',
    icon: <AddBusinessIcon />,
  },{
    segment: 'viewOrder',
    title: 'History',
    icon: <ReceiptLongIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default function DashboardLayoutBasic(props) {
  const { window } = props;

  const demoWindow = window ? window() : undefined;

  return (
    <Router>
      <AppProvider
        navigation={NAVIGATION}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <PageContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<BuyProduct />} />
              <Route path="/sell" element={<SellProduct />} />
              <Route path="/viewOrder" element={<Orders />} />
              <Route path="/parties" element={<Stakeholder />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </Router>
  );
}
