import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const SysConfig = {
  index(params) {
    return request(BASE_URL + '/sys_configs', METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  create(data) {
    return request(BASE_URL + '/sys_configs', METHOD.POST, data);
  },
  edit(id) {
    return request( BASE_URL + '/sys_configs/' + id + '/edit', METHOD.GET);
  },
  update(id, data) {
    return request(BASE_URL + '/sys_configs/' + id, METHOD.PUT, data);
  },
  destroy(id) {
    return request(BASE_URL + '/sys_configs/' + id, METHOD.DELETE);
  },
  statuses() {
    return request(BASE_URL + '/sys_configs/statuses', METHOD.GET);
  }
}

export default SysConfig
