/**
 * 课程管理相关请求模块
 */
/* eslint-disable */
import request from "@/utils/request";

export const getQueryCourses = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/getQueryCourses",
    data
  });
};
export const changeState = (params: any) => {
  return request({
    method: "GET",
    url: "/boss/course/changeState",
    params
  });
};
export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/saveOrUpdateCourse",
    data
  });
};
export const uploadCourseUpload = (data: any, onUploadProgress?: (progressEvent: ProgressEvent) => void) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交FormData 数据对象
  return request({
    method: "POST",
    url: "/boss/course/upload",
    data,
    // HTML5新增的上传响应事件: progress
    onUploadProgress
  });
};
export const getCourseById = (courseId: string | number) => {
  return request({
    method: "GET",
    url: "/boss/course/getCourseById",
    params:{
      courseId
    }
  });
};
