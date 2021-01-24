<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button type="primary" @click="showAdd(0)">{{ $t('add') }}</a-button>
      </div>
      <a-table
        row-key="id"
        :data-source="items"
        :columns="columns"
        :pagination="pagination"
        :scroll="{ x: 1000 }"
        :bordered="true"
        :indent-size="5"
        :default-expand-all-rows="true"
        @change="handleTableChange"
      >
        <span slot="status" slot-scope="text">
          <a-tag :color="statuses[text].color">
            {{ statuses[text].value }}
          </a-tag>
        </span>
        <span slot="date" slot-scope="text">
          {{ $dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template v-if="record.parent_id === 0">
            <a @click="showAdd(record.id)">{{ $t('add') }}</a>
            <a-divider type="vertical" />
          </template>
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
              <a-form-model-item ref="name" :label="$t('form.parent_id')" prop="parent_id">
                <a-select v-model="form.parent_id">
                  <a-select-option :value="0">
                    Empty
                  </a-select-option>
                  <a-select-option v-for="item in roots" :key="item.id" :value="item.id">
                    {{ item.name }} / {{ item.code }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item ref="name" :label="$t('form.name')" prop="name">
                <a-input
                  v-model="form.name"
                  @blur="
                    () => {
                      $refs.name.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.code')" prop="code">
                <a-input v-model="form.code" :disabled="codeInputDisable" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.value_type')" prop="value_type">
                <a-select v-model="form.value_type">
                  <a-select-option value="string">
                    String
                  </a-select-option>
                  <a-select-option value="json">
                    Json
                  </a-select-option>
                  <a-select-option value="number">
                    Number
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.value')" prop="value">
                <a-textarea v-model="form.value" :rows="4" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.des')" prop="des">
                <a-textarea v-model="form.des" :rows="4" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-model-item :label="$t('form.status')" prop="status">
                <a-radio-group v-model="form.status">
                  <a-radio v-for="item in statuses" :key="item.key" :value="item.key">
                    {{ item.value }}
                  </a-radio>
                </a-radio-group>
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
import { SysEnum } from '@/services'

export default {
  name: 'Enum',
  i18n: require('./i18n'),
  data() {
    return {
      items: [],
      page: 1,
      per_page: 10,
      columns: [
        {
          title: this.$t('form.name'),
          dataIndex: 'name',
          width: 200,
        },
        {
          title: this.$t('form.code'),
          dataIndex: 'code',
          width: 200,
        },
        {
          title: this.$t('form.value_type'),
          dataIndex: 'value_type',
          width: 100,
        },
        {
          title: this.$t('form.value'),
          dataIndex: 'value',
        },
        {
          title: this.$t('form.des'),
          dataIndex: 'des',
          width: 150,
        },
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at',
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
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          fixed: 'right',
          width: 170,
          scopedSlots: { customRender: 'action' },
        },
      ],
      pagination: {},
      current: {},

      drawerVisible: false,
      statuses: [],

      formInit: {
        parent_id: 0,
        name: undefined,
        code: undefined,
        des: undefined,
        value_type: 'text',
        value: undefined,
        status: 1,
      },
      form: {
        parent_id: 0,
        name: undefined,
        code: undefined,
        des: undefined,
        value_type: 'text',
        value: undefined,
        status: 1,
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
        ],
        value_type: [
          { required: true, message: '请选择值类型', trigger: 'blur' },
        ],
        value: [
          { required: true, message: '请输入值内容', trigger: 'blur' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
      },
      submitLoading: false,
      codeInputDisable: false,

      roots: [],
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
      const res = await SysEnum.index(params)
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
      const res = await SysEnum.statuses()
      if (res.data.code === 0) {
        this.statuses = res.data.data.items
      }
    },
    // 显示添加
    async showAdd(pid = 0) {
      await this.getRoots()
      this.drawerVisible = true
      this.$nextTick(() => {
        this.form = this.formInit
        this.codeInputDisable = false
        this.current = {}
        this.$refs.drawerForm.resetFields()
        this.form.parent_id = pid
      })
    },
    // 显示编辑
    async showEdit(id) {
      await this.getRoots()
      const res = await SysEnum.edit(id)
      if (res.data.code === 0) {
        const detail = res.data.data.res
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
          if (this.$emptyObj(this.current)) {
            res = await SysEnum.create(this.form)
          } else {
            res = await SysEnum.update(this.current.id, this.form)
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
      const res = await SysEnum.destroy(id)
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
    },
    async getRoots() {
      const res = await SysEnum.roots()
      if (res.data.code === 0) {
        this.roots = res.data.data.items
      }
    },
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
