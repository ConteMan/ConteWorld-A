<template>
  <page-layout
    :desc="desc"
    :link-list="linkList"
    :show-header="showHeader"
  >
    <div v-if="extraImage && !isMobile" slot="extra" class="extraImg">
      <img :src="extraImage">
    </div>
    <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
      <slot name="router-view" />
    </page-toggle-transition>
  </page-layout>
</template>

<script>
import PageLayout from './PageLayout'
import PageToggleTransition from '../components/transition/PageToggleTransition'
import { mapState } from 'vuex'

export default {
  name: 'PageView',
  components: { PageToggleTransition, PageLayout },
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      page: {
        desc: '',
        linkList: [],
        extraImage: '',
      }
    }
  },
  computed: {
    ...mapState('setting', ['isMobile', 'multiPage', 'animate']),
    desc() {
      return this.page.desc
    },
    linkList() {
      return this.page.linkList
    },
    extraImage() {
      return this.page.extraImage
    }
  },
}
</script>

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;

  img {
    width: 100%;
  }
}
</style>
