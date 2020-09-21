<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button type="primary" @click="$router.push({ path: '/article/create' })">添加</a-button>
      </div>
      <a-table rowKey="id" :data-source="items" :columns="columns" :bordered="true" :pagination="pagination" @change="handleTableChange">
        <span slot="status" slot-scope="text">
          <a-tag v-if="text === 1" color="#108ee9">
            待发布
          </a-tag>
          <a-tag v-if="text === 2" color="red">
            已发布
          </a-tag>
          <a-tag v-if="text === 3" color="grey">
            已删除
          </a-tag>
        </span>
        <span slot="date" slot-scope="text">
          {{ $dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="turnUpdate(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
              title="是否删除？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="destroy(record.id)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
      </a-table>
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
          width: 80,
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
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' },
        },
      ],
      pagination: {},

      syncLoading: false,
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
    }
  },
  mounted() {
    this.initIndex()
  }
}
</script>

<style lang="less" scoped>
  .operator {
    margin-bottom: 15px;
  }
</style>
