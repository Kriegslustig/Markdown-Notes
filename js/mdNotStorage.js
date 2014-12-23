var createStorage = (function () {
  var _noteIndex = [],
  _storagePrefix = 'note_',
  _textarea,
  _events = {};

  function _loadNotes () {
    _noteIndex = [];
    var found = true,
    i = 0;

    while(key = localStorage.key(i)) {
      var note = false;
      if(key.indexOf(_storagePrefix) > -1) {
        note = JSON.parse(localStorage.getItem(key));
        if(mdNotCrypto.isEncrypted(note.content)) {
          mdNotCrypto.decrypt(false, note.content, function (content) {
            note.content = content;
            _noteIndex.push(note);
          });
        } else {
          _noteIndex.push(note);
        }
      }
      i++;
    }
  }

  function _save (content, title, index) {
    index = (index === 'undefined' ? _noteIndex.length : index);
    title = (title === 'undefined' ? index : title);
    var note = {
      index: index,
      title: title,
      content: content,
    };
    _noteIndex[index] = note;
    _loadItem(index);
    _saveToStorage(index, note);
  }

  function _setEventListeners () {
    _textarea.addEventListener('save', function () {
      _save(_textarea.value, _textarea.attributes.title, _textarea.id);
    }, false);

    _events.change = new CustomEvent('change');
    _events.unchanged = new CustomEvent('unchanged');
    document.addEventListener('keyup', function () {
      if(!_checkForUnsavedChanges()){
        _textarea.dispatchEvent(_events.change);
      } else {
        _textarea.dispatchEvent(_events.unchanged);
      }
    }, false);
  }

  function _loadItem (index) {
    index = (index === undefined ? 1 : index);
    if(_noteIndex[index]) {
      document.title = _noteIndex[index].title;
      _textarea.id = _noteIndex[index].index;
      _textarea.attributes.title = _noteIndex[index].title;
      _textarea.value = _noteIndex[index].content;
    } else {
      _save('', index, index);
    }
  }

  function _updateIndex () {
    for (var i = 0; i < _noteIndex.length; i++) {
      var currentIndex = _noteIndex[i].index;
      localStorage.removeItem(_storagePrefix + currentIndex);
      _noteIndex[i].index = i;
      _saveToStorage(i, _noteIndex[i])
    };
    _loadNotes();
  }

  function _removeItem (index) {
    localStorage.removeItem(_storagePrefix + index);
    _noteIndex.splice(index, 1);
  }

  function _saveToStorage (index, note) {
    mdNotCrypto.encrypt(false, note.content, function (content) {
      localStorage.setItem(_storagePrefix + index, JSON.stringify({
        index: note.index,
        title: note.title,
        content: content,
      }));
    });
  }

  function _checkForUnsavedChanges () {
    var index = _textarea.id;
    if(_noteIndex[index].index !== index ||
      _noteIndex[index].title !== _textarea.attributes.title ||
      _noteIndex[index].content !== _textarea.value) {
      return false;
    }
    return true;
  };

  return {
    init: function () {
      _textarea = document.querySelector('.markdown__textarea');
      _setEventListeners();
      _loadNotes();
    },
    loadItem: function (index) {
      _loadItem(index);
    },
    getIndex: function () {
      return _noteIndex;
    },
    newNote: function () {
      var index = _noteIndex.length;
      _save('', index, index);
      return index;
    },
    deleteNote: function (index) {
      _removeItem(index)
      _updateIndex();
    },
  }
});
