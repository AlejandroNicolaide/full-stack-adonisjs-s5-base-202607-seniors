# Usar VineJS para validación en lugar de Zod

- Status: accepted
- Date: 2026-08-09
- Tags: validation, backend, dev-tools

## Context and Problem Statement

El backend de FlowSync (AdonisJS 7) necesita validar el input de las peticiones
HTTP (registro, login, etc.) de forma consistente antes de tocar la base de
datos. ¿Qué librería de validación debería usar el backend?

## Decision Drivers

- Integración nativa con AdonisJS 7: el framework incluye VineJS de fábrica en
  el starter kit.
- Integración directa con Lucid ORM (p. ej. reglas de validación como `unique`
  que consultan la base de datos sin código adicional).
- Minimizar dependencias y código de "pegamento" (adaptadores) que haya que
  mantener.

## Considered Options

- VineJS
- Zod

## Decision Outcome

Chosen option: "VineJS", porque AdonisJS 7 lo incluye nativamente y tiene
integración directa con Lucid, mientras que Zod habría requerido adaptadores
manuales para integrarse con el ciclo de validación de AdonisJS y con Lucid.

### Positive Consequences

- No hay que instalar ni mantener ninguna dependencia ni adaptador adicional:
  VineJS ya viene con el starter kit de AdonisJS 7.
- Los validators (`app/validators/`) pueden usar reglas conscientes de la base
  de datos (como `unique()` en `email`) sin código extra, gracias a la
  integración directa con Lucid.
- Los mensajes y el flujo de errores de validación son consistentes con el
  resto del framework (manejo automático de errores 422/400 en los
  controllers).

### Negative Consequences

- El equipo queda acoplado al ecosistema de AdonisJS: VineJS no se usa fuera de
  este framework, por lo que el conocimiento no es tan transferible como el de
  Zod (más popular en el ecosistema JS/TS en general, incluyendo el frontend).
- No se comparte la misma librería de validación entre backend y frontend
  (el frontend no usa VineJS), por lo que los schemas de validación no se
  pueden reutilizar entre ambos.

## Pros and Cons of the Options

### VineJS

- Good, because viene incluido de fábrica en AdonisJS 7, sin dependencias
  adicionales
- Good, because tiene integración directa con Lucid (reglas como `unique`
  contra la base de datos)
- Good, because su manejo de errores está integrado con el ciclo de vida de
  AdonisJS (validators + excepciones)
- Bad, because es específico del ecosistema AdonisJS, con menos adopción fuera
  de él
- Bad, because no se puede reutilizar en el frontend (React)

### Zod

- Good, because es agnóstico de framework y muy popular en el ecosistema
  TypeScript, incluyendo frontend
- Good, because permite compartir schemas entre backend y frontend
- Bad, because habría requerido adaptadores manuales para integrarse con el
  ciclo de validación de AdonisJS
- Bad, because no tiene integración directa con Lucid (reglas como `unique`
  habría que implementarlas a mano)
