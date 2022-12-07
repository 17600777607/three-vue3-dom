export const layoutYRoute = [
  {
    path: '/',
    name: 'LayoutY',
    component: () => import('~/views/y-layout/index.vue'),
    children: [
      {
        path: '/starry-sky',
        name: 'StarrySky',
        component: () => import('~/views/starry-sky/index.vue'),
        meta: { title: '星空', icon: 'iconfont icon-ptmdaohang1' }
      },
      {
        path: '/world',
        name: 'World',
        component: () => import('~/views/world/index.vue'),
        meta: { title: '地球', icon: 'iconfont icon-ptmdaohang1' }
      },
      {
        path: '/province-border',
        name: 'ProvinceBorder',
        component: () => import('~/views/province-border/index.vue'),
        meta: { title: '边界', icon: 'iconfont icon-ptmdaohang1' }
      },
      {
        path: '/center-point',
        name: 'CenterPoint',
        component: () => import('~/views/center-point/index.vue'),
        meta: { title: '中心点绘制', icon: 'iconfont icon-ptmdaohang1' }
      },
      {
        path: '/text',
        name: 'Text',
        component: () => import('~/views/text/index.vue'),
        meta: { title: '文字绘制', icon: 'iconfont icon-ptmdaohang1' }
      }
    ]
  }
]
export const layoutXRoute = []
const routes = [...layoutYRoute, ...layoutXRoute]
export default routes
