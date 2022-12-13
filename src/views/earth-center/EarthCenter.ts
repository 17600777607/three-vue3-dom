import {
  AmbientLight,
  CircleGeometry,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Spherical,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  DoubleSide,
  FileLoader,
  Sprite,
  SpriteMaterial,
  Texture,
  Vector2,
  Group
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export interface GeoJsonType {
  type: string
  features: [
    {
      type: string
      properties: {
        adcode: number
        name: string
        center: Array<number>
        centroid: Array<number>
        childrenNum: number
        level: 'province'
        subFeatureIndex: number
        acroutes: Array<number>
        parent: {
          adcode: number
        }
      }
    }
  ]
}

export class EarthCenter {
  public radius: number // 地球半径
  public renderer: WebGLRenderer | any
  public dom = {
    examples: undefined as any,
    width: 0,
    height: 0
  }
  public camera: PerspectiveCamera | any
  public scene: Scene | any
  public controls: OrbitControls | any
  public cameraFov: number
  public cameraNear: number
  public cameraFar: number
  public group: Group | any

  constructor(dom: string) {
    this.radius = 100
    this.dom.examples = document.getElementById(dom)
    this.dom.width = this.dom.examples.clientWidth
    this.dom.height = this.dom.examples.clientHeight
    this.cameraFov = 40
    this.cameraNear = 1
    this.cameraFar = 1000
  }
  initPlane = async () => {
    console.log('Plane类--初始化方法')
    this.initRenderer()
    this.initCamera()
    this.initScene()
    this.initControls()
    this.initLight()
    this.animate()
    this.createEarth()
    await this.createAreaPoint()
    window.addEventListener('resize', this.onWindowResize, false)
    // this.initCenter()
  }
  // initCenter = () => {
  //   console.log('旋转屏幕中心点')
  //   console.log(this.scene)
  // }
  // 世界坐标转屏幕坐标
  coordinateWorldTurnScreen = (x: number, y: number, z: number) => {
    const world_vector = new Vector3(x, y, z)
    const vector = world_vector.project(this.camera)
    const halfWidth = this.dom.width / 2
    const halfHeight = this.dom.height / 2
    return {
      x: Math.round(vector.x * halfWidth + halfWidth),
      y: Math.round(-vector.y * halfHeight + halfHeight)
    }
  }

  // 创建地球 半径100
  createEarth = () => {
    console.log('地球模型--纹理')
    const earthGeo = new SphereGeometry(this.radius, 50, 50)
    const earthMater = new MeshPhongMaterial({
      map: new TextureLoader().load('/earth/textures/earth.jpg'),
      // transparent: false,
      depthWrite: true,
      // side: DoubleSide,
      // blending: AdditiveBlending,
      opacity: 1
      // color: 0x03d98e
    })
    const earthMesh = new Mesh(earthGeo, earthMater)
    this.scene.add(earthMesh)
  }
  createAreaPoint = async () => {
    // 球面
    const sphereGeom = new SphereGeometry(1, 40, 20),
      sphereMat = new MeshBasicMaterial({
        color: 0x03d98e,
        wireframe: true
      })
    const sphere = new Mesh(sphereGeom, sphereMat)
    this.scene.add(sphere)

    const geoJsonData: GeoJsonType = (await this.loadMapData(
      '/china/json/china.json'
    )) as GeoJsonType

    geoJsonData.features.forEach((d) => {
      if (d.properties.center) {
        const position = this.createPosition(d.properties.center)
        if (d.properties.name === '北京市') {
          this.camera.position.set(position.x * 3, position.y * 3, position.z * 3) // 设置相机位置到北京市
        }
        this.createHexagon(position, d.properties.name) // 地标
      }
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

  // 坐标转换，
  createPosition = (lnglat: Array<number>) => {
    const spherical = new Spherical()
    spherical.radius = this.radius
    const lng = lnglat[0]
    const lat = lnglat[1]
    const theta = (lng + 90) * (Math.PI / 180)
    const phi = (90 - lat) * (Math.PI / 180)
    spherical.phi = phi // phi是方位面（水平面）内的角度，范围0~360度
    spherical.theta = theta // theta是俯仰面（竖直面）内的角度，范围0~180度
    const position = new Vector3()
    position.setFromSpherical(spherical)
    return position
  }
  // 创建地标标记
  createHexagon = (position: any, name: string) => {
    const hexagon = new Object3D()
    const texture = new TextureLoader().load('/earth/textures/gradient.png')

    const hexagonLine = new CircleGeometry(0.3, 16)
    const hexagonPlane = new CircleGeometry(0.3, 16)
    // console.log(hexagonPlane)
    // const vertices = hexagonLine
    // vertices.shift() // 第一个节点是中心点
    const material = new MeshBasicMaterial({
      map: texture,
      color: 0xffd561,
      // color: 0xbe172a,
      reflectivity: 1,
      fog: true,
      side: DoubleSide,
      opacity: 0.1
    })
    const circleLine = new LineLoop(hexagonLine, material)
    const circlePlane = new Mesh(hexagonPlane, material)
    circleLine.position.copy(position)
    circlePlane.position.copy(position)
    circlePlane.lookAt(new Vector3(0, 0, 0))
    circleLine.lookAt(new Vector3(0, 0, 0))
    // const text = this.createText(val.properties.name, position)

    const text = this.makeTextSprite(name, {
      fontsize: 12,
      borderColor: { r: 255, g: 0, b: 0, a: 0.4 } /* 边框黑色 */,
      backgroundColor: { r: 255, g: 255, b: 255, a: 0.9 } /* 背景颜色 */
    })
    text.center = new Vector2(0.08, 0.79)
    text.lookAt(0, 1, 0)
    circlePlane.add(text)
    hexagon.add(circleLine)
    hexagon.add(circlePlane)
    this.scene.add(hexagon)
  }

  /* 创建字体精灵 */
  makeTextSprite = (message: any, parameters: any) => {
    /* 字体大小 */
    const fontsize = parameters.fontsize ? parameters.fontsize : 18
    /* 边框厚度 */
    const borderThickness = parameters.borderThickness ? parameters.borderThickness : 4
    /* 边框颜色 */
    const borderColor = parameters.borderColor
      ? parameters.borderColor
      : { r: 0, g: 0, b: 0, a: 1.0 }
    /* 背景颜色 */
    const backgroundColor = parameters.backgroundColor
      ? parameters.backgroundColor
      : { r: 255, g: 255, b: 255, a: 1.0 }
    /* 创建画布 */
    const canvas = document.createElement('canvas')
    const context: any = canvas.getContext('2d')
    /* 字体加粗 */
    context.font = 12 + 'px ' + 'Arial'
    /* 背景颜色 */
    context.fillStyle =
      'rgba(' +
      backgroundColor.r +
      ',' +
      backgroundColor.g +
      ',' +
      backgroundColor.b +
      ',' +
      backgroundColor.a +
      ')'

    /* 边框的颜色 */
    context.strokeStyle =
      'rgba(' +
      borderColor.r +
      ',' +
      borderColor.g +
      ',' +
      borderColor.b +
      ',' +
      borderColor.a +
      ')'
    context.lineWidth = borderThickness

    /* 字体颜色 */
    context.fillStyle = '#fff'
    context.fillText(message, borderThickness, fontsize + borderThickness)
    /* 画布内容用于纹理贴图 */
    const texture = new Texture(canvas)
    texture.needsUpdate = true
    const spriteMaterial = new SpriteMaterial({ map: texture })
    const sprite = new Sprite(spriteMaterial)
    // console.log(sprite.spriteMaterial);
    /* 缩放比例 */
    sprite.scale.set(8, 8, 1)
    return sprite
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
    // document.addEventListener('mousewheel', this.handleMousewheel, false)
  }
  handleMousewheel = (e: any) => {
    console.log('111111', e.wheelDelta)
    // e.preventDefault()
    //e.stopPropagation();
    // if (e.wheelDelta) {
    //   //判断浏览器IE，谷歌滑轮事件
    //   if (e.wheelDelta > 0) {
    //     //当滑轮向上滚动时
    //     this.cameraFov -= this.cameraNear < this.cameraFov ? 1 : 0
    //   }
    //   if (e.wheelDelta < 0) {
    //     //当滑轮向下滚动时
    //     this.cameraFov += this.cameraFov < this.cameraFov ? 1 : 0
    //   }
    // } else if (e.detail) {
    //   //Firefox滑轮事件
    //   if (e.detail > 0) {
    //     //当滑轮向上滚动时
    //     this.cameraFov -= 1
    //   }
    //   if (e.detail < 0) {
    //     //当滑轮向下滚动时
    //     this.cameraFov += 1
    //   }
    // }
    this.camera.fov = this.cameraFov
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * @description 初始化相机
   */
  initCamera = () => {
    console.log('Plane类--初始化相机')
    this.camera = new PerspectiveCamera(
      this.cameraFov,
      this.dom.width / this.dom.height,
      this.cameraNear,
      this.cameraFar
    )
    this.camera.position.set(0, -220, 200)
    // this.camera.position.set(-102.34414702722688, 192.4549288923726, -206.12320566666222)
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
    //缩放限制
    this.controls.minDistance = 150
    this.controls.maxDistance = 300
    this.controls.zoomSpeed = 1.0
    //是否使用键盘
    this.controls.enableKeys = false

    this.controls.autoRotate = false
    this.controls.rotateSpeed = 1.0
    this.controls.autoRotateSpeed = 2
    this.controls.enablePan = true

    // this.controls.position = position
    this.controls.addEventListener(
      'change',
      () => {
        console.log('监听到控件发生了变化', this.controls)
      },
      false
    )
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
}
