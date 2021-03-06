/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'

interface User {
    phone:string,
    password:string
}
// eslint-disable-next-line
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果data是普通对象，则Content-Type是application/json
    // 如果data是qs.stringify(data)转化那之后的数据：key=value&key=value，则Content-Type会被设置成application/x-www-form-urlencoded
    // 如果data是FormData对象，则Content-Type会被设置成multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是application/json格式的数据
  })
}
// eslint-disable-next-line
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}
// eslint-disable-next-line
export const getUserPages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}
// eslint-disable-next-line
export const forbidUser = (userId: string | number) => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
