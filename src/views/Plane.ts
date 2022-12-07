import {
  AmbientLight,
  Color,
  DirectionalLight,
  FileLoader,
  Fog,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GeoJsonType } from '~/views/center-point/PointDraw'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

export class Plane {
  public renderer: WebGLRenderer | any
  public dom = {
    examples: undefined as any,
    width: 0,
    height: 0
  }
  public camera: PerspectiveCamera | any
  public scene: Scene | any
  public controls: OrbitControls | any
  constructor(dom: string) {
    this.dom.examples = document.getElementById(dom)
    this.dom.width = this.dom.examples.clientWidth
    this.dom.height = this.dom.examples.clientHeight
  }
  init() {
    console.log('Plane类--初始化方法')
    this.initRenderer()
    this.initCamera()
    this.initScene()
    this.initControls()
    this.initLight()
    this.initControls()
    this.animate()

    window.addEventListener('resize', this.onWindowResize, false)
  }

  /**
   * 清除实例
   */
  clearListener = () => {
    // this.renderer = null
    // this.dom = {
    //   examples: undefined as any,
    //   width: 0,
    //   height: 0
    // }
    // this.camera = null
    // this.scene = null
    // this.controls = null
    window.removeEventListener('resize', this.onWindowResize)
  }
  /**
   * @description 初始化渲染容器
   */
  initRenderer = () => {
    console.log('Plane类--初始化渲染容器')
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.dom.width, this.dom.height)
    this.dom.examples.appendChild(this.renderer.domElement)
  }
  /**
   * @description 初始化相机
   */
  initCamera = () => {
    console.log('Plane类--初始化相机')
    this.camera = new PerspectiveCamera(40, this.dom.width / this.dom.height, 1, 1000)
    this.camera.position.set(0, -20, 200)
    this.camera.lookAt(0, 1, 0)
  }
  /**
   * @description 初始化场景
   */
  initScene = () => {
    console.log('Plane类--初始化场景')
    this.scene = new Scene()
    this.scene.background = new Color(0x020924)
    this.scene.fog = new Fog(0x020924, 200, 1000)
  }
  /**
   * 初始化用户交互
   **/
  initControls = () => {
    console.log('Plane类--初始化用户交互')
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enableZoom = true
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = 2
    this.controls.enablePan = true
  }
  /**
   * @description 初始化光
   */
  initLight = () => {
    console.log('Plane类--初始化光源')
    const ambientLight = new AmbientLight(0xcccccc, 1.1)
    this.scene.add(ambientLight)
    const directionalLight = new DirectionalLight(0xffffff, 0.2)
    directionalLight.position.set(1, 0.1, 0).normalize()
    const directionalLight2 = new DirectionalLight(0xff2ffff, 0.2)
    directionalLight2.position.set(1, 0.1, 0.1).normalize()
    this.scene.add(directionalLight)
    this.scene.add(directionalLight2)
    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.2)
    hemiLight.position.set(0, 1, 0)
    this.scene.add(hemiLight)
    const directionalLight3 = new DirectionalLight(0xffffff)
    directionalLight3.position.set(1, 500, -20)
    directionalLight3.castShadow = true
    directionalLight3.shadow.camera.top = 18
    directionalLight3.shadow.camera.bottom = -10
    directionalLight3.shadow.camera.left = -52
    directionalLight3.shadow.camera.right = 12
    this.scene.add(directionalLight3)
  }
  /**
   * 窗口变动
   **/
  onWindowResize = () => {
    console.log('Plane类--窗口变动')
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(innerWidth, innerHeight)
    this.renders()
  }

  /**
   * @description 渲染
   */
  renders = () => {
    // console.log('Plane类--渲染')

    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 更新
   **/
  animate = () => {
    // console.log('Plane类--更新')
    window.requestAnimationFrame(() => {
      if (this.controls) this.controls.update()
      this.renders()
      this.animate()
    })
  }

  /**
   * 加载 GeoJSON 文件
   */
  loadMapData = async (url: string) => {
    console.log('Plane类--加载 GeoJSON 文件')

    // 加载json文件
    const loader = new FileLoader()
    return new Promise((resolve) => {
      loader.load(
        url,
        (geoJson: any) => {
          console.log('GeoJSON加载成功', JSON.parse(geoJson))
          resolve(JSON.parse(geoJson) as GeoJsonType)
        },
        (request: ProgressEvent) => {
          console.log('加载进度', `${Number((request.loaded / request.total).toFixed(2)) * 100}%`)
        },
        (event: ErrorEvent) => {
          console.log('GeoJSON加载失败', event)
        }
      )
    })
  }

  /**
   * 加载 字体 文件
   */
  fontLoader = async (url: string) => {
    console.log('Plane类--加载字体文件')

    // 加载字体文件
    const loader = new FontLoader()
    return new Promise((resolve) => {
      loader.load(
        url,
        (response: any) => {
          console.log('字体文件加载成功')
          resolve(response as any)
        },
        (request: ProgressEvent) => {
          console.log('加载进度', `${Number((request.loaded / request.total).toFixed(2)) * 100}%`)
        },
        (event: ErrorEvent) => {
          console.log('字体文件加载失败', event)
        }
      )
    })
  }
}
