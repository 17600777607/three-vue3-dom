import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Plane } from '~/views/Plane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class TextDraw extends Plane {
  private CSSRender: CSS2DRenderer | any
  private CSSContainer: HTMLElement | any

  public textDom = {
    examples: undefined as any,
    width: 0,
    height: 0
  }

  drawText = async (dom: string) => {
    console.log('TextDrawl类--开始绘制文字')
    this.initCSSRender(dom)
    const testCSS2dObject = this.create2DObject('点我')
    this.scene.add(testCSS2dObject)
    this.CSSRender.render(this.scene, this.camera)
    this.controls = new OrbitControls(this.camera, this.CSSRender.domElement)
  }

  /**
   * 创建文字渲染器 CSS2DRenderer
   */
  initCSSRender(dom: string) {
    console.log('TextDrawl类--创建文字渲染器 CSS2DRenderer')
    this.CSSRender = new CSS2DRenderer()
    this.textDom.width = this.dom.examples.clientWidth
    this.textDom.height = this.dom.examples.clientHeight
    this.CSSRender.setSize(this.textDom.width, this.textDom.height)
    // //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
    // this.CSSRender.domElement.style.pointerEvents = 'none'
    this.CSSRender.domElement.style.position = 'absolute'
    this.CSSRender.domElement.style.top = '0'
    this.CSSContainer = document.getElementById(dom)
    this.CSSContainer.appendChild(this.CSSRender.domElement)
  }

  /**
   * 创建 CSS2DObject  dom
   * @param text
   */
  create2DObject(text: string) {
    console.log('TextDrawl类--创建 CSS2DObject  dom')
    const div = document.createElement('div')
    /*给标签设置你想要的的样式*/
    div.style.background = 'rgba(10,18,51,0.8)'
    div.style.color = '#fff'
    div.style.border = '1px solid #fff'
    div.style.borderRadius = '6px'
    div.style.padding = '4px'
    div.style.fontSize = '12px'
    div.style.zIndex = '10000'
    div.textContent = text
    div.className = 'label'
    const label = new CSS2DObject(div)
    label.position.set(0, 0, 3)
    label.element.addEventListener('click', () => {
      alert('点击')
    })
    return label
  }
}
