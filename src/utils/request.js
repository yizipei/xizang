import axios from 'axios'
import store from '@/store'
import configs from '@/config/constant'
import qs from 'querystring'
import { Toast } from 'vant'

function startLoading() { // 使用Element loading-start 方法
  Toast.loading({
    mask: true,
    duration: 0,
    message: '加载中...'
  })
}
function endLoading() { // 使用Element loading-close 方法
  Toast.clear()
}

let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

service.interceptors.request.use(
  config => {
    let token = store.state.user.token
    let merchantId = store.state.user.merchantId
    if (token) {
      config.headers.Authorization = token
      config.headers.merchantId = merchantId
    }
    showFullScreenLoading()
    return config
  },
  error => {
    tryHideFullScreenLoading()
    console.log('request error:' + error)
    return Promise.reject(error.message)
  },
)

// Add a response interceptor
service.interceptors.response.use(
  res => {
    tryHideFullScreenLoading()

    let data = res.data

    // 402 header 里面没有商户id 选择商户
    // 直接跳登录 403 token 失效 407 用户已登录，但是身份不匹配,跳转至首页
    if (data.status === 403 || data.status === 407) {
      const url = store.state.user.rightUrl
      store.commit('user/reset')
      location.replace(url)
      return data
    }
    if (data.status !== 200) {
      return Promise.reject(data.error)
    }
    if (data) {
      return data
    }
    return res
  },
  function (error) {
    tryHideFullScreenLoading()
    console.log('response error:' + error)
    const msg = error.response ? error.response.status + error.response.statusText : error.message
    return Promise.reject(msg)
  },
)

let request = {}
request.install = function (Vue) {
  Vue.prototype.$get = service.get
  Vue.prototype.$post = service.post
}
request.get = service.get
request.post = service.post

export function gotoAuth () {
  let path = qs.parse(location.search.replace('?', ''))
  let newPath = {}
  // 过滤掉search中的code
  Object.keys(path).forEach(item => {
    if (item === 'code') {
      return true
    }
    newPath[item] = path[item]
  })
  let tempPath = qs.stringify(newPath)
  if (tempPath) {
    tempPath = '?' + tempPath
  }
  // const callbackUrl = encodeURIComponent(`${window.location.protocol}//${window.location.host}/${tempPath}${location.hash}`)
  const callbackUrl = encodeURIComponent(window.location.href)

  location.replace(`${window.location.protocol}${process.env.VUE_APP_URL}/customer/oauth/login?configIdChoose=23&merchantId=${configs.merchantId}&callbackUrl=${callbackUrl}`)
}

export default request
