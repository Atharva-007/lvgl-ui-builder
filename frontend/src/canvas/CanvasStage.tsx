import { useRef, useState } from 'react'
import { Layer, Rect, Stage, Text, Transformer, Circle } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '../store/editorStore'
import type { ComponentType, UIComponent } from '../types'

interface CanvasStageProps {
  onDropComponent: (type: ComponentType, x: number, y: number) => void
}

function renderComponent(component: UIComponent, isSelected: boolean) {
  if (component.type === 'button') {
    return (
      <>
        <Rect
          width={component.width}
          height={component.height}
          cornerRadius={10}
          fill={component.color ?? '#2f80ed'}
          stroke={isSelected ? '#f97316' : '#1d4ed8'}
          strokeWidth={isSelected ? 3 : 1}
        />
        <Text
          text={component.text ?? 'Button'}
          width={component.width}
          height={component.height}
          align="center"
          verticalAlign="middle"
          fill="#ffffff"
          fontStyle="bold"
        />
      </>
    )
  }

  if (component.type === 'label') {
    return (
      <>
        <Rect width={component.width} height={component.height} cornerRadius={6} fill="#ffffff" stroke="#9ca3af" />
        <Text
          text={component.text ?? 'Label'}
          width={component.width}
          height={component.height}
          align="left"
          verticalAlign="middle"
          padding={8}
          fill={component.color ?? '#111827'}
        />
      </>
    )
  }

  if (component.type === 'slider') {
    const thumbX = ((component.value ?? 50) / Math.max(1, component.max ?? 100)) * Math.max(20, component.width - 24)
    return (
      <>
        <Rect y={Math.max(2, component.height / 2 - 3)} width={component.width} height={6} cornerRadius={3} fill="#d1d5db" />
        <Rect
          y={Math.max(2, component.height / 2 - 3)}
          width={thumbX}
          height={6}
          cornerRadius={3}
          fill={component.color ?? '#ef4444'}
        />
        <Circle x={thumbX} y={component.height / 2} radius={10} fill={component.color ?? '#ef4444'} />
      </>
    )
  }

  return (
    <>
      <Rect width={component.width} height={component.height} fill="#e5e7eb" stroke={isSelected ? '#f97316' : '#6b7280'} />
      <Text text="Image" width={component.width} height={component.height} align="center" verticalAlign="middle" fill="#374151" />
    </>
  )
}

export function CanvasStage({ onDropComponent }: CanvasStageProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const trRef = useRef<Konva.Transformer>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const project = useEditorStore((state) => state.project)
  const selectedId = useEditorStore((state) => state.selectedId)
  const selectComponent = useEditorStore((state) => state.selectComponent)
  const updateComponent = useEditorStore((state) => state.updateComponent)

  const selectedNode = stageRef.current?.findOne(`#${selectedId ?? ''}`)
  if (trRef.current && selectedNode) {
    trRef.current.nodes([selectedNode])
  }

  return (
    <div
      className={`canvas-wrap ${isDraggingOver ? 'canvas-dragover' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
        setIsDraggingOver(true)
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDraggingOver(false)
        const type = event.dataTransfer.getData('component/type') as ComponentType
        const stage = stageRef.current
        if (!type || !stage) {
          return
        }

        const stageRect = stage.container().getBoundingClientRect()
        const x = event.clientX - stageRect.left
        const y = event.clientY - stageRect.top
        onDropComponent(type, x, y)
      }}
    >
      <Stage
        width={project.screen.width}
        height={project.screen.height}
        ref={stageRef}
        onMouseDown={(event) => {
          if (event.target === event.target.getStage()) {
            selectComponent(null)
          }
        }}
      >
        <Layer>
          {project.components.map((component) => {
            return (
              <Rect
                key={`${component.id}-hit`}
                x={component.x}
                y={component.y}
                width={component.width}
                height={component.height}
                fill="transparent"
                onClick={() => selectComponent(component.id)}
              />
            )
          })}

          {project.components.map((component) => {
            const isSelected = component.id === selectedId
            return (
              <Layer
                key={component.id}
                id={component.id}
                x={component.x}
                y={component.y}
                draggable
                onClick={() => selectComponent(component.id)}
                onDragEnd={(event) => {
                  updateComponent(component.id, {
                    x: event.target.x(),
                    y: event.target.y(),
                  })
                }}
                onTransformEnd={(event) => {
                  const node = event.target
                  const scaleX = node.scaleX()
                  const scaleY = node.scaleY()
                  node.scaleX(1)
                  node.scaleY(1)
                  updateComponent(component.id, {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(20, node.width() * scaleX),
                    height: Math.max(20, node.height() * scaleY),
                  })
                }}
              >
                {renderComponent(component, isSelected)}
              </Layer>
            )
          })}
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            borderStroke="#f97316"
          />
        </Layer>
      </Stage>
    </div>
  )
}
