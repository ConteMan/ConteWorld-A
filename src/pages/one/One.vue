<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="sync" type="primary" :loading="syncLoading">同步</a-button>
      </div>
      <a-table rowKey="id" :data-source="items" :columns="columns" :bordered="true" :pagination="pagination" @change="handleTableChange">
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          {{ record.data }}
        </p>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { One } from '@/services'

export default {
  name: "One",
  data() {
    return {
      items: [],
      page: 1,
      per_page: 10,
      columns: [
        {
          title: 'VOL',
          dataIndex: 'vol',
          width: 100,
        },
        {
          title: '日期',
          dataIndex: 'data.date',
          width: 150,
        },
        {
          title: '内容',
          dataIndex: 'data.content',
          ellipsis: true,
        },
        {
          title: '作者',
          dataIndex: 'data.text_authors',
        },
        {
          title: 'Url',
          dataIndex: 'data.url',
          width: 300,
        },
      ],
      pagination: {},

      syncLoading: false,
    }
  },
  methods: {
    handleTableChange(pagination) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.index({page: pagination.current, per_page: pagination.pageSize});
    },
    async index(params) {
      const res = await One.index(params);
      console.log(res.data)
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
    async sync() {
      this.syncLoading = true;
      const res = await One.sync();
      this.syncLoading = false;
      this.$message.success('同步成功 '+ res.data.data.add_num + ' 条！');
      this.initIndex();
    },
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
