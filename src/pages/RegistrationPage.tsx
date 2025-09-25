import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, User, MapPin, Heart, Users, CheckCircle } from 'lucide-react';
import OTPVerification from '@/components/auth/OTPVerification';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  tshirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '';
  medicalConditions: string;
  hearAboutUs: string;
  emergencyContact: string;
  pincode: string;
  address: string;
}

const RegistrationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, dispatch } = useEventContext();
  const { toast } = useToast();
  
  const eventId = searchParams.get('eventId');
  const selectedEvent = state.events.find(event => event.id === eventId);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: '',
    tshirtSize: '',
    medicalConditions: '',
    hearAboutUs: '',
    emergencyContact: '',
    pincode: '',
    address: '',
  });

  useEffect(() => {
    if (!selectedEvent) {
      toast({
        title: "Event not found",
        description: "Please select an event to register for.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [selectedEvent, navigate, toast]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneSubmit = () => {
    if (!formData.phone || formData.phone.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    dispatch({ type: 'GENERATE_OTP', payload: { phone: formData.phone } });
    setShowOTP(true);
    toast({
      title: "OTP Sent",
      description: `Verification code sent to ${formData.phone}. (Code: ${state.otp.code})`,
    });
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setCurrentStep(2);
    toast({
      title: "Phone verified!",
      description: "You can now continue with your registration.",
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'gender', 'tshirtSize', 'hearAboutUs', 'emergencyContact', 'pincode', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEvent) return;

    const registration = {
      id: `REG${Date.now()}`,
      eventId: selectedEvent.id,
      ...formData,
      gender: formData.gender as 'Male' | 'Female' | 'Other',
      tshirtSize: formData.tshirtSize as 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL',
      eventType: selectedEvent.type,
      registrationDate: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_REGISTRATION', payload: registration });
    
    toast({
      title: "Registration successful!",
      description: `You're registered for ${selectedEvent.title}. Registration ID: ${registration.id}`,
    });

    navigate(`/confirmation/${registration.id}`);
  };

  if (!selectedEvent) {
    return null;
  }

  if (showOTP) {
    return (
      <OTPVerification
        phone={formData.phone}
        onVerified={handleOTPVerified}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Event Info */}
        <Card className="gradient-card shadow-card mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">
                {selectedEvent.type === 'Marathon' && '🏃'}
                {selectedEvent.type === 'Cycling' && '🚴'}
                {selectedEvent.type === 'Walkathon' && '🚶'}
                {selectedEvent.type === 'Yoga' && '🧘'}
                {selectedEvent.type === 'Zumba' && '💃'}
                {selectedEvent.type === 'Swimming' && '🏊'}
                {selectedEvent.type === 'Hiking' && '🏔️'}
              </span>
              {selectedEvent.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {selectedEvent.venue}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2 text-primary" />
                {selectedEvent.registeredCount}/{selectedEvent.maxParticipants} registered
              </div>
            </div>
            <Badge className="mt-3 bg-primary">
              Registration Fee: {selectedEvent.registrationFee ? `₹${selectedEvent.registrationFee}` : 'Free'}
            </Badge>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card className="shadow-elegant animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 ? (
                <>
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Verification
                </>
              ) : (
                <>
                  <User className="h-5 w-5 text-primary" />
                  Registration Details
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStep === 1 ? (
              // Step 1: Phone Verification
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    maxLength={10}
                  />
                </div>
                
                <Button 
                  onClick={handlePhoneSubmit}
                  className="w-full gradient-primary"
                >
                  Send OTP
                </Button>
              </div>
            ) : (
              // Step 2: Personal Details
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Gender *</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => handleInputChange('gender', value)}
                      className="flex flex-row gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="tshirtSize">T-Shirt Size *</Label>
                    <Select value={formData.tshirtSize} onValueChange={(value) => handleInputChange('tshirtSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Medical Information
                  </h3>
                  
                  <div>
                    <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                    <Textarea
                      id="medicalConditions"
                      placeholder="Any medical conditions we should know about..."
                      value={formData.medicalConditions}
                      onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                    <Input
                      id="emergencyContact"
                      type="tel"
                      placeholder="Emergency contact number"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Additional Information
                  </h3>

                  <div>
                    <Label htmlFor="hearAboutUs">How did you hear about us? *</Label>
                    <Select value={formData.hearAboutUs} onValueChange={(value) => handleInputChange('hearAboutUs', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Posters">Posters</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="text"
                      placeholder="Your area pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Your complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full gradient-primary"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Registration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;