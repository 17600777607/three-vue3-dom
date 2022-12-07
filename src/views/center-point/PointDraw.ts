import { Plane } from '~/views/Plane'
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  TextureLoader,
  Vector3,
  MathUtils,
  Group
} from 'three'

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

export class PointDraw extends Plane {
  /**
   * 绘制点
   */
  drawPoint = async () => {
    console.log('绘制点模型')
    // 点纹理
    const texture = new TextureLoader().load('/earth/textures/gradient.png')

    // 点位置
    const positions: Array<number> = []
    // 点颜色
    const colors: any = []
    const geometry = new BufferGeometry()

    const geoJsonData: GeoJsonType = (await this.loadMapData(
      '/china/json/china.json'
    )) as GeoJsonType
    const radius = 1
    const group = new Group()
    geoJsonData.features.forEach((d) => {
      if (d.properties.center) {
        const centerList: Array<number> = d.properties.center
        //中线点绘制
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
      }
    })

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    const starsMaterial = new PointsMaterial({
      map: texture,
      size: 3,
      transparent: true,
      opacity: 1,
      vertexColors: true,
      sizeAttenuation: true
    })

    //点模型
    const stars = new Points(geometry, starsMaterial)
    stars.scale.set(-100, 100, 100)
    group.add(stars)
    this.scene.add(group)
  }
}
