import { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '../store/editorStore'

interface DragState {
  componentId: string
  startX: number
  startY: number
  startPosX: number
  startPosY: number
  resizing?: 'se' | 'sw' | 'ne' | 'nw' | null
}

interface LivePreviewPanelProps {
  width?: number
  height?: number
}

export function LivePreviewPanel({ width, height }: LivePreviewPanelProps) {
  const project = useEditorStore((state) => state.project)
  const selectedId = useEditorStore((state) => state.selectedId)
  const selectComponent = useEditorStore((state) => state.selectComponent)
  const updateComponent = useEditorStore((state) => state.updateComponent)
  const previewRef = useRef<HTMLDivElement>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)

  const previewWidth = width ?? project.screen.width
  const previewHeight = height ?? project.screen.height

  useEffect(() => {
    if (!dragState) return

    const CurrentDragState = dragState

    function handleMouseMove(e: MouseEvent) {
      if (!previewRef.current) return

      const component = project.components.find((c) => c.id === CurrentDragState.componentId)
      if (!component) return

      const rect = previewRef.current.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top
      const deltaX = currentX - CurrentDragState.startX
      const deltaY = currentY - CurrentDragState.startY

      if (CurrentDragState.resizing) {
        let width = component.width
        let height = component.height
        let x = component.x
        let y = component.y

        if (CurrentDragState.resizing === 'se') {
          width = Math.max(20, component.width + deltaX)
          height = Math.max(20, component.height + deltaY)
        } else if (CurrentDragState.resizing === 'sw') {
          width = Math.max(20, component.width - deltaX)
          height = Math.max(20, component.height + deltaY)
          x = component.x + deltaX
        } else if (CurrentDragState.resizing === 'ne') {
          width = Math.max(20, component.width + deltaX)
          height = Math.max(20, component.height - deltaY)
          y = component.y + deltaY
        } else if (CurrentDragState.resizing === 'nw') {
          width = Math.max(20, component.width - deltaX)
          height = Math.max(20, component.height - deltaY)
          x = component.x + deltaX
          y = component.y + deltaY
        }

        updateComponent(CurrentDragState.componentId, { x, y, width, height })
      } else {
        updateComponent(CurrentDragState.componentId, {
          x: Math.max(0, CurrentDragState.startPosX + deltaX),
          y: Math.max(0, CurrentDragState.startPosY + deltaY),
        })
      }
    }

    function handleMouseUp() {
      setDragState(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, project.components, updateComponent])

  return (
    <section className="bottom-card">
      <header>
        <h3>Live Preview (Editable)</h3>
        <small>
          {previewWidth}x{previewHeight}
        </small>
      </header>
      <div
        ref={previewRef}
        className="preview-box"
        style={{
          width: previewWidth,
          height: previewHeight,
        }}
        onClick={(e) => {
          if (e.target === previewRef.current) {
            selectComponent(null)
          }
        }}
      >
        {project.components.map((component) => {
          const isSelected = component.id === selectedId
          
          // Calculate style for each component type
          const getComponentStyle = () => {
            const baseStyle: React.CSSProperties = {
              left: component.x,
              top: component.y,
              width: component.width,
              height: component.height,
              cursor: isSelected ? 'move' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: component.borderRadius ?? 4,
              opacity: component.opacity ?? 1,
            }

            if (component.type === 'button') {
              return {
                ...baseStyle,
                background: component.color ?? '#3b82f6',
                color: component.textColor ?? '#ffffff',
                fontSize: `${component.fontSize ?? 14}px`,
                fontWeight: component.fontWeight ?? 'bold',
                border: `${component.borderWidth ?? 0}px solid ${component.borderColor ?? '#3a4f7f'}`,
              }
            }

            if (component.type === 'label') {
              return {
                ...baseStyle,
                background: component.color ?? 'transparent',
                color: component.textColor ?? '#0f172a',
                fontSize: `${component.fontSize ?? 14}px`,
                fontWeight: component.fontWeight ?? 'normal',
                textAlign: component.textAlign ?? 'left',
                border: `${component.borderWidth ?? 0}px solid ${component.borderColor ?? 'transparent'}`,
                justifyContent: component.textAlign === 'center' ? 'center' : component.textAlign === 'right' ? 'flex-end' : 'flex-start',
                paddingLeft: component.textAlign === 'left' ? 8 : 0,
              }
            }

            if (component.type === 'image') {
              return {
                ...baseStyle,
                background: `url(${component.src}) center / ${component.fitMode ?? 'cover'} no-repeat`,
                transform: `rotate(${component.rotation ?? 0}deg)`,
              }
            }

            if (component.type === 'slider') {
              return {
                ...baseStyle,
                background: component.sliderTrackColor ?? '#d1d5db',
                justifyContent: 'flex-start',
                overflow: 'hidden',
              }
            }

            return baseStyle
          }

          return (
            <div
              key={component.id}
              className={`preview-item preview-${component.type} ${isSelected ? 'preview-selected' : ''}`}
              style={getComponentStyle()}
              onMouseDown={(e) => {
                selectComponent(component.id)
                if (isSelected && e.button === 0) {
                  setDragState({
                    componentId: component.id,
                    startX: e.clientX - (previewRef.current?.getBoundingClientRect().left ?? 0),
                    startY: e.clientY - (previewRef.current?.getBoundingClientRect().top ?? 0),
                    startPosX: component.x,
                    startPosY: component.y,
                    resizing: null,
                  })
                }
              }}
            >
              {component.type === 'button' && <span className="preview-text">{component.text || 'Button'}</span>}
              {component.type === 'label' && <span className="preview-text">{component.text || 'Label'}</span>}
              {component.type === 'image' && <span className="preview-text">Image</span>}
              {component.type === 'slider' && (
                <div
                  className="preview-slider-fill"
                  style={{
                    height: '100%',
                    width: `${((component.value ?? 50) / Math.max(1, component.max ?? 100)) * 100}%`,
                    background: component.sliderFillColor ?? '#10b981',
                    transition: 'width 0.1s',
                  }}
                />
              )}
              {isSelected && (
                <>
                  <div
                    className="preview-resize-handle preview-resize-se"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      setDragState({
                        componentId: component.id,
                        startX: e.clientX,
                        startY: e.clientY,
                        startPosX: component.x,
                        startPosY: component.y,
                        resizing: 'se',
                      })
                    }}
                  />
                  <div
                    className="preview-resize-handle preview-resize-sw"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      setDragState({
                        componentId: component.id,
                        startX: e.clientX,
                        startY: e.clientY,
                        startPosX: component.x,
                        startPosY: component.y,
                        resizing: 'sw',
                      })
                    }}
                  />
                  <div
                    className="preview-resize-handle preview-resize-ne"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      setDragState({
                        componentId: component.id,
                        startX: e.clientX,
                        startY: e.clientY,
                        startPosX: component.x,
                        startPosY: component.y,
                        resizing: 'ne',
                      })
                    }}
                  />
                  <div
                    className="preview-resize-handle preview-resize-nw"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      setDragState({
                        componentId: component.id,
                        startX: e.clientX,
                        startY: e.clientY,
                        startPosX: component.x,
                        startPosY: component.y,
                        resizing: 'nw',
                      })
                    }}
                  />
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
