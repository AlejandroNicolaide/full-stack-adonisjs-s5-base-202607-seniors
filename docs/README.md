# docs

Documentación del producto **FlowSync**.

- `PRD.md` — Product Requirements Document (se genera en el Ejercicio 3:
  visión, valor añadido, casos de uso, modelo de datos, diseño de alto nivel,
  diagrama C4). A partir de él se generan las historias de usuario (Ejercicio 4).
- `adr/` — Architecture Decision Records globales (afectan a todo el monorepo),
  gestionados con [Log4brains](https://github.com/thomvaill/log4brains). Las
  decisiones específicas de cada paquete viven junto a su código:
  `backend/docs/adr/` y `frontend/docs/adr/`. La configuración de paquetes
  vive en `.log4brains.yml` (raíz del repo). Para previsualizar todo junto:
  `npx log4brains preview`.
- Diagramas de arquitectura se añaden en sesiones posteriores.
