<template>
  <div class="hx-form-container">
    <div class="hx-login-template-form">
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
          'userName',
          { rules: [{ required: true, message: 'Please input your username!' }] }
        ]"
            placeholder="Username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] }
        ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">Log in</a-button>Or
          <a @click="linkToRegisterPage">register now!</a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      listParams: {
        phoneNumber: "",
        password: ""
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          axios({
            method: "POST",
            url: "/api/user/login",
            data: {
              phoneNumber: values.userName,
              password: values.password
            }
          }).then(res => {
            let resData = res.data;
            if (resData.apiStatus === 0 && resData.sysStatus === 0) {
              this.$router.push({
                name: "index"
              });
            } else {
              this.$message.warning(resData.info);
            }
          });
        }
      });
    },
    linkToRegisterPage() {
      this.$router.push({
        name: "register"
      });
    }
  }
};
</script>

<style scoped lang="less">
.hx-login-template-form {
  width: 50%;
  margin: 200px auto;
  border: 1px solid #ebedf0;
  padding: 42px 24px 50px;
  color: rgba(0, 0, 0, 0.65);
}
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>