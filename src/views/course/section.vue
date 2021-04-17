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
            <el-button @click.stop="handleEditSectionShow(data)">编辑</el-button>
            <el-button type="primary" @click.stop="handleShowAddLesson(data)">添加课时</el-button>
            <el-select class="select-status" v-model="data.status" placeholder="请选择"
              @change="handleSectionStatusChange(data)">
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
          <!-- lesson -->
          <span v-else class="actions">
            <el-button @click.stop="handleEditLessonShow(data,node.parent.data)">编辑</el-button>
            <el-button type="success">上传视频</el-button>
            <el-select class="select-status" v-model="data.status" placeholder="请选择"
              @change="handleLessonStatusChange(data)">
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
        </div>
      </el-tree>
    </el-card>

    <!-- 添加阶段 -->
    <el-dialog title="添加阶段" :visible.sync="isAddSectionShow">
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

    <!-- 添加课时 -->
    <el-dialog title="添加课时" :visible.sync="isAddLessonShow">
      <el-form :model="lesson" ref="lesson-form" label-width="70px">
        <el-form-item label="课程名称">
          <el-input :value="course.courseName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称">
          <el-input v-model="lesson.sectionName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="lesson.theme"></el-input>
        </el-form-item>
        <el-form-item label="时长">
          <el-input v-model="lesson.duration">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听">
          <el-switch v-model="lesson.isFree"></el-switch>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number v-model="lesson.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isAddLessonShow = false">取消</el-button>
        <el-button type="primary" @click="handleAddLesson">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getSectionAndLesson,
  saveOrUpdateSection,
  getBySectionId
} from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'
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
    const lesson = {
      courseId: this.courseId,
      sectionId: undefined,
      sectionName: '',
      theme: '',
      duration: 0,
      isFree: false,
      orderNum: 0,
      status: 0
    }
    return {
      sections: [],
      section,
      isAddSectionShow: false,
      isAddLessonShow: false,
      lesson,
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
    async handleAddLesson () {
      const { data } = await saveOrUpdateLesson(this.lesson)
      console.log(data)
      this.loadSections()
      this.isAddLessonShow = false
      this.$message.success('操作成功')
    },
    // eslint-disable-next-line
    async handleEditSectionShow(section: any) {
      try {
        const { data } = await getBySectionId(section.id)
        this.section = data.data
        this.isAddSectionShow = true
      } catch (error) {
        console.log(error.message)
      }
    },
    // eslint-disable-next-line
    async handleSectionStatusChange (section: any) {
      await saveOrUpdateSection(section)
      this.$message.success('操作成功')
    },
    // eslint-disable-next-line
    async handleLessonStatusChange (lesson: any) {
      await saveOrUpdateLesson(lesson)
      this.$message.success('操作成功')
    },
    // eslint-disable-next-line
    handleShowAddLesson(data: any) {
      this.lesson = {
        sectionName: data.sectionName,
        sectionId: data.id,
        courseId: this.courseId,
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      }
      this.isAddLessonShow = true
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
    },
    // eslint-disable-next-line
    handleEditLessonShow(lesson: any, section: any) {
      this.lesson = lesson
      this.lesson.sectionName = section.sectionName
      this.isAddLessonShow = true
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
.select-status {
  max-width: 100px;
  margin-left: 8px;
}
</style>
