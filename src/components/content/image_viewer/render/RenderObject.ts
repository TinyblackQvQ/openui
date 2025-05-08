import { Vector3 } from "./Vector3";
import Transformer from "./RenderTransformer";
import type Camera from "./Camera";

class RenderObject {
    constructor(bind: HTMLElement) {
        this.htmlElement = bind;
        this.transformer = new Transformer();
    }
    htmlElement: HTMLElement;
    transformer: Transformer;
    update() {}
    render(camera: Camera) {
      // 根据高度差计算缩放比例
      const heightDifference = camera.position.z - this.transformer.position.z;
      const scaleFactor = 1 + heightDifference * 0.01; // 调整缩放因子以控制缩放速度
      this.htmlElement.style.scale = camera.position.z > 0 ? `${this.transformer.scale.x} ${this.transformer.scale.y}` : '0 0';
    }
}
