export default function (title: string) {
  if (title) {
    document.title = 'PTM-' + title
    // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe')
      hackIframe.style.display = 'none'
      document.body.appendChild(hackIframe)
      setTimeout(() => {
        document.body.removeChild(hackIframe)
      }, 300)
    }
  }
}
