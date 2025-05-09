// React and routing imports
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

// Local imports
import Layout from '../../components/layout/Layout';
import { EventBookingConfirmation } from '../../components/customer/EventBookingConfirmation';
import { EventSpaceDetails } from '../../components/customer/EventSpaceDetails';
import { createEventBooking } from '../../../../../api/eventBookings';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Constants
const STEPS = ['Date & Time', 'Package Selection', 'Personal Details'];
const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', 
  '4:00 PM', '5:00 PM', '6:00 PM', 
  '7:00 PM', '8:00 PM'
];

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
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

// Custom Components
const DateTimeStep = ({ 
  selectedDate, onDateSelect, selectedStartTime, onStartTimeSelect,
  selectedEndTime, onEndTimeSelect, partySize, onPartySizeChange,
  availableTimeSlots, isCheckingAvailability, eventSpace
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={onDateSelect}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              sx: { mb: 2 }
            }
          }}
          disablePast
        />
      </LocalizationProvider>
    </Grid>

    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Select Time Slot
      </Typography>
    </Grid>

    <Grid item xs={12} md={6}>
      <FormControl 
        fullWidth 
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '56px',
            fontSize: '1.1rem'
          },
          '& .MuiInputLabel-root': {
            fontSize: '1.1rem'
          }
        }}
      >
        <InputLabel>Start Time</InputLabel>
        <Select
          value={selectedStartTime}
          onChange={(e) => onStartTimeSelect(e.target.value)}
          label="Start Time"
          disabled={isCheckingAvailability}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  fontSize: '1.1rem',
                  py: 1.5
                }
              }
            }
          }}
        >
          {isCheckingAvailability ? (
            <MenuItem disabled>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" />
                Checking availability...
              </Box>
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
      <FormControl 
        fullWidth 
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            height: '56px',
            fontSize: '1.1rem'
          },
          '& .MuiInputLabel-root': {
            fontSize: '1.1rem'
          }
        }}
      >
        <InputLabel>End Time</InputLabel>
        <Select
          value={selectedEndTime}
          onChange={(e) => onEndTimeSelect(e.target.value)}
          label="End Time"
          disabled={!selectedStartTime}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  fontSize: '1.1rem',
                  py: 1.5
                }
              }
            }
          }}
        >
          {!selectedStartTime ? (
            <MenuItem disabled>Select start time first</MenuItem>
          ) : (
            TIME_SLOTS
              .filter(time => {
                if (!selectedStartTime) return false;
                const startIndex = TIME_SLOTS.indexOf(selectedStartTime);
                const timeIndex = TIME_SLOTS.indexOf(time);
                return timeIndex > startIndex && 
                      timeIndex - startIndex >= (eventSpace?.minHours || 1);
              })
              .map(time => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))
          )}
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        type="number"
        label="Party Size"
        variant="outlined"
        value={partySize}
        onChange={(e) => onPartySizeChange(Number(e.target.value))}
        InputProps={{
          inputProps: { min: 1, max: eventSpace?.capacity }
        }}
        helperText={`Maximum capacity: ${eventSpace?.capacity}`}
      />
    </Grid>
  </Grid>
);

