window.addEventListener('load', function () {
  storage.init();
  controls.init();
  mdNotTree.init();
  markElem.init(controls.getTextarea(), controls.getCover());
  controls.getTextarea().focus();
  controls.initEditor();
}, false);

var createControls = (function () {
  var _events = {},
  _textarea,
  _cover,
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
      var newIndex = storage.newNote();
      console.log(newIndex);
      _openNote(newIndex);
    },
    'H': function () {
      _toggleHelp();
    },
    'D': function () {
      _commandLine.value = 'delete: ';
      _commandLine.focus();
    },
    'V': function () {
      _toggleViewMode();
    }
  },
  _numberKeys = ['0','1','2','3','4','5','6','7','8','9'],
  _commands = {
    'title': function (title) {
      // Renames the note and saves it
      _textarea.attributes.title = title;
      _textarea.dispatchEvent(_events.save);
    },
    'delete': function (index) {
      _delete(parseInt(index));
    }
  },
  _helpToggleClass = 'markdown__help--open',
  _helpElem,
  _currentNode = 0.
  _areaInactiveToggleClass = 'markdown__textarea--disabled',
  _coverViewToggleClass = 'markdown__cover--view';

  function _createEvents () {
    _events.save = new CustomEvent('save');
    _events.delete = new CustomEvent('delete');
    _events.open = new CustomEvent('open');
  }

  function _setKeyListener () {
    document.addEventListener('keydown', function (e) {
      var charCode = e.which || e.keyCode;
      var key = String.fromCharCode(charCode).toUpperCase();
      if((e.key || e.keyIdentifier) === 'Control') {
        _controlKey = true;
      } else if(_controlKey) {
        if(_keyListener[key]) {
          e.preventDefault();
          _keyListener[key]();
        } else if ( _numberKeys.indexOf(key) > -1 ) {
          mdNotParamHandler.setParam('note', key);
        }
      }
    }, false);

    document.addEventListener('keyup', function (e) {
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
          _textarea.focus();
        } else {
          console.log('No such command');
        }
      }
    }, false);

    window.addEventListener('hashchange', function () {
      _loadActiveNote();
    }, false);
  }

  function _loadActiveNote (viewToggle) {
    index = mdNotParamHandler.getParam('note');
    storage.loadItem(index);
    _currentNode = index;
    if(viewToggle) {
      _toggleViewMode();
    }
    _textarea.dispatchEvent(_events.open);
  }

  function _toggleHelp () {
    if(_helpElem.className.indexOf(' ' + _helpToggleClass) > -1) {
      _helpElem.className = _helpElem.className.replace(' ' + _helpToggleClass, '');
    } else {
      _helpElem.className += ' ' + _helpToggleClass;
    }
  }

  function _openNote(index, viewToggle) {
    mdNotParamHandler.setParam('note', index);
    if(viewToggle) {
      _toggleViewMode();
    }
  }

  function _delete (index) {
    if(index === _currentNode) {
      storage.deleteNote(index);
      _openNote(0);
      _textarea.dispatchEvent(_events.delete);
    } else {
      console.log('You are curerently not on Note nr.' + index);
    }
  }

  function _toggleViewMode () {
    if(markElem.toggleViewMode()) {
      _textarea.className += ' ' + _areaInactiveToggleClass;
      _cover.className += ' ' + _coverViewToggleClass;
      mdNotParamHandler.setParam('view', true);
    } else {
      _cover.className = _cover.className.replace(' ' + _coverViewToggleClass, '');
      _textarea.className = _textarea.className.replace(' ' + _areaInactiveToggleClass, '');
      mdNotParamHandler.setParam('view', false);
    }
  }


  return {
    init: function (callback) {
      _textarea = document.querySelector('.markdown__textarea');
      _commandLine = document.querySelector('.markdown__command_line');
      _cover = document.querySelector('.markdown__cover');
      _helpElem = document.querySelector('.markdown__help');
    },
    initEditor: function () {
      _createEvents();
      _setKeyListener();
      // Check if a note is opened and if not open note 0
      var viewToggle = (mdNotParamHandler.getParam('view') ? true : false)
      if(mdNotParamHandler.getParam('note') === false) {
        _openNote(0, viewToggle);
      } else {
        _loadActiveNote(viewToggle);
      }
    },
    triggerAction: function (letter) {
      _keyListener[letter]();
    },
    getTextarea: function () {
      return _textarea;
    },
    getCover: function () {
      return _cover;
    },
  }
});

var storage = createStorage();
var mdNotTree = createTree();
var controls = createControls();
var markElem = createMarkElement();
