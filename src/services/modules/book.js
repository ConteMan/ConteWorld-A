import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const prefix = '/books';
const url = BASE_URL + prefix;

const Book = {
  index(params) {
    const { offset, limit, type } = params;
    return request(url, METHOD.GET, {
      offset,
      limit,
      type,
    });
  },

  /**
   * 类型
   */
  types() {
    return request(url + '/types', METHOD.GET);
  },

  /**
   * 同步数据
   */
  sync(force) {
    return request(url + '/sync', METHOD.POST, { force });
  }
};

export default Book;
