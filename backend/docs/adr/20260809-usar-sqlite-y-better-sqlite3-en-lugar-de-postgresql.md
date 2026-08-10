# Usar SQLite y better-sqlite3 en lugar de PostgreSQL

- Status: accepted
- Date: 2026-08-09
- Tags: database, persistence, dev-tools

## Context and Problem Statement

FlowSync es la aplicación del máster **AI4Devs**. El backend necesita un motor de
base de datos relacional para desarrollo local, integrado con Lucid ORM. ¿Qué
motor de base de datos debería usar el backend?

## Decision Drivers

- Cero overhead de infraestructura en desarrollo local: no debería requerirse
  levantar y mantener un servidor de base de datos aparte para arrancar el proyecto.
- Soporte nativo por parte de Lucid ORM (el ORM elegido para el backend).
- Onboarding rápido para el contexto del máster: los alumnos deben poder clonar
  el repo y arrancar el backend sin dependencias externas.

## Considered Options

- SQLite + better-sqlite3
- PostgreSQL

## Decision Outcome

Chosen option: "SQLite + better-sqlite3", porque ofrece cero overhead de
infraestructura en desarrollo local (no requiere un servidor de base de datos
separado) y Lucid ORM lo soporta de forma nativa, lo cual simplifica el arranque
del proyecto en el contexto educativo del máster.

### Positive Consequences

- No hay que instalar, configurar ni levantar un servidor de base de datos
  aparte para desarrollar o correr los tests.
- El archivo `db.sqlite3` se resetea al instante con `migration:fresh`,
  agilizando el flujo de trabajo en clase.
- Onboarding más rápido para nuevos desarrolladores/alumnos: `npm install` +
  `npm run migration:run` es suficiente.

### Negative Consequences

- No hay soporte para tipos de columna **array nativos**, a diferencia de
  PostgreSQL, lo que limita el modelado de datos que dependa de ese tipo.
- No apto para **escritura concurrente a escala**: SQLite serializa las
  escrituras a nivel de archivo, por lo que no escala igual que PostgreSQL bajo
  carga concurrente de escritura.
- Migrar a un motor con mayor concurrencia (p. ej. PostgreSQL) de cara a
  producción requerirá revisar las migraciones y cualquier comportamiento
  específico de SQLite.

## Pros and Cons of the Options

### SQLite + better-sqlite3

- Good, because no requiere infraestructura adicional en desarrollo local
- Good, because integración nativa con Lucid ORM
- Good, because arranque y reseteo de la base de datos son instantáneos, útil
  en un contexto educativo
- Bad, because no soporta columnas de tipo array nativas
- Bad, because no escala bien con escritura concurrente

### PostgreSQL

- Good, because soporta tipos de datos avanzados (arrays, JSONB, etc.)
- Good, because maneja mejor la escritura concurrente a escala
- Good, because es el motor típico de producción para este tipo de aplicaciones
- Bad, because requiere levantar y mantener un servidor de base de datos en
  desarrollo local
- Bad, because agrega fricción de onboarding en el contexto del máster
