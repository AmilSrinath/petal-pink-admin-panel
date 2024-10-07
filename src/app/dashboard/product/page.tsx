'use client';
import { useEffect, useState } from 'react';
import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye'; // Eye icon
import { XCircle } from '@phosphor-icons/react/dist/ssr'; // XCircle icon for removing images
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductCards from './productCard'; // Assuming this is the component for showing product cards
// Function to handle image src from base64 strings
const getImageSrc = (avatar: string | { data: number[] } | undefined): string => {
  if (!avatar) {
    return '';
  }
  if (typeof avatar === 'string') {
    if (avatar.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${avatar}`;
    }
    if (avatar.startsWith('iVBORw0K')) {
      return `data:image/png;base64,${avatar}`;
    }
  }
  return avatar || '';
};

export default function AddProductForm() {
  const [open, setOpen] = useState(false); // Modal control state
  const [isEditMode, setIsEditMode] = useState(false); // Check if editing a product
  const [formValues, setFormValues] = useState({
    product_id: '', // Added product_id for updating
    product_name: '',
    product_price: '',
    discount: '',
    weight: '',
    description: '',
    keyPoints: [''],
    howToUse: '',
    faq: '',
    image1: null,
    image2: null,
    image3: null,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [products, setProducts] = useState([]);
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...imagePreviews];
    updatedImages[index] = '';
    setImagePreviews(updatedImages);
    setFormValues((prevValues) => ({
      ...prevValues,
      [`image${index + 1}`]: null,
    }));
  };
  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/product/getAllData');
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Open form modal
  const handleClickOpen = () => setOpen(true);
  // Close form modal
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Reset form function
  const resetForm = () => {
    setIsEditMode(false); // Set edit mode to false when resetting
    setFormValues({
      product_id: '',
      product_name: '',
      product_price: '',
      discount: '',
      weight: '',
      description: '',
      keyPoints: [''],
      howToUse: '',
      faq: '',
      image1: null,
      image2: null,
      image3: null,
    });
    setImagePreviews([]);
  };

  // Load product details into the form for editing
  const handleEditProduct = (product: any) => {
    setFormValues({
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      discount: product.discount,
      weight: product.weight,
      description: product.description,
      keyPoints: product.keyPoints ? product.keyPoints.split('#') : [''],
      howToUse: product.howToUse,
      faq: product.faq,
      image1: product.image_url,
      image2: product.image_url_2,
      image3: product.image_url_3,
    });
    // Use getImageSrc to format the image previews
    setImagePreviews([
      getImageSrc(product.image_url),
      getImageSrc(product.image_url_2),
      getImageSrc(product.image_url_3),
    ]);
    setIsEditMode(true);
    setOpen(true);
  };

  // Handle file/image change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value, files } = event.target as HTMLInputElement;

    if (files && files.length > 0) {
      const fileIndex = name === 'image1' ? 0 : name === 'image2' ? 1 : 2;
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: files[0],
      }));
      const imageUrl = URL.createObjectURL(files[0]);
      setImagePreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[fileIndex] = imageUrl;
        return newPreviews;
      });
    } else if (index !== undefined) {
      const updatedKeyPoints = [...formValues.keyPoints];
      updatedKeyPoints[index] = value;
      setFormValues((prevValues) => ({
        ...prevValues,
        keyPoints: updatedKeyPoints,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  // Handle adding key points
  const handleAddKeyPoint = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      keyPoints: [...prevValues.keyPoints, ''],
    }));
  };

  // Submit or update product
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('product_name', formValues.product_name);
      formData.append('product_price', formValues.product_price);
      formData.append('discount', formValues.discount);
      formData.append('weight', formValues.weight);
      formData.append('description', formValues.description);
      formData.append('howToUse', formValues.howToUse);
      formData.append('faq', formValues.faq);
      const keyPointsString = formValues.keyPoints.join('#');
      formData.append('keyPoints', keyPointsString);
      if (formValues.image1) formData.append('image_url', formValues.image1);
      if (formValues.image2) formData.append('image_url_2', formValues.image2);
      if (formValues.image3) formData.append('image_url_3', formValues.image3);
      const userId = localStorage.getItem('userid');
      if (!userId) {
        return Swal.fire('Error', 'User not logged in!', 'error');
      }
      formData.append('user_id', userId);

      let response;
      if (isEditMode) {
        formData.append('product_id', formValues.product_id);
        response = await axios.put('http://localhost:4000/api/product/updateProduct', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('http://localhost:4000/api/product/saveProduct', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (response.status === 201 || response.status === 200) {
        Swal.fire('Success', isEditMode ? 'Product updated successfully!' : 'Product added successfully!', 'success');
        handleClose();
        fetchProducts(); // Refresh the product list
      } else {
        Swal.fire('Error', 'Failed to save product.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  };

  return (
    <>
      {/* Add/Edit Button */}
      <Stack direction="row" justifyContent="flex-end" sx={{ my: 2 }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          {isEditMode ? 'Edit Product' : 'Add Product'}
        </Button>
      </Stack>

      {/* Form Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Product Images Section */}
            <Grid item xs={12} sm={6} sx={{ position: 'relative' }}>
              <Typography variant="subtitle1" gutterBottom>
                Product Images
              </Typography>
              {imagePreviews[0] ? (
                <Box sx={{ position: 'relative' }}>
                  <img src={imagePreviews[0]} alt="Main Image" style={{ width: '100%', height: 'auto' }} />
                  <IconButton
                    onClick={() => handleRemoveImage(0)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'white',
                    }}
                  >
                    <XCircle />
                  </IconButton>
                </Box>
              ) : (
                <TextField
                  label="Image 1"
                  name="image1"
                  type="file"
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/* Product Information Section */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                name="product_name"
                value={formValues.product_name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Price (LKR)"
                name="product_price"
                value={formValues.product_price}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Discount (LKR)"
                name="discount"
                value={formValues.discount}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Weight (g)"
                name="weight"
                value={formValues.weight}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Smaller Images */}
            <Grid item xs={6} sm={3} sx={{ position: 'relative' }}>
              {imagePreviews[1] ? (
                <Box sx={{ position: 'relative' }}>
                  <img src={imagePreviews[1]} alt="Image 2" style={{ width: '100%', height: 'auto' }} />
                  <IconButton
                    onClick={() => handleRemoveImage(1)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'white',
                    }}
                  >
                    <XCircle />
                  </IconButton>
                </Box>
              ) : (
                <TextField
                  label="Image 2"
                  name="image2"
                  type="file"
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </Grid>

            <Grid item xs={6} sm={3} sx={{ position: 'relative' }}>
              {imagePreviews[2] ? (
                <Box sx={{ position: 'relative' }}>
                  <img src={imagePreviews[2]} alt="Image 3" style={{ width: '100%', height: 'auto' }} />
                  <IconButton
                    onClick={() => handleRemoveImage(2)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'white',
                    }}
                  >
                    <XCircle />
                  </IconButton>
                </Box>
              ) : (
                <TextField
                  label="Image 3"
                  name="image3"
                  type="file"
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              )}
            </Grid>

            {/* Description Section */}
            <Grid item xs={12}>
              {/*<Typography variant="subtitle1">Description</Typography>*/}
              <TextField
                label="Product Description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>

            {/* Key Points Section */}
            <Grid item xs={12}>
              {/*<Typography variant="subtitle1">Key Points</Typography>*/}
              {formValues.keyPoints.map((point, index) => (
                <TextField
                  key={index}
                  label={`Key Point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              ))}
              <Button variant="contained" onClick={handleAddKeyPoint}>
                Add Key Point
              </Button>
            </Grid>

            {/* FAQ Section */}
            <Grid item xs={12}>
              {/*<Typography variant="subtitle1">FAQ</Typography>*/}
              <TextField
                label="FAQ"
                name="faq"
                value={formValues.faq}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>

            {/* How to Use Section */}
            <Grid item xs={12}>
              {/*<Typography variant="subtitle1">How to Use</Typography>*/}
              <TextField
                label="How to Use"
                name="howToUse"
                value={formValues.howToUse}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Product Cards */}
      <ProductCards products={products} onEditProduct={handleEditProduct} />
    </>
  );
}
