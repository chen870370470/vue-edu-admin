<template>
  <div class="create-course">
    <el-card>
      <div slot="header">
        <!-- card header -->
        <el-steps :active="activeStep" simple>
          <el-step @click.native="activeStep = index" v-for="(item,index) in steps" :key="index"
            :title="item.title" :icon="item.icon">
          </el-step>
          <!-- <el-step title="课程封面" icon="el-icon-upload"></el-step>
          <el-step title="销售信息" icon="el-icon-picture"></el-step>
          <el-step title="秒杀活动" icon="el-icon-picture"></el-step>
          <el-step title="课程详情" icon="el-icon-picture"></el-step> -->
        </el-steps>
      </div>
      <!-- card body -->
      <el-form>
        <div v-show="activeStep === 0">
          基本信息
        </div>
        <div v-show="activeStep === 1">
          课程封面
        </div>
        <div v-show="activeStep === 2">
          销售信息
        </div>
        <div v-show="activeStep === 3">
          秒杀活动
        </div>
        <div v-show="activeStep === 4">
          课程详情
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep >= 0 && activeStep < 4">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CreateCourse',
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
