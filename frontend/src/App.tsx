import { useMemo, useRef, useState } from 'react'
import { generateLvglCode } from '../../engine/generator/lvgl'
import { ComponentLibrary } from './panels/ComponentLibrary'
import { CodePanel } from './panels/CodePanel'
import { LivePreviewPanel } from './panels/LivePreviewPanel'
import { PropertiesPanel } from './panels/PropertiesPanel'
import { LayoutCustomizer } from './components/LayoutCustomizer'
import { useEditorStore } from './store/editorStore'
import { downloadText, readFileText } from './utils/fileIO'

interface LayoutSettings {
  componentPanelWidth: number
  propertiesPanelWidth: number
  codePreviewHeight: number
  previewSize: 'small' | 'medium' | 'large'
}

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    componentPanelWidth: 180,
    propertiesPanelWidth: 420,
    codePreviewHeight: 280,
    previewSize: 'medium',
  })

  const project = useEditorStore((state) => state.project)
  const addComponent = useEditorStore((state) => state.addComponent)
  const undo = useEditorStore((state) => state.undo)
  const redo = useEditorStore((state) => state.redo)
  const serializeProject = useEditorStore((state) => state.serializeProject)
  const loadProjectFromJson = useEditorStore((state) => state.loadProjectFromJson)

  const lvglCode = useMemo(() => generateLvglCode(project), [project])

  const previewDimensions = {
    small: { width: 240, height: 180 },
    medium: { width: 320, height: 240 },
    large: { width: 480, height: 360 },
  }

  const currentPreviewDim = previewDimensions[layoutSettings.previewSize]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>LVGL Visual UI Builder</h1>
          <p>Declarative canvas editor with LVGL C code generation.</p>
        </div>
        <div className="toolbar">
          <button type="button" onClick={undo}>
            Undo
          </button>
          <button type="button" onClick={redo}>
            Redo
          </button>
          <button type="button" onClick={() => downloadText('lvgl-project.json', serializeProject())}>
            Save JSON
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Load JSON
          </button>
          <button type="button" className="accent-btn" onClick={() => downloadText('ui_export.c', lvglCode)}>
            Export LVGL C
          </button>
          <LayoutCustomizer onLayoutChange={setLayoutSettings} />
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) {
                return
              }
              const raw = await readFileText(file)
              loadProjectFromJson(raw)
              event.target.value = ''
            }}
          />
        </div>
      </header>

      <main
        className="workspace-grid"
        style={
          {
            '--component-width': `${layoutSettings.componentPanelWidth}px`,
            '--properties-width': `${layoutSettings.propertiesPanelWidth}px`,
          } as React.CSSProperties
        }
      >
        <ComponentLibrary onAddComponent={(type) => addComponent(type)} />
        <section className="editor-pane">
          <LivePreviewPanel width={currentPreviewDim.width} height={currentPreviewDim.height} />
        </section>
        <PropertiesPanel />
      </main>

      <section
        className="code-section"
        style={{ height: `${layoutSettings.codePreviewHeight}px` }}
      >
        <CodePanel code={lvglCode} />
      </section>
    </div>
  )
}

export default App
