import Plumb from "./plumb";

import * as Source from "./source/index";

import * as Render from "./render";

function init(options) {
  return new Plumb(options);
}

export default { init, ...Source, ...Render };
