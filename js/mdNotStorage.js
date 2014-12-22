var createStorage = (function () {
  var _noteIndex = [],
  _storagePrefix = 'note_',
  _textarea;

  function _loadNotes () {
    _noteIndex = [];
    var found = true,
    i = 0;
    while(found) {
      var note = false;
      if(note = localStorage.getItem(_storagePrefix + i)) {
        i++;
        _noteIndex.push(JSON.parse(note));
      } else {
        break;
      }
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
    localStorage.setItem(_storagePrefix + index, JSON.stringify(note));
    _loadItem(index);
  }

  function _setEventListeners () {
    _textarea.addEventListener('save', function () {
      _save(_textarea.value, _textarea.attributes.title, _textarea.id);
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
      localStorage.setItem(_storagePrefix + i, JSON.stringify(_noteIndex[i]));
    };
    _loadNotes();
  }

  function _removeItem (index) {
    localStorage.removeItem(_storagePrefix + index);
    _noteIndex.splice(index, 1);
}

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
    }
  }
});
