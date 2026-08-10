import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'API Docs',
  version: '1.0.0',
  tagIndex: 3, // /api/v1/users -> tag "users"
  ignore: ['/swagger', '/docs', '/'],
  preferredPutPatch: 'PUT',
  snakeCase: false,
  common: {
    parameters: {},
    headers: {},
  },
}
