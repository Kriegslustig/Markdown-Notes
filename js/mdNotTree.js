var createTree = (function () {
  var _notesIndex = [],
  _treeElem,
  _listElem,
  _textarea,
  _treeToggleClass ='mdnot_tree--open',
  _leafTemplate = document.createElement('li');

  _leafTemplate.className = 'mdnot_tree__leaf';

  function _updateTree () {
    _notesIndex = storage.getIndex();
    _listElem.innerHTML = '';
    _notesIndex.forEach(function (val, index, array) {
      var _thisLeaf = _leafTemplate.cloneNode();
      _thisLeaf.innerHTML = '<a class="mdnot_tree__link" href="#note='+ val.index +'"><p>' + val.index + ': ' + val.title + '</p></a>';
      _listElem.appendChild(_thisLeaf);
    });
  }

  function _setEventListeners () {
    _textarea.addEventListener('save', function () {
      _updateTree();
    }, false);
    _textarea.addEventListener('delete', function () {
      _updateTree();
    }, false);
  }

  function _toggleTree () {
    if(_treeElem.className.indexOf(' ' + _treeToggleClass) > -1) {
      _treeElem.className = _treeElem.className.replace(' ' + _treeToggleClass, '');
    } else {
      _treeElem.className += ' ' + _treeToggleClass;
    }
  }

  return {
    init: function () {
      _treeElem = document.querySelector('.mdnot_tree');
      _listElem = document.querySelector('.mdnot_tree__list');
      _textarea = document.querySelector('.markdown__textarea');
      _setEventListeners();
      _updateTree();
    },
    toggleTree: function () {
      _toggleTree();
    }
  }
});