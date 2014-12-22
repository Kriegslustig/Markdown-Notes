window.addEventListener('load', function () {
  mdNotParamHandler = createMdNotParamHandler();
  mdNotParamHandler.init();
}, false),

createMdNotParamHandler = (function () {
  var _params = {};

  function _parseUrl () {
    var paramString = location.href.split('#');
    paramString = (paramString[1] ? paramString[1] : paramString[0]);
    var paramArr = paramString.split('&');
    paramArr.forEach(function (val, index, array) {
      var thisParam = val.split('=');
      _params[thisParam[0]] = (thisParam[1] ? thisParam[1] : true );
    });
  }

  function _getParam (name) {
    return (_params[name] ? _params[name] : false );
  }

  function _setParam (name, value) {
    name = encodeURIComponent(name);
    value = (typeof value === 'string' ? encodeURIComponent(value) : value);
    _params[name] = value;
    _updateURL();
  }

  function _updateURL () {
    var paramString = '';
    var prefix = '#';
    for(var prop in _params) {
      if(_params.hasOwnProperty(prop) && _params[prop] !== false) {
        paramString += prop + (_params[prop] === true ? '' : '=' + _params[prop]) + prefix;
        prefix = '&';
      }
    }
  }

  return {
    init: function () {
      _parseUrl();
    },
    getParam: function (name) {
      return _getParam(name);
    },
    setParam: function (name, value) {
      return _setParam(name, value);
    },
  }
});