"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";

export function ShippingCost(): React.JSX.Element {
  const [priceFirstKilo, setPriceFirstKilo] = useState('');
  const [priceAddedKilo, setPriceAddedKilo] = useState('');

  // Fetch initial data for the shipping cost from the API
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/configuration/getAllConfig', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch configuration');
        }

        const data = await response.json();
        const configs = data.configs;

        // Find the price-of-the-first-kilo and price-of-the-added-kilo from the response
        const firstKiloConfig = configs.find((config: any) => config.config_name === 'price-of-the-first-kilo');
        const addedKiloConfig = configs.find((config: any) => config.config_name === 'price-of-the-added-kilo');

        // Set the initial values in the form
        if (firstKiloConfig) setPriceFirstKilo(firstKiloConfig.config_value);
        if (addedKiloConfig) setPriceAddedKilo(addedKiloConfig.config_value);

      } catch (error) {
        console.error('Error fetching configurations:', error);
        Swal.fire({
          title: "Error",
          text: "Failed to load configurations",
          icon: "error"
        });
      }
    };

    fetchConfigs();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Define the user_id for both configurations
    const userId = localStorage.getItem('userid');

    // First configuration (price-of-the-first-kilo)
    const firstKiloConfig = {
      config_name: 'price-of-the-first-kilo',
      config_value: priceFirstKilo,
      user_id: userId,
    };

    // Second configuration (price-of-the-added-kilo)
    const addedKiloConfig = {
      config_name: 'price-of-the-added-kilo',
      config_value: priceAddedKilo,
      user_id: userId,
    };

    try {
      // Send the first request
      const responseFirst = await fetch('http://localhost:4000/api/configuration/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firstKiloConfig),
      });

      if (!responseFirst.ok) {
        throw new Error('Failed to save first kilo configuration');
      }

      // Send the second request
      const responseSecond = await fetch('http://localhost:4000/api/configuration/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addedKiloConfig),
      });

      if (!responseSecond.ok) {
        throw new Error('Failed to save added kilo configuration');
      }
      Swal.fire({
        title: "Success",
        text: "Configuration saved successfully!",
        icon: "success"
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      Swal.fire({
        title: "Error",
        text: "Failed to save configuration",
        icon: "error"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Courier Cost" title="Courier"/>
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Price of the first kilo</InputLabel>
              <OutlinedInput
                label="Price of the first kilo"
                name="price-of-the-first-kilo"
                value={priceFirstKilo}
                onChange={(e) => { setPriceFirstKilo(e.target.value); }} // Capture the value
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle first kilo price visibility" edge="end" />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Price of the added kilo</InputLabel>
              <OutlinedInput
                label="Price of the added kilo"
                name="price-of-the-added-kilo"
                value={priceAddedKilo}
                onChange={(e) => { setPriceAddedKilo(e.target.value); }} // Capture the value
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle added kilo price visibility" edge="end" />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save Cost
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
