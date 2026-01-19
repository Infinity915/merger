import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useTheme } from '@/lib/theme.js'

export default function CampusOverview({ user }) {
  const { theme } = useTheme()

  const stats = [
    { label: 'Active Students', value: '2,847', change: '+12%', color: 'text-green-600' },
    { label: 'Ongoing Projects', value: '156', change: '+8%', color: 'text-blue-600' },
    { label: 'Study Groups', value: '89', change: '+5%', color: 'text-purple-600' },
    { label: 'Events This Week', value: '24', change: '+15%', color: 'text-orange-600' }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'collab',
      title: 'New AI Study Group formed',
      time: '2 hours ago',
      participants: 8,
      icon: '🤝'
    },
    {
      id: 2,
      type: 'project',
      title: 'Web Dev Bootcamp completed',
      time: '4 hours ago',
      participants: 24,
      icon: '🎓'
    },
    {
      id: 3,
      type: 'event',
      title: 'Tech Talk: Future of AI scheduled',
      time: '6 hours ago',
      participants: 156,
      icon: '📅'
    }
  ]

  const popularTopics = [
    { name: 'Machine Learning', posts: 89, trend: 'up' },
    { name: 'Web Development', posts: 67, trend: 'up' },
    { name: 'Data Structures', posts: 45, trend: 'stable' },
    { name: 'Mobile Apps', posts: 34, trend: 'down' },
    { name: 'Cybersecurity', posts: 28, trend: 'up' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className={`text-4xl font-bold ${theme === 'windows1992' ? 'text-primary' : 'gradient-text'}`}>
          {theme === 'windows1992' ? 'CAMPUS OVERVIEW' : 'Campus Overview'}
        </h1>
        <p className={`text-lg text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
          {theme === 'windows1992' ? 'YOUR CAMPUS ACTIVITY DASHBOARD' : 'Your campus activity dashboard'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass hover:shadow-glass-lg hover:-translate-y-2'} text-center transition-all duration-300`}
            variant="glass"
          >
            <CardContent className="p-6">
              <div className={`text-2xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm' : stat.color}`}>
                {stat.value}
              </div>
              <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {stat.label}
              </div>
              <div className={`text-xs ${stat.color} font-medium ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'}`}>
          <CardHeader>
            <h3 className={`font-semibold text-lg ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
              {theme === 'windows1992' ? 'RECENT ACTIVITY' : 'Recent Activity'}
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-center space-x-4 p-4 rounded-xl ${theme === 'windows1992' ? 'bg-muted border border-border rounded-none' : 'bg-muted/30 hover:bg-muted/50'} transition-all duration-200`}
              >
                <div className={`text-2xl ${theme === 'windows1992' ? 'text-sm' : ''}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                    {activity.title}
                  </div>
                  <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                    {activity.time} • {activity.participants} participants
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Topics */}
        <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'}`}>
          <CardHeader>
            <h3 className={`font-semibold text-lg ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
              {theme === 'windows1992' ? 'TRENDING TOPICS' : 'Trending Topics'}
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularTopics.map((topic, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg ${theme === 'windows1992' ? 'bg-muted border border-border rounded-none' : 'bg-muted/30 hover:bg-muted/50'} transition-all duration-200`}
              >
                <div>
                  <div className={`font-medium ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
                    {topic.name}
                  </div>
                  <div className={`text-sm text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                    {topic.posts} posts
                  </div>
                </div>
                <Badge 
                  variant={topic.trend === 'up' ? 'success' : topic.trend === 'down' ? 'destructive' : 'secondary'}
                  className={`${theme === 'windows1992' ? 'text-xs' : ''}`}
                >
                  {topic.trend === 'up' ? '↗️' : topic.trend === 'down' ? '↘️' : '→'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className={`${theme === 'windows1992' ? 'card-glass border-2 border-outset' : 'card-glass'}`}>
        <CardHeader>
          <h3 className={`font-semibold text-lg ${theme === 'windows1992' ? 'text-xs font-bold' : ''}`}>
            {theme === 'windows1992' ? 'QUICK ACTIONS' : 'Quick Actions'}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className={`flex flex-col items-center space-y-2 h-auto py-4 ${theme === 'windows1992' ? 'button-win95' : 'hover:shadow-glass hover:scale-105'}`}
            >
              <span className={`text-2xl ${theme === 'windows1992' ? 'text-sm' : ''}`}>📝</span>
              <span className={`text-sm ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'NEW POST' : 'New Post'}
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className={`flex flex-col items-center space-y-2 h-auto py-4 ${theme === 'windows1992' ? 'button-win95' : 'hover:shadow-glass hover:scale-105'}`}
            >
              <span className={`text-2xl ${theme === 'windows1992' ? 'text-sm' : ''}`}>🔍</span>
              <span className={`text-sm ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'FIND TEAM' : 'Find Team'}
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className={`flex flex-col items-center space-y-2 h-auto py-4 ${theme === 'windows1992' ? 'button-win95' : 'hover:shadow-glass hover:scale-105'}`}
            >
              <span className={`text-2xl ${theme === 'windows1992' ? 'text-sm' : ''}`}>📚</span>
              <span className={`text-sm ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'STUDY GROUP' : 'Study Group'}
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className={`flex flex-col items-center space-y-2 h-auto py-4 ${theme === 'windows1992' ? 'button-win95' : 'hover:shadow-glass hover:scale-105'}`}
            >
              <span className={`text-2xl ${theme === 'windows1992' ? 'text-sm' : ''}`}>📅</span>
              <span className={`text-sm ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'EVENTS' : 'Events'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}