import { BASE_URL } from '@/services/api'
import { request, METHOD } from '@/utils/request'

const Article = {
  index(params) {
    return request(BASE_URL + '/articles', METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  create(data) {
    return request(BASE_URL + '/articles', METHOD.POST, data);
  },
  edit(id) {
    return request( BASE_URL + '/articles/' + id + '/edit', METHOD.GET);
  },
  update(id, data) {
    return request(BASE_URL + '/articles/' + id, METHOD.PUT, data);
  },
  destroy(id) {
    return request(BASE_URL + '/articles/' + id, METHOD.DELETE);
  },
  statuses() {
    return request(BASE_URL + '/articles/statuses', METHOD.GET);
  }
}

export default Article
