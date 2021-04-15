<template>
  <div class="course-section">内容管理</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
