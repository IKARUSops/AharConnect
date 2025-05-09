import React from "react";
import { Card, CardContent, CardMedia, CardActions, Typography, Box, Chip, Rating, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from 'lucide-react';

export function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  const handleViewMenu = () => {
    navigate(`/restaurants/${restaurant.user || restaurant.id || restaurant._id}/menu`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'}
        alt={restaurant.name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            {restaurant.name}
          </Typography>
          {typeof restaurant.rating === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'warning.light', px: 1, py: 0.5, borderRadius: 1 }}>
              <Rating value={restaurant.rating} precision={0.5} size="small" readOnly />
              <Typography variant="body2" sx={{ ml: 0.5, color: 'warning.dark' }}>
                {restaurant.rating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {restaurant.description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {restaurant.cuisineType?.map((cuisine, index) => (
            <Chip
              key={index}
              label={cuisine}
              size="small"
              sx={{ 
                bgcolor: 'primary.light',
                color: 'primary.dark',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {restaurant.priceRange}
          </Typography>
          {restaurant.openingHours && (
            <Typography variant="body2" color="text.secondary">
              {restaurant.openingHours.opening} - {restaurant.openingHours.closing}
            </Typography>
          )}
        </Box>

        {/* Location and Distance Info */}
        {(restaurant.distance !== undefined || restaurant.matchType) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MapPin size={16} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {typeof restaurant.distance === 'number' && (
                <Typography variant="body2" color="text.secondary">
                  {restaurant.distance.toFixed(1)} km away
                </Typography>
              )}
              {restaurant.matchType && (
                <Chip
                  size="small"
                  label={restaurant.matchType === 'both' ? 'Exact Location Match' :
                         restaurant.matchType === 'coordinates' ? 'Near You' :
                         'Address Match'}
                  sx={{ 
                    bgcolor: restaurant.matchType === 'both' ? 'success.light' :
                           restaurant.matchType === 'coordinates' ? 'info.light' :
                           'warning.light',
                    color: restaurant.matchType === 'both' ? 'success.dark' :
                           restaurant.matchType === 'coordinates' ? 'info.dark' :
                           'warning.dark',
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
        <Button
          onClick={handleViewMenu}
          variant="outlined"
          fullWidth
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          View Menu
        </Button>
        <Button
          component={Link}
          to={`/restaurants/${restaurant.id || restaurant._id}/reserve`}
          variant="contained"
          fullWidth
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Reserve
        </Button>
      </CardActions>
    </Card>
  );
}
