import Cookie from 'js-cookie'
import { removeAuthorization } from '@/utils/request.js'
// 401拦截
const resp401 = {
  /**
   * 2XX, 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    // const { message, router } = options
    return response
  },
  /**
   * 非 2XX，即响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message, router } = options
    const { response } = error
    if (response.status === 401) {
      message.error('Unauthorized')
      removeAuthorization()
      router.push({ path: '/login' })
    }
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const { message } = options
    if (response.status === 403) {
      message.error('Forbidden')
    }
    return response
  }
}

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const { message, router } = options
    const { url, xsrfCookieName } = config
    if (url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('Auth Expired')
      router.push({ path: '/login' })
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message } = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

const respCommon = {
  onRejected(error, options) {
    const { message } = options
    if (error.response.status === 422) {
      return Promise.resolve(error.response)
    } else {
      message.error(error.message)
      return Promise.reject(error)
    }
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403, respCommon] // 响应拦截
}
