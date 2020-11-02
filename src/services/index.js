import { login, logout, getRoutesConfig, changePassword } from './modules/user'
import userService from './modules/user'
import One from '@/services/modules/one'
import Article from "@/services/modules/article"
import System from "@/services/modules/system"
import Config from "@/services/modules/config"
import SysEnum from "@/services/modules/sysEnum"

export {
  login,
  logout,
  getRoutesConfig,
  changePassword,
  userService,

  One,
  Article,
  System,
  Config,
  SysEnum,
}
