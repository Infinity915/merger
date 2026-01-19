import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardHeader, CardContent } from '@/components/ui/card.jsx'
import { Avatar } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { useTheme } from '@/lib/theme.js'

export default function CollabRooms({ user, onNavigateToRoom, onEnterCollabRoom }) {
  const { theme } = useTheme()

  // Mock collab rooms data
  const rooms = [
    {
      id: 1,
      title: 'Cross-Campus AI Research',
      description: 'Collaborative AI research project spanning multiple colleges',
      members: ['You', 'Sarah Chen', 'Alex Kumar', 'Maria Rodriguez'],
      colleges: ['MIT', 'Stanford', 'IIT Delhi'],
      activeMembers: 3,
      totalMembers: 12,
      status: 'active',
      lastActivity: '2 minutes ago',
      tags: ['AI', 'Research', 'Machine Learning'],
      visibility: 'public',
      isOwner: true
    },
    {
      id: 2,
      title: 'Open Source Web Framework',
      description: 'Building a new React-based framework for modern web development',
      members: ['David Park', 'Jennifer Lee', 'Michael Brown'],
      colleges: ['Harvard', 'Berkeley', 'Cambridge'],
      activeMembers: 5,
      totalMembers: 8,
      status: 'active',
      lastActivity: '8 minutes ago',
      tags: ['React', 'TypeScript', 'Open Source'],
      visibility: 'public',
      isOwner: false
    },
    {
      id: 3,
      title: 'Sustainable Tech Solutions',
      description: 'Developing technology solutions for environmental sustainability',
      members: ['Lisa Wang', 'Robert Johnson'],
      colleges: ['Oxford', 'ETH Zurich'],
      activeMembers: 1,
      totalMembers: 6,
      status: 'active',
      lastActivity: '45 minutes ago',
      tags: ['Sustainability', 'GreenTech', 'Innovation'],
      visibility: 'private',
      isOwner: false
    }
  ]

  const handleEnterRoom = (room) => {
    if (onEnterCollabRoom) {
      onEnterCollabRoom(room.title)
    }
  }

  const getStatusColor = (status) => {
    return {
      active: theme === 'windows1992' ? '#008000' : '#10b981',
      inactive: theme === 'windows1992' ? '#808080' : '#6b7280'
    }[status] || '#6b7280'
  }

  const getVisibilityIcon = (visibility) => {
    if (theme === 'windows1992') {
      return visibility === 'public' ? '○' : '●'
    }
    return visibility === 'public' ? '🌐' : '🔒'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold text-foreground ${theme === 'windows1992' ? 'text-lg font-bold' : ''}`}>
            {theme === 'windows1992' ? 'COLLAB ROOMS' : 'Collaboration Rooms'}
          </h2>
          <p className={`text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
            {theme === 'windows1992' ? 'CROSS-COLLEGE PROJECT SPACES' : 'Cross-college project collaboration spaces'}
          </p>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={theme === 'windows1992' ? 'SEARCH ROOMS...' : 'Search collaboration rooms...'}
          className={`flex-1 ${theme === 'windows1992' ? 'input-win95 text-xs' : ''}`}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
          >
            {theme === 'windows1992' ? 'PUBLIC' : '🌐 Public'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
          >
            {theme === 'windows1992' ? 'JOINED' : '✅ Joined'}
          </Button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room, index) => (
          <Card 
            key={room.id}
            className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'} hover-lift transition-all duration-300 animate-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-semibold text-foreground ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                      {theme === 'windows1992' ? room.title.toUpperCase() : room.title}
                    </h3>
                    <span className="text-lg" title={`${room.visibility} room`}>
                      {getVisibilityIcon(room.visibility)}
                    </span>
                  </div>
                  <p className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                    {room.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-3 h-3 ${theme === 'windows1992' ? 'rounded-none border border-black' : 'rounded-full'} animate-pulse`}
                    style={{ backgroundColor: getStatusColor(room.status) }}
                  ></div>
                  {room.isOwner && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${theme === 'windows1992' ? 'bg-yellow-200 text-black border-2 border-outset' : ''}`}
                    >
                      {theme === 'windows1992' ? 'OWNER' : '👑 Owner'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Colleges Involved */}
              <div>
                <div className={`text-sm font-medium text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'COLLEGES' : 'Participating Colleges'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {room.colleges.map((college, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      size="sm"
                      className={`${theme === 'windows1992' ? 'text-xs border-2 border-outset bg-blue-100' : ''}`}
                    >
                      {theme === 'windows1992' ? college.toUpperCase() : college}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Members Preview */}
              <div>
                <div className={`text-sm font-medium text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'MEMBERS' : 'Members'} ({room.totalMembers})
                </div>
                <div className="flex -space-x-2">
                  {room.members.slice(0, 4).map((member, idx) => (
                    <Avatar 
                      key={idx}
                      className={`w-8 h-8 border-2 border-background ${theme === 'windows1992' ? 'rounded-none bg-primary text-primary-foreground border-2 border-outset' : 'bg-gradient-to-br from-purple-500 to-pink-500'} text-white font-medium text-xs`}
                      title={member}
                    >
                      {member.charAt(0)}
                    </Avatar>
                  ))}
                  {room.members.length > 4 && (
                    <div className={`w-8 h-8 ${theme === 'windows1992' ? 'rounded-none bg-muted border-2 border-outset' : 'rounded-full bg-muted'} border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground`}>
                      +{room.totalMembers - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Status */}
              <div className="flex items-center justify-between text-sm">
                <div className={`text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                  {theme === 'windows1992' ? 'LAST ACTIVITY:' : 'Last activity:'} {room.lastActivity}
                </div>
                <div className={`font-medium ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`} style={{ color: getStatusColor(room.status) }}>
                  {room.activeMembers}/{room.totalMembers} {theme === 'windows1992' ? 'ONLINE' : 'online'}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {room.tags.map((tag, tagIndex) => (
                  <Badge 
                    key={tagIndex} 
                    variant="outline" 
                    size="sm"
                    className={`${theme === 'windows1992' ? 'text-xs border-2 border-outset bg-muted' : ''}`}
                  >
                    {theme === 'windows1992' ? tag.toUpperCase() : tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnterRoom(room)}
                  className={`flex-1 ${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
                >
                  {theme === 'windows1992' ? 'ENTER TERMINAL' : '🚀 Enter Terminal'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${theme === 'windows1992' ? 'button-win95 text-xs px-2' : 'px-3'}`}
                  title="Room settings"
                >
                  {theme === 'windows1992' ? '...' : '⚙️'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {rooms.length === 0 && (
        <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'} text-center py-12`}>
          <div className={`text-6xl mb-4 ${theme === 'windows1992' ? 'text-2xl' : ''}`}>
            {theme === 'windows1992' ? '404' : '🌐'}
          </div>
          <h3 className={`text-xl font-semibold text-foreground mb-2 ${theme === 'windows1992' ? 'text-sm font-bold' : ''}`}>
            {theme === 'windows1992' ? 'NO ROOMS FOUND' : 'No collaboration rooms found'}
          </h3>
          <p className={`text-muted-foreground mb-6 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
            {theme === 'windows1992' ? 'CREATE OR JOIN A ROOM TO START' : 'Create or join a room to start collaborating across colleges'}
          </p>
          <Button className={`${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}>
            {theme === 'windows1992' ? 'EXPLORE ROOMS' : 'Explore Public Rooms'}
          </Button>
        </Card>
      )}
    </div>
  )
}