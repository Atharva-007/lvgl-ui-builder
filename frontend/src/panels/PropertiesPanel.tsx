import { useMemo } from 'react'
import { useEditorStore } from '../store/editorStore'

export function PropertiesPanel() {
  const selectedId = useEditorStore((state) => state.selectedId)
  const project = useEditorStore((state) => state.project)
  const updateComponent = useEditorStore((state) => state.updateComponent)
  const removeComponent = useEditorStore((state) => state.removeComponent)

  const selected = useMemo(
    () => project.components.find((component) => component.id === selectedId),
    [project.components, selectedId],
  )

  if (!selected) {
    return (
      <aside className="panel panel-right">
        <h3 className="panel-title">Properties</h3>
        <div className="empty-state">
          <p>Select a component to edit its properties</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="panel panel-right">
      <h3 className="panel-title">Properties</h3>

      {/* Name & Type Section */}
      <div className="properties-section">
        <h4 className="section-title">Identity</h4>
        <label>
          Component Name
          <input
            type="text"
            className="component-name-input"
            value={selected.text ?? `${selected.type}${selected.id.slice(0, 4)}`}
            onChange={(event) => updateComponent(selected.id, { text: event.target.value })}
            placeholder="Component name"
          />
        </label>
        <div className="component-type-badge">{selected.type.toUpperCase()}</div>
      </div>

      {/* Position & Size Section */}
      <div className="properties-section">
        <h4 className="section-title">Position & Size</h4>
        <div className="form-row-2">
          <label>
            X
            <input
              type="number"
              value={selected.x}
              onChange={(event) => updateComponent(selected.id, { x: Number(event.target.value) })}
            />
          </label>
          <label>
            Y
            <input
              type="number"
              value={selected.y}
              onChange={(event) => updateComponent(selected.id, { y: Number(event.target.value) })}
            />
          </label>
        </div>
        <div className="form-row-2">
          <label>
            Width
            <input
              type="number"
              value={selected.width}
              onChange={(event) => updateComponent(selected.id, { width: Number(event.target.value) })}
            />
          </label>
          <label>
            Height
            <input
              type="number"
              value={selected.height}
              onChange={(event) => updateComponent(selected.id, { height: Number(event.target.value) })}
            />
          </label>
        </div>
      </div>

      {/* Button Content */}
      {selected.type === 'button' && (
        <div className="properties-section">
          <h4 className="section-title">Button Content</h4>
          <label>
            Label Text
            <input
              type="text"
              value={selected.text ?? ''}
              onChange={(event) => updateComponent(selected.id, { text: event.target.value })}
              placeholder="Button label"
            />
          </label>
          <label>
            Button Type
            <select
              value={selected.buttonType ?? 'momentary'}
              onChange={(event) =>
                updateComponent(selected.id, { buttonType: event.target.value as any })
              }
              className="property-select"
            >
              <option value="momentary">Momentary (Press)</option>
              <option value="toggle">Toggle (On/Off)</option>
            </select>
          </label>
          <label>
            State
            <select
              value={selected.state ?? 'enabled'}
              onChange={(event) => updateComponent(selected.id, { state: event.target.value as any })}
              className="property-select"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
        </div>
      )}

      {/* Label Content */}
      {selected.type === 'label' && (
        <div className="properties-section">
          <h4 className="section-title">Label Content</h4>
          <label>
            Text Content
            <input
              type="text"
              value={selected.text ?? ''}
              onChange={(event) => updateComponent(selected.id, { text: event.target.value })}
              placeholder="Label text"
            />
          </label>
          <label>
            Alignment
            <select
              value={selected.textAlign ?? 'left'}
              onChange={(event) =>
                updateComponent(selected.id, { textAlign: event.target.value as any })
              }
              className="property-select"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
      )}

      {/* Image Content */}
      {selected.type === 'image' && (
        <div className="properties-section">
          <h4 className="section-title">Image Properties</h4>
          <label>
            Image Source (URL)
            <input
              type="text"
              value={selected.src ?? ''}
              onChange={(event) => updateComponent(selected.id, { src: event.target.value })}
              placeholder="https://example.com/image.png"
            />
          </label>
          <label>
            Fit Mode
            <select
              value={selected.fitMode ?? 'cover'}
              onChange={(event) => updateComponent(selected.id, { fitMode: event.target.value as any })}
              className="property-select"
            >
              <option value="cover">Cover (Crop)</option>
              <option value="contain">Contain (Fit)</option>
              <option value="fill">Fill (Stretch)</option>
            </select>
          </label>
          <div className="form-row-2">
            <label>
              Opacity (%)
              <input
                type="range"
                min="0"
                max="100"
                value={(selected.opacity ?? 1) * 100}
                onChange={(event) => updateComponent(selected.id, { opacity: Number(event.target.value) / 100 })}
                className="slider-range"
              />
              <div className="value-display">{Math.round((selected.opacity ?? 1) * 100)}%</div>
            </label>
            <label>
              Rotation (°)
              <input
                type="number"
                value={selected.rotation ?? 0}
                onChange={(event) => updateComponent(selected.id, { rotation: Number(event.target.value) })}
                placeholder="0"
              />
            </label>
          </div>
        </div>
      )}

      {/* Slider Content */}
      {selected.type === 'slider' && (
        <div className="properties-section">
          <h4 className="section-title">Slider Configuration</h4>
          <label>
            Orientation
            <select
              value={selected.orientation ?? 'horizontal'}
              onChange={(event) =>
                updateComponent(selected.id, { orientation: event.target.value as any })
              }
              className="property-select"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </label>
          <div className="form-row-2">
            <label>
              Min Value
              <input
                type="number"
                value={selected.min ?? 0}
                onChange={(event) => updateComponent(selected.id, { min: Number(event.target.value) })}
              />
            </label>
            <label>
              Max Value
              <input
                type="number"
                value={selected.max ?? 100}
                onChange={(event) => updateComponent(selected.id, { max: Number(event.target.value) })}
              />
            </label>
          </div>
          <label>
            Step Size
            <input
              type="number"
              value={selected.step ?? 1}
              onChange={(event) => updateComponent(selected.id, { step: Number(event.target.value) })}
              min="1"
            />
          </label>
          <label>
            Current Value
            <input
              type="range"
              min={selected.min ?? 0}
              max={selected.max ?? 100}
              step={selected.step ?? 1}
              value={selected.value ?? 50}
              onChange={(event) => updateComponent(selected.id, { value: Number(event.target.value) })}
              className="slider-range"
            />
            <div className="value-display">{selected.value ?? 50}</div>
          </label>
        </div>
      )}

      {/* Typography Section (Button, Label) */}
      {(selected.type === 'button' || selected.type === 'label') && (
        <div className="properties-section">
          <h4 className="section-title">Typography</h4>
          <div className="form-row-2">
            <label>
              Font Size (px)
              <input
                type="number"
                value={selected.fontSize ?? 14}
                onChange={(event) => updateComponent(selected.id, { fontSize: Number(event.target.value) })}
                min="8"
                max="48"
              />
            </label>
            <label>
              Font Weight
              <select
                value={selected.fontWeight ?? 'normal'}
                onChange={(event) =>
                  updateComponent(selected.id, { fontWeight: event.target.value as any })
                }
                className="property-select"
              >
                <option value="lighter">Lighter</option>
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Colors & Styling Section */}
      {(selected.type === 'button' || selected.type === 'label' || selected.type === 'slider' || selected.type === 'image') && (
        <div className="properties-section">
          <h4 className="section-title">Colors & Styling</h4>

          {(selected.type === 'button' || selected.type === 'label' || selected.type === 'slider') && (
            <label>
              Background Color
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={selected.color ?? '#3b82f6'}
                  onChange={(event) => updateComponent(selected.id, { color: event.target.value })}
                />
                <input
                  type="text"
                  value={selected.color ?? '#3b82f6'}
                  onChange={(event) => updateComponent(selected.id, { color: event.target.value })}
                  placeholder="#000000"
                />
              </div>
            </label>
          )}

          {(selected.type === 'button' || selected.type === 'label') && (
            <label>
              Text Color
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={selected.textColor ?? '#ffffff'}
                  onChange={(event) => updateComponent(selected.id, { textColor: event.target.value })}
                />
                <input
                  type="text"
                  value={selected.textColor ?? '#ffffff'}
                  onChange={(event) => updateComponent(selected.id, { textColor: event.target.value })}
                  placeholder="#FFFFFF"
                />
              </div>
            </label>
          )}

          {selected.type === 'slider' && (
            <>
              <label>
                Slider Fill Color
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={selected.sliderFillColor ?? '#10b981'}
                    onChange={(event) => updateComponent(selected.id, { sliderFillColor: event.target.value })}
                  />
                  <input
                    type="text"
                    value={selected.sliderFillColor ?? '#10b981'}
                    onChange={(event) => updateComponent(selected.id, { sliderFillColor: event.target.value })}
                    placeholder="#10b981"
                  />
                </div>
              </label>
              <label>
                Track Color
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={selected.sliderTrackColor ?? '#d1d5db'}
                    onChange={(event) => updateComponent(selected.id, { sliderTrackColor: event.target.value })}
                  />
                  <input
                    type="text"
                    value={selected.sliderTrackColor ?? '#d1d5db'}
                    onChange={(event) => updateComponent(selected.id, { sliderTrackColor: event.target.value })}
                    placeholder="#d1d5db"
                  />
                </div>
              </label>
            </>
          )}

          {(selected.type === 'button' || selected.type === 'label') && (
            <div className="form-row-2">
              <label>
                Border Width (px)
                <input
                  type="number"
                  value={selected.borderWidth ?? 0}
                  onChange={(event) => updateComponent(selected.id, { borderWidth: Number(event.target.value) })}
                  min="0"
                  max="10"
                />
              </label>
              <label>
                Border Radius (px)
                <input
                  type="number"
                  value={selected.borderRadius ?? 4}
                  onChange={(event) => updateComponent(selected.id, { borderRadius: Number(event.target.value) })}
                  min="0"
                  max="50"
                />
              </label>
            </div>
          )}

          {(selected.type === 'button' || selected.type === 'label') && (
            <label>
              Border Color
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={selected.borderColor ?? '#3a4f7f'}
                  onChange={(event) => updateComponent(selected.id, { borderColor: event.target.value })}
                />
                <input
                  type="text"
                  value={selected.borderColor ?? '#3a4f7f'}
                  onChange={(event) => updateComponent(selected.id, { borderColor: event.target.value })}
                  placeholder="#000000"
                />
              </div>
            </label>
          )}
        </div>
      )}

      {/* Actions Section */}
      <div className="properties-section">
        <h4 className="section-title">Actions</h4>
        <button type="button" className="delete-btn" onClick={() => removeComponent(selected.id)}>
          🗑️ Delete Component
        </button>
      </div>
    </aside>
  )
}
