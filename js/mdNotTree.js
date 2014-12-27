var createTree = (function () {
  var _notesIndex = [],
  _treeElem,
  _listElem,
  _textarea,
  _treeToggleClass ='mdnot_tree--open',
  _leafTemplate = document.createElement('li'),
  _state = false,
  _directoryLeafTemplate,
  _directoryLeafIdPrefix = 'mdnot_tree__leaf--directory--',
  _dirLinkTemplate;

  _leafTemplate.className = 'mdnot_tree__leaf';

  _directoryLeafTemplate = _leafTemplate.cloneNode();
  _directoryLeafTemplate.className += 'mdnot_tree__leaf--directory';

  _dirLinkTemplate = document.createElement('a');
  _dirLinkTemplate.className = 'mdnot_tree__link';
  _directoryLeafTemplate.appendChild(_dirLinkTemplate);

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
    _listElem.id = _directoryLeafIdPrefix + 'r';
    for (var i = 0; _notesTree.length > 0; i++) {
      if(_notesTree[i]) {
        var parentDir = document.getElementById(_directoryLeafIdPrefix + _notesTree[i].parentDirectory);
        if(parentDir) {
          var thisListElem = _directoryLeafTemplate.cloneNode(true);
          thisListElem.id = _directoryLeafIdPrefix + i;
          thisListElem.children[0].innerHTML = _notesTree[i].title ? '<p>' + _notesTree[i].title + '</p>' : '';
          _createLeafs(_notesTree[i].notes, thisListElem.children[1]);
          parentDir.appendChild(thisListElem);
          _notesTree.splice(i, 1);
       }
      }
      if(i > _notesTree.length - 2) {
        i = 0;
      }
      break;
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
      _toggleTree(mdNotParamHandler.getParam('tree'));
    }, false);
  }

  function _toggleTree (newState) {
    if(newState !== _state) {
      if(newState) {
        _treeElem.className += ' ' + _treeToggleClass;
      } else {
        _treeElem.className = _treeElem.className.replace(' ' + _treeToggleClass, '');
      }
      _state = newState;
    }
  }

  return {
    /*
     * This creates a list of notes in .mdnot_tree
     *
     * @uses .mdnot_tree
     * @uses .mdnot_tree__list
     * @uses .markdown__textarea
     * @uses storage.getIndex();
     * @uses mdNotParamHandler.getParam()
     */
    init: function () {
      _treeElem = document.querySelector('.mdnot_tree');
      _listElem = document.querySelector('.mdnot_tree__list');
      _textarea = document.querySelector('.markdown__textarea');
      _setEventListeners();
      _createTree();
      _toggleTree(mdNotParamHandler.getParam('tree'));
    },
    toggleTree: function (newState) {
      newState = newState || mdNotParamHandler.getParam('tree');
      _toggleTree(newState);
    }
  }
});