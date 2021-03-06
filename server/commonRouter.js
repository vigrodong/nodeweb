/**
 * Created by vigro on 2018/1/2.
 */
const isnot = require('./isnot.js');
// const isRegExp = isnot.isRegExp;
// const isString = isnot.isString;
// const isFunction = isnot.isFunction;
const isRegExp = isnot('[Object RegExp]');
const isString = isnot('[Object String]');
const isFunction = isnot('[Object Function]');

var processControl = 0;
function commonRouter(routers, req, res) {

  var router = null;
  return new Promise(function(resolve, reject) {
    function go() {
      router.callback(req, res);
      resolve();
    }

    if (routers.length != 0) {
      processControl = 0;
      routers.some(function(target) {
        if (isRegExp(target.url) && target.url.test(req.url) ||
            isString(target.url) && req.url == target.url
        ) {
          router = target;
          if (target.before && isFunction(target.before)) {
            target.before(req, res, go);
          }else{
            go();
          }
          resolve();
          return true;
        }
        else {
          processControl++;
        }
      });
      if (processControl == routers.length) {
        reject();
      }
    } else {
      reject();
    }
  });
}

module.exports = commonRouter;