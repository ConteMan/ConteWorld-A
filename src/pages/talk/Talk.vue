<template>
  <page-view-slot
    class="no-page-header"
    :show-header="false"
  >
    <template #router-view>
      <div class="talk-container" :style="{ 'height': worldlineContainerHeight }">

        <div class="bar">
          <div class="type">
            <a-select
              :class="['talk-type', 'no-shadow', 'c-border-l']"
              :default-value="type"
              style="width: 180px"
              :dropdown-match-select-width="false"
              :show-arrow="true"
              :get-popup-container="trigger => trigger.parentNode"
              @change="changeType"
            >
              <template v-for="item in types">
                <a-select-option :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
              </template>
            </a-select>
            <div
              class="c-border-l item"
              @click="() => formVisible = true"
            >
              Talk
            </div>
            <div
              class="c-border-l c-border-r item"
              :class="{ 'active': showType === 'action' }"
              @click="changeShowType()"
            >
              More
            </div>
          </div>
        </div>

        <div class="list-container" :style="{ 'height': listContainerHeight }">
          <div
            v-show="showType === 'list'"
            v-infinite-scroll="loadMore"
            infinite-scroll-delay="1000"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="50"
            infinite-scroll-immediate-check="true"
            :style="{ 'height': listContainerHeight }"
            class="list-content"
          >
            <template v-for="(item, i) in items">
              <div :key="i" class="list-item">
                <div v-if="item.platform_type === 'yuque_note'">
                  {{ item.content }}
                </div>
                <div v-if="item.platform_type === 'conteworld_talk'">
                  {{ item.content }}
                </div>
                <div class="info">
                  <span class="time">
                    {{ dayjs(item.platform_created_at).format("YYYY-MM-DD HH:mm:ss") }}
                  </span>
                  <span class="platform-type">
                    {{ item.platform_type_des.value }}
                  </span>
                </div>
              </div>
            </template>
          </div>
          <div
            v-show="showType === 'action'"
            class="action-content"
          >
            <div class="action-item">
              <div class="left">
                同步数据
              </div>
              <div class="right">
                <a-button
                  size="small"
                  :loading="syncLoading"
                  @click="sync()"
                >
                  确定
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <a-drawer
          title="记录此刻"
          :closable="false"
          :width="'100%'"
          :visible="formVisible"
          :body-style="{ maxWidth: '100%' }"
          @close="() => formVisible = false"
        >
          <a-form-model
            :form="form"
            layout="vertical"
            hide-required-mark
          >
            <a-form-model-item>
              <a-textarea
                v-model="form.content"
                :class="'talk-textarea'"
                :style="{ height: talkTextareaHeight }"
                placeholder="Slow down, not so much to seize"
                :auto-size="false"
              />
            </a-form-model-item>
          </a-form-model>
          <div
            :style="{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 24px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1,
            }"
          >
            <a-button :style="{ marginRight: '8px' }" @click="() => formVisible = false">
              取消
            </a-button>
            <a-button type="primary" @click="create">
              发布
            </a-button>
          </div>
        </a-drawer>

      </div>
    </template>
  </page-view-slot>
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import infiniteScroll from 'vue-infinite-scroll'
import PageViewSlot from '@/layouts/PageViewSlot'
import { Talk as Base } from '@/services'

export default {
  name: 'Talk',
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
      pageHeight: window.innerHeight,
      showType: 'list',

      syncLoading: false,

      formVisible: false,
      form: {
        content: '',
      },
    }
  },
  computed: {
    worldlineContainerHeight() {
      return (this.pageHeight - 64) + 'px'
    },
    listContainerHeight() {
      return (this.pageHeight - 64 - 50) + 'px'
    },
    talkTextareaHeight() {
      return (this.pageHeight - 55 - 53 - 48) + 'px'
    }
  },
  created() {
    this.index()
    this.getTypes()
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
    },
    async index() {
      const { offset, limit, type } = this
      const res = await Base.index({ offset, limit, type })
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
      this.offset += this.limit
      this.index()
    },
    async getTypes() {
      const res = await Base.types()
      if (res.data.code === 0) {
        this.types = _.concat(this.types, res.data.data.items)
      }
    },
    changeType(type) {
      this.changeShowType('list')
      if (type === this.type) {
        return true
      }
      this.type = type
      this.init()
      this.index()
    },
    changeShowType(type = 'action') {
      this.showType = type
    },
    async sync() {
      this.syncLoading = true
      const res = await Base.sync()
      this.syncLoading = false
      if (res.data.code === 0) {
        this.$message.success('搞定！（' + res.data.data.totalCount + '）')
      } else {
        this.$message.error('有点问题！')
      }
    },
    async create() {
      if (!this.form.content) {
        this.$message.error('写点什么吧')
        return false
      }
      this.createLoading = true
      const res = await Base.create(this.form)
      this.createLoading = false
      if (res.data.code === 0) {
        this.form.content = ''
        this.$message.success('搞定！')
      } else {
        this.$message.error('有点问题！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index";
</style>
