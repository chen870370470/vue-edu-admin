<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>

      <el-table :data="roles" style="width: 100%;" v-loading="isLoading">
        <el-table-column type="index" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="createdTime" label="添加时间" width="180" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text"
              @click="$router.push({name:'alloc-menu',params:{roleId:scope.row.id}})">分配菜单
            </el-button>
            <el-button size="mini" type="text">分配资源</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
          total 总记录数
          page-size 每页大小
          分页组件会自动根据total和page-size计算出一共分多少页
       -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="form.current" :page-sizes="[5, 10, 20]" :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :disabled="isLoading">
      </el-pagination>
    </el-card>
    <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogVisible" width="30%">
      <CreateOrEdit v-if="dialogVisible" @success="onSuccess" @cancel="dialogVisible =false"
        :role-id="roleId" :isEdit="isEdit" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles, deleteRole } from '@/services/role'
import dayjs from 'dayjs'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [], // 角色列表
      form: {
        current: 1, // 默认查询第1页数据
        size: 10, // 每页大小
        name: ''
      },
      totalCount: 0,
      isLoading: true, // 加载状态
      dialogVisible: false, // 控制添加/编辑角色的对话框的显示和隐藏
      roleId: null,
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },
    // eslint-disable-next-line
    handleEdit(role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },
    // eslint-disable-next-line
    async handleDelete(role: any) {
      try {
        await this.$confirm(`确认删除角色：${role.name}?`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (error) {
        if (error && error.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },
    onSubmit () {
      this.loadRoles()
    },
    // eslint-disable-next-line
    dateFormat(row: any, column: any) {
      const daterc = row[column.property]
      if (daterc != null) {
        return dayjs(daterc).format('YYYY-MM-DD hh:mm:ss')
      }
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每次改变每页大小后重新查询第1页数据
      this.loadRoles()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的恶业吗
      this.loadRoles()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadRoles()
    },
    onSuccess () {
      this.dialogVisible = false // 关闭对话框
      this.loadRoles() // 重新加载数据列表
    },
    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
