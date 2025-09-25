import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventContext, EventType } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, IndianRupee, PlusCircle, Clock, FileText } from 'lucide-react';

interface EventFormData {
  title: string;
  type: EventType | '';
  date: string;
  time: string;
  venue: string;
  registrationDeadline: string;
  maxParticipants: string;
  registrationFee: string;
  description: string;
  organizer: string;
}

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useEventContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: '',
    date: '',
    time: '',
    venue: '',
    registrationDeadline: '',
    maxParticipants: '',
    registrationFee: '',
    description: '',
    organizer: '',
  });

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['title', 'type', 'date', 'time', 'venue', 'registrationDeadline', 'maxParticipants', 'description', 'organizer'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof EventFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const eventDate = new Date(formData.date);
    const deadlineDate = new Date(formData.registrationDeadline);
    const today = new Date();
    
    if (eventDate <= today) {
      toast({
        title: "Invalid date",
        description: "Event date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    if (deadlineDate >= eventDate) {
      toast({
        title: "Invalid deadline",
        description: "Registration deadline must be before the event date.",
        variant: "destructive",
      });
      return;
    }

    const newEvent = {
      id: `EVT${Date.now()}`,
      title: formData.title,
      type: formData.type as EventType,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      registrationDeadline: formData.registrationDeadline,
      maxParticipants: parseInt(formData.maxParticipants),
      registrationFee: formData.registrationFee ? parseInt(formData.registrationFee) : undefined,
      description: formData.description,
      organizer: formData.organizer,
      registeredCount: 0,
    };

    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    
    toast({
      title: "Event created successfully!",
      description: `${newEvent.title} has been added to the events list.`,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-elegant animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PlusCircle className="h-6 w-6 text-primary" />
              Create New Event
            </CardTitle>
            <p className="text-muted-foreground">
              Fill in the details below to create and publish a new event for participants to register.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Basic Information
              </h3>
              
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mumbai Marathon 2024"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marathon">🏃 Marathon</SelectItem>
                    <SelectItem value="Cycling">🚴 Cycling</SelectItem>
                    <SelectItem value="Walkathon">🚶 Walkathon</SelectItem>
                    <SelectItem value="Yoga">🧘 Yoga</SelectItem>
                    <SelectItem value="Zumba">💃 Zumba</SelectItem>
                    <SelectItem value="Swimming">🏊 Swimming</SelectItem>
                    <SelectItem value="Hiking">🏔️ Hiking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="organizer">Organizer Name *</Label>
                <Input
                  id="organizer"
                  placeholder="Your name or organization"
                  value={formData.organizer}
                  onChange={(e) => handleInputChange('organizer', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, what participants can expect..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Date & Time
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Event Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                />
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location & Capacity
              </h3>
              
              <div>
                <Label htmlFor="venue">Venue/Location *</Label>
                <Input
                  id="venue"
                  placeholder="e.g., Marine Drive, Mumbai"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxParticipants">Maximum Participants *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                />
              </div>
            </div>

            {/* Registration Fee */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                Registration Fee
              </h3>
              
              <div>
                <Label htmlFor="registrationFee">Registration Fee (Optional)</Label>
                <Input
                  id="registrationFee"
                  type="number"
                  placeholder="Leave empty for free events"
                  value={formData.registrationFee}
                  onChange={(e) => handleInputChange('registrationFee', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave blank if the event is free to attend
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 gradient-primary"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEventPage;