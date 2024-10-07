import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Swal from 'sweetalert2';

export interface Integration {
  id: string;
  title: string;
  quantity: number;
  product_price: number;
  description: string;
  logo: string;
  installs: number;
  updatedAt: Date;
}

export interface IntegrationCardProps {
  integration: Integration;
  onDelete: (id: string) => void; // Prop to notify the parent when an item is deleted
}

export function IntegrationCard({ integration, onDelete }: IntegrationCardProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false); // State to control the popup
  const [formValues, setFormValues] = React.useState({
    title: integration.title,
    product_price: integration.product_price,
    quantity: integration.quantity,
  });

  // Handle opening the dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle closing the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form value changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  // Handle update submission
  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:4000/api/product/updateProduct/${integration.id}`, formValues);
      if (response.status === 200) {
        Swal.fire('Success', 'Product updated successfully!', 'success');
        handleClose();
        // Optionally, you can refresh the parent component or fetch updated data
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire('Error', 'Failed to update the product.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`http://localhost:4000/api/product/deleteProduct/${integration.id}`);
        if (response.status === 200) {
          onDelete(integration.id);
          Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire('Error', 'Failed to delete the product.', 'error');
    }
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardContent sx={{ flex: '1 1 auto' }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                width={150}
                height={150}
                src={`data:image/jpeg;base64,${integration.logo}`}
                alt={`${integration.title} logo`}
                style={{ borderRadius: 20 }}
              />
            </Box>
            <Stack spacing={1}>
              <Typography align="center" variant="h6">
                {integration.title}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Typography color="text.secondary" display="inline" variant="body2">
            Qty : {integration.quantity}
          </Typography>
          <Typography color="text.primary" display="inline" variant="body2" fontSize={20}>
            Rs. {integration.product_price}.00
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: 'center' }}>
          <Button variant="outlined" color="primary" onClick={handleOpen}>
            Update
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Card>

      {/* Popup window for update */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Product Name"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Product Price"
              name="product_price"
              value={formValues.product_price}
              onChange={handleChange}
              fullWidth
              type="number"
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={formValues.quantity}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
