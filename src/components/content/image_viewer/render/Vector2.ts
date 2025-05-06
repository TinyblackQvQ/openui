class Vector2 {
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  x: number
  y: number
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }
  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }
  /**
   * 按分量将当前二维向量与另一个二维向量相乘。
   * 该方法会将两个向量对应位置的分量分别相乘，生成一个新的二维向量。
   * 注意，这并非向量的点积或叉积运算，而是分量级别的乘法。
   *
   * @param other - 用于相乘的另一个二维向量。
   * @returns 一个新的二维向量，其分量为两个向量对应分量相乘的结果。
   */
  multiply(other: Vector2): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y)
  }
  /**
   * 计算当前二维向量与另一个二维向量的点积。
   * 点积（也称为标量积）是一个标量值，其结果等于两个向量对应坐标分量乘积之和。
   * 在二维空间中，点积公式为 a·b = a.x * b.x + a.y * b.y。
   * 点积可以用于计算两个向量之间的夹角，以及一个向量在另一个向量上的投影长度。
   *
   * @param other - 用于计算点积的另一个二维向量。
   * @returns 两个向量的点积，返回值类型为 number。
   */
  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y
  }

  scale(factor: number): Vector2 {
    return new Vector2(this.x * factor, this.y * factor)
  }
  /**
   * 计算当前二维向量在另一个二维向量上的投影向量。
   * 投影向量是指当前向量在另一个向量方向上的分量，其方向与另一个向量相同。
   *
   * @param other - 作为投影基准的另一个二维向量。
   * @returns 当前向量在 `other` 向量上的投影向量，返回值类型为 Vector2。
   */
  project(other: Vector2): Vector2 {
    const dot = this.dot(other)
    const norm = other.length()
    return other.scale(dot / norm)
  }
  /**
   * 将当前二维向量归一化，返回一个模长为 1 的向量。
   * 归一化向量是指方向与原向量相同，但模长为 1 的向量。
   *
   * @returns 归一化后的二维向量。
   */
  normalize(): Vector2 {
    const norm = this.length()
    return new Vector2(this.x / norm, this.y / norm)
  }
  /**
   * 计算当前二维向量的模长（欧几里得范数）。
   * 向量的模长是指从向量原点到向量终点的距离，在二维平面中，
   * 可根据勾股定理计算，即模长等于 x 坐标平方与 y 坐标平方和的平方根。
   *
   * @returns 当前二维向量的模长，返回值类型为 number。
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

export default Vector2
