var createTree = (function () {
  var _notesIndex = [],
  _treeElem,
  _listElem,
  _textarea,
  _treeToggleClass ='mdnot_tree--open',
  _leafTemplate = document.createElement('li'),
  _state = false;

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
    window.addEventListener('hashchange', function () {
      _toggleTree();
    }, false);
  }

  function _toggleTree () {
    if(mdNotParamHandler.getParam('tree') !== _state) {
      if(mdNotParamHandler.getParam('tree')) {
        _treeElem.className += ' ' + _treeToggleClass;
      } else {
        _treeElem.className = _treeElem.className.replace(' ' + _treeToggleClass, '');
      }
      _state = mdNotParamHandler.getParam('tree');
    }
  }

  return {
    init: function () {
      _treeElem = document.querySelector('.mdnot_tree');
      _listElem = document.querySelector('.mdnot_tree__list');
      _textarea = document.querySelector('.markdown__textarea');
      _setEventListeners();
      _updateTree();
      _toggleTree();
    },
    toggleTree: function () {
      _toggleTree();
    }
  }
});