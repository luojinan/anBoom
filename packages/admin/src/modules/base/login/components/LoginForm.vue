<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <!-- 用户名 -->
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名：admin / user">
      </el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" placeholder="密码：123456" show-password
        autocomplete="new-password">
      </el-input>
    </el-form-item>
  </el-form>
  <!-- 按钮-重置 登录 -->
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="login" size="large" type="primary" :loading="loading">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
// import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import type { ReqLoginForm } from "../../_common/types/login";
import { useKeydown } from "@/common/js/hooks/keydown";

// TODO: 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// 登录表单数据
const loginForm = reactive<ReqLoginForm>({
  username: "",
  password: ""
});

const loading = ref<boolean>(false);
const router = useRouter();

// login
const login = async () => {
  const formEl = loginFormRef.value
  if (!formEl) return;

  const res = await formEl.validate()
  if (!res) return;

  loading.value = true;
  try {
    const requestLoginForm: ReqLoginForm = {
      username: loginForm.username,
      password: loginForm.password,
    };
    console.log('登录数据', requestLoginForm)
    ElMessage.success("登录成功！");
    router.push({ name: "home" });
  } finally {
    loading.value = false;
  }
};

// resetForm
const resetForm = () => {
  const formEl = loginFormRef.value
  if (!formEl) return;
  formEl.resetFields();
};

// setup中怎么写await 后续的操作， 都放在文件末尾？并发呢
useKeydown(["entry", "Enter", "NumpadEnter"], login);
</script>
