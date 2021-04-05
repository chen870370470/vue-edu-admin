<template>
  <div id="app">
    <!-- 根路由出口 -->
    <router-view />
  </div>
</template>
<script lang="ts">
// 1.编辑器给的类型提示
// 2.TypeScript编译期间的类型验证
import Vue from 'vue'

export default Vue.extend({
  name: 'App'
})
</script>
<style lang="scss" scope>

</style>
