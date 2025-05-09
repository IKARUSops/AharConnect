import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// Material UI imports
import {
  Button,
  TextField,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack,
  Person,
  Event,
  Schedule,
  Message,
  Check,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { toast } from 'sonner';
import Layout from '../../components/layout/Layout';
import { EventBookingConfirmation } from '../../components/customer/EventBookingConfirmation';
import { EventSpaceDetails } from '../../components/customer/EventSpaceDetails';
import { createEventBooking } from '../../../../../api/eventBookings';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

// Mock time slots - we'll keep this until we implement dynamic time slots from the backend
const mockTimeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', 
  '4:00 PM', '5:00 PM', '6:00 PM', 
  '7:00 PM', '8:00 PM'
];

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: 'lg',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
  background: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: theme.palette.primary.main
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  }
}));

const PageHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '& h1': {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  '& .subtitle': {
    fontSize: '1.125rem',
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const LoadingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
}));

const EventBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [partySize, setPartySize] = useState(50);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const steps = ['Date & Time', 'Package Selection', 'Personal Details'];

  // Fetch event space data
  const { data: eventSpace, isLoading: isLoadingEventSpace } = useQuery({
    queryKey: ['eventSpace', id],
    queryFn: async () => {
      const response = await axios.get(`/api/event-reservations/${id}`);
      return response.data;
    },
    onError: (error) => {
      console.error('Error fetching event space:', error);
      toast.error('Failed to load event space details');
    }
  });

  // Fetch event packages
  const { data: eventPackages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['eventPackages', eventSpace?.restaurantId],
    queryFn: async () => {
      const response = await axios.get(`/api/event-packages/${eventSpace?.restaurantId}`);
      return response.data;
    },
    enabled: !!eventSpace?.restaurantId,
    onError: (error) => {
      console.error('Error fetching event packages:', error);
      toast.error('Failed to load event packages');
    }
  });

  const selectedPackage = eventPackages.find(pkg => pkg.id === selectedPackageId);

  const isDateAvailable = async (date) => {
    try {
      const startDateTime = new Date(date);
      startDateTime.setHours(9, 0, 0, 0);
      const endDateTime = new Date(date);
      endDateTime.setHours(21, 0, 0, 0);
      
      const response = await axios.get('/api/event-bookings/check-availability', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        params: {
          eventSpaceId: id,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString()
        }
      });
      
      return response.data.isAvailable;
    } catch (error) {
      console.error('Error checking date availability:', error);
      toast.error('Failed to check date availability');
      return false;
    }
  };

  const checkTimeSlotAvailability = useCallback(async (date) => {
    if (!date || !eventSpace) return;
    setIsCheckingAvailability(true);
    
    try {
      const availableSlots = [];
      for (let i = 0; i < mockTimeSlots.length - 1; i++) {
        const startTime = new Date(`${format(date, 'yyyy-MM-dd')} ${mockTimeSlots[i]}`);
        const endTime = new Date(`${format(date, 'yyyy-MM-dd')} ${mockTimeSlots[i + eventSpace.minHours]}`);
        
        const response = await axios.get('/api/event-bookings/check-availability', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          params: {
            eventSpaceId: id,
            startDateTime: startTime.toISOString(),
            endDateTime: endTime.toISOString()
          }
        });

        if (response.data.isAvailable) {
          availableSlots.push(mockTimeSlots[i]);
        }
      }
      setAvailableTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      toast.error('Failed to check time slot availability');
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [id, eventSpace?.minHours]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedStartTime('');
    setSelectedEndTime('');
    if (date) {
      await checkTimeSlotAvailability(date);
    }
  };

  const handleContinueToPackages = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      toast.error('Please select a date and time for your event');
      return;
    }
    setCurrentStep(2);
  };

  const handleContinueToDetails = async () => { // Marking the function as async
    const errors = []; // Ensure errors array is defined
    if (!selectedPackageId) {
      if (!customerPhone.trim()) errors.push('Phone number is required');
      if (!selectedDate) errors.push('Date is required');
      if (!selectedStartTime) errors.push('Start time is required');
      if (!selectedEndTime) errors.push('End time is required');
      if (!selectedPackageId) errors.push('Please select a package');

      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Phone validation
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(customerPhone)) {
        toast.error('Please enter a valid phone number');
        return;
      }

      try {
        // Check availability
        const isAvailable = await checkEventSpaceAvailability(
          eventSpace.id,
          new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedStartTime}`),
          new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedEndTime}`)
        );

        if (!isAvailable.available) {
          toast.error('This time slot is no longer available. Please select a different time.');
          return;
        }

        // Create booking
        const startTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedStartTime}`);
        const endTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedEndTime}`);
        const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
        const totalPrice = (selectedPackage.price || 0) + (hours * eventSpace.pricePerHour);

        const bookingData = {
          eventSpaceId: eventSpace.id,
          startDateTime: startTime,
          endDateTime: endTime,
          numberOfGuests: partySize,
          eventPackageId: selectedPackageId,
          totalPrice,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          specialRequests: specialRequests.trim(),
          restaurantId: eventSpace.restaurantId
        };

        const booking = await createEventBooking(bookingData);
        setBookingRef(booking.id);

        toast.success('Your event has been booked successfully!');
        setBookingComplete(true);
      } catch (error) {
        console.error('Booking error:', error);
        toast.error(error.response?.data?.error || 'Failed to create booking. Please try again.');
      }
    }
  };

  const handleContactRestaurant = () => {
    toast.success('Message sent to restaurant. They will contact you shortly.');
  };

  // Define the checkEventSpaceAvailability function
  const checkEventSpaceAvailability = async (eventSpaceId, startDateTime, endDateTime) => {
    try {
      const response = await axios.get('/api/event-bookings/check-availability', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        params: {
          eventSpaceId,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking event space availability:', error);
      throw new Error('Failed to check event space availability');
    }
  };

  // Define the handleBookEvent function
  const handleBookEvent = async () => {
    if (!selectedPackageId || !selectedDate || !selectedStartTime || !selectedEndTime) {
      toast.error('Please complete all required fields before booking.');
      return;
    }

    try {
      const startTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedStartTime}`);
      const endTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedEndTime}`);
      const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
      const totalPrice = (selectedPackage?.price || 0) + (hours * eventSpace?.pricePerHour);

      const bookingData = {
        eventSpaceId: eventSpace?.id,
        startDateTime: startTime,
        endDateTime: endTime,
        numberOfGuests: partySize,
        eventPackageId: selectedPackageId,
        totalPrice,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        specialRequests: specialRequests.trim(),
        restaurantId: eventSpace?.restaurantId,
      };

      const booking = await createEventBooking(bookingData);
      setBookingRef(booking.id);
      toast.success('Your event has been booked successfully!');
      setBookingComplete(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  if (bookingComplete) {
    return (
      <Layout>
        <StyledContainer maxWidth="lg">
          <EventBookingConfirmation 
            bookingRef={bookingRef}
            eventSpace={eventSpace}
            eventPackage={selectedPackage}
            date={selectedDate}
            startTime={selectedStartTime}
            endTime={selectedEndTime}
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
            specialRequests={specialRequests}
            partySize={partySize}
            onContactRestaurant={handleContactRestaurant}
          />
        </StyledContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <StyledContainer maxWidth="lg">
        <PageHeader>
          <Button
            startIcon={<ArrowBack />}
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ 
              '&:hover': {
                backgroundColor: alpha('#000', 0.04)
              }
            }}
          >
            Back to Event Spaces
          </Button>
          <Typography variant="h1">{eventSpace?.name}</Typography>
          <Typography className="subtitle">
            <LocationOn /> {eventSpace?.restaurantName} - {eventSpace?.address}
          </Typography>
        </PageHeader>

        <ErrorBoundary>
          <EventSpaceDetails eventSpace={eventSpace} />
        </ErrorBoundary>

        <StyledPaper>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={currentStep - 1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4, mb: 2 }}>
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={handleDateSelect}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: "outlined",
                            sx: { mb: 2 }
                          }
                        }}
                        disablePast
                        shouldDisableDate={(date) => !isDateAvailable(date)}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Start Time</InputLabel>
                      <Select
                        value={selectedStartTime}
                        onChange={(e) => setSelectedStartTime(e.target.value)}
                        label="Start Time"
                        disabled={isCheckingAvailability}
                      >
                        {isCheckingAvailability ? (
                          <MenuItem disabled>
                            <LoadingIndicator>
                              <AccessTime fontSize="small" />
                              Checking availability...
                            </LoadingIndicator>
                          </MenuItem>
                        ) : (
                          availableTimeSlots.map(time => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>End Time</InputLabel>
                      <Select
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                        label="End Time"
                        disabled={!selectedStartTime}
                      >
                        {!selectedStartTime ? (
                          <MenuItem disabled>Select start time first</MenuItem>
                        ) : (
                          mockTimeSlots
                            .filter(time => {
                              if (!selectedStartTime) return false;
                              const startIndex = mockTimeSlots.indexOf(selectedStartTime);
                              const timeIndex = mockTimeSlots.indexOf(time);
                              return timeIndex > startIndex && 
                                    timeIndex - startIndex >= eventSpace?.minHours;
                            })
                            .map(time => (
                              <MenuItem key={time} value={time}>{time}</MenuItem>
                            ))
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Party Size"
                      variant="outlined"
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      InputProps={{
                        inputProps: { min: 1, max: eventSpace?.capacity }
                      }}
                      helperText={`Maximum capacity: ${eventSpace?.capacity}`}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 2: Package Selection */}
              {currentStep === 2 && (
                <Box>
                  <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Selected Date & Time
                    </Typography>
                    <Typography color="text.secondary">
                      {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                      {selectedStartTime && selectedEndTime && `, ${selectedStartTime} - ${selectedEndTime}`}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Event />}
                      onClick={() => setCurrentStep(1)}
                      sx={{ mt: 1 }}
                    >
                      Change Date & Time
                    </Button>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Select an Event Package
                  </Typography>

                  {eventPackages.map(pkg => (
                    <StyledCard
                      key={pkg.id}
                      variant="outlined"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      sx={{
                        border: selectedPackageId === pkg.id ? 2 : 1,
                        borderColor: selectedPackageId === pkg.id ? 'primary.main' : 'divider'
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                              {pkg.name}
                            </Typography>
                            <Typography color="text.secondary" paragraph>
                              {pkg.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Person sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                Up to {pkg.maxCapacity} guests
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {pkg.amenities.map((amenity, index) => (
                                <Chip
                                  key={index}
                                  label={amenity}
                                  size="small"
                                  variant={selectedPackageId === pkg.id ? "filled" : "outlined"}
                                  color={selectedPackageId === pkg.id ? "primary" : "default"}
                                />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="h5" color="primary" fontWeight="bold">
                              ${pkg.price.toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </StyledCard>
                  ))}
                </Box>
              )}

              {/* Step 3: Personal Details */}
              {currentStep === 3 && (
                <Box>
                  <Box sx={{ mb: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Selected Package
                    </Typography>
                    <Typography color="text.secondary">
                      {selectedPackage?.name} - ${selectedPackage?.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<Event />}
                      onClick={() => setCurrentStep(2)}
                      sx={{ mt: 1 }}
                    >
                      Change Package
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="Email"
                        variant="outlined"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Special Requests"
                        variant="outlined"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requirements or requests for your event..."
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={currentStep === 1 ? handleContinueToPackages : 
                          currentStep === 2 ? handleContinueToDetails : 
                          handleBookEvent}
                  disabled={
                    (currentStep === 1 && (!selectedDate || !selectedStartTime || !selectedEndTime)) ||
                    (currentStep === 2 && !selectedPackageId) ||
                    (currentStep === 3 && (!customerName || !customerEmail || !customerPhone))
                  }
                >
                  {currentStep === 1 ? 'Continue to Packages' :
                   currentStep === 2 ? 'Continue to Details' :
                   'Complete Booking'}
                </Button>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Need to discuss something specific?
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Message />}
              onClick={() => navigate(`/events/message/${eventSpace?.id}`)}
              sx={{ mt: 1 }}
            >
              Message Restaurant Directly
            </Button>
          </Box>
        </StyledPaper>
      </StyledContainer>
    </Layout>
  );
};

export default EventBookingPage;
