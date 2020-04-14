import Base from "./base";
import Shape from "../Shape";
import Anchor from "./anchor";
import { util } from "../util/Helper";
import {
  addEventListener,
  removeEventListener as removeListener,
} from "../util/Dom";

const ANCHOR_DEFAULT_SHAPE = {
  type: "circle",
  width: 20,
  height: 20,
  borderColor: "blue",
  borderWidth: "1",
  backgroundColor: "red",
};

const transformPostion = (pos, shape, width, height) => {
  let halfWidth = shape.width / 2;
  let halfHeight = shape.height / 2;
  switch (pos) {
    case "top":
      return [width / 2 - halfWidth, -halfHeight];
    case "right":
      return [width - halfWidth, height / 2 - halfHeight];
    case "bottom":
      return [width / 2 - halfWidth, height - halfHeight];
    case "left":
      return [-halfWidth, height / 2 - halfHeight];
  }
};
const transformAnchor = (anchor, width, height) => {
  anchor = util.isArray(anchor) ? anchor : [anchor];
  return anchor.map((p) => {
    p =
      typeof p === "string"
        ? {
            position: p,
          }
        : p;
    p.shape = Object.assign({}, ANCHOR_DEFAULT_SHAPE, p.shape || {});
    p.__position = p.position;
    p.position = transformPostion(p.position, p.shape, width, height);
    return p;
  });
};

class RectSource extends Base {
  constructor(options) {
    super(options);
    this.anchor = [];
    this.config = options;
    this.initAnchor(options);
    this.refresh();
  }
  addAnchor(anchor) {
    anchor.__render = this.__render;
    this.anchor.push(anchor);
  }
  initAnchor(options) {
    let anchor = options.anchor;
    delete options.anchor;
    if (anchor) {
      anchor = transformAnchor(anchor, this.config.width, this.config.height);
      anchor.forEach((a) => {
        let [x, y] = a.position;
        a.shape.x = x + this.x;
        a.shape.y = y + this.y;
        a.shape.position = a.position;
        a.shape.id = a.id;
        a.shape.__position = a.__position;
        this.addAnchor(new Anchor(a.shape, this));
      });
    }
  }
  getAnchorPoint(anchor) {
    let {
      shape: { shape },
    } = anchor;
    let center = [shape.width / 2, shape.height / 2];
    switch (anchor.config.__position) {
      case "right": {
        let paths = [center, [shape.width / 2 + 10, shape.height / 2]];
        return {
          start: paths[1],
          paths,
        };
      }
      case "bottom": {
        let paths = [center, [shape.width / 2, shape.height / 2 + 10]];
        return {
          start: paths[1],
          paths: paths,
        };
      }
      default:
        return {
          start: [0, 0],
          paths: [[0, 0]],
        };
    }
  }
  refresh() {
    if (this.__render) {
      this.__render.render();
    }
  }
  initEvent() {
    let [sx, sy, x, y] = [0, 0, this.x, this.y];
    const mouseMove = (e) => {
      let offsetX = sx - (e.clientX || e.pageX);
      let offsetY = sy - (e.clientY || e.pageY);
      this.x = x - offsetX;
      this.y = y - offsetY;
      this.anchor.map((p) => {
        p.setBasePosition(this.x, this.y);
      });
      this.shape.setShape({ x: this.x, y: this.y });
    };

    const mouseUp = (e) => {
      removeListener(document.body, "mousemove", mouseMove);
      removeListener(document.body, "mouseup", mouseUp);
    };

    this.shape.on("mousedown", (e) => {
      sx = e.clientX || e.pageX;
      sy = e.clientY || e.pageY;
      x = this.x;
      y = this.y;
      console.log(sx, sy);
      addEventListener(document.body, "mousemove", mouseMove);
      addEventListener(document.body, "mouseup", mouseUp);
    });
  }
  render() {
    if (this.__render) {
      if (!this.shape) {
        this.shape = this.__render.add(this.toShape());
        this.initEvent();
      }
      for (let i = 0, len = this.anchor.length; i < len; i++) {
        let _anchor = this.anchor[i];
        _anchor.render();
      }
    }
  }
  toShape() {
    return (
      this.shape ||
      new Shape({
        type: "rect",
        shape: {
          x: this.x,
          y: this.y,
          width: this.config.width,
          height: this.config.height,
        },
        style: {
          strokeWidth: this.config.borderWidth || 0,
          strokeColor: this.config.borderColor || "black",
          fillColor: this.config.backgroundColor || "white",
          raduis: this.config.borderRaduis || 0,
        },
      })
    );
  }
}

export { RectSource, Anchor };
