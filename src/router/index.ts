import { createRouter, createWebHistory } from 'vue-router'
import routes from '~/router/router.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import changTitle from '~/libs/changTitle'
// 导出路由
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log(`来自页面:${from.path};将要跳转的页面：${to.path}`)
  next()
})
router.afterEach((to) => {
  if (to.meta.title) {
    changTitle(to.meta.title as string)
  }
  NProgress.done()
})

export default router
