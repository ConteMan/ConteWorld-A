import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const prefix = '/system_enums';

const SysEnum = {
  index(params) {
    return request(BASE_URL + prefix, METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  create(data) {
    return request(BASE_URL + prefix, METHOD.POST, data);
  },
  edit(id) {
    return request( BASE_URL + prefix + '/' + id + '/edit', METHOD.GET);
  },
  update(id, data) {
    return request(BASE_URL + prefix + '/' + id, METHOD.PUT, data);
  },
  destroy(id) {
    return request(BASE_URL + prefix + '/' + id, METHOD.DELETE);
  },
  statuses() {
    return request(BASE_URL + prefix + '/statuses', METHOD.GET);
  },
  roots() {
    return request( BASE_URL + prefix + '/roots', METHOD.GET);
  },
}

export default SysEnum
