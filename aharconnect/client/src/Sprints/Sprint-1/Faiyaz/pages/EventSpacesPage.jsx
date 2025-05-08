import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Rating,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn,
  Event as EventIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

// ... existing styled components ...

export default function EventSpacesPage(props) {
  // ... existing state and hooks ...

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Spaces
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find the perfect venue for your next event
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search event spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                fullWidth
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocationOn />}
                onClick={() => setShowLocationFilter(!showLocationFilter)}
                fullWidth
              >
                Location
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Filters Section */}
      {showFilters && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Event Type"
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">All Event Types</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Capacity"
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Any Capacity</option>
                {capacityRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Price Range"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">All Prices</option>
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="capacity">Capacity</option>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Location Filter Section */}
      {showLocationFilter && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleLocationSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Distance (km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.label}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Event Spaces Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredEventSpaces.map((space) => (
            <Grid item key={space.id} xs={12} sm={6} md={4}>
              <EventSpaceCard
                space={space}
                onViewDetails={() => handleViewDetails(space.id)}
                onBookNow={() => handleBookNow(space)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Results Message */}
      {!loading && filteredEventSpaces.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No event spaces found matching your criteria
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog}>
        <DialogTitle>Book Event Space</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Event Date"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Number of Guests"
              type="number"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Event Type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              fullWidth
            />
            <TextField
              label="Special Requirements"
              multiline
              rows={4}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingDialog}>Cancel</Button>
          <Button onClick={handleSubmitBooking} variant="contained">
            Submit Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 