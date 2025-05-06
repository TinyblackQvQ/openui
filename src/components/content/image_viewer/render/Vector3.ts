/**
 * A 3D vector class.
 * The coordinate system is right-handed:
 *
 * y   z
 * ^  ^
 * | /
 * |/
 * +----> x
 * */

class Vector3 {
  x: number
  y: number
  z: number
  static zero: Vector3 = new Vector3(0, 0, 0)
  static one: Vector3 = new Vector3(1, 1, 1)
  static up: Vector3 = new Vector3(0, 1, 0)
  static down: Vector3 = new Vector3(0, -1, 0)
  static left: Vector3 = new Vector3(-1, 0, 0)
  static right: Vector3 = new Vector3(1, 0, 0)
  static forward: Vector3 = new Vector3(0, 0, 1)
  static back: Vector3 = new Vector3(0, 0, -1)
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z)
  }

  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }

  norm(): number {
    return Math.sqrt(this.dot(this))
  }

  scale(factor: number): Vector3 {
    return new Vector3(this.x * factor, this.y * factor, this.z * factor)
  }

  normalize(): Vector3 {
    return this.scale(1 / this.norm())
  }

  displace(point: Vector3): Vector3 {
    return new Vector3(point.x + this.x, point.y + this.y, point.z + this.z)
  }

  subtract(dest: Vector3): Vector3 {
    return new Vector3(this.x - dest.x, this.y - dest.y, this.z - dest.z)
  }

  cross(other: Vector3) {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    )
  }
}

export default Vector3
