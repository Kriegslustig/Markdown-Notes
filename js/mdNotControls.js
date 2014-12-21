window.addEventListener('load', function () {
  storage.init();
  controls.init();
  mdNotTree.init();
}, false);

var createControls = (function () {
  var _events = {},
  _textarea,
  _controlKey = false,
  _keyListener = {
    'S': function () {
      // Save the note
      _textarea.dispatchEvent(_events.save);
    },
    'R': function () {
      _commandLine.value = 'title: ';
      _commandLine.focus();
    },
    'T': function () {
      mdNotTree.toggleTree();
    },
    'N': function () {
      storage.newNote();
    }
  },
  _numberKeys = ['0','1','2','3','4','5','6','7','8','9'],
  _commands = {
    'title': function (title) {
      // Renames the note and saves it
      _textarea.attributes.title = title;
      _textarea.dispatchEvent(_events.save);
    }
  };

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
          location.href = location.href.split('#')[0] + '#note=' + key;
        }
      }
    }, false);

    _textarea.addEventListener('keyup', function (e) {
      if((e.key || e.keyIdentifier) === 'Control') {
        _controlKey = false;
      }
    }, false);

    _commandLine.addEventListener('keydown', function (e) {
      if((e.key || e.keyIdentifier) === 'Enter') {
        var input = _commandLine.value.split(': ');
        _commandLine.value = '';
        if(_commands[input[0]]) {
          _commands[input[0]](input[1]);
        } else {
          console.log('No such command');
        }
      }
    }, false);

    window.addEventListener('hashchange', function () {
      key = location.href.split('#note=')[1];
      storage.loadItem(parseInt(key));
    }, false);
  }

  return {
    init: function (callback) {
      _textarea = document.querySelector('.markdown__textarea');
      _commandLine = document.querySelector('.markdown__command_line');
      _createSaveEvent();
      _setKeyListener();
      location.href = location.href.split('#')[0] + '#note=0';
    }
  }
});

var storage = createStorage();
var mdNotTree = createTree();
var controls = createControls();
