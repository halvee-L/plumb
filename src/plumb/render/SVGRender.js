import { util } from "../util/Helper";
import { addEventListener, removeListener, removeElement } from "../util/Dom";
import Emitter from "../util/Emitter";
const parseAuto = (v, unit = "") => (v ? v + unit : "100%");

const stringifyCss = (options) => {
  let cssText = [];
  cssText.push("width:" + parseAuto(options.width));

  cssText.push("height:" + parseAuto(options.height));

  cssText.push("position:relative");
  return cssText.join(";");
};

const svgFunctionStrigify = (path) => {
  switch (path[0]) {
    case "M":
    case "m":
      return path[0] + " " + path.slice(1).join(",");
    case "a":
      return [
        path[0],
        path.slice(1, 3),
        path[3],
        path.slice(4, 6),
        path.slice(6),
      ].join(" ");
    default:
      return path.join(" ");
  }
};
const paths2svg = (paths) => {
  return paths.map(svgFunctionStrigify).join(" ");
};

const setAttribute = (el, key, val) => {
  if (el["__" + key] !== val) {
    el.setAttribute(key, val);
    el["__" + key] = val;
  }
};

const setStyle = (el, key, val) => {
  if (el.style["__" + key] !== val) {
    el.style[key] = val;
    el.style["__" + key] = val;
  }
};

const createContainer = function (options) {
  let $container = document.createElement("div");
  $container.style.cssText = stringifyCss(options);
  return $container;
};

const updatePosition = ($el, shape) => {
  setAttribute($el, "width", parseAuto(shape.width, ""));
  setAttribute($el, "height", parseAuto(shape.height, ""));

  setStyle(
    $el,
    "transform",
    `translate(${parseAuto(shape.x, "px")}, ${parseAuto(shape.y, "px")})`
  );
};

const createSvg = (shape) => {
  let $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  $svg.style.position = "absolute";
  return $svg;
};

const createElementShape = function (options) {
  let { shape, style } = options;
  let $svg = createSvg(shape);
  let $rect = document.createElementNS("http://www.w3.org/2000/svg", "path");

  $svg.update = function (options) {
    let _shape = options.shape;
    updatePosition($svg, _shape);
    setAttribute($rect, "width", parseAuto(_shape.width, ""));
    setAttribute($rect, "height", parseAuto(_shape.height, ""));
    setAttribute($rect, "d", paths2svg(options.getPath()));
    if (style.strokeWidth) {
      setAttribute($rect, "stroke-width", style.strokeWidth);
    }
    if (style.strokeColor) {
      setAttribute($rect, "stroke", style.strokeColor);
    }
    setAttribute($rect, "fill", style.fillColor || "none");
  };
  $svg.update(options);
  $svg.appendChild($rect);

  return $svg;
};

const createShapeFactory = function (shape) {
  switch (shape.type) {
    case "circle":
    case "rect":
    default: {
      return createElementShape(shape);
    }
  }
};

export default class SvgRender {
  constructor(options) {
    this.$contaner = createContainer(options);
    if (options.el) {
      options.el.appendChild(this.$contaner);
    }
    this.shapes = [];
  }
  bindEvent(shape) {
    let event = shape;
    [
      "click",
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseout",
      "mouseenter",
      "mouseover",
    ].forEach((name) => {
      addEventListener(shape.el, name, event.emit.bind(event, name));
    });
    event.on("update", this.render.bind(this));
    return shape;
  }
  add(shape) {
    if (!shape.el) {
      shape.el = createShapeFactory(shape);
      shape.dirty();
    }
    if (this.shapes.indexOf(shape) > -1) return shape;
    this.bindEvent(shape);
    this.shapes.push(shape);
    return shape;
  }
  remove(shape) {
    let index = this.shapes.indexOf(shape);
    this.shapes.splice(index, 1);
    if (shape.el) {
      removeElement(shape.el);
      shape.el = null;
    }
  }
  render() {
    for (let i = 0, len = this.shapes.length; i < len; i++) {
      let shape = this.shapes[i];
      if (!shape.el.parentElement) {
        this.$contaner.appendChild(shape.el);
      }
      if (shape.__dirty) {
        shape.el.update(shape);
      }
      shape.__dirty = false;
    }
  }
}
