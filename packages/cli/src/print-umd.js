import { source } from 'common-tags'

// UMD pattern adapted from https://github.com/umdjs/umd/blob/master/returnExports.js
export default function umd(global, value) {
  return source`
    (function (root, ${global}) {
      if (typeof define === 'function' && define.amd) {
        define(${global});
      } else if (typeof exports === 'object') {
        if (Object.defineProperty) Object.defineProperty(${global}, '__esModule', { value: true });
        else ${global}.__esModule = true;
        module.exports = ${global};
      } else {
        root.${global} = ${global};
      }
    }(this, {
    ${value}
    }));
  `
}
