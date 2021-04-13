<template>
  <!-- TODO: -->
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page.sync="form.currentPage" :page-sizes="[5, 10, 20]" :page-size="form.pageSize"
    layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :disabled="isLoading">
  </el-pagination>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Pagination'
})
</script>

<style lang="scss" scoped>
</style>
