import Base from "./base";

import Shape from "../Shape";

export default class Connector extends Base {
  constructor(source, target, options) {
    super(options);
    this.target = target;
    this.source = source;
    this.target.addConnector(this);
    this.source.addConnector(this);
  }
  initEvent() {
    this.__refresh = this.refresh.bind(this);
    this.target.shape.on("update", this.__refresh);
    this.source.shape.on("update", this.__refresh);
  }
  updateAnchor(newAnchor, oldAnchor) {
    if (oldAnchor) {
      oldAnchor.off("update", this.__refresh);
    }
    newAnchor.on("update", this.__refresh);
    this.refresh();
  }
  setSource(source) {
    let _source = this.source;
    this.source = source;
    this.updateAnchor(source, _source);
  }
  setTarget(target) {
    let _target = this.target;
    this.target = target;
    this.updateAnchor(target, _target);
  }
  render() {
    if (this.__render) {
      if (!this.shape) {
        this.shape = this.__render.add(this.toShape());
        this.initEvent();
      }
    }
  }
  getShape() {
    let target = this.target;
    let source = this.source;
    let sourceCenter = source.getCenter();
    let targetCenter = target.getCenter();
    let [x, y] = [Math.min(target.x, source.x), Math.min(target.y, source.y)];
    let [maxX, MaxY] = [
      Math.max(target.x, source.x),
      Math.max(target.y, source.y),
    ];

    return {
      x,
      y,
      width: maxX - x + sourceCenter[0],
      height: MaxY - y + sourceCenter[1],
      paths: [
        [source.x - x + sourceCenter[0], source.y - y + sourceCenter[1]],
        [target.x - x + targetCenter[0], target.y - y + targetCenter[1]],
      ],
    };
  }
  refresh() {
    if (this.shape) {
      this.shape.setShape(this.getShape());
    }
  }
  toShape() {
    return (
      this.shape ||
      new Shape({
        type: "polyline",
        shape: this.getShape(),
        style: {
          strokeWidth: 1,
          strokeColor: "gray",
        },
      })
    );
  }
}
