import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()]
    }),
    // gzip
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  //移除 console
  // esbuild: { pure: ['console.log'], minify: true },
  build: {
    // 指定输出路径，默认'html'
    outDir: 'html',
    // 指定生成静态资源的存放路径(相对于build.outDir)
    assetsDir: 'assets',
    // 小于此阈值的导入或引用资源将内联为base64编码，设置为0可禁用此项。默认4096（4kb）
    // @ts-ignore
    assetsInlineLimit: '4096',
    // 启用/禁用CSS代码拆分，如果禁用，整个项目的所有CSS将被提取到一个CSS文件中,默认true
    cssCodeSplit: true,
    // 构建后是否生成source map文件，默认false
    sourcemap: false,
    // 为true时，会生成manifest.json文件，用于后端集成
    manifest: false
  },
  css: {
    preprocessorOptions: {
      less: {
        //全局 less文件
        additionalData: '',
        //antd 主题更改
        modifyVars: {
          'primary-color': '#0087E2',
          'link-color': '#0087E2',
          'border-radius-base': '2px'
        },
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    //快捷引入
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, 'src')
      }
    ]
  },
  // 代理
  server: {
    https: false,
    host: 'my.ruijie.com.cn',
    cors: true
    // proxy: {
    //   '/scm': {
    //     target: 'http://127.0.0.1:8090',
    //     changeOrigin: false,
    //     rewrite: (path) => path.replace(/^\/scm/, '/scm'),
    //     headers: {
    //       'Access-Control-Allow-Origin': '*'
    //     }
    //   }
    // }
  }
})
