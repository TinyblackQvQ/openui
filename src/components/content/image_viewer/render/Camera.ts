class Camera {
  constructor() {}
  pool: ObjectPool
  view: { near: number; far: number; rect: Vector2 }
  position: Vector3
  direction: Vector3
  mapPoint(point: Vector3): Vector3 {
    return point.subtract(this.position).normalize().scale(-1)
  }
}
