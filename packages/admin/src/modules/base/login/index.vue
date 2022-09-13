<template>
  <div class="login-container flx-center">
    <!-- <SwitchDark class="dark" /> -->
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/images/login_left0.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.svg" alt="" />
          <h2 class="logo-text">Geeker-Admin</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
// import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
</script>

<style scoped>
.login-container {
  min-width: 550px;
  height: 100%;
  min-height: 500px;
  background-color: #eee;
  background-image: url(@/assets/images/login_bg.svg);
  background-position: 50%;
  background-size: 100% 100%;
  background-size: cover;
}

.login-box {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 96%;
  height: 94%;
  padding: 0 50px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

.login-box .login-left {
  width: 800px;
}

.login-box .login-left img {
  width: 100%;
  height: 100%;
}

.login-box .login-form {
  width: 420px;
  padding: 50px 40px 45px;
  border-radius: 10px;
  box-shadow: 2px 3px 7px #0003;
}

.login-box .login-form .login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 45px;
}

.login-box .login-form .login-logo .login-icon {
  width: 60px;
  height: 52px;
}

.login-box .login-form .login-logo .logo-text {
  padding: 0 0 0 25px;
  margin: 0;
  font-size: 42px;
  font-weight: 700;
  color: #34495e;
  white-space: nowrap;
}
</style>