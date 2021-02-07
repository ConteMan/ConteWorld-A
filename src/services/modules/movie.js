import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const Movie = {
  index(params) {
    const { offset, limit, type } = params
    return request(BASE_URL + '/movies', METHOD.GET, {
      offset,
      limit,
      type,
    })
  },

  /**
   * 类型
   */
  types() {
    return request(BASE_URL + '/movies/types', METHOD.GET)
  }
}

export default Movie
