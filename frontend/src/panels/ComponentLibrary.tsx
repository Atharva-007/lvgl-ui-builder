import type { ComponentType } from '../types'

interface ComponentLibraryProps {
  onAddComponent: (type: ComponentType) => void
}

const componentItems: Array<{ type: ComponentType; icon: string; label: string }> = [
  { type: 'button', icon: '⎕', label: 'Button' },
  { type: 'label', icon: 'ⓐ', label: 'Label' },
  { type: 'textbox', icon: '✎', label: 'Text Box' },
  { type: 'textarea', icon: '▢', label: 'Text Area' },
  { type: 'image', icon: '🖼', label: 'Image' },
  { type: 'slider', icon: '▬', label: 'Slider' },
  { type: 'progressbar', icon: '▒', label: 'Progress Bar' },
  { type: 'switch', icon: '⊚', label: 'Switch' },
  { type: 'checkbox', icon: '☑', label: 'Checkbox' },
  { type: 'radio', icon: '◉', label: 'Radio' },
  { type: 'spinner', icon: '⟳', label: 'Spinner' },
  { type: 'arc', icon: '◐', label: 'Arc' },
  { type: 'gauge', icon: '◎', label: 'Gauge' },
  { type: 'meter', icon: '°', label: 'Meter' },
  { type: 'chart', icon: '📊', label: 'Chart' },
  { type: 'linemeter', icon: '⎼', label: 'Line Meter' },
  { type: 'led', icon: '●', label: 'LED' },
  { type: 'colorwheel', icon: '◯', label: 'Color Wheel' },
  { type: 'roller', icon: '⟲', label: 'Roller' },
  { type: 'spinbox', icon: '±', label: 'Spinbox' },
  { type: 'tabview', icon: '📑', label: 'Tabs' },
  { type: 'pageview', icon: '📄', label: 'Pages' },
  { type: 'table', icon: '█', label: 'Table' },
  { type: 'msgbox', icon: '💬', label: 'Message Box' },
  { type: 'btnmatrix', icon: '⊞', label: 'Button Matrix' },
  { type: 'calendar', icon: '📅', label: 'Calendar' },
  { type: 'keyboard', icon: '⌨', label: 'Keyboard' },
  { type: 'qrcode', icon: '▮', label: 'QR Code' },
  { type: 'canvas', icon: '🎨', label: 'Canvas' },
  { type: 'winbox', icon: '⊟', label: 'Window' },
]

export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  return (
    <aside className="panel panel-left">
      <h3 className="panel-title">Components</h3>
      <div className="component-icons">
        {componentItems.map((item) => (
          <button
            key={item.type}
            className="component-icon-btn"
            type="button"
            draggable
            title={item.label}
            onDragStart={(event) => event.dataTransfer.setData('component/type', item.type)}
            onClick={() => onAddComponent(item.type)}
          >
            <span className="icon">{item.icon}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
