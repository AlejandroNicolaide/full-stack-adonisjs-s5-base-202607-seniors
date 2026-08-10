import type { HttpContext } from '@adonisjs/core/http'

export default class HealthController {
  /**
   * @index
   * @summary Estado del servicio
   * @description Endpoint de liveness. Creado en la Sesión 2 mediante el flujo OpenSpec. No requiere autenticación. Responde `{ status: "ok" }`.
   * @responseBody 200 - Servicio operativo
   */
  async index({ response }: HttpContext) {
    return response.ok({ status: 'ok' })
  }
}
