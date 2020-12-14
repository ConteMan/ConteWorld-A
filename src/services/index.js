import { login, logout, getRoutesConfig, changePassword } from './modules/user'
import userService from './modules/user'
import One from '@/services/modules/one'
import Article from '@/services/modules/article'
import System from '@/services/modules/system'
import SysConfig from '@/services/modules/sysConfig'
import SysEnum from '@/services/modules/sysEnum'
import Token from '@/services/modules/token'

export {
  login,
  logout,
  getRoutesConfig,
  changePassword,
  userService,

  One,
  Article,
  System,
  SysConfig,
  SysEnum,
  Token,
}
