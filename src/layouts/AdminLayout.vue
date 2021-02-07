<template>
  <a-layout :class="['admin-layout', 'beauty-scroll']">
    <drawer
      v-if="isMobile"
      :visible="mobileMenuStatus"
      :show-handler="false"
      @change="setMobileMenuStatus(false)"
    >
      <side-menu
        :theme="theme.mode"
        :menu-data="menuData"
        :collapsed="false"
        :collapsible="false"
        @menuSelect="onMenuSelect"
      />
    </drawer>
    <side-menu
      v-else-if="layout === 'side' || layout === 'mix'"
      :class="[fixedSideBar ? 'fixed-side' : '']"
      :theme="theme.mode"
      :menu-data="sideMenuData"
      :collapsed="collapsed"
      :collapsible="true"
    />
    <div
      v-if="fixedSideBar && !isMobile"
      :style="`width: ${sideMenuWidth}; min-width: ${sideMenuWidth};max-width: ${sideMenuWidth};`"
      class="virtual-side"
    />
    <drawer
      v-if="!hideSetting"
      :visible="settingStatus"
      :show-handler="false"
      class="hover-mode"
      placement="right"
      @change="setSettingStatus(false)"
    >
      <setting />
    </drawer>
    <a-layout class="admin-layout-main beauty-scroll">
      <admin-header
        :class="[{'fixed-tabs': fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage}]"
        :style="headerStyle"
        :menu-data="headMenuData"
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"
      />
      <a-layout-header
        v-show="fixedHeader"
        :class="['virtual-header', {'fixed-tabs' : fixedTabs, 'fixed-header': fixedHeader, 'multi-page': multiPage}]"
      />
      <a-layout-content class="admin-layout-content">
        <div :style="`min-height: ${minHeight}px; position: relative`">
          <slot />
        </div>
      </a-layout-content>
      <a-layout-footer style="padding: 0px">
        <page-footer :link-list="footerLinks" :copyright="copyright" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import AdminHeader from './header/AdminHeader'
import PageFooter from './footer/PageFooter'
import Drawer from '../components/tool/Drawer'
import SideMenu from '../components/menu/SideMenu'
import Setting from '../components/setting/Setting'
import { mapState, mapMutations, mapGetters } from 'vuex'

const minHeight = window.innerHeight - 64 - 24 - 122

export default {
  name: 'AdminLayout',
  components: { Setting, SideMenu, Drawer, PageFooter, AdminHeader },
  provide() {
    return {
      adminLayout: this
    }
  },
  data() {
    return {
      minHeight: minHeight,
      collapsed: false,
      showSetting: false,
      drawerOpen: false
    }
  },
  computed: {
    ...mapState('setting',
      [
        'isMobile',
        'theme',
        'layout',
        'footerLinks',
        'copyright',
        'fixedHeader',
        'fixedSideBar',
        'fixedTabs',
        'hideSetting',
        'multiPage',
        'settingStatus',
        'mobileMenuStatus'
      ]),
    ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData']),
    sideMenuWidth() {
      return this.collapsed ? '80px' : '256px'
    },
    headerStyle() {
      const width = (this.fixedHeader && this.layout !== 'head' && !this.isMobile) ? `calc(100% - ${this.sideMenuWidth})` : '100%'
      const position = this.fixedHeader ? 'fixed' : 'static'
      return `width: ${width}; position: ${position};`
    },
    headMenuData() {
      const { layout, menuData, firstMenu } = this
      return layout === 'mix' ? firstMenu : menuData
    },
    sideMenuData() {
      const { layout, menuData, subMenu } = this
      return layout === 'mix' ? subMenu : menuData
    }
  },
  watch: {
    $route(val) {
      this.setActivated(val)
    },
    layout() {
      this.setActivated(this.$route)
    },
    isMobile(val) {
      if (!val) {
        this.setMobileMenuStatus(false)
      }
    }
  },
  created() {
    this.correctPageMinHeight(minHeight - 1)
    this.setActivated(this.$route)
  },
  beforeDestroy() {
    this.correctPageMinHeight(-minHeight + 1)
  },
  methods: {
    ...mapMutations('setting', ['correctPageMinHeight', 'setActivatedFirst', 'setSettingStatus', 'setMobileMenuStatus']),
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    onMenuSelect() {
      this.toggleCollapse()
    },
    setActivated(route) {
      if (this.layout === 'mix') {
        let matched = route.matched
        matched = matched.slice(0, matched.length - 1)
        const { firstMenu } = this
        for (const menu of firstMenu) {
          if (matched.findIndex(item => item.path === menu.fullPath) !== -1) {
            this.setActivatedFirst(menu.fullPath)
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.admin-layout {
  .side-menu {
    border-right: @conte-border;
    &.fixed-side {
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }
  }

  .virtual-side {
    transition: all 0.2s;
  }

  .virtual-header {
    transition: all 0.2s;
    opacity: 0;

    &.fixed-tabs.multi-page:not(.fixed-header) {
      height: 0;
    }
  }

  .admin-layout-main {
    .admin-header {
      top: 0;
      right: 0;
      overflow: hidden;
      transition: all 0.2s;

      &.fixed-tabs.multi-page:not(.fixed-header) {
        height: 0;
      }
    }
  }

  .admin-layout-content {
    padding: 24px 24px 0;
    overflow-x: hidden;
    // min-height: calc(100vh - 93px);
    min-height: calc(100vh - 64px); // 无底部的样式
  }

  .setting {
    background-color: @primary-color;
    color: @base-bg-color;
    border-radius: 5px 0 0 5px;
    line-height: 40px;
    font-size: 22px;
    width: 40px;
    height: 40px;
    box-shadow: -2px 0 8px @shadow-color;
  }
}
</style>
