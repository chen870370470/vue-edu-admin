<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseUpload } from '@/services/course'
export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  //   组件已经渲染好，可以初始化操作DOM了
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      // eslint-disable-next-line
      const editor = new E(this.$refs.editor as any)
      // 注意：事件监听必须在create之前
      editor.config.onchange = (newHtml: string) => {
        this.$emit('input', newHtml)
      }
      editor.config.customUploadImg = async function (
        // eslint-disable-next-line
        resultFiles: any,
        // eslint-disable-next-line
        insertImgFn: any
      ) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseUpload(fd)
        // 上传图片，返回结果，将图片插入到编辑器中
        // insertImgFn(imgUrl)
        insertImgFn(data.data.name)
      }
      editor.create()
      // 注意：设置初始值必须在create之后
      editor.txt.html(this.value)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
