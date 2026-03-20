import Editor from '@monaco-editor/react'

interface CodePanelProps {
  code: string
}

export function CodePanel({ code }: CodePanelProps) {
  return (
    <section className="bottom-card">
      <header>
        <h3>LVGL C Output</h3>
      </header>
      <Editor height="260px" defaultLanguage="c" value={code} options={{ readOnly: true, minimap: { enabled: false } }} />
    </section>
  )
}
