/**
 * 课程章节内容相关请求模块
 */
/* eslint-disable */
import request from "@/utils/request";

export const getSectionAndLesson = (courseId: string | number) => {
  return request({
    method: "GET",
    url: "/boss/course/section/getSectionAndLesson",
    params:{
      courseId
    }
  });
};
export const saveOrUpdateSection = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/section/saveOrUpdateSection",
    data
  });
};
