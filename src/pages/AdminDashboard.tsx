import React, { useState } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  IndianRupee, 
  Search,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { state, dispatch } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const totalEvents = state.events.length;
  const totalRegistrations = state.registrations.length;
  const totalRevenue = state.events.reduce((sum, event) => {
    const eventRegistrations = state.registrations.filter(r => r.eventId === event.id).length;
    return sum + (event.registrationFee || 0) * eventRegistrations;
  }, 0);

  // Filter events based on search
  const filteredEvents = state.events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: eventId });
    }
  };

  const getEventStats = (eventId: string) => {
    const registrations = state.registrations.filter(r => r.eventId === eventId);
    const event = state.events.find(e => e.id === eventId);
    return {
      registrations: registrations.length,
      revenue: (event?.registrationFee || 0) * registrations.length,
      capacity: event?.maxParticipants || 0
    };
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card shadow-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-3xl font-bold text-primary">{totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                  <p className="text-3xl font-bold text-primary">{totalRegistrations}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg per Event</p>
                  <p className="text-3xl font-bold text-primary">
                    {totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="registrations">Registration Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Search and Create */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Manage Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Link to="/create-event">
                    <Button className="gradient-primary">
                      Create New Event
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const stats = getEventStats(event.id);
                const fillPercentage = (stats.registrations / stats.capacity) * 100;
                
                return (
                  <Card key={event.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <Badge className="bg-primary">
                              {event.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Date</p>
                              <p className="font-semibold">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Registrations</p>
                              <p className="font-semibold">
                                {stats.registrations}/{stats.capacity}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Revenue</p>
                              <p className="font-semibold">₹{stats.revenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Capacity</p>
                              <p className="font-semibold">{fillPercentage.toFixed(1)}%</p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link to={`/event/${event.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" disabled>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-6">
            {/* Registration Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Event Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Marathon', 'Yoga', 'Cycling', 'Walkathon', 'Zumba', 'Swimming', 'Hiking'].map(type => {
                      const count = state.registrations.filter(r => r.eventType === type).length;
                      const percentage = totalRegistrations > 0 ? (count / totalRegistrations) * 100 : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Male', 'Female', 'Other'].map(gender => {
                      const count = state.registrations.filter(r => r.gender === gender).length;
                      const percentage = totalRegistrations > 0 ? (count / totalRegistrations) * 100 : 0;
                      
                      return (
                        <div key={gender} className="flex items-center justify-between">
                          <span className="text-sm">{gender}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-accent h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Button */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Export Data</h3>
                  <p className="text-muted-foreground mb-4">
                    Download complete registration data for analysis
                  </p>
                  <Button disabled className="gradient-primary">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV (Demo)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;