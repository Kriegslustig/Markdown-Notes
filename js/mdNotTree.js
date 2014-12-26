var createTree = (function () {
  var _notesIndex = [],
  _treeElem,
  _listElem,
  _textarea,
  _treeToggleClass ='mdnot_tree--open',
  _leafTemplate = document.createElement('li'),
  _state = false,
  _directoryLeafTemplate,
  _directoryLeafIdPrefix = 'mdnot_tree__leaf--directory--';

  _leafTemplate.className = 'mdnot_tree__leaf';

  _directoryLeafTemplate = _leafTemplate.cloneNode();
  _directoryLeafTemplate.className += 'mdnot_tree__leaf--directory';
  _directoryLeafTemplate.appendChild(document.createElement('ul'));

  function _createLeafs (notesArr, elem) {
    notesArr.forEach(function (val, index, array) {
      var _thisLeaf = _leafTemplate.cloneNode();
      _thisLeaf.innerHTML = '<a class="mdnot_tree__link" href="#note='+ val.index +'"><p>' + val.index + ': ' + val.title + '</p></a>';
      elem.appendChild(_thisLeaf);
    });
  }

  function _createTree () {
    _listElem.innerHTML = '';
    _notesTree = storage.getIndex();
    _listElem.id = _directoryLeafIdPrefix + 0;
    for (var i = 0; _notesTree.length > 0; i++) {
      if(_notesTree[i]) {
        var parentDir = document.getElementById(_directoryLeafIdPrefix + _notesTree[i].parentDirectory)
        if(parentDir) {
          var thisListElem = _directoryLeafTemplate.cloneNode(true);
          _directoryLeafTemplate.id = _directoryLeafIdPrefix + i;
          console.log(thisListElem);
          _createLeafs(_notesTree[i].notes, thisListElem.children[0]);
          parentDir.appendChild(thisListElem);
          _notesTree.splice(i, 1);
       }
      }
      if(i > _notesTree.length - 2) {
        i = 0;
      }
    };
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
      _createTree();
      _toggleTree();
    },
    toggleTree: function () {
      _toggleTree();
    }
  }
});