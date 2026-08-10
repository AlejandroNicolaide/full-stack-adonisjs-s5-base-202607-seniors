// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

// https://astro.build/config
//
// GitHub Pages (project page, deploy vía .github/workflows/deploy-docs.yml):
// https://AlejandroNicolaide.github.io/full-stack-adonisjs-s5-base-202607-seniors/
export default defineConfig({
	site: 'https://AlejandroNicolaide.github.io',
	base: '/full-stack-adonisjs-s5-base-202607-seniors/',
	integrations: [
		starlight({
			title: 'FlowSync Docs',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/AlejandroNicolaide/full-stack-adonisjs-s5-base-202607-seniors',
				},
			],
			plugins: [
				// Genera la sección "FlowSync API" desde openapi.yaml, un snapshot
				// del contrato real del backend (ver scripts/generate-openapi.mjs).
				starlightOpenAPI([
					{
						base: 'api',
						schema: './openapi.yaml',
						sidebar: { label: 'FlowSync API' },
					},
				]),
			],
			sidebar: [
				{
					label: 'Decisiones (ADRs)',
					items: [
						// Cada grupo se autogenera desde src/content/docs/adr/<origen>/,
						// poblado por scripts/sync-adrs.mjs a partir de los ADRs reales
						// del repo (docs/adr, backend/docs/adr, frontend/docs/adr).
						// Agregar o borrar un ADR en esas carpetas alcanza: no hay que
						// tocar este archivo para que el menú se actualice.
						{ label: 'Global', items: [{ autogenerate: { directory: 'adr/global' } }] },
						{ label: 'Backend', items: [{ autogenerate: { directory: 'adr/backend' } }] },
						{ label: 'Frontend', items: [{ autogenerate: { directory: 'adr/frontend' } }] },
					],
				},
				// Grupo de sidebar generado automáticamente por starlight-openapi
				// a partir de openapi.yaml.
				...openAPISidebarGroups,
			],
		}),
	],
});
