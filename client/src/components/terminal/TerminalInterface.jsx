import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Avatar } from '@/components/ui/avatar.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useTheme } from '@/lib/theme.js'

export default function TerminalInterface({ 
  type, 
  title, 
  user, 
  onExit, 
  isFullScreen = false, 
  onToggleFullScreen 
}) {
  const { theme } = useTheme()
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([
    {
      command: 'system',
      output: `Welcome to ${title}! Type /help for available commands.`,
      timestamp: '10:30 AM',
      type: 'system'
    }
  ])
  const [showMemberPanel, setShowMemberPanel] = useState(true)
  const [showVoiceCall, setShowVoiceCall] = useState(false)
  const [voiceCallMembers, setVoiceCallMembers] = useState([])
  const [isInVoiceCall, setIsInVoiceCall] = useState(false)
  
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  // Mock members data
  const [members] = useState([
    { id: '1', name: user?.fullName || 'You', avatar: 'YU', status: 'online', role: 'host', isVoiceActive: false },
    { id: '2', name: 'Sarah Chen', avatar: 'SC', status: 'online', role: 'member', isVoiceActive: false },
    { id: '3', name: 'Alex Kumar', avatar: 'AK', status: 'away', role: 'member', isVoiceActive: false },
    { id: '4', name: 'Maria Rodriguez', avatar: 'MR', status: 'online', role: 'member', isVoiceActive: false },
  ])

  // Available commands
  const commands = {
    '/help': 'Show available commands',
    '/members': 'List all members',
    '/voice': 'Start or join voice call',
    '/leave-voice': 'Leave voice call',
    '/status': 'Show collaboration status',
    '/tasks': 'View current tasks',
    '/share': 'Share a file or link',
    '/clear': 'Clear terminal',
    '/exit': 'Exit terminal'
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && isFullScreen && onExit) {
        onExit()
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        handleCommand('/clear')
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isFullScreen, onExit])

  const addToHistory = (cmd, output, type = 'info') => {
    const newEntry = {
      command: cmd,
      output,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    }
    setHistory(prev => [...prev, newEntry])
  }

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase()
    
    // Add command to history
    if (cleanCmd && !cleanCmd.startsWith('system')) {
      addToHistory(cleanCmd, '', 'info')
    }

    // Process commands
    switch (cleanCmd) {
      case '/help':
        const helpText = Object.entries(commands)
          .map(([cmd, desc]) => `${cmd.padEnd(15)} - ${desc}`)
          .join('\n')
        addToHistory('system', `Available commands:\n${helpText}`, 'system')
        break

      case '/members':
        const membersList = members
          .map(m => `${m.name.padEnd(20)} [${m.status.toUpperCase()}] ${m.role === 'host' ? '👑' : ''}`)
          .join('\n')
        addToHistory('system', `Active members (${members.length}):\n${membersList}`, 'system')
        break

      case '/voice':
        setShowVoiceCall(true)
        setIsInVoiceCall(true)
        setVoiceCallMembers([user?.fullName || 'You'])
        addToHistory('system', 'Voice call initiated. Other members can join using /voice', 'success')
        break

      case '/leave-voice':
        if (isInVoiceCall) {
          setIsInVoiceCall(false)
          setVoiceCallMembers([])
          addToHistory('system', 'Left voice call', 'info')
        } else {
          addToHistory('system', 'You are not in a voice call', 'error')
        }
        break

      case '/status':
        addToHistory('system', `${type.charAt(0).toUpperCase() + type.slice(1)}: ${title}\nMembers: ${members.length}\nStatus: Active\nCreated: 2 hours ago`, 'system')
        break

      case '/tasks':
        addToHistory('system', 'Current tasks:\n□ Set up project repository\n□ Define API endpoints\n✓ Create mockups\n□ Review code structure', 'system')
        break

      case '/share':
        addToHistory('system', 'Share functionality - drag and drop files here or paste links', 'system')
        break

      case '/clear':
        setHistory([{
          command: 'system',
          output: `Terminal cleared. Welcome back to ${title}!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'system'
        }])
        break

      case '/exit':
        if (onExit) {
          onExit()
        }
        break

      default:
        if (cleanCmd.startsWith('/')) {
          addToHistory('system', `Unknown command: ${cleanCmd}. Type /help for available commands.`, 'error')
        } else if (cleanCmd) {
          // Regular message
          addToHistory(user?.fullName || 'You', cleanCmd, 'info')
          // Simulate response (in real app, this would be sent to other users)
          setTimeout(() => {
            const responses = [
              'Great idea!',
              'I agree with that approach',
              'Let me check on that',
              'Sounds good to me',
              'I can help with that'
            ]
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]
            addToHistory('Sarah Chen', randomResponse, 'info')
          }, 1000 + Math.random() * 2000)
        }
        break
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (command.trim()) {
      handleCommand(command)
      setCommand('')
    }
  }

  const getStatusColor = (status) => {
    return {
      online: theme === 'windows1992' ? '#008000' : '#10b981',
      away: theme === 'windows1992' ? '#808000' : '#f59e0b',
      offline: theme === 'windows1992' ? '#808080' : '#6b7280'
    }[status] || '#6b7280'
  }

  const getTypeStyles = (type) => {
    const styles = {
      system: theme === 'windows1992' ? 'text-blue-800' : 'text-blue-400',
      success: theme === 'windows1992' ? 'text-green-800' : 'text-green-400',
      error: theme === 'windows1992' ? 'text-red-800' : 'text-red-400',
      info: 'text-foreground'
    }
    return styles[type] || styles.info
  }

  return (
    <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'h-full'} flex flex-col ${theme === 'windows1992' ? 'bg-background-solid' : 'bg-background'} transition-all duration-500`}>
      {/* Enhanced Window Header */}
      <div className={`${theme === 'windows1992' ? 'window-header' : 'glass-strong'} flex items-center justify-between px-4 py-2 border-b border-border ${theme === 'windows1992' ? 'bg-blue-800 text-white' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${theme === 'windows1992' ? 'bg-red-600 border border-black' : 'rounded-full bg-red-500'} ${theme === 'windows1992' ? '' : 'hover:bg-red-400'} cursor-pointer transition-colors`} 
               onClick={onExit}
               title="Close"></div>
          <div className={`w-3 h-3 ${theme === 'windows1992' ? 'bg-yellow-600 border border-black' : 'rounded-full bg-yellow-500'} ${theme === 'windows1992' ? '' : 'hover:bg-yellow-400'} cursor-pointer transition-colors`}
               title="Minimize"></div>
          <div className={`w-3 h-3 ${theme === 'windows1992' ? 'bg-green-600 border border-black' : 'rounded-full bg-green-500'} ${theme === 'windows1992' ? '' : 'hover:bg-green-400'} cursor-pointer transition-colors`}
               onClick={onToggleFullScreen}
               title={isFullScreen ? "Exit Full Screen" : "Full Screen"}></div>
          
          <div className="ml-4">
            <h2 className={`font-semibold ${theme === 'windows1992' ? 'text-white text-xs font-bold' : 'text-foreground'}`}>
              {theme === 'windows1992' ? title.toUpperCase() : title} - {isFullScreen ? 'Full Screen Terminal' : 'Terminal'}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Voice Call Indicator */}
          {isInVoiceCall && (
            <div className={`flex items-center space-x-2 px-3 py-1 ${theme === 'windows1992' ? 'bg-green-800 text-white border-2 border-outset button-win95' : 'bg-green-500/20 text-green-400 rounded-lg'}`}>
              <div className={`w-2 h-2 ${theme === 'windows1992' ? 'bg-white border border-black' : 'bg-green-400 rounded-full'} animate-pulse`}></div>
              <span className={`text-xs ${theme === 'windows1992' ? 'text-white' : 'text-green-400'}`}>
                Voice Call ({voiceCallMembers.length})
              </span>
            </div>
          )}

          {/* Member Panel Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMemberPanel(!showMemberPanel)}
            className={`${theme === 'windows1992' ? 'button-win95 text-xs px-2 py-1' : ''}`}
          >
            <span className={`${theme === 'windows1992' ? 'text-xs' : ''}`}>
              {theme === 'windows1992' ? (showMemberPanel ? '<<' : '>>') : (showMemberPanel ? '👥 Hide' : '👥 Show')}
            </span>
          </Button>

          {!isFullScreen && onToggleFullScreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFullScreen}
              className={`${theme === 'windows1992' ? 'button-win95 text-xs px-2 py-1' : ''}`}
            >
              <span className={`${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'FULL' : '🔍 Full Screen'}
              </span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Terminal Area */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className={`flex-1 overflow-y-auto p-4 ${theme === 'windows1992' ? 'window-content bg-background-solid' : 'glass'} text-sm space-y-2`}
            style={{ 
              backgroundColor: theme === 'windows1992' ? '#c0c0c0' : undefined,
              fontFamily: theme === 'windows1992' ? 'MS Sans Serif, monospace' : 'monospace',
              fontSize: theme === 'windows1992' ? '11px' : undefined
            }}
          >
            {history.map((entry, index) => (
              <div key={index} className="group">
                {entry.command !== 'system' && (
                  <div className="flex items-start space-x-2 mb-1">
                    <span className={`text-xs ${theme === 'windows1992' ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                      [{entry.timestamp}]
                    </span>
                    <span className={`font-semibold ${getTypeStyles(entry.type)}`}>
                      {entry.command}:
                    </span>
                  </div>
                )}
                {entry.output && (
                  <div className={`${entry.command === 'system' ? 'mb-2' : 'ml-16'} whitespace-pre-wrap ${getTypeStyles(entry.type)}`}>
                    {entry.command === 'system' && (
                      <span className={`text-xs ${theme === 'windows1992' ? 'text-muted-foreground' : 'text-muted-foreground'} mr-2`}>
                        [{entry.timestamp}]
                      </span>
                    )}
                    {entry.output}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span className={`${theme === 'windows1992' ? 'retro-cursor' : ''}`}>
                {'> '}
              </span>
              <span className={`animate-pulse ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? 'Ready for input_' : 'Ready for input...'}
              </span>
            </div>
          </div>

          {/* Terminal Input */}
          <div className={`p-4 border-t border-border ${theme === 'windows1992' ? 'bg-background-solid window-content' : 'glass'}`}>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <span className={`${theme === 'windows1992' ? 'text-primary' : 'text-primary'} font-bold ${theme === 'windows1992' ? 'text-xs' : ''}`}>
                {theme === 'windows1992' ? '>' : '$'}
              </span>
              <Input
                ref={inputRef}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={theme === 'windows1992' ? 'Enter command...' : 'Type a command or message...'}
                className={`flex-1 bg-transparent border-none focus:ring-0 focus:border-none ${theme === 'windows1992' ? 'input-win95 text-xs' : ''}`}
                style={{ 
                  fontFamily: theme === 'windows1992' ? 'MS Sans Serif, monospace' : 'monospace',
                  fontSize: theme === 'windows1992' ? '11px' : undefined
                }}
              />
              <Button 
                type="submit" 
                size="sm"
                className={`${theme === 'windows1992' ? 'button-win95 text-xs px-2 py-1' : ''}`}
              >
                {theme === 'windows1992' ? 'SEND' : 'Send'}
              </Button>
            </form>
            
            {/* Quick Commands */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['/help', '/voice', '/members', '/status'].map((cmd) => (
                <Button
                  key={cmd}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCommand(cmd)}
                  className={`text-xs ${theme === 'windows1992' ? 'button-win95 text-xs px-2 py-1' : 'px-3 py-1'}`}
                >
                  {cmd}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Member Panel */}
        {showMemberPanel && (
          <div className={`w-80 border-l border-border ${theme === 'windows1992' ? 'bg-background-solid window-content' : 'glass'} flex flex-col animate-in slide-left`}>
            {/* Members Header */}
            <div className={`p-4 border-b border-border ${theme === 'windows1992' ? 'bg-muted window-content' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${theme === 'windows1992' ? 'text-xs font-bold' : 'text-sm'}`}>
                  Members ({members.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMemberPanel(false)}
                  className={`${theme === 'windows1992' ? 'button-win95 text-xs p-1' : 'p-1'}`}
                >
                  {theme === 'windows1992' ? 'X' : '✕'}
                </Button>
              </div>
            </div>

            {/* Voice Call Section */}
            {isInVoiceCall && (
              <div className={`p-4 border-b border-border ${theme === 'windows1992' ? 'bg-green-100 window-content' : 'bg-green-500/10'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${theme === 'windows1992' ? 'text-xs text-green-800 font-bold' : 'text-sm text-green-400'}`}>
                    Voice Call Active
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCommand('/leave-voice')}
                    className={`${theme === 'windows1992' ? 'button-win95 text-xs bg-red-200' : 'text-xs bg-red-500/20 text-red-400'}`}
                  >
                    {theme === 'windows1992' ? 'LEAVE' : 'Leave'}
                  </Button>
                </div>
                <div className="space-y-2">
                  {voiceCallMembers.map((memberName, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 ${theme === 'windows1992' ? 'bg-green-600 border border-black' : 'bg-green-400 rounded-full'} animate-pulse`}></div>
                      <span className={`text-xs ${theme === 'windows1992' ? 'text-green-800' : 'text-green-400'}`}>
                        {memberName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {members.map((member) => (
                <div 
                  key={member.id} 
                  className={`flex items-center space-x-3 p-3 ${theme === 'windows1992' ? 'border-2 border-outset bg-white hover:bg-gray-100 window-content' : 'rounded-lg glass hover:shadow-glass-lg'} transition-all duration-300 hover-lift`}
                >
                  <div className="relative">
                    <Avatar 
                      className={`w-10 h-10 ${theme === 'windows1992' ? 'rounded-none bg-primary text-primary-foreground border-2 border-outset w-8 h-8 text-xs' : 'bg-gradient-to-br from-blue-500 to-purple-500'} text-white font-medium`}
                    >
                      {member.avatar}
                    </Avatar>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-3 h-3 ${theme === 'windows1992' ? 'rounded-none border-2 border-outset' : 'rounded-full border-2 border-background'}`}
                      style={{ backgroundColor: getStatusColor(member.status) }}
                    ></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium truncate ${theme === 'windows1992' ? 'text-xs font-bold' : 'text-sm'}`}>
                        {member.name}
                      </p>
                      {member.role === 'host' && (
                        <Badge 
                          variant="secondary" 
                          className={`${theme === 'windows1992' ? 'text-xs bg-yellow-200 text-black border-2 border-outset' : 'text-xs'}`}
                        >
                          {theme === 'windows1992' ? 'HOST' : '👑 Host'}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs capitalize ${theme === 'windows1992' ? 'text-gray-600' : 'text-muted-foreground'}`}>
                      {member.status}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${theme === 'windows1992' ? 'button-win95 text-xs' : 'text-xs'}`}
                      title="Direct message"
                    >
                      {theme === 'windows1992' ? 'DM' : '💬'}
                    </Button>
                    {member.id !== '1' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-1 ${theme === 'windows1992' ? 'button-win95 text-xs' : 'text-xs'}`}
                        title="Invite to voice"
                      >
                        {theme === 'windows1992' ? 'CALL' : '📞'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Member Panel Footer */}
            <div className={`p-4 border-t border-border ${theme === 'windows1992' ? 'bg-muted window-content' : ''}`}>
              <Button
                variant="outline"
                size="sm"
                className={`w-full ${theme === 'windows1992' ? 'button-win95 text-xs' : ''}`}
                onClick={() => handleCommand('/voice')}
                disabled={isInVoiceCall}
              >
                {isInVoiceCall 
                  ? (theme === 'windows1992' ? 'IN CALL' : '🔊 In Voice Call')
                  : (theme === 'windows1992' ? 'START CALL' : '🎤 Start Voice Call')
                }
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Keyboard Shortcuts Help */}
      {isFullScreen && (
        <div className={`absolute bottom-4 left-4 ${theme === 'windows1992' ? 'bg-yellow-100 border-2 border-outset p-2 window-content' : 'glass rounded-lg p-3'} ${theme === 'windows1992' ? '' : 'backdrop-blur-xl'}`}>
          <div className={`text-xs ${theme === 'windows1992' ? 'text-black' : 'text-muted-foreground'} space-y-1`}>
            <div>{theme === 'windows1992' ? 'ESC: Exit fullscreen' : '⌨️ Shortcuts:'}</div>
            {theme !== 'windows1992' && (
              <>
                <div>ESC - Exit fullscreen</div>
                <div>Ctrl+L - Clear terminal</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}