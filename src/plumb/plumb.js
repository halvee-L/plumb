import SVGRender from "./render/SVGRender";
import Connentor from "./source/connector";
export default class Plumb {
  constructor(options) {
    this.render = new SVGRender(options);

    this.sourceList = [];

    this.anchorList = [];

    this.connectorList = [];
  }

  _pack(source) {
    source.__render = this.render;
    source.root = this;
    return source;
  }
  add(source) {
    this.sourceList.push(this._pack(source));
    this.anchorList.push(...source.anchor.map(this._pack.bind(this)));
    this.refresh();
  }

  getSource(id) {
    return id;
  }

  getConnector(id) {
    return id;
  }

  getAnchor(id) {
    return this.anchorList.filter((p) => p.id === id)[0];
  }
  connect(source, target) {
    // todo
    target = typeof target === "string" ? this.getAnchor(target) : target;
    source = typeof source === "string" ? this.getAnchor(source) : source;
    let connector = new Connentor(source, target, {});
    connector.__render = this.render;
    this.connectorList.push(connector);
    this.refresh();
    return connector;
  }

  refresh() {
    for (let i = 0, len = this.sourceList.length; i < len; i++) {
      let source = this.sourceList[i];
      source.render();
    }

    for (let i = 0, len = this.connectorList.length; i < len; i++) {
      this.connectorList[i].render();
    }
    this.render.render();
  }

  reRender() {
    this.render.refresh();
  }
}
