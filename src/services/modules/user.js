import { BASE_URL } from '@/services/api'
import { request, METHOD, removeAuthorization } from '@/utils/request'
import store from '@/store'

const User = {
  /**
   * 登录服务
   * @param name 账户名
   * @param password 账户密码
   * @returns {Promise<AxiosResponse<T>>}
   */
  login(name, password) {
    return request(BASE_URL + '/login', METHOD.POST, {
      name: name,
      password: password
    })
  },

  getRoutesConfig() {
    const user = store.getters['account/user']
    const id = user.id
    return request(BASE_URL + '/users/' + id + '/routes', METHOD.GET)
  },

  /**
   * 退出登录
   */
  logout() {
    localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
    localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
    localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
    removeAuthorization()
  },

  /**
   * 修改密码
   */
  changePassword(password) {
    const user = store.getters['account/user']
    const id = user.id
    return request(BASE_URL + '/users/' + id + '/password', METHOD.POST, {
      password: password
    })
  }
}

export default User

