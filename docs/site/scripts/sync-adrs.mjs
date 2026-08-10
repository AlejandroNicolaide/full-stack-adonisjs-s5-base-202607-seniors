#!/usr/bin/env node
// Copia los ADRs reales del monorepo (docs/adr, backend/docs/adr, frontend/docs/adr)
// hacia src/content/docs/adr/<origen>/ para que Starlight los liste con
// `autogenerate`. Se re-ejecuta sola en cada `npm run dev` / `npm run build`
// (ver "predev"/"prebuild" en package.json), así que nunca hay que tocarla
// a mano al agregar, editar o borrar un ADR.
//
// También extrae el primer "# Título" de cada ADR y lo mueve al frontmatter
// (`title`), removiéndolo del cuerpo, para que Starlight no muestre el
// título duplicado (una vez como H1 del documento, otra vez como heading de
// la página).

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(__dirname, '..')
const repoRoot = join(siteRoot, '..', '..')

const SOURCES = [
  { dir: join(repoRoot, 'docs', 'adr'), slug: 'global' },
  { dir: join(repoRoot, 'backend', 'docs', 'adr'), slug: 'backend' },
  { dir: join(repoRoot, 'frontend', 'docs', 'adr'), slug: 'frontend' },
]

// Archivos de soporte de Log4brains que no son ADRs en sí.
const SKIP_FILES = new Set(['template.md', 'README.md', 'index.md'])

const destRoot = join(siteRoot, 'src', 'content', 'docs', 'adr')

function extractTitleAndBody(raw) {
  const lines = raw.split('\n')
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++

  const heading = lines[i]?.match(/^#\s+(.+?)\s*$/)
  if (!heading) return { title: null, body: raw }

  const title = heading[1]
  const rest = lines.slice(i + 1)
  while (rest.length && rest[0].trim() === '') rest.shift()
  return { title, body: rest.join('\n') }
}

function toYamlString(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

let total = 0

for (const source of SOURCES) {
  const destDir = join(destRoot, source.slug)

  // Se limpia el destino antes de copiar: si un ADR se borró en el origen,
  // desaparece también del sitio sin intervención manual.
  if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true })

  if (!existsSync(source.dir)) {
    console.warn(`(sync-adrs) aviso: no existe ${source.dir}, se omite`)
    continue
  }

  mkdirSync(destDir, { recursive: true })

  const files = readdirSync(source.dir).filter((f) => f.endsWith('.md') && !SKIP_FILES.has(f))

  for (const file of files) {
    const raw = readFileSync(join(source.dir, file), 'utf8')
    const { title, body } = extractTitleAndBody(raw)
    const frontmatterTitle = title ?? file.replace(/\.md$/, '')

    const out = `---\ntitle: ${toYamlString(frontmatterTitle)}\n---\n\n${body}\n`
    writeFileSync(join(destDir, file), out, 'utf8')
    total++
  }
}

console.log(`(sync-adrs) ${total} ADR(s) sincronizado(s) en src/content/docs/adr/`)
