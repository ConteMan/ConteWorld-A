import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const prefix = '/talks'
const url = BASE_URL + prefix

const Talk = {
  index(params) {
    const { offset, limit, type } = params
    return request(url, METHOD.GET, {
      offset,
      limit,
      type,
    })
  },

  /**
   * 类型
   */
  types() {
    return request(url + '/types', METHOD.GET)
  },

  /**
   * 同步数据
   */
  sync() {
    return request(url + '/sync', METHOD.GET)
  },

  /**
   * 新建
   */
  create(data) {
    return request(url, METHOD.POST, data)
  }
}

export default Talk
