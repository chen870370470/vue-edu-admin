<template>
  <div class="course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="courseName" label="课程名称">
            <el-input v-model="form.courseName"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-select v-model="form.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
          <el-button type="primary" size="default" style="float:right;"
            @click="$router.push({name:'create-course'})">
            <i class="el-icon-plus"></i>
            添加课程
          </el-button>
        </el-form>
      </div>
      <el-table :data="courseLists" style="width: 100%;margin-bottom: 20px" v-loading="isLoading">
        <el-table-column prop="id" label="ID" width="50">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="180">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="180">
        </el-table-column>
        <el-table-column prop="sortNum" label="排序" width="180">
        </el-table-column>
        <el-table-column prop="status" label="上架状态" width="100">
          <template slot-scope="scope">
            <el-switch @change="onStateChange(scope.row)" v-model="scope.row.status"
              :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"
              :disabled="scope.row.isStatusLoading" />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="$router.push({name:'edit-course',params:{courseId:scope.row.id}})">编辑
            </el-button>
            <el-button @click="$router.push({name:'section-course',params:{courseId:scope.row.id}})">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
          total 总记录数
          page-size 每页大小
          分页组件会自动根据total和page-size计算出一共分多少页
       -->
      <el-pagination background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="form.currentPage"
        :page-sizes="[5, 10, 20]" :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :disabled="isLoading">
      </el-pagination>
    </el-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseList',
  components: {},
  data () {
    return {
      courseLists: [], // 用户列表
      form: {
        currentPage: 1, // 默认查询第1页数据
        pageSize: 10, // 每页大小
        courseName: '',
        staus: 0
      },
      totalCount: 0,
      isLoading: true, // 加载状态
      dialogVisible: false // 控制添加/编辑角色的对话框的显示和隐藏
    }
  },
  created () {
    this.loadCourseLists()
  },
  methods: {
    async loadCourseLists () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getQueryCourses(this.form)
      // eslint-disable-next-line
      data.data.records.forEach((item: any) => {
        // 给每条数据增加一个按钮状态
        item.isStatusLoading = false
      })
      this.courseLists = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },
    handleEdit () {
      console.log('object')
    },
    onSubmit () {
      this.form.currentPage = 1
      this.loadCourseLists()
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1 // 每次改变每页大小后重新查询第1页数据
      this.loadCourseLists()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.currentPage = val // 修改要查询的恶业吗
      this.loadCourseLists()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadCourseLists()
    },
    // eslint-disable-next-line
    async onStateChange(course: any) {
      // 禁用按钮
      course.isStatusLoading = true
      await changeState({
        courseId: course.id,
        status: course.status
      })
      this.$message.success(course.status === 0 ? '下架成功' : '上架成功')
      course.isStatusLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.el-select {
  width: 70%;
}
</style>
