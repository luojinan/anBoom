<script lang="ts" setup>
import Tab from './components/Tabs/index.vue'
import Menu from './components/Menu/index.vue'
import Header from './components/Header/index.vue'

</script>

<template>
  <el-container>
    <!-- 侧边栏 1.菜单 -->
    <el-aside width="200px">
      <Menu></Menu>
    </el-aside>

    <!-- 主区域 -->
    <el-container>
      <!-- 顶部区域 1.系统展示条 2.tab -->
      <el-header>
        <Header></Header>
        <Tab></Tab>
      </el-header>
      <!-- 主区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>