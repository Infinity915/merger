import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardHeader, CardContent } from '@/components/ui/card.jsx'
import { Avatar } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { useTheme } from '@/lib/theme.js'

export default function CollabPods({ user, onCreateCollabPod, onEnterCollabPod }) {
  const { theme } = useTheme()
  const [showCreatePod, setShowCreatePod] = useState(false)

  // Mock collab pods data
  const pods = [
    {
      id: 1,
      title: 'React Native Mobile App',
      description: 'Building a cross-platform mobile app for campus events',
      members: ['You', 'Sarah Chen', 'Alex Kumar'],
      activeMembers: 2,
      totalMembers: 3,
      status: 'active',
      lastActivity: '5 minutes ago',
      tags: ['React Native', 'Mobile', 'TypeScript'],
      isOwner: true
    },
    {
      id: 2,
      title: 'AI Study Assistant',
      description: 'Creating an AI-powered study companion using machine learning',
      members: ['Maria Rodriguez', 'David Park', 'Jennifer Lee'],
      activeMembers: 1,
      totalMembers: 3,
      status: 'active',
      lastActivity: '12 minutes ago',
      tags: ['Python', 'Machine Learning', 'AI'],
      isOwner: false
    },
    {
      id: 3,
      title: 'Blockchain Voting System',
      description: 'Developing a secure voting system using blockchain technology',
      members: ['Michael Brown', 'Lisa Wang'],
      activeMembers: 0,
      totalMembers: 2,
      status: 'inactive',
      lastActivity: '2 hours ago',
      tags: ['Blockchain', 'Solidity', 'Web3'],
      isOwner: false
    }
  ]

  const handleCreatePod = () => {
    // Mock pod creation
    const newPod = {
      title: 'New Collaboration Pod',
      description: 'A new collaboration space for innovative projects',
      tags: ['Collaboration', 'Innovation']
    }
    
    if (onCreateCollabPod) {
      onCreateCollabPod(newPod)
    }
    setShowCreatePod(false)
  }

  const handleEnterPod = (pod) => {
    if (onEnterCollabPod) {
      onEnterCollabPod(pod.title)
    }
  }

  const getStatusColor = (status) => {
    return {
      active: theme === 'windows1992' ? '#008000' : '#10b981',
      inactive: theme === 'windows1992' ? '#808080' : '#6b7280'
    }[status] || '#6b7280'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold text-foreground ${theme === 'windows1992' ? 'text-lg font-bold' : ''}`}>
            {theme === 'windows1992' ? 'COLLAB PODS' : 'Collaboration Pods'}
          </h2>
          <p className={`text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
            {theme === 'windows1992' ? 'ACTIVE PROJECT SPACES' : 'Your active project collaboration spaces'}
          </p>
        </div>
        <Button
          onClick={() => setShowCreatePod(true)}
          className={`${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
        >
          {theme === 'windows1992' ? 'CREATE POD' : '+ Create Pod'}
        </Button>
      </div>

      {/* Pods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pods.map((pod, index) => (
          <Card 
            key={pod.id}
            className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'} hover-lift transition-all duration-300 animate-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-semibold text-foreground ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                    {theme === 'windows1992' ? pod.title.toUpperCase() : pod.title}
                  </h3>
                  <p className={`text-sm text-muted-foreground mt-1 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                    {pod.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-3 h-3 ${theme === 'windows1992' ? 'rounded-none border border-black' : 'rounded-full'} animate-pulse`}
                    style={{ backgroundColor: getStatusColor(pod.status) }}
                  ></div>
                  {pod.isOwner && (
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
              {/* Members */}
              <div>
                <div className={`text-sm font-medium text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'MEMBERS' : 'Members'} ({pod.totalMembers})
                </div>
                <div className="flex -space-x-2">
                  {pod.members.slice(0, 3).map((member, idx) => (
                    <Avatar 
                      key={idx}
                      className={`w-8 h-8 border-2 border-background ${theme === 'windows1992' ? 'rounded-none bg-primary text-primary-foreground border-2 border-outset' : 'bg-gradient-to-br from-blue-500 to-purple-500'} text-white font-medium text-xs`}
                      title={member}
                    >
                      {member.charAt(0)}
                    </Avatar>
                  ))}
                  {pod.members.length > 3 && (
                    <div className={`w-8 h-8 ${theme === 'windows1992' ? 'rounded-none bg-muted border-2 border-outset' : 'rounded-full bg-muted'} border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground`}>
                      +{pod.members.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Status */}
              <div className="flex items-center justify-between text-sm">
                <div className={`text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                  {theme === 'windows1992' ? 'LAST ACTIVITY:' : 'Last activity:'} {pod.lastActivity}
                </div>
                <div className={`font-medium ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`} style={{ color: getStatusColor(pod.status) }}>
                  {pod.activeMembers}/{pod.totalMembers} {theme === 'windows1992' ? 'ONLINE' : 'online'}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {pod.tags.map((tag, tagIndex) => (
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
                  onClick={() => handleEnterPod(pod)}
                  className={`flex-1 ${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
                >
                  {theme === 'windows1992' ? 'ENTER TERMINAL' : '🚀 Enter Terminal'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${theme === 'windows1992' ? 'button-win95 text-xs px-2' : 'px-3'}`}
                  title="Pod settings"
                >
                  {theme === 'windows1992' ? '...' : '⚙️'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State / Create New Pod Card */}
        <Card 
          className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'} border-dashed hover-lift transition-all duration-300 cursor-pointer animate-in`}
          onClick={() => setShowCreatePod(true)}
          style={{ animationDelay: `${pods.length * 100}ms` }}
        >
          <CardContent className="p-8 text-center">
            <div className={`text-4xl mb-4 ${theme === 'windows1992' ? 'text-2xl' : ''}`}>
              {theme === 'windows1992' ? '+' : '➕'}
            </div>
            <h3 className={`font-semibold text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
              {theme === 'windows1992' ? 'CREATE NEW POD' : 'Create New Pod'}
            </h3>
            <p className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
              {theme === 'windows1992' ? 'START COLLABORATING' : 'Start a new collaboration space'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Pod Modal */}
      {showCreatePod && (
        <div className="fixed inset-0 glass backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <Card className={`w-full max-w-lg ${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'} animate-in scale-in`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold text-foreground ${theme === 'windows1992' ? 'text-sm font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'CREATE COLLABORATION POD' : 'Create Collaboration Pod'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePod(false)}
                  className={`${theme === 'windows1992' ? 'button-win95 text-xs p-1' : ''}`}
                >
                  {theme === 'windows1992' ? 'X' : '✕'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'POD TITLE' : 'Pod Title'}
                </label>
                <Input
                  placeholder={theme === 'windows1992' ? 'ENTER POD TITLE...' : 'Enter a descriptive title for your pod...'}
                  className={`${theme === 'windows1992' ? 'input-win95 text-xs' : ''}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'DESCRIPTION' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  placeholder={theme === 'windows1992' ? 'DESCRIBE YOUR PROJECT...' : 'Describe what you want to collaborate on...'}
                  className={`w-full px-4 py-3 glass ${theme === 'windows1992' ? 'rounded-none border-2 border-inset font-mono text-xs placeholder:uppercase' : 'rounded-xl border-glass-border'} transition-all duration-300 resize-none`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold text-foreground mb-2 ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                  {theme === 'windows1992' ? 'TAGS' : 'Tags'}
                </label>
                <Input
                  placeholder={theme === 'windows1992' ? 'REACT, TYPESCRIPT, AI...' : 'React, TypeScript, AI...'}
                  className={`${theme === 'windows1992' ? 'input-win95 text-xs' : ''}`}
                />
                <p className={`text-xs text-muted-foreground mt-1 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                  {theme === 'windows1992' ? 'SEPARATE WITH COMMAS' : 'Separate tags with commas'}
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePod(false)}
                  className={`${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
                >
                  {theme === 'windows1992' ? 'CANCEL' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleCreatePod}
                  className={`${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
                >
                  {theme === 'windows1992' ? 'CREATE POD' : 'Create Pod'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}