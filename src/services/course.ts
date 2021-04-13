/**
 * 课程管理相关请求模块
 */
/* eslint-disable */
import request from '@/utils/request'

export const getQueryCourses = (data: any) => {
    return request({
      method: 'POST',
      url: '/boss/course/getQueryCourses',
      data
    })
}
export const changeState = (params: any) => {
    return request({
      method: 'GET',
      url: '/boss/course/changeState',
      params
    })
}
