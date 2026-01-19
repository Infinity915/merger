import { useState } from 'react'
import { Card } from './ui/card.jsx'
import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { Avatar } from './ui/avatar.jsx'

const badgeCategories = [
  {
    id: 'community',
    name: 'Community & Chat',
    color: 'blue',
    badges: [
      {
        id: 'first-reply',
        name: 'Reply Rookie',
        icon: '💬',
        tier: 'Common',
        description: 'Made your first reply in a discussion',
        progress: { current: 1, total: 1 },
        isUnlocked: true,
        isActive: true,
        perks: ['Chat boost: +1 visibility']
      },
      {
        id: 'discussion-starter',
        name: 'Discussion Dynamo',
        icon: '🧠',
        tier: 'Uncommon',
        description: 'Started 5 meaningful discussions',
        progress: { current: 3, total: 5 },
        isUnlocked: false,
        isActive: false,
        perks: ['Enhanced post visibility', 'Discussion leader tag']
      },
      {
        id: 'community-helper',
        name: 'Community Champion',
        icon: '🤝',
        tier: 'Rare',
        description: 'Helped 25+ community members',
        progress: { current: 12, total: 25 },
        isUnlocked: false,
        isActive: false,
        perks: ['Helper status', 'Priority support']
      }
    ]
  },
  {
    id: 'pods',
    name: 'Pods & Teamwork',
    color: 'green',
    badges: [
      {
        id: 'pod-rookie',
        name: 'Pod Rookie',
        icon: '🌱',
        tier: 'Common',
        description: 'Completed your first collaboration pod',
        progress: { current: 1, total: 1 },
        isUnlocked: true,
        isActive: false,
        perks: ['Pod history tracking']
      },
      {
        id: 'team-player',
        name: 'Team Spirit',
        icon: '⚡',
        tier: 'Uncommon',
        description: 'Completed 3 successful team projects',
        progress: { current: 2, total: 3 },
        isUnlocked: false,
        isActive: false,
        perks: ['Team formation priority', 'Leadership opportunities']
      }
    ]
  },
  {
    id: 'skills',
    name: 'Skills & Projects',
    color: 'orange',
    badges: [
      {
        id: 'skill-explorer',
        name: 'Skill Seedling',
        icon: '🌿',
        tier: 'Common',
        description: 'Added 3+ skills to your profile',
        progress: { current: 5, total: 3 },
        isUnlocked: true,
        isActive: true,
        perks: ['Enhanced profile visibility']
      }
    ]
  },
  {
    id: 'platform',
    name: 'Platform Milestone',
    color: 'silver',
    badges: [
      {
        id: 'early-adopter',
        name: 'Platform Pioneer',
        icon: '🚀',
        tier: 'Legendary',
        description: 'One of the first 100 users on the platform',
        progress: { current: 1, total: 1 },
        isUnlocked: true,
        isActive: true,
        perks: ['Pioneer status', 'Exclusive features', 'Beta access']
      }
    ]
  }
]

// Single moderator-exclusive badge (cannot be earned through activities)
const moderatorBadge = {
  id: 'signal-guardian',
  name: 'Signal Guardian',
  icon: '🛡️',
  tier: 'Legendary',
  description: 'Platform enforcer. Community mentor.',
  progress: { current: 1, total: 1 },
  isUnlocked: true,
  isActive: true,
  perks: ['Moderation tools', 'Community leadership', 'Special recognition'],
  isModeratorOnly: true,
  cannotBeHidden: true,
  isPermanent: true
}

// 5 Moderation badges for sub-moderators/community wardens
const moderationBadges = [
  {
    id: 'chat-mod',
    name: 'Chat Warden',
    icon: '💬',
    tier: 'Basic',
    nextTier: 'Advanced',
    description: 'Moderates chat and discussion areas',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: ['Chat moderation tools', 'Warning powers'],
    cannotBeHidden: true,
    duration: 'Permanent',
    responsibility: 'Chat & Discussion Moderation',
    isModeratorBadge: true
  },
  {
    id: 'post-mod',
    name: 'Content Guardian',
    icon: '📝',
    tier: 'Advanced',
    nextTier: 'Elite',
    description: 'Moderates posts and content quality',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: ['Post moderation', 'Content approval'],
    cannotBeHidden: true,
    duration: 'Permanent',
    responsibility: 'Post & Content Moderation',
    isModeratorBadge: true
  },
  {
    id: 'event-mod',
    name: 'Event Coordinator',
    icon: '🎯',
    tier: 'Elite',
    description: 'Manages events and activities',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: ['Event creation', 'Activity management'],
    cannotBeHidden: true,
    duration: 'Permanent',
    responsibility: 'Event & Activity Management',
    isModeratorBadge: true
  },
  {
    id: 'pod-mod',
    name: 'Collab Supervisor',
    icon: '🏗️',
    tier: 'Advanced',
    description: 'Supervises collaboration pods and rooms',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: ['Pod oversight', 'Collaboration tools'],
    cannotBeHidden: true,
    duration: 'Permanent',
    responsibility: 'Collaboration Space Management',
    isModeratorBadge: true
  },
  {
    id: 'community-lead',
    name: 'Community Leader',
    icon: '👑',
    tier: 'Elite',
    description: 'Overall community leadership and guidance',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: ['Full community tools', 'Leadership status'],
    cannotBeHidden: true,
    duration: 'Permanent',
    responsibility: 'Community Leadership',
    isModeratorBadge: true
  }
]

