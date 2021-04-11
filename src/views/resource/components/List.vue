<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="form" :model="form" class="demo-form-inline">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select v-model="form.categoryId" clearable placeholder="请选择资源分类">
              <el-option :label="item.name" :value="item.id" v-for="item in resourcecategories"
                :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="resources" style="width: 100%; margin-bottom: 20px" v-loading="isLoading">
        <el-table-column type="index" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="资源名称" width="180">
        </el-table-column>
        <el-table-column prop="url" label="资源路径" width="180">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="createdTime" label="添加时间" width="180" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import dayjs from 'dayjs'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [], // 资源列表
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 10, // 每页大小
        categoryId: null
      },
      totalCount: 0, // 数据总数量
      resourcecategories: [], // 资源分类列表
      isLoading: true // 加载状态
    }
  },
  created () {
    this.loadResource()
    this.loadResourceCategories()
  },
  methods: {
    onSubmit () {
      this.form.current = 1 // 筛选查询从第1页开始
      this.loadResource()
    },
    async loadResource () {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourcecategories = data.data
    },
    handleEdit () {
      console.log('handleEdit')
    },
    handleDelete () {
      console.log('handleDelete')
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
      this.loadResource()
    },
    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的恶业吗
      this.loadResource()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResource()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
