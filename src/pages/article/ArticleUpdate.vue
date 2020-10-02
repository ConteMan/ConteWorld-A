<template>
  <a-card>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="标题">
        <a-input v-model="form.title"></a-input>
      </a-form-model-item>
      <a-form-item label="内容">
        <mavon-editor v-model="form.content" v-bind="markdownOption" style="height: 100%" />
      </a-form-item>
      <a-form-model-item label="状态">
        <a-select :value="form.status" @change="statusChange">
          <a-select-option v-for="item in statuses" :value="item.id" :key="item.id">{{ item.str }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-button type="primary" @click="update">
            更新
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
import {Article} from '@/services'

export default {
  name: "ArticleUpdate",
  components: {
    mavonEditor,
  },
  data() {
    return {
      markdownOption: {
        subfield: false,
        defaultOpen: 'edit',
        editable: true,
      },
      form: {
        title: '',
        content: '',
        status: 0,
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      createLoading: false,
      id: 0,

      statuses: [],
    }
  },
  methods: {
    async create() {
      this.createLoading = true;
      const res = await Article.create(this.form);
      this.createLoading = false;
      if(res.data.code === 0){
        this.$message.success('添加成功');
      } else {
        this.$message.error(res.data.msg);
      }
    },
    async edit(id) {
      const res = await Article.edit(id);
      if(res.data.code === 0){
        this.form = res.data.data.res
      }
    },
    async update() {
      const res = await Article.update(this.id, this.form);
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
      this.form.status = value;
    }
  },
  mounted() {
    const id = this.$route.query.id;
    this.id = id;
    this.edit(id);
    this.getStatuses();
  }
}
</script>

<style lang="less" scoped>
  .operator {
    margin-bottom: 15px;
  }
</style>
