/// <reference types="vite/client" />

declare module 'monaco-editor/esm/vs/editor/editor.worker?worker' {
  const workerFactory: {
    new (): Worker
  }
  export default workerFactory
}
