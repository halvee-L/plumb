import Emitter from "../util/Emitter";
import { util } from "../util/Helper";

export default class Source extends Emitter {
  constructor(options) {
    super();
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.anchor = [];
    this.id = options.id || util.uuid();
    delete options.x;
    delete options.y;
  }
  copy() {
    return this.constructor(this.config);
  }
  destory() {
    if (this.__render) {
      if (this.shape) {
        this.__render.remove(this.shape);
        this.shape.off();
      }
    }
    this.off();
  }
}
