/*
 * @todo Adding setPath() and getPath() which should manipulate a fake path behing #/
 */

window.addEventListener('load', function () {
  mdNotParamHandler = createMdNotParamHandler();
  mdNotParamHandler.init();
}, false),

createMdNotParamHandler = (function () {
  var _params = {},
  _url = '';

  function _parseUrl () {
    var paramString = _url.split('#/');
    paramString = (paramString[1] ? paramString[1] : paramString[0]);
    var paramArr = paramString.split('&');
    paramArr.forEach(function (val, index, array) {
      var thisParam = val.split('=');
      _params[thisParam[0]] = (thisParam[1] ? thisParam[1] : true );
    });
    return _params;
  }

  function _getParam (name) {
    return (_params[name] ? _params[name] : false );
  }

  function _setParam (name, value) {
    name = encodeURIComponent(name);
    value = (typeof value === 'string' ? encodeURIComponent(value) : value);
    _params[name] = value;
    return _updateURL();
  }

  function _updateURL () {
    var paramString = '';
    var prefix = '#';
    for(var prop in _params) {
      if(_params.hasOwnProperty(prop) && _params[prop] !== false) {
        paramString += prefix + prop + (_params[prop] === true ? '' : '=' + _params[prop]);
        prefix = '&';
      }
    }
    return _url.split('#')[0] + paramString;
  }

  function _setEventListeners () {
    window.addEventListener('hashchange', function () {
      _url = location.href;
      _updateURL();
    }, false);
  }

  return {
    init: function (url) {
      _url = url || location.href;
      _setEventListeners();
      return _parseUrl();
    },
    getParam: function (name) {
      return _getParam(name);
    },
    setParam: function (name, value) {
      return _setParam(name, value);
    },
  }
});