// 5 Penalty badges for rule violations
const penaltyBadges = [
  {
    id: 'spammer',
    name: 'Spam Alert',
    icon: '🚫',
    tier: 'Warning',
    nextTier: 'Minor',
    description: 'Issued for spam or repetitive content',
    progress: { current: 1, total: 1 },
    isUnlocked: true,
    isActive: true,
    perks: [],
    cannotBeHidden: true,
    duration: '3 days',
    expiresAt: '2024-02-18',
    isPenaltyBadge: true,
    offense: 'Excessive posting in multiple channels',
    visibilityLevel: 'Profile, Posts, Comments, Chats'
  },
  {
    id: 'toxic-behavior',
    name: 'Behavior Warning',
    icon: '⚠️',
    tier: 'Minor',
    nextTier: 'Major',
    description: 'Warning for toxic or inappropriate behavior',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: [],
    cannotBeHidden: true,
    duration: '7 days',
    expiresAt: null,
    isPenaltyBadge: true,
    offense: 'Inappropriate language and harassment',
    visibilityLevel: 'Profile, Posts, Comments, Chats'
  },
  {
    id: 'fake-info',
    name: 'Misinformation Flag',
    icon: '🔍',
    tier: 'Major',
    nextTier: 'Severe',
    description: 'Sharing false or misleading information',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: [],
    cannotBeHidden: true,
    duration: '30 days',
    expiresAt: null,
    isPenaltyBadge: true,
    offense: 'Spreading misinformation about academic topics',
    visibilityLevel: 'Profile, Posts, Comments, Chats'
  },
  {
    id: 'abuse-violation',
    name: 'Abuse Violation',
    icon: '🚨',
    tier: 'Severe',
    nextTier: 'Permanent',
    description: 'Serious abuse or harassment violation',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: [],
    cannotBeHidden: true,
    duration: '90 days',
    expiresAt: null,
    isPenaltyBadge: true,
    offense: 'Severe harassment of community members',
    visibilityLevel: 'Profile, Posts, Comments, Chats'
  },
  {
    id: 'permanent-record',
    name: 'Permanent Mark',
    icon: '⛔',
    tier: 'Permanent',
    description: 'Permanent mark on community record',
    progress: { current: 1, total: 1 },
    isUnlocked: false,
    isActive: false,
    perks: [],
    cannotBeHidden: true,
    duration: 'Permanent',
    expiresAt: null,
    isPenaltyBadge: true,
    offense: 'Multiple severe violations or illegal content',
    visibilityLevel: 'Profile, Posts, Comments, Chats'
  }
]

