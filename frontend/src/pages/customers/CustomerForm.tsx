import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { customerAPI } from '../../services/api';

interface CustomerFormData {
  company_name: string;
  address: string;
  city: string;
  mobile_number: string;
}

const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CustomerFormData>({
    company_name: '',
    address: '',
    city: '',
    mobile_number: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (isEditMode && id) {
      fetchCustomerData();
    }
  }, [id]);
  
  const fetchCustomerData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await customerAPI.getById(id);
      if (response.data.success) {
        setFormData(response.data.customer);
      } else {
        setError('Failed to load customer data');
      }
    } catch (err) {
      setError('Error loading customer data. Please try again later.');
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    } else if (formData.company_name.length > 100) {
      newErrors.company_name = 'Company name must be 100 characters or less';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 200) {
      newErrors.address = 'Address must be 200 characters or less';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.length > 50) {
      newErrors.city = 'City must be 50 characters or less';
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (formData.mobile_number.length > 20) {
      newErrors.mobile_number = 'Mobile number must be 20 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      let response;
      
      if (isEditMode && id) {
        response = await customerAPI.update(id, formData);
      } else {
        response = await customerAPI.create(formData);
      }
      
      if (response.data.success) {
        setSuccess(isEditMode ? 'Customer updated successfully!' : 'Customer created successfully!');
        
        // Navigate back to list after short delay
        setTimeout(() => {
          navigate('/customers');
        }, 1500);
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      console.error('Error saving customer:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/customers');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isEditMode ? 'Edit Customer' : 'Add Customer'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
        >
          Back to List
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                error={!!errors.company_name}
                helperText={errors.company_name}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!errors.address}
                helperText={errors.address}
                required
                inputProps={{ maxLength: 200 }}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={!!errors.city}
                helperText={errors.city}
                required
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                error={!!errors.mobile_number}
                helperText={errors.mobile_number}
                required
                inputProps={{ maxLength: 20 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
