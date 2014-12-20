window.addEventListener('load', function () {
  storage.init();
}, false);

var createStorage = (function () {
  var _noteIndex = [],
  _storagePrefix = 'note_',
  _textarea;

  function _loadNotes (callback) {
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
    callback();
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
      document.title = index;
    }
  }

  return {
    init: function () {
      _textarea = document.querySelector('.markdown__textarea');
      _loadNotes(storage.loadItem);
      _setEventListeners();
    },
    loadItem: function (index) {
      _loadItem(index);
    }
  }
});

var storage = createStorage();
