import axios, { AxiosRequestConfig } from 'axios'
import { notification } from 'ant-design-vue'
import router from '~/router'
// @ts-ignore
import { GetAuthToken } from 'rj-server-auth-token'
const Axios = axios.create()
// 取消重复的 axios 请求
const cancelToken = axios.CancelToken
const pending: Array<any> = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = (ever: AxiosRequestConfig) => {
  for (const p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) {
      //当当前请求在数组中存在时执行函数体
      pending[p].f() //执行取消操作
      pending.splice(Number(p), 1) //把这条记录从数组中移除
    }
  }
}
//删除所有的 待响应 axios 请求
export const removeAllPending = () => {
  pending.forEach((d, p) => {
    pending[p].f() //执行取消操作
    pending.splice(Number(p), 1) //把这条记录从数组中移除
  })
}

// 允许跨域请求发送cookie
Axios.defaults.withCredentials = true
Axios.defaults.timeout = 1000 * 60 * 10
Axios.defaults.headers.post['Content-Type'] = 'application/json' // application/x-www-form-urlencoded , multipart/form-data
// http请求拦截
Axios.interceptors.request.use(
  async (config) => {
    //删除重复的 axios 请求
    await removePending(config)
    config.cancelToken = await new cancelToken(async (c) => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending.push({ u: config.url + '&' + config.method, f: c })
      // console.log("请求队列", pending);
    })
    // @ts-ignore
    config.baseURL = `${window._env_.VUE_APP_REQUEST_ADDRESS}/scm/web/`

    // @ts-ignore
    config.headers['sysId'] = '78e71136595a4058a3eb264d630687eb'
    // @ts-ignore
    config.headers['web-sign-server-auth'] = GetAuthToken({
      sysId: '78e71136595a4058a3eb264d630687eb',
      accessKeySecret: '211D3C740F4A421DAF1E6158F9A1852A'
    })

    // config.baseURL = '/scm/web/'
    // @ts-ignore
    if (config.url !== '/adminUser/login' && config.url !== '/adminUser/sendMsg') {
      // @ts-ignore
      if (!sessionStorage.getItem('userAdmin')) {
        await router.replace({ path: '/login' })
      } else {
        // @ts-ignore
        config.headers['token'] = JSON.parse(sessionStorage.getItem('userAdmin')).token
      }
    }
    // console.log(config);

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// http响应拦截器
Axios.interceptors.response.use(
  async (res) => {
    await removePending(res.config)
    // console.log(`请求路径${res.config.url}`,res);
    let type = 'info'
    switch (res.data.status) {
      case '0':
        type = 'success'
        break
      case '200':
        type = 'success'
        break
      case '10003': ////单点登录错误码  登录页
        type = 'error'
        await removeAllPending()
        await router.replace({ path: '/login' })
        break
      case '10006': //无权限错误码  无权限页
        await router.replace({ path: '/401' })
        break
      default:
        type = 'error'
        break
    }
    if (res.data.status !== '200' && res.data.status !== '0') {
      // @ts-ignore
      notification[type]({
        message: res.data.status,
        description: res.data.err
      })
    }
    // 接口返回状态码拦截
    return res.data
  },
  (error) => {
    if (error.response) {
      console.log('error.response', error.response)
      notification.error({
        message: error.response.statusText
      })
    } else {
      if (error.toString().indexOf('Cancel') > -1) {
        notification.error({
          message: '不允许频繁操作'
        })
      } else {
        // 400 超时
        notification.error({
          message: error.toString()
        })
      }
    }

    return Promise.reject(error)
  }
)
export default Axios
