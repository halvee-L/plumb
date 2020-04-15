const parseAuto = (v, unit = "") => (v ? v + unit : "100%");

const stringifyCss = (options) => {
  let cssText = [];
  cssText.push("width:" + parseAuto(options.width));

  cssText.push("height:" + parseAuto(options.height));

  cssText.push("position:relative");
  return cssText.join(";");
};
export default class Render {
  constructor(options) {
    this.shapes = [];
    this.$contaner = this.createElemet(options);
    this.$contaner.style.cssText = stringifyCss(options);
    if (options.el) {
      options.el.appendChild(this.$contaner);
    }
    this.shapes = [];
  }
  add(shape) {
    if (this.has()) return shape;
    this.shapes.push(shape);
    return shape;
  }
  remove(shape) {
    let index = this.shapes.indexOf(shape);
    this.shapes.splice(index, 1);
  }
  has(shape) {
    return this.shapes.indexOf(shape) > -1;
  }
  createElemet() {
    return document.createElement("div");
  }
  mount(el) {
    if (this.$contaner) {
      el.appendChild(this.$contaner);
    }
  }
  render() {}
}
