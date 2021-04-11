import { BASE_URL } from '@/services/api';
import { request, METHOD } from '@/utils/request';

const prefix = '/statistics';
const url = BASE_URL + prefix;

const One = {
  /**
   * 总览
   */
  total() {
    return request(url + '/total', METHOD.GET);
  },
};

export default One;
