import { useState } from 'react'
import { Card } from './ui/card.jsx'
import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { Avatar } from './ui/avatar.jsx'
import { Input } from './ui/input.jsx'
import { Textarea } from './ui/textarea.jsx'

export default function ProfilePage({ user, onBackToCampus }) {
  const [showEndorsementModal, setShowEndorsementModal] = useState(false)
  const [endorsementData, setEndorsementData] = useState({
    searchQuery: '',
    selectedUsers: [],
    message: ''
  })

  // Mock users for autocomplete
  const availableUsers = [
    'Rahul Sharma (IIT Bombay)',
    'Ananya Patel (BITS Pilani)', 
    'Kiran Joshi (NIT Surat)',
    'Priya Singh (VIT Chennai)',
    'Arjun Kumar (IIIT Hyderabad)'
  ]

  const filteredUsers = availableUsers.filter(u => 
    u.toLowerCase().includes(endorsementData.searchQuery.toLowerCase()) &&
    !endorsementData.selectedUsers.includes(u)
  )

  const handleAddUser = (userName) => {
    setEndorsementData(prev => ({
      ...prev,
      selectedUsers: [...prev.selectedUsers, userName],
      searchQuery: ''
    }))
  }

  const handleRemoveUser = (userName) => {
    setEndorsementData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter(u => u !== userName)
    }))
  }

  const handleSendEndorsementRequest = () => {
    if (endorsementData.selectedUsers.length === 0 || !endorsementData.message.trim()) {
      alert('Please select at least one user and write a message.')
      return
    }

    alert(`Endorsement requests sent to: ${endorsementData.selectedUsers.join(', ')}`)
    setShowEndorsementModal(false)
    setEndorsementData({ searchQuery: '', selectedUsers: [], message: '' })
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={onBackToCampus}
          className="flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Campus</span>
        </Button>
      </div>

      {/* Profile Header */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <Avatar className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-medium">
            {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
          </Avatar>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{user?.fullName || user?.name || 'User Name'}</h1>
          <p className="text-xl text-muted-foreground">{user?.collegeName || 'College Name'}</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <Badge variant="outline">{user?.yearOfStudy || user?.year || '3rd Year'}</Badge>
            <Badge variant="outline">{user?.branch || 'Computer Science'}</Badge>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">15</div>
          <div className="text-sm text-muted-foreground">Collaborations</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-muted-foreground">Projects</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600">23</div>
          <div className="text-sm text-muted-foreground">Endorsements</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-orange-600">12</div>
          <div className="text-sm text-muted-foreground">Badges</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <Button onClick={() => setShowEndorsementModal(true)}>
          Request Endorsement
        </Button>
        <Button variant="outline">Edit Profile</Button>
        <Button variant="outline">View Public Profile</Button>
      </div>

      {/* Profile Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Skills & Expertise */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Skills & Expertise</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(user?.skills || ['React', 'TypeScript', 'Node.js', 'Python']).map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {(user?.interests || ['Web Development', 'AI/ML', 'Startups']).map((interest) => (
                  <Badge key={interest} className="bg-purple-100 text-purple-700">{interest}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Joined AI Study Assistant collab pod</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Posted in Campus Feed</span>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Earned "Team Player" badge</span>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </Card>

        {/* Endorsements */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Endorsements</h3>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 text-white">
                  R
                </Avatar>
                <div>
                  <div className="font-medium text-sm">Rahul Sharma</div>
                  <div className="text-xs text-muted-foreground">IIT Bombay</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"Great collaborator with strong technical skills in React and TypeScript."</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  A
                </Avatar>
                <div>
                  <div className="font-medium text-sm">Ananya Patel</div>
                  <div className="text-xs text-muted-foreground">BITS Pilani</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"Excellent team player and problem solver. Highly recommended!"</p>
            </div>
          </div>
        </Card>

        {/* Project Portfolio */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Project Portfolio</h3>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium mb-2">E-commerce Platform</h4>
              <p className="text-sm text-muted-foreground mb-2">Built with React, Node.js, and MongoDB</p>
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">React</Badge>
                <Badge variant="outline" className="text-xs">Node.js</Badge>
                <Badge variant="outline" className="text-xs">MongoDB</Badge>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium mb-2">AI Study Assistant</h4>
              <p className="text-sm text-muted-foreground mb-2">Machine learning powered study companion</p>
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">Python</Badge>
                <Badge variant="outline" className="text-xs">TensorFlow</Badge>
                <Badge variant="outline" className="text-xs">Flask</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Endorsement Request Modal */}
      {showEndorsementModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Request Endorsement</h3>
              <Button variant="outline" size="sm" onClick={() => setShowEndorsementModal(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-3 text-lg">Select Users to Request From</label>
                <div className="space-y-3">
                  {/* Selected Users */}
                  {endorsementData.selectedUsers.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Selected Users:</div>
                      <div className="flex flex-wrap gap-2">
                        {endorsementData.selectedUsers.map((user) => (
                          <Badge 
                            key={user} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-destructive/10 hover:text-destructive px-3 py-1"
                            onClick={() => handleRemoveUser(user)}
                          >
                            @{user.split(' (')[0]} ✕
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Search Input */}
                  <div className="relative">
                    <Input
                      placeholder="Search users to @mention..."
                      value={endorsementData.searchQuery}
                      onChange={(e) => setEndorsementData(prev => ({ ...prev, searchQuery: e.target.value }))}
                      className="rounded-xl"
                    />
                    
                    {/* Autocomplete Dropdown */}
                    {endorsementData.searchQuery && filteredUsers.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <button
                            key={user}
                            onClick={() => handleAddUser(user)}
                            className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                          >
                            @{user}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-3 text-lg">Custom Message</label>
                <Textarea
                  placeholder="Write a personal message explaining what you'd like them to endorse you for..."
                  value={endorsementData.message}
                  onChange={(e) => setEndorsementData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Be specific about what you'd like to be endorsed for (skills, collaboration quality, project contributions, etc.)
                </p>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleSendEndorsementRequest}
                  disabled={endorsementData.selectedUsers.length === 0 || !endorsementData.message.trim()}
                  className="flex-1 py-3 rounded-xl"
                >
                  📨 Send Endorsement Requests
                </Button>
                <Button variant="outline" onClick={() => setShowEndorsementModal(false)} className="py-3 rounded-xl">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}