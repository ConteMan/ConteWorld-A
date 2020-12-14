<template>
  <a-card>
    <div>
      <advance-table
        row-key="id"
        :loading="loading"
        :data-source="items"
        :columns="columns"
        :bordered="true"
        :scroll="{ x: 1000 }"
        :format-conditions="true"
        :pagination="{
          current: page,
          pageSize: per_page,
          total: total,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
          onChange: onPageChange,
          onShowSizeChange: onSizeChange,
        }"
        @search="onSearch"
        @refresh="onRefresh"
        @reset="onReset"
      >
        <div slot="title">
          <a-button class="table-title-btn" type="primary" @click="$router.push({ path: '/article/create' })">
            {{ $t('create') }}
          </a-button>
        </div>
        <span slot="status" slot-scope="{text}">
          <a-tag :color="text.color">
            {{ text.str }}
          </a-tag>
        </span>
        <span slot="tag" slot-scope="{text}">
          <a-tag v-for="item in text" :key="item" color="blue">
            {{ item }}
          </a-tag>
        </span>
        <span slot="date" slot-scope="{text}">
          {{ text }}
        </span>
        <span slot="action" slot-scope="{record}">
          <a @click="statusModalClick(record.id)">{{ $t('status') }}</a>
          <a-divider type="vertical" />
          <a @click="turnUpdate(record.id)">{{ $t('edit') }}</a>
        </span>
      </advance-table>

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
import AdvanceTable from '@/components/table/advance/AdvanceTable'
import { Article } from '@/services'

export default {
  name: 'Article',
  components: {
    AdvanceTable,
  },
  i18n: require('./i18n'),
  data() {
    return {
      loading: false,
      items: [],
      page: 1,
      per_page: 10,
      total: 0,
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
          title: this.$t('form.tags'),
          dataIndex: 'tags',
          scopedSlots: { customRender: 'tag' },
          searchAble: true,
          dataType: 'select',
          search: {
            selectOptions: this.tags,
          }
        },
        {
          title: this.$t('form.info_at'),
          dataIndex: 'info_at',
          width: 200,
          scopedSlots: { customRender: 'date' },
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
      conditions: {},
      pagination: {},

      syncLoading: false,

      statusModalVisible: false,
      statusLoading: false,
      statuses: [],
      tags: [],
      currentId: 0,
      current: {},
    }
  },
  async created() {
    await this.getTags()
    await this.getStatuses()
    await this.index()
  },
  methods: {
    async index() {
      this.loading = true
      const { page, per_page, conditions } = this
      const res = await Article.index({ page, per_page, ...conditions })
      const { items, page: re_page, per_page: re_per_page, total_count: re_total } = res.data.data
      this.items = items
      this.page = re_page
      this.per_page = re_per_page
      this.total = re_total
      this.loading = false
    },
    onSearch(conditions) {
      this.page = 1
      this.conditions = conditions
      this.index()
    },
    onSizeChange(current, size) {
      this.page = 1
      this.pageSize = size
      this.index()
    },
    onRefresh(conditions) {
      this.conditions = conditions
      this.index()
    },
    onReset(conditions) {
      this.conditions = conditions
      this.index()
    },
    onPageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.index()
    },
    turnUpdate(id) {
      this.$router.push({ path: '/article/update', query: { id: id }})
    },
    async edit(id) {
      const res = await Article.edit(id)
      if (res.data.code === 0) {
        const detail = res.data.data.item
        this.current = {
          status: detail.status,
        }
      }
    },
    async update() {
      const res = await Article.update(this.currentId, this.current)
      if (res.data.code === 0) {
        this.$message.success(this.$t('result.success'))
      } else {
        this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'))
      }
    },
    async getStatuses() {
      const res = await Article.statuses()
      if (res.data.code === 0) {
        this.statuses = res.data.data.items
      }
    },
    async getTags() {
      const res = await Article.tags()
      if (res.data.code === 0) {
        this.tags = res.data.data.items
        this.columns[3].search.selectOptions = this.tagToObj(res.data.data.items)
      }
    },
    tagToObj(tags) {
      const tmp = []
      tags.forEach(item => {
        tmp.push({ title: item, value: item })
      })
      return tmp
    },
    statusChange(value) {
      this.current.status = value
    },
    async statusModalClick(id) {
      this.statusModalVisible = !this.statusModalVisible
      if (this.statusModalVisible) {
        this.currentId = id
        await this.edit(id)
      } else {
        this.currentId = 0
        this.current = {}
      }
    },
    async statusOK() {
      await this.update()
      this.statusModalVisible = false
      await this.index()
    },
    statusCancel() {
      this.statusModalVisible = false
      this.currentId = 0
      this.current = {}
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index";
</style>
