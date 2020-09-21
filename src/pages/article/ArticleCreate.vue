<template>
  <a-card>
    <a-form-model :model="form" layout="vertical" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="标题">
        <a-input v-model="form.title"></a-input>
      </a-form-item>
      <a-form-item label="内容">
        <mavon-editor v-model="form.content" v-bind="markdownOpption" style="height: 100%" />
      </a-form-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="create">
          创建
        </a-button>
        <a-button style="margin-left: 10px;">
          取消
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import {Article} from '@/services'

export default {
  name: "Add",
  components: {
    mavonEditor,
  },
  data() {
    return {
      markdownOpption: {
        subfield: false,
        defaultOpen: 'edit',
        editable: true,
      },
      form: {
        title: '',
        content: '',
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      createLoding: false,
    }
  },
  methods: {
    async create() {
      this.createLoding = true;
      const res = await Article.create(this.form);
      this.createLoding = false;
      if(res.data.code === 0){
        this.$message.success('添加成功');
      } else {
        this.$message.error(res.data.msg);
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
  .operator {
    margin-bottom: 15px;
  }
</style>
