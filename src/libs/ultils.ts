import { notification } from 'ant-design-vue'
import 'ant-design-vue/es/notification/style/css'
import { h } from 'vue'

export function msgFile(code: number, msg: String) {
  notification.success({
    message: code,
    description: h(
      // @ts-ignore
      'a',
      {
        // @ts-ignore
        href: window._env_.VITE_APP_LOGIN_URL,
        target: 'view_frame'
      },
      msg
    ),
    duration: null
  })
}
