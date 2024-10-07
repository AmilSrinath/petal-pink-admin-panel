'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';

const user = {
  email: 'user@example.com', // Add user's email here
  name: '',
  avatar: '',
  jobTitle: '',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;

const getImageSrc = (avatar: string | undefined): string => {
  if (!avatar) {
    return '';
  }

  if (avatar.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${avatar}`;
  }

  if (avatar.startsWith('iVBORw0K')) {
    return `data:image/png;base64,${avatar}`;
  }

  return avatar;
};

export function AccountInfo(): React.JSX.Element {
  const [avatar, setAvatar] = React.useState(user.avatar);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const avatarFromStorage = localStorage.getItem('avatarUrl');
      if (avatarFromStorage) {
        setAvatar(avatarFromStorage);
      }
    }
  }, []);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 1 * 1024 * 1024) { 
        Swal.fire({
          title: "Check!",
          text: "File size exceeds 1MB!",
          icon: "question"
        });
        return;
      }
      const email = localStorage.getItem('useremail');
  
      if (email) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('image', file);  
        updateProfilePicture(formData, file);
      } else {
        console.error('User email not found');
      }
    }
  };
  
  const updateProfilePicture = async (formData: FormData, file: File) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/updateProfilePicture/${localStorage.getItem('useremail')}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        Swal.fire({
          title: "Done",
          text: "Profile picture updated successfully!",
          icon: "success",
        });
  
       
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          localStorage.setItem('avatarUrl', result);
          setAvatar(result);
        };
        reader.readAsDataURL(file); 
      } else {
        Swal.fire({
          title: "Error",
          text: "Profile picture update unsuccessful!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "There was an error updating the profile picture. Please try again.",
        icon: "error",
      });
    }
  };
  

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar
              src={getImageSrc(avatar)}
              sx={{ height: '80px', width: '80px' }}
            />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {localStorage.getItem('useremail')}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {localStorage.getItem('userrole')}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" onClick={handleButtonClick}>
          Upload picture
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </CardActions>
    </Card>
  );
}
