function isType(type) {
  return function (val) {
    return Object.prototype.toString.call(val) === "[object " + type + "]";
  };
}
var isFunction = isType("Function");
var isArray = isType("Array");

const uuid = (len = 10) => {
  let codes = [];
  for (var i = 0; i < len; i++) {
    codes.push(Math.ceil(Math.random() * 57) + 65);
  }
  return String.fromCharCode.apply(String, codes);
};

const counterFactory = (start = 0, step = 1) => {
  return function () {
    return start + step++;
  };
};

export const util = { isFunction, isArray, uuid, counterFactory };
