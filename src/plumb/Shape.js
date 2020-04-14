import { util } from "./util/Helper";
import Emitter from "./util/Emitter";

export default class Shape extends Emitter {
  constructor(options) {
    super();
    this.__dirty = true;
    this.el = null;
    this.id = util.uuid();
    this.path = [];
    this.type = options.type;
    this.shape = options.shape;
    this.style = options.style || {};
  }
  setPath(path) {
    this.path = path;
  }
  setShape(key, val) {
    if (typeof key === "string") {
      this.shape[key] = val;
    } else {
      Object.assign(this.shape, key);
    }
    this.dirty();
  }
  setStyle(key, val) {
    if (typeof key === "string") {
      this.style[key] = val;
    } else {
      Object.assign(this.style, key);
    }
    this.dirty();
  }
  getRectPath() {
    let _shape = this.shape;
    let paths = [];
    paths.push(["M", 0, 0]);
    paths.push(["L", _shape.width, 0]);
    paths.push(["L", _shape.width, _shape.height]);
    paths.push(["L", 0, _shape.height]);
    paths.push(["Z"]);

    return paths;
  }
  getCircle() {
    let { shape, style } = this;
    let width = shape.width - style.strokeWidth * 2;
    let r = width / 2;
    let paths = [];
    paths.push(["M", shape.width / 2, shape.height / 2]);
    paths.push(["m", -r, 0]);
    paths.push(["a", r, r, 0, 1, 0, width, 0]);
    paths.push(["a", r, r, 0, 1, 0, -width, 0]);
    paths.push(["Z"]);
    return paths;
  }
  getPolyline() {
    let { shape } = this;
    let paths = shape.paths.map(([x, y]) => {
      return ["L", x, y];
    });
    paths[0][0] = "M";
    return paths;
  }
  getPath() {
    switch (this.type) {
      case "rect":
        return this.getRectPath();
      case "circle":
        return this.getCircle();
      case "polyline":
        return this.getPolyline();
    }
  }
  dirty(noRender) {
    this.__dirty = true;
    if (!noRender) {
      this.emit("update");
    }
  }
  mount(el) {
    if (el) this.el = el;
  }
  destroy() {
    this.off();
  }
}
