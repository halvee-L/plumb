import Plumb from "./plumb";

import * as Source from "./source/index";

function init(options) {
  return new Plumb(options);
}

export default { init, ...Source };
