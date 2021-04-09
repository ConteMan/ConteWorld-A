import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const prefix = '/talks';
const url = BASE_URL + prefix;

const Talk = {
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
  sync() {
    return request(url + '/sync', METHOD.GET);
  },

  /**
   * 新建
   */
  create(data) {
    return request(url, METHOD.POST, data);
  },

  /**
   * 更新
   */
  update(data) {
    return request(url + `/${data.id}`, METHOD.PUT, data);
  },

  /**
   * 删除
   */
  delete(id) {
    return request(url + `/${id}`, METHOD.DELETE);
  },

  /**
   * 数据统计
   *
   * @param {String} type - 类型
   */
  contribution(type = 'day') {
    return request(url + '/contribution', METHOD.GET);
  }
};

export default Talk;
