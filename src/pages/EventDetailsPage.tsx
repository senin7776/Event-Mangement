import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, IndianRupee, Clock, User, ArrowLeft, UserPlus } from 'lucide-react';

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { state } = useEventContext();
  
  const event = state.events.find(e => e.id === eventId);
  const registrations = state.registrations.filter(r => r.eventId === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isFullyBooked = event.registeredCount >= event.maxParticipants;
  const isRegistrationClosed = new Date(event.registrationDeadline) < new Date();
  const canRegister = !isFullyBooked && !isRegistrationClosed;

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
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="gradient-card shadow-elegant animate-slide-up">
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">
                      <span className="mr-3 text-4xl">{getEventEmoji(event.type)}</span>
                      {event.title}
                    </CardTitle>
                    <Badge className="bg-primary text-primary-foreground">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm">at {event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Venue</p>
                      <p className="text-sm">{event.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {event.registeredCount}/{event.maxParticipants} Registered
                      </p>
                      <p className="text-sm">
                        {event.maxParticipants - event.registeredCount} spots remaining
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Registration Deadline</p>
                      <p className="text-sm">
                        {new Date(event.registrationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {event.registrationFee && (
                  <div className="flex items-center mb-6">
                    <IndianRupee className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        Registration Fee: ₹{event.registrationFee}
                      </p>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                <div>
                  <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Organized by</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Status */}
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="text-center">
                  {isRegistrationClosed ? (
                    <div>
                      <div className="text-4xl mb-4">⏰</div>
                      <h3 className="text-xl font-semibold text-destructive mb-2">
                        Registration Closed
                      </h3>
                      <p className="text-muted-foreground">
                        The registration deadline has passed.
                      </p>
                    </div>
                  ) : isFullyBooked ? (
                    <div>
                      <div className="text-4xl mb-4">🎉</div>
                      <h3 className="text-xl font-semibold text-orange-600 mb-2">
                        Event Fully Booked
                      </h3>
                      <p className="text-muted-foreground">
                        This event has reached maximum capacity.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-4">✨</div>
                      <h3 className="text-xl font-semibold text-primary mb-2">
                        Registration Open
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Secure your spot now! Only {event.maxParticipants - event.registeredCount} spots remaining.
                      </p>
                      <Link to={`/register?eventId=${event.id}`}>
                        <Button size="lg" className="gradient-primary">
                          <UserPlus className="h-5 w-5 mr-2" />
                          Register Now
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event Type</span>
                  <Badge>{event.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-semibold">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-semibold">{event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-semibold">
                    {event.registrationFee ? `₹${event.registrationFee}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-semibold">
                    {event.registeredCount}/{event.maxParticipants}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Registration Progress */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Registration Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Registered</span>
                    <span>{event.registeredCount} participants</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(event.registeredCount / event.maxParticipants) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span>{event.maxParticipants} max</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Event */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Share Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Spread the word about this amazing event!
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <span className="mr-2">🔗</span>
                  Copy Link (Demo)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;