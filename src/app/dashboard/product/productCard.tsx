import * as React from 'react';
import { Card, CardContent, CardMedia, Grid, Typography, Box, IconButton } from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye'; // Import the Eye icon
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PencilSimple } from '@phosphor-icons/react';
export default function ProductCards({ products, onEditProduct }: { products: any[], onEditProduct: (product: any) => void }) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.product_id}>

          <Card
            sx={{
              maxWidth: 345,
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {/* Pencil Icon to Edit */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
              }}
              onClick={() => onEditProduct(product)}
            >
              <PencilSimple size={28} color="#15B392" />
            </IconButton>

            {/* Image Slider */}
            <Box sx={{ position: 'relative' }}>
              <Slider {...sliderSettings}>
                {product.image_url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${product.image_url}`}
                    alt={product.product_name}
                    sx={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                {product.image_url_2 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${product.image_url_2}`}
                    alt={product.product_name}
                    sx={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
                {product.image_url_3 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`data:image/jpeg;base64,${product.image_url_3}`}
                    alt={product.product_name}
                    sx={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                )}
              </Slider>
            </Box>

            {/* Card Content */}
            <CardContent sx={{ padding: 2 }}>
              {/* Product Name */}
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}
              >
                {product.product_name}
              </Typography>

              {/* Product Price and Discount */}
              <Box display="flex" alignItems="center">
                {/* Original Price with Strikethrough */}
                {product.discount && (
                  <Typography
                    variant="body2"
                    color={'#F44336'}
                    fontSize={22}
                    sx={{ textDecoration: 'line-through', fontWeight: 'bold', mr: 2 }}
                  >
                    Rs. {product.product_price}
                  </Typography>
                )}

                {/* Discounted Price without Strikethrough */}
                <Typography variant="body2" color={'#15B392'} fontSize={22} sx={{ fontWeight: 'bold' }}>
                  Rs. {product.discount || product.product_price}
                </Typography>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
