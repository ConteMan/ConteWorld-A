<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button type="primary" @click="$router.push({ path: '/article/create' })">{{ $t('add') }}</a-button>
      </div>
      <a-table rowKey="id" :data-source="items" :columns="columns" :bordered="true" :pagination="pagination" @change="handleTableChange" :scroll="{ x: 1000 }">
        <span slot="status" slot-scope="text">
          <a-tag :color="text.color">
            {{ text.str }}
          </a-tag>
        </span>
        <span slot="date" slot-scope="text">
          {{ $dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="statusModalClick(record.id)">{{ $t('status') }}</a>
          <template v-if="['ORI'].includes(record.platform)">
            <a-divider type="vertical" />
            <a @click="turnUpdate(record.id)">{{ $t('edit') }}</a>
          </template>
        </span>
      </a-table>

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
              <a-select-option v-for="item in statuses" :key="item.id" :value="item.id">{{ item.str }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

    </div>
  </a-card>
</template>

<script>
import { Article } from '@/services'

export default {
  name: "Article",
  i18n: require('./i18n'),
  data() {
    return {
      items: [],
      page: 1,
      per_page: 10,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          fixed: 'left',
          width: 60,
        },
        {
          title: this.$t('form.platform'),
          dataIndex: 'platform',
          width: 100,
        },
        {
          title: this.$t('form.title'),
          dataIndex: 'title',
        },
        {
          title: this.$t('form.published_at'),
          dataIndex: 'published_at',
          width: 200,
          scopedSlots: { customRender: 'date' },
        },
        {
          title: this.$t('updated_at'),
          dataIndex: 'updated_at',
          width: 200,
          scopedSlots: { customRender: 'date' },
        },
        {
          title: this.$t('status'),
          dataIndex: 'statusObj',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      pagination: {},

      syncLoading: false,

      statusModalVisible: false,
      statusLoading: false,
      statuses: [],
      currentId: 0,
      current: {},
    }
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.index({page: pagination.current, per_page: pagination.pageSize});
    },
    async index(params) {
      const res = await Article.index(params);
      this.items = res.data.data.items
      const pagination = { ...this.pagination };
      pagination.total = res.data.data.total_count
      this.pagination = pagination
    },
    initIndex() {
      const params = {page: this.page, per_page: this.per_page};
      this.index(params);
      const pagination = { ...this.pagination };
      pagination.current = this.page
      this.pagination = pagination
    },
    turnUpdate(id) {
      this.$router.push({ path: '/article/update', query: { id: id } })
    },
    async edit(id) {
      const res = await Article.edit(id);
      if(res.data.code === 0){
        const detail = res.data.data.res;
        this.current = {
          status: detail.status,
        }
      }
    },
    async update() {
      const res = await Article.update(this.currentId, this.current);
      if(res.data.code === 0){
        this.$message.success(this.$t('result.success'))
      } else {
        this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'));
      }
    },
    async getStatuses() {
      const res = await Article.statuses();
      if(res.data.code === 0) {
        this.statuses = res.data.data.items;
      }
    },
    statusChange(value) {
      this.current.status = value;
    },
    async statusModalClick(id) {
      this.statusModalVisible = !this.statusModalVisible;
      if(this.statusModalVisible) {
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
      this.initIndex();
    },
    statusCancel() {
      this.statusModalVisible = false;
      this.currentId = 0;
      this.current = {};
    }
  },
  mounted() {
    this.initIndex();
    this.getStatuses();
  }
}
</script>

<style lang="less" scoped>
  .operator {
    margin-bottom: 15px;
  }
</style>
