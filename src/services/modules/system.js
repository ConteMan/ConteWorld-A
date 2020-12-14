import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const System = {
  os() {
    return request(BASE_URL + '/system/os', METHOD.GET)
  },
  dependencies() {
    return request(BASE_URL + '/system/dependencies', METHOD.GET)
  },
}

export default System
