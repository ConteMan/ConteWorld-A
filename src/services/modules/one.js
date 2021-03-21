import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const prefix = '/ones';
const url = BASE_URL + prefix;

const One = {
  // 列表
  index(params) {
    return request(url, METHOD.GET, {
      page: params.page,
      per_page: params.per_page,
    });
  },
  // 同步
  sync() {
    return request(url + '/sync', METHOD.POST, {
      type: 'one',
      start: 0,
      end: 0,
      force: false,
    });
  },
  // 随机返回一条信息
  random() {
    return request(url + '/random', METHOD.GET);
  }
};

export default One;
