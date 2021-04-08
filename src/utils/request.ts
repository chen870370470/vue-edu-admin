import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseUrl
  // timeout
})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
function refreshToken () {
  return axios.create()({ // 这里不使用request发请求是因为为了防止刷新token也返回401造成循环刷新token
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 我们就在这里通过改写config配置信息来实现业务功能的统一处理
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 注意：这里一定要返回config，否则请求就发送不出去了
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 响应拦截器
let isRefreshing = false // 控制刷新token的状态
// eslint-disable-next-line
let requests: any[] = [] // 存储刷新token期间过来的4xx请求
request.interceptors.response.use(function (response) {
  // 当状态码为2xx都会进入到这里
  // 如果是自定义错误状态码，错误处理就写到这里
  return response
}, async function (error) {
  // 超出2xx状态码的都执行这里
  // 如果是使用的HTTP状态码，错误处理就写到这里
  if (error.response) { // 请求收到响应了，但是状态码超出了2xx范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token无效（没有提供；或者是过期的无效的）
      // 如果有refresh_token 则尝试使用refresh_token获取新的access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 刷新token
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新Token失败')
          }
          // 刷新token成功了
          store.commit('setUser', res.data.content)
          // 把requests队列中的请求重新发起
          requests.forEach(cb => cb())
          // 重置requests数组
          requests = []
          return request(error.config)
        }).catch(err => {
          console.log(err)
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })
      }
      // 刷新状态下把请求挂起到requests数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
      // 尝试刷新获取新的access_token
      // try {
      //   const { data } = await axios.create()({ // 这里不使用request发请求是因为为了防止刷新token也返回401造成循环刷新token
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   // 成功了 -> 把本次失败的请求重新发出去
      //   // 把刷新拿到的新的access_token更新到容器和本地存储中
      //   store.commit('setUser', data.content)
      //   // 把本次失败的请求重新发出去
      //   return request(error.config)
      // } catch (error) {
      //   // 把当前登录用户状态清除
      //   store.commit('setUser', null)
      //   // 失败了 -> 跳转登录页面重新登录获取新的token
      //   redirectLogin()
      //   return Promise.reject(error)
      // }
      // // 如果没有，则直接跳转登录页
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) { // 本次请求发出了，但是没有收到响应 :请求超时、网络断开...
    Message.error('请求超时，请刷新重试')
  } else { // 在设置请求时发生了一些事情，触发了一个错误
    Message.error(`请求失败:${error.message}`)
  }
  // 把请求失败的错误对象继续抛出，扔给上一个调用者
  return Promise.reject(error)
})

export default request
