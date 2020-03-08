import { source } from 'common-tags'

// UMD pattern adapted from https://github.com/umdjs/umd/blob/master/returnExports.js
export default function umd(global, value) {
  return source`
    (function (root, ${global}) {
      Object.defineProperty(${global}, '__esModule', { value: true });
      if (typeof define === 'function' && define.amd) {
        define(${global});
      } else if (typeof exports === 'object') {
        module.exports = ${global};
      } else {
        root.${global} = ${global};
      }
    }(this, {
    ${value}
    }));
  `
}
