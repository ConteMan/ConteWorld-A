import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const prefix = '/projects';
const url = BASE_URL + prefix;

const Project = {
  /**
   * 列表
   */
  index(params) {
    const { offset, limit, isPublic } = params;
    return request(url, METHOD.GET, {
      offset,
      limit,
      is_public: isPublic,
    });
  },

  /**
   * 公开类型
   */
  publicType(force) {
    return request(url + '/public_types', METHOD.GET);
  },

  /**
   * 同步数据
   */
  sync(force) {
    return request(url + '/sync', METHOD.POST, { force });
  }
};

export default Project;
