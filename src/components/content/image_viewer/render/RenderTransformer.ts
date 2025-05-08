import Vector3 from './Vector3'

class RenderTransformer {
  position: Vector3 = new Vector3(0, 0, 0)
  scale: Vector3 = new Vector3(1, 1, 1)
  rotation: Vector3 = new Vector3(0, 0, 0)
  bindScale: boolean = false

  scaleXY(factor: number) {
    this.scale = new Vector3(factor, factor, this.scale.z)
  }

  scaleTo(factor: number): void
  scaleTo(x: number, y: number, z: number): void
  scaleTo(x: number, y?: number, z?: number): void {
    if (y === undefined || z === undefined) {
      this.scale = new Vector3(x, x, x)
    } else {
      this.scale = new Vector3(x, y, z)
    }
  }
}

export default RenderTransformer
