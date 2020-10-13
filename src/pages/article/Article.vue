<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button type="primary" @click="$router.push({ path: '/article/create' })">添加</a-button>
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
          <a @click="statusModalClick(record.id)">状态</a>
          <template v-if="['ORI'].includes(record.platform)">
            <a-divider type="vertical" />
            <a @click="turnUpdate(record.id)">编辑</a>
          </template>
        </span>
      </a-table>
      <a-modal
          title="修改状态"
          :visible="statusModalVisible"
          :confirm-loading="statusLoading"
          @ok="statusOK"
          @cancel="statusCancel"
      >
        <a-form-model>
          <a-form-model-item>
            <a-select :value="current.status" @change="statusChange">
              <a-select-option v-for="item in statuses" :value="item.id" :key="item.id">{{ item.str }}</a-select-option>
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
  name: "One",
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
          title: '来源',
          dataIndex: 'platform',
          width: 100,
        },
        {
          title: '标题',
          dataIndex: 'title',
        },
        {
          title: '发布时间',
          dataIndex: 'published_at',
          width: 200,
          scopedSlots: { customRender: 'date' },
        },
        {
          title: '更新时间',
          dataIndex: 'updated_at',
          width: 200,
          scopedSlots: { customRender: 'date' },
        },
        {
          title: '状态',
          dataIndex: 'statusObj',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 120,
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
    async destroy(id) {
      const res = await Article.destroy(id);
      if(res.data.code === 0){
        this.$message.success('已删除');
        this.initIndex();
      } else {
        this.$message.error(res.data.msg);
      }
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
        this.$message.success('更新成功');
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
