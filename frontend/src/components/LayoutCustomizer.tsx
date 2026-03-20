import { useState } from 'react'

interface LayoutSettings {
  componentPanelWidth: number
  propertiesPanelWidth: number
  codePreviewHeight: number
  previewSize: 'small' | 'medium' | 'large'
}

interface LayoutCustomizerProps {
  onLayoutChange: (settings: LayoutSettings) => void
}

const presets = {
  default: { componentPanelWidth: 180, propertiesPanelWidth: 420, codePreviewHeight: 280, previewSize: 'medium' as const },
  wideComponents: { componentPanelWidth: 260, propertiesPanelWidth: 320, codePreviewHeight: 280, previewSize: 'medium' as const },
  wideProperties: { componentPanelWidth: 140, propertiesPanelWidth: 520, codePreviewHeight: 280, previewSize: 'medium' as const },
  maxPreview: { componentPanelWidth: 120, propertiesPanelWidth: 280, codePreviewHeight: 200, previewSize: 'large' as const },
  compact: { componentPanelWidth: 100, propertiesPanelWidth: 300, codePreviewHeight: 200, previewSize: 'small' as const },
}

export function LayoutCustomizer({ onLayoutChange }: LayoutCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<LayoutSettings>(presets.default)

  const handlePresetChange = (preset: keyof typeof presets) => {
    const newSettings = presets[preset]
    setSettings(newSettings)
    onLayoutChange(newSettings)
  }

  const handleSettingChange = (key: keyof LayoutSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onLayoutChange(newSettings)
  }

  return (
    <div className="layout-customizer">
      <button
        type="button"
        className="layout-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Layout"
      >
        ⚙
      </button>

      {isOpen && (
        <div className="layout-menu">
          <h4>Layout Presets</h4>
          <div className="preset-buttons">
            {Object.keys(presets).map((preset) => (
              <button
                key={preset}
                type="button"
                className={`preset-btn ${settings.previewSize === presets[preset as keyof typeof presets].previewSize ? 'active' : ''}`}
                onClick={() => handlePresetChange(preset as keyof typeof presets)}
              >
                {preset.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>

          <div className="layout-settings">
            <label>
              Component Panel Width
              <input
                type="range"
                min="80"
                max="300"
                value={settings.componentPanelWidth}
                onChange={(e) => handleSettingChange('componentPanelWidth', Number(e.target.value))}
              />
              <span>{settings.componentPanelWidth}px</span>
            </label>

            <label>
              Properties Panel Width
              <input
                type="range"
                min="280"
                max="600"
                value={settings.propertiesPanelWidth}
                onChange={(e) => handleSettingChange('propertiesPanelWidth', Number(e.target.value))}
              />
              <span>{settings.propertiesPanelWidth}px</span>
            </label>

            <label>
              Code Preview Height
              <input
                type="range"
                min="150"
                max="400"
                value={settings.codePreviewHeight}
                onChange={(e) => handleSettingChange('codePreviewHeight', Number(e.target.value))}
              />
              <span>{settings.codePreviewHeight}px</span>
            </label>

            <label>
              Preview Size
              <select value={settings.previewSize} onChange={(e) => handleSettingChange('previewSize', e.target.value)}>
                <option value="small">Small (240x180)</option>
                <option value="medium">Medium (320x240)</option>
                <option value="large">Large (480x360)</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
