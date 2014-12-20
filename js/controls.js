window.addEventListener('load', function () {
  var controls = createControls();
  controls.init();
}, false);

var createControls = (function () {
  var _events = {},
  _textarea,
  _controlKey = false,
  _keyListener = {
    'S': function () {
      _textarea.dispatchEvent(_events.save);
    },
  },
  _numberKeys = ['0','1','2','3','4','5','6','7','8','9'];

  function _createSaveEvent () {
    _events.save = new CustomEvent('save');
  }

  function _setKeyListener () {
    _textarea.addEventListener('keydown', function (e) {
      var charCode = e.which || e.keyCode;
      var key = String.fromCharCode(charCode);
      if((e.key || e.keyIdentifier) === 'Control') {
        _controlKey = true;
      } else if(_controlKey) {
        if(_keyListener[key]) {
          e.preventDefault();
          _keyListener[key]();
        } else if ( _numberKeys.indexOf(key) > -1 ) {
          storage.loadItem(parseInt(key));
        }
      }
    }, false);

    _textarea.addEventListener('keyup', function (e) {
      if((e.key || e.keyIdentifier) === 'Control') {
        _controlKey = false;
      }
    }, false);
  }

  return {
    init: function () {
      _textarea = document.querySelector('.markdown__textarea');
      _createSaveEvent();
      _setKeyListener();
    }
  }
});