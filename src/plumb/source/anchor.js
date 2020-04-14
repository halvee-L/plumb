import Base from "./base";
import Shape from "../Shape";
import Connector from "./connector";
import { addEventListener, removeEventListener } from "../util/Dom";
import { util } from "../util/Helper";

const counter = util.counterFactory(3000);

export default class Anchor extends Base {
  constructor(options, source) {
    super(options);
    this.source = source;
    this.type = options.type;
    this.config = options;
    this.connectorList = [];
  }
  setBasePosition(x, y) {
    let [ox, oy] = this.config.position;
    this.x = x + ox;
    this.y = y + oy;
    this.shape.setShape({ x: this.x, y: this.y });
  }

  addConnector(connector) {
    this.connectorList.push(connector);
  }
  initEvent() {
    let canAccpet = false;

    let tempAnchor = null;
    let connector = null;
    let [sx, sy] = [0, 0];

    let mouseDown = (e) => {
      tempAnchor = new Anchor({
        type: "circle",
        x: this.x,
        y: this.y,
        position: [0, 0],
        width: 10,
        height: 10,
      });
      e.target.__anchor = this;
      connector = new Connector(this, tempAnchor, {});
      tempAnchor.__render = this.__render;
      connector.__render = this.__render;
      tempAnchor.render();
      connector.render();
      sx = e.clientX || e.pageX;
      sy = e.clientY || e.pageY;
      addEventListener(document.body, "mousemove", mouseMove);
      addEventListener(document.body, "mouseup", mouseUP);
    };

    let mouseMove = (e) => {
      let offsetX = sx - (e.clientX || e.pageX);
      let offsetY = sy - (e.clientY || e.pageY);
      tempAnchor.setBasePosition(this.x - offsetX, this.y - offsetY);
    };

    let mouseUP = (e) => {
      let __targetAnchor = e.target.__targetAnchor;
      if (__targetAnchor) {
        connector.setTarget(__targetAnchor);
        this.root.connect(this, __targetAnchor);
        e.target.__targetAnchor = null;
      }
      connector.destory();
      tempAnchor.destory();
      removeEventListener(document.body, "mousemove", mouseMove);
      removeEventListener(document.body, "mouseup", mouseUP);
    };

    this.shape.on("mousedown", mouseDown);
    this.shape.on("mouseover", (e) => {
      if (e.target.__anchor && e.target.__anchor.source === this.source) return;
      canAccpet = true;
    });
    this.shape.on("mouseup", (e) => {
      if (canAccpet) {
        e.target.__targetAnchor = this;
      }
    });
    this.shape.on("mouseout", (e) => {
      canAccpet = false;
    });
  }
  getCenter() {
    return [this.config.width / 2, this.config.height / 2];
  }
  toShape() {
    return (
      this.shape ||
      new Shape({
        type: this.type,
        shape: {
          x: this.x,
          y: this.y,
          width: this.config.width,
          height: this.config.height,
        },
        style: {
          zIndex: counter(),
          strokeWidth: this.config.borderWidth || 0,
          strokeColor: this.config.borderColor || "black",
          fillColor: this.config.backgroundColor || "white",
          raduis: this.config.borderRaduis || 0,
        },
      })
    );
  }

  render() {
    if (this.__render) {
      if (!this.shape) {
        this.shape = this.__render.add(this.toShape());
        this.initEvent(); // todo
      }
    }
  }
}
