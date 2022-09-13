<template>
  <el-form ref="loginFormRef" :model="loginInfo" :rules="loginRules" size="large">
    <!-- 用户名 -->
    <el-form-item prop="username">
      <el-input v-model="loginInfo.username" placeholder="用户名：admin / user">
      </el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password">
      <el-input type="password" v-model="loginInfo.password" placeholder="密码：123456" show-password
        autocomplete="off">
      </el-input>
    </el-form-item>
  </el-form>
  <!-- 按钮-重置 登录 -->
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="login" size="large" type="primary" :loading="loadingState">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import type { ReqLoginForm } from "../../_common/types/login";
import { useKeydown } from "@/common/js/hooks/keydown";

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
// vue3中的dom实例$ref，在setup script里，需要用ref()返回一个与dom上的ref同名的变量
// vue3内部会知道当前这个空的响应式数据是dom实例
// 而在ts中，需要定义好这个空的响应式数据泛型 如果是组件则引用组件抛出来的type
// 由此可见，封装组件时抛出type时很有必要的，因为要让组件支持$ref的类型推导
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// 登录表单数据
const loginInfo = reactive<ReqLoginForm>({
  username: "",
  password: "",
});

const loadingState = ref<boolean>(false);
const router = useRouter();

// 校验逻辑
const checkFormData = async () => {
  // 取ref都考虑取不到的场景，如dom实例未渲染时
  const formDom = loginFormRef.value;
  if (!formDom) return;

  // 调用dom实例中的校验函数
  const res = await formDom.validate();
  return res;
};

// login
const login = async () => {
  const res = await checkFormData();
  if (!res) return;

  loadingState.value = true;
  try {
    const requestLoginForm: ReqLoginForm = {
      username: loginInfo.username,
      password: loginInfo.password,
    };
    console.log("登录数据", requestLoginForm);
    ElMessage.success("登录成功！");
    router.push({ name: "home" });
  } finally {
    loadingState.value = false;
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
