<template>
  <a-card :bordered="false">
    <div>
      <div class="operator">
        <a-button type="primary" @click="showAdd">{{ $t('add') }}</a-button>
      </div>
      <a-table
        row-key="id"
        :data-source="items"
        :columns="columns"
        :bordered="true"
        :pagination="pagination"
        :scroll="{ x: 1000 }"
        @change="handleTableChange"
      >
        <span slot="common" slot-scope="text">
          <template v-if="!text">
            -
          </template>
          <template v-else>
            {{ text }}
          </template>
        </span>
        <span slot="auth" slot-scope="text">
          <a-tag v-for="item in text" :key="item" color="grey">
            {{ item }}
          </a-tag>
        </span>
        <span slot="status" slot-scope="text">
          <a-tag :color="statuses[text].color">
            {{ statuses[text].name }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="showEdit(record.id)">{{ $t('edit') }}</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="$t('delConfirm')"
            ok-text="Yes"
            cancel-text="No"
            @confirm="destroy(record.id)"
          >
            <a href="#">{{ $t('delete') }}</a>
          </a-popconfirm>
        </span>
      </a-table>

      <a-drawer
        :title="$emptyObj(current) ? $t('add') : $t('edit')"
        :width="720"
        :visible="drawerVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="drawerClose"
      >
        <a-form-model
          ref="drawerForm"
          :model="form"
          :rules="rules"
          layout="vertical"
        >
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.auth')" prop="auth">
                <a-checkbox-group v-model="form.auth">
                  <a-checkbox v-for="item in authList" :key="item.key" :value="item.key" name="auth">
                    {{ item.des }}
                  </a-checkbox>
                </a-checkbox-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.expired')" prop="expired">
                <a-date-picker
                  v-model="form.expired"
                  show-time
                  type="date"
                  placeholder="Pick a date"
                  style="width: 100%;"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="drawBottom">
          <a-space>
            <a-button @click="resetForm">
              {{ $t('reset') }}
            </a-button>
            <a-button type="primary" :loading="submitLoading" @click="submit">
              {{ $t('submit') }}
            </a-button>
          </a-space>
        </div>
      </a-drawer>
    </div>
  </a-card>
</template>

<script>
import { Token as PageApi } from '@/services'

export default {
  name: 'Token',
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
          title: this.$t('form.token'),
          dataIndex: 'token',
          width: 300,
          ellipsis: true,
        },
        {
          title: this.$t('form.auth'),
          dataIndex: 'auth',
          scopedSlots: { customRender: 'auth' },
        },
        {
          title: this.$t('form.expired'),
          dataIndex: 'expired',
          width: 200,
          scopedSlots: { customRender: 'common' },
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' },
        },
      ],
      pagination: {},
      current: {},

      drawerVisible: false,
      statuses: [],
      authList: [],

      formInit: {
        token: '',
        auth: [],
        expired: undefined,
        status: 1,
      },
      form: {
        token: '',
        auth: [],
        expired: undefined,
        status: 1,
      },
      rules: {
        auth: [
          { required: true, message: '请选择权限', trigger: 'blur' },
        ],
        expired: [
          { required: false },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
      },
      submitLoading: false,
    }
  },
  mounted() {
    this.initIndex()
    this.getStatuses()
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.index({ page: pagination.current, per_page: pagination.pageSize })
    },
    async index(params) {
      const res = await PageApi.index(params)
      this.items = res.data.data.items
      const pagination = { ...this.pagination }
      pagination.total = res.data.data.total_count
      this.pagination = pagination
    },
    // 初始化列表
    initIndex() {
      const params = { page: this.page, per_page: this.per_page }
      this.index(params)
      const pagination = { ...this.pagination }
      pagination.current = this.page
      this.pagination = pagination
    },
    // 获取状态列表
    async getStatuses() {
      const res = await PageApi.statuses()
      if (res.data.code === 0) {
        this.statuses = res.data.data.items
      }
    },
    // 显示添加
    async showAdd() {
      const authRes = await PageApi.authList()
      if (authRes.data.code === 0) {
        this.authList = authRes.data.data.items
      }
      this.drawerVisible = true
      this.$nextTick(() => {
        this.codeInputDisable = false
        this.form = this.formInit
        this.current = {}
        this.$refs.drawerForm.resetFields()
      })
    },
    // 显示编辑
    async showEdit(id) {
      const authRes = await PageApi.authList()
      if (authRes.data.code === 0) {
        this.authList = authRes.data.data.items
      }
      const res = await PageApi.edit(id)
      if (res.data.code === 0) {
        const detail = res.data.data.item
        this.drawerVisible = true
        this.codeInputDisable = true
        this.$nextTick(() => {
          this.current = detail
          this.form = detail
          this.$refs.drawerForm.resetFields()
        })
      } else {
        this.$message.error(res.data.msg ? res.data.msg : this.$t('result.editError'))
      }
    },
    // 提交
    async submit() {
      this.$refs.drawerForm.validate(async valid => {
        if (valid) {
          this.submitLoading = true
          let res = {}
          if (this.$emptyObj(this.current)) { // 创建 or 更新
            res = await PageApi.create(this.form)
          } else {
            res = await PageApi.update(this.current.id, this.form)
          }
          this.submitLoading = false
          if (res.data.code === 0) {
            this.$message.success(this.$t('result.success'))
            this.drawerVisible = false
            this.initIndex()
          } else {
            this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'))
          }
        } else {
          return false
        }
      })
    },
    // 删除
    async destroy(id) {
      const res = await PageApi.destroy(id)
      if (res.data.code === 0) {
        this.$message.success(this.$t('result.success'))
        this.initIndex()
      } else {
        this.$message.error(res.data.msg ? res.data.msg : this.$t('result.error'))
      }
    },
    // 重置表格
    resetForm() {
      this.$refs.drawerForm.resetFields()
    },
    // 关闭抽屉
    drawerClose() {
      this.drawerVisible = false
    }
  },
}
</script>

<style lang="less" scoped>
.operator {
  margin-bottom: 15px;
}

.drawBottom {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 1;
}
</style>
