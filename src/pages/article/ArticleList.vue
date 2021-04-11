<template>
  <page-layout>
    <a-card
      class="action-bar"
      :bordered="false"
    >
      <a-button
        type="primary"
        size="small"
        @click="$router.push({ path: '/article/create'})"
      >
        写点什么 ...
      </a-button>
      <div v-if="tags.length" class="tag">
        <a-checkable-tag
          class="pointer"
          :checked="!checkedTag"
          @change="tagChange('', $event)"
        >
          全部
        </a-checkable-tag>
        <a-checkable-tag
          v-for="tag in tags"
          :key="tag"
          class="pointer"
          :checked="checkedTag === tag"
          @change="tagChange(tag, $event)"
        >
          {{ tag }}
        </a-checkable-tag>
      </div>
      <div class="status">
        <a-checkable-tag
          class="pointer"
          :checked="typeof checkedStatus === 'undefined'"
          @change="indexStatusChange(undefined, $event)"
        >
          全部
        </a-checkable-tag>
        <a-checkable-tag
          v-for="status in statuses"
          :key="status.key"
          class="pointer"
          :checked="checkedStatus === status.key"
          @change="indexStatusChange(status.key, $event)"
        >
          {{ status.value }}
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
              <a-icon type="edit" :title="$t('edit')" @click="turnUpdate(item.id)" />
              <a-divider type="vertical" />
              <a-icon type="ellipsis" :title="$t('status')" @click="statusModalClick(item.id)" />
            </a-space>
          </template>
          <div class="title">
            {{ item.title }}
          </div>
          <div class="info-at">
            {{ item.info_at }}
          </div>
          <div v-if="item.tags.length" class="tag">
            <a-space>
              <a-tag
                v-for="tag in item.tags"
                :key="tag"
                class="pointer"
                color="red"
                @click="tagChange(tag, true)"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </div>
        </a-list-item>
      </a-list>
    </a-card>

    <a-card :bordered="false">
      <a-pagination
        size="small"
        :current="page"
        :page-size="per_page"
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

    <a-modal
      :title="$t('status')"
      :visible="statusModalVisible"
      :confirm-loading="statusLoading"
      @ok="statusOK"
      @cancel="statusCancel"
    >
      <a-form-model>
        <a-form-model-item>
          <a-select :value="current.status" @change="statusChange">
            <a-select-option v-for="item in statuses" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue';
import { Article } from '@/services';

export default {
  name: 'Article',
  components: {
    PageLayout,
  },
  i18n: require('./i18n'),
  data() {
    return {
      loading: false,
      items: [],
      page: 1,
      per_page: 10,
      total: 0,

      conditions: {},
      pagination: {},
      pageSizeOptions: [
        '10',
        '20',
      ],

      syncLoading: false,

      statusModalVisible: false,
      statusLoading: false,
      statuses: [],
      tags: [],
      currentId: 0,
      current: {},

      checkedTag: '',
      checkedStatus: 2,
    };
  },
  async created() {
    this.getTags();
    await this.getStatuses();
    await this.index();
  },
  methods: {
    async index() {
      this.loading = true;
      const { page, per_page, checkedTag, checkedStatus } = this;
      const res = await Article.index({ page, per_page, tag: checkedTag, status: checkedStatus });
      const { items, page: re_page, per_page: re_per_page, total_count: re_total } = res.data.data;
      this.items = items;
      this.page = re_page;
      this.per_page = re_per_page;
      this.total = re_total;
      this.loading = false;
    },
    onSearch(conditions) {
      this.page = 1;
      this.conditions = conditions;
      this.index();
    },
    onSizeChange(current, size) {
      this.page = 1;
      this.per_page = size;
      this.index();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.index();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.index();
    },
    onPageChange(page, pageSize) {
      this.page = page;
      this.per_page = pageSize;
      this.index();
    },
    turnUpdate(id) {
      this.$router.push({ path: '/article/update', query: { id: id }});
    },
    async edit(id) {
      const res = await Article.edit(id);
      if (res.data.code === 0) {
        const detail = res.data.data.item;
        this.current = {
          status: detail.status,
        };
      }
    },
    async update() {
      const res = await Article.update(this.currentId, this.current);
      if (res.data.code === 0) {
        this.$message.success(this.$t('result.success'));
      } else {
        this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'));
      }
    },
    async getStatuses() {
      const res = await Article.statuses();
      if (res.data.code === 0) {
        this.statuses = res.data.data.items;
      }
    },
    async getTags() {
      const res = await Article.tags();
      if (res.data.code === 0) {
        this.tags = res.data.data.items;
      }
    },
    tagToObj(tags) {
      const tmp = [];
      tags.forEach(item => {
        tmp.push({ title: item, value: item });
      });
      return tmp;
    },
    statusChange(value) {
      this.current.status = value;
    },
    async statusModalClick(id) {
      this.statusModalVisible = !this.statusModalVisible;
      if (this.statusModalVisible) {
        this.currentId = id;
        await this.edit(id);
      } else {
        this.currentId = 0;
        this.current = {};
      }
    },
    async statusOK() {
      await this.update();
      this.statusModalVisible = false;
      await this.index();
    },
    statusCancel() {
      this.statusModalVisible = false;
      this.currentId = 0;
      this.current = {};
    },
    tagChange(tag, checked) {
      if (checked) {
        this.checkedTag = tag;
      } else {
        this.checkedTag = '';
      }
      this.index();
    },
    indexStatusChange(status, checked) {
      if (checked) {
        this.checkedStatus = status;
      } else {
        this.checkedStatus = undefined;
      }
      this.index();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index";
</style>
