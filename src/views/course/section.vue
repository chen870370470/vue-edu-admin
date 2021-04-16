<template>
  <div class="course-section">
    <el-card>
      <div class="card-header" slot="header">
        {{course.courseName}}
        <el-button type="primary" @click="handleShowAddSection">
          添加阶段
        </el-button>
      </div>
      <el-tree :data="sections" :props="defaultProps" draggable>
        <div class="inner" slot-scope="{node,data}">
          <span>{{node.label}}</span>
          <!-- sction -->
          <span v-if="data.sectionName" class="actions">
            <el-button>编辑</el-button>
            <el-button type="primary">添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <!-- lession -->
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button type="success">上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>

    <!-- 添加阶段 -->
    <el-dialog title="" :visible.sync="isAddSectionShow">
      <el-form :model="section" ref="section-form" label-width="70px">
        <el-form-item label="课程名称">
          <el-input :value="course.courseName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称">
          <el-input v-model="section.sectionName"></el-input>
        </el-form-item>
        <el-form-item label="章节描述">
          <el-input v-model="section.description"></el-input>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="section.orderNum"></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="isAddSectionShow = false">取消</el-button>
        <el-button type="primary" @click="handleAddSection">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getSectionAndLesson,
  saveOrUpdateSection
} from '@/services/course-section'
import { getCourseById } from '@/services/course'
import { Form } from 'node_modules/element-ui/types'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    const section = {
      courseId: this.courseId,
      sectionName: '',
      description: '',
      orderNum: 0,
      status: 0
    }
    return {
      sections: [],
      section,
      isAddSectionShow: false,
      isAddLessonShow: false,
      course: {},
      defaultProps: {
        children: 'lessonDTOS',
        // eslint-disable-next-line
        label(data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
    this.loadCourse()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.course = data.data
    },
    async handleAddSection () {
      await saveOrUpdateSection(this.section)
      this.loadSections()
      this.isAddSectionShow = false
      ;(this.$refs['section-form'] as Form).resetFields()
      this.$message.success('操作成功')
    },

    handleShowAddSection () {
      this.section = {
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      }
      this.isAddSectionShow = true
    }
  }
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.inner {
  padding: 10px;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
