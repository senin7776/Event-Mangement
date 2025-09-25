import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, IndianRupee, Clock } from 'lucide-react';
import { Event, EventType } from '@/contexts/EventContext';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

const getEventColor = (type: EventType): string => {
  const colors = {
    Marathon: 'bg-event-marathon',
    Cycling: 'bg-event-cycling',
    Walkathon: 'bg-event-walkathon',
    Yoga: 'bg-event-yoga',
    Zumba: 'bg-event-zumba',
    Swimming: 'bg-event-swimming',
    Hiking: 'bg-event-hiking',
  };
  return colors[type] || 'bg-primary';
};

const getEventEmoji = (type: EventType): string => {
  const emojis = {
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

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isFullyBooked = event.registeredCount >= event.maxParticipants;
  const isRegistrationClosed = new Date(event.registrationDeadline) < new Date();

  return (
    <Card className="gradient-card shadow-card hover:shadow-elegant transition-smooth animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
            {event.title}
          </CardTitle>
          <Badge 
            className={`${getEventColor(event.type)} text-white border-0 ml-2 flex-shrink-0`}
          >
            {getEventEmoji(event.type)} {event.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-2 text-primary" />
          <span>{event.registeredCount}/{event.maxParticipants} registered</span>
        </div>

        {event.registrationFee && (
          <div className="flex items-center text-sm text-muted-foreground">
            <IndianRupee className="h-4 w-4 mr-2 text-primary" />
            <span>₹{event.registrationFee}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>Register by {new Date(event.registrationDeadline).toLocaleDateString()}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Link to={`/event/${event.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          
          <Link 
            to={`/register?eventId=${event.id}`} 
            className="flex-1"
          >
            <Button 
              className="w-full gradient-primary"
              disabled={isFullyBooked || isRegistrationClosed}
            >
              {isFullyBooked ? 'Fully Booked' : 
               isRegistrationClosed ? 'Registration Closed' : 
               'Register Now'}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;