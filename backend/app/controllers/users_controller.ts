import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { UserTransformer } from '#transformers/user_transformer'

export default class UsersController {
  /**
   * @index
   * @summary Listar usuarios
   * @description Devuelve la lista completa de usuarios, ordenados por fecha de creación descendente. Requiere autenticación.
   * @responseBody 200 - {"users": "<User[]>"} - Lista de usuarios
   */
  async index({ response }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'desc')
    return response.ok({ users: UserTransformer.collection(users) })
  }

  /**
   * @show
   * @summary Ver usuario
   * @description Devuelve un usuario por su id. Requiere autenticación.
   * @paramPath id - El id del usuario - @type(number) @required
   * @responseBody 200 - {"user": "<User>"} - Usuario encontrado
   * @responseBody 404 - Usuario no encontrado
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok({ user: UserTransformer.toJSON(user) })
  }

  /*
  |----------------------------------------------------------------------
  | NOTA PARA EL FORMADOR:
  | El endpoint GET /api/v1/users/active (usuarios vistos en las
  | últimas 24h) se implementa EN VIVO durante la demo de la Sesión 3
  | aplicando el flujo Explore-Plan-Execute. No lo pre-implementes aquí.
  |----------------------------------------------------------------------
  */
}
