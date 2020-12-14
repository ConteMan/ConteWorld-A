<template>
  <a-card>
    <a-form-model
      :model="form"
      :rules="rules"
      layout="vertical"
    >
      <a-form-model-item label="标题" prop="title">
        <a-input v-model="form.title" />
      </a-form-model-item>
      <a-form-model-item label="标签" prop="tags">
        <a-select mode="tags" :default-value="form.tags" @change="tagChange">
          <a-select-option v-for="item in tags" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="内容">
        <mavon-editor v-model="form.content" class="mk-container" v-bind="markdownOption" style="height: 100%" />
      </a-form-model-item>
      <a-form-model-item label="信息时间" prop="info_at">
        <a-date-picker
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
          :value="form.info_at"
          @change="infoAtChange"
          @ok="infoAtChange"
        />
      </a-form-model-item>
      <div class="item-max-width">
        <a-form-model-item label="状态">
          <a-select :default-value="form.status" @change="statusChange">
            <a-select-option v-for="item in statuses" :key="item.id" :value="item.id">{{ item.str }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
      <a-form-model-item>
        <a-space>
          <a-button type="primary" @click="create">
            创建
          </a-button>
          <a-button @click="$router.push({ path: 'index' })">
            取消
          </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { Article } from '@/services'

export default {
  name: 'Add',
  components: {
    mavonEditor,
  },
  data() {
    return {
      markdownOption: {
        subfield: false,
        defaultOpen: 'edit',
        editable: true,
        boxShadow: true,
      },
      form: {
        title: '',
        tags: undefined,
        content: '',
        status: 1,
        info_at: '',
      },
      rules: {
        title: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
      },
      createLoading: false,

      statuses: [],
      tags: [],
    }
  },
  mounted() {
    this.getStatuses()
    this.getTags()
  },
  methods: {
    async create() {
      this.createLoading = true
      const res = await Article.create(this.form)
      this.createLoading = false
      if (res.data.code === 0) {
        this.$message.success('添加成功')
      } else {
        this.$message.error(res.data.msg)
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
      }
    },
    statusChange(value) {
      this.form.status = value
    },
    tagChange(value) {
      this.form.tags = value
    },
    infoAtChange(value) {
      this.form.info_at = value
    }
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>
