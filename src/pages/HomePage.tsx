import React, { useState } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, TrendingUp, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
  const { state } = useEventContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvents = state.events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalRegistrations = state.events.reduce((sum, event) => sum + event.registeredCount, 0);
  const upcomingEvents = state.events.filter(event => new Date(event.date) > new Date()).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-6 animate-slide-up">
            One Platform, Endless Events
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            Join thousands of participants in marathons, yoga sessions, cycling races, and more. 
            Your next adventure starts here!
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8 animate-bounce-in">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary-foreground mr-2" />
                <span className="text-3xl font-bold text-primary-foreground">{upcomingEvents}</span>
              </div>
              <p className="text-primary-foreground/80">Upcoming Events</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary-foreground mr-2" />
                <span className="text-3xl font-bold text-primary-foreground">{totalRegistrations}</span>
              </div>
              <p className="text-primary-foreground/80">Total Registrations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary-foreground mr-2" />
                <span className="text-3xl font-bold text-primary-foreground">{state.events.length}</span>
              </div>
              <p className="text-primary-foreground/80">Active Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="Marathon">🏃 Marathon</SelectItem>
                      <SelectItem value="Cycling">🚴 Cycling</SelectItem>
                      <SelectItem value="Walkathon">🚶 Walkathon</SelectItem>
                      <SelectItem value="Yoga">🧘 Yoga</SelectItem>
                      <SelectItem value="Zumba">💃 Zumba</SelectItem>
                      <SelectItem value="Swimming">🏊 Swimming</SelectItem>
                      <SelectItem value="Hiking">🏔️ Hiking</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {(searchTerm || filterType !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterType('all');
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              
              {(searchTerm || filterType !== 'all') && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                  </span>
                  {searchTerm && (
                    <Badge variant="secondary">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {filterType !== 'all' && (
                    <Badge variant="secondary">
                      Type: {filterType}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            {filterType === 'all' ? 'Upcoming Events' : `${filterType} Events`}
          </h2>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Check back later for new events.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;