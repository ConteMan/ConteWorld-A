// 自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可
module.exports = {
  theme: { // 主题
    color: '#1890ff', // 主题色
    mode: 'dark', // 主题模式 可选 dark、 light 和 night
    success: '#52c41a', // 成功色
    warning: '#faad14', // 警告色
    error: '#f5222d', // 错误色
  },
  multiPage: false,
  animate: {
    disabled: false,
    name: 'slide',
    direction: 'left'
  },
  fixedHeader: true,
  hideSetting: true,
}
