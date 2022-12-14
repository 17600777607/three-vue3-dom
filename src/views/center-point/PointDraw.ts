import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  TextureLoader,
  Vector3,
  MathUtils,
  Group,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Fog,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  FileLoader
} from 'three'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
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
        level: number
        subFeatureIndex: number
        acroutes: Array<number>
        parent: {
          adcode: number
        }
      }
      geometry: {
        type: string
        // coordinates: [[[[117.210024, 40.082262]]]]
        coordinates: Array<Array<Array<Array<number>>>>
      }
    }
  ]
}
export interface TextObjType {
  name: string
  position: Array<number>
}
let textListData: Array<TextObjType> = []

export class PointDraw {
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

  private CSSRender: CSS2DRenderer | any
  private CSSContainer: HTMLElement | any

  public textDom = {
    examples: undefined as any,
    width: 0,
    height: 0
  }
  initPointDraw = async () => {
    await this.initRenderer()
    await this.initCamera()
    await this.initScene()
    await this.initControls()
    await this.initLight()
    await this.drawPoint()
    await this.drawText('text')
    await this.animate()
    window.addEventListener('resize', this.onWindowResize, false)
  }

  /**
   * @description ?????????????????????
   */
  initRenderer = () => {
    console.log('PointDraw???----?????????????????????')
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.dom.width, this.dom.height)
    this.dom.examples.appendChild(this.renderer.domElement)
  }
  /**
   * ????????????
   */
  initGeometry = () => {
    console.log('?????????????????????')
    const texture = new TextureLoader().load('/earth/textures/gradient.png')
    const positions: any = []
    const colors: any = []
    const geometry = new BufferGeometry()
    for (let i = 0; i < 10000; i++) {
      const vertex = new Vector3()
      vertex.x = Math.random() * 2 - 1
      vertex.y = Math.random() * 2 - 1
      vertex.z = Math.random() * 2 - 1
      positions.push(vertex.x, vertex.y, vertex.z)
      const color = new Color()
      color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55)
      colors.push(color.r, color.g, color.b)
    }
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    const starsMaterial = new PointsMaterial({
      map: texture,
      size: 1,
      transparent: true,
      opacity: 1,
      vertexColors: true, //true?????????????????????colors???????????????????????????????????????????????????--color???????????????????????????colors???????????????
      sizeAttenuation: true
    })

    const stars = new Points(geometry, starsMaterial)
    stars.scale.set(300, 300, 300)
    this.scene.add(stars)
  }
  /**
   * @description ???????????????
   */
  initCamera = () => {
    console.log('PointDraw???----???????????????')
    this.camera = new PerspectiveCamera(40, this.dom.width / this.dom.height, 1, 1000)
    this.camera.position.set(0, -20, 200)
    this.camera.lookAt(0, 1, 0)
  }
  /**
   * @description ???????????????
   */
  initScene = () => {
    console.log('PointDraw???----???????????????')
    this.scene = new Scene()
    this.scene.background = new Color(0x020924)
    this.scene.fog = new Fog(0x020924, 200, 1000)
  }
  /**
   * ?????????????????????
   **/
  initControls = () => {
    console.log('PointDraw???----?????????????????????')
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enableZoom = true
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = 2
    this.controls.enablePan = true
  }
  /**
   * @description ????????????
   */
  initLight = () => {
    console.log('PointDraw???--???????????????')
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
   * ????????????
   **/
  onWindowResize = () => {
    console.log('PointDraw???----????????????')
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(innerWidth, innerHeight)
    this.renders()
  }

  /**
   * @description ??????
   */
  renders = () => {
    // console.log('Plane???--??????')

    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * ??????
   **/
  animate = () => {
    // console.log('Plane???--??????')
    window.requestAnimationFrame(() => {
      if (this.controls) this.controls.update()
      this.CSSRender.render(this.scene, this.camera)
      this.renders()
      this.animate()
    })
  }
  /**
   * ????????????
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
   * ?????????
   */
  drawPoint = async () => {
    console.log('PointDraw???--???????????????')
    // ?????????
    const texture = new TextureLoader().load('/earth/textures/gradient.png')

    // ?????????
    const positions: Array<number> = []
    // ?????????
    const colors: any = []
    const geometry = new BufferGeometry()

    const geoJsonData: GeoJsonType = (await this.loadMapData(
      '/china/json/china.json'
    )) as GeoJsonType
    const radius = 1
    textListData = [] as Array<TextObjType>
    geoJsonData.features.forEach((d) => {
      if (d.properties.center) {
        const centerList: Array<number> = d.properties.center
        //???????????????
        const lg = MathUtils.degToRad(centerList[0])
        const lt = MathUtils.degToRad(centerList[1])
        const temp = radius * Math.cos(lt)
        const vertex = new Vector3()
        vertex.x = temp * Math.sin(lg)
        vertex.y = radius * Math.sin(lt)
        vertex.z = temp * Math.cos(lg)
        positions.push(vertex.x, vertex.y, vertex.z)
        const color = new Color()
        color.set('red')
        colors.push(color.r, color.g, color.b)
        textListData.push({
          name: d.properties.name,
          position: [centerList[0], centerList[1]]
        })
      }
    })

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    const starsMaterial = new PointsMaterial({
      map: texture,
      size: 2,
      transparent: true,
      opacity: 1,
      vertexColors: true,
      sizeAttenuation: true
    })

    //?????????
    const stars = new Points(geometry, starsMaterial)
    stars.scale.set(-40, 40, 10)
    this.scene.add(stars)
  }
  /**
   * ?????? GeoJSON ??????
   */
  loadMapData = async (url: string) => {
    console.log('Plane???--?????? GeoJSON ??????')

    // ??????json??????
    const loader = new FileLoader()
    return new Promise((resolve) => {
      loader.load(
        url,
        (geoJson: any) => {
          console.log('GeoJSON????????????', JSON.parse(geoJson))
          resolve(JSON.parse(geoJson) as GeoJsonType)
        },
        (request: ProgressEvent) => {
          console.log('????????????', `${Number((request.loaded / request.total).toFixed(2)) * 100}%`)
        },
        (event: ErrorEvent) => {
          console.log('GeoJSON????????????', event)
        }
      )
    })
  }

  /**
   * ??????
   * @param dom
   */
  drawText = async (dom: string) => {
    console.log('PointDraw???--??????????????????')
    this.initCSSRender(dom)
    this.CSSRender.render(this.scene, this.camera)
    this.controls = new OrbitControls(this.camera, this.CSSRender.domElement)
  }
  /**
   * ????????????????????? CSS2DRenderer
   */
  initCSSRender(dom: string) {
    console.log('PointDraw???--????????????????????? CSS2DRenderer')
    this.CSSRender = new CSS2DRenderer()
    this.textDom.width = this.dom.examples.clientWidth
    this.textDom.height = this.dom.examples.clientHeight
    this.CSSRender.setSize(this.textDom.width, this.textDom.height)
    // //??????.pointerEvents=none?????????????????????HTML????????????????????????????????????
    // this.CSSRender.domElement.style.pointerEvents = 'none'
    this.CSSRender.domElement.style.position = 'absolute'
    this.CSSRender.domElement.style.top = '0'
    this.CSSContainer = document.getElementById(dom)
    this.CSSContainer.appendChild(this.CSSRender.domElement)
    const textGroup = new Group()
    textListData.forEach((d: TextObjType) => {
      textGroup.add(this.create2DObject(d))
    })
    this.scene.add(textGroup)
  }

  /**
   * ?????? CSS2DObject  dom
   * @param text
   */
  create2DObject(val: TextObjType) {
    console.log('PointDraw???--?????? CSS2DObject  dom')
    const div = document.createElement('div')
    /*????????????????????????????????????*/
    // div.style.background = 'rgba(10,18,51,0.8)'
    div.style.color = '#fff'
    // div.style.border = '1px solid #fff'
    // div.style.borderRadius = '6px'
    div.style.padding = '4px'
    div.style.fontSize = '12px'
    div.style.zIndex = '10000'
    div.style.cursor = 'pointer'
    div.textContent = val.name
    div.style.top = `${val.position[0] / 2}px`
    div.style.left = `${val.position[1] / 2}px`
    div.className = 'label'
    const label = new CSS2DObject(div)
    label.position.set(val.position[0] + 1, val.position[1] + 1, val.position[2])
    label.element.addEventListener('click', () => {
      console.log('??????', val)
    })
    return label
  }
  // ???????????????????????????
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
}
