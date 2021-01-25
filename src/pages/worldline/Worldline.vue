<template>
  <div class="worldline-container">
    <div class="worldline-action-bar">
      <div class="platform-type">
        <a-space>
          <template v-for="item in platformTypes">
            <template v-if="platformTypes.length > 0">
              <a-button :key="item.key" class="platform-type-btn" :type="item.key === platformType ? 'primary' : ''" size="small" @click="changePlatformType(item.key)">{{ item.value }} <template v-if="item.key === platformType">/ {{ total }}</template></a-button>
            </template>
          </template>
        </a-space>
      </div>
    </div>
    <div class="list-container">
      <div
        v-infinite-scroll="loadMore"
        class="list-content"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="200"
        infinite-scroll-immediate-check="true"
      >
        <template v-if="items.length">
          <template v-for="item in items">
            <div :key="item.slug" class="list-item">
              <div v-if="item.platform_type === 'yuque_note'" v-html="item.content" />
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import infiniteScroll from 'vue-infinite-scroll'
import { Worldline } from '@/services'

export default {
  name: 'Worldline',
  i18n: require('./i18n'),
  directives: {
    infiniteScroll,
  },
  data() {
    return {
      items: [],
      offset: 0,
      platformType: '',
      limit: 20,
      busy: false,
      total: 0,

      platformTypes: [
        {
          key: '',
          value: '全部',
        }
      ],
    }
  },
  created() {
    this.index()
    this.getPlatformTypes()
  },
  methods: {
    init() {
      this.items = []
      this.offset = 0
      this.busy = false
    },
    async index() {
      const { offset, limit, platformType } = this
      const res = await Worldline.index({ offset, limit, platformType })
      const { items, totalCount } = res.data.data
      this.total = totalCount
      if (items.length > 0) {
        this.items = _.concat(this.items, items)
        this.busy = false
      } else {
        this.busy = true
      }
    },
    loadMore() {
      this.offset += this.limit
      this.index()
    },
    async getPlatformTypes() {
      const res = await Worldline.platformTypes()
      this.platformTypes = _.concat(this.platformTypes, res.data.data.items)
    },
    changePlatformType(platformType) {
      this.platformType = platformType
      this.init()
      this.index()
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index";
</style>