export default function BadgeCenter({ user }) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState(null)

  // Check user status
  const isModerator = user?.hasModerationBadge || true // Mock for testing
  const hasModerationBadges = user?.hasModerationBadges || false // Mock - would be assigned by system
  const hasPenaltyBadges = penaltyBadges.some(badge => badge.isUnlocked)

  const allBadges = badgeCategories.flatMap(cat => cat.badges.map(badge => ({ ...badge, category: cat.name, categoryColor: cat.color })))
  const earnedBadges = allBadges.filter(badge => badge.isUnlocked)
  const evolvingBadges = allBadges.filter(badge => !badge.isUnlocked && badge.progress.current > 0)

  const tabs = [
    { id: 'all', label: 'All Badges', icon: '🏅' },
    { id: 'earned', label: 'Earned Badges', icon: '✅' },
    { id: 'evolving', label: 'Evolving Badges', icon: '📈' },
    ...(isModerator ? [{ id: 'mod-badge', label: 'Mod Badge', icon: '🛡️' }] : []),
    ...(hasModerationBadges ? [{ id: 'moderation-badges', label: 'Moderation Badges', icon: '🛡️' }] : []),
    ...(hasPenaltyBadges ? [{ id: 'penalty-badges', label: 'Penalty Badges', icon: '🚫' }] : [])
  ]

  const getBadgesForTab = () => {
    switch (activeTab) {
      case 'earned':
        return earnedBadges
      case 'evolving':
        return evolvingBadges
      case 'mod-badge':
        return isModerator ? [moderatorBadge] : []
      case 'moderation-badges':
        return hasModerationBadges ? moderationBadges.filter(badge => badge.isUnlocked) : []
      case 'penalty-badges':
        return hasPenaltyBadges ? penaltyBadges.filter(badge => badge.isUnlocked) : []
      default:
        return allBadges
    }
  }

  const getFilteredBadges = () => {
    const badges = getBadgesForTab()
    if (selectedCategory === 'all' || activeTab !== 'all') return badges
    return badges.filter(badge => {
      const category = badgeCategories.find(cat => cat.badges.some(b => b.id === badge.id))
      return category?.id === selectedCategory
    })
  }

  const getTierColor = (tier) => {
    const colors = {
      'Common': 'text-gray-600 bg-gray-100',
      'Uncommon': 'text-green-600 bg-green-100',
      'Rare': 'text-blue-600 bg-blue-100',
      'Epic': 'text-purple-600 bg-purple-100',
      'Legendary': 'text-yellow-600 bg-yellow-100',
      'Basic': 'text-blue-600 bg-blue-100',
      'Advanced': 'text-purple-600 bg-purple-100',
      'Elite': 'text-yellow-600 bg-yellow-100',
      'Warning': 'text-orange-600 bg-orange-100',
      'Minor': 'text-red-600 bg-red-100',
      'Major': 'text-red-700 bg-red-200',
      'Severe': 'text-red-800 bg-red-300',
      'Permanent': 'text-black bg-red-400'
    }
    return colors[tier] || 'text-gray-600 bg-gray-100'
  }

  const getTierStars = (tier) => {
    const stars = {
      'Common': '★',
      'Uncommon': '★★',
      'Rare': '★★★',
      'Epic': '★★★★',
      'Legendary': '★★★★★',
      'Basic': '⚡',
      'Advanced': '⚡⚡',
      'Elite': '⚡⚡⚡',
      'Warning': '⚠️',
      'Minor': '⚠️⚠️',
      'Major': '🚨',
      'Severe': '🚨🚨',
      'Permanent': '⛔'
    }
    return stars[tier] || '★'
  }

  const getActiveBadges = () => {
    const regularBadges = allBadges.filter(badge => badge.isActive && badge.isUnlocked)
    const specialBadges = []
    
    // Always include moderator badge if user has it
    if (isModerator) {
      specialBadges.push(moderatorBadge)
    }
    
    // Add active moderation badges (cannot be hidden)
    if (hasModerationBadges) {
      const activeModerationBadges = moderationBadges.filter(badge => badge.isUnlocked && badge.isActive)
      specialBadges.push(...activeModerationBadges)
    }
    
    // Add active penalty badges (cannot be hidden)
    const activePenaltyBadges = penaltyBadges.filter(badge => badge.isUnlocked && badge.isActive)
    specialBadges.push(...activePenaltyBadges)
    
    // Combine: special badges + up to remaining slots of regular badges
    const maxRegularBadges = Math.max(0, 3 - specialBadges.length)
    return [...specialBadges, ...regularBadges.slice(0, maxRegularBadges)]
  }

  const toggleBadgeActive = (badgeId) => {
    const activeBadges = getActiveBadges()
    const badge = allBadges.find(b => b.id === badgeId)
    
    if (!badge || !badge.isUnlocked) return
    
    // Cannot toggle special badges
    if (badgeId === 'signal-guardian' || 
        moderationBadges.some(mb => mb.id === badgeId) || 
        penaltyBadges.some(pb => pb.id === badgeId)) {
      alert('Special badges cannot be hidden or deactivated.')
      return
    }
    
    // Check if adding would exceed limit
    const nonSpecialBadgesActive = activeBadges.filter(b => 
      b.id !== 'signal-guardian' && 
      !moderationBadges.some(mb => mb.id === b.id) &&
      !penaltyBadges.some(pb => pb.id === b.id)
    ).length
    
    const specialBadgesCount = activeBadges.length - nonSpecialBadgesActive
    
    if (nonSpecialBadgesActive >= (3 - specialBadgesCount) && !badge.isActive) {
      alert('You can only display 3 badges total. Special badges are always visible.')
      return
    }

    badgeCategories.forEach(category => {
      category.badges.forEach(b => {
        if (b.id === badgeId) {
          b.isActive = !b.isActive
        }
      })
    })
  }

  const getRemainingTime = (expiresAt) => {
    if (!expiresAt) return null
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} days remaining`
    return `${hours} hours remaining`
  }

  const totalBadges = allBadges.length + (isModerator ? 1 : 0) + moderationBadges.length + penaltyBadges.length
  const totalEarned = earnedBadges.length + (isModerator ? 1 : 0) + 
    moderationBadges.filter(b => b.isUnlocked).length + 
    penaltyBadges.filter(b => b.isUnlocked).length

  return (
    <div className="badge-center-ui space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
          🏅 Badge Center
        </h1>
        <p className="text-lg text-muted-foreground">Track your achievements and showcase your skills</p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{totalEarned} of {totalBadges} badges</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(totalEarned / totalBadges) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-muted/30 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md transform scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Category Filter - Only for 'all' tab */}
      {activeTab === 'all' && (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            }`}
          >
            All Categories
          </button>
          {badgeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Active Badges Strip */}
      <div className="component-profile-badge-strip bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
        <h3 className="font-semibold text-lg mb-4 text-center">Featured Badges (Displayed on Profile)</h3>
        <div className="flex justify-center space-x-4">
          {getActiveBadges().map((badge) => (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center p-4 rounded-xl border-2 relative ${
                badge.tier === 'Legendary' || badge.tier === 'Elite' ? 'border-yellow-300 bg-yellow-50 shadow-lg' : 
                badge.isPenaltyBadge ? 'border-red-300 bg-red-50 shadow-lg' : 
                badge.isModeratorBadge ? 'border-blue-300 bg-blue-50 shadow-lg' :
                'border-gray-200 bg-white'
              }`}
            >
              {/* Cannot hide indicator for special badges */}
              {(badge.cannotBeHidden || badge.id === 'signal-guardian') && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
              )}
              
              <div className={`text-3xl mb-2 ${badge.tier === 'Legendary' || badge.tier === 'Elite' ? 'animate-pulse' : ''} ${badge.isPenaltyBadge ? 'opacity-80' : ''}`}>
                {badge.icon}
              </div>
              <span className="font-medium text-sm text-center">{badge.name}</span>
              <Badge className={`${getTierColor(badge.tier)} text-xs mt-1`}>
                {getTierStars(badge.tier)}
              </Badge>
              
              {/* Duration indicator for timed badges */}
              {badge.duration && badge.duration !== 'Permanent' && (
                <div className="text-xs text-orange-600 mt-1">
                  {getRemainingTime(badge.expiresAt)}
                </div>
              )}
            </div>
          ))}
          {getActiveBadges().length < 3 && (
            <div className="flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-3xl mb-2 text-gray-400">➕</div>
              <span className="text-sm text-gray-500 text-center">Empty Slot</span>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4 text-sm text-muted-foreground">
          💡 Special badges (Moderator, Moderation, Penalty) are always visible and cannot be hidden
        </div>
      </div>

      {/* Regular Badges Grid */}
      {(activeTab !== 'mod-badge' && activeTab !== 'moderation-badges' && activeTab !== 'penalty-badges') && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getFilteredBadges().map((badge) => (
            <Card 
              key={badge.id} 
              className={`component-badge-card p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl cursor-pointer ${
                !badge.isUnlocked ? 'opacity-60' : ''
              } ${badge.tier === 'Legendary' ? 'border-yellow-300 shadow-lg' : ''}`}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className="text-center space-y-3">
                <div className={`text-5xl ${badge.tier === 'Legendary' ? 'animate-pulse' : ''} ${!badge.isUnlocked ? 'grayscale' : ''}`}>
                  {badge.isUnlocked ? badge.icon : '🔒'}
                </div>
                <h3 className="font-semibold text-lg">{badge.name}</h3>
                <Badge className={`${getTierColor(badge.tier)} px-3 py-1 rounded-full`}>
                  {getTierStars(badge.tier)}
                </Badge>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
                
                {/* Progress bar for unearned badges */}
                {!badge.isUnlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{badge.progress.current}/{badge.progress.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(badge.progress.current / badge.progress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Toggle active button for earned badges */}
                {badge.isUnlocked && (
                  <Button
                    size="sm"
                    variant={badge.isActive ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBadgeActive(badge.id)
                    }}
                    className="w-full"
                  >
                    {badge.isActive ? 'Featured' : 'Add to Profile'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-8 rounded-2xl shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-6xl">{selectedBadge.isUnlocked ? selectedBadge.icon : '🔒'}</div>
              <h2 className="text-2xl font-bold">{selectedBadge.name}</h2>
              <Badge className={`${getTierColor(selectedBadge.tier)} px-4 py-2 text-sm`}>
                {getTierStars(selectedBadge.tier)} {selectedBadge.tier}
              </Badge>
              <p className="text-muted-foreground">{selectedBadge.description}</p>
              
              {selectedBadge.perks && selectedBadge.perks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Perks:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedBadge.perks.map((perk, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>•</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button onClick={() => setSelectedBadge(null)} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}