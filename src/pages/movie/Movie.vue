<template>
  <page-view-slot>
    <template #router-view>
      <div class="movie-container" :style="{ 'height': worldlineContainerHeight }">
        <div class="bar">
          <div class="type">
            <template v-if="types.length > 0">
              <template v-for="item in types">
                <div :key="item.key" class="type-item" :class="{ 'active': item.key===type }" @click="changeType(item.key)">{{ item.value }}</div>
              </template>
            </template>
          </div>
        </div>
        <div class="list-container" :style="{ 'height': listContainerHeight }">
          <div
            v-infinite-scroll="loadMore"
            class="list-content beauty-scroll"
            infinite-scroll-delay="1000"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="200"
            infinite-scroll-immediate-check="false"
            :style="{ 'height': listContainerHeight }"
          >
            <template v-if="items.length">
              <template v-for="item in items">
                <div :key="item.id" class="list-item">
                  <div v-if="item.platform_type === 'yuque_note'" v-html="item.content" />
                  <div v-if="item.platform_type === 'douban_movie'">
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
import { Movie } from '@/services'

export default {
  name: 'Movie',
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
      type: '',
      limit: 20,
      busy: false,
      total: 0,

      dayjs,

      types: [
        {
          key: '',
          value: '全部',
        }
      ],
      pageHeight: document.body.clientHeight
    }
  },
  computed: {
    worldlineContainerHeight() {
      return (this.pageHeight - 118) + 'px'
    },
    listContainerHeight() {
      return (this.pageHeight - 118) + 'px'
    }
  },
  created() {
    this.index()
    this.getTypes()
    const that = this
    window.onresize = () => {
      return (() => {
        that.pageHeight = document.body.clientHeight
      })()
    }
  },
  methods: {
    init() {
      this.items = []
      this.offset = 0
      this.busy = false
    },
    async index() {
      const { offset, limit, type } = this
      const res = await Movie.index({ offset, limit, type })
      if (res.data.code === 0) {
        const { items, totalCount } = res.data.data
        this.total = totalCount
        if (items.length > 0) {
          this.items = _.concat(this.items, items)
          this.busy = false
        } else {
          this.busy = true
        }
      }
    },
    loadMore() {
      console.log('lodeMore', this.offset)
      this.offset += this.limit
      this.index()
    },
    async getTypes() {
      const res = await Movie.types()
      if (res.data.code === 0) {
        this.types = _.concat(this.types, res.data.data.items)
      }
    },
    changeType(type) {
      this.type = type
      this.init()
      this.index()
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index";
</style>
