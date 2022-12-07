<template>
  <div id="three"></div>
</template>
<script lang="ts" setup>
  import { onMounted, onUnmounted, reactive } from 'vue'
  import {
    AmbientLight,
    BufferGeometry,
    Color,
    DirectionalLight,
    Float32BufferAttribute,
    Fog,
    Group,
    HemisphereLight,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    PerspectiveCamera,
    Points,
    PointsMaterial,
    Scene,
    SphereGeometry,
    Spherical,
    Sprite,
    SpriteMaterial,
    TextureLoader,
    Vector3,
    WebGLRenderer
  } from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

  let scene = null as any //场景
  let stars = null as any //星空背景stars
  let example = new Object3D() //地球模型
  let group = new Group() // 模型组

  let map = new Object3D() // 模型组

  const radius = 5

  const threeState = reactive({
    ambient: {
      light: null as any,
      directionalLight: null as any,
      hemisphereLight: null as any
    }, //光源
    camera: null as any, //相机
    content: {
      geometry: null as any,
      example: new Object3D(),
      vertex: null as any,
      color: null as any,
      stars: null as any,
      material: null as any
    },
    renderer: null as any,
    controls: null as any,
    dom: {
      examples: undefined as any,
      width: 0,
      height: 0
    },
    defaultMap: { x: 510, y: 128, z: 0 }
  })
  onUnmounted(() => {
    threeState.controls.dispose()
    scene.remove(stars, example, group) //前面场景是add()添加，这里用remove移除前面添加的模型，灯光等。不然之前的会累加，导致多个模型或者重复灯光(会变很亮)。
  })
  onMounted(async () => {
    threeState.dom.examples = document.querySelector('#three')
    threeState.dom.width = threeState.dom.examples.clientWidth
    threeState.dom.height = threeState.dom.examples.clientHeight
    initRenderer()
    initCamera()
    initScene()
    initLight()
    //初始化地球
    initEarth()
    //地球光晕
    initEarthSprite()
    //初始化动态星空背景
    initGeometry()
    //外圈中国描边高亮
    initGeoJson()
    initControls()
    animate()
    window.addEventListener('resize', onWindowResize, false)
  })

  /**
   * 星空背景
   */
  const initGeometry = () => {
    console.log('初始化星空背景')

    let texture = new TextureLoader().load('/earth/textures/gradient.png')
    const positions: any = []
    const colors: any = []
    const geometry = new BufferGeometry()
    for (let i = 0; i < 10000; i++) {
      let vertex = new Vector3()
      vertex.x = Math.random() * 2 - 1
      vertex.y = Math.random() * 2 - 1
      vertex.z = Math.random() * 2 - 1
      positions.push(vertex.x, vertex.y, vertex.z)
      let color = new Color()
      color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55)
      colors.push(color.r, color.g, color.b)
    }
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    let starsMaterial = new PointsMaterial({
      map: texture,
      size: 1,
      transparent: true,
      opacity: 1,
      vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
      sizeAttenuation: true
    })
    stars = new Points(geometry, starsMaterial)
    stars.scale.set(300, 300, 300)
    scene.add(stars)
  }

  /**
   * 中国描边高亮
   */
  const initGeoJson = () => {
    // const loader = new FileLoader()
    // loader.load('/earth/json/geoJson/china.json', function (data: any) {
    //   const jsonData = JSON.parse(data)
    //   initMap(jsonData)
    // })
  }

  const initMap = (chinaJson: any) => {
    // 遍历省份构建模型
    chinaJson.features.forEach((elem: any) => {
      // 新建一个省份容器：用来存放省份对应的模型和轮廓线
      const province = new Object3D()
      const coordinates = elem.geometry.coordinates
      coordinates.forEach((multiPolygon: any) => {
        multiPolygon.forEach((polygon: any) => {
          const lineMaterial = new LineBasicMaterial({ color: 0xf19553 }) //0x3BFA9E
          const positions = []
          const linGeometry = new BufferGeometry()
          for (let i = 0; i < polygon.length; i++) {
            let pos = lglt2xyz(polygon[i][0], polygon[i][1])
            positions.push(pos.x, pos.y, pos.z)
          }
          linGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
          const line = new Line(linGeometry, lineMaterial)
          province.add(line)
        })
      })
      map.add(province)
    })
    group.add(map)
  }

  //threejs自带的经纬度转换
  const lglt2xyz = (lng: number, lat: number) => {
    const theta = (90 + lng) * (Math.PI / 180)
    const phi = (90 - lat) * (Math.PI / 180)
    return new Vector3().setFromSpherical(new Spherical(radius, phi, theta))
  }
  const initEarth = () => {
    console.log('创建地球模型')
    let globeTextureLoader = new TextureLoader()
    globeTextureLoader.load('/earth/textures/earth.jpg', function (texture) {
      let globeGeometry = new SphereGeometry(40, 100, 100)
      let globeMaterial = new MeshStandardMaterial({ map: texture })
      let globeMesh = new Mesh(globeGeometry, globeMaterial)
      group.rotation.set(0.5, 2.9, 0.1)
      group.add(globeMesh)
      scene.add(group)
    })
  }
  /**
   * 创建地球光晕特效
   */
  const initEarthSprite = () => {
    let globeTextureLoader = new TextureLoader()
    let texture = globeTextureLoader.load('./earth/textures/earth_aperture.png')
    let spriteMaterial = new SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    })
    let sprite = new Sprite(spriteMaterial)
    sprite.scale.set(radius * 3, radius * 3, 1)
    group.add(sprite)
  }

  /**
   * @description 初始化渲染场景
   */
  const initRenderer = () => {
    console.log('初始化渲染场景')
    threeState.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    threeState.renderer.setPixelRatio(window.devicePixelRatio)
    threeState.renderer.setSize(threeState.dom.width, threeState.dom.height)
    threeState.dom.examples.appendChild(threeState.renderer.domElement)
  }
  /**
   * @description 初始化相机
   */
  const initCamera = () => {
    console.log('初始化相机')
    threeState.camera = new PerspectiveCamera(
      40,
      threeState.dom.width / threeState.dom.height,
      1,
      1000
    )
    threeState.camera.position.set(5, -20, 200)
    threeState.camera.lookAt(0, 1, 0)
    // window.camera = threeState.camera
  }
  /**
   * @description 初始化场景
   */
  const initScene = () => {
    console.log('初始化场景')
    scene = new Scene()
    scene.background = new Color(0x020924)
    scene.fog = new Fog(0x020924, 200, 1000)
    // window.scene = threeState.scene
  }
  /**
   * 初始化用户交互
   **/
  const initControls = () => {
    console.log('初始化用户交互')
    threeState.controls = new OrbitControls(threeState.camera, threeState.renderer.domElement)
    threeState.controls.enableDamping = true
    threeState.controls.enableZoom = true
    threeState.controls.autoRotate = false
    threeState.controls.autoRotateSpeed = 2
    threeState.controls.enablePan = true
  }

  /**
   * @description 初始化光
   */
  const initLight = () => {
    console.log('初始化光源')
    const ambientLight = new AmbientLight(0xcccccc, 1.1)
    scene.add(ambientLight)
    const directionalLight = new DirectionalLight(0xffffff, 0.2)
    directionalLight.position.set(1, 0.1, 0).normalize()
    const directionalLight2 = new DirectionalLight(0xff2ffff, 0.2)
    directionalLight2.position.set(1, 0.1, 0.1).normalize()
    scene.add(directionalLight)
    scene.add(directionalLight2)
    const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.2)
    hemiLight.position.set(0, 1, 0)
    scene.add(hemiLight)
    const directionalLight3 = new DirectionalLight(0xffffff)
    directionalLight3.position.set(1, 500, -20)
    directionalLight3.castShadow = true
    directionalLight3.shadow.camera.top = 18
    directionalLight3.shadow.camera.bottom = -10
    directionalLight3.shadow.camera.left = -52
    directionalLight3.shadow.camera.right = 12
    scene.add(directionalLight3)
  }
  /**
   * 窗口变动
   **/
  const onWindowResize = () => {
    threeState.camera.aspect = innerWidth / innerHeight
    threeState.camera.updateProjectionMatrix()
    threeState.renderer.setSize(innerWidth, innerHeight)
    renders()
  }

  /**
   * @description 渲染
   */
  const renders = () => {
    threeState.renderer.clear()
    threeState.renderer.render(scene, threeState.camera)
  }

  /**
   * 更新
   **/
  const animate = () => {
    window.requestAnimationFrame(() => {
      if (threeState.controls) threeState.controls.update()
      renders()
      animate()
    })
  }
</script>
<style scoped lang="less">
  #three {
    height: 100%;
  }
</style>
