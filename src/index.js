import Plumb from "./plumb";

window.onload = function () {
  let plumbInst = Plumb.init({ el: document.getElementById("container_svg") });

  window.plumbInst = plumbInst;

  let target = new Plumb.RectSource({
    width: 100,
    height: 100,
    x: 100,
    y: 100,
    borderColor: "red",
    borderWidth: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRaduis: 5,
    anchor: ["top", { position: "right", id: "source-right" }],
  });

  console.log("source", target);

  plumbInst.add(target);

  let source = new Plumb.RectSource({
    width: 100,
    height: 100,
    x: 300,
    y: 300,
    borderColor: "red",
    borderWidth: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRaduis: 5,
    anchor: [
      {
        position: "left",
      },
      {
        position: "bottom",
        id: "target-bottom",
        shape: {
          type: "rect",
          borderColor: "blue",
          borderWidth: "1",
          backgroundColor: "blue",
        },
      },
    ],
  });

  plumbInst.add(source);

  plumbInst.connect("source-right", "target-bottom");

  let plumbCanvas = Plumb.init({
    el: document.getElementById("container_canvas"),
    render: new Plumb.CanvasRender({
      width: 800,
      height: 800,
    }),
  });

  plumbCanvas.add(target.copy());
  plumbCanvas.add(source.copy());

  plumbCanvas.connect("source-right", "target-bottom");

  window.plumbCanvas = plumbCanvas;
};
