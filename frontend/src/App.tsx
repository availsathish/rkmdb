import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/customers/CustomerList';
import CustomerForm from './pages/customers/CustomerForm';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import NotFound from './pages/NotFound';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  }
});

function App() {
  const [open, setOpen] = useState(true);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Header open={open} toggleDrawer={toggleDrawer} />
          <Sidebar open={open} toggleDrawer={toggleDrawer} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              width: { sm: `calc(100% - ${240}px)` },
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/add" element={<CustomerForm />} />
              <Route path="/customers/edit/:id" element={<CustomerForm />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/add" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
