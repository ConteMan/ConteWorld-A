import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const Worldline = {
  index(params) {
    const { offset, limit, platformType } = params
    return request(BASE_URL + '/worldlines', METHOD.GET, {
      offset,
      limit,
      platformType,
    })
  },

  /**
   * 平台类型
   */
  platformTypes() {
    return request(BASE_URL + '/worldlines/platform_types', METHOD.GET)
  }
}

export default Worldline
