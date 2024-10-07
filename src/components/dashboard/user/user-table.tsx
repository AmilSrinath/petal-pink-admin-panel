import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";

export interface User {
  id: string;
  employee_id: string;
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

export function UserTable({
                            count = 0,
                            rows = [],
                            page = 0,
                            rowsPerPage = 0,
                          }: UserTableProps): React.JSX.Element {
  const [users, setUsers] = React.useState<User[]>(rows);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [updateUser, setUpdateUser] = React.useState<User | null>(null);

  // Function to handle image buffer conversion
  const getImageSrc = (avatar: string | { data: number[] } | undefined): string => {
    if (avatar && typeof avatar === 'object' && avatar.data) {
      const base64String = Buffer.from(avatar.data).toString('base64');
      return `data:image/jpeg;base64,${base64String}`;
    }
    return avatar || ''; // If it's already a URL, just return it
  };

  // Function to fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/getAllData');
      if (response.ok) {
        const data = await response.json();
        setUsers(data); // Update state with the fetched users
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to handle user deletion
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

  // Function to handle user update
  const handleUpdate = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/updateUser/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        console.log(`User with ID ${updatedUser.id} updated successfully`);
        setOpenUpdateDialog(false); // Close the dialog
        await fetchUsers(); // Fetch the updated list of users
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Open the confirmation dialog
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

  React.useEffect(() => {
    fetchUsers(); // Fetch the initial list of users when the component mounts
  }, []);

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
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
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Avatar src={getImageSrc(row.avatar)} />
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
                      onClick={() => handleClickOpenUpdate(row.user_id)}
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
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
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
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '20px', marginTop: '20px' }}>
          {updateUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Employee ID"
                value={updateUser.employee_id}
                onChange={(e) => setUpdateUser({ ...updateUser, employee_id: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={updateUser.email}
                onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Role"
                value={updateUser.role}
                onChange={(e) => setUpdateUser({ ...updateUser, role: e.target.value })}
                fullWidth
              />
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
  );
}
