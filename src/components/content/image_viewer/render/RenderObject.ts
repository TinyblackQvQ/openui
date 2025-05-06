import { Vector3 } from "./Vector3";
import Transformer from "./RenderTransformer";

class RenderObject {
    constructor(bind: HTMLElement) {
        this.htmlElement = bind;
        this.transformer = new Transformer();
    }
    htmlElement: HTMLElement;
    transformer: Transformer;
    update() {
      
    }
}
