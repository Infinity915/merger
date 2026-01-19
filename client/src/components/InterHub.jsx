import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardHeader, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import InterFeed from './inter/InterFeed.jsx'
import CollabRooms from './inter/CollabRooms.jsx'
import Discovery from './inter/Discovery.jsx'
import InterChat from './inter/InterChat.jsx'
import { useTheme } from '@/lib/theme.js'

export default function InterHub({ 
  user, 
  initialView = 'feed', 
  onNavigateToRoom, 
  onCreateCollabRoom,
  onEnterCollabRoom 
}) {
  const { theme } = useTheme()
  const [activeView, setActiveView] = useState(initialView)

  // Update view when initialView changes
  useState(() => {
    setActiveView(initialView)
  })

  const navItems = [
    { 
      id: 'feed', 
      label: 'Global Feed', 
      icon: '🌐', 
      description: 'Cross-college discussions'
    },
    { 
      id: 'rooms', 
      label: 'Collab Rooms', 
      icon: '🚀', 
      description: 'Project collaboration spaces'
    },
    { 
      id: 'discovery', 
      label: 'Discovery', 
      icon: '🔍', 
      description: 'Find peers across colleges'
    },
    { 
      id: 'chat', 
      label: 'Messages', 
      icon: '💬', 
      description: 'Direct conversations'
    }
  ]

  const getNavItemStyles = (itemId) => {
    const isActive = activeView === itemId
    
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
    `
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className={`w-16 h-16 ${theme === 'windows1992' ? 'rounded-none bg-primary border-4 border-outset' : 'rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center shadow-lg ${theme === 'windows1992' ? '' : 'hover:shadow-neon'} transition-all duration-300`}>
            <span className={`text-3xl ${theme === 'windows1992' ? 'text-primary-foreground text-lg' : 'text-white'}`}>
              {theme === 'windows1992' ? '🌍' : '🌐'}
            </span>
          </div>
          <div className="text-left">
            <h1 className={`text-3xl font-bold ${theme === 'windows1992' ? 'text-primary text-lg font-bold' : 'gradient-text cyber:glow-text'}`}>
              {theme === 'windows1992' ? 'GLOBAL HUB' : 'Global Hub'}
            </h1>
            <p className={`text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
              {theme === 'windows1992' ? 'INTER-COLLEGE COLLABORATION' : 'Cross-college collaboration network'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm font-bold' : 'text-primary'}`}>
                {theme === 'windows1992' ? '250+' : '250+'}
              </div>
              <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'COLLEGES' : 'Colleges'}
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm font-bold' : 'text-primary'}`}>
                {theme === 'windows1992' ? '15K+' : '15K+'}
              </div>
              <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'STUDENTS' : 'Students'}
              </div>
            </CardContent>
          </Card>
          <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm font-bold' : 'text-primary'}`}>
                {theme === 'windows1992' ? '500+' : '500+'}
              </div>
              <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'PROJECTS' : 'Projects'}
              </div>
            </CardContent>
          </Card>
        </div>
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
                ({ feed: '💬', rooms: '🚀', discovery: '🔍', chat: '📧' }[item.id] || item.icon) : 
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
        {activeView === 'feed' && <InterFeed user={user} onCreateCollabRoom={onCreateCollabRoom} />}
        {activeView === 'rooms' && (
          <CollabRooms 
            user={user} 
            onNavigateToRoom={onNavigateToRoom}
            onEnterCollabRoom={onEnterCollabRoom}
          />
        )}
        {activeView === 'discovery' && <Discovery user={user} />}
        {activeView === 'chat' && <InterChat user={user} />}
      </div>
    </div>
  )
}