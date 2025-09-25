import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, MapPin, User, Phone, Mail, Home, Download } from 'lucide-react';

const ConfirmationPage = () => {
  const { registrationId } = useParams<{ registrationId: string }>();
  const { state } = useEventContext();
  
  const registration = state.registrations.find(r => r.id === registrationId);
  const event = registration ? state.events.find(e => e.id === registration.eventId) : null;

  if (!registration || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Registration Not Found</h2>
            <p className="text-muted-foreground mb-4">We couldn't find your registration details.</p>
            <Link to="/">
              <Button>Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getEventEmoji = (type: string): string => {
    const emojis: { [key: string]: string } = {
      Marathon: '🏃',
      Cycling: '🚴',
      Walkathon: '🚶',
      Yoga: '🧘',
      Zumba: '💃',
      Swimming: '🏊',
      Hiking: '🏔️',
    };
    return emojis[type] || '🎯';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <Card className="gradient-card shadow-elegant mb-8 animate-bounce-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Registration Successful!
            </CardTitle>
            <p className="text-muted-foreground">
              You're all set for the event. We'll send you updates as the date approaches.
            </p>
          </CardHeader>
        </Card>

        {/* Registration Details */}
        <Card className="shadow-card mb-8 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{getEventEmoji(event.type)}</span>
              {event.title}
            </CardTitle>
            <Badge className="w-fit bg-primary">
              Registration ID: {registration.id}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Event Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Date & Time</p>
                    <p className="text-sm">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Venue</p>
                    <p className="text-sm">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Participant Details */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Participant Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-semibold">{registration.firstName} {registration.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-semibold">{registration.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">T-Shirt Size</p>
                  <p className="font-semibold">{registration.tshirtSize}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Event Type</p>
                  <p className="font-semibold">{registration.eventType}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-sm">{registration.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-sm">{registration.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Emergency Contact</p>
                    <p className="text-sm">{registration.emergencyContact}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Home className="h-4 w-4 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Pincode</p>
                    <p className="text-sm">{registration.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {registration.medicalConditions && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Medical Conditions</h3>
                  <p className="text-muted-foreground">{registration.medicalConditions}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Registration Info */}
            <div className="bg-accent/30 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Registration Date</p>
                  <p className="font-semibold">
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">How you heard about us</p>
                  <p className="font-semibold">{registration.hearAboutUs}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 animate-fade-in">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-lg">What's Next?</h3>
                <p className="text-muted-foreground">
                  Save your registration details and mark your calendar! We'll send you event updates 
                  and reminders as the date approaches.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF (Demo)
                  </Button>
                  
                  <Link to="/" className="flex-1">
                    <Button className="w-full gradient-primary">
                      Browse More Events
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/20 border-accent">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Important Reminder</h4>
                  <p className="text-sm text-muted-foreground">
                    Please arrive at the venue 30 minutes before the event start time. 
                    Bring a valid ID for verification and wear comfortable clothing appropriate for the activity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;