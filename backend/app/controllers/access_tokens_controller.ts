import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { UserTransformer } from '#transformers/user_transformer'

export default class AccessTokensController {
  /**
   * @store
   * @summary Iniciar sesión
   * @description Verifica las credenciales del usuario y emite un access token (campo `token`, string).
   * @requestBody <loginValidator>
   * @responseBody 200 - {"user": "<User>"} - Token emitido
   * @responseBody 400 - {"errors": []} - Credenciales inválidas
   */
  async store({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    user.lastSeenAt = DateTime.now()
    await user.save()

    const token = await User.accessTokens.create(user)

    return response.ok({
      user: UserTransformer.toJSON(user),
      token: token.value!.release(),
    })
  }

  /**
   * @destroy
   * @summary Cerrar sesión
   * @description Revoca el access token usado en la petición actual. Requiere Bearer token. Responde `{ revoked: true }`.
   * @responseBody 200 - Token revocado
   */
  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = user.currentAccessToken
    await User.accessTokens.delete(user, token.identifier)

    return response.ok({ revoked: true })
  }
}
