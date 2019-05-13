<template>
  <div class="hx-form-container">
    <el-form class="hx-login-template-form" label-width="100px" ref="loginForm">
      <el-form-item prop="phoneNumber" label="手机号：">
        <el-input :maxlength="11" placeholder="请输入手机号" v-model.trim="listParams.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input
          @keyup.native.13="login('loginForm')"
          placeholder="请输入密码"
          v-model.trim="listParams.password"
          type="password"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listParams: {
        phoneNumber: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      this.$router.push("/index");
    }
  }
};
</script>

<style scoped lang="less">
.hx-login-template-form {
  width: 400px;
  height: 200px;
  position: absolute;
  top: 60px;
  left: 30px;
}
</style>