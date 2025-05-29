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
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Card,
  CardMedia,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { productAPI } from '../../services/api';

interface ProductFormData {
  product_name: string;
  price: string;
  product_type: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: '',
    price: '',
    product_type: ''
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (isEditMode && id) {
      fetchProductData();
    }
  }, [id]);
  
  const fetchProductData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await productAPI.getById(id);
      if (response.data.success) {
        const product = response.data.product;
        setFormData({
          product_name: product.product_name,
          price: product.price.toString(),
          product_type: product.product_type
        });
        
        if (product.image_path) {
          setCurrentImage(product.image_path);
        }
      } else {
        setError('Failed to load product data');
      }
    } catch (err) {
      setError('Error loading product data. Please try again later.');
      console.error('Error fetching product:', err);
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrors({
          ...errors,
          image: 'Please select a valid image file (JPG, PNG, or GIF)'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size must be less than 5MB'
        });
        return;
      }
      
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      
      // Clear error
      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required';
    } else if (formData.product_name.length > 100) {
      newErrors.product_name = 'Product name must be 100 characters or less';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }
    
    if (!formData.product_type.trim()) {
      newErrors.product_type = 'Product type is required';
    } else if (formData.product_type.length > 50) {
      newErrors.product_type = 'Product type must be 50 characters or less';
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
      // Create form data for multipart/form-data submission
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('product_name', formData.product_name);
      formDataToSubmit.append('price', formData.price);
      formDataToSubmit.append('product_type', formData.product_type);
      
      if (image) {
        formDataToSubmit.append('image', image);
      }
      
      let response;
      
      if (isEditMode && id) {
        response = await productAPI.update(id, formDataToSubmit);
      } else {
        response = await productAPI.create(formDataToSubmit);
      }
      
      if (response.data.success) {
        setSuccess(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
        
        // Navigate back to list after short delay
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/products');
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
          {isEditMode ? 'Edit Product' : 'Add Product'}
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
                label="Product Name"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                error={!!errors.product_name}
                helperText={errors.product_name}
                required
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.price}>
                <InputLabel htmlFor="price">Price</InputLabel>
                <OutlinedInput
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Price"
                  required
                  type="number"
                  inputProps={{ min: "0.01", step: "0.01" }}
                />
                {errors.price && (
                  <Typography variant="caption" color="error">
                    {errors.price}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Type"
                name="product_type"
                value={formData.product_type}
                onChange={handleInputChange}
                error={!!errors.product_type}
                helperText={errors.product_type}
                required
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleImageChange}
                />
              </Button>
              
              {errors.image && (
                <Typography variant="caption" color="error" display="block">
                  {errors.image}
                </Typography>
              )}
              
              <Typography variant="caption" color="text.secondary" display="block">
                Supported formats: JPG, PNG, GIF (Max: 5MB)
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {(imagePreview || currentImage) && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={imagePreview || currentImage || ''}
                        alt="Product image preview"
                        sx={{ objectFit: 'contain' }}
                      />
                    </Card>
                    <Typography variant="caption" align="center" display="block" sx={{ mt: 1 }}>
                      {imagePreview ? 'New image preview' : 'Current image'}
                    </Typography>
                  </Grid>
                )}
              </Grid>
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

export default ProductForm;
