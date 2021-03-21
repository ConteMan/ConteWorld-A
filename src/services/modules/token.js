import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const Token = {
  index(params) {
    return request(BASE_URL + '/tokens', METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  create(data) {
    return request(BASE_URL + '/tokens', METHOD.POST, data);
  },
  edit(id) {
    return request(BASE_URL + '/tokens/' + id + '/edit', METHOD.GET);
  },
  update(id, data) {
    return request(BASE_URL + '/tokens/' + id, METHOD.PUT, data);
  },
  destroy(id) {
    return request(BASE_URL + '/tokens/' + id, METHOD.DELETE);
  },
  authList() {
    return request(BASE_URL + '/tokens/auth', METHOD.GET);
  },
  statuses() {
    return request(BASE_URL + '/tokens/statuses', METHOD.GET);
  }
};

export default Token;