const PackageStep = ({ 
  eventPackages, selectedPackageId, onPackageSelect, 
  selectedDate, selectedStartTime, selectedEndTime, onBack 
}) => (
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
        onClick={onBack}
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
        key={pkg._id}
        variant="outlined"
        onClick={() => onPackageSelect(pkg._id)}
        sx={{
          border: selectedPackageId === pkg._id ? 2 : 1,
          borderColor: selectedPackageId === pkg._id ? 'primary.main' : 'divider'
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
                    variant={selectedPackageId === pkg._id ? "filled" : "outlined"}
                    color={selectedPackageId === pkg._id ? "primary" : "default"}
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
);

const PersonalDetailsStep = ({
  selectedPackage, onBack, customerName, onCustomerNameChange,
  customerEmail, onCustomerEmailChange, customerPhone, onCustomerPhoneChange,
  specialRequests, onSpecialRequestsChange
}) => (
  <Box component="form" onSubmit={(e) => e.preventDefault()}>
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
        onClick={onBack}
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
          onChange={(e) => onCustomerNameChange(e.target.value)}
          required
          error={customerName.trim() === ''}
          helperText={customerName.trim() === '' ? 'Name is required' : ''}
          inputProps={{
            maxLength: 100
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="email"
          label="Email"
          variant="outlined"
          value={customerEmail}
          onChange={(e) => onCustomerEmailChange(e.target.value)}
          required
          error={customerEmail.trim() === ''}
          helperText={customerEmail.trim() === '' ? 'Email is required' : ''}
          inputProps={{
            maxLength: 100
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone Number"
          variant="outlined"
          value={customerPhone}
          onChange={(e) => onCustomerPhoneChange(e.target.value)}
          required
          error={customerPhone.trim() === ''}
          helperText={customerPhone.trim() === '' ? 'Phone number is required' : ''}
          inputProps={{
            maxLength: 20
          }}
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
          onChange={(e) => onSpecialRequestsChange(e.target.value)}
          placeholder="Any special requirements or requests for your event..."
          inputProps={{
            maxLength: 500
          }}
        />
      </Grid>
    </Grid>
  </Box>
);

// Main Component
const EventBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  
  // Form state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [partySize, setPartySize] = useState(50);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // UI state
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Fetch event space data
  const { data: eventSpace, isLoading: isLoadingEventSpace } = useQuery({
    queryKey: ['eventSpace', id],
    queryFn: async () => {
      const response = await axios.get(`/api/event-reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.data) {
        throw new Error('Event space not found');
      }
      return response.data;
    },
    onError: (error) => {
      console.error('Error fetching event space:', error);
      toast.error('Failed to load event space details');
      navigate('/event-spaces');
    }
  });

  // Fetch event packages
  const { data: eventPackages = [], isLoading: isLoadingPackages } = useQuery({
    queryKey: ['eventPackages', eventSpace?.restaurantId],
    queryFn: async () => {
      const response = await axios.get(`/api/event-bookings/event-packages/${eventSpace?.restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    },
    enabled: !!eventSpace?.restaurantId,
    onError: (error) => {
      console.error('Error fetching event packages:', error);
      toast.error('Failed to load event packages');
    }
  });

  const selectedPackage = eventPackages.find(pkg => pkg._id === selectedPackageId);

  // Availability checking
  const checkTimeSlotAvailability = useCallback(async (date) => {
    if (!date || !eventSpace) return;
    setIsCheckingAvailability(true);
    
    try {
      const availableSlots = [];
      for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
        const startTime = new Date(`${format(date, 'yyyy-MM-dd')} ${TIME_SLOTS[i]}`);
        const endTime = new Date(`${format(date, 'yyyy-MM-dd')} ${TIME_SLOTS[i + eventSpace.minHours]}`);
        
        const response = await axios.get('/api/event-bookings/check-availability', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          params: {
            eventSpaceId: eventSpace.id,
            startDateTime: startTime.toISOString(),
            endDateTime: endTime.toISOString()
          }
        });

        if (response.data.available) {
          availableSlots.push(TIME_SLOTS[i]);
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

  // Event handlers
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedStartTime('');
    setSelectedEndTime('');
    if (date) {
      await checkTimeSlotAvailability(date);
    }
  };

  const validateBookingData = () => {
    const errors = [];
    if (!eventSpace?.id) errors.push('Event space not found');
    if (!eventSpace?.restaurantId) errors.push('Restaurant information is missing');
    if (!customerName.trim()) errors.push('Name is required');
    if (!customerEmail.trim()) errors.push('Email is required');
    if (!customerPhone.trim()) errors.push('Phone number is required');
    if (!selectedDate) errors.push('Date is required');
    if (!selectedStartTime) errors.push('Start time is required');
    if (!selectedEndTime) errors.push('End time is required');
    if (!selectedPackageId) errors.push('Please select a package');
    if (!partySize || partySize < 1) errors.push('Please enter a valid party size');

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleBookEvent = async () => {
    console.log('handleBookEvent called');
    if (!validateBookingData()) {
      console.log('Validation failed');
      return;
    }

    try {
      // Format dates properly
      const startTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedStartTime}`);
      const endTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedEndTime}`);
      console.log('Formatted dates:', { startTime, endTime });
      
      // Calculate total price
      const hours = Math.ceil((endTime - startTime) / (1000 * 60 * 60));
      const packagePrice = selectedPackage?.price || 0;
      const hourlyRate = eventSpace?.pricePerHour || 0;
      const totalPrice = packagePrice + (hours * hourlyRate);
      console.log('Price calculation:', { hours, packagePrice, hourlyRate, totalPrice });

      // Ensure we have all required IDs
      if (!eventSpace?.id || !eventSpace?.restaurantId || !selectedPackageId) {
        console.log('Missing required IDs:', {
          eventSpaceId: eventSpace?.id,
          restaurantId: eventSpace?.restaurantId,
          selectedPackageId
        });
        toast.error('Missing required information. Please try again.');
        return;
      }

      const bookingData = {
        eventSpaceId: eventSpace.id.toString(),
        restaurantId: eventSpace.restaurantId.toString(),
        eventPackageId: selectedPackageId.toString(),
        startDateTime: startTime.toISOString(),
        endDateTime: endTime.toISOString(),
        numberOfGuests: parseInt(partySize, 10),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        specialRequests: specialRequests.trim()
      };
      console.log('Prepared booking data:', bookingData);

      try {
        console.log('Calling createEventBooking API...');
        const response = await createEventBooking(bookingData);
        console.log('API response:', response);
        
        if (!response?._id) {
          console.error('Invalid response - no _id:', response);
          throw new Error('Invalid response from server');
        }
        
        setBookingRef(response._id);
        toast.success('Your event has been booked successfully!');
        setBookingComplete(true);
      } catch (error) {
        console.error('API Error:', error);
        console.error('Error details:', {
          message: error?.message,
          response: error?.response,
          data: error?.response?.data
        });
        const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create booking';
        toast.error(errorMessage);
        throw error;
      }
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error stack:', error?.stack);
      toast.error('An unexpected error occurred. Please try again.');
      throw error;
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
            onContactRestaurant={() => toast.success('Message sent to restaurant. They will contact you shortly.')}
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
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4, mb: 2 }}>
              {currentStep === 1 && (
                <DateTimeStep
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  selectedStartTime={selectedStartTime}
                  onStartTimeSelect={setSelectedStartTime}
                  selectedEndTime={selectedEndTime}
                  onEndTimeSelect={setSelectedEndTime}
                  partySize={partySize}
                  onPartySizeChange={setPartySize}
                  availableTimeSlots={availableTimeSlots}
                  isCheckingAvailability={isCheckingAvailability}
                  eventSpace={eventSpace}
                />
              )}

              {currentStep === 2 && (
                <PackageStep
                  eventPackages={eventPackages}
                  selectedPackageId={selectedPackageId}
                  onPackageSelect={setSelectedPackageId}
                  selectedDate={selectedDate}
                  selectedStartTime={selectedStartTime}
                  selectedEndTime={selectedEndTime}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <PersonalDetailsStep
                  selectedPackage={selectedPackage}
                  onBack={() => setCurrentStep(2)}
                  customerName={customerName}
                  onCustomerNameChange={setCustomerName}
                  customerEmail={customerEmail}
                  onCustomerEmailChange={setCustomerEmail}
                  customerPhone={customerPhone}
                  onCustomerPhoneChange={setCustomerPhone}
                  specialRequests={specialRequests}
                  onSpecialRequestsChange={setSpecialRequests}
                />
              )}

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  type={currentStep === 3 ? "submit" : "button"}
                  disabled={
                    isLoadingEventSpace || 
                    isLoadingPackages || 
                    (currentStep === 3 && (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()))
                  }
                  onClick={async (e) => {
                    if (currentStep === 3) {
                      e.preventDefault();
                    }
                    
                    console.log('Button clicked, current step:', currentStep);
                    try {
                      if (currentStep === 1) {
                        if (!selectedDate || !selectedStartTime || !selectedEndTime) {
                          toast.error('Please select a date and time for your event');
                          return;
                        }
                        console.log('Moving to step 2');
                        setCurrentStep(2);
                      } else if (currentStep === 2) {
                        if (!selectedPackageId) {
                          toast.error('Please select a package');
                          return;
                        }
                        console.log('Moving to step 3');
                        setCurrentStep(3);
                      } else {
                        console.log('Attempting to book event with data:', {
                          eventSpaceId: eventSpace?.id,
                          restaurantId: eventSpace?.restaurantId,
                          selectedPackageId,
                          customerName,
                          customerEmail,
                          customerPhone,
                          partySize,
                          selectedDate: selectedDate?.toISOString(),
                          selectedStartTime,
                          selectedEndTime
                        });
                        await handleBookEvent();
                      }
                    } catch (error) {
                      console.error('Error in button click handler:', error);
                      toast.error('An error occurred. Please try again.');
                    }
                  }}
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
