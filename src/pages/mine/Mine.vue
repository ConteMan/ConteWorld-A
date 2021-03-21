<template>
  <a-card class="form-container" :bordered="false">
    <a-form-model ref="form" layout="vertical" :model="form" :rules="rules">
      <a-form-model-item has-feedback label="密码" prop="pass">
        <a-input-password v-model="form.pass" placeholder="请输入密码" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="确认密码" prop="checkPass">
        <a-input-password v-model="form.checkPass" placeholder="请再次输入密码" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="changePassword">
          更新
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-card>
</template>

<script>
import { User } from '@/services';

export default {
  name: 'Mine',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'));
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== this.form.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }]
      }
    };
  },
  methods: {
    changePassword() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          User.changePassword(this.form.pass).then(
            res => this.afterChange(res)
          );
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    afterChange(res) {
      console.log(res);
      if (res.data.code === 0) {
        this.resetForm();
        this.$message.success(res.data.msg, 3);
      } else {
        this.$message.error(res.data.msg, 3);
      }
    },
    resetForm() {
      this.$refs['form'].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.form-container {
  width: 100%;
}
</style>
