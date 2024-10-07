"use client";

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Avatar from '@mui/material/Avatar';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {UserFilters} from "@/components/dashboard/user/user-filters";
import {Plus as PlusIcon} from "@phosphor-icons/react";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Swal from 'sweetalert2';

const rowsPerPage = 8;

export interface User {
  id: string;
  employee_id: string;
  nic: string,
  name: string;
  avatar?: string | { data: number[] }; // Either URL or Buffer
  email: string;
  role: string;
}

interface UserTableProps {
  count?: number;
  page?: number;
  rows?: User[];
  rowsPerPage?: number;
}

export default function Page(): React.JSX.Element {
  const [updateUser, setUpdateUser] = React.useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    employeeId: '',
    email: '',
    nic : '',
    name: '',
    password: '',
    role: '',

    image: null as File | null
  });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Fetch users function
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/getAllData');
      const datauser = JSON.parse(JSON.stringify(response.data));
      console.log('Fetched users:', datauser);
      if (Array.isArray(datauser)) {
        setUsers(datauser);
        setCount(datauser.length);
      } else {
        console.error('Unexpected data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (selectedUserId === id) {
      try {
        const response = await fetch(`http://localhost:4000/api/users/deleteUser/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          console.log(`User with ID ${id} deleted successfully`);
          setOpenDeleteDialog(false); // Close the dialog
          await fetchUsers(); // Fetch the updated list of users
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdate = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/updateUser/${updatedUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: updatedUser.employee_id,
          email: updatedUser.email,
          role: updatedUser.role,
          status: 1, // or use updatedUser.status if it's dynamically set
          visible: 1, // or use updatedUser.visible if it's dynamically set
        }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Done",
          text: "User updated successfully!",
          icon: "success"
        });
        setOpenUpdateDialog(false);
        await fetchUsers();
      } else {
        Swal.fire({
          title: "Error",
          text: "User updated unsuccessfully!",
          icon: "error"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error updating user!",
        icon: "error"
      });
    }
  };


  const handleClickOpenDelete = (id: string) => {
    setSelectedUserId(id);
    setOpenDeleteDialog(true);
  };

  // Close the confirmation dialog
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedUserId(null);
  };

  // Open the update dialog
  const handleClickOpenUpdate = (user: User) => {
    setUpdateUser(user);
    setOpenUpdateDialog(true);
  };


  // Close the update dialog
  const handleCloseUpdate = () => {
    setOpenUpdateDialog(false);
    setUpdateUser(null);
  };

  // Load users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const paginatedCustomers = applyPagination(users, page, rowsPerPage);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImagePreview(null);  // Reset image preview on close
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, files} = event.target;

    if (files && files[0]) {
      const file = files[0];
      setFormValues((prevValues) => ({...prevValues, [name]: file}));
      setImagePreview(URL.createObjectURL(file)); // Update image preview
    } else {
      setFormValues((prevValues) => ({...prevValues, [name]: value}));
    }
  };

  const handleClear = () => {
    setFormValues({
      employeeId: '',
      email: '',
      password: '',
      name: '',
      role: '',
      nic: '',
      image: null
    });
    setImagePreview(null);  // Clear image preview
  };

  const handleSubmit = async () => {
    if (formValues.image && formValues.image.size > 1 * 1024 * 1024) { // 1MB in bytes
      Swal.fire({
        title: "Check!",
        text: "File size exceeds 1MB!",
        icon: "question"
      });
      return;
    }

    const formData = new FormData();
    formData.append('employeeId', formValues.employeeId);
    formData.append('email', formValues.email);
    formData.append('password', formValues.password);
    formData.append('role', formValues.role);
    formData.append('nic',formValues.nic)
    formData.append('name',formValues.name)

    if (formValues.image) {
      formData.append('image', formValues.image);
    }

    alert(formValues.nic);
    try {
      const response = await axios.post('http://localhost:4000/api/users/saveUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from server:', response); // Log the entire response for debugging

      if (response.status === 201) {
        await fetchUsers();
        handleClear();
        handleClose(); // Close the dialog
        Swal.fire({
          title: "Done",
          text: "User save successfully!",
          icon: "success"
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "User save unsuccessfully!",
          icon: "error"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "There was an error saving the user. Please try again.",
        icon: "error"
      });
    }
  };

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


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{flex: '1 1 auto'}}>
          <Typography variant="h4">User</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)"/>}
            variant="contained"
            onClick={handleOpen}
          >
            Add
          </Button>
        </div>
      </Stack>

      <UserFilters/>
      <Card>
        <Box sx={{overflowX: 'auto'}}>
          <Table sx={{minWidth: '800px'}}>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>
                    <Stack sx={{alignItems: 'center'}} direction="row" spacing={2}>
                      <Avatar
                        src={getImageSrc(row.image_url)}
                        sx={{width: 50, height: 50}}
                      />
                    </Stack>
                  </TableCell>

                  <TableCell>{row.employee_id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleClickOpenUpdate(row)} //full row ekm pass krnw
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleClickOpenDelete(row.user_id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider/>
        <TablePagination
          component="div"
          count={count}
          onPageChange={() => {
          }}
          onRowsPerPageChange={() => {
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
        {/* Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => selectedUserId && handleDelete(selectedUserId)}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdate} PaperProps={{
          sx: {
            width: '400px',
            height: '500px',
          },
        }}>
          <DialogTitle>
            Update User
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseUpdate}
              aria-label="close"
              sx={{position: 'absolute', right: 8, top: 8}}
            >
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{padding: '20px', marginTop: '20px'}}>
            {updateUser && (
              <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <TextField
                  label="Employee ID"
                  value={updateUser?.employee_id || ''}
                  onChange={(e) => setUpdateUser({...updateUser, employee_id: e.target.value})}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={updateUser?.email || ''}
                  onChange={(e) => setUpdateUser({...updateUser, email: e.target.value})}
                  fullWidth
                />

                {/* Role as Select/ComboBox */}
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    label="Role"
                    value={updateUser?.role || ''}
                    onChange={(e) => setUpdateUser({...updateUser, role: e.target.value})}
                    fullWidth
                  >
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                    <MenuItem value="USER">USER</MenuItem>
                  </Select>
                </FormControl>

              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdate} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => updateUser && handleUpdate(updateUser)}
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Card>

      {/* Dialog for adding a new user */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Add New User
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Employee ID"
              name="employeeId"
              value={formValues.employeeId}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="National Identity Number"
              name="nic"
              value={formValues.nic}
              onChange={handleChange}
              fullWidth
            />
            
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              fullWidth
            />

            {/* Role as Select/ComboBox */}
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formValues.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="USER">USER</MenuItem>
              </Select>
            </FormControl>

            {/* File input for Image */}
            <TextField
              label="Image"
              name="image"
              type="file"
              onChange={handleChange}
              InputLabelProps={{shrink: true}}
              fullWidth
            />

            {/* Image preview */}
            {imagePreview && (
              <Avatar
                src={imagePreview}
                alt="User avatar"
                sx={{width: 100, height: 100, mx: 'auto'}}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClear}>Clear</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

// Pagination logic for users
const applyPagination = (users: User[], page: number, rowsPerPage: number): User[] => {
  return users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
};
