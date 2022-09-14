<template>
  <el-switch
    v-model="isDark"
    @change="onAddDarkChange"
    inline-prompt
    active-color="#0a0a0a"
    inactive-color="#dcdfe6"
    :active-icon="Sunny"
    :inactive-icon="Moon"
  />
</template>

<script setup lang="ts" name="switchDark">
import { onMounted, ref } from "vue";
import { Sunny, Moon } from "@element-plus/icons-vue";

let isDark = ref<boolean>(false);

onMounted(() => {
  //获取缓存中的主题配置
  isDark.value = JSON.parse(localStorage.getItem("THEME_IS_DARK") || "false");
});

const onAddDarkChange = () => {
  localStorage.setItem("THEME_IS_DARK", JSON.stringify(isDark.value));
};
</script>
