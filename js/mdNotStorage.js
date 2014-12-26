/*
 * note = {
 *   index: n,
 *   title: 'A title',
 *   content: 'Some text.',
 *   directory: n
 * }
 *
 * directory: {
 *   index: n,
 *   title: 'A name',
 *   parentDirectory: n
 * }
 */

var createStorage = (function () {
  var _noteIndex = [],
  _directoryIndex = [],
  _notesTree = [
    {
      notes: [],
      parentDirectory: 0
    }
  ],
  _notePrefix = 'note_',
  _directoryPrefix = 'directory_',
  _textarea,
  _events = {};

  function _loadNotes () {
    _noteIndex = [];
    _directoryIndex = [];

    i = 0;
    while(key = localStorage.key(i)) {
      if(key.indexOf(_notePrefix) > -1) {
        var note = {};
        note = JSON.parse(localStorage.getItem(key));
        if(mdNotCrypto.isEncrypted(note.content)) {
          mdNotCrypto.decrypt(false, note.content, function (content) {
            note.content = content;
            // Untill everything is indexed also: will this work?
            note.directory = (note.directory == undefined ? 0 : note.directory);
            _noteIndex.push(note);
          });
        }
      } else if(key.indexOf(_directoryPrefix) > -1) {
        var directory = {};
        directory = JSON.parse(localStorage.getItem(key));
        directory.notes = [];
        directory.dirs = [];
        _directoryIndex.push(directory);
      }
      i++;
    }
  }

  /*
   * directory = {
   *   notes: [],
   *   index,
   *   title,
   *   parentDirectory
   * }
   */

  function _updateTree () {
    var tempDirIndex = _directoryIndex;

    // Pushing all notes to a flat array of directories
    _noteIndex.forEach(function (val, i, arr) {
      if(!_notesTree[val.directory]) {
        _notesTree[val.directory] = {
          notes: [val],
        }
      } else {
        _notesTree[val.directory].notes.push(val);
      }
    });

    // while (tempDirIndex.length > 0) {
    //   tempDirIndex.forEach(function (val, i, arr) {
    //     var result = _addDirToTree(val, _notesTree);
    //     if(result[0]) {
    //       _notesTree = result[1];
    //       tempDirIndex.splice(i, 1);
    //     }
    //   });
    // }
  }

  function _addDirToTree (addThisDir, tree) {
    var found = false;
    tree.forEach(function (val, i, arr) {
      if(i === addThisDir.parentDirectory) {
        tree[i].dirs.push(addThisDir);
        found = true;
        return false;
      } else {
        var result = _addDirToTree(addThisDir, tree[i].dirs);
        if(result[0]) {
          tree = result[1]
          found = true;
          return false;
        }
      }
    });
    return [found, tree];
  }

  function _save (content, title, index, directory) {
    index = (index == 'undefined' ? _noteIndex.length : index);
    title = (title == 'undefined' ? index : title);
    directory = (directory == 'undefined' ? 0 : directory);
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

  function _removeItem (index) {
    localStorage.removeItem(_notePrefix + index);
    _noteIndex.splice(index, 1);
  }

  function _saveToStorage (index, note) {
    mdNotCrypto.encrypt(false, note.content, function (content) {
      localStorage.setItem(_notePrefix + index, JSON.stringify({
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
      _updateTree();
      return _notesTree;
    },
    newNote: function () {
      var index = _noteIndex.length;
      _save('', index);
      return index;
    },
    deleteNote: function (index) {
      _removeItem(index)
    },
  }
});
