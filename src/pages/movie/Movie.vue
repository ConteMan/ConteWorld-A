<template>
  <page-view-slot
    class="no-page-header"
    :show-header="false"
  >
    <template #router-view>
      <div class="movie-container" :style="{ 'height': worldlineContainerHeight }">
        <div class="bar">
          <div class="type">
            <template v-if="types.length > 0">
              <template v-for="item in types">
                <div
                  :key="item.key"
                  class="item"
                  :class="{ 'active': item.key===type && showType === 'list' }"
                  @click="changeType(item.key)"
                >
                  {{ item.value }}
                  <p>{{ item.total }}</p>
                </div>
              </template>
            </template>
          </div>
          <div class="action">
            <div
              class="item"
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
            class="list-content"
            infinite-scroll-delay="1000"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="150"
            infinite-scroll-immediate-check="true"
            :style="{ 'height': listContainerHeight }"
          >
            <template v-if="items.length">
              <template v-for="item in items">
                <div :key="item.id" class="list-item">
                  <div v-if="item.platform_type === 'yuque_note'" v-html="item.content" />
                  <div v-if="[ 'douban_movie', 'douban_movie_wish', 'douban_movie_do'].includes(item.platform_type)">
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
      </div>
    </template>
  </page-view-slot>
</template>

<script>
import _ from 'lodash';
import dayjs from 'dayjs';
import infiniteScroll from 'vue-infinite-scroll';
import PageViewSlot from '@/layouts/PageViewSlot';
import { Movie } from '@/services';

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

      types: [],
      pageHeight: document.body.clientHeight,
      showType: 'list',

      syncLoading: false,
    };
  },
  computed: {
    worldlineContainerHeight() {
      return (this.pageHeight - 64) + 'px';
    },
    listContainerHeight() {
      return (this.pageHeight - 64) + 'px';
    }
  },
  async created() {
    await this.getTypes();
    await this.index();
    const that = this;
    window.onresize = () => {
      return (() => {
        that.pageHeight = document.body.clientHeight;
      })();
    };
  },
  methods: {
    init() {
      this.items = [];
      this.offset = 0;
      this.busy = false;
    },
    async index() {
      const { offset, limit, type } = this;
      const res = await Movie.index({ offset, limit, type });
      if (res.data.code === 0) {
        const { items, totalCount } = res.data.data;
        this.total = totalCount;
        if (items.length > 0) {
          this.items = _.concat(this.items, items);
          this.busy = false;
        } else {
          this.busy = true;
        }
      }
    },
    loadMore() {
      this.offset += this.limit;
      this.index();
    },
    async getTypes() {
      const res = await Movie.types();
      if (res.data.code === 0) {
        this.types = res.data.data.items;
        this.type = res.data.data.items[0].key;
      }
    },
    changeType(type) {
      this.changeShowType('list');
      if (type === this.type) {
        return true;
      }
      this.type = type;
      this.init();
      this.index();
    },
    changeShowType(type = 'action') {
      this.showType = type;
    },
    async sync() {
      this.syncLoading = true;
      const res = await Movie.sync();
      this.syncLoading = false;
      if (res.data.code === 0) {
        this.$message.success('搞定！（' + res.data.data.totalCount + '）');
      } else {
        this.$message.error('有点问题！');
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
