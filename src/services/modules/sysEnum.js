import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const prefix = '/sys_enums';
const url = BASE_URL + prefix;

const SysEnum = {
  index(params) {
    return request(url, METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  create(data) {
    return request(url, METHOD.POST, data);
  },
  edit(id) {
    return request(url + '/' + id + '/edit', METHOD.GET);
  },
  update(id, data) {
    return request(url + '/' + id, METHOD.PUT, data);
  },
  destroy(id) {
    return request(url + '/' + id, METHOD.DELETE);
  },
  statuses() {
    return request(url + '/statuses', METHOD.GET);
  },
  roots() {
    return request(url + '/roots', METHOD.GET);
  },
  valueTypes() {
    return request(url + '/value_types', METHOD.GET);
  },
};

export default SysEnum;
