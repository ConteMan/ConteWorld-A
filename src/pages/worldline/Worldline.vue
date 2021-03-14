<template>
  <page-view-slot
    class="no-page-header"
    :show-header="false"
  >
    <template #router-view>
      <div class="worldline-container" :style="{ 'height': worldlineContainerHeight }">

        <div class="worldline-action-bar beauty-scroll">
          <div class="platform-type">
            <a-space>
              <template v-for="item in platformTypes">
                <template v-if="platformTypes.length > 0">
                  <a-button :key="item.key" class="platform-type-btn" :type="item.key === platformType ? 'primary' : 'link'" size="small" @click="changePlatformType(item.key)">
                    {{ item.value }}
                    <template v-if="item.key === platformType && total !== 0">
                      / {{ total }}
                    </template>
                  </a-button>
                </template>
              </template>
            </a-space>
          </div>
        </div>

        <div class="list-container" :style="{ 'height': listContainerHeight }">
          <div
            v-infinite-scroll="loadMore"
            infinite-scroll-delay="1000"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="true"
            :style="{ 'height': listContainerHeight }"
            class="list-content"
          >
            <template v-for="item in items">
              <div :key="item.slug" class="list-item">
                <div v-if="item.platform_type === 'yuque_note'">
                  {{ item.content }}
                </div>
                <div
                  v-if="[
                    'douban_movie',
                    'douban_movie_do',
                    'douban_movie_wish',
                    'conteworld_talk',
                  ].includes(item.platform_type)"
                >
                  {{ item.content }}
                </div>
                <div class="info">
                  <span class="time">
                    <template v-if="item.platform === 'douban'">
                      {{ dayjs(item.platform_created_at).format("YYYY-MM-DD") }}
                    </template>
                    <template v-else>
                      {{ dayjs(item.platform_created_at).format("YYYY-MM-DD HH:mm:ss") }}
                    </template>
                  </span>
                  <span class="platform-type">{{ item.platform_type_des.value }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
    </template>
  </page-view-slot>
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import infiniteScroll from 'vue-infinite-scroll'
import PageViewSlot from '@/layouts/PageViewSlot'
import { Worldline } from '@/services'

export default {
  name: 'Worldline',
  i18n: require('./i18n'),
  directives: {
    infiniteScroll,
  },
  components: {
    PageViewSlot,
  },
  data() {
    return {
      items: [],
      offset: 0,
      platformType: '',
      limit: 20,
      busy: false,
      total: 0,

      dayjs,

      platformTypes: [
        {
          key: '',
          value: '全部',
        }
      ],
      pageHeight: window.innerHeight
    }
  },
  computed: {
    worldlineContainerHeight() {
      return (this.pageHeight - 64) + 'px'
    },
    listContainerHeight() {
      return (this.pageHeight - 64 - 50 - 1) + 'px'
    }
  },
  created() {
    this.index()
    this.getPlatformTypes()
    const that = this
    window.onresize = () => {
      return (() => {
        that.pageHeight = window.innerHeight
      })()
    }
  },
  methods: {
    init() {
      this.items = []
      this.offset = 0
      this.busy = false
      this.total = 0
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
