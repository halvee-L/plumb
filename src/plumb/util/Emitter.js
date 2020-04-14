export default class Emitter {
  constructor() {
    this.listener = {};
    this.bridgeListener = {};
  }
  on(name, fn, context) {
    var list = this.listener[name] || (this.listener[name] = []);
    list.push({
      name: name,
      fn: fn,
      context: context,
    });
    return this;
  }
  once(name, fn, context) {
    var list = this.listener[name] || (this.listener[name] = []);
    var that = this;

    var proxyFuntion = function proxyFuntion() {
      var res = fn.apply(context || this, arguments);
      that.off(name, proxyFuntion);
      return res;
    };

    list.push({
      name: name,
      fn: proxyFuntion,
      context: context,
    });
    return this;
  }
  off(name, fn, context) {
    this.bridgeListener[name] = []; //todo
    if (!name) {
      this.listener = {};
    } else {
      if (!fn) {
        this.listener[name] = [];
      } else {
        var list = this.listener[name] || (this.listener[name] = []);
        for (var i = list.length - 1; i >= 0; i--) {
          var item = list[i];
          if (item.fn === fn || item.context === context) {
            list.splice(i, 1);
          }
        }
      }
    }
    return this;
  }
  emit(name) {
    var list = this.listener[name] || (this.listener[name] = []);
    var bridgelist = this.bridgeListener[name] || [];

    for (
      var _len = arguments.length,
        args = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      args[_key - 1] = arguments[_key];
    }

    for (var i = 0, len = list.length; i < len; i++) {
      var _list$i = list[i],
        fn = _list$i.fn,
        context = _list$i.context;
      fn.apply(context, args);
    }
    for (var len = bridgelist.length, i = 0; i < len; i++) {
      var bridge = bridgelist[i];

      bridge.emmiter.emit.apply(bridge.emmiter, [bridge.name].concat(args));
    }

    return this;
  }
  bridge(name, emmiter, bridgeName) {
    if (!bridgeName) {
      bridgeName = name;
    }
    var list = this.bridgeListener[name] || (this.bridgeListener[name] = []);
    list.push({
      name: bridgeName,
      emmiter: emmiter,
    });
    return this;
  }
}
