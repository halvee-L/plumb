(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(global);
  } else if (typeof define === "function" && define.amd) {
    define("Promise", [], factory);
  } else {
    global.Promise = factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (global) {
  var random = function (min, max) {
    return Math.ceil(Math.random() * max) + min;
  };

  var ANIMATION_STACK = [];
  var Math$pow = Math.pow;

  var $canvas = document.createElement("canvas");
  $canvas.width = $canvas.height = 5;
  var ctx = $canvas.getContext("2d");
  var getImage = function () {
    var color = "#" + Math.floor(Math.random() * 16777215).toString(16) + "aa";
    $canvas.width = $canvas.width;
    ctx.fillStyle = color;
    ctx.arc(2.5, 2.5, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    return ctx.getImageData(0, 0, 10, 10);
  };

  var getCalc = function (x, y) {
    var apexX = x + (random(0, 10) > 5 ? 1 : -1) * random(3, 30);
    var apexY = y - random(10, 30);
    var a = (apexY - y) / Math$pow(x - apexX, 2);
    var b = -2 * apexX * a;
    var c = a * Math$pow(apexX, 2) + apexY;

    var paraCurve = function (x) {
      return a * Math$pow(x, 2) + b * x + c;
    };

    var Cy = y - paraCurve(x);

    var calcFunction = function (x) {
      var Ry = paraCurve(x) + Cy;
      Ry = 2 * y - Ry;
      return Ry;
    };
    calcFunction.dir = apexX > x ? 1 : -1;
    return calcFunction;
  };

  var Ball = function (x, y, ctx) {
    this.x = x;
    this.y = y;
    this.step = 1;
    this.ctx = ctx;
    this.init();
  };
  Ball.prototype.init = function () {
    this.imageData = getImage();
    this.paraCurve = getCalc(this.x, this.y);
    this.step = this.paraCurve.dir * 1.8;
  };
  Ball.prototype.draw = function () {
    this.x += this.step;
    this.y = this.paraCurve(this.x);
    if (this.y > document.body.clientHeight) {
      let index = ANIMATION_STACK.indexOf(this);
      ANIMATION_STACK.splice(index, 1);
    } else {
      this.ctx.putImageData(this.imageData, this.x, this.y);
    }
  };

  var addStack = function (x, y, ctx) {
    for (var i = 0, len = 15; i < len; i++) {
      ANIMATION_STACK.push(new Ball(x, y, ctx));
    }
  };
  var draw = function () {
    for (var i = ANIMATION_STACK.length - 1; i >= 0; i--) {
      var ball = ANIMATION_STACK[i];
      ball.draw();
    }
  };

  var render = function (canvas) {
    requestAnimationFrame(() => {
      canvas.width = canvas.width;
      draw();
      render(canvas);
    });
  };
  return function (canvas) {
    this.canvas = canvas;
    var ctx = canvas.getContext("2d");
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    document.body.addEventListener("click", function (e) {
      addStack(e.clientX, e.clientY, ctx);
    });
    render(canvas);
    console.log(this.canvas);
  };
});
