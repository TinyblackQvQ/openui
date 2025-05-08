import type ObjectPool from "./ObjectPool";
import Vector2 from "./Vector2";
import Vector3 from "./Vector3";

class Camera {
  constructor(pool: ObjectPool) {
    this.pool = pool
    this.view = {
      near: 0.1,
      far: 1000,
      rect: new Vector2(1, 1)
    }
    this.position = new Vector3(0, 0, 0)
    this.direction = new Vector3(0, 0, -1)
  }
  pool: ObjectPool
  view: { near: number; far: number; rect: Vector2 }
  position: Vector3
  direction: Vector3
  mapPoint(point: Vector3): Vector3 {
    return point.subtract(this.position).normalize().scale(-1)
  }
}

export default Camera
