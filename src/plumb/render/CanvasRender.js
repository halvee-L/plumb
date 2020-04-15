import RenderBase from "./RenderBase";

import { addEventListener, removeEventListener } from "../util/Dom";

const parseAuto = (v, unit = "") => (v ? v + unit : "100%");

const setAttribute = (el, key, val) => {
  if (el["__" + key] !== val) {
    el.setAttribute(key, val);
    el["__" + key] = val;
    return true;
  }
  return false;
};

const setStyle = (el, key, val) => {
  if (el.style["__" + key] !== val) {
    el.style[key] = val;
    el.style["__" + key] = val;
    return true;
  }
  return false;
};

const setCtx = (ctx, key, val, focus) => {
  if (ctx["__" + key] !== val || focus) {
    ctx[key] = val;
    ctx["__" + key] = val;
    return true;
  }
  return false;
};

const drawer = {
  M(x, y) {
    this.moveTo(x, y);
    drawer.cache.call(this, x, y);
  },
  m(x, y) {
    let _x = this.__x || 0;
    let _y = this.__y || 0;
    x += _x;
    y += _y;
    drawer.M.call(this, x, y);
  },
  /**
   *
   * @param {*} rx  是椭圆的两个半轴的长度。
   * @param {*} ry  是椭圆的两个半轴的长度。
   * @param {*} xAxisRotation  是椭圆相对于坐标系的旋转角度，角度数而非弧度数。
   * @param {*} largeArcFlag 标记绘制大弧(1)还是小弧(0)部分。
   * @param {#} sweepFlag 是标记向顺时针(1)还是逆时针(0)方向绘制。
   * @param {*} x   是圆弧终点的坐标
   * @param {*} y 是圆弧终点的坐标
   * 弧度数=角度数÷180°×π；
     角度数=弧度数÷π×180°。
   */
  a(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    let _x = this.__x || 0;
    let _y = this.__y || 0;
    x += _x;
    y += _y;
    if (this.ellipse) {
      //todo
      this.ellipse(
        10,
        10,
        rx,
        ry,
        0,
        (xAxisRotation / 180) * Math.PI,
        Math.PI / 180,
        !sweepFlag
      );
    }
  },
  L(x, y) {
    this.lineTo(x, y);
    drawer.cache.call(this, x, y);
  },
  Z() {
    this.closePath();
    this.fill();
  },
  cache(x, y) {
    this.__x = x;
    this.__y = y;
  },
};

const updateCanvas = (ctx, shape) => {
  let paths = shape.getPath();
  for (let i = 0, len = paths.length; i < len; i++) {
    let action = paths[i][0];
    drawer[action].apply(ctx, paths[i].slice(1));
  }
  ctx.stroke();
};

const createElementShape = () => {
  let $canvas = document.createElement("canvas");
  let ctx = $canvas.getContext("2d");
  $canvas.update = (options) => {
    let { shape, style } = options;
    // $canvas.width = shape.width + 20;
    ctx.clearRect(0, 0, shape.width, shape.height);
    let wc = setAttribute($canvas, "width", shape.width + 20);
    let hc = setAttribute($canvas, "height", shape.height + 20);
    setStyle($canvas, "width", parseAuto(shape.width + 20, ""));
    setStyle($canvas, "height", parseAuto(shape.height + 20, ""));
    if (style.strokeWidth) {
      setCtx(ctx, "lineWidth", style.strokeWidth, wc || hc);
    }
    if (style.strokeColor) {
      setCtx(ctx, "strokeStyle", style.strokeColor, wc || hc);
    }
    setCtx(ctx, "fillStyle", style.fillColor || "none");
    updateCanvas(ctx, options);
    // ctx.strokeStyle = "black";
    // ctx.rect(0, 0, shape.width, shape.height);
    // ctx.stroke();
  };
  $canvas.__ctx = ctx;
  return $canvas;
};

export default class CanvasRender extends RenderBase {
  constructor(options) {
    super(options);
    this.initEvent();
  }
  getEventShapes(e) {
    let shapes = [];
    for (let i = 0, len = this.shapes.length; i < len; i++) {
      let shape = this.shapes[i];
      if (
        shape.el.__ctx.isPointInPath(
          e.offsetX - shape.shape.x,
          e.offsetY - shape.shape.y
        )
      ) {
        shapes.push(shape);
      }
    }
    return shapes.reverse();
  }

  _handleEvent(name, e) {
    let shapes = this.getEventShapes(e);
    let _stopPropagationFn = e.stopPropagation || function () {};
    let stopPropagation = false;
    e.stopPropagation = function () {
      _stopPropagationFn.apply(e, arguments);
      stopPropagation = true;
    };
    for (let i = 0, len = shapes.length; i < len; i++) {
      shapes[i].emit(name, e);
      if (stopPropagation) {
        break;
      }
    }
  }
  initEvent() {
    [
      "click",
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseout",
      "mouseenter",
      "mouseover",
    ].forEach((name) => {
      addEventListener(
        this.$contaner,
        name,
        this._handleEvent.bind(this, name)
      );
    });
  }
  createElemet(options) {
    let canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    this.ctx = canvas.getContext("2d");

    return canvas;
  }
  add(shape) {
    if (!shape.el) {
      shape.el = createElementShape(shape);
      shape.dirty();
      shape.on("update", this.render.bind(this));
    }
    return super.add(shape);
  }
  remove(shape) {
    super.remove(shape);
    if (shape.el) {
      this.render();
    }
  }
  render() {
    this.$contaner.width = this.$contaner.width;
    for (let i = 0, len = this.shapes.length; i < len; i++) {
      let shape = this.shapes[i];
      if (shape.__dirty) {
        // todo
        shape.el.update(shape);
      }
      //   let ctx = shape.el.getContext("2d");
      //   ctx.fillStyle = colors[i % colors.length];
      //   ctx.fillRect(0, 0, shape.shape.width, shape.shape.height);
      this.ctx.drawImage(shape.el, shape.shape.x, shape.shape.y);
      shape.__dirty = false;
    }
  }
}
