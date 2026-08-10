#!/usr/bin/env node
// Descarga el contrato OpenAPI real del backend (generado por adonis-autoswagger
// a partir de las rutas + anotaciones @summary/@requestBody/@responseBody de los
// controllers) y lo guarda como snapshot local en openapi.yaml.
//
// starlight-openapi lee ese snapshot para generar la sección "FlowSync API" del
// sitio, así que la documentación de la API siempre refleja el contrato real,
// nunca texto escrito a mano.
//
// No se corre automáticamente en cada `npm run dev`/`build` (a diferencia de
// sync-adrs.mjs) porque necesita el backend real corriendo. Volvé a correrla
// manualmente (`npm run generate:openapi`) cada vez que cambie el contrato:
//
//   cd backend && npm run dev   # en otra terminal
//   cd docs/site && npm run generate:openapi

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(__dirname, '..')

const BACKEND_SWAGGER_URL = process.env.BACKEND_SWAGGER_URL ?? 'http://localhost:3333/swagger'
const OUT_FILE = join(siteRoot, 'openapi.yaml')

console.log(`(generate-openapi) descargando contrato real desde ${BACKEND_SWAGGER_URL} ...`)

let res
try {
  res = await fetch(BACKEND_SWAGGER_URL)
} catch {
  console.error(`(generate-openapi) no se pudo conectar a ${BACKEND_SWAGGER_URL}.`)
  console.error('  Asegurate de tener el backend corriendo antes de generar el snapshot:')
  console.error('    cd backend && npm run dev')
  process.exit(1)
}

if (!res.ok) {
  console.error(`(generate-openapi) el backend respondió ${res.status} ${res.statusText}`)
  process.exit(1)
}

const yaml = await res.text()
writeFileSync(OUT_FILE, yaml, 'utf8')
console.log(`(generate-openapi) guardado en ${OUT_FILE} (${yaml.length} bytes)`)
