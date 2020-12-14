<template>
  <page-layout>
    <div slot="headerContent">
      {{ oneText }} {{ oneTextAuthor }}
    </div>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import OneApi from '@/services/modules/one'

export default {
  name: 'Dashboard',
  components: {
    PageLayout,
  },
  i18n: require('./i18n'),
  data() {
    return {
      oneText: '',
      oneTextAuthor: '',
    }
  },
  created() {
    this.getOne()
  },
  methods: {
    async getOne() {
      const data = await OneApi.random()
      if (data.data.code === 0) {
        const { content, text_authors } = data.data.data
        this.oneText = content
        this.oneTextAuthor = text_authors ? '【' + text_authors + '】' : ''
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "index";
</style>
