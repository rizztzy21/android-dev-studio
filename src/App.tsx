import { useState } from 'react'
import Editor from '@monaco-editor/react'
import './App.css'

const initialFiles = {
  'App.tsx': `import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <h1>Android Dev Studio</h1>

      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </main>
  )
}

export default App`,

  'package.json': `{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,

  'README.md': `# My Android Project

Created with Android Dev Studio.

## Commands

npm install
npm run dev
npm run build
`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
  }
}`
}

function App() {
  const [files, setFiles] = useState(initialFiles)
  const [activeFile, setActiveFile] = useState('App.tsx')
  const [saved, setSaved] = useState(true)
  const [terminalOpen, setTerminalOpen] = useState(true)

  const code = files[activeFile as keyof typeof files] ?? ''

  const updateCode = (value: string | undefined) => {
    setFiles((current) => ({
      ...current,
      [activeFile]: value ?? ''
    }))

    setSaved(false)
  }

  const saveFile = () => {
    setSaved(true)
  }

  const fileLanguage = (file: string) => {
    if (file.endsWith('.tsx')) return 'typescript'
    if (file.endsWith('.ts')) return 'typescript'
    if (file.endsWith('.json')) return 'json'
    if (file.endsWith('.md')) return 'markdown'
    return 'plaintext'
  }

  return (
    <div className="studio">

      <header className="topbar">
        <div className="brand">
          <span className="brandIcon">⚡</span>
          Android Dev Studio
        </div>

        <div className="projectName">
          android-dev-studio
        </div>

        <button className="iconButton">
          ⚙
        </button>
      </header>

      <main className="workspace">

        <aside className="sidebar">

          <div className="sidebarTitle">
            EXPLORER
          </div>

          <div className="projectRoot">
            📁 android-dev-studio
          </div>

          <div className="fileTree">

            <div className="folder">
              📁 src
            </div>

            {Object.keys(files).map((file) => (
              <button
                key={file}
                className={`fileItem ${
                  activeFile === file ? 'active' : ''
                }`}
                onClick={() => setActiveFile(file)}
              >
                <span>
                  {file.endsWith('.tsx') ? '⚛️' : '📄'}
                </span>

                {file}
              </button>
            ))}

          </div>

        </aside>

        <section className="editorArea">

          <div className="tabs">

            <div className="tab active">
              📄 {activeFile}

              {!saved && (
                <span className="unsaved">
                  ●
                </span>
              )}

              <span className="close">
                ×
              </span>
            </div>

          </div>

          <div className="editor">

            <Editor
              height="100%"
              language={fileLanguage(activeFile)}
              theme="vs-dark"
              value={code}
              onChange={updateCode}
              options={{
                fontSize: 13,
                minimap: {
                  enabled: false
                },
                automaticLayout: true,
                wordWrap: 'on',
                padding: {
                  top: 12
                },
                smoothScrolling: true,
                tabSize: 2
              }}
            />

          </div>

          <div className="editorActions">

            <button
              className="saveButton"
              onClick={saveFile}
              disabled={saved}
            >
              💾 Save
            </button>

            <button className="runButton">
              ▶ Run
            </button>

            <button className="buildButton">
              🔨 Build
            </button>

          </div>

          {terminalOpen && (

            <div className="terminal">

              <div className="terminalHeader">

                <span>
                  TERMINAL
                </span>

                <button
                  onClick={() => setTerminalOpen(false)}
                >
                  ×
                </button>

              </div>

              <div className="terminalBody">

                <div>
                  <span className="prompt">
                    $
                  </span>

                  npm run build
                </div>

                <div className="success">
                  ✓ TypeScript ready
                </div>

                <div className="success">
                  ✓ Vite ready
                </div>

                <div>
                  <span className="prompt">
                    $
                  </span>

                  <span className="cursor">
                    ▋
                  </span>
                </div>

              </div>

            </div>

          )}

        </section>

      </main>

      <footer className="statusbar">

        <span className="ready">
          ● Ready
        </span>

        <span>
          {fileLanguage(activeFile)}
        </span>

        <span>
          UTF-8
        </span>

        <span>
          Android
        </span>

      </footer>

    </div>
  )
}

export default App
