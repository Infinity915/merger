import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearUser } from '@/lib/session.js'
import { Button } from '@/components/ui/button.jsx'
import { Avatar } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useTheme } from '@/lib/theme.js';

export default function Navigation({ currentView, onViewChange, user, setUser }) {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const profileMenuRef = useRef(null)
  const themeMenuRef = useRef(null)

  const navItems = [
    {
      id: 'events',
      label: 'Events',
      icon: '🎯',
      description: 'Hackathons, competitions & workshops',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'campus',
      label: 'Campus',
      icon: '🏛️',
      description: 'Your campus community',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'inter',
      label: 'Global Hub',
      icon: '🌐',
      description: 'Cross-college collaboration',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'badges',
      label: 'Badges',
      icon: '🏅',
      description: 'Achievements & recognition',
      gradient: 'from-yellow-500 to-orange-500'
    },
  ]

  const themes = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: '☀️',
      description: 'Clean & professional',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'cyber',
      label: 'Cyber Neon',
      icon: '🔮',
      description: 'Futuristic experience',
      gradient: 'from-cyan-400 to-purple-500'
    },
    {
      id: 'windows1992',
      label: 'Windows 1992',
      icon: '🖥️',
      description: 'Retro nostalgia',
      gradient: 'from-gray-400 to-gray-600'
    }
  ]

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavItemClick = (itemId) => {
    onViewChange(itemId)
    setIsMobileMenuOpen(false)
  }

  const handleThemeChange = (themeId) => {
    setTheme(themeId)
    setShowThemeMenu(false)
  }

  const getNavItemStyles = (itemId) => {
    const isActive = currentView === itemId
    const item = navItems.find(nav => nav.id === itemId)

    return `
      group relative flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm border
      ${isActive
        ? theme === 'windows1992'
          ? 'bg-primary text-primary-foreground border-primary shadow-inset'
          : `bg-gradient-to-r ${item?.gradient} text-white shadow-lg shadow-primary/25 scale-105 hover:scale-110 border-transparent`
        : theme === 'windows1992'
          ? 'text-muted-foreground hover:text-foreground glass hover:border-primary border-border hover:bg-muted button-win95'
          : 'text-muted-foreground hover:text-foreground glass hover:shadow-glass hover:scale-105 border-transparent hover:border-glass-border'
      }
      ${isActive && theme !== 'windows1992' ? 'shadow-neon' : theme !== 'windows1992' ? 'hover:shadow-glass-lg' : ''} press-effect
      ${theme === 'windows1992' ? 'windows1992:rounded-none' : ''}
    `
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Enhanced navigation bar with Windows 1992 styling */}
        <div className="glass-strong border-b border-glass-border windows1992:border-b windows1992:border-primary windows1992:bg-background-solid windows1992:rounded-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 windows1992:h-12">
              {/* Enhanced Logo */}
              <div className="flex items-center space-x-4 group cursor-pointer hover-lift" onClick={() => onViewChange('campus')}>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br from-primary via-purple-600 to-pink-600 ${theme === 'windows1992' ? 'rounded-none bg-primary border-2 border-outset button-win95 w-10 h-8' : 'rounded-2xl'} flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${theme === 'windows1992' ? '' : 'group-hover:rotate-3'} shadow-lg ${theme === 'windows1992' ? '' : 'hover:shadow-neon'}`}>
                    <span className={`text-white font-bold text-xl ${theme === 'windows1992' ? 'text-primary-foreground text-xs' : ''}`}>SC</span>

                    {/* Logo glow effect (not in windows1992) */}
                    {theme !== 'windows1992' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
                    )}
                  </div>

                  {/* Floating particles around logo (cyber theme only) */}
                  {theme === 'cyber' && (
                    <div className="absolute -inset-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-bounce"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${20 + (i % 2) * 60}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden sm:block">
                  <h1 className={`text-2xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm' : 'gradient-text cyber:glow-text'}`}>
                    {theme === 'windows1992' ? 'StudCollab' : 'StudCollab'}
                  </h1>
                  <p className={`text-xs text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                    {theme === 'windows1992' ? 'Student Platform' : 'Next-Gen Student Platform'}
                  </p>
                </div>
              </div>

              {/* Desktop Navigation with enhanced effects */}
              <div className="hidden md:flex items-center space-x-3">
                {navItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <button
                      onClick={() => handleNavItemClick(item.id)}
                      className={`${getNavItemStyles(item.id)} ${theme === 'windows1992' ? 'button-win95' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Button background shimmer (not in windows1992) */}
                      {theme !== 'windows1992' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      )}

                      <span className={`text-2xl transition-all duration-300 ${theme === 'windows1992' ? 'text-sm' : 'group-hover:scale-125 group-hover:rotate-12'} relative z-10`}>
                        {theme === 'windows1992' ?
                          ({ events: '⚡', campus: '🏠', inter: '🌍', badges: '★' }[item.id] || item.icon) :
                          item.icon
                        }
                      </span>
                      <span className={`font-semibold relative z-10 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                        {item.label}
                      </span>

                      {/* Active indicator */}
                      {currentView === item.id && (
                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 ${theme === 'windows1992' ? 'bg-primary-foreground rounded-none w-1 h-1' : 'bg-white rounded-full animate-pulse'}`}></div>
                      )}
                    </button>

                    {/* Enhanced tooltip (not in windows1992 theme) */}
                    {hoveredItem === item.id && theme !== 'windows1992' && (
                      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 scale-in">
                        <div className="glass-strong rounded-xl px-4 py-3 shadow-glass-lg text-sm whitespace-nowrap">
                          <div className="font-semibold text-foreground">{item.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>

                          {/* Tooltip arrow */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-card"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4">
                {/* Enhanced Theme Switcher */}
                <div className="relative" ref={themeMenuRef}>
                  <button
                    onClick={() => setShowThemeMenu(!showThemeMenu)}
                    className={`p-3 ${theme === 'windows1992' ? 'rounded-none border-2 border-outset bg-muted hover:bg-primary hover:text-primary-foreground button-win95 p-1' : 'rounded-2xl glass hover:shadow-glass-lg'} transition-all duration-300 hover-lift press-effect group relative overflow-hidden`}
                    title="Switch theme"
                  >
                    {/* Button shimmer (not in windows1992) */}
                    {theme !== 'windows1992' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    )}

                    <span className={`text-xl relative z-10 transition-transform duration-300 ${theme === 'windows1992' ? 'text-sm' : 'group-hover:scale-125'}`}>
                      {theme === 'light' && '☀️'}
                      {theme === 'windows1992' && '🖥️'}
                      {theme === 'cyber' && '🔮'}
                    </span>
                  </button>

                  {/* Enhanced Theme Dropdown */}
                  {showThemeMenu && (
                    <div className={`absolute right-0 top-full mt-3 w-72 glass-strong ${theme === 'windows1992' ? 'rounded-none border-2 border-outset bg-background-solid' : 'rounded-2xl'} shadow-glass-lg p-3 scale-in z-50`}>
                      <div className={`text-sm font-semibold text-foreground mb-4 px-3 py-2 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                        {theme === 'windows1992' ? 'Select Theme' : '🎨 Choose Your Vibe'}
                      </div>
                      <div className="space-y-2">
                        {themes.map((themeOption, index) => (
                          <button
                            key={themeOption.id}
                            onClick={() => handleThemeChange(themeOption.id)}
                            className={`w-full flex items-center space-x-4 px-4 py-3 ${theme === 'windows1992' ? 'rounded-none border-2 hover:bg-muted button-win95' : 'rounded-xl'} transition-all duration-300 text-left group hover-lift press-effect relative overflow-hidden ${theme === themeOption.id
                                ? theme === 'windows1992'
                                  ? 'bg-primary text-primary-foreground border-inset'
                                  : `bg-gradient-to-r ${themeOption.gradient} text-white shadow-lg`
                                : theme === 'windows1992'
                                  ? 'border-outset text-foreground hover:border-primary'
                                  : 'text-foreground hover:bg-glass-bg border-transparent'
                              } ${theme === 'windows1992' ? 'border-2' : ''}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Button shimmer (not in windows1992) */}
                            {theme !== 'windows1992' && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            )}

                            <span className={`text-2xl transition-transform duration-300 ${theme === 'windows1992' ? 'text-sm' : 'group-hover:scale-125'} relative z-10`}>
                              {themeOption.icon}
                            </span>
                            <div className="flex-1 relative z-10">
                              <div className={`font-semibold ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                                {themeOption.label}
                              </div>
                              <div className={`text-xs mt-1 ${theme === themeOption.id ? (theme === 'windows1992' ? 'text-primary-foreground' : 'text-white/80') : 'text-muted-foreground'} ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                                {themeOption.description}
                              </div>
                            </div>
                            {theme === themeOption.id && (
                              <div className={`text-xl animate-bounce relative z-10 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                                {theme === 'windows1992' ? '●' : '✨'}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Profile Section */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className={`flex items-center space-x-3 p-2 ${theme === 'windows1992' ? 'rounded-none border-2 border-outset bg-muted hover:bg-primary hover:text-primary-foreground button-win95 p-1' : 'rounded-2xl glass hover:shadow-glass-lg'} transition-all duration-300 hover-lift press-effect group relative overflow-hidden`}
                  >
                    {/* Button shimmer (not in windows1992) */}
                    {theme !== 'windows1992' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    )}

                    <Avatar
                      className={`w-12 h-12 ${theme === 'windows1992' ? 'rounded-none bg-primary text-primary-foreground border-2 border-outset w-8 h-6 text-xs' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'} font-medium shadow-lg group-hover:shadow-xl transition-all duration-300 ${theme === 'windows1992' ? '' : 'group-hover:scale-110'} relative z-10 ${theme === 'cyber' ? 'shadow-neon' : ''}`}
                      status="online"
                    >
                      {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </Avatar>

                    <div className={`hidden sm:block text-left relative z-10 ${theme === 'windows1992' ? '' : ''}`}>
                      <div className={`font-semibold text-foreground text-sm ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                        {user?.fullName || user?.name || 'User'}
                      </div>
                      <div className={`text-xs text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                        {`${user?.collegeName || 'College'} • Level ${user?.level || 12}`}
                      </div>
                    </div>

                    <div className={`text-muted-foreground transition-transform duration-300 ${theme === 'windows1992' ? 'text-xs' : 'group-hover:rotate-180'} relative z-10`}>
                      {theme === 'windows1992' ? '▼' : '⌄'}
                    </div>
                  </button>

                  {/* Enhanced Profile Dropdown */}
                  {showProfileMenu && (
                    <div className={`absolute right-0 top-full mt-3 w-96 glass-strong ${theme === 'windows1992' ? 'rounded-none border-2 border-outset bg-background-solid' : 'rounded-2xl'} shadow-glass-lg overflow-hidden scale-in z-50`}>
                      {/* Header */}
                      <div className={`p-6 ${theme === 'windows1992' ? 'bg-muted border-b-2 border-inset' : 'bg-gradient-to-br from-primary/20 via-purple-600/20 to-pink-600/10 border-b border-glass-border'} relative overflow-hidden`}>
                        {/* Header background pattern (not in windows1992) */}
                        {theme !== 'windows1992' && (
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                              backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px)',
                              backgroundSize: '20px 20px'
                            }}></div>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 relative z-10">
                          <Avatar
                            className={`w-20 h-20 ${theme === 'windows1992' ? 'rounded-none bg-primary text-primary-foreground border-2 border-outset w-16 h-12 text-sm' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'} font-medium text-2xl shadow-xl ${theme === 'windows1992' ? '' : 'hover:shadow-neon'} transition-all duration-300`}
                            status="online"
                          >
                            {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <div className="flex-1">
                            <div className={`font-bold text-xl text-foreground ${theme === 'windows1992' ? 'text-sm' : 'gradient-text'}`}>
                              {user?.fullName || user?.name || 'User'}
                            </div>
                            <div className={`text-sm text-muted-foreground mb-2 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                              {`${user?.collegeName || 'College'} • ${user?.year || '3rd Year'}`}
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 ${theme === 'windows1992' ? 'bg-primary rounded-none w-2 h-2' : 'bg-green-500 rounded-full animate-pulse'} shadow-lg`}></div>
                                <span className={`text-xs ${theme === 'windows1992' ? 'text-primary text-xs' : 'text-green-600'} font-semibold`}>
                                  Online
                                </span>
                              </div>
                              <div className={`text-xs ${theme === 'windows1992' ? 'text-primary' : 'text-primary'} font-semibold`}>
                                Level {user?.level || 12}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Quick Stats */}
                      <div className={`p-4 ${theme === 'windows1992' ? 'border-b-2 border-inset' : 'border-b border-glass-border'}`}>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className={`glass p-3 ${theme === 'windows1992' ? 'rounded-none border-2 border-inset hover:border-outset button-win95' : 'rounded-xl'} hover-lift`}>
                            <div className={`text-xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm' : 'text-blue-500'}`}>
                              {user?.projectsCompleted || 12}
                            </div>
                            <div className={`text-xs text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                              Projects
                            </div>
                          </div>
                          <div className={`glass p-3 ${theme === 'windows1992' ? 'rounded-none border-2 border-inset hover:border-outset button-win95' : 'rounded-xl'} hover-lift`}>
                            <div className={`text-xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm' : 'text-green-500'}`}>
                              {user?.collaborationsActive || 5}
                            </div>
                            <div className={`text-xs text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                              Active
                            </div>
                          </div>
                          <div className={`glass p-3 ${theme === 'windows1992' ? 'rounded-none border-2 border-inset hover:border-outset button-win95' : 'rounded-xl'} hover-lift`}>
                            <div className={`text-xl font-bold ${theme === 'windows1992' ? 'text-primary text-sm' : 'gradient-text'}`}>
                              {user?.profileStrength || 85}%
                            </div>
                            <div className={`text-xs text-muted-foreground ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                              Profile
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Badges Preview */}
                      <div className={`p-4 ${theme === 'windows1992' ? 'border-b-2 border-inset' : 'border-b border-glass-border'}`}>
                        <div className={`text-sm font-semibold text-foreground mb-3 flex items-center ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                          <span className="mr-2">{theme === 'windows1992' ? '★' : '🏆'}</span>
                          Featured Badges
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {/* Show moderation badge if user has it */}
                          {user?.hasModerationBadge && (
                            <Badge className={`text-xs glass ${theme === 'windows1992' ? 'rounded-none border-2 border-inset text-xs' : 'hover:shadow-glass-lg'} transition-all duration-300 hover-lift badge-earn`}>
                              {theme === 'windows1992' ? '●' : '🛡️'} {user?.moderationBadge || 'Moderator'}
                            </Badge>
                          )}
                          {/* Show user's regular badges */}
                          {(user?.badges || []).slice(0, 2).map((badge, index) => (
                            <Badge
                              key={badge}
                              className={`text-xs glass ${theme === 'windows1992' ? 'rounded-none border-2 border-inset text-xs' : 'hover:shadow-glass-lg'} transition-all duration-300 hover-lift`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {badge}
                            </Badge>
                          ))}
                          {user?.badges?.length > 2 && (
                            <Badge variant="outline" className={`text-xs glass ${theme === 'windows1992' ? 'rounded-none border-2 border-inset text-xs' : 'hover:shadow-glass-lg'} transition-all duration-300 hover-lift`}>
                              +{user.badges.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Quick Actions */}
                      <div className="p-4 space-y-2">
                        {[
                          { icon: theme === 'windows1992' ? '●' : '👤', label: 'View Profile', action: 'profile' },
                          { icon: theme === 'windows1992' ? '★' : '🏅', label: 'My Badges', action: 'badges' },
                          { icon: theme === 'windows1992' ? '→' : '🚀', label: 'Go to Campus', action: 'campus' }
                        ].map((item, index) => (
                          <Button
                            key={item.action}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onViewChange(item.action)
                              setShowProfileMenu(false)
                            }}
                            className={`w-full justify-start glass ${theme === 'windows1992' ? 'rounded-none border-2 border-outset text-xs button-win95' : 'hover:shadow-glass-lg'} transition-all duration-300 hover-lift press-effect group relative overflow-hidden`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {/* Button shimmer (not in windows1992) */}
                            {theme !== 'windows1992' && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            )}

                            <span className={`mr-3 text-lg transition-transform duration-300 ${theme === 'windows1992' ? 'text-xs' : 'group-hover:scale-125'} relative z-10`}>
                              {item.icon}
                            </span>
                            <span className="relative z-10">{item.label}</span>
                          </Button>
                        ))}

                        <Button
                          key="logout"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await fetch('http://localhost:8080/api/auth/logout', { method: 'POST', credentials: 'include' });
                            } catch (e) {
                              // ignore
                            }
                            try { clearUser(); sessionStorage.clear(); } catch (e) { }
                            if (setUser) setUser(null)
                            navigate('/');
                          }}
                          className={`w-full justify-start glass ${theme === 'windows1992' ? 'rounded-none border-2 border-outset text-xs button-win95' : 'hover:shadow-glass-lg'} transition-all duration-300 hover-lift press-effect group relative overflow-hidden`}
                        >
                          {theme !== 'windows1992' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          )}
                          <span className="mr-3 text-lg relative z-10">🚪</span>
                          <span className="relative z-10">Log Out</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`p-3 ${theme === 'windows1992' ? 'rounded-none border-2 border-outset bg-muted hover:bg-primary hover:text-primary-foreground button-win95 p-1' : 'rounded-2xl glass hover:shadow-glass-lg'} transition-all duration-300 hover-lift press-effect group`}
                  >
                    <div className="space-y-1.5">
                      <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''} ${theme === 'windows1992' ? 'h-1 w-4' : ''}`}></div>
                      <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''} ${theme === 'windows1992' ? 'h-1 w-4' : ''}`}></div>
                      <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''} ${theme === 'windows1992' ? 'h-1 w-4' : ''}`}></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden glass-strong ${theme === 'windows1992' ? 'rounded-none border-2 border-outset bg-background-solid' : 'rounded-b-2xl'} border-t-0 shadow-glass-lg scale-in`}>
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item.id)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 ${theme === 'windows1992' ? 'rounded-none border-2 hover:bg-muted button-win95' : 'rounded-xl'} transition-all duration-300 text-left group hover-lift press-effect relative overflow-hidden ${currentView === item.id
                      ? theme === 'windows1992'
                        ? 'bg-primary text-primary-foreground border-inset'
                        : `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : theme === 'windows1992'
                        ? 'border-outset text-foreground hover:border-primary'
                        : 'text-foreground hover:bg-glass-bg border-transparent'
                    } ${theme === 'windows1992' ? 'border-2' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Button shimmer (not in windows1992) */}
                  {theme !== 'windows1992' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}

                  <span className={`text-2xl transition-transform duration-300 ${theme === 'windows1992' ? 'text-sm' : 'group-hover:scale-125'} relative z-10`}>
                    {theme === 'windows1992' ?
                      ({ events: '⚡', campus: '🏠', inter: '🌍', badges: '★' }[item.id] || item.icon) :
                      item.icon
                    }
                  </span>
                  <div className="flex-1 relative z-10">
                    <div className={`font-semibold ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs mt-1 ${currentView === item.id ? (theme === 'windows1992' ? 'text-primary-foreground' : 'text-white/80') : 'text-muted-foreground'} ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                      {item.description}
                    </div>
                  </div>
                  {currentView === item.id && (
                    <div className={`text-xl animate-bounce relative z-10 ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                      {theme === 'windows1992' ? '●' : '✨'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}