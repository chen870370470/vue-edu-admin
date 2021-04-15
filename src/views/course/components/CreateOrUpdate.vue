<template>
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
    <el-form label-width="80px">
      <div v-show="activeStep === 0">
        <el-form-item label="课程名称">
          <el-input v-model="courseForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="courseForm.brief"> </el-input>
        </el-form-item>
        <el-form-item label="课程概述">
          <el-input style="marigin-bottom: 10px" type="textarea" placeholder="概述1"
            v-model="courseForm.previewFirstField">
          </el-input>
          <el-input type="textarea" placeholder="概述2" v-model="courseForm.previewSecondField">
          </el-input>
        </el-form-item>
        <el-form-item label="讲师姓名">
          <el-input v-model="courseForm.teacherDTO.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="courseForm.teacherDTO.description"></el-input>
        </el-form-item>
        <el-form-item label="课程排序" size="normal">
          <el-input-number :min="1" label="描述文字" v-model="courseForm.sortNum">
          </el-input-number>
        </el-form-item>
      </div>
      <div v-show="activeStep === 1">
        <el-form-item label="课程封面" size="normal">
          <!-- upload 上传文件组件，它支持自动上传，你只需要把上传需要参数配置一下就可以了 -->
          <!-- 1.组件需要根据绑定的数据进行图片预览
                 2.组件需要把上传成功的图片地址同步到绑定的数据中
                 v-model 的本质还是父子组件通信
                  1.它会给子组件传递一个名字叫 value 的数据(props)
                  2.默认监听input事件，修改绑定的数据(自定义事件)
             -->
          <course-image :limit="5" v-model="courseForm.courseListImg" />
          <!-- <el-upload v-model="courseForm.courseListImg" class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
              :before-upload="beforeAvatarUpload" :http-request="handleUpload">
              <img v-if="courseForm.courseListImg" :src="courseForm.courseListImg" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
        </el-form-item>
        <el-form-item label="解锁封面" size="normal">
          <course-image v-model="courseForm.courseImgUrl" />
        </el-form-item>
      </div>
      <div v-show="activeStep === 2">
        <el-form-item label="售卖价格" size="normal">
          <el-input v-model="courseForm.discounts" placeholder="" size="normal">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价" size="normal">
          <el-input v-model="courseForm.price" placeholder="" size="normal">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量" size="normal">
          <el-input v-model="courseForm.sales" placeholder="" size="normal">
            <template slot="append">单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签" size="normal">
          <el-input v-model="courseForm.discountsTag" placeholder="" size="normal">
          </el-input>
        </el-form-item>

      </div>
      <div v-show="activeStep === 3">
        <el-form-item label="限时秒杀开关" size="normal">
          <el-switch v-model="courseForm.activityCourse" active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <template v-if="courseForm.activityCourse">
          <el-form-item label="开始时间" size="normal">
            <el-date-picker v-model="courseForm.activityCourseDTO.beginTime" type="date"
              placeholder="选择日期时间" value-format="yyyy-mm-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" size="normal">
            <el-date-picker v-model="courseForm.activityCourseDTO.endTime" type="date"
              placeholder="选择日期时间" value-format="yyyy-mm-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀价" size="normal">
            <el-input v-model="courseForm.activityCourseDTO.amount" placeholder="" size="normal">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存" size="normal">
            <el-input v-model="courseForm.activityCourseDTO.stock" placeholder="" size="normal">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </template>

      </div>
      <div v-show="activeStep === 4">
        <el-form-item label="课程详情" size="normal">
          <text-editor v-model="courseForm.courseDescriptionMarkDown" />
          <!-- <el-input v-model="courseForm.courseDescriptionMarkDown" type="textarea"></el-input> -->
        </el-form-item>
        <el-form-item label="是否发布" size="normal">
          <el-switch v-model="courseForm.status" :active-value="1" :inactive-value="0"
            active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :disabled="isLoadingSave">保存</el-button>
        </el-form-item>
      </div>
      <el-form-item v-if="activeStep >= 0 && activeStep < 4">
        <el-button @click="activeStep++">下一步</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'

export default Vue.extend({
  name: 'CreateOrUpdate',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      isLoadingSave: false,
      imageUrl: '', // 预览图片地址
      isSeckill: false, // 是否开启秒杀
      courseForm: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0, // 0：未发布 // 1：已发布
        sales: 0,
        activityCourse: true, // 是否开启秒杀
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.courseForm = data.data
    },
    async handleSave () {
      this.isLoadingSave = true
      const { data } = await saveOrUpdateCourse(this.courseForm)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.$router.push('/course')
      } else {
        this.$message.error('保存失败')
      }
      this.isLoadingSave = false
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
