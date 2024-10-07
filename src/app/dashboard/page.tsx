import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { Sales } from '@/components/dashboard/overview/sales';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { FaSitemap } from 'react-icons/fa6';
import { FaUser, FaDollarSign, FaChartLine } from 'react-icons/fa';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers
          diff={16}
          trend="up"
          sx={{ height: '100%' }}
          value="Rs. 99999"
          icon={<FaDollarSign />} // Custom icon
          name="Profit"
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers
          diff={16}
          trend="down"
          sx={{ height: '100%' }}
          value="1600"
          icon={<FaUser />} // Another custom icon
          name="Customers"
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers
          diff={16}
          trend="up"
          sx={{ height: '100%' }}
          value="1.6k"
          icon={<FaChartLine />} // Another icon
          name="Reaches"
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers
          diff={16}
          trend="down"
          sx={{ height: '100%' }}
          value="1.6k"
          icon={<FaSitemap />} // Another icon
          name="Losses"
        />
      </Grid>

      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />*/}
      {/*</Grid>*/}
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />*/}
      {/*</Grid>*/}
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <TasksProgress sx={{ height: '100%' }} value={75} />*/}
      {/*</Grid>*/}
      {/*<Grid lg={3} sm={6} xs={12}>*/}
      {/*  <TotalProfit sx={{ height: '100%' }} value="$15k" />*/}
      {/*</Grid>*/}

      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            // { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      {/*<Grid lg={4} md={6} xs={12}>*/}
      {/*  <LatestProducts*/}
      {/*    products={[*/}
      {/*      {*/}
      {/*        id: 'PRD-005',*/}
      {/*        name: 'Soja & Co. Eucalyptus',*/}
      {/*        image: '/assets/product-5.png',*/}
      {/*        updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-004',*/}
      {/*        name: 'Necessaire Body Lotion',*/}
      {/*        image: '/assets/product-4.png',*/}
      {/*        updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-003',*/}
      {/*        name: 'Ritual of Sakura',*/}
      {/*        image: '/assets/product-3.png',*/}
      {/*        updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-002',*/}
      {/*        name: 'Lancome Rouge',*/}
      {/*        image: '/assets/product-2.png',*/}
      {/*        updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),*/}
      {/*      },*/}
      {/*      {*/}
      {/*        id: 'PRD-001',*/}
      {/*        name: 'Erbology Aloe Vera',*/}
      {/*        image: '/assets/product-1.png',*/}
      {/*        updatedAt: dayjs().subtract(10, 'minutes').toDate(),*/}
      {/*      },*/}
      {/*    ]}*/}
      {/*    sx={{ height: '100%' }}*/}
      {/*  />*/}
      {/*</Grid>*/}
    </Grid>
  );
}
