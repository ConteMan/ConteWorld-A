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
        <a-select mode="tags" :value="form.tags" @change="tagChange">
          <a-select-option v-for="item in tags" :key="item" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-item v-if="['ORI'].includes(form.platform)" label="内容">
        <mavon-editor v-model="form.content" class="mk-container" v-bind="markdownOption" style="height: 100%" />
      </a-form-item>
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
          <a-select dropdown-class-name="item-min-width" :value="form.status" @change="statusChange">
            <a-select-option v-for="item in statuses" :key="item.id" :value="item.id">{{ item.str }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
      <a-form-model-item>
        <a-space>
          <a-button type="primary" @click="update">
            更新
          </a-button>
          <a-button @click="$router.push({ path: '/article' })">
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
  name: 'ArticleUpdate',
  components: {
    mavonEditor,
  },
  data() {
    return {
      markdownOption: {
        subfield: true,
        defaultOpen: 'edit',
        editable: true,
        toolbarsFlag: true,
        boxShadow: true,
      },
      form: {
        title: '',
        platform: 'ORI',
        tags: undefined,
        content: '',
        status: 0,
        info_at: '',
      },
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
      },
      createLoading: false,
      id: 0,

      statuses: [],
      tags: [],
    }
  },
  mounted() {
    const id = this.$route.query.id
    this.id = id
    this.edit(id)
    this.getStatuses()
    this.getTags()
  },
  methods: {
    async edit(id) {
      const res = await Article.edit(id)
      if (res.data.code === 0) {
        this.form = res.data.data.item
      }
    },
    async update() {
      const res = await Article.update(this.id, this.form)
      if (res.data.code === 0) {
        this.$message.success('更新成功')
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
