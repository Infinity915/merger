import { createContext, useContext } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

export const THEME_ORDER = ['light', 'cyber', 'windows1992']

export const THEME_DISPLAY_NAMES = {
  light: '☀️ Light Mode',
  windows1992: '🖥️ Windows 1992',
  cyber: '🔮 Cyber Neon'
}

export const THEME_DESCRIPTIONS = {
  light: 'Clean & bright',
  windows1992: 'Retro nostalgia', 
  cyber: 'Futuristic vibes'
}

export const VALID_THEMES = ['light', 'windows1992', 'cyber']
export const THEME_STORAGE_KEY = 'studcollab-theme'