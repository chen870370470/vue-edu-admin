<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item prop="rangeDate" label="注册时间">
            <el-date-picker v-model="form.rangeDate" type="daterange" align="right" unlink-panels
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="userLists" style="width: 100%;margin-bottom: 20px" v-loading="isLoading">
        <el-table-column prop="id" label="用户ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="角色名" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="address" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleSelectRole(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="分配角色" :visible.sync="dialogVisible" width="30%">
        <el-select v-model="roleList" multiple placeholder="请选择">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAllRole">确定</el-button>
        </span>
      </el-dialog>
      <!--
          total 总记录数
          page-size 每页大小
          分页组件会自动根据total和page-size计算出一共分多少页
       -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="form.currentPage" :page-sizes="[5, 10, 20]" :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :disabled="isLoading">
      </el-pagination>
    </el-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages } from '@/services/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import dayjs from 'dayjs'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'UserList',
  components: {},
  data () {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            // eslint-disable-next-line
            onClick (picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            // eslint-disable-next-line
            onClick (picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            // eslint-disable-next-line
            onClick (picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      value2: '',
      userLists: [], // 用户列表
      form: {
        currentPage: 1, // 默认查询第1页数据
        pageSize: 10, // 每页大小
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      totalCount: 0,
      isLoading: true, // 加载状态
      dialogVisible: false, // 控制添加/编辑角色的对话框的显示和隐藏
      roles: [],
      roleList: [], // 选择的角色
      currentUser: null // 分配角色的当前用户
    }
  },
  created () {
    this.loadUserLists()
  },
  methods: {
    async loadUserLists () {
      this.isLoading = true // 展示加载中状态
      const { rangeDate } = this.form
      if (rangeDate && rangeDate.length) {
        this.form.startCreateTime = rangeDate[0]
        this.form.endCreateTime = rangeDate[1]
      } else {
        this.form.startCreateTime = ''
        this.form.endCreateTime = ''
      }
      const { data } = await getUserPages(this.form)
      this.userLists = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },
    handleEdit () {
      console.log('object')
    },
    onSubmit () {
      this.loadUserLists()
    },
    // eslint-disable-next-line
    dateFormat(row: any, column: any) {
      const daterc = row[column.property]
      if (daterc != null) {
        return dayjs(daterc).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    handleSizeChange (val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1 // 每次改变每页大小后重新查询第1页数据
      this.loadUserLists()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.currentPage = val // 修改要查询的恶业吗
      this.loadUserLists()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.currentPage = 1
      this.loadUserLists()
    },
    // eslint-disable-next-line
    async handleSelectRole (role: any) {
      this.currentUser = role
      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data
      // eslint-disable-next-line
      const {
        data: { data: userRoles }
        // eslint-disable-next-line
      } = await getUserRoles((this.currentUser as any).id)
      // eslint-disable-next-line
      this.roleList = userRoles.map((item: any) => item.id)
      // 展示对话框
      this.dialogVisible = true
    },
    async handleAllRole () {
      await allocateUserRoles({
        // eslint-disable-next-line
        userId: (this.currentUser as any).id,
        roleList: this.roleList
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
    }
  }
})
</script>

<style lang="scss" scoped>
.el-select {
  width: 70%;
}
</style>
