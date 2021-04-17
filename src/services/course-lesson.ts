/**
 * 课程课时内容相关请求模块
 */
/* eslint-disable */
import request from "@/utils/request";

export const saveOrUpdateLesson = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/lesson/saveOrUpdate",
    data
  });
};


