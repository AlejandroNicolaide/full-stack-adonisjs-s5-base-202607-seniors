import type { HttpContext } from '@adonisjs/core/http'
import { UserTransformer } from '#transformers/user_transformer'

export default class ProfilesController {
  /**
   * @show
   * @summary Ver perfil
   * @description Devuelve los datos del usuario autenticado. Requiere Bearer token.
   * @responseBody 200 - {"user": "<User>"} - Usuario autenticado
   */
  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({ user: UserTransformer.toJSON(user) })
  }
}
