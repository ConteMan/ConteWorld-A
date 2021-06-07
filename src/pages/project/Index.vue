<template>
  <div>
    <a-card class="action-bar" :bordered="false">
      <a-button
        type="primary"
        size="small"
        :loading="syncLoading"
        @click="sync()"
      >
        {{ $t('sync') }}
      </a-button>

      <div class="status">
        <a-checkable-tag
          class="pointer"
          :checked="typeof checkedPublicType === 'undefined'"
          @change="indexPublicTypeChange(undefined, $event)"
        >
          全部
        </a-checkable-tag>
        <a-checkable-tag
          v-for="item in publicTypes"
          :key="item.key"
          class="pointer"
          :checked="checkedPublicType === item.key"
          @change="indexPublicTypeChange(item.key, $event)"
        >
          {{ item.value }}
        </a-checkable-tag>
      </div>
    </a-card>

    <a-card :bordered="false">
      <a-list
        item-layout="vertical"
        :loading="loading"
        :data-source="items"
        :bordered="false"
      >
        <a-list-item
          slot="renderItem"
          key="item.slug"
          slot-scope="item"
          class="list-item"
        >
          <template slot="extra">
            <a-space>
              <a-icon type="edit" />
            </a-space>
          </template>
          <div class="title">
            <a :href="item.content_origin.html_url">{{ item.content_origin.name }}</a>
          </div>
          <div>
            {{ item.content_origin.description }}
          </div>
          <div>
            {{ dayjs(item.content_origin.updated_at).format("YYYY-MM-DD HH:mm:ss") }}
          </div>
        </a-list-item>
      </a-list>
    </a-card>

    <a-card :bordered="false">
      <a-pagination
        size="small"
        :current="page"
        :page-size="limit"
        :total="total"
        :page-size-options="pageSizeOptions"
        :show-size-changer="true"
        :show-less-items="true"
        @change="onPageChange"
        @showSizeChange="onSizeChange"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span>{{ props.value }}</span>
        </template>
      </a-pagination>
    </a-card>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { Project as Base } from '@/services';

export default {
  name: 'Project',
  i18n: require('./i18n'),
  data() {
    const baseLimit = 100;
    return {
      dayjs,

      loading: false,
      items: [],
      page: 1,
      offset: 0,
      limit: baseLimit,
      total: 0,

      pagination: {},
      pageSizeOptions: [
        String(baseLimit),
        String(baseLimit * 2),
      ],

      publicTypes: [],
      checkedPublicType: undefined,

      syncLoading: false,
    };
  },
  async created() {
    await this.getPublicTypes();
    await this.index();
  },
  methods: {
    // 分页
    onSizeChange(current, size) {
      this.page = current;
      this.offset = (current - 1) * size;
      this.limit = this.offset + size;
      this.index();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.offset = (page - 1) * pageSize;
      this.limit = this.offset + pageSize;
      this.index();
    },

    // 列表
    async index() {
      this.loading = true;
      const { offset, limit, checkedPublicType: isPublic } = this;
      const res = await Base.index({ offset, limit, isPublic });
      if (res.data.code === 0) {
        const { items, totalCount } = res.data.data;
        this.items = items;
        this.total = totalCount;
      }
      this.loading = false;
    },

    indexPublicTypeChange(status, checked) {
      if (checked) {
        this.checkedPublicType = status;
      } else {
        this.checkedPublicType = undefined;
      }
      this.index();
    },

    initIndex() {
      this.page = 1;
      this.offset = 0;
      this.index();
    },

    // 公开状态列表
    async getPublicTypes() {
      const res = await Base.publicType();
      if (res.data.code === 0) {
        this.publicTypes = res.data.data.items;
      }
    },

    // 同步
    async sync(force = false) {
      this.syncLoading = true;
      const res = await Base.sync(force);
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
