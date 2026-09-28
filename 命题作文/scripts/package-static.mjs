import { cp, mkdir, rm } from 'node:fs/promises'
// Existing repository is served as static files. Keep compiled output in preview/.
await rm('preview/assets', { recursive: true, force: true })
await mkdir('preview', { recursive: true })
await cp('dist', 'preview', { recursive: true, force: true })
console.log('Static entry ready: preview/index.html')
