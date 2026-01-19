import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import CampusOverview from './campus/CampusOverview.jsx';
import CampusFeed from './campus/CampusFeed.jsx';
import BuddyBeacon from './campus/BuddyBeacon.jsx';
import CollabPods from './campus/CollabPods.jsx';
import { useTheme } from '../lib/theme.js';

export default function CampusHub({
  user,
  initialView = 'overview',
  eventId = null,
  onCreateCollabPod,
  onEnterCollabPod
}) {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState(initialView);

  // Update view when initialView prop changes
  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '🏛️',
      description: 'Campus stats and activity'
    },
    {
      id: 'feed',
      label: 'Campus Feed',
      icon: '💬',
      description: 'Ask, help, polls & collaboration'
    },
    {
      id: 'beacon',
      label: 'Buddy Beacon',
      icon: '🔍',
      description: 'Find teammates and collaborators'
    },
    {
      id: 'pods',
      label: 'Collab Pods',
      icon: '🚀',
      description: 'Active collaboration spaces'
    }
  ];

  const getNavItemStyles = (itemId) => {
    const isActive = activeView === itemId;

    return `
      group relative flex items-center space-x-3 px-4 py-3 ${theme === 'windows1992' ? 'rounded-none border-2' : 'rounded-xl'} transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm
      ${isActive
        ? theme === 'windows1992'
          ? 'bg-primary text-primary-foreground border-inset shadow-inset'
          : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
        : theme === 'windows1992'
          ? 'text-muted-foreground hover:text-foreground glass hover:border-primary border-outset hover:bg-muted button-win95'
          : 'text-muted-foreground hover:text-foreground glass hover:shadow-glass hover:scale-105 border-transparent'
      }
      ${isActive && theme !== 'windows1992' ? 'shadow-neon' : theme !== 'windows1992' ? 'hover:shadow-glass-lg' : ''} press-effect
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className={`w-16 h-16 ${theme === 'windows1992' ? 'rounded-none bg-primary border-4 border-outset' : 'rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500'} flex items-center justify-center shadow-lg ${theme === 'windows1992' ? '' : 'hover:shadow-neon'} transition-all duration-300`}>
            <span className={`text-3xl ${theme === 'windows1992' ? 'text-primary-foreground text-lg' : 'text-white'}`}>
              {theme === 'windows1992' ? '🏠' : '🏛️'}
            </span>
          </div>
          <div className="text-left">
            <h1 className={`text-3xl font-bold ${theme === 'windows1992' ? 'text-primary text-lg font-bold' : 'gradient-text cyber:glow-text'}`}>
              {theme === 'windows1992' ? 'CAMPUS HUB' : 'Campus Hub'}
            </h1>
            <p className={`text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
              {theme === 'windows1992' ? 'COLLABORATE ON CAMPUS' : 'Your campus collaboration center'}
            </p>
          </div>
        </div>

        {/* Campus Info */}
        <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'} max-w-md mx-auto`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm font-bold' : 'text-primary'}`}>
                  {user?.collegeName || 'Your College'}
                </div>
                <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                  {user?.department || 'Computer Science'} • {user?.year || '3rd Year'}
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`${theme === 'windows1992' ? 'bg-green-200 text-black border-2 border-outset text-xs' : ''}`}
              >
                {theme === 'windows1992' ? 'VERIFIED' : '✅ Verified'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 justify-center">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={getNavItemStyles(item.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Button background shimmer (not in windows1992) */}
            {theme !== 'windows1992' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}

            <span className={`text-2xl transition-all duration-300 ${theme === 'windows1992' ? 'text-sm' : 'group-hover:scale-125 group-hover:rotate-12'} relative z-10`}>
              {theme === 'windows1992' ?
                ({ overview: '📋', feed: '💬', beacon: '🔍', pods: '🚀' }[item.id] || item.icon) :
                item.icon
              }
            </span>
            <div className="flex-1 text-left relative z-10">
              <div className={`font-semibold ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                {theme === 'windows1992' ? item.label.toUpperCase() : item.label}
              </div>
              <div className={`text-xs opacity-75 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? item.description.toUpperCase() : item.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in slide-up">
        {activeView === 'overview' && <CampusOverview user={user} />}
        {activeView === 'feed' && <CampusFeed user={user} />}
        {/* Pass the eventId down to the BuddyBeacon component */}
        {activeView === 'beacon' && <BuddyBeacon user={user} eventId={eventId} />}
        {activeView === 'pods' && (
          <CollabPods
            user={user}
            onCreateCollabPod={onCreateCollabPod}
            onEnterCollabPod={onEnterCollabPod}
          />
        )}
      </div>
    </div>
  );
}