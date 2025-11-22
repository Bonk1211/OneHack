import { useState, useEffect } from 'react'
import { getSettings, updateSetting, DEVELOPER_MODE_PASSWORD } from '../utils/settings'
import TransactionHistory from './TransactionHistory'
import TreasuryStatus from './TreasuryStatus'
import '../styles/Settings.css'

function Settings({ onClose }) {
  const [settings, setSettings] = useState(getSettings())
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    // Apply theme on mount and when theme changes
    const root = document.documentElement
    if (settings.theme === 'light') {
      root.classList.add('light-theme')
    } else {
      root.classList.remove('light-theme')
    }
  }, [settings.theme])

  const handleSettingChange = (key, value) => {
    const newSettings = updateSetting(key, value)
    setSettings(newSettings)
  }

  const handleVolumeChange = (e) => {
    const value = parseInt(e.target.value)
    handleSettingChange('volume', value)
    // Update audio volume immediately
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach(audio => {
      audio.volume = value / 100
    })
  }


  const handleBGMChange = (e) => {
    const value = parseInt(e.target.value)
    handleSettingChange('bgm', value)
    // Dispatch event to update background music volume
    window.dispatchEvent(new CustomEvent('bgmVolumeChanged', { detail: { volume: value } }))
  }

  const handleDeveloperModeToggle = () => {
    // If trying to enable developer mode, always require password prompt
    if (!settings.developerMode) {
      // Show password prompt - require password every time it's enabled
      setShowPasswordPrompt(true)
      setPasswordInput('')
      setPasswordError('')
      return
    }
    
    // If disabling developer mode, reset authentication and disable fast timer mode
    handleSettingChange('fastTimerMode', false)
    handleSettingChange('developerModeAuthenticated', false) // Reset authentication when turning off
    handleSettingChange('developerMode', false)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (passwordInput === DEVELOPER_MODE_PASSWORD) {
      // Password correct - enable developer mode
      updateSetting('developerModeAuthenticated', true)
      updateSetting('developerMode', true)
      setSettings(getSettings())
      setShowPasswordPrompt(false)
      setPasswordInput('')
      setPasswordError('')
    } else {
      // Password incorrect
      setPasswordError('Incorrect password')
      setPasswordInput('')
    }
  }

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false)
    setPasswordInput('')
    setPasswordError('')
  }


  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2 className="settings-title">⚙️ Settings</h2>
          <button className="settings-close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          {/* Volume */}
          <div className="settings-section">
            <label className="settings-label">Volume</label>
            <div className="settings-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={handleVolumeChange}
                className="settings-slider"
              />
              <span className="settings-value">{settings.volume}%</span>
            </div>
          </div>

          {/* BGM */}
          <div className="settings-section">
            <label className="settings-label">Background Music</label>
            <div className="settings-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.bgm}
                onChange={handleBGMChange}
                className="settings-slider"
              />
              <span className="settings-value">{settings.bgm}%</span>
            </div>
          </div>

          {/* Graphics */}
          <div className="settings-section">
            <label className="settings-label">Graphics Quality</label>
            <div className="settings-radio-group">
              <label className="settings-radio">
                <input
                  type="radio"
                  name="graphics"
                  value="low"
                  checked={settings.graphics === 'low'}
                  onChange={(e) => handleSettingChange('graphics', e.target.value)}
                />
                Low
              </label>
              <label className="settings-radio">
                <input
                  type="radio"
                  name="graphics"
                  value="medium"
                  checked={settings.graphics === 'medium'}
                  onChange={(e) => handleSettingChange('graphics', e.target.value)}
                />
                Medium
              </label>
              <label className="settings-radio">
                <input
                  type="radio"
                  name="graphics"
                  value="high"
                  checked={settings.graphics === 'high'}
                  onChange={(e) => handleSettingChange('graphics', e.target.value)}
                />
                High
              </label>
            </div>
          </div>

          {/* Theme */}
          <div className="settings-section">
            <label className="settings-label">Theme</label>
            <div className="settings-radio-group">
              <label className="settings-radio">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                />
                Dark
              </label>
              <label className="settings-radio">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                />
                Light
              </label>
            </div>
          </div>

          {/* Transaction History */}
          <div className="settings-section">
            <button 
              className="settings-action-button"
              onClick={() => setShowTransactionHistory(true)}
            >
              📜 Transaction History
            </button>
          </div>

          {/* Treasury Status Monitor */}
          <div className="settings-section">
            <label className="settings-label">Treasury Monitor</label>
            <TreasuryStatus showDetails={true} />
          </div>

          {/* Developer Mode */}
          <div className="settings-section">
            <div className="settings-toggle-group">
              <label className="settings-label">Developer Mode</label>
              <label className="settings-toggle">
                <input
                  type="checkbox"
                  checked={settings.developerMode}
                  onChange={handleDeveloperModeToggle}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {settings.developerMode && settings.developerModeAuthenticated && (
              <div className="dev-mode-panel">
                {/* Fast Timer Mode Toggle */}
                <div className="dev-option">
                  <label className="dev-option-label">
                    <input
                      type="checkbox"
                      checked={settings.fastTimerMode}
                      onChange={(e) => handleSettingChange('fastTimerMode', e.target.checked)}
                      className="dev-checkbox"
                    />
                    <span>Fast Timer Mode (200x)</span>
                  </label>
                  <div className="dev-hint">
                    25 min → 7.5 sec
                  </div>
                </div>
              </div>
            )}
            
            {settings.developerMode && !settings.developerModeAuthenticated && (
              <div className="dev-mode-panel">
                <div className="dev-info" style={{ color: '#ff6b6b' }}>
                  ⚠️ Developer mode requires password authentication
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History Modal */}
      {showTransactionHistory && (
        <TransactionHistory onClose={() => setShowTransactionHistory(false)} />
      )}

      {/* Developer Mode Password Prompt */}
      {showPasswordPrompt && (
        <div className="password-prompt-overlay" onClick={handlePasswordCancel}>
          <div className="password-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="password-prompt-header">
              <h3 className="password-prompt-title">🔒 Developer Mode</h3>
              <button className="password-prompt-close" onClick={handlePasswordCancel}>✕</button>
            </div>
            <form className="password-prompt-content" onSubmit={handlePasswordSubmit}>
              <label className="password-prompt-label">Enter Password:</label>
              <input
                type="password"
                className="password-prompt-input"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setPasswordError('')
                }}
                placeholder="Password"
                autoFocus
                autoComplete="off"
              />
              {passwordError && (
                <div className="password-prompt-error">{passwordError}</div>
              )}
              <div className="password-prompt-actions">
                <button type="button" className="password-prompt-button cancel" onClick={handlePasswordCancel}>
                  Cancel
                </button>
                <button type="submit" className="password-prompt-button submit">
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings

