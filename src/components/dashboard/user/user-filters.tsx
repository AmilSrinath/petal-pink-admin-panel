import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function UserFilters(): React.JSX.Element {
  return (
    <Card sx={{ p: 1 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search User"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px', maxHeight: '40px'}}
      />
    </Card>
  );
}
