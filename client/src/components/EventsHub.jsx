import { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';
import { getEvents, createTeamPost, createEvent } from "@/lib/api.js";
import { saveScoped, loadScoped, clearScoped } from '@/lib/session.js';
import LoadingSpinner from '@/components/animations/LoadingSpinner.jsx';

export default function EventsHub({ user, onNavigateToBeacon }) {
  // State for data from the API
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI interactions
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFindTeamModal, setShowFindTeamModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [findTeamAction, setFindTeamAction] = useState(null);

  // State for the "Create Team Post" form
  const [teamPost, setTeamPost] = useState({
    extraSkills: [],
    newSkill: '',
    description: ''
  });

  // State for the "Create Event" modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Hackathon',
    date: '',
    time: '',
    description: '',
    requiredSkills: [],
    newSkill: '',
    maxTeamSize: 4,
    externalLink: '',
    organizer: user?.name || 'Moderator',
  });

  const isModerator = user?.isModerator || true;
  const categoryOptions = [
    { id: 'Hackathon', label: 'Hackathon', icon: '💻' },
    { id: 'Fest', label: 'Fest', icon: '🎉' },
    { id: 'Competition', label: 'Competition', icon: '🏆' },
    { id: 'Workshop', label: 'Workshop', icon: '🛠️' },
    { id: 'Others', label: 'Others', icon: '📋' }
  ];

  // Fetch all events from the backend when the component first loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getEvents();
        // Merge server events with any locally saved pending events for the user
        const serverEvents = response.data || [];
        const pending = loadScoped(user?.email, 'pendingEvents') || [];
        // Avoid duplicate by title+date heuristic
        const merged = [...pending, ...serverEvents.filter(se => !pending.some(pe => pe.title === se.title && pe.date === se.date))];
        setAllEvents(merged);
      } catch (err) {
        setError('Could not fetch events. The server might be down.');
        console.error("Fetch Events Error:", err);
        // Load locally saved pending events as fallback
        const pending = loadScoped(user?.email, 'pendingEvents') || [];
        setAllEvents(pending);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Try to sync any pending local items (events/posts) to the server when app starts
  useEffect(() => {
    (async () => {
      if (!user?.email) return;
      // Sync pending events
      const pendingEvents = loadScoped(user?.email, 'pendingEvents') || [];
      if (pendingEvents.length) {
        const toKeep = [];
        for (const ev of pendingEvents) {
          try {
            const res = await createEvent(ev);
            // replace local with server response
            setAllEvents(prev => [res.data, ...prev.filter(p => p.id !== ev.id)]);
          } catch (err) {
            toKeep.push(ev);
          }
        }
        if (toKeep.length !== pendingEvents.length) {
          if (toKeep.length === 0) clearScoped(user?.email, 'pendingEvents');
          else saveScoped(user?.email, 'pendingEvents', toKeep);
        }
      }

      // Sync pending team posts
      const pendingTeamPosts = loadScoped(user?.email, 'pendingTeamPosts') || [];
      if (pendingTeamPosts.length) {
        const keepPosts = [];
        for (const p of pendingTeamPosts) {
          try {
            await createTeamPost({ eventId: p.eventId, description: p.description, extraSkills: p.extraSkills });
            // on success, optionally notify or remove local copy
          } catch (err) {
            keepPosts.push(p);
          }
        }
        if (keepPosts.length === 0) clearScoped(user?.email, 'pendingTeamPosts');
        else saveScoped(user?.email, 'pendingTeamPosts', keepPosts);
      }
    })();
  }, [user]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return allEvents;
    const formattedCategory = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1, -1);
    return allEvents.filter(event => event.category === formattedCategory);
  }, [activeFilter, allEvents]);

  const filters = [
    { id: 'all', label: 'All Events', icon: '📅', count: allEvents.length },
    { id: 'hackathons', label: 'Hackathons', icon: '💻', count: allEvents.filter(e => e.category === 'Hackathon').length },
    { id: 'competitions', label: 'Competitions', icon: '🏆', count: allEvents.filter(e => e.category === 'Competition').length },
    { id: 'workshops', label: 'Workshops', icon: '🛠️', count: allEvents.filter(e => e.category === 'Workshop').length },
    { id: 'fests', label: 'Fests', icon: '🎉', count: allEvents.filter(e => e.category === 'Fest').length }
  ];

  const handleFindTeam = (event) => {
    setSelectedEvent(event);
    setShowFindTeamModal(true);
    setFindTeamAction(null);
  };

  const handleCreateTeamPost = async () => {
    if (!selectedEvent || !teamPost.description.trim()) return;
    const postData = { eventId: selectedEvent.id, description: teamPost.description, extraSkills: teamPost.extraSkills };
    try {
      await createTeamPost(postData);
      alert('🎉 Your team post has been created in Buddy Beacon! It will expire in 24 hours and auto-create a Collab Pod if you get applicants.');
      if (onNavigateToBeacon) onNavigateToBeacon(selectedEvent.id);
      setShowFindTeamModal(false);
      setTeamPost({ extraSkills: [], newSkill: '', description: '' });
    } catch (err) {
      // Save pending team post locally to sync later
      const pending = loadScoped(user?.email, 'pendingTeamPosts') || [];
      const pendingPost = { id: `local-${Date.now()}`, eventId: selectedEvent.id, description: teamPost.description, extraSkills: teamPost.extraSkills, createdAt: new Date().toISOString(), author: { name: user?.name, id: user?.id } };
      pending.unshift(pendingPost);
      saveScoped(user?.email, 'pendingTeamPosts', pending);
      // Also show a friendly message and navigate to beacon
      setAllEvents(prev => prev);
      alert('Server unavailable. Your team post is saved locally and will sync when the server is reachable.');
      if (onNavigateToBeacon) onNavigateToBeacon(selectedEvent.id);
      setShowFindTeamModal(false);
      setTeamPost({ extraSkills: [], newSkill: '', description: '' });
    }
  };

  const handleBrowseTeams = () => {
    if (onNavigateToBeacon && selectedEvent) onNavigateToBeacon(selectedEvent.id);
    setShowFindTeamModal(false);
  };

  const handleCreateEventSubmit = async () => {
    if (!newEvent.title || !newEvent.category || !newEvent.date || !newEvent.time || !newEvent.description) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createEvent(newEvent);
      setAllEvents(prevEvents => [response.data, ...prevEvents]);
      setShowCreateModal(false);
      // Reset the form
      setNewEvent({
        title: '', category: 'Hackathon', date: '', time: '', description: '',
        requiredSkills: [], newSkill: '', maxTeamSize: 4, externalLink: '',
        organizer: user?.name || 'Moderator',
      });
    } catch (err) {
      // Save event locally to pending list for this user
      const pending = loadScoped(user?.email, 'pendingEvents') || [];
      const pendingEvent = { id: `local-${Date.now()}`, title: newEvent.title, category: newEvent.category, date: newEvent.date, time: newEvent.time, dateTime: `${newEvent.date}T${newEvent.time}`, description: newEvent.description, requiredSkills: newEvent.requiredSkills, maxTeamSize: newEvent.maxTeamSize, externalLink: newEvent.externalLink, organizer: newEvent.organizer };
      pending.unshift(pendingEvent);
      saveScoped(user?.email, 'pendingEvents', pending);
      setAllEvents(prev => [pendingEvent, ...prev]);
      setShowCreateModal(false);
      alert('Server unavailable. Event saved locally and will sync when server is available.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEventSkill = () => {
    if (newEvent.newSkill.trim() && !newEvent.requiredSkills.includes(newEvent.newSkill.trim())) {
      setNewEvent(prev => ({ ...prev, requiredSkills: [...prev.requiredSkills, prev.newSkill.trim()], newSkill: '' }));
    }
  };

  const removeEventSkill = (skill) => {
    setNewEvent(prev => ({ ...prev, requiredSkills: prev.requiredSkills.filter(s => s !== skill) }));
  };

  const addTeamSkill = () => {
    if (teamPost.newSkill.trim() && !teamPost.extraSkills.includes(teamPost.newSkill.trim())) {
      setTeamPost(prev => ({ ...prev, extraSkills: [...prev.extraSkills, teamPost.newSkill.trim()], newSkill: '' }));
    }
  };

  const removeTeamSkill = (skillToRemove) => {
    setTeamPost(prev => ({ ...prev, extraSkills: prev.extraSkills.filter(skill => skill !== skillToRemove) }));
  };

  const renderEvents = () => {
    if (isLoading) return <div className="col-span-full flex justify-center p-8"><LoadingSpinner /></div>;
    if (error) return <div className="col-span-full text-center text-red-400 p-8">{error}</div>;
    if (filteredEvents.length === 0) return <div className="col-span-full text-center text-muted-foreground p-8">No events found.</div>;

    return filteredEvents.map((event) => (
      <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl">
        <div className="p-6 space-y-4">
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2 line-clamp-2">{event.title}</h3>
            <Badge>{event.category}</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-muted-foreground"><span role="img" aria-label="date">📅</span><span className="text-sm">{new Date(event.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
            <div className="flex items-center space-x-2 text-muted-foreground"><span role="img" aria-label="team size">👥</span><span className="text-sm">Max team size: {event.maxTeamSize}</span></div>
            <div className="flex items-center space-x-2 text-muted-foreground"><span role="img" aria-label="organizer">🏢</span><span className="text-sm">By {event.organizer}</span></div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{event.description}</p>
          <div className="space-y-2">
            <div className="text-sm font-medium">Required Skills</div>
            <div className="flex flex-wrap gap-2">
              {event.requiredSkills?.slice(0, 4).map((skill) => <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>)}
              {event.requiredSkills?.length > 4 && <Badge variant="outline" className="text-xs">+{event.requiredSkills.length - 4} more</Badge>}
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <div className="text-center"><div className="font-semibold text-blue-600">{event.participantsCount}</div><div className="text-xs">Participants</div></div>
            <div className="text-center"><div className="font-semibold text-green-600">{event.teamsFormedCount}</div><div className="text-xs">Teams</div></div>
          </div>
          <div className="space-y-2">
            <Button onClick={() => handleFindTeam(event)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">🔍 Find Team</Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">📋 Details</Button>
              {event.externalLink && <Button asChild variant="outline" size="sm" className="flex-1"><a href={event.externalLink} target="_blank" rel="noopener noreferrer">🔗 Register</a></Button>}
            </div>
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">🎯 Events Hub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover hackathons, competitions, workshops, and fests to showcase your skills</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-muted/30 rounded-xl">
        {filters.map((filter) => (
          <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${activeFilter === filter.id ? 'bg-primary text-primary-foreground shadow-md transform scale-105' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
            <div className="flex items-center space-x-2"><span>{filter.icon}</span><span>{filter.label}</span><Badge variant="outline" className="text-xs">{filter.count}</Badge></div>
          </button>
        ))}
      </div>
      {isModerator && (
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" size="lg">✨ Create Event</Button>
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{renderEvents()}</div>

      {/* Find Team Modal */}
      {showFindTeamModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div><h3 className="text-2xl font-bold">Find Team</h3><p className="text-muted-foreground">{selectedEvent.title}</p></div>
              <Button variant="ghost" size="icon" onClick={() => setShowFindTeamModal(false)} className="rounded-full">✕</Button>
            </div>
            {!findTeamAction ? (
              <div className="space-y-4">
                <button onClick={() => setFindTeamAction('create')} className="w-full p-6 border-2 border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left group hover:shadow-md">
                  <div className="flex items-center space-x-4 mb-3"><span className="text-3xl">✨</span><span className="text-xl font-semibold">Create Team Post</span></div>
                  <p className="text-muted-foreground">Create a post in Buddy Beacon to attract teammates. Auto-fills event details.</p>
                </button>
                <button onClick={() => setFindTeamAction('browse')} className="w-full p-6 border-2 border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left group hover:shadow-md">
                  <div className="flex items-center space-x-4 mb-3"><span className="text-3xl">🔍</span><span className="text-xl font-semibold">Browse Teams</span></div>
                  <p className="text-muted-foreground">Browse existing team posts in Buddy Beacon for this event.</p>
                </button>
              </div>
            ) : findTeamAction === 'create' ? (
              <div className="space-y-6">
                <Button variant="outline" size="sm" onClick={() => setFindTeamAction(null)} className="rounded-full">← Back</Button>
                <div className="bg-blue-50/50 p-4 rounded-xl border"><h4 className="font-semibold mb-2">Auto-filled Event Details:</h4><div className="space-y-2 text-sm"><div><strong>Event:</strong> {selectedEvent.title}</div><div><strong>Max Team Size:</strong> {selectedEvent.maxTeamSize} members</div><div><strong>Required Skills:</strong> {selectedEvent.requiredSkills?.join(', ')}</div></div></div>
                <div className="bg-green-50/50 p-4 rounded-xl border"><h4 className="font-semibold mb-2">Your Profile Details (will be shown):</h4><div className="space-y-2 text-sm"><div><strong>Name:</strong> {user?.name || 'Your Name'}</div><div><strong>Year:</strong> {user?.year || 'Your Year'}</div><div><strong>Badges:</strong> {user?.badges?.slice(0, 3).join(', ') || 'Your Badges'}</div></div></div>
                <div><label className="block font-semibold mb-2">Additional Skills (Optional)</label><div className="flex flex-wrap gap-2 mb-2">{teamPost.extraSkills.map((skill) => (<Badge key={skill} variant="outline" className="cursor-pointer" onClick={() => removeTeamSkill(skill)}>{skill} ✕</Badge>))}</div><div className="flex space-x-2"><Input placeholder="Add a skill..." value={teamPost.newSkill} onChange={(e) => setTeamPost(prev => ({ ...prev, newSkill: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addTeamSkill()} /><Button variant="outline" onClick={addTeamSkill}>Add</Button></div></div>
                <div><label className="block font-semibold mb-2">Team Post Description *</label><Textarea placeholder="Describe your project idea..." value={teamPost.description} onChange={(e) => setTeamPost(prev => ({ ...prev, description: e.target.value }))} rows={4} /></div>
                <div className="bg-yellow-50/50 p-4 rounded-xl border"><p className="text-sm">⏰ <strong>Auto-Expiry:</strong> Your team post will expire in 24 hours and auto-create a Collab Pod if you receive applicants.</p></div>
                <div className="flex space-x-4"><Button onClick={handleCreateTeamPost} disabled={!teamPost.description.trim()} className="flex-1">🚀 Create Team Post</Button><Button variant="outline" onClick={() => setFindTeamAction(null)}>Cancel</Button></div>
              </div>
            ) : (
              <div className="space-y-6 text-center relative">
                <Button variant="outline" size="sm" onClick={() => setFindTeamAction(null)} className="rounded-full absolute top-0 left-0">← Back</Button>
                <div className="text-6xl pt-8">🔍</div>
                <h4 className="font-semibold text-lg">Browse Existing Teams</h4>
                <p className="text-muted-foreground">We'll take you to the Buddy Beacon to see all team posts for {selectedEvent.title}.</p>
                <Button onClick={handleBrowseTeams} className="w-full">🚀 Go to Buddy Beacon</Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && isModerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Create New Event</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="rounded-full">✕</Button>
            </div>
            <div className="space-y-6">
              <div><label className="block text-sm font-medium mb-1">Event Title *</label><Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} /></div>
              <div><label className="block text-sm font-medium mb-2">Event Category *</label><div className="grid grid-cols-5 gap-2">{categoryOptions.map(cat => (<button key={cat.id} onClick={() => setNewEvent({ ...newEvent, category: cat.id })} className={`p-2 border rounded-lg flex flex-col items-center justify-center transition-colors ${newEvent.category === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}><span className="text-2xl mb-1">{cat.icon}</span><span className="text-xs font-medium">{cat.label}</span></button>))}</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Date *</label><Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} /></div>
                <div><label className="block text-sm font-medium mb-1">Time *</label><Input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Description *</label><Textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} /></div>
              <div>
                <label className="block text-sm font-medium mb-1">Required Skills</label>
                <div className="flex flex-wrap gap-2 my-2">{newEvent.requiredSkills.map(skill => <Badge key={skill} variant="outline" className="cursor-pointer" onClick={() => removeEventSkill(skill)}>{skill} ✕</Badge>)}</div>
                <div className="flex space-x-2"><Input placeholder="Add a skill..." value={newEvent.newSkill} onChange={(e) => setNewEvent({ ...newEvent, newSkill: e.target.value })} onKeyDown={e => e.key === 'Enter' && addEventSkill()} /><Button variant="outline" onClick={addEventSkill}>Add</Button></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Max Team Size</label><Input type="number" value={newEvent.maxTeamSize} onChange={(e) => setNewEvent({ ...newEvent, maxTeamSize: parseInt(e.target.value) || 0 })} /></div>
              <div><label className="block text-sm font-medium mb-1">External Registration Link (Optional)</label><Input placeholder="https://example.com/register" value={newEvent.externalLink} onChange={(e) => setNewEvent({ ...newEvent, externalLink: e.target.value })} /></div>
              <div className="flex justify-end space-x-2 pt-4"><Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button><Button onClick={handleCreateEventSubmit} disabled={isSubmitting}>{isSubmitting ? 'Creating...' : '🚀 Create Event'}</Button></div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}