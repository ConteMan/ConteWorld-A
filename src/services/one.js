import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const One = {
  index(params) {
    return request(BASE_URL + '/ones', METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  sync() {
    return request(BASE_URL + '/ones/sync', METHOD.POST, {
      type: 'one',
      start: 0,
      end: 0,
      force: false,
    });
  }
}

export default One